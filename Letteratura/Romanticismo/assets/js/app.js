(() => {
  "use strict";

  const sections = window.ROMANTICISMO_SECTIONS || [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const PREFIX = "romanticismo-study-v3:";
  const state = {
    index: 0,
    visual: 0,
    cachedSelection: null,
    visualObserver: null,
    saveTimer: null,
    toastTimer: null,
    fontLevel: 0,
    activeQuiz: null
  };

  const elements = {
    cover: $("#coverView"),
    study: $("#studyView"),
    headerTitle: $("#headerTitle"),
    headerKicker: $("#headerKicker"),
    lessonScroll: $("#lessonScroll"),
    lessonContent: $("#lessonContent"),
    notes: $("#notesArea"),
    citations: $("#citations"),
    indexDialog: $("#indexDialog"),
    studyDialog: $("#studyDialog"),
    imageDialog: $("#imageDialog"),
    toast: $("#toast")
  };

  function storageKey(name, sectionId = sections[state.index]?.id) {
    return PREFIX + name + (sectionId ? ":" + sectionId : "");
  }

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      showToast("Spazio locale non disponibile: i dati non sono stati salvati.");
      return false;
    }
  }

  function showToast(message, duration = 2300) {
    clearTimeout(state.toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    state.toastTimer = setTimeout(() => elements.toast.classList.remove("show"), duration);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
  }

  function currentSection() {
    return sections[state.index];
  }

  function showCover() {
    saveReadingPosition();
    document.body.classList.remove("study-mode");
    elements.study.hidden = true;
    elements.cover.hidden = false;
    elements.headerTitle.textContent = "Il Romanticismo";
    elements.headerKicker.textContent = "Ambiente di studio";
    $("#readingProgress").style.width = "0%";
    renderResume();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openSection(id, options = {}) {
    const nextIndex = sections.findIndex(section => section.id === id);
    if (nextIndex < 0) return;
    saveReadingPosition();
    state.index = nextIndex;
    state.cachedSelection = null;
    state.visual = 0;
    elements.cover.hidden = true;
    elements.study.hidden = false;
    document.body.classList.add("study-mode");
    renderSection(options);
    writeJSON(storageKey("last", ""), { id, updatedAt: Date.now() });
  }

  function renderSection(options = {}) {
    const section = currentSection();
    $("#sectionNumber").textContent = section.number;
    $("#lessonKicker").textContent = section.kicker;
    $("#lessonTitle").textContent = section.title;
    $("#guidingQuestion").textContent = section.question;
    elements.headerTitle.textContent = section.title;
    elements.headerKicker.textContent = "Romanticismo · " + section.number;
    $("#lessonSummary").innerHTML = "<p>" + section.summary + "</p>";
    $("#lessonPosition").textContent = (state.index + 1) + " di " + sections.length;
    $("#prevLessonBtn").disabled = state.index === 0;
    $("#nextLessonBtn").disabled = state.index === sections.length - 1;
    renderProgressDots();
    renderLessonText();
    renderVisuals();
    loadNotebook();
    setMobilePane("lesson");
    requestAnimationFrame(() => {
      const progress = readJSON(storageKey("progress"), { ratio: 0 });
      if (options.anchor) {
        const anchor = document.getElementById(options.anchor);
        if (anchor) anchor.scrollIntoView({ block: "start" });
      } else {
        const max = elements.lessonScroll.scrollHeight - elements.lessonScroll.clientHeight;
        elements.lessonScroll.scrollTop = max > 0 ? Math.round(max * (progress.ratio || 0)) : 0;
      }
      updateReadingProgress();
    });
  }

  function renderProgressDots() {
    const progress = sections.map(section => readJSON(storageKey("progress", section.id), { completed: false }));
    $("#progressDots").innerHTML = progress.map((item, index) =>
      '<i class="' + (item.completed || index === state.index ? "done" : "") + '"></i>'
    ).join("");
  }

  function renderLessonText() {
    const scrollTop = elements.lessonScroll.scrollTop;
    elements.lessonContent.innerHTML = currentSection().lesson;
    applyHighlights();
    elements.lessonScroll.scrollTop = scrollTop;
    observeLessonBlocks();
    updateNewHighlightsCount();
  }

  function textNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.nodeValue.length ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function wrapStoredRange(root, start, end, id) {
    let cursor = 0;
    const segments = [];
    textNodes(root).forEach(node => {
      const nodeStart = cursor;
      const nodeEnd = cursor + node.nodeValue.length;
      const from = Math.max(start, nodeStart);
      const to = Math.min(end, nodeEnd);
      if (from < to) segments.push({ node, from: from - nodeStart, to: to - nodeStart });
      cursor = nodeEnd;
    });
    segments.reverse().forEach(segment => {
      const after = segment.node.splitText(segment.to);
      const selected = segment.node.splitText(segment.from);
      const mark = document.createElement("mark");
      mark.className = "study-highlight";
      mark.dataset.highlightId = id;
      selected.parentNode.insertBefore(mark, after);
      mark.appendChild(selected);
    });
  }

  function getHighlights() {
    return readJSON(storageKey("highlights"), []);
  }

  function applyHighlights() {
    getHighlights().slice().sort((a, b) => b.start - a.start).forEach(item => {
      wrapStoredRange(elements.lessonContent, item.start, item.end, item.id);
    });
  }

  function captureSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!elements.lessonContent.contains(range.commonAncestorContainer)) return;
    const before = document.createRange();
    before.selectNodeContents(elements.lessonContent);
    before.setEnd(range.startContainer, range.startOffset);
    const start = before.toString().length;
    const text = selection.toString().replace(/\s+/g, " ").trim();
    if (!text) return;
    state.cachedSelection = { start, end: start + selection.toString().length, text };
  }

  function validCachedSelection() {
    const selected = state.cachedSelection;
    if (!selected || selected.end <= selected.start || !selected.text) {
      showToast("Seleziona prima un passaggio della lezione.");
      return null;
    }
    return selected;
  }

  function makeId(label = "item") {
    return label + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function highlightSelection() {
    const selected = validCachedSelection();
    if (!selected) return;
    const highlights = getHighlights();
    if (highlights.some(item => selected.start < item.end && selected.end > item.start)) {
      showToast("Questa selezione è già evidenziata o si sovrappone a un'evidenziazione.");
      return;
    }
    highlights.push({ id: makeId("hl"), start: selected.start, end: selected.end, text: selected.text, copied: false });
    writeJSON(storageKey("highlights"), highlights);
    renderLessonText();
    state.cachedSelection = null;
    window.getSelection()?.removeAllRanges();
    showToast("Passaggio evidenziato. Puoi continuare a leggere.");
  }

  function addCitation(text, sourceId = null) {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return false;
    const citations = readJSON(storageKey("citations"), []);
    if (sourceId && citations.some(item => item.sourceId === sourceId)) return false;
    if (!sourceId && citations.some(item => item.text === clean)) return false;
    citations.push({ id: makeId("cite"), sourceId, text: clean, createdAt: Date.now() });
    writeJSON(storageKey("citations"), citations);
    renderCitations();
    return true;
  }

  function pasteSelection() {
    const selected = validCachedSelection();
    if (!selected) return;
    const added = addCitation(selected.text);
    showToast(added ? "Selezione aggiunta al taccuino." : "La citazione è già nel taccuino.");
  }

  function pasteHighlights() {
    const highlights = getHighlights();
    let added = 0;
    highlights.forEach(item => {
      if (!item.copied && addCitation(item.text, item.id)) {
        item.copied = true;
        added += 1;
      }
    });
    writeJSON(storageKey("highlights"), highlights);
    updateNewHighlightsCount();
    showToast(added ? added + (added === 1 ? " passaggio aggiunto." : " passaggi aggiunti.") : "Nessun nuovo evidenziato da aggiungere.");
  }

  function clearHighlights() {
    const highlights = getHighlights();
    if (!highlights.length) {
      showToast("Non ci sono evidenziazioni da rimuovere.");
      return;
    }
    if (!window.confirm("Rimuovere tutte le evidenziazioni di questa lezione? Le citazioni già salvate resteranno nel taccuino.")) return;
    writeJSON(storageKey("highlights"), []);
    renderLessonText();
    showToast("Evidenziazioni rimosse; le citazioni sono rimaste nel taccuino.");
  }

  function updateNewHighlightsCount() {
    const count = getHighlights().filter(item => !item.copied).length;
    $("#newHighlightsCount").textContent = String(count);
  }

  function loadNotebook() {
    elements.notes.value = localStorage.getItem(storageKey("notes")) || "";
    $("#saveStatus").textContent = "Salvato";
    renderCitations();
  }

  function saveNotes() {
    clearTimeout(state.saveTimer);
    $("#saveStatus").textContent = "Salvataggio…";
    state.saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey("notes"), elements.notes.value);
        $("#saveStatus").textContent = "Salvato";
      } catch {
        $("#saveStatus").textContent = "Non salvato";
      }
    }, 280);
  }

  function renderCitations() {
    const citations = readJSON(storageKey("citations"), []);
    $("#citationCount").textContent = citations.length ? citations.length + (citations.length === 1 ? " citazione" : " citazioni") : "Nessuna citazione";
    if (!citations.length) {
      elements.citations.innerHTML = '<div class="empty-citations">I passaggi che scegli compariranno qui, senza numerazione.</div>';
      return;
    }
    elements.citations.innerHTML = citations.map(item =>
      '<blockquote class="citation" data-citation-id="' + item.id + '">' +
        escapeHTML(item.text) +
        '<button type="button" aria-label="Elimina questa citazione" title="Elimina">×</button>' +
      '</blockquote>'
    ).join("");
  }

  function deleteCitation(id) {
    const citations = readJSON(storageKey("citations"), []);
    const removed = citations.find(item => item.id === id);
    writeJSON(storageKey("citations"), citations.filter(item => item.id !== id));
    if (removed?.sourceId) {
      const highlights = getHighlights();
      const source = highlights.find(item => item.id === removed.sourceId);
      if (source) source.copied = false;
      writeJSON(storageKey("highlights"), highlights);
      updateNewHighlightsCount();
    }
    renderCitations();
  }

  function clearNotebook() {
    const citations = readJSON(storageKey("citations"), []);
    if (!elements.notes.value.trim() && !citations.length) {
      showToast("Il taccuino è già vuoto.");
      return;
    }
    if (!window.confirm("Cancellare appunti e citazioni di questa lezione? Le evidenziazioni nel testo non verranno rimosse.")) return;
    localStorage.removeItem(storageKey("notes"));
    writeJSON(storageKey("citations"), []);
    const highlights = getHighlights().map(item => ({ ...item, copied: false }));
    writeJSON(storageKey("highlights"), highlights);
    loadNotebook();
    updateNewHighlightsCount();
    showToast("Taccuino cancellato.");
  }

  function downloadNotebook() {
    const section = currentSection();
    const citations = readJSON(storageKey("citations"), []);
    const now = new Intl.DateTimeFormat("it-IT", { dateStyle: "long", timeStyle: "short" }).format(new Date());
    const content = [
      "IL ROMANTICISMO — " + section.title,
      now,
      "",
      "APPUNTI DELLO STUDENTE",
      elements.notes.value.trim() || "(nessun appunto)",
      "",
      "CITAZIONI DALLA LEZIONE",
      citations.length ? citations.map(item => item.text).join("\n\n—\n\n") : "(nessuna citazione)",
      ""
    ].join("\n");
    const blob = new Blob(["\ufeff", content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Romanticismo-" + section.id + "-taccuino.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Taccuino esportato in formato TXT.");
  }

  function renderVisuals() {
    const visuals = currentSection().visuals;
    $("#visualThumbs").innerHTML = visuals.map((visual, index) =>
      '<button type="button" data-visual-index="' + index + '" aria-label="Mostra ' + escapeHTML(visual.title) + '">' +
        '<img src="' + visual.src + '" alt="">' +
      '</button>'
    ).join("");
    setVisual(0);
  }

  function setVisual(index) {
    const visuals = currentSection().visuals;
    if (!visuals.length) return;
    state.visual = Math.max(0, Math.min(index, visuals.length - 1));
    const visual = visuals[state.visual];
    $("#contextImage").src = visual.src;
    $("#contextImage").alt = visual.alt;
    $("#contextTitle").textContent = visual.title;
    $("#contextCaption").textContent = visual.caption;
    $("#visualCounter").textContent = (state.visual + 1) + " / " + visuals.length;
    $$("#visualThumbs button").forEach((button, i) => {
      button.classList.toggle("active", i === state.visual);
      button.setAttribute("aria-pressed", i === state.visual ? "true" : "false");
    });
  }

  function observeLessonBlocks() {
    state.visualObserver?.disconnect();
    state.visualObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setVisual(Number(visible.target.dataset.visual || 0));
    }, { root: elements.lessonScroll, threshold: [0.2, 0.45, 0.7], rootMargin: "-12% 0px -48% 0px" });
    $$(".lesson-block", elements.lessonContent).forEach(block => state.visualObserver.observe(block));
  }

  function openCurrentImage() {
    const visual = currentSection().visuals[state.visual];
    $("#imageDialogTitle").textContent = visual.title;
    $("#dialogImage").src = visual.src;
    $("#dialogImage").alt = visual.alt;
    $("#dialogImageCaption").textContent = visual.caption;
    elements.imageDialog.showModal();
  }

  function setMobilePane(name) {
    $$("[data-pane]").forEach(pane => pane.classList.toggle("active-pane", pane.dataset.pane === name));
    $$("[data-mobile-tab]").forEach(button => {
      const active = button.dataset.mobileTab === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function updateReadingProgress() {
    if (elements.study.hidden) return;
    const max = elements.lessonScroll.scrollHeight - elements.lessonScroll.clientHeight;
    const ratio = max > 0 ? Math.max(0, Math.min(1, elements.lessonScroll.scrollTop / max)) : 1;
    $("#readingProgress").style.width = Math.round(ratio * 100) + "%";
    writeJSON(storageKey("progress"), { ratio, completed: ratio >= 0.9, updatedAt: Date.now() });
  }

  function saveReadingPosition() {
    if (elements.study.hidden || !sections.length) return;
    updateReadingProgress();
  }

  function renderResume() {
    const last = readJSON(storageKey("last", ""), null);
    if (!last) {
      $("#resumeCard").hidden = true;
      return;
    }
    const section = sections.find(item => item.id === last.id);
    if (!section) return;
    const progress = readJSON(storageKey("progress", section.id), { ratio: 0 });
    $("#resumeTitle").textContent = section.title;
    $("#resumeDetail").textContent = Math.round((progress.ratio || 0) * 100) + "% della lettura";
    $("#resumeBtn").dataset.section = section.id;
    $("#resumeCard").hidden = false;
  }

  function renderIndexDialog() {
    $("#dialogIndexList").innerHTML = sections.map(section => {
      const progress = readJSON(storageKey("progress", section.id), { ratio: 0, completed: false });
      return '<button type="button" data-dialog-section="' + section.id + '">' +
        '<span class="index-num">' + section.number + '</span>' +
        '<span><strong>' + escapeHTML(section.title) + '</strong><small>' + Math.round((progress.ratio || 0) * 100) + '% letto</small></span>' +
        '<span class="completion-mark">' + (progress.completed ? "✓" : "→") + '</span>' +
      '</button>';
    }).join("");
  }

  function resetAllData() {
    if (!window.confirm("Azzera evidenziazioni, taccuini, progressi e risultati di tutti i test del Romanticismo? Questa operazione non può essere annullata.")) return;
    Object.keys(localStorage).filter(key => key.startsWith(PREFIX)).forEach(key => localStorage.removeItem(key));
    elements.indexDialog.close();
    showCover();
    showToast("Tutti i dati locali del percorso sono stati azzerati.");
  }

  function openStudyPanel(type) {
    const section = currentSection();
    $("#studyDialogKicker").textContent = "Sedimenta · " + section.number;
    if (type === "essentials") {
      $("#studyDialogTitle").textContent = "Saperi irrinunciabili";
      $("#studyDialogBody").innerHTML = '<ul class="essentials-list">' + section.essentials.map(item => "<li>" + escapeHTML(item) + "</li>").join("") + "</ul>";
    } else if (type === "vocab") {
      $("#studyDialogTitle").textContent = "Vocabolario essenziale";
      $("#studyDialogBody").innerHTML = '<dl class="vocab-list">' + section.vocab.map(item =>
        "<div><dt>" + escapeHTML(item[0]) + "</dt><dd>" + escapeHTML(item[1]) + "</dd></div>"
      ).join("") + "</dl>";
    } else {
      $("#studyDialogTitle").textContent = "Test — " + section.title;
      const items = section.quiz.map(item => ({ ...item, sectionId: section.id }));
      renderQuiz(items, section.id, null);
    }
    elements.studyDialog.showModal();
  }

  function renderQuiz(items, key, indices) {
    const selectedIndices = indices || items.map((_, index) => index);
    state.activeQuiz = { items, key, indices: selectedIndices, answers: {}, finalized: false, errors: [] };
    const previous = readJSON(storageKey("quiz-attempts", key), []);
    $("#studyDialogBody").innerHTML =
      '<div class="quiz-intro">Rispondi a ' + selectedIndices.length + (selectedIndices.length === 1 ? " domanda" : " domande") +
      '. Il feedback è immediato. Formula del voto: <strong>voto = max(1, arrotonda(percentuale × 10))</strong>. ' +
      (previous.length ? "Tentativi conservati: " + previous.length + "." : "") + '</div>' +
      '<div class="quiz-list">' + selectedIndices.map((itemIndex, order) => renderQuizQuestion(items[itemIndex], itemIndex, order)).join("") + '</div>' +
      '<div id="quizResultArea"></div>';
  }

  function renderQuizQuestion(item, itemIndex, order) {
    return '<section class="quiz-question" data-quiz-index="' + itemIndex + '">' +
      '<h3>' + (order + 1) + '. ' + escapeHTML(item.q) + '</h3>' +
      '<div class="quiz-options">' + item.options.map((option, optionIndex) =>
        '<button type="button" class="quiz-option" data-option-index="' + optionIndex + '">' +
          '<span class="letter">' + String.fromCharCode(65 + optionIndex) + '</span><span>' + escapeHTML(option) + '</span>' +
        '</button>'
      ).join("") + '</div><div class="question-feedback" hidden></div></section>';
  }

  function answerQuizQuestion(question, optionIndex) {
    if (!state.activeQuiz || question.dataset.answered) return;
    const itemIndex = Number(question.dataset.quizIndex);
    const item = state.activeQuiz.items[itemIndex];
    question.dataset.answered = "true";
    state.activeQuiz.answers[itemIndex] = optionIndex;
    $$(".quiz-option", question).forEach((button, index) => {
      button.disabled = true;
      if (index === item.answer) button.classList.add("correct");
      if (index === optionIndex && index !== item.answer) button.classList.add("wrong");
    });
    const feedback = $(".question-feedback", question);
    const correct = optionIndex === item.answer;
    feedback.hidden = false;
    feedback.innerHTML = "<strong>" + (correct ? "Corretto." : "Da rivedere.") + "</strong> " + escapeHTML(item.feedback);
    const answeredCount = Object.keys(state.activeQuiz.answers).length;
    if (answeredCount === state.activeQuiz.indices.length) finalizeQuiz();
  }

  function finalizeQuiz() {
    if (!state.activeQuiz || state.activeQuiz.finalized) return;
    state.activeQuiz.finalized = true;
    const quiz = state.activeQuiz;
    const correct = quiz.indices.filter(index => quiz.answers[index] === quiz.items[index].answer);
    const errors = quiz.indices.filter(index => quiz.answers[index] !== quiz.items[index].answer);
    quiz.errors = errors;
    const percentage = Math.round((correct.length / quiz.indices.length) * 100);
    const grade = Math.max(1, Math.round((percentage / 100) * 10));
    const attempts = readJSON(storageKey("quiz-attempts", quiz.key), []);
    attempts.push({ at: Date.now(), total: quiz.indices.length, correct: correct.length, percentage, grade, errors });
    writeJSON(storageKey("quiz-attempts", quiz.key), attempts);
    const recovery = errors.length ? '<div class="recovery-list">' + errors.map(index => renderRecovery(quiz.items[index], index)).join("") + "</div>" : "";
    $("#quizResultArea").innerHTML =
      '<section class="quiz-result"><h3>' + (errors.length ? "Risultato e recupero mirato" : "Percorso acquisito") + '</h3>' +
      '<div class="score-grid"><div><strong>' + correct.length + "/" + quiz.indices.length + '</strong><span>Punteggio</span></div>' +
      '<div><strong>' + percentage + '%</strong><span>Percentuale</span></div><div><strong>' + grade + '/10</strong><span>Voto</span></div></div>' +
      (errors.length ? "<p>Qui compaiono esclusivamente i concetti non ancora acquisiti. Il tentativo è stato conservato.</p>" : "<p>Tutte le risposte sono corrette. Il tentativo è stato conservato.</p>") +
      recovery +
      '<div class="quiz-actions">' +
        (errors.length ? '<button type="button" id="retryWrongBtn">Riprova solo le domande sbagliate</button>' : "") +
        '<button type="button" id="restartQuizBtn">Nuovo tentativo completo</button>' +
      '</div></section>';
    $("#quizResultArea").scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function renderRecovery(item, index) {
    const r = item.recovery;
    return '<article class="recovery-card" data-recovery-index="' + index + '">' +
      '<h4>' + escapeHTML(r.concept) + '</h4>' +
      '<p><strong>Chiarimento:</strong> ' + escapeHTML(r.explain) + '</p>' +
      '<p><strong>Esempio:</strong> ' + escapeHTML(r.example) + '</p>' +
      '<p><strong>Domanda di controllo:</strong> ' + escapeHTML(r.retry) + '</p>' +
      '<button type="button" class="text-link" data-recovery-anchor="' + escapeHTML(r.anchor) + '" data-recovery-section="' + escapeHTML(item.sectionId) + '">Torna al punto della lezione</button>' +
    '</article>';
  }

  function retryWrongQuestions() {
    const quiz = state.activeQuiz;
    if (!quiz?.errors.length) return;
    renderQuiz(quiz.items, quiz.key, quiz.errors);
  }

  function restartQuiz() {
    const quiz = state.activeQuiz;
    if (!quiz) return;
    renderQuiz(quiz.items, quiz.key, null);
  }

  function openFinalQuiz() {
    const items = sections.map((section, index) => ({
      ...section.quiz[index % section.quiz.length],
      sectionId: section.id
    }));
    $("#studyDialogKicker").textContent = "Sedimenta · percorso completo";
    $("#studyDialogTitle").textContent = "Verifica finale";
    renderQuiz(items, "finale", null);
    elements.studyDialog.showModal();
  }

  function openMapsGallery() {
    const unique = [];
    sections.flatMap(section => section.visuals).forEach(visual => {
      if (!unique.some(item => item.src === visual.src)) unique.push(visual);
    });
    $("#studyDialogKicker").textContent = "Osserva";
    $("#studyDialogTitle").textContent = "Mappe e schemi";
    $("#studyDialogBody").innerHTML = '<div class="vocab-list">' + unique.map((visual, index) =>
      '<button type="button" class="quiz-option" data-gallery-index="' + index + '">' +
        '<img src="' + visual.src + '" alt="" style="width:76px;height:76px;object-fit:cover;border-radius:8px">' +
        '<span><strong>' + escapeHTML(visual.title) + '</strong><br><small>' + escapeHTML(visual.caption) + '</small></span>' +
      '</button>'
    ).join("") + "</div>";
    elements.studyDialog.showModal();
    $$("#studyDialogBody [data-gallery-index]").forEach(button => button.addEventListener("click", () => {
      const visual = unique[Number(button.dataset.galleryIndex)];
      $("#imageDialogTitle").textContent = visual.title;
      $("#dialogImage").src = visual.src;
      $("#dialogImage").alt = visual.alt;
      $("#dialogImageCaption").textContent = visual.caption;
      elements.imageDialog.showModal();
    }));
  }

  function openRecoveryAnchor(sectionId, anchor) {
    elements.studyDialog.close();
    openSection(sectionId, { anchor });
    showToast("Rileggi questo passaggio, poi riapri il test.");
  }

  function cycleFont() {
    state.fontLevel = (state.fontLevel + 1) % 3;
    document.body.classList.toggle("font-large", state.fontLevel === 1);
    document.body.classList.toggle("font-huge", state.fontLevel === 2);
    writeJSON(storageKey("font", ""), state.fontLevel);
    showToast(["Testo normale", "Testo grande", "Testo molto grande"][state.fontLevel]);
  }

  function toggleTheme() {
    const night = document.body.dataset.theme !== "night";
    document.body.dataset.theme = night ? "night" : "";
    writeJSON(storageKey("theme", ""), night ? "night" : "light");
    showToast(night ? "Tema notte attivo." : "Tema chiaro attivo.");
  }

  function setupInstall() {
    let installPrompt = null;
    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      installPrompt = event;
    });
    $("#installBtn").addEventListener("click", async () => {
      if (installPrompt) {
        installPrompt.prompt();
        await installPrompt.userChoice;
        installPrompt = null;
      } else {
        showToast("Su iPad: Condividi → Aggiungi alla schermata Home.", 3600);
      }
    });
  }

  function setupDialogs() {
    $$("[data-close-dialog]").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
    [elements.indexDialog, elements.studyDialog, elements.imageDialog].forEach(dialog => {
      dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
      });
    });
  }

  function bindEvents() {
    document.addEventListener("selectionchange", captureSelection);
    $("#homeBtn").addEventListener("click", showCover);
    $("#startBtn").addEventListener("click", () => openSection(sections[0].id));
    $("#resumeBtn").addEventListener("click", event => openSection(event.currentTarget.dataset.section));
    $$("[data-section]").forEach(button => button.addEventListener("click", () => openSection(button.dataset.section)));
    $$("[data-action='maps']").forEach(button => button.addEventListener("click", openMapsGallery));
    $$("[data-action='final-test']").forEach(button => button.addEventListener("click", openFinalQuiz));
    $("#indexBtn").addEventListener("click", () => {
      renderIndexDialog();
      elements.indexDialog.showModal();
    });
    $("#dialogIndexList").addEventListener("click", event => {
      const button = event.target.closest("[data-dialog-section]");
      if (!button) return;
      elements.indexDialog.close();
      openSection(button.dataset.dialogSection);
    });
    $("#resetAllBtn").addEventListener("click", resetAllData);
    $("#fontBtn").addEventListener("click", cycleFont);
    $("#themeBtn").addEventListener("click", toggleTheme);
    $("#highlightBtn").addEventListener("click", highlightSelection);
    $("#pasteSelectionBtn").addEventListener("click", pasteSelection);
    $("#pasteHighlightsBtn").addEventListener("click", pasteHighlights);
    $("#clearHighlightsBtn").addEventListener("click", clearHighlights);
    elements.notes.addEventListener("input", saveNotes);
    elements.citations.addEventListener("click", event => {
      const button = event.target.closest("button");
      const citation = button?.closest("[data-citation-id]");
      if (citation) deleteCitation(citation.dataset.citationId);
    });
    $("#downloadNotesBtn").addEventListener("click", downloadNotebook);
    $("#clearNotesBtn").addEventListener("click", clearNotebook);
    $("#expandVisualBtn").addEventListener("click", openCurrentImage);
    $("#visualThumbs").addEventListener("click", event => {
      const button = event.target.closest("[data-visual-index]");
      if (button) setVisual(Number(button.dataset.visualIndex));
    });
    $$("[data-mobile-tab]").forEach(button => button.addEventListener("click", () => setMobilePane(button.dataset.mobileTab)));
    $("#prevLessonBtn").addEventListener("click", () => state.index > 0 && openSection(sections[state.index - 1].id));
    $("#nextLessonBtn").addEventListener("click", () => state.index < sections.length - 1 && openSection(sections[state.index + 1].id));
    elements.lessonScroll.addEventListener("scroll", updateReadingProgress, { passive: true });
    $$("[data-study-panel]").forEach(button => button.addEventListener("click", () => openStudyPanel(button.dataset.studyPanel)));
    $("#studyDialogBody").addEventListener("click", event => {
      const option = event.target.closest(".quiz-option[data-option-index]");
      if (option) answerQuizQuestion(option.closest(".quiz-question"), Number(option.dataset.optionIndex));
      if (event.target.closest("#retryWrongBtn")) retryWrongQuestions();
      if (event.target.closest("#restartQuizBtn")) restartQuiz();
      const recovery = event.target.closest("[data-recovery-anchor]");
      if (recovery) openRecoveryAnchor(recovery.dataset.recoverySection, recovery.dataset.recoveryAnchor);
    });
    window.addEventListener("pagehide", saveReadingPosition);
  }

  function setupBridge() {
    const script = document.createElement("script");
    script.src = new URL("../rete-pwa/bridge.js?v=2", location.href).href;
    script.dataset.ottocentoBridge = "";
    script.dataset.ottocentoApp = "romanticismo";
    script.addEventListener("error", () => console.info("Rete PWA non disponibile: la lezione resta autonoma."));
    document.head.appendChild(script);
  }

  function init() {
    if (!sections.length) {
      document.body.innerHTML = "<p>Contenuti non disponibili.</p>";
      return;
    }
    state.fontLevel = readJSON(storageKey("font", ""), 0);
    document.body.classList.toggle("font-large", state.fontLevel === 1);
    document.body.classList.toggle("font-huge", state.fontLevel === 2);
    if (readJSON(storageKey("theme", ""), "light") === "night") document.body.dataset.theme = "night";
    bindEvents();
    setupDialogs();
    setupInstall();
    renderIndexDialog();
    renderResume();
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(error => console.warn("Service worker:", error)));
    }
    setupBridge();
  }

  init();
})();
