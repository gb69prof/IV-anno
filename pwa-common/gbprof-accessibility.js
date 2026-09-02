(() => {
  "use strict";

  const rootPrefix = (() => {
    const script = document.currentScript;
    if (!script?.src) return "../../";
    return new URL("../", script.src).href;
  })();

  const text = (value) => (value || "").replace(/\s+/g, " ").trim();

  function ensureMainLandmark() {
    let main = document.querySelector("main,[role='main']");
    if (!main) {
      main = document.querySelector("#app,#root,#start-screen,#scene,#game-canvas") || document.body.firstElementChild;
      if (main) main.setAttribute("role", "main");
    }
    if (!main) return;
    if (!main.id) main.id = "contenuto-principale";
    if (!main.hasAttribute("tabindex")) main.tabIndex = -1;

    if (!document.querySelector(".skip-link,.skip,[href^='#contenuto'],[href='#mainContent'],.gbprof-skip-link")) {
      const skip = document.createElement("a");
      skip.className = "gbprof-skip-link";
      skip.href = `#${main.id}`;
      skip.textContent = "Vai al contenuto";
      document.body.prepend(skip);
    }
  }

  function hardenExternalLinks() {
    document.querySelectorAll("a[target='_blank']").forEach((link) => {
      const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      link.setAttribute("rel", [...rel].join(" "));
    });
  }

  function prepareExternalVideos() {
    document.querySelectorAll("iframe[data-gbprof-src]").forEach((frame) => {
      const source = frame.dataset.gbprofSrc;
      if (!source || !/youtube(?:-nocookie)?\.com|youtu\.be/i.test(source)) return;

      const title = text(frame.getAttribute("title")) || "Video didattico";
      const placeholder = document.createElement("div");
      placeholder.className = `gbprof-external-video ${frame.className || ""}`.trim();
      placeholder.setAttribute("data-video-title", title);

      const content = document.createElement("div");
      content.className = "gbprof-external-video__content";
      const heading = document.createElement("strong");
      heading.textContent = title;
      const notice = document.createElement("span");
      notice.textContent = "Il video è ospitato su YouTube. Aprendolo verrà stabilita una connessione con il servizio esterno.";
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Guarda il video";
      button.addEventListener("click", () => {
        frame.src = source.replace("youtube.com", "youtube-nocookie.com");
        frame.removeAttribute("data-gbprof-src");
        frame.setAttribute("loading", "lazy");
        placeholder.replaceWith(frame);
        frame.focus();
      }, { once: true });
      content.append(heading, notice, button);
      placeholder.append(content);
      frame.replaceWith(placeholder);
    });
  }

  function storageScope() {
    const path = location.pathname.toLowerCase();
    const prefixes = [];
    const exact = [];
    const historyKey = window.HIST_DATA?.meta?.storageKey;
    if (historyKey) prefixes.push(`${historyKey}:`);

    const rules = [
      ["/storia/napoleone/", ["napNotes:"], ["napCompleted"]],
      ["/storia/restaurazione/", ["restNotes:"], ["restCompleted"]],
      ["/storia/rivoluzione-francese/", ["rf-"], []],
      ["/storia/gioco-unita-mobile/", [], ["italia1861-cantiere-v1"]],
      ["/storia/gioco-unita/", [], ["italia1861-cantiere-v1"]],
      ["/letteratura/foscolo-gioco-3d/", ["foscolo-tempio-"], []],
      ["/letteratura/foscolo-testi/", [], ["foscolo-notes", "foscolo-favorites", "foscolo-reader-size"]],
      ["/letteratura/foscolo/", ["foscolo-study-v10-", "foscolo-notes-", "foscolo-lesson-"], []],
      ["/letteratura/leopardi-testi/", ["leopardi-testi:"], []],
      ["/letteratura/leopardi/", ["leopardi.", "leopardi-notes-"], []],
      ["/letteratura/manzoni/", ["manzoni-study-v5-"], []],
      ["/letteratura/parini/", [], ["parini-study-state-v1"]],
      ["/letteratura/romanticismo-lezioni/", ["romanticismo-"], []],
      ["/letteratura/romanticismo/", ["romanticismo-study-v3:"], []],
      ["/letteratura/settecento-illuminista/", ["settecento:"], []],
      ["/letteratura/manuale-ottocento-letterario/", ["manualeOttocento."], []],
      ["/letteratura/colle-vulcano/", ["leopardi.journey.", "leopardi.bridge."], []],
      ["/letteratura/prova/", ["gbprof-prova:"], []]
    ];

    rules.forEach(([fragment, rulePrefixes, ruleExact]) => {
      if (path.includes(fragment)) {
        prefixes.push(...rulePrefixes);
        exact.push(...ruleExact);
      }
    });
    return { prefixes: [...new Set(prefixes)], exact: [...new Set(exact)] };
  }

  function addComplianceFooter() {
    if (document.querySelector("[data-gbprof-compliance-footer]")) return;
    const scope = storageScope();
    const footer = document.createElement("footer");
    footer.className = "gbprof-compliance-footer";
    footer.dataset.gbprofComplianceFooter = "";
    footer.setAttribute("aria-label", "Informazioni sui materiali didattici");

    const privacy = document.createElement("a");
    privacy.href = new URL("privacy.html", rootPrefix).href;
    privacy.textContent = "Privacy dei materiali";
    const accessibility = document.createElement("a");
    accessibility.href = new URL("accessibilita.html", rootPrefix).href;
    accessibility.textContent = "Accessibilità";
    footer.append(privacy, accessibility);

    if (scope.prefixes.length || scope.exact.length) {
      const reset = document.createElement("button");
      reset.type = "button";
      reset.className = "gbprof-data-reset";
      reset.textContent = "Cancella i dati salvati su questo dispositivo";
      const status = document.createElement("p");
      status.className = "gbprof-reset-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      reset.addEventListener("click", () => {
        const accepted = window.confirm("Cancellare appunti, progressi e preferenze salvati da questa PWA su questo dispositivo?");
        if (!accepted) return;
        const keys = [];
        for (let index = 0; index < localStorage.length; index += 1) {
          const key = localStorage.key(index);
          if (key && (scope.exact.includes(key) || scope.prefixes.some((prefix) => key.startsWith(prefix)))) keys.push(key);
        }
        keys.forEach((key) => localStorage.removeItem(key));
        status.textContent = keys.length ? "Dati locali della PWA cancellati." : "Non risultavano dati locali da cancellare.";
      });
      footer.append(reset, status);
    }

    const startScreen = document.querySelector("#start-screen .start-card,#start-screen .prologue-card,#intro");
    if (startScreen) footer.classList.add("gbprof-compliance-footer--embedded");
    (startScreen || document.body).append(footer);
  }

  function enhanceDynamicContent(root = document) {
    root.querySelectorAll?.("[role='dialog'],dialog").forEach((dialog) => {
      if (!dialog.hasAttribute("aria-modal") && !dialog.matches("dialog")) dialog.setAttribute("aria-modal", "true");
    });
    root.querySelectorAll?.("#quizFeedback,.quiz-feedback,[data-results-status],.feedback,.toast").forEach((region) => {
      if (!region.hasAttribute("role")) region.setAttribute("role", "status");
      if (!region.hasAttribute("aria-live")) region.setAttribute("aria-live", "polite");
    });
  }

  function manageModalFocus() {
    const selector = "[role='dialog'][aria-modal='true'],dialog[open]";
    const visibleDialog = () => [...document.querySelectorAll(selector)]
      .find((dialog) => !dialog.closest("[hidden],.hidden,[aria-hidden='true']"));
    let lastOutsideFocus = document.activeElement;
    let activeDialog = null;

    document.addEventListener("focusin", (event) => {
      if (!visibleDialog()) lastOutsideFocus = event.target;
    });

    document.addEventListener("keydown", (event) => {
      const dialog = visibleDialog();
      if (!dialog || event.key !== "Tab") return;
      const focusable = [...dialog.querySelectorAll("a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])")]
        .filter((element) => !element.hidden && element.getClientRects().length);
      if (!focusable.length) {
        event.preventDefault();
        dialog.tabIndex = -1;
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }, true);

    const sync = () => {
      const dialog = visibleDialog();
      if (dialog && dialog !== activeDialog) {
        activeDialog = dialog;
        const target = dialog.querySelector("[autofocus],button:not([disabled]),a[href],[tabindex]:not([tabindex='-1'])") || dialog;
        if (!dialog.hasAttribute("tabindex") && target === dialog) dialog.tabIndex = -1;
        setTimeout(() => target.focus(), 0);
      } else if (!dialog && activeDialog) {
        activeDialog = null;
        if (lastOutsideFocus?.isConnected) setTimeout(() => lastOutsideFocus.focus(), 0);
      }
    };

    new MutationObserver(sync).observe(document.body, { attributes: true, childList: true, subtree: true, attributeFilter: ["hidden", "class", "open", "aria-modal", "aria-hidden"] });
    sync();
  }

  function updateAriaCurrent() {
    document.querySelectorAll("a[data-gbprof-current]").forEach((link) => {
      link.removeAttribute("aria-current");
      link.removeAttribute("data-gbprof-current");
    });
    document.querySelectorAll("nav a[href]").forEach((link) => {
      try {
        const target = new URL(link.href, location.href);
        const samePage = target.origin === location.origin && target.pathname.replace(/index\.html$/, "") === location.pathname.replace(/index\.html$/, "");
        const sameHash = !target.hash || target.hash === location.hash;
        if (samePage && sameHash && !link.hasAttribute("aria-current")) {
          link.setAttribute("aria-current", "page");
          link.dataset.gbprofCurrent = "";
        }
      } catch (_) {
        // Collegamento non navigabile: nessun intervento.
      }
    });
  }

  function init() {
    ensureMainLandmark();
    hardenExternalLinks();
    prepareExternalVideos();
    enhanceDynamicContent();
    manageModalFocus();
    updateAriaCurrent();
    addComplianceFooter();
    new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) enhanceDynamicContent(node);
    }))).observe(document.body, { childList: true, subtree: true });
    window.addEventListener("hashchange", updateAriaCurrent);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
