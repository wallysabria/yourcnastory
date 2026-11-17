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
      await test.info().attach('axe-source-audit', {
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

for (const width of [1440, 768, 390, 320])
  test(`Train and Gain placeholder never submits at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const submissions: string[] = [];
    page.on('request', (r) => {
      if (r.method() === 'POST') submissions.push(r.url());
    });
    await page.goto('/train-and-gain/');
    const box = page.locator('[data-form-placeholder]');
    await expect(box.getByRole('note')).toHaveText(
      'Form preview only — submissions are not available yet.',
    );
    await expect(box.locator('form')).toHaveCount(0);
    for (const field of await box.locator('input:not([type=hidden]),select,textarea').all())
      await expect(field).toBeDisabled();
    expect(submissions).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  });

for (const [path, ids] of [
  ['/employers/', ['u57NKWBtly4', 'rkUeBvfv-Vc']],
  ['/train-and-gain/', ['Re_NAsAbiBE']],
] as const)
  test(`New Employer videos load only in a lightbox ${path}`, async ({ page }) => {
    const providerRequests: string[] = [];
    page.on('request', (r) => {
      if (/youtube\.com|ytimg\.com/.test(r.url())) providerRequests.push(r.url());
    });
    await page.route('**/*', (r) =>
      /youtube\.com|ytimg\.com/.test(r.request().url()) ? r.abort() : r.continue(),
    );
    await page.goto(path);
    await page.getByRole('button', { name: 'Decline all optional tools', exact: true }).click();
    const triggers = page.locator('button.native-video-poster');
    await expect(triggers).toHaveCount(ids.length);
    expect(providerRequests).toEqual([]);
    for (let i = 0; i < ids.length; i++) {
      const trigger = triggers.nth(i);
      await trigger.scrollIntoViewIfNeeded();
      await trigger.focus();
      await trigger.press('Enter');
      const dialog = page.locator('dialog:visible');
      await expect(dialog.locator('iframe')).toHaveAttribute('src', new RegExp(ids[i]));
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      await expect(page.locator('iframe')).toHaveCount(0);
    }
  });

test('New Employer pages preserve anchors and have no passive WordPress dependencies', async ({
  page,
}) => {
  for (const slug of ['employers', 'train-and-gain', 'advocate']) {
    const requests: string[] = [];
    page.on('request', (r) => {
      if (new URL(r.url()).hostname === 'yourcnastory.org') requests.push(r.url());
    });
    await page.goto('/' + slug + '/');
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 800) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 20));
      }
    });
    expect(requests).toEqual([]);
  }
  await page.goto('/train-and-gain/');
  const image = page.locator('img.wp-image-101553');
  await image.scrollIntoViewIfNeeded();
  expect(await image.evaluate((e) => (e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(await image.evaluate((e) => getComputedStyle(e).maskImage)).toContain(
    '/images/icons/circle-',
  );
  for (const id of ['zane', 'program-works', 'program_works', 'contact_form'])
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
});

for (const width of [1440, 390])
  test(`All Employer pages omit desktop and mobile language options at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of release.approved) {
      await page.goto(path);
      await expect(page.locator('.language-menu')).toHaveCount(0);
      await expect(
        page.locator('.mobile-menu summary').filter({ hasText: /^(English|Español)$/ }),
      ).toHaveCount(0);
      await expect(page.locator('.mobile-menu a[lang]')).toHaveCount(0);
    }
    await page.goto('/career-seekers/');
    await expect(page.locator('.language-menu')).toHaveCount(1);
    await expect(page.locator('.mobile-menu a[lang=es]')).toHaveAttribute(
      'href',
      '/es/aspirantes/',
    );
  });

test('Spanish Career Seekers navigation keeps Empleadores and uses English Employer destinations', async ({
  page,
  request,
}) => {
  await page.goto('/es/aspirantes/');
  const employer = page.locator('.desktop-nav .nav-label').first();
  await expect(employer).toHaveText('Empleadores');
  await expect(employer).toHaveAttribute('href', '/employers/');
  await employer.hover();
  const panel = page.locator('#mega-0');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('lang', 'en');
  await expect(panel.getByRole('link', { name: 'PROGRAM OVERVIEW', exact: true })).toHaveAttribute(
    'href',
    '/employers/',
  );
  await expect(
    panel.getByRole('link', { name: 'FREQUENTLY ASKED QUESTIONS', exact: true }),
  ).toHaveAttribute('href', '/faqs/');
  const desktop = await panel
    .locator('a')
    .evaluateAll((es) => es.map((e) => ({ text: e.textContent, href: e.getAttribute('href') })));
  expect(desktop.length).toBeGreaterThan(10);
  expect(desktop.every((e) => !e.href?.startsWith('/es/'))).toBe(true);
  for (const href of new Set(desktop.map((e) => e.href!.split('#')[0])))
    expect((await request.get(href)).status()).toBe(200);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.locator('.privacy-banner .privacy-action').nth(1).click();
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
  const branch = page
    .locator('.mobile-menu nav > details')
    .filter({ has: page.getByText('Empleadores', { exact: true }) });
  await branch.locator(':scope > summary').click();
  const mobile = await branch
    .locator('a')
    .evaluateAll((es) => es.map((e) => ({ text: e.textContent, href: e.getAttribute('href') })));
  expect(mobile).toEqual(desktop);
  await expect(branch.locator(':scope > div')).toHaveAttribute('lang', 'en');
});
