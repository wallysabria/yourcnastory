import fs from 'node:fs';
import { spawn } from 'node:child_process';
const cases = JSON.parse(fs.readFileSync('tests/fixtures/gsc-404-urls.json'));
const origin = process.env.TEST_BASE_URL || 'http://127.0.0.1:3104';
const server = process.env.TEST_BASE_URL
  ? null
  : spawn(
      process.execPath,
      ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3104'],
      { windowsHide: true, stdio: 'ignore' },
    );
const rows = [];
try {
  for (let i = 0; i < 100; i++) {
    try {
      await fetch(origin);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  for (const item of cases) {
    let url = origin + item.path;
    const hops = [];
    for (let i = 0; i < 4; i++) {
      const r = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
      const location = r.headers.get('location');
      await r.body?.cancel();
      hops.push({
        path: new URL(url).pathname + new URL(url).search,
        status: r.status,
        ...(location ? { location } : {}),
      });
      if (!location || r.status < 300 || r.status >= 400) break;
      url = new URL(location, url).href;
    }
    const first = hops[0],
      last = hops.at(-1);
    let passed = item.allowedFinalStatus.includes(last.status);
    if (item.target) {
      const to = new URL(first.location, origin),
        expected = new URL(item.target, origin);
      passed &&=
        first.status === 301 &&
        hops.length === 2 &&
        to.pathname === expected.pathname &&
        to.hash === expected.hash &&
        to.search === new URL(origin + item.path).search;
    } else if (!item.path.includes('wp-json')) passed &&= hops.length === 1;
    rows.push({ ...item, hops, passed });
  }
  const report = {
    origin,
    checked: rows.length,
    passed: rows.filter((r) => r.passed).length,
    rows,
  };
  fs.writeFileSync(
    'docs/reports/gsc-404-cleanup-verification.json',
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(
    JSON.stringify({
      checked: rows.length,
      passed: report.passed,
      failures: rows.filter((r) => !r.passed),
    }),
  );
  if (report.passed !== rows.length) process.exitCode = 1;
} finally {
  server?.kill();
}
