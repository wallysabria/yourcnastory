import release from '../content/routing/employer-release.json' with { type: 'json' };
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const path of release.approved)
  for (const width of [1440, 390])
    test(`Employer ${path} at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      expect(await page.locator('html').getAttribute('lang')).toBe('en');
      await expect(page.locator('h1')).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
      for (const held of release.held)
        await expect(page.locator(`#main a[href="${held}"]`)).toHaveCount(0);
      await expect(page.locator('iframe')).toHaveCount(0);
      const axe = await new AxeBuilder({ page }).include('#main').analyze();
      await test
        .info()
        .attach('axe-source-audit', {
          body: JSON.stringify(axe.violations),
          contentType: 'application/json',
        });
      expect(
        axe.violations
          .filter((v) => v.id !== 'color-contrast')
          .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      ).toEqual([]);
    });
test('held and Spanish Employer pages remain unavailable', async ({ request }) => {
  for (const path of [...release.held, '/es/certificaciones-cna/', '/es/premios-cnap/'])
    expect((await request.get(path)).status()).toBe(404);
});
test('Employer FAQ reveals actual answer and restores collapsed state', async ({ page }) => {
  await page.goto('/faqs/');
  const trigger = page.locator('button.elementor-tab-title').first();
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const id = await trigger.getAttribute('aria-controls');
  await expect(page.locator('[id="' + id + '"]')).toBeVisible();
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});
test('external embeds load original URLs only after activation', async ({ page }) => {
  for (const [path, button, host] of [
    ['/cnap-employer-signup/', 'Load application form', 'forms.office.com'],
    ['/employer-resources/', 'Load video', 'player.vimeo.com'],
  ]) {
    await page.route('**/*', (r) => (r.request().url().includes(host) ? r.abort() : r.continue()));
    await page.goto(path);
    await expect(page.locator('iframe')).toHaveCount(0);
    await page.getByRole('button', { name: button, exact: true }).click();
    await expect(page.locator('iframe')).toHaveAttribute('src', new RegExp(host));
  }
});

for (const width of [1440, 390])
  test('CUSP tabs expose all source panels at ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/cusp-upskilling/');
    const set = page.locator('.native-employer-tabs').first();
    if (width === 1440) {
      const tabs = set.getByRole('tab');
      await tabs.first().focus();
      await tabs.first().press('ArrowRight');
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    } else {
      const buttons = set.locator('.native-mobile-tab');
      await buttons.nth(1).click();
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true');
    }
    await expect(set.locator('[role=tabpanel]:visible')).toHaveCount(1);
  });
