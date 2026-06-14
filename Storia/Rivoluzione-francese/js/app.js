const D = window.RF_DATA;
const TEXTS = window.RF_TEXTS || { lessons: {}, approfondimenti: {} };
const app = document.getElementById('app');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.getElementById('modalClose');

closeBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

function closeModal() {
  modal.classList.remove('open');
  modalBody.innerHTML = '';
}

function openImage(title, src) {
  modalTitle.textContent = title;
  modalBody.innerHTML = `<img src="${src}" alt="${escapeHtml(title)}">`;
  modal.classList.add('open');
}

function openVideo(title, src) {
  modalTitle.textContent = title;
  modalBody.innerHTML = `<video src="${src}" controls style="max-width:100%;max-height:78vh;border-radius:14px;background:#000"></video>`;
  modal.classList.add('open');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pageHeader(kicker, title, lead) {
  return `<section class="hero-mini"><div><div class="kicker">${kicker}</div><h1 class="hero-title">${title}</h1><p class="lead">${lead}</p></div><img src="assets/img/covers/copertina.png" alt="Copertina" style="width:100%;max-height:460px;object-fit:cover;border-radius:22px;border:1px solid rgba(213,168,91,.4);box-shadow:var(--shadow)"></section>`;
}

function renderCard(item, type = 'lesson') {
  const readerLabel = type === 'lezione' ? 'Leggi la lezione' : 'Leggi scheda';
  const schema = item.schema ? `<a class="btn" href="javascript:void(0)" onclick="openImage('${escapeHtml(item.title)} - schema','${item.schema}')">Apri schema</a>` : '';
  const video = item.video ? `<a class="btn" href="javascript:void(0)" onclick="openVideo('${escapeHtml(item.title)}','${item.video}')">Video</a>` : '';
  const detail = `<a class="btn btn-red" href="#${type}-${item.id}">${readerLabel}</a>`;
  return `<article class="card"><div class="card-content"><div class="num">${item.n || item.icon || '&bull;'}</div><span class="tag">${item.tag || type}</span><h3>${item.title}</h3><p>${item.subtitle || ''}</p><div class="card-actions">${detail}${schema}${video}</div></div></article>`;
}

function renderHome() {
  app.innerHTML = pageHeader('PWA didattica', 'La Rivoluzione <span>francese</span>', 'Percorso interattivo per studiare cause, eventi, protagonisti e concetti politici della Rivoluzione francese.') + `<div class="card-grid"><a class="card" href="#lezioni"><div class="card-content"><div class="num">1</div><h3>Lezioni</h3><p>Le quattro parti principali del percorso.</p></div></a><a class="card" href="#approfondimenti"><div class="card-content"><div class="num">2</div><h3>Approfondimenti</h3><p>Documenti, confronti, club, forme di governo, liberalismo.</p></div></a><a class="card" href="#mappe"><div class="card-content"><div class="num">3</div><h3>Mappe e schemi</h3><p>Infografiche pronte per ripasso e LIM.</p></div></a><a class="card" href="#quiz"><div class="card-content"><div class="num">?</div><h3>Quiz di autovalutazione</h3><p>Domande, correzione e recupero sugli errori.</p></div></a></div>`;
}

function renderLessons() {
  app.innerHTML = pageHeader('Percorso principale', 'Lezioni', 'Le quattro parti della lezione principale, con testo leggibile nella PWA, evidenziazioni, appunti e mappe concettuali.') + `<div class="card-grid">${D.lessons.map(x => renderCard(x, 'lezione')).join('')}</div>`;
}

function renderLesson(id) {
  const l = D.lessons.find(x => x.id === id);
  if (!l) return renderLessons();
  renderReader(l, 'lessons', '#lezioni', 'Torna alle lezioni', l.schema ? 'Apri la mappa' : '');
}

function renderApprofondimenti() {
  app.innerHTML = pageHeader('Finestre di studio', 'Approfondimenti', 'Schede laterali e concetti chiave per collegare la Rivoluzione a cittadinanza, economia, diritti e forme politiche.') + `<input class="searchbar" id="search" placeholder="Cerca negli approfondimenti..."><div class="card-grid" id="cards">${D.approfondimenti.map(x => renderCard(x, 'approfondimento')).join('')}</div>`;
  document.getElementById('search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.getElementById('cards').innerHTML = D.approfondimenti
      .filter(x => (x.title + x.subtitle).toLowerCase().includes(q))
      .map(x => renderCard(x, 'approfondimento')).join('') || '<p>Nessun risultato.</p>';
  });
}

