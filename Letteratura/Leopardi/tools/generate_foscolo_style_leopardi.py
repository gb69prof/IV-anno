from pathlib import Path
import html
import json
import re
import shutil


ROOT = Path(__file__).resolve().parents[1]
REFERENCE = ROOT / ".foscolo_reference" / "Foscolo"


def load_data():
    raw = (ROOT / "app-data.js").read_text(encoding="utf-8")
    prefix = "window.LEOPARDI_DATA = "
    if not raw.startswith(prefix):
        raise RuntimeError("app-data.js non contiene LEOPARDI_DATA")
    return json.loads(raw[len(prefix):].strip().rstrip(";"))


def e(value):
    return html.escape(str(value), quote=True)


def slug(value):
    value = value.lower()
    value = value.replace("à", "a").replace("è", "e").replace("é", "e")
    value = value.replace("ì", "i").replace("ò", "o").replace("ù", "u")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def ensure_dirs():
    for path in [
        ROOT / "assets" / "css",
        ROOT / "assets" / "js",
        ROOT / "assets" / "immagini",
        ROOT / "assets" / "mappe",
        ROOT / "pagine",
    ]:
        path.mkdir(parents=True, exist_ok=True)


def copy_assets(data):
    shutil.copy2(ROOT / "immagini" / "index.png", ROOT / "assets" / "immagini" / "index.png")
    for icon in ["icon-192.png", "icon-512.png"]:
        src = ROOT / "immagini" / icon
        if src.exists():
            shutil.copy2(src, ROOT / "assets" / "immagini" / icon)
    for item in data["items"]:
        src = ROOT / item["map"]
        shutil.copy2(src, ROOT / "assets" / "mappe" / src.name)


def write_style():
    style = (REFERENCE / "assets" / "css" / "style.css").read_text(encoding="utf-8")
    style = style.replace("Ugo Foscolo", "Giacomo Leopardi")
    style += """

.section-index {
  padding: clamp(1.5rem, 4vw, 3rem) 0;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
}

.section-card {
  min-height: 210px;
  display: grid;
  gap: 0.65rem;
  align-content: start;
  padding: 1.1rem;
  color: var(--ink);
  background:
    linear-gradient(rgba(255, 246, 223, 0.92), rgba(243, 228, 199, 0.98)),
    radial-gradient(circle at 20% 20%, rgba(201, 145, 69, 0.18), transparent 35%);
  border: 1px solid var(--gold);
  border-radius: 0.45rem;
  text-decoration: none;
  box-shadow: var(--shadow);
}

.section-card:hover {
  transform: translateY(-2px);
}

.section-card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: contain;
  background: #fff8e8;
  border: 1px solid var(--line);
}

.section-card strong {
  font-size: 1.35rem;
  line-height: 1.1;
}

.section-card span {
  line-height: 1.35;
}

.lesson-video-card {
  display: grid;
  gap: 0.75rem;
  padding: 0.8rem;
  border: 1px solid var(--gold);
  border-radius: 0.45rem;
  background: var(--paper);
  box-shadow: var(--shadow);
}

.lesson-video-card h2 {
  margin: 0;
  color: var(--ink);
  font-size: 1.25rem;
  font-weight: 500;
}

.lesson-video-card video,
.lesson-video-card iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  background: #000;
}

.video-link-row {
  margin: 0;
}

.notes-actions {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.notes-actions .media-button {
  width: 100%;
}

.final-shell {
  display: block;
  padding: clamp(1.5rem, 4vw, 3rem) 0;
}

@media (max-width: 620px) {
  .notes-actions {
    grid-template-columns: 1fr;
  }
}
"""
    (ROOT / "assets" / "css" / "style.css").write_text(style, encoding="utf-8")


def youtube_embed(url):
    if not url:
        return ""
    match = re.search(r"(?:shorts/|watch\?v=|youtu\.be/|embed/)([A-Za-z0-9_-]+)", url)
    return f"https://www.youtube-nocookie.com/embed/{match.group(1)}" if match else url


def root_prefix(page_kind):
    return "../" if page_kind == "lesson" else "./"


