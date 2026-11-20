import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
async function open(page: Page, locale = 'en') {
  await page.goto(locale === 'es' ? '/es/programa-cna-2/' : '/cna-training-providers/');
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
  await expect(finder.locator('.finder-card').first()).toContainText('Idylwood Care Center');
  await expect(finder.locator('.finder-distance-note')).toContainText('not driving distances');
  await finder.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await finder.getByLabel('County', { exact: true }).selectOption('El Dorado');
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await expect(finder.locator('.finder-card')).toHaveCount(2);
  await expect(finder).toContainText('The Pines at Placerville');
  await finder.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await finder.getByLabel('Facility name or keyword').fill('surprise valley');
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await expect(finder.locator('.finder-card')).toHaveCount(1);
  const link = finder.getByRole('link', { name: /Get directions to/ });
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
  expect(new URL((await link.getAttribute('href'))!).searchParams.has('origin')).toBe(false);
  await finder.getByLabel('Your ZIP code', { exact: true }).fill('96104');
  await finder.getByRole('button', { name: 'Find training', exact: true }).click();
  await expect(finder.locator('.finder-card')).toHaveCount(1);
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
  await expect(finder.locator('.finder-card').first()).toContainText('Idylwood');
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
      const resources = page.locator('.training-finder-section > section:not(.training-finder)');
      await expect(resources.locator('a[href*="cdph.ca.gov"]')).toHaveCount(3);
      const resourceBox = await resources.boundingBox();
      const finderBox = await finder.boundingBox();
      expect(finderBox!.y).toBeGreaterThanOrEqual(resourceBox!.y + resourceBox!.height);

      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
      const zip = finder.locator('input').first();
      await zip.focus();
      await page.keyboard.type('94087');
      await page.keyboard.press('Enter');
      await expect(finder.locator('.finder-card').first()).toContainText('Idylwood');
      for (const input of await finder.locator('input,select,button').all()) {
        const box = await input.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThan(40);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
      const axe = await new AxeBuilder({ page })
        .include('.training-finder')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(axe.violations).toEqual([]);
      if ([1440, 390].includes(width)) {
        fs.mkdirSync('_source/training-finder/screenshots', { recursive: true });
        await page.addStyleTag({ content: 'html {scroll-behavior:auto!important}' });
        await finder.evaluate((element) =>
          window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 130),
        );
        await page.screenshot({
          path: `_source/training-finder/screenshots/${locale}-${width}.png`,
        });
      }
    });
  }
test('finder appears only on the two provider pages and original resources remain', async ({
  page,
}) => {
  await open(page);
  await expect(
    page.getByRole('link', { name: 'List of CNA Earn and Learn Training Partners', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'List of Facility Based Training Programs', exact: true }),
  ).toBeVisible();
  await page.goto('/career-seekers/');
  await expect(page.locator('.training-finder,style[data-training-finder]')).toHaveCount(0);
});
