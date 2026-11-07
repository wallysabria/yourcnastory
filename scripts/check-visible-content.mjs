import fs from 'node:fs';
import { chromium } from '@playwright/test';
import { normalize, hash, write } from './content-source.mjs';
const index = JSON.parse(fs.readFileSync('content/pages/index.json'));
const removals = JSON.parse(fs.readFileSync('docs/reports/phase-03-jobboard-removals.json'));
const browser = await chromium.launch();
const context = await browser.newContext();
await context.route('**/*', (route) => {
  const req = route.request();
  const url = req.url();
  if (
    ['image', 'media', 'font'].includes(req.resourceType()) ||
    /googletagmanager|google-analytics|clarity\.ms|doubleclick|facebook|mxchat|mailchimp|list-manage|mtn\.com|googletagservices/.test(
      url,
    )
  )
    return route.abort();
  return route.continue();
});
const checks = [];
let i = 0;
async function worker() {
  const page = await context.newPage();
  while (i < index.length) {
    const entry = index[i++],
      record = JSON.parse(fs.readFileSync(entry.file));
    await page.goto('https://yourcnastory.org' + entry.path, { waitUntil: 'load', timeout: 45000 });
    const visible = await page.locator('#main').evaluate((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const texts = [];
      let node;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (
          !parent ||
          !node.textContent?.trim() ||
          parent.closest('script,style,noscript,svg,[id*="mxchat"],[class*="mxchat"]')
        )
          continue;
        let hidden = false;
        for (let el = parent; el; el = el.parentElement) {
          const css = getComputedStyle(el);
          if (css.display === 'none' || css.visibility === 'hidden') {
            hidden = true;
            break;
          }
        }
        if (!hidden) texts.push(node.textContent);
      }
      return texts;
    });
    const allowed = removals
      .filter((r) => r.page === 'https://yourcnastory.org' + entry.path)
      .map((r) => normalize(r.text));
    const missing = visible
      .map(normalize)
      .map((text) => allowed.reduce((value, removed) => value.replaceAll(removed, ''), text))
      .map(normalize)
      .filter((text) => text && !record.inventory.text.includes(text));
    checks.push({
      path: entry.path,
      locale: entry.locale,
      visibleTextNodes: visible.length,
      visibleCharacterHash: hash(visible.join('')),
      missing: [...new Set(missing)],
      status: missing.length ? 'FAIL' : 'PASS',
    });
  }
  await page.close();
}
try {
  await Promise.all([worker(), worker()]);
} finally {
  await browser.close();
}
checks.sort((a, b) => a.path.localeCompare(b.path));
write('docs/reports/phase-03-browser-source-checks.json', {
  checkedAt: new Date().toISOString(),
  scope:
    'Computed display/visibility text-node coverage against extracted copy; not a layout/interaction parity claim. Offscreen and collapsed copy also retained by exact static character checks.',
  pages: checks.length,
  passed: checks.filter((r) => r.status === 'PASS').length,
  checks,
});
console.log(
  JSON.stringify({
    pages: checks.length,
    passed: checks.filter((r) => r.status === 'PASS').length,
    failed: checks.filter((r) => r.status === 'FAIL'),
  }),
);
if (checks.some((r) => r.status === 'FAIL')) process.exitCode = 1;
