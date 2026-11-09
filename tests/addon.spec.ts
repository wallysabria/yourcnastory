import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { load } from 'cheerio';
import sharp from 'sharp';
import { megaMenuTiming } from '../lib/navigation-config';
import icons from '../content/brand/icons.json' with { type: 'json' };

test.beforeEach(async ({ page }) => {
  await page.route('**/*', (route) =>
    route.request().resourceType() === 'media' ? route.abort() : route.continue(),
  );
});

for (const path of ['/', '/es/']) {
  test('App Router icon head and dimensions ' + path, async ({ request }) => {
    const r = await request.get(path);
    const $ = load(await r.text());
    const tags = $('link[rel=icon],link[rel=apple-touch-icon],link[rel=manifest]')
      .toArray()
      .map((n) => ({ rel: $(n).attr('rel'), href: $(n).attr('href')!, sizes: $(n).attr('sizes') }));
    expect(tags.some((t) => t.rel === 'icon' && t.href.startsWith('/favicon.ico'))).toBe(true);
    expect(tags.some((t) => t.rel === 'icon' && t.sizes === '32x32')).toBe(true);
    expect(tags.some((t) => t.rel === 'apple-touch-icon' && t.sizes === '180x180')).toBe(true);
    const manifestTag = tags.find((t) => t.rel === 'manifest');
    expect(manifestTag).toBeDefined();
    for (const tag of tags) expect((await request.get(tag.href)).status()).toBe(200);
    const manifest = await (await request.get(manifestTag!.href)).json();
    expect(manifest.theme_color).toBe(icons.themeColor);
    for (const icon of manifest.icons) {
      const response = await request.get(icon.src);
      expect(response.status()).toBe(200);
      const dimensions = await sharp(await response.body()).metadata();
      expect(icon.sizes).toBe(dimensions.width + 'x' + dimensions.height);
    }
    const original = await request.get(icons.source.path);
    expect(
      createHash('sha256')
        .update(await original.body())
        .digest('hex'),
    ).toBe(icons.source.sha256);
    const ico = await (await request.get('/favicon.ico')).body();
    expect(ico.readUInt16LE(4)).toBe(3);
    for (let i = 0; i < 3; i++) {
      const base = 6 + 16 * i;
      expect(ico[base]).toBe([16, 32, 48][i]);
      const length = ico.readUInt32LE(base + 8),
        offset = ico.readUInt32LE(base + 12);
      const m = await sharp(ico.subarray(offset, offset + length)).metadata();
      expect(m.width).toBe([16, 32, 48][i]);
    }
    expect(fs.readFileSync('app/globals.css', 'utf8')).toContain('--blue: ' + manifest.theme_color);
  });
  test('hover intent bridge delayed close and immediate switch ' + path, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await page.locator('.privacy-banner .privacy-action').nth(1).click();
    await page
      .locator('.nav-label')
      .nth(1)
      .evaluate((e) =>
        document.fonts.load('600 16px ' + getComputedStyle(e).fontFamily).catch(() => []),
      );
    await page.clock.install({ time: new Date('2026-11-08T12:00:00Z') });
    await page.clock.pauseAt(new Date('2026-11-08T12:00:01Z'));
    const career = page.locator('.nav-label').nth(1),
      employer = page.locator('.nav-label').nth(0);
    await career.hover();
    await expect(page.locator('#mega-1')).toBeHidden();
    await page.clock.fastForward(megaMenuTiming.openDelayMs - 1);
    await expect(page.locator('#mega-1')).toBeHidden();
    await page.clock.fastForward(1);
    await expect(page.locator('#mega-1')).toBeVisible();
    const label = await career.boundingBox(),
      panel = await page.locator('#mega-1').boundingBox();
    expect(label).not.toBeNull();
    expect(panel).not.toBeNull();
    await page.mouse.move(label!.x + label!.width / 2, label!.y + label!.height - 1);
    await page.mouse.move(label!.x + label!.width / 2, (label!.y + label!.height + panel!.y) / 2);
    await page.clock.fastForward(megaMenuTiming.closeDelayMs + 1);
    await expect(page.locator('#mega-1')).toBeVisible();
    await page.mouse.move(panel!.x + panel!.width / 2, panel!.y + 25, { steps: 8 });
    await expect(page.locator('#mega-1')).toBeVisible();
    await employer.hover();
    await expect(page.locator('#mega-0')).toBeVisible();
    await expect(page.locator('#mega-1')).toBeHidden();
    await expect(page.locator('#mega-0 a[href]')).toHaveCount(0);
    await page.mouse.move(1, 600);
    await page.clock.fastForward(megaMenuTiming.closeDelayMs - 1);
    await expect(page.locator('#mega-0')).toBeVisible();
    await employer.hover();
    await page.clock.fastForward(megaMenuTiming.closeDelayMs + 1);
    await expect(page.locator('#mega-0')).toBeVisible();
    await page.mouse.move(1, 600);
    await page.clock.fastForward(megaMenuTiming.closeDelayMs);
    await expect(page.locator('#mega-0')).toBeHidden();
  });
  test('keyboard disclosure focus exit and header axe ' + path, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await page.locator('.privacy-banner .privacy-action').nth(1).click();
    const trigger = page.locator('.nav-label').nth(1);
    await trigger.focus();
    await trigger.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveAttribute('aria-controls', 'mega-1');
    // WebKit native Tab follows platform link-focus preferences; ArrowDown explicitly enters the panel.
    if (page.context().browser()?.browserType().name() === 'webkit')
      await trigger.press('ArrowDown');
    else await page.keyboard.press('Tab');
    await expect(page.locator('#mega-1 a[href]').first()).toBeFocused();
    const axe = await new AxeBuilder({ page })
      .include('header')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(axe.violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(page.locator('#mega-1')).toBeHidden();
    await trigger.press('Enter');
    await expect(page.locator('#mega-1')).toBeVisible();
    const last = page.locator('#mega-1 a[href]').last();
    await last.focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('#mega-1')).toBeHidden();
    await page.locator('.nav-label').first().focus();
    await page.locator('.nav-label').first().press('Enter');
    expect(
      (
        await new AxeBuilder({ page })
          .include('header')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(page.locator('.nav-label').first()).toBeFocused();
    expect(
      await page
        .locator('.nav-label')
        .first()
        .evaluate((e) => getComputedStyle(e).outlineStyle),
    ).not.toBe('none');
  });
  test(
    'wide touch first tap outside dismissal and retained destination ' + path,
    async ({ browser }) => {
      test.skip(
        browser.browserType().name() === 'firefox',
        'Firefox automation has no touch emulation; Chromium/WebKit cover touch.',
      );
      const context = await browser.newContext({
        hasTouch: true,
        viewport: { width: 1280, height: 960 },
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      try {
        await page.goto((process.env.TEST_BASE_URL || 'http://127.0.0.1:3101') + path, {
          waitUntil: 'domcontentloaded',
        });
        await page.locator('.privacy-banner .privacy-action').nth(1).tap();
        const trigger = page.locator('.nav-label').nth(1);
        await trigger.tap();
        await expect(page.locator('#mega-1')).toBeVisible();
        expect(new URL(page.url()).pathname).toBe(path);
        await page.touchscreen.tap(10, 900);
        await expect(page.locator('#mega-1')).toBeHidden();
        await trigger.tap();
        await trigger.tap();
        await expect(page).toHaveURL(
          new RegExp((path === '/es/' ? '/es/aspirantes/' : '/career-seekers/') + '$'),
        );
      } finally {
        await context.close();
      }
    },
  );
}
