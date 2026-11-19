import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { load } from 'cheerio';
const dir = 'docs/reviews/content-privacy';
fs.mkdirSync(dir + '/spanish-pages', { recursive: true });
const index = JSON.parse(fs.readFileSync('content/pages/index.json')).filter(
  (r) => r.locale === 'es',
);
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json'));
const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3108'],
  { windowsHide: true, stdio: 'ignore' },
);
const pages = [];
const findings = [];
const escape = (s) => String(s).replaceAll('|', '\\|').replace(/\s+/g, ' ').trim();
try {
  for (let i = 0; i < 100; i++) {
    try {
      await fetch('http://127.0.0.1:3108');
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  for (const entry of index) {
    const r = await fetch('http://127.0.0.1:3108' + entry.path);
    if (r.status !== 200) throw Error(entry.path + ' HTTP ' + r.status);
    const $ = load(await r.text());
    const main = $('#main');
    main.find('script,style,noscript,svg').remove();
    const normalized = main.text().replace(/\s+/g, ' ').trim();
    const route = routes.find((r) => r.path === entry.path);
    const filename = entry.path.slice(1, -1).replaceAll('/', '--') + '.md';
    const blockTags = new Set(
      'div section article aside p li ul ol figcaption label button fieldset legend table tr td th blockquote figure'.split(
        ' ',
      ),
    );
    const reader = (n) => {
      if (n.type === 'text') return n.data;
      const text = (n.children || []).map(reader).join('');
      if (/^h[1-6]$/.test(n.name || '')) return '\n\n### ' + text + '\n\n';
      if (n.name === 'br') return '\n';
      return blockTags.has(n.name) ? '\n\n' + text + '\n\n' : text;
    };
    const readerText = reader(main[0])
      .split('\n')
      .map((s) => s.replace(/\s+/g, ' ').trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (readerText.replace(/^### /gm, '').replace(/\s+/g, '') !== normalized.replace(/\s+/g, ''))
      throw Error('Text omitted in worksheet ' + entry.path);
    fs.writeFileSync(
      dir + '/spanish-pages/' + filename,
      '# ' +
        $('title').text() +
        '\n\nReview URL: https://yourcnastory.vercel.app' +
        entry.path +
        '\n\nEnglish counterpart: https://yourcnastory.vercel.app' +
        route.counterpart +
        '\n\n**Reviewer worksheet only. Not replacement page content.** Normalized text from the local rendered main content; includes carousel/panel text for review, even when initially inactive. Link destinations, alt text and visual fit must also be reviewed on the page. Complete text-character coverage is checked before writing; whitespace is normalized.\n\nDecision: **pending** · Reviewer: **unassigned** · Date: **pending**\n\n## Reader text\n\n' +
        readerText +
        '\n',
    );
    const terms = [...normalized.matchAll(/Consulta los términos\./g)].length;
    const artifacts = /\.cls-[a-z0-9-]+\s*\{|stroke-miterlimit/.test(normalized);
    const emails = [...new Set(normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [])];
    pages.push({
      path: entry.path,
      title: $('title').text(),
      counterpart: route.counterpart,
      worksheet: 'spanish-pages/' + filename,
      readerCharacters: normalized.length,
      termsLabels: terms,
      svgArtifact: artifacts,
      emails,
    });
    if (terms > 1) findings.push({ path: entry.path, kind: 'Repeated terms labels', count: terms });
    if (artifacts) findings.push({ path: entry.path, kind: 'Visible SVG styling artifact' });
  }
} finally {
  server.kill();
}
let md =
  '# Spanish review register\n\nCurrent inventory: **' +
  pages.length +
  ' Spanish Career Seekers/shared pages**. Employers remains English-only. Every page needs a named native reviewer and an explicit verdict; listing/capturing a page is not linguistic approval. Source wording and metadata remain frozen until owner-approved edits.\n\n| Page | English counterpart | Worksheet | Verdict |\n|---|---|---|---|\n';
for (const p of pages)
  md +=
    '| [' +
    escape(p.title) +
    '](https://yourcnastory.vercel.app' +
    p.path +
    ') | `' +
    p.counterpart +
    '` | [Text worksheet](' +
    p.worksheet +
    ') | Pending native review |\n';
fs.writeFileSync(dir + '/spanish-register.md', md);
const ui = [];
for (const file of fs.readdirSync('content/ui')) {
  const data = JSON.parse(fs.readFileSync('content/ui/' + file));
  if (!data.es) continue;
  for (const [key, value] of Object.entries(data.es))
    ui.push({ key: path.basename(file, '.json') + '.' + key, en: data.en?.[key] || '', es: value });
}
const en = JSON.parse(fs.readFileSync('content/global/en.json')),
  es = JSON.parse(fs.readFileSync('content/global/es.json'));
for (const [key, value] of Object.entries(es.ui))
  ui.push({ key: 'global.ui.' + key, en: en.ui[key], es: value });
fs.writeFileSync(
  dir + '/spanish-interface.md',
  '# Current Spanish interface review\n\nExact catalog values, not the superseded proposals copied into older handoffs. No changes applied. Review tone, terminology, punctuation, placeholders and length in context. Preserve token names such as {count}. Preview/mock strings must be replaced only when the corresponding integration is actually live.\n\n| Key | English | Current Spanish | Verdict |\n|---|---|---|---|\n' +
    ui
      .map(
        (r) =>
          '| `' +
          r.key +
          '` | ' +
          escape(r.en) +
          ' | ' +
          escape(r.es) +
          ' | Pending native review |',
      )
      .join('\n') +
    '\n',
);
fs.writeFileSync(
  dir + '/inventory.json',
  JSON.stringify(
    {
      reviewDate: '2026-11-19',
      sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
      method:
        'Local rendered text-block inventory plus exact UI catalogs; not native-language, legal, field or live-integration approval.',
      spanishPages: pages,
      interfaceStrings: ui.length,
      automatedFindings: findings,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  JSON.stringify({
    spanishPages: pages.length,
    interfaceStrings: ui.length,
    automatedFindings: findings,
  }),
);
