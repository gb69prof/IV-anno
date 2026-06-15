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

const LESSON_GUIDES = {
  premessa: {
    introPrefix: 'La Rivoluzione francese Parte I — Premessa Perché la Francia arriva alla Rivoluzione ',
    sections: [
      { title: 'Perché non nasce all’improvviso', from: 0, to: 0 },
      { title: 'Una società divisa in ordini', from: 1, to: 3 },
      { title: 'Crisi sociale, economica e politica', from: 4, to: 6 },
      { title: 'Il nodo degli Stati generali', from: 7, to: 8 }
    ],
    paragraphLinks: {
      0: [{ label: 'Forme di governo', href: '#approfondimento-forme-governo' }],
      1: [{ label: 'Tre Stati e Stati Generali', href: '#approfondimento-tre-stati' }],
      2: [{ label: 'Sieyès', href: '#bio-sieyes' }, { label: 'Che cos’è il Terzo Stato?', href: '#approfondimento-sieyes' }],
      6: [{ label: 'Luigi XVI', href: '#bio-luigi-xvi' }],
      7: [{ label: 'Stati generali', href: '#approfondimento-tre-stati' }, { label: 'Forme di governo', href: '#approfondimento-forme-governo' }]
    },
    resources: [
      { type: 'Approfondimento', label: 'Stati generali', href: '#approfondimento-tre-stati' },
      { type: 'Approfondimento', label: 'Forme di governo', href: '#approfondimento-forme-governo' },
      { type: 'Approfondimento', label: 'Sieyès: Terzo Stato', href: '#approfondimento-sieyes' },
      { type: 'Biografia', label: 'Luigi XVI', href: '#bio-luigi-xvi' },
      { type: 'Biografia', label: 'Sieyès', href: '#bio-sieyes' }
    ],
    vocab: [
      { term: 'Antico regime', definition: 'Sistema politico e sociale fondato su monarchia assoluta, ordini e privilegi.' },
      { term: 'Privilegio', definition: 'Vantaggio riconosciuto dalla legge a un gruppo, non a tutti i cittadini.' },
      { term: 'Terzo Stato', definition: 'La parte della società che non apparteneva né al clero né alla nobiltà.' },
      { term: 'Voto per testa', definition: 'Sistema in cui ogni deputato vota singolarmente, invece di votare per ordine.' }
    ],
    quiz: [
      {
        q: 'Qual è il problema centrale della Francia prima del 1789?',
        a: ['La mancanza di esercito', 'Una società nuova chiusa in istituzioni vecchie', 'La fine improvvisa della monarchia'],
        ok: 1,
        recovery: 'Ripassa il rapporto tra Francia ufficiale e Francia reale: economia, borghesia e contadini cambiano, ma le istituzioni restano fondate sugli ordini.'
      },
      {
        q: 'Perché il Terzo Stato chiede il voto per testa?',
        a: ['Per far valere il proprio peso numerico', 'Per dare più potere al re', 'Per abolire subito la Chiesa'],
        ok: 0,
        recovery: 'Il voto per ordine favoriva clero e nobiltà. Il voto per testa avrebbe contato ogni deputato e reso più forte il Terzo Stato.'
      },
      {
        q: 'Quale approfondimento aiuta a capire la convocazione degli Stati generali?',
        a: ['Il Terrore', 'Tre Stati e Stati Generali', 'I sanculotti'],
        ok: 1,
        recovery: 'Riapri la scheda “Tre Stati e Stati Generali”: spiega ordini, rappresentanza, quaderni delle lamentele e sistema di voto.'
      }
    ]
  },
  '1789': {
    introPrefix: 'La Rivoluzione francese Parte II — Il 1789 e la distruzione dell’Antico regime ',
    sections: [
      { title: 'Dagli Stati generali all’Assemblea nazionale', from: 0, to: 2 },
      { title: 'Parigi entra nella Rivoluzione', from: 3, to: 4 },
      { title: 'La rivolta nelle campagne', from: 5, to: 6 },
      { title: 'Diritti e fine dei privilegi', from: 7, to: 9 }
    ],
    paragraphLinks: {
      0: [{ label: 'Stati generali', href: '#approfondimento-tre-stati' }, { label: 'Luigi XVI', href: '#bio-luigi-xvi' }],
      2: [{ label: 'Sieyès', href: '#bio-sieyes' }],
      7: [{ label: 'Dichiarazione dei diritti', href: '#approfondimento-diritti' }, { label: 'Diritti e schiavitù', href: '#approfondimento-schiavitu' }],
      9: [{ label: 'Forme di governo', href: '#approfondimento-forme-governo' }]
    },
    resources: [
      { type: 'Approfondimento', label: 'Tre Stati e Stati Generali', href: '#approfondimento-tre-stati' },
      { type: 'Approfondimento', label: 'Diritti dell’uomo e del cittadino', href: '#approfondimento-diritti' },
      { type: 'Approfondimento', label: 'Diritti, cittadinanza e schiavitù', href: '#approfondimento-schiavitu' },
      { type: 'Biografia', label: 'Sieyès', href: '#bio-sieyes' },
      { type: 'Biografia', label: 'La Fayette', href: '#bio-la-fayette' }
    ],
    vocab: [
      { term: 'Assemblea nazionale', definition: 'Assemblea con cui il Terzo Stato si presenta come rappresentante della nazione.' },
      { term: 'Costituzione', definition: 'Legge fondamentale che organizza poteri e diritti di uno Stato.' },
      { term: 'Grande Paura', definition: 'Rivolta contadina dell’estate 1789 contro diritti feudali e privilegi signorili.' },
      { term: 'Dichiarazione dei diritti', definition: 'Documento del 26 agosto 1789 che proclama libertà, uguaglianza giuridica e sovranità nazionale.' }
    ],
    quiz: [
      {
        q: 'Che cosa rende rivoluzionario il Giuramento della Pallacorda?',
        a: ['Il Terzo Stato impone una Costituzione come obiettivo politico', 'Il re abolisce spontaneamente i privilegi', 'La Francia dichiara guerra all’Austria'],
        ok: 0,
        recovery: 'Il punto chiave è il passaggio da richiesta di riforme a sovranità nazionale: i deputati non vogliono separarsi prima della Costituzione.'
      },
      {
        q: 'Perché la Bastiglia è importante anche se aveva pochi prigionieri?',
        a: ['Era il simbolo dell’assolutismo', 'Era la sede dei Girondini', 'Era il palazzo del Terzo Stato'],
        ok: 0,
        recovery: 'La Bastiglia conta come simbolo politico: rappresentava l’arbitrio del potere monarchico.'
      },
      {
        q: 'Quale documento esprime i principi nuovi del 1789?',
        a: ['Costituzione civile del clero', 'Dichiarazione dei diritti dell’uomo e del cittadino', 'Costituzione del 1793'],
        ok: 1,
        recovery: 'Ripassa la Dichiarazione del 26 agosto 1789: libertà, uguaglianza davanti alla legge, proprietà, sovranità nazionale.'
      }
    ]
  },
  monarchia: {
    introPrefix: 'La Rivoluzione francese Parte III — La monarchia costituzionale: il compromesso che fallisce ',
    sections: [
      { title: 'Il compromesso costituzionale', from: 0, to: 3 },
      { title: 'Riforme e fratture religiose', from: 4, to: 5 },
      { title: 'Varennes e la crisi della fiducia', from: 6, to: 8 },
      { title: 'Guerra e sospetto politico', from: 9, to: 11 }
    ],
    paragraphLinks: {
      0: [{ label: 'Forme di governo', href: '#approfondimento-forme-governo' }],
      1: [{ label: 'Luigi XVI', href: '#bio-luigi-xvi' }, { label: 'La Fayette', href: '#bio-la-fayette' }],
      3: [{ label: 'Pensiero liberale', href: '#approfondimento-liberalismo' }],
      8: [{ label: 'Luigi XVI', href: '#bio-luigi-xvi' }, { label: 'Maria Antonietta', href: '#bio-maria-antonietta' }],
      10: [{ label: 'Girondini e Giacobini', href: '#approfondimento-girondini-giacobini' }, { label: 'Robespierre', href: '#bio-robespierre' }]
    },
    resources: [
      { type: 'Approfondimento', label: 'Forme di governo', href: '#approfondimento-forme-governo' },
      { type: 'Approfondimento', label: 'Pensiero liberale', href: '#approfondimento-liberalismo' },
      { type: 'Approfondimento', label: 'Girondini e Giacobini', href: '#approfondimento-girondini-giacobini' },
      { type: 'Biografia', label: 'Luigi XVI', href: '#bio-luigi-xvi' },
      { type: 'Biografia', label: 'La Fayette', href: '#bio-la-fayette' },
      { type: 'Biografia', label: 'Robespierre', href: '#bio-robespierre' }
    ],
    vocab: [
      { term: 'Monarchia costituzionale', definition: 'Forma di governo in cui il re resta, ma il suo potere è limitato dalla Costituzione.' },
      { term: 'Suffragio censitario', definition: 'Diritto di voto riservato a chi possiede un certo livello di ricchezza o paga determinate imposte.' },
      { term: 'Costituzione civile del clero', definition: 'Riforma che sottopone la Chiesa francese allo Stato rivoluzionario.' },
      { term: 'Varennes', definition: 'Luogo in cui Luigi XVI viene fermato durante la fuga del 1791.' }
    ],
    quiz: [
      {
        q: 'Che cosa cerca di fare la monarchia costituzionale?',
        a: ['Restaurare l’Antico regime', 'Unire monarchia e sovranità nazionale', 'Abolire ogni assemblea'],
        ok: 1,
        recovery: 'La lezione mostra un compromesso: conservare il re, ma limitarlo con leggi e assemblea rappresentativa.'
      },
      {
        q: 'Che cosa significa suffragio censitario?',
        a: ['Voto riservato a chi possiede un certo censo', 'Voto universale maschile', 'Voto riservato ai nobili'],
        ok: 0,
        recovery: 'Il censo è la ricchezza. Nel 1791 votano solo i cittadini attivi, cioè chi paga abbastanza tasse.'
      },
      {
        q: 'Perché Varennes spezza il compromesso?',
        a: ['Fa apparire il re come nemico della Rivoluzione', 'Abolisce la Costituzione del 1793', 'Ferma la guerra esterna'],
        ok: 0,
        recovery: 'Dopo la fuga, molti francesi non vedono più Luigi XVI come garante della Costituzione, ma come possibile traditore.'
      }
    ]
  },
  repubblica: {
    introPrefix: 'La Rivoluzione francese Parte IV — La Repubblica: guerra, democrazia radicale e Terrore ',
    sections: [
      { title: 'Caduta della monarchia e nascita della Repubblica', from: 0, to: 2 },
      { title: 'Gruppi politici e processo al re', from: 3, to: 4 },
      { title: 'Guerra, Vandea e poteri eccezionali', from: 5, to: 8 },
      { title: 'Il Terrore e il 9 termidoro', from: 9, to: 11 }
    ],
    paragraphLinks: {
      3: [{ label: 'Girondini e Giacobini', href: '#approfondimento-girondini-giacobini' }, { label: 'I sanculotti', href: '#approfondimento-sanculotti' }, { label: 'Robespierre', href: '#bio-robespierre' }],
      4: [{ label: 'Luigi XVI', href: '#bio-luigi-xvi' }, { label: 'Maria Antonietta', href: '#bio-maria-antonietta' }],
      6: [{ label: 'I club politici', href: '#approfondimento-club' }, { label: 'Madame Roland', href: '#bio-roland' }],
      7: [{ label: 'Il Terrore', href: '#approfondimento-terrore' }, { label: 'Danton', href: '#bio-danton' }, { label: 'Marat', href: '#bio-marat' }],
      10: [{ label: 'Robespierre', href: '#bio-robespierre' }, { label: 'Le tricoteuses', href: '#bio-tricoteuses' }]
    },
    resources: [
      { type: 'Approfondimento', label: 'Girondini e Giacobini', href: '#approfondimento-girondini-giacobini' },
      { type: 'Approfondimento', label: 'I club politici', href: '#approfondimento-club' },
      { type: 'Approfondimento', label: 'I sanculotti', href: '#approfondimento-sanculotti' },
      { type: 'Approfondimento', label: 'Il Terrore', href: '#approfondimento-terrore' },
      { type: 'Biografia', label: 'Robespierre', href: '#bio-robespierre' },
      { type: 'Biografia', label: 'Danton', href: '#bio-danton' },
      { type: 'Biografia', label: 'Marat', href: '#bio-marat' },
      { type: 'Biografia', label: 'Olympe de Gouges', href: '#bio-olympe' }
    ],
    vocab: [
      { term: 'Convenzione nazionale', definition: 'Assemblea eletta dopo la caduta della monarchia, protagonista della fase repubblicana.' },
      { term: 'Sanculotti', definition: 'Ceti popolari urbani radicali, sensibili a pane, prezzi e giustizia sociale.' },
      { term: 'Comitato di salute pubblica', definition: 'Organo con poteri eccezionali creato per difendere la Repubblica.' },
      { term: 'Terrore', definition: 'Governo d’emergenza basato su repressione, tribunali rivoluzionari e sospetto politico.' }
    ],
    quiz: [
      {
        q: 'Quando nasce la Repubblica?',
        a: ['21 settembre 1792', '14 luglio 1789', '9 termidoro 1794'],
        ok: 0,
        recovery: 'La Repubblica nasce dopo la caduta della monarchia: il 21 settembre 1792 la Convenzione abolisce la monarchia.'
      },
      {
        q: 'Chi sono i Montagnardi/Giacobini nella lezione?',
        a: ['I più radicali, vicini ai sanculotti', 'I difensori del re assoluto', 'I nobili emigrati'],
        ok: 0,
        recovery: 'Confronta la scheda su Girondini e Giacobini: i Giacobini sono più radicali e si appoggiano alla pressione popolare.'
      },
      {
        q: 'Qual è il problema politico del Terrore?',
        a: ['Difendere la libertà sospendendo la libertà', 'Rendere più forte la monarchia costituzionale', 'Eliminare ogni guerra esterna'],
        ok: 0,
        recovery: 'Il nucleo della lezione è il paradosso: la Repubblica usa strumenti autoritari per difendersi dai nemici interni ed esterni.'
      }
    ]
  }
};

