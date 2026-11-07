import fs from 'node:fs';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { pageSchema, careerPathSchema, testimonialSchema } from '../lib/content-schema.ts';
import {
  origin,
  hash,
  write,
  sourceDocument,
  inventory,
  metadata,
  serialize,
} from './content-source.mjs';
const live = process.argv.includes('--live');
const records = fs.existsSync('_source/phase-03/reconciliation.json')
  ? JSON.parse(fs.readFileSync('_source/phase-03/reconciliation.json'))
  : [];
const index = JSON.parse(fs.readFileSync('content/pages/index.json'));
const removals = JSON.parse(fs.readFileSync('docs/reports/phase-03-jobboard-removals.json'));
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json')).filter(
  (r) => r.section !== 'employers',
);
const careers = JSON.parse(fs.readFileSync('content/collections/careerpaths.json'));
const testimonials = JSON.parse(fs.readFileSync('content/collections/testimonials.json'));
const media = JSON.parse(fs.readFileSync('content/media/manifest.json'));
assert.deepEqual(index.map((r) => r.path).sort(), routes.map((r) => r.path).sort());
for (const locale of ['en', 'es']) {
  const grid = routes.find(
    (r) => r.id === '/career-paths-in-long-term-care/' && r.locale === locale,
  );
  const page = JSON.parse(fs.readFileSync(index.find((r) => r.path === grid.path).file));
  const entries = careers
    .filter((r) => r.locale === locale)
    .sort((a, b) => a.collectionOrder - b.collectionOrder);
  const known = new Set(entries.map((r) => r.path));
  const expected = [
    ...new Set(
      page.inventory.links
        .map((link) => {
          try {
            return new URL(link.href, origin).pathname;
          } catch {
            return '';
          }
        })
        .filter((path) => known.has(path)),
    ),
  ];
  assert.deepEqual(
    entries.map((r) => r.path),
    expected,
    'Source career grid order: ' + locale,
  );
  for (const entry of entries)
    assert.equal(JSON.parse(fs.readFileSync(entry.file)).collectionOrder, entry.collectionOrder);
}
for (const t of testimonials) testimonialSchema.parse(t);
for (const r of media) {
  assert.ok(r.path, 'Missing media ' + r.url);
  const data = fs.readFileSync('public' + r.path);
  assert.equal(hash(data), r.sha256, r.url);
  if (r.kind === 'document')
    assert.equal(r.path, decodeURIComponent(new URL(r.url).pathname), 'Document path changed');
}
const textNodes = (root) => {
  const a = [];
  function visit(n) {
    if (n.type === 'text') a.push(n.data);
    else for (const c of n.children || []) visit(c);
  }
  visit(root[0]);
  return a;
};
const checks = [];
for (const row of index) {
  const page = JSON.parse(fs.readFileSync(row.file));
  for (const image of page.inventory.images)
    if (/^https?:/.test(image.src))
      assert.ok(
        media.some((asset) => asset.url === image.src),
        'Unmapped source image ' + image.src,
      );
  pageSchema.parse(page);
  assert.equal(page.path, row.path);
  assert.equal(page.locale, row.locale);
  assert.equal(hash(JSON.stringify(page)), row.sha256, row.file + ' hash drift');
  if (careers.some((r) => r.path === row.path)) careerPathSchema.parse(page);
  const rendered = page.blocks
    .flatMap((b) => (b.type === 'document' ? b.nodes.map(serialize) : []))
    .join('');
  const actual$ = load(rendered),
    actual = actual$('#main');
  assert.equal(actual$.root().find('script,style').length, 0);
  assert.ok(
    !/jobboard\.yourcnastory\.org|job[ -]?(?:board|bank)|bolsa de trabajo/i.test(actual.text()),
    row.path + ' job reference',
  );
  let baseline = page.inventory,
    expectedTextHash = page.provenance.textCharactersHash,
    expectedMetadata = page.metadata,
    logged = true;
  if (live || records.length) {
    let html;
    if (live) {
      const response = await fetch(origin + row.path);
      assert.equal(response.status, 200);
      html = await response.text();
    } else {
      const r = records.find((r) => r.path === row.path);
      html = fs.readFileSync('_source/phase-03/' + r.filename, 'utf8');
    }
    const source = sourceDocument(html, origin + row.path, { removeJobboard: true });
    baseline = inventory(source.$, source.main);
    expectedTextHash = hash(textNodes(source.main).join(''));
    expectedMetadata = metadata(source.$);
    logged =
      JSON.stringify(source.removals) ===
      JSON.stringify(removals.filter((r) => r.page === origin + row.path));
  }
  const actualInventory = inventory(actual$, actual);
  const textHash = hash(textNodes(actual).join(''));
  const result = {
    url: origin + row.path,
    locale: row.locale,
    mode: live ? 'fresh-live' : records.length ? 'captured-live' : 'committed-baseline',
    text: actualInventory.text === baseline.text,
    exactTextCharacters: textHash === expectedTextHash,
    links: JSON.stringify(actualInventory.links) === JSON.stringify(baseline.links),
    images: JSON.stringify(actualInventory.images) === JSON.stringify(baseline.images),
    anchors: JSON.stringify(actualInventory.anchors) === JSON.stringify(baseline.anchors),
    metadata: JSON.stringify(page.metadata) === JSON.stringify(expectedMetadata),
    loggedRemovals: logged,
    imageCount: actualInventory.images.length,
    anchorCount: actualInventory.anchors.length,
    textCharactersHash: textHash,
  };
  result.status = Object.values(result).some((v) => v === false) ? 'FAIL' : 'PASS';
  checks.push(result);
  if (result.status === 'FAIL') {
    fs.mkdirSync('_source/phase-03/diffs', { recursive: true });
    write('_source/phase-03/diffs/' + row.file.split('/').at(-1), {
      expected: baseline,
      actual: actualInventory,
      expectedTextHash,
      actualTextHash: textHash,
      result,
    });
  }
  // Verify the original per-node characters, not merely normalized text.
  if (!page.provenance.textCharactersHash && result.status === 'PASS')
    throw Error('Missing baseline hash ' + row.path);
}
const result = {
  checkedAt: new Date().toISOString(),
  mode: checks[0]?.mode,
  pages: checks.length,
  passed: checks.filter((r) => r.status === 'PASS').length,
  failed: checks.filter((r) => r.status === 'FAIL'),
  spanishPages: checks.filter((r) => r.locale === 'es').length,
  scope:
    'Main page content; scripts/styles/retired chatbot excluded; form copy inert; no visual-layout certification',
  checks,
};
write('docs/reports/phase-03-parity.json', result);
const cols = [
  'url',
  'locale',
  'mode',
  'status',
  'text',
  'exactTextCharacters',
  'links',
  'images',
  'anchors',
  'metadata',
  'loggedRemovals',
  'imageCount',
  'anchorCount',
];
fs.writeFileSync(
  'docs/reports/phase-03-parity.csv',
  cols.join(',') +
    '\n' +
    checks
      .map((r) => cols.map((k) => '"' + String(r[k]).replaceAll('"', '""') + '"').join(','))
      .join('\n') +
    '\n',
);
console.log(
  JSON.stringify({
    pages: result.pages,
    passed: result.passed,
    failed: result.failed.map((r) => ({
      url: r.url,
      checks: Object.entries(r)
        .filter(([, v]) => v === false)
        .map(([k]) => k),
    })),
  }),
);
if (result.failed.length) process.exitCode = 1;
