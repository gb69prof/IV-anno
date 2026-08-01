(function () {
  "use strict";

  if (window.OttocentoPwaBridge) return;

  var script = document.currentScript;
  var scriptUrl = new URL(script && script.src ? script.src : "./rete-pwa/bridge.js", location.href);
  var ASSET_VERSION = "2";
  var literatureRoot = new URL("../", scriptUrl);
  var configUrl = new URL("links.json", scriptUrl);
  var cssUrl = new URL("bridge.css", scriptUrl);
  configUrl.searchParams.set("v", ASSET_VERSION);
  cssUrl.searchParams.set("v", ASSET_VERSION);
  var requestedApp = script && script.dataset ? script.dataset.ottocentoApp : "";
  var RETURN_KEY = "ottocento.bridge.return.v1";

  var fallback = {
    version: 1,
    apps: [
      { id: "manuale", label: "Manuale dell’Ottocento", path: "Ottocento_letterario.html" },
      { id: "romanticismo", label: "Romanticismo", path: "Romanticismo/" },
      { id: "romanticismo-lezioni", label: "Romanticismo – lezioni", path: "Romanticismo-lezioni/" },
      { id: "foscolo", label: "Foscolo", path: "Foscolo/" },
      { id: "leopardi", label: "Leopardi", path: "Leopardi/" },
      { id: "manzoni", label: "Manzoni", path: "Manzoni/" },
      { id: "parini", label: "Parini", path: "Parini/" }
    ],
    related: {
      manuale: ["foscolo", "romanticismo", "leopardi", "manzoni", "parini"],
      romanticismo: ["romanticismo-lezioni", "manzoni", "leopardi"],
      "romanticismo-lezioni": ["romanticismo", "manzoni", "leopardi"],
      foscolo: ["manuale", "romanticismo", "leopardi", "parini"],
      leopardi: ["manuale", "romanticismo-lezioni", "foscolo"],
      manzoni: ["manuale", "romanticismo-lezioni", "romanticismo"],
      parini: ["manuale", "foscolo"]
    },
    bridges: []
  };

  function loadStyle() {
    if (document.querySelector('link[data-ottocento-bridge-style]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssUrl.href;
    link.dataset.ottocentoBridgeStyle = "";
    document.head.appendChild(link);
  }

  function cleanPath(pathname) {
    try { return decodeURIComponent(pathname); } catch (error) { return pathname; }
  }

  function detectApp(config) {
    if (requestedApp && config.apps.some(function (app) { return app.id === requestedApp; })) return requestedApp;
    var path = cleanPath(location.pathname).toLowerCase();
    var match = config.apps.find(function (app) {
      if (app.id === "manuale") return /\/letteratura\/ottocento_letterario\.html$/i.test(path);
      return path.indexOf(("/letteratura/" + app.path).toLowerCase()) !== -1;
    });
    return match ? match.id : "";
  }

  function appById(config, id) {
    return config.apps.find(function (app) { return app.id === id; });
  }

  function pageForApp(app) {
    if (!app.path.endsWith("/")) return app.path;
    var marker = "/Letteratura/" + app.path;
    var path = cleanPath(location.pathname);
    var index = path.toLowerCase().indexOf(marker.toLowerCase());
    if (index < 0) return "";
    var page = path.slice(index + marker.length).replace(/^\/+/, "");
    return page || "index.html";
  }

  function slugify(text) {
    return (text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "sezione";
  }

  function ensureHeadingIds() {
    var used = {};
    Array.prototype.forEach.call(document.querySelectorAll("[id]"), function (element) { used[element.id] = true; });
    Array.prototype.forEach.call(document.querySelectorAll("main h1, main h2, main h3, article h1, article h2, article h3"), function (heading) {
      if (heading.id) return;
      var base = slugify(heading.textContent);
      var id = base;
      var suffix = 2;
      while (used[id]) id = base + "-" + suffix++;
      heading.id = id;
      used[id] = true;
    });
  }

  function canonicalCurrent() {
    var current = new URL(location.href);
    current.searchParams.delete("from");
    current.searchParams.delete("topic");
    return current.pathname + (current.search ? current.search : "") + (current.hash ? current.hash : "");
  }

  function safeReturn(raw) {
    if (!raw) return "";
    try {
      var target = new URL(raw, location.origin);
      var rootPath = literatureRoot.pathname;
      if (target.origin !== location.origin || target.pathname.indexOf(rootPath) !== 0) return "";
      var current = new URL(location.href);
      current.searchParams.delete("from");
      current.searchParams.delete("topic");
      if (target.pathname + target.search + target.hash === current.pathname + current.search + current.hash) return "";
      return target.pathname + target.search + target.hash;
    } catch (error) {
      return "";
    }
  }

  function getReturnUrl() {
    var direct = safeReturn(new URL(location.href).searchParams.get("from"));
    if (direct) return direct;
    try {
      var referrer = document.referrer ? new URL(document.referrer) : null;
      var saved = safeReturn(sessionStorage.getItem(RETURN_KEY));
      if (referrer && referrer.origin === location.origin && referrer.pathname.indexOf(literatureRoot.pathname) === 0) return saved;
    } catch (error) {}
    return "";
  }

  function destinationUrl(destination, topic) {
    var target = new URL(destination.path, literatureRoot);
    if (destination.hash) target.hash = destination.hash;
    target.searchParams.set("from", canonicalCurrent());
    if (topic) target.searchParams.set("topic", topic);
    return target.href;
  }

  function rememberOrigin() {
    try { sessionStorage.setItem(RETURN_KEY, canonicalCurrent()); } catch (error) {}
  }

  function makeLink(destination, topic, className) {
    var link = document.createElement("a");
    link.className = className || "ottocento-bridge-link";
    link.href = destinationUrl(destination, topic);
    link.textContent = destination.label;
    link.addEventListener("click", rememberOrigin);
    return link;
  }

  function enhanceAuthoredLinks() {
    Array.prototype.forEach.call(document.querySelectorAll("a[data-ottocento-link]"), function (link) {
      try {
        var target = new URL(link.href, location.href);
        target.searchParams.set("from", canonicalCurrent());
        if (link.dataset.ottocentoTopic) target.searchParams.set("topic", link.dataset.ottocentoTopic);
        link.href = target.href;
        link.addEventListener("click", rememberOrigin);
      } catch (error) {}
    });
  }

  function revealManualHash(appId) {
    if (appId !== "manuale" || !location.hash) return;
    var id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (error) { id = location.hash.slice(1); }
    var target = document.getElementById(id);
    if (!target) return;
    var chapter = target.closest(".chapter");
    if (chapter && chapter.hidden) {
      var opener = document.querySelector('[data-open="' + chapter.dataset.ch + '"]');
      if (opener) opener.click();
      else chapter.hidden = false;
    }
    window.setTimeout(function () {
      target.scrollIntoView({ block: "start" });
      window.scrollBy(0, -64);
      if (target.tabIndex < 0) target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }, 60);
  }

  function revealHashTarget() {
    if (!location.hash) return;
    var target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    window.setTimeout(function () { target.scrollIntoView({ block: "start" }); }, 50);
  }

  function renderHub(config, appId) {
    var currentApp = appById(config, appId);
    if (!currentApp) return;
    var details = document.createElement("details");
    details.className = "ottocento-bridge-hub";
    details.dataset.app = appId;
    var summary = document.createElement("summary");
    summary.textContent = "Esplora l’Ottocento";
    summary.setAttribute("aria-label", "Apri i percorsi collegati dell’Ottocento letterario");
    details.appendChild(summary);

    var panel = document.createElement("nav");
    panel.className = "ottocento-bridge-menu";
    panel.setAttribute("aria-label", "Percorsi tra le PWA dell’Ottocento");
    var title = document.createElement("strong");
    title.textContent = "Percorsi collegati";
    panel.appendChild(title);

    var returnUrl = getReturnUrl();
    if (returnUrl) {
      var back = document.createElement("a");
      back.className = "ottocento-bridge-return";
      back.href = returnUrl;
      back.textContent = "← Torna al percorso precedente";
      panel.appendChild(back);
    }

    var ids = ["manuale"].concat(config.related[appId] || []);
    var seen = {};
    ids.forEach(function (id) {
      if (id === appId || seen[id]) return;
      seen[id] = true;
      var app = appById(config, id);
      if (!app) return;
      panel.appendChild(makeLink({ path: app.path, label: app.label }, "hub", "ottocento-bridge-hub-link"));
    });
    details.appendChild(panel);
    document.body.appendChild(details);
  }

  function ruleMatches(rule, appId, page) {
    if (!rule.source || rule.source.app !== appId) return false;
    if (!rule.source.page) return true;
    return rule.source.page.replace(/^\.\//, "").toLowerCase() === page.replace(/^\.\//, "").toLowerCase();
  }

  function renderContextual(config, appId) {
    var app = appById(config, appId);
    if (!app) return;
    var page = pageForApp(app);
    (config.bridges || []).filter(function (rule) { return ruleMatches(rule, appId, page); }).forEach(function (rule) {
      var target;
      try { target = document.querySelector(rule.source.selector); } catch (error) { return; }
      if (!target || document.querySelector('[data-ottocento-rule="' + rule.id + '"]')) return;
      var aside = document.createElement("aside");
      aside.className = "ottocento-context";
      aside.dataset.ottocentoRule = rule.id;
      aside.dataset.app = appId;
      aside.setAttribute("aria-labelledby", rule.id + "-title");
      var eyebrow = document.createElement("span");
      eyebrow.className = "ottocento-context-label";
      eyebrow.textContent = rule.kindLabel || "Percorso collegato";
      var heading = document.createElement("h3");
      heading.id = rule.id + "-title";
      heading.textContent = rule.title;
      var description = document.createElement("p");
      description.textContent = rule.description;
      var links = document.createElement("div");
      links.className = "ottocento-context-links";
      (rule.destinations || []).forEach(function (destination) { links.appendChild(makeLink(destination, rule.id)); });
      aside.appendChild(eyebrow);
      aside.appendChild(heading);
      aside.appendChild(description);
      aside.appendChild(links);
      if (rule.source.position === "append") target.appendChild(aside);
      else target.insertAdjacentElement("afterend", aside);
    });
  }

  function init(config) {
    var appId = detectApp(config);
    if (!appId) return;
    window.OttocentoPwaBridge = { app: appId, version: config.version, root: literatureRoot.href };
    document.documentElement.dataset.ottocentoApp = appId;
    ensureHeadingIds();
    enhanceAuthoredLinks();
    renderContextual(config, appId);
    renderHub(config, appId);
    revealManualHash(appId);
    if (appId !== "manuale") revealHashTarget();
  }

  loadStyle();
  fetch(configUrl.href, { cache: "reload" })
    .then(function (response) { if (!response.ok) throw new Error("Registro non disponibile"); return response.json(); })
    .then(init)
    .catch(function () { init(fallback); });
})();
