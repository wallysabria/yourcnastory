import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3102'],
  { stdio: 'ignore', windowsHide: true },
);
let browser;
const rows = [];
try {
  for (let i = 0; i < 100; i++) {
    try {
      await fetch('http://127.0.0.1:3102');
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  browser = await chromium.launch();
  fs.mkdirSync('docs/audit/screenshots/awards-refresh', { recursive: true });
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: 'reduce',
    });
    const p = await context.newPage();
    await p.goto('http://127.0.0.1:3102/cnap-awards/');
    const decline = p.getByRole('button', { name: 'Decline all optional tools', exact: true });
    await decline.waitFor();
    await decline.click();
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 800) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      scrollTo(0, 0);
      await document.fonts.ready;
    });
    await p.screenshot({
      path: `docs/audit/screenshots/awards-refresh/awards-${width}.png`,
      fullPage: true,
    });
    await p.locator('.awards-jump').scrollIntoViewIfNeeded();
    await p.screenshot({ path: `docs/audit/screenshots/awards-refresh/navigation-${width}.png` });
    const audit = await new AxeBuilder({ page: p }).include('#main').analyze();
    rows.push({
      width,
      nav: await p.locator('.awards-jump').count(),
      cards: await p.locator('[data-award-card]').count(),
      scope: await p.locator('.awards-scope').count(),
      overflow: await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      violations: audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    });
    await context.close();
  }
  fs.writeFileSync('docs/reports/awards-refresh-checks.json', JSON.stringify(rows, null, 2) + '\n');
  console.log(JSON.stringify(rows));
} finally {
  await browser?.close();
  server.kill();
}
