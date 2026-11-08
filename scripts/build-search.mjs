import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
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
  const source = path.join('.next/server/app', (slug || 'index') + '.html');
  const destination = path.join(site, slug, 'index.html');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
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
