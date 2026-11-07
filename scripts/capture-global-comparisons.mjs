import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
const destination=path.resolve('docs/reports/phase-02-visual');
fs.mkdirSync(destination,{recursive:true});
const browser=await chromium.launch();
const records=[];
try {
  for(const locale of ['en','es'])for(const width of [1440,390]){
    const context=await browser.newContext({viewport:{width,height:width===1440?1000:844},deviceScaleFactor:1});
    const pages=[];
    for(const [kind,origin] of [['source','https://yourcnastory.org'],['foundation','http://127.0.0.1:3101']]){
      const page=await context.newPage();
      const url=origin+(locale==='es'?'/es/':'/');
      await page.goto(url,{waitUntil:'load'});
      await page.mouse.move(12,12);
      await page.evaluate(()=>document.fonts.ready);
      await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0)});
      const clipWidth=await page.evaluate(()=>document.documentElement.clientWidth);
      const stem=locale+'-'+width+'-'+kind;
      await page.screenshot({path:path.join(destination,stem+'-header.jpg'),type:'jpeg',quality:90,animations:'disabled',clip:{x:0,y:0,width:clipWidth,height:width===1440?120:95}});
      await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,document.body.scrollHeight)});
      pages.push({page,kind,url,stem});
    }
    for(const item of pages){
      await item.page.locator(item.kind==='source'?'#footer':'footer').screenshot({path:path.join(destination,item.stem+'-footer.jpg'),type:'jpeg',quality:90,animations:'disabled',style:'header, .masthead, .skip-link { visibility: hidden !important; }'});
      records.push({locale,width,kind:item.kind,url:item.url,files:[item.stem+'-header.jpg',item.stem+'-footer.jpg'],capturedAt:new Date().toISOString()});
    }
    await context.close();
  }
}finally{await browser.close();}
fs.writeFileSync(path.join(destination,'index.json'),JSON.stringify(records,null,2)+'\n');
const rows=[];
for(const locale of ['en','es'])for(const width of [1440,390])for(const region of ['header','footer'])rows.push(`<section><h2>${locale.toUpperCase()} · ${width}px · ${region}</h2><div class="pair"><figure><figcaption>Live source</figcaption><img src="${locale}-${width}-source-${region}.jpg" alt="Live ${locale} ${region}"></figure><figure><figcaption>Phase 2 foundation</figcaption><img src="${locale}-${width}-foundation-${region}.jpg" alt="Foundation ${locale} ${region}"></figure></div></section>`);
fs.writeFileSync(path.join(destination,'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><title>Phase 2 global comparisons</title><style>body{font:15px/1.5 system-ui;margin:24px;color:#222}h1{font-size:24px}h2{font-size:18px}section{padding:24px 0;border-top:1px solid #ddd}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0;min-width:0}figcaption{margin-bottom:10px}img{display:block;max-width:100%;height:auto;border:1px solid #ddd}</style><h1>Phase 2 global layout review</h1><p>Header/footer only. Page-body content and photographic/video context are built in later phases. Source menus remain active; foundation Employers destinations are gated. These are review references, not a pixel-parity certification.</p>${rows.join('')}</html>`);
console.log(JSON.stringify({comparisonSets:8,images:records.length*2,directory:destination}));
