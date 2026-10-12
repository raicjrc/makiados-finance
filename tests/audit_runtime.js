// Auditoría dinámica (solo lectura): demo local, Supabase bloqueado, sin escribir datos.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};
const srv = http.createServer((req,res)=>{ let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/')p='/index.html';
  const f=path.join(root,p); if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(res);});
(async()=>{
  await new Promise(r=>srv.listen(4599,r));
  const browser = await chromium.launch({channel:'chrome',headless:true}).catch(()=>chromium.launch({headless:true}));
  const out = {errors:[],small:[],overflow:[],smallInputs:[],failedModals:[]};
  for (const vp of [{n:'mobile',w:390,h:844},{n:'desktop',w:1280,h:800}]) {
    const ctx = await browser.newContext({viewport:{width:vp.w,height:vp.h},isMobile:vp.n==='mobile',hasTouch:vp.n==='mobile'});
    await ctx.route(/supabase\.co/, r=>r.abort());
    const page = await ctx.newPage();
    page.on('pageerror',e=>out.errors.push(`[${vp.n}] PAGEERROR ${e.message}`));
    page.on('console',m=>{ if(m.type()==='error'&&!/supabase|Failed to load resource|ERR_FAILED/.test(m.text())) out.errors.push(`[${vp.n}] console: ${m.text().slice(0,200)}`)});
    await page.goto('http://localhost:4599/index.html?demo=1',{waitUntil:'load'});
    await page.waitForTimeout(2500);
    for (const t of ['inicio','movimientos','plan','metas','consejos']) {
      await page.evaluate(t=>{ try{switchTab(t)}catch(e){console.error('switchTab '+t+': '+e.message)} },t);
      await page.waitForTimeout(500);
      const r = await page.evaluate(()=>{
        const vw=document.documentElement.clientWidth; const o=[],s=[],i=[];
        document.querySelectorAll('.tab-content.active *').forEach(el=>{
          const b=el.getBoundingClientRect(); if(!b.width||!b.height) return; const cs=getComputedStyle(el);
          if(cs.visibility==='hidden'||cs.display==='none') return;
          if(b.right>vw+2 && !el.closest('[style*="overflow"]') ) o.push((el.id||el.className||el.tagName).toString().slice(0,50));
          if((el.tagName==='BUTTON'||el.tagName==='A'||el.getAttribute('onclick'))&&(b.width<40||b.height<40)&&b.width>0) s.push(((el.id||el.textContent||el.className)+'').trim().slice(0,35)+` ${Math.round(b.width)}x${Math.round(b.height)}`);
          if(['INPUT','SELECT','TEXTAREA'].includes(el.tagName)&&parseFloat(cs.fontSize)<16&&el.type!=='checkbox'&&el.type!=='radio') i.push((el.id||el.name||el.className)+' '+cs.fontSize);
        }); return {o:[...new Set(o)].slice(0,8),s:[...new Set(s)].slice(0,12),i:[...new Set(i)]};
      });
      if(r.o.length) out.overflow.push(`[${vp.n}/${t}] ${r.o.join(', ')}`);
      if(r.s.length) out.small.push(`[${vp.n}/${t}] ${r.s.join(' | ')}`);
      if(r.i.length) out.smallInputs.push(`[${vp.n}/${t}] ${r.i.join(', ')}`);
    }
    // Abrir cada modal declarado en HTML
    const calls = await page.evaluate(()=>[...new Set([...document.querySelectorAll('[onclick]')].map(e=>e.getAttribute('onclick')).filter(c=>/^open[A-Za-z]+\(\)$/.test(c)))]);
    for (const c of calls) {
      if (/DeleteAccount|Forgot/.test(c)) continue;
      await page.evaluate(()=>{ try{document.querySelectorAll('.modal-overlay,.modal').forEach(m=>m.classList.remove('active'))}catch{} });
      const err = await page.evaluate(c=>{ try{ eval(c); return null }catch(e){ return e.message } },c);
      if (err) out.failedModals.push(`[${vp.n}] ${c} -> ${err}`);
      await page.waitForTimeout(250);
    }
    await ctx.close();
  }
  console.log(JSON.stringify(out,null,1)); await browser.close(); srv.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1)});