const BIO_RELATIONS = {
  'luigi-xvi': [{ label: 'Premessa', href: '#lezione-premessa' }, { label: 'Monarchia costituzionale', href: '#lezione-monarchia' }, { label: 'La Repubblica', href: '#lezione-repubblica' }],
  'maria-antonietta': [{ label: 'Monarchia costituzionale', href: '#lezione-monarchia' }, { label: 'La Repubblica', href: '#lezione-repubblica' }],
  sieyes: [{ label: 'Premessa', href: '#lezione-premessa' }, { label: 'Il 1789', href: '#lezione-1789' }, { label: 'Che cos’è il Terzo Stato?', href: '#approfondimento-sieyes' }],
  'la-fayette': [{ label: 'Il 1789', href: '#lezione-1789' }, { label: 'Monarchia costituzionale', href: '#lezione-monarchia' }],
  robespierre: [{ label: 'Monarchia costituzionale', href: '#lezione-monarchia' }, { label: 'La Repubblica', href: '#lezione-repubblica' }, { label: 'Il Terrore', href: '#approfondimento-terrore' }],
  danton: [{ label: 'La Repubblica', href: '#lezione-repubblica' }, { label: 'I club politici', href: '#approfondimento-club' }],
  marat: [{ label: 'La Repubblica', href: '#lezione-repubblica' }, { label: 'I sanculotti', href: '#approfondimento-sanculotti' }],
  olympe: [{ label: 'Diritti dell’uomo e del cittadino', href: '#approfondimento-diritti' }, { label: 'Diritti, cittadinanza e schiavitù', href: '#approfondimento-schiavitu' }],
  charlotte: [{ label: 'La Repubblica', href: '#lezione-repubblica' }, { label: 'Girondini e Giacobini', href: '#approfondimento-girondini-giacobini' }],
  roland: [{ label: 'La Repubblica', href: '#lezione-repubblica' }, { label: 'Girondini e Giacobini', href: '#approfondimento-girondini-giacobini' }],
  tricoteuses: [{ label: 'La Repubblica', href: '#lezione-repubblica' }, { label: 'Il Terrore', href: '#approfondimento-terrore' }]
};

