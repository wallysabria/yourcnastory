import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
const origin = 'http://127.0.0.1:3101';
const entries = JSON.parse(fs.readFileSync('content/pages/index.json'));
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json'));
const pages = new Map();
for (const e of entries) {
  const r = await fetch(origin + e.path);
  const html = await r.text();
  const $ = load(html);
  pages.set(e.path, {
    $,
    status: r.status,
    ids: new Set(
      $('[id],a[name]')
        .toArray()
        .map((n) => $(n).attr('id') || $(n).attr('name')),
    ),
  });
}
const links = [];
const resources = new Set();
const blocked = [];
const jobboard = [];
const gatedControls = [];
const activeEmployerLinks = [];
const localURL = (value, base) => {
  try {
    const u = new URL(value, origin + base);
    if (
      !['http:', 'https:'].includes(u.protocol) ||
      ![
        '127.0.0.1',
        'yourcnastory.org',
        'www.yourcnastory.org',
        'yourcnastory.vercel.app',
      ].includes(u.hostname)
    )
      return null;
    return u;
  } catch {
    return null;
  }
};
for (const [path, p] of pages) {
  const $ = p.$;
  gatedControls.push({ path, count: $('[aria-disabled=true]').length });
  $('a[href]').each((_, n) => {
    const a = $(n);
    const href = a.attr('href');
    const u = localURL(href, path);
    if (!u) return;
    const target = routes.find((r) => r.path === u.pathname);
    if (a.attr('aria-disabled') === 'true') {
      blocked.push({ from: path, path: u.pathname, employer: target?.section === 'employers' });
      return;
    }
    if (target?.section === 'employers') activeEmployerLinks.push({ from: path, path: u.pathname });
    links.push({ from: path, path: u.pathname, hash: u.hash });
  });
  $('[src],link[rel=stylesheet][href],link[rel=preload][href],link[rel=modulepreload][href]').each(
    (_, n) => {
      const u = localURL($(n).attr('src') || $(n).attr('href'), path);
      if (u) resources.add(u.pathname + u.search);
    },
  );
  if (
    /jobboard\.yourcnastory\.org|cna-job-board/i.test(
      $('#main,header,footer').text() +
        ' ' +
        $('a[href]')
          .toArray()
          .map((n) => $(n).attr('href'))
          .join(' ') +
        ' ' +
        $('meta')
          .toArray()
          .map((n) => $(n).attr('content'))
          .join(' '),
    )
  )
    jobboard.push(path);
}
const targets = [...new Set([...links.map((r) => r.path), ...resources])];
const checked = new Map();
let cursor = 0;
async function worker() {
  while (cursor < targets.length) {
    const path = targets[cursor++];
    let url = origin + path;
    const hops = [];
    try {
      for (let i = 0; i < 5; i++) {
        const r = await fetch(url, { method: 'HEAD', redirect: 'manual' });
        hops.push({ path: new URL(url).pathname, status: r.status });
        const dest = r.headers.get('location');
        if (r.status >= 300 && r.status < 400 && dest) {
          const next = new URL(dest, url);
          if (next.origin !== origin) {
            hops.push({ externalHost: next.hostname });
            break;
          }
          url = next.href;
          continue;
        }
        break;
      }
      checked.set(path, { path, hops });
    } catch (e) {
      checked.set(path, { path, error: e.name });
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
const missingAnchors = [];
for (const link of links.filter((l) => l.hash)) {
  const result = checked.get(link.path);
  const final = result?.hops?.at(-1)?.path;
  const target = pages.get(final);
  let id;
  try {
    id = decodeURIComponent(link.hash.slice(1));
  } catch {
    id = link.hash.slice(1);
  }
  if (target && !target.ids.has(id)) missingAnchors.push({ ...link, target: final });
}
const badTargets = [...checked.values()].filter(
  (r) =>
    r.error ||
    r.hops.at(-1)?.status !== 200 ||
    r.hops.length > 2 ||
    r.hops.slice(0, -1).some((h) => h.status !== 301),
);
const snapshotHashes = entries.map((e) => {
  const p = JSON.parse(fs.readFileSync(e.file));
  const file =
    '_source/phase-03/' +
    createHash('sha256').update(p.provenance.url).digest('hex').slice(0, 20) +
    '.html';
  return {
    path: e.path,
    matches:
      createHash('sha256').update(fs.readFileSync(file)).digest('hex') ===
      p.provenance.snapshotHash,
  };
});
const uploadHashes = JSON.parse(fs.readFileSync('content/seo/preserved-uploads.json')).map((r) => ({
  path: r.path,
  actual: createHash('sha256')
    .update(fs.readFileSync('public' + r.path))
    .digest('hex'),
  expected: r.sha256,
}));
const review = await fetch(origin + '/api/content-review', { redirect: 'manual' });
const home = await fetch(origin + '/');
const report = {
  checkedAt: new Date().toISOString(),
  sha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  origin,
  pages: pages.size,
  links: links.length,
  resourcePaths: resources.size,
  uniqueTargets: targets.length,
  badTargets,
  missingAnchors,
  intentionallyDisabled: blocked,
  gatedControls,
  activeEmployerLinks,
  jobboardVisiblePages: jobboard,
  snapshotHashes,
  uploadHashes,
  security: {
    reviewStatus: review.status,
    headers: Object.fromEntries(
      [
        'x-robots-tag',
        'x-powered-by',
        'content-security-policy',
        'x-content-type-options',
        'referrer-policy',
        'permissions-policy',
        'strict-transport-security',
      ].map((k) => [k, home.headers.get(k)]),
    ),
  },
  targets: [...checked.values()],
};
fs.writeFileSync(
  'docs/reports/phase-10-preliminary-integrity.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log({
  pages: report.pages,
  links: report.links,
  resources: report.resourcePaths,
  badTargetCount: badTargets.length,
  missingAnchorCount: missingAnchors.length,
  jobboard,
  archiveHashFailures: snapshotHashes.filter((r) => !r.matches).length,
  uploadHashFailures: uploadHashes.filter((r) => r.expected && r.expected !== r.actual).length,
  reviewStatus: review.status,
});
