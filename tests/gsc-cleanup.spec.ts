import cleanup from '../content/routing/legacy-cleanup.json' with { type: 'json' };
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { makeChoice, PRIVACY_KEY } from '../lib/privacy-policy';

test('Every privacy alias is a direct 301 with intact query and settings fragment', async ({
  request,
}) => {
  for (const rule of cleanup.privacyAliases)
    for (const path of [rule.from, rule.from.slice(0, -1)])
      for (const query of ['', '?clang=en&utm_source=legacy']) {
        const r = await request.get(path + query, { maxRedirects: 0 });
        expect(r.status(), path).toBe(301);
        const url = new URL(r.headers().location, 'https://yourcnastory.org');
        const expected = new URL(rule.to, 'https://yourcnastory.org');
        expect(url.pathname).toBe(expected.pathname);
        expect(url.hash).toBe('#privacy-choices');
        expect(url.search).toBe(query);
        const target = await request.get(url.pathname + url.search, { maxRedirects: 0 });
        expect(target.status()).toBe(200);
        expect(await target.text()).toContain('id="privacy-choices"');
      }
});
test('Retired jobs and exact malformed URLs do not fall back to homepage', async ({ request }) => {
  for (const path of cleanup.unavailable)
    for (const variant of [path.replace(/\/$/, ''), path.replace(/\/$/, '') + '/']) {
      const r = await request.get(variant, { maxRedirects: 0 });
      expect([403, 404], variant).toContain(r.status());
      expect(r.headers().location).toBeUndefined();
    }
  const api = await request.get('/es/wp-json/complianz/v1/datarequests');
  expect([403, 404]).toContain(api.status());
  const document = await request.get(
    '/wp-content/uploads/2025/11/earn-and-learn-appllication-packet-3.zip',
  );
  expect(document.status()).toBe(200);
});
for (const [locale, alias, policy] of [
  ['en', '/opt-out-preferences/', '/privacy-policy/'],
  ['es', '/es/preferencias-de-exclusion/', '/es/politica-de-privacidad/'],
] as const)
  for (const width of [1440, 390])
    test(`Privacy alias opens real ${locale} settings at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const requests: string[] = [];
      page.on('request', (r) => {
        if (/googletagmanager|google-analytics|clarity\.ms|doubleclick|mountain\.com/.test(r.url()))
          requests.push(r.url());
      });
      await page.goto(alias + '?clang=en');
      await expect(page).toHaveURL(
        new RegExp(policy.replaceAll('/', '\\/') + '\\?clang=en#privacy-choices$'),
      );
      const dialog = page.locator('.privacy-dialog');
      await expect(dialog).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(dialog.getByRole('checkbox').nth(1)).not.toBeChecked();
      await expect(dialog.getByRole('checkbox').nth(2)).not.toBeChecked();
      expect(await page.evaluate(() => localStorage.getItem('ycna_privacy_v1'))).toBeNull();
      expect(requests).toEqual([]);
      const audit = await new AxeBuilder({ page }).include('.privacy-dialog').analyze();
      expect(audit.violations).toEqual([]);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(page.locator('#privacy-choices')).toBeFocused();
      await page.locator('#privacy-choices').press('Enter');
      await expect(dialog).toBeVisible();
      await dialog.locator('.privacy-close').click();
      await expect(dialog).toBeHidden();
      expect(requests).toEqual([]);
    });
test('Deep link preserves saved choices and respects GPC', async ({ page }) => {
  await page.addInitScript(({ key, choice }) => localStorage.setItem(key, JSON.stringify(choice)), {
    key: PRIVACY_KEY,
    choice: makeChoice({ analytics: true, advertising: false }),
  });
  await page.goto('/privacy-policy/#privacy-choices');
  const dialog = page.locator('.privacy-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('checkbox').nth(1)).toBeChecked();
  await expect(dialog.getByRole('checkbox').nth(2)).not.toBeChecked();
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true }),
  );
  await page.reload();
  await expect(dialog).toBeVisible();
  for (const checkbox of await dialog.getByRole('checkbox').all())
    await expect(checkbox).toBeDisabled();
  await expect(dialog.getByRole('checkbox').nth(1)).not.toBeChecked();
  await expect(dialog.getByRole('checkbox').nth(2)).not.toBeChecked();
});
test('Settings hash opens after navigation, but ordinary policy visits do not open it', async ({
  page,
}) => {
  await page.goto('/privacy-policy/');
  const dialog = page.locator('.privacy-dialog');
  await expect(dialog).toBeHidden();
  await page.evaluate(() => {
    location.hash = 'privacy-choices';
  });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await page.goto('/career-seekers/#privacy-choices');
  await expect(dialog).toBeHidden();
});
