/* npm install --prefix /tmp/rf-test jsdom@26
   NODE_PATH=/tmp/rf-test/node_modules node tools/test-app.cjs */
const {JSDOM}=require('jsdom');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const origin='https://example.org/IV-anno/Approfondimenti/Rivoluzione-francese/';
const tick=()=>new Promise(r=>setTimeout(r,0));
async function page(file,blocked=false){
 const dom=new JSDOM(read(file),{url:origin+file,runScripts:'outside-only'});
 const w=dom.window;
 w.fetch=async f=>({ok:true,json:async()=>JSON.parse(read(f))});
 if(blocked)Object.defineProperty(w,'localStorage',{get(){throw new Error('storage unavailable')}});
 w.eval(read('app.js'));await tick();return dom;
}
(async()=>{
 let dom=await page('fase-brumaio.html'),w=dom.window,d=w.document;
 d.querySelector('[data-read]').click();assert.equal(d.querySelector('[data-read]').getAttribute('aria-pressed'),'true');
 assert.match(w.localStorage.getItem('gbprof-rivoluzione-approfondimento:read'),/fase-brumaio/);
 d.querySelector('[data-read]').click();assert.equal(d.querySelector('[data-read]').getAttribute('aria-pressed'),'false');
 d.querySelector('#font-size').click();assert.equal(d.documentElement.style.getPropertyValue('--reading'),'1.22rem');dom.window.close();
 dom=await page('fase-brumaio.html',true);dom.window.document.querySelector('[data-read]').click();assert.match(dom.window.document.querySelector('.read-status').textContent,/non consente/);dom.window.close();
 dom=await page('diario.html');w=dom.window;d=w.document;
 d.querySelector('#filter-phase').value='brumaio';d.querySelector('#filter-phase').dispatchEvent(new w.Event('change'));
 assert.equal(d.querySelectorAll('[data-filter]:not([hidden])').length,2);
 d.querySelector('#filter-text').value='zzzx';d.querySelector('#filter-text').dispatchEvent(new w.Event('input'));assert.equal(d.querySelector('#filter-empty').hidden,false);dom.window.close();
 dom=await page('cerca.html');w=dom.window;d=w.document;
 const input=d.querySelector('#search-all');input.value='Brumaio';input.dispatchEvent(new w.Event('input'));
 assert.ok(d.querySelectorAll('#search-results li').length>0);
 input.value='<img src=x onerror=alert(1)>';input.dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('#search-results img').length,0);dom.window.close();
 dom=await page('test.html');w=dom.window;d=w.document;d.querySelector('#start-quiz').click();await tick();
 const bank=JSON.parse(read('quiz.json'));
 let fields=[...d.querySelectorAll('#quiz fieldset')];assert.equal(fields.length,10);
 assert.equal(new Set(fields.map(f=>bank.find(q=>f.querySelector('legend').textContent.endsWith(q.question)).phase)).size,6);
 // Tutte corrette: risposte mescolate, punteggio e persistenza.
 for(const f of fields){const q=bank.find(q=>f.querySelector('legend').textContent.endsWith(q.question));[...f.querySelectorAll('label')].find(l=>l.textContent===q.correct).querySelector('input').checked=true;}
 d.querySelector('#quiz').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.match(d.querySelector('#quiz-result').textContent,/10\/10/);assert.equal(JSON.parse(w.localStorage.getItem('gbprof-rivoluzione-approfondimento:score')).correct,10);
 // Nuovo tentativo, tutte errate: feedback e recuperi accessibili.
 d.querySelector('#retry').click();await tick();fields=[...d.querySelectorAll('#quiz fieldset')];
 for(const f of fields){const q=bank.find(q=>f.querySelector('legend').textContent.endsWith(q.question));[...f.querySelectorAll('label')].find(l=>l.textContent!==q.correct).querySelector('input').checked=true;}
 d.querySelector('#quiz').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.match(d.querySelector('#quiz-result').textContent,/0\/10/);assert.equal(d.querySelectorAll('.feedback:not(.correct)').length,10);assert.ok(d.querySelectorAll('#quiz-result li a').length>0);dom.window.close();
 // Service worker: rete indisponibile, tutte le risorse precache e isolamento.
 const handlers={},buckets=new Map(),removed=[];let claimed=false,skipped=false;
 const prefix='gbprof-rivoluzione-approfondimento:'+origin+':';buckets.set(prefix+'old',new Map());buckets.set('altra-pwa',new Map());
 const caches={keys:async()=>[...buckets.keys()],delete:async k=>{removed.push(k);return buckets.delete(k)},open:async k=>{if(!buckets.has(k))buckets.set(k,new Map());const bucket=buckets.get(k);return {addAll:async assets=>{for(const f of assets){const absolute=new URL(f,origin).href;assert.ok(fs.existsSync(path.join(root,f)));bucket.set(absolute,new Response(f));}},match:async req=>{const u=new URL(req.url);u.search='';const item=bucket.get(u.href);return item?.clone();}}}};
 vm.runInNewContext(read('sw.js'),{self:{registration:{scope:origin},addEventListener:(t,fn)=>handlers[t]=fn,clients:{claim:async()=>{claimed=true}},skipWaiting:()=>{skipped=true}},caches,URL,Response,fetch:async()=>{throw Error('offline')}});
 let pending;handlers.install({waitUntil:p=>pending=p});await pending;handlers.activate({waitUntil:p=>pending=p});await pending;
 assert.deepEqual(removed,[prefix+'old']);assert.ok(buckets.has('altra-pwa'));assert.ok(claimed);
 const keys=[...buckets.values()].flatMap(b=>[...b.keys()]);assert.equal(keys.length,128);
 for(const url of keys){let response;handlers.fetch({request:{url:url+'?test=1',method:'GET'},respondWith:p=>response=p});assert.equal((await response).status,200);}
 let intercepted=false;handlers.fetch({request:{url:'https://example.org/IV-anno/index.html',method:'GET'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
 handlers.message({data:{type:'SKIP_WAITING'}});assert.ok(skipped);
 console.log('OK: lettura e caratteri, memoria negata, filtri, ricerca, quiz 10/10 e 0/10 con recupero; 128 risorse offline e cache isolate (simulazione).');
})().catch(e=>{console.error(e);process.exitCode=1});
