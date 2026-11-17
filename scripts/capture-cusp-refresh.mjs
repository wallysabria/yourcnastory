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
  fs.mkdirSync('docs/audit/screenshots/cusp-refresh', { recursive: true });
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: 'reduce',
    });
    const p = await context.newPage();
    await p.goto('http://127.0.0.1:3102/cusp-upskilling/');
    const decline = p.getByRole('button', { name: 'Decline all optional tools', exact: true });
    await decline.waitFor();
    await decline.click();
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      scrollTo(0, 0);
      await document.fonts.ready;
      await Promise.race([
        Promise.all([...document.images].map((i) => i.decode().catch(() => {}))),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
    });
    const result = await new AxeBuilder({ page: p }).include('#main').analyze();
    await p.screenshot({
      path: `docs/audit/screenshots/cusp-refresh/cusp-${width}.png`,
      fullPage: true,
    });
    rows.push({
      width,
      overflow: await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      levelCards: await p.locator('.cusp-level-card').count(),
      violations: result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({ target: n.target, html: n.html, summary: n.failureSummary })),
      })),
    });
    await context.close();
  }
  fs.writeFileSync('docs/reports/cusp-refresh-checks.json', JSON.stringify(rows, null, 2) + '\n');
  console.log(JSON.stringify(rows));
} finally {
  await browser?.close();
  server.kill();
}