def nav(root="./", current=""):
    links = [
        ("Home", f"{root}index.html"),
        ("Lezioni", f"{root}lezioni.html"),
        ("Percorso testi", f"{root}percorso-testi.html"),
        ("Approfondimenti", f"{root}approfondimenti.html"),
        ("Mappe", f"{root}mappe.html"),
        ("Video", f"{root}video.html"),
        ("Test finale", f"{root}test-finale.html"),
    ]
    return "\n".join(
        f'<a href="{href}"{" aria-current=\"page\"" if href.endswith(current) else ""}>{e(label)}</a>'
        for label, href in links
    )


def header(root="./", current=""):
    return f"""
    <header class="site-header">
      <a class="brand" href="{root}index.html" aria-label="Torna alla homepage">
        <span class="brand-mark">GL</span>
        <span>Giacomo Leopardi</span>
      </a>
      <nav class="top-nav" aria-label="Navigazione principale">
        {nav(root, current)}
      </nav>
    </header>
"""


def footer(*parts):
    items = parts or ("Lezione", "Mappe fullscreen", "PWA didattica")
    return "\n".join(["    <footer class=\"site-footer\">"] + [f"      <span>{e(part)}</span>" for part in items] + ["    </footer>"])


def page_shell(title, body, root="./", page="page", lesson_id="", current="", footer_parts=()):
    return f"""<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#061d2f">
    <meta name="description" content="PWA didattica su Giacomo Leopardi: lezioni, testi, approfondimenti, mappe, video, test e appunti.">
    <title>{e(title)} | Giacomo Leopardi</title>
    <link rel="manifest" href="{root}manifest.json">
    <link rel="stylesheet" href="{root}assets/css/style.css">
  </head>
  <body data-root="{root}" data-page="{page}"{f' data-lesson="{e(lesson_id)}"' if lesson_id else ""}>
{header(root, current)}
{body}
{footer(*footer_parts)}
    <script src="{root}assets/js/app.js" defer></script>
  </body>
</html>
"""


def render_paragraph_parts(parts):
    html_parts = []
    for index, part in enumerate(parts):
        clean = part.strip()
        if len(clean) <= 90 and not clean.endswith(".") and not clean.endswith(","):
            html_parts.append(f"<h2>{e(clean)}</h2>")
        elif len(clean) <= 160 and (clean.endswith(":") or clean.lower().startswith(("atto ", "schema ", "vocabolario"))):
            html_parts.append(f'<aside class="lesson-note"><p>{e(clean)}</p></aside>')
        else:
            html_parts.append(f"<p>{e(clean)}</p>")
    return "\n".join(html_parts)


def infinito_poem_html(lines):
    verses = "\n".join(f'    <p style="margin: 0;">{e(line)}</p>' for line in lines)
    return f"""<section aria-label="Testo poetico: L'Infinito" style="margin: 1.5rem 0 2rem; padding: 1.15rem 1.25rem; border-left: 4px solid var(--gold); background: rgba(255, 255, 255, 0.38);">
  <div style="max-width: 42rem; font-size: 1.24rem; line-height: 1.9;">
{verses}
  </div>
</section>"""


def paragraphs_to_html(content, item_id=""):
    parts = [part.strip() for part in re.split(r"\n{2,}", content) if part.strip()]
    if item_id == "infinito" and len(parts) > 16:
        return "\n".join([infinito_poem_html(parts[1:16]), render_paragraph_parts(parts[16:])])
    return render_paragraph_parts(parts[1:])


def video_html(video, root):
    online = video.get("online", "")
    if not online:
        return ""
    embed = youtube_embed(online)
    pieces = [f'<section class="lesson-video-card"><h2>{e(video["title"])}</h2>']
    if embed:
        pieces.append(f'<iframe src="{e(embed)}" title="{e(video["title"])}" allowfullscreen></iframe>')
    pieces.append("</section>")
    return "\n".join(pieces)


def lesson_sidebar(item):
    root = "../"
    map_name = Path(item["map"]).name
    map_src = f"{root}assets/mappe/{e(map_name)}"
    videos = "\n".join(video_html(video, root) for video in item["videos"])
    return f"""
      <aside class="lesson-sidebar" aria-label="Materiali collegati">
        <figure class="lesson-map-card">
          <button class="map-button" type="button" data-open-map data-map-src="{map_src}" data-map-title="{e(item["title"])}">
            <img src="{map_src}" alt="Mappa concettuale: {e(item["title"])}">
          </button>
          <figcaption>{e(item["title"])}</figcaption>
        </figure>
        {videos}
      </aside>
"""


