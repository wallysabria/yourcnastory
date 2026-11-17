import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { load } from 'cheerio';
const origin = 'http://127.0.0.1:3104',
  release = JSON.parse(fs.readFileSync('content/routing/employer-release.json'));
const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3104'],
  { windowsHide: true, stdio: 'ignore' },
);
const cache = new Map();
async function get(path) {
  if (!cache.has(path))
    cache.set(
      path,
      fetch(origin + path).then(async (r) => ({
        status: r.status,
        url: r.url,
        body: await r.text(),
      })),
    );
  return cache.get(path);
}
const checks = [];
try {
  for (let i = 0; i < 100; i++) {
    try {
      await fetch(origin);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  for (const path of release.approved) {
    const page = await get(path),
      $ = load(page.body);
    for (const href of [
      ...new Set(
        $('#main a[href]')
          .map((_, e) => $(e).attr('href'))
          .get(),
      ),
    ]) {
      const u = new URL(href, 'https://yourcnastory.org' + path);
      if (
        !['yourcnastory.org', 'www.yourcnastory.org'].includes(u.hostname) ||
        !['http:', 'https:'].includes(u.protocol)
      )
        continue;
      const target = await get(u.pathname + u.search);
      const target$ = load(target.body);
      checks.push({
        page: path,
        href,
        status: target.status,
        held: release.held.includes(u.pathname),
        anchor:
          !u.hash ||
          target$('[id]')
            .toArray()
            .some((e) => target$(e).attr('id') === decodeURIComponent(u.hash.slice(1))),
      });
    }
  }
  fs.writeFileSync(
    'docs/reports/phase-08-internal-links.json',
    JSON.stringify(
      { checks, failures: checks.filter((c) => c.status >= 400 || c.held || !c.anchor) },
      null,
      2,
    ) + '\n',
  );
  console.log(
    JSON.stringify({
      internalChecks: checks.length,
      failures: checks.filter((c) => c.status >= 400 || c.held || !c.anchor),
    }),
  );
} finally {
  server.kill();
}
