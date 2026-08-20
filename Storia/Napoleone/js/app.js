(() => {
  'use strict';
  const D = window.NAP_DATA;
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
  const briefActivities = {
    'figlio-rivoluzione': ['Napoleone sarebbe stato possibile nell’Antico regime?', 'Individua due condizioni create dalla Rivoluzione e una capacità personale. Spiega perché nessuna delle due categorie basta da sola.', 'Una spiegazione storica collega opportunità strutturali e azione individuale.'],
    'repubblica-uomo-forte': ['Sei un cittadino francese nel 1799', 'Scegli il rischio che temi di più — ritorno monarchico, guerra, disordine sociale o nuova dittatura — e spiega quale potere saresti disposto a cedere per evitarlo.', 'Consenso e autoritarismo possono crescere insieme quando gruppi diversi cercano sicurezza.'],
    'salvare-controllando': ['Continuità, trasformazione, rottura', 'Classifica prefetti, Concordato, Codice civile, censura e legge coloniale. Per ogni scelta precisa: rispetto a quale principio del 1789?', 'Evita una sola etichetta per l’intero regime: istituzioni diverse producono effetti diversi.'],
    'repubblica-incorona': ['Leggi una propaganda', 'Osserva David nel laboratorio delle fonti: chi è al centro, chi guarda, chi benedice? Quale conflitto reale viene reso invisibile?', 'La composizione non fotografa: ordina lo spazio per legittimare una gerarchia.'],
    'liberatore-conquistatore': ['Una conquista, due sguardi', 'Scrivi due righe sulla stessa riforma: prima come funzionario beneficiato dal nuovo Codice, poi come famiglia sottoposta a requisizione e leva.', 'La prospettiva non rende tutti i giudizi equivalenti: obbliga a dichiarare prove e posizione sociale.'],
    'governare-guerra': ['Quanto può espandersi un impero?', 'Costruisci una catena di cinque passaggi usando: blocco, controllo dei porti, occupazione, resistenza, nuove truppe. Dove nasce il circolo vizioso?', 'Una soluzione militare può creare il problema politico che richiede altra guerra.'],
    'caduta-eredita': ['Formula la tua risposta finale', 'Completa: “Napoleone chiuse politicamente…, rese durevole…, diffuse in Europa…, ma al prezzo di…”. Aggiungi una fonte e un controesempio.', 'Una tesi è forte quando include limite, prova e possibile obiezione.']
  };
  const timelineWhy = {
    'Nasce ad Ajaccio':'La formazione di un ufficiale corso rivela il rapporto fra periferia, Stato e nuova élite.',
    'Inizia la Rivoluzione':'Distrugge i vincoli politici e militari che avrebbero reso improbabile quella carriera.',
    "Campagna d'Italia":'Per la prima volta il generale tratta, governa e comunica quasi da attore sovrano.',
    "Spedizione d'Egitto":'La guerra oltre l’Europa accresce il prestigio scientifico ma mostra il limite navale francese.',
    '18 brumaio':'La crisi repubblicana viene risolta concentrando il potere senza abolire il nome di Repubblica.',
    'Concordato':'Stato e Chiesa passano dallo scontro rivoluzionario a una pacificazione controllata.',
    'Schiavitù ristabilita':'Rende visibile il confine coloniale e razziale dell’universalismo rivoluzionario.',
    'Codice e Impero':'La stabilizzazione giuridica e la monarchia ereditaria mostrano nello stesso anno continuità e rottura.',
    'Austerlitz e Trafalgar':'Il contrasto fra egemonia terrestre e inferiorità navale orienta tutta la strategia successiva.',
    'Blocco continentale':'L’impossibilità di vincere sul mare trasforma commercio e occupazione in un unico sistema.',
    'Guerra di Spagna':'La resistenza popolare e costituzionale impedisce di identificare conquista e liberazione.',
    'Campagna di Russia':'La sconfitta spezza l’invincibilità e permette la ricostruzione della coalizione.',
    'Lipsia':'Il sistema degli alleati francesi si rovescia in una superiorità europea contro la Francia.',
    'Abdicazione, ritorno, Waterloo':'La prima restaurazione non chiude il conflitto; la seconda sconfitta rende irreversibile il 1815.',
    "Morte a Sant'Elena":'La memoria continua a produrre effetti politici quando il regime non esiste più.'
  };

  const escapeHtml = value => String(value).replace(/[&<>"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  const normalize = value => String(value).toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const lessonById = id => D.lessons.find(lesson => lesson.id === id);
  const personById = id => D.people.find(person => person.id === id);
  const hashParts = () => (location.hash.slice(1) || 'lezioni').split('/');

  function completedLessons() {
    try { return JSON.parse(localStorage.getItem('napCompleted') || '[]'); } catch (_) { return []; }
  }

  function setCompleted(id, value) {
    const done = new Set(completedLessons());
    value ? done.add(id) : done.delete(id);
    localStorage.setItem('napCompleted', JSON.stringify([...done]));
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
      ${pageHero('Indice del percorso', 'Sette passaggi per interrogare Napoleone', 'Il filo segue una contraddizione: l’uguaglianza civile nata dalla Rivoluzione viene stabilizzata e diffusa mentre libertà politica, cittadinanza e autonomia dei popoli si restringono.')}
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
    document.title = `${lesson.title} — Napoleone`;
    const index = D.lessons.indexOf(lesson);
    const done = completedLessons().includes(lesson.id);
    const sourceLinks = D.sources.filter(source => source.lesson === lesson.id);
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
          <section class="apparatus lesson-activity"><p class="overline">Attività breve</p><h2>${briefActivities[lesson.id][0]}</h2><p>${briefActivities[lesson.id][1]}</p><details><summary>Apri una traccia di controllo</summary><p>${briefActivities[lesson.id][2]}</p></details></section>
          ${sourceLinks.length ? `<section class="apparatus"><p class="overline">La fonte in dialogo</p><h2>Dal testo al problema storico</h2>${sourceLinks.map(source => `<p><a class="button button-gold" href="#fonti/${source.id}">${source.title} →</a></p>`).join('')}</section>` : ''}
          ${lesson.id === 'caduta-eredita' ? `<section class="apparatus bridge-next"><p class="overline">La domanda successiva</p><h2>Si può restaurare un ordine politico senza poter restaurare il mondo che lo rendeva possibile?</h2><p><a class="button button-gold" href="../Restaurazione/">Continua con La Restaurazione →</a></p></section>` : ''}
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
      ${pageHero('Mappe e schemi', 'Vedere un sistema che cambia', 'Tre carte originali distinguono espansione, dipendenza e contrazione: non decorazioni, ma strumenti per formulare spiegazioni.')}
      <div class="map-grid">
        ${mapCard('1. Europa, 1811: i cerchi del dominio', 'Il colore distingue territori annessi, Stati clienti e alleati costretti. La legenda impedisce di confondere uniformità grafica e uniformità politica.', mapImage('assets/img/maps/europa-1811.svg','Schema dell’Europa napoleonica nel 1811','Europa napoleonica, 1811'), true)}
        ${mapCard('2. Espansione e contrazione', 'La sequenza dal 1804 al 1814 rende visibile quando la crescita diventa sovraestensione. Seleziona un anno e formula un’ipotesi causale.', mapImage('assets/img/maps/espansione-contrazione.svg','Schema dell’espansione e contrazione napoleonica','Espansione e contrazione') + expansionControls(), true)}
        ${mapCard('3. Russia 1812: spazio e logistica', 'La carta segue l’andata e il ritorno e collega distanze, rifornimenti e perdita di uomini: il freddo compare come fattore, non come spiegazione unica.', mapImage('assets/img/maps/russia-1812.svg','Schema della campagna di Russia del 1812','Russia, 1812'), true)}
        ${mapCard('4. La contraddizione centrale', 'Le stesse istituzioni possono emancipare alcuni gruppi e rafforzare il controllo su altri.', `<table class="compare-table"><thead><tr><th>Strumento</th><th>Promessa</th><th>Costo o limite</th></tr></thead><tbody><tr><td>Codice civile</td><td>uguaglianza giuridica e proprietà</td><td>gerarchia familiare e coloniale</td></tr><tr><td>Prefetti</td><td>uniformità ed efficienza</td><td>accentramento</td></tr><tr><td>Coscrizione</td><td>cittadino-soldato e carriera</td><td>leva diseguale e guerra continua</td></tr><tr><td>Stati clienti</td><td>abolizione di privilegi</td><td>tributi e subordinazione</td></tr></tbody></table>`, true)}
      </div>
    </div>`;
    bindMapButtons();
  }

  function mapCard(title, text, body, wide = false) { return `<section class="map-card ${wide ? 'wide' : ''}"><h2>${title}</h2><p>${text}</p>${body}</section>`; }
  function mapImage(src, alt, title) { return `<div class="map-image-wrap"><button class="map-open" data-image="${src}" data-title="${title}" style="all:unset;display:block;cursor:zoom-in;width:100%"><img src="${src}" alt="${alt}" loading="lazy"></button></div><div class="map-toolbar"><span>Seleziona la carta per ingrandirla</span><button class="button button-ghost map-open" data-image="${src}" data-title="${title}">Ingrandisci</button></div>`; }
  function expansionControls() { return `<div class="expansion-lab"><div>${['1804','1805','1807','1810/11','1812','1813','1814'].map(year => `<button data-expansion="${year}">${year}</button>`).join('')}</div><div class="expansion-meter"><i id="expansionMeter"></i></div><p id="expansionText">Seleziona un anno.</p></div>`; }

  function bindMapButtons() {
    document.querySelectorAll('.map-open').forEach(button => button.addEventListener('click', () => openImage(button.dataset.title, button.dataset.image)));
    const stages = {
      '1804':[30,'Impero proclamato: il centro francese è consolidato, il sistema europeo è ancora in costruzione.'],
      '1805':[46,'Austerlitz amplia l’egemonia terrestre; Trafalgar impedisce però di colpire direttamente la Gran Bretagna.'],
      '1807':[66,'Tilsit porta il sistema al Baltico e moltiplica Stati clienti e alleati sotto pressione.'],
      '1810/11':[94,'Massima estensione: più risorse, ma anche più coste, frontiere, alleati e popolazioni da controllare.'],
      '1812':[78,'La campagna di Russia trasforma la sovraestensione in crisi militare e logistica.'],
      '1813':[48,'Lipsia rompe la rete degli alleati e riporta la guerra verso il Reno.'],
      '1814':[12,'Gli alleati entrano in Francia: l’Impero territoriale crolla, non tutte le sue istituzioni.']
    };
    document.querySelectorAll('[data-expansion]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-expansion]').forEach(item => item.classList.toggle('active', item === button));
      document.getElementById('expansionMeter').style.width = `${stages[button.dataset.expansion][0]}%`;
      document.getElementById('expansionText').textContent = stages[button.dataset.expansion][1];
    }));
  }

  function renderWorkshop() {
    currentLesson = null;
    app.innerHTML = `<div class="app-container">${pageHero('Laboratorio attivo', 'Costruire una tesi, non indovinare un’etichetta', 'Quattro attività chiedono di classificare prove, confrontare prospettive e rendere esplicito il criterio del giudizio.')}
      <div class="activity-grid">
        <section class="activity-card"><p class="overline">Attività 1 · continuità o rottura?</p><h2>Classifica la prova</h2><p>Per ogni elemento scegli la lettura più convincente. Il feedback non premia una formula: mostra che la stessa prova cambia significato secondo il criterio.</p><div id="classifyLab"></div></section>
        <section class="activity-card"><p class="overline">Attività 2 · prospettive</p><h2>Chi vede un liberatore?</h2><label for="viewpoint">Scegli un osservatore nel 1808</label><select id="viewpoint"><option value="owner">proprietario renano</option><option value="spanish">contadino spagnolo</option><option value="woman">donna sposata francese</option><option value="official">funzionario italiano</option></select><div class="activity-output" id="viewpointOutput"></div></section>
        <section class="activity-card"><p class="overline">Attività 3 · costo imperiale</p><h2>Leggi una decisione</h2><p>Il blocco funziona poco in un porto alleato. Quale scelta rende coerente il sistema?</p><div class="choice-row"><button data-cost="tollera">Tollerare il commercio</button><button data-cost="occupa">Occupare e controllare</button></div><div class="activity-output" id="costOutput">Scegli e osserva la catena di conseguenze.</div></section>
        <section class="activity-card"><p class="overline">Attività 4 · argomentazione</p><h2>Generatore di tesi</h2><label for="claim">Tesi di partenza</label><select id="claim"><option value="continua">Napoleone continua la Rivoluzione</option><option value="tradisce">Napoleone tradisce la Rivoluzione</option><option value="trasforma">Napoleone trasforma la Rivoluzione</option></select><label for="evidence">Prova principale</label><select id="evidence"><option>Codice civile</option><option>Costituzione dell’anno VIII</option><option>Ristabilimento della schiavitù</option><option>Riforme negli Stati clienti</option><option>Coscrizione e guerra</option></select><button class="button button-gold" id="buildThesis">Formula una tesi sfumata</button><div class="activity-output" id="thesisOutput"></div></section>
      </div></div>`;
    bindWorkshop();
  }

  function bindWorkshop() {
    const proofs = [
      ['Abolizione dei privilegi civili','continuità'], ['Censura della stampa','rottura'], ['Plebisciti','ambivalenza'], ['Carriere aperte ai talenti','continuità'], ['Schiavitù coloniale','rottura']
    ];
    const lab = document.getElementById('classifyLab');
    lab.innerHTML = proofs.map((p,i) => `<div class="classify-row"><strong>${p[0]}</strong><div><button data-proof="${i}" data-value="continuità">continuità</button><button data-proof="${i}" data-value="rottura">rottura</button><button data-proof="${i}" data-value="ambivalenza">ambivalenza</button></div><small id="proof-${i}"></small></div>`).join('');
    lab.querySelectorAll('[data-proof]').forEach(button => button.addEventListener('click', () => {
      const [label, expected] = proofs[Number(button.dataset.proof)];
      document.getElementById(`proof-${button.dataset.proof}`).textContent = button.dataset.value === expected ? `Lettura ben fondata: ${label.toLowerCase()} sostiene “${expected}”.` : `Difendibile solo precisando il criterio; la lettura-base è “${expected}”.`;
    }));
    const perspectives = {
      owner:'La fine dei privilegi e la proprietà protetta possono apparire liberazione; imposte e coscrizione ne mostrano il costo.',
      spanish:'Requisizioni, imposizione dinastica e repressione fanno apparire la riforma come conquista straniera.',
      woman:'La certezza del diritto convive con un Codice che rafforza l’autorità del marito e limita l’autonomia giuridica.',
      official:'Un’amministrazione uniforme apre carriere e rende lo Stato efficace, ma dipende dal centro francese.'
    };
    const viewpoint = document.getElementById('viewpoint');
    const showView = () => document.getElementById('viewpointOutput').textContent = perspectives[viewpoint.value];
    viewpoint.addEventListener('change', showView); showView();
    document.querySelectorAll('[data-cost]').forEach(button => button.addEventListener('click', () => {
      document.getElementById('costOutput').textContent = button.dataset.cost === 'occupa' ? 'Coerenza economica → occupazione → nuove truppe e tasse → resistenza → altra guerra. Il sistema si rafforza e si consuma nello stesso gesto.' : 'La tolleranza riduce il conflitto locale, ma apre una falla nel blocco e indebolisce la strategia contro la Gran Bretagna.';
    }));
    document.getElementById('buildThesis').addEventListener('click', () => {
      const claim = document.getElementById('claim').value;
      const evidence = document.getElementById('evidence').value;
      const verbs = {continua:'continua alcune conquiste',tradisce:'contraddice promesse decisive',trasforma:'seleziona e trasforma l’eredità'};
      document.getElementById('thesisOutput').textContent = `Napoleone ${verbs[claim]} della Rivoluzione: lo mostra ${evidence}. Tuttavia il giudizio cambia se consideriamo gruppi sociali e territori esclusi; perciò la tesi va limitata nello spazio, nel tempo e nel criterio usato.`;
    });
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
      <div class="timeline-controls"><button class="active" data-period="all">Tutto</button><button data-period="1789">Ascesa</button><button data-period="1804">Consolato e Impero</button><button data-period="1812">Crisi e caduta</button><button data-period="1820">Memoria</button></div>
      <div class="timeline-list" id="timelineList">${timelineHtml(D.timeline)}</div></div>`;
    document.querySelectorAll('[data-period]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-period]').forEach(item => item.classList.toggle('active', item === button));
      const period = button.dataset.period;
      const filtered = period === 'all' ? D.timeline : D.timeline.filter(event => {
        const year = Number((event.year.match(/\d{4}/) || ['0'])[0]);
        if (period === '1789') return year < 1799;
        if (period === '1804') return year >= 1799 && year < 1812;
        if (period === '1812') return year >= 1812 && year < 1820;
        return year >= 1820;
      });
      document.getElementById('timelineList').innerHTML = timelineHtml(filtered);
    }));
  }

  function timelineHtml(events) { return events.map(event => `<div class="timeline-event"><div class="timeline-year">${event.year}</div><article><h2>${event.title}</h2><p><strong>Contesto e cambiamento.</strong> ${event.text}</p><p><strong>Perché è uno snodo.</strong> ${timelineWhy[event.title]}</p><a href="#lezione/${event.lesson}">Apri il contesto →</a></article></div>`).join(''); }

  function renderSources(selectedId = '') {
    currentLesson = null;
    const sources = selectedId ? D.sources.filter(source => source.id === selectedId) : D.sources;
    app.innerHTML = `<div class="app-container">${pageHero('Le fonti in dialogo', 'La legge, la voce, l’immagine', 'Ogni fonte è presentata con provenienza, destinatario, scopo e limiti. I brani in traduzione italiana sono brevi estratti didattici verificabili nel testo collegato.')}
      <div class="sources-grid">${sources.map(source => `<article class="source-lab" id="fonte-${source.id}"><header class="source-head"><p class="overline">${source.type} · ${source.date}</p><h2>${source.title}</h2><p>${source.provenance}</p></header>${source.image ? `<button class="source-image map-open" data-image="${source.image}" data-title="${source.title}"><img src="${source.image}" alt="${source.imageAlt}" loading="lazy"><span>Ingrandisci e osserva i dettagli</span></button>` : ''}<div class="source-body"><div class="source-text">${source.excerpt.map(quote => `<blockquote>«${quote}»</blockquote>`).join('')}<p><a class="text-link" href="${source.url}" target="_blank" rel="noopener">Apri il documento o la scheda istituzionale ↗</a></p></div><div class="source-analysis"><div class="source-facts"><div class="source-fact"><span>Autore / produttore</span><p>${source.author}</p></div><div class="source-fact"><span>Contesto</span><p>${source.context}</p></div><div class="source-fact"><span>Destinatario</span><p>${source.audience}</p></div><div class="source-fact"><span>Scopo</span><p>${source.purpose}</p></div><div class="source-fact"><span>Limiti</span><p>${source.limits}</p></div></div><div class="source-question"><span class="overline">Domanda di lettura</span>${source.question}</div></div></div></article>`).join('')}</div>
      <section class="apparatus"><p class="overline">Metodo</p><h2>Prima di usare una fonte</h2><ul><li>Distingui ciò che il documento dice da ciò che sappiamo sul suo contesto.</li><li>Chiedi chi parla, a chi e per ottenere quale effetto.</li><li>Confronta norma e pratica: una costituzione descrive un assetto giuridico, non automaticamente il suo funzionamento.</li><li>Per un’immagine analizza composizione, data di esecuzione e destinazione, non soltanto il soggetto.</li></ul></section>
      <section class="apparatus"><p class="overline">Questione storiografica</p><h2>Tre scale, tre domande diverse</h2><div class="vocab-grid"><article class="vocab-item"><h3>Stato e notabili</h3><p>Gli studi sull’amministrazione chiedono come il regime abbia integrato proprietà, competenze e carriere dentro istituzioni durevoli.</p></article><article class="vocab-item"><h3>Impero negoziato</h3><p>La storia comparata degli Stati clienti mostra che il dominio non fu uniforme: riforme, collaborazione ed estrazione variarono secondo i territori.</p></article><article class="vocab-item"><h3>Potere e memoria</h3><p>La storia politica e culturale osserva come guerra, consenso, coercizione e autorappresentazione abbiano costruito il capo e poi il mito.</p></article><article class="vocab-item"><h3>Come usarle</h3><p>Non sono verdetti alternativi: cambiano la scala dell’indagine. Una tesi deve dichiarare quale problema sta spiegando.</p></article></div><p style="margin-bottom:0"><a class="text-link" href="ATTRIBUTIONS.md" target="_blank">Bibliografia e risorse accademiche complete ↗</a></p></section>
      ${selectedId ? '<p style="margin-top:22px"><a class="button button-ghost" href="#fonti">← Tutte le fonti</a></p>' : ''}</div>`;
    bindMapButtons();
  }

  function renderQuiz(reset = false) {
    currentLesson = null;
    if (reset) quizState = { index: 0, answers: [] };
    const question = D.quiz[quizState.index];
    app.innerHTML = `<div class="app-container">${pageHero('Verifica finale', 'Quattordici domande, dodici spiegazioni', 'Il quiz non assegna soltanto un punteggio: spiega ogni risposta e indica quali lezioni riprendere.')}
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
      document.getElementById('quizFeedback').innerHTML = `<div class="quiz-feedback"><strong>${selected === question.answer ? 'Esatto.' : 'Errore concettuale da correggere.'}</strong> ${question.why} ${selected !== question.answer ? `<a class="text-link" href="#lezione/${question.lesson}">Riprendi la lezione collegata ↗</a>` : ''}</div><button class="button button-ruby quiz-next" id="quizNext">${quizState.index === D.quiz.length - 1 ? 'Mostra il report' : 'Prossima domanda'} →</button>`;
      document.getElementById('quizNext').addEventListener('click', () => { quizState.index += 1; renderQuiz(); });
    }));
    document.getElementById('quizRestart')?.addEventListener('click', () => renderQuiz(true));
  }

  function quizResultHtml() {
    const score = quizState.answers.filter(answer => answer.selected === answer.correct).length;
    const percentage = Math.round(score / D.quiz.length * 100);
    const missedLessons = [...new Set(quizState.answers.filter(a => a.selected !== a.correct).map(a => a.question.lesson))];
    const consolidatedLessons = [...new Set(quizState.answers.filter(a => a.selected === a.correct).map(a => a.question.lesson))].filter(id => !missedLessons.includes(id));
    return `<article class="quiz-card"><div class="result-score"><p class="overline">Risultato finale</p><strong>${percentage}%</strong><h2>${score} risposte corrette su ${D.quiz.length}</h2><p>${percentage >= 83 ? 'Hai compreso bene la struttura e le contraddizioni del sistema napoleonico.' : percentage >= 58 ? 'La struttura generale è chiara, ma alcuni nessi meritano una seconda lettura.' : 'Il report ti indica da dove ripartire: usa gli errori come mappa di studio.'}</p></div>
      ${missedLessons.length ? `<div class="apparatus" style="background:#f1e3c6;color:#211b13"><h2 style="color:#762019">Lezioni da riprendere</h2><div class="chip-list">${missedLessons.map(id => `<a class="info-chip" style="color:#17243a" href="#lezione/${id}">${lessonById(id).title}</a>`).join('')}</div></div>` : ''}
      ${consolidatedLessons.length ? `<div class="apparatus"><h2>Concetti consolidati</h2><div class="chip-list">${consolidatedLessons.map(id => `<span class="info-chip">${lessonById(id).title}</span>`).join('')}</div></div>` : ''}
      <div class="result-list">${quizState.answers.map((answer, index) => `<div class="result-item ${answer.selected === answer.correct ? 'good' : 'bad'}"><strong>${index + 1}. ${answer.question.q}</strong><br>${answer.selected === answer.correct ? 'Risposta corretta.' : `Hai scelto: ${answer.question.options[answer.selected]}. Corretta: ${answer.question.options[answer.correct]}.`} ${answer.question.why}</div>`).join('')}</div>
      <button class="button button-ruby" id="quizRestart" style="margin-top:22px">Ricomincia il quiz</button></article>`;
  }

  function openNotes() {
    if (!currentLesson) return;
    notesBox.value = localStorage.getItem(`napNotes:${currentLesson.id}`) || '';
    notesDrawer.hidden = false;
    notesBox.focus();
  }

  function saveNotes() {
    if (!currentLesson) return;
    localStorage.setItem(`napNotes:${currentLesson.id}`, notesBox.value);
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
    else if (route === 'laboratorio') renderWorkshop();
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
