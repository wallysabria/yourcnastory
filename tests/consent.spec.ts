import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const records = (page: Page) => page.evaluate(() => window.__ycnaMockEvents || []);
const banner = (page: Page) => page.locator('.privacy-banner');
async function preferences(page: Page) {
  await page.locator('.privacy-choices-button').click();
  return page.locator('.privacy-dialog');
}
for (const locale of ['en', 'es'])
  test(
    'consent accept/decline symmetry, persistence and modal keyboard ' + locale,
    async ({ page }) => {
      const requests: string[] = [];
      page.on('request', (r) => {
        if (/googletagmanager|google-analytics|clarity\.ms|doubleclick|mountain\.com/.test(r.url()))
          requests.push(r.url());
      });
      await page.goto(locale === 'es' ? '/es/' : '/');
      await expect(banner(page)).toBeVisible();
      expect(await records(page)).toEqual([]);
      const actions = banner(page).locator('.privacy-action');
      expect(await actions.nth(0).evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(
        await actions.nth(1).evaluate((e) => getComputedStyle(e).backgroundColor),
      );
      await actions.nth(1).click();
      await expect(banner(page)).toBeHidden();
      expect(await records(page)).toEqual([]);
      await page.goto(locale === 'es' ? '/es/aspirantes/' : '/career-seekers/');
      await expect(banner(page)).toBeHidden();
      const dialog = await preferences(page);
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('checkbox')).toHaveCount(3);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(page.locator('.privacy-choices-button')).toBeFocused();
      expect(requests).toEqual([]);
    },
  );
test('analytics-only choice excludes advertising, query/form values and mock conversions', async ({
  page,
}) => {
  await page.goto('/');
  await banner(page).locator('.privacy-manage').click();
  const panel = page.locator('.privacy-dialog');
  await panel.getByRole('checkbox').nth(1).check();
  await panel.locator('.privacy-dialog-actions button').first().click();
  await expect
    .poll(async () => (await records(page)).some((r) => r.event === 'page_view'))
    .toBe(true);
  expect(
    (await records(page)).filter((r) => ['google_ads', 'floodlight', 'mntn'].includes(r.vendor)),
  ).toEqual([]);
  await page.evaluate(() =>
    window.dispatchEvent(
      new CustomEvent('signup_submitted', {
        detail: { mode: 'mock', outcome: 'created', email: 'never-collect@example.invalid' },
      }),
    ),
  );
  expect((await records(page)).some((r) => r.event === 'generate_lead')).toBe(false);
  await page.locator('.search-toggle').click();
  await page.getByRole('searchbox').fill('never-collect@example.invalid');
  await expect(page.locator('.search-status')).toContainText(/result/);
  await page.getByRole('searchbox').press('Enter');
  await expect
    .poll(async () => (await records(page)).some((r) => r.event === 'site_search'))
    .toBe(true);
  expect(JSON.stringify(await records(page))).not.toContain('never-collect');
  expect(
    await page.locator('script[src*="googletagmanager"],script[src*="clarity.ms"]').count(),
  ).toBe(0);
});
test('advertising-only choice retains vendor mocks but sends no analytics; survives language change', async ({
  page,
}) => {
  await page.goto('/');
  await banner(page).locator('.privacy-manage').click();
  const panel = page.locator('.privacy-dialog');
  await panel.getByRole('checkbox').nth(2).check();
  await panel.locator('.privacy-dialog-actions button').first().click();
  await expect.poll(async () => (await records(page)).length).toBe(3);
  expect((await records(page)).map((r) => r.vendor).sort()).toEqual([
    'floodlight',
    'google_ads',
    'mntn',
  ]);
  await page.goto('/es/');
  await expect(banner(page)).toBeHidden();
  await expect.poll(async () => (await records(page)).length).toBe(3);
  expect((await records(page)).some((r) => r.vendor === 'ga4' || r.vendor === 'clarity')).toBe(
    false,
  );
});
for (const signal of ['gpc', 'dnt'])
  test(signal + ' overrides a stored grant without banner nagging', async ({ page }) => {
    await page.addInitScript((signal) => {
      Object.defineProperty(navigator, signal === 'gpc' ? 'globalPrivacyControl' : 'doNotTrack', {
        get: () => (signal === 'gpc' ? true : '1'),
      });
      localStorage.setItem(
        'ycna_privacy_v1',
        JSON.stringify({
          version: 1,
          analytics: true,
          advertising: true,
          updatedAt: Date.now(),
          expiresAt: Date.now() + 180 * 24 * 60 * 60 * 1000,
        }),
      );
    }, signal);
    await page.goto('/');
    await expect(banner(page)).toBeHidden();
    const panel = await preferences(page);
    await expect(panel.locator('.privacy-signal')).toBeVisible();
    await expect(panel.getByRole('checkbox').nth(1)).toBeDisabled();
    await expect(panel.getByRole('checkbox').nth(2)).not.toBeChecked();
    expect(await records(page)).toEqual([]);
  });
