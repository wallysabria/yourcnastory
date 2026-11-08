/* eslint-disable @next/next/no-css-tags -- Audited route-specific CSS uses React stylesheet precedence and resource deduplication. */
import { structuredData, serializeStructuredData } from '@/lib/structured-data';
import { contentAt } from '@/lib/content-pages';
import layouts from '@/content/layout/pages.json' with { type: 'json' };
import styleBundles from '@/content/layout/style-bundles.json' with { type: 'json' };
import metrics from '@/content/layout/metrics.json' with { type: 'json' };
import { renderSourceNode, type PageLayout } from '@/components/source-content';
import type { CSSProperties } from 'react';
import type { ContentNode } from '@/lib/content-schema';
import { notFound } from 'next/navigation';
import { metadataFor } from '@/lib/metadata';
import { renderableRoutes, routeAt } from '@/lib/routing';
export const dynamicParams = false;
export function generateStaticParams() {
  return renderableRoutes().map((route) => ({ slug: route.path.split('/').filter(Boolean) }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const route = routeAt('/' + slug.join('/'));
  return route ? metadataFor(route) : {};
}
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const route = routeAt('/' + slug.join('/'));
  if (!route || route.section === 'employers') notFound();
  const page = contentAt(route.path);
  if (!page) notFound();
  const layout = (layouts as unknown as Record<string, PageLayout>)[route.path];
  const measurement = (
    metrics as Record<string, { desktop: { headerSpace: number }; mobile: { headerSpace: number } }>
  )[route.path];
  const headings: Record<string, number> = {};
  let previousLevel = 0;
  const headingEntries: { key: string; level: number; text: string; tag: string; id?: string }[] =
    [];
  const nodeText = (node: ContentNode): string =>
    node.type === 'text' ? node.value : node.children.map(nodeText).join('');
  function collect(node: ContentNode, key: string) {
    if (node.type !== 'element') return;
    if (/^h[1-6]$/.test(node.tag)) {
      headingEntries.push({
        key,
        level: Number(node.tag[1]),
        text: nodeText(node),
        tag: node.tag,
        id: node.attrs.id,
      });
    }
    node.children.forEach((child, i) => collect(child, key + '.' + i));
  }
  page.blocks.forEach((block) => {
    if (block.type === 'document') block.nodes.forEach((node, i) => collect(node, String(i)));
  });
  const hasPrimary = headingEntries.some((entry) => entry.level === 1);
  for (const [index, entry] of headingEntries.entries()) {
    const level = index === 0 && !hasPrimary ? 1 : Math.min(entry.level, (previousLevel || 1) + 1);
    headings[entry.key] = level;
    previousLevel = level;
  }
  const toc =
    layout.template === 'privacy' ||
    route.path.includes('privacy-policy') ||
    route.path.includes('politica-de-privacidad')
      ? headingEntries
          .filter((entry) => ['h2', 'h3'].includes(entry.tag))
          .map((entry, index) => ({
            key: entry.key,
            id: entry.id || 'elementor-toc__heading-anchor-' + index,
            text: entry.text,
            level: entry.level,
          }))
      : [];
  const style = {
    '--desktop-header-space': measurement.desktop.headerSpace + 'px',
    '--mobile-header-space': measurement.mobile.headerSpace + 'px',
  } as CSSProperties;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData(route)) }}
      />
      {layout.template === 'homepage' && (
        <link
          rel="preload"
          as="image"
          href="/images/content/cna-header-fallback-32529c1e.webp"
          fetchPriority="high"
        />
      )}
      <link rel="stylesheet" href="/styles/source/fonts.css" precedence="content-fonts" />
      {(styleBundles as Record<string, string[]>)[route.path].map((url) => (
        <link key={url} rel="stylesheet" href={url} precedence="source-content" />
      ))}
      <div className="source-document">
        <div
          className={'page-content ' + layout.bodyClasses}
          style={style}
          data-template={layout.template}
          data-pagefind-body
          data-pagefind-meta={'title:' + route.metadata?.title}
        >
          <div id="page">
            {page.blocks.flatMap((block) =>
              block.type === 'document'
                ? block.nodes.map((node, i) =>
                    renderSourceNode(node, String(i), {
                      locale: route.locale,
                      layout,
                      headings,
                      toc,
                    }),
                  )
                : [],
            )}
          </div>
        </div>
      </div>
    </>
  );
}
