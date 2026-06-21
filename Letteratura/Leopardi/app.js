const DATA = window.LEOPARDI_DATA;
const app = document.querySelector("#app");
const selectionTools = document.querySelector("#selectionTools");
let pendingSelection = null;
let installPrompt = null;
let selectionListenerActive = false;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const keys = {
  highlights: "leopardi.highlights",
  notes: "leopardi.notes",
  results: "leopardi.results",
};

const sectionAccent = {
  lezioni: "var(--red)",
  "percorso-testi": "var(--teal)",
  approfondimenti: "var(--gold)",
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function itemById(id) {
  return DATA.items.find((item) => item.id === id);
}

function sectionById(id) {
  return DATA.sections.find((section) => section.id === id);
}

function textPreview(text, length = 150) {
  return text.replace(/\s+/g, " ").trim().slice(0, length);
}

function routeParts() {
  return (location.hash || "#/")
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean)
    .map(decodeURIComponent);
}

function setActiveNav() {
  const parts = routeParts();
  document.querySelectorAll(".topnav a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href").includes(parts[1] || parts[0] || "home"));
  });
}

function render() {
  setActiveNav();
  hideSelectionTools();
  const [view, id, tab = "testo"] = routeParts();
  document.body.classList.toggle("home-route", !view);

  if (!view) {
    renderHome();
  } else if (view === "section") {
    renderSection(id);
  } else if (view === "item") {
    renderItem(id, tab);
  } else if (view === "notes") {
    renderNotes();
  } else if (view === "final-quiz") {
    renderFinalQuiz();
  } else {
    renderEmpty();
  }

  app.focus({ preventScroll: true });
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
}

function renderHome() {
  app.innerHTML = `
    <section class="cover-home" aria-label="Copertina interattiva del percorso Leopardi">
      <div class="cover-stage">
        <img class="cover-image" src="${escapeHtml(DATA.homeImage)}" alt="Giacomo Leopardi: copertina del percorso interattivo">
        ${renderCoverHotspots()}
      </div>
    </section>
  `;
}

function renderCoverHotspots() {
  const hotspots = [
    ["Home", "#/", 32.5, 1.2, 7.0, 5.8],
    ["Lezioni", "#/section/lezioni", 40.7, 1.2, 8.8, 5.8],
    ["Approfondimenti", "#/section/approfondimenti", 52.8, 1.2, 11.4, 5.8],
    ["Mappe", "#/item/filosofia-base/mappa", 65.0, 1.2, 7.0, 5.8],
    ["Biografia", "#/item/fratture/testo", 71.8, 1.2, 8.2, 5.8],
    ["Inizia il percorso", "#/item/filosofia-base/testo", 81.1, 1.2, 16.4, 5.8],
    ["Filosofia base", "#/item/filosofia-base/testo", 3.3, 36.3, 14.8, 22.8],
    ["Le fratture", "#/item/fratture/testo", 19.1, 36.3, 14.6, 22.8],
    ["Immagine del mondo", "#/item/immagine-mondo/testo", 34.2, 36.3, 15.0, 22.8],
    ["Poetica", "#/item/poetica/testo", 50.0, 36.3, 14.8, 22.8],
    ["Scritti e opere", "#/item/scritti/testo", 65.4, 36.3, 14.6, 22.8],
    ["Conclusione", "#/final-quiz", 81.0, 36.3, 14.2, 22.8],
    ["Recanati", "#/item/fratture/testo", 8.8, 61.0, 12.0, 12.8],
    ["L'Infinito", "#/item/infinito/testo", 22.5, 61.0, 12.0, 12.8],
    ["Natura e Islandese", "#/item/natura-islandese/testo", 36.3, 61.0, 13.8, 12.8],
    ["Saffo e Bruto", "#/item/bruto-saffo/testo", 50.8, 61.0, 12.8, 12.8],
    ["La Ginestra", "#/item/ginestra/testo", 65.0, 61.0, 13.2, 12.8],
    ["Illusioni", "#/item/scritti/testo", 78.5, 61.0, 12.2, 12.8],
    ["Mappe e schemi", "#/item/filosofia-base/mappa", 3.2, 74.5, 28.8, 14.6],
    ["Timeline interattiva", "#/item/fratture/testo", 32.5, 74.5, 32.2, 14.6],
    ["Quiz finale", "#/final-quiz", 65.3, 74.5, 31.0, 14.6],
  ];

  return hotspots
    .map(
      ([label, href, x, y, w, h]) => `
        <a class="cover-hotspot" href="${href}" style="--x:${x}%;--y:${y}%;--w:${w}%;--h:${h}%;">
          <span>${escapeHtml(label)}</span>
        </a>
      `
    )
    .join("");
}