function renderApprofondimento(id) {
  const a = D.approfondimenti.find(x => x.id === id);
  if (!a) return renderApprofondimenti();
  renderReader(a, 'approfondimenti', '#approfondimenti', 'Torna agli approfondimenti', a.schema ? 'Apri schema' : '');
}

function renderReader(item, group, backHref, backLabel, schemaLabel) {
  const paragraphs = TEXTS[group]?.[item.id] || [];
  const docKey = `${group}-${item.id}`;
  const notes = getNotes(docKey);
  const schemaButton = item.schema ? `<button class="btn" onclick="openImage('${escapeHtml(item.title)} - schema','${item.schema}')">${schemaLabel}</button>` : '';
  const videoButton = item.video ? `<button class="btn" onclick="openVideo('${escapeHtml(item.title)}','${item.video}')">Guarda video</button>` : '';

  app.innerHTML = `
    <a class="btn" href="${backHref}">&larr; ${backLabel}</a>
    <section class="reader-layout">
      <article class="reader-panel">
        <div class="kicker">${group === 'lessons' ? 'Lezione' : 'Approfondimento'}</div>
        <h1 class="section-title">${item.title}</h1>
        <p class="lead">${item.subtitle || ''}</p>
        <div class="tools-row reader-tools">
          <button class="btn btn-red" onclick="highlightSelection('${docKey}')">Evidenzia selezione</button>
          <button class="btn" onclick="clearHighlights('${docKey}')">Cancella evidenziazioni</button>
          ${schemaButton}
          ${videoButton}
        </div>
        <div class="reader-text" id="readerText" data-doc="${docKey}">
          ${paragraphs.length ? renderParagraphs(paragraphs, docKey) : '<p>Testo non disponibile.</p>'}
        </div>
      </article>
      <aside class="notes-panel">
        <div class="kicker">Appunti</div>
        <h2>Quaderno personale</h2>
        <p>Puoi aggiungere qui il testo evidenziato, modificarlo e salvarlo in formato TXT.</p>
        <div class="notes-actions">
          <button class="btn btn-red" onclick="addHighlightsToNotes('${docKey}')">Aggiungi evidenziato</button>
          <button class="btn" onclick="downloadNotes('${docKey}', '${escapeHtml(item.title)}')">Salva TXT</button>
        </div>
        <textarea id="notesBox" class="notes-box" oninput="saveNotes('${docKey}', this.value)">${escapeHtml(notes)}</textarea>
      </aside>
    </section>
    ${item.video ? `<div class="panel"><h2>Video</h2><video src="${item.video}" controls style="width:100%;border-radius:18px;background:#000"></video></div>` : ''}
  `;
}

function renderParagraphs(paragraphs, docKey) {
  const highlights = getHighlights(docKey);
  return paragraphs.map(p => `<p>${applyHighlights(escapeHtml(p), highlights)}</p>`).join('');
}

function applyHighlights(html, highlights) {
  return highlights.reduce((acc, h) => {
    const clean = escapeHtml(h);
    if (!clean) return acc;
    return acc.replace(new RegExp(escapeRegExp(clean), 'g'), `<mark>${clean}</mark>`);
  }, html);
}

function storageKey(type, docKey) {
  return `rf-${type}-${docKey}`;
}

function getHighlights(docKey) {
  try {
    return JSON.parse(localStorage.getItem(storageKey('highlights', docKey)) || '[]');
  } catch {
    return [];
  }
}

function setHighlights(docKey, highlights) {
  localStorage.setItem(storageKey('highlights', docKey), JSON.stringify(highlights));
}

function getNotes(docKey) {
  return localStorage.getItem(storageKey('notes', docKey)) || '';
}

