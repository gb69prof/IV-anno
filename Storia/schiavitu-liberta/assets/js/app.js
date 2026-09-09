(() => {
 'use strict';
 const root = new URL(document.body.dataset.root || './', location.href);
 const prefix = 'schiavitu-liberta:v1:';
 const $ = (s, p = document) => p.querySelector(s);
 const $$ = (s, p = document) => [...p.querySelectorAll(s)];
 const notice = msg => { const n = $('#toast'); if(n){n.textContent=msg;n.hidden=false;clearTimeout(notice.timer);notice.timer=setTimeout(()=>n.hidden=true,4500);} };
 const storage = { get(k){try{return localStorage.getItem(prefix+k);}catch{return null;}},set(k,v){try{localStorage.setItem(prefix+k,v);return true;}catch{return false;}} };
 const pageKey = document.body.dataset.lesson || document.body.dataset.page;
 let scale=Number(storage.get('font'))||1;
 function applyScale(){document.documentElement.style.setProperty('--scale',scale);}
 applyScale();
 $$('[data-font]').forEach(b=>b.addEventListener('click',()=>{scale=Math.max(.9,Math.min(1.8,scale+Number(b.dataset.font)));applyScale();storage.set('font',scale);}));
 $('[data-focus]')?.addEventListener('click',e=>{const on=document.body.classList.toggle('focus-mode');e.currentTarget.setAttribute('aria-pressed',String(on));});
 $$('[data-panel-button]').forEach(b=>b.addEventListener('click',()=>{document.body.dataset.panel=b.dataset.panelButton;$$('[data-panel-button]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
 function saveArea(area){const ok=storage.set('note:'+area.dataset.note,area.value); const s=area.parentElement.querySelector('[data-save-status]');if(s)s.textContent=ok?'Salvato su questo dispositivo.':'Salvataggio non disponibile: scarica il testo prima di chiudere.';}
 $$('textarea[data-note]').forEach(area=>{area.value=storage.get('note:'+area.dataset.note)||'';area.addEventListener('input',()=>saveArea(area));});
 $$('[data-download-note]').forEach(b=>b.addEventListener('click',()=>{const area=document.getElementById(b.dataset.downloadNote);const blob=new Blob([document.title+'\n\n'+area.value],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='appunti-'+(area.dataset.note||'schiavitu-liberta')+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}));
 $$('[data-clear-note]').forEach(b=>b.addEventListener('click',()=>{const a=document.getElementById(b.dataset.clearNote);a.value='';saveArea(a);notice('Appunti di questa sezione cancellati.');}));
 $('[data-clear-all]')?.addEventListener('click',()=>{try{Object.keys(localStorage).filter(k=>k.startsWith(prefix)).forEach(k=>localStorage.removeItem(k));$$('textarea[data-note]').forEach(a=>a.value='');notice('Appunti, progressi e preferenze di Schiavitù e libertà cancellati.');}catch{notice('Il browser non consente di accedere ai dati locali.');}});
 let savedRange=null,savedText='';
 document.addEventListener('selectionchange',()=>{const sel=getSelection();if(!sel?.rangeCount||sel.isCollapsed)return;const r=sel.getRangeAt(0);const reading=$('.lesson-reading');if(reading?.contains(r.commonAncestorContainer)){savedRange=r.cloneRange();savedText=sel.toString();}});
 $('[data-copy-selection]')?.addEventListener('click',()=>{const a=$('textarea[data-note]');if(!a||!savedText){notice('Seleziona prima un passaggio della lezione.');return;}a.value+=(a.value?'\n\n':'')+'«'+savedText+'» — '+document.title;saveArea(a);notice('Passaggio aggiunto agli appunti.');});
 $('[data-highlight]')?.addEventListener('click',()=>{if(!savedRange||!savedText){notice('Seleziona prima un passaggio della lezione.');return;}try{const mark=document.createElement('mark');mark.className='student-mark';savedRange.surroundContents(mark);savedRange=null;getSelection().removeAllRanges();notice('Passaggio evidenziato per questa lettura.');}catch{notice('Seleziona un passaggio dentro un solo paragrafo.');}});
 $('[data-clear-highlights]')?.addEventListener('click',()=>{$$('mark.student-mark').forEach(m=>m.replaceWith(...m.childNodes));notice('Evidenziature rimosse.');});
 $$('[data-complete]').forEach(b=>{const k='done:'+b.dataset.complete;if(storage.get(k)==='1'){b.textContent='Lezione completata ✓';b.setAttribute('aria-pressed','true');}b.addEventListener('click',()=>{const done=storage.get(k)!=='1';storage.set(k,done?'1':'0');b.textContent=done?'Lezione completata ✓':'Segna come completata';b.setAttribute('aria-pressed',String(done));});});
 $$('[data-progress-for]').forEach(n=>{if(storage.get('done:'+n.dataset.progressFor)==='1')n.textContent='Completata ✓';});
 const dialog=$('#map-dialog');let opener=null,zoom=1;
 function closeMap(){if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});dialog?.close();opener?.focus();}
 $$('[data-open-map]').forEach(b=>b.addEventListener('click',()=>{opener=b;zoom=1;const img=$('img',dialog);img.src=b.dataset.mapSrc;img.alt=b.dataset.mapTitle;img.style.width='100%';img.style.height='100%';img.style.maxHeight='100%';img.style.maxWidth='100%';$('#map-title').textContent=b.dataset.mapTitle;dialog.showModal();}));
 $('[data-close-map]')?.addEventListener('click',closeMap);
 dialog?.addEventListener('cancel',e=>{e.preventDefault();closeMap();});
 $$('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{zoom=Math.max(.5,Math.min(3,zoom+Number(b.dataset.zoom)));const img=$('img',dialog);img.style.width=(zoom*100)+'%';img.style.height='auto';img.style.maxWidth='none';img.style.maxHeight='none';}));
 $('[data-fullscreen]')?.addEventListener('click',()=>{if(dialog.requestFullscreen)dialog.requestFullscreen().catch(()=>notice('La mappa è già aperta a tutta pagina; il browser non consente il fullscreen.'));else notice('Su questo browser la mappa resta a tutta pagina.');});
 $$('form[data-quiz]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const fields=$$('fieldset[data-answer]',form);let correct=0;fields.forEach(f=>{const chosen=$('input:checked,select',f);const value=chosen?.value;const fb=$('.feedback',f);const ok=value===f.dataset.answer;if(ok)correct++;fb.hidden=false;fb.classList.toggle('correct',ok);fb.classList.toggle('wrong',!ok);$('.feedback-prefix',fb).textContent=ok?'Corretto. ':value?'Da rivedere. ':'Risposta mancante. ';});const result=$('[data-quiz-result]',form);if(result){result.hidden=false;result.textContent=correct+' risposte corrette su '+fields.length+'. Leggi le spiegazioni e riprendi le lezioni collegate.';result.focus();}storage.set('quiz:'+form.id,correct+'/'+fields.length);}));
 $$('[data-reset-quiz]').forEach(b=>b.addEventListener('click',()=>{const form=b.closest('form');form.reset();$$('.feedback,[data-quiz-result]',form).forEach(f=>f.hidden=true);}));
 $$('[data-classify]').forEach(s=>s.addEventListener('change',()=>{const result=s.closest('.card').querySelector('.feedback');result.hidden=false;const ok=s.value===s.dataset.classify;result.textContent=(ok?'Argomento riconosciuto. ':'Rileggi il passaggio. ')+s.dataset.explain;result.className='feedback '+(ok?'correct':'wrong');}));
 $('#timeline-filter')?.addEventListener('change',e=>{let n=0;$$('[data-event-type]').forEach(x=>{x.hidden=e.target.value!=='Tutti'&&x.dataset.eventType!==e.target.value;if(!x.hidden)n++;});$('#timeline-status').textContent=n+' eventi visibili.';});
 $('#people-filter')?.addEventListener('change',e=>{$$('[data-person-group]').forEach(x=>x.hidden=e.target.value!=='Tutti'&&x.dataset.personGroup!==e.target.value);});
 const routes={
  africa:['Africa: molte società, molte traiettorie','Africa occidentale e centro-occidentale sono aree centrali d’imbarco. Catture, guerre, mercati e reti dell’interno precedono la traversata. La carta è schematica e non attribuisce a tutta l’Africa un’unica responsabilità.'],
  brazil:['Africa → Brasile','Collegamenti diretti e circuiti sud-atlantici sono fondamentali. Il Brasile è la maggiore destinazione complessiva della deportazione transatlantica. Le frecce indicano direzioni, non singole rotte o quantità.'],
  caribbean:['Africa → Caraibi','Colonie britanniche, francesi, spagnole e olandesi organizzano economie di piantagione. Saint-Domingue occupa la parte occidentale di Hispaniola; Giamaica, Barbados e Cuba seguono cronologie diverse.'],
  north:['Africa → America settentrionale','Le colonie continentali e poi gli Stati Uniti sono una parte del sistema. Dopo il divieto d’importazione del 1808 continua un ampio commercio interno di persone. Non confondere il Nord America con tutte le Americhe.'],
  goods:['Merci, credito e ritorni','Manufatti e mezzi di pagamento circolano verso l’Africa; zucchero, caffè, tabacco e cotone collegano le Americhe ai mercati europei. Non ogni nave percorre un triangolo completo. Esistono inoltre reti intraamericane.']
 };
 function route(id){const info=routes[id];if(!info)return;$('#route-title').textContent=info[0];$('#route-description').textContent=info[1];$$('[data-route-button]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.routeButton===id)));$$('.route[data-route]').forEach(p=>p.classList.toggle('dim',id!=='africa'&&p.dataset.route!==id));}
 $$('[data-route-button]').forEach(b=>b.addEventListener('click',()=>route(b.dataset.routeButton)));
 $$('svg [data-route]').forEach(el=>{el.addEventListener('click',()=>route(el.dataset.route));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();route(el.dataset.route);}});});
 $('[data-check-order]')?.addEventListener('click',()=>{const vals=$$('[data-order]').map(i=>Number(i.value));const ok=vals.every((x,i)=>x===[1,3,2,4][i]);$('#order-feedback').textContent=ok?'Ordine corretto: 1794 → 1807 → 1834 → 1865.':'Riprova: prima l’abolizione francese del 1794, poi la tratta britannica del 1807, l’applicazione britannica del 1834 e infine il XIII Emendamento del 1865.';});
 let installPrompt=null;
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$$('[data-install]').forEach(b=>b.hidden=false);});
 $$('[data-install]').forEach(b=>b.addEventListener('click',async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;}else notice('Su iPad: Condividi → Aggiungi alla schermata Home. Su desktop usa il menu di installazione del browser.');}));
 const offline=$('[data-offline-status]');
 if('serviceWorker' in navigator){
  navigator.serviceWorker.register(new URL('service-worker.js',root),{scope:root.pathname,updateViaCache:'none'}).then(reg=>{
   function ready(){if(offline)offline.textContent='Materiali locali pronti per l’uso offline.';}
   if(reg.active)ready();
   const watch=()=>{const w=reg.installing;if(w)w.addEventListener('statechange',()=>{if(w.state==='installed'){if(navigator.serviceWorker.controller){const b=$('[data-update]');if(b)b.hidden=false;else notice('Aggiornamento disponibile: chiudi le schede della PWA e riaprila.');}else ready();}if(w.state==='redundant'&&offline)offline.textContent='Download offline non completato. Riapri la PWA quando la connessione è stabile.';});};
   watch();reg.addEventListener('updatefound',watch);
   if(reg.waiting){const b=$('[data-update]');if(b)b.hidden=false;}
   $('[data-update]')?.addEventListener('click',()=>{reg.waiting?.postMessage({type:'SKIP_WAITING'});});
   reg.update().catch(()=>{});
  }).catch(()=>{if(offline)offline.textContent='Uso online disponibile. Offline richiede HTTPS e un browser compatibile.';});
  let reloading=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloading){reloading=true;location.reload();}});
 }else if(offline)offline.textContent='Questo browser non supporta l’uso offline della PWA.';
})();
