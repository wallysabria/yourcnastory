import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import postcss from 'postcss';
import { hash, write, sourceDocument } from './content-source.mjs';
const records = JSON.parse(fs.readFileSync('_source/phase-03/reconciliation.json'));
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json')).filter(
  (r) => r.section !== 'employers',
);
const media = new Map(
  JSON.parse(fs.readFileSync('content/media/manifest.json')).map((r) => [r.url, r.path]),
);
const styles = new Map(),
  originals = new Map(),
  pages = {},
  assets = [],
  unmapped = new Set();
const fontStyles = [];
const mailchimpCssUrl = 'https://cdn-images.mailchimp.com/embedcode/classic-061523.css';
const mailchimpCssFile = '_source/phase-04/mailchimp-classic.css';
if (!fs.existsSync(mailchimpCssFile)) {
  const response = await fetch(mailchimpCssUrl);
  if (!response.ok) throw Error('Source form stylesheet ' + response.status);
  fs.writeFileSync(mailchimpCssFile, await response.text());
}
const mailchimpCss = fs.readFileSync(mailchimpCssFile, 'utf8');
const first = load(
  fs.readFileSync('_source/phase-03/' + records.find((r) => r.path === '/').filename, 'utf8'),
);
for (const id of [
  'font-awesome-5-all-css',
  'elementor-gf-local-manrope-css',
  'elementor-gf-local-dmsans-css',
]) {
  const root = postcss.parse(first('#' + id).text());
  for (const face of [...(root.nodes || [])].filter(
    (n) => n.type === 'atrule' && n.name === 'font-face',
  )) {
    const family = face.nodes.find((n) => n.prop === 'font-family')?.value || '';
    const range = face.nodes.find((n) => n.prop === 'unicode-range')?.value;
    if (range && !/u\+(?:0000|0)-(?:00ff|ff)/i.test(range)) continue;
    const src = face.nodes
      .filter((n) => n.prop === 'src')
      .map((n) => n.value)
      .join(',');
    const url = src.match(/url\(["']?([^)'"\s]*\.woff2(?:\?[^)'"\s]*)?)["']?\)/)?.[1];
    if (!url) continue;
    const target =
      'public/fonts/' +
      family
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      hash(url).slice(0, 8) +
      '.woff2';
    if (!fs.existsSync(target)) {
      const response = await fetch(url);
      if (!response.ok) throw Error('Font ' + response.status + ' ' + url);
      fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()));
    }
    media.set(new URL(url).href, '/' + target.slice(7));
    assets.push({ url, path: '/' + target.slice(7), kind: 'font' });
    face.nodes = face.nodes.filter((n) => n.prop !== 'src');
    face.append({ prop: 'src', value: 'url(/' + target.slice(7) + ') format("woff2")' });
    face.append({ prop: 'font-display', value: 'swap' });
    fontStyles.push(face.toString());
  }
}
for (const [url, file] of [
  [
    'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/5.15.3/LICENSE.txt',
    'public/fonts/LICENSE-font-awesome.txt',
  ],
  [
    'https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt',
    'public/fonts/OFL-DM-Sans.txt',
  ],
]) {
  if (!fs.existsSync(file)) {
    const r = await fetch(url);
    if (!r.ok) throw Error('License ' + r.status);
    fs.writeFileSync(file, await r.text());
  }
}
const bodyClasses = new Set(
  records.flatMap((r) => {
    const $ = load(fs.readFileSync('_source/phase-03/' + r.filename, 'utf8'));
    return ($('body').attr('class') || '').split(/\s+/);
  }),
);
const mapUrls = (value) =>
  value.replace(/url\((['"]?)([^)'"\s]+)\1\)/g, (all, quote, raw) => {
    if (raw.startsWith('data:') || raw.startsWith('#')) return all;
    try {
      const u = new URL(raw, 'https://yourcnastory.org');
      const local = media.get(u.href) || media.get(u.origin + u.pathname);
      if (local) return 'url("' + local + '")';
      unmapped.add(u.href);
      return 'none';
    } catch {
      return 'none';
    }
  });
function scoped(css) {
  const root = postcss.parse(
    css.replace(/!I;\s*!;/g, '').replace(/\}\s*\{\s*padding-top:\s*0;\s*\}/g, '}'),
  );
  root.walkAtRules((rule) => {
    if (['font-face', 'import', 'charset'].includes(rule.name)) rule.remove();
  });
  root.walkDecls((d) => {
    d.value = mapUrls(d.value);
    if (/expression\(|javascript:|behavior|binding/i.test(d.value)) d.remove();
  });
  root.walkRules((rule) => {
    if (rule.parent?.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
    rule.selector = postcss.list
      .comma(rule.selector)
      .map((selector) => {
        let s = selector.trim().replace(/#the7-body/g, '.page-content');
        s = s
          .replace(/^html(?=[\s.#:[>+~]|$)/, '.source-document')
          .replace(/^body(?=[\s.#:[>+~]|$)/, '.page-content')
          .replace(/^:root/, '.source-document');
        if (s.startsWith('.source-document'))
          return s.replace(/\bbody(?=[\s.#:[>+~]|$)/g, '.page-content');
        if (s.startsWith('.page-content')) return s;
        if (bodyClasses.has(s.match(/^\.([\w-]+)/)?.[1])) return '.page-content' + s;
        return '.page-content ' + s;
      })
      .flatMap((selector) => {
        const alternate = selector.replace(
          /(^|[\s>+~])a(?=[\s.#:[>+~]|$)/g,
          '$1span[aria-disabled="true"]',
        );
        const video = selector.replace(
          /(^|[\s>+~])a(?=[\s.#:[>+~]|$)/g,
          '$1button.native-video-trigger',
        );
        const variants =
          alternate === selector || selector.includes('[href')
            ? [selector]
            : [selector, alternate, video];
        const carousel = selector.replace(/(\.owl-nav\s+)div\b/g, '$1button');
        if (carousel !== selector) variants.push(carousel);
        for (const heading of ['h2', 'h3', 'h4', 'h5', 'h6']) {
          const promoted = selector.replace(
            new RegExp('(^|[\\s>+~])' + heading + '(?=[\\s.#:[>+~]|$)', 'g'),
            '$1h1.native-source-' + heading,
          );
          if (promoted !== selector) variants.push(promoted);
        }
        if (selector.includes('.elementor-flip-box') && selector.includes(':hover'))
          variants.push(selector.replaceAll(':hover', ':focus-within'));
        return variants;
      })
      .join(',');
  });
  return root.toString();
}
const excluded =
  /mxchat|fluent|cute-alert|trp-|woo|font-awesome-4|elementor-icons-css|elementor-icons-shared|elementor-icons-fa-|gf-local|wp-img|global-styles|classic-theme|vertical-menu|horizontal-menu|mega-menu|e-popup|e-sticky|search-form|custom-scrollbar/;
for (const route of routes) {
  const record = records.find((r) => r.path === route.path);
  const html = fs.readFileSync('_source/phase-03/' + record.filename, 'utf8');
  let $ = load(html);
  // Retain original decorative vector artwork as static assets, with no script/event handlers.
  $('#main svg').each((_, svg) => {
    const vector = load($(svg).toString(), { xmlMode: true });
    vector('script,foreignObject').remove();
    vector('*').each((_, el) => {
      for (const key of Object.keys(el.attribs || {}))
        if (/^on/i.test(key)) vector(el).removeAttr(key);
    });
    vector('svg').attr('xmlns', 'http://www.w3.org/2000/svg');
    const data = vector.xml();
    const filename = 'public/images/icons/source-' + hash(data).slice(0, 16) + '.svg';
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    if (!fs.existsSync(filename)) fs.writeFileSync(filename, data);
    const parent = $(svg).parent();
    const previous = JSON.parse(parent.attr('data-native-vectors') || '[]');
    previous.push({ src: '/' + filename.slice(7), attrs: { ...svg.attribs } });
    parent.attr('data-native-vectors', JSON.stringify(previous));
  });
  const cleaned = sourceDocument($.html(), 'https://yourcnastory.org' + route.path, {
    removeJobboard: true,
  });
  $ = cleaned.$;
  const main = cleaned.main;
  const layout = {
    bodyClasses: $('body').attr('class') || '',
    template: route.template,
    styles: [],
    nodes: {},
  };
  if (main.find('form').length) {
    const digest = hash(mailchimpCss).slice(0, 16);
    styles.set(digest, scoped(mailchimpCss));
    originals.set(digest, mailchimpCss);
    layout.styles.push('/styles/source/' + digest + '.css');
  }
  const activeIds = new Set(
    main
      .find('[data-elementor-id]')
      .map((_, e) => $(e).attr('data-elementor-id'))
      .get(),
  );
  activeIds.add('10');
  $('style').each((_, el) => {
    const id = $(el).attr('id') || '';
    if (excluded.test(id)) return;
    const post = id.match(/^elementor-post-(\d+)-css$/);
    if (post && !activeIds.has(post[1])) return;
    const css = $(el).text();
    if (!css.trim()) return;
    const key = hash(css).slice(0, 16);
    if (!styles.has(key)) {
      originals.set(key, css);
      styles.set(key, scoped(css));
    }
    layout.styles.push('/styles/source/' + key + '.css');
  });
  function walk(node, key) {
    if (!node.name && node.type !== 'text') return;
    if (node.name) {
      const attrs = {};
      for (const [k, v] of Object.entries(node.attribs || {}))
        if (k.startsWith('data-') && !k.startsWith('data-native-')) attrs[k] = v;
      const extra = { attrs };
      if (node.attribs?.style) {
        const styleClass = 'native-inline-' + hash(node.attribs.style).slice(0, 16);
        extra.styleClass = styleClass;
        const css = '.' + styleClass + '{' + node.attribs.style + '}';
        const digest = hash(css).slice(0, 16);
        if (!styles.has(digest)) {
          originals.set(digest, css);
          styles.set(digest, scoped(css));
        }
        layout.styles.push('/styles/source/' + digest + '.css');
      }
      if (node.attribs?.['data-native-vectors'])
        extra.vectors = JSON.parse(node.attribs['data-native-vectors']);
      if (Object.keys(attrs).length || extra.styleClass || extra.vectors) layout.nodes[key] = extra;
    }
    (node.children || [])
      .filter((n) => n.name || n.type === 'text')
      .forEach((child, i) => walk(child, key + '.' + i));
  }
  walk(main[0], '0');
  layout.styles = [...new Set(layout.styles)];
  pages[route.path] = layout;
}
for (const url of [...unmapped]) {
  if (
    !url.startsWith('https://yourcnastory.org/wp-content/themes/dt-the7/images/') ||
    !url.endsWith('.svg')
  )
    continue;
  const file =
    'public/images/icons/' +
    path.basename(new URL(url).pathname, '.svg') +
    '-' +
    hash(url).slice(0, 8) +
    '.svg';
  if (!fs.existsSync(file)) {
    const response = await fetch(url);
    if (!response.ok) throw Error('Source UI asset ' + response.status);
    fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()));
  }
  media.set(url, '/' + file.slice(7));
  assets.push({ url, path: '/' + file.slice(7), kind: 'source-ui' });
}
unmapped.clear();
for (const [key, css] of originals) styles.set(key, scoped(css));
fs.mkdirSync('public/styles/source', { recursive: true });
for (const [key, css] of styles) fs.writeFileSync('public/styles/source/' + key + '.css', css);
fs.writeFileSync('public/styles/source/fonts.css', [...new Set(fontStyles)].join('\n'));
write('content/layout/pages.json', pages);
write('content/layout/assets.json', assets);
write('docs/reports/phase-04-unmapped-css-assets.json', [...unmapped]);
console.log({
  pages: Object.keys(pages).length,
  styleFiles: styles.size,
  fontFiles: new Set(assets.map((r) => r.path)).size,
  unmappedCssAssets: unmapped.size,
});
