import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium, firefox, webkit } from '@playwright/test';
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json')).filter(
  (r) => r.section !== 'employers',
);
const cases = [...new Set(routes.map((r) => r.template))].flatMap((t) =>
  ['en', 'es'].map((l) => routes.find((r) => r.template === t && r.locale === l)),
);
const results = [];
for (const [name, type, options] of [
  ['edge', chromium, { channel: 'msedge' }],
  ['firefox', firefox, {}],
  ['webkit', webkit, {}],
]) {
  if (process.env.QA_BROWSERS && !process.env.QA_BROWSERS.split(',').includes(name)) continue;
  let browser;
  try {
    browser = await type.launch(options);
    for (const width of [1440, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: 960 },
        reducedMotion: 'reduce',
      });
      await context.route('**/*', (r) =>
        new URL(r.request().url()).hostname === '127.0.0.1' ? r.continue() : r.abort(),
      );
      const page = await context.newPage();
      page.setDefaultTimeout(12000);
      for (const route of cases) {
        const row = {
          browser: name,
          version: browser.version(),
          path: route.path,
          template: route.template,
          width,
        };
        try {
          await page.goto('http://127.0.0.1:3101' + route.path, { waitUntil: 'domcontentloaded' });
          if (await page.locator('.privacy-banner').count())
            await page.locator('.privacy-banner .privacy-action').nth(1).click();
          assert.equal(await page.locator('html').getAttribute('lang'), route.locale);
          await page.locator('h1').first().waitFor({ state: 'visible' });
          row.stage = 'rendering';
          row.overflow = await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          );
          assert.equal(row.overflow, false);
          await page.locator('.search-toggle').click();
          await page.getByRole('searchbox').fill(route.locale === 'es' ? 'enfermería' : 'nursing');
          await page.locator('.search-results a').first().waitFor();
          const urls = await page
            .locator('.search-results a')
            .evaluateAll((es) => es.map((e) => e.getAttribute('href')));
          assert.ok(urls.length);
          assert.ok(
            urls.every((u) =>
              route.locale === 'es' ? u.startsWith('/es/') : !u.startsWith('/es/'),
            ),
          );
          await page.keyboard.press('Escape');
          row.stage = 'search-focus-return';
          assert.equal(
            await page.locator('.search-toggle').evaluate((e) => e === document.activeElement),
            true,
          );
          row.stage = 'privacy-focus-return';
          await page.locator('.privacy-choices-button').click();
          await page.keyboard.press('Escape');
          assert.equal(
            await page
              .locator('.privacy-choices-button')
              .evaluate((e) => e === document.activeElement),
            true,
          );
          if (route.template === 'faq-accordion') {
            const q = page.locator('button.elementor-tab-title').first();
            await q.focus();
            await q.press('Enter');
            assert.equal(await q.getAttribute('aria-expanded'), 'true');
            await q.press('Space');
            assert.equal(await q.getAttribute('aria-expanded'), 'false');
            row.faq = true;
          }
          row.status = 'pass';
          delete row.stage;
        } catch (e) {
          row.status = 'fail';
          row.error = e.message.split('\n')[0];
        }
        results.push(row);
      }
      await context.close();
      console.log(name, width, 'complete');
    }
  } catch (e) {
    results.push({ browser: name, status: 'unavailable', error: e.message.split('\n')[0] });
  } finally {
    if (browser) await browser.close();
  }
}
const file = 'docs/reports/phase-10-preliminary-browsers.json';
const previous =
  process.env.QA_BROWSERS && fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file)).results.filter(
        (r) => !process.env.QA_BROWSERS.split(',').includes(r.browser),
      )
    : [];
results.unshift(...previous);
fs.writeFileSync(
  file,
  JSON.stringify(
    {
      method:
        '18 template/locale representatives at 1440/390 CSS pixels in installed Edge, Playwright Firefox and WebKit. Static rendering, overflow, language-scoped search, modal focus/return and FAQ keyboard. External requests blocked; no live forms. WebKit is not Safari/iOS; viewport emulation is not a physical device.',
      results,
    },
    null,
    2,
  ) + '\n',
);
console.log({ checks: results.length, failed: results.filter((r) => r.status !== 'pass') });
