const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];
const app = $('#app');
const state = { catalog:null, paper:null, corpus:null, intros:null, works:new Map(), currentWork:null, readerSize: Number(localStorage.getItem('readerSize') || 1.18)};
const WORK_INTRO_KEYS = {
  'appressamento-della-morte':'08',
  'canti':'20',
  'discorso-di-un-italiano-intorno-alla-poesia-romantica':'10',
  'discorso-sopra-la-batracomiomachia':'07',
  'guerra-de-topi-e-delle-rane-1821-1822':'07',
  'guerra-dei-topi-e-delle-rane-1826':'07',
  'la-guerra-dei-topi-e-delle-rane-1815':'07',
  'linfinito':'12',
  'operette-morali':'16',
  'paralipomeni-della-batracomiomachia':'28',
  'storia-di-unanima':'14',
  'zibaldone-pensieri-di-varia-filosofia-e-di-bella-letteratura':'23'
};
const SECTION_INTRO_KEYS = {
  'canti': {
    'i-all-italia':'11',
    'ii-sopra-il-monumento-di-dante-che-si-preparava-in-firenze':'11',
    'iii-ad-angelo-mai-quand-ebbe-trovato-i-libri-di-cicerone-della-repubbl':'11',
    'iv-nelle-nozze-della-sorella-paolina':'11',
    'v-a-un-vincitore-nel-pallone':'11',
    'vi-bruto-minore':'11',
    'vii-alla-primavera-o-delle-favole-antiche':'11',
    'viii-inno-ai-patriarchi-o-de-principii-del-genere-umano':'11',
    'ix-ultimo-canto-di-saffo':'11',
    'x-il-primo-amore':'13',
    'xii-l-infinito':'12',
    'xiii-la-sera-del-di-di-festa':'12',
    'xiv-alla-luna':'12',
    'xv-il-sogno':'12',
    'xvi-la-vita-solitaria':'12',
    'xvii-consalvo':'24',
    'xviii-alla-sua-donna':'11',
    'xix-al-conte-carlo-pepoli':'17',
    'xx-il-risorgimento':'21',
    'xxi-a-silvia':'21',
    'xxii-le-ricordanze':'21',
    'xxiii-canto-notturno-di-un-pastore-errante-dell-asia':'21',
    'xxiv-la-quiete-dopo-la-tempesta':'21',
    'xxv-il-sabato-del-villaggio':'21',
    'xxvi-il-pensiero-dominante':'24',
    'xxvii-amore-e-morte':'24',
    'xxviii-a-se-stesso':'24',
    'xxix-aspasia':'24',
    'xxx-sopra-un-bassorilievo-antico-sepolcrale-dove-una-giovane-mortae-ra':'25',
    'xxxi-sopra-il-ritratto-di-una-bella-donna-scolpito-nel-monumento-sepol':'25',
    'xxxii-palinodia-al-marchese-gino-capponi':'26',
    'xxxiii-il-tramonto-della-luna':'31',
    'xxxiv-la-ginestra-o-il-fiore-del-deserto':'30'
  },
  'operette-morali': {
    'comparazione-delle-sentenze-di-bruto-minore-e-di-teofrasto-vicini-a-mo':'15'
  }
};
document.documentElement.style.setProperty('--readerSize', state.readerSize + 'rem');

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
if (localStorage.getItem('theme') === 'light') document.documentElement.classList.add('light');
$('#themeBtn').addEventListener('click', () => { document.documentElement.classList.toggle('light'); localStorage.setItem('theme', document.documentElement.classList.contains('light')?'light':'dark'); });

async function loadJson(url){ const r = await fetch(url); if(!r.ok) throw new Error(url); return r.json(); }
async function boot(){ state.catalog = await loadJson('data/catalog.json'); state.paper = await loadJson('data/paper.json'); state.corpus = await loadJson('data/corpus.json'); state.intros = await loadJson('data/work-intros.json'); route(); }
window.addEventListener('hashchange', route);
boot().catch(err => { app.innerHTML = `<div class="empty">Errore di caricamento: ${esc(err.message)}</div>`; });

