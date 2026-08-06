(() => {
  'use strict';
  const D = window.REST_DATA;
  const app = document.getElementById('app');
  const notesDrawer = document.getElementById('notesDrawer');
  const notesBox = document.getElementById('notesBox');
  const searchDrawer = document.getElementById('searchDrawer');
  const searchInput = document.getElementById('globalSearch');
  const searchResults = document.getElementById('searchResults');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const toastEl = document.getElementById('toast');
  let currentLesson = null;
  let deferredInstall = null;
  let quizState = { index: 0, answers: [] };

  const escapeHtml = value => String(value).replace(/[&<>"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  const normalize = value => String(value).toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const lessonById = id => D.lessons.find(lesson => lesson.id === id);
  const personById = id => D.people.find(person => person.id === id);
  const hashParts = () => (location.hash.slice(1) || 'lezioni').split('/');

  function completedLessons() {
    try { return JSON.parse(localStorage.getItem('restCompleted') || '[]'); } catch (_) { return []; }
  }

  function setCompleted(id, value) {
    const done = new Set(completedLessons());
    value ? done.add(id) : done.delete(id);
    localStorage.setItem('restCompleted', JSON.stringify([...done]));
  }

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  function pageHero(eyebrow, title, lead, question = '') {
    return `<section class="page-hero ${question ? '' : 'compact'}">
      <div><p class="overline">${eyebrow}</p><h1>${title}</h1><p class="lead">${lead}</p></div>
      ${question ? `<blockquote class="hero-question"><small>Domanda generatrice</small>${question}</blockquote>` : ''}
    </section>`;
  }

  function breadcrumb(label) {
    return `<nav class="breadcrumb" aria-label="Percorso"><a href="index.html">Home</a><span>›</span><a href="#lezioni">Lezioni</a>${label ? `<span>›</span><span>${label}</span>` : ''}</nav>`;
  }

  function renderLessons() {
    currentLesson = null;
    const completed = completedLessons();
    app.innerHTML = `<div class="app-container">
      ${pageHero('Indice del percorso', 'Sei passaggi per capire la Restaurazione', 'Il filo non è cronologico soltanto: parte dal mondo trasformato, attraversa la caduta di Napoleone e arriva al conflitto fra due idee di società.')}
      <div class="lesson-index-grid">
        ${D.lessons.map(lesson => `<a class="lesson-index-card" href="#lezione/${lesson.id}">
          <span class="big-num">${lesson.number}</span><div><p class="overline">${lesson.period}${completed.includes(lesson.id) ? ' · completata' : ''}</p><h2>${lesson.title}</h2><p>${lesson.eyebrow}</p></div><span>→</span>
        </a>`).join('')}
      </div>
      <section class="apparatus" style="margin-top:22px"><h2>La domanda che tiene insieme tutto</h2><p class="intro-text">${D.meta.question}</p></section>
    </div>`;
  }

  function renderLesson(id) {
    const lesson = lessonById(id) || D.lessons[0];
    currentLesson = lesson;
    document.title = `${lesson.title} — La Restaurazione`;
    const index = D.lessons.indexOf(lesson);
    const done = completedLessons().includes(lesson.id);
    const sourceLinks = D.sources.filter(source => {
      if (lesson.id === 'frattura') return source.id === 'nugent';
      if (lesson.id === 'europa-restaurata') return source.id === 'santa-alleanza';
      if (lesson.id === 'mondo-nuovo' || lesson.id === 'liberali-conservatori') return source.id === 'carta-1814';
      return false;
    });
    app.innerHTML = `<div class="app-container">
      ${breadcrumb(lesson.title)}
      ${pageHero(`Lezione ${lesson.number} · ${lesson.period}`, `${lesson.title.includes(' ') ? lesson.title.replace(/ (.+)$/,' <span>$1</span>') : lesson.title}`, lesson.lead, lesson.question)}
      <div class="lesson-shell">
        <article class="lesson-reader">
          <div class="lesson-tools" aria-label="Strumenti di studio">
            <button class="tool-button" data-tool="notes">✎ Appunti</button>
            <button class="tool-button" data-tool="highlight">▰ Evidenzia selezione</button>
            <button class="tool-button" data-tool="clear">◫ Togli evidenziazioni</button>
            <button class="tool-button" data-tool="print">⇩ Stampa / PDF</button>
          </div>
          <div class="reader-paper" id="lessonText">
            ${lesson.sections.map((section, sectionIndex) => `<section class="lesson-section" id="sezione-${sectionIndex + 1}">
              <span class="section-number">${lesson.number}.${sectionIndex + 1}</span><h2>${section.title}</h2>
              ${section.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
              <div class="in-summary"><strong>In sintesi.</strong> ${section.summary}</div>
              ${sectionIndex < lesson.sections.length - 1 ? `<p class="bridge">Il passaggio successivo nasce da qui: ${lesson.sections[sectionIndex + 1].title.toLocaleLowerCase('it')}.</p>` : ''}
            </section>`).join('')}
          </div>
          <section class="apparatus"><p class="overline">Orientarsi</p><h2>Coordinate essenziali</h2><div class="chip-list">${lesson.coordinates.map(item => `<span class="info-chip">${item}</span>`).join('')}</div></section>
          <section class="apparatus"><p class="overline">Da saper spiegare</p><h2>Saperi irrinunciabili</h2><ul>${lesson.essentials.map(item => `<li>${item}</li>`).join('')}</ul></section>
          <section class="apparatus"><p class="overline">Parole della storia</p><h2>Vocabolario essenziale</h2><div class="vocab-grid">${Object.entries(lesson.vocab).map(([term, definition]) => `<article class="vocab-item"><h3>${term}</h3><p>${definition}</p></article>`).join('')}</div></section>
          ${sourceLinks.length ? `<section class="apparatus"><p class="overline">La fonte in dialogo</p><h2>Dal testo al problema storico</h2>${sourceLinks.map(source => `<p><a class="button button-gold" href="#fonti/${source.id}">${source.title} →</a></p>`).join('')}</section>` : ''}
          <section class="completion-box ${done ? 'completed' : ''}" id="completionBox"><div><h2>${done ? 'Lezione completata' : 'Hai concluso la lettura?'}</h2><p>${done ? 'Il progresso è salvato su questo dispositivo.' : 'Segnala la lezione come completata per aggiornare il percorso.'}</p></div><button class="button ${done ? 'button-ghost' : 'button-gold'}" id="completeLesson">${done ? 'Segna da rivedere' : 'Segna come completata'}</button></section>
          <nav class="pager" aria-label="Lezioni precedente e successiva">
            ${index > 0 ? `<a href="#lezione/${D.lessons[index - 1].id}">← Lezione precedente<span>${D.lessons[index - 1].title}</span></a>` : '<span></span>'}
            ${index < D.lessons.length - 1 ? `<a href="#lezione/${D.lessons[index + 1].id}">Lezione successiva →<span>${D.lessons[index + 1].title}</span></a>` : `<a href="#quiz">Verifica finale →<span>Quiz ragionato</span></a>`}
          </nav>
        </article>
        <aside class="lesson-sidebar">
          <section class="side-card"><h2>In questa lezione</h2>${lesson.sections.map((section, i) => `<a href="#sezione-${i + 1}" data-local-anchor>${i + 1}. ${section.title}</a>`).join('')}</section>
          <section class="side-card"><h2>Collegamenti</h2><a href="#mappe">Mappe e schemi</a><a href="#timeline">Timeline ragionata</a><a href="#biografie">Protagonisti</a><a href="#fonti">Laboratorio sulle fonti</a><a href="assets/pdf/lezioni/${lesson.number}-${lesson.id}.pdf" target="_blank">PDF della lezione</a></section>
        </aside>
      </div>
    </div>`;
    bindLessonActions(lesson, done);
  }

  function bindLessonActions(lesson, done) {
    document.querySelectorAll('[data-local-anchor]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      document.querySelector(link.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
    }));
    document.querySelector('[data-tool="notes"]')?.addEventListener('click', openNotes);
    document.querySelector('[data-tool="highlight"]')?.addEventListener('click', highlightSelection);
    document.querySelector('[data-tool="clear"]')?.addEventListener('click', () => {
      document.querySelectorAll('#lessonText mark').forEach(mark => mark.replaceWith(...mark.childNodes));
      toast('Evidenziazioni rimosse');
    });
    document.querySelector('[data-tool="print"]')?.addEventListener('click', () => window.print());
    document.getElementById('completeLesson')?.addEventListener('click', () => {
      setCompleted(lesson.id, !done);
      renderLesson(lesson.id);
      toast(done ? 'Lezione segnata da rivedere' : 'Lezione completata');
    });
  }

  function highlightSelection() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !document.getElementById('lessonText')?.contains(selection.anchorNode)) {
      toast('Seleziona prima una frase della lezione'); return;
    }
    const range = selection.getRangeAt(0);
    try {
      const mark = document.createElement('mark');
      mark.appendChild(range.extractContents());
      range.insertNode(mark);
      selection.removeAllRanges();
      toast('Testo evidenziato');
    } catch (_) { toast('Seleziona un passaggio più breve'); }
  }

  function renderMaps() {
    currentLesson = null;
    app.innerHTML = `<div class="app-container">
      ${pageHero('Mappe e schemi', 'Vedere i rapporti, non soltanto ricordare i nomi', 'Sette visualizzazioni mettono in relazione eredità, fratture, principi, confini e idee politiche.')}
      <div class="map-grid">
        ${mapCard('1. Il mondo precedente', 'Le quattro esperienze politiche lasciano un repertorio che l’Ottocento non potrà ignorare.', `<div class="concept-flow"><div class="concept-node">Monarchia costituzionale<br><small>potere limitato</small></div><i class="flow-arrow">→</i><div class="concept-node ruby">Repubblica radicale<br><small>sovranità popolare</small></div><i class="flow-arrow">→</i><div class="concept-node gold">Repubblica censitaria<br><small>diritti e proprietà</small></div><i class="flow-arrow">→</i><div class="concept-node blue">Bonapartismo<br><small>capo e Stato moderno</small></div></div>`)}
        ${mapCard('2. La frattura 1813-1815', 'La sconfitta militare si trasforma in cooperazione diplomatica.', `<div class="concept-flow"><div class="concept-node ruby">Lipsia<br>1813</div><i class="flow-arrow">→</i><div class="concept-node">Chaumont<br>1814</div><i class="flow-arrow">→</i><div class="concept-node blue">Parigi<br>1814</div><i class="flow-arrow">→</i><div class="concept-node gold">Vienna + Waterloo<br>1815</div></div>`)}
        ${mapCard('3. I tre pilastri di Vienna', 'Il sistema funziona soltanto tenendo insieme criteri che non sempre coincidono.', `<div class="triangle-map"><div class="concept-node top gold">EQUILIBRIO<br><small>nessuna egemonia</small></div><div class="concept-node left">LEGITTIMITÀ<br><small>dinastie restaurate</small></div><div class="concept-node right blue">CONCERTO<br><small>consultazione fra potenze</small></div><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 5L5 90h90z"/></svg></div>`)}
        ${mapCard('4. L’Europa nel 1815', 'La carta mostra Stati cuscinetto, ingrandimenti e nuove confederazioni. Aprila per osservare i dettagli.', mapImage('assets/img/maps/europa-1815.svg','Carta schematica dell’Europa nel 1815','Europa nel 1815'), true)}
        ${mapCard('5. L’Italia restaurata', 'La penisola torna frammentata e cade sotto una forte, ma non uniforme, egemonia austriaca.', mapImage('assets/img/maps/italia-1815.svg','Carta schematica dell’Italia nel 1815','Italia nel 1815'), true)}
        ${mapCard('6. Forza e limiti', 'La stessa architettura che produce stabilità lascia senza risposta rappresentanza e nazionalità.', `<div class="balance-map"><div class="balance-column"><h3>Forza</h3><ul><li>equilibrio fra potenze</li><li>Francia reintegrata</li><li>cooperazione diplomatica</li><li>assenza di guerra generale</li></ul></div><div class="balance-axis">⚖</div><div class="balance-column limit"><h3>Limiti</h3><ul><li>suffragi ristretti</li><li>censura e repressione</li><li>nazionalità ignorate</li><li>rivalità rimaste aperte</li></ul></div></div>`)}
        ${mapCard('7. Liberali e conservatori', 'Due risposte diverse al rapporto fra ordine e libertà.', `<table class="compare-table"><thead><tr><th>Problema</th><th>Conservatori</th><th>Liberali</th></tr></thead><tbody><tr><td>Origine dell’ordine</td><td>Storia, tradizione, autorità</td><td>Legge, diritti, consenso</td></tr><tr><td>Cambiamento</td><td>Graduale e guidato</td><td>Riforma costituzionale</td></tr><tr><td>Rischio temuto</td><td>Rivoluzione e disgregazione</td><td>Arbitrio e privilegio</td></tr><tr><td>Partecipazione</td><td>Limitata dai corpi storici</td><td>Rappresentativa, spesso censitaria</td></tr></tbody></table>`, true)}
      </div>
    </div>`;
    bindMapButtons();
  }

  function mapCard(title, text, body, wide = false) { return `<section class="map-card ${wide ? 'wide' : ''}"><h2>${title}</h2><p>${text}</p>${body}</section>`; }
  function mapImage(src, alt, title) { return `<div class="map-image-wrap"><button class="map-open" data-image="${src}" data-title="${title}" style="all:unset;display:block;cursor:zoom-in;width:100%"><img src="${src}" alt="${alt}" loading="lazy"></button></div><div class="map-toolbar"><span>Seleziona la carta per ingrandirla</span><button class="button button-ghost map-open" data-image="${src}" data-title="${title}">Ingrandisci</button></div>`; }

  function bindMapButtons() {
    document.querySelectorAll('.map-open').forEach(button => button.addEventListener('click', () => openImage(button.dataset.title, button.dataset.image)));
  }

  function renderPeople() {
    currentLesson = null;
    app.innerHTML = `<div class="app-container">${pageHero('Figure chiave', 'Persone dentro sistemi più grandi di loro', 'I protagonisti non agiscono nel vuoto: ciascuno dispone di interessi, risorse, paure e vincoli.')}
      <div class="people-grid">${D.people.map(person => `<a class="person-card" href="#biografia/${person.id}"><img src="${person.image}" alt="Ritratto storico di ${person.name}" loading="lazy"><div><p class="overline">${person.years}</p><h2>${person.name}</h2><p>${person.role}</p></div></a>`).join('')}</div>
    </div>`;
  }

  function renderPerson(id) {
    const person = personById(id) || D.people[0];
    currentLesson = null;
    app.innerHTML = `<div class="app-container">${breadcrumb(person.name)}<div class="bio-layout"><aside class="bio-photo"><img src="${person.image}" alt="Ritratto storico di ${person.name}"></aside><article class="bio-content"><p class="overline">${person.years}</p><h1>${person.name}</h1><p class="role">${person.role}</p><p>${person.bio}</p><blockquote class="idea-quote">${person.idea}</blockquote><a class="button button-gold" href="#lezione/${person.lesson}">Vai alla lezione collegata →</a><p style="margin-top:25px"><a class="text-link" href="#biografie">← Tutte le biografie</a></p></article></div></div>`;
  }

  function renderTimeline() {
    currentLesson = null;
    app.innerHTML = `<div class="app-container">${pageHero('Linea del tempo ragionata', 'Che cosa cambia dopo ogni data?', 'La cronologia serve a vedere i passaggi: ogni evento è collegato al significato che assume nel processo storico.')}
      <div class="timeline-controls"><button class="active" data-period="all">Tutto</button><button data-period="1789">Rivoluzione e Impero</button><button data-period="1812">Caduta di Napoleone</button><button data-period="1814">Vienna e Restaurazione</button><button data-period="1820">Le crepe del sistema</button></div>
      <div class="timeline-list" id="timelineList">${timelineHtml(D.timeline)}</div></div>`;
    document.querySelectorAll('[data-period]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-period]').forEach(item => item.classList.toggle('active', item === button));
      const period = button.dataset.period;
      const filtered = period === 'all' ? D.timeline : D.timeline.filter(event => {
        const year = Number((event.year.match(/\d{4}/) || ['0'])[0]);
        if (period === '1789') return year < 1812;
        if (period === '1812') return year >= 1812 && year < 1814;
        if (period === '1814') return year >= 1814 && year < 1820;
        return year >= 1820;
      });
      document.getElementById('timelineList').innerHTML = timelineHtml(filtered);
    }));
  }

  function timelineHtml(events) { return events.map(event => `<div class="timeline-event"><div class="timeline-year">${event.year}</div><article><h2>${event.title}</h2><p>${event.text}</p><a href="#lezione/${event.lesson}">Apri il contesto →</a></article></div>`).join(''); }

  function renderSources(selectedId = '') {
    currentLesson = null;
    const sources = selectedId ? D.sources.filter(source => source.id === selectedId) : D.sources;
    app.innerHTML = `<div class="app-container">${pageHero('Le fonti in dialogo', 'Promesse, autorità e compromessi', 'Una fonte non è una finestra trasparente sul passato: ha un autore, uno scopo, un pubblico e limiti che dobbiamo interrogare.')}
      <div class="sources-grid">${sources.map(source => `<article class="source-lab" id="fonte-${source.id}"><header class="source-head"><p class="overline">${source.type} · ${source.date}</p><h2>${source.title}</h2><p>${source.provenance}</p></header><div class="source-body"><div class="source-text">${source.excerpt.map(quote => `<blockquote>«${quote}»</blockquote>`).join('')}</div><div class="source-analysis"><div class="source-facts"><div class="source-fact"><span>Destinatario</span><p>${source.audience}</p></div><div class="source-fact"><span>Scopo</span><p>${source.purpose}</p></div><div class="source-fact"><span>Limiti</span><p>${source.limits}</p></div></div><div class="source-question"><span class="overline">Domanda di lettura</span>${source.question}</div></div></div></article>`).join('')}</div>
      <section class="apparatus"><p class="overline">Riferimenti verificabili</p><h2>Fonti e repertori</h2><ul><li><a class="text-link" target="_blank" rel="noopener" href="https://www.unesco.at/en/communication/documentary-heritage/memory-of-the-world-in-austria/final-document-of-the-congress-of-vienna-1815">UNESCO Austria: Atto finale del Congresso di Vienna</a></li><li><a class="text-link" target="_blank" rel="noopener" href="https://www.napoleon-series.org/research/government/legislation/c_charter.html">Testo della Carta costituzionale del 1814</a></li><li><a class="text-link" target="_blank" rel="noopener" href="https://www.napoleon-series.org/research/government/diplomatic/c_alliance.html">Testo della Santa Alleanza</a></li><li><a class="text-link" target="_blank" rel="noopener" href="https://www.treccani.it/enciclopedia/il-pensiero-politico-della-restaurazione_%28Storia-della-civilt%C3%A0-europea-a-cura-di-Umberto-Eco%29/">Treccani: il pensiero politico della Restaurazione</a></li></ul></section>
      ${selectedId ? '<p style="margin-top:22px"><a class="button button-ghost" href="#fonti">← Tutte le fonti</a></p>' : ''}</div>`;
  }

  function renderQuiz(reset = false) {
    currentLesson = null;
    if (reset) quizState = { index: 0, answers: [] };
    const question = D.quiz[quizState.index];
    app.innerHTML = `<div class="app-container">${pageHero('Verifica finale', 'Dodici domande, dodici spiegazioni', 'Il quiz non assegna soltanto un punteggio: spiega ogni risposta e indica quali lezioni riprendere.')}
      <div class="quiz-shell" id="quizShell">${question ? quizQuestionHtml(question) : quizResultHtml()}</div></div>`;
    bindQuiz();
  }

  function quizQuestionHtml(question) {
    return `<div class="quiz-progress"><span>Domanda ${quizState.index + 1} di ${D.quiz.length}</span><div class="progress-track"><i style="width:${((quizState.index + 1) / D.quiz.length) * 100}%"></i></div></div><article class="quiz-card"><h2>${question.q}</h2><div class="quiz-options">${question.options.map((option, index) => `<button class="quiz-option" data-answer="${index}"><span>${String.fromCharCode(65 + index)}</span>${option}</button>`).join('')}</div><div id="quizFeedback"></div></article>`;
  }

  function bindQuiz() {
    document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
      if (document.querySelector('.quiz-option.correct,.quiz-option.wrong')) return;
      const question = D.quiz[quizState.index];
      const selected = Number(button.dataset.answer);
      quizState.answers.push({ selected, correct: question.answer, question });
      document.querySelectorAll('[data-answer]').forEach(item => {
        const index = Number(item.dataset.answer);
        if (index === question.answer) item.classList.add('correct');
        else if (index === selected) item.classList.add('wrong');
      });
      document.getElementById('quizFeedback').innerHTML = `<div class="quiz-feedback"><strong>${selected === question.answer ? 'Esatto.' : 'Non è la risposta corretta.'}</strong> ${question.why}</div><button class="button button-ruby quiz-next" id="quizNext">${quizState.index === D.quiz.length - 1 ? 'Mostra il report' : 'Prossima domanda'} →</button>`;
      document.getElementById('quizNext').addEventListener('click', () => { quizState.index += 1; renderQuiz(); });
    }));
    document.getElementById('quizRestart')?.addEventListener('click', () => renderQuiz(true));
  }

  function quizResultHtml() {
    const score = quizState.answers.filter(answer => answer.selected === answer.correct).length;
    const percentage = Math.round(score / D.quiz.length * 100);
    const missedLessons = [...new Set(quizState.answers.filter(a => a.selected !== a.correct).map(a => a.question.lesson))];
    return `<article class="quiz-card"><div class="result-score"><p class="overline">Risultato finale</p><strong>${percentage}%</strong><h2>${score} risposte corrette su ${D.quiz.length}</h2><p>${percentage >= 83 ? 'Hai compreso bene la struttura e le contraddizioni della Restaurazione.' : percentage >= 58 ? 'La struttura generale è chiara, ma alcuni nessi meritano una seconda lettura.' : 'Il report ti indica da dove ripartire: usa gli errori come mappa di studio.'}</p></div>
      ${missedLessons.length ? `<div class="apparatus" style="background:#f1e3c6;color:#211b13"><h2 style="color:#762019">Lezioni da riprendere</h2><div class="chip-list">${missedLessons.map(id => `<a class="info-chip" style="color:#17243a" href="#lezione/${id}">${lessonById(id).title}</a>`).join('')}</div></div>` : ''}
      <div class="result-list">${quizState.answers.map((answer, index) => `<div class="result-item ${answer.selected === answer.correct ? 'good' : 'bad'}"><strong>${index + 1}. ${answer.question.q}</strong><br>${answer.selected === answer.correct ? 'Risposta corretta.' : `Hai scelto: ${answer.question.options[answer.selected]}. Corretta: ${answer.question.options[answer.correct]}.`} ${answer.question.why}</div>`).join('')}</div>
      <button class="button button-ruby" id="quizRestart" style="margin-top:22px">Ricomincia il quiz</button></article>`;
  }

  function openNotes() {
    if (!currentLesson) return;
    notesBox.value = localStorage.getItem(`restNotes:${currentLesson.id}`) || '';
    notesDrawer.hidden = false;
    notesBox.focus();
  }

  function saveNotes() {
    if (!currentLesson) return;
    localStorage.setItem(`restNotes:${currentLesson.id}`, notesBox.value);
    toast('Appunti salvati');
  }

  function exportNotes() {
    if (!currentLesson) return;
    const content = `${D.meta.title}\n${currentLesson.title}\n\n${notesBox.value}`;
    const blob = new Blob([content], {type:'text/plain;charset=utf-8'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `appunti-${currentLesson.id}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function openImage(title, src) {
    modalTitle.textContent = title;
    modalBody.innerHTML = `<img src="${src}" alt="${escapeHtml(title)}">`;
    modal.hidden = false;
    document.getElementById('modalClose').focus();
  }

  function closeModal() { modal.hidden = true; modalBody.innerHTML = ''; }

  function doSearch(query) {
    const needle = normalize(query.trim());
    if (needle.length < 2) { searchResults.innerHTML = ''; return; }
    const results = [];
    D.lessons.forEach(lesson => {
      const hay = normalize([lesson.title, lesson.eyebrow, lesson.lead, ...lesson.sections.flatMap(section => [section.title, ...section.paragraphs]), ...Object.keys(lesson.vocab)].join(' '));
      if (hay.includes(needle)) results.push({title:lesson.title, type:'Lezione', href:`#lezione/${lesson.id}`, text:lesson.eyebrow});
    });
    D.people.forEach(person => { if (normalize(`${person.name} ${person.role} ${person.bio} ${person.idea}`).includes(needle)) results.push({title:person.name,type:'Biografia',href:`#biografia/${person.id}`,text:person.role}); });
    D.sources.forEach(source => { if (normalize(`${source.title} ${source.date} ${source.purpose} ${source.excerpt.join(' ')}`).includes(needle)) results.push({title:source.title,type:'Fonte',href:`#fonti/${source.id}`,text:source.date}); });
    searchResults.innerHTML = results.length ? results.slice(0, 12).map(result => `<a class="search-result" href="${result.href}"><p class="overline">${result.type}</p><h3>${result.title}</h3><p>${result.text}</p></a>`).join('') : '<p>Nessun risultato. Prova una parola più generale.</p>';
  }

  function renderRoute() {
    window.scrollTo(0, 0);
    const [route, id] = hashParts();
    document.getElementById('mainNav')?.classList.remove('open');
    document.getElementById('menuToggle')?.setAttribute('aria-expanded', 'false');
    if (route === 'lezione') renderLesson(id);
    else if (route === 'mappe') renderMaps();
    else if (route === 'biografie') renderPeople();
    else if (route === 'biografia') renderPerson(id);
    else if (route === 'timeline') renderTimeline();
    else if (route === 'fonti') renderSources(id);
    else if (route === 'quiz') renderQuiz(true);
    else renderLessons();
    app.focus({preventScroll:true});
  }

  document.getElementById('menuToggle').addEventListener('click', event => {
    const open = document.getElementById('mainNav').classList.toggle('open');
    event.currentTarget.setAttribute('aria-expanded', String(open));
  });
  document.getElementById('searchToggle').addEventListener('click', () => { searchDrawer.hidden = false; searchInput.focus(); });
  document.getElementById('closeSearch').addEventListener('click', () => { searchDrawer.hidden = true; });
  searchInput.addEventListener('input', event => doSearch(event.target.value));
  searchResults.addEventListener('click', () => { searchDrawer.hidden = true; });
  document.getElementById('closeNotes').addEventListener('click', () => { notesDrawer.hidden = true; });
  document.getElementById('saveNotes').addEventListener('click', saveNotes);
  document.getElementById('exportNotes').addEventListener('click', exportNotes);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { if (!modal.hidden) closeModal(); else if (!notesDrawer.hidden) notesDrawer.hidden = true; else if (!searchDrawer.hidden) searchDrawer.hidden = true; } });
  window.addEventListener('hashchange', renderRoute);
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredInstall = event; document.getElementById('installButton').hidden = false; });
  document.getElementById('installButton').addEventListener('click', async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; document.getElementById('installButton').hidden = true; });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('service-worker.js');
  renderRoute();
})();
