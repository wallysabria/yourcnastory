import fs from 'node:fs';
import assert from 'node:assert/strict';
const raw = JSON.parse(
  fs.readFileSync('docs/reports/phase-10-preliminary-performance-published.json'),
);
const baseline = JSON.parse(fs.readFileSync('docs/reports/phase-05-performance-summary.json'));
const paths = [...new Set(raw.runs.map((r) => r.path))];
const median = (values) => {
  const a = values.sort((a, b) => a - b);
  return a[Math.floor(a.length / 2)];
};
assert.equal(
  raw.runs.filter((r) => r.status === 'ok').length,
  54,
  'All 54 scheduled runs must succeed',
);
assert.equal(paths.length, 18);
const rows = paths.map((path) => {
  const runs = raw.runs.filter((r) => r.path === path && r.status === 'ok');
  assert.equal(runs.length, 3, path);
  const old = baseline.rows.find((r) => r.path === path);
  const metric = (id) => median(runs.map((r) => r.metrics[id].value));
  return {
    path,
    template: runs[0].template,
    locale: runs[0].locale,
    runs: 3,
    source: old?.source,
    phase5: old?.nativeAfter,
    current: {
      score: Math.round(median(runs.map((r) => r.performance)) * 100),
      lcpMs: Math.round(metric('largest-contentful-paint')),
      cls: metric('cumulative-layout-shift'),
      tbtMs: Math.round(metric('total-blocking-time')),
    },
    warnings: [...new Set(runs.flatMap((r) => r.warnings || []))],
  };
});
const budgets = {
  representatives: rows.length,
  score90: rows.filter((r) => r.current.score >= 90).length,
  lcp2500: rows.filter((r) => r.current.lcpMs <= 2500).length,
  cls01: rows.filter((r) => r.current.cls <= 0.1).length,
  tbt200: rows.filter((r) => r.current.tbtMs <= 200).length,
};
const summary = {
  checkedAt: new Date().toISOString(),
  method:
    '54 cold mobile Lighthouse 13.6 runs, three per template/locale, on the published Phase 7 review alias. Historical source/Phase 5 medians use their preserved reports; hosting, cache, consent and capture conditions differ, so this is not a controlled causal comparison. TBT is not field INP; no real-user p75 CWV or live-vendor overhead claim.',
  publishedBaseline: JSON.parse(
    fs.readFileSync('docs/reports/phase-10-preliminary-published-baseline.json'),
  ),
  budgets,
  rows,
};
fs.writeFileSync(
  'docs/reports/phase-10-preliminary-performance-summary.json',
  JSON.stringify(summary, null, 2) + '\n',
);
let md =
  '# Preliminary QA mobile performance\n\n' +
  summary.method +
  '\n\n| Page | Source LCP (s) | Phase 5 LCP (s) | Current score | Current LCP (s) | CLS | TBT (ms) |\n|---|---:|---:|---:|---:|---:|---:|\n';
for (const r of rows)
  md += `| ${r.path} | ${((r.source?.lcpMs || 0) / 1000).toFixed(2)} | ${((r.phase5?.lcpMs || 0) / 1000).toFixed(2)} | ${r.current.score} | ${(r.current.lcpMs / 1000).toFixed(2)} | ${r.current.cls.toFixed(3)} | ${r.current.tbtMs} |\n`;
md +=
  '\nBudget counts out of 18: score ≥90: ' +
  budgets.score90 +
  '; LCP ≤2.5s: ' +
  budgets.lcp2500 +
  '; CLS ≤0.1: ' +
  budgets.cls01 +
  '; TBT ≤200ms: ' +
  budgets.tbt200 +
  '. Each nonpassing route remains an exception, not an averaged pass.\n\nThe two preliminary QA fixes change fragment resolution and privacy opener focus, not rendering/resource scheduling. These measurements describe the published baseline, not a claim of measured performance improvement from those fixes. First-party encoded JavaScript is checked separately in the final protected-cloud report; transfer bytes include response headers and are not interchangeable.\n';
fs.writeFileSync('docs/reports/phase-10-preliminary-performance.md', md);
console.log(budgets);