const TIMELINE_LINKS = [
  [{ label: 'Premessa', href: '#lezione-premessa' }, { label: 'Il 1789', href: '#lezione-1789' }, { label: 'Stati generali', href: '#approfondimento-tre-stati' }],
  [{ label: 'Il 1789', href: '#lezione-1789' }, { label: 'Dichiarazione dei diritti', href: '#approfondimento-diritti' }],
  [{ label: 'Monarchia costituzionale', href: '#lezione-monarchia' }, { label: 'Forme di governo', href: '#approfondimento-forme-governo' }],
  [{ label: 'Monarchia costituzionale', href: '#lezione-monarchia' }, { label: 'Luigi XVI', href: '#bio-luigi-xvi' }],
  [{ label: 'Monarchia costituzionale', href: '#lezione-monarchia' }, { label: 'La Repubblica', href: '#lezione-repubblica' }],
  [{ label: 'La Repubblica', href: '#lezione-repubblica' }, { label: 'Il Terrore', href: '#approfondimento-terrore' }, { label: 'Robespierre', href: '#bio-robespierre' }],
  [{ label: 'La Repubblica', href: '#lezione-repubblica' }, { label: 'Robespierre', href: '#bio-robespierre' }],
  [{ label: 'La Repubblica', href: '#lezione-repubblica' }, { label: 'Forme di governo', href: '#approfondimento-forme-governo' }],
  [{ label: 'La Repubblica', href: '#lezione-repubblica' }]
];

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
  const isLesson = group === 'lessons';
  const guide = isLesson ? LESSON_GUIDES[item.id] : null;
  const schemaButton = item.schema ? `<button class="btn" onclick="openImage('${escapeHtml(item.title)} - schema','${item.schema}')">${schemaLabel}</button>` : '';
  const videoButton = item.video ? `<button class="btn" onclick="openVideo('${escapeHtml(item.title)}','${item.video}')">Guarda video</button>` : '';
  const readerHtml = isLesson ? renderLessonParagraphs(paragraphs, docKey, guide) : renderStudyParagraphs(paragraphs, docKey);

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
          ${paragraphs.length ? readerHtml : '<p>Testo non disponibile.</p>'}
        </div>
        ${isLesson ? renderLessonExtras(item, guide) : ''}
      </article>
      <aside class="notes-panel">
        ${isLesson ? renderLessonSupport(item, guide) : renderReaderSupport(item)}
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

