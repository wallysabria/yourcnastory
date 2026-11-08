import fs from 'node:fs';
import postcss from 'postcss';
import { format, resolveConfig } from 'prettier';
import { createHash } from 'node:crypto';

function semanticHeadings(css) {
  const root = postcss.parse(css);
  root.walkRules((rule) => {
    const selector = rule.selector;
    let out = '',
      quote = '',
      brackets = 0;
    for (let i = 0; i < selector.length; i++) {
      const ch = selector[i];
      if (quote) {
        out += ch;
        if (ch === quote && selector[i - 1] !== '\\') quote = '';
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
        out += ch;
        continue;
      }
      if (ch === '[') brackets++;
      if (ch === ']') brackets--;
      const token = selector.slice(i, i + 2);
      if (
        !brackets &&
        /^h[1-6]$/.test(token) &&
        !/[\w.#-]/.test(selector[i - 1] || '') &&
        !/[\w-]/.test(selector[i + 2] || '')
      ) {
        // :where keeps the original type selector specificity (0,0,1).
        const alternatives = [
          token + ':where(:not([class*="semantic-source-h"]))',
          ...[1, 2, 3, 4, 5, 6]
            .filter((n) => 'h' + n !== token)
            .map((n) => 'h' + n + ':where(.semantic-source-' + token + ')'),
        ];
        out += ':is(' + alternatives.join(',') + ')';
        i++;
      } else out += ch;
    }
    rule.selector = out;
  });
  return root.toString();
}

const pages = JSON.parse(fs.readFileSync('content/layout/pages.json'));
const counts = {};
for (const page of Object.values(pages))
  for (const url of page.styles) counts[url] = (counts[url] || 0) + 1;
const mapping = {};
fs.mkdirSync('public/styles/bundles', { recursive: true });
for (const [path, page] of Object.entries(pages)) {
  const groups = [];
  for (const url of page.styles) {
    const shared = counts[url] > 1;
    if (groups.at(-1)?.shared === shared) groups.at(-1).urls.push(url);
    else groups.push({ shared, urls: [url] });
  }
  mapping[path] = groups.map(({ urls }) => {
    // Concatenate adjacent resources only: preserve every selector and cascade position.
    const css = semanticHeadings(
      urls.map((url) => fs.readFileSync('public' + url, 'utf8')).join('\n'),
    );
    const hash = createHash('sha256').update(css).digest('hex').slice(0, 16);
    const url = '/styles/bundles/' + hash + '.css';
    fs.writeFileSync('public' + url, css);
    return url;
  });
}
fs.writeFileSync(
  'content/layout/style-bundles.json',
  await format(JSON.stringify(mapping), {
    ...(await resolveConfig('content/layout/style-bundles.json')),
    parser: 'json',
  }),
);
console.log('Bundled styles for', Object.keys(mapping).length, 'routes; original assets retained.');
