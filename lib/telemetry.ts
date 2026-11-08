import { routeAt } from './routing';
import { consentSignals, type OptionalConsent, type TrackingConfig } from './privacy-policy';
import { effectiveConsent, subscribePrivacy } from './privacy-store';
import links from '@/content/integrations/tracking-links.json';
export type SiteEvent =
  | { name: 'page_view' }
  | { name: 'generate_lead'; form: 'career-signup' }
  | { name: 'outbound_click'; linkKey: string; host: string }
  | { name: 'file_download'; documentKey: string; extension: string }
  | { name: 'site_search'; queryLength: number; resultCount: number }
  | { name: 'search_result_click'; resultPath: string; position: number }
  | { name: 'scroll'; percent: 90 };
export type ReservedChatEvent = 'chat_open' | 'chat_message_sent' | 'chat_signup_success';
export type MockRecord = {
  vendor: 'ga4' | 'clarity' | 'google_ads' | 'floodlight' | 'mntn';
  action: 'eligible' | 'event';
  event?: string;
  parameters?: Record<string, string | number>;
};
type ClarityFunction = ((...args: unknown[]) => void) & { q?: IArguments[] };
declare global {
  interface Window {
    dataLayer?: unknown[];
    clarity?: ClarityFunction;
    __ycnaMockEvents?: MockRecord[];
  }
}
let config: TrackingConfig = { mode: 'off', containerId: '', allowedHosts: [] };
let currentPath = '',
  lastPage = '',
  scrollDone = false,
  previous: OptionalConsent = { analytics: false, advertising: false },
  liveLoaded = false;
