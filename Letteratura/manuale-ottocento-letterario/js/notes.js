(function () {
  "use strict";

  var NOTES_KEY = "manualeOttocento.notes";
  var BOOKMARKS_KEY = "manualeOttocento.bookmarks";
  var PROGRESS_KEY = "manualeOttocento.progress";

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function id(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function getNotes() {
    return read(NOTES_KEY, []);
  }

  function saveNote(note) {
    var notes = getNotes();
    notes.unshift(Object.assign({ id: id("note"), createdAt: new Date().toISOString() }, note));
    write(NOTES_KEY, notes);
    return notes[0];
  }

  function deleteNote(noteId) {
    write(NOTES_KEY, getNotes().filter(function (note) { return note.id !== noteId; }));
  }

  function getBookmarks() {
    return read(BOOKMARKS_KEY, []);
  }

  function saveBookmark(bookmark) {
    var bookmarks = getBookmarks();
    var duplicate = bookmarks.some(function (item) {
      return item.chapterId === bookmark.chapterId && item.sectionId === bookmark.sectionId;
    });
    if (!duplicate) {
      bookmarks.unshift(Object.assign({ id: id("bookmark"), createdAt: new Date().toISOString() }, bookmark));
      write(BOOKMARKS_KEY, bookmarks);
    }
    return getBookmarks();
  }

  function deleteBookmark(bookmarkId) {
    write(BOOKMARKS_KEY, getBookmarks().filter(function (item) { return item.id !== bookmarkId; }));
  }

  function saveProgress(progress) {
    write(PROGRESS_KEY, Object.assign(read(PROGRESS_KEY, {}), progress));
  }

  function getProgress() {
    return read(PROGRESS_KEY, {});
  }

  function textNodes(root) {
    var nodes = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && node.parentElement.closest("button, mark, .note-highlight")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function wrapFirstText(root, needle, className, attrs) {
    if (!needle || needle.length < 3) return false;
    var normalizedNeedle = needle.replace(/\s+/g, " ").trim();
    var nodes = textNodes(root);
    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      var value = node.nodeValue;
      var index = value.indexOf(normalizedNeedle);
      if (index < 0) continue;
      var range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + normalizedNeedle.length);
      var mark = document.createElement("mark");
      mark.className = className;
      Object.keys(attrs || {}).forEach(function (key) {
        mark.setAttribute(key, attrs[key]);
      });
      range.surroundContents(mark);
      return true;
    }
    return false;
  }

  function applyNoteHighlights(root, chapterId) {
    getNotes()
      .filter(function (note) { return note.chapterId === chapterId; })
      .forEach(function (note) {
        wrapFirstText(root, note.text, "note-highlight", { "data-note-id": note.id, title: note.note || "Nota" });
      });
  }

  window.ManualeNotes = {
    getNotes: getNotes,
    saveNote: saveNote,
    deleteNote: deleteNote,
    getBookmarks: getBookmarks,
    saveBookmark: saveBookmark,
    deleteBookmark: deleteBookmark,
    saveProgress: saveProgress,
    getProgress: getProgress,
    applyNoteHighlights: applyNoteHighlights
  };
})();
