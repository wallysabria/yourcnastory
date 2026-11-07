import deferred from '@/content/routing/deferred-redirects.json' with { type: 'json' };
import reserved from '@/content/routing/reserved-routes.json' with { type: 'json' };
import rules from '@/content/routing/redirects.json' with { type: 'json' };
import slugMap from '@/content/routing/slug-map.json' with { type: 'json' };
export const redirectRules = rules;
export function redirectDestination(pathname: string): string | null {
  const exact = rules.find((rule) => rule.from === pathname);
  if (exact) return exact.to;
  if (deferred.some((rule) => rule.from === pathname)) return null;
  if (/^\/(vi|zh)(\/|$)/.test(pathname)) {
    let english = pathname.replace(/^\/(vi|zh)(?=\/|$)/, '') || '/';
    english = english.endsWith('/') ? english : english + '/';
    while (!slugMap.some((route) => route.locale === 'en' && route.path === english)) {
      if (
        reserved.some(
          (route) =>
            route.locale === 'en' && route.observedStatus === 200 && route.path === english,
        )
      )
        return null;
      english = english.replace(/[^/]+\/$/, '') || '/';
    }
    return english;
  }
  if (
    !pathname.endsWith('/') &&
    !/\.[^/]+$/.test(pathname) &&
    !pathname.startsWith('/.well-known/')
  )
    return pathname + '/';
  return null;
}
