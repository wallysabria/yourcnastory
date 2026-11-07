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
  const hero = route.id === '/' || route.id === '/career-seekers/';
  return (
    <main
      id="content"
      className={'foundation-page ' + (hero ? 'foundation-hero' : '')}
      tabIndex={-1}
      data-pagefind-body
      data-pagefind-meta={'title:' + route.metadata?.title}
    >
      <h1>{route.heading}</h1>
    </main>
  );
}
