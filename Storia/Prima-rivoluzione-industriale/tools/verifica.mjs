/** Collaudo automatico DOM simulato e service worker: non emula Safari o un dispositivo reale. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const root=path.resolve(import.meta.dirname,'..'),repo=path.resolve(root,'../..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const errors=[],downloads=[];
const dom=new JSDOM(read('app.html'),{url:'https://example.test/Storia/Prima-rivoluzione-industriale/app.html#lezioni',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document,$=s=>d.querySelector(s),all=s=>[...d.querySelectorAll(s)];
w.addEventListener('error',e=>errors.push(e.message));
const observers=[];const MO=w.MutationObserver;w.MutationObserver=class extends MO{constructor(f){super(f);observers.push(this)}};
w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
w.HTMLDialogElement.prototype.showModal=function(){this.open=true};
w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};
w.URL.createObjectURL=b=>{downloads.push({blob:b});return 'blob:qa'};w.URL.revokeObjectURL=()=>{};
const originalClick=w.HTMLAnchorElement.prototype.click;
w.HTMLAnchorElement.prototype.click=function(){if(this.hasAttribute('download')){if(downloads.length)downloads.at(-1).name=this.download;return;}return originalClick.call(this)};
w.localStorage.setItem('ancien-illuminisme:notes-other','Appunti da preservare');
w.localStorage.setItem('gbprof-history-focus-font','xlarge');
for(const f of ['js/scope.js','js/data.js','js/content.js','js/app.js','../ui-focus/history-focus.js','../../pwa-common/gbprof-accessibility.js']){Object.defineProperty(d,'currentScript',{configurable:true,value:{src:new URL(f,w.location.href).href}});w.eval(read(f));}
const tick=()=>new Promise(r=>setTimeout(r,110));
async function route(hash){w.location.hash=hash;await tick();assert($('#app h1'),hash);assert(!$('#app h1').textContent.includes('Riparti'),hash)}
const D=w.RI_DATA,T=w.RI_TEXTS;
assert.equal(D.lessons.length,8);assert.equal(D.maps.length,8);assert(D.quiz.length>=16);
for(const l of D.lessons){
 assert.equal(D.guides[l.id].quiz.length,3);assert.equal(D.guides[l.id].sections.length,8);
 assert(T.lessons[l.id].join(' ').split(/\s+/).length>550,l.id);
 await route('lezione-'+l.id);assert($('#readerText'));assert.equal(all('[data-mini] fieldset').length,3);
 for(const m of all('img[src]'))assert(fs.existsSync(path.resolve(root,m.getAttribute('src'))),m.src);
 const form=$('[data-mini]');D.guides[l.id].quiz.forEach((q,i)=>{$(`input[name="mini-${i}"][value="${q.ok}"]`).checked=true});
 form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert($('.mini-report').textContent.includes('3 risposte corrette su 3'));
}
await route('lezione-prima');
$('#notesBox').value='Appunti di prova <nessun HTML> — caffè';$('#notesBox').dispatchEvent(new w.Event('input',{bubbles:true}));
await route('lezione-britannia');assert.equal($('#notesBox').value,'');
await route('lezione-prima');assert.equal($('#notesBox').value,'Appunti di prova <nessun HTML> — caffè');
$('[data-action="export"]').click();assert.equal(downloads.at(-1).name,'prima-rivoluzione-industriale-lessons-prima.txt');
const exported=await new Promise((resolve,reject)=>{const r=new w.FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsText(downloads.at(-1).blob)});assert(exported.includes('Appunti di prova <nessun HTML> — caffè'));
// Evidenziazione di un passaggio realmente presente nel DOM; ripristino cambiando pagina.
const p=$('#readerText p[data-p]'),range=d.createRange();range.setStart(p.firstChild,0);range.setEnd(p.firstChild,25);w.getSelection().removeAllRanges();w.getSelection().addRange(range);w.highlightSelection();assert($('#readerText mark'));$('[data-action="add-highlights"]').click();assert($('#notesBox').value.includes(p.textContent.slice(0,25)));
await route('lezione-britannia');await route('lezione-prima');assert($('#readerText mark'));
$('[data-font="1"]').click();assert.equal(w.localStorage.getItem('gbprof-history-focus-font'),'xlarge');assert.equal(w.localStorage.getItem('prima-industriale:font'),'"large"');
await route('vocabolario');$('#vocab-search').value='salario';$('#vocab-search').dispatchEvent(new w.Event('input',{bubbles:true}));assert(all('#vocab-results dt').length>0&&all('#vocab-results dt').length<D.vocabulary.length);
await route('quiz');
for(let i=0;i<D.quiz.length;i++){
 const q=D.quiz[i],a=i%2===0?q.ok:(q.ok+1)%q.a.length;
 $(`input[name="answer"][value="${a}"]`).checked=true;$('#final-question').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
 assert($('#question-feedback').textContent.includes(q.why));if(i%2)assert($('#question-feedback a').hash===q.link);
 $('[data-action="next-question"]').click();
}
assert($('.lead').textContent.includes('8 risposte corrette su 16'));assert($('.lead').textContent.includes('5/10'));
$('[data-action="export-report"]').click();assert.equal(downloads.at(-1).name,'prima-rivoluzione-industriale-report.txt');
$('[data-action="restart-quiz"]').click();assert($('#app h1').textContent.includes('Domanda 1 di 16'));
for(const m of D.maps){await route('mappa-'+m.id);$('[data-map]').click();assert($('#image-dialog').open);$('#zoom-map').click();assert($('#image-stage').classList.contains('zoomed'));$('#close-image').click();assert(!$('#image-dialog').open)}
for(const doc of D.documents){await route('documento-'+doc.id);$('[data-technical]').click();assert($('#map-text').hidden);$('#close-image').click()}
for(const l of D.lessons){await route('recupero-'+l.id);assert($('#recupero-'+l.id).open)}
for(const x of D.approfondimenti)await route('approfondimento-'+x.id);
for(const r of ['lezioni','approfondimenti','mappe','biografie','timeline','fonti','conclusione','installa','riassunto'])await route(r);
// Collegamenti relativi: file esistenti e ancore del modello effettive.
const refs=[...D.lessons.flatMap(l=>D.guides[l.id].resources.map(r=>r.href))];
for(const href of refs.filter(x=>x.startsWith('../'))){const [file,hash]=href.split('#');const p=path.resolve(root,file);assert(fs.existsSync(p),href);if(hash&&file.includes('Ancien'))assert(read('../Ancien-regime-illuminismo/js/data.js').includes('"'+hash.replace('lezione-','')+'"'),href)}
w.confirm=()=>true;$('.gbprof-data-reset').click();assert(!Object.keys(w.localStorage).some(k=>k.startsWith('prima-industriale:')));assert.equal(w.localStorage.getItem('ancien-illuminisme:notes-other'),'Appunti da preservare');assert.deepEqual(errors,[]);
const staticDom=new JSDOM(read('testi.html'));assert.equal(staticDom.window.document.querySelectorAll('main > article[id]').length,18);assert(staticDom.window.document.body.textContent.includes(T.lessons.esiti.at(-1)));
observers.forEach(o=>o.disconnect());dom.window.close();staticDom.window.close();
console.log('PASS DOM simulato: 8 lezioni, 24 risposte, 16 quiz finale, 8 recuperi, 11 mappe/carte, appunti/evidenziati/font, TXT e 10 approfondimenti.');
// Esegue il vero SW in VM con Cache API e rete simulate, servendo i veri file del repository.
const base='https://example.test/Storia/Prima-rivoluzione-industriale/',handlers={},cacheStores=new Map();let network=true,fetchCount=0;
const key=r=>typeof r==='string'?new URL(r,base).href:r.url;
const fetchFile=async r=>{fetchCount++;if(!network)throw new Error('rete scollegata');const u=new URL(key(r)),p=path.join(repo,decodeURIComponent(u.pathname));const file=fs.existsSync(p)&&fs.statSync(p).isDirectory()?path.join(p,'index.html'):p;return fs.existsSync(file)?new Response(fs.readFileSync(file)):new Response('404',{status:404})};
const caches={async keys(){return [...cacheStores.keys()]},async delete(k){return cacheStores.delete(k)},async open(name){if(!cacheStores.has(name))cacheStores.set(name,new Map());const entries=cacheStores.get(name);return {async addAll(requests){const rs=await Promise.all(requests.map(fetchFile));assert(rs.every(r=>r.ok),'risorsa di precache assente');requests.forEach((r,i)=>entries.set(key(r),rs[i]))},async match(r){return entries.get(key(r))?.clone()},async put(r,response){entries.set(key(r),response)}}}};
cacheStores.set('ancien-illuminisme-v1',new Map());cacheStores.set('prima-rivoluzione-industriale-old',new Map());
vm.runInNewContext(read('service-worker.js'),{self:{location:new URL('service-worker.js',base),clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(t,f)=>handlers[t]=f},caches,Request,Response,URL,fetch:fetchFile});
const life=async type=>{let p;handlers[type]({waitUntil:v=>p=v});await p};await life('install');await life('activate');assert(cacheStores.has('ancien-illuminisme-v1'));assert(!cacheStores.has('prima-rivoluzione-industriale-old'));
network=false;const before=fetchCount;const current=[...cacheStores.keys()].find(x=>x.startsWith('prima-rivoluzione-industriale-'));
for(const url of cacheStores.get(current).keys()){let response;handlers.fetch({request:new Request(url),respondWith:p=>response=p});assert((await response).ok,url)}assert.equal(fetchCount,before,'il precache non deve usare la rete');
let outside;handlers.fetch({request:new Request('https://example.test/Storia/Ancien-regime-illuminismo/app.html'),respondWith:p=>outside=p});assert.equal(outside,undefined);
let fallback;handlers.fetch({request:{url:base+'pagina-inesistente',method:'GET',mode:'navigate'},respondWith:p=>fallback=p});assert((await fallback).ok);assert((await (await caches.open(current)).match(base+'index.html')).ok);
console.log(`PASS SW simulato: ${cacheStores.get(current).size} risorse vere senza rete, fallback navigazione, cache altrui conservata, ambito isolato.`);
