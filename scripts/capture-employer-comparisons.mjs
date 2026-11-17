import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
const release = JSON.parse(fs.readFileSync('content/routing/employer-release.json'));
const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3102'],
  { windowsHide: true, stdio: 'ignore' },
);
let browser;
const checks = [];
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
  fs.mkdirSync('docs/audit/screenshots/phase-08', { recursive: true });
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    await context.route('**/*', (route) =>
      /forms\.office\.com|player\.vimeo\.com|googletagmanager|google-analytics|clarity\.ms|doubleclick|list-manage|mxchat/.test(
        route.request().url(),
      )
        ? route.abort()
        : route.continue(),
    );
    for (const path of process.env.EMPLOYER_PATHS
      ? JSON.parse(process.env.EMPLOYER_PATHS)
      : release.approved) {
      const row = { path, width };
      for (const target of ['source', 'local']) {
        const page = await context.newPage();
        const response = await page.goto(
          (target === 'source' ? 'https://yourcnastory.org' : 'http://127.0.0.1:3102') + path,
          { waitUntil: 'load', timeout: 45000 },
        );
        if (target === 'local') {
          const decline = page.getByRole('button', {
            name: 'Decline all optional tools',
            exact: true,
          });
          try {
            await decline.waitFor({ state: 'visible', timeout: 3000 });
            await decline.click();
          } catch {}
        }
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 700) {
            scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 40));
          }
          scrollTo(0, 0);
          await document.fonts.ready;
          await Promise.race([
            Promise.all([...document.images].map((i) => i.decode().catch(() => {}))),
            new Promise((resolve) => setTimeout(resolve, 2000)),
          ]);
        });
        await page.screenshot({
          path: `docs/audit/screenshots/phase-08/${path.split('/')[1]}-${width}-${target}.png`,
          fullPage: true,
        });
        row[target] = {
          status: response.status(),
          ...(await page.evaluate(() => ({
            h1: document.querySelector('h1')?.textContent,
            scrollWidth: document.documentElement.scrollWidth,
            height: document.body.scrollHeight,
          }))),
        };
        await page.close();
      }
      checks.push(row);
    }
    await context.close();
  }
  fs.writeFileSync(
    process.env.EMPLOYER_VISUAL_REPORT || 'docs/reports/phase-08-visual-checks.json',
    JSON.stringify(checks, null, 2) + '\n',
  );
  console.log({ screenshots: checks.length * 2, checks: checks.length });
} finally {
  await browser?.close();
  server.kill();
}