def map_modal():
    return """
    <dialog class="map-modal" data-map-modal>
      <div class="modal-inner">
        <div class="modal-bar">
          <strong data-map-title>Mappa</strong>
          <button class="modal-close" type="button" data-close-modal>Chiudi</button>
        </div>
        <img class="modal-image" src="" alt="">
      </div>
    </dialog>
"""


def write_lesson(item):
    root = "../"
    article = f"""
      <article class="lesson-article">
        <p class="lesson-kicker">{e(item["kicker"])}</p>
        <h1>{e(item["title"])}</h1>
        <p class="lesson-subtitle">{e(item["source"])}</p>
        {paragraphs_to_html(item["content"], item["id"])}
      </article>
"""
    body = f"""
    <main class="lesson-shell">
{article}
{lesson_sidebar(item)}
    </main>
{map_modal()}
"""
    path = ROOT / "pagine" / f"{item['id']}.html"
    path.write_text(page_shell(item["title"], body, root=root, page="lesson", lesson_id=item["id"], current=f"pagine/{item['id']}.html"), encoding="utf-8")


def item_link(item, root="./"):
    return f"{root}pagine/{item['id']}.html"


def write_index(data):
    def hot(label, href, cls):
        return f'      <a class="hotspot {cls}" href="{href}"><span class="sr-only">{e(label)}</span></a>'

    ids = {item["id"]: item for item in data["items"]}
    body = f"""    <main class="index-replica" aria-label="Homepage Giacomo Leopardi">
      <img class="index-replica-image" src="assets/immagini/index.png" alt="Homepage illustrata della PWA didattica su Giacomo Leopardi">

{hot("Home", "index.html", "hs-home")}
{hot("Lezioni", "lezioni.html", "hs-lezioni")}
{hot("Approfondimenti", "approfondimenti.html", "hs-approfondimenti")}
{hot("Mappe", "mappe.html", "hs-mappe-nav")}
{hot("Biografia", item_link(ids["fratture"]), "hs-biografia")}
{hot("Inizia il percorso", item_link(ids["filosofia-base"]), "hs-start")}

{hot("Filosofia base", item_link(ids["filosofia-base"]), "hs-card-1")}
{hot("Le fratture", item_link(ids["fratture"]), "hs-card-2")}
{hot("Immagine del mondo", item_link(ids["immagine-mondo"]), "hs-card-3")}
{hot("Poetica", item_link(ids["poetica"]), "hs-card-4")}
{hot("Scritti e opere", item_link(ids["scritti"]), "hs-card-5")}
{hot("Conclusione", "test-finale.html", "hs-card-6")}

{hot("Recanati", item_link(ids["fratture"]), "hs-zante")}
{hot("L'Infinito", item_link(ids["infinito"]), "hs-napoleone")}
{hot("Natura e Islandese", item_link(ids["natura-islandese"]), "hs-ortis")}
{hot("Saffo e Bruto", item_link(ids["bruto-saffo"]), "hs-sepolcri")}
{hot("La Ginestra", item_link(ids["ginestra"]), "hs-grazie")}
{hot("Illusioni", item_link(ids["scritti"]), "hs-illusioni")}

{hot("Mappe e schemi", "mappe.html", "hs-mappe-panel")}
{hot("Timeline interattiva", item_link(ids["fratture"]), "hs-timeline-panel")}
{hot("Quiz finale", "test-finale.html", "hs-quiz-panel")}
    </main>
"""
    (ROOT / "index.html").write_text(f"""<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#061d2f">
    <meta name="description" content="PWA didattica su Giacomo Leopardi: lezioni, testi, approfondimenti, mappe, video, test e appunti.">
    <title>Giacomo Leopardi | PWA didattica</title>
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="assets/css/style.css">
  </head>
  <body data-root="./" data-page="home">
{body}
    <script src="assets/js/app.js" defer></script>
  </body>
</html>
""", encoding="utf-8")


