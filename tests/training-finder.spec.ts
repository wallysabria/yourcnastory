import labels from '../content/ui/training-finder.json' with { type: 'json' };
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
async function open(page: Page, locale = 'en') {
  await page.goto(
    locale === 'es' ? '/es/encuentra-un-centro-de-capacitacion/' : '/find-a-training-facility/',
  );
  await page.locator('.privacy-banner .privacy-action').nth(1).click();
  return page.locator('.training-finder');
}
test('ZIP proximity, ZIP+4, corrected counties, names, clear and expansion', async ({ page }) => {
  const finder = await open(page);
  await expect(finder.locator('.finder-card')).toHaveCount(9);
  await finder.getByRole('button', { name: 'Show more facilities' }).click();
  await expect(finder.locator('.finder-card')).toHaveCount(18);
  await finder.getByLabel('Your ZIP code', { exact: true }).fill('94087-1234');
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await expect(finder.locator('.finder-card').first().locator('.finder-distance')).toBeVisible();
  await expect(finder.locator('.finder-distance-note').first()).toContainText(
    'not driving distances',
  );
  await finder.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await finder.getByLabel('County', { exact: true }).selectOption('El Dorado');
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await expect(finder.locator('.finder-card')).not.toHaveCount(0);
  await expect(finder.locator('.finder-search-summary')).toBeVisible();
  await finder.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await finder.getByLabel('Facility name or keyword').fill('surprise valley');
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await expect(finder.locator('.finder-card')).not.toHaveCount(0);
  const link = finder.getByRole('link', { name: /Get directions to/ }).first();
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
  expect(new URL((await link.getAttribute('href'))!).searchParams.has('origin')).toBe(false);
  await finder.getByLabel('Your ZIP code', { exact: true }).fill('96104');
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await expect(finder.locator('.finder-card')).not.toHaveCount(0);
  await expect(finder).toContainText('exact location is not verified');
});
test('invalid, unsupported and distant ZIPs have useful errors and empty states', async ({
  page,
}) => {
  const finder = await open(page);
  const zip = finder.getByLabel('Your ZIP code', { exact: true });
  await zip.fill('ABC');
  await zip.press('Enter');
  await expect(finder.getByRole('alert')).toContainText('valid 5-digit');
  await expect(zip).toBeFocused();
  await zip.fill('00000');
  await zip.press('Enter');
  await expect(finder.getByRole('alert')).toContainText('Some ZIP codes');
  await finder.getByLabel('Facility name or keyword').fill('Idylwood');
  await zip.fill('10001');
  await zip.press('Enter');
  await expect(finder.locator('.finder-empty')).toBeVisible();
  await finder.locator('.finder-empty').getByRole('button', { name: 'Clear filters' }).click();
  await expect(finder.locator('.finder-card')).toHaveCount(9);
});
test('ZIP dataset failure allows retry and city browsing; queries are never transmitted', async ({
  page,
}) => {
  let fail = true;
  const urls: string[] = [];
  page.on('request', (request) => urls.push(request.url()));
  await page.route('**/training-finder/zip-areas.json', async (route) => {
    if (fail) await route.fulfill({ status: 503, body: 'Unavailable' });
    else await route.continue();
  });
  const finder = await open(page);
  await finder.getByLabel('Your ZIP code', { exact: true }).fill('94087');
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await expect(finder.getByRole('alert')).toContainText('temporarily unavailable');
  fail = false;
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await expect(finder.locator('.finder-card').first().locator('.finder-distance')).toBeVisible();
  expect(urls.some((url) => url.includes('94087'))).toBe(false);
  expect(urls.filter((url) => new URL(url).hostname !== '127.0.0.1')).toEqual([]);
  expect(
    await page.evaluate(() => Object.keys(localStorage).some((key) => /zip|finder/i.test(key))),
  ).toBe(false);
});
for (const locale of ['en', 'es'])
  for (const width of [1440, 768, 390, 320]) {
    test(`finder layout, keyboard and axe ${locale} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      const finder = await open(page, locale);
      await page.evaluate(() => document.fonts.ready);
      await expect(finder).toBeVisible();
      await expect(page.locator('.site-header')).toHaveClass(/over-hero/);
      await expect(page.locator('.brand img')).toHaveAttribute('src', /cnap-logo-white/);
      await expect(page.locator('.finder-hero h1')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(finder.locator('.finder-card')).toHaveCount(9);
      await expect(finder.getByRole('checkbox')).toHaveCount(0);
      await finder
        .getByLabel(labels[locale as 'en' | 'es'].trainingType, { exact: true })
        .selectOption('earn-and-learn');
      await finder
        .getByRole('button', {
          name: locale === 'es' ? labels.es.search : labels.en.search,
          exact: true,
        })
        .click();
      await expect(finder.locator('.finder-badge')).toHaveCount(9);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
      const zip = finder.locator('input').first();
      await zip.focus();
      await page.keyboard.type('94087');
      await page.keyboard.press('Enter');
      await expect(
        finder.locator('.finder-card').first().locator('.finder-distance'),
      ).toBeVisible();
      for (const input of await finder
        .locator('input:not([type="checkbox"]),select,button')
        .all()) {
        const box = await input.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThan(40);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
      const axe = await new AxeBuilder({ page })
        .include('.training-finder')
        .include('.finder-hero')
        .include('.site-header')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(axe.violations).toEqual([]);
      if ([1440, 390].includes(width)) {
        fs.mkdirSync('_source/training-finder/screenshots', { recursive: true });
        await page.addStyleTag({ content: 'html {scroll-behavior:auto!important}' });
        await finder.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: `_source/training-finder/screenshots/${locale}-${width}.png`,
        });
      }
    });
  }
test('finder is standalone and provider resources now link to its matching language', async ({
  page,
}) => {
  for (const [provider, destination] of [
    ['/cna-training-providers/', '/find-a-training-facility/'],
    ['/es/programa-cna-2/', '/es/encuentra-un-centro-de-capacitacion/'],
  ]) {
    await page.goto(provider);
    await expect(page.locator('.training-finder,style[data-training-finder]')).toHaveCount(0);
    await expect(page.locator('#training-finder a[href="' + destination + '"]')).toHaveCount(1);
    await expect(page.locator('a[href*="cdph.ca.gov"]')).toHaveCount(3);
  }
  await page.goto('/career-seekers/');
  await expect(page.locator('.training-finder,style[data-training-finder]')).toHaveCount(0);
});
import { load } from 'cheerio';
import { renderableRoutes } from '../lib/routing';
import paths from '../content/training/page-paths.json' with { type: 'json' };
test('all active spreadsheet links are replaced by internal finder URLs in the page language', async ({
  request,
}) => {
  let linkedPages = 0;
  for (const route of renderableRoutes()) {
    const response = await request.get(route.path);
    expect(response.status(), route.path).toBe(200);
    const $ = load(await response.text());
    expect($('a[href*="' + paths.legacySpreadsheetId + '"]'), route.path).toHaveLength(0);
    const links = $('a[href="' + paths[route.locale] + '"]');
    if (links.length && ![paths.en, paths.es].includes(route.path)) linkedPages++;
    links.each((_, link) => expect($(link).attr('target'), route.path).not.toBe('_blank'));
  }
  expect(linkedPages).toBeGreaterThanOrEqual(9);
});

test('online, community and facility filters show corresponding labels and safe clinical details', async ({
  page,
}) => {
  const finder = await open(page);
  await finder.getByLabel('Training type', { exact: true }).selectOption('online');
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await expect(finder.locator('.finder-type-badge').first()).toHaveText('Online training');
  await expect(finder.locator('.finder-distance')).toHaveCount(0);
  await expect(finder.locator('.finder-card-links a[href*="maps/dir"]')).toHaveCount(0);
  await expect(finder.locator('.finder-clinical-areas').first()).toBeVisible();
  await expect(finder.locator('.finder-badge')).toHaveCount(0);
  await finder.locator('.finder-clinical-areas').first().locator('summary').click();
  const onlineAxe = await new AxeBuilder({ page })
    .include('.training-finder')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(onlineAxe.violations).toEqual([]);
  await finder.getByLabel('Facility name or keyword').fill('SisuCare');
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await finder.locator('.finder-clinical-areas').first().locator('summary').click();
  fs.mkdirSync('_source/training-finder/screenshots', { recursive: true });
  await finder
    .locator('.finder-card')
    .first()
    .screenshot({ path: '_source/training-finder/screenshots/online-card-desktop.png' });
  await page.setViewportSize({ width: 390, height: 1000 });
  await finder
    .locator('.finder-card')
    .first()
    .screenshot({ path: '_source/training-finder/screenshots/online-card-mobile.png' });
  await finder.getByLabel('Facility name or keyword').fill('Health Star Academy');
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await expect(finder.getByRole('link', { name: /^Call / })).toHaveCount(0);
  await expect(finder.getByRole('link', { name: /Visit Health Star/ })).toHaveCount(1);
  await finder.getByLabel('Facility name or keyword').fill('');

  for (const [type, label] of [
    ['community-based', 'Community-based training'],
    ['facility-based', 'Facility-based training'],
  ]) {
    await finder.getByLabel('Training type', { exact: true }).selectOption(type);
    await finder.getByRole('button', { name: 'Find training', exact: true }).click();
    await expect(finder.locator('.finder-type-badge').first()).toHaveText(label);
  }
});
