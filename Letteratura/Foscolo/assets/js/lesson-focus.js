(() => {
  "use strict";

  if (document.body.dataset.page !== "lesson") return;

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const mobileBreakpoint = window.matchMedia("(max-width: 820px)");

  const initialise = () => {
    const header = $(".study-topbar");
    const article = $(".lesson-article");
    const readingSurface = $(".lesson-reading");
    const readingTools = $(".reading-tools");
    const sidebar = $(".lesson-sidebar");
    const visualPane = $(".visual-context-pane", sidebar);
    const notebookPane = $(".notebook-pane", sidebar);
    const dock = $(".study-bottombar");
    const learningDialog = $(".learning-dialog");

    if (!header || !article || !readingSurface || !readingTools || !sidebar || !visualPane || !notebookPane || !dock || !learningDialog) {
      window.setTimeout(initialise, 40);
      return;
    }
    if (document.body.classList.contains("focus-prototype")) return;

    document.body.classList.add("focus-prototype");

    const refreshChromeSizes = () => {
      document.documentElement.style.setProperty("--study-header-height", `${header.offsetHeight}px`);
      document.documentElement.style.setProperty("--study-dock-height", `${dock.offsetHeight}px`);
    };

    /* Un solo comando tipografico, con le due regolazioni dentro un piccolo menu. */
    const studyActions = $(".study-actions", header);
    const indexButton = $("[data-open-index]", studyActions);
    const fontControl = document.createElement("div");
    fontControl.className = "focus-font-control";
    fontControl.innerHTML = `
      <button class="focus-font-trigger" type="button" aria-expanded="false" aria-controls="focus-font-popover" aria-label="Regola la dimensione del testo">Aa</button>
      <div class="focus-font-popover" id="focus-font-popover" hidden>
        <button type="button" data-focus-font="-">A− Riduci</button>
        <button type="button" data-focus-font="+">A+ Ingrandisci</button>
      </div>`;
    studyActions.insertBefore(fontControl, indexButton);
    const fontTrigger = $(".focus-font-trigger", fontControl);
    const fontPopover = $(".focus-font-popover", fontControl);
    const closeFontMenu = () => {
      fontPopover.hidden = true;
      fontTrigger.setAttribute("aria-expanded", "false");
    };
    fontTrigger.addEventListener("click", () => {
      const willOpen = fontPopover.hidden;
      fontPopover.hidden = !willOpen;
      fontTrigger.setAttribute("aria-expanded", String(willOpen));
    });
    $("[data-focus-font='-']", fontControl).addEventListener("click", () => {
      $("[data-font='-']", studyActions).click();
      closeFontMenu();
    });
    $("[data-focus-font='+']", fontControl).addEventListener("click", () => {
      $("[data-font='+']", studyActions).click();
      closeFontMenu();
    });
    document.addEventListener("pointerdown", event => {
      if (!fontControl.contains(event.target)) closeFontMenu();
    });

    /* Un solo pannello laterale alla volta. */
    const panelTabs = document.createElement("nav");
    panelTabs.className = "focus-panel-tabs";
    panelTabs.setAttribute("aria-label", "Materiali e appunti");
    panelTabs.innerHTML = `
      <button type="button" role="tab" data-focus-panel="visual" aria-selected="true">Osserva</button>
      <button type="button" role="tab" data-focus-panel="notes" aria-selected="false">Appunti</button>`;
    sidebar.prepend(panelTabs);

    const visualKicker = $(".workspace-panel-header > p", visualPane);
    const visualTitle = $(".workspace-panel-header h2", visualPane);
    const notebookKicker = $(".workspace-panel-header p", notebookPane);
    const notebookTitle = $(".workspace-panel-header h2", notebookPane);
    if (visualKicker) visualKicker.textContent = "Materiali collegati";
    if (visualTitle) visualTitle.textContent = "Osserva";
    if (notebookKicker) notebookKicker.textContent = "Scrivi e raccogli";
    if (notebookTitle) notebookTitle.textContent = "Appunti";

    const setSidePanel = panel => {
      sidebar.dataset.focusPanel = panel;
      $$("[data-focus-panel]", panelTabs).forEach(button => {
        button.setAttribute("aria-selected", String(button.dataset.focusPanel === panel));
      });
    };
    panelTabs.addEventListener("click", event => {
      const button = event.target.closest("[data-focus-panel]");
      if (button) setSidePanel(button.dataset.focusPanel);
    });
    setSidePanel("visual");

    $$("[data-open-map]", visualPane).forEach(button => {
      const title = button.dataset.mapTitle || $("img", button)?.alt || "mappa concettuale";
      button.setAttribute("aria-label", `Apri e ingrandisci: ${title}`);
    });

    /* Gli strumenti di lettura compaiono solo quando esiste una selezione valida. */
    const oldHighlightButton = $("[data-highlight-selection]", readingTools);
    const oldAddSelectionButton = $("[data-add-selection]", readingTools);
    const oldAddHighlightsButton = $("[data-add-highlights]", readingTools);
    const oldClearHighlightsButton = $("[data-clear-highlights]", readingTools);
    const oldDownloadButton = $("[data-download-notes]", notebookPane);
    const oldClearNotebookButton = $("[data-clear-notebook]", notebookPane);

    const selectionTools = document.createElement("div");
    selectionTools.className = "focus-selection-tools";
    selectionTools.setAttribute("role", "toolbar");
    selectionTools.setAttribute("aria-label", "Azioni per il testo selezionato");
    selectionTools.hidden = true;
    selectionTools.innerHTML = `
      <button type="button" data-focus-highlight>Evidenzia</button>
      <button type="button" data-focus-add-selection>Aggiungi agli appunti</button>`;
    document.body.append(selectionTools);

    $$("button", selectionTools).forEach(button => {
      button.addEventListener("pointerdown", event => event.preventDefault());
    });
    $("[data-focus-highlight]", selectionTools).addEventListener("click", () => oldHighlightButton.click());
    $("[data-focus-add-selection]", selectionTools).addEventListener("click", () => oldAddSelectionButton.click());

    /* Le azioni meno frequenti restano disponibili dentro Appunti. */
    const noteTools = document.createElement("details");
    noteTools.className = "focus-note-tools";
    noteTools.innerHTML = `
      <summary>Altre azioni</summary>
      <div class="focus-note-menu">
        <button type="button" data-focus-add-highlights>Incolla evidenziati <span data-focus-highlight-count>0</span></button>
        <button type="button" data-focus-clear-highlights>Rimuovi evidenziature</button>
        <button type="button" data-focus-download>Scarica gli appunti</button>
        <button type="button" class="danger" data-focus-clear-notebook>Cancella gli appunti</button>
      </div>`;
    notebookPane.append(noteTools);
    $("[data-focus-add-highlights]", noteTools).addEventListener("click", () => oldAddHighlightsButton.click());
    $("[data-focus-clear-highlights]", noteTools).addEventListener("click", () => oldClearHighlightsButton.click());
    $("[data-focus-download]", noteTools).addEventListener("click", () => oldDownloadButton.click());
    $("[data-focus-clear-notebook]", noteTools).addEventListener("click", () => oldClearNotebookButton.click());
    $(".focus-note-menu", noteTools).addEventListener("click", event => {
      if (event.target.closest("button") && !event.target.closest("button").disabled) noteTools.open = false;
    });

    const syncReadingActions = () => {
      selectionTools.hidden = oldHighlightButton.disabled || document.body.dataset.mobilePanel !== "read";
      const addHighlights = $("[data-focus-add-highlights]", noteTools);
      const clearHighlights = $("[data-focus-clear-highlights]", noteTools);
      addHighlights.disabled = oldAddHighlightsButton.disabled;
      clearHighlights.disabled = oldClearHighlightsButton.disabled;
      $("[data-focus-highlight-count]", noteTools).textContent = $("[data-highlight-count]", readingTools).textContent;
    };
    new MutationObserver(syncReadingActions).observe(readingTools, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["disabled"]
    });
    readingSurface.addEventListener("pointerup", () => window.setTimeout(syncReadingActions, 20));
    document.addEventListener("selectionchange", () => window.setTimeout(syncReadingActions, 140));
    selectionTools.addEventListener("click", () => window.setTimeout(syncReadingActions, 0));

    /* Un solo ingresso per sintesi, vocabolario e verifica. */
    const learningHeader = $("header", learningDialog);
    const learningTabs = document.createElement("nav");
    learningTabs.className = "focus-learning-tabs";
    learningTabs.setAttribute("aria-label", "Sezioni di ripasso");
    learningTabs.innerHTML = `
      <button type="button" data-focus-learning="essentials" aria-selected="true">Essenziale</button>
      <button type="button" data-focus-learning="vocab" aria-selected="false">Vocabolario</button>
      <button type="button" data-focus-learning="test" aria-selected="false">Verifica</button>`;
    learningHeader.append(learningTabs);

    const activateLearning = type => {
      if (learningDialog.open) learningDialog.close();
      $$("[data-focus-learning]", learningTabs).forEach(button => {
        button.setAttribute("aria-selected", String(button.dataset.focusLearning === type));
      });
      $("[data-learning-panel='" + type + "']", dock).click();
    };
    learningTabs.addEventListener("click", event => {
      const button = event.target.closest("[data-focus-learning]");
      if (button) activateLearning(button.dataset.focusLearning);
    });

    const dockActions = document.createElement("div");
    dockActions.className = "focus-dock-actions";
    dockActions.innerHTML = `
      <button class="focus-mobile-panel-button" type="button" data-focus-mobile-panel="visual" aria-pressed="false">Osserva</button>
      <button class="focus-mobile-panel-button" type="button" data-focus-mobile-panel="notes" aria-pressed="false">Appunti</button>
      <button type="button" data-focus-ripassa>Ripassa</button>`;
    dock.append(dockActions);
    $("[data-focus-ripassa]", dockActions).addEventListener("click", () => activateLearning("essentials"));

    const syncMobileButtons = () => {
      const current = document.body.dataset.mobilePanel || "read";
      $$("[data-focus-mobile-panel]", dockActions).forEach(button => {
        const panel = button.dataset.focusMobilePanel;
        const matchingView = panel === "visual" ? "visual" : "notes";
        const active = current === matchingView;
        button.setAttribute("aria-pressed", String(active));
        button.textContent = active ? "Lezione" : (panel === "visual" ? "Osserva" : "Appunti");
      });
      syncReadingActions();
    };
    dockActions.addEventListener("click", event => {
      const button = event.target.closest("[data-focus-mobile-panel]");
      if (!button) return;
      const panel = button.dataset.focusMobilePanel;
      const targetView = panel === "visual" ? "visual" : "notes";
      if (document.body.dataset.mobilePanel === targetView) {
        document.body.dataset.mobilePanel = "read";
      } else {
        setSidePanel(panel);
        document.body.dataset.mobilePanel = targetView;
      }
      syncMobileButtons();
    });

    const handleBreakpoint = () => {
      if (!mobileBreakpoint.matches) document.body.dataset.mobilePanel = "read";
      syncMobileButtons();
      window.requestAnimationFrame(refreshChromeSizes);
    };
    mobileBreakpoint.addEventListener?.("change", handleBreakpoint);
    window.addEventListener("resize", refreshChromeSizes, { passive: true });
    syncReadingActions();
    syncMobileButtons();
    window.requestAnimationFrame(refreshChromeSizes);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
