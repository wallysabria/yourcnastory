import svgTextCleanup from '../content/migration/svg-text-cleanup.json' with { type: 'json' };
import jobboardPolicy from '../content/migration/jobboard-policy.json' with { type: 'json' };
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { load } from 'cheerio';
export const origin = 'https://yourcnastory.org';
export const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
export const cleanSvgText = (text, url) =>
  svgTextCleanup.paths.includes(new URL(url, origin).pathname)
    ? svgTextCleanup.artifacts.reduce((value, artifact) => value.replaceAll(artifact, ''), text)
    : text;
export const normalize = (s) => s.replace(/\s+/g, ' ').trim();
export const filename = (p) =>
  (p === '/' ? 'home' : p.slice(1, -1).replaceAll('/', '--')) + '.json';
export const write = (p, v) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
};
const ignored = 'script,style,noscript,svg,[id*="mxchat"],[class*="mxchat"]';
// Exclude executable infrastructure and the retired chatbot, not page copy.
export function sourceDocument(html, url, { removeJobboard = false } = {}) {
  const $ = load(html),
    main = $('#main');
  if (main.length !== 1) throw Error('Missing unique #main: ' + url);
  main.find(ignored).remove();
  // Owner-approved removal of leaked SVG styling, scoped to the 16 career pages.
  if (svgTextCleanup.paths.includes(new URL(url, origin).pathname)) {
    const clean = (node) => {
      if (node.type === 'text') node.data = cleanSvgText(node.data, url);
      else for (const child of node.children || []) clean(child);
    };
    clean(main[0]);
  }
  const removals = [];
  if (removeJobboard) {
    main.find('a[href*="jobboard.yourcnastory.org"]').each((_, e) => {
      removals.push({
        page: url,
        kind: 'link-and-label',
        text: $(e).text(),
        href: $(e).attr('href'),
        result: 'removed; no replacement',
      });
      $(e).remove();
    });
    const walk = (n) => {
      if (n.type === 'text') {
        for (const rule of jobboardPolicy.filter((r) => r.page === url)) {
          if (n.data.includes(rule.text)) {
            const original = n.data;
            n.data = n.data.replaceAll(rule.text, '');
            removals.push({
              page: url,
              kind: 'text-substring',
              text: rule.text,
              href: '',
              originalText: original,
              result: n.data,
            });
          }
        }
        if (/jobboard\.yourcnastory\.org|job[ -]?(?:board|bank)|bolsa de trabajo/i.test(n.data))
          throw Error('Unreviewed job-board reference ' + url);
      } else for (const c of [...(n.children || [])]) walk(c);
    };
    walk(main[0]);
  }
  return { $, main, removals };
}
export function visibleText($, root) {
  const output = [];
  function walk(n) {
    if (n.type === 'text') output.push(n.data);
    else if (!['script', 'style', 'noscript', 'svg'].includes(n.name))
      for (const c of n.children || []) walk(c);
  }
  walk(root[0]);
  return output.join(' ');
}
export function inventory($, main) {
  return {
    text: normalize(visibleText($, main)),
    links: main
      .find('a[href],area[href]')
      .map((_, e) => ({ href: $(e).attr('href'), text: $(e).text() }))
      .get(),
    images: main
      .find('img')
      .map((_, e) => ({
        src: $(e).attr('data-src') || $(e).attr('src') || '',
        alt: $(e).attr('alt') || '',
      }))
      .get(),
    anchors: main
      .find('[id]')
      .addBack('[id]')
      .map((_, e) => $(e).attr('id'))
      .get(),
  };
}
export function metadata($) {
  const m = (n) =>
    $('meta[name="' + n + '"],meta[property="' + n + '"]')
      .first()
      .attr('content') || '';
  return {
    title: $('title').text(),
    description: m('description'),
    canonical: $('link[rel="canonical"]').attr('href') || '',
    robots: m('robots'),
    ogTitle: m('og:title'),
    ogDescription: m('og:description'),
    ogImage: m('og:image'),
  };
}
const allowed =
  /^(id|href|src|srcset|sizes|alt|title|width|height|poster|colspan|rowspan|scope|type|name|value|placeholder|for|role|lang|target|rel|aria-[a-z-]+)$/;
export function tree($, node) {
  if (node.type === 'text') return { type: 'text', value: node.data };
  if (!node.name) return null;
  const attrs = {};
  for (const [k, v] of Object.entries(node.attribs || {})) {
    if (allowed.test(k) && !/^javascript:/i.test(v)) attrs[k] = v;
  }
  if (node.name === 'img') {
    attrs.src = $(node).attr('data-src') || attrs.src || '';
    if ($(node).attr('data-srcset')) attrs.srcset = $(node).attr('data-srcset');
  }
  if (node.name === 'input' && attrs.type === 'hidden') delete attrs.value;
  const children = (node.children || []).map((n) => tree($, n)).filter(Boolean);
  return {
    type: 'element',
    tag: node.name,
    attrs,
    children,
    source: {
      elementorId: node.attribs?.['data-id'] || '',
      widget: node.attribs?.['data-widget_type'] || '',
      classes: node.attribs?.class || '',
    },
  };
}
export const escape = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const voidTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);
export function serialize(node) {
  if (node.type === 'text') return escape(node.value);
  const attrs = Object.entries(node.attrs)
    .map(([k, v]) => ' ' + k + '="' + escape(v) + '"')
    .join('');
  return (
    '<' +
    node.tag +
    attrs +
    '>' +
    (voidTags.has(node.tag) ? '' : node.children.map(serialize).join('') + '</' + node.tag + '>')
  );
}
export function mediaReferences($, main, url) {
  const refs = new Set();
  const add = (v, externalImage = false) => {
    if (!v) return;
    try {
      const u = new URL(v, url);
      if (
        (u.origin === origin && u.pathname.startsWith('/wp-content/uploads/')) ||
        (externalImage &&
          ['digitalasset.intuit.com', 'play.vidyard.com', 'i.ytimg.com'].includes(u.hostname) &&
          u.protocol === 'https:')
      ) {
        u.hash = '';
        u.search = '';
        refs.add(u.href);
      }
    } catch {
      /* Non-URL CSS values are not resources. */
    }
  };
  add($('meta[property="og:image"]').attr('content'));
  main.find('img,source,video,audio,a[href]').each((_, e) => {
    for (const attr of ['src', 'data-src', 'poster', 'href']) add($(e).attr(attr), attr !== 'href');
    for (const attr of ['srcset', 'data-srcset'])
      for (const entry of ($(e).attr(attr) || '').split(','))
        add(entry.trim().split(/\s+/)[0], true);
  });
  main.find('[style],[data-settings]').each((_, e) => {
    let settings = {};
    try {
      settings = JSON.parse($(e).attr('data-settings') || '{}');
    } catch {
      /* Not JSON settings. */
    }
    const visit = (v) => {
      if (typeof v === 'string') add(v);
      else if (v && typeof v === 'object') Object.values(v).forEach(visit);
    };
    visit(settings);
    const raw = $(e).attr('style') || '';
    for (const m of raw.matchAll(/https?:[^\s"'<>\\)]+/g)) add(m[0]);
  });
  return [...refs];
}
