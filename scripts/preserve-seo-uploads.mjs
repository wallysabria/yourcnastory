import fs from 'node:fs';import path from 'node:path';import{createHash}from'node:crypto';
const pages=JSON.parse(fs.readFileSync('content/pages/index.json')).map(e=>JSON.parse(fs.readFileSync(e.file)));const manifest=JSON.parse(fs.readFileSync('content/media/manifest.json'));const report=[];
for(const url of[...new Set(pages.map(p=>p.metadata.ogImage).filter(Boolean))]){const u=new URL(url);if(u.hostname!=='yourcnastory.org'||!u.pathname.startsWith('/wp-content/uploads/'))continue;const source=manifest.find(m=>m.url===url);if(!source)throw Error('Missing original '+u.pathname);const bytes=fs.readFileSync('public'+source.path);const target=path.resolve('public'+decodeURI(u.pathname));if(!target.startsWith(path.resolve('public/wp-content/uploads')+path.sep))throw Error('Invalid upload target');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);report.push({url,path:u.pathname,source:source.path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),reason:'Preserve frozen in-scope Open Graph image URL with original imported bytes.'});}
for(const file of['CNA-Toolkit-English.pdf','CNA-Toolkit-Spanish.pdf']){const upload='/wp-content/uploads/2023/09/'+file;const r=await fetch('https://yourcnastory.org'+upload);if(!r.ok||!r.headers.get('content-type')?.includes('pdf'))throw Error('Toolkit response '+r.status);const bytes=Buffer.from(await r.arrayBuffer());if(bytes.subarray(0,5).toString()!=='%PDF-')throw Error('Invalid PDF');const target='public'+upload;fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);report.push({url:'https://yourcnastory.org'+upload,path:upload,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),reason:'Search Console-referenced Career Seekers toolkit; preserve exact original path.',contentType:'application/pdf'});}

const additionalImages = [
  ['/wp-content/uploads/2024/01/CUSP-graphic-2024-01-11-163416.png', 'Original image used on approved CNA Program EN/ES pages; confirmed in media manifest.'],
  ['/wp-content/uploads/2024/01/CNA-Flyer-Photo-1.11.24.png', 'WXR attachment 97277 parent 94617 is the approved Community Resources page.'],
  ['/wp-content/uploads/elementor/thumbs/cnap-cta-banner-background2-1-qc8m6uah7d5sr98xi8ec2y6eqld7i63pl21llqt740-qkrdewbvadfjiww7d0xnu2a09e5zvq394uc6bqhe0w.webp', 'Search Console historical thumbnail of the approved Career Seekers CTA background; preserve exact original response.'],
];
for (const [upload, reason] of additionalImages) {
  const url = 'https://yourcnastory.org' + upload;
  const imported = manifest.find(item => item.url === url);
  let bytes;
  if (imported) bytes = fs.readFileSync('public' + imported.path);
  else { const response = await fetch(url); if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw Error('Original image response ' + response.status); bytes = Buffer.from(await response.arrayBuffer()); }
  const target = 'public' + upload; fs.mkdirSync(path.dirname(target), {recursive:true}); fs.writeFileSync(target, bytes);
  report.push({url, path:upload, bytes:bytes.length, sha256:createHash('sha256').update(bytes).digest('hex'), reason});
}

fs.writeFileSync('content/seo/preserved-uploads.json',JSON.stringify(report,null,2)+'\n');console.log({preserved:report.length,bytes:report.reduce((s,r)=>s+r.bytes,0)});
