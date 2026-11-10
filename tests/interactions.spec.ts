import { test, expect } from '@playwright/test';
for (const locale of ['en', 'es']) {
  test('search language, clear, empty state and focus ' + locale, async ({ page }) => {
    await page.goto(locale === 'es' ? '/es/' : '/');
    const trigger = page.locator('.search-toggle');
    await trigger.click();
    const input = page.getByRole('searchbox');
    await expect(input).toBeFocused();
    await input.fill(locale === 'es' ? 'enfermería' : 'nursing');
    await expect(page.locator('.search-results a').first()).toBeVisible();
    const urls = await page
      .locator('.search-results a')
      .evaluateAll((es) => es.map((e) => e.getAttribute('href')!));
    expect(
      urls.every((url) => (locale === 'es' ? url.startsWith('/es/') : !url.startsWith('/es/'))),
    ).toBe(true);
    await input.press('ArrowDown');
    await expect(page.locator('.search-results a').first()).toBeFocused();
    await input.fill('zzzznonexistentquery');
    await expect(page.locator('.search-results a')).toHaveCount(0);
    await expect(page.locator('.search-status')).toContainText(locale === 'es' ? 'No' : 'No');
    await page.locator('.search-clear').click();
    await expect(input).toHaveValue('');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });
}
test('FAQ and video dialogs support keyboard and restore focus', async ({ page }) => {
  await page.route(/youtube\.com/, (r) => r.abort());
  await page.goto('/frequently-asked-questions/');
  const question = page.locator('button.elementor-tab-title').first();
  await question.focus();
  await question.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await question.press('Space');
  await expect(question).toHaveAttribute('aria-expanded', 'false');
  await page.goto('/cna-training-providers/');
  const video = page.locator('.native-video-trigger').first();
  await video.focus();
  await video.press('Enter');
  await expect(page.locator('.native-video-dialog[open] iframe')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(video).toBeFocused();
  await expect(page.locator('.native-video-dialog iframe')).toHaveCount(0);
});
test('form errors are accessible and a double submit makes one mock request', async ({ page }) => {
  await page.goto('/career-seekers/');
  const form = page.locator('.native-signup');
  await form.locator('[type=submit]').click();
  await expect(form.locator('[name=FNAME]')).toBeFocused();
  await expect(form.locator('[name=FNAME]')).toHaveAttribute('aria-invalid', 'true');
  for (const [name, value] of Object.entries({
    FNAME: 'Test',
    LNAME: 'Person',
    MMERGE4: '90210',
    EMAIL: 'test@example.invalid',
  }))
    await form.locator('[name=' + name + ']').fill(value);
  await form.locator('[name=MMERGE3][value=English]').check();
  let requests = 0;
  await page.route('**/api/signup/', async (route) => {
    requests++;
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.fulfill({ json: { code: 'mock', fields: [] } });
  });
  await form.evaluate((f: HTMLFormElement) => {
    f.requestSubmit();
    f.requestSubmit();
  });
  await expect(form.locator('[role=status]').last()).toContainText('No subscription');
  expect(requests).toBe(1);
});

test('server signup validates, accepts mock input and rate limits without external requests', async ({
  request,
}) => {
  const input = {
    firstName: 'Test',
    lastName: 'Person',
    zip: '90210',
    email: 'test@example.invalid',
    sms: '',
    countryCode: '+1',
    language: 'es',
  };
  const endpoint = '/api/signup/';
  const headers = { 'x-real-ip': '192.0.2.44' };
  const invalid = await request.post(endpoint, { headers, data: { ...input, email: 'invalid' } });
  expect(invalid.status()).toBe(400);
  expect((await invalid.json()).fields).toContain('email');
  const accepted = await request.post(endpoint, { headers, data: input });
  expect(accepted.status()).toBe(200);
  expect((await accepted.json()).code).toBe('mock');
  expect(accepted.headers()['cache-control']).toBe('no-store');
  for (let i = 0; i < 4; i++)
    expect((await request.post(endpoint, { headers, data: input })).status()).toBe(200);
  const limited = await request.post(endpoint, { headers, data: input });
  expect(limited.status()).toBe(429);
  expect(limited.headers()['retry-after']).toBeTruthy();
  expect(
    (
      await request.post(endpoint, { headers: { origin: 'https://example.invalid' }, data: input })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post(endpoint, { headers: { 'content-type': 'application/json' }, data: '{' })
    ).status(),
  ).toBe(400);
});

test('privacy contents links preserve anchors and collapse on mobile', async ({ page }) => {
  await page.goto('/privacy-policy/');
  const contents = page.locator('nav.elementor-widget-table-of-contents');
  await expect(contents.locator('ol a')).toHaveCount(8);
  const security = contents.getByRole('link', { name: 'Security', exact: true });
  await security.click();
  await expect(page).toHaveURL(/#elementor-toc__heading-anchor-2$/);
  await expect(page.locator('#elementor-toc__heading-anchor-2')).toHaveText('Security');
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = contents.locator('button');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.focus();
  await toggle.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});
test('search includes collapsed FAQ answer text and carousel motion controls respond', async ({
  page,
}) => {
  await page.goto('/');
  const pause = page.locator('.native-carousel .native-motion-toggle').first();
  await pause.click();
  await expect(pause).toHaveAttribute('aria-label', 'Play');
  await page.locator('.search-toggle').click();
  await page.getByRole('searchbox').fill('steppingstone');
  await expect(
    page.locator('.search-results a[href="/frequently-asked-questions/"]'),
  ).toBeVisible();
});

test('career content grids stay readable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/career-seekers/');
  const card = page.locator('.wf-cell.shown').first();
  await expect(card).toBeVisible();
  await expect(card).toHaveCSS('opacity', '1');
  await page.goto('/careerpaths/careers-in-activities/');
  await expect(page.locator('.wf-cell.shown').first()).toHaveCSS('opacity', '1');
});

for (const path of ['/careerpaths/careers-in-nursing/', '/es/carreras/carreras-en-enfermeria/']) {
  test('career jump links stay on their current page ' + path, async ({ page }) => {
    await page.goto(path);
    await page.locator('.privacy-banner .privacy-action').nth(1).click();
    const jump = page.locator('a[href="#mds-coordinator"]').first();
    await expect(jump).toHaveCount(1);
    await jump.click();
    await expect(page).toHaveURL(new RegExp(path + '#mds-coordinator$'));
    await expect(page.locator('[id="mds-coordinator"]')).toBeVisible();
  });
}
for (const [locale, path] of [
  ['en', '/frequently-asked-questions/'],
  ['es', '/es/preguntas-frecuentes/'],
]) {
  for (const width of [1440, 390]) {
    test(`every FAQ answer visibly opens and closes ${locale} @ ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      const questions = page.locator('button.elementor-tab-title');
      await expect(questions).toHaveCount(11);
      for (let i = 0; i < 11; i++) {
        const question = questions.nth(i);
        const panelId = await question.getAttribute('aria-controls');
        expect(panelId).toBeTruthy();
        const answer = page.locator(`[id="${panelId}"]`);
        await expect(answer).toBeHidden();
        await question.click();
        await expect(question).toHaveAttribute('aria-expanded', 'true');
        await expect(answer).toBeVisible();
        await expect(answer).toContainText(/\S/);
        await question.press('Space');
        await expect(question).toHaveAttribute('aria-expanded', 'false');
        await expect(answer).toBeHidden();
        await question.press('Enter');
        await expect(answer).toBeVisible();
        await question.click();
        await expect(answer).toBeHidden();
      }
    });
  }
}
