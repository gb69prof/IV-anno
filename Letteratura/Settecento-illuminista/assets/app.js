(() => {
  "use strict";

  const DATA = window.SETTECENTO_DATA;
  const KEY = "settecento:";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const els = {
    studyApp: $("#studyApp"), studyGrid: $("#studyGrid"), readingPane: $("#readingPane"),
    content: $("#lessonContent"), studyTitle: $("#studyTitle"), sectionLabel: $("#studySectionLabel"),
    eyebrow: $("#readingEyebrow"), movementTitle: $("#readingMovementTitle"), question: $("#readingQuestion"),
    selectionStatus: $("#selectionStatus"), highlightSelection: $("#highlightSelection"),
    addSelection: $("#addSelection"), addHighlights: $("#addHighlights"), highlightCount: $("#highlightCount"),
    clearHighlights: $("#clearHighlights"), notebook: $("#notebookText"), citationList: $("#citationList"),
    emptyCitations: $("#emptyCitations"), autosave: $("#autosaveState"), readingBar: $("#readingBar"),
    contextImage: $("#contextImage"), contextCaption: $("#contextCaption"), visualChoices: $("#visualChoices"),
    previous: $("#previousLesson"), next: $("#nextLesson"), toast: $("#toast")
  };

  let currentLesson = null;
  let currentText = "";
  let currentSelection = null;
  let noteTimer = null;
  let zoom = 1;
  let toastTimer = null;
  let routeToken = 0;
  let activeVisualId = "";

  const visualStages = {
    1: {src:"assets/images/visual-mondo.svg",label:"Mondo precedente",caption:"L’ordine ricevuto assegna identità, ruoli e gerarchie."},
    2: {src:"assets/images/visual-fratture.svg",label:"Fratture",caption:"L’esperienza mette in crisi ciò che sembrava naturale e immutabile."},
    3: {src:"assets/images/visual-immagine.svg",label:"Immagine del mondo",caption:"La crisi produce un nuovo modo di vedere uomo, società e libertà."},
    4: {src:"assets/images/visual-poetica.svg",label:"Poetica",caption:"La nuova visione cerca una forma letteraria capace di renderla visibile."},
    5: {src:"assets/images/visual-opere.svg",label:"Opere",caption:"Nelle opere la poetica diventa azione, forma e conflitto."},
    6: {src:"assets/images/visual-conclusione.svg",label:"Conclusione",caption:"La libertà settecentesca consegna all’Ottocento una domanda ancora aperta."}
  };

  function storageGet(name, fallback) {
    try {
      const value = localStorage.getItem(KEY + name);
      return value === null ? fallback : JSON.parse(value);
    } catch (_) { return fallback; }
  }

  function storageSet(name, value) {
    try { localStorage.setItem(KEY + name, JSON.stringify(value)); } catch (_) {}
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.hidden = false;
    toastTimer = setTimeout(() => { els.toast.hidden = true; }, 2600);
  }

  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (id === "notesDialog") renderNotesOverview();
    if (!dialog.open) dialog.showModal();
  }

  function closeDialogs() {
    $$("dialog[open]").forEach(dialog => dialog.close());
  }

  function initCover() {
    const maps = $("#mapsGrid");
    maps.innerHTML = DATA.lessons.map(lesson => `
      <article class="map-card">
        <button type="button" class="image-open" data-image="${lesson.map}" data-alt="${escapeHTML(lesson.mapAlt)}" data-caption="${escapeHTML(lesson.title + " — " + lesson.subtitle)}">
          <img src="${lesson.mapPreview}" width="1672" height="941" loading="lazy" alt="${escapeHTML(lesson.mapAlt)}">
        </button>
        <div><h3>${escapeHTML(lesson.title)}</h3><p>${escapeHTML(lesson.subtitle)}</p></div>
      </article>`).join("");

    $("#fullIndex").innerHTML = DATA.lessons.map(lesson => `
      <a href="#${lesson.id}"><b>${lesson.number}</b><span>${escapeHTML(lesson.title)}<small>${escapeHTML(lesson.subtitle)}</small></span></a>
    `).join("") + '<a href="#mappe"><b>◎</b><span>Mappe concettuali</span></a>';

    $$(".image-open", maps).forEach(button => button.addEventListener("click", () => {
      openImage(button.dataset.image, button.dataset.alt, button.dataset.caption);
    }));
  }

  async function route() {
    const token = ++routeToken;
    const hash = location.hash.replace("#", "") || "home";
    const lesson = DATA.lessons.find(item => item.id === hash);
    closeDialogs();

    if (lesson) {
      document.body.classList.remove("cover-visible");
      els.studyApp.hidden = false;
      await openLesson(lesson, token);
      return;
    }

    currentLesson = null;
    document.body.classList.add("cover-visible");
    els.studyApp.hidden = true;
    if (hash === "mappe") requestAnimationFrame(() => $("#mappe")?.scrollIntoView({block:"start"}));
  }

  async function openLesson(lesson, token) {
    currentLesson = lesson;
    storageSet("lastLesson", lesson.id);
    els.studyTitle.textContent = lesson.title;
    els.sectionLabel.textContent = "Lezione " + lesson.number;
    els.eyebrow.textContent = lesson.subtitle;
    els.movementTitle.textContent = lesson.title;
    els.question.textContent = lesson.question;
    els.content.innerHTML = '<p>Caricamento della lezione…</p>';
    els.readingPane.scrollTop = 0;
    currentSelection = null;
    updateSelectionButtons();

    try {
      const response = await fetch(lesson.source);
      if (!response.ok) throw new Error("HTTP " + response.status);
      const text = (await response.text()).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
      if (token !== routeToken) return;
      currentText = text;
      renderLessonText(text);
      restoreHighlights();
      loadNotebook();
      updateSequence();
      updateVisual(1);
      updateScrollState();
      els.readingPane.focus({preventScroll:true});
    } catch (error) {
      els.content.innerHTML = '<p role="alert">La lezione non è disponibile. Ricarica la pagina o verifica la connessione al primo accesso.</p>';
      console.error(error);
    }
  }

  function renderLessonText(text) {
    const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
    const output = [];
    let skipQuestion = false;

    lines.forEach((line, index) => {
      if (index < 2) return;
      if (line === "Domanda generatrice") { skipQuestion = true; return; }
      if (skipQuestion) { skipQuestion = false; return; }

      const numbered = line.match(/^(\d+)\.\s+(.+)$/);
      if (numbered) {
        output.push(`<h2 id="section-${numbered[1]}" data-stage="${numbered[1]}">${escapeHTML(numbered[2])}</h2>\n`);
        return;
      }

      const next = lines[index + 1] || "";
      const shortHeading = line.length < 72 && !/[.!?;:]$/.test(line) && next.length > line.length;
      if (shortHeading) output.push(`<h3>${escapeHTML(line)}</h3>\n`);
      else output.push(`<p>${escapeHTML(line)}</p>\n`);
    });

    els.content.innerHTML = output.join("");
  }

  function highlightsKey() { return "highlights:" + currentLesson.id; }
  function notesKey() { return "notes:" + currentLesson.id; }
  function citationsKey() { return "citations:" + currentLesson.id; }

  function getHighlights() { return currentLesson ? storageGet(highlightsKey(), []) : []; }
  function getCitations() { return currentLesson ? storageGet(citationsKey(), []) : []; }

  function captureSelection() {
    if (!currentLesson) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!els.content.contains(range.commonAncestorContainer)) return clearCapturedSelection();

    const prefix = document.createRange();
    prefix.selectNodeContents(els.content);
    try { prefix.setEnd(range.startContainer, range.startOffset); }
    catch (_) { return clearCapturedSelection(); }

    const text = selection.toString().replace(/\s+/g, " ").trim();
    if (!text) return clearCapturedSelection();
    const start = prefix.toString().length;
    currentSelection = {start, end:start + range.toString().length, text};
    els.selectionStatus.textContent = "Selezione pronta: “" + text.slice(0, 90) + (text.length > 90 ? "…" : "") + "”";
    updateSelectionButtons();
  }

  function clearCapturedSelection() {
    currentSelection = null;
    if (els.selectionStatus) els.selectionStatus.textContent = "Seleziona un passo, poi evidenzialo.";
    updateSelectionButtons();
  }

  function updateSelectionButtons() {
    if (!els.highlightSelection) return;
    els.highlightSelection.disabled = !currentSelection;
    els.addSelection.disabled = !currentSelection;
    const highlights = getHighlights();
    const citations = getCitations();
    const copied = new Set(citations.map(item => item.sourceHighlightId).filter(Boolean));
    const pending = highlights.filter(item => !copied.has(item.id));
    els.addHighlights.disabled = pending.length === 0;
    els.highlightCount.textContent = String(pending.length);
    els.clearHighlights.disabled = highlights.length === 0;
  }

  function addHighlight() {
    if (!currentSelection || !currentLesson) return;
    const highlights = getHighlights();
    const overlaps = highlights.some(item => currentSelection.start < item.end && currentSelection.end > item.start);
    if (overlaps) return showToast("Questa selezione si sovrappone a un’evidenziazione esistente.");
    highlights.push({...currentSelection,id:"h-" + Date.now()});
    highlights.sort((a,b) => a.start - b.start);
    storageSet(highlightsKey(), highlights);
    renderLessonText(currentText);
    applyHighlights(highlights);
    window.getSelection()?.removeAllRanges();
    clearCapturedSelection();
    updateSelectionButtons();
    showToast("Passaggio evidenziato.");
  }

  function applyHighlights(highlights) {
    if (!currentLesson) return;
    const walker = document.createTreeWalker(els.content, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    let global = 0;

    nodes.forEach(textNode => {
      const original = textNode.nodeValue;
      const nodeStart = global;
      const nodeEnd = global + original.length;
      global = nodeEnd;
      const cuts = highlights
        .filter(item => item.start < nodeEnd && item.end > nodeStart)
        .map(item => ({start:Math.max(0,item.start-nodeStart),end:Math.min(original.length,item.end-nodeStart),id:item.id}))
        .sort((a,b) => a.start-b.start);
      if (!cuts.length) return;

      const fragment = document.createDocumentFragment();
      let cursor = 0;
      cuts.forEach(cut => {
        if (cut.start > cursor) fragment.append(document.createTextNode(original.slice(cursor,cut.start)));
        const mark = document.createElement("mark");
        mark.className = "user-highlight";
        mark.dataset.highlightId = cut.id;
        mark.textContent = original.slice(cut.start,cut.end);
        fragment.append(mark);
        cursor = cut.end;
      });
      if (cursor < original.length) fragment.append(document.createTextNode(original.slice(cursor)));
      textNode.replaceWith(fragment);
    });
  }

  function restoreHighlights() {
    const highlights = getHighlights();
    applyHighlights(highlights);
    updateSelectionButtons();
  }

  function clearHighlights() {
    if (!currentLesson || !confirm("Rimuovere tutte le evidenziazioni di questa lezione? Le citazioni già nel taccuino resteranno conservate.")) return;
    storageSet(highlightsKey(), []);
    renderLessonText(currentText);
    updateSelectionButtons();
    showToast("Evidenziazioni rimosse; le citazioni sono rimaste nel taccuino.");
  }

  function addCitation(text, sourceHighlightId = null) {
    if (!currentLesson || !text) return false;
    const citations = getCitations();
    if (sourceHighlightId && citations.some(item => item.sourceHighlightId === sourceHighlightId)) return false;
    if (!sourceHighlightId && citations.some(item => item.text === text)) return false;
    citations.push({id:"c-" + Date.now() + "-" + Math.random().toString(36).slice(2,7),text,sourceHighlightId});
    storageSet(citationsKey(), citations);
    renderCitations();
    updateSelectionButtons();
    return true;
  }

  function addCurrentSelection() {
    if (!currentSelection) return;
    const added = addCitation(currentSelection.text);
    window.getSelection()?.removeAllRanges();
    clearCapturedSelection();
    showToast(added ? "Selezione incollata nel taccuino." : "Il passaggio è già nel taccuino.");
  }

  function addPendingHighlights() {
    const citations = getCitations();
    const copied = new Set(citations.map(item => item.sourceHighlightId).filter(Boolean));
    const pending = getHighlights().filter(item => !copied.has(item.id));
    let added = 0;
    pending.forEach(item => { if (addCitation(item.text, item.id)) added++; });
    showToast(added ? added + " passaggi incollati nel taccuino." : "Nessun nuovo evidenziato.");
  }

  function loadNotebook() {
    els.notebook.value = storageGet(notesKey(), "");
    renderCitations();
  }

  function saveNotebook() {
    if (!currentLesson) return;
    storageSet(notesKey(), els.notebook.value);
    els.autosave.textContent = "Salvato";
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => { els.autosave.textContent = "Salvataggio automatico"; }, 1200);
  }

  function renderCitations() {
    const citations = getCitations();
    els.emptyCitations.hidden = citations.length > 0;
    els.citationList.innerHTML = citations.map(item => `
      <article class="citation-item"><p>${escapeHTML(item.text)}</p><button type="button" data-remove-citation="${item.id}" aria-label="Elimina questa citazione">×</button></article>
    `).join("");
    $$("[data-remove-citation]", els.citationList).forEach(button => button.addEventListener("click", () => {
      const next = getCitations().filter(item => item.id !== button.dataset.removeCitation);
      storageSet(citationsKey(), next);
      renderCitations();
      updateSelectionButtons();
    }));
  }

  function clearNotebook() {
    if (!currentLesson || !confirm("Cancellare appunti e citazioni di questa lezione? Le evidenziazioni nel testo non saranno rimosse.")) return;
    storageSet(notesKey(), "");
    storageSet(citationsKey(), []);
    els.notebook.value = "";
    renderCitations();
    updateSelectionButtons();
    showToast("Taccuino cancellato.");
  }

  function downloadNotes() {
    if (!currentLesson) return;
    const citations = getCitations();
    const now = new Intl.DateTimeFormat("it-IT",{dateStyle:"long",timeStyle:"short"}).format(new Date());
    const text = [
      currentLesson.title + " — " + currentLesson.subtitle,
      now,"","APPUNTI DELLO STUDENTE",els.notebook.value || "(nessun appunto)","",
      "CITAZIONI DALLA LEZIONE",
      citations.length ? citations.map(item => item.text).join("\n\n—\n\n") : "(nessuna citazione)"
    ].join("\n");
    const blob = new Blob(["\uFEFF" + text],{type:"text/plain;charset=utf-8"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "appunti-" + currentLesson.id + ".txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function updateSequence() {
    const index = DATA.lessons.findIndex(item => item.id === currentLesson.id);
    const prev = DATA.lessons[index - 1];
    const next = DATA.lessons[index + 1];
    els.previous.href = prev ? "#" + prev.id : "#home";
    els.previous.textContent = prev ? "← " + prev.title : "← Copertina";
    els.next.href = next ? "#" + next.id : "#home";
    els.next.textContent = next ? next.title + " →" : "Torna alla copertina →";
  }

  function updateVisual(stage, forceMap = false) {
    if (!currentLesson) return;
    const items = Object.entries(visualStages).map(([id,item]) => ({id:"stage-"+id,...item,alt:item.caption,full:item.src}));
    items.push({id:"map",src:currentLesson.mapPreview,full:currentLesson.map,label:"Mappa della lezione",caption:currentLesson.mapAlt,alt:currentLesson.mapAlt});
    const selected = forceMap ? items.at(-1) : items.find(item => item.id === "stage-" + stage) || items[0];
    activeVisualId = selected.id;
    els.contextImage.src = selected.src;
    els.contextImage.alt = selected.alt;
    els.contextImage.dataset.full = selected.full;
    els.contextCaption.textContent = selected.caption;
    els.visualChoices.innerHTML = items.map(item => `<button type="button" data-visual="${item.id}" class="${item.id === selected.id ? "active" : ""}">${escapeHTML(item.label)}</button>`).join("");
    $$("[data-visual]", els.visualChoices).forEach(button => button.addEventListener("click", () => {
      const item = items.find(entry => entry.id === button.dataset.visual);
      if (!item) return;
      els.contextImage.src = item.src;
      els.contextImage.alt = item.alt;
      els.contextImage.dataset.full = item.full;
      els.contextCaption.textContent = item.caption;
      activeVisualId = item.id;
      $$("[data-visual]", els.visualChoices).forEach(btn => btn.classList.toggle("active", btn === button));
    }));
  }

  function updateScrollState() {
    if (!currentLesson) return;
    const max = els.readingPane.scrollHeight - els.readingPane.clientHeight;
    const progress = max > 0 ? Math.min(1,els.readingPane.scrollTop / max) : 1;
    els.readingBar.style.width = (progress * 100).toFixed(1) + "%";
    storageSet("progress:" + currentLesson.id,{scroll:els.readingPane.scrollTop,ratio:progress});

    const headings = $$("h2[data-stage]", els.content);
    let stage = 1;
    headings.forEach(heading => {
      if (heading.offsetTop <= els.readingPane.scrollTop + 240) stage = Number(heading.dataset.stage);
    });
    $$("#lessonJump a").forEach(link => link.classList.toggle("active", link.dataset.jump === "section-" + stage));
    if (activeVisualId !== "map" && activeVisualId !== "stage-" + stage) updateVisual(stage);
  }

  function resumeReading() {
    const id = storageGet("lastLesson", "introduzione");
    location.hash = id;
    setTimeout(() => {
      const progress = storageGet("progress:" + id,null);
      if (progress && currentLesson?.id === id) els.readingPane.scrollTop = progress.scroll || 0;
    }, 220);
  }

  function renderLearning(panel, lesson = currentLesson) {
    const dialog = $("#learningDialog");
    const title = $("#learningTitle");
    const kicker = $("#learningKicker");
    const content = $("#learningContent");
    if (!lesson) return;

    kicker.textContent = lesson.title + " · " + lesson.subtitle;
    if (panel === "summary") {
      title.textContent = "Sintesi";
      content.innerHTML = `<p class="summary-text">${escapeHTML(lesson.summary)}</p>`;
    } else if (panel === "essentials") {
      title.textContent = "Saperi irrinunciabili";
      content.innerHTML = "<ol>" + lesson.essentials.map(item => "<li>" + escapeHTML(item) + "</li>").join("") + "</ol>";
    } else if (panel === "vocab") {
      title.textContent = "Vocabolario essenziale";
      content.innerHTML = '<dl class="vocab-list">' + Object.entries(lesson.vocab).map(([term,def]) => "<dt>" + escapeHTML(term) + "</dt><dd>" + escapeHTML(def) + "</dd>").join("") + "</dl>";
    } else if (panel === "test") {
      title.textContent = "Test della lezione";
      renderQuiz(content,lesson.quiz,lesson.id);
    }
    if (!dialog.open) dialog.showModal();
  }

  function renderGlobal(panel) {
    const dialog = $("#learningDialog");
    const title = $("#learningTitle");
    const kicker = $("#learningKicker");
    const content = $("#learningContent");
    kicker.textContent = "Tre vie alla libertà";

    if (panel === "essentials") {
      title.textContent = "Saperi irrinunciabili del percorso";
      content.innerHTML = DATA.lessons.map(lesson => `<section><h3>${escapeHTML(lesson.title)}</h3><ol>${lesson.essentials.map(item => "<li>"+escapeHTML(item)+"</li>").join("")}</ol></section>`).join("") +
        "<p><b>Formula finale:</b> Goldoni libera la persona dalla maschera; Parini libera il valore umano dal privilegio; Alfieri libera la volontà dalla tirannide.</p>";
    } else if (panel === "vocab") {
      title.textContent = "Vocabolario del percorso";
      content.innerHTML = DATA.lessons.map(lesson => `<section><h3>${escapeHTML(lesson.title)}</h3><dl class="vocab-list">${Object.entries(lesson.vocab).map(([term,def]) => "<dt>"+escapeHTML(term)+"</dt><dd>"+escapeHTML(def)+"</dd>").join("")}</dl></section>`).join("");
    } else if (panel === "final") {
      title.textContent = "Verifica finale";
      renderQuiz(content,DATA.finalQuiz,"final");
    }
    if (!dialog.open) dialog.showModal();
  }

  function renderQuiz(container, questions, scope, onlyIds = null) {
    const selected = onlyIds ? questions.filter(item => onlyIds.includes(item.id)) : questions;
    container.innerHTML = `
      <form class="quiz-form" data-quiz-scope="${scope}">
        ${selected.map((item,index) => `<fieldset>
          <legend>${index+1}. ${escapeHTML(item.q)}</legend>
          ${item.options.map((option,optIndex) => `<label><input type="radio" name="${item.id}" value="${optIndex}"> ${escapeHTML(option)}</label>`).join("")}
        </fieldset>`).join("")}
        <div class="quiz-actions"><button type="submit">Correggi il test</button></div>
      </form><div class="quiz-output" aria-live="polite"></div>`;
    $(".quiz-form",container).addEventListener("submit", event => {
      event.preventDefault();
      gradeQuiz(container, selected, scope);
    });
  }

  function gradeQuiz(container, questions, scope) {
    const form = $(".quiz-form",container);
    const wrong = [];
    let correct = 0;
    const feedback = questions.map(item => {
      const chosen = form.elements[item.id]?.value;
      const ok = Number(chosen) === item.correct;
      if (ok) correct++; else wrong.push(item);
      const answer = chosen === "" || chosen === undefined ? "Nessuna risposta" : item.options[Number(chosen)];
      return `<article class="quiz-feedback ${ok ? "correct" : "wrong"}"><h4>${ok ? "Corretto" : "Da rivedere"}: ${escapeHTML(item.q)}</h4><p><b>Risposta data:</b> ${escapeHTML(answer)}</p><p>${escapeHTML(item.explanation)}</p></article>`;
    });
    const percent = Math.round(correct / questions.length * 100);
    const grade = Math.max(1,Math.round(percent / 10));
    const output = $(".quiz-output",container);
    output.innerHTML = `<section class="quiz-result"><h3>Risultato: ${correct}/${questions.length} · ${percent}% · voto ${grade}/10</h3><p>Formula: voto = massimo tra 1 e l’arrotondamento della percentuale divisa per 10.</p></section>` + feedback.join("");

    const history = storageGet("quizHistory:" + scope,[]);
    history.push({date:new Date().toISOString(),correct,total:questions.length,percent,grade,wrong:wrong.map(item=>item.id)});
    storageSet("quizHistory:" + scope,history);

    if (wrong.length) {
      output.insertAdjacentHTML("beforeend", `<section class="recoveries"><h3>Recupero mirato</h3>${wrong.map(item => recoveryHTML(item,scope)).join("")}<div class="quiz-actions"><button type="button" data-retest>Riprova soltanto gli errori</button></div></section>`);
      $("[data-retest]",output).addEventListener("click",() => renderRecoveryTest(container,wrong,scope));
    } else {
      output.insertAdjacentHTML("beforeend","<p><b>Tutti i nessi sono stati riconosciuti. Il test può essere chiuso.</b></p>");
    }
  }

  function recoveryHTML(item,scope) {
    if (item.recovery) {
      return `<article class="recovery-card"><h4>${escapeHTML(item.recovery.concept)}</h4><p>${escapeHTML(item.recovery.text)}</p><p><b>Esempio:</b> ${escapeHTML(item.recovery.example)}</p><a href="#${scope}" data-recovery-anchor="${item.recovery.anchor}">Rileggi il punto della lezione</a></article>`;
    }
    const finalTargets = {f1:"goldoni",f2:"parini",f3:"alfieri",f4:"goldoni",f5:"parini",f6:"alfieri",f7:"introduzione",f8:"introduzione"};
    return `<article class="recovery-card"><h4>Nesso da recuperare</h4><p>${escapeHTML(item.explanation)}</p><a href="#${finalTargets[item.id] || "introduzione"}">Riapri la lezione collegata</a></article>`;
  }

  function renderRecoveryTest(container,wrong,scope) {
    const items = wrong.map(item => item.recovery ? {
      id:item.id+"-r",q:item.recovery.q,options:item.recovery.options,correct:item.recovery.correct,
      explanation:item.recovery.text,recovery:item.recovery
    } : item);
    container.innerHTML = `<h3>Riprova soltanto gli errori</h3><p>Le domande di recupero verificano il nesso appena chiarito senza cancellare il tentativo precedente.</p>`;
    renderQuiz(container,items,scope+":retest");
  }

  function renderNotesOverview() {
    $("#notesOverview").innerHTML = DATA.lessons.map(lesson => {
      const note = storageGet("notes:"+lesson.id,"");
      const citations = storageGet("citations:"+lesson.id,[]);
      return `<article><h3>${escapeHTML(lesson.title)}</h3><p>${note ? escapeHTML(note.slice(0,150)) + (note.length > 150 ? "…" : "") : "Nessun appunto personale."}</p><small>${citations.length} citazioni conservate</small> <a href="#${lesson.id}">Apri</a></article>`;
    }).join("");
  }

  function resetAllData() {
    if (!confirm("Azzera evidenziazioni, appunti, risultati, tema e progresso di questa PWA? L’operazione non può essere annullata.")) return;
    Object.keys(localStorage).filter(key => key.startsWith(KEY)).forEach(key => localStorage.removeItem(key));
    closeDialogs();
    location.hash = "home";
    location.reload();
  }

  function openImage(src,alt,caption) {
    zoom = 1;
    const image = $("#dialogImage");
    image.src = src;
    image.alt = alt || "";
    image.style.transform = "scale(1)";
    $("#dialogCaption").textContent = caption || alt || "";
    openDialog("imageDialog");
  }

  function setTheme(next = null) {
    const themes = ["light","dark"];
    const current = document.documentElement.dataset.theme || "light";
    const value = next || themes[(themes.indexOf(current)+1)%themes.length];
    document.documentElement.dataset.theme = value;
    storageSet("theme",value);
  }

  function setFont(next = null) {
    const sizes = ["small","medium","large"];
    const current = document.documentElement.dataset.font || "medium";
    const value = next || sizes[(sizes.indexOf(current)+1)%sizes.length];
    document.documentElement.dataset.font = value;
    storageSet("font",value);
  }

  function bindEvents() {
    window.addEventListener("hashchange",route);
    document.addEventListener("selectionchange",captureSelection);
    els.highlightSelection.addEventListener("click",addHighlight);
    els.addSelection.addEventListener("click",addCurrentSelection);
    els.addHighlights.addEventListener("click",addPendingHighlights);
    els.clearHighlights.addEventListener("click",clearHighlights);
    els.notebook.addEventListener("input",saveNotebook);
    $("#downloadNotes").addEventListener("click",downloadNotes);
    $("#clearNotebook").addEventListener("click",clearNotebook);
    $("#resumeBtn").addEventListener("click",resumeReading);
    $("#resetAllData").addEventListener("click",resetAllData);
    els.readingPane.addEventListener("scroll",updateScrollState,{passive:true});

    $$("#lessonJump [data-jump]").forEach(link => link.addEventListener("click",event => {
      event.preventDefault();
      document.getElementById(link.dataset.jump)?.scrollIntoView({behavior:"smooth",block:"start"});
    }));

    $$("[data-open]").forEach(button => button.addEventListener("click",() => openDialog(button.dataset.open)));
    $$("[data-learning-panel]").forEach(button => button.addEventListener("click",() => renderLearning(button.dataset.learningPanel)));
    $$("[data-global-panel]").forEach(button => button.addEventListener("click",() => renderGlobal(button.dataset.globalPanel)));
    $$("#themeBtn,#studyThemeBtn").forEach(button => button.addEventListener("click",() => setTheme()));
    $$("#fontBtn,#studyFontBtn").forEach(button => button.addEventListener("click",() => setFont()));

    $$(".mobile-study-tabs button").forEach(button => button.addEventListener("click",() => {
      els.studyGrid.dataset.mobilePanel = button.dataset.mobileView;
      $$(".mobile-study-tabs button").forEach(item => item.classList.toggle("active",item === button));
    }));

    $("#contextImageButton").addEventListener("click",() => openImage(
      els.contextImage.dataset.full || els.contextImage.src,
      els.contextImage.alt,
      els.contextCaption.textContent
    ));

    $$(".zoom-tools button").forEach(button => button.addEventListener("click",() => {
      if (button.dataset.zoom === "+") zoom = Math.min(3,zoom + .25);
      else if (button.dataset.zoom === "-") zoom = Math.max(.5,zoom - .25);
      else zoom = 1;
      $("#dialogImage").style.transform = "scale(" + zoom + ")";
    }));

    document.addEventListener("click",event => {
      const link = event.target.closest("dialog a[href^='#']");
      if (link) closeDialogs();
      const recoveryLink = event.target.closest("[data-recovery-anchor]");
      if (recoveryLink) {
        const anchor = recoveryLink.dataset.recoveryAnchor;
        setTimeout(() => document.getElementById(anchor)?.scrollIntoView({block:"start"}),180);
      }
    });
  }

  function init() {
    setTheme(storageGet("theme","light"));
    setFont(storageGet("font","medium"));
    initCover();
    bindEvents();
    route();
    if ("serviceWorker" in navigator) {
      window.addEventListener("load",() => navigator.serviceWorker.register("service-worker.js").catch(console.error));
    }
  }

  init();
})();
