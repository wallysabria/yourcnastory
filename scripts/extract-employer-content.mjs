import fs from 'node:fs';
import {
  origin,
  hash,
  filename,
  write,
  sourceDocument,
  inventory,
  metadata,
  tree,
  mediaReferences,
} from './content-source.mjs';
const records = JSON.parse(fs.readFileSync('_source/phase-08/reconciliation.json'));
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json'));
const index = JSON.parse(fs.readFileSync('content/pages/index.json'));
const candidates = new Map(
  JSON.parse(fs.readFileSync('docs/reports/phase-03-media-candidates.json')).map((r) => [r.url, r]),
);
const sourceHeads = JSON.parse(fs.readFileSync('content/seo/source-head.json'));
const removals = [];
for (const record of records) {
  const route = routes.find((r) => r.path === record.path);
  if (!route || route.locale !== 'en' || route.section !== 'employers')
    throw Error('Unapproved scope');
  const html = fs.readFileSync('_source/phase-08/' + record.filename, 'utf8');
  const {
    $,
    main,
    removals: removed,
  } = sourceDocument(html, origin + route.path, { removeJobboard: true });
  removals.push(...removed);
  const media = mediaReferences($, main, record.url);
  const backgrounds = [];
  main.find('[data-settings]').each((_, e) => {
    try {
      for (const [property, value] of Object.entries(JSON.parse($(e).attr('data-settings'))))
        if (/background_(video|image)/.test(property) && value)
          backgrounds.push({ elementId: $(e).attr('data-id') || '', property, value });
    } catch {}
  });
  const embeds = main
    .find('iframe,video,audio,[data-widget_type="video.default"],a[href*="elementor-action"]')
    .map((_, e) => ({
      tag: e.tagName,
      src: $(e).attr('src') || '',
      href: $(e).attr('href') || '',
      title: $(e).attr('title') || '',
      settings: $(e).attr('data-settings') || '',
    }))
    .get();
  const textNodes = (n) => (n.type === 'text' ? [n.data] : (n.children || []).flatMap(textNodes));
  const page = {
    routeId: route.id,
    path: route.path,
    locale: 'en',
    metadata: metadata($),
    blocks: [{ type: 'document', nodes: [tree($, main[0])] }],
    backgrounds,
    embeds,
    media,
    provenance: {
      url: record.url,
      capturedAt: record.capturedAt,
      snapshotHash: record.sha256,
      authority: 'rendered-live-copy; owner approved Phase 8 2026-11-16',
      normalization: 'DOM-decoded text; source text-node characters retained',
      textCharactersHash: hash(textNodes(main[0]).join('')),
    },
    inventory: inventory($, main),
  };
  const visibleMain = main.clone();
  visibleMain.find('iframe').empty();
  page.inventory = inventory($, visibleMain);
  page.provenance.visibleTextCharactersHash = hash(textNodes(visibleMain[0]).join(''));
  const file = 'content/pages/' + filename(route.path);
  write(file, page);
  const existingIndex = index.findIndex((r) => r.path === route.path);
  if (existingIndex >= 0) index.splice(existingIndex, 1);
  index.push({ path: route.path, file, locale: 'en', sha256: hash(JSON.stringify(page)) });
  route.metadata = page.metadata;
  for (const url of media) {
    const row = candidates.get(url) || { url, pages: [] };
    row.pages = [...new Set([...row.pages, route.path])];
    candidates.set(url, row);
  }
  const meta = (n) =>
    $('meta[property="' + n + '"]')
      .first()
      .attr('content') || '';
  sourceHeads[route.path] = {
    ogType: meta('og:type'),
    ogPublishedTime: meta('article:published_time'),
    lastModified: meta('article:modified_time') || null,
    ogLocale: meta('og:locale'),
    ogSiteName: meta('og:site_name'),
    ogImageWidth: meta('og:image:width'),
    ogImageHeight: meta('og:image:height'),
    ogImageType: meta('og:image:type'),
    ogImageAlt: meta('og:image:alt'),
  };
  fs.copyFileSync('_source/phase-08/' + record.filename, '_source/phase-03/' + record.filename);
}
write('content/pages/index.json', index);
write('content/routing/slug-map.json', routes);
write('content/seo/source-head.json', sourceHeads);
write('docs/reports/phase-08-jobboard-removals.json', removals);
write('docs/reports/phase-03-media-candidates.json', [...candidates.values()]);
const previous = JSON.parse(fs.readFileSync('_source/phase-03/reconciliation.json'));
write('_source/phase-03/reconciliation.json', [
  ...previous.filter((r) => !records.some((n) => n.path === r.path)),
  ...records,
]);
let loader = "import { pageSchema } from './content-schema';\n";
index.forEach((r, i) => (loader += `import page${i} from '../${r.file}' with { type: 'json' };\n`));
loader +=
  'const pages: Record<string, unknown> = {\n' +
  index.map((r, i) => JSON.stringify(r.path) + ':page' + i).join(',\n') +
  '\n};\nexport function contentAt(path: string) { const data=Object.hasOwn(pages,path)?pages[path]:undefined; return data ? pageSchema.parse(data) : undefined; }\n';
fs.writeFileSync('lib/content-pages.ts', loader);
console.log({ extracted: records.length, total: index.length, removals: removals.length });
