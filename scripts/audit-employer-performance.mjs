import fs from 'node:fs';
import { spawn } from 'node:child_process';
import lighthouse from 'lighthouse';
import * as launcher from 'chrome-launcher';
import { chromium } from '@playwright/test';
const release = JSON.parse(fs.readFileSync('content/routing/employer-release.json'));
const origin = 'http://127.0.0.1:3103';
const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3103'],
  { windowsHide: true, stdio: 'ignore' },
);
let chrome;
const rows = [];
try {
  for (let i = 0; i < 100; i++) {
    try {
      await fetch(origin);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  chrome = await launcher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
  });
  for (const path of process.argv[2] ? [process.argv[2]] : release.approved) {
    const result = await lighthouse(origin + path, {
      port: chrome.port,
      logLevel: 'error',
      onlyCategories: ['performance'],
    });
    fs.mkdirSync('_source/phase-08/lighthouse', { recursive: true });
    fs.writeFileSync(
      '_source/phase-08/lighthouse/' + path.split('/')[1] + '.json',
      JSON.stringify(result.lhr),
    );
    const a = result.lhr.audits;
    rows.push({
      path,
      performance: result.lhr.categories.performance.score,
      lcpMs: a['largest-contentful-paint'].numericValue,
      cls: a['cumulative-layout-shift'].numericValue,
      tbtMs: a['total-blocking-time'].numericValue,
      mode: 'local mobile lab, one run; not field Core Web Vitals',
    });
    console.log(JSON.stringify(rows.at(-1)));
  }
  fs.writeFileSync('docs/reports/phase-08-performance.json', JSON.stringify(rows, null, 2) + '\n');
} finally {
  await chrome?.kill();
  server.kill();
}
