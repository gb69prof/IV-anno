(function () {
  "use strict";

  function normalize(value) {
    return (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function stripHtml(value) {
    var holder = document.createElement("div");
    holder.innerHTML = value || "";
    return holder.textContent || holder.innerText || "";
  }

  function makeSnippet(text, query) {
    var clean = (text || "").replace(/\s+/g, " ").trim();
    var haystack = normalize(clean);
    var needle = normalize(query);
    var index = haystack.indexOf(needle);
    if (index < 0) {
      return clean.slice(0, 220) + (clean.length > 220 ? "..." : "");
    }
    var start = Math.max(0, index - 90);
    var end = Math.min(clean.length, index + query.length + 140);
    var snippet = clean.slice(start, end);
    if (start > 0) snippet = "..." + snippet;
    if (end < clean.length) snippet += "...";
    return snippet;
  }

  function scoreText(text, query) {
    var haystack = normalize(text);
    var needle = normalize(query);
    if (!needle) return 0;
    var score = 0;
    var index = haystack.indexOf(needle);
    if (index >= 0) score += 8;
    var tokens = needle.split(/\s+/).filter(Boolean);
    tokens.forEach(function (token) {
      if (haystack.indexOf(token) >= 0) score += 2;
    });
    return score;
  }

  function search(chapters, glossary, query) {
    var q = (query || "").trim();
    if (q.length < 2) return [];
    var results = [];

    chapters.forEach(function (chapter) {
      var plain = chapter.plainText || stripHtml(chapter.html || "");
      var score = scoreText([chapter.title, chapter.subtitle, plain].join(" "), q);
      if (score > 0) {
        if (normalize(chapter.title).indexOf(normalize(q)) >= 0) score += 10;
        results.push({
          type: "chapter",
          chapterId: chapter.id,
          title: chapter.title,
          subtitle: chapter.subtitle || "",
          snippet: makeSnippet(plain, q),
          score: score
        });
      }
    });

    glossary.forEach(function (entry) {
      var score = scoreText([entry.term, entry.definition].join(" "), q);
      if (score > 0) {
        results.push({
          type: "glossary",
          glossaryId: entry.id,
          title: entry.term,
          subtitle: "Glossario",
          snippet: makeSnippet(entry.definition, q),
          score: score + 4
        });
      }
    });

    return results
      .sort(function (a, b) { return b.score - a.score || a.title.localeCompare(b.title); })
      .slice(0, 40);
  }

  function highlight(text, query) {
    if (!query) return text;
    var escaped = escapeRegExp(query.trim());
    if (!escaped) return text;
    return text.replace(new RegExp("(" + escaped + ")", "ig"), "<mark>$1</mark>");
  }

  window.ManualeSearch = {
    normalize: normalize,
    escapeRegExp: escapeRegExp,
    stripHtml: stripHtml,
    search: search,
    highlight: highlight
  };
})();
