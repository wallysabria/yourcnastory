import type { Metadata } from 'next';
import { counterpartFor } from './routing';
import type { RouteRecord } from './content-schema';
export const origin = 'https://yourcnastory.org';
export const isIndexable =
  process.env.VERCEL_ENV === 'production' && process.env.SITE_LAUNCH_APPROVED === 'true';
export function metadataFor(route: RouteRecord): Metadata {
  const data = route.metadata;
  const counterpart = counterpartFor(route);
  const english = route.locale === 'en' ? route : counterpart;
  const languages: Record<string, string> = { [route.locale]: origin + route.path };
  if (counterpart) languages[counterpart.locale] = origin + counterpart.path;
  if (english) languages['x-default'] = origin + english.path;
  return {
    title: data?.title,
    description: data?.description,
    metadataBase: new URL(origin),
    alternates: { canonical: route.path, languages },
    robots: isIndexable
      ? { index: !data?.robots.includes('noindex'), follow: !data?.robots.includes('nofollow') }
      : { index: false, follow: false },
    openGraph: {
      title: data?.ogTitle || data?.title,
      description: data?.ogDescription || data?.description,
      url: origin + route.path,
      locale: route.locale === 'es' ? 'es_MX' : 'en_US',
      images: data?.ogImage ? [data.ogImage] : [],
    },
  };
}