def write_section_page(data, section_id, filename, title, subtitle):
    items = [item for item in data["items"] if item["section"] == section_id]
    cards = "\n".join(
        f"""
          <a class="section-card" href="{item_link(item)}">
            <img src="assets/mappe/{e(Path(item["map"]).name)}" alt="Mappa: {e(item["title"])}">
            <strong>{e(item["title"])}</strong>
            <span>{e(item["kicker"])} · {sum(1 for video in item["videos"] if video.get("online"))} video online · test incluso</span>
          </a>
"""
        for item in items
    )
    body = f"""
    <main class="section-index">
      <section class="map-index">
        <h1>{e(title)}</h1>
        <p class="lesson-subtitle">{e(subtitle)}</p>
        <div class="section-grid">
{cards}
        </div>
      </section>
    </main>
"""
    (ROOT / filename).write_text(page_shell(title, body, current=filename, footer_parts=("Percorso guidato", "Mappe e video", "Test e appunti")), encoding="utf-8")


def write_mappe(data):
    seen = {}
    for item in data["items"]:
        seen[Path(item["map"]).name] = item["title"]
    tiles = "\n".join(
        f"""
          <article class="map-tile">
            <button type="button" data-open-map data-map-src="assets/mappe/{e(name)}" data-map-title="{e(title)}">
              <img src="assets/mappe/{e(name)}" alt="Mappa concettuale: {e(title)}">
            </button>
            <strong>{e(title)}</strong>
          </article>
"""
        for name, title in seen.items()
    )
    body = f"""
    <main class="map-page">
      <section class="map-index">
        <h1>Mappe concettuali</h1>
        <p class="lesson-subtitle">Tutte le mappe sono responsive, non deformate e apribili in fullscreen.</p>
        <div class="map-grid">
{tiles}
        </div>
      </section>
    </main>
{map_modal()}
"""
    (ROOT / "mappe.html").write_text(page_shell("Mappe", body, page="mappe", current="mappe.html", footer_parts=("Mappe responsive", "Fullscreen", "Studio guidato")), encoding="utf-8")


def write_video(data):
    cards = []
    for item in data["items"]:
        for video in item["videos"]:
            if not video.get("online"):
                continue
            embed = youtube_embed(video.get("online", ""))
            media = ""
            if embed:
                media += f'<iframe class="video-frame" src="{e(embed)}" title="{e(video["title"])}" allowfullscreen></iframe>'
            cards.append(f"""
          <article class="video-card">
            {media}
            <strong>{e(video["title"])}</strong>
            <p><a class="button-link" href="{item_link(item)}">Apri la parte</a></p>
          </article>
""")
    body = f"""
    <main class="video-page">
      <section class="video-index">
        <h1>Video collegati</h1>
        <p class="lesson-subtitle">I video sono associati alle sezioni corrispondenti e restano disponibili anche dentro ogni pagina.</p>
        <div class="video-grid">
{''.join(cards)}
        </div>
      </section>
    </main>
"""
    (ROOT / "video.html").write_text(page_shell("Video", body, page="video", current="video.html", footer_parts=("Video associati", "Solo online", "Materiale integrato")), encoding="utf-8")


def write_final_quiz(data):
    body = """
    <main class="final-shell">
      <article class="lesson-article">
        <p class="lesson-kicker">Verifica conclusiva</p>
        <h1>Test finale sull'intero percorso</h1>
        <p class="lesson-subtitle">Raccoglie filosofia, poetica, testi, approfondimenti e interpretazione complessiva.</p>
      </article>
    </main>
"""
    (ROOT / "test-finale.html").write_text(page_shell("Test finale", body, page="lesson", lesson_id="test-finale", current="test-finale.html", footer_parts=("Report finale", "Recupero mirato", "Percorso completo")), encoding="utf-8")


def js_data(data):
    study = {}
    for item in data["items"]:
        study[item["id"]] = {
            "vocabulary": [[q["options"][q["answer"]], q["recovery"]] for q in item["quiz"]],
            "quiz": item["quiz"],
        }
    study["test-finale"] = {
        "vocabulary": [["Percorso complessivo", "Il test finale riprende i nuclei principali del lavoro su Leopardi."]],
        "quiz": data["finalQuiz"],
    }
    return study