test('storage failure is handled and expired choices return to denied', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'ycna_privacy_v1',
      JSON.stringify({
        version: 1,
        analytics: true,
        advertising: true,
        updatedAt: 1,
        expiresAt: 2,
      }),
    );
  });
  await page.goto('/');
  await expect(banner(page)).toBeVisible();
  expect(await records(page)).toEqual([]);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Blocked', 'SecurityError');
    };
  });
  await banner(page).locator('.privacy-action').nth(1).click();
  await expect(banner(page)).toBeHidden();
  await preferences(page);
  await expect(page.locator('.privacy-dialog')).toContainText('could not save');
});
test('withdrawal stops events and cross-tab choices are respected', async ({ page, context }) => {
  await page.goto('/');
  await banner(page).locator('.privacy-action').first().click();
  await expect
    .poll(async () => (await records(page)).some((r) => r.event === 'page_view'))
    .toBe(true);
  const second = await context.newPage();
  await second.goto('/es/');
  const panel = await preferences(second);
  await panel.locator('.privacy-dialog-actions button').nth(1).click();
  await expect
    .poll(async () =>
      page.evaluate(() => JSON.parse(localStorage.getItem('ycna_privacy_v1')!).analytics),
    )
    .toBe(false);
  const before = (await records(page)).length;
  await page.evaluate(() =>
    window.dispatchEvent(
      new CustomEvent('signup_submitted', { detail: { mode: 'live', outcome: 'created' } }),
    ),
  );
  expect((await records(page)).length).toBe(before);
  await second.close();
});
test('new privacy UI has zero axe violations desktop and mobile', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto('/es/');
    await expect(banner(page)).toBeVisible();
    let result = await new AxeBuilder({ page })
      .include('.privacy-banner')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
    await banner(page).locator('.privacy-manage').click();
    result = await new AxeBuilder({ page })
      .include('.privacy-dialog')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
    await page.keyboard.press('Escape');
  }
});

test('inline external players make no passive requests and load only on Play in EN and ES', async ({
  page,
}) => {
  const external: string[] = [];
  await page.route(
    /youtube\.com|vidyard\.com|ytimg\.com|google-analytics\.com|doubleclick\.net/,
    (route) => {
      external.push(new URL(route.request().url()).hostname);
      return route.abort();
    },
  );
  for (const path of ['/community-resources/', '/es/recursos-comunitarios/']) {
    external.length = 0;
    await page.goto(path);
    await banner(page).locator('.privacy-action').nth(1).click();
    const posters = page.locator('.native-video-poster');
    await expect(posters).toHaveCount(3);
    for (const poster of await posters.all()) await poster.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    expect(external).toEqual([]);
    await expect(page.locator('iframe')).toHaveCount(0);
    await posters.first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.native-inline-video')).toHaveCount(1);
    await expect(page.locator('.native-inline-video')).toBeFocused();
    await expect.poll(() => external.length).toBeGreaterThan(0);
    await page.evaluate(() => localStorage.removeItem('ycna_privacy_v1'));
  }
});

test('consented document and outbound events exclude full URLs and consent updates stay independent', async ({
  page,
}) => {
  await page.goto('/community-resources/?private=never-collect#example');
  await banner(page).locator('.privacy-manage').click();
  const panel = page.locator('.privacy-dialog');
  await panel.getByRole('checkbox').nth(1).check();
  await panel.locator('.privacy-dialog-actions button').first().click();
  await expect
    .poll(async () => (await records(page)).filter((r) => r.event === 'page_view').length)
    .toBe(1);
  const commands = await page.evaluate(() =>
    window.dataLayer
      ?.map((item) => Array.from(item as ArrayLike<unknown>))
      .filter((item) => item[0] === 'consent'),
  );
  expect(commands?.at(-1)?.[2]).toEqual({
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  await page.evaluate(() =>
    document.addEventListener('click', (e) => e.preventDefault(), { once: false }),
  );
  const documentLink = page.locator('a[href*="drive.google.com/file/"]').first();
  await documentLink.click();
  await expect
    .poll(async () => (await records(page)).some((r) => r.event === 'file_download'))
    .toBe(true);
  const external = page
    .locator('.page-content a[href^="https://"]')
    .filter({ hasNotText: /^$/ })
    .first();
  await external.click();
  const serialized = JSON.stringify(await records(page));
  expect(serialized).not.toContain('never-collect');
  expect(serialized).not.toContain('.pdf?');
});
