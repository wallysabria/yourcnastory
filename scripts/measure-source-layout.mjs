import fs from 'node:fs';
import { chromium } from '@playwright/test';
import { write } from './content-source.mjs';
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json')).filter(
  (r) => r.section !== 'employers',
);
const browser = await chromium.launch();
const results = {};
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 1440 ? 1000 : 844 },
    });
    await context.route('**/*', (route) =>
      ['image', 'media', 'font'].includes(route.request().resourceType()) ||
      /googletagmanager|google-analytics|clarity\.ms|doubleclick|mxchat|list-manage|mtn\.com/.test(
        route.request().url(),
      )
        ? route.abort()
        : route.continue(),
    );
    let i = 0;
    async function worker() {
      const page = await context.newPage();
      while (i < routes.length) {
        const r = routes[i++];
        await page.goto('https://yourcnastory.org' + r.path, { waitUntil: 'load', timeout: 45000 });
        const data = await page.evaluate(() => {
          const main = document.querySelector('#main'),
            rect = main.getBoundingClientRect();
          const logos = [...document.querySelectorAll('[data-elementor-type="header"] img')].filter(
            (img) => {
              const r = img.getBoundingClientRect();
              return r.width > 80 && r.height > 15 && r.y < 200;
            },
          );
          return {
            headerSpace: Math.max(
              0,
              Math.round(rect.top - parseFloat(getComputedStyle(main).marginTop || '0')),
            ),
            logo: logos[0]?.getAttribute('data-src') || logos[0]?.getAttribute('src') || '',
            mainWidth: rect.width,
          };
        });
        results[r.path] ??= {};
        results[r.path][width === 1440 ? 'desktop' : 'mobile'] = data;
      }
      await page.close();
    }
    await Promise.all([worker(), worker()]);
    await context.close();
    console.log('Measured ' + width + 'px source layouts.');
  }
} finally {
  await browser.close();
}
write('content/layout/metrics.json', results);
