import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { serialize } from './content-source.mjs';
const legacy = JSON.parse(fs.readFileSync('content/migration/legacy-ui-policy.json'));
const index = JSON.parse(fs.readFileSync('content/pages/index.json'));
function indexable(node) {
  if (node.type === 'text') return node;
  if (
    legacy.classNames.some((name) => (node.source?.classes || '').split(/\s+/).includes(name)) ||
    legacy.idPrefixes.some((prefix) => (node.attrs.id || '').startsWith(prefix))
  )
    return null;
  if (['form', 'script', 'style', 'link', 'iframe', 'video', 'audio'].includes(node.tag))
    return null;
  return { ...node, children: node.children.map(indexable).filter(Boolean) };
}
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json')).filter(
  (r) => r.section !== 'employers',
);
const site = path.resolve('_source/phase-04/search-site');
assert.equal(path.dirname(site), path.resolve('_source/phase-04'));
assert.equal(path.basename(site), 'search-site');
fs.rmSync(site, { recursive: true, force: true });
// An explicit whitelist prevents retired, employer, diagnostic or stale build HTML entering the index.
for (const route of routes) {
  const slug = route.path.replace(/^\/|\/$/g, '');
  const entry = index.find((entry) => entry.path === route.path);
  assert.ok(entry, 'Search route has canonical content');
  const record = JSON.parse(fs.readFileSync(entry.file));
  assert.equal(record.path, route.path);
  assert.equal(record.locale, route.locale);
  const body = record.blocks
    .flatMap((block) => block.nodes || [])
    .map(indexable)
    .filter(Boolean)
    .map(serialize)
    .join('');
  const title = serialize({ type: 'text', value: record.metadata.title || route.heading });
  const destination = path.join(site, slug, 'index.html');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(
    destination,
    '<!doctype html><html lang="' +
      route.locale +
      '"><head><title>' +
      title +
      '</title></head><body><main data-pagefind-body >' +
      body +
      '</main></body></html>',
  );
}
const packageJson = JSON.parse(fs.readFileSync('node_modules/pagefind/package.json'));
const binary = typeof packageJson.bin === 'string' ? packageJson.bin : packageJson.bin.pagefind;
execFileSync(
  process.execPath,
  [
    path.resolve('node_modules/pagefind', binary),
    '--site',
    site,
    '--output-path',
    path.resolve('public/pagefind'),
  ],
  { stdio: 'inherit' },
);
