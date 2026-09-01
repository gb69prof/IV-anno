(() => {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const mobileBreakpoint = window.matchMedia("(max-width: 820px)");
  const lessonOrder = ["introduzione", "fratture", "immagine-del-mondo", "poetica", "opere", "capitoli", "conclusione"];

  const initialise = () => {
    const header = $(".site-header");
    const shell = $(".lesson-shell");
    const article = $(".lesson-article");
    const source = $(".reading-source", article);
    const readingTools = $(".reading-tools", article);
    const sidebar = $(".lesson-sidebar");
    const visualPanel = $(".visual-panel", sidebar);
    const notebookPanel = $(".notebook-panel", sidebar);
    const dock = $(".study-bottombar");
    const learningDialog = $("[data-learning-dialog]");

    if (!document.body.classList.contains("study-mode") || !header || !shell || !article || !source || !readingTools || !sidebar || !visualPanel || !notebookPanel || !dock || !learningDialog) {
      window.setTimeout(initialise, 40);
      return;
    }
    if (document.body.classList.contains("manzoni-focus-active")) return;

    document.body.classList.add("manzoni-focus-active");
    header.classList.add("study-topbar");
    document.documentElement.dataset.theme = "light";
    localStorage.setItem("manzoni-study-v5-theme", JSON.stringify("light"));
    shell.dataset.mobilePanel = "read";

    const lessonId = document.body.dataset.lesson || "";
    const lessonIndex = lessonOrder.indexOf(lessonId);
    const headingMeta = $(".study-heading span", header);
    if (headingMeta) headingMeta.textContent = `Alessandro Manzoni${lessonIndex >= 0 ? ` · ${String(lessonIndex + 1).padStart(2, "0")}` : ""}`;

    /* Come in Foscolo: un solo pulsante Aa con due regolazioni tipografiche. */
    const studyActions = $(".study-actions", header);
    const indexButton = $("[data-open-index]", studyActions);
    const appearanceControl = document.createElement("div");
    appearanceControl.className = "focus-appearance-control";
    appearanceControl.innerHTML = `
      <button class="focus-appearance-trigger" type="button" aria-expanded="false" aria-controls="focus-appearance-popover" aria-label="Regola la dimensione del testo">Aa</button>
      <div class="focus-appearance-popover" id="focus-appearance-popover" hidden>
        <button type="button" data-focus-font="-1">A− Riduci</button>
        <button type="button" data-focus-font="1">A+ Ingrandisci</button>
      </div>`;
    studyActions.insertBefore(appearanceControl, indexButton);
    const appearanceTrigger = $(".focus-appearance-trigger", appearanceControl);
    const appearancePopover = $(".focus-appearance-popover", appearanceControl);
    const closeAppearance = () => {
      appearancePopover.hidden = true;
      appearanceTrigger.setAttribute("aria-expanded", "false");
    };
    appearanceTrigger.addEventListener("click", () => {
      const open = appearancePopover.hidden;
      appearancePopover.hidden = !open;
      appearanceTrigger.setAttribute("aria-expanded", String(open));
    });
    $$("[data-focus-font]", appearanceControl).forEach((button) => button.addEventListener("click", () => {
      const levels = ["medium", "large", "xlarge"];
      const current = Math.max(0, levels.indexOf(document.documentElement.dataset.font || "medium"));
      const next = Math.max(0, Math.min(levels.length - 1, current + Number(button.dataset.focusFont)));
      document.documentElement.dataset.font = levels[next];
      localStorage.setItem("manzoni-study-v5-font", JSON.stringify(levels[next]));
      closeAppearance();
    }));
    document.addEventListener("pointerdown", (event) => {
      if (!appearanceControl.contains(event.target)) closeAppearance();
    });

    /* Un solo pannello laterale alla volta. */
    const panelTabs = document.createElement("nav");
    panelTabs.className = "focus-panel-tabs";
    panelTabs.setAttribute("aria-label", "Materiali e appunti");
    panelTabs.innerHTML = `
      <button type="button" role="tab" data-focus-panel="visual" aria-selected="true">Osserva</button>
      <button type="button" role="tab" data-focus-panel="notes" aria-selected="false">Appunti</button>`;
    sidebar.prepend(panelTabs);
    const visualKicker = $("header p", visualPanel);
    const visualTitle = $("header h2", visualPanel);
    const notebookKicker = $("header p", notebookPanel);
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

    /* I materiali visivi sono impilati e scorrono, come nel modello Foscolo. */
    const oldChoices = $$(".visual-choices [data-visual-index]", visualPanel);
    const oldOpenVisual = $("[data-context-open]", visualPanel);
    const visualStage = document.createElement("div");
    visualStage.className = "focus-visual-stage";
    oldChoices.forEach((choice, index) => {
      const image = $("img", choice);
      const label = $("span", choice)?.textContent?.trim() || choice.getAttribute("aria-label")?.replace(/^Mostra\s+/, "") || "Materiale visivo";
      const card = document.createElement("figure");
      card.className = "focus-visual-card";
      card.innerHTML = `<button type="button" data-focus-open-visual="${index}" aria-label="Apri e ingrandisci: ${label.replace(/"/g, "&quot;")}"><img src="${image?.src || ""}" alt="${label.replace(/"/g, "&quot;")}"></button><figcaption>${label}</figcaption>`;
      visualStage.append(card);
    });
    visualPanel.append(visualStage);
    visualStage.addEventListener("click", (event) => {
      const button = event.target.closest("[data-focus-open-visual]");
      if (!button) return;
      oldChoices[Number(button.dataset.focusOpenVisual)]?.click();
      window.setTimeout(() => oldOpenVisual?.click(), 0);
    });

    /* La selezione mostra soltanto i due comandi utili in quel momento. */
    const oldHighlightButton = $("[data-highlight]", readingTools);
    const oldAddSelectionButton = $("[data-add-selection]", readingTools);
    const oldAddHighlightsButton = $("[data-add-highlights]", readingTools);
    const oldClearHighlightsButton = $("[data-clear-highlights]", readingTools);
    const oldDownloadButton = $("[data-download]", notebookPanel);
    const oldClearNotebookButton = $("[data-clear-notebook]", notebookPanel);

    const selectionTools = document.createElement("div");
    selectionTools.className = "focus-selection-tools";
    selectionTools.setAttribute("role", "toolbar");
    selectionTools.setAttribute("aria-label", "Azioni per il testo selezionato");
    selectionTools.hidden = true;
    selectionTools.innerHTML = `
      <button type="button" data-focus-highlight>Evidenzia</button>
      <button type="button" data-focus-add-selection>Aggiungi agli appunti</button>`;
    document.body.append(selectionTools);
    $$("button", selectionTools).forEach((button) => button.addEventListener("pointerdown", (event) => event.preventDefault()));
    $("[data-focus-highlight]", selectionTools).addEventListener("click", () => oldHighlightButton.click());
    $("[data-focus-add-selection]", selectionTools).addEventListener("click", () => oldAddSelectionButton.click());

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
      selectionTools.hidden = oldHighlightButton.disabled || shell.dataset.mobilePanel !== "read";
      $("[data-focus-add-highlights]", noteTools).disabled = oldAddHighlightsButton.disabled;
      $("[data-focus-clear-highlights]", noteTools).disabled = oldClearHighlightsButton.disabled;
      $("[data-focus-highlight-count]", noteTools).textContent = $("[data-highlight-count]", readingTools)?.textContent || "0";
    };
    new MutationObserver(syncReadingActions).observe(readingTools, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["disabled"],
    });
    source.addEventListener("pointerup", () => window.setTimeout(syncReadingActions, 20));
    document.addEventListener("selectionchange", () => window.setTimeout(syncReadingActions, 100));
    selectionTools.addEventListener("click", () => window.setTimeout(syncReadingActions, 0));

    /* Saperi, vocabolario e test entrano da un solo dialogo: Ripassa. */
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

    const progress = document.createElement("div");
    progress.className = "focus-reading-progress";
    progress.setAttribute("aria-label", "Progresso di lettura della sessione corrente");
    progress.innerHTML = `<span><strong data-focus-progress-label>0%</strong><small>sessione</small></span><i><b data-focus-progress-bar></b></i>`;
    dock.append(progress);

    const updateProgress = () => {
      const max = article.scrollHeight - article.clientHeight;
      const value = max > 0 ? Math.min(100, Math.max(0, Math.round((article.scrollTop / max) * 100))) : 100;
      $("[data-focus-progress-label]", progress).textContent = `${value}%`;
      $("[data-focus-progress-bar]", progress).style.width = `${value}%`;
    };
    article.addEventListener("scroll", updateProgress, { passive: true });
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
      const current = shell.dataset.mobilePanel || "read";
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
      if (shell.dataset.mobilePanel === panel) {
        shell.dataset.mobilePanel = "read";
      } else {
        setSidePanel(panel);
        shell.dataset.mobilePanel = panel;
      }
      syncMobileButtons();
    });

    const handleBreakpoint = () => {
      if (!mobileBreakpoint.matches) shell.dataset.mobilePanel = "read";
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