function renderSection(sectionId) {
  const section = sectionById(sectionId);
  if (!section) return renderEmpty();

  const cards = DATA.items
    .filter((item) => item.section === sectionId)
    .map((item) => itemCard(item))
    .join("");

  app.innerHTML = `
    <section class="band">
      <div class="section-head">
        <p class="eyebrow" style="color:${sectionAccent[sectionId]}">Sezione</p>
        <h2>${escapeHtml(section.label)}</h2>
        <p>${escapeHtml(section.description)}</p>
      </div>
      <div class="grid">${cards}</div>
    </section>
  `;
}

function itemCard(item) {
  return `
    <article class="card">
      <img src="${escapeHtml(item.map)}" alt="Mappa: ${escapeHtml(item.title)}" loading="lazy">
      <div class="card-body">
        <div class="chip-row">
          <span class="chip" style="background:${sectionAccent[item.section]}">${escapeHtml(item.kicker)}</span>
          <span class="chip video">${item.videos.length} video</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(textPreview(item.content))}...</p>
        <div class="action-row">
          <a class="button primary" href="#/item/${item.id}/testo">Leggi</a>
          <a class="button" href="#/item/${item.id}/test">Test</a>
        </div>
      </div>
    </article>
  `;
}

function renderItem(itemId, tab) {
  const item = itemById(itemId);
  if (!item) return renderEmpty();

  const tabs = [
    ["testo", "Testo"],
    ["mappa", "Mappa"],
    ["video", "Video"],
    ["test", "Test"],
  ]
    .map(([key, label]) => `<a class="tab-button ${tab === key ? "active" : ""}" href="#/item/${item.id}/${key}">${label}</a>`)
    .join("");

  app.innerHTML = `
    <section class="reader-shell">
      <img class="reader-map" src="${escapeHtml(item.map)}" alt="Mappa: ${escapeHtml(item.title)}">
      <div class="band">
        <div class="reader-head">
          <p class="eyebrow" style="color:${sectionAccent[item.section]}">${escapeHtml(item.kicker)}</p>
          <h1>${escapeHtml(item.title)}</h1>
          <p>${escapeHtml(item.source)}</p>
        </div>
        <nav class="tabs" aria-label="Materiali della parte">${tabs}</nav>
        <div class="reader-panel">${renderItemPanel(item, tab)}</div>
      </div>
    </section>
  `;

  if (tab === "testo") {
    attachArticleSelection();
  }
  if (tab === "test") {
    attachQuiz(item.quiz, `item:${item.id}`, item.title, item.id);
  }
}

function renderItemPanel(item, tab) {
  if (tab === "mappa") {
    return `<img class="map-full" src="${escapeHtml(item.map)}" alt="Mappa: ${escapeHtml(item.title)}">`;
  }

  if (tab === "video") {
    return renderVideos(item);
  }

  if (tab === "test") {
    return renderQuiz(item.quiz, `item:${item.id}`, item.title, item.id);
  }

  return `
    <div class="article-layout">
      <div class="reader-main">
        ${renderEmbeddedMaterials(item)}
        ${renderArticle(item)}
      </div>
      ${renderArticleNotes(item)}
    </div>
  `;
}

function renderEmbeddedMaterials(item) {
  return `
    <section class="embedded-materials" aria-label="Mappa e video collegati">
      <figure class="embedded-map">
        <img src="${escapeHtml(item.map)}" alt="Mappa: ${escapeHtml(item.title)}">
        <figcaption>Mappa della parte</figcaption>
      </figure>
      <div class="embedded-videos">
        ${item.videos.map((video) => renderInlineVideo(video)).join("")}
      </div>
    </section>
  `;
}

