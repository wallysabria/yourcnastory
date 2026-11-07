import sourceIndex from '../content/pages/index.json' with { type: 'json' };
import media from '../content/media/manifest.json' with { type: 'json' };
import { test, expect } from '@playwright/test';
import { load } from 'cheerio';
test('every extracted page renders in the inert content-review endpoint', async ({ request }) => {
  for (const entry of sourceIndex) {
    const response = await request.get(
      '/api/content-review/?path=' + encodeURIComponent(entry.path),
    );
    expect(response.status(), entry.path).toBe(200);
    expect(response.headers()['x-robots-tag']).toContain('noindex');
    const $ = load(await response.text());
    expect($('html').attr('lang')).toBe(entry.locale);
    expect($('#main').length).toBe(1);
    expect($('#main').text().trim().length).toBeGreaterThan(100);
    expect($('form,iframe,script,button,a[href]').length).toBe(0);
    expect($('input:not([disabled]),select:not([disabled]),textarea:not([disabled])').length).toBe(
      0,
    );
    expect(response.headers()['content-security-policy']).toContain("form-action 'none'");
  }
});
test('content-review cannot expose employer or filesystem paths', async ({ request }) => {
  for (const path of ['/employers/', '/faqs/', '../../.env.local', '/es/empresarios/'])
    expect(
      (await request.get('/api/content-review/?path=' + encodeURIComponent(path))).status(),
    ).toBe(404);
});
test('all imported media are served with the recorded byte length', async ({ request }) => {
  for (const row of media) {
    expect(row.path).toBeTruthy();
    const response = await request.head(row.path!);
    expect(response.status(), row.path!).toBe(200);
    expect(Number(response.headers()['content-length']), row.path!).toBe(row.bytes);
  }
});
