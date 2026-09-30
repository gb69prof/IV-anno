(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const chapters = [...document.querySelectorAll('.chapter')];
  const ids = chapters.map(ch => ch.id);
  const key = 'settecento-tre-autori:v1';
  let state = {notes:{}, highlights:{}, read:[], theme:'light', font:19, last:'mondo'};
  try { const value = JSON.parse(localStorage.getItem(key)); if (value && typeof value === 'object') state = {...state,...value}; } catch (_) {}
  if (!state.notes || typeof state.notes !== 'object') state.notes = {};
  if (!state.highlights || typeof state.highlights !== 'object') state.highlights = {};
  if (!Array.isArray(state.read)) state.read = [];
  let current = 'mondo', selection = null, installPrompt = null, timer;
  const toast = message => { $('notice').textContent = message; $('notice').hidden = false; clearTimeout(timer); timer = setTimeout(() => $('notice').hidden = true, 3500); };
  const save = () => { try { localStorage.setItem(key,JSON.stringify(state)); $('save-status').textContent = 'Salvato su questo dispositivo'; } catch (_) { $('save-status').textContent = 'Salvataggio non disponibile: scarica gli appunti.'; } };
  const appearance = () => {
    state.font = Math.max(17,Math.min(26,Number(state.font) || 19));
    document.documentElement.dataset.theme = state.theme === 'dark' ? 'dark' : 'light';
    document.documentElement.style.setProperty('--reading-size',state.font+'px');
    $('font-size').value = state.font;
    $('theme').setAttribute('aria-pressed',String(state.theme === 'dark'));
    $('theme').setAttribute('aria-label',state.theme === 'dark' ? 'Attiva il tema chiaro' : 'Attiva il tema scuro');
  };
  const progress = () => {
    const count = ids.filter(id => state.read.includes(id)).length;
    $('progress').value = count; $('progress-label').textContent = `${count} di 5 sezioni lette`;
    document.querySelectorAll('[data-progress]').forEach(el => el.textContent = state.read.includes(el.dataset.progress) ? 'Letta ✓' : 'Da leggere');
    document.querySelectorAll('[data-mark]').forEach(el => el.textContent = state.read.includes(el.dataset.mark) ? 'Segnata come letta ✓' : 'Segna come letta');
    $('resume').hidden = !ids.includes(state.last) || !state.visited;
    $('resume').href = '#'+(ids.includes(state.last) ? state.last : 'mondo');
  };
  // Offsets refer only to the text of a chapter; formatting does not change them.
  const clearMarks = container => {
    container.querySelectorAll('mark').forEach(mark => mark.replaceWith(document.createTextNode(mark.textContent)));
    container.normalize();
  };
  const applyMarks = chapter => {
    const container = chapter.querySelector('.chapter-inner');
    clearMarks(container);
    const length = container.textContent.length;
    const ranges = (Array.isArray(state.highlights[chapter.id]) ? state.highlights[chapter.id] : []).filter(r => Number.isInteger(r.start) && Number.isInteger(r.end) && r.start>=0 && r.end>r.start && r.end<=length);
    const walker = document.createTreeWalker(container,NodeFilter.SHOW_TEXT);
    let node, offset=0; const nodes=[];
    while ((node=walker.nextNode())) { nodes.push({node,start:offset,end:offset+node.length}); offset+=node.length; }
    for (const item of nodes.reverse()) {
      const intervals = ranges.map(r=>({start:Math.max(r.start,item.start)-item.start,end:Math.min(r.end,item.end)-item.start})).filter(r=>r.end>r.start).sort((a,b)=>a.start-b.start);
      const merged=[];
      for(const interval of intervals){const last=merged.at(-1); if(last && interval.start<=last.end)last.end=Math.max(last.end,interval.end);else merged.push({...interval});}
      for (const r of merged.reverse()) {
        const target = item.node.splitText(r.start);
        target.splitText(r.end-r.start);
        const mark = document.createElement('mark'); target.replaceWith(mark); mark.append(target);
      }
    }
  };
  const captureSelection = () => {
    const sel = window.getSelection();
    if(!sel || sel.isCollapsed || !sel.rangeCount)return;
    const container = $(current).querySelector('.chapter-inner'), range=sel.getRangeAt(0);
    if(!container.contains(range.startContainer)||!container.contains(range.endContainer))return;
    const before = document.createRange(); before.selectNodeContents(container); before.setEnd(range.startContainer,range.startOffset);
    selection = {chapter:current,start:before.toString().length,end:before.toString().length+range.toString().length,text:range.toString()};
  };
  document.addEventListener('selectionchange',captureSelection);
  $('highlight').addEventListener('click',()=>{
    if(!selection || selection.chapter!==current || !selection.text.trim())return toast('Seleziona prima un passo della lezione.');
    if(!Array.isArray(state.highlights[current]))state.highlights[current]=[];
    state.highlights[current].push({start:selection.start,end:selection.end});
    applyMarks($(current)); selection=null;window.getSelection()?.removeAllRanges();save();toast('Passo evidenziato.');
  });
  $('quote').addEventListener('click',()=>{
    if(!selection || selection.chapter!==current || !selection.text.trim())return toast('Seleziona prima un passo della lezione.');
    const old=state.notes[current]||'';
    state.notes[current]=old+(old?'\n\n':'')+'«'+selection.text.trim()+'»';
    $('notes').value=state.notes[current];save();toast('Passo aggiunto al taccuino.');
  });
  $('clear-highlights').addEventListener('click',()=>{state.highlights[current]=[];applyMarks($(current));save();toast('Evidenziature rimosse dalla sezione.');});
  const route = (focus=false) => {
    const hash=location.hash.slice(1), id=ids.includes(hash)?hash:'home';
    $('home').hidden=id!=='home'; $('study').hidden=id==='home';
    chapters.forEach(ch=>ch.hidden=ch.id!==id);
    document.querySelectorAll('[data-chapter-link]').forEach(link=>{if(link.dataset.chapterLink===id)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    if(id!=='home'){
      current=id; selection=null; state.last=id;state.visited=true;
      $('notes').value=state.notes[id]||'';$('note-chapter').textContent=$(id).dataset.label;
      const reminder=$(id).querySelector('.source-callout:last-of-type');
      $('reminder').replaceChildren();if(reminder)$('reminder').append(reminder.cloneNode(true));
      // Avoid duplicate IDs in the secondary reminder.
      $('reminder').querySelectorAll('[id],[data-source],[aria-labelledby]').forEach(el=>{el.removeAttribute('id');el.removeAttribute('data-source');el.removeAttribute('aria-labelledby');});
      applyMarks($(id));save();
      if(focus)$(id).focus({preventScroll:true});
      document.title=$(id).dataset.label+' · Dal mondo dei ceti alla nuova società';
    }else document.title='Dal mondo dei ceti alla nuova società · gbprof';
    progress(); if(focus)window.scrollTo({top:0,behavior:'instant'});
  };
  window.addEventListener('hashchange',()=>route(true));
  $('notes').addEventListener('input',()=>{state.notes[current]=$('notes').value;save();});
  document.querySelectorAll('[data-mark]').forEach(button=>button.addEventListener('click',()=>{
    const id=button.dataset.mark;state.read=state.read.includes(id)?state.read.filter(x=>x!==id):[...state.read,id];save();progress();
  }));
  $('font').addEventListener('click',()=>{ $('font-panel').hidden=!$('font-panel').hidden; $('font').setAttribute('aria-expanded',String(!$('font-panel').hidden)); });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('font-panel').hidden=true;$('font').setAttribute('aria-expanded','false');}});
  $('font-size').addEventListener('input',()=>{state.font=Number($('font-size').value);appearance();save();});
  $('theme').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';appearance();save();});
  $('print').addEventListener('click',()=>window.print());
  $('download-notes').addEventListener('click',()=>{
    const text='Dal mondo dei ceti alla nuova società\nAppunti personali\n\n'+chapters.map(ch=>ch.dataset.label+'\n'+(state.notes[ch.id]||'(Nessun appunto)')).join('\n\n');
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='appunti-parini-alfieri-goldoni.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $('reset').addEventListener('click',()=>{
    if(!confirm('Cancellare appunti, evidenziature, progressi e preferenze di questo percorso?'))return;
    try{localStorage.removeItem(key);}catch(_){}state={notes:{},highlights:{},read:[],theme:'light',font:19,last:'mondo'};
    chapters.forEach(applyMarks);appearance();route();toast('Dati di studio cancellati.');
  });
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('install').hidden=false;});
  $('install').addEventListener('click',async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;$('install').hidden=true;}});
  window.addEventListener('appinstalled',()=>{$('install').hidden=true;});
  appearance(); route();
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
    navigator.serviceWorker.register('sw.js').then(async registration=>{
      if(registration.active){$('offline-status').textContent='Lezioni e ritratti disponibili offline.';return;}
      const worker=registration.installing||registration.waiting;
      if(worker){worker.addEventListener('statechange',()=>{
        if(worker.state==='activated')$('offline-status').textContent='Lezioni e ritratti disponibili offline.';
        if(worker.state==='redundant')$('offline-status').textContent='Preparazione offline non riuscita. Ricarica con una connessione attiva.';
      });}
    }).catch(()=>$('offline-status').textContent='Preparazione offline non riuscita. Ricarica con una connessione attiva.');
  }else $('offline-status').textContent='Per l’uso offline apri la PWA dal sito e completa il primo caricamento.';
})();
