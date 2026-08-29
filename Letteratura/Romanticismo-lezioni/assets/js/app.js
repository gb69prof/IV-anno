(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = reduceMotion ? "auto" : "smooth";

  const toast = $("#toast");
  let toastTimer;
  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function safeStorageGet(key, fallback = "") {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  function safeStorageJSON(key, fallback) {
    try {
      const value = JSON.parse(safeStorageGet(key, "null"));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function safeStorageRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage can be unavailable in private browsing.
    }
  }

  // Reading progress and last position.
  const progress = $("#readingProgress");
  let positionTimer;
  function updateProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0;
    progress.style.width = `${percentage}%`;
    window.clearTimeout(positionTimer);
    positionTimer = window.setTimeout(() => safeStorageSet("romanticismo-reading-y", String(Math.round(window.scrollY))), 250);
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  // Reading preferences.
  const fontToggle = $("#fontToggle");
  const themeToggle = $("#themeToggle");
  const fontModes = ["font-default", "font-large", "font-huge"];
  let fontMode = safeStorageGet("romanticismo-font-mode", "font-default");
  if (!fontModes.includes(fontMode)) fontMode = "font-default";
  function applyFontMode() {
    document.body.classList.remove(...fontModes);
    document.body.classList.add(fontMode);
    const label = fontMode === "font-default" ? "Testo normale" : fontMode === "font-large" ? "Testo grande" : "Testo molto grande";
    fontToggle.textContent = fontMode === "font-default" ? "Aa" : fontMode === "font-large" ? "Aa+" : "Aa++";
    fontToggle.setAttribute("aria-label", `Dimensione del testo: ${label}. Tocca per cambiare.`);
  }
  applyFontMode();
  fontToggle.addEventListener("click", () => {
    fontMode = fontModes[(fontModes.indexOf(fontMode) + 1) % fontModes.length];
    safeStorageSet("romanticismo-font-mode", fontMode);
    applyFontMode();
    showToast("Dimensione del testo aggiornata");
  });

  let nightTheme = safeStorageGet("romanticismo-reading-theme") === "night";
  function applyTheme() {
    document.body.classList.toggle("reading-night", nightTheme);
    themeToggle.textContent = nightTheme ? "Carta" : "Notte";
    themeToggle.setAttribute("aria-label", nightTheme ? "Attiva il tema carta" : "Attiva il tema scuro");
    const themeMeta = $("meta[name='theme-color']");
    if (themeMeta) themeMeta.content = nightTheme ? "#061824" : "#061d2f";
  }
  applyTheme();
  themeToggle.addEventListener("click", () => {
    nightTheme = !nightTheme;
    safeStorageSet("romanticismo-reading-theme", nightTheme ? "night" : "paper");
    applyTheme();
    showToast(nightTheme ? "Tema scuro attivo" : "Tema carta attivo");
  });

  // Mobile menu.
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  function closeMenu() {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
  menuToggle.addEventListener("click", () => {
    const willOpen = !mainNav.classList.contains("open");
    mainNav.classList.toggle("open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
  });
  $$("#mainNav a, #mainNav button").forEach(item => item.addEventListener("click", closeMenu));
  document.addEventListener("click", event => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  // Active navigation.
  const navLinks = $$("#mainNav a[href^='#']");
  const observedSections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -58% 0px", threshold: 0 });
    observedSections.forEach(section => observer.observe(section));
  }

  // Accessible country tabs; cover hotspots can address hidden panels.
  const countryTabs = $$(".country-tabs [role='tab']");
  function activateCountry(panelId, focusTab = false) {
    const chosen = countryTabs.find(tab => tab.getAttribute("aria-controls") === panelId);
    if (!chosen) return;
    countryTabs.forEach(tab => {
      const selected = tab === chosen;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      panel.hidden = !selected;
    });
    if (focusTab) chosen.focus();
  }
  countryTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateCountry(tab.getAttribute("aria-controls")));
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % countryTabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + countryTabs.length) % countryTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = countryTabs.length - 1;
      activateCountry(countryTabs[next].getAttribute("aria-controls"), true);
    });
  });
  function handleCountryHash() {
    const panelId = window.location.hash.slice(1);
    if (["germania", "inghilterra", "francia", "italia"].includes(panelId)) {
      activateCountry(panelId);
      window.setTimeout(() => {
        document.getElementById(panelId).scrollIntoView({ behavior: scrollBehavior, block: "center" });
      }, 0);
    }
  }
  window.addEventListener("hashchange", handleCountryHash);
  handleCountryHash();

  // Timeline.
  const timeline = [
    {
      year: "1789",
      event: "La Rivoluzione francese",
      meaning: "Le idee illuministiche entrano nella storia come forza politica. Libertà e cittadinanza diventano progetti reali, ma il processo rivoluzionario mostra anche conflitto, violenza e imprevedibilità."
    },
    {
      year: "1795–1797",
      event: "Goethe e Schiller, il laboratorio di Weimar",
      meaning: "Il dialogo tra Goethe e Schiller cerca una mediazione tra libertà moderna e forma classica. Intanto una generazione più giovane prepara la svolta romantica: non c’è un passaggio meccanico da Classicismo a Romanticismo."
    },
    {
      year: "1797–1802",
      event: "Jena e il primo Romanticismo tedesco",
      meaning: "Intorno agli Schlegel, a Novalis e alla rivista «Athenaeum» si sviluppano frammento, ironia romantica e idea di poesia universale progressiva."
    },
    {
      year: "1798",
      event: "Le Lyrical Ballads",
      meaning: "Wordsworth e Coleridge pubblicano una raccolta che rinnova temi e linguaggio della poesia inglese. La celebre prefazione programmatica di Wordsworth accompagnerà l’edizione del 1800."
    },
    {
      year: "1804–1815",
      event: "L’età napoleonica",
      meaning: "Napoleone diffonde principi giuridici e politici nuovi, ma li lega alla costruzione imperiale. Per molti intellettuali europei è insieme promessa, tradimento e trauma storico."
    },
    {
      year: "1814–1815",
      event: "Caduta di Napoleone e Congresso di Vienna",
      meaning: "La Restaurazione tenta di ricomporre l’ordine dinastico. Censura e repressione non eliminano liberalismo, memoria rivoluzionaria e aspirazioni nazionali."
    },
    {
      year: "1816",
      event: "La polemica classico-romantica in Italia",
      meaning: "L’articolo di Madame de Staël sulla «Biblioteca italiana» invita ad aprirsi alle letterature moderne europee. Il dibattito riguarda modelli, traduzioni, pubblico e funzione della letteratura."
    },
    {
      year: "1818",
      event: "Nasce «Il Conciliatore»",
      meaning: "Il periodico milanese collega letteratura, scienza, economia e riforma civile. È il principale laboratorio dei romantici e liberali lombardi."
    },
    {
      year: "1819",
      event: "La censura sopprime «Il Conciliatore»",
      meaning: "La chiusura nell’ottobre 1819 mostra che la discussione letteraria possiede ormai un significato politico: costruire un pubblico significa anche costruire coscienza civile."
    },
    {
      year: "1823",
      event: "Manzoni scrive la Lettera sul Romanticismo",
      meaning: "La formula dell’utile, vero e interessante chiarisce una poetica moderna, civile e cristiana. La lettera sarà pubblicata solo più tardi."
    },
    {
      year: "1827",
      event: "Romanzo e dramma romantico",
      meaning: "Esce l’edizione detta Ventisettana dei Promessi sposi; in Francia la prefazione al Cromwell di Victor Hugo diventa manifesto del dramma romantico e della mescolanza tra sublime e grottesco."
    },
    {
      year: "1840–1842",
      event: "La Quarantana dei Promessi sposi",
      meaning: "La revisione definitiva del romanzo lega ricerca linguistica, pubblico nazionale e progetto editoriale moderno, mostrando uno sviluppo successivo del lascito romantico italiano."
    }
  ];
  const timelineControls = $("#timelineControls");
  const timelineYear = $("#timelineYear");
  const timelineEvent = $("#timelineEvent");
  const timelineMeaning = $("#timelineMeaning");
  const timelineDetail = $("#timelineDetail");
  function selectTimeline(index, focusDetail = false) {
    const item = timeline[index];
    timelineYear.textContent = item.year;
    timelineEvent.textContent = item.event;
    timelineMeaning.textContent = item.meaning;
    $$("#timelineControls button").forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === index);
      button.setAttribute("aria-pressed", String(buttonIndex === index));
    });
    safeStorageSet("romanticismo-timeline-index", String(index));
    if (focusDetail) timelineDetail.focus({ preventScroll: true });
  }
  timeline.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.year;
    button.setAttribute("aria-label", `${item.year}: ${item.event}`);
    button.addEventListener("click", () => selectTimeline(index, true));
    timelineControls.appendChild(button);
  });
  const savedTimeline = Number.parseInt(safeStorageGet("romanticismo-timeline-index", "0"), 10);
  selectTimeline(Number.isInteger(savedTimeline) && timeline[savedTimeline] ? savedTimeline : 0);

  // Map viewer.
  const mapDialog = $("#mapDialog");
  const mapTitle = $("#mapDialogTitle");
  const mapContent = $("#mapContent");
  const mapViewport = $("#mapViewport");
  const mapZoomValue = $("#mapZoomValue");
  let mapZoom = 1;
  function setMapZoom(nextZoom) {
    mapZoom = Math.max(.75, Math.min(1.75, nextZoom));
    mapContent.style.zoom = String(mapZoom);
    mapZoomValue.textContent = `${Math.round(mapZoom * 100)}%`;
  }
  function openMap(templateId) {
    const template = document.getElementById(templateId);
    if (!template) return;
    mapTitle.textContent = template.dataset.title || "Mappa concettuale";
    mapContent.replaceChildren(template.content.cloneNode(true));
    setMapZoom(1);
    mapViewport.scrollTo({ top: 0, left: 0, behavior: "auto" });
    mapDialog.showModal();
    document.body.classList.add("dialog-open");
  }
  $$("[data-map]").forEach(button => button.addEventListener("click", () => openMap(button.dataset.map)));
  $("#mapClose").addEventListener("click", () => mapDialog.close());
  $("#mapZoomIn").addEventListener("click", () => setMapZoom(mapZoom + .15));
  $("#mapZoomOut").addEventListener("click", () => setMapZoom(mapZoom - .15));
  $("#mapZoomReset").addEventListener("click", () => setMapZoom(1));
  mapDialog.addEventListener("click", event => {
    if (event.target === mapDialog) mapDialog.close();
  });
  mapDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));

  // Illustrated maps viewer.
  const imageDialog = $("#imageDialog");
  const imageTitle = $("#imageDialogTitle");
  const imageFull = $("#imageFull");
  $$("[data-image]").forEach(button => {
    button.addEventListener("click", () => {
      imageTitle.textContent = button.dataset.title || "Tavola illustrata";
      imageFull.src = button.dataset.image;
      imageFull.alt = button.dataset.title || "Tavola illustrata";
      imageDialog.showModal();
      document.body.classList.add("dialog-open");
    });
  });
  $("#imageClose").addEventListener("click", () => imageDialog.close());
  imageDialog.addEventListener("click", event => {
    if (event.target === imageDialog) imageDialog.close();
  });
  imageDialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    imageFull.removeAttribute("src");
    imageFull.alt = "";
  });

  // Notebook and study tools: data remains local to this browser.
  const notebookPanel = $("#notebookPanel");
  const notebookText = $("#notebookText");
  const saveStatus = $("#saveStatus");
  const citationList = $("#citationList");
  const citationCount = $("#citationCount");
  const highlightCount = $("#highlightCount");
  const selectionStatus = $("#selectionStatus");
  const notebookKey = "romanticismo-notebook-v2";
  const citationKey = "romanticismo-citations-v2";
  const highlightKey = "romanticismo-highlights-v2";
  let notebookTimer;
  let citations = safeStorageJSON(citationKey, []);
  let highlights = safeStorageJSON(highlightKey, []);
  let savedSelection = null;

  notebookText.value = safeStorageGet(notebookKey, safeStorageGet("romanticismo-notebook-v1"));

  function openNotebook(focusText = false) {
    notebookPanel.classList.add("open");
    notebookPanel.setAttribute("aria-hidden", "false");
    document.body.classList.add("notebook-open");
    $("#notebookOpen").setAttribute("aria-expanded", "true");
    window.setTimeout(() => (focusText ? notebookText : $("#notebookClose")).focus(), 0);
  }

  function closeNotebook() {
    notebookPanel.classList.remove("open");
    notebookPanel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("notebook-open");
    $("#notebookOpen").setAttribute("aria-expanded", "false");
    $("#notebookOpen").focus({ preventScroll: true });
  }

  function saveNotebook(message = "Appunti salvati in questo browser.") {
    const saved = safeStorageSet(notebookKey, notebookText.value);
    saveStatus.textContent = saved ? message : "Non è stato possibile salvare nel browser.";
  }

  function sourceLabel(section, node) {
    const sectionTitle = $("h2", section)?.textContent.trim() || section.id;
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    const card = element?.closest("article");
    const author = card && section.id === "testi" ? $("h3", card)?.textContent.trim() : "";
    const work = card && section.id === "testi" ? $("h4", card)?.textContent.trim() : "";
    return [sectionTitle, author, work].filter(Boolean).join(" — ");
  }

  function renderCitations() {
    citationList.replaceChildren();
    citationCount.textContent = String(citations.length);
    if (!citations.length) {
      const empty = document.createElement("p");
      empty.className = "citation-empty";
      empty.textContent = "Non hai ancora raccolto citazioni.";
      citationList.appendChild(empty);
      return;
    }
    citations.forEach(item => {
      const article = document.createElement("article");
      article.className = "citation-item";
      const quote = document.createElement("blockquote");
      quote.textContent = item.text;
      const cite = document.createElement("cite");
      cite.textContent = item.source;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "citation-remove";
      remove.setAttribute("aria-label", `Rimuovi citazione: ${item.text.slice(0, 45)}`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        citations = citations.filter(candidate => candidate.id !== item.id);
        safeStorageSet(citationKey, JSON.stringify(citations));
        renderCitations();
      });
      article.append(quote, cite, remove);
      citationList.appendChild(article);
    });
  }

  function addCitation(text, source) {
    const cleanText = text.replace(/\s+/g, " ").trim();
    if (!cleanText) return false;
    if (citations.some(item => item.text === cleanText && item.source === source)) return false;
    citations.push({ id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text: cleanText, source });
    safeStorageSet(citationKey, JSON.stringify(citations));
    renderCitations();
    return true;
  }

  function rangeIntersectsHighlight(range, section) {
    return $$(".study-highlight", section).some(mark => {
      try {
        return range.intersectsNode(mark);
      } catch {
        return false;
      }
    });
  }

  function getSelectionContext() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
    const text = selection.toString().replace(/\s+/g, " ").trim();
    if (text.length < 2) return null;
    const range = selection.getRangeAt(0);
    const startElement = range.startContainer.nodeType === Node.ELEMENT_NODE ? range.startContainer : range.startContainer.parentElement;
    const endElement = range.endContainer.nodeType === Node.ELEMENT_NODE ? range.endContainer : range.endContainer.parentElement;
    const startSection = startElement?.closest("main section");
    const endSection = endElement?.closest("main section");
    if (!startSection || startSection !== endSection || startSection.id === "verifica") return null;
    if (rangeIntersectsHighlight(range, startSection)) return { invalid: "overlap" };
    return { text, range: range.cloneRange(), section: startSection, source: sourceLabel(startSection, startElement) };
  }

  document.addEventListener("selectionchange", () => {
    const context = getSelectionContext();
    if (context?.invalid === "overlap") {
      selectionStatus.textContent = "La selezione comprende già un’evidenziazione.";
      return;
    }
    if (!context) return;
    savedSelection = context;
    selectionStatus.textContent = `Selezione pronta: “${context.text.slice(0, 55)}${context.text.length > 55 ? "…" : ""}”`;
  });

  function textNodes(section) {
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.length) return NodeFilter.FILTER_REJECT;
        if (node.parentElement?.closest("script, style")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function locateRange(section, text, occurrence = 0) {
    const nodes = textNodes(section);
    const complete = nodes.map(node => node.nodeValue).join("");
    let start = -1;
    let from = 0;
    for (let index = 0; index <= occurrence; index += 1) {
      start = complete.indexOf(text, from);
      if (start < 0) return null;
      from = start + 1;
    }
    const end = start + text.length;
    let cursor = 0;
    let startNode;
    let endNode;
    let startOffset = 0;
    let endOffset = 0;
    nodes.forEach(node => {
      const next = cursor + node.nodeValue.length;
      if (!startNode && start >= cursor && start <= next) {
        startNode = node;
        startOffset = start - cursor;
      }
      if (!endNode && end >= cursor && end <= next) {
        endNode = node;
        endOffset = end - cursor;
      }
      cursor = next;
    });
    if (!startNode || !endNode) return null;
    const range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    return range;
  }

  function selectionOccurrence(section, range, text) {
    const prefix = document.createRange();
    prefix.selectNodeContents(section);
    prefix.setEnd(range.startContainer, range.startOffset);
    const before = prefix.toString();
    let count = 0;
    let from = 0;
    while (true) {
      const found = before.indexOf(text, from);
      if (found < 0) break;
      count += 1;
      from = found + 1;
    }
    return count;
  }

  function paintRange(range, id) {
    const ancestor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;
    const section = ancestor?.closest("section");
    if (!section) return false;
    const affected = textNodes(section).filter(node => {
      try {
        return range.intersectsNode(node);
      } catch {
        return false;
      }
    }).map(node => {
      const startOffset = node === range.startContainer ? range.startOffset : 0;
      const endOffset = node === range.endContainer ? range.endOffset : node.nodeValue.length;
      return { node, startOffset, endOffset };
    }).filter(item => item.endOffset > item.startOffset);

    affected.reverse().forEach(({ node, startOffset, endOffset }) => {
      let selectedNode = node;
      if (endOffset < selectedNode.nodeValue.length) selectedNode.splitText(endOffset);
      if (startOffset > 0) selectedNode = selectedNode.splitText(startOffset);
      const mark = document.createElement("mark");
      mark.className = "study-highlight";
      mark.dataset.highlightId = id;
      selectedNode.parentNode.replaceChild(mark, selectedNode);
      mark.appendChild(selectedNode);
    });
    return affected.length > 0;
  }

  function updateHighlightCount() {
    highlightCount.textContent = String(highlights.length);
  }

  function restoreHighlights() {
    const valid = [];
    highlights.forEach(item => {
      const section = document.getElementById(item.sectionId);
      const range = section && locateRange(section, item.rawText, item.occurrence);
      if (range && paintRange(range, item.id)) valid.push(item);
    });
    highlights = valid;
    safeStorageSet(highlightKey, JSON.stringify(highlights));
    updateHighlightCount();
  }

  function clearHighlightMarkup() {
    $$(".study-highlight").forEach(mark => mark.replaceWith(...mark.childNodes));
    document.normalize();
  }

  $("#highlightSelection").addEventListener("click", () => {
    const context = savedSelection;
    if (!context || context.invalid || !context.range || !document.body.contains(context.range.commonAncestorContainer)) {
      showToast("Seleziona prima una frase in una sola sezione");
      return;
    }
    if (rangeIntersectsHighlight(context.range, context.section)) {
      showToast("Questa selezione comprende già un’evidenziazione");
      return;
    }
    const rawText = context.range.toString();
    const item = {
      id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sectionId: context.section.id,
      rawText,
      occurrence: selectionOccurrence(context.section, context.range, rawText),
      source: context.source
    };
    if (!paintRange(context.range, item.id)) return;
    highlights.push(item);
    safeStorageSet(highlightKey, JSON.stringify(highlights));
    updateHighlightCount();
    window.getSelection()?.removeAllRanges();
    savedSelection = null;
    selectionStatus.textContent = "Evidenziazione salvata nel browser.";
    showToast("Frase evidenziata");
  });

  $("#pasteSelection").addEventListener("click", () => {
    const context = savedSelection;
    if (!context || context.invalid) {
      showToast("Seleziona prima una frase in una sola sezione");
      return;
    }
    const added = addCitation(context.text, context.source);
    if (added) {
      openNotebook(false);
      showToast("Citazione aggiunta al taccuino");
    } else {
      showToast("Citazione già presente");
    }
  });

  $("#pasteHighlights").addEventListener("click", () => {
    let added = 0;
    highlights.forEach(item => {
      if (addCitation(item.rawText, item.source)) added += 1;
    });
    if (highlights.length) openNotebook(false);
    showToast(added ? `${added} evidenziazioni aggiunte` : highlights.length ? "Citazioni già presenti" : "Nessuna evidenziazione");
  });

  $("#clearHighlights").addEventListener("click", () => {
    if (!highlights.length) {
      showToast("Nessuna evidenziazione da rimuovere");
      return;
    }
    if (!window.confirm("Rimuovere tutte le evidenziazioni? Le citazioni già nel taccuino resteranno.")) return;
    clearHighlightMarkup();
    highlights = [];
    safeStorageRemove(highlightKey);
    updateHighlightCount();
    showToast("Evidenziazioni rimosse");
  });

  [$("#notebookOpen"), $("#notebookFooter")].forEach(button => button.addEventListener("click", () => openNotebook(button.id === "notebookFooter")));
  $("#notebookClose").addEventListener("click", closeNotebook);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && notebookPanel.classList.contains("open")) closeNotebook();
  });
  notebookText.addEventListener("input", () => {
    saveStatus.textContent = "Modifiche non ancora salvate…";
    window.clearTimeout(notebookTimer);
    notebookTimer = window.setTimeout(() => saveNotebook("Salvataggio automatico completato."), 700);
  });
  $("#notebookSave").addEventListener("click", () => {
    saveNotebook();
    showToast("Taccuino salvato");
  });

  function notebookPlainText() {
    const quoteText = citations.length
      ? citations.map(item => `“${item.text}”\nFonte: ${item.source}`).join("\n\n")
      : "Nessuna citazione raccolta.";
    return `TACCUINO — ROMANTICISMO\n\nAPPUNTI MIEI\n${notebookText.value.trim() || "(nessun appunto)"}\n\nCITAZIONI DALLA LETTURA\n${quoteText}\n`;
  }

  $("#notebookCopy").addEventListener("click", async () => {
    const content = notebookPlainText();
    try {
      await navigator.clipboard.writeText(content);
      showToast("Taccuino copiato");
    } catch {
      const helper = document.createElement("textarea");
      helper.value = content;
      document.body.appendChild(helper);
      helper.select();
      const copied = document.execCommand("copy");
      helper.remove();
      showToast(copied ? "Taccuino copiato" : "Copia non disponibile");
    }
  });
  $("#notebookExport").addEventListener("click", () => {
    const blob = new Blob([notebookPlainText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "taccuino-romanticismo.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 500);
    showToast("Taccuino esportato");
  });
  $("#notebookClear").addEventListener("click", () => {
    if (!window.confirm("Cancellare definitivamente appunti e citazioni salvati in questo browser?")) return;
    notebookText.value = "";
    citations = [];
    safeStorageRemove(notebookKey);
    safeStorageRemove("romanticismo-notebook-v1");
    safeStorageRemove(citationKey);
    renderCitations();
    saveStatus.textContent = "Taccuino cancellato.";
    showToast("Taccuino cancellato");
  });

  renderCitations();
  restoreHighlights();

  // Reasoned quiz with targeted recovery.
  const quiz = [
    {
      question: "Perché “sentimento contro ragione” è una formula insufficiente?",
      options: ["I romantici sostituiscono la ragione con l’istinto individuale.", "Criticano la ragione astratta e autosufficiente, non ogni forma di ragionamento.", "Sentimento e ragione restano identici all’Illuminismo."],
      correct: 1,
      explanation: "Il Romanticismo amplia l’immagine dell’uomo: ragione, storia, memoria, immaginazione e desiderio vanno compresi insieme.",
      recovery: ["Ragione e complessità umana", "La frattura riguarda la pretesa che la sola ragione astratta esaurisca il reale.", "Il sublime nasce quando la mente ragiona anche su ciò che supera misura e controllo.", "Il Romanticismo rifiuta la ragione o ne contesta l’assolutezza?", "fratture"]
    },
    {
      question: "Quale rapporto descrive meglio Illuminismo e Romanticismo?",
      options: ["Il secondo cancella interamente il primo.", "Sono due nomi per lo stesso progetto culturale.", "Il Romanticismo eredita libertà critica e dignità individuale, ma trasforma i limiti della ragione illuministica."],
      correct: 2,
      explanation: "La relazione è di eredità critica, non di cancellazione totale né di identità.",
      recovery: ["Un’eredità trasformata", "Il nuovo movimento conserva alcune conquiste illuministiche mentre critica l’idea di un ordine universale e lineare.", "L’apertura europea resta, ma si accompagna all’attenzione per storia, popoli e differenze.", "Quale elemento illuministico continua dentro il Romanticismo?", "mondo-ordinato"]
    },
    {
      question: "Quale catena spiega il cambiamento letterario seguito nella PWA?",
      options: ["Autori celebri → date → generi → giudizi.", "Mondo precedente → fratture → nuova immagine del mondo → nuove forme letterarie.", "Natura → sentimento → Medioevo → nazione."],
      correct: 1,
      explanation: "Le forme non cambiano per moda: emergono da una trasformazione storica e antropologica.",
      recovery: ["La catena causale", "Prima cambia il modo di interpretare uomo, natura e storia; poi cambiano linguaggi e generi.", "Una realtà percepita come contraddittoria favorisce il dramma che mescola sublime e grottesco.", "Viene prima la nuova forma o la nuova immagine del mondo?", "conclusione"]
    },
    {
      question: "Che cosa rende storica la concezione romantica delle forme?",
      options: ["Ogni epoca e ogni popolo possono creare forme adeguate alla propria esperienza.", "Il Medioevo diventa l’unico modello obbligatorio.", "Le regole antiche sono sostituite da regole moderne altrettanto universali."],
      correct: 0,
      explanation: "Il Romanticismo contesta l’imitazione meccanica di un unico modello valido per tutti i tempi.",
      recovery: ["Forme e storia", "Una forma artistica nasce in condizioni storiche determinate e non è una ricetta eterna.", "Il romanzo storico parla al pubblico moderno senza copiare l’epica antica.", "Una forma vale perché è antica o perché risponde al proprio tempo?", "letteratura-crisi"]
    },
    {
      question: "Perché il “popolo” romantico va esaminato criticamente?",
      options: ["Indica soltanto chi non sa leggere.", "Coincide in modo preciso con una classe economica.", "È insieme destinatario reale e progetto costruito dagli intellettuali."],
      correct: 2,
      explanation: "Il popolo è comunità culturale, pubblico e progetto: non coincide automaticamente con la complessità sociale reale.",
      recovery: ["Pubblico reale e pubblico progettato", "Gli scrittori vogliono raggiungere lettori vivi, ma nel definirli costruiscono anche un’immagine ideale di comunità.", "Berchet chiama “popolo” gli individui capaci di leggere o ascoltare la nuova poesia.", "Berchet fotografa soltanto un pubblico o prova anche a formarlo?", "testi"]
    },
    {
      question: "Quale confronto tra le vie europee è coerente?",
      options: ["Germania: assoluto; Inghilterra: natura e memoria; Francia: libertà delle forme; Italia: pubblico e nazione.", "Germania: censura austriaca; Inghilterra: Jena; Francia: poesia popolare italiana; Italia: Lyrical Ballads.", "Le quattro aree sviluppano un programma identico."],
      correct: 0,
      explanation: "Una crisi comune genera risposte diverse: il Romanticismo europeo è policentrico.",
      recovery: ["Una costellazione europea", "Non esiste un Romanticismo unico applicato allo stesso modo in ogni paese.", "In Francia la battaglia investe il teatro; in Italia il centro è anche il nuovo pubblico nazionale.", "Qual è la domanda specifica della via italiana?", "vie-europee"]
    },
    {
      question: "Perché il 1816 è uno snodo del Romanticismo italiano?",
      options: ["Manzoni pubblica la versione definitiva dei Promessi sposi.", "L’articolo di Madame de Staël apre la polemica su traduzioni, Europa e contemporaneità.", "La chiusura del «Conciliatore» conclude il dibattito."],
      correct: 1,
      explanation: "L’intervento di Staël porta in primo piano l’apertura alle letterature europee e il rapporto con i lettori contemporanei.",
      recovery: ["Il dibattito del 1816", "La traduzione diventa il simbolo di una cultura che non vuole chiudersi nei modelli del passato.", "Staël presenta lo scambio tra lingue come un beneficio per le lettere.", "Quali tre parole legano l’articolo alla modernità italiana?", "romanticismo-italiano"]
    },
    {
      question: "Come si collegano Romanticismo italiano e Risorgimento?",
      options: ["Sono esattamente lo stesso fenomeno.", "Non hanno alcun rapporto perché uno è letterario e l’altro politico.", "Si intrecciano nella costruzione culturale della nazione, ma restano distinti."],
      correct: 2,
      explanation: "La letteratura contribuisce alla nazione simbolica senza coincidere con l’intero processo politico risorgimentale.",
      recovery: ["Cultura e politica", "Un movimento letterario può preparare lingua, memoria e pubblico comuni senza essere un partito politico.", "Prima dello Stato unitario, periodici e opere immaginano destinatari italiani.", "Quale funzione nazionale può avere la letteratura prima del 1861?", "romanticismo-italiano"]
    },
    {
      question: "Quale nucleo collega Manzoni al Romanticismo senza esaurirne la poetica?",
      options: ["Storia, vero, nuovo pubblico e responsabilità civile.", "Culto esclusivo dell’io e rifiuto della religione.", "Negazione del romanzo e ritorno obbligatorio alla mitologia."],
      correct: 0,
      explanation: "Manzoni trasforma quei nuclei dentro una visione cristiana del male, della libertà e della Provvidenza.",
      recovery: ["Manzoni: adesione e trasformazione", "Essere romantico non rende Manzoni identico agli altri autori europei.", "La formula utile-vero-interessante unisce responsabilità e coinvolgimento del lettore.", "Che cosa aggiunge la prospettiva cristiana ai nuclei romantici?", "testi"]
    },
    {
      question: "Perché Leopardi può essere definito “dentro e contro” il Romanticismo?",
      options: ["Accetta il programma di Berchet ma ne rifiuta la lingua.", "Condivide problemi moderni come infinito, natura e immaginazione, ma contesta molte risposte romantiche.", "Resta estraneo alla crisi moderna."],
      correct: 1,
      explanation: "Leopardi appartiene alla stessa crisi della modernità, ma rifiuta il programma dei romantici italiani e ne capovolge diversi esiti.",
      recovery: ["Leopardi e la crisi comune", "Condividere una domanda storica non significa condividere la risposta dominante.", "Nel Discorso difende l’immutabilità dei caratteri principali della poesia contro il programma moderno.", "Quale problema condivide e quale soluzione rifiuta?", "testi"]
    }
  ];

  const quizStart = $("#quizStart");
  const quizForm = $("#quizForm");
  const quizResult = $("#quizResult");
  let activeQuestions = quiz.map((_, index) => index);
  let quizAnswers = new Map();

  function renderQuiz(indexes = quiz.map((_, index) => index)) {
    activeQuestions = indexes;
    quizAnswers = new Map();
    quizForm.replaceChildren();
    quizResult.replaceChildren();
    indexes.forEach((questionIndex, position) => {
      const item = quiz[questionIndex];
      const fieldset = document.createElement("fieldset");
      fieldset.className = "quiz-question";
      fieldset.dataset.questionIndex = String(questionIndex);
      const legend = document.createElement("legend");
      legend.textContent = `${position + 1}. ${item.question}`;
      fieldset.appendChild(legend);
      const options = document.createElement("div");
      options.className = "quiz-options";
      item.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question-${questionIndex}`;
        input.value = String(optionIndex);
        const optionText = document.createElement("span");
        optionText.textContent = option;
        label.append(input, optionText);
        input.addEventListener("change", () => answerQuestion(fieldset, questionIndex, optionIndex));
        options.appendChild(label);
      });
      fieldset.appendChild(options);
      quizForm.appendChild(fieldset);
    });
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "primary-button";
    reset.textContent = indexes.length === quiz.length ? "Ricomincia" : "Azzera questo recupero";
    reset.addEventListener("click", () => {
      renderQuiz(indexes);
      quizForm.scrollIntoView({ behavior: scrollBehavior, block: "start" });
    });
    quizForm.appendChild(reset);
  }

  function answerQuestion(fieldset, questionIndex, chosenIndex) {
    if (fieldset.dataset.answered === "true") return;
    fieldset.dataset.answered = "true";
    const item = quiz[questionIndex];
    quizAnswers.set(questionIndex, chosenIndex);
    const labels = $$("label", fieldset);
    labels[item.correct].classList.add("correct");
    if (chosenIndex !== item.correct) labels[chosenIndex].classList.add("wrong");
    $$("input", fieldset).forEach(input => { input.disabled = true; });
    const feedback = document.createElement("p");
    feedback.className = "quiz-feedback";
    feedback.textContent = `${chosenIndex === item.correct ? "Corretto. " : "Da rivedere. "}${item.explanation}`;
    fieldset.appendChild(feedback);
    updateQuizResult();
  }

  function appendRecovery(wrongIndexes) {
    if (!wrongIndexes.length) return;
    const title = document.createElement("h2");
    title.textContent = "Recupero mirato";
    const intro = document.createElement("p");
    intro.textContent = "Lavora soltanto sui nuclei che hai sbagliato:";
    const list = document.createElement("div");
    list.className = "recovery-list";
    wrongIndexes.forEach(questionIndex => {
      const [headingText, clarificationText, exampleText, controlText, target] = quiz[questionIndex].recovery;
      const card = document.createElement("article");
      card.className = "recovery-card";
      const heading = document.createElement("h3");
      heading.textContent = headingText;
      const clarification = document.createElement("p");
      clarification.textContent = clarificationText;
      const example = document.createElement("p");
      const exampleLabel = document.createElement("strong");
      exampleLabel.textContent = "Esempio: ";
      example.append(exampleLabel, exampleText);
      const control = document.createElement("p");
      const controlLabel = document.createElement("strong");
      controlLabel.textContent = "Domanda di controllo: ";
      control.append(controlLabel, controlText);
      const link = document.createElement("a");
      link.href = `#${target}`;
      link.textContent = "Rileggi il punto nel percorso →";
      card.append(heading, clarification, example, control, link);
      list.appendChild(card);
    });
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "primary-button retry-wrong";
    retry.textContent = "Riprova solo le domande sbagliate";
    retry.addEventListener("click", () => {
      renderQuiz(wrongIndexes);
      quizForm.scrollIntoView({ behavior: scrollBehavior, block: "start" });
      $("input", quizForm)?.focus({ preventScroll: true });
    });
    quizResult.append(title, intro, list, retry);
  }

  function updateQuizResult() {
    const answeredCount = quizAnswers.size;
    const score = activeQuestions.reduce((total, questionIndex) => (
      total + (quizAnswers.get(questionIndex) === quiz[questionIndex].correct ? 1 : 0)
    ), 0);
    if (answeredCount < activeQuestions.length) {
      quizResult.textContent = `Progresso: ${answeredCount}/${activeQuestions.length}. Corrette finora: ${score}.`;
      return;
    }
    const wrongIndexes = activeQuestions.filter(questionIndex => quizAnswers.get(questionIndex) !== quiz[questionIndex].correct);
    const percentage = Math.round((score / activeQuestions.length) * 100);
    const grade = Math.max(1, Math.round(percentage / 10));
    const reading = percentage >= 90 ? "Le relazioni sono solide."
      : percentage >= 70 ? "Il quadro è chiaro; il recupero può renderlo più preciso."
        : percentage >= 50 ? "Hai alcuni nuclei corretti: consolida i passaggi indicati."
          : "Conviene ripartire dai nuclei segnalati, uno alla volta.";
    quizResult.replaceChildren();
    const summary = document.createElement("p");
    summary.className = "result-summary";
    const scoreLine = document.createElement("strong");
    scoreLine.textContent = `${score}/${activeQuestions.length} · ${percentage}% · voto orientativo ${grade}/10`;
    summary.append(scoreLine, document.createElement("br"), reading);
    quizResult.appendChild(summary);
    appendRecovery(wrongIndexes);
    const attempts = safeStorageJSON("romanticismo-quiz-attempts-v2", []);
    attempts.push({ date: new Date().toISOString(), questions: activeQuestions.length, score, percentage, grade });
    safeStorageSet("romanticismo-quiz-attempts-v2", JSON.stringify(attempts.slice(-10)));
  }

  quizStart.addEventListener("click", () => {
    renderQuiz();
    quizForm.hidden = false;
    quizStart.closest(".quiz-intro").hidden = true;
    quizForm.scrollIntoView({ behavior: scrollBehavior, block: "start" });
    $("input", quizForm)?.focus({ preventScroll: true });
  });

  // Install prompt and iPad fallback guidance.
  let deferredInstallPrompt = null;
  const installButton = $("#installButton");
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.textContent = "Installa";
  });
  installButton.addEventListener("click", async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      return;
    }
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    showToast(isIOS
      ? "Su iPad: Condividi → Aggiungi alla schermata Home."
      : "Usa il menu del browser → Installa app o Aggiungi alla schermata Home.");
  });

  // Service worker, scoped to this GitHub Pages subfolder.
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("./service-worker.js", { scope: "./" });
        registration.update();
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              showToast("È disponibile una versione aggiornata. Ricarica la pagina.");
            }
          });
        });
      } catch {
        console.warn("Service worker non registrato.");
      }
    });
  }
})();

(function setupOttocentoBridge() {
  if (document.querySelector("script[data-ottocento-bridge]")) return;
  const script = document.createElement("script");
  script.src = new URL("../rete-pwa/bridge.js?v=2", location.href).href;
  script.dataset.ottocentoBridge = "";
  script.dataset.ottocentoApp = "romanticismo-lezioni";
  document.head.appendChild(script);
})();
