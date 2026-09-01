(() => {
  "use strict";

  if (document.body.dataset.page !== "lesson") return;

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const mobileBreakpoint = window.matchMedia("(max-width: 900px)");

  const initialise = () => {
    const app = $("#leopardiStudyApp");
    if (!app) {
      window.setTimeout(initialise, 40);
      return;
    }

    const header = $(".study-topbar", app);
    const readingPane = $(".reading-pane", app);
    const article = $(".lesson-article", app);
    const readingTools = $(".reading-tools", app);
    const grid = $(".study-grid", app);
    const sidebar = $(".study-sidebar", app);
    const visualPanel = $(".visual-panel", app);
    const notebookPanel = $(".notebook-panel", app);
    const dock = $(".study-bottombar", app);
    const learningDialog = $("#learningDialog");

    if (!header || !readingPane || !article || !readingTools || !grid || !sidebar || !visualPanel || !notebookPanel || !dock || !learningDialog) {
      window.setTimeout(initialise, 40);
      return;
    }
    if (document.body.classList.contains("study-focus-active")) return;

    document.body.classList.add("study-focus-active");

    /* Aspetto: un solo pulsante, con font e tema dentro il menu. */
    const studyActions = $(".study-actions", header);
    const indexButton = $("[data-open-dialog]", studyActions);
    const appearanceControl = document.createElement("div");
    appearanceControl.className = "focus-appearance-control";
    appearanceControl.innerHTML = `
      <button class="focus-appearance-trigger" type="button" aria-expanded="false" aria-controls="focus-appearance-popover" aria-label="Regola aspetto e dimensione del testo">Aa</button>
      <div class="focus-appearance-popover" id="focus-appearance-popover" hidden>
        <button type="button" data-focus-font="-1">A− Riduci</button>
        <button type="button" data-focus-font="1">A+ Ingrandisci</button>
        <button type="button" data-focus-theme>Cambia tema</button>
      </div>`;
    studyActions.insertBefore(appearanceControl, indexButton);
    const appearanceTrigger = $(".focus-appearance-trigger", appearanceControl);
    const appearancePopover = $(".focus-appearance-popover", appearanceControl);
    const themeButton = $("[data-focus-theme]", appearanceControl);
    const closeAppearance = () => {
      appearancePopover.hidden = true;
      appearanceTrigger.setAttribute("aria-expanded", "false");
    };
    const currentPreferences = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("leopardi.study.preferences.v2"));
        return saved && typeof saved === "object" ? saved : {};
      } catch {
        return {};
      }
    };
    const persistPreferences = (changes) => {
      const next = {
        theme: document.documentElement.dataset.studyTheme || "light",
        font: document.documentElement.dataset.studyFont || "medium",
        ...currentPreferences(),
        ...changes,
      };
      document.documentElement.dataset.studyTheme = next.theme;
      document.documentElement.dataset.studyFont = next.font;
      localStorage.setItem("leopardi.study.preferences.v2", JSON.stringify(next));
      themeButton.textContent = next.theme === "dark" ? "Usa tema chiaro" : "Usa tema scuro";
    };
    appearanceTrigger.addEventListener("click", () => {
      const open = appearancePopover.hidden;
      appearancePopover.hidden = !open;
      appearanceTrigger.setAttribute("aria-expanded", String(open));
    });
    $$("[data-focus-font]", appearanceControl).forEach((button) => button.addEventListener("click", () => {
      const levels = ["medium", "large", "extra"];
      const current = levels.indexOf(document.documentElement.dataset.studyFont || "medium");
      const next = Math.max(0, Math.min(levels.length - 1, current + Number(button.dataset.focusFont)));
      persistPreferences({ font: levels[next] });
      closeAppearance();
    }));
    themeButton.addEventListener("click", () => {
      persistPreferences({ theme: document.documentElement.dataset.studyTheme === "dark" ? "light" : "dark" });
      closeAppearance();
    });
    document.addEventListener("pointerdown", (event) => {
      if (!appearanceControl.contains(event.target)) closeAppearance();
    });
    persistPreferences({});

    /* Un solo pannello laterale alla volta. */
    const panelTabs = document.createElement("nav");
    panelTabs.className = "focus-panel-tabs";
    panelTabs.setAttribute("aria-label", "Materiali e appunti");
    panelTabs.innerHTML = `
      <button type="button" role="tab" data-focus-panel="visual" aria-selected="true">Osserva</button>
      <button type="button" role="tab" data-focus-panel="notes" aria-selected="false">Appunti</button>`;
    sidebar.prepend(panelTabs);
    const visualKicker = $("header small", visualPanel);
    const visualTitle = $("header h2", visualPanel);
    const notebookKicker = $("header small", notebookPanel);
    const notebookTitle = $("header h2", notebookPanel);
    if (visualKicker) visualKicker.textContent = "Materiali collegati";
    if (visualTitle) visualTitle.textContent = "Osserva";
    if (notebookKicker) notebookKicker.textContent = "Scrivi e raccogli";
    if (notebookTitle) notebookTitle.textContent = "Appunti";

    const setSidePanel = (panel) => {
      sidebar.dataset.focusPanel = panel;
      $$("[data-focus-panel]", panelTabs).forEach((button) => {
        button.setAttribute("aria-selected", String(button.dataset.focusPanel === panel));
      });
    };
    panelTabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-focus-panel]");
      if (button) setSidePanel(button.dataset.focusPanel);
    });
    setSidePanel("visual");

    $$("#visualStage [data-open-map]", app).forEach((button) => {
      const title = button.dataset.mapTitle || $("img", button)?.alt || "mappa concettuale";
      button.setAttribute("aria-label", `Apri e ingrandisci: ${title}`);
    });

    /* La selezione genera due soli comandi contestuali. */
    const oldHighlightButton = $("#highlightSelection", app);
    const oldAddSelectionButton = $("#addSelection", app);
    const oldAddHighlightsButton = $("#addHighlights", app);
    const oldClearHighlightsButton = $("#clearHighlights", app);
    const oldDownloadButton = $("#downloadNotes", app);
    const oldClearNotebookButton = $("#clearNotebook", app);

    const selectionTools = document.createElement("div");
    selectionTools.className = "focus-selection-tools";
    selectionTools.setAttribute("role", "toolbar");
    selectionTools.setAttribute("aria-label", "Azioni per il testo selezionato");
    selectionTools.hidden = true;
    selectionTools.innerHTML = `
      <button type="button" data-focus-highlight>Evidenzia</button>
      <button type="button" data-focus-add-selection>Aggiungi agli appunti</button>`;
    app.append(selectionTools);
    $$("button", selectionTools).forEach((button) => button.addEventListener("pointerdown", (event) => event.preventDefault()));
    $("[data-focus-highlight]", selectionTools).addEventListener("click", () => oldHighlightButton.click());
    $("[data-focus-add-selection]", selectionTools).addEventListener("click", () => oldAddSelectionButton.click());

    /* Download, pulizia e raccolta delle evidenziazioni restano sotto Altre azioni. */
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
    notebookPanel.append(noteTools);
    $("[data-focus-add-highlights]", noteTools).addEventListener("click", () => oldAddHighlightsButton.click());
    $("[data-focus-clear-highlights]", noteTools).addEventListener("click", () => oldClearHighlightsButton.click());
    $("[data-focus-download]", noteTools).addEventListener("click", () => oldDownloadButton.click());
    $("[data-focus-clear-notebook]", noteTools).addEventListener("click", () => oldClearNotebookButton.click());
    $(".focus-note-menu", noteTools).addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (button && !button.disabled) noteTools.open = false;
    });

    const syncReadingActions = () => {
      selectionTools.hidden = oldHighlightButton.disabled || grid.dataset.visiblePanel !== "read";
      const addHighlights = $("[data-focus-add-highlights]", noteTools);
      const clearHighlights = $("[data-focus-clear-highlights]", noteTools);
      addHighlights.disabled = oldAddHighlightsButton.disabled;
      clearHighlights.disabled = oldClearHighlightsButton.disabled;
      $("[data-focus-highlight-count]", noteTools).textContent = $("#newHighlightCount", app).textContent;
    };
    new MutationObserver(syncReadingActions).observe(readingTools, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["disabled"],
    });
    article.addEventListener("pointerup", () => window.setTimeout(syncReadingActions, 20));
    document.addEventListener("selectionchange", () => window.setTimeout(syncReadingActions, 100));
    selectionTools.addEventListener("click", () => window.setTimeout(syncReadingActions, 0));

    /* Un solo ingresso per essenziale, vocabolario e verifica. */
    const learningTabs = document.createElement("nav");
    learningTabs.className = "focus-learning-tabs";
    learningTabs.setAttribute("aria-label", "Sezioni di ripasso");
    learningTabs.innerHTML = `
      <button type="button" data-focus-learning="essentials" aria-selected="true">Essenziale</button>
      <button type="button" data-focus-learning="vocabulary" aria-selected="false">Vocabolario</button>
      <button type="button" data-focus-learning="quiz" aria-selected="false">Verifica</button>`;
    $("header", learningDialog).append(learningTabs);

    const activateLearning = (kind) => {
      if (learningDialog.open) $(".dialog-close", learningDialog).click();
      $$("[data-focus-learning]", learningTabs).forEach((button) => {
        button.setAttribute("aria-selected", String(button.dataset.focusLearning === kind));
      });
      $("[data-learning='" + kind + "']", dock).click();
    };
    learningTabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-focus-learning]");
      if (button) activateLearning(button.dataset.focusLearning);
    });

    /* Progresso e azioni inferiori. */
    const progress = document.createElement("div");
    progress.className = "focus-reading-progress";
    progress.setAttribute("aria-label", "Progresso di lettura della sessione corrente");
    progress.innerHTML = `<span><strong data-focus-progress-label>0%</strong><small>sessione</small></span><i><b data-focus-progress-bar></b></i>`;
    dock.append(progress);

    const updateProgress = () => {
      const max = readingPane.scrollHeight - readingPane.clientHeight;
      const value = max > 0 ? Math.min(100, Math.max(0, Math.round((readingPane.scrollTop / max) * 100))) : 100;
      $("[data-focus-progress-label]", progress).textContent = `${value}%`;
      $("[data-focus-progress-bar]", progress).style.width = `${value}%`;
    };
    readingPane.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    const dockActions = document.createElement("div");
    dockActions.className = "focus-dock-actions";
    dockActions.innerHTML = `
      <button class="focus-mobile-panel-button" type="button" data-focus-mobile-panel="visual" aria-pressed="false">Osserva</button>
      <button class="focus-mobile-panel-button" type="button" data-focus-mobile-panel="notes" aria-pressed="false">Appunti</button>
      <button type="button" data-focus-ripassa>Ripassa</button>`;
    dock.append(dockActions);
    $("[data-focus-ripassa]", dockActions).addEventListener("click", () => activateLearning("essentials"));

    const syncMobileButtons = () => {
      const current = grid.dataset.visiblePanel || "read";
      $$("[data-focus-mobile-panel]", dockActions).forEach((button) => {
        const panel = button.dataset.focusMobilePanel;
        const active = current === panel;
        button.setAttribute("aria-pressed", String(active));
        button.textContent = active ? "Lezione" : (panel === "visual" ? "Osserva" : "Appunti");
      });
      syncReadingActions();
    };
    dockActions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-focus-mobile-panel]");
      if (!button) return;
      const panel = button.dataset.focusMobilePanel;
      if (grid.dataset.visiblePanel === panel) {
        grid.dataset.visiblePanel = "read";
      } else {
        setSidePanel(panel);
        grid.dataset.visiblePanel = panel;
      }
      syncMobileButtons();
    });

    const handleBreakpoint = () => {
      if (!mobileBreakpoint.matches) grid.dataset.visiblePanel = "read";
      syncMobileButtons();
      updateProgress();
    };
    mobileBreakpoint.addEventListener?.("change", handleBreakpoint);
    syncReadingActions();
    syncMobileButtons();
    window.requestAnimationFrame(updateProgress);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
