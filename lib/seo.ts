import type { MetadataRoute } from 'next';
import { renderableRoutes, counterpartFor } from './routing';
import { isIndexable, origin } from './metadata';
import heads from '@/content/seo/source-head.json' with { type: 'json' };
import type { Locale } from './content-schema';
export const trainingAgents = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended'];
export function robotsPolicy(indexable = isIndexable): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/internal/', '/*?s='] },
      { userAgent: trainingAgents, disallow: '/' },
    ],
    sitemap: origin + '/sitemap.xml',
  };
}
const xml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
export function sitemapIndex() {
  return (
    '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    ['en', 'es']
      .map((locale) => '<sitemap><loc>' + origin + '/sitemaps/' + locale + '.xml</loc></sitemap>')
      .join('') +
    '</sitemapindex>'
  );
}
export function languageSitemap(locale: Locale) {
  return (
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    renderableRoutes()
      .filter((route) => route.locale === locale && !route.metadata?.robots.includes('noindex'))
      .map((route) => {
        const counterpart = counterpartFor(route);
        const alternatives = [
          route,
          ...(counterpart && counterpart.section !== 'employers' ? [counterpart] : []),
        ];
        const english = alternatives.find((r) => r.locale === 'en');
        const date = (heads as Record<string, { lastModified: string | null }>)[route.path]
          ?.lastModified;
        return (
          '<url><loc>' +
          xml(origin + route.path) +
          '</loc>' +
          (date ? '<lastmod>' + xml(date) + '</lastmod>' : '') +
          alternatives
            .map(
              (r) =>
                '<xhtml:link rel="alternate" hreflang="' +
                r.locale +
                '" href="' +
                xml(origin + r.path) +
                '"/>',
            )
            .join('') +
          (english
            ? '<xhtml:link rel="alternate" hreflang="x-default" href="' +
              xml(origin + english.path) +
              '"/>'
            : '') +
          '</url>'
        );
      })
      .join('') +
    '</urlset>'
  );
}
export const xmlResponse = (body: string) =>
  new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
