const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

const toast = $('#toast');
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 1800);
}

// Scroll progress
addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  const p = h > 0 ? (scrollY / h) * 100 : 0;
  $('#progress').style.width = p + '%';
});

// Hotspots on the cover image
$$('.hotspot').forEach(h => {
  h.addEventListener('click', () => {
    const target = document.getElementById(h.dataset.target);
    if(target){ target.scrollIntoView({behavior:'smooth', block:'start'}); showToast('Apro: ' + h.getAttribute('aria-label')); }
  });
});

// Expand lesson cards
$$('[data-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.lesson-card');
    const isOpen = card.classList.toggle('open');
    btn.textContent = isOpen ? 'Chiudi scheda' : 'Apri scheda';
    if(isOpen) localStorage.setItem('romanticismo-last-section', card.id);
  });
});

// Map modal
const modal = $('#mapModal');
const modalImg = $('#modalImg');
const modalTitle = $('#modalTitle');
$$('[data-map]').forEach(btn => {
  btn.addEventListener('click', () => {
    modalImg.src = btn.dataset.map;
    modalImg.alt = btn.dataset.title || 'Mappa';
    modalTitle.textContent = btn.dataset.title || 'Mappa';
    modal.showModal();
  });
});
$('#closeModal').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => { if(e.target === modal) modal.close(); });

// Tabs
$$('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const group = tab.closest('.tabs').dataset.tabs;
    $$(`.tabs[data-tabs="${group}"] .tab`).forEach(t => t.setAttribute('aria-selected','false'));
    tab.setAttribute('aria-selected','true');
    $$(`.tab-panel[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
    $(`#${tab.dataset.panel}`).classList.add('active');
  });
});

// Timeline
const timelineText = {
  '1789':'La Rivoluzione francese mostra la forza delle idee illuministiche, ma anche la potenza delle passioni collettive e della storia concreta.',
  '1798':'In Inghilterra escono le Lyrical Ballads: natura, emozione e linguaggio vivo diventano centrali.',
  '1799':'Il gruppo di Jena e l’Athenaeum danno al Romanticismo tedesco una forte autocoscienza teorica.',
  '1816':'In Italia esplode la polemica classico-romantica: la letteratura deve parlare ai vivi o imitare gli antichi?',
  '1823':'Manzoni formula la linea dell’utile, vero e interessante: nasce un Romanticismo civile, morale e storico.',
  '1827':'I Promessi sposi e la Prefazione al Cromwell: il romanzo storico italiano e il dramma romantico francese trovano due forme decisive.',
  '1840':'La Quarantana manzoniana lega Romanticismo, lingua nazionale e pubblico moderno.'
};
$$('.time-node').forEach(n => n.addEventListener('click', () => { $('#timeDesc').textContent = timelineText[n.dataset.year]; }));

// Search inside headings and lesson cards
$('#searchBtn').addEventListener('click', runSearch);
$('#searchInput').addEventListener('keydown', e => { if(e.key === 'Enter') runSearch(); });
function runSearch(){
  const q = $('#searchInput').value.trim().toLowerCase();
  if(!q){ showToast('Scrivi una parola da cercare.'); return; }
  const found = $$('section, .lesson-card, .author').find(el => el.innerText.toLowerCase().includes(q));
  if(found){
    found.scrollIntoView({behavior:'smooth', block:'center'});
    found.animate([{outline:'4px solid rgba(244,210,138,.0)'},{outline:'4px solid rgba(244,210,138,.95)'},{outline:'4px solid rgba(244,210,138,.0)'}],{duration:1400});
    showToast('Trovato: ' + q);
  } else showToast('Nessun risultato per: ' + q);
}

// Quiz
const quiz = [
  {q:'Perché “sentimento contro ragione” è una formula insufficiente?', a:['Perché il Romanticismo rifiuta ogni ragione','Perché critica la ragione astratta, non ogni forma di ragione','Perché riguarda solo la pittura','Perché nasce dopo il Verismo'], c:1},
  {q:'In Italia il Romanticismo assume soprattutto una funzione...', a:['civile e nazionale','solo fantastica','puramente comica','scientifica e positivista'], c:0},
  {q:'Quale autore è il modello europeo del romanzo storico moderno?', a:['Victor Hugo','Walter Scott','Byron','Schiller'], c:1},
  {q:'La formula manzoniana è...', a:['bello, utile, tragico','utile, vero, interessante','sentimento, sogno, mistero','lingua, popolo, guerra'], c:1},
  {q:'In Leopardi l’infinito nasce spesso...', a:['dalla mancanza di limiti','dal limite che accende l’immaginazione','dalla fede provvidenziale','dalla certezza del progresso'], c:1},
  {q:'Il popolo nel Romanticismo italiano diventa...', a:['un nuovo pubblico da educare','un tema vietato','solo una massa comica','un nemico della letteratura'], c:0},
  {q:'Manzoni trasforma il modello di Scott in senso...', a:['gotico e fantastico','morale, storico e civile','puramente autobiografico','musicale'], c:1},
  {q:'Una contraddizione centrale del Romanticismo è...', a:['matematica/geometria','ideale/reale','latino/greco','prosa/stampa'], c:1}
];
function renderQuiz(){
  const root = $('#quizRoot'); root.innerHTML = '';
  quiz.forEach((item, i) => {
    const box = document.createElement('div'); box.className='question';
    box.innerHTML = `<strong>${i+1}. ${item.q}</strong><div class="answers"></div>`;
    const ans = $('.answers', box);
    item.a.forEach((txt, idx) => {
      const b = document.createElement('button'); b.textContent = txt;
      b.addEventListener('click', () => {
        if(ans.dataset.done) return;
        ans.dataset.done = '1';
        b.classList.add(idx === item.c ? 'correct' : 'wrong');
        if(idx !== item.c) ans.children[item.c].classList.add('correct');
        updateQuizResult();
      });
      ans.appendChild(b);
    });
    root.appendChild(box);
  });
}
function updateQuizResult(){
  let done=0, score=0;
  $$('.question').forEach((q,i) => {
    const ans = $('.answers', q);
    if(ans.dataset.done){ done++; if(ans.children[quiz[i].c].classList.contains('correct')) score++; }
  });
  $('#quizResult').textContent = done ? `Risposte date: ${done}/${quiz.length}. Punteggio provvisorio: ${score}/${done}.` : '';
  if(done === quiz.length){ localStorage.setItem('romanticismo-quiz', String(score)); showToast(`Quiz completato: ${score}/${quiz.length}`); }
}
renderQuiz();
$('#resetQuiz').addEventListener('click', () => { renderQuiz(); $('#quizResult').textContent=''; });

// Install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; $('#installBtn').hidden = false; });
$('#installBtn').addEventListener('click', async () => {
  if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; }
  else showToast('Per installarla: apri il menu del browser e scegli “Aggiungi alla schermata Home”.');
});

// Service worker
if('serviceWorker' in navigator){ window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js')); }

// Nav active state
const navLinks = $$('.nav a');
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, {rootMargin:'-45% 0px -50% 0px'});
sections.forEach(s => obs.observe(s));