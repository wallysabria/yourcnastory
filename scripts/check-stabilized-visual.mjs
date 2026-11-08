import fs from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';
const entries = JSON.parse(fs.readFileSync('docs/audit/screenshots-index.json'));
const paths = new Set(JSON.parse(fs.readFileSync('content/pages/index.json')).map((r) => r.path));
const jobs = entries.filter((e) => paths.has(new URL(e.url).pathname));
const dir = '_source/phase-04/stabilized';
fs.mkdirSync(dir, { recursive: true });
let cursor = 0;
const results = [];
const browser = await chromium.launch();
async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content:
      '*,*::before,*::after{animation:none!important;transition:none!important} [id*="mxchat"],[class*="mxchat"]{visibility:hidden!important}',
  });
  for (
    let y = 0;
    y < (await page.evaluate(() => document.documentElement.scrollHeight));
    y += 900
  ) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(250);
  await page.evaluate(() => {
    document.querySelectorAll('video').forEach((v) => v.pause());
    if (window.jQuery) {
      window.jQuery('.owl-carousel').trigger('stop.owl.autoplay');
      window.jQuery('.owl-carousel').trigger('to.owl.carousel', [0, 0]);
    }
    document
      .querySelectorAll('.native-carousel .owl-stage')
      .forEach((e) => e.scrollTo({ left: 0, behavior: 'instant' }));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(100);
}
async function worker() {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.route('**/*', (r) =>
    /youtube.com|play.vidyard.com|googletagmanager|google-analytics|clarity.ms|doubleclick|facebook|mxchat|list-manage/.test(
      r.request().url(),
    )
      ? r.abort()
      : r.continue(),
  );
  const page = await context.newPage();
  while (cursor < jobs.length) {
    const job = jobs[cursor++];
    const path = new URL(job.url).pathname;
    await page.setViewportSize({ width: job.width, height: job.height });
    const data = { path, width: job.width };
    for (const [kind, origin] of [
      ['source', 'https://yourcnastory.org'],
      ['native', 'http://127.0.0.1:3101'],
    ]) {
      await page.goto(origin + path, { waitUntil: 'load', timeout: 45000 });
      await settle(page);
      const file = dir + '/' + kind + '-' + job.file.replace('.jpg', '.png');
      await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
      data[kind] = {
        file,
        geometry: await page
          .locator('#main')
          .evaluate((e) => ({
            height: e.getBoundingClientRect().height,
            width: e.getBoundingClientRect().width,
          })),
        headings: await page.locator('#main h1,#main h2').evaluateAll((es) =>
          es
            .filter((e) => e.getBoundingClientRect().height)
            .slice(0, 4)
            .map((e) => ({
              text: e.textContent.trim(),
              top: e.getBoundingClientRect().top,
              height: e.getBoundingClientRect().height,
            })),
        ),
      };
    }
    const a = await sharp(data.source.file).metadata(),
      b = await sharp(data.native.file).metadata();
    const width = Math.max(a.width, b.width),
      height = Math.max(a.height, b.height);
    const raster = (f, m) =>
      sharp(f)
        .ensureAlpha()
        .extend({ right: width - m.width, bottom: height - m.height, background: '#fff' })
        .raw()
        .toBuffer();
    const [left, right] = await Promise.all([
      raster(data.source.file, a),
      raster(data.native.file, b),
    ]);
    data.ratio =
      pixelmatch(left, right, null, width, height, { threshold: 0.1 }) / (width * height);
    data.heightDelta = b.height - a.height;
    results.push(data);
    if (results.length % 12 === 0) console.log('stable', results.length + '/' + jobs.length);
  }
  await context.close();
}
try {
  await Promise.all([worker(), worker()]);
} finally {
  await browser.close();
}
fs.writeFileSync(
  'docs/reports/phase-04-stabilized-visual.json',
  JSON.stringify(
    {
      method:
        'Supplemental current public source vs native. Same reduced-motion browser, fonts ready, full scroll to load images, carousels reset to first slide and stopped; video paused, retired chatbot hidden, external video frames blocked. No source form submissions. Original Phase 1 comparisons remain separately reported.',
      checks: results,
    },
    null,
    2,
  ) + '\n',
);
console.log('done', results.length);