function esc(s){ return String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function fmt(n){ return new Intl.NumberFormat('it-IT').format(n||0); }
function toast(t){ const el=$('#toast'); el.textContent=t; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),1700); }
function hashParts(){ return location.hash.replace(/^#\/?/,'').split('/').filter(Boolean); }

function route(){
  const [page, a, b] = hashParts();
  const p = page || 'home';
  if(p==='home') renderHome();
  else if(p==='library') renderLibrary();
  else if(p==='reader') renderReader(a, b);
  else if(p==='search') renderSearch();
  else if(p==='paper') renderPaper();
  else if(p==='timeline') renderTimeline();
  else renderHome();
  app.focus({preventScroll:true});
}

function renderHome(){
  const works = state.catalog.works;
  const totalWords = works.reduce((a,w)=>a+w.wordCount,0);
  app.innerHTML = `
  <section class="hero">
    <div class="hero-card">
      <span class="eyebrow">PWA offline · lettura · ricerca</span>
      <h1>Leopardi come sistema vivo</h1>
      <p>Una biblioteca consultabile per luoghi, fasi, pensiero e testi integrali. Non è una vetrina: è un banco di lavoro per leggere, cercare, isolare nuclei concettuali e costruire percorsi.</p>
      <div class="actions"><a class="btn" href="#/library">Apri le opere</a><a class="btn secondary" href="#/paper">Leggi il paper</a><a class="btn secondary" href="#/search">Cerca nel corpus</a></div>
    </div>
    <div class="hero-card">
      <div class="stat-grid">
        <div class="stat"><b>${works.length}</b><span>opere/testi integrali caricati</span></div>
        <div class="stat"><b>${fmt(totalWords)}</b><span>parole indicizzabili</span></div>
        <div class="stat"><b>${fmt(works.reduce((a,w)=>a+w.sectionCount,0))}</b><span>sezioni di lettura</span></div>
        <div class="stat"><b>offline</b><span>installabile come PWA</span></div>
      </div>
    </div>
  </section>
  <section class="section-title"><h2>Percorsi di studio</h2><p>Le sei entrate interpretative del paper diventano strumenti di consultazione rapida.</p></section>
  <section class="grid">
    ${['Vita e geografia','Fasi creative','Zibaldone','Filosofia ed evoluzione','Scrittura e stile','Immagine del mondo'].map((t,i)=>`<article class="panel"><span class="tag">percorso ${i+1}</span><h3>${t}</h3><p>${pathText(t)}</p><a class="btn secondary" href="#/paper">Vai al paper</a></article>`).join('')}
  </section>
  <section class="section-title"><h2>Pronto per la classe</h2><p>Su iPad funziona come archivio, lettore e motore di ricerca. Le note restano nel browser.</p></section>
  <div class="notice">Consiglio pratico: aprila da Safari, poi usa “Aggiungi a schermata Home”. La PWA conserva in cache la struttura e carica i testi anche senza connessione dopo la prima apertura.</div>`;
}
function pathText(t){return {
  'Vita e geografia':'Recanati, Roma, Bologna, Pisa, Firenze, Napoli: non fondali, ma forze che modificano il pensiero.',
  'Fasi creative':'Dal laboratorio filologico alle canzoni, dalle Operette al risorgimento poetico e alla Ginestra.',
  'Zibaldone':'Il quaderno-mondo: appunti, lingua, filosofia, antropologia, memoria, desiderio, natura.',
  'Filosofia ed evoluzione':'Oltre la formula scolastica: un pensiero che si sposta, si corregge e si radicalizza.',
  'Scrittura e stile':'Parole, termini, vago, pellegrino; poesia pensante e prosa ironico-metafisica.',
  'Immagine del mondo':'Un universo non ordinato per l’uomo: illusioni, verità, natura, solidarietà finale.'
}[t]}

function renderLibrary(){
  const groups = [...new Set(state.catalog.works.map(w=>w.genre))];
  app.innerHTML = `<section class="section-title"><h2>Opere</h2><p>Testi integrali disponibili nei materiali caricati, più catalogo critico degli scritti leopardiani.</p></section>
  <div class="toolbar"><input id="libFilter" class="input" placeholder="Filtra per titolo, genere, descrizione…"></div>
  <div id="library" class="library-grid"></div>
  <section class="section-title"><h2>Catalogo critico</h2><p>Stato del corpus rispetto ai materiali inclusi nella PWA.</p></section>
  <div class="table-wrap"><table><tr><th>Opera / insieme</th><th>Genere</th><th>Stato</th></tr>${state.corpus.items.map(i=>`<tr><td>${esc(i.name)}</td><td>${esc(i.genre)}</td><td>${esc(i.status)}</td></tr>`).join('')}</table></div>`;
  const input=$('#libFilter'); const draw=()=>{ const q=input.value.toLowerCase().trim(); const works=state.catalog.works.filter(w=>(w.title+' '+w.genre+' '+w.description).toLowerCase().includes(q)); $('#library').innerHTML = works.map(workCard).join('') || '<div class="empty">Nessuna opera trovata.</div>'; $$('.work-card').forEach(el=>el.addEventListener('click',()=> location.hash = `#/reader/${el.dataset.slug}`));}; input.addEventListener('input',draw); draw();
}
function workCard(w){ return `<article class="work-card" data-slug="${esc(w.slug)}"><span class="tag">${esc(w.genre)}</span><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p><div class="work-meta"><span>${fmt(w.sectionCount)} sezioni</span><span>·</span><span>${fmt(w.wordCount)} parole</span></div></article>`; }
async function loadWork(slug){ if(state.works.has(slug)) return state.works.get(slug); const w=await loadJson(`data/works/${slug}.json`); state.works.set(slug,w); return w; }

async function renderReader(slug, sectionId){
  if(!slug){ renderLibrary(); return; }
  app.innerHTML = '<div class="empty">Carico il testo…</div>';
  const work = await loadWork(slug); state.currentWork=work;
  let idx = sectionId ? work.sections.findIndex(s=>s.id===sectionId) : Number(localStorage.getItem('last:'+slug)||0);
  if(idx < 0) idx = 0;
  const sec = work.sections[idx]; localStorage.setItem('last:'+slug, idx);
  app.innerHTML = `<section class="reader-shell">
    <aside class="reader-side">
      <a class="btn secondary" href="#/library">← Opere</a>
      <h3>${esc(work.title)}</h3>
      <input id="sectionFilter" class="input" placeholder="Filtra sezioni…">
      <div id="sectionList" class="section-list"></div>
    </aside>
    <article class="reader-main">
      <span class="tag">${esc(work.genre)}</span>
      <h1 class="reader-title">${esc(sec.title)}</h1>
      <div class="reader-sub">${esc(work.title)} · ${fmt(idx+1)} / ${fmt(work.sections.length)} · ${fmt(wordCount(sec.text))} parole</div>
      ${renderIntro(introFor(work, sec))}
      <div class="reader-controls">
        <button class="mini" id="prevBtn">← precedente</button><button class="mini" id="nextBtn">successiva →</button>
        <button class="mini" id="smaller">A−</button><button class="mini" id="larger">A+</button><button class="mini" id="saveQuote">Copia citazione</button>
      </div>
      <input id="inText" class="input" placeholder="Cerca in questa sezione…">
      <div id="text" class="reader-text">${formatText(sec.text)}</div>
      <section class="panel" style="margin-top:28px"><h3>Note private</h3><p>Salvate solo su questo dispositivo.</p><textarea id="notes" rows="6" placeholder="Scrivi appunti su questa sezione…"></textarea></section>
    </article>
  </section>`;
  const drawList=()=>{ const q=$('#sectionFilter').value.toLowerCase(); $('#sectionList').innerHTML = work.sections.map((s,i)=>({s,i})).filter(o=>o.s.title.toLowerCase().includes(q)).map(o=>`<button class="${o.i===idx?'active':''}" data-i="${o.i}">${fmt(o.i+1)}. ${esc(o.s.title)}</button>`).join(''); $$('#sectionList button').forEach(b=>b.onclick=()=> location.hash=`#/reader/${slug}/${work.sections[Number(b.dataset.i)].id}`); };
  $('#sectionFilter').addEventListener('input',drawList); drawList();
  $('#prevBtn').onclick=()=>{ if(idx>0) location.hash=`#/reader/${slug}/${work.sections[idx-1].id}`; };
  $('#nextBtn').onclick=()=>{ if(idx<work.sections.length-1) location.hash=`#/reader/${slug}/${work.sections[idx+1].id}`; };
  $('#smaller').onclick=()=>setSize(-.08); $('#larger').onclick=()=>setSize(.08);
  $('#saveQuote').onclick=()=>{ navigator.clipboard?.writeText(`${work.title}, ${sec.title}`).then(()=>toast('Citazione copiata')); };
  const noteKey=`note:${slug}:${sec.id}`; $('#notes').value=localStorage.getItem(noteKey)||''; $('#notes').addEventListener('input',e=>localStorage.setItem(noteKey,e.target.value));
  $('#inText').addEventListener('input', e=> $('#text').innerHTML = formatText(sec.text, e.target.value));
}
function setSize(delta){ state.readerSize=Math.max(.9, Math.min(1.9, state.readerSize+delta)); localStorage.setItem('readerSize',state.readerSize); document.documentElement.style.setProperty('--readerSize', state.readerSize+'rem'); }
function wordCount(t){ return (t.match(/\b\w+\b/g)||[]).length; }
function introFor(work, section){
  const sectionKey = SECTION_INTRO_KEYS[work.slug]?.[section.id];
  const key = sectionKey || WORK_INTRO_KEYS[work.slug];
  return key ? state.intros?.items?.[key] : null;
}
function renderIntro(intro){
  if(!intro) return '';
  return `<section class="intro-panel"><span class="tag">Cappello</span><h2>${esc(intro.title)}</h2>${formatIntroText(intro.text)}</section>`;
}
function formatIntroText(text){
  return String(text||'').trim().split(/\n{2,}/).map(block => {
    const clean = block.trim();
    if(!clean) return '';
    const lines = clean.split('\n').map(line => line.trim()).filter(Boolean);
    if(lines.length > 1 && lines[0].length < 90 && !/[.!?;:]/.test(lines[0])) return `<h3>${esc(lines[0])}</h3><p>${esc(lines.slice(1).join('\n')).replace(/\n/g,'<br>')}</p>`;
    if(lines.length === 1 && clean.length < 90 && !/[.!?;:]/.test(clean)) return `<h3>${esc(clean)}</h3>`;
    return `<p>${esc(lines.join('\n')).replace(/\n/g,'<br>')}</p>`;
  }).join('');
}
function formatText(text, q=''){
  let s=esc(text);
  if(q.trim().length>1){ const re=new RegExp('('+q.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'); s=s.replace(re,'<mark>$1</mark>'); }
  return s;
}

function renderPaper(){
  app.innerHTML = `<section class="paper">${state.paper.html}<div class="notice">Il paper qui è trasformato in una sezione navigabile della PWA; le opere integrali sono nella Biblioteca.</div></section>`;
}
function renderTimeline(){
  const events = [['1798','Nasce a Recanati. La biblioteca di famiglia diventa laboratorio di formazione.'],['1817','Avvio dello Zibaldone: il pensiero prende forma come quaderno di ricerca.'],['1818-1823','Canzoni civili e idilli: patria, antichi, immaginazione, io.'],['1822-1823','Roma: primo grande confronto con un centro culturale esterno.'],['1824-1827','Operette morali e “silenzio poetico”: la prosa diventa arma filosofica.'],['1827-1828','Pisa: risorgimento poetico, A Silvia, nuova energia lirica.'],['1830-1833','Firenze: Antologia, pubblicazione dei Canti, rotture e profilo pubblico.'],['1833-1837','Napoli e Vesuvio: ultima fase, Paralipomeni, Ginestra, morte.']];
  app.innerHTML = `<section class="section-title"><h2>Timeline</h2><p>Una geografia del pensiero: i luoghi non accompagnano Leopardi, lo trasformano.</p></section><div class="panel timeline">${events.map(e=>`<div class="tl"><b>${e[0]}</b><span>${e[1]}</span></div>`).join('')}</div>${state.paper.timelineImage?`<div class="img-frame"><img src="${state.paper.timelineImage}" alt="Timeline delle fasi e delle principali pubblicazioni"></div>`:''}${state.paper.manuscriptImage?`<section class="section-title"><h2>Manoscritto dell’Infinito</h2><p>Immagine allegata ai materiali caricati.</p></section><div class="img-frame"><img src="${state.paper.manuscriptImage}" alt="Manoscritto dell'Infinito"></div>`:''}`;
}

function renderSearch(){
  app.innerHTML = `<section class="section-title"><h2>Ricerca nel corpus</h2><p>Cerca in tutte le opere integrali. La prima ricerca può richiedere qualche secondo perché carica i testi.</p></section>
  <div class="search-box"><input id="q" class="input" autofocus placeholder="Cerca: natura, piacere, infinito, noia, felicità…"><div class="toolbar"><button id="go" class="btn">Cerca</button><button id="clear" class="btn secondary">Pulisci</button></div></div><div id="results" class="results"></div>`;
  $('#go').onclick=doSearch; $('#q').addEventListener('keydown',e=>{ if(e.key==='Enter') doSearch(); }); $('#clear').onclick=()=>{$('#q').value=''; $('#results').innerHTML='';};
}
async function doSearch(){
  const q=$('#q').value.trim(); if(q.length<2){ toast('Scrivi almeno due caratteri'); return; }
  const box=$('#results'); box.innerHTML='<div class="empty">Carico e cerco…</div>';
  const tokens=q.toLowerCase().split(/\s+/).filter(Boolean);
  const results=[];
  for(const meta of state.catalog.works){
    const w=await loadWork(meta.slug);
    for(const sec of w.sections){
      const hay=sec.text.toLowerCase();
      if(tokens.every(t=>hay.includes(t))){
        results.push({work:w, sec, idx: hay.indexOf(tokens[0])});
        if(results.length>=80) break;
      }
    }
    if(results.length>=80) break;
  }
  if(!results.length){ box.innerHTML='<div class="empty">Nessun risultato.</div>'; return; }
  box.innerHTML = results.map(r=>`<article class="result" data-slug="${esc(r.work.slug)}" data-section="${esc(r.sec.id)}"><span class="tag">${esc(r.work.title)}</span><h3>${esc(r.sec.title)}</h3><div class="snippet">${snippet(r.sec.text, r.idx, q)}</div></article>`).join('');
  $$('.result').forEach(el=>el.onclick=()=> location.hash=`#/reader/${el.dataset.slug}/${el.dataset.section}`);
}
function snippet(text, idx, q){ idx=Math.max(0,idx); const start=Math.max(0,idx-170), end=Math.min(text.length,idx+330); return '…'+formatText(text.slice(start,end), q).replace(/\n+/g,' ')+'…'; }
