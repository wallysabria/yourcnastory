import source from '@/content/routing/slug-map.json' with { type: 'json' };
import reserved from '@/content/routing/reserved-routes.json' with { type: 'json' };
import { routeSchema, type Locale, type RouteRecord } from './content-schema';
export const routes: RouteRecord[] = source.map((record) => routeSchema.parse(record));
export const reservedRoutes = reserved;
export const employersEnabled = process.env.EMPLOYERS_ENABLED === 'true';
export function normalizePath(path: string): string {
  return path === '/' ? '/' : path.replace(/\/$/, '') + '/';
}
export function routeAt(path: string): RouteRecord | undefined {
  return routes.find((route) => route.path === normalizePath(path));
}
export function routeFor(id: string, locale: Locale): RouteRecord | undefined {
  return routes.find((route) => route.id === id && route.locale === locale);
}
export function counterpartFor(route: RouteRecord): RouteRecord | undefined {
  return route.counterpart ? routeAt(route.counterpart) : undefined;
}
export function canRender(route: RouteRecord, enabled = employersEnabled): boolean {
  return route.section !== 'employers' || enabled;
}
export function renderableRoutes(): RouteRecord[] {
  return routes.filter((route) => route.section !== 'employers');
}
export function hrefFor(href: string): string {
  if (!href.startsWith('/')) return href;
  const [path, anchor] = href.split('#');
  return normalizePath(path) + (anchor ? '#' + anchor : '');
}

export function isLinkDisabled(href: string, employer: boolean, enabled: boolean): boolean {
  const route = href.startsWith('/') ? routeAt(href.split('#')[0]) : undefined;
  return !enabled && (employer || route?.section === 'employers');
}
