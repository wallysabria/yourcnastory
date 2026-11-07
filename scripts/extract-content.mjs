import fs from 'node:fs';
import { load } from 'cheerio';
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
const records = JSON.parse(fs.readFileSync('_source/phase-03/reconciliation.json'));
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json')).filter(
  (r) => r.section !== 'employers',
);
const index = [],
  removals = [],
  testimonials = [],
  careerpaths = [],
  media = new Map();
for (const route of routes) {
  const snapshot = records.find((r) => r.path === route.path);
  if (!snapshot || snapshot.status !== 200) throw Error('No 200 snapshot ' + route.path);
  const html = fs.readFileSync('_source/phase-03/' + snapshot.filename, 'utf8');
  const {
    $,
    main,
    removals: removed,
  } = sourceDocument(html, origin + route.path, { removeJobboard: true });
  removals.push(...removed);
  const mediaUrls = mediaReferences($, main, origin + route.path);
  for (const url of mediaUrls) {
    const rec = media.get(url) || { url, pages: [] };
    rec.pages.push(route.path);
    media.set(url, rec);
  }
  const backgrounds = [];
  main.find('[data-settings]').each((_, e) => {
    try {
      const s = JSON.parse($(e).attr('data-settings'));
      for (const [key, value] of Object.entries(s))
        if (/background_(video|image)/.test(key) && value)
          backgrounds.push({ elementId: $(e).attr('data-id') || '', property: key, value });
    } catch {
      /* No usable settings. */
    }
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
  for (const embed of embeds) {
    try {
      if (embed.href.includes('elementor-action')) {
        const params = new URLSearchParams(
          decodeURIComponent(embed.href).split('elementor-action:')[1],
        );
        embed.configuration = JSON.parse(
          Buffer.from(params.get('settings') || '', 'base64').toString('utf8'),
        );
      } else if (embed.settings) embed.configuration = JSON.parse(embed.settings);
    } catch {
      /* Original source configuration still retained. */
    }
  }
  const page = {
    routeId: route.id,
    path: route.path,
    locale: route.locale,
    metadata: metadata($),
    blocks: [{ type: 'document', nodes: [tree($, main[0])] }],
    backgrounds,
    embeds,
    media: mediaUrls,
    provenance: {
      url: origin + route.path,
      capturedAt: snapshot.capturedAt,
      snapshotHash: snapshot.sha256,
      authority: 'rendered-live-copy; owner approved 2026-11-07',
      normalization: 'DOM-decoded text; source text-node characters retained',
    },
    inventory: inventory($, main),
  };
  function textNodes(n) {
    return n.type === 'text' ? [n.data] : (n.children || []).flatMap(textNodes);
  }
  page.provenance.textCharactersHash = hash(textNodes(main[0]).join(''));
  if (route.template === 'careerpath-entry') {
    page.kind = 'careerpath';
    page.collectionOrder = careerpaths.filter((r) => r.locale === route.locale).length;
  }
  const file = 'content/pages/' + filename(route.path);
  write(file, page);
  index.push({ path: route.path, file, locale: route.locale, sha256: hash(JSON.stringify(page)) });
  if (route.template === 'careerpath-entry')
    careerpaths.push({
      routeId: route.id,
      locale: route.locale,
      path: route.path,
      file,
      collectionOrder: careerpaths.filter((r) => r.locale === route.locale).length,
    });
  // Homepage testimonials are explicitly allowed with its employer blocks; no Employer page is read.
  main.find('article.the7_reviews').each((i, e) => {
    const body = $(e).find('.short-description');
    const title = $(e).find('.post-title').text();
    const parts = body.html()?.split(/<br\s*\/?\s*>/i) || [];
    let quote = load(parts[0] || '').text(),
      attribution = load(parts.slice(1).join('<br>')).text();
    if (!attribution) {
      const split = quote.lastIndexOf(' - ');
      if (split >= 0) {
        attribution = quote.slice(split + 3);
        quote = quote.slice(0, split);
      }
    }
    testimonials.push({
      id:
        route.locale +
        '-' +
        ($(e)
          .attr('class')
          .match(/post-(\d+)/)?.[1] || i),
      locale: route.locale,
      quote,
      attribution,
      sourceTitle: title,
      sourceText: body.text(),
      sourcePage: route.path,
      sourceOrder: i,
      ...($(e).find('img').length
        ? { image: $(e).find('img').attr('data-src') || $(e).find('img').attr('src') }
        : {}),
    });
  });
}
write('content/pages/index.json', index);
write('content/collections/careerpaths.json', careerpaths);
write('content/collections/testimonials.json', testimonials);
write('docs/reports/phase-03-jobboard-removals.json', removals);
write('docs/reports/phase-03-media-candidates.json', [...media.values()]);
console.log(
  JSON.stringify({
    pages: index.length,
    careerpaths: careerpaths.length,
    testimonials: testimonials.length,
    jobboardRemovals: removals.length,
    mediaCandidates: media.size,
  }),
);
