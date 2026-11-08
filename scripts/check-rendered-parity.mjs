import fs from 'node:fs';
import { chromium } from '@playwright/test';
const index = JSON.parse(fs.readFileSync('content/pages/index.json'));
const normalize = (s) => s.replace(/\s+/g, ' ').trim();
const checks = [];
const browser = await chromium.launch();
const context = await browser.newContext();
await context.route(/youtube.com|play.vidyard.com/, (r) => r.abort());
const page = await context.newPage();
try {
  for (const entry of index) {
    const record = JSON.parse(fs.readFileSync(entry.file));
    let expected = '';
    function text(n, language) {
      if (n.type === 'text') {
        expected += n.value;
        return;
      }
      if (n.tag === 'li') {
        const radio = n.children.find(
          (c) => c.type === 'element' && c.tag === 'input' && c.attrs.name === 'MMERGE3',
        );
        if (radio) {
          if (!['English', 'Español'].includes(radio.attrs.value)) return;
          language = radio.attrs.value;
        }
      }
      if (n.tag === 'label' && language) {
        expected += language === 'Español' ? 'Español' : 'English';
        return;
      }
      n.children.forEach((c) => text(c, language));
    }
    record.blocks.forEach((b) => b.nodes?.forEach((n) => text(n)));
    await page.goto('http://127.0.0.1:3101' + entry.path, { waitUntil: 'load' });
    const actual = await page.locator('#main').evaluate((root) => {
      const copy = root.cloneNode(true);
      copy.querySelectorAll('[data-content-control],svg,iframe').forEach((e) => e.remove());
      return copy.textContent;
    });
    const ids = await page.locator('#main, #main [id]').evaluateAll((es) => es.map((e) => e.id));
    const missingAnchors = record.inventory.anchors.filter(
      (id) =>
        !['52e9a9a2a8415a874a4337279c6a13e0', 'mce-MMERGE32', 'mce-MMERGE33'].includes(id) &&
        !ids.includes(id),
    );
    checks.push({
      path: entry.path,
      copyMatches: normalize(expected) === normalize(actual || ''),
      missingAnchors,
      expectedCharacters: normalize(expected).length,
      actualCharacters: normalize(actual || '').length,
    });
    if (!checks.at(-1).copyMatches)
      fs.writeFileSync(
        '_source/phase-04/parity-' + entry.path.replace(/\//g, '_') + '.json',
        JSON.stringify({ expected: normalize(expected), actual: normalize(actual || '') }),
      );
  }
} finally {
  await browser.close();
}
fs.writeFileSync(
  'docs/reports/phase-04-rendered-parity.json',
  JSON.stringify(checks, null, 2) + '\n',
);
console.log(
  JSON.stringify({
    pages: checks.length,
    copyMatches: checks.filter((r) => r.copyMatches).length,
    anchorFailures: checks.filter((r) => r.missingAnchors.length),
    copyFailures: checks.filter((r) => !r.copyMatches).map((r) => r.path),
  }),
);
