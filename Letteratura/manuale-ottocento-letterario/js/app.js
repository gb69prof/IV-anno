(function () {
  "use strict";

  var state = {
    chapters: [],
    glossary: [],
    links: {},
    current: 0,
    currentSectionId: "",
    currentSectionTitle: "",
    searchQuery: "",
    imageZoom: 1
  };

  var el = {};

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return (value || "").toString().replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function chapterById(id) {
    return state.chapters.find(function (chapter) { return chapter.id === id; });
  }

  function glossaryById(id) {
    return state.glossary.find(function (entry) { return entry.id === id; });
  }

  function glossaryByTerm(term) {
    var normalized = window.ManualeSearch.normalize(term);
    return state.glossary.find(function (entry) {
      return window.ManualeSearch.normalize(entry.term) === normalized;
    });
  }

  function allImages() {
    var seen = {};
    var images = [];
    state.chapters.forEach(function (chapter) {
      (chapter.images || []).forEach(function (image) {
        if (!seen[image.id]) {
          seen[image.id] = true;
          images.push(image);
        }
      });
    });
    return images;
  }

  function imageById(id) {
    return allImages().find(function (image) { return image.id === id; });
  }

  function loadData() {
    state.chapters = window.MANUALE_CHAPTERS || [];
    state.glossary = window.MANUALE_GLOSSARY || [];
    state.links = window.MANUALE_LINKS || {};
    var progress = window.ManualeNotes.getProgress();
    var savedIndex = state.chapters.findIndex(function (chapter) { return chapter.id === progress.chapterId; });
    state.current = savedIndex >= 0 ? savedIndex : 0;
  }

  function cacheElements() {
    el.app = $("#app");
    el.reader = $("#reader");
    el.content = $("#chapterContent");
    el.title = $("#chapterTitle");
    el.subtitle = $("#chapterSubtitle");
    el.kicker = $("#chapterKicker");
    el.source = $("#chapterSource");
    el.keywords = $("#chapterKeywords");
    el.mobileChapter = $("#mobileChapter");
    el.sidePanel = $("#sidePanel");
    el.panelTitle = $("#panelTitle");
    el.panelCategory = $("#panelCategory");
    el.panelBody = $("#panelBody");
    el.panelClose = $("#panelClose");
    el.prev = $("#prevChapter");
    el.next = $("#nextChapter");
    el.progressBar = $("#progressBar");
    el.completionText = $("#completionText");
    el.pageIndicator = $("#pageIndicator");
    el.sectionIndicator = $("#sectionIndicator");
    el.themeToggle = $("#themeToggle");
    el.mobileMenuButton = $("#mobileMenuButton");
    el.imageModal = $("#imageModal");
    el.imageModalImg = $("#imageModalImg");
    el.imageModalTitle = $("#imageModalTitle");
    el.imageModalClose = $("#imageModalClose");
    el.imageStage = $("#imageStage");
  }

  function setActiveTool(tool) {
    $all(".rail-button").forEach(function (button) {
      button.classList.toggle("active", button.dataset.tool === tool);
    });
  }

  function renderChapter(options) {
    options = options || {};
    var chapter = state.chapters[state.current];
    if (!chapter) return;

    el.kicker.textContent = "Capitolo " + chapter.number + " di " + state.chapters.length;
    el.title.textContent = chapter.title;
    el.subtitle.textContent = chapter.subtitle || "";
    el.mobileChapter.textContent = chapter.title;
    el.source.innerHTML = '<span class="meta-pill">Fonte: ' + escapeHtml(chapter.source) + '</span>';
    el.keywords.innerHTML = (chapter.keywords || []).slice(0, 9).map(function (term) {
      return '<button type="button" class="keyword-pill" data-term="' + escapeHtml(term) + '">' + escapeHtml(term) + '</button>';
    }).join("");
    el.content.innerHTML = chapter.html || '<p class="empty-state">Capitolo senza contenuto pubblicabile.</p>';

    linkGlossaryTerms();
    window.ManualeNotes.applyNoteHighlights(el.content, chapter.id);
    bindInlineActions();
    updateNav();

    if (options.query) {
      highlightSearchInChapter(options.query);
    }

    requestAnimationFrame(function () {
      if (options.sectionId) {
        scrollToSection(options.sectionId, false);
      } else if (options.restoreScroll) {
        var progress = window.ManualeNotes.getProgress();
        el.reader.scrollTop = progress.scrollTop || 0;
      } else {
        el.reader.scrollTop = 0;
      }
      updateProgress();
    });
  }

  function linkGlossaryTerms() {
    var chapter = state.chapters[state.current];
    var terms = (state.glossary || [])
      .filter(function (entry) { return (chapter.keywords || []).indexOf(entry.term) >= 0 || (chapter.plainText || "").toLowerCase().indexOf(entry.term.toLowerCase()) >= 0; })
      .map(function (entry) { return entry.term; })
      .sort(function (a, b) { return b.length - a.length; });
    var linked = {};
    var walker = document.createTreeWalker(el.content, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && node.parentElement.closest("button, a, h1, h2, h3, h4, mark")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.some(function (node) {
      var value = node.nodeValue;
      for (var i = 0; i < terms.length; i += 1) {
        var term = terms[i];
        if (linked[term]) continue;
        var pattern = new RegExp("(^|[^\\p{L}\\p{N}_])(" + window.ManualeSearch.escapeRegExp(term) + ")(?=$|[^\\p{L}\\p{N}_])", "iu");
        var match = value.match(pattern);
        if (!match) continue;
        var start = match.index + match[1].length;
        var end = start + match[2].length;
        var range = document.createRange();
        range.setStart(node, start);
        range.setEnd(node, end);
        var button = document.createElement("button");
        button.type = "button";
        button.className = "term-link";
        button.dataset.term = term;
        button.title = "Apri nel glossario";
        range.surroundContents(button);
        linked[term] = true;
        return false;
      }
      return Object.keys(linked).length >= Math.min(terms.length, 20);
    });
  }

  function bindInlineActions() {
    $all("[data-term]", el.content.parentElement).forEach(function (button) {
      button.addEventListener("click", function () {
        openGlossaryTerm(button.dataset.term);
      });
    });
    $all(".image-open", el.content).forEach(function (button) {
      button.addEventListener("click", function () {
        openImage(button.dataset.imageId);
      });
    });
  }

  function openPanel(title, category, html) {
    el.panelTitle.textContent = title;
    el.panelCategory.textContent = category;
    el.panelBody.innerHTML = html;
    el.app.classList.add("panel-open");
    bindPanelActions();
  }

  function closePanel() {
    el.app.classList.remove("panel-open");
    setActiveTool("read");
  }

  function bindPanelActions() {
    $all("[data-open-chapter]", el.panelBody).forEach(function (button) {
      if (button.dataset.boundOpenChapter) return;
      button.dataset.boundOpenChapter = "1";
      button.addEventListener("click", function () {
        goToChapter(button.dataset.openChapter, {
          sectionId: button.dataset.sectionId || "",
          query: button.dataset.query || ""
        });
      });
    });
    $all("[data-open-term]", el.panelBody).forEach(function (button) {
      if (button.dataset.boundOpenTerm) return;
      button.dataset.boundOpenTerm = "1";
      button.addEventListener("click", function () {
        openGlossaryTerm(button.dataset.openTerm);
      });
    });
    $all("[data-image-id]", el.panelBody).forEach(function (button) {
      if (button.dataset.boundImage) return;
      button.dataset.boundImage = "1";
      button.addEventListener("click", function () {
        openImage(button.dataset.imageId);
      });
    });
    $all("[data-delete-note]", el.panelBody).forEach(function (button) {
      if (button.dataset.boundDeleteNote) return;
      button.dataset.boundDeleteNote = "1";
      button.addEventListener("click", function () {
        window.ManualeNotes.deleteNote(button.dataset.deleteNote);
        renderNotesPanel();
        renderChapter({ restoreScroll: true });
      });
    });
    $all("[data-delete-bookmark]", el.panelBody).forEach(function (button) {
      if (button.dataset.boundDeleteBookmark) return;
      button.dataset.boundDeleteBookmark = "1";
      button.addEventListener("click", function () {
        window.ManualeNotes.deleteBookmark(button.dataset.deleteBookmark);
        renderBookmarksPanel();
      });
    });
    var addBookmark = $("[data-add-bookmark]", el.panelBody);
    if (addBookmark && !addBookmark.dataset.boundAddBookmark) {
      addBookmark.dataset.boundAddBookmark = "1";
      addBookmark.addEventListener("click", function () {
        addCurrentBookmark();
        renderBookmarksPanel();
      });
    }
    var addNote = $("[data-add-note]", el.panelBody);
    if (addNote && !addNote.dataset.boundAddNote) {
      addNote.dataset.boundAddNote = "1";
      addNote.addEventListener("click", function () {
        addNoteFromSelection();
        renderNotesPanel();
      });
    }
    var searchInput = $("#searchInput", el.panelBody);
    if (searchInput && !searchInput.dataset.boundSearch) {
      searchInput.dataset.boundSearch = "1";
      searchInput.focus();
      searchInput.addEventListener("input", function () {
        state.searchQuery = searchInput.value;
        renderSearchResults(searchInput.value);
      });
    }
  }

  function goToChapter(chapterId, options) {
    options = options || {};
    var index = state.chapters.findIndex(function (chapter) { return chapter.id === chapterId; });
    if (index < 0) return;
    state.current = index;
    renderChapter({ sectionId: options.sectionId, query: options.query });
    window.ManualeNotes.saveProgress({ chapterId: chapterId, scrollTop: 0 });
  }

  function scrollToSection(sectionId, smooth) {
    var target = document.getElementById(sectionId);
    if (!target) return;
    target.scrollIntoView({ behavior: smooth === false ? "auto" : "smooth", block: "start" });
  }

  function updateNav() {
    var chapter = state.chapters[state.current];
    el.prev.disabled = state.current === 0;
    el.next.disabled = state.current === state.chapters.length - 1;
    el.pageIndicator.textContent = (state.current + 1) + " / " + state.chapters.length;
    state.currentSectionTitle = chapter.sections && chapter.sections.length ? chapter.sections[0].title : chapter.title;
    state.currentSectionId = chapter.sections && chapter.sections.length ? chapter.sections[0].id : "";
    el.sectionIndicator.textContent = state.currentSectionTitle || chapter.title;
  }

  function updateProgress() {
    var maxScroll = Math.max(1, el.reader.scrollHeight - el.reader.clientHeight);
    var scrollRatio = Math.min(1, Math.max(0, el.reader.scrollTop / maxScroll));
    var totalRatio = (state.current + scrollRatio) / state.chapters.length;
    var percent = Math.round(totalRatio * 100);
    el.progressBar.style.width = percent + "%";
    el.completionText.textContent = percent + "%";

    var headings = $all("h2[id], h3[id], h4[id]", el.content);
    var active = null;
    headings.forEach(function (heading) {
      if (heading.getBoundingClientRect().top < 190) active = heading;
    });
    if (active) {
      state.currentSectionId = active.id;
      state.currentSectionTitle = active.textContent;
      el.sectionIndicator.textContent = active.textContent;
    }

    var chapter = state.chapters[state.current];
    window.ManualeNotes.saveProgress({
      chapterId: chapter.id,
      scrollTop: el.reader.scrollTop,
      percent: percent,
      sectionId: state.currentSectionId
    });
  }

  function renderIndexPanel() {
    var html = '<div class="panel-list">' + state.chapters.map(function (chapter) {
      var sections = (chapter.sections || []).slice(0, 8).map(function (section) {
        return '<button type="button" class="outline-link" data-open-chapter="' + chapter.id + '" data-section-id="' + escapeHtml(section.id) + '">' + escapeHtml(section.title) + '</button>';
      }).join("");
      return '<div class="panel-card"><button type="button" class="outline-link" data-open-chapter="' + chapter.id + '"><strong>' + chapter.number + '. ' + escapeHtml(chapter.title) + '</strong><small>' + escapeHtml(chapter.subtitle || "") + '</small></button><div class="chapter-outline">' + sections + '</div></div>';
    }).join("") + '</div>';
    openPanel("Indice", "Navigazione", html);
  }

  function renderMapPanel() {
    var maps = allImages();
    var html = maps.length ? '<div class="map-grid">' + maps.map(function (image) {
      return '<button type="button" class="map-card" data-image-id="' + escapeHtml(image.id) + '"><img src="' + escapeHtml(image.src) + '" alt="' + escapeHtml(image.title) + '" loading="lazy"><span>' + escapeHtml(image.title) + '</span></button>';
    }).join("") + '</div>' : '<p class="empty-state">Nessuna mappa rilevata nei materiali.</p>';
    openPanel("Mappe", "Consultazione", html);
  }

  function renderGlossaryPanel() {
    var grouped = state.glossary.map(function (entry) {
      return '<button type="button" class="panel-card" data-open-term="' + escapeHtml(entry.term) + '"><strong>' + escapeHtml(entry.term) + '</strong><small>' + escapeHtml((entry.chapters || []).map(function (chapter) { return chapter.chapterTitle; }).slice(0, 3).join(" · ")) + '</small></button>';
    }).join("");
    openPanel("Glossario", "Parole chiave", '<div class="panel-list">' + grouped + '</div>');
  }

  function openGlossaryTerm(term) {
    var entry = glossaryByTerm(term) || glossaryById(term);
    if (!entry) return;
    var chapters = (entry.chapters || []).map(function (chapter) {
      return '<button type="button" class="panel-card" data-open-chapter="' + escapeHtml(chapter.chapterId) + '"><strong>' + escapeHtml(chapter.chapterTitle) + '</strong><small>Apri il capitolo collegato</small></button>';
    }).join("");
    var html = '<h3>Estratto dai materiali</h3><p>' + escapeHtml(entry.definition) + '</p>';
    if (chapters) html += '<h3>Collegamenti interni</h3><div class="panel-list">' + chapters + '</div>';
    openPanel(entry.term, entry.category || "Glossario", html);
  }

  function renderQuestionsPanel() {
    var chapter = state.chapters[state.current];
    var current = chapter.questions && chapter.questions.length
      ? '<div class="panel-list">' + chapter.questions.map(function (q) { return '<div class="note-card">' + escapeHtml(q) + '</div>'; }).join("") + '</div>'
      : '<p class="empty-state">Per questo capitolo non sono state rilevate domande nei materiali forniti.</p>';
    var others = state.chapters.filter(function (item) { return item.questions && item.questions.length; }).map(function (item) {
      return '<button type="button" class="panel-card" data-open-chapter="' + item.id + '"><strong>' + item.title + '</strong><small>' + item.questions.length + ' domande rilevate</small></button>';
    }).join("");
    openPanel("Domande", "Ripasso", '<h3>Capitolo corrente</h3>' + current + '<h3>Altri capitoli</h3><div class="panel-list">' + others + '</div>');
  }

  function renderSearchPanel() {
    openPanel("Ricerca", "Trova nel manuale", '<div class="search-box"><input id="searchInput" type="search" autocomplete="off" placeholder="Cerca autori, opere, correnti, concetti"><div id="searchResults"></div></div>');
    if (state.searchQuery) {
      var input = $("#searchInput", el.panelBody);
      input.value = state.searchQuery;
      renderSearchResults(state.searchQuery);
    }
  }

  function renderSearchResults(query) {
    var mount = $("#searchResults", el.panelBody);
    if (!mount) return;
    var results = window.ManualeSearch.search(state.chapters, state.glossary, query);
    if (!query || query.trim().length < 2) {
      mount.innerHTML = '<p class="empty-state">Inserisci almeno due caratteri.</p>';
      return;
    }
    if (!results.length) {
      mount.innerHTML = '<p class="empty-state">Nessun risultato trovato.</p>';
      return;
    }
    mount.innerHTML = '<div class="panel-list">' + results.map(function (result) {
      var action = result.type === "glossary"
        ? 'data-open-term="' + escapeHtml(result.title) + '"'
        : 'data-open-chapter="' + escapeHtml(result.chapterId) + '" data-query="' + escapeHtml(query) + '"';
      return '<button type="button" class="result-card" ' + action + '><strong>' + escapeHtml(result.title) + '</strong><small>' + escapeHtml(result.subtitle || result.type) + '</small><p>' + escapeHtml(result.snippet) + '</p></button>';
    }).join("") + '</div>';
    bindPanelActions();
  }

  function highlightSearchInChapter(query) {
    if (!query || query.trim().length < 2) return;
    var pattern = new RegExp(window.ManualeSearch.escapeRegExp(query.trim()), "ig");
    var walker = document.createTreeWalker(el.content, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && node.parentElement.closest("button, mark")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    var first = null;
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      if (!pattern.test(text)) return;
      pattern.lastIndex = 0;
      var fragment = document.createDocumentFragment();
      var last = 0;
      text.replace(pattern, function (match, offset) {
        fragment.appendChild(document.createTextNode(text.slice(last, offset)));
        var mark = document.createElement("mark");
        mark.className = "search-hit";
        mark.textContent = match;
        if (!first) first = mark;
        fragment.appendChild(mark);
        last = offset + match.length;
        return match;
      });
      fragment.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(fragment, node);
    });
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderNotesPanel() {
    var notes = window.ManualeNotes.getNotes();
    var html = '<div class="action-row"><button type="button" class="primary-action" data-add-note>Aggiungi dalla selezione</button></div>';
    html += notes.length ? '<div class="panel-list">' + notes.map(function (note) {
      var chapter = chapterById(note.chapterId);
      return '<div class="note-card"><strong>' + escapeHtml(chapter ? chapter.title : "Capitolo") + '</strong><p>' + escapeHtml(note.text) + '</p><small>' + escapeHtml(note.note || "Nota senza testo") + '</small><div class="action-row"><button type="button" class="secondary-action" data-open-chapter="' + escapeHtml(note.chapterId) + '">Apri</button><button type="button" class="danger-action" data-delete-note="' + escapeHtml(note.id) + '">Elimina</button></div></div>';
    }).join("") + '</div>' : '<p class="empty-state">Seleziona una frase nel testo e poi aggiungi una nota.</p>';
    openPanel("Note", "Studio personale", html);
  }

  function addNoteFromSelection() {
    var selection = window.getSelection();
    var text = selection ? selection.toString().replace(/\s+/g, " ").trim() : "";
    if (!text || !el.content.contains(selection.anchorNode)) {
      return;
    }
    var noteText = window.prompt("Nota personale");
    window.ManualeNotes.saveNote({
      chapterId: state.chapters[state.current].id,
      sectionId: state.currentSectionId,
      text: text.slice(0, 480),
      note: noteText || ""
    });
    selection.removeAllRanges();
    renderChapter({ restoreScroll: true });
  }

  function renderBookmarksPanel() {
    var bookmarks = window.ManualeNotes.getBookmarks();
    var html = '<div class="action-row"><button type="button" class="primary-action" data-add-bookmark>Aggiungi segnalibro</button></div>';
    html += bookmarks.length ? '<div class="panel-list">' + bookmarks.map(function (bookmark) {
      return '<div class="note-card"><strong>' + escapeHtml(bookmark.label) + '</strong><small>' + escapeHtml(bookmark.chapterTitle || "") + '</small><div class="action-row"><button type="button" class="secondary-action" data-open-chapter="' + escapeHtml(bookmark.chapterId) + '" data-section-id="' + escapeHtml(bookmark.sectionId || "") + '">Apri</button><button type="button" class="danger-action" data-delete-bookmark="' + escapeHtml(bookmark.id) + '">Elimina</button></div></div>';
    }).join("") + '</div>' : '<p class="empty-state">Nessun segnalibro salvato.</p>';
    openPanel("Segnalibri", "Punti salvati", html);
  }

  function addCurrentBookmark() {
    var chapter = state.chapters[state.current];
    window.ManualeNotes.saveBookmark({
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      sectionId: state.currentSectionId,
      label: state.currentSectionTitle || chapter.title
    });
  }

  function openImage(id) {
    var image = imageById(id);
    if (!image) return;
    state.imageZoom = 1;
    el.imageModalTitle.textContent = image.title || "Mappa";
    el.imageModalImg.src = image.src;
    el.imageModalImg.alt = image.title || "";
    el.imageModalImg.style.transform = "scale(1)";
    el.imageModal.classList.add("open");
    el.imageModal.setAttribute("aria-hidden", "false");
  }

  function closeImage() {
    el.imageModal.classList.remove("open");
    el.imageModal.setAttribute("aria-hidden", "true");
    el.imageModalImg.removeAttribute("src");
  }

  function changeZoom(action) {
    if (action === "reset") state.imageZoom = 1;
    if (action === "in") state.imageZoom = Math.min(3, state.imageZoom + 0.2);
    if (action === "out") state.imageZoom = Math.max(0.45, state.imageZoom - 0.2);
    el.imageModalImg.style.transform = "scale(" + state.imageZoom + ")";
  }

  function handleTool(tool) {
    document.body.classList.remove("mobile-tools-open");
    setActiveTool(tool);
    if (tool === "read") return closePanel();
    if (tool === "index") return renderIndexPanel();
    if (tool === "map") return renderMapPanel();
    if (tool === "glossary") return renderGlossaryPanel();
    if (tool === "questions") return renderQuestionsPanel();
    if (tool === "notes") return renderNotesPanel();
    if (tool === "bookmarks") return renderBookmarksPanel();
    if (tool === "search") return renderSearchPanel();
  }

  function bindEvents() {
    $all("[data-tool]").forEach(function (button) {
      button.addEventListener("click", function () {
        handleTool(button.dataset.tool);
      });
    });
    el.panelClose.addEventListener("click", closePanel);
    el.prev.addEventListener("click", function () {
      if (state.current > 0) {
        state.current -= 1;
        renderChapter();
      }
    });
    el.next.addEventListener("click", function () {
      if (state.current < state.chapters.length - 1) {
        state.current += 1;
        renderChapter();
      }
    });
    el.reader.addEventListener("scroll", updateProgress, { passive: true });
    el.themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark");
      localStorage.setItem("manualeOttocento.theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
    el.mobileMenuButton.addEventListener("click", function () {
      document.body.classList.toggle("mobile-tools-open");
    });
    el.imageModalClose.addEventListener("click", closeImage);
    el.imageModal.addEventListener("click", function (event) {
      if (event.target === el.imageModal) closeImage();
    });
    $all("[data-zoom]").forEach(function (button) {
      button.addEventListener("click", function () { changeZoom(button.dataset.zoom); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if (el.imageModal.classList.contains("open")) closeImage();
        else closePanel();
      }
    });
  }

  function initTheme() {
    if (localStorage.getItem("manualeOttocento.theme") === "dark") {
      document.body.classList.add("dark");
    }
  }

  function init() {
    loadData();
    cacheElements();
    initTheme();
    bindEvents();
    renderChapter({ restoreScroll: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
