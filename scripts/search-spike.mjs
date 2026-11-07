import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';
const root = process.cwd();
const work = path.join(root, '_source/pagefind-spike');
const site = path.join(work, 'site');
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json')).filter(r => r.section !== 'employers');
for (const route of routes) {
  const slug = route.path.replace(/^\/|\/$/g, '');
  const source = path.join(root, '.next/server/app', (slug || 'index') + '.html');
  const destination = path.join(site, slug, 'index.html');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}
const pdf = JSON.parse(fs.readFileSync('docs/audit/uploads-inventory.json')).find(r => r.extension === '.pdf' && r.pages.some(url => /community-resources|career-seekers|certified-nurse-assistant-program/.test(url)));
if (pdf) {
  const response = await fetch(pdf.url);
  assert.equal(response.status, 200);
  fs.mkdirSync(path.join(site, 'documents'), { recursive: true });
  fs.writeFileSync(path.join(site, 'documents/source-sample.pdf'), Buffer.from(await response.arrayBuffer()));
}
const pkg = JSON.parse(fs.readFileSync('node_modules/pagefind/package.json'));
const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.pagefind;
const output = execFileSync(process.execPath, [path.join(root, 'node_modules/pagefind', bin), '--site', site, '--output-path', path.join(site, 'pagefind')], { encoding: 'utf8' });
fs.writeFileSync(path.join(work, 'cli-output.txt'), output);
for (const locale of ['en', 'es']) {
  fs.mkdirSync(path.join(site, '_spike', locale), { recursive: true });
  fs.writeFileSync(path.join(site, '_spike', locale, 'index.html'), `<!doctype html><html lang="${locale}"><title>Search API fixture</title><body><script type="module">import * as search from '/pagefind/pagefind.js'; window.searchIndex = search;</script></body></html>`);
}
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  let file = path.resolve(site, '.' + decodeURIComponent(url.pathname));
  if (!file.startsWith(site + path.sep) && file !== site) { response.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { response.writeHead(404).end(); return; }
  const types = { '.js': 'application/javascript', '.wasm': 'application/wasm', '.html': 'text/html' };
  response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(response);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch();
const queries = [];
try {
  for (const [locale, query] of [['en', 'Nursing'], ['es', 'Enfermería']]) {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/_spike/${locale}/`);
    await page.waitForFunction(() => Boolean(window.searchIndex));
    const results = await page.evaluate(async query => {
      const result = await window.searchIndex.search(query);
      return await Promise.all(result.results.map(async row => { const data = await row.data(); return { url: data.url, title: data.meta.title }; }));
    }, query);
    assert.ok(results.length > 0, locale + ' returns results');
    assert.ok(results.every(row => locale === 'es' ? row.url.startsWith('/es/') : !row.url.startsWith('/es/')), 'Language-scoped results');
    assert.ok(results.every(row => row.url.endsWith('/')), 'Preserved trailing-slash result URLs');
    queries.push({ locale, query, results });
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
const report = { checkedAt: new Date().toISOString(), pagefind: pkg.version, stagedHTMLPages: routes.length, queries, pdfCandidate: pdf?.url || null, pdfNativeIndexing: false, finding: 'CLI walks HTML only. PDF text extraction and custom records/HTML surrogates would need a separate build step. No search UI built.', cliOutput: output };
fs.writeFileSync('docs/reports/phase-02-search-spike.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
