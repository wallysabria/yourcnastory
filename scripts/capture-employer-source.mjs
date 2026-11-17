import fs from 'node:fs';
import { load } from 'cheerio';
import { hash, origin, write } from './content-source.mjs';
const paths = [
  '/cna-certifications/',
  '/employer-resources/',
  '/cnap-employer-signup/',
  '/cnap-awards/',
  '/faqs/',
  '/cusp-upskilling/',
];
const rows = await Promise.all(
  paths.map(async (path) => {
    const response = await fetch(origin + path, {
      redirect: 'manual',
      signal: AbortSignal.timeout(45000),
    });
    if (response.status !== 200) throw Error(path + ' HTTP ' + response.status);
    const html = await response.text();
    const file = hash(origin + path).slice(0, 20) + '.html';
    fs.writeFileSync('_source/phase-08/' + file, html);
    const $ = load(html);
    return {
      path,
      url: origin + path,
      locale: 'en',
      status: 200,
      filename: file,
      capturedAt: new Date().toISOString(),
      sha256: hash(html),
      title: $('title').text(),
      headings: $('#main h1,#main h2')
        .map((_, e) => $(e).text())
        .get(),
      forms: $('#main iframe')
        .map((_, e) => ({ src: $(e).attr('src'), title: $(e).attr('title') }))
        .get(),
    };
  }),
);
write('_source/phase-08/reconciliation.json', rows);
console.log(
  JSON.stringify(
    rows.map(({ path, title, headings, forms }) => ({ path, title, headings, forms })),
    null,
    2,
  ),
);