function record(record: MockRecord) {
  if (config.mode !== 'mock') return;
  const list = (window.__ycnaMockEvents ||= []);
  list.push(record);
  if (list.length > 100) list.shift();
  window.dispatchEvent(new CustomEvent('ycna:tracking', { detail: record }));
}
function googleConsent(action: 'default' | 'update', consent: OptionalConsent) {
  const layer = (window.dataLayer ||= []);
  // Preserve the documented gtag arguments queue format; no SDK/network is loaded here.
  (
    (function () {
      // eslint-disable-next-line prefer-rest-params -- Google consumes the documented Arguments queue format.
      layer.push(arguments);
    }) as (...args: unknown[]) => void
  )('consent', action, consentSignals(consent));
}
function liveAllowed() {
  return (
    config.mode === 'production' &&
    config.allowedHosts.includes(location.hostname) &&
    location.protocol === 'https:'
  );
}
function updateClarity(consent: OptionalConsent) {
  if (!liveAllowed()) return;
  window.clarity ||= function () {
    // eslint-disable-next-line prefer-rest-params -- Clarity consumes the documented Arguments bootstrap queue.
    (window.clarity!.q ||= []).push(arguments);
  } as ClarityFunction;
  window.clarity('consentv2', {
    analytics_Storage: consent.analytics ? 'granted' : 'denied',
    ad_Storage: consent.advertising ? 'granted' : 'denied',
  });
}
function loadContainer() {
  if (
    !liveAllowed() ||
    liveLoaded ||
    document.getElementById('ycna-gtm') ||
    !/^GTM-[A-Z0-9]+$/.test(config.containerId)
  )
    return;
  liveLoaded = true;
  (window.dataLayer ||= []).push({
    'gtm.start': Date.now(),
    event: 'gtm.js',
    site_platform: 'nextjs',
  });
  const script = document.createElement('script');
  script.id = 'ycna-gtm';
  script.async = true;
  script.src =
    'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(config.containerId);
  document.head.append(script);
}
function clearAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map((item) => item.split('=')[0].trim())
    .filter((name) => /^(_ga(?:_|$)|_gcl_|_clck$|_clsk$|_mpxl_guid$)/.test(name));
  for (const name of names)
    for (const domain of [
      '',
      location.hostname,
      '.' + location.hostname,
      'yourcnastory.org',
      '.yourcnastory.org',
    ])
      document.cookie =
        name +
        '=; Max-Age=0; Path=/; SameSite=Lax' +
        (location.protocol === 'https:' ? '; Secure' : '') +
        (domain ? '; Domain=' + domain : '');
}
const bounded = (value: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(0, Math.floor(value))) : 0;
export function emitSiteEvent(event: SiteEvent) {
  if (
    !effectiveConsent().analytics ||
    config.mode === 'off' ||
    (config.mode === 'production' && !liveAllowed())
  )
    return;
  if (!currentPath) return;
  const route = routeAt(currentPath);
  if (!route || route.section === 'employers') return;
  const parameters: Record<string, string | number> = {
    page_path: route.path,
    language: route.locale,
    template: route.template,
  };
  switch (event.name) {
    case 'generate_lead':
      parameters.form_key = 'career-signup';
      break;
    case 'outbound_click':
      if (!links.hosts.includes(event.host) || !/^link-\d+$/.test(event.linkKey)) return;
      parameters.link_key = event.linkKey;
      parameters.destination_host = event.host;
      break;
    case 'file_download':
      if (
        !links.documents.some(
          (item) => item.key === event.documentKey && item.extension === event.extension,
        )
      )
        return;
      parameters.document_key = event.documentKey;
      parameters.file_extension = event.extension;
      break;
    case 'site_search':
      parameters.query_length = bounded(event.queryLength, 256);
      parameters.result_count = bounded(event.resultCount, 48);
      break;
    case 'search_result_click': {
      const result = routeAt(event.resultPath);
      if (!result || result.section === 'employers' || result.locale !== route.locale) return;
      parameters.result_path = result.path;
      parameters.result_position = bounded(event.position, 48);
      break;
    }
    case 'scroll':
      parameters.percent_scrolled = 90;
      break;
    case 'page_view':
      parameters.page_title = route.metadata?.title || route.heading || route.path;
      parameters.page_location = location.origin + route.path;
      try {
        const ref = new URL(document.referrer);
        parameters.page_referrer = ref.origin;
      } catch {
        parameters.page_referrer = '';
      }
      break;
    default:
      return;
  }
  if (config.mode === 'mock')
    record({ vendor: 'ga4', action: 'event', event: event.name, parameters });
  else (window.dataLayer ||= []).push({ event: event.name, ...parameters });
}
function pageView() {
  if (effectiveConsent().analytics && lastPage !== currentPath) {
    lastPage = currentPath;
    emitSiteEvent({ name: 'page_view' });
  }
}
export function setTrackingRoute(path: string) {
  const route = routeAt(path);
  const next = route?.section === 'employers' ? '' : route?.path || '';
  if (next !== currentPath) {
    currentPath = next;
    scrollDone = false;
    pageView();
  }
}
function applyConsent() {
  const next = effectiveConsent();
  googleConsent('update', next);
  updateClarity(next);
  if ((next.analytics || next.advertising) && liveAllowed()) loadContainer();
  if (next.analytics && !previous.analytics) {
    record({ vendor: 'ga4', action: 'eligible' });
    record({ vendor: 'clarity', action: 'eligible' });
    pageView();
  }
  if (next.advertising && !previous.advertising)
    for (const vendor of ['google_ads', 'floodlight', 'mntn'] as const)
      record({ vendor, action: 'eligible' });
  if (!next.analytics) {
    lastPage = '';
    scrollDone = false;
  }
  const withdrawn =
    (previous.analytics && !next.analytics) || (previous.advertising && !next.advertising);
  previous = next;
  if (withdrawn) {
    clearAnalyticsCookies();
    if (liveLoaded) location.reload();
  }
}
export function startTelemetry(value: TrackingConfig) {
  config = value;
  previous = { analytics: false, advertising: false };
  currentPath = routeAt(location.pathname)?.path || '';
  lastPage = '';
  scrollDone = false;
  liveLoaded = false;
  googleConsent('default', { analytics: false, advertising: false });
  const unsubscribe = subscribePrivacy(applyConsent);
  const activate = (event: MouseEvent) => {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const anchor = (event.target as Element)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!anchor || anchor.getAttribute('aria-disabled') === 'true' || !effectiveConsent().analytics)
      return;
    let url: URL;
    try {
      url = new URL(anchor.href, location.origin);
    } catch {
      return;
    }
    if (!['http:', 'https:'].includes(url.protocol)) return;
    const doc = links.documents.find(
      (item) => item.host === url.hostname && item.path === url.pathname,
    );
    if (doc)
      emitSiteEvent({ name: 'file_download', documentKey: doc.key, extension: doc.extension });
    else if (url.origin !== location.origin && links.hosts.includes(url.hostname))
      emitSiteEvent({
        name: 'outbound_click',
        linkKey: 'link-' + Array.from(document.querySelectorAll('a[href]')).indexOf(anchor),
        host: url.hostname,
      });
  };
  const scroll = () => {
    if (scrollDone || !effectiveConsent().analytics) return;
    const range = document.documentElement.scrollHeight - innerHeight;
    if (range > 0 && scrollY / range >= 0.9) {
      scrollDone = true;
      emitSiteEvent({ name: 'scroll', percent: 90 });
    }
  };
  const signup = (event: Event) => {
    const detail = (event as CustomEvent).detail;
    if (detail?.mode === 'live' && detail.outcome === 'created')
      emitSiteEvent({ name: 'generate_lead', form: 'career-signup' });
  };
  document.addEventListener('click', activate);
  document.addEventListener('auxclick', activate);
  window.addEventListener('scroll', scroll, { passive: true });
  window.addEventListener('signup_submitted', signup);
  return () => {
    unsubscribe();
    document.removeEventListener('click', activate);
    document.removeEventListener('auxclick', activate);
    window.removeEventListener('scroll', scroll);
    window.removeEventListener('signup_submitted', signup);
    config = { ...config, mode: 'off' };
  };
}
