(() => {
  'use strict';

  const DATA = window.PARINI_DATA;
  if (!DATA || !Array.isArray(DATA.lessons)) return;

  const STORAGE_KEY = 'parini-study-state-v1';
  const defaultState = () => ({current:null,visited:[],highlights:{},notes:{},citations:{},attempts:{},scrolls:{},theme:'day',font:0});
  let state = loadState();
  let currentIndex = 0;
  let selectedOffsets = null;
  let visualIndex = 0;
  let observer = null;
  let toastTimer = null;
  let scrollTimer = null;

  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const cover = $('#cover');
  const studyApp = $('#studyApp');
  const studyGrid = $('#studyGrid');
  const lessonText = $('#lessonText');
  const lessonScroll = $('#lessonScroll');
  const notesArea = $('#notesArea');
  const citationsBox = $('#citations');
  const indexOverlay = $('#indexOverlay');
  const studyOverlay = $('#studyOverlay');
  const imageOverlay = $('#imageOverlay');

  function loadState(){
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return {...defaultState(), ...(parsed || {})};
    } catch (_) { return defaultState(); }
  }
  function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function lesson(){ return DATA.lessons[currentIndex]; }
  function escapeHtml(value=''){ return value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
  function toast(message){
    const node = $('#toast');
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('show'), 2300);
  }
  function formatDate(timestamp=Date.now()){
    return new Intl.DateTimeFormat('it-IT',{dateStyle:'medium',timeStyle:'short'}).format(new Date(timestamp));
  }

  function showCover(){
    saveScroll();
    cover.hidden = false;
    studyApp.hidden = true;
    $('#barKicker').textContent = 'Giuseppe Parini';
    $('#barLessonTitle').textContent = 'Ambiente di studio';
    window.scrollTo(0,0);
  }
  function startCourse(index=0){
    cover.hidden = true;
    studyApp.hidden = false;
    openLesson(index);
  }
  function openLesson(index){
    saveScroll();
    currentIndex = Math.max(0,Math.min(DATA.lessons.length-1,index));
    const item = lesson();
    state.current = item.id;
    if (!state.visited.includes(item.id)) state.visited.push(item.id);
    saveState();
    selectedOffsets = null;
    lessonText.innerHTML = item.html;
    applyHighlights();
    $('#barKicker').textContent = `${String(currentIndex+1).padStart(2,'0')} · ${item.short}`;
    $('#barLessonTitle').textContent = item.title;
    $('#lessonPosition').textContent = `${currentIndex+1} / ${DATA.lessons.length}`;
    $('#prevLessonBtn').disabled = currentIndex === 0;
    $('#nextLessonBtn').disabled = currentIndex === DATA.lessons.length-1;
    notesArea.value = state.notes[item.id] || '';
    renderCitations();
    renderVisualChoices();
    setVisual(0);
    watchVisualAnchors();
    updateProgress();
    renderIndex();
    requestAnimationFrame(() => { lessonScroll.scrollTop = state.scrolls[item.id] || 0; });
  }
  function saveScroll(){
    if (!studyApp.hidden && lesson()) {
      state.scrolls[lesson().id] = lessonScroll.scrollTop;
      saveState();
    }
  }

  function selectionInsideLesson(){
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
    const range = selection.getRangeAt(0);
    if (!lessonText.contains(range.commonAncestorContainer)) return null;
    const before = document.createRange();
    before.selectNodeContents(lessonText);
    before.setEnd(range.startContainer,range.startOffset);
    const through = document.createRange();
    through.selectNodeContents(lessonText);
    through.setEnd(range.endContainer,range.endOffset);
    const start = before.toString().length;
    const end = through.toString().length;
    const text = range.toString().replace(/\s+/g,' ').trim();
    return text ? {start,end,text} : null;
  }
  function rememberSelection(){
    const found = selectionInsideLesson();
    if (found) selectedOffsets = found;
  }
  function currentHighlights(){
    const id = lesson().id;
    state.highlights[id] ||= [];
    return state.highlights[id];
  }
  function addHighlight(){
    if (!selectedOffsets) return toast('Seleziona prima un passo della lezione.');
    const ranges = currentHighlights();
    if (ranges.some(item => selectedOffsets.start < item.end && selectedOffsets.end > item.start)) return toast('Questa selezione si sovrappone a un’evidenziazione già presente.');
    ranges.push({...selectedOffsets,id:`h-${Date.now()}-${Math.random().toString(36).slice(2,7)}`});
    ranges.sort((a,b)=>a.start-b.start);
    saveState();
    lessonText.innerHTML = lesson().html;
    applyHighlights();
    watchVisualAnchors();
    updatePendingCount();
    selectedOffsets = null;
    window.getSelection()?.removeAllRanges();
    toast('Passo evidenziato e conservato.');
  }
  function applyHighlights(){
    const ranges = [...currentHighlights()].sort((a,b)=>b.start-a.start);
    ranges.forEach(range => wrapTextOffsets(lessonText,range));
  }
  function wrapTextOffsets(root,item){
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.parentElement?.closest('mark.study-highlight') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;}});
    const nodes=[]; let node; let position=0;
    while ((node=walker.nextNode())) { nodes.push({node,start:position,end:position+node.data.length}); position += node.data.length; }
    nodes.filter(part => item.start < part.end && item.end > part.start).reverse().forEach(part => {
      const localStart = Math.max(0,item.start-part.start);
      const localEnd = Math.min(part.node.data.length,item.end-part.start);
      if (localEnd <= localStart) return;
      const middle = part.node.splitText(localStart);
      middle.splitText(localEnd-localStart);
      const mark = document.createElement('mark');
      mark.className = 'study-highlight';
      mark.dataset.highlightId = item.id;
      middle.parentNode.replaceChild(mark,middle);
      mark.appendChild(middle);
    });
  }
  function clearHighlights(){
    if (!currentHighlights().length) return toast('Non ci sono evidenziazioni da rimuovere.');
    if (!confirm('Rimuovere tutte le evidenziazioni di questa lezione? Le citazioni già copiate resteranno nel taccuino.')) return;
    state.highlights[lesson().id] = [];
    saveState();
    lessonText.innerHTML = lesson().html;
    watchVisualAnchors();
    updatePendingCount();
    toast('Evidenziazioni rimosse.');
  }

  function citations(){
    const id = lesson().id;
    state.citations[id] ||= [];
    return state.citations[id];
  }
  function pasteSelection(){
    if (!selectedOffsets) return toast('Seleziona prima un passo della lezione.');
    const text = selectedOffsets.text;
    if (citations().some(item => item.text === text)) return toast('Questo passo è già nel taccuino.');
    citations().push({id:`c-${Date.now()}`,text,createdAt:Date.now(),source:'selection'});
    saveState(); renderCitations(); selectedOffsets=null; window.getSelection()?.removeAllRanges();
    toast('Selezione incollata nel taccuino.');
  }
  function pasteHighlights(){
    const existing = new Set(citations().map(item => item.highlightId).filter(Boolean));
    const pending = currentHighlights().filter(item => !existing.has(item.id));
    if (!pending.length) return toast('Non ci sono nuovi evidenziati da incollare.');
    pending.forEach(item => citations().push({id:`c-${Date.now()}-${item.id}`,highlightId:item.id,text:item.text,createdAt:Date.now(),source:'highlight'}));
    saveState(); renderCitations(); toast(`${pending.length} ${pending.length===1?'passo incollato':'passi incollati'} nel taccuino.`);
  }
  function renderCitations(){
    const items = citations();
    $('#citationCount').textContent = `${items.length} ${items.length===1?'passo':'passi'}`;
    citationsBox.innerHTML = items.length ? items.map(item => `<article class="citation"><span>${escapeHtml(item.text)}</span><button type="button" data-delete-citation="${item.id}" aria-label="Elimina questa citazione">×</button></article>`).join('') : '<p class="empty-citations">Le citazioni che scegli di conservare compariranno qui, senza numerazione.</p>';
    updatePendingCount();
  }
  function updatePendingCount(){
    const existing = new Set(citations().map(item => item.highlightId).filter(Boolean));
    $('#pendingCount').textContent = currentHighlights().filter(item => !existing.has(item.id)).length;
  }
  function deleteCitation(id){
    state.citations[lesson().id] = citations().filter(item => item.id !== id);
    saveState(); renderCitations();
  }
  function clearNotebook(){
    const hasData = (state.notes[lesson().id] || '').trim() || citations().length;
    if (!hasData) return toast('Il taccuino di questa lezione è già vuoto.');
    if (!confirm('Cancellare appunti e citazioni di questa lezione? Le evidenziazioni nel testo resteranno.')) return;
    state.notes[lesson().id]=''; state.citations[lesson().id]=[]; saveState();
    notesArea.value=''; renderCitations(); toast('Taccuino cancellato.');
  }
  function downloadNotes(){
    const personal = state.notes[lesson().id] || '';
    const quoted = citations().map(item => item.text).join('\n\n—\n\n');
    const content = `\ufeff${lesson().title}\n${formatDate()}\n\nAPPUNTI DELLO STUDENTE\n${personal || '(nessun appunto personale)'}\n\nCITAZIONI DALLA LEZIONE\n${quoted || '(nessuna citazione)'}`;
    const blob = new Blob([content],{type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href=url; link.download=`Parini_${lesson().short.replace(/\W+/g,'_')}.txt`; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    toast('Taccuino esportato in formato TXT.');
  }

  function renderVisualChoices(){
    $('#visualChoices').innerHTML = lesson().visuals.map((item,index)=>`<button type="button" data-visual-choice="${index}" aria-pressed="${index===0}">${index+1}</button>`).join('');
  }
  function setVisual(index){
    const items = lesson().visuals;
    visualIndex = Math.max(0,Math.min(items.length-1,Number(index)||0));
    const item = items[visualIndex];
    $('#visualImage').src=item.src; $('#visualImage').alt=item.alt; $('#visualCaption').textContent=item.caption;
    $$('#visualChoices button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===visualIndex)));
  }
  function watchVisualAnchors(){
    observer?.disconnect();
    const anchors = $$('[data-visual]',lessonText);
    if (!('IntersectionObserver' in window) || !anchors.length) return;
    observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry=>entry.isIntersecting).sort((a,b)=>Math.abs(a.boundingClientRect.top)-Math.abs(b.boundingClientRect.top));
      if (visible.length) setVisual(visible[0].target.dataset.visual);
    },{root:lessonScroll,rootMargin:'-10% 0px -58% 0px',threshold:0});
    anchors.forEach(anchor=>observer.observe(anchor));
  }
  function expandVisual(){
    const item=lesson().visuals[visualIndex];
    $('#largeImage').src=item.src; $('#largeImage').alt=item.alt; $('#largeImageCaption').textContent=item.caption;
    openOverlay(imageOverlay,$('#largeImage'));
  }

  function renderIndex(){
    $('#lessonIndex').innerHTML = DATA.lessons.map((item,index)=>{
      const done=state.visited.includes(item.id);
      return `<button type="button" data-open-lesson="${index}"><span class="index-number">${String(index+1).padStart(2,'0')}</span><strong>${escapeHtml(item.short)}</strong><small>${done?'Letta almeno una volta':'Da esplorare'}</small></button>`;
    }).join('');
  }
  function updateProgress(){
    const count=DATA.lessons.filter(item=>state.visited.includes(item.id)).length;
    $('#courseProgress').value=count; $('#progressText').textContent=`${count} di ${DATA.lessons.length}`;
    $('#resumeBtn').hidden=!state.current;
  }
  function openStudyPanel(type){
    const item=lesson();
    const title=$('#studyPanelTitle'); const body=$('#studyPanelBody'); const kicker=$('#studyPanelKicker');
    if(type==='knowledge'){
      kicker.textContent='Memoria a lungo termine'; title.textContent='Saperi irrinunciabili';
      body.innerHTML=`<ol class="knowledge-list">${item.knowledge.map(value=>`<li>${escapeHtml(value)}</li>`).join('')}</ol>`;
    } else if(type==='vocabulary'){
      kicker.textContent='Parole necessarie'; title.textContent='Vocabolario essenziale';
      body.innerHTML=`<dl class="vocabulary-list">${item.vocabulary.map(([term,definition])=>`<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd>`).join('')}</dl>`;
    } else {
      kicker.textContent='Verifica e recupero'; title.textContent=`Test · ${item.short}`; renderQuiz(body,item);
    }
    openOverlay(studyOverlay,body);
  }
  function renderQuiz(root,item){
    const history=state.attempts[item.id] || [];
    root.innerHTML=`<p class="test-intro">Cinque domande, tre alternative, una sola corretta. Ricevi subito una spiegazione. Formula del voto: <strong>voto = max(1, arrotonda(percentuale × 10))</strong>.</p><form id="quizForm">${item.quiz.map((question,index)=>`<div class="quiz-question"><fieldset data-question="${index}"><legend>${index+1}. ${escapeHtml(question.q)}</legend>${question.o.map((option,optionIndex)=>`<label><input type="radio" name="q-${index}" value="${optionIndex}"> ${escapeHtml(option)}</label>`).join('')}<div class="answer-feedback" aria-live="polite"></div></fieldset></div>`).join('')}<button type="submit" class="submit-test">Concludi il test</button></form><div id="testOutput"></div>${renderHistory(history)}`;
    $$('#quizForm input',root).forEach(input=>input.addEventListener('change',event=>{
      const fieldset=event.target.closest('fieldset');
      if(fieldset.dataset.locked) return;
      const index=Number(fieldset.dataset.question); const selected=Number(event.target.value); const question=item.quiz[index];
      fieldset.dataset.selected=selected; fieldset.dataset.locked='true';
      $$('input',fieldset).forEach(control=>control.disabled=true);
      $('.answer-feedback',fieldset).innerHTML=`<p class="${selected===question.c?'answer-correct':'answer-wrong'}"><strong>${selected===question.c?'✓ Corretto':'✗ Errato'}.</strong> ${escapeHtml(question.why)}</p>`;
    }));
    $('#quizForm',root).addEventListener('submit',event=>{event.preventDefault();submitQuiz(root,item);});
  }
  function submitQuiz(root,item){
    const fields=$$('#quizForm fieldset',root);
    if(fields.some(field=>field.dataset.selected===undefined)) return toast('Rispondi a tutte le domande prima di concludere.');
    const answers=fields.map(field=>Number(field.dataset.selected));
    const errors=item.quiz.map((q,index)=>answers[index]===q.c?null:index).filter(index=>index!==null);
    const correct=item.quiz.length-errors.length; const percent=Math.round(correct/item.quiz.length*100); const vote=Math.max(1,Math.round(percent/10));
    const attempt={at:Date.now(),type:'test',correct,total:item.quiz.length,percent,vote,errors};
    state.attempts[item.id] ||= []; state.attempts[item.id].push(attempt); saveState();
    const output=$('#testOutput',root);
    output.innerHTML=`<div class="test-result"><strong>Risultato: ${correct}/${item.quiz.length} · ${percent}% · voto ${vote}/10</strong><p>${errors.length?'Qui sotto trovi soltanto gli errori e il recupero collegato.':'Hai ricostruito correttamente tutti i nessi della lezione.'}</p></div>${errors.map(index=>recoveryMarkup(item.quiz[index],index)).join('')}${errors.length?'<button type="button" class="retry-errors">Riprova soltanto gli errori</button>':''}`;
    $('.retry-errors',output)?.addEventListener('click',()=>retryErrors(output,item,errors,correct));
    output.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function recoveryMarkup(question,index){
    return `<article class="error-review"><h3>Errore: ${escapeHtml(question.q)}</h3><div class="recovery-card"><h4>${escapeHtml(question.concept)}</h4><p><strong>Chiarimento.</strong> ${escapeHtml(question.why)}</p><p><strong>Esempio dalla lezione.</strong> ${escapeHtml(question.example)}</p><div class="retry-question" data-retry="${index}"><strong>Nuova domanda:</strong> ${escapeHtml(question.retry.q)}${question.retry.o.map((option,optionIndex)=>`<label><input type="radio" name="retry-${index}" value="${optionIndex}"> ${escapeHtml(option)}</label>`).join('')}</div></div></article>`;
  }
  function retryErrors(output,item,errors,initialCorrect){
    const unanswered=errors.filter(index=>!$(`input[name="retry-${index}"]:checked`,output));
    if(unanswered.length) return toast('Rispondi a tutte le nuove domande di recupero.');
    const repaired=errors.filter(index=>Number($(`input[name="retry-${index}"]:checked`,output).value)===item.quiz[index].retry.c).length;
    const updated=initialCorrect+repaired; const percent=Math.round(updated/item.quiz.length*100); const vote=Math.max(1,Math.round(percent/10));
    state.attempts[item.id].push({at:Date.now(),type:'recupero',correct:updated,total:item.quiz.length,percent,vote,errors:errors.length-repaired}); saveState();
    $('.retry-errors',output).disabled=true;
    output.insertAdjacentHTML('beforeend',`<div class="test-result"><strong>Risultato aggiornato dopo il recupero: ${updated}/${item.quiz.length} · ${percent}% · voto ${vote}/10</strong><p>Il tentativo iniziale resta conservato nello storico.</p></div>`);
  }
  function renderHistory(history){
    if(!history.length) return '';
    return `<div class="attempt-history"><strong>Tentativi conservati</strong><ul>${history.slice(-5).reverse().map(item=>`<li>${formatDate(item.at)} · ${item.type==='recupero'?'recupero':'test'} · ${item.correct}/${item.total} · voto ${item.vote}/10</li>`).join('')}</ul></div>`;
  }

  let lastFocused=null;
  function openOverlay(node,focusTarget){ lastFocused=document.activeElement; node.hidden=false; document.body.style.overflow='hidden'; setTimeout(()=>focusTarget?.focus?.(),0); }
  function closeOverlay(node){ node.hidden=true; if(!$$('.overlay:not([hidden])').length) document.body.style.overflow=''; lastFocused?.focus?.(); }
  function closeAllOverlays(){ $$('.overlay:not([hidden])').forEach(closeOverlay); }

  function applyPreferences(){
    document.body.dataset.theme=state.theme;
    const sizes=['.98rem','1.08rem','1.2rem','1.32rem'];
    document.documentElement.style.setProperty('--lesson-font',sizes[state.font] || sizes[0]);
  }
  function cycleFont(){ state.font=(Number(state.font)+1)%4; saveState(); applyPreferences(); toast(`Dimensione testo ${state.font+1} di 4.`); }
  function toggleTheme(){ state.theme=state.theme==='night'?'day':'night'; saveState(); applyPreferences(); }
  function resetData(){
    if(!confirm('Azzera evidenziazioni, appunti, citazioni, test e progresso di tutta la PWA?')) return;
    localStorage.removeItem(STORAGE_KEY); state=defaultState(); applyPreferences(); renderIndex(); updateProgress(); showCover(); toast('Dati di studio azzerati.');
  }

  $('#startBtn').addEventListener('click',()=>startCourse(0));
  $('#resumeBtn').addEventListener('click',()=>startCourse(Math.max(0,DATA.lessons.findIndex(item=>item.id===state.current))));
  $('#homeBtn').addEventListener('click',showCover);
  $('#indexBtn').addEventListener('click',()=>{renderIndex();openOverlay(indexOverlay,$('[data-open-lesson]',indexOverlay));});
  $('#prevLessonBtn').addEventListener('click',()=>openLesson(currentIndex-1));
  $('#nextLessonBtn').addEventListener('click',()=>openLesson(currentIndex+1));
  $('#fontBtn').addEventListener('click',cycleFont);
  $('#themeBtn').addEventListener('click',toggleTheme);
  $('#highlightBtn').addEventListener('click',addHighlight);
  $('#pasteSelectionBtn').addEventListener('click',pasteSelection);
  $('#pasteHighlightsBtn').addEventListener('click',pasteHighlights);
  $('#clearHighlightsBtn').addEventListener('click',clearHighlights);
  $('#downloadNotesBtn').addEventListener('click',downloadNotes);
  $('#clearNotesBtn').addEventListener('click',clearNotebook);
  $('#expandVisualBtn').addEventListener('click',expandVisual);
  $('#visualImage').addEventListener('click',expandVisual);
  $('#resetDataBtn').addEventListener('click',resetData);
  notesArea.addEventListener('input',()=>{state.notes[lesson().id]=notesArea.value;saveState();});
  lessonScroll.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(saveScroll,180);},{passive:true});
  document.addEventListener('selectionchange',rememberSelection);
  $$('.reading-toolbar button').forEach(button=>button.addEventListener('mousedown',event=>event.preventDefault()));
  citationsBox.addEventListener('click',event=>{const button=event.target.closest('[data-delete-citation]');if(button)deleteCitation(button.dataset.deleteCitation);});
  $('#visualChoices').addEventListener('click',event=>{const button=event.target.closest('[data-visual-choice]');if(button)setVisual(button.dataset.visualChoice);});
  $('#lessonIndex').addEventListener('click',event=>{const button=event.target.closest('[data-open-lesson]');if(button){closeOverlay(indexOverlay);startCourse(Number(button.dataset.openLesson));}});
  $$('[data-study-panel]').forEach(button=>button.addEventListener('click',()=>openStudyPanel(button.dataset.studyPanel)));
  $$('[data-mobile-pane]').forEach(button=>button.addEventListener('click',()=>{
    const pane=button.dataset.mobilePane; studyGrid.dataset.mobilePane=pane;
    $$('[data-mobile-pane]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  }));
  $$('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>closeOverlay(button.closest('.overlay'))));
  $$('.overlay').forEach(node=>node.addEventListener('mousedown',event=>{if(event.target===node)closeOverlay(node);}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeAllOverlays();});
  window.addEventListener('beforeunload',saveScroll);

  applyPreferences(); renderIndex(); updateProgress();
  if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(error=>console.error('Service worker:',error)));
})();
