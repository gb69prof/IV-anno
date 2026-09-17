'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const all = s => Array.from(document.querySelectorAll(s));
  const PREFIX = 'gbprof-rivoluzione-approfondimento:';
  const read = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(PREFIX + key)); return v === null ? fallback : v; } catch (_) { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; } catch (_) { return false; } };
  const esc = text => String(text).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const safePage = page => typeof page === 'string' && /^[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/.test(page);
  let done = read('read', []); if (!Array.isArray(done)) done = [];
  const readButton = $('[data-read]');
  function paintRead() {
    if (readButton) { const active = done.includes(readButton.dataset.read); readButton.setAttribute('aria-pressed', String(active)); readButton.textContent = active ? '✓ Letto · togli il segno' : 'Segna come letto'; }
    all('[data-page]').forEach(card => { const old = card.querySelector('.read-badge'); if(old) old.remove(); if(done.includes(card.dataset.page)){const badge=document.createElement('span');badge.className='read-badge';badge.textContent='Letto';card.append(badge);} });
  }
  paintRead();
  if (readButton) readButton.addEventListener('click', () => {
    const page=readButton.dataset.read;
    done=done.includes(page)?done.filter(x=>x!==page):[...done,page];
    const saved=write('read',done);paintRead();
    $('.read-status').textContent=saved?' Salvataggio sul dispositivo completato.':' Il browser non consente il salvataggio: il segno resta solo in questa pagina.';
  });
  const current=location.pathname.split('/').pop() || 'index.html';
  if (/^(fase|evento|persona|gruppo|documento)-/.test(current)) write('last',{page:current,title:document.title.split(' · ')[0]});
  const last=read('last',null);
  if ($('#resume') && last && safePage(last.page)){ $('#resume').href=last.page;$('#resume').textContent='Riprendi: '+last.title+' →';$('#resume').hidden=false; }
  let font=read('font',0);if(![0,1,2].includes(font))font=0;
  const sizes=['1.08rem','1.22rem','1.38rem'];
  const setFont=()=>{document.documentElement.style.setProperty('--reading',sizes[font]);$('#font-size').textContent=font===2?'A↺':'A+';$('#font-size').setAttribute('aria-label',font===2?'Ripristina la dimensione del testo':'Ingrandisci il testo');};setFont();
  $('#font-size').addEventListener('click',()=>{font=(font+1)%3;write('font',font);setFont();});
  $('#print').addEventListener('click',()=>window.print());
  if($('#clear-progress'))$('#clear-progress').addEventListener('click',()=>{try{['read','last','font','score'].forEach(k=>localStorage.removeItem(PREFIX+k));done=[];font=0;paintRead();setFont();$('#clear-status').textContent='Progressi cancellati. I contenuti offline rimangono disponibili.';}catch(_){$('#clear-status').textContent='Il browser non consente di modificare la memoria locale.';}});
  // Filtri del diario e del glossario: le schede restano leggibili senza JavaScript.
  const filterInput=$('#filter-text'),phase=$('#filter-phase');
  if(filterInput){const items=all('[data-filter]');const update=()=>{const q=normalize(filterInput.value.trim());let count=0;items.forEach(el=>{const visible=normalize(el.dataset.filter).includes(q)&&(!phase||!phase.value||el.dataset.phase===phase.value);el.hidden=!visible;if(visible)count++;});$('#filter-count').textContent=count+' '+(phase?'eventi':'termini')+' trovati';$('#filter-empty').hidden=count!==0;};filterInput.addEventListener('input',update);if(phase)phase.addEventListener('change',update);update();}
  // Ricerca locale nei testi. Gli input dell’utente non vengono inseriti come HTML.
  if($('#search-all')){
    let index=null;const input=$('#search-all'),status=$('#search-status'),results=$('#search-results');
    const render=()=>{const q=normalize(input.value.trim());results.replaceChildren();if(!index)return;if(q.length<2){status.textContent='Scrivi almeno due caratteri. Ricerca nei testi di tutte le schede.';return;}const terms=q.split(/\s+/);const matches=index.filter(item=>terms.every(t=>normalize(item.title+' '+item.text).includes(t))).sort((a,b)=>Number(normalize(b.title).includes(q))-Number(normalize(a.title).includes(q)));status.textContent=matches.length+' risultati'+(matches.length>40?' · visualizzati i primi 40':'');matches.slice(0,40).forEach(item=>{const li=document.createElement('li'),h=document.createElement('h3'),a=document.createElement('a'),p=document.createElement('p');a.href=item.url;a.textContent=item.title;h.append(a);const at=normalize(item.text).indexOf(terms[0]);const start=Math.max(0,at-70);p.textContent=(start?'…':'')+item.text.slice(start,start+220)+'…';li.append(h,p);results.append(li);});};
    input.addEventListener('input',render);fetch('search-index.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{index=data;render();}).catch(()=>{status.textContent='Ricerca non disponibile. Apri il percorso con connessione per completare il salvataggio offline.';});
  }
  // Autoverifica: campione casuale con copertura delle fasi, risposte mescolate e recupero mirato.
  const shuffle=arr=>{const copy=arr.slice();for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;};
  let questions=[],graded=false;
  const start=$('#start-quiz'),form=$('#quiz'),result=$('#quiz-result');
  if(start){const previous=read('score',null);if(previous&&typeof previous.correct==='number')$('#last-score').textContent='Ultimo tentativo su questo dispositivo: '+previous.correct+'/'+previous.total+'.';
    const begin=async()=>{start.disabled=true;start.textContent='Preparo le domande…';try{const response=await fetch('quiz.json');if(!response.ok)throw Error();const bank=await response.json();const phases=[...new Set(bank.map(q=>q.phase))];const selected=phases.map(p=>shuffle(bank.filter(q=>q.phase===p))[0]);questions=shuffle([...selected,...shuffle(bank.filter(q=>!selected.includes(q))).slice(0,10-selected.length)]).map(q=>({...q,answers:shuffle(q.answers)}));graded=false;result.replaceChildren();form.innerHTML=questions.map((q,i)=>`<fieldset><legend>${i+1}. ${esc(q.question)}</legend>${q.answers.map((a,j)=>`<label><input type="radio" name="q${i}" value="${j}" required><span>${esc(a)}</span></label>`).join('')}<div id="feedback-${i}"></div></fieldset>`).join('')+'<button type="submit" class="primary">Correggi il test</button>';form.hidden=false;$('#quiz-start').hidden=true;form.querySelector('input').focus();}catch(_){result.textContent='Non riesco a caricare il test. Riapri il percorso con connessione e attendi il salvataggio offline.';}finally{start.disabled=false;start.textContent='Comincia il test';}};
    start.addEventListener('click',begin);
    form.addEventListener('submit',event=>{event.preventDefault();if(graded||!form.reportValidity())return;graded=true;let correct=0;const missed=[];questions.forEach((q,i)=>{const selected=form.querySelector(`input[name="q${i}"]:checked`);const value=q.answers[Number(selected.value)];const ok=value===q.correct;if(ok)correct++;else missed.push(q);const box=$('#feedback-'+i);box.className='feedback'+(ok?' correct':'');box.innerHTML=`<strong>${ok?'Risposta corretta':'Da rivedere'}</strong><p>${esc(q.explanation)}</p>${ok?'':`<p>La risposta corretta è: <strong>${esc(q.correct)}</strong></p><a href="${esc(q.recovery)}">Rileggi e recupera →</a>`}`;});form.querySelectorAll('input,button[type=submit]').forEach(el=>el.disabled=true);const saved=write('score',{correct,total:questions.length,at:new Date().toISOString()});const recover=[...new Map(missed.map(q=>[q.recovery,q])).values()];result.innerHTML=`<section class="score"><h2>${correct}/${questions.length} · ${correct>=8?'Comprensione solida':correct>=6?'Buona base da consolidare':'Riparti dai passaggi essenziali'}</h2><p>Punteggio dell’autoverifica: ${correct} su 10. ${saved?'Salvato soltanto su questo dispositivo.':'Il browser non consente il salvataggio.'}</p>${recover.length?'<h3>Il tuo percorso di recupero</h3><ul>'+recover.map(q=>`<li><a href="${esc(q.recovery)}">${esc(q.question)}</a></li>`).join('')+'</ul>':'<p>Ora prova a costruire una risposta argomentata nelle attività di studio.</p>'}</section><button type="button" id="retry">Nuovo tentativo</button> <a class="button" href="studio.html#attivita">Passa all’argomentazione</a>`;$('#retry').addEventListener('click',begin);result.focus();});
  }
  // Installazione e aggiornamenti, senza inviare progressi a un server.
  let installPrompt=null;const install=$('#install-app');
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;if(install)install.hidden=false;});
  if(install)install.addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;install.hidden=true;});
  const offline=$('#offline-status');
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
    let reloading=false;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)location.reload();});
    navigator.serviceWorker.register('sw.js',{scope:'./'}).then(reg=>{
      const offer=()=>{if(!reg.waiting)return;$('#update-notice').hidden=false;$('#update-app').onclick=()=>{reloading=true;reg.waiting.postMessage({type:'SKIP_WAITING'});};};offer();
      reg.addEventListener('updatefound',()=>{const worker=reg.installing;if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='installed'){if(navigator.serviceWorker.controller)offer();}if(worker.state==='redundant'&&offline)offline.textContent='Salvataggio non completato: controlla la connessione e ricarica la pagina.';});});
      if(reg.installing&&offline)offline.textContent='Salvataggio delle pagine e delle immagini in corso. Mantieni la connessione.';
      return navigator.serviceWorker.ready;
    }).then(()=>{if(offline)offline.textContent='✓ Percorso disponibile offline: pagine, immagini, ricerca e test sono salvati.';}).catch(()=>{if(offline)offline.textContent='Salvataggio offline non riuscito. Controlla la connessione e le impostazioni del browser, poi ricarica.';});
  }else if(offline){offline.textContent='Il salvataggio offline richiede un browser compatibile e un sito HTTPS. Le pagine sono comunque leggibili online.';}
})();