function renderLessonParagraphs(paragraphs, docKey, guide) {
  if (!guide?.sections?.length) return renderParagraphs(paragraphs, docKey);
  const highlights = getHighlights(docKey);
  return guide.sections.map(section => {
    const body = [];
    for (let i = section.from; i <= section.to; i++) {
      const raw = i === 0 ? stripLessonPrefix(paragraphs[i] || '', guide) : (paragraphs[i] || '');
      if (!raw.trim()) continue;
      body.push(`<p>${applyHighlights(escapeHtml(raw), highlights)}</p>${renderContextLinks(guide.paragraphLinks?.[i])}`);
    }
    return `<section class="lesson-section"><h2>${escapeHtml(section.title)}</h2>${body.join('')}</section>`;
  }).join('');
}

function renderStudyParagraphs(paragraphs, docKey) {
  const highlights = getHighlights(docKey);
  return paragraphs.map((p, index) => `
    <section class="study-paragraph ${index === 0 ? 'first' : ''}">
      <span class="para-marker">${index + 1}</span>
      <p>${applyHighlights(escapeHtml(p), highlights)}</p>
    </section>
  `).join('');
}

function stripLessonPrefix(text, guide) {
  return guide?.introPrefix && text.startsWith(guide.introPrefix)
    ? text.slice(guide.introPrefix.length)
    : text;
}