window.saveNotes = function (docKey, value) {
  localStorage.setItem(storageKey('notes', docKey), value);
};

window.highlightSelection = function (docKey) {
  const reader = document.querySelector(`[data-doc="${docKey}"]`);
  const selection = window.getSelection();
  const selected = selection?.toString().replace(/\s+/g, ' ').trim();
  if (!reader || !selected || !reader.contains(selection.anchorNode) || selected.length < 3) return;

  const highlights = getHighlights(docKey);
  if (!highlights.includes(selected)) {
    highlights.push(selected);
    setHighlights(docKey, highlights);
  }
  selection.removeAllRanges();
  reader.innerHTML = renderParagraphs(getCurrentParagraphs(docKey), docKey);
};

window.clearHighlights = function (docKey) {
  setHighlights(docKey, []);
  const reader = document.querySelector(`[data-doc="${docKey}"]`);
  if (reader) reader.innerHTML = renderParagraphs(getCurrentParagraphs(docKey), docKey);
};

function getCurrentParagraphs(docKey) {
  const [group, ...rest] = docKey.split('-');
  const id = rest.join('-');
  return TEXTS[group]?.[id] || [];
}

window.addHighlightsToNotes = function (docKey) {
  const box = document.getElementById('notesBox');
  const selected = cleanNotesText(getHighlights(docKey).join('\n\n'));
  if (!box || !selected) return;
  const next = [box.value.trim(), selected].filter(Boolean).join('\n\n');
  box.value = next;
  saveNotes(docKey, next);
};

window.downloadNotes = function (docKey, title) {
  const text = cleanNotesText(document.getElementById('notesBox')?.value || '');
  const blob = new Blob([text || ''], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${title.toLowerCase().replace(/[^a-z0-9àèéìòù]+/gi, '-').replace(/^-|-$/g, '') || 'appunti'}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
};

function cleanNotesText(text) {
  return String(text)
    .split('\n')
    .map(line => line.replace(/^\s*\d+[\.)]\s+/, '').trim())
    .join('\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function renderMappe() {
  const items = [...D.lessons.map(x => ({ title: x.title, src: x.schema, subtitle: x.subtitle })), ...D.approfondimenti.map(x => ({ title: x.title, src: x.schema, subtitle: x.subtitle }))];
  app.innerHTML = pageHeader('Ripasso visivo', 'Mappe e schemi', 'Tutte le mappe concettuali e gli schemi in un\'unica galleria.') + `<div class="card-grid">${items.map(x => `<article class="card image-card" onclick="openImage('${escapeHtml(x.title)}','${x.src}')"><img src="${x.src}" alt="${escapeHtml(x.title)}"><div class="card-content"><h3>${x.title}</h3><p>${x.subtitle || ''}</p><div class="card-actions"><a class="btn" href="${x.src}" download onclick="event.stopPropagation()">Scarica</a></div></div></article>`).join('')}</div>`;
}

function renderBiografie() {
  app.innerHTML = pageHeader('Persone nella storia', 'Biografie', 'Le figure principali della Rivoluzione: monarchia, teorici, radicali, donne, popolo.') + `<input class="searchbar" id="search" placeholder="Cerca una figura..."><div class="bio-grid" id="bios">${D.biographies.map(renderBioCard).join('')}</div>`;
  document.getElementById('search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.getElementById('bios').innerHTML = D.biographies
      .filter(b => (b.name + b.role + b.text).toLowerCase().includes(q))
      .map(renderBioCard).join('') || '<p>Nessun risultato.</p>';
  });
}

function renderBioCard(b) {
  return `<article class="card bio-card"><img src="${b.img}" alt="${escapeHtml(b.name)}"><div><h3>${b.name}</h3><small>${b.role}</small><p>${b.text.slice(0, 170)}...</p><a class="btn" href="#bio-${b.id}">Leggi scheda</a></div></article>`;
}

