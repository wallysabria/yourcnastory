import { test, expect } from '@playwright/test';
import { load } from 'cheerio';
import { renderableRoutes } from '../lib/routing';
import { metadataFor, origin } from '../lib/metadata';
import { robotsPolicy, trainingAgents } from '../lib/seo';
import { serializeStructuredData } from '../lib/structured-data';
import sourceHeads from '../content/seo/source-head.json' with { type: 'json' };

test('launch robots separates discovery from training while staging blocks every crawler', () => {
  expect(robotsPolicy(false)).toEqual({ rules: { userAgent: '*', disallow: '/' } });
  const launch = robotsPolicy(true);
  expect(launch.sitemap).toBe(origin + '/sitemap.xml');
  const rules = launch.rules as {
    userAgent: string | string[];
    allow?: string;
    disallow: string | string[];
  }[];
  expect(rules[0].allow).toBe('/');
  expect(rules[1].userAgent).toEqual(trainingAgents);
  expect(rules[1].disallow).toBe('/');
  expect(trainingAgents).not.toContain('OAI-SearchBot');
  expect(trainingAgents).not.toContain('Claude-SearchBot');
  for (const route of renderableRoutes())
    expect(metadataFor(route, true).robots).toBe(route.metadata?.robots);
});
test('JSON-LD serialization cannot terminate its script element', () => {
  const value = { name: '</script><script>unexpected()</script>' };
  const serialized = serializeStructuredData(value);
  expect(serialized).not.toContain('<');
  expect(JSON.parse(serialized)).toEqual(value);
});
test('all pages preserve metadata, reciprocal languages, source OG fields and real heading tags', async ({
  request,
}) => {
  for (const route of renderableRoutes()) {
    const response = await request.get(route.path);
    expect(response.status()).toBe(200);
    expect(response.headers()['x-robots-tag']).toContain('noindex');
    const $ = load(await response.text());
    const head = (
      sourceHeads as Record<string, { ogType: string; ogLocale: string; lastModified: string }>
    )[route.path];
    expect($('title').text()).toBe(route.metadata?.title);
    expect($('meta[name=description]').attr('content') || '').toBe(route.metadata?.description);
    expect($('link[rel=canonical]')).toHaveLength(1);
    expect($('link[rel=canonical]').attr('href')).toBe(origin + route.path);
    expect($('meta[property="og:type"]').attr('content')).toBe(head.ogType);
    expect($('meta[property="og:locale"]').attr('content')).toBe(head.ogLocale);
    expect($('meta[property="og:title"]').attr('content')).toBe(
      route.metadata?.ogTitle || route.metadata?.title,
    );
    expect($('meta[property="og:description"]').attr('content')).toBe(
      route.metadata?.ogDescription || route.metadata?.description,
    );
    expect($('meta[property="og:image"]').attr('content') || '').toBe(route.metadata?.ogImage);
    const alternate = $('link[rel=alternate]')
      .map((_, e) => ({ lang: $(e).attr('hreflang'), href: $(e).attr('href') }))
      .get();
    expect(alternate).toContainEqual({ lang: route.locale, href: origin + route.path });
    expect(alternate.some((a) => a.lang === 'vi' || a.lang === 'zh')).toBe(false);
    expect(alternate).toContainEqual({
      lang: route.locale === 'en' ? 'es' : 'en',
      href: origin + route.counterpart,
    });
    expect(alternate.find((a) => a.lang === 'x-default')?.href).toBe(
      origin + (route.locale === 'en' ? route.path : route.counterpart),
    );
    expect($('h1')).toHaveLength(1);
    $('#main [role=heading]').each((_, e) => expect(e.tagName).toBe('h' + $(e).attr('aria-level')));
    const graph = JSON.parse($('script[type="application/ld+json"]').text());
    expect(graph['@context']).toBe('https://schema.org');
    const types = graph['@graph'].map((n: { '@type': string }) => n['@type']);
    expect(types).toContain('Organization');
    expect(types).toContain('WebSite');
    expect(types).toContain('BreadcrumbList');
    const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
    const faqs =
      route.template === 'faq-accordion'
        ? $('.page-content .elementor-accordion-item')
            .map((_, item) => ({
              question: normalize($(item).find('.elementor-tab-title').text()),
              answer: normalize($(item).find('.elementor-tab-content').text()),
            }))
            .get()
        : [];
    const webpage = graph['@graph'].find((n: { '@type': string }) =>
      ['WebPage', 'FAQPage'].includes(n['@type']),
    );
    expect(webpage.name).toBe(normalize($('h1').text()));
    if (faqs.length) {
      expect(webpage['@type']).toBe('FAQPage');
      expect(
        webpage.mainEntity.map((q: { name: string; acceptedAnswer: { text: string } }) => ({
          question: q.name,
          answer: q.acceptedAnswer.text,
        })),
      ).toEqual(faqs);
    }
    expect(types).not.toContain('JobPosting');
    expect(types).not.toContain('Review');
  }
});
test('language sitemap/index and llms links exclude Employers, retired languages and query URLs', async ({
  request,
}) => {
  const index = load(await (await request.get('/sitemap.xml')).text(), { xml: true });
  expect(
    index('sitemap loc')
      .map((_, e) => index(e).text())
      .get(),
  ).toEqual([origin + '/sitemaps/en.xml', origin + '/sitemaps/es.xml']);
  for (const locale of ['en', 'es']) {
    const response = await request.get('/sitemaps/' + locale + '.xml');
    expect(response.status()).toBe(200);
    const $ = load(await response.text(), { xml: true });
    const urls = $('url loc')
      .map((_, e) => $(e).text())
      .get();
    expect(urls).toEqual(
      renderableRoutes()
        .filter((r) => r.locale === locale && !r.metadata?.robots.includes('noindex'))
        .map((r) => origin + r.path),
    );
    expect(urls.length).toBeGreaterThan(0);
    expect(
      urls.every(
        (url) =>
          !renderableRoutes()
            .find((r) => origin + r.path === url)
            ?.metadata?.robots.includes('noindex'),
      ),
    ).toBe(true);
    $('url').each((_, e) => {
      expect($(e).find('lastmod').text()).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect($(e).find('xhtml\\:link')).toHaveLength(3);
    });
  }
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /');
  expect(robots).not.toContain('Allow: /');
  const llms = await (await request.get('/llms.txt')).text();
  expect(llms).toContain('/es/programa-cna/');
  expect(llms).not.toContain('/employers/');
  expect(llms).not.toContain('jobboard.');
});
for (const [locale, path, query] of [
  ['en', '/', 'nursing'],
  ['es', '/es/', 'enfermería'],
])
  test('source-style search URLs work in ' + locale, async ({ page }) => {
    const response = await page.goto(path + '?s=' + encodeURIComponent(query));
    expect(response?.headers()['x-robots-tag']).toContain('noindex');
    await expect(page.locator('.site-search-dialog')).toBeVisible();
    await expect(page.getByRole('searchbox')).toHaveValue(query);
    await expect(page.locator('.search-results a').first()).toBeVisible();
    const paths = await page
      .locator('.search-results a')
      .evaluateAll((es) => es.map((e) => e.getAttribute('href') || ''));
    expect(
      paths.every((p) => (locale === 'es' ? p.startsWith('/es/') : !p.startsWith('/es/'))),
    ).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('.search-toggle')).toBeFocused();
  });
