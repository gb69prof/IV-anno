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
  imageDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));

  // Notebook: local only.
  const notebookDialog = $("#notebookDialog");
  const notebookText = $("#notebookText");
  const saveStatus = $("#saveStatus");
  const notebookKey = "romanticismo-notebook-v1";
  let notebookTimer;
  notebookText.value = safeStorageGet(notebookKey);
  function openNotebook() {
    notebookDialog.showModal();
    document.body.classList.add("dialog-open");
    window.setTimeout(() => notebookText.focus(), 0);
  }
  function saveNotebook(message = "Appunti salvati in questo browser.") {
    const saved = safeStorageSet(notebookKey, notebookText.value);
    saveStatus.textContent = saved ? message : "Non è stato possibile salvare nel browser.";
  }
  [$("#notebookOpen"), $("#notebookFooter")].forEach(button => button.addEventListener("click", openNotebook));
  $("#notebookClose").addEventListener("click", () => notebookDialog.close());
  notebookDialog.addEventListener("click", event => {
    if (event.target === notebookDialog) notebookDialog.close();
  });
  notebookDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
  notebookText.addEventListener("input", () => {
    saveStatus.textContent = "Modifiche non ancora salvate…";
    window.clearTimeout(notebookTimer);
    notebookTimer = window.setTimeout(() => saveNotebook("Salvataggio automatico completato."), 700);
  });
  $("#notebookSave").addEventListener("click", () => {
    saveNotebook();
    showToast("Taccuino salvato");
  });
  $("#notebookCopy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(notebookText.value);
      showToast("Appunti copiati");
    } catch {
      notebookText.select();
      const copied = document.execCommand("copy");
      showToast(copied ? "Appunti copiati" : "Copia non disponibile");
    }
  });
  $("#notebookExport").addEventListener("click", () => {
    const blob = new Blob([notebookText.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "taccuino-romanticismo.txt";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 500);
    showToast("Taccuino esportato");
  });
  $("#notebookClear").addEventListener("click", () => {
    if (!window.confirm("Cancellare definitivamente gli appunti salvati in questo browser?")) return;
    notebookText.value = "";
    saveNotebook("Taccuino cancellato.");
    showToast("Appunti cancellati");
  });

  // Reasoned quiz.
  const quiz = [
    {
      question: "Perché è insufficiente definire il Romanticismo come “sentimento contro ragione”?",
      options: [
        "Perché i romantici ignorano il sentimento.",
        "Perché il movimento critica la ragione astratta e autosufficiente, non ogni uso della ragione.",
        "Perché il Romanticismo riguarda soltanto la politica.",
        "Perché il Classicismo era già irrazionale."
      ],
      correct: 1,
      explanation: "Il Romanticismo amplia l’immagine dell’uomo: ragione, storia, memoria, immaginazione e desiderio devono essere compresi insieme."
    },
    {
      question: "Quale rapporto c’è tra Illuminismo e Romanticismo?",
      options: [
        "Cancellazione totale.",
        "Identità perfetta.",
        "Eredità critica e trasformazione dei suoi limiti.",
        "Semplice successione cronologica senza rapporti."
      ],
      correct: 2,
      explanation: "Restano libertà critica, dignità individuale, apertura europea e volontà riformatrice; cambia la pretesa di spiegare tutto con una ragione astratta."
    },
    {
      question: "Quale catena causale descrive meglio il metodo del percorso?",
      options: [
        "Autori → date → definizioni → quiz.",
        "Sentimento → natura → poesia → nazione.",
        "Mondo precedente → fratture → nuova immagine → nuove forme letterarie.",
        "Germania → Francia → Inghilterra → Italia."
      ],
      correct: 2,
      explanation: "La letteratura non cambia per moda: nuove forme emergono da una trasformazione storica e antropologica."
    },
    {
      question: "Che cosa rende “storica” la nuova concezione romantica delle forme?",
      options: [
        "Ogni epoca e popolo può produrre forme adeguate alla propria esperienza.",
        "Tutti devono imitare il Medioevo.",
        "Le regole antiche sono sempre sbagliate.",
        "La storia serve solo come ambientazione."
      ],
      correct: 0,
      explanation: "Il Romanticismo contesta l’idea di un unico modello valido universalmente e meccanicamente."
    },
    {
      question: "Perché il popolo romantico va considerato criticamente?",
      options: [
        "Perché non sa leggere.",
        "Perché coincide sempre con il proletariato industriale.",
        "Perché è spesso una costruzione degli intellettuali e non la fotografia delle classi popolari reali.",
        "Perché non ha rapporto con lingua e tradizioni."
      ],
      correct: 2,
      explanation: "Il popolo è insieme comunità culturale, destinatario e progetto: proprio per questo va distinto dalla complessità sociale reale."
    },
    {
      question: "Quale confronto tra aree europee è corretto?",
      options: [
        "Germania: assoluto; Inghilterra: natura e memoria; Francia: libertà delle forme; Italia: pubblico e nazione.",
        "Germania: romanzo storico; Inghilterra: censura austriaca; Francia: Jena; Italia: Lyrical Ballads.",
        "Tutte le aree sviluppano lo stesso programma.",
        "Solo l’Italia collega letteratura e storia."
      ],
      correct: 0,
      explanation: "Una crisi comune produce domande diverse: il Romanticismo è una costellazione europea policentrica."
    },
    {
      question: "Perché il 1816 è uno snodo del Romanticismo italiano?",
      options: [
        "Per la pubblicazione dei Promessi sposi.",
        "Per l’articolo di Madame de Staël e la polemica classico-romantica.",
        "Per la chiusura del Conciliatore.",
        "Per il Congresso di Vienna."
      ],
      correct: 1,
      explanation: "La proposta di aprirsi alle letterature moderne europee porta in primo piano traduzione, pubblico e contemporaneità."
    },
    {
      question: "Romanticismo italiano e Risorgimento…",
      options: [
        "sono esattamente la stessa cosa.",
        "non hanno alcun rapporto.",
        "si intrecciano, ma restano un movimento culturale e un processo politico distinti.",
        "coincidono soltanto dopo il 1861."
      ],
      correct: 2,
      explanation: "La letteratura contribuisce alla costruzione simbolica della nazione, ma il Romanticismo non si riduce al progetto politico risorgimentale."
    },
    {
      question: "Che cosa collega Manzoni al Romanticismo senza esaurirne la poetica?",
      options: [
        "Storia, vero, nuovo pubblico e responsabilità civile.",
        "Titanismo e rifiuto della religione.",
        "Culto esclusivo dell’io.",
        "Negazione del romanzo."
      ],
      correct: 0,
      explanation: "Manzoni trasforma questi nuclei dentro una visione cristiana del male, della libertà e della Provvidenza."
    },
    {
      question: "Perché Leopardi è “dentro e contro” il Romanticismo?",
      options: [
        "Perché accetta senza riserve il programma di Berchet.",
        "Perché condivide problemi come infinito, natura e immaginazione, ma contesta molte risposte romantiche.",
        "Perché scrive soltanto in forme classiche.",
        "Perché ignora la crisi moderna."
      ],
      correct: 1,
      explanation: "Leopardi appartiene alla stessa crisi della modernità, ma ne rovescia gli esiti consolatori e il programma dei romantici italiani."
    }
  ];
  const quizStart = $("#quizStart");
  const quizForm = $("#quizForm");
  const quizResult = $("#quizResult");
  function renderQuiz() {
    quizForm.replaceChildren();
    quizResult.textContent = "";
    quiz.forEach((item, questionIndex) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "quiz-question";
      fieldset.dataset.questionIndex = String(questionIndex);
      const legend = document.createElement("legend");
      legend.textContent = `${questionIndex + 1}. ${item.question}`;
      fieldset.appendChild(legend);
      const options = document.createElement("div");
      options.className = "quiz-options";
      item.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `question-${questionIndex}`;
        input.value = String(optionIndex);
        const text = document.createElement("span");
        text.textContent = option;
        label.append(input, text);
        input.addEventListener("change", () => answerQuestion(fieldset, questionIndex, optionIndex));
        options.appendChild(label);
      });
      fieldset.appendChild(options);
      quizForm.appendChild(fieldset);
    });
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "primary-button";
    reset.textContent = "Ricomincia";
    reset.addEventListener("click", () => {
      renderQuiz();
      quizForm.scrollIntoView({ behavior: scrollBehavior, block: "start" });
    });
    quizForm.appendChild(reset);
  }
  function answerQuestion(fieldset, questionIndex, chosenIndex) {
    if (fieldset.dataset.answered === "true") return;
    fieldset.dataset.answered = "true";
    const item = quiz[questionIndex];
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
  function updateQuizResult() {
    const answered = $$(".quiz-question[data-answered='true']", quizForm);
    const score = answered.reduce((total, fieldset) => {
      const selected = $("input:checked", fieldset);
      const questionIndex = Number(fieldset.dataset.questionIndex);
      return total + (selected && Number(selected.value) === quiz[questionIndex].correct ? 1 : 0);
    }, 0);
    if (answered.length < quiz.length) {
      quizResult.textContent = `Progresso: ${answered.length}/${quiz.length}. Punteggio provvisorio: ${score}/${answered.length || 0}.`;
      return;
    }
    const reading = score >= 9
      ? "Le relazioni sono molto solide."
      : score >= 7
        ? "Il quadro è chiaro; ripassa le spiegazioni delle risposte errate."
        : score >= 5
          ? "Hai alcuni nuclei corretti, ma la catena causale va consolidata."
          : "Riparti dalla mappa finale e dalle quattro fratture.";
    quizResult.textContent = `Verifica completata: ${score}/${quiz.length}. ${reading}`;
    safeStorageSet("romanticismo-quiz-score", String(score));
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
