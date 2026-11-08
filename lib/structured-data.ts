import type { RouteRecord } from './content-schema';
import { origin } from './metadata';
import { globalContent } from './global-content';
import evidence from '@/content/seo/pages.json' with { type: 'json' };
import organization from '@/content/seo/organization.json' with { type: 'json' };
import { contentAt } from './content-pages';
export function structuredData(route: RouteRecord) {
  const url = origin + route.path;
  const home = route.locale === 'es' ? '/es/' : '/';
  const visible = globalContent(route.locale);
  const source = (
    evidence as Record<
      string,
      {
        name: string;
        breadcrumbs: { name: string; path: string }[];
        questions: { question: string; answer: string }[];
      }
    >
  )[route.path];
  if (!source || route.section === 'employers') return null;
  const orgId = origin + '/#organization';
  const siteId = origin + home + '#website';
  const pageId = url + '#webpage';
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: organization.name,
      url: organization.url,
      description: visible.footer.description,
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      url: origin + home,
      name: organization.siteName,
      inLanguage: route.locale,
      publisher: { '@id': orgId },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: origin + home + '?s={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': source.questions.length ? 'FAQPage' : 'WebPage',
      '@id': pageId,
      url,
      name: source.name || route.heading || route.metadata?.ogTitle,
      inLanguage: route.locale,
      isPartOf: { '@id': siteId },
      publisher: { '@id': orgId },
      breadcrumb: { '@id': url + '#breadcrumb' },
      ...(source.questions.length
        ? {
            mainEntity: source.questions.map((q) => ({
              '@type': 'Question',
              name: q.question,
              acceptedAnswer: { '@type': 'Answer', text: q.answer },
            })),
          }
        : {}),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': url + '#breadcrumb',
      itemListElement: source.breadcrumbs.map((b, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: b.name,
        item: origin + b.path,
      })),
    },
  ];
  if (route.template === 'careerpath-entry') {
    const page = contentAt(route.path);
    let heading = '';
    const visit = (node: import('./content-schema').ContentNode) => {
      if (node.type !== 'element' || heading) return;
      if (/^h[1-6]$/.test(node.tag)) {
        const text = (n: import('./content-schema').ContentNode): string =>
          n.type === 'text' ? n.value : n.children.map(text).join('');
        heading = text(node).trim();
      } else node.children.forEach(visit);
    };
    page?.blocks.forEach((b) => {
      if (b.type === 'document') b.nodes.forEach(visit);
    });
    if (heading) {
      graph.push({
        '@type': 'Occupation',
        '@id': url + '#occupation',
        name: heading,
        mainEntityOfPage: { '@id': pageId },
      });
      graph[2].mainEntity = { '@id': url + '#occupation' };
    }
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
export const serializeStructuredData = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c');
