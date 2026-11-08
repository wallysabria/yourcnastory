import fs from 'node:fs';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
const phase = process.argv[2] || 'baseline';
const all = JSON.parse(fs.readFileSync('content/routing/slug-map.json')).filter(
  (r) => r.section !== 'employers',
);
const cases = [...new Set(all.map((r) => r.template))].flatMap((template) =>
  ['en', 'es'].map((locale) => all.find((r) => r.template === template && r.locale === locale)),
);
const origins =
  phase === 'baseline'
    ? [
        ['source', 'https://yourcnastory.org'],
        ['native-before', 'https://yourcnastory.vercel.app'],
      ]
    : [['native-after', process.env.PERF_ORIGIN || 'http://127.0.0.1:3101']];
const file = '_source/phase-05/performance-' + phase + '.json';
const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : { runs: [] };
const flags = {
  logLevel: 'silent',
  onlyCategories: ['performance'],
  formFactor: 'mobile',
  screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false },
  maxWaitForLoad: 15000,
  pauseAfterFcpMs: 1000,
  pauseAfterLoadMs: 1000,
  networkQuietThresholdMs: 1000,
  cpuQuietThresholdMs: 1000,
  disableFullPageScreenshot: true,
  skipAudits: ['screenshot-thumbnails', 'final-screenshot', 'full-page-screenshot'],
};
const runs = existing.runs;
const total = cases.length * origins.length * 3;
for (const route of cases)
  for (const [kind, origin] of origins)
    for (let repeat = 1; repeat <= 3; repeat++) {
      const key = kind + route.path + repeat;
      if (runs.some((r) => r.key === key && r.status === 'ok')) continue;
      const chrome = await launch({
        chromePath: chromium.executablePath(),
        chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      });
      try {
        const result = await lighthouse(origin + route.path, { ...flags, port: chrome.port });
        const lhr = result.lhr;
        const metrics = {};
        for (const id of [
          'largest-contentful-paint',
          'cumulative-layout-shift',
          'total-blocking-time',
          'first-contentful-paint',
          'speed-index',
          'interactive',
          'total-byte-weight',
          'unused-css-rules',
          'unused-javascript',
        ]) {
          const a = lhr.audits[id];
          if (a) metrics[id] = { value: a.numericValue, score: a.score, display: a.displayValue };
        }
        const resources = (lhr.audits['network-requests']?.details?.items || [])
          .map((item) => {
            try {
              const u = new URL(item.url);
              return {
                host: u.hostname,
                path: u.pathname,
                type: item.resourceType,
                bytes: item.transferSize,
              };
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        const row = {
          key,
          kind,
          origin,
          path: route.path,
          locale: route.locale,
          template: route.template,
          repeat,
          status: lhr.runtimeError ? 'error' : 'ok',
          error: lhr.runtimeError?.code,
          performance: lhr.categories.performance.score,
          metrics,
          resources,
          warnings: lhr.runWarnings,
          checkedAt: new Date().toISOString(),
        };
        const old = runs.findIndex((r) => r.key === key);
        if (old >= 0) runs[old] = row;
        else runs.push(row);
      } catch (error) {
        runs.push({
          key,
          kind,
          path: route.path,
          repeat,
          status: 'error',
          error: error.code || error.name,
        });
      } finally {
        await chrome.kill();
      }
      fs.writeFileSync(
        file,
        JSON.stringify(
          {
            phase,
            lighthouse: '13.6.0',
            method:
              'Serial cold fresh Chrome profiles; mobile simulated throttling, 390x844, three runs per locale/template/origin. Audit navigation bounded at 15s; timeout warnings retained. No lead forms submitted. No network query strings/payloads or trace retained.',
            flags,
            runs,
          },
          null,
          2,
        ) + '\n',
      );
      console.log({
        phase,
        completed: runs.filter((r) => r.status === 'ok').length,
        total,
        last: key,
      });
    }
fs.writeFileSync('docs/reports/phase-05-performance-' + phase + '.json', fs.readFileSync(file));
