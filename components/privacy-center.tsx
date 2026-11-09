'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import messages from '@/content/ui/privacy.json';
import type { Locale } from '@/lib/content-schema';
import type { OptionalConsent, TrackingConfig } from '@/lib/privacy-policy';
import {
  getPrivacySnapshot,
  getServerPrivacySnapshot,
  subscribePrivacy,
  hydratePrivacy,
  savePrivacy,
  openPrivacy,
  effectiveConsent,
} from '@/lib/privacy-store';
import { startTelemetry, setTrackingRoute } from '@/lib/telemetry';
export function PrivacyChoices({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      className="privacy-choices-button"
      onClick={(event) => {
        event.currentTarget.focus();
        openPrivacy();
      }}
    >
      {messages[locale].footer}
    </button>
  );
}
export function PrivacyCenter({ locale, tracking }: { locale: Locale; tracking: TrackingConfig }) {
  const state = useSyncExternalStore(
    subscribePrivacy,
    getPrivacySnapshot,
    getServerPrivacySnapshot,
  );
  const pathname = usePathname();
  const t = messages[locale];
  const [panel, setPanel] = useState(false),
    [draft, setDraft] = useState<OptionalConsent>({ analytics: false, advertising: false }),
    [status, setStatus] = useState('');
  const dialog = useRef<HTMLDialogElement>(null),
    banner = useRef<HTMLElement>(null),
    opener = useRef<HTMLElement | null>(null);
  const { mode, containerId } = tracking;
  const hosts = tracking.allowedHosts.join(',');
  useEffect(() => {
    const stop = startTelemetry({ mode, containerId, allowedHosts: hosts.split(',') });
    hydratePrivacy();
    return stop;
  }, [mode, containerId, hosts]);
  useEffect(() => {
    setTrackingRoute(pathname);
  }, [pathname]);
  useEffect(() => {
    const open = () => {
      opener.current = document.activeElement as HTMLElement;
      setDraft(effectiveConsent());
      setPanel(true);
    };
    window.addEventListener('ycna:open-privacy', open);
    return () => window.removeEventListener('ycna:open-privacy', open);
  }, []);
  useEffect(() => {
    if (!panel) return;
    const el = dialog.current;
    if (!el) return;
    el.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (el.open) el.close();
      document.body.style.overflow = previous;
    };
  }, [panel]);
  const showBanner = state.ready && !state.choice && !state.signal;
  useEffect(() => {
    if (!showBanner) {
      document.documentElement.style.removeProperty('--privacy-banner-height');
      return;
    }
    const el = banner.current;
    if (!el) return;
    const measure = () =>
      document.documentElement.style.setProperty(
        '--privacy-banner-height',
        el.getBoundingClientRect().height + 'px',
      );
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--privacy-banner-height');
    };
  }, [showBanner, locale]);
  function close() {
    setPanel(false);
    const target = opener.current?.isConnected
      ? opener.current
      : document.querySelector<HTMLElement>('.search-toggle');
    target?.focus();
  }
  function choose(value: OptionalConsent) {
    savePrivacy(value);
    setStatus(getPrivacySnapshot().storageAvailable ? t.saved : t.savedSession);
    if (panel) close();
  }
  const signal = state.signal ? t[state.signal] : '';
  return (
    <>
      {showBanner && (
        <section
          className="privacy-banner"
          ref={banner}
          aria-labelledby="privacy-banner-title"
          data-pagefind-ignore
        >
          <div className="privacy-banner-copy">
            <h2 id="privacy-banner-title">{t.title}</h2>
            <p>{t.description}</p>
            <a href={locale === 'es' ? '/es/politica-de-privacidad/' : '/privacy-policy/'}>
              {t.policy}
            </a>
            {!state.storageAvailable && <p role="status">{t.storageUnavailable}</p>}
          </div>
          <div className="privacy-actions">
            <button
              type="button"
              className="privacy-action"
              onClick={() => choose({ analytics: true, advertising: true })}
            >
              {t.accept}
            </button>
            <button
              type="button"
              className="privacy-action"
              onClick={() => choose({ analytics: false, advertising: false })}
            >
              {t.decline}
            </button>
            <button
              type="button"
              className="privacy-manage"
              onClick={(event) => {
                event.currentTarget.focus();
                openPrivacy();
              }}
            >
              {t.manage}
            </button>
          </div>
        </section>
      )}
      <dialog
        ref={dialog}
        className="privacy-dialog"
        aria-labelledby="privacy-dialog-title"
        onCancel={() => close()}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="privacy-dialog-content">
          <div className="privacy-dialog-heading">
            <h2 id="privacy-dialog-title">{t.title}</h2>
            <button type="button" className="privacy-close" aria-label={t.close} onClick={close}>
              ×
            </button>
          </div>
          <p>{t.description}</p>
          {signal && (
            <p className="privacy-signal" role="status">
              {signal}
            </p>
          )}
          <fieldset className="privacy-categories">
            <legend className="privacy-sr-only">{t.manage}</legend>
            <label>
              <input type="checkbox" checked disabled readOnly />
              <span>
                <strong>{t.necessary}</strong>
                <span>{t.necessaryDescription}</span>
              </span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={!state.signal && draft.analytics}
                disabled={!!state.signal}
                onChange={(event) => setDraft({ ...draft, analytics: event.target.checked })}
              />
              <span>
                <strong>{t.analytics}</strong>
                <span>{t.analyticsDescription}</span>
              </span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={!state.signal && draft.advertising}
                disabled={!!state.signal}
                onChange={(event) => setDraft({ ...draft, advertising: event.target.checked })}
              />
              <span>
                <strong>{t.advertising}</strong>
                <span>{t.advertisingDescription}</span>
              </span>
            </label>
          </fieldset>
          {!state.storageAvailable && <p role="status">{t.storageUnavailable}</p>}
          <div className="privacy-dialog-actions">
            <button type="button" className="privacy-action" onClick={() => choose(draft)}>
              {t.save}
            </button>
            <button
              type="button"
              className="privacy-action"
              onClick={() => choose({ analytics: false, advertising: false })}
            >
              {t.decline}
            </button>
          </div>
          <a
            className="privacy-policy-link"
            href={locale === 'es' ? '/es/politica-de-privacidad/' : '/privacy-policy/'}
          >
            {t.policy}
          </a>
        </div>
      </dialog>
      <p role="status" className="privacy-sr-only" aria-live="polite">
        {status}
      </p>
    </>
  );
}