function renderBio(id) {
  const b = D.biographies.find(x => x.id === id);
  if (!b) return renderBiografie();
  app.innerHTML = `<a class="btn" href="#biografie">&larr; Torna alle biografie</a><section class="panel" style="display:grid;grid-template-columns:minmax(220px,340px) 1fr;gap:26px;align-items:start"><img src="${b.img}" alt="${escapeHtml(b.name)}" style="width:100%;border-radius:22px;border:1px solid var(--gold);box-shadow:var(--shadow)"><div><div class="kicker">Biografia</div><h1 class="section-title">${b.name}</h1><p class="lead"><strong>${b.role}</strong></p><p style="font-size:1.18rem;line-height:1.75;color:#f5ead2">${b.text}</p></div></section>`;
}

function renderTimeline() {
  app.innerHTML = pageHeader('Ordine cronologico', 'Timeline interattiva', 'Gli eventi principali dal 1789 al 1799, dalla crisi degli Stati Generali al colpo di Stato di Napoleone.') + `<section class="timeline">${D.timeline.map(e => `<article class="event"><div class="year">${e.year}</div><div class="text"><h3>${e.title}</h3><p>${e.text}</p></div></article>`).join('')}</section>`;
}

const QUIZ_REVIEW = [
  { title: 'Terzo Stato', link: '#approfondimento-tre-stati', text: 'Ripassa la composizione del Terzo Stato: non era un solo gruppo sociale, ma comprendeva borghesia, artigiani, lavoratori urbani, contadini e poveri esclusi dai privilegi di clero e nobiltà.' },
  { title: 'Voto per testa', link: '#approfondimento-tre-stati', text: 'Rivedi perché il voto per testa cambiava gli equilibri: ogni deputato avrebbe votato singolarmente e il Terzo Stato avrebbe potuto far pesare la propria superiorità numerica.' },
  { title: 'Giuramento della Pallacorda', link: '#lezione-1789', text: 'Torna al 20 giugno 1789: i rappresentanti del Terzo Stato giurarono di non separarsi prima di aver dato una Costituzione alla Francia.' },
  { title: 'Bastiglia', link: '#lezione-1789', text: 'La Bastiglia aveva un valore soprattutto simbolico: rappresentava l’arbitrio della monarchia assoluta, anche se non era piena di prigionieri.' },
  { title: 'Dichiarazione dei diritti', link: '#approfondimento-diritti', text: 'Ripassa i principi del 1789: libertà, uguaglianza davanti alla legge, sovranità nazionale, legalità e diritti del cittadino.' },
  { title: 'Costituzione del 1791', link: '#lezione-monarchia', text: 'Rivedi la monarchia costituzionale: il re resta, ma il suo potere è limitato; il voto è censitario e distingue cittadini attivi e passivi.' },
  { title: 'Fuga di Varennes', link: '#lezione-monarchia', text: 'La fuga del 1791 fece crollare la fiducia nel re, perché Luigi XVI apparve a molti come un possibile traditore della Rivoluzione.' },
  { title: 'Sanculotti', link: '#approfondimento-sanculotti', text: 'Ripassa il popolo urbano radicale: artigiani, lavoratori e bottegai legati a pane, prezzi, giustizia sociale e partecipazione politica.' },
  { title: 'Terrore', link: '#approfondimento-terrore', text: 'Rivedi il Terrore come governo d’emergenza: tribunali rivoluzionari, repressione, ghigliottina e difesa della Repubblica dai nemici interni ed esterni.' },
  { title: '9 termidoro', link: '#lezione-repubblica', text: 'Il 27 luglio 1794 Robespierre fu arrestato; il giorno dopo venne ghigliottinato. Questo chiuse la fase più radicale della Rivoluzione.' },
  { title: 'Girondini e Giacobini', link: '#approfondimento-girondini-giacobini', text: 'Confronta i due gruppi: i Girondini sono più moderati e diffidenti verso la piazza; i Giacobini sono più radicali e vicini ai sanculotti.' },
  { title: 'Costituzione del 1793', link: '#lezione-repubblica', text: 'La repubblica democratica del 1793 resta soprattutto teorica perché guerra ed emergenza portarono al governo eccezionale.' }
];

let qi = 0;
let score = 0;
let answered = false;
let quizAnswers = [];

