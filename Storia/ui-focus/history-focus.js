(() => {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const mobileQuery = window.matchMedia("(max-width: 820px)");
  const app = $("#app");
  if (!app) return;

  let applyTimer = 0;
  let activeReading = null;
  let activeNotesBox = null;
  let activeShell = null;
  let selectedText = "";
  let selectedHost = null;

  const isLessonRoute = () => /^#lezione(?:\/|-)/.test(location.hash);
  const normalise = (value) => (value || "").replace(/\s+/g, " ").trim();
  const safeClick = (element) => element && element.click();

  const removeFocusChrome = () => {
    document.body.classList.remove("history-focus-active", "highlight-mode");
    $$(".history-focus-home,.history-focus-heading,.history-focus-actions,.history-focus-dock,.history-selection-tools,.history-focus-dialog").forEach((node) => node.remove());
    activeReading = null;
    activeNotesBox = null;
    activeShell = null;
    selectedText = "";
    selectedHost = null;
  };

  const scheduleApply = () => {
    window.clearTimeout(applyTimer);
    applyTimer = window.setTimeout(applyFocus, 30);
  };

  const moduleName = () => {
    const brand = $(".app-header .brand, .topbar .brand");
    const value = normalise(brand?.textContent);
    if (value) return value.replace(/^Percorso di storia\s*/i, "");
    return document.title.split(/[—-]/)[0].trim();
  };

  const lessonMeta = (hero) => {
    const kicker = normalise($(".overline,.kicker", hero)?.textContent);
    const title = normalise($("h1,.section-title", hero)?.textContent) || normalise($(".section-title", app)?.textContent);
    const number = (kicker.match(/Lezione\s+(\d+)/i) || [])[1];
    return {
      kicker: `${moduleName()}${number ? ` · ${String(number).padStart(2, "0")}` : ""}`,
      title,
    };
  };

  const buildHeader = (hero) => {
    const header = $(".app-header,.topbar");
    if (!header) return;
    const meta = lessonMeta(hero);

    const home = document.createElement("a");
    home.className = "history-focus-home";
    home.href = "index.html";
    home.textContent = "← Home";

    const heading = document.createElement("div");
    heading.className = "history-focus-heading";
    const small = document.createElement("small");
    small.textContent = meta.kicker;
    const strong = document.createElement("strong");
    strong.textContent = meta.title;
    heading.append(small, strong);

    const actions = document.createElement("div");
    actions.className = "history-focus-actions";
    const appearance = document.createElement("div");
    appearance.className = "history-focus-appearance";
    appearance.innerHTML = `
      <button class="history-focus-trigger" type="button" aria-expanded="false" aria-label="Regola la dimensione del testo">Aa</button>
      <div class="history-focus-popover" hidden>
        <button type="button" data-history-font="-1">A− Riduci</button>
        <button type="button" data-history-font="1">A+ Ingrandisci</button>
      </div>`;
    const indexButton = document.createElement("button");
    indexButton.type = "button";
    indexButton.dataset.historyIndex = "";
    indexButton.textContent = "Indice";
    actions.append(appearance, indexButton);
    header.append(home, heading, actions);

    const trigger = $(".history-focus-trigger", appearance);
    const popover = $(".history-focus-popover", appearance);
    const closePopover = () => {
      popover.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    };
    trigger.addEventListener("click", () => {
      const open = popover.hidden;
      popover.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
    });
    $$("[data-history-font]", appearance).forEach((button) => button.addEventListener("click", () => {
      const levels = ["medium", "large", "xlarge"];
      const current = Math.max(0, levels.indexOf(document.documentElement.dataset.historyFocusFont || "medium"));
      const next = Math.max(0, Math.min(levels.length - 1, current + Number(button.dataset.historyFont)));
      document.documentElement.dataset.historyFocusFont = levels[next];
      localStorage.setItem("gbprof-history-focus-font", levels[next]);
      closePopover();
    }));
    document.addEventListener("pointerdown", (event) => {
      if (!appearance.contains(event.target)) closePopover();
    }, { once: false });
    indexButton.addEventListener("click", () => { location.hash = "#lezioni"; });
  };

  const quickLinks = () => {
    const links = document.createElement("nav");
    links.className = "history-focus-links";
    const wanted = ["Fonti", "Mappe", "Biografie", "Timeline"];
    const candidates = $$(".desktop-nav a,.navlinks a");
    wanted.forEach((label) => {
      const original = candidates.find((link) => normalise(link.textContent).toLowerCase().startsWith(label.toLowerCase()));
      if (!original) return;
      const clone = original.cloneNode(true);
      links.append(clone);
    });
    return links;
  };

  const panelHead = (kicker, title) => {
    const head = document.createElement("header");
    head.className = "history-focus-panel-head";
    const small = document.createElement("small");
    small.textContent = kicker;
    const h2 = document.createElement("h2");
    h2.textContent = title;
    head.append(small, h2);
    return head;
  };

  const originalNotesElements = () => {
    const drawer = $("body > .notes-drawer");
    return {
      box: $("#notesBox", drawer),
      save: $("#saveNotes", drawer),
      export: $("#exportNotes", drawer),
    };
  };

  const buildClonedNotes = (oldComplete, oldPdf, oldClear) => {
    const notes = document.createElement("section");
    notes.className = "history-focus-notes";
    notes.append(panelHead("Scrivi e raccogli", "Appunti"));

    const hint = document.createElement("p");
    hint.textContent = "Annota prove, dubbi e collegamenti. Gli appunti restano in questo dispositivo.";
    const textarea = document.createElement("textarea");
    textarea.setAttribute("aria-label", "Appunti personali");
    textarea.placeholder = "Scrivi osservazioni, domande e una possibile tesi…";
    const originals = originalNotesElements();
    textarea.value = originals.box?.value || "";
    textarea.addEventListener("input", () => {
      if (!originals.box) return;
      originals.box.value = textarea.value;
      originals.box.dispatchEvent(new Event("input", { bubbles: true }));
    });
    activeNotesBox = textarea;

    const actions = document.createElement("div");
    actions.className = "history-focus-note-actions";
    const save = document.createElement("button");
    save.type = "button";
    save.textContent = "Salva";
    save.addEventListener("click", () => {
      if (originals.box) {
        originals.box.value = textarea.value;
        originals.box.dispatchEvent(new Event("input", { bubbles: true }));
      }
      safeClick(originals.save);
    });
    const download = document.createElement("button");
    download.type = "button";
    download.textContent = "Esporta TXT";
    download.addEventListener("click", () => safeClick(originals.export));
    actions.append(save, download);
    notes.append(hint, textarea, actions);

    const extraActions = [];
    if (oldComplete) extraActions.push(["Completa la lezione", () => safeClick(oldComplete)]);
    if (oldClear) extraActions.push(["Rimuovi evidenziazioni", () => safeClick(oldClear)]);
    if (oldPdf) extraActions.push(["Apri il PDF", () => safeClick(oldPdf)]);
    if (extraActions.length) {
      const details = document.createElement("details");
      details.className = "history-focus-more";
      const summary = document.createElement("summary");
      summary.textContent = "Altre azioni";
      const menu = document.createElement("div");
      menu.className = "history-focus-more-actions";
      extraActions.forEach(([label, handler]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.addEventListener("click", handler);
        menu.append(button);
      });
      details.append(summary, menu);
      notes.append(details);
    }
    return notes;
  };

  const buildSidebar = (sidebar, visualNodes, notesPanel) => {
    sidebar.classList.add("history-focus-sidebar");
    const tabs = document.createElement("nav");
    tabs.className = "history-focus-tabs";
    tabs.setAttribute("aria-label", "Materiali e appunti");
    tabs.innerHTML = `
      <button type="button" role="tab" data-history-panel="visual" aria-selected="true">Osserva</button>
      <button type="button" role="tab" data-history-panel="notes" aria-selected="false">Appunti</button>`;

    const visual = document.createElement("section");
    visual.className = "history-focus-visual";
    visual.append(panelHead("Materiali collegati", "Osserva"));
    const stage = document.createElement("div");
    stage.className = "history-focus-visual-stage";
    visualNodes.filter(Boolean).forEach((node) => stage.append(node));
    if (!stage.children.length) stage.append(quickLinks());
    visual.append(stage);

    sidebar.replaceChildren(tabs, visual, notesPanel);
    const setPanel = (panel) => {
      sidebar.dataset.focusPanel = panel;
      $$("[data-history-panel]", tabs).forEach((button) => button.setAttribute("aria-selected", String(button.dataset.historyPanel === panel)));
    };
    tabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-history-panel]");
      if (button) setPanel(button.dataset.historyPanel);
    });
    setPanel("visual");
    return setPanel;
  };

  const buildRevolutionNotes = (sidebar, supportBox) => {
    const noteNodes = [...sidebar.children].filter((node) => node !== supportBox);
    const notes = document.createElement("section");
    notes.className = "history-focus-notes";
    notes.append(panelHead("Scrivi e raccogli", "Appunti"));
    noteNodes.forEach((node) => notes.append(node));
    activeNotesBox = $("textarea", notes);
    return notes;
  };

  const apparatusByTitle = (root, pattern) => $$(".apparatus", root).filter((node) => pattern.test(normalise($("h2", node)?.textContent)));

  const buildLearningDialog = (reading, isRevolution) => {
    const essentialNodes = isRevolution
      ? []
      : apparatusByTitle(reading, /Saperi irrinunciabili|Risposta progressiva/i);
    const vocabNodes = isRevolution
      ? $$(".vocab-panel", reading)
      : apparatusByTitle(reading, /Vocabolario essenziale/i);
    const quizNodes = isRevolution ? $$(".lesson-check", reading) : [];

    if (!essentialNodes.length) {
      const question = $(".hero-question,.page-hero > p:last-child,.lead", reading);
      if (question) {
        const card = document.createElement("section");
        card.className = "history-focus-quiz-link";
        const h3 = document.createElement("h3");
        h3.textContent = "Domanda della lezione";
        const p = document.createElement("p");
        p.textContent = normalise(question.textContent);
        card.append(h3, p);
        essentialNodes.push(card);
      }
    }

    const dialog = document.createElement("dialog");
    dialog.className = "history-focus-dialog";
    const head = document.createElement("header");
    head.className = "history-focus-dialog-head";
    const titleWrap = document.createElement("div");
    const small = document.createElement("small");
    small.textContent = "Sedimentare";
    const title = document.createElement("h2");
    title.textContent = "Ripassa la lezione";
    titleWrap.append(small, title);
    const close = document.createElement("button");
    close.type = "button";
    close.className = "history-focus-dialog-close";
    close.setAttribute("aria-label", "Chiudi");
    close.textContent = "×";
    head.append(titleWrap, close);

    const tabs = document.createElement("nav");
    tabs.className = "history-focus-learning-tabs";
    tabs.setAttribute("aria-label", "Sezioni di ripasso");
    tabs.innerHTML = `
      <button type="button" data-history-learning="essential" aria-selected="true">Essenziale</button>
      <button type="button" data-history-learning="vocabulary" aria-selected="false">Vocabolario</button>
      <button type="button" data-history-learning="quiz" aria-selected="false">Verifica</button>`;

    const panels = {};
    [["essential", essentialNodes], ["vocabulary", vocabNodes], ["quiz", quizNodes]].forEach(([name, nodes]) => {
      const panel = document.createElement("section");
      panel.className = "history-focus-learning-panel";
      panel.dataset.historyLearningPanel = name;
      panel.hidden = name !== "essential";
      nodes.forEach((node) => panel.append(node));
      panels[name] = panel;
      dialog.append(panel);
    });

    if (!panels.quiz.children.length) {
      const card = document.createElement("section");
      card.className = "history-focus-quiz-link";
      const h3 = document.createElement("h3");
      h3.textContent = "Quiz del percorso";
      const p = document.createElement("p");
      p.textContent = "Verifica i nessi della lezione nel quiz del modulo.";
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Apri il quiz";
      button.addEventListener("click", () => {
        dialog.close();
        location.hash = "#quiz";
      });
      card.append(h3, p, button);
      panels.quiz.append(card);
    }

    dialog.prepend(head, tabs);
    document.body.append(dialog);
    const activate = (name) => {
      $$("[data-history-learning]", tabs).forEach((button) => button.setAttribute("aria-selected", String(button.dataset.historyLearning === name)));
      Object.entries(panels).forEach(([key, panel]) => { panel.hidden = key !== name; });
    };
    tabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-history-learning]");
      if (button) activate(button.dataset.historyLearning);
    });
    close.addEventListener("click", () => dialog.close());
    activate("essential");
    return dialog;
  };

  const buildSelectionTools = (reading, notesBox, oldHighlight) => {
    const tools = document.createElement("div");
    tools.className = "history-selection-tools";
    tools.hidden = true;
    tools.setAttribute("role", "toolbar");
    tools.setAttribute("aria-label", "Azioni per il testo selezionato");
    const highlight = document.createElement("button");
    highlight.type = "button";
    highlight.textContent = "Evidenzia";
    const add = document.createElement("button");
    add.type = "button";
    add.textContent = "Aggiungi agli appunti";
    tools.append(highlight, add);
    document.body.append(tools);
    $$('button', tools).forEach((button) => button.addEventListener("pointerdown", (event) => event.preventDefault()));

    const capture = () => {
      const selection = window.getSelection();
      const text = normalise(selection?.toString());
      const anchor = selection?.anchorNode;
      const host = anchor?.nodeType === Node.TEXT_NODE ? anchor.parentElement : anchor;
      if (text.length > 1 && host && reading.contains(host)) {
        selectedText = text;
        selectedHost = host.closest("p,li,blockquote") || host;
        tools.hidden = false;
      } else {
        tools.hidden = true;
      }
    };
    reading.addEventListener("pointerup", () => window.setTimeout(capture, 0));
    reading.addEventListener("keyup", () => window.setTimeout(capture, 0));
    document.addEventListener("selectionchange", () => window.setTimeout(capture, 80));

    highlight.addEventListener("click", () => {
      if (!oldHighlight) return;
      if (oldHighlight.matches("[data-highlight]")) {
        if (!document.body.classList.contains("highlight-mode")) oldHighlight.click();
        selectedHost?.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        if (document.body.classList.contains("highlight-mode")) oldHighlight.click();
      } else {
        oldHighlight.click();
      }
      tools.hidden = true;
    });
    add.addEventListener("click", () => {
      if (!selectedText || !notesBox) return;
      notesBox.value = `${notesBox.value.trim()}${notesBox.value.trim() ? "\n\n" : ""}${selectedText}`;
      notesBox.dispatchEvent(new Event("input", { bubbles: true }));
      tools.hidden = true;
    });
  };

  const buildDock = (reading, shell, setPanel, dialog) => {
    const dock = document.createElement("footer");
    dock.className = "history-focus-dock";
    const progress = document.createElement("div");
    progress.className = "history-focus-progress";
    progress.innerHTML = `<span><strong>0%</strong><small>sessione</small></span><i><b></b></i>`;
    const actions = document.createElement("div");
    actions.className = "history-focus-dock-actions";
    actions.innerHTML = `
      <button class="history-focus-mobile-button" type="button" data-history-mobile="visual" aria-pressed="false">Osserva</button>
      <button class="history-focus-mobile-button" type="button" data-history-mobile="notes" aria-pressed="false">Appunti</button>
      <button type="button" data-history-review>Ripassa</button>`;
    dock.append(progress, actions);
    document.body.append(dock);

    const updateProgress = () => {
      const max = reading.scrollHeight - reading.clientHeight;
      const value = max > 0 ? Math.min(100, Math.max(0, Math.round(reading.scrollTop / max * 100))) : 100;
      $("strong", progress).textContent = `${value}%`;
      $("b", progress).style.width = `${value}%`;
    };
    reading.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    $("[data-history-review]", actions).addEventListener("click", () => dialog.showModal());

    const syncMobile = () => {
      const current = shell.dataset.mobilePanel || "read";
      $$("[data-history-mobile]", actions).forEach((button) => {
        const panel = button.dataset.historyMobile;
        const active = current === panel;
        button.setAttribute("aria-pressed", String(active));
        button.textContent = active ? "Lezione" : (panel === "visual" ? "Osserva" : "Appunti");
      });
    };
    actions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-history-mobile]");
      if (!button) return;
      const panel = button.dataset.historyMobile;
      if (shell.dataset.mobilePanel === panel) {
        shell.dataset.mobilePanel = "read";
      } else {
        setPanel(panel);
        shell.dataset.mobilePanel = panel;
      }
      syncMobile();
    });
    const handleBreakpoint = () => {
      if (!mobileQuery.matches) shell.dataset.mobilePanel = "read";
      syncMobile();
      updateProgress();
    };
    mobileQuery.addEventListener?.("change", handleBreakpoint);
    handleBreakpoint();
  };

  function applyFocus() {
    if (!isLessonRoute()) {
      if (document.body.classList.contains("history-focus-active")) removeFocusChrome();
      return;
    }
    if ($(".history-focus-shell", app) && document.body.classList.contains("history-focus-active")) return;
    const hero = $(".page-hero", app) || app;
    const generic = $(".reading-container", app);
    const advancedShell = $(".lesson-shell", app);
    const revolutionShell = $(".reader-layout", app);
    if (!generic && !advancedShell && !revolutionShell) return;

    removeFocusChrome();
    document.body.classList.add("history-focus-active");
    const savedFont = localStorage.getItem("gbprof-history-focus-font") || "medium";
    document.documentElement.dataset.historyFocusFont = ["medium", "large", "xlarge"].includes(savedFont) ? savedFont : "medium";
    buildHeader(hero);

    let shell;
    let reading;
    let sidebar;
    let visualNodes = [];
    let notes;
    let isRevolution = false;
    let oldHighlight;
    let oldClear;
    let oldComplete;
    let oldPdf;

    if (revolutionShell) {
      isRevolution = true;
      shell = revolutionShell;
      reading = $(".reader-panel", shell);
      sidebar = $(".notes-panel", shell);
      shell.classList.add("history-focus-shell");
      reading.classList.add("history-focus-reading");
      const support = $(".support-box", sidebar);
      if (support) visualNodes.push(support);
      notes = buildRevolutionNotes(sidebar, support);
      oldHighlight = $(`.reader-tools button[onclick*="highlightSelection"]`, reading);
      oldClear = $(`.reader-tools button[onclick*="clearHighlights"]`, reading);
      app.append(shell);
      [...app.children].forEach((child) => { if (child !== shell) child.remove(); });
    } else if (advancedShell) {
      shell = advancedShell;
      reading = $(".lesson-reader", shell);
      sidebar = $(".lesson-sidebar", shell);
      shell.classList.add("history-focus-shell");
      reading.classList.add("history-focus-reading");
      const pageHero = $(".page-hero", app);
      if (pageHero) reading.prepend(pageHero);
      visualNodes = $$(".side-card", sidebar);
      oldHighlight = $("[data-tool='highlight']", reading);
      oldClear = $("[data-tool='clear']", reading);
      oldComplete = $("#completeLesson", reading);
      oldPdf = $(`a[href*="assets/pdf/lezioni"]`, sidebar);
      notes = buildClonedNotes(oldComplete, oldPdf, oldClear);
      app.append(shell);
      [...app.children].forEach((child) => { if (child !== shell) child.remove(); });
    } else {
      shell = document.createElement("div");
      shell.className = "history-focus-shell";
      reading = document.createElement("section");
      reading.className = "history-focus-reading";
      sidebar = document.createElement("aside");
      sidebar.className = "history-focus-sidebar";
      oldHighlight = $("[data-highlight]", generic);
      oldComplete = $("[data-complete]", generic);
      oldPdf = $(".lesson-tools a[href]", generic);
      const coordinate = apparatusByTitle(generic, /Coordinate/i)[0];
      visualNodes = [$(".source-link", generic), $(".lesson-connections", generic), coordinate].filter(Boolean);
      notes = buildClonedNotes(oldComplete, oldPdf, null);
      reading.append(generic);
      shell.append(reading, sidebar);
      app.replaceChildren(shell);
    }

    shell.dataset.mobilePanel = "read";
    activeReading = reading;
    activeShell = shell;
    const setPanel = buildSidebar(sidebar, visualNodes, notes);
    const dialog = buildLearningDialog(reading, isRevolution);
    buildSelectionTools(reading, activeNotesBox, oldHighlight);
    buildDock(reading, shell, setPanel, dialog);
  }

  const observer = new MutationObserver(scheduleApply);
  observer.observe(app, { childList: true, subtree: false });
  window.addEventListener("hashchange", scheduleApply);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleApply, { once: true });
  } else {
    scheduleApply();
  }
})();