function renderContextLinks(links = []) {
  if (!links.length) return '';
  return `<div class="context-links">${links.map(link => `<a class="context-chip" href="${link.href}">${escapeHtml(link.label)}</a>`).join('')}</div>`;
}

function renderLessonSupport(item, guide) {
  const resourceLinks = guide?.resources || [];
  const mapLink = item.schema ? `<button class="support-link map-link" onclick="openImage('${escapeHtml(item.title)} - mappa','${item.schema}')"><span>Mappa</span><strong>Apri la mappa della lezione</strong></button>` : '';
  const links = resourceLinks.map(link => `<a class="support-link" href="${link.href}"><span>${escapeHtml(link.type)}</span><strong>${escapeHtml(link.label)}</strong></a>`).join('');
  return `<section class="support-box"><div class="kicker">Collegamenti</div><h2>Per capire meglio</h2>${mapLink}${links}</section>`;
}

function renderReaderSupport(item) {
  const schemaLink = item.schema ? `<button class="support-link map-link" onclick="openImage('${escapeHtml(item.title)} - schema','${item.schema}')"><span>Schema</span><strong>Apri lo schema</strong></button>` : '';
  const videoLink = item.video ? `<button class="support-link map-link" onclick="openVideo('${escapeHtml(item.title)}','${item.video}')"><span>Video</span><strong>Guarda il video</strong></button>` : '';
  return `<section class="support-box"><div class="kicker">Scheda</div><h2>Materiali</h2>${schemaLink}${videoLink}</section>`;
}

