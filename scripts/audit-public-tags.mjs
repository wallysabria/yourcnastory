import fs from 'node:fs';
import { chromium } from '@playwright/test';
const output = '_source/integrations/tag-audit';
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const reports = [];
const containerSummaries = [];
const ids = (text) => [
  ...new Set(
    text.match(/\b(?:GTM-[A-Z0-9]{5,}|G-[A-Z0-9]{6,}|GT-[A-Z0-9]{5,}|AW-\d+|DC-\d+)\b/g) || [],
  ),
];
const tracked =
  /googletagmanager|google-analytics|analytics\.google|doubleclick|googleadservices|googleads|clarity\.ms|mtn\.com|mountain|facebook|connect\.facebook|list-manage|mailchimp/;
const scenarios = [
  { path: '/', gpc: false },
  { path: '/es/', gpc: false },
  { path: '/career-seekers/', gpc: false },
  { path: '/es/aspirantes/', gpc: false },
  { path: '/privacy-policy/', gpc: false },
  { path: '/', gpc: true },
];
try {
  for (const scenario of scenarios) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      extraHTTPHeaders: scenario.gpc ? { 'Sec-GPC': '1' } : {},
    });
    await context.addInitScript(
      (gpc) => Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => gpc }),
      scenario.gpc,
    );
    const page = await context.newPage();
    const requests = [];
    const pending = [];
    let stage = 'initial';
    await context.route('**/*', (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (
        request.method() === 'POST' &&
        /list-manage|mailchimp|forms\.office|forms\.microsoft|yourcnastory\.org/.test(url.hostname)
      )
        return route.abort();
      return route.continue();
    });
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (!tracked.test(url.hostname)) return;
      const body = request.postData() || '';
      const params = new URLSearchParams(
        /^(?:v=2&|en=)/.test(body) ||
          request.headers()['content-type']?.includes('application/x-www-form-urlencoded')
          ? body
          : '',
      );
      const get = (key) => url.searchParams.get(key) || params.get(key);
      requests.push({
        stage,
        host: url.hostname,
        path: url.pathname,
        method: request.method(),
        type: request.resourceType(),
        tagIds: ids(request.url()),
        event: get('en') || undefined,
        measurementId: get('tid') || undefined,
        consent: {
          gcs: get('gcs') || undefined,
          gcd: get('gcd') || undefined,
          npa: get('npa') || undefined,
        },
        queryKeys: [...new Set([...url.searchParams.keys(), ...params.keys()])]
          .filter((key) => /^[a-z][a-z0-9_.-]{0,60}$/i.test(key))
          .sort(),
      });
    });
    page.on('response', (response) => {
      const url = new URL(response.url());
      if (url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtm.js') {
        pending.push(
          response
            .text()
            .then((text) =>
              containerSummaries.push({
                source: url.origin + url.pathname + '?id=' + url.searchParams.get('id'),
                tagIds: ids(text),
                compiledFunctionTypes: [
                  ...new Set([...text.matchAll(/"function"\s*:\s*"([^"]+)"/g)].map((m) => m[1])),
                ].sort(),
                mentionedEvents: [
                  ...new Set(
                    [
                      ...text.matchAll(
                        /(?:"event_name"|"vtp_eventName"|"event")\s*:\s*"([a-zA-Z][\w.:-]{0,70})"/g,
                      ),
                    ].map((m) => m[1]),
                  ),
                ].sort(),
              }),
            )
            .catch(() => {}),
        );
      }
    });
    const response = await page.goto('https://yourcnastory.org' + scenario.path, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });
    await page.waitForTimeout(5000);
    const initialCount = requests.length;
    stage = 'scroll';
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(2000);
    const state = await page.evaluate(() => ({
      title: document.title,
      gpc: navigator.globalPrivacyControl,
      buttons: [...document.querySelectorAll('button,[role=button],a')]
        .filter((e) =>
          /cookie|consent|privacy choices|accept all|decline|rechazar|aceptar|preferencias de privacidad/i.test(
            e.textContent || '',
          ),
        )
        .slice(0, 20)
        .map((e) => ({
          text: e.textContent.trim().slice(0, 100),
          visible: !!e.getBoundingClientRect().height,
        })),
      dataLayer: (window.dataLayer || []).map((entry) => {
        if (entry && typeof entry === 'object' && '0' in entry) {
          const kind = entry[0];
          return {
            command: typeof kind === 'string' ? kind : undefined,
            action: typeof entry[1] === 'string' ? entry[1] : undefined,
            consent: kind === 'consent' ? entry[2] : undefined,
          };
        }
        return {
          event: entry?.event,
          keys:
            entry && typeof entry === 'object'
              ? Object.keys(entry).filter((k) => k !== 'gtm.start')
              : [],
        };
      }),
      localStorageKeys: Object.keys(localStorage),
      sessionStorageKeys: Object.keys(sessionStorage),
    }));
    const cookies = (await context.cookies()).map(
      ({ name, domain, httpOnly, secure, sameSite }) => ({
        name,
        domain,
        httpOnly,
        secure,
        sameSite,
      }),
    );
    await Promise.allSettled(pending);
    reports.push({
      path: scenario.path,
      gpcRequested: scenario.gpc,
      status: response.status(),
      initialRequestCount: initialCount,
      state,
      cookies,
      requests,
    });
    console.log({
      path: scenario.path,
      gpc: scenario.gpc,
      tagRequests: requests.length,
      events: [...new Set(requests.map((r) => r.event).filter(Boolean))],
    });
    await context.close();
  }
} finally {
  await browser.close();
}
const report = {
  capturedAt: new Date().toISOString(),
  scope:
    'Read-only public EN/ES pages, fresh contexts, 5 seconds after DOMContentLoaded and 2-second scroll observation. One Sec-GPC + navigator.globalPrivacyControl scenario. No consent choices clicked, no live lead/application forms submitted, no account changes. Collection payload/cookie values/visitor IDs not retained. Observed behavior is not an exhaustive GTM/account export.',
  scenarios: reports,
  containers: containerSummaries,
};
fs.writeFileSync(output + '/public-tag-audit.json', JSON.stringify(report, null, 2) + '\n');
console.log({
  scenarios: reports.length,
  containers: containerSummaries.length,
  hosts: [...new Set(reports.flatMap((r) => r.requests.map((q) => q.host)))].sort(),
});