function renderInlineVideo(video) {
  return `
    <article class="inline-video">
      <h3>${escapeHtml(video.title)}</h3>
      ${video.local ? `<video controls preload="metadata" src="${escapeHtml(video.local)}"></video>` : ""}
      ${video.online ? `<a href="${escapeHtml(video.online)}" target="_blank" rel="noopener">Apri online</a>` : ""}
    </article>
  `;
}

function renderArticle(item) {
  const paragraphs = splitParagraphs(item.content);
  const highlights = storage
    .get(keys.highlights, [])
    .filter((highlight) => highlight.itemId === item.id)
    .sort((a, b) => a.start - b.start);

  const content = paragraphs
    .map((paragraph) => {
      const text = paragraph.text;
      const localHighlights = highlights
        .map((highlight) => ({
          ...highlight,
          localStart: Math.max(0, highlight.start - paragraph.start),
          localEnd: Math.min(text.length, highlight.end - paragraph.start),
        }))
        .filter((highlight) => highlight.localEnd > 0 && highlight.localStart < text.length)
        .sort((a, b) => a.localStart - b.localStart);

      let cursor = 0;
      let html = "";
      localHighlights.forEach((highlight) => {
        if (highlight.localStart < cursor) return;
        html += escapeHtml(text.slice(cursor, highlight.localStart));
        html += `<span class="highlight" data-highlight-id="${highlight.id}">${escapeHtml(text.slice(highlight.localStart, highlight.localEnd))}</span>`;
        cursor = highlight.localEnd;
      });
      html += escapeHtml(text.slice(cursor));
      return `<p data-start="${paragraph.start}">${html}</p>`;
    })
    .join("");

  return `<article class="article" data-item-id="${item.id}">${content}</article>`;
}

function splitParagraphs(content) {
  const parts = content.split(/\n{2,}/);
  let cursor = 0;
  return parts.map((text, index) => {
    const start = cursor;
    cursor += text.length + (index < parts.length - 1 ? 2 : 0);
    return { text, start };
  });
}

function renderArticleNotes(item) {
  const highlights = storage.get(keys.highlights, []).filter((highlight) => highlight.itemId === item.id);
  const notes = storage.get(keys.notes, []).filter((note) => note.itemId === item.id);
  const noteList = notes.length
    ? notes
        .slice(-5)
        .reverse()
        .map(
          (note) => `
            <div class="note-mini">
              <p>${escapeHtml(note.text)}</p>
              <button class="button" type="button" data-copy-note-id="${escapeHtml(note.id)}">Copia</button>
              <a href="#/notes">Apri appunti</a>
            </div>
          `
        )
        .join("")
    : `<p>Seleziona una frase del testo: puoi evidenziarla, copiarla oppure mandarla negli appunti con comandi separati.</p>`;

  return `
    <aside class="side-panel" data-notes-for="${escapeHtml(item.id)}">
      <h3>Appunti da questo testo</h3>
      <p>Sottolineature: ${highlights.length}. Appunti: ${notes.length}.</p>
      ${noteList}
      <a class="button" href="#/notes">Vai agli appunti</a>
    </aside>
  `;
}

