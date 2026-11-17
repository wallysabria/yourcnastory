import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const source = JSON.parse(fs.readFileSync('content/pages/cusp-upskilling.json', 'utf8'));
for (const width of [1440, 768, 390, 320])
  test(`CUSP refresh keeps every level readable at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/cusp-upskilling/');
    await expect(page.locator('.cusp-refresh')).toHaveCount(1);
    await expect(page.locator('.cusp-level-card')).toHaveCount(7);
    await expect(page.locator('.cusp-benefit-grid>.wf-cell')).toHaveCount(5);
    for (const card of await page.locator('.cusp-level-card').all()) {
      if (
        !(await card.getAttribute('open')) &&
        !(await card.evaluate((el) => el.hasAttribute('open')))
      )
        await card.locator('summary').press('Enter');
      await expect(card.locator('.cusp-level-body')).toBeVisible();
      expect((await card.locator('.cusp-level-body').innerText()).trim().length).toBeGreaterThan(
        10,
      );
    }
    for (const id of source.inventory.anchors)
      await expect(page.locator('[id="' + id + '"]')).toHaveCount(1);
    for (const card of await page.locator('.cusp-benefit-grid>.wf-cell').all()) {
      const box = await card.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(220);
      expect(await card.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    const audit = await new AxeBuilder({ page }).include('#main').analyze();
    await test.info().attach('expanded-source-link-audit', {
      body: JSON.stringify(audit.violations),
      contentType: 'application/json',
    });
    expect(
      audit.violations
        .filter((v) => v.id !== 'link-in-text-block')
        .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });
test('CUSP overview supports vertical keyboard navigation and page-only stylesheet', async ({
  page,
}) => {
  await page.goto('/cusp-upskilling/');
  const tabs = page.getByRole('tab');
  await tabs.first().focus();
  await tabs.first().press('ArrowDown');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await tabs.nth(1).press('End');
  await expect(tabs.last()).toBeFocused();
  await page.goto('/faqs/');
  await expect(page.locator('link[href="/styles/cusp-refresh.css"]')).toHaveCount(0);
});
