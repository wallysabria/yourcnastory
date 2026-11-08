import type { Metadata } from 'next';
import sourceHeads from '@/content/seo/source-head.json' with { type: 'json' };
import { counterpartFor } from './routing';
import type { RouteRecord } from './content-schema';
export const origin = 'https://yourcnastory.org';
export const isIndexable =
  process.env.VERCEL_ENV === 'production' && process.env.SITE_LAUNCH_APPROVED === 'true';
export function metadataFor(route: RouteRecord, indexable = isIndexable): Metadata {
  const data = route.metadata;
  const head = (
    sourceHeads as Record<
      string,
      {
        ogType: string;
        ogPublishedTime: string;
        lastModified: string | null;
        ogLocale: string;
        ogSiteName: string;
        ogImageWidth: string;
        ogImageHeight: string;
        ogImageType: string;
        ogImageAlt: string;
      }
    >
  )[route.path];
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
    robots: indexable ? data?.robots || 'index, follow' : { index: false, follow: false },
    openGraph: {
      title: data?.ogTitle || data?.title,
      description: data?.ogDescription || data?.description,
      url: origin + route.path,
      locale: head?.ogLocale || (route.locale === 'es' ? 'es_ES' : 'en_US'),
      ...(head?.ogType === 'article'
        ? {
            type: 'article' as const,
            publishedTime: head.ogPublishedTime || undefined,
            modifiedTime: head.lastModified || undefined,
          }
        : { type: 'website' as const }),
      siteName: head?.ogSiteName || undefined,
      images: data?.ogImage
        ? [
            {
              url: data.ogImage,
              ...(head?.ogImageWidth ? { width: Number(head.ogImageWidth) } : {}),
              ...(head?.ogImageHeight ? { height: Number(head.ogImageHeight) } : {}),
              ...(head?.ogImageAlt ? { alt: head.ogImageAlt } : {}),
              ...(head?.ogImageType ? { type: head.ogImageType } : {}),
            },
          ]
        : [],
    },
  };
}
