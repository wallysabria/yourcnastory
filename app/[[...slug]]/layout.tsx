import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { globalContent } from '@/lib/global-content';
import { employersEnabled, counterpartFor, routeAt, routeFor } from '@/lib/routing';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import '../globals.css';
import '../content.css';
import '../privacy.css';
import { PrivacyCenter } from '@/components/privacy-center';
import { trackingConfig } from '@/lib/tracking-config';
const manrope = localFont({
  src: '../../public/fonts/manrope-variable.woff2',
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
          transparent={true}
        />
        {children}
        <div id="chat-root" data-chat-placeholder />
        <SiteFooter content={content} />
        <PrivacyCenter locale={locale} tracking={trackingConfig()} />
      </body>
    </html>
  );
}