function renderVideos(item) {
  const videos = item.videos
    .map((video) => {
      const embed = youtubeEmbed(video.online);
      return `
        <article class="video-item">
          <h3>${escapeHtml(video.title)}</h3>
          ${video.local ? `<video controls preload="metadata" src="${escapeHtml(video.local)}"></video>` : ""}
          ${embed ? `<iframe src="${escapeHtml(embed)}" title="${escapeHtml(video.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` : ""}
          ${video.online ? `<a class="button" href="${escapeHtml(video.online)}" target="_blank" rel="noopener">Apri video online</a>` : ""}
        </article>
      `;
    })
    .join("");

  return `<div class="video-list">${videos}</div>`;
}

function youtubeEmbed(url) {
  if (!url) return "";
  const match = url.match(/(?:shorts\/|embed\/|youtu\.be\/)([A-Za-z0-9_-]+)/);
  if (!match) return "";
  return `https://www.youtube.com/embed/${match[1]}`;
}

function renderQuiz(quiz, quizId, title, itemId = "") {
  const result = storage.get(keys.results, {})[quizId];
  const questions = quiz
    .map((entry, index) => {
      const selected = result?.answers?.[index];
      const options = entry.options
        .map((option, optionIndex) => {
          const isCorrect = result && optionIndex === entry.answer;
          const isWrong = result && selected === optionIndex && optionIndex !== entry.answer;
          return `
            <label class="option ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}">
              <input type="radio" name="q${index}" value="${optionIndex}" ${selected === optionIndex ? "checked" : ""}>
              <span>${escapeHtml(option)}</span>
            </label>
          `;
        })
        .join("");

      return `
        <fieldset class="question">
          <p>${index + 1}. ${escapeHtml(entry.question)}</p>
          ${options}
        </fieldset>
      `;
    })
    .join("");

  return `
    <form class="quiz-card" data-quiz-id="${escapeHtml(quizId)}" data-item-id="${escapeHtml(itemId)}">
      <h3>${escapeHtml(title)}</h3>
      ${questions}
      <div class="quiz-actions">
        <button class="button primary" type="submit">Correggi test</button>
        <button class="button" type="button" data-reset-quiz>Riprova</button>
      </div>
      <div data-report>${result ? renderReport(quiz, result, itemId) : ""}</div>
    </form>
  `;
}

function attachQuiz(quiz, quizId, title, itemId) {
  const form = document.querySelector(`[data-quiz-id="${CSS.escape(quizId)}"]`);
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const answers = quiz.map((_, index) => {
      const raw = data.get(`q${index}`);
      return raw === null ? null : Number(raw);
    });
    const wrong = quiz
      .map((entry, index) => ({ entry, index, selected: answers[index] }))
      .filter(({ entry, selected }) => selected !== entry.answer);
    const score = quiz.length - wrong.length;
    const result = { answers, score, total: quiz.length, wrong: wrong.map(({ index }) => index), date: new Date().toISOString() };
    const allResults = storage.get(keys.results, {});
    allResults[quizId] = result;
    storage.set(keys.results, allResults);
    form.querySelector("[data-report]").innerHTML = renderReport(quiz, result, itemId);
    form.querySelectorAll(".option").forEach((option) => option.classList.remove("correct", "wrong"));
    quiz.forEach((entry, index) => {
      const labels = form.querySelectorAll(`[name="q${index}"]`);
      labels.forEach((input) => {
        const label = input.closest(".option");
        const value = Number(input.value);
        if (value === entry.answer) label.classList.add("correct");
        if (answers[index] === value && value !== entry.answer) label.classList.add("wrong");
      });
    });
  });

  form.querySelector("[data-reset-quiz]").addEventListener("click", () => {
    const allResults = storage.get(keys.results, {});
    delete allResults[quizId];
    storage.set(keys.results, allResults);
    render();
  });
}

function renderReport(quiz, result, itemId) {
  const percent = Math.round((result.score / result.total) * 100);
  const wrongItems = result.wrong
    .map((index) => {
      const entry = quiz[index];
      const link = itemId ? `<a href="#/item/${itemId}/testo">Riapri la lezione</a>` : `<a href="#/section/lezioni">Rivedi il percorso</a>`;
      return `<li><strong>${escapeHtml(entry.question)}</strong><br>${escapeHtml(entry.recovery)}<br>${link}</li>`;
    })
    .join("");

  return `
    <section class="report" aria-live="polite">
      <h3>Report finale</h3>
      <p>Punteggio: <strong>${result.score}/${result.total}</strong> (${percent}%).</p>
      ${
        result.wrong.length
          ? `<h3>Lezioni di recupero</h3><ul class="recovery-list">${wrongItems}</ul>`
          : `<p>Risposte tutte corrette: puoi procedere con la parte successiva.</p>`
      }
    </section>
  `;
}

