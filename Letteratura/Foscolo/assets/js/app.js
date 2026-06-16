const LESSON_VIDEO_MAP = {
  introduzione: "https://youtube.com/shorts/9wWYBl2ulKw?si=4UfQRxs0BpCFSDCU",
  fratture: "https://youtube.com/shorts/rXa62kZ0SC8?si=C1jNzp4ae5ZZ2GWz",
  "immagine-del-mondo": "https://youtube.com/shorts/SADpAw3RFWI?si=TFQTE6vHqU6vi8V0",
  poetica: "https://youtube.com/shorts/MnU-ieZaJrY?si=8U5lxtJxBaxqZGtB",
  opere: "",
  "ortis-parini": "",
  "alla-sera": ""
};

const LESSON_STUDY_DATA = {
  introduzione: {
    vocabulary: [
      ["Antico Regime", "Sistema politico e sociale fondato su monarchia, privilegi di ceto e ordine tradizionale."],
      ["Campoformio", "Trattato del 1797 con cui Venezia viene ceduta all'Austria: per Foscolo è una ferita politica decisiva."],
      ["Meccanicismo", "Visione filosofica secondo cui l'universo è materia in movimento regolata da cause fisiche."]
    ],
    quiz: [
      {
        question: "Perché la politica non è solo uno sfondo nella vita di Foscolo?",
        options: ["Perché diventa una ferita personale e letteraria.", "Perché Foscolo scrive solo opere storiche.", "Perché rifiuta ogni tema privato."],
        answer: 0,
        recovery: "La lezione mostra che Rivoluzione, Napoleone e Campoformio entrano nella sua identità: gli ideali promessi dalla storia vengono traditi e diventano materia poetica."
      },
      {
        question: "Che cosa produce in Foscolo il trattato di Campoformio?",
        options: ["Una pacificazione definitiva.", "La delusione per la patria ceduta all'Austria.", "La certezza religiosa dell'aldilà."],
        answer: 1,
        recovery: "Campoformio è il punto in cui Napoleone smette di apparire solo come liberatore: Venezia viene ceduta e la promessa politica si trasforma in trauma."
      },
      {
        question: "Quale problema apre il meccanicismo?",
        options: ["Se tutto è materia, dopo la morte sembra esserci il nulla.", "La natura è guidata da una Provvidenza sicura.", "La poesia diventa inutile per Foscolo."],
        answer: 0,
        recovery: "Il meccanicismo libera dalla superstizione, ma rende angosciante il destino umano: se l'anima immortale non esiste, bisogna costruire senso in altro modo."
      }
    ]
  },
  fratture: {
    vocabulary: [
      ["Zacinto", "Nome poetico di Zante: rappresenta origine, infanzia, mito greco e patria perduta."],
      ["Esilio", "Condizione geografica ed esistenziale: Foscolo non coincide più con una patria stabile."],
      ["Tomba", "Luogo simbolico che unisce i vivi nel ricordo, anche se non salva il morto."]
    ],
    quiz: [
      {
        question: "Che cosa diventa Zante nella poesia di Foscolo?",
        options: ["Un semplice dato geografico.", "Il mito dell'origine perduta.", "Un luogo privo di valore affettivo."],
        answer: 1,
        recovery: "Zante/Zacinto è molto più di un'isola: diventa infanzia, madre terra, Grecia mitica e ritorno impossibile."
      },
      {
        question: "Perché il giudizio su Napoleone è doppio?",
        options: ["Perché Foscolo lo vede solo come eroe.", "Perché unisce speranza rivoluzionaria e tradimento degli ideali.", "Perché non si interessa alla politica."],
        answer: 1,
        recovery: "Foscolo ammira l'energia storica di Napoleone, ma condanna il tradimento della libertà dopo Campoformio."
      },
      {
        question: "Che valore assume l'esilio?",
        options: ["Solo un viaggio temporaneo.", "Una condizione dell'uomo moderno e della sua identità spezzata.", "Una pausa felice dalla letteratura."],
        answer: 1,
        recovery: "L'esilio non è soltanto spostamento: indica una frattura tra individuo, patria, famiglia e senso dell'esistenza."
      }
    ]
  },
  "immagine-del-mondo": {
    vocabulary: [
      ["Nulla eterno", "Idea secondo cui la morte coincide con la fine dell'individuo e non apre a una vita ultraterrena."],
      ["Illusioni", "Valori consapevoli e necessari, come amore, patria, memoria, bellezza e poesia."],
      ["Religione laica", "Sistema di valori che consola e unisce senza fondarsi su Dio, ma su arte, affetti e memoria."]
    ],
    quiz: [
      {
        question: "In Foscolo, le illusioni sono semplici bugie?",
        options: ["No, sono valori umani necessari per vivere con dignità.", "Sì, sono sempre inganni da eliminare.", "No, perché coincidono con prove scientifiche."],
        answer: 0,
        recovery: "Le illusioni non negano il nulla, ma permettono all'uomo di attraversarlo: patria, amore, memoria e poesia sono verità umane."
      },
      {
        question: "Perché si parla di religione delle illusioni?",
        options: ["Perché Foscolo torna alla fede tradizionale.", "Perché le illusioni svolgono una funzione consolatrice e comunitaria.", "Perché la poesia viene rifiutata."],
        answer: 1,
        recovery: "Le illusioni sostituiscono alcune funzioni della religione: danno senso, custodiscono memoria, uniscono gli uomini e consolano."
      },
      {
        question: "A che cosa serve il sepolcro nella visione foscoliana?",
        options: ["Serve al morto, che continua a sentire.", "Serve ai vivi, perché custodisce affetti e memoria.", "Non ha mai alcun valore."],
        answer: 1,
        recovery: "Se il morto non sente più nulla, la tomba non salva lui: salva invece il rapporto dei vivi con il ricordo e con i valori."
      }
    ]
  },
  poetica: {
    vocabulary: [
      ["Neoclassicismo", "Ricerca di misura, armonia, mito antico e bellezza ideale."],
      ["Preromanticismo", "Centralità di malinconia, notte, morte, esilio e io ferito."],
      ["Forma", "Per Foscolo non è decorazione: è disciplina che contiene il dolore."]
    ],
    quiz: [
      {
        question: "Come convivono Neoclassicismo e Preromanticismo in Foscolo?",
        options: ["Forma classica e contenuto inquieto convivono nella stessa opera.", "Sono due fasi senza rapporto.", "Foscolo elimina sempre il sentimento."],
        answer: 0,
        recovery: "Foscolo usa misura e mito classico per dare ordine a un dolore moderno fatto di esilio, morte e inquietudine."
      },
      {
        question: "Che cosa rappresenta la forma classica?",
        options: ["Una decorazione esterna.", "Una resistenza contro caos e frattura.", "Un rifiuto della poesia."],
        answer: 1,
        recovery: "La forma non abbellisce soltanto: trattiene l'abisso e permette al dolore di diventare poesia comunicabile."
      },
      {
        question: "Quale tratto è tipicamente preromantico?",
        options: ["La serenità assoluta dell'io.", "L'esilio e la tensione interiore.", "La scomparsa della soggettività."],
        answer: 1,
        recovery: "Il Preromanticismo porta in primo piano l'io ferito, la malinconia, la notte, la morte e il bisogno di assoluto."
      }
    ]
  },
  opere: {
    vocabulary: [
      ["Romanzo epistolare", "Forma narrativa costruita attraverso lettere, come nelle Ultime lettere di Jacopo Ortis."],
      ["Carme", "Componimento poetico solenne, spesso civile o filosofico, come Dei Sepolcri."],
      ["Gloria", "Sopravvivenza simbolica nella memoria dei posteri e negli esempi morali."]
    ],
    quiz: [
      {
        question: "Quale nucleo domina l'Ortis?",
        options: ["Patria e amore come illusioni infrante.", "Una fede religiosa serena.", "La vita mondana come gioco leggero."],
        answer: 0,
        recovery: "Jacopo è spezzato dalla patria tradita e dall'amore impossibile: quando entrambe le illusioni cadono, resta il gesto tragico."
      },
      {
        question: "Qual è la risposta centrale dei Sepolcri?",
        options: ["Le tombe servono ai vivi, custodendo memoria e valori.", "Le tombe non hanno nessun significato.", "Le tombe salvano fisicamente i morti."],
        answer: 0,
        recovery: "Nei Sepolcri la tomba diventa strumento civile e affettivo: educa, ricorda, unisce e accende a grandi azioni."
      },
      {
        question: "Che cosa rappresentano Le Grazie?",
        options: ["La bellezza e l'arte come civilizzazione.", "Il rifiuto del mito.", "La sconfitta definitiva della poesia."],
        answer: 0,
        recovery: "Le Grazie mostrano la bellezza come forza che ingentilisce l'uomo e offre una salvezza laica attraverso l'arte."
      }
    ]
  },
  "ortis-parini": {
    vocabulary: [
      ["Jacopo Ortis", "Giovane lacerato da passione politica, amore impossibile e desiderio di assoluto."],
      ["Parini", "Figura di lucidità morale: denuncia la corruzione ma teme la violenza del potere."],
      ["Eroismo politico", "Slancio verso gloria e libertà che può però trasformarsi in fanatismo o tirannide."]
    ],
    quiz: [
      {
        question: "Perché l'incontro con Parini è decisivo?",
        options: ["Mette in scena il conflitto tra passione e lucidità morale.", "Serve solo a introdurre un personaggio secondario.", "Cancella il tema politico."],
        answer: 0,
        recovery: "Jacopo vuole agire e sacrificarsi; Parini gli mostra i rischi storici e morali della violenza politica."
      },
      {
        question: "Che cosa significa 'Non si dee aspettare libertà dallo straniero'?",
        options: ["La libertà non può essere concessa da chi domina.", "La libertà è sempre inutile.", "Lo straniero è sempre moralmente superiore."],
        answer: 0,
        recovery: "Parini ricorda che una libertà imposta o concessa da un conquistatore nasconde dipendenza e dominio."
      },
      {
        question: "Quale rischio Parini vede nell'ideale armato dal potere?",
        options: ["Che il filosofo diventi tiranno.", "Che Jacopo perda interesse per Teresa.", "Che la poesia diventi comica."],
        answer: 0,
        recovery: "Parini teme che anche chi parte da ideali nobili possa essere corrotto dalla forza, dalla gloria e dal comando."
      }
    ]
  },
  "alla-sera": {
    vocabulary: [
      ["Fatal quiete", "La morte vista come pace inevitabile, non come terrore disordinato."],
      ["Nulla eterno", "La destinazione ultima dei pensieri: la fine dell'individuo in una visione materialistica."],
      ["Spirto guerrier", "La parte inquieta, combattiva e tormentata del poeta."]
    ],
    quiz: [
      {
        question: "Perché la sera è cara al poeta?",
        options: ["Perché è immagine della morte come pace.", "Perché cancella ogni pensiero.", "Perché rappresenta solo un paesaggio realistico."],
        answer: 0,
        recovery: "La sera somiglia alla 'fatal quiete': rende la morte pensabile come riposo e calma temporaneamente il conflitto interiore."
      },
      {
        question: "Che cosa indica il 'nulla eterno'?",
        options: ["La fine dell'individuo dopo la morte.", "La certezza del Paradiso.", "Un semplice tramonto estivo."],
        answer: 0,
        recovery: "Il nulla eterno esprime la visione materialistica: non c'è una garanzia religiosa di sopravvivenza personale."
      },
      {
        question: "Come agisce la poesia nel sonetto?",
        options: ["Trasforma il nulla in una figura di pace.", "Elimina la morte dalla realtà.", "Rende inutile la forma classica."],
        answer: 0,
        recovery: "La poesia non cancella il destino umano, ma lo rende abitabile: la sera diventa un'illusione consolatrice."
      }
    ]
  }
};