def write_app_js(data):
    study_json = json.dumps(js_data(data), ensure_ascii=False, indent=2)
    js = f"""const LEOPARDI_STUDY_DATA = {study_json};

function getRoot() {{
  return document.body.dataset.root || "./";
}}

function setupServiceWorker() {{
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {{
    navigator.serviceWorker.register(`${{getRoot()}}service-worker.js`).catch(() => {{}});
  }});
}}

function setupActiveNavigation() {{
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".top-nav a").forEach((link) => {{
    const href = link.getAttribute("href") || "";
    if (href.endsWith(current)) link.setAttribute("aria-current", "page");
  }});
}}

function setupMapModal() {{
  const modal = document.querySelector("[data-map-modal]");
  if (!modal) return;
  const image = modal.querySelector("img");
  const title = modal.querySelector("[data-map-title]");
  modal.querySelectorAll("[data-close-modal]").forEach((button) => {{
    button.addEventListener("click", () => modal.close ? modal.close() : modal.removeAttribute("open"));
  }});
  document.querySelectorAll("[data-open-map]").forEach((button) => {{
    button.addEventListener("click", () => {{
      image.src = button.dataset.mapSrc;
      image.alt = button.dataset.mapTitle || "Mappa concettuale";
      title.textContent = button.dataset.mapTitle || "Mappa";
      if (typeof modal.showModal === "function") modal.showModal();
      else modal.setAttribute("open", "");
    }});
  }});
  modal.addEventListener("click", (event) => {{
    if (event.target === modal) modal.close ? modal.close() : modal.removeAttribute("open");
  }});
}}

function escapeHtml(value) {{
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}}

function cleanNoteText(text) {{
  return String(text)
    .replace(/\\r/g, "")
    .split("\\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\\n\\n");
}}

async function copyText(text) {{
  if (!text) return false;
  try {{
    await navigator.clipboard.writeText(text);
    return true;
  }} catch {{
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }}
}}

function setupLessonStudyTools() {{
  const lessonId = document.body.dataset.lesson;
  const data = LEOPARDI_STUDY_DATA[lessonId];
  const article = document.querySelector(".lesson-article");
  if (!data || !article) return;

  const vocabulary = data.vocabulary
    .map(([term, definition]) => `
      <article class="vocab-card">
        <strong>${{escapeHtml(term)}}</strong>
        <p>${{escapeHtml(definition)}}</p>
      </article>`)
    .join("");

  const questions = data.quiz
    .map((item, index) => `
      <fieldset class="quiz-question" data-question-index="${{index}}">
        <legend>${{escapeHtml(item.question)}}</legend>
        ${{item.options
          .map((option, optionIndex) => `
            <label>
              <input type="radio" name="quiz-${{lessonId}}-${{index}}" value="${{optionIndex}}">
              <span>${{escapeHtml(option)}}</span>
            </label>`)
          .join("")}}
      </fieldset>`)
    .join("");

  article.insertAdjacentHTML("beforeend", `
    <section class="study-panel" id="vocabolario-essenziale">
      <div class="study-heading">
        <p>Ripasso</p>
        <h2>Vocabolario essenziale</h2>
      </div>
      <div class="vocab-grid">${{vocabulary}}</div>
    </section>

    <section class="study-panel" id="test-lezione">
      <div class="study-heading">
        <p>Autoverifica</p>
        <h2>${{lessonId === "test-finale" ? "Test finale" : "Piccolo test di comprensione"}}</h2>
      </div>
      <form class="lesson-quiz" data-lesson-quiz>
        ${{questions}}
        <button class="button-link" type="submit">Correggi il test</button>
      </form>
      <div class="quiz-report" data-quiz-report hidden></div>
    </section>
  `);

  const form = article.querySelector("[data-lesson-quiz]");
  const report = article.querySelector("[data-quiz-report]");
  form.addEventListener("submit", (event) => {{
    event.preventDefault();
    let correct = 0;
    const rows = data.quiz.map((item, index) => {{
      const chosen = form.querySelector(`input[name="quiz-${{lessonId}}-${{index}}"]:checked`);
      const chosenIndex = chosen ? Number(chosen.value) : -1;
      const isCorrect = chosenIndex === item.answer;
      if (isCorrect) correct += 1;
      const selectedText = chosenIndex >= 0 ? item.options[chosenIndex] : "Nessuna risposta";
      return `
        <article class="report-row ${{isCorrect ? "is-correct" : "is-wrong"}}">
          <strong>${{isCorrect ? "Risposta corretta" : "Da recuperare"}}</strong>
          <p><b>Domanda:</b> ${{escapeHtml(item.question)}}</p>
          <p><b>Risposta data:</b> ${{escapeHtml(selectedText)}}</p>
          ${{isCorrect
            ? "<p>Hai riconosciuto il nodo centrale della lezione.</p>"
            : `<p><b>Mini lezione di recupero:</b> ${{escapeHtml(item.recovery)}}</p>`}}
        </article>`;
    }});
    report.hidden = false;
    report.innerHTML = `
      <h3>Report finale</h3>
      <p class="score-line">Punteggio: ${{correct}} / ${{data.quiz.length}}</p>
      ${{rows.join("")}}
    `;
    report.scrollIntoView({{ behavior: "smooth", block: "start" }});
  }});
}}

function setupNotesTool() {{
  const lessonId = document.body.dataset.lesson;
  const sidebar = document.querySelector(".lesson-sidebar") || document.querySelector(".final-shell");
  const article = document.querySelector(".lesson-article");
  if (!lessonId || !sidebar || !article) return;

  const key = `leopardi-notes-${{lessonId}}`;
  const saved = localStorage.getItem(key) || "";
  sidebar.insertAdjacentHTML("beforeend", `
    <section class="notes-tool" aria-label="Appunti della lezione">
      <h2>Appunti</h2>
      <p>Seleziona il testo nella lezione: puoi evidenziarlo, copiarlo o inserirlo negli appunti.</p>
      <div class="notes-actions">
        <button class="media-button" type="button" data-highlight-selection>Evidenzia</button>
        <button class="media-button" type="button" data-copy-selection>Copia selezione</button>
        <button class="media-button" type="button" data-clear-highlights>Cancella evidenziatore</button>
        <button class="media-button" type="button" data-copy-highlights>Inserisci negli appunti</button>
        <button class="media-button" type="button" data-copy-notes>Copia appunti</button>
        <button class="media-button" type="button" data-save-notes>Salva TXT</button>
      </div>
      <textarea data-notes-area spellcheck="true" aria-label="Appunti salvati">${{escapeHtml(saved)}}</textarea>
      <button class="notes-clear" type="button" data-clear-notes>Svuota appunti</button>
      <p class="notes-status" data-notes-status aria-live="polite"></p>
    </section>
  `);

  const area = sidebar.querySelector("[data-notes-area]");
  const status = sidebar.querySelector("[data-notes-status]");
  const setStatus = (text) => status.textContent = text;

  area.addEventListener("input", () => localStorage.setItem(key, area.value));

  const selectedRangeInLesson = () => {{
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
    const range = selection.getRangeAt(0);
    const ancestor = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement
      : range.commonAncestorContainer;
    return article.contains(ancestor) ? range : null;
  }};

  sidebar.querySelector("[data-highlight-selection]").addEventListener("click", () => {{
    const range = selectedRangeInLesson();
    if (!range || !cleanNoteText(range.toString())) {{
      setStatus("Seleziona prima una frase o un paragrafo della lezione.");
      return;
    }}
    const highlight = document.createElement("mark");
    highlight.className = "student-highlight";
    highlight.dataset.noteHighlight = "true";
    highlight.append(range.extractContents());
    range.insertNode(highlight);
    window.getSelection().removeAllRanges();
    setStatus("Testo evidenziato. Puoi continuare a evidenziare o inserirlo negli appunti.");
  }});

  sidebar.querySelector("[data-copy-selection]").addEventListener("click", async () => {{
    const range = selectedRangeInLesson();
    const text = range ? cleanNoteText(range.toString()) : "";
    if (!text) {{
      setStatus("Seleziona prima il testo da copiare.");
      return;
    }}
    await copyText(text);
    setStatus("Testo selezionato copiato.");
  }});

  sidebar.querySelector("[data-clear-highlights]").addEventListener("click", () => {{
    const highlights = [...article.querySelectorAll("[data-note-highlight]")];
    if (!highlights.length) {{
      setStatus("Non ci sono evidenziature da cancellare.");
      return;
    }}
    highlights.forEach((highlight) => highlight.replaceWith(...highlight.childNodes));
    setStatus("Evidenziatore cancellato dalla lezione.");
  }});

  sidebar.querySelector("[data-copy-highlights]").addEventListener("click", () => {{
    const highlightedText = [...article.querySelectorAll("[data-note-highlight]")]
      .map((highlight) => cleanNoteText(highlight.textContent || ""))
      .filter(Boolean)
      .join("\\n\\n");
    if (!highlightedText) {{
      setStatus("Evidenzia prima almeno una parte della lezione.");
      return;
    }}
    area.value = cleanNoteText([area.value, highlightedText].filter(Boolean).join("\\n\\n"));
    localStorage.setItem(key, area.value);
    setStatus("Evidenziature inserite negli appunti.");
  }});

  sidebar.querySelector("[data-copy-notes]").addEventListener("click", async () => {{
    const clean = cleanNoteText(area.value);
    if (!clean) {{
      setStatus("Non ci sono appunti da copiare.");
      return;
    }}
    await copyText(clean);
    setStatus("Appunti copiati. Ora puoi incollarli dove vuoi.");
  }});

  sidebar.querySelector("[data-save-notes]").addEventListener("click", () => {{
    const clean = cleanNoteText(area.value);
    if (!clean) {{
      setStatus("Non ci sono appunti da salvare.");
      return;
    }}
    area.value = clean;
    localStorage.setItem(key, clean);
    const blob = new Blob([clean], {{ type: "text/plain;charset=utf-8" }});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `appunti-leopardi-${{lessonId}}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("Appunti salvati in formato TXT.");
  }});

  sidebar.querySelector("[data-clear-notes]").addEventListener("click", () => {{
    area.value = "";
    localStorage.removeItem(key);
    setStatus("Appunti svuotati.");
  }});
}}

setupServiceWorker();
setupActiveNavigation();
setupMapModal();
setupLessonStudyTools();
setupNotesTool();
"""
    (ROOT / "assets" / "js" / "app.js").write_text(js, encoding="utf-8")


