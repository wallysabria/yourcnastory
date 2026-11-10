import { externalLinkAttributes } from '@/lib/external-links';
import Image from 'next/image';
import type { GlobalContent } from '@/lib/global-content';
import { employersEnabled } from '@/lib/routing';
import { SiteLink } from './site-link';
import { PrivacyChoices } from './privacy-center';
export function SiteFooter({ content }: { content: GlobalContent }) {
  const footer = content.footer;
  const copyright = footer.copyright.split(footer.copyrightLinkLabel);
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-about">
          <a href={footer.foundationHref} {...externalLinkAttributes(footer.foundationHref)}>
            <Image
              src="/images/brand/qchf-logo-white.png"
              alt={footer.logoAlt}
              width={190}
              height={90}
            />
          </a>
          <p>{footer.description}</p>
        </div>
        {footer.columns.map((column) => (
          <section key={column.title}>
            <h2>
              {column.href ? (
                <SiteLink href={column.href} employer={column.employer} enabled={employersEnabled}>
                  {column.title}
                </SiteLink>
              ) : (
                column.title
              )}
            </h2>
            <ul>
              {column.items.map((item) => (
                <li key={item.label + item.href}>
                  <SiteLink href={item.href} employer={item.employer} enabled={employersEnabled}>
                    {item.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="footer-bottom">
        <p>
          {copyright[0]}
          <a href={footer.foundationHref} {...externalLinkAttributes(footer.foundationHref)}>
            {footer.copyrightLinkLabel}
          </a>
          {copyright.slice(1).join(footer.copyrightLinkLabel)}
        </p>
        <div className="footer-privacy-links">
          <SiteLink href={footer.policy.href}>{footer.policy.label}</SiteLink>
          <PrivacyChoices locale={content.locale === 'es' ? 'es' : 'en'} />
        </div>
      </div>
      <a className="back-to-top" href="#top" aria-label={content.ui.top}>
        ↑
      </a>
    </footer>
  );
}