function renderLessonExtras(item, guide) {
  if (!guide) return '';
  return `
    <section class="vocab-panel">
      <div class="kicker">Vocabolario essenziale</div>
      <h2>Parole da portare con sé</h2>
      <div class="vocab-grid">
        ${guide.vocab.map(x => `<article><h3>${escapeHtml(x.term)}</h3><p>${escapeHtml(x.definition)}</p></article>`).join('')}
      </div>
    </section>
    <section class="lesson-check" id="check-${item.id}">
      <div class="kicker">Verifica breve</div>
      <h2>Hai capito la lezione?</h2>
      <div class="lesson-questions">
        ${guide.quiz.map((q, qIndex) => `
          <article class="lesson-question">
            <h3>${qIndex + 1}. ${escapeHtml(q.q)}</h3>
            ${q.a.map((answer, answerIndex) => `
              <label>
                <input type="radio" name="lesson-${item.id}-${qIndex}" value="${answerIndex}">
                <span>${escapeHtml(answer)}</span>
              </label>
            `).join('')}
          </article>
        `).join('')}
      </div>
      <button class="btn btn-red" onclick="gradeLessonQuiz('${item.id}')">Correggi e mostrami il report</button>
      <div class="lesson-report" id="lesson-report-${item.id}" aria-live="polite"></div>
    </section>
  `;
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
  reader.innerHTML = renderCurrentReaderText(docKey);
};

window.clearHighlights = function (docKey) {
  setHighlights(docKey, []);
  const reader = document.querySelector(`[data-doc="${docKey}"]`);
  if (reader) reader.innerHTML = renderCurrentReaderText(docKey);
};