function getRoot() {
  return document.body.dataset.root || "./";
}

function youtubeEmbedUrl(url) {
  if (!url) return "";
  const match = url.match(/(?:shorts\/|watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : url;
}

function setupServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${getRoot()}service-worker.js`).catch(() => {});
  });
}

function setupActiveNavigation() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".top-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href.endsWith(current)) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function setupMapModal() {
  const modal = document.querySelector("[data-map-modal]");
  if (!modal) return;

  const image = modal.querySelector("img");
  const title = modal.querySelector("[data-map-title]");
  const closeButtons = modal.querySelectorAll("[data-close-modal]");

  document.querySelectorAll("[data-open-map]").forEach((button) => {
    button.addEventListener("click", () => {
      image.src = button.dataset.mapSrc;
      image.alt = button.dataset.mapTitle || "Mappa concettuale";
      title.textContent = button.dataset.mapTitle || "Mappa";
      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => modal.close ? modal.close() : modal.removeAttribute("open"));
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close ? modal.close() : modal.removeAttribute("open");
    }
  });
}

function setupLessonVideoSwap() {
  const media = document.querySelector("[data-foscolo-media]");
  if (!media) return;

  const lessonId = document.body.dataset.lesson;
  const videoUrl = youtubeEmbedUrl(LESSON_VIDEO_MAP[lessonId]);
  const imagePanel = media.querySelector("[data-image-panel]");
  const videoPanel = media.querySelector("[data-video-panel]");
  const frame = media.querySelector("iframe");
  const playButton = media.querySelector("[data-play-video]");
  const image = media.querySelector("[data-play-image]");
  const backButton = media.querySelector("[data-back-image]");

  if (!videoUrl) {
    media.classList.add("is-video-missing");
    if (playButton) playButton.hidden = true;
    const caption = media.querySelector(".media-caption");
    if (caption) caption.textContent = "Ritratto principale di Ugo Foscolo.";
    image.removeAttribute("tabindex");
    return;
  }

  const showVideo = () => {
    frame.src = `${videoUrl}?rel=0`;
    imagePanel.hidden = true;
    videoPanel.hidden = false;
    backButton.focus();
  };

  const showImage = () => {
    frame.src = "";
    videoPanel.hidden = true;
    imagePanel.hidden = false;
    image.focus();
  };

  image.addEventListener("click", showVideo);
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showVideo();
    }
  });
  playButton.addEventListener("click", showVideo);
  backButton.addEventListener("click", showImage);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cleanNoteText(text) {
  return text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/^\d{2}\s*-\s*/, "")
        .replace(/^\d+\.\s+/, "")
        .replace(/^Lezione\s+\d+\s*/i, "")
    )
    .filter(Boolean)
    .join("\n\n");
}

function setupLessonStudyTools() {
  const lessonId = document.body.dataset.lesson;
  const data = LESSON_STUDY_DATA[lessonId];
  const article = document.querySelector(".lesson-article");
  if (!data || !article) return;

  const vocabulary = data.vocabulary
    .map(
      ([term, definition]) => `
        <article class="vocab-card">
          <strong>${escapeHtml(term)}</strong>
          <p>${escapeHtml(definition)}</p>
        </article>`
    )
    .join("");

  const questions = data.quiz
    .map(
      (item, index) => `
        <fieldset class="quiz-question" data-question-index="${index}">
          <legend>${escapeHtml(item.question)}</legend>
          ${item.options
            .map(
              (option, optionIndex) => `
                <label>
                  <input type="radio" name="quiz-${lessonId}-${index}" value="${optionIndex}">
                  <span>${escapeHtml(option)}</span>
                </label>`
            )
            .join("")}
        </fieldset>`
    )
    .join("");

  article.insertAdjacentHTML(
    "beforeend",
    `
      <section class="study-panel" id="vocabolario-essenziale">
        <div class="study-heading">
          <p>Ripasso</p>
          <h2>Vocabolario essenziale</h2>
        </div>
        <div class="vocab-grid">${vocabulary}</div>
      </section>

      <section class="study-panel" id="test-lezione">
        <div class="study-heading">
          <p>Autoverifica</p>
          <h2>Piccolo test di comprensione</h2>
        </div>
        <form class="lesson-quiz" data-lesson-quiz>
          ${questions}
          <button class="button-link" type="submit">Correggi il test</button>
        </form>
        <div class="quiz-report" data-quiz-report hidden></div>
      </section>
    `
  );

  const form = article.querySelector("[data-lesson-quiz]");
  const report = article.querySelector("[data-quiz-report]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let correct = 0;
    const rows = data.quiz.map((item, index) => {
      const chosen = form.querySelector(`input[name="quiz-${lessonId}-${index}"]:checked`);
      const chosenIndex = chosen ? Number(chosen.value) : -1;
      const isCorrect = chosenIndex === item.answer;
      if (isCorrect) correct += 1;
      const selectedText = chosenIndex >= 0 ? item.options[chosenIndex] : "Nessuna risposta";
      return `
        <article class="report-row ${isCorrect ? "is-correct" : "is-wrong"}">
          <strong>${isCorrect ? "Risposta corretta" : "Da recuperare"}</strong>
          <p><b>Domanda:</b> ${escapeHtml(item.question)}</p>
          <p><b>Risposta data:</b> ${escapeHtml(selectedText)}</p>
          ${
            isCorrect
              ? "<p>Hai riconosciuto il nodo centrale della lezione.</p>"
              : `<p><b>Mini lezione di recupero:</b> ${escapeHtml(item.recovery)}</p>`
          }
        </article>`;
    });

    report.hidden = false;
    report.innerHTML = `
      <h3>Report finale</h3>
      <p class="score-line">Punteggio: ${correct} / ${data.quiz.length}</p>
      ${rows.join("")}
    `;
    report.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function setupNotesTool() {
  const lessonId = document.body.dataset.lesson;
  const sidebar = document.querySelector(".lesson-sidebar");
  if (!lessonId || !sidebar) return;

  const key = `foscolo-notes-${lessonId}`;
  const saved = localStorage.getItem(key) || "";
  sidebar.insertAdjacentHTML(
    "beforeend",
    `
      <section class="notes-tool" aria-label="Appunti della lezione">
        <h2>Appunti</h2>
        <p>Seleziona il testo nella lezione, evidenzialo, poi inserisci le parti evidenziate negli appunti.</p>
        <div class="notes-actions">
          <button class="media-button" type="button" data-highlight-selection>Evidenzia</button>
          <button class="media-button" type="button" data-clear-highlights>Cancella evidenziatore</button>
          <button class="media-button" type="button" data-copy-highlights>Inserisci negli appunti</button>
          <button class="media-button" type="button" data-save-notes>Salva TXT</button>
        </div>
        <textarea data-notes-area spellcheck="true" aria-label="Appunti salvati">${escapeHtml(saved)}</textarea>
        <button class="notes-clear" type="button" data-clear-notes>Svuota appunti</button>
        <p class="notes-status" data-notes-status aria-live="polite"></p>
      </section>
    `
  );

  const area = sidebar.querySelector("[data-notes-area]");
  const status = sidebar.querySelector("[data-notes-status]");
  const article = document.querySelector(".lesson-article");
  const setStatus = (text) => {
    status.textContent = text;
  };

  area.addEventListener("input", () => {
    localStorage.setItem(key, area.value);
  });

  const selectedRangeInLesson = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return null;
    }
    const range = selection.getRangeAt(0);
    const ancestor =
      range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentElement
        : range.commonAncestorContainer;
    return article && article.contains(ancestor) ? range : null;
  };

  sidebar.querySelector("[data-highlight-selection]").addEventListener("click", () => {
    const range = selectedRangeInLesson();
    if (!range || !cleanNoteText(range.toString())) {
      setStatus("Seleziona prima una frase o un paragrafo della lezione.");
      return;
    }

    const highlight = document.createElement("mark");
    highlight.className = "student-highlight";
    highlight.dataset.noteHighlight = "true";
    highlight.append(range.extractContents());
    range.insertNode(highlight);
    window.getSelection().removeAllRanges();
    setStatus("Testo evidenziato. Puoi continuare a evidenziare o inserirlo negli appunti.");
  });

  sidebar.querySelector("[data-clear-highlights]").addEventListener("click", () => {
    const highlights = article ? [...article.querySelectorAll("[data-note-highlight]")] : [];
    if (!highlights.length) {
      setStatus("Non ci sono evidenziature da cancellare.");
      return;
    }
    highlights.forEach((highlight) => {
      highlight.replaceWith(...highlight.childNodes);
    });
    setStatus("Evidenziatore cancellato dalla lezione.");
  });

  sidebar.querySelector("[data-copy-highlights]").addEventListener("click", () => {
    const highlightedText = article
      ? [...article.querySelectorAll("[data-note-highlight]")]
          .map((highlight) => cleanNoteText(highlight.textContent || ""))
          .filter(Boolean)
          .join("\n\n")
      : "";

    if (!highlightedText) {
      setStatus("Evidenzia prima almeno una parte della lezione.");
      return;
    }

    area.value = cleanNoteText([area.value, highlightedText].filter(Boolean).join("\n\n"));
    localStorage.setItem(key, area.value);
    setStatus("Evidenziature inserite negli appunti.");
  });

  sidebar.querySelector("[data-save-notes]").addEventListener("click", () => {
    const clean = cleanNoteText(area.value);
    if (!clean) {
      setStatus("Non ci sono appunti da salvare.");
      return;
    }
    area.value = clean;
    localStorage.setItem(key, clean);
    const blob = new Blob([clean], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `appunti-foscolo-${lessonId}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("Appunti salvati in formato TXT.");
  });

  sidebar.querySelector("[data-clear-notes]").addEventListener("click", () => {
    area.value = "";
    localStorage.removeItem(key);
    setStatus("Appunti svuotati.");
  });
}

setupServiceWorker();
setupActiveNavigation();
setupMapModal();
setupLessonVideoSwap();
setupLessonStudyTools();
setupNotesTool();
