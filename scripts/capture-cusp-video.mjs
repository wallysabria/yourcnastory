import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3102'],
  { stdio: 'ignore', windowsHide: true },
);
let browser;
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
  fs.mkdirSync('docs/audit/screenshots/cusp-video', { recursive: true });
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const p = await context.newPage();
    await p.route('**/*', (r) =>
      /youtube\.com|ytimg\.com/.test(r.request().url()) ? r.abort() : r.continue(),
    );
    await p.goto('http://127.0.0.1:3102/cusp-upskilling/');
    const decline = p.getByRole('button', { name: 'Decline all optional tools', exact: true });
    await decline.waitFor();
    await decline.click();
    const block = p.locator('.elementor-element-f95e626');
    await block.scrollIntoViewIfNeeded();
    await block.locator('img').evaluate((i) => i.decode());
    await block.screenshot({ path: `docs/audit/screenshots/cusp-video/block-${width}.png` });
    await block.getByRole('button', { name: 'Play video', exact: true }).click();
    await p.screenshot({ path: `docs/audit/screenshots/cusp-video/dialog-${width}.png` });
    await context.close();
  }
  console.log('Captured desktop/mobile video block and lightbox; provider frame mocked.');
} finally {
  await browser?.close();
  server.kill();
}
