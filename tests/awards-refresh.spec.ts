import { test, expect } from '@playwright/test';
const ids = ['NATPaward', 'DSDaward', 'E&Laward', 'CUSPaward', 'Clinicalaward'];
for (const width of [1440, 768, 390, 320])
  test(`Awards navigation and anchors at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/cnap-awards/');
    await page.getByRole('button', { name: 'Decline all optional tools', exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    const nav = page.getByRole('navigation', { name: 'Jump to an award', exact: true });
    await expect(nav.locator('a')).toHaveText([
      'NATP Approval',
      'Second DSD',
      'Earn & Learn',
      'CNA Upskilling',
      'Clinical Rotation',
    ]);
    await expect(page.locator('[data-award-card]')).toHaveCount(7);
    for (let i = 0; i < ids.length; i++) {
      const a = nav.locator('a').nth(i);
      expect((await a.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await a.focus();
      await a.press('Enter');
      await expect
        .poll(() => page.evaluate(() => decodeURIComponent(location.hash.slice(1))))
        .toBe(ids[i]);
      await expect(a).toHaveAttribute('aria-current', 'location');
      const target = page.locator(`[id="${ids[i]}"]`);
      await expect(target).toBeFocused();
      await expect
        .poll(async () => {
          const h = await page.locator('.site-header').boundingBox();
          const n = await nav.boundingBox();
          const t = await target.boundingBox();
          return t!.y - (h!.y + h!.height + (width >= 768 ? n!.height : 0));
        })
        .toBeGreaterThanOrEqual(-1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    if (width >= 768) {
      await expect
        .poll(async () => {
          const n = await nav.boundingBox();
          const h = await page.locator('.site-header').boundingBox();
          return Math.abs(n!.y - h!.y - h!.height);
        })
        .toBeLessThan(2);
    } else expect(await nav.evaluate((e) => getComputedStyle(e).position)).toBe('static');
    await page
      .locator('.elementor-element-e4e7e1a')
      .evaluate((e) => e.scrollIntoView({ block: 'start' }));
    await expect(nav.locator('[aria-current]')).toHaveText('CNA Upskilling');
    await page
      .locator('.elementor-element-1b85b90')
      .evaluate((e) => e.scrollIntoView({ block: 'start' }));
    await expect(nav.locator('[aria-current]')).toHaveText('CNA Upskilling');
  });
test('Awards deep link and page-only styling', async ({ page }) => {
  await page.goto('/cnap-awards/#E&Laward');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.awards-jump [aria-current]')).toHaveText('Earn & Learn');
  await page.goto('/cusp-upskilling/');
  await expect(page.locator('style[data-awards-refresh],.awards-jump')).toHaveCount(0);
});

// Compare the redesigned cards with their frozen source nodes, independently of styling.
import source from '../content/pages/cnap-awards.json' with { type: 'json' };
test('Awards cards preserve all source wording and destinations', async ({ page }) => {
  await page.goto('/cnap-awards/');
  type Node = {
    type: string;
    value?: string;
    tag?: string;
    attrs?: Record<string, string>;
    source?: { elementorId?: string };
    children?: Node[];
  };
  const cards: Node[] = [];
  const cardIds = ['ae6e84a', 'fc8b74f', 'f7198d0', '6baacc9', 'e4e7e1a', '1b85b90', 'f727979'];
  const scan = (n: Node) => {
    if (cardIds.includes(n.source?.elementorId || '')) cards.push(n);
    n.children?.forEach(scan);
  };
  source.blocks.forEach((b) => b.nodes.forEach((n) => scan(n as Node)));
  const text = (n: Node): string =>
    n.type === 'text' ? n.value || '' : (n.children || []).map(text).join('');
  const normalize = (s: string) => s.replace(/\s+/g, '');
  for (let i = 0; i < cards.length; i++) {
    const rendered = page.locator('[data-award-card]').nth(i);
    expect(normalize((await rendered.textContent()) || '')).toBe(normalize(text(cards[i])));
    const links: string[] = [];
    const collect = (n: Node) => {
      if (n.tag === 'a' && n.attrs?.href) links.push(n.attrs.href);
      n.children?.forEach(collect);
    };
    collect(cards[i]);
    const actual = await rendered
      .locator('a[href]')
      .evaluateAll((es) => es.map((e) => e.getAttribute('href')));
    expect(actual).toEqual(links.map((h) => h.replace('https://yourcnastory.org', '')));
  }
});
