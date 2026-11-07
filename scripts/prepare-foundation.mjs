import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const root = process.cwd();
const require = createRequire(path.join(root, '_source/audit-tools/package.json'));
const { load } = require('cheerio');
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const write = (name, value) => { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); };
const manifest = read('docs/audit/url-manifest.json');
const origin = 'https://yourcnastory.org';
const pathname = (url) => new URL(url, origin).pathname;
const records = manifest.filter(p => ['en', 'es'].includes(p.lang) && p.status === 200 && ['career-seekers', 'shared', 'employers'].includes(p.section)).map(p => ({
  id: p.lang === 'en' ? pathname(p.url) : p.counterpart ? pathname(p.counterpart) : pathname(p.url),
  path: pathname(p.url), locale: p.lang, section: p.section,
  counterpart: p.counterpart ? pathname(p.counterpart) : null,
  template: p.template_guess,
  metadata: p.section === 'employers' ? null : { title: p.title, description: p.meta_description, canonical: p.canonical, robots: p.robots, ogTitle: p.og_title, ogDescription: p.og_description, ogImage: p.og_image },
  heading: p.section === 'employers' ? null : p.h1?.[0] || p.title.split(' - Certified Nurse Assistant Program (CNAP)')[0],
  anchors: p.section === 'employers' ? [] : p.anchors.filter(id => !/^elementor|^e-|^Layer_|^menu-|^mce-|^mc_|^floating|^chat|^post-/.test(id)),
}));
write('content/routing/slug-map.json', records);
write('content/routing/reserved-routes.json', manifest.filter(p => !records.some(r => r.path === pathname(p.url))).map(p => ({ path: pathname(p.url), locale: p.lang, observedStatus: p.status, section: p.section, reason: 'Audit-only; unresolved disposition or retired/redirected URL. Not a rendered page.' })));
const routes = new Map(records.map(r => [r.path, r]));
const normalize = p => p === '/' ? '/' : p.replace(/\/$/, '') + '/';
const url = value => { if (!value) return ''; try { const u = new URL(value, origin); return u.origin === origin ? normalize(u.pathname) + u.hash : u.href; } catch { return value; } };
function cached(url) { const key = crypto.createHash('sha256').update('GET ' + url).digest('hex').slice(0, 20); return read('_source/audit-cache/' + key + '.json').body; }
const globalSources = [];
for (const locale of ['en', 'es']) {
  const sourceUrl = origin + (locale === 'en' ? '/' : '/es/');
  const $ = load(cached(sourceUrl));
  const nav = $('header nav').first().children('ul').children('li').toArray().slice(0, 2).map((li, index) => ({
    label: $(li).children('a').first().text().trim(), href: url($(li).children('a').attr('href')), employer: index === 0,
    columns: $(li).find('[data-elementor-type="the7-mega-menu"] .elementor-top-column').toArray().map(c => ({
      title: $(c).find('h2').first().text().trim(), items: $(c).find('a[href]').toArray().map(a => ({ label: $(a).text().trim(), href: url($(a).attr('href')), employer: index === 0 })),
    })),
  }));
  const mobileRoot = $('[data-elementor-type="popup"][data-elementor-id="73689"] nav').first();
  function tree(list, employer) { return list.children('li').toArray().map(li => { const a = $(li).children('a').first(); return { label: a.find('.menu-text').first().text().trim() || a.text().trim(), href: a.attr('href') && a.attr('href') !== '#' ? url(a.attr('href')) : null, employer, children: tree($(li).children('ul').first(), employer) }; }); }
  const mobile = tree(mobileRoot.children('ul').first(), false).slice(0, 2).map((item, index) => ({ ...item, employer: index === 0, children: item.children.map(child => ({ ...child, employer: index === 0, children: child.children.map(c => ({ ...c, employer: index === 0 })) })) }));
  const footer = $('[data-elementor-type="footer"]');
  const description = footer.find('.elementor-widget-text-editor').first().text().trim();
  const columns = footer.find('.elementor-top-column').toArray().filter(c => $(c).find('h4').length).map((c, index) => ({ title: $(c).find('h4').first().text().trim(), href: url($(c).find('h4 a').attr('href')), employer: index === 0, items: $(c).find('a[href]').toArray().filter(a => !$(a).closest('h4').length).map(a => ({ label: $(a).text().trim(), href: url($(a).attr('href')), employer: index === 0 })) }));
  const policy = footer.find('a[href*="privacy-policy"],a[href*="politica-de-privacidad"]').first();
  const copyright = footer.find('.elementor-widget-text-editor').last().text().trim();
  const eventLink = $('header a[href*="eventcd="]').first();
  const announcement = eventLink.length ? { enabled: !['desktop','tablet','mobile'].every(device => (eventLink.closest('.elementor-top-section').attr('class') || '').includes('elementor-hidden-' + device)), text: eventLink.closest('.elementor-widget-text-editor').text().trim(), linkLabel: eventLink.text().trim(), href: eventLink.attr('href') } : null;
  const settings = { locale, sourceUrl, nav, mobile, announcement, footer: { description, columns, copyright, copyrightLinkLabel: footer.find('.elementor-widget-text-editor').last().find('a').text().trim(), policy: { label: policy.text().trim(), href: url(policy.attr('href')) }, foundationHref: 'https://www.cahf.org/Education-Events/QCHF', logoAlt: footer.find('img').first().attr('alt') || '' }, ui: locale === 'en' ? { menu: 'MENU', closeMenu: 'Close menu', openMenu: 'Open menu', navigation: 'Main navigation', languages: 'Language', search: 'Search', skip: 'Skip to content', top: 'Go to Top' } : { menu: $('[data-elementor-type="popup"][data-elementor-id="73689"] h2').first().text().trim() || 'MENU', closeMenu: 'Cerrar menú', openMenu: 'Abrir menú', navigation: 'Navegación principal', languages: 'Idioma', search: 'Buscar', skip: 'Ir al contenido', top: 'Volver arriba' } };
  write('content/global/' + locale + '.json', settings);
  globalSources.push({ locale, sourceUrl, method: 'Existing public crawl cache; textContent trimmed only at element boundaries; page bodies excluded', strings: Object.values(settings.ui) });
}
const proposed = read('docs/audit/redirects-proposed.json');
const active = [], pending = [];
for (const row of proposed) {
  const from = pathname(row.from), to = pathname(row.to);
  const target = routes.get(to);
  // Only deterministic, already-authorized slash and retired-language policies.
  if (row.status === 'proposed' && target && (from === to.replace(/\/$/, '') || /^\/(vi|zh)(\/|$)/.test(from))) active.push({ from, to, status: 301, policy: /^\/(vi|zh)(\/|$)/.test(from) ? 'retired-language' : 'trailing-slash' });
  else pending.push({ ...row, reasonPending: 'Explicit owner URL disposition/pair approval or later content scope required' });
}
write('content/routing/redirects.json', active);
write('content/routing/deferred-redirects.json', pending.map(row=>({from: pathname(row.from), to: pathname(row.to)})));
write('docs/reports/phase-02-redirects-deferred.json', pending);
write('docs/reports/phase-02-global-provenance.json', globalSources);
const assets = [
 ['https://yourcnastory.org/wp-content/uploads/2023/01/cnap-white-reversed-logo-v2.webp', 'public/images/brand/cnap-logo-white.webp'],
 ['https://yourcnastory.org/wp-content/uploads/2023/09/cnap-transparent-logo-v2.webp', 'public/images/brand/cnap-logo-color.webp'],
 ['https://yourcnastory.org/wp-content/uploads/2020/11/qchf-logo-reversed.png', 'public/images/brand/qchf-logo-white.png'],
 ['https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/Manrope%5Bwght%5D.ttf', 'public/fonts/manrope-variable.ttf'],
 ['https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt', 'public/fonts/OFL-Manrope.txt'],
];
for (const [source, destination] of assets) { const file = path.join(root, destination); if (fs.existsSync(file)) continue; const response = await fetch(source); if (!response.ok) throw Error(source + ' ' + response.status); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, Buffer.from(await response.arrayBuffer())); }
write('content/global/assets.json', assets.map(([source, destination]) => ({ source, path: '/' + destination.replace(/^public\//, '') })));
console.log(JSON.stringify({ routes: records.length, renderable: records.filter(r => r.section !== 'employers').length, activeRedirects: active.length, deferredRedirects: pending.length }));
