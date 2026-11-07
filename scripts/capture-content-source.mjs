import fs from 'node:fs';
import { hash, origin, write } from './content-source.mjs';
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json')).filter(
  (r) => r.section !== 'employers',
);
const previous = fs.existsSync('_source/phase-03/reconciliation.json')
  ? JSON.parse(fs.readFileSync('_source/phase-03/reconciliation.json'))
  : [];
fs.mkdirSync('_source/phase-03', { recursive: true });
const records = [];
let i = 0;
async function worker() {
  while (i < routes.length) {
    const r = routes[i++],
      url = origin + r.path;
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(45000) });
    if (response.status !== 200)
      throw Error('Unexpected source HTTP ' + response.status + ' ' + url);
    const body = await response.text(),
      filename = hash(url).slice(0, 20) + '.html';
    fs.writeFileSync('_source/phase-03/' + filename, body);
    records.push({
      ...previous.find((p) => p.path === r.path),
      path: r.path,
      locale: r.locale,
      url,
      filename,
      status: 200,
      sha256: hash(body),
      capturedAt: new Date().toISOString(),
    });
  }
}
await Promise.all([worker(), worker()]);
write('_source/phase-03/reconciliation.json', records);
console.log({ captured: records.length, rawSnapshots: 'ignored _source/phase-03' });