function renderFinalQuiz() {
  app.innerHTML = `
    <section class="band">
      <div class="section-head">
        <p class="eyebrow" style="color:var(--red)">Verifica conclusiva</p>
        <h2>Test finale sull'intero percorso</h2>
        <p>Raccoglie i passaggi principali: filosofia, poetica, opere, approfondimenti e interpretazione complessiva.</p>
      </div>
      <div class="reader-panel">
        ${renderQuiz(DATA.finalQuiz, "final", "Test finale")}
      </div>
    </section>
  `;
  attachQuiz(DATA.finalQuiz, "final", "Test finale", "");
}

function attachArticleSelection() {
  if (selectionListenerActive) return;
  document.addEventListener("selectionchange", updateSelectionTools);
  document.addEventListener("mouseup", updateSelectionTools);
  document.addEventListener("keyup", updateSelectionTools);
  selectionListenerActive = true;
}

function updateSelectionTools() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) {
    return hideSelectionTools();
  }

  const range = selection.getRangeAt(0);
  const article = closestElement(range.commonAncestorContainer)?.closest(".article");
  if (!article) return hideSelectionTools();

  const start = charOffset(article, range.startContainer, range.startOffset);
  const end = charOffset(article, range.endContainer, range.endOffset);
  const itemId = article.dataset.itemId;
  const item = itemById(itemId);
  if (start === null || end === null || start === end || !item) return hideSelectionTools();

  const from = Math.min(start, end);
  const to = Math.max(start, end);
  const excerpt = item.content.slice(from, to).replace(/\s+/g, " ").trim();
  if (!excerpt) return hideSelectionTools();

  const rect = range.getBoundingClientRect();
  pendingSelection = { itemId, start: from, end: to, excerpt };
  selectionTools.hidden = false;
  const preferredTop = rect.top - (selectionTools.offsetHeight || 48) - 8;
  const fallbackTop = rect.bottom + 8;
  selectionTools.style.left = `${Math.min(window.innerWidth - selectionTools.offsetWidth - 12, Math.max(12, rect.left))}px`;
  selectionTools.style.top = `${Math.min(window.innerHeight - selectionTools.offsetHeight - 12, Math.max(76, preferredTop > 76 ? preferredTop : fallbackTop))}px`;
}

function closestElement(node) {
  return node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
}

function charOffset(article, node, offset) {
  const paragraph = closestElement(node)?.closest("p[data-start]");
  if (!paragraph || !article.contains(paragraph)) return null;
  const range = document.createRange();
  range.selectNodeContents(paragraph);
  try {
    range.setEnd(node, offset);
  } catch {
    return null;
  }
  return Number(paragraph.dataset.start) + range.toString().length;
}

function hideSelectionTools() {
  selectionTools.hidden = true;
  pendingSelection = null;
}