function getCurrentParagraphs(docKey) {
  const [group, ...rest] = docKey.split('-');
  const id = rest.join('-');
  return TEXTS[group]?.[id] || [];
}

function renderCurrentReaderText(docKey) {
  const [group, ...rest] = docKey.split('-');
  const id = rest.join('-');
  const paragraphs = getCurrentParagraphs(docKey);
  return group === 'lessons'
    ? renderLessonParagraphs(paragraphs, docKey, LESSON_GUIDES[id])
    : renderStudyParagraphs(paragraphs, docKey);
}

window.gradeLessonQuiz = function (lessonId) {
  const guide = LESSON_GUIDES[lessonId];
  const report = document.getElementById(`lesson-report-${lessonId}`);
  if (!guide || !report) return;

  const results = guide.quiz.map((q, qIndex) => {
    const selected = document.querySelector(`input[name="lesson-${lessonId}-${qIndex}"]:checked`);
    const value = selected ? Number(selected.value) : -1;
    return { q, qIndex, value, correct: value === q.ok };
  });
  const score = results.filter(x => x.correct).length;
  const wrong = results.filter(x => !x.correct);
  const recovery = wrong.length
    ? wrong.map(x => `
      <article class="mini-recovery">
        <h4>Recupero ${x.qIndex + 1}</h4>
        <p><strong>Risposta corretta:</strong> ${escapeHtml(x.q.a[x.q.ok])}</p>
        <p>${escapeHtml(x.q.recovery)}</p>
      </article>
    `).join('')
    : '<p class="report-ok">Ottimo: non serve recupero, puoi passare alla lezione successiva o usare la mappa per ripassare.</p>';

  report.innerHTML = `
    <div class="report-card">
      <h3>Report della lezione</h3>
      <p><strong>Punteggio:</strong> ${score} / ${guide.quiz.length}</p>
      <p>${score === guide.quiz.length ? 'Comprensione solida.' : 'Qui sotto trovi solo i punti da recuperare.'}</p>
      ${recovery}
    </div>
  `;
};

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
  const relations = BIO_RELATIONS[b.id] || [];
  app.innerHTML = `
    <a class="btn" href="#biografie">&larr; Torna alle biografie</a>
    <section class="bio-detail">
      <aside class="bio-portrait">
        <img src="${b.img}" alt="${escapeHtml(b.name)}">
        <div class="bio-role">${escapeHtml(b.role)}</div>
        ${relations.length ? `<div class="bio-links"><div class="kicker">Collegamenti</div>${relations.map(x => `<a class="context-chip" href="${x.href}">${escapeHtml(x.label)}</a>`).join('')}</div>` : ''}
      </aside>
      <article class="bio-text-panel">
        <div class="kicker">Biografia</div>
        <h1 class="section-title">${b.name}</h1>
        ${splitBioText(b.text).map((paragraph, index) => `<p class="${index === 0 ? 'bio-lead' : ''}">${escapeHtml(paragraph)}</p>`).join('')}
      </article>
    </section>
  `;
}

function renderTimeline() {
  app.innerHTML = pageHeader('Ordine cronologico', 'Timeline interattiva', 'Gli eventi principali dal 1789 al 1799, dalla crisi degli Stati Generali al colpo di Stato di Napoleone.') + `<section class="timeline">${D.timeline.map((e, index) => `<article class="event"><div class="year">${e.year}</div><div class="text"><h3>${e.title}</h3><p>${e.text}</p><div class="timeline-links">${(TIMELINE_LINKS[index] || []).map(link => `<a class="context-chip" href="${link.href}">${escapeHtml(link.label)}</a>`).join('')}</div></div></article>`).join('')}</section>`;
}

function splitBioText(text) {
  const sentences = String(text).match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [String(text)];
  const paragraphs = [];
  for (let i = 0; i < sentences.length; i += 2) {
    paragraphs.push(sentences.slice(i, i + 2).join(' ').replace(/\s+/g, ' ').trim());
  }
  return paragraphs.filter(Boolean);
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
