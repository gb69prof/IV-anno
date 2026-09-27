(() => {
  "use strict";

  if (document.body.dataset.page !== "lesson") return;

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const lessonId = document.body.dataset.lesson;
  const root = document.body.dataset.root || "../";
  const storageKey = name => `alfieri-study-v10-${name}`;
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
  const normalizeText = value => String(value).replace(/\s+/g, " ").trim();
  const normalizeKey = value => String(value)
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const safeGet = (name, fallback) => {
    try {
      const value = localStorage.getItem(storageKey(name));
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const safeSet = (name, value) => {
    try {
      localStorage.setItem(storageKey(name), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };

  const LESSON_META = window.ALFIERI_META;
  const EXTRA_STUDY_DATA = window.ALFIERI_STUDY;
  const QUESTION_ANCHORS = {};
  const CONTEXT_HINTS = {};
  const meta = LESSON_META[lessonId];
  const article = $(".lesson-article");
  const sidebar = $(".lesson-sidebar");
  const header = $(".site-header");
  if (!meta || !article || !sidebar || !header) return;

  function shuffle(values) {
    const result = [...values];
    for (let i=result.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
    return result;
  }
  const baseData = typeof LESSON_STUDY_DATA === "object" ? (LESSON_STUDY_DATA[lessonId] || {}) : {};
  const extraData = EXTRA_STUDY_DATA[lessonId] || {};
  const studyData = {
    summary: extraData.summary || "",
    essentials: extraData.essentials || [],
    vocabulary: [...(baseData.vocabulary || []), ...(extraData.vocabulary || [])],
    quiz: shuffle([...(baseData.quiz || []), ...(extraData.quiz || [])].map((item) => {
      const choices = shuffle(item.options.map((text, index) => ({text, correct:index === item.answer})));
      return {...item, options:choices.map(c => c.text), answer:choices.findIndex(c => c.correct)};
    }))
  };

  $(".study-panel", article)?.remove();
  $$(".study-panel", article).forEach(panel => panel.remove());
  $(".notes-tool", sidebar)?.remove();

  const readingSurface = document.createElement("div");
  readingSurface.className = "lesson-reading";
  readingSurface.dataset.lessonReading = "";
  [...article.childNodes].forEach(node => readingSurface.append(node));
  article.append(readingSurface);

  const headingIds = {};
  $$("h2", readingSurface).forEach((heading, index) => {
    if (!heading.id) heading.id = headingIds[lessonId]?.[index] || `sezione-${index + 1}`;
  });

  const existingEssentials = $$(".lesson-note", readingSurface).find(note => /saperi irrinunciabili/i.test(note.textContent));
  if (existingEssentials) {
    existingEssentials.id = "saperi-irrinunciabili";
    existingEssentials.classList.add("essentials-block");
  } else if (studyData.essentials.length) {
    readingSurface.insertAdjacentHTML(
      "beforeend",
      `<aside id="saperi-irrinunciabili" class="lesson-note essentials-block"><h2>Saperi irrinunciabili</h2><ul>${studyData.essentials.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></aside>`
    );
  }

  if (studyData.summary) {
    article.insertAdjacentHTML(
      "beforeend",
      `<section class="lesson-summary" aria-labelledby="summary-title"><p class="study-kicker">Sintesi</p><h2 id="summary-title">La lezione in breve</h2><p>${escapeHtml(studyData.summary)}</p></section>`
    );
  }

  const readingTools = document.createElement("div");
  readingTools.className = "reading-tools";
  readingTools.setAttribute("role", "toolbar");
  readingTools.setAttribute("aria-label", "Strumenti per evidenziare e raccogliere passaggi");
  readingTools.innerHTML = `
    <p data-selection-status role="status" aria-live="polite">Seleziona un passo, poi evidenzialo.</p>
    <button type="button" data-highlight-selection disabled>Evidenzia selezione</button>
    <button type="button" data-add-selection disabled>Incolla questa selezione</button>
    <button type="button" data-add-highlights disabled>Incolla evidenziati <span data-highlight-count>0</span></button>
    <button type="button" data-clear-highlights disabled>Rimuovi evidenziature</button>
  `;
  article.insertBefore(readingTools, readingSurface);

  header.innerHTML = `
    <a class="study-home" href="${root}index.html" aria-label="Torna alla home di Vittorio Alfieri"><span aria-hidden="true">←</span> Home</a>
    <div class="study-title"><span>Vittorio Alfieri · ${escapeHtml(meta.number)}</span><strong>${escapeHtml(meta.title)}</strong></div>
    <div class="study-actions">
      <button type="button" data-font="-" aria-label="Riduci il testo">A−</button>
      <button type="button" data-font="+" aria-label="Ingrandisci il testo">A+</button>
      <button type="button" data-open-index>Indice</button>
    </div>
    <nav class="mobile-study-tabs" aria-label="Pannelli dell’ambiente di studio">
      <button type="button" class="active" data-mobile-view="read">Lezione</button>
      <button type="button" data-mobile-view="visual">Apparato</button>
      <button type="button" data-mobile-view="notes">Taccuino</button>
    </nav>
  `;
  header.classList.add("study-topbar");

  const visualPane = document.createElement("section");
  visualPane.className = "visual-context-pane";
  visualPane.setAttribute("aria-labelledby", "visual-context-title");
  const visualScroll = document.createElement("div");
  visualScroll.className = "visual-context-scroll";
  [...sidebar.children].forEach(child => visualScroll.append(child));
  visualPane.innerHTML = `<header class="workspace-panel-header"><p>Osserva mentre leggi</p><h2 id="visual-context-title">Apparato visivo</h2><span data-context-status aria-live="polite"></span><span class="panel-scroll-hint" aria-hidden="true">Scorri il pannello ↓</span></header>`;
  visualPane.append(visualScroll);

  const notebookPane = document.createElement("section");
  notebookPane.className = "notebook-pane";
  notebookPane.setAttribute("aria-labelledby", "notebook-title");
  notebookPane.innerHTML = `
    <header class="workspace-panel-header notebook-header">
      <div><p>Elabora</p><h2 id="notebook-title">Taccuino</h2></div>
      <div class="notebook-header-meta"><span data-autosave-state role="status">Salvataggio automatico</span><span class="panel-scroll-hint" aria-hidden="true">Scorri il taccuino ↓</span></div>
    </header>
    <label for="notebook-text">Appunti personali</label>
    <textarea id="notebook-text" rows="6" spellcheck="true" placeholder="Scrivi osservazioni, domande e collegamenti personali…"></textarea>
    <section class="citation-area" aria-labelledby="citation-title">
      <h3 id="citation-title">Citazioni dalla lezione</h3>
      <div class="citation-list" data-citation-list></div>
      <p data-empty-citations>Evidenzia i passaggi che vuoi conservare, poi usa “Incolla evidenziati”.</p>
    </section>
    <div class="notebook-actions">
      <button type="button" data-download-notes>Scarica TXT</button>
      <button type="button" class="danger" data-clear-notebook>Cancella</button>
    </div>
  `;
  sidebar.append(visualPane, notebookPane);

  const dismissScrollHint = (scroller, panel) => {
    const hint = $(".panel-scroll-hint", panel);
    if (!hint) return;
    scroller.addEventListener("scroll", () => hint.remove(), { once: true, passive: true });
  };
  dismissScrollHint(visualScroll, visualPane);
  dismissScrollHint(notebookPane, notebookPane);

  const dock = document.createElement("nav");
  dock.className = "study-bottombar";
  dock.setAttribute("aria-label", "Strumenti per sedimentare");
  dock.innerHTML = `
    <div class="reading-progress" aria-label="Progresso di lettura della sessione corrente"><span class="reading-progress-label"><strong data-progress-label>0%</strong><small>sessione</small></span><i><b data-progress-bar></b></i></div>
    <button type="button" data-learning-panel="essentials">Saperi irrinunciabili</button>
    <button type="button" data-learning-panel="vocab">Vocabolario</button>
    <button type="button" data-learning-panel="test">Test</button>
  `;
  document.body.append(dock);

  const indexDialog = document.createElement("dialog");
  indexDialog.className = "study-dialog index-dialog";
  indexDialog.innerHTML = `
    <form method="dialog"><button class="dialog-x" aria-label="Chiudi">×</button></form>
    <header><p>Sei movimenti e laboratorio di lettura</p><h2>Indice</h2></header>
    <nav class="full-index" aria-label="Indice completo">
      ${Object.entries(LESSON_META).map(([id, item]) => `<a href="${item.href}" ${id === lessonId ? 'aria-current="page"' : ""}><b>${escapeHtml(item.number)}</b><span>${escapeHtml(item.title)}${item.deepening ? " · Approfondimento" : ""}</span></a>`).join("")}
      <a href="${root}mappe.html"><b>M</b><span>Mappe concettuali</span></a>
      <a href="scrittore.html"><b>C</b><span>Lo scrittore libero · Approfondimento</span></a>
      <a href="${root}fonti.html"><b>F</b><span>Fonti e metodo</span></a>
    </nav>
    <div class="dialog-actions"><button type="button" data-resume-reading>Riprendi questa lezione</button><button type="button" class="danger-link" data-reset-study>Azzera i dati di studio</button></div>
  `;
  document.body.append(indexDialog);

  const learningDialog = document.createElement("dialog");
  learningDialog.className = "study-dialog learning-dialog";
  learningDialog.innerHTML = `
    <form method="dialog"><button class="dialog-x" aria-label="Chiudi">×</button></form>
    <header><p data-learning-kicker>Consolida</p><h2 data-learning-title>Saperi irrinunciabili</h2></header>
    <div data-learning-content></div>
  `;
  document.body.append(learningDialog);

  const toast = document.createElement("div");
  toast.className = "study-toast";
  toast.hidden = true;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.append(toast);

  let toastTimer = null;
  const showToast = message => {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2400);
  };

  let notebook = safeGet(`notebook-${lessonId}`, { notes: "", citations: [] });
  if (!notebook || typeof notebook !== "object") notebook = { notes: "", citations: [] };
  notebook.notes = typeof notebook.notes === "string" ? notebook.notes : "";
  notebook.citations = Array.isArray(notebook.citations) ? notebook.citations : [];
  /* Nessuna importazione da altre PWA. */
  if (false) {
    const legacyNotes = localStorage.getItem(`alfieri-notes-${lessonId}`);
    if (legacyNotes) {
      notebook.notes = legacyNotes;
      safeSet(`notebook-${lessonId}`, notebook);
    }
  }

  const notebookText = $("#notebook-text", notebookPane);
  const autosaveState = $("[data-autosave-state]", notebookPane);
  notebookText.value = notebook.notes;
  let saveTimer = null;

  const saveNotebook = () => {
    clearTimeout(saveTimer);
    notebook.notes = notebookText.value;
    autosaveState.textContent = safeSet(`notebook-${lessonId}`, notebook) ? "Salvato" : "Salvataggio non disponibile";
  };

  const scheduleNotebookSave = () => {
    autosaveState.textContent = "Salvataggio…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNotebook, 320);
  };

  const renderCitations = () => {
    const list = $("[data-citation-list]", notebookPane);
    list.innerHTML = notebook.citations.map((citation, index) => `
      <article class="citation-card">
        <q>${escapeHtml(citation.text)}</q>
        <small>${escapeHtml(citation.source || meta.title)}</small>
        <button type="button" data-remove-citation="${index}" aria-label="Rimuovi questa citazione">×</button>
      </article>
    `).join("");
    $("[data-empty-citations]", notebookPane).hidden = notebook.citations.length > 0;
  };
  renderCitations();
  notebookText.addEventListener("input", scheduleNotebookSave);

  notebookPane.addEventListener("click", event => {
    const remove = event.target.closest("[data-remove-citation]");
    if (!remove) return;
    notebook.citations.splice(Number(remove.dataset.removeCitation), 1);
    saveNotebook();
    renderCitations();
    updateReadingTools();
  });

  const highlightsForLesson = () => {
    const value = safeGet(`highlights-${lessonId}`, []);
    if (!Array.isArray(value)) return [];
    return value.filter(item => item && Number.isInteger(item.start) && Number.isInteger(item.end) && item.end > item.start && typeof item.text === "string");
  };

  const saveHighlights = highlights => safeSet(`highlights-${lessonId}`, highlights);

  const markTextOffsets = (start, end, highlightId) => {
    if (start < 0 || end <= start || end > readingSurface.textContent.length) return false;
    const walker = document.createTreeWalker(readingSurface, NodeFilter.SHOW_TEXT);
    const segments = [];
    let offset = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const nodeEnd = offset + node.nodeValue.length;
      if (nodeEnd > start && offset < end) {
        segments.push({ node, start: Math.max(0, start - offset), end: Math.min(node.nodeValue.length, end - offset) });
      }
      offset = nodeEnd;
      if (offset >= end) break;
    }
    segments.reverse().forEach(segment => {
      if (segment.end <= segment.start || segment.node.parentElement?.closest(".student-highlight")) return;
      const selectedNode = segment.node.splitText(segment.start);
      selectedNode.splitText(segment.end - segment.start);
      const mark = document.createElement("mark");
      mark.className = "student-highlight";
      mark.dataset.highlightId = highlightId;
      mark.title = "Passo evidenziato";
      selectedNode.parentNode.insertBefore(mark, selectedNode);
      mark.append(selectedNode);
    });
    return segments.length > 0;
  };

  highlightsForLesson().sort((a, b) => b.start - a.start).forEach(item => markTextOffsets(item.start, item.end, item.id));

  let pendingSelection = null;
  let selectionTimer = null;
  const citationMatches = (citation, highlight) => {
    if (citation.highlightId && citation.highlightId === highlight.id) return true;
    return normalizeText(citation.text) === normalizeText(highlight.text);
  };

  const updateReadingTools = () => {
    const highlights = highlightsForLesson();
    const waiting = highlights.filter(highlight => !notebook.citations.some(citation => citationMatches(citation, highlight)));
    const canUseSelection = !!pendingSelection;
    $("[data-highlight-selection]", readingTools).disabled = !canUseSelection;
    $("[data-add-selection]", readingTools).disabled = !canUseSelection;
    $("[data-add-highlights]", readingTools).disabled = waiting.length === 0;
    $("[data-clear-highlights]", readingTools).disabled = highlights.length === 0;
    $("[data-highlight-count]", readingTools).textContent = String(waiting.length);
    const status = $("[data-selection-status]", readingTools);
    if (canUseSelection) {
      const words = pendingSelection.text.split(/\s+/).filter(Boolean).length;
      status.textContent = `Selezione pronta: ${words} ${words === 1 ? "parola" : "parole"}. Puoi evidenziarla o incollarla subito.`;
    } else if (highlights.length && waiting.length) {
      status.textContent = `${highlights.length} ${highlights.length === 1 ? "passaggio evidenziato" : "passaggi evidenziati"}; ${waiting.length} ancora da incollare.`;
    } else if (highlights.length) {
      status.textContent = "Tutti i passaggi evidenziati sono già nel taccuino.";
    } else {
      status.textContent = "Seleziona un passo, poi evidenzialo.";
    }
  };

  const captureSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      pendingSelection = null;
      updateReadingTools();
      return;
    }
    const range = selection.getRangeAt(0);
    if (!readingSurface.contains(range.startContainer) || !readingSurface.contains(range.endContainer)) return;
    const text = normalizeText(range.toString()).slice(0, 5000);
    if (!text) return;
    const beforeStart = document.createRange();
    beforeStart.selectNodeContents(readingSurface);
    beforeStart.setEnd(range.startContainer, range.startOffset);
    const beforeEnd = document.createRange();
    beforeEnd.selectNodeContents(readingSurface);
    beforeEnd.setEnd(range.endContainer, range.endOffset);
    pendingSelection = {
      text,
      start: beforeStart.toString().length,
      end: beforeEnd.toString().length
    };
    updateReadingTools();
  };

  readingSurface.addEventListener("pointerup", () => setTimeout(captureSelection, 0));
  readingSurface.addEventListener("keyup", event => {
    if (event.key === "Shift" || event.key.startsWith("Arrow")) setTimeout(captureSelection, 0);
  });
  document.addEventListener("selectionchange", () => {
    clearTimeout(selectionTimer);
    selectionTimer = setTimeout(captureSelection, 100);
  });
  $$("button", readingTools).forEach(button => button.addEventListener("pointerdown", event => event.preventDefault()));

  $("[data-highlight-selection]", readingTools).addEventListener("click", () => {
    if (!pendingSelection) return;
    const highlights = highlightsForLesson();
    if (highlights.some(item => pendingSelection.start < item.end && pendingSelection.end > item.start)) {
      pendingSelection = null;
      window.getSelection()?.removeAllRanges();
      updateReadingTools();
      showToast("Questa selezione contiene già un passaggio evidenziato.");
      return;
    }
    const item = {
      id: `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      text: pendingSelection.text,
      start: pendingSelection.start,
      end: pendingSelection.end,
      source: meta.title,
      date: new Date().toISOString()
    };
    highlights.push(item);
    saveHighlights(highlights);
    markTextOffsets(item.start, item.end, item.id);
    pendingSelection = null;
    window.getSelection()?.removeAllRanges();
    updateReadingTools();
    showToast("Passo evidenziato. Puoi continuare a leggere.");
  });

  $("[data-add-selection]", readingTools).addEventListener("click", () => {
    if (!pendingSelection) return;
    const duplicate = notebook.citations.some(citation => normalizeText(citation.text) === pendingSelection.text);
    if (!duplicate) {
      notebook.citations.push({ text: pendingSelection.text, source: meta.title, date: new Date().toISOString() });
      saveNotebook();
      renderCitations();
    }
    pendingSelection = null;
    window.getSelection()?.removeAllRanges();
    updateReadingTools();
    showToast(duplicate ? "Questo passo è già nel taccuino." : "Selezione incollata nel taccuino.");
  });

  $("[data-add-highlights]", readingTools).addEventListener("click", () => {
    const highlights = highlightsForLesson();
    const waiting = highlights.filter(highlight => !notebook.citations.some(citation => citationMatches(citation, highlight)));
    if (!waiting.length) return;
    waiting.forEach(highlight => notebook.citations.push({
      text: highlight.text,
      source: highlight.source,
      date: new Date().toISOString(),
      highlightId: highlight.id
    }));
    saveNotebook();
    renderCitations();
    updateReadingTools();
    showToast(`${waiting.length} ${waiting.length === 1 ? "passaggio incollato" : "passaggi incollati"} nel taccuino.`);
  });

  $("[data-clear-highlights]", readingTools).addEventListener("click", () => {
    const highlights = highlightsForLesson();
    if (!highlights.length || !window.confirm(`Rimuovere ${highlights.length === 1 ? "il passaggio evidenziato" : `i ${highlights.length} passaggi evidenziati`}? Le citazioni già nel taccuino resteranno conservate.`)) return;
    const parents = new Set();
    $$("mark.student-highlight", readingSurface).forEach(mark => {
      parents.add(mark.parentNode);
      mark.replaceWith(...mark.childNodes);
    });
    parents.forEach(parent => parent?.normalize());
    saveHighlights([]);
    pendingSelection = null;
    window.getSelection()?.removeAllRanges();
    updateReadingTools();
    showToast("Evidenziature rimosse; il taccuino non è stato modificato.");
  });
  updateReadingTools();

  $("[data-download-notes]", notebookPane).addEventListener("click", () => {
    saveNotebook();
    const date = new Intl.DateTimeFormat("it-IT", { dateStyle: "long", timeStyle: "short" }).format(new Date());
    const citations = notebook.citations.length
      ? notebook.citations.map(citation => `“${citation.text}”\nFonte: ${citation.source || meta.title}`).join("\n\n—\n\n")
      : "Nessuna citazione conservata.";
    const text = `Vittorio Alfieri — ${meta.title}\nData e ora: ${date}\n\nAPPUNTI DELLO STUDENTE\n${notebook.notes || "Nessun appunto personale."}\n\nCITAZIONI DALLA LEZIONE\n${citations}\n`;
    const blob = new Blob(["\ufeff", text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `alfieri-${lessonId}-taccuino.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Download TXT avviato.");
  });

  $("[data-clear-notebook]", notebookPane).addEventListener("click", () => {
    if (!window.confirm(`Cancellare appunti e citazioni di “${meta.title}”?`)) return;
    notebook = { notes: "", citations: [] };
    notebookText.value = "";
    safeSet(`notebook-${lessonId}`, notebook);
    renderCitations();
    updateReadingTools();
    autosaveState.textContent = "Taccuino cancellato";
  });

  const contextCards = [
    ...$$(".lesson-map-card, .alfieri-media, .biblioteca-bridge-card, .zante-bridge-card", visualScroll)
  ];
  const contextStatus = $("[data-context-status]", visualPane);
  const headings = $$("h2", readingSurface).filter(heading => !heading.closest("#saperi-irrinunciabili"));
  const hints = CONTEXT_HINTS[lessonId] || [];
  let activeContextIndex = -1;

  const activateContext = index => {
    if (!contextCards.length || index === activeContextIndex) return;
    activeContextIndex = index;
    const hint = normalizeKey(hints[index] || hints[hints.length - 1] || "");
    const mapCards = contextCards.filter(item => item.matches(".lesson-map-card"));
    const card = mapCards.find(item => normalizeKey(item.textContent).includes(hint))
      || contextCards.find(item => normalizeKey(item.textContent).includes(hint))
      || contextCards[0];
    contextCards.forEach(item => item.classList.toggle("is-contextual", item === card));
    const heading = headings[index];
    contextStatus.textContent = heading ? `Collegato a: ${normalizeText(heading.textContent).replace(/^\d+\.\s*/, "")}` : "Materiali della lezione";
    const target = Math.max(0, card.offsetTop - visualScroll.offsetTop - 8);
    visualScroll.scrollTo({ top: target, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const updateContextFromReading = () => {
    const articleTop = article.getBoundingClientRect().top;
    let index = 0;
    headings.forEach((heading, candidate) => {
      if (heading.getBoundingClientRect().top - articleTop < 170) index = candidate;
    });
    activateContext(index);
  };
  article.addEventListener("scroll", updateContextFromReading, { passive: true });
  activateContext(0);

  const progressLabel = $("[data-progress-label]", dock);
  const progressBar = $("[data-progress-bar]", dock);
  let progressTimer = null;
  const updateProgress = () => {
    const max = Math.max(1, article.scrollHeight - article.clientHeight);
    const ratio = Math.min(1, Math.max(0, article.scrollTop / max));
    const percent = Math.round(ratio * 100);
    progressLabel.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
    clearTimeout(progressTimer);
    progressTimer = setTimeout(() => {
      safeSet(`progress-${lessonId}`, { scrollTop: article.scrollTop, ratio, updated: new Date().toISOString() });
      safeSet("last-lesson", { id: lessonId, updated: new Date().toISOString() });
    }, 180);
  };
  article.addEventListener("scroll", updateProgress, { passive: true });
  const savedProgress = safeGet(`progress-${lessonId}`, null);
  updateProgress();
  const resumeReading = () => {
    if (savedProgress && Number.isFinite(savedProgress.scrollTop)) article.scrollTop = savedProgress.scrollTop;
    indexDialog.close();
  };
  $("[data-resume-reading]", indexDialog).addEventListener("click", resumeReading);
  if (new URLSearchParams(location.search).get("resume") === "1") setTimeout(resumeReading, 120);

  const renderEssentials = () => {
    if (studyData.essentials.length) {
      return `<ul class="essentials-dialog-list">${studyData.essentials.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    }
    const source = $("#saperi-irrinunciabili", readingSurface);
    if (!source) return "<p>I saperi irrinunciabili sono integrati nella conclusione della lezione.</p>";
    const paragraphs = $$("p", source).map(item => normalizeText(item.textContent)).filter(item => item && !/^saperi irrinunciabili$/i.test(item));
    return `<div class="essentials-source">${paragraphs.map(item => `<p>${escapeHtml(item)}</p>`).join("")}</div>`;
  };

  const renderVocabulary = () => `<dl class="vocabulary-dialog">${studyData.vocabulary.map(([term, definition]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd></div>`).join("")}</dl>`;

  const normalizeQuizItem = (item, index) => ({
    ...item,
    anchor: item.anchor || QUESTION_ANCHORS[lessonId]?.[index] || headings[0]?.id || "",
    recoveryQuestion: item.recoveryQuestion || `Qual è il nesso corretto richiamato dalla domanda “${item.question}”?`
  });

  const renderQuiz = () => {
    const previous = safeGet(`quiz-${lessonId}`, []);
    const items = studyData.quiz.map(normalizeQuizItem);
    return `
      ${previous.length ? `<details class="quiz-history"><summary>Tentativi precedenti (${previous.length})</summary><ol>${previous.map(x => `<li>${new Date(x.date).toLocaleString("it-IT")} · ${x.type} · ${x.correct}/${x.total} · voto ${x.grade}/10</li>`).join("")}</ol></details>` : ""}
      <form class="advanced-quiz" data-advanced-quiz data-mode="full">
        ${items.map((item, index) => `
          <fieldset data-question-index="${index}">
            <legend>${escapeHtml(item.question)}</legend>
            ${item.options.map((option, optionIndex) => `<label><input type="radio" name="advanced-${lessonId}-${index}" value="${optionIndex}"><span>${escapeHtml(option)}</span></label>`).join("")}
            <div class="question-feedback" data-question-feedback hidden></div>
          </fieldset>
        `).join("")}
        <p class="grade-formula">Le domande hanno lo stesso peso. Voto = massimo fra 1 e la percentuale divisa per 10, arrotondata all’intero più vicino. Le risposte omesse valgono come errori.</p>
        <button type="submit" class="quiz-submit">Correggi il test</button>
      </form>
      <div class="advanced-quiz-report" data-advanced-quiz-report hidden></div>
    `;
  };

  const setupQuiz = () => {
    const form = $("[data-advanced-quiz]", learningDialog);
    const report = $("[data-advanced-quiz-report]", learningDialog);
    if (!form || !report) return;
    const items = studyData.quiz.map(normalizeQuizItem);
    let retryIndexes = null;

    const showFullTest = () => {
      retryIndexes = null;
      form.dataset.mode = "full";
      $$(`fieldset`, form).forEach(fieldset => {
        fieldset.hidden = false;
        $$(`input`, fieldset).forEach(input => { input.checked = false; });
        $("[data-question-feedback]", fieldset).hidden = true;
      });
      $(".quiz-submit", form).textContent = "Correggi il test";
      report.hidden = true;
    };

    form.addEventListener("submit", event => {
      event.preventDefault();
      const activeIndexes = retryIndexes || items.map((_, index) => index);
      const wrong = [];
      let correct = 0;
      activeIndexes.forEach(index => {
        const item = items[index];
        const fieldset = $(`fieldset[data-question-index="${index}"]`, form);
        const chosen = $(`input[name="advanced-${lessonId}-${index}"]:checked`, fieldset);
        const chosenIndex = chosen ? Number(chosen.value) : -1;
        const feedback = $("[data-question-feedback]", fieldset);
        const isCorrect = chosenIndex === item.answer;
        if (isCorrect) correct += 1;
        else wrong.push(index);
        fieldset.classList.toggle("is-correct", isCorrect);
        fieldset.classList.toggle("is-wrong", !isCorrect);
        feedback.hidden = false;
        feedback.innerHTML = isCorrect
          ? `<strong>Corretto.</strong> <span>${escapeHtml(item.recovery)}</span>`
          : `<strong>Da rivedere.</strong> <span>La risposta corretta è “${escapeHtml(item.options[item.answer])}”. ${escapeHtml(item.recovery)}</span>`;
      });
      const percentage = Math.round((correct / activeIndexes.length) * 100);
      const grade = Math.max(1, Math.round(percentage / 10));
      const history = safeGet(`quiz-${lessonId}`, []);
      history.push({ questions: items.map(item => item.question), type: retryIndexes ? "recupero" : "test", date: new Date().toISOString(), correct, total: activeIndexes.length, percentage, grade, wrong });
      safeSet(`quiz-${lessonId}`, history.slice(-12));
      report.hidden = false;
      report.innerHTML = `
        <h3>${retryIndexes ? "Esito del recupero" : "Esito del test"}</h3>
        <p class="score-line">${correct}/${activeIndexes.length} · ${percentage}% · voto ${grade}/10</p>
        ${wrong.length ? `<div class="recovery-list"><h4>Nodi da recuperare</h4>${wrong.map(index => {
          const item = items[index];
          return `<article><strong>${escapeHtml(item.question)}</strong><p>${escapeHtml(item.recovery)}</p><p><b>Controllo:</b> ${escapeHtml(item.recoveryQuestion)}</p>${item.anchor ? `<a href="#${escapeHtml(item.anchor)}" data-return-anchor="${escapeHtml(item.anchor)}">Rileggi il punto collegato</a>` : ""}</article>`;
        }).join("")}</div><button type="button" data-retry-wrong>Riprova solo le domande errate</button>` : `<p class="quiz-success">Tutti i nessi sono stati riconosciuti.</p>${retryIndexes ? `<button type="button" data-full-test>Rifai il test completo</button>` : ""}`}
      `;
      $("[data-retry-wrong]", report)?.addEventListener("click", () => {
        retryIndexes = [...wrong];
        form.dataset.mode = "retry";
        $$(`fieldset`, form).forEach((fieldset, index) => {
          fieldset.hidden = !retryIndexes.includes(index);
          $$(`input`, fieldset).forEach(input => { input.checked = false; });
          fieldset.classList.remove("is-correct", "is-wrong");
          $("[data-question-feedback]", fieldset).hidden = true;
        });
        $(".quiz-submit", form).textContent = "Correggi il recupero";
        report.hidden = true;
        form.scrollIntoView({ block: "start" });
      });
      $("[data-full-test]", report)?.addEventListener("click", showFullTest);
      $$('[data-return-anchor]', report).forEach(link => link.addEventListener("click", event => {
        event.preventDefault();
        learningDialog.close();
        const target = document.getElementById(link.dataset.returnAnchor);
        target?.scrollIntoView({ block: "start" });
        target?.focus?.({ preventScroll: true });
      }));
    });
  };

  const openLearningPanel = type => {
    const title = $("[data-learning-title]", learningDialog);
    const kicker = $("[data-learning-kicker]", learningDialog);
    const content = $("[data-learning-content]", learningDialog);
    if (type === "essentials") {
      kicker.textContent = "Conoscenze stabili";
      title.textContent = "Saperi irrinunciabili";
      content.innerHTML = renderEssentials();
    } else if (type === "vocab") {
      kicker.textContent = "Parole necessarie";
      title.textContent = "Vocabolario essenziale";
      content.innerHTML = renderVocabulary();
    } else {
      kicker.textContent = "Comprensione e recupero";
      title.textContent = "Test della lezione";
      content.innerHTML = renderQuiz();
      setupQuiz();
    }
    learningDialog.showModal();
  };

  dock.addEventListener("click", event => {
    const button = event.target.closest("[data-learning-panel]");
    if (button) openLearningPanel(button.dataset.learningPanel);
  });

  $("[data-open-index]", header).addEventListener("click", () => indexDialog.showModal());
  indexDialog.addEventListener("click", event => {
    if (event.target === indexDialog) indexDialog.close();
  });
  learningDialog.addEventListener("click", event => {
    if (event.target === learningDialog) learningDialog.close();
  });

  $$("[data-font]", header).forEach(button => button.addEventListener("click", () => {
    const current = Number(safeGet("font-scale", 1));
    const next = Math.min(1.25, Math.max(0.9, current + (button.dataset.font === "+" ? 0.05 : -0.05)));
    document.documentElement.style.setProperty("--study-font-scale", next);
    safeSet("font-scale", next);
    showToast(`Dimensione del testo: ${Math.round(next * 100)}%`);
  }));
  document.documentElement.style.setProperty("--study-font-scale", Number(safeGet("font-scale", 1)));

  $("[data-reset-study]", indexDialog).addEventListener("click", () => {
    if (!window.confirm("Azzerare evidenziazioni, taccuini, progressi e risultati dei test di questa PWA?")) return;
    const keys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith("alfieri-study-v10-") || key?.startsWith("alfieri-notes-")) keys.push(key);
    }
    keys.forEach(key => localStorage.removeItem(key));
    location.reload();
  });

  if (location.hash === "#test-lezione") setTimeout(() => openLearningPanel("test"), 100);
  document.body.dataset.mobilePanel = "read";
  $$("[data-mobile-view]", header).forEach(button => button.addEventListener("click", () => {
    const panel = button.dataset.mobileView;
    document.body.dataset.mobilePanel = panel;
    $$("[data-mobile-view]", header).forEach(item => item.classList.toggle("active", item === button));
  }));

  const updateChromeSizes = () => {
    document.documentElement.style.setProperty("--study-header-height", `${header.offsetHeight}px`);
    document.documentElement.style.setProperty("--study-dock-height", `${dock.offsetHeight}px`);
  };
  updateChromeSizes();
  window.addEventListener("resize", updateChromeSizes, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener("resize", updateChromeSizes, { passive: true });
})();