async function saveSelectionAction(action) {
  if (!pendingSelection) return;
  const now = new Date().toISOString();

  if (action === "copy") {
    await writeClipboard(pendingSelection.excerpt);
    hideSelectionTools();
    return;
  }

  if (action === "highlight") {
    const highlights = storage.get(keys.highlights, []);
    highlights.push({ id: crypto.randomUUID(), ...pendingSelection, createdAt: now });
    storage.set(keys.highlights, highlights);
    rerenderTextCompanion(pendingSelection.itemId);
  }

  if (action === "note") {
    const notes = storage.get(keys.notes, []);
    notes.push({
      id: crypto.randomUUID(),
      itemId: pendingSelection.itemId,
      text: pendingSelection.excerpt,
      createdAt: now,
      type: "note",
    });
    storage.set(keys.notes, notes);
    rerenderTextCompanion(pendingSelection.itemId);
  }

  window.getSelection()?.removeAllRanges();
  hideSelectionTools();
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

function rerenderTextCompanion(itemId) {
  const item = itemById(itemId);
  if (!item) return;
  const article = document.querySelector(`.article[data-item-id="${CSS.escape(itemId)}"]`);
  const notesPanel = document.querySelector(`.side-panel[data-notes-for="${CSS.escape(itemId)}"]`);
  if (article) article.outerHTML = renderArticle(item);
  if (notesPanel) notesPanel.outerHTML = renderArticleNotes(item);
}

function renderNotes() {
  const notes = storage.get(keys.notes, []);
  const highlights = storage.get(keys.highlights, []);
  const list = notes.length
    ? notes
        .slice()
        .reverse()
        .map((note) => {
          const item = itemById(note.itemId);
          return `
            <article class="note-mini">
              <p>${escapeHtml(note.text)}</p>
              <small>${escapeHtml(item?.title || "Nota libera")} · ${new Date(note.createdAt).toLocaleString("it-IT")}</small>
              <button class="button" type="button" data-copy-note-id="${escapeHtml(note.id)}">Copia nota</button>
              ${item ? `<a href="#/item/${item.id}/testo">Riapri testo</a>` : ""}
            </article>
          `;
        })
        .join("")
    : `<p>Gli appunti compariranno qui quando salvi una sottolineatura o una nota.</p>`;

  app.innerHTML = `
    <section class="band">
      <div class="section-head">
        <p class="eyebrow" style="color:var(--teal)">Quaderno personale</p>
        <h2>Appunti</h2>
        <p>Sottolineature salvate: ${highlights.length}. Note totali: ${notes.length}.</p>
      </div>
      <div class="notes-grid">
        <div class="side-panel">${list}</div>
        <form class="notes-editor">
          <h3>Nota libera</h3>
          <textarea name="note" placeholder="Scrivi un appunto sul percorso..."></textarea>
          <div class="action-row">
            <button class="button primary" type="submit">Salva nota</button>
            <button class="button" type="button" data-copy-all-notes>Copia tutto</button>
            <button class="button" type="button" data-export-notes>Scarica appunti</button>
            <button class="button" type="button" data-clear-notes>Cancella appunti</button>
          </div>
        </form>
      </div>
    </section>
  `;

  const form = document.querySelector(".notes-editor");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const textarea = form.elements.note;
    const text = textarea.value.trim();
    if (!text) return;
    const nextNotes = storage.get(keys.notes, []);
    nextNotes.push({ id: crypto.randomUUID(), itemId: "", text, createdAt: new Date().toISOString(), type: "note" });
    storage.set(keys.notes, nextNotes);
    textarea.value = "";
    renderNotes();
  });

  form.querySelector("[data-export-notes]").addEventListener("click", exportNotes);
  form.querySelector("[data-copy-all-notes]").addEventListener("click", copyAllNotes);
  form.querySelector("[data-clear-notes]").addEventListener("click", () => {
    if (!confirm("Cancellare appunti e sottolineature salvate?")) return;
    storage.set(keys.notes, []);
    storage.set(keys.highlights, []);
    renderNotes();
  });
}

function noteExportText() {
  const notes = storage.get(keys.notes, []);
  return notes
    .map((note) => {
      const item = itemById(note.itemId);
      return `[${item?.title || "Nota libera"}]\n${note.text}\n${new Date(note.createdAt).toLocaleString("it-IT")}`;
    })
    .join("\n\n---\n\n");
}

async function copyAllNotes() {
  await writeClipboard(noteExportText() || "Nessun appunto salvato.");
}

function exportNotes() {
  const content = noteExportText();
  const blob = new Blob([content || "Nessun appunto salvato."], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "appunti-leopardi.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

function renderEmpty() {
  const template = document.querySelector("#emptyStateTemplate");
  app.replaceChildren(template.content.cloneNode(true));
}

selectionTools.addEventListener("pointerdown", (event) => event.preventDefault());
selectionTools.querySelector("[data-highlight]").addEventListener("click", () => saveSelectionAction("highlight"));
selectionTools.querySelector("[data-copy-selection]").addEventListener("click", () => saveSelectionAction("copy"));
selectionTools.querySelector("[data-save-note]").addEventListener("click", () => saveSelectionAction("note"));

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-note-id]");
  if (!button) return;
  const note = storage.get(keys.notes, []).find((entry) => entry.id === button.dataset.copyNoteId);
  if (note) await writeClipboard(note.text);
});

window.addEventListener("hashchange", render);
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  document.querySelector("#installButton").hidden = false;
});

document.querySelector("#installButton").addEventListener("click", async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  document.querySelector("#installButton").hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

render();
