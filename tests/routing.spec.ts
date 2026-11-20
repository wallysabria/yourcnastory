import hosting from '../vercel.json' with { type: 'json' };
import deferred from '../content/routing/deferred-redirects.json' with { type: 'json' };
import { test, expect } from '@playwright/test';
import {
  routes,
  renderableRoutes,
  counterpartFor,
  canRender,
  isLinkDisabled,
  reservedRoutes,
} from '../lib/routing';
import { redirectRules, redirectDestination } from '../lib/redirects';
import { globalContent } from '../lib/global-content';
import { pageSchema } from '../lib/content-schema';
test('validated route map preserves reciprocal pairs and excludes gated content', () => {
  expect(new Set(routes.map((r) => r.path)).size).toBe(routes.length);
  for (const route of renderableRoutes().filter((r) => r.section !== 'employers')) {
    const pair = counterpartFor(route);
    expect(pair, route.path).toBeDefined();
    expect(pair?.counterpart).toBe(route.path);
    expect(pair?.locale).not.toBe(route.locale);
  }
  expect(renderableRoutes().some((r) => !['en', 'es'].includes(r.locale))).toBe(false);
  for (const route of routes.filter((r) => r.section === 'employers')) {
    expect(canRender(route, false)).toBe(false);
    expect(canRender(route, true)).toBe(route.locale === 'en');
  }
});
test('both global settings validate and Spanish copy stays source-driven', () => {
  for (const lang of ['en', 'es'] as const) {
    const content = globalContent(lang);
    expect(content.nav).toHaveLength(2);
    expect(content.mobile).toHaveLength(2);
    expect(content.footer.columns).toHaveLength(3);
  }
  expect(globalContent('es').nav[0].label).toBe('Empleadores');
  expect(globalContent('es').nav[0].href).toBe('/employers/');
  expect(globalContent('es').nav[0].columns).toEqual(globalContent('en').nav[0].columns);
  expect(pageSchema.safeParse({ routeId: '/', locale: 'vi', blocks: [] }).success).toBe(false);
});
test('employer links are inert with the gate off and active with it on', () => {
  expect(isLinkDisabled('/employers/', true, false)).toBe(true);
  expect(isLinkDisabled('/employers/', true, true)).toBe(false);
  expect(isLinkDisabled('/faqs/', true, true)).toBe(false);
  expect(isLinkDisabled('/train-and-gain/', true, true)).toBe(false);
  expect(isLinkDisabled('/advocate/', true, true)).toBe(false);
  expect(isLinkDisabled('/career-seekers/', false, false)).toBe(false);
});
test('all activated redirects map directly without redirect chains', () => {
  expect(hosting.redirects).toEqual(
    redirectRules.map((rule) => ({ source: rule.from, destination: rule.to, statusCode: 301 })),
  );
  for (const rule of redirectRules) {
    expect(redirectDestination(rule.from)).toBe(rule.to);
    expect(redirectDestination(rule.to)).toBeNull();
  }
  expect(redirectDestination('/vi')).toBe('/');
  expect(redirectDestination('/zh/community-resources/missing/')).toBe('/community-resources/');
  expect(redirectDestination('/images/brand/cnap-logo-color.webp')).toBeNull();
  expect(redirectDestination('/wp-content/uploads/test.pdf')).toBeNull();
});
test('every activated redirect returns actual HTTP 301 and the planned location', async ({
  request,
}) => {
  for (const rule of redirectRules) {
    const response = await request.get(rule.from, { maxRedirects: 0 });
    expect(response.status(), rule.from).toBe(301);
    expect(new URL(response.headers().location, 'http://127.0.0.1:3101').pathname).toBe(rule.to);
  }
});
test('every static shell has the right language, canonical, and noindex headers', async ({
  request,
}) => {
  for (const route of renderableRoutes()) {
    const response = await request.get(route.path);
    expect(response.status(), route.path).toBe(200);
    expect(response.headers()['x-robots-tag']).toContain('noindex');
    const html = await response.text();
    expect(html).toContain('lang="' + route.locale + '"');
    expect(html).toContain('https://yourcnastory.org' + route.path);
    expect(html).toContain('content="noindex');
    expect(html).not.toContain('googletagmanager.com');
    expect(html).not.toContain('clarity.ms');
  }
});

test('global navigation URLs remain accounted for in the route or reserved manifests', () => {
  const known = new Set([...routes.map((r) => r.path), ...reservedRoutes.map((r) => r.path)]);
  for (const locale of ['en', 'es'] as const) {
    const content = globalContent(locale);
    const check = (href: string | null) => {
      if (!href?.startsWith('/')) return;
      expect(known.has(href.split('#')[0]), href).toBe(true);
    };
    for (const group of content.nav) {
      check(group.href);
      for (const column of group.columns) for (const item of column.items) check(item.href);
    }
    const walk = (nodes: typeof content.mobile) => {
      for (const node of nodes) {
        check(node.href);
        walk(node.children);
      }
    };
    walk(content.mobile);
    for (const column of content.footer.columns) {
      check(column.href);
      for (const item of column.items) check(item.href);
    }
    check(content.footer.policy.href);
  }
});

test('unapproved redirect rows remain inactive even through fallback rules', () => {
  for (const row of deferred) expect(redirectDestination(row.from), row.from).toBeNull();
});

test('YouTube parser supports source watch URLs and rejects invalid hosts/IDs', async () => {
  const { youtubeVideoId } = await import('../lib/youtube');
  for (const url of [
    'https://www.youtube.com/watch?v=aTyd4jfB0OY',
    'https://youtu.be/aTyd4jfB0OY',
    'https://www.youtube.com/embed/aTyd4jfB0OY',
    'https://www.youtube-nocookie.com/embed/aTyd4jfB0OY',
  ])
    expect(youtubeVideoId(url)).toBe('aTyd4jfB0OY');
  for (const url of [
    'https://evil.example/watch?v=aTyd4jfB0OY',
    'https://youtube.com.evil.example/watch?v=aTyd4jfB0OY',
    'https://www.youtube.com/watch?v=watch',
    'javascript:alert(1)',
  ])
    expect(youtubeVideoId(url)).toBeUndefined();
});

test('regional Earn and Learn pages retire with direct permanent redirects', async () => {
  const { default: retired } = await import('../content/routing/regional-earn-learn-retired.json', {
    with: { type: 'json' },
  });
  for (const path of retired.paths) {
    expect(routes.some((r) => r.path === path)).toBe(false);
    for (const from of [path, path.slice(0, -1)]) {
      expect(redirectDestination(from)).toBe('/earn-and-learn/');
      expect(hosting.redirects.find((r) => r.source === from)).toMatchObject({
        destination: '/earn-and-learn/',
        statusCode: 301,
      });
    }
  }
  expect(renderableRoutes().some((r) => r.path === '/earn-and-learn/')).toBe(true);
  expect(renderableRoutes().some((r) => r.path === '/es/earn-and-learn/')).toBe(true);
  for (const rule of redirectRules) expect(retired.paths).not.toContain(rule.to);
});