function renderQuiz() {
  qi = 0;
  score = 0;
  answered = false;
  quizAnswers = [];
  drawQuestion();
}

function drawQuestion() {
  const q = D.quiz[qi];
  if (!q) return drawQuizReport();

  app.innerHTML = `<h1 class="section-title quiz-title">Quiz di autovalutazione</h1><p class="lead">Rispondi e leggi subito la correzione: il risultato finale ti dirà anche cosa ripassare.</p><div class="card quiz-card"><div class="card-content"><span class="tag">Domanda ${qi + 1} di ${D.quiz.length}</span><h3 class="question-title">${q.q}</h3><div class="answers">${q.a.map((ans, i) => `<button class="answer" onclick="answer(${i})">${escapeHtml(ans)}</button>`).join('')}</div><p id="feedback" class="feedback"></p></div></div>`;
}

window.answer = function (i) {
  if (answered) return;
  answered = true;
  const q = D.quiz[qi];
  const buttons = [...document.querySelectorAll('.answer')];
  buttons.forEach((b, idx) => {
    if (idx === q.ok) b.classList.add('correct');
    if (idx === i && idx !== q.ok) b.classList.add('wrong');
  });
  const isCorrect = i === q.ok;
  if (isCorrect) score++;
  quizAnswers[qi] = { selected: i, correct: isCorrect };
  document.getElementById('feedback').innerHTML = `<strong>${isCorrect ? 'Corretto.' : 'Non corretto.'}</strong> ${q.why}<br><br><button class="btn btn-red" onclick="qi++;answered=false;drawQuestion()">Prosegui &rarr;</button>`;
};

function drawQuizReport() {
  const wrong = quizAnswers
    .map((answer, index) => ({ answer, index, q: D.quiz[index], review: QUIZ_REVIEW[index] }))
    .filter(x => !x.answer?.correct);
  const grade = Math.round((score / D.quiz.length) * 10);
  const reviewHtml = wrong.length
    ? wrong.map(x => `<article class="recovery-card"><h3>${x.review.title}</h3><p><strong>Domanda:</strong> ${escapeHtml(x.q.q)}</p><p><strong>Risposta corretta:</strong> ${escapeHtml(x.q.a[x.q.ok])}</p><p>${escapeHtml(x.review.text)}</p><a class="btn btn-red" href="${x.review.link}">Apri recupero</a></article>`).join('')
    : '<p class="lead">Non ci sono lezioni di recupero: hai risposto correttamente a tutte le domande.</p>';

  app.innerHTML = `<h1 class="section-title">Report del quiz</h1><section class="panel quiz-report"><p class="score">Punteggio: ${score} / ${D.quiz.length}</p><p class="score">Voto indicativo: ${grade} / 10</p><p class="lead">${score >= 9 ? 'Preparazione solida: puoi usare il ripasso per fissare meglio i collegamenti.' : 'Il quiz serve a orientare il ripasso: qui sotto trovi solo gli argomenti collegati alle risposte sbagliate.'}</p><a class="btn btn-red" href="#quiz">Ricomincia</a></section><section class="recovery-list"><h2>Lezioni di recupero mirate</h2>${reviewHtml}</section>`;
}

function router() {
  const h = (location.hash || '#home').slice(1);
  app.focus();
  if (h === 'home') return renderHome();
  if (h === 'lezioni') return renderLessons();
  if (h.startsWith('lezione-')) return renderLesson(h.replace('lezione-', ''));
  if (h === 'approfondimenti') return renderApprofondimenti();
  if (h.startsWith('approfondimento-')) return renderApprofondimento(h.replace('approfondimento-', ''));
  if (h === 'mappe') return renderMappe();
  if (h === 'biografie') return renderBiografie();
  if (h.startsWith('bio-')) return renderBio(h.replace('bio-', ''));
  if (h === 'timeline') return renderTimeline();
  if (h === 'quiz') return renderQuiz();
  renderHome();
}

window.addEventListener('hashchange', router);
router();

let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn')?.classList.add('show');
});
document.getElementById('installBtn')?.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt = null;
  }
});
