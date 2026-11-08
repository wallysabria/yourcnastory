import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';
const references = JSON.parse(fs.readFileSync('docs/audit/screenshots-index.json'));
const routes = new Set(JSON.parse(fs.readFileSync('content/pages/index.json')).map((r) => r.path));
const jobs = references.filter((r) => routes.has(new URL(r.url).pathname));
const directory = '_source/phase-04/visual';
fs.mkdirSync(directory, { recursive: true });
const browser = await chromium.launch();
let cursor = 0;
const results = [];
async function worker() {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.route(/youtube.com|play.vidyard.com/, (r) => r.abort());
  const page = await context.newPage();
  while (cursor < jobs.length) {
    const reference = jobs[cursor++];
    const pathname = new URL(reference.url).pathname;
    await page.setViewportSize({ width: reference.width, height: reference.height });
    await page.goto('http://127.0.0.1:3101' + pathname, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const file = reference.file.replace('.jpg', '.png');
    await page.screenshot({
      path: path.join(directory, file),
      fullPage: true,
      animations: 'disabled',
    });
    const original = path.join('docs/audit/screenshots', reference.file);
    const native = path.join(directory, file);
    const a = await sharp(original).metadata(),
      b = await sharp(native).metadata();
    const width = Math.max(a.width, b.width),
      height = Math.max(a.height, b.height);
    const raster = async (file, meta) =>
      sharp(file)
        .ensureAlpha()
        .extend({ right: width - meta.width, bottom: height - meta.height, background: '#fff' })
        .raw()
        .toBuffer();
    const [left, right] = await Promise.all([raster(original, a), raster(native, b)]);
    const diff = Buffer.alloc(width * height * 4);
    const pixels = pixelmatch(left, right, diff, width, height, { threshold: 0.1 });
    const ratio = pixels / (width * height);
    if (ratio > 0.005)
      await sharp(diff, { raw: { width, height, channels: 4 } })
        .png()
        .toFile(path.join(directory, 'diff-' + file));
    results.push({
      path: pathname,
      width: reference.width,
      reference: reference.file,
      native: file,
      referenceHeight: a.height,
      nativeHeight: b.height,
      changedPixels: pixels,
      ratio,
      flagged: ratio > 0.005,
    });
    if (results.length % 12 === 0) console.log('visual', results.length + '/' + jobs.length);
  }
  await context.close();
}
try {
  await Promise.all([worker(), worker()]);
} finally {
  await browser.close();
}
results.sort((a, b) => a.path.localeCompare(b.path) || a.width - b.width);
fs.writeFileSync(
  'docs/reports/phase-04-visual.json',
  JSON.stringify(
    {
      threshold: { pixelmatch: 0.1, changedRatio: 0.005 },
      method:
        'Raw full-page comparison to Phase 1 JPEG; no masking. White padding exposes height differences. Native reduced-motion; external video frames blocked. Dynamic media, retired chat, gated links and approved form/control differences require review.',
      checks: results,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  JSON.stringify({ checks: results.length, flagged: results.filter((r) => r.flagged).length }),
);
