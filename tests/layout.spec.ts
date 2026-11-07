import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const width of [1440, 390])
  for (const path of [
    '/',
    '/es/',
    '/career-seekers/',
    '/es/aspirantes/',
    '/cna-training-providers/',
    '/es/programa-cna-2/',
  ])
    test('layout accessibility ' + path + ' @ ' + width, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(result.violations).toEqual([]);
      await expect(page.locator('footer a[href*="employers"]')).toHaveCount(0);
    });
test('language switcher goes to the actual translated counterpart', async ({ page }) => {
  await page.goto('/cna-training-providers/');
  await page.locator('.language-menu summary').click();
  await page.getByRole('link', { name: 'Español', exact: true }).click();
  await expect(page).toHaveURL(/\/es\/programa-cna-2\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});
test('mobile menu opens, expands and restores focus on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/es/');
  const open = page.getByRole('button', { name: 'Abrir menú' });
  await open.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.locator('summary').filter({ hasText: 'Aspirantes' }).click();
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(axe.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
test('keyboard opens the career mega menu and Escape closes it', async ({ page }) => {
  await page.goto('/');
  const career = page.locator('.desktop-nav > .nav-group').nth(1).locator('.nav-label');
  await career.focus();
  await career.press('ArrowDown');
  await expect(page.locator('#mega-1')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mega-1')).toBeHidden();
});
test('tablet uses the source mobile-navigation breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  await expect(page.locator('.desktop-nav')).toBeHidden();
});
