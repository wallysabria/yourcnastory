'use client';
import { externalLinkAttributes } from '@/lib/external-links';
import { SearchDialog } from './search-dialog';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { GlobalContent, MobileItem } from '@/lib/global-content';
import { hrefFor } from '@/lib/routing';
import { SiteLink } from './site-link';
import { CloseIcon, MenuIcon } from './icons';
import { useMegaMenu } from './use-mega-menu';
function MobileBranch({ item, enabled }: { item: MobileItem; enabled: boolean }) {
  return item.children.length ? (
    <details className="mobile-branch">
      <summary>{item.label}</summary>
      <div>
        {item.children.map((child) => (
          <MobileBranch key={child.label + child.href} item={child} enabled={enabled} />
        ))}
      </div>
    </details>
  ) : item.href ? (
    <SiteLink href={item.href} employer={item.employer} enabled={enabled}>
      {item.label}
    </SiteLink>
  ) : (
    <span>{item.label}</span>
  );
}
export function SiteHeader({
  content,
  homeHref,
  counterpartHref,
  transparent,
  enabled,
}: {
  content: GlobalContent;
  homeHref: string;
  counterpartHref: string | null;
  transparent: boolean;
  enabled: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60);
    const frame = requestAnimationFrame(update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
    };
  }, []);
  const overHero = transparent && !scrolled;
  const {
    active,
    bridgeStyle,
    nav,
    triggers,
    pointer,
    cancelTimers,
    close,
    enter,
    leave,
    keyDown,
    click,
    escape,
    focus,
  } = useMegaMenu();
  const dialog = useRef<HTMLDialogElement>(null);
  const currentLabel = content.locale === 'es' ? 'Español' : 'English';
  const otherLabel = content.locale === 'es' ? 'English' : 'Español';
  const announcement = content.announcement;
  const split = announcement?.linkLabel ? announcement.text.split(announcement.linkLabel) : [];
  return (
    <>
      {announcement?.enabled && announcement.text && (
        <div className="announcement">
          {split[0]}
          <a href={announcement.href} {...externalLinkAttributes(announcement.href)}>
            {announcement.linkLabel}
          </a>
          {split.slice(1).join(announcement.linkLabel)}
        </div>
      )}
      <header
        className={
          'site-header ' + (overHero ? 'over-hero' : '') + (scrolled ? ' is-scrolled' : '')
        }
        id="top"
      >
        <div className="header-inner">
          <button
            type="button"
            className="icon-button mobile-menu-toggle"
            aria-label={content.ui.openMenu}
            onClick={() => dialog.current?.showModal()}
          >
            <MenuIcon />
          </button>
          <Link href={homeHref} aria-label="CNAP" className="brand">
            <Image
              src={
                overHero
                  ? '/images/brand/cnap-logo-white.webp'
                  : '/images/brand/cnap-logo-color.webp'
              }
              alt=""
              width={170}
              height={85}
              priority
            />
          </Link>
          <nav
            className="desktop-nav"
            aria-label={content.ui.navigation}
            ref={nav}
            onKeyDown={escape}
            onClick={(event) => {
              const link = (event.target as Element).closest('a[href]');
              if (link && !link.classList.contains('nav-label')) close();
            }}
          >
            {content.nav.map((group, index) => (
              <div
                className="nav-group"
                key={group.label}
                onPointerEnter={(event) => enter(index, event)}
                onPointerLeave={leave}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) close();
                }}
              >
                {group.employer && !enabled ? (
                  <button
                    className="nav-label"
                    type="button"
                    aria-expanded={active === index}
                    aria-controls={'mega-' + index}
                    onFocus={() => focus(index)}
                    ref={(element) => {
                      triggers.current[index] = element;
                    }}
                    onPointerDown={(event) => {
                      pointer.current = event.pointerType;
                    }}
                    onKeyDown={(event) => keyDown(index, event)}
                    onClick={(event) => click(index, true, event)}
                  >
                    {group.label}
                  </button>
                ) : (
                  <Link
                    className="nav-label"
                    href={hrefFor(group.href)}
                    {...externalLinkAttributes(group.href)}
                    aria-haspopup="true"
                    aria-expanded={active === index}
                    aria-controls={'mega-' + index}
                    onFocus={() => focus(index)}
                    ref={(element) => {
                      triggers.current[index] = element;
                    }}
                    onPointerDown={(event) => {
                      pointer.current = event.pointerType;
                    }}
                    onKeyDown={(event) => keyDown(index, event)}
                    onClick={(event) => click(index, false, event)}
                  >
                    {group.label}
                  </Link>
                )}
                <div id={'mega-' + index} className="mega-panel" hidden={active !== index}>
                  <div className="mega-columns">
                    {group.columns.map((column) => (
                      <section key={column.title}>
                        <h2>{column.title}</h2>
                        <ul>
                          {column.items.map((item) => (
                            <li
                              key={item.label + item.href}
                              className={item.nested ? 'mega-subitem' : undefined}
                            >
                              <SiteLink href={item.href} employer={item.employer} enabled={enabled}>
                                {item.label}
                              </SiteLink>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <span
              className="mega-hover-bridge"
              aria-hidden="true"
              hidden={active === null}
              style={bridgeStyle}
              onPointerEnter={cancelTimers}
              onPointerLeave={leave}
            />
            <details className="language-menu" onFocus={close}>
              <summary>{currentLabel}</summary>
              <div>
                {counterpartHref ? (
                  <a href={counterpartHref} lang={content.locale === 'es' ? 'en' : 'es'}>
                    {otherLabel}
                  </a>
                ) : (
                  <span aria-disabled="true">{otherLabel}</span>
                )}
              </div>
            </details>
          </nav>
          <SearchDialog locale={content.locale === 'es' ? 'es' : 'en'} />
        </div>
      </header>
      <dialog ref={dialog} className="mobile-menu" aria-label={content.ui.navigation}>
        <div className="mobile-menu-heading">
          <h2>{content.ui.menu}</h2>
          <button
            className="icon-button"
            type="button"
            aria-label={content.ui.closeMenu}
            onClick={() => dialog.current?.close()}
          >
            <CloseIcon />
          </button>
        </div>
        <nav aria-label={content.ui.navigation}>
          {content.mobile.map((item) => (
            <MobileBranch key={item.label} item={item} enabled={enabled} />
          ))}
          <details className="mobile-branch">
            <summary>{currentLabel}</summary>
            <div>
              {counterpartHref ? (
                <a href={counterpartHref} lang={content.locale === 'es' ? 'en' : 'es'}>
                  {otherLabel}
                </a>
              ) : (
                <span aria-disabled="true">{otherLabel}</span>
              )}
            </div>
          </details>
        </nav>
      </dialog>
    </>
  );
}
