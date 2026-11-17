import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const source = JSON.parse(fs.readFileSync('content/pages/cusp-upskilling.json', 'utf8'));
for (const width of [1440, 768, 390, 320])
  test(`CUSP refresh keeps every level readable at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/cusp-upskilling/');
    await expect(page.locator('.cusp-refresh')).toHaveCount(1);
    await expect(page.locator('style[data-cusp-refresh]')).toHaveCount(1);
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
  await expect(page.locator('style[data-cusp-refresh]')).toHaveCount(0);
});

test('overview stays keyboard reachable after closing mobile panels and resizing', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/cusp-upskilling/');
  const overview = page.locator('.native-mobile-tab').first();
  await overview.click();
  await expect(overview).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 1440, height: 1000 });
  const first = page.getByRole('tab').first();
  await expect(first).toHaveAttribute('tabindex', '0');
  await first.focus();
  await first.press('Enter');
  await expect(first).toHaveAttribute('aria-selected', 'true');
});

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
])
  test(
    'CUSP original video loads only in a lightbox at ' + viewport.width + 'x' + viewport.height,
    async ({ page }) => {
      await page.setViewportSize(viewport);
      const requests: string[] = [];
      page.on('request', (r) => {
        if (/youtube\.com|ytimg\.com/.test(r.url())) requests.push(r.url());
      });
      await page.route('**/*', (r) =>
        /youtube\.com|ytimg\.com/.test(r.request().url()) ? r.abort() : r.continue(),
      );
      await page.goto('/cusp-upskilling/');
      const section = page.locator('.elementor-element-f95e626');
      const trigger = section.getByRole('button', { name: 'Play video', exact: true });
      await trigger.scrollIntoViewIfNeeded();
      await expect(trigger).toBeVisible();
      await expect(trigger.locator('img')).toBeVisible();
      await expect(section.locator('iframe')).toHaveCount(0);
      expect(requests).toEqual([]);
      await trigger.focus();
      await trigger.press('Enter');
      const dialog = section.locator('dialog:visible');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('iframe')).toHaveAttribute(
        'src',
        /youtube.com\/embed\/aTyd4jfB0OY/,
      );
      const rect = await dialog.boundingBox();
      expect(rect!.x).toBeGreaterThanOrEqual(0);
      expect(rect!.y).toBeGreaterThanOrEqual(0);
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(viewport.width + 1);
      expect(rect!.y + rect!.height).toBeLessThanOrEqual(viewport.height + 1);
      await page.keyboard.press('Escape');
      await expect(section.locator('iframe')).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await trigger.click();
      await section.locator('dialog:visible .native-dialog-close').click();
      await expect(section.locator('iframe')).toHaveCount(0);
      await expect(trigger).toBeFocused();
    },
  );
