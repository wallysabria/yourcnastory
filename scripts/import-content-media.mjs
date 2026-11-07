import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import { hash, write } from './content-source.mjs';
const pages = JSON.parse(fs.readFileSync('_source/phase-03/reconciliation.json'));
const media = new Map(
  JSON.parse(fs.readFileSync('docs/reports/phase-03-media-candidates.json')).map((r) => [r.url, r]),
);
const css = new Map();
for (const r of pages) {
  const $ = load(fs.readFileSync('_source/phase-03/' + r.filename, 'utf8'));
  $('link[rel="stylesheet"][href*="/uploads/elementor/css/"]').each((_, e) => {
    const url = $(e).attr('href').split('?')[0];
    const refs = css.get(url) || [];
    refs.push(r.path);
    css.set(url, refs);
  });
  $('style').each((_, e) => {
    for (const m of $(e)
      .text()
      .matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
      try {
        const u = new URL(m[1], r.url);
        if (u.pathname.startsWith('/wp-content/uploads/')) {
          const row = media.get(u.href) || { url: u.href, pages: [] };
          row.pages.push(r.path);
          media.set(u.href, row);
        }
      } catch {
        /* Non-resource CSS. */
      }
    }
  });
}
for (const [url, refs] of css) {
  const file = '_source/phase-03/' + hash(url).slice(0, 20) + '.css';
  if (!fs.existsSync(file)) {
    const response = await fetch(url);
    if (!response.ok) throw Error('CSS ' + response.status + ' ' + url);
    fs.writeFileSync(file, await response.text());
  }
  const body = fs.readFileSync(file, 'utf8');
  for (const m of body.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
    try {
      const u = new URL(m[1], url);
      if (
        u.origin === 'https://yourcnastory.org' &&
        u.pathname.startsWith('/wp-content/uploads/') &&
        !/\.(woff2?|ttf|eot)$/i.test(u.pathname)
      ) {
        u.search = '';
        const row = media.get(u.href) || { url: u.href, pages: [] };
        row.pages.push(...refs);
        media.set(u.href, row);
      }
    } catch {
      /* Non-resource CSS. */
    }
  }
}
const rows = [...media.values()].map((r) => ({ ...r, pages: [...new Set(r.pages)] }));
write('docs/reports/phase-03-media-candidates.json', rows);
let index = 0;
const output = [];
async function worker() {
  while (index < rows.length) {
    const r = rows[index++],
      u = new URL(r.url);
    const ext = path.extname(u.pathname).toLowerCase();
    const document = /\.(pdf|docx?|xlsx?|pptx?|csv|zip)$/i.test(u.pathname);
    const stem =
      path
        .basename(u.pathname, ext)
        .normalize('NFKD')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase() || 'source-image';
    const target = document
      ? 'public' + decodeURIComponent(u.pathname)
      : 'public/images/content/' + stem + '-' + hash(r.url).slice(0, 8) + ext;
    let status = 200,
      contentType = '';
    if (!fs.existsSync(target)) {
      const response = await fetch(r.url, { signal: AbortSignal.timeout(45000) });
      status = response.status;
      contentType = response.headers.get('content-type') || '';
      if (response.ok) {
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length > 90 * 1024 * 1024) throw Error('Oversized media ' + r.url);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, bytes);
      }
    }
    const exists = fs.existsSync(target);
    output.push({
      ...r,
      path: exists ? '/' + target.slice(7) : null,
      kind: document ? 'document' : 'media',
      status,
      contentType,
      bytes: exists ? fs.statSync(target).size : 0,
      sha256: exists ? hash(fs.readFileSync(target)) : null,
    });
  }
}
await Promise.all([worker(), worker(), worker()]);
output.sort((a, b) => a.url.localeCompare(b.url));
write('content/media/manifest.json', output);
console.log(
  JSON.stringify({
    references: output.length,
    downloaded: output.filter((r) => r.path).length,
    failed: output.filter((r) => !r.path).map((r) => ({ url: r.url, status: r.status })),
    bytes: output.reduce((n, r) => n + r.bytes, 0),
  }),
);
