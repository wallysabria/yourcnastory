import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { globalContent } from '@/lib/global-content';
import { employersEnabled, counterpartFor, routeAt, routeFor } from '@/lib/routing';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import '../globals.css';
const manrope = localFont({
  src: '../../public/fonts/manrope-variable.ttf',
  weight: '200 800',
  display: 'swap',
  variable: '--font-manrope',
});
export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const locale = slug[0] === 'es' ? 'es' : 'en';
  const route = routeAt('/' + slug.join('/'));
  const content = globalContent(locale);
  const counterpart = route ? counterpartFor(route) : undefined;
  const home = routeFor('/', locale);
  return (
    <html lang={locale} className={manrope.variable}>
      <body>
        <a className="skip-link" href="#content">
          {content.ui.skip}
        </a>
        <SiteHeader
          content={content}
          enabled={employersEnabled}
          homeHref={home?.path || '/'}
          counterpartHref={counterpart?.section === 'employers' ? null : counterpart?.path || null}
          transparent={route?.id === '/' || route?.id === '/career-seekers/'}
        />
        {children}
        <div id="chat-root" data-chat-placeholder />
        <SiteFooter content={content} />
      </body>
    </html>
  );
}