def write_manifest():
    manifest = {
        "name": "Leopardi - percorso didattico",
        "short_name": "Leopardi",
        "description": "PWA didattica su Giacomo Leopardi con lezioni, testi, approfondimenti, mappe, video, test e appunti.",
        "start_url": "./index.html",
        "scope": "./",
        "display": "standalone",
        "background_color": "#061d2f",
        "theme_color": "#061d2f",
        "icons": [
            {"src": "assets/immagini/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
            {"src": "assets/immagini/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"},
        ],
    }
    (ROOT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


def write_service_worker(data):
    pages = [
        "./",
        "./index.html",
        "./lezioni.html",
        "./percorso-testi.html",
        "./approfondimenti.html",
        "./mappe.html",
        "./video.html",
        "./test-finale.html",
        "./manifest.json",
        "./assets/css/style.css",
        "./assets/js/app.js",
        "./assets/immagini/index.png",
        "./assets/immagini/icon-192.png",
        "./assets/immagini/icon-512.png",
    ]
    pages += [f"./pagine/{item['id']}.html" for item in data["items"]]
    pages += sorted({f"./assets/mappe/{Path(item['map']).name}" for item in data["items"]})
    js_assets = json.dumps(pages, ensure_ascii=False, indent=2)
    sw = f"""const CACHE_NAME = "leopardi-foscolo-style-v4";

const LOCAL_ASSETS = {js_assets};

self.addEventListener("install", (event) => {{
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(LOCAL_ASSETS)));
  self.skipWaiting();
}});

self.addEventListener("activate", (event) => {{
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
}});

self.addEventListener("fetch", (event) => {{
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.toLowerCase().includes("/video/")) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {{
      if (cached) return cached;
      return fetch(event.request).then((response) => {{
        const copy = response.clone();
        if (response.ok && url.origin === self.location.origin) {{
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }}
        return response;
      }});
    }})
  );
}});
"""
    (ROOT / "service-worker.js").write_text(sw, encoding="utf-8")


def main():
    data = load_data()
    ensure_dirs()
    copy_assets(data)
    write_style()
    write_app_js(data)
    write_index(data)
    write_section_page(data, "lezioni", "lezioni.html", "Lezioni", "Le basi filosofiche, biografiche, poetiche e il percorso degli scritti.")
    write_section_page(data, "percorso-testi", "percorso-testi.html", "Percorso testi", "Lettura guidata delle opere: dall'Infinito alla Ginestra.")
    write_section_page(data, "approfondimenti", "approfondimenti.html", "Approfondimenti", "Nodi interpretativi e materiali di consolidamento.")
    for item in data["items"]:
        write_lesson(item)
    write_mappe(data)
    write_video(data)
    write_final_quiz(data)
    write_manifest()
    write_service_worker(data)
    print("PWA Leopardi generata con impostazioni Foscolo")


if __name__ == "__main__":
    main()
