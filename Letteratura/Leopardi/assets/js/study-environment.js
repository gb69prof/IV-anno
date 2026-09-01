(() => {
  "use strict";

  const lessonId = document.body.dataset.lesson;
  const article = document.querySelector(".lesson-article");
  const originalShell = document.querySelector(".lesson-shell, .final-shell");
  const data = window.LEOPARDI_STUDY_DATA?.[lessonId];
  if (!lessonId || !article || !originalShell || !data) return;

  document.body.classList.add("study-active");

  const root = document.body.dataset.root || "./";
  const stateKey = `leopardi.study.v2.${lessonId}`;
  const globalKey = "leopardi.study.preferences.v2";
  const stopwords = new Set(["della", "delle", "degli", "nella", "nelle", "allo", "alla", "come", "dalla", "dello", "leopardi", "introduzione"]);
  const lessonIndex = [
    ["filosofia-base", "Filosofia base e contesto culturale"],
    ["fratture", "Le fratture"],
    ["immagine-mondo", "L’immagine del mondo"],
    ["poetica", "La poetica"],
    ["scritti", "Gli scritti"],
    ["infinito", "L’Infinito"],
    ["bruto-saffo", "Bruto minore e Ultimo canto di Saffo"],
    ["natura-islandese", "Dialogo della Natura e di un Islandese"],
    ["ginestra", "La ginestra"],
    ["siepe-lava", "Dalla siepe alla lava"],
    ["macchina-anima", "Un meccanicismo con l’anima"],
    ["senso-natura", "Consolidamento: senso, natura e pensiero"],
    ["conclusione", "Conclusione generale"],
  ];

  const fallbackState = { note: "", highlights: [], citations: [], quiz: null };
  let state = readJson(stateKey, fallbackState);
  state.highlights = Array.isArray(state.highlights) ? state.highlights : [];
  state.citations = Array.isArray(state.citations) ? state.citations : [];
  let pendingSelection = null;
  let activeMaterial = -1;
  let visualItems = [];
  const lessonTitle = normalize(article.querySelector("h1")?.textContent || "Lezione su Leopardi");
  const lessonNumber = String(lessonIndex.findIndex(([id]) => id === lessonId) + 1).padStart(2, "0");

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === "object" ? value : structuredClone(fallback);
    } catch {
      return { ...fallback };
    }
  }

  function saveState() {
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  function uid() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalize(value = "") {
    return String(value).replace(/\s+/g, " ").trim();
  }

  function showStatus(message) {
    const status = document.querySelector("#selectionStatus");
    if (status) status.textContent = message;
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function extractLearningSections() {
    const children = [...article.children];
    const vocabStart = children.findIndex((node) => /^vocabolario/i.test(normalize(node.textContent)));
    const essentialsStart = children.findIndex((node) => /^saperi irrinunciabili/i.test(normalize(node.textContent)));
    const vocabNodes = vocabStart >= 0
      ? children.slice(vocabStart + 1, essentialsStart >= 0 ? essentialsStart : children.length)
      : [];
    const essentialNodes = essentialsStart >= 0 ? children.slice(essentialsStart + 1) : [];

    [...(vocabStart >= 0 ? children.slice(vocabStart) : [])].forEach((node) => {
      node.hidden = true;
      node.setAttribute("aria-hidden", "true");
    });

    const vocabulary = vocabNodes
      .map((node) => node.textContent.split(/\n+/).map(normalize).filter(Boolean))
      .filter((parts) => parts.length)
      .map((parts) => ({ term: parts[0], definition: parts.slice(1).join(" ") || "Voce essenziale della lezione." }));

    const essentials = essentialNodes
      .map((node) => normalize(node.textContent))
      .filter((text) => text && !/^lo studente deve sapere/i.test(text));

    return {
      vocabulary: vocabulary.length
        ? vocabulary
        : data.vocabulary.map(([term, definition]) => ({ term, definition })),
      essentials: essentials.length
        ? essentials
        : ["Conoscere i nuclei fondamentali della lezione e saperne ricostruire le relazioni."],
    };
  }

  const technicalSource = article.querySelector(".lesson-subtitle");
  if (technicalSource && /\.(docx|txt)$/i.test(normalize(technicalSource.textContent))) {
    technicalSource.classList.add("technical-source");
  }
  article.querySelectorAll("h2").forEach((heading) => {
    if (normalize(heading.textContent) === "l’anti-idillio") heading.textContent = "L’anti-idillio";
  });

  const learning = extractLearningSections();

  function addLessonBrief() {
    if (lessonId === "test-finale" || article.querySelector(".lesson-brief")) return;
    const paragraphs = [...article.children].filter((node) =>
      node.tagName === "P" &&
      !node.hidden &&
      !node.classList.contains("lesson-kicker") &&
      !node.classList.contains("lesson-subtitle") &&
      !node.classList.contains("technical-source")
    );
    const source = paragraphs.at(-1);
    if (!source || normalize(source.textContent).length < 80) return;
    const brief = document.createElement("section");
    brief.className = "lesson-brief";
    brief.setAttribute("aria-label", "La lezione in breve");
    brief.innerHTML = `<small>Sintesi</small><h2>La lezione in breve</h2><p>${escapeHtml(normalize(source.textContent))}</p>`;
    source.insertAdjacentElement("afterend", brief);
  }
  addLessonBrief();
  const oldSidebar = document.querySelector(".lesson-sidebar");
  const oldMaterials = oldSidebar ? [...oldSidebar.children] : [];
  originalShell.insertAdjacentHTML("beforebegin", `
    <section id="leopardiStudyApp" class="leopardi-study-app" aria-label="Ambiente digitale di studio">
      <header class="study-topbar">
        <a class="study-home" href="${root}index.html" aria-label="Torna alla copertina">← <span>Home</span></a>
        <div class="study-heading"><small>Giacomo Leopardi · ${lessonNumber}</small><h1>${escapeHtml(article.querySelector("h1")?.textContent || "Lezione")}</h1></div>
        <div class="study-actions">
          <button type="button" id="studyThemeBtn" aria-label="Cambia tema">◐</button>
          <button type="button" id="studyFontBtn" aria-label="Cambia dimensione del testo">A</button>
          <button type="button" data-open-dialog="studyIndexDialog">Indice</button>
        </div>
        <nav class="mobile-study-tabs" aria-label="Pannelli della lezione">
          <button type="button" class="active" data-mobile-panel="read">Lezione</button>
          <button type="button" data-mobile-panel="visual">Apparato</button>
          <button type="button" data-mobile-panel="notes">Taccuino</button>
        </nav>
      </header>
      <div class="study-grid" data-visible-panel="read">
        <section class="reading-pane" tabindex="0" aria-label="Testo della lezione">
          <div class="reading-tools" role="toolbar" aria-label="Strumenti di lettura">
            <p id="selectionStatus" role="status" aria-live="polite">Seleziona un passo, poi evidenzialo.</p>
            <button type="button" id="highlightSelection" disabled>Evidenzia selezione</button>
            <button type="button" id="addSelection" disabled>Incolla questa selezione</button>
            <button type="button" id="addHighlights" disabled>Incolla evidenziati <span id="newHighlightCount">0</span></button>
            <button type="button" id="clearHighlights" class="quiet" disabled>Rimuovi evidenziature</button>
          </div>
          <div id="lessonContent" class="lesson-content"></div>
        </section>
        <aside class="study-sidebar" aria-label="Apparato visivo e taccuino">
          <section class="visual-panel" aria-labelledby="visualPanelTitle">
            <header><small>Osserva mentre leggi</small><h2 id="visualPanelTitle">Apparato contestuale</h2></header>
            <div id="visualStage" class="visual-stage"></div>
            <p id="visualCaption" class="visual-caption" aria-live="polite"></p>
            <div id="visualChoices" class="visual-choices" aria-label="Materiali collegati"></div>
          </section>
          <section class="notebook-panel" aria-labelledby="notebookTitle">
            <header><small>Elabora</small><h2 id="notebookTitle">Taccuino</h2><span id="autosaveState">Salvataggio automatico</span></header>
            <label for="notebookText">Appunti personali</label>
            <textarea id="notebookText" rows="7" placeholder="Scrivi osservazioni, domande e collegamenti personali…"></textarea>
            <section class="citation-area" aria-labelledby="citationsTitle"><h3 id="citationsTitle">Citazioni dalla lezione</h3><div id="citationList"></div><p id="emptyCitations">Evidenzia i passaggi che vuoi conservare, poi usa “Incolla evidenziati”.</p></section>
            <div class="notebook-actions"><button type="button" id="downloadNotes">Scarica TXT</button><button type="button" id="clearNotebook" class="danger">Cancella</button></div>
          </section>
        </aside>
      </div>
      <nav class="study-bottombar" aria-label="Strumenti per sedimentare">
        <button type="button" data-learning="essentials">Saperi irrinunciabili</button>
        <button type="button" data-learning="vocabulary">Vocabolario</button>
        <button type="button" data-learning="quiz">Test</button>
      </nav>
    </section>
    <dialog id="studyIndexDialog" class="study-dialog index-dialog"><button type="button" class="dialog-close" data-close-dialog aria-label="Chiudi">×</button><header><small>Intero percorso</small><h2>Indice</h2></header><nav class="full-index"></nav></dialog>
    <dialog id="learningDialog" class="study-dialog learning-dialog"><button type="button" class="dialog-close" data-close-dialog aria-label="Chiudi">×</button><header><small id="learningKicker"></small><h2 id="learningTitle"></h2></header><div id="learningContent"></div></dialog>
  `);

  const app = document.querySelector("#leopardiStudyApp");
  const lessonContent = app.querySelector("#lessonContent");
  lessonContent.append(article);
  originalShell.hidden = true;
  originalShell.setAttribute("aria-hidden", "true");

  setupIndex();
  setupPreferences();
  setupMaterials(oldMaterials);
  setupTextBlocks();
  setupNotebook();
  restoreHighlights();
  setupSelectionTools();
  setupLearningDialogs();
  setupMobilePanels();
  updateHighlightControls();

  function setupIndex() {
    const nav = document.querySelector("#studyIndexDialog .full-index");
    nav.innerHTML = lessonIndex.map(([id, title], index) => `
      <a href="${root}pagine/${id}.html" ${id === lessonId ? 'aria-current="page"' : ""}>
        <span>${index + 1}</span><b>${escapeHtml(title)}</b>
      </a>`).join("") + `<a href="${root}test-finale.html"><span>✓</span><b>Test finale</b></a>`;
  }

  function setupPreferences() {
    const prefs = readJson(globalKey, { theme: "light", font: "medium" });
    prefs.theme = "light";
    document.documentElement.dataset.studyTheme = "light";
    document.documentElement.dataset.studyFont = prefs.font;
    localStorage.setItem(globalKey, JSON.stringify(prefs));
    document.querySelector("#studyFontBtn").addEventListener("click", () => {
      prefs.font = prefs.font === "medium" ? "large" : prefs.font === "large" ? "extra" : "medium";
      document.documentElement.dataset.studyFont = prefs.font;
      localStorage.setItem(globalKey, JSON.stringify(prefs));
    });
  }

  function setupMaterials(nodes) {
    visualItems = nodes
      .filter((node) => !node.classList.contains("notes-tool"))
      .map((node, index) => {
        const title = normalize(node.querySelector("h2, figcaption")?.textContent || (index ? `Materiale ${index + 1}` : "Mappa della lezione"));
        const words = title.toLocaleLowerCase("it").split(/[^a-zà-ù0-9]+/).filter((word) => word.length > 3 && !stopwords.has(word));
        return { node, title, words };
      })
      .sort((a, b) => Number(b.node.classList.contains("lesson-map-card")) - Number(a.node.classList.contains("lesson-map-card")));
    if (!visualItems.length) return;
    const choices = document.querySelector("#visualChoices");
    choices.hidden = true;
    document.querySelector("#visualStage").replaceChildren(...visualItems.map((item) => item.node));
    showMaterial(0, false);
  }

  function showMaterial(index, automatic = true) {
    if (!visualItems[index] || index === activeMaterial) return;
    activeMaterial = index;
    const stage = document.querySelector("#visualStage");
    visualItems.forEach((item, itemIndex) => item.node.classList.toggle("is-contextual", itemIndex === index));
    document.querySelector("#visualCaption").textContent = `${visualItems[index].title}${automatic ? " · collegato al punto che stai leggendo" : ""}`;
    const target = Math.max(0, visualItems[index].node.offsetTop - stage.offsetTop - 8);
    stage.scrollTo({ top: target, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function setupTextBlocks() {
    const blocks = [...article.children].filter((node) => !node.hidden && /^(H2|H3|P|SECTION|ASIDE|BLOCKQUOTE)$/.test(node.tagName));
    blocks.forEach((node, index) => node.dataset.studyBlock = String(index));
    if (!("IntersectionObserver" in window) || visualItems.length < 2) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries.filter((item) => item.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!entry) return;
      const text = normalize(entry.target.textContent).toLocaleLowerCase("it");
      let best = 0;
      let score = 0;
      visualItems.forEach((item, index) => {
        const next = item.words.reduce((total, word) => total + (text.includes(word) ? 1 : 0), 0);
        if (next > score) { score = next; best = index; }
      });
      if (score) showMaterial(best, true);
    }, { root: document.querySelector(".reading-pane"), threshold: [0.25, 0.6] });
    blocks.forEach((block) => observer.observe(block));
  }

  function acceptedTextNodes() {
    const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!node.nodeValue || !parent || parent.closest("[hidden], button, textarea, script, style")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function canonicalText() {
    return acceptedTextNodes().map((node) => node.nodeValue).join("");
  }

  function pointOffset(target, offset) {
    let total = 0;
    for (const node of acceptedTextNodes()) {
      if (node === target) return total + offset;
      total += node.nodeValue.length;
    }
    return null;
  }

  function selectionSnapshot() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return null;
    const range = selection.getRangeAt(0);
    if (!article.contains(range.commonAncestorContainer)) return null;
    const start = pointOffset(range.startContainer, range.startOffset);
    const end = pointOffset(range.endContainer, range.endOffset);
    if (start === null || end === null || start === end) return null;
    const from = Math.min(start, end);
    const to = Math.max(start, end);
    const excerpt = normalize(canonicalText().slice(from, to));
    return excerpt ? { start: from, end: to, excerpt } : null;
  }

  function setupSelectionTools() {
    const capture = () => {
      const snapshot = selectionSnapshot();
      if (snapshot) pendingSelection = snapshot;
      const enabled = Boolean(pendingSelection);
      document.querySelector("#highlightSelection").disabled = !enabled;
      document.querySelector("#addSelection").disabled = !enabled;
      if (enabled) showStatus(`Selezione pronta: ${pendingSelection.excerpt.slice(0, 90)}${pendingSelection.excerpt.length > 90 ? "…" : ""}`);
    };
    document.addEventListener("selectionchange", capture);
    article.addEventListener("pointerup", capture);
    article.addEventListener("keyup", capture);
    document.querySelector(".reading-tools").addEventListener("pointerdown", (event) => event.preventDefault());
    document.querySelector("#highlightSelection").addEventListener("click", addHighlight);
    document.querySelector("#addSelection").addEventListener("click", addCurrentSelection);
    document.querySelector("#addHighlights").addEventListener("click", addNewHighlights);
    document.querySelector("#clearHighlights").addEventListener("click", clearHighlights);
  }

  function addHighlight() {
    if (!pendingSelection) return;
    const overlaps = state.highlights.some((item) => pendingSelection.start < item.end && pendingSelection.end > item.start);
    if (overlaps) {
      showStatus("Questa selezione si sovrappone a un’evidenziazione già salvata.");
      return;
    }
    state.highlights.push({ id: uid(), ...pendingSelection, createdAt: new Date().toISOString() });
    saveState();
    restoreHighlights();
    pendingSelection = null;
    window.getSelection()?.removeAllRanges();
    showStatus("Passo evidenziato e salvato per questa lezione.");
    updateHighlightControls();
  }

  function unwrapHighlights() {
    [...article.querySelectorAll("mark.student-highlight")].forEach((mark) => mark.replaceWith(...mark.childNodes));
    article.normalize();
  }

  function wrapHighlight(highlight) {
    const nodes = acceptedTextNodes();
    let cursor = 0;
    nodes.forEach((node) => {
      const nodeStart = cursor;
      const nodeEnd = cursor + node.nodeValue.length;
      cursor = nodeEnd;
      const start = Math.max(highlight.start, nodeStart);
      const end = Math.min(highlight.end, nodeEnd);
      if (end <= start) return;
      const range = document.createRange();
      range.setStart(node, start - nodeStart);
      range.setEnd(node, end - nodeStart);
      const mark = document.createElement("mark");
      mark.className = "student-highlight";
      mark.dataset.highlightId = highlight.id;
      try { range.surroundContents(mark); } catch { /* un singolo nodo testuale non produce strutture parziali */ }
    });
  }

  function restoreHighlights() {
    unwrapHighlights();
    [...state.highlights].sort((a, b) => b.start - a.start).forEach(wrapHighlight);
  }

  function citationExists(sourceKey) {
    return state.citations.some((citation) => citation.sourceKey === sourceKey);
  }

  function addCitation(text, sourceKey) {
    if (!text || citationExists(sourceKey)) return false;
    state.citations.push({ id: uid(), text: normalize(text), sourceKey, lessonTitle, createdAt: new Date().toISOString() });
    return true;
  }

  function addCurrentSelection() {
    if (!pendingSelection) return;
    const key = `selection:${pendingSelection.start}:${pendingSelection.end}`;
    const added = addCitation(pendingSelection.excerpt, key);
    saveState();
    renderCitations();
    showStatus(added ? "Selezione inserita nelle citazioni del taccuino." : "Questa selezione è già nel taccuino.");
    pendingSelection = null;
    window.getSelection()?.removeAllRanges();
  }

  function addNewHighlights() {
    let added = 0;
    state.highlights.forEach((highlight) => {
      if (addCitation(highlight.excerpt, `highlight:${highlight.id}`)) added += 1;
    });
    saveState();
    renderCitations();
    showStatus(added ? `${added} ${added === 1 ? "passaggio inserito" : "passaggi inseriti"} nel taccuino.` : "Tutti gli evidenziati sono già nel taccuino.");
    updateHighlightControls();
  }

  function clearHighlights() {
    if (!state.highlights.length) return;
    state.highlights = [];
    saveState();
    restoreHighlights();
    updateHighlightControls();
    showStatus("Evidenziazioni rimosse. Le citazioni conservate nel taccuino non sono state cancellate.");
  }

  function updateHighlightControls() {
    const newCount = state.highlights.filter((item) => !citationExists(`highlight:${item.id}`)).length;
    document.querySelector("#newHighlightCount").textContent = String(newCount);
    document.querySelector("#addHighlights").disabled = newCount === 0;
    document.querySelector("#clearHighlights").disabled = state.highlights.length === 0;
  }

  function setupNotebook() {
    const textarea = document.querySelector("#notebookText");
    textarea.value = state.note || "";
    let timer;
    textarea.addEventListener("input", () => {
      state.note = textarea.value;
      clearTimeout(timer);
      document.querySelector("#autosaveState").textContent = "Salvataggio…";
      timer = setTimeout(() => {
        saveState();
        document.querySelector("#autosaveState").textContent = "Salvato automaticamente";
      }, 250);
    });
    document.querySelector("#citationList").addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-citation]");
      if (!button) return;
      state.citations = state.citations.filter((item) => item.id !== button.dataset.removeCitation);
      saveState();
      renderCitations();
      updateHighlightControls();
    });
    document.querySelector("#downloadNotes").addEventListener("click", downloadNotes);
    document.querySelector("#clearNotebook").addEventListener("click", () => {
      if (!confirm("Cancellare appunti e citazioni di questa lezione? Le evidenziazioni resteranno nel testo.")) return;
      state.note = "";
      state.citations = [];
      textarea.value = "";
      saveState();
      renderCitations();
      updateHighlightControls();
    });
    renderCitations();
  }

  function renderCitations() {
    const list = document.querySelector("#citationList");
    list.innerHTML = state.citations.map((citation) => `
      <blockquote><p>${escapeHtml(citation.text)}</p><small class="citation-source">${escapeHtml(citation.lessonTitle || lessonTitle)}</small><button type="button" data-remove-citation="${citation.id}" aria-label="Elimina questa citazione">Elimina</button></blockquote>`).join("");
    document.querySelector("#emptyCitations").hidden = state.citations.length > 0;
  }

  function downloadNotes() {
    state.note = document.querySelector("#notebookText").value;
    saveState();
    const title = normalize(article.querySelector("h1")?.textContent || "Lezione su Leopardi");
    const citations = state.citations.map((item) => `[${item.lessonTitle || lessonTitle}]\n${item.text}`).join("\n\n");
    const content = `${title}\n${new Date().toLocaleString("it-IT")}\n\nAPPUNTI DELLO STUDENTE\n${state.note || "—"}\n\nCITAZIONI DALLA LEZIONE\n${citations || "—"}\n`;
    const blob = new Blob(["\ufeff", content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `appunti-leopardi-${lessonId}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  }

  function setupLearningDialogs() {
    document.addEventListener("click", (event) => {
      const opener = event.target.closest("[data-open-dialog]");
      if (opener) openDialog(document.getElementById(opener.dataset.openDialog));
      const close = event.target.closest("[data-close-dialog]");
      if (close) closeDialog(close.closest("dialog"));
      const learningButton = event.target.closest("[data-learning]");
      if (learningButton) renderLearning(learningButton.dataset.learning);
    });
    document.querySelectorAll(".study-dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog(dialog);
    }));
  }

  function renderLearning(kind) {
    const dialog = document.querySelector("#learningDialog");
    const title = dialog.querySelector("#learningTitle");
    const kicker = dialog.querySelector("#learningKicker");
    const content = dialog.querySelector("#learningContent");
    if (kind === "essentials") {
      kicker.textContent = "Sedimenta";
      title.textContent = "Saperi irrinunciabili";
      content.innerHTML = `<div class="essentials-list">${learning.essentials.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>`;
    } else if (kind === "vocabulary") {
      kicker.textContent = "Comprendi le parole";
      title.textContent = "Vocabolario";
      content.innerHTML = `<dl class="vocabulary-list">${learning.vocabulary.map((item) => `<div><dt>${escapeHtml(item.term)}</dt><dd>${escapeHtml(item.definition)}</dd></div>`).join("")}</dl>`;
    } else {
      kicker.textContent = "Verifica e recupera";
      title.textContent = lessonId === "test-finale" ? "Test finale" : "Test della lezione";
      renderQuiz(content);
    }
    openDialog(dialog);
  }

  function threeOptions(question) {
    const indices = question.options.map((_, index) => index);
    const wrong = indices.filter((index) => index !== question.answer).slice(0, 2);
    return indices.filter((index) => index === question.answer || wrong.includes(index));
  }

  function recoveryTarget(question) {
    const words = normalize(`${question.question} ${question.recovery}`)
      .toLocaleLowerCase("it")
      .split(/[^a-zà-ù0-9]+/)
      .filter((word) => word.length > 4 && !stopwords.has(word));
    const blocks = [...article.querySelectorAll("[data-study-block]")].filter((node) => !node.hidden);
    let best = blocks[0] || article.querySelector("h2, p");
    let bestScore = -1;
    blocks.forEach((node) => {
      const text = normalize(node.textContent).toLocaleLowerCase("it");
      const score = words.reduce((total, word) => total + (text.includes(word) ? 1 : 0), 0);
      if (score > bestScore) { bestScore = score; best = node; }
    });
    return best;
  }

  function renderQuiz(container, onlyIndices = null) {
    const indices = onlyIndices || data.quiz.map((_, index) => index);
    container.innerHTML = `
      <form id="studyQuiz" class="study-quiz">
        ${indices.map((questionIndex) => {
          const question = data.quiz[questionIndex];
          return `<fieldset data-question="${questionIndex}"><legend>${escapeHtml(question.question)}</legend>${threeOptions(question).map((optionIndex) => `<label><input type="radio" name="q-${questionIndex}" value="${optionIndex}"><span>${escapeHtml(question.options[optionIndex])}</span></label>`).join("")}<div class="question-feedback" hidden></div></fieldset>`;
        }).join("")}
        <button type="submit">Correggi il test</button>
        <p class="grade-formula">Voto = risposte corrette ÷ domande totali × 10.</p>
        <div id="quizReport" aria-live="polite"></div>
      </form>`;
    const form = container.querySelector("#studyQuiz");
    form.addEventListener("click", (event) => {
      const reread = event.target.closest("[data-reread-question]");
      if (!reread) return;
      const question = data.quiz[Number(reread.dataset.rereadQuestion)];
      const target = recoveryTarget(question);
      closeDialog(document.querySelector("#learningDialog"));
      if (!target) return;
      target.classList.add("recovery-focus");
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => target.classList.remove("recovery-focus"), 2600);
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let correct = 0;
      const wrong = [];
      indices.forEach((questionIndex) => {
        const question = data.quiz[questionIndex];
        const selected = form.querySelector(`input[name="q-${questionIndex}"]:checked`);
        const selectedIndex = selected ? Number(selected.value) : -1;
        const ok = selectedIndex === question.answer;
        if (ok) correct += 1; else wrong.push(questionIndex);
        const fieldset = form.querySelector(`[data-question="${questionIndex}"]`);
        fieldset.classList.toggle("is-correct", ok);
        fieldset.classList.toggle("is-wrong", !ok);
        const feedback = fieldset.querySelector(".question-feedback");
        feedback.hidden = false;
        feedback.innerHTML = ok
          ? `<strong>Corretta.</strong> La risposta individua il nucleo verificato dalla domanda.`
          : `<strong>Da recuperare.</strong> Risposta corretta: ${escapeHtml(question.options[question.answer])}.<br><span>${escapeHtml(question.recovery)}</span><br><button type="button" class="recovery-link" data-reread-question="${questionIndex}">Rileggi il punto collegato</button>`;
      });
      const percent = Math.round((correct / indices.length) * 100);
      const grade = ((correct / indices.length) * 10).toFixed(1).replace(".", ",");
      state.quiz = { correct, total: indices.length, percent, grade, wrong, date: new Date().toISOString() };
      saveState();
      form.querySelector("#quizReport").innerHTML = `<section class="quiz-summary"><h3>Risultato</h3><p><b>${correct}/${indices.length}</b> · ${percent}% · voto <b>${grade}/10</b></p>${wrong.length ? `<button type="button" id="retryWrong">Riprova soltanto le risposte errate</button>` : "<p>Tutte le risposte sono corrette.</p>"}</section>`;
      form.querySelector("#retryWrong")?.addEventListener("click", () => renderQuiz(container, wrong));
    });
  }

  function setupMobilePanels() {
    const grid = document.querySelector(".study-grid");
    document.querySelector(".mobile-study-tabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-mobile-panel]");
      if (!button) return;
      grid.dataset.visiblePanel = button.dataset.mobilePanel;
      document.querySelectorAll("[data-mobile-panel]").forEach((item) => item.classList.toggle("active", item === button));
    });
  }
})();
