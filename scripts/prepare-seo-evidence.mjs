import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
const entries = JSON.parse(fs.readFileSync('content/pages/index.json'));
const routes = JSON.parse(fs.readFileSync('content/routing/slug-map.json'));
const en = JSON.parse(fs.readFileSync('content/global/en.json'));
const records = {};
const extras = {};
const text = n => n.type === 'text' ? n.value : n.children.map(text).join('');
const classes = n => (n.source?.classes || '').split(/\s+/);
const find = (n, name) => n.type === 'element' && classes(n).includes(name) ? n : n.type === 'element' ? n.children.map(c => find(c, name)).find(Boolean) : undefined;
for (const entry of entries) {
 const page = JSON.parse(fs.readFileSync(entry.file));
 const url = page.provenance.url;
 const file = '_source/phase-03/' + createHash('sha256').update(url).digest('hex').slice(0,20) + '.html';
 const $ = load(fs.readFileSync(file,'utf8'));
 const meta = key => $('meta[property="' + key + '"]').attr('content') || '';
 const modified = meta('article:modified_time');
 extras[entry.path] = { ogType: meta('og:type'), ogPublishedTime: meta('article:published_time'), ogLocale: meta('og:locale'), ogSiteName: meta('og:site_name'), ogImageWidth:meta('og:image:width'),ogImageHeight:meta('og:image:height'),ogImageType:meta('og:image:type'),ogImageAlt:meta('og:image:alt'),lastModified:modified && !Number.isNaN(Date.parse(modified)) ? modified : null,lastModifiedEvidence:modified?'archived article:modified_time':'unavailable; capture time is not modification time',snapshotHash:page.provenance.snapshotHash };
 const route = routes.find(r => r.path === entry.path);
 const headings=[];const collect=n=>{if(n.type!=='element')return;if(/^h[1-6]$/.test(n.tag))headings.push(n);n.children.forEach(collect);};for(const block of page.blocks)if(block.nodes)block.nodes.forEach(collect);
 const primary=headings.find(n=>n.tag==='h1')||headings[0];
 const visibleName=primary?text(primary).replace(/\s+/g,' ').trim():route.heading;

 const root = route.locale === 'es' ? '/es/' : '/';
 const global = JSON.parse(fs.readFileSync('content/global/' + route.locale + '.json'));
 const breadcrumbs = [{name: global.header?.logoAlt || 'CNAP', path:root}];
 if(entry.path !== root) breadcrumbs.push({name:visibleName || page.metadata.ogTitle,path:entry.path});
 const questions = [];
 if(route.template === 'faq-accordion') {
  const visit=n=>{if(n.type!=='element')return;if(classes(n).includes('elementor-accordion-item')){const q=find(n,'elementor-tab-title');const a=find(n,'elementor-tab-content');if(q&&a)questions.push({question:text(q).replace(/\s+/g,' ').trim(),answer:text(a).replace(/\s+/g,' ').trim()});}else n.children.forEach(visit);};
  for(const b of page.blocks)if(b.nodes)b.nodes.forEach(visit);
 }
 records[entry.path]={name:visibleName,breadcrumbs,questions};
}
fs.writeFileSync('content/seo/source-head.json',JSON.stringify(extras,null,2)+'\n');
fs.writeFileSync('content/seo/pages.json',JSON.stringify(records,null,2)+'\n');
fs.writeFileSync('content/seo/organization.json',JSON.stringify({name:en.footer.copyrightLinkLabel,url:en.footer.foundationHref,description:en.footer.description,siteName:'Your CNA Story',programName:'Certified Nurse Assistant Program (CNAP)'},null,2)+'\n');
console.log({pages:entries.length,dates:Object.values(extras).filter(r=>r.lastModified).length,types:[...new Set(Object.values(extras).map(r=>r.ogType))],faq:Object.entries(records).filter(([,v])=>v.questions.length).map(([p,v])=>[p,v.questions.length])});
