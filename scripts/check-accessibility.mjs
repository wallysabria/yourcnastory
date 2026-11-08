import fs from 'node:fs';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json')).filter(
  (r) => r.section !== 'employers',
);
const browser = await chromium.launch();
const checks = [];
const phase5 = process.argv.includes('--phase5');
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : 1000 },
      reducedMotion: 'reduce',
    });
    await context.route(/youtube.com|play.vidyard.com/, (r) => r.abort());
    const page = await context.newPage();
    for (const route of routes) {
      if (phase5 && page.url().startsWith('http')) await page.evaluate(() => localStorage.removeItem('ycna_privacy_v1'));
      await page.goto('http://127.0.0.1:3101' + route.path, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      const choice = phase5 ? 'no-choice' : 'not-audited';
      checks.push({
        choice,
        path: route.path,
        width,
        overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        violations: result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
        })),
      });
      if (phase5) {
        await page.locator('.privacy-banner .privacy-action').nth(1).click();
        const declined = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
        checks.push({path:route.path,width,choice:'declined',overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),violations:declined.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
      }
    }
    await context.close();
    console.log('checked', width);
  }
} finally {
  await browser.close();
}
fs.writeFileSync(
  phase5 ? 'docs/reports/phase-05-accessibility.json' : 'docs/reports/phase-04-accessibility.json',
  JSON.stringify(
    {
      ownerDecision:
        'D-004 declined: preserve source contrast/link styling and flag failures. Automated scan is not WCAG certification.',
      checks,
    },
    null,
    2,
  ) + '\n',
);
const failures = checks.filter((r) => r.violations.length);
console.log(
  JSON.stringify({
    checks: checks.length,
    zeroViolation: checks.length - failures.length,
    failures: failures.map((r) => ({
      path: r.path,
      width: r.width,
      rules: r.violations.map((v) => v.id),
    })),
    overflow: checks.filter((r) => r.overflow).map((r) => ({ path: r.path, width: r.width })),
  }),
);
if (
  failures.some((r) =>
    r.violations.some((v) => !['color-contrast', 'link-in-text-block'].includes(v.id)),
  )
)
  process.exitCode = 1;
