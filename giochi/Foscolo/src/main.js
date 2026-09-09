import { levels, poem } from "./content.js";
import {
  KEY,
  fresh,
  restore,
  solved,
  canVisit,
  canSolve,
  answerNode,
  finishLevel,
  nextTarget,
  radial,
  movePosition,
} from "./core.js";
import { World } from "./scene.js";
const $ = (id) => document.getElementById(id);
let storageAvailable = true,
  state;
try {
  state = restore(localStorage.getItem(KEY));
} catch {
  state = fresh();
  storageAvailable = false;
}
let world,
  started = false,
  position = { x: 0, z: 17 },
  yaw = 0,
  pitch = -0.035,
  near = null,
  panelMode = "",
  lastTime = 0,
  toastTimer,
  changing = false,
  padName = "",
  lastPadButtons = [],
  lastNav = 0,
  frameCount = 0,
  lastPaint = 0;
const keys = new Set();
const pointers = { move: null, look: null };
let stick = { x: 0, y: 0 },
  moveOrigin = null,
  lookLast = null,
  touchVisible = false,
  previousFocus = null;
const labels = new Map();
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    if (storageAvailable)
      toast(
        "Le impostazioni del browser impediscono il salvataggio. La partita resta aperta.",
      );
    storageAvailable = false;
  }
}
function esc(text) {
  return String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function toast(message) {
  $("toast").textContent = message;
  $("toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").hidden = true), 4000);
}
class Ambience {
  constructor() {
    this.ctx = null;
    this.nodes = [];
  }
  start() {
    if (!state.settings.audio) return;
    try {
      if (!this.ctx) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return;
        this.ctx = new C();
        this.gain = this.ctx.createGain();
        this.gain.gain.value = 0.03;
        this.gain.connect(this.ctx.destination);
        for (const freq of [110, 164.81, 220.12]) {
          const o = this.ctx.createOscillator();
          o.type = "sine";
          o.frequency.value = freq;
          o.connect(this.gain);
          o.start();
          this.nodes.push(o);
        }
      }
      this.ctx.resume().catch(() => {});
    } catch {}
  }
  pause() {
    this.ctx?.suspend().catch(() => {});
  }
  chime() {
    if (!state.settings.audio || !this.ctx) return;
    this.start();
    for (let i = 0; i < 3; i++) {
      const o = this.ctx.createOscillator(),
        g = this.ctx.createGain(),
        t = this.ctx.currentTime + i * 0.09;
      o.frequency.value = [440, 554.37, 659.25][i];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.08, t + 0.025);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(t);
      o.stop(t + 0.85);
    }
  }
}
const sound = new Ambience();
function isPaused() {
  return !started || $("panel").open || changing || document.hidden;
}
function clearInput() {
  keys.clear();
  stick = { x: 0, y: 0 };
  pointers.move = pointers.look = null;
  moveOrigin = lookLast = null;
  $("move-knob").style.transform = "";
}
function setControls() {
  touchVisible =
    state.settings.touch === "on" ||
    (state.settings.touch === "auto" &&
      (matchMedia("(any-pointer:coarse)").matches ||
        navigator.maxTouchPoints > 0));
  document.body.classList.toggle("touch", touchVisible);
  $("touch").hidden = !started || !touchVisible;
  $("desktop-help").hidden = !started || touchVisible;
  $("crosshair").hidden = !started;
}
function refresh() {
  const l = levels[state.stage],
    s = solved(state);
  $("chapter-number").textContent = String(state.stage + 1).padStart(2, "0");
  $("chapter-tag").textContent = l.tag;
  $("chapter-title").textContent = l.title;
  $("quest-title").textContent =
    s.length === l.nodes.length
      ? state.stage === 7
        ? "Raggiungi la quiete"
        : "Apri la prossima soglia"
      : l.mission;
  $("quest-hint").textContent =
    s.length === l.nodes.length
      ? "Il portale è acceso. Raggiungilo in fondo al sentiero."
      : l.hint;
  $("quest-count").textContent = `${s.length} / ${l.nodes.length}`;
  $("quest-fill").style.width = `${(s.length / l.nodes.length) * 100}%`;
  world?.setSolved(s);
  updateStartLabel();
}
function updateStartLabel() {
  if (world)
    $("start").textContent =
      state.completed.length === 8
        ? "Ritorna al viaggio"
        : state.stage > 0 || Object.values(state.solved).some((a) => a.length)
          ? "Riprendi il viaggio  →"
          : "Inizia il viaggio  →";
}
function createLabels() {
  labels.clear();
  $("world-labels").replaceChildren();
  for (const n of [
    ...levels[state.stage].nodes,
    {
      id: "gate",
      title: state.stage === 7 ? "La quiete" : "La soglia",
      x: 0,
      z: -24,
    },
  ]) {
    const el = document.createElement("div");
    el.className = "world-label";
    el.innerHTML = `<span>${esc(n.title)}</span><i>◇</i>`;
    $("world-labels").append(el);
    labels.set(n.id, { el, node: n });
  }
}
function panel(kicker, title, html, mode = "read") {
  clearInput();
  if (document.pointerLockElement) document.exitPointerLock();
  sound.pause();
  previousFocus = document.activeElement;
  panelMode = mode;
  $("panel-kicker").textContent = kicker;
  $("panel-title").textContent = title;
  $("panel-body").innerHTML = html;
  if (!$("panel").open) $("panel").showModal();
  $("panel").scrollTop = 0;
  const focus = $("panel-body").querySelector(
    "button:not(:disabled),select,input,a",
  );
  setTimeout(() => focus?.focus(), 30);
}
function closePanel() {
  if (!$("panel").open) return;
  $("panel").close();
  panelMode = "";
  clearInput();
  if (started) sound.start();
  if (previousFocus?.isConnected) previousFocus.focus();
}
function actions(buttons) {
  return `<div class="panel-actions">${buttons.map(([id, text, primary]) => `<button id="${id}" class="${primary ? "primary" : "secondary"}">${text}</button>`).join("")}</div>`;
}
function source(level) {
  return `<p class="source">Percorso ispirato alle <a href="${level.source}" target="_blank" rel="noopener">lezioni di GB Prof ↗</a>. Le azioni nello spazio sono metafore didattiche.</p>`;
}
function intro() {
  const l = levels[state.stage];
  panel(
    `LIVELLO ${String(state.stage + 1).padStart(2, "0")} DI 08 · ${l.place}`,
    l.title,
    `<p>${esc(l.intro)}</p>${state.stage === 0 ? "<p><strong>Come si gioca</strong><br>Raggiungi i simboli dorati e scegli come usarli. Con il mouse trascina per guardarti intorno. Su touch, muoviti col joystick a sinistra e guarda trascinando a destra. Con il controller usa le due levette e premi A per interagire.</p>" : ""}${actions([["enter-level", "Esplora il livello →", true]])}`,
    "intro",
  );
  $("enter-level").onclick = closePanel;
}
async function visit(index, showIntro = true) {
  if (!canVisit(state, index) || changing) return false;
  closePanel();
  changing = true;
  clearInput();
  state.stage = index;
  save();
  $("transition-number").textContent =
    `LIVELLO ${String(index + 1).padStart(2, "0")} / 08`;
  $("transition-title").textContent = levels[index].title;
  $("transition-line").textContent = levels[index].line;
  $("transition").hidden = false;
  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r)),
  );
  world.build(levels[index], solved(state));
  position = { x: 0, z: 17 };
  yaw = 0;
  pitch = -0.035;
  createLabels();
  refresh();
  setTimeout(
    () => {
      $("transition").hidden = true;
      changing = false;
      if (showIntro) intro();
    },
    state.settings.reducedMotion ? 50 : 1450,
  );
  return true;
}
function map() {
  panel(
    "IL TUO PERCORSO",
    "Otto soglie. Un viaggio.",
    `<p>Ogni soglia si apre dopo aver compreso quella precedente. Puoi tornare nei livelli già raggiunti.</p><div class="level-list">${levels
      .map((l, i) => {
        const ok = canVisit(state, i),
          done = state.completed.includes(l.id);
        return `<button class="level-item ${state.stage === i ? "current" : ""}" data-level="${i}" ${!ok ? "disabled" : ""}><span class="num">${String(i + 1).padStart(2, "0")}</span><span><strong>${esc(l.title)}</strong><small>${esc(l.place)}</small></span><span class="state">${done ? "✓" : ok ? "→" : "○"}</span></button>`;
      })
      .join("")}</div>`,
    "map",
  );
  document.querySelectorAll("[data-level]").forEach(
    (b) =>
      (b.onclick = () => {
        if (!started) {
          startGame(Number(b.dataset.level));
        } else visit(Number(b.dataset.level));
      }),
  );
}
function journal() {
  const entries = [];
  for (const l of levels) {
    const ids = state.solved[l.id] || [];
    for (const n of l.nodes)
      if (ids.includes(n.id))
        entries.push(
          `<section class="journal-entry"><p class="eyebrow">${esc(l.title)}</p><h3>${esc(n.title)}</h3><p>${esc(n.text)} ${esc(n.why)}</p></section>`,
        );
    if (state.completed.includes(l.id))
      entries.push(
        `<section class="journal-entry"><h3>La chiave · ${esc(l.title)}</h3><p>${esc(l.summary)}</p></section>`,
      );
  }
  panel(
    "IL TACCUINO DEL VIANDANTE",
    "Ciò che resta.",
    entries.length
      ? `<p>${entries.filter((x) => !x.includes("La chiave")).length} frammenti raccolti. La memoria del viaggio si conserva su questo dispositivo.</p>${entries.join("")}`
      : "<p>Qui troverai i frammenti che avrai compreso durante il viaggio. Avvicinati a un simbolo dorato per cominciare.</p>",
    "journal",
  );
}
function settings() {
  panel(
    "PRENDITI IL TUO TEMPO",
    "Il viaggio è in pausa.",
    `
 <div class="setting"><label for="setting-audio">Suono ambientale<small>Toni leggeri durante l’esplorazione</small></label><input id="setting-audio" type="checkbox" ${state.settings.audio ? "checked" : ""}></div>
 <div class="setting"><label for="setting-touch">Comandi sullo schermo<small>Joystick e pulsante di azione</small></label><select id="setting-touch"><option value="auto">Automatici</option><option value="on">Sempre visibili</option><option value="off">Nascosti</option></select></div>
 <div class="setting"><label for="setting-quality">Qualità del paesaggio<small>Leggera: meno erba e niente ombre dinamiche</small></label><select id="setting-quality"><option value="auto">Automatica</option><option value="high">Alta</option><option value="low">Leggera</option></select></div>
 <div class="setting"><label for="setting-sensitivity">Velocità dello sguardo</label><input id="setting-sensitivity" aria-label="Velocità dello sguardo" type="range" min="0.4" max="2" step="0.1" value="${state.settings.sensitivity}"></div>
 <div class="setting"><label for="setting-motion">Riduci le animazioni<small>Elimina oscillazioni e movimenti decorativi</small></label><input id="setting-motion" type="checkbox" ${state.settings.reducedMotion ? "checked" : ""}></div>
 <p class="source">${padName ? `Controller collegato: ${esc(padName)}. ` : ""}WASD / frecce: movimento · trascina col mouse: sguardo · E: esamina · J: taccuino · M: livelli · Esc: pausa. Controller: levette, A, B e Start; croce direzionale per i menu.</p>
 ${actions([
   ["resume", "Riprendi il viaggio", true],
   ["reset-position", "Torna al sentiero"],
   ["restart", "Nuova partita"],
 ])}`,
    "pause",
  );
  $("setting-touch").value = state.settings.touch;
  $("setting-quality").value = state.settings.quality;
  $("setting-audio").onchange = (e) => {
    state.settings.audio = e.target.checked;
    save();
  };
  $("setting-motion").onchange = (e) => {
    state.settings.reducedMotion = e.target.checked;
    save();
  };
  $("setting-sensitivity").oninput = (e) => {
    state.settings.sensitivity = Number(e.target.value);
    save();
  };
  $("setting-touch").onchange = (e) => {
    state.settings.touch = e.target.value;
    setControls();
    save();
  };
  $("setting-quality").onchange = (e) => {
    state.settings.quality = e.target.value;
    world.applyQuality();
    world.build(levels[state.stage], solved(state));
    save();
  };
  $("resume").onclick = closePanel;
  $("reset-position").onclick = () => {
    position = { x: 0, z: 17 };
    yaw = 0;
    pitch = 0;
    closePanel();
    toast("Sei tornato all’inizio del sentiero. I progressi sono conservati.");
  };
  $("restart").onclick = () => {
    panel(
      "NUOVO VIAGGIO",
      "Ripartire dalla prima soglia?",
      `<p>I progressi di questa partita saranno cancellati su questo dispositivo.</p>${actions(
        [
          ["cancel-reset", "Conserva la partita", true],
          ["confirm-reset", "Ricomincia"],
        ],
      )}`,
      "reset",
    );
    $("cancel-reset").onclick = settings;
    $("confirm-reset").onclick = () => {
      const prefs = state.settings;
      state = fresh();
      state.settings = prefs;
      save();
      visit(0);
    };
  };
}
function quizHTML(question, choices) {
  return `<p class="question">${esc(question)}</p><div class="choices">${choices.map((text, i) => `<button class="choice" data-answer="${i}"><span class="choice-number">${i + 1}</span><span>${esc(text)}</span></button>`).join("")}</div><div id="feedback" aria-live="polite"></div><div id="answer-actions"></div>`;
}
function wireChoices(correct, onSuccess, why) {
  let locked = false;
  document.querySelectorAll("[data-answer]").forEach(
    (button) =>
      (button.onclick = () => {
        if (locked) return;
        const value = Number(button.dataset.answer);
        if (value !== correct) {
          button.classList.add("wrong");
          $("feedback").className = "feedback error";
          $("feedback").textContent =
            "Questa scelta non apre il sigillo. Rileggi l’indizio e prova un’altra interpretazione.";
          button.setAttribute(
            "aria-label",
            button.textContent + " — da rivedere",
          );
          return;
        }
        locked = true;
        button.classList.add("correct");
        document
          .querySelectorAll("[data-answer]")
          .forEach((b) => (b.disabled = true));
        onSuccess(value);
        $("feedback").className = "feedback success";
        $("feedback").textContent = why;
        $("answer-actions").innerHTML = actions([
          ["keep-going", "Custodisci e continua →", true],
        ]);
        $("keep-going").onclick = () => {
          closePanel();
          sound.chime();
        };
        $("keep-going").focus();
      }),
  );
}
function openNode(n) {
  if (!canSolve(state, n.id)) {
    toast(
      "Segui prima l’immagine precedente del sonetto. La traccia dorata indica la strada.",
    );
    return;
  }
  const l = levels[state.stage],
    done = solved(state).includes(n.id);
  panel(
    `${l.title.toUpperCase()} · FRAMMENTO`,
    n.title,
    `<p>${esc(n.text)}</p>${n.quote ? `<blockquote>${esc(n.quote).replaceAll("\n", "<br>")}</blockquote>` : ""}${done ? `<div class="feedback success">${esc(n.why)}</div>${actions([["read-close", "Torna al paesaggio", true]])}` : quizHTML(n.question, n.choices)}${source(l)}`,
    "node",
  );
  if (done) {
    $("read-close").onclick = closePanel;
    return;
  }
  wireChoices(
    n.correct,
    (value) => {
      answerNode(state, n.id, value);
      save();
      refresh();
    },
    n.why,
  );
}
function gate() {
  const l = levels[state.stage];
  if (solved(state).length < l.nodes.length) {
    toast(
      `Mancano ${l.nodes.length - solved(state).length} frammenti per aprire la soglia.`,
    );
    return;
  }
  if (state.completed.includes(l.id)) {
    if (state.stage === 7) ending();
    else visit(state.stage + 1);
    return;
  }
  panel(
    state.stage === 7 ? "L’ULTIMA SOGLIA" : "LA CHIAVE DEL LIVELLO",
    state.stage === 7 ? "Dove conduce la sera?" : "Dai senso al cammino.",
    `<p>${esc(l.line)}</p>${quizHTML(l.gate, l.options)}`,
    "gate",
  );
  let complete = false;
  document.querySelectorAll("[data-answer]").forEach(
    (button) =>
      (button.onclick = () => {
        if (complete) return;
        const choice = Number(button.dataset.answer);
        if (!finishLevel(state, choice)) {
          button.classList.add("wrong");
          $("feedback").className = "feedback error";
          $("feedback").textContent =
            "Ripensa ai frammenti raccolti. La chiave deve tenerli insieme.";
          return;
        }
        complete = true;
        button.classList.add("correct");
        save();
        refresh();
        document
          .querySelectorAll("[data-answer]")
          .forEach((b) => (b.disabled = true));
        $("feedback").className = "feedback success";
        $("feedback").textContent = l.summary;
        $("answer-actions").innerHTML = actions([
          [
            "next-level",
            state.stage === 7
              ? "Ascolta la quiete →"
              : "Attraversa la soglia →",
            true,
          ],
        ]);
        $("next-level").onclick = () => {
          sound.chime();
          if (state.stage === 7) ending();
          else visit(state.stage + 1);
        };
        $("next-level").focus();
      }),
  );
}
function ending() {
  panel(
    "08 / 08 · IL VIAGGIO È COMPIUTO",
    "E intanto, la sera.",
    `<span class="ending-mark" aria-hidden="true">✧</span><p>Hai attraversato un mondo che cambia, le ferite della storia e le risposte della poesia. Nella sera queste voci trovano una forma di quiete.</p><div class="poem">${esc(poem)}</div><p>La pace è momentanea. La poesia ha dato una forma al conflitto, lasciandoci parole da custodire.</p>${actions(
      [
        ["stay", "Resta nella sera", true],
        ["ending-journal", "Rileggi il taccuino"],
        ["ending-map", "Rivisita i livelli"],
      ],
    )}${source(levels[7])}`,
    "ending",
  );
  $("stay").onclick = closePanel;
  $("ending-journal").onclick = journal;
  $("ending-map").onclick = map;
}
function interact() {
  if (isPaused()) return;
  if (!near) {
    toast(
      "Avvicinati a un simbolo dorato. La traccia indica il prossimo frammento.",
    );
    return;
  }
  if (near.id === "gate") gate();
  else openNode(near);
}
function updateNearby() {
  near = null;
  let best = 3.7;
  for (const n of [
    ...levels[state.stage].nodes,
    {
      id: "gate",
      title: state.stage === 7 ? "Concludi il viaggio" : "Apri la soglia",
      x: 0,
      z: -24,
    },
  ]) {
    const dist = Math.hypot(position.x - n.x, position.z - n.z);
    if (dist < best) {
      best = dist;
      near = n;
    }
  }
  $("interact").hidden = !started || !near || isPaused();
  $("touch-action").disabled = !near;
  if (near)
    $("interact").querySelector("span").textContent =
      near.id === "gate"
        ? near.title
        : solved(state).includes(near.id)
          ? "Rileggi · " + near.title
          : near.title;
  const target = nextTarget(state);
  $("target-name").textContent = target.title;
  $("target-distance").textContent =
    `${Math.round(Math.hypot(position.x - target.x, position.z - target.z))} m · segui il sentiero`;
  const angle =
    Math.atan2(-(target.x - position.x), -(target.z - position.z)) - yaw;
  $("target-direction").style.transform =
    `rotate(${(-angle * 180) / Math.PI}deg)`;
  const heading = ((((-yaw * 180) / Math.PI) % 360) + 360) % 360;
  $("compass-strip").textContent = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"][
    Math.round(heading / 45) % 8
  ];
  for (const [id, { el, node }] of labels) {
    const d = Math.hypot(position.x - node.x, position.z - node.z),
      p = world.project(node.x, node.z, id === "gate" ? 5 : 3.7);
    const hidden =
      !p.visible ||
      p.x < 85 ||
      p.x > innerWidth - 85 ||
      (p.x < 330 && p.y < 250) ||
      d > 34 ||
      d < 1.8 ||
      !started ||
      isPaused();
    el.hidden = hidden;
    if (hidden) continue;
    el.style.left = `${p.x}px`;
    el.style.top = `${p.y}px`;
    el.classList.toggle("done", solved(state).includes(id));
    el.querySelector("i").textContent = solved(state).includes(id) ? "✓" : "◇";
  }
}
function activateFocusedControl() {
  const el = document.activeElement;
  if (el?.tagName === "SELECT") {
    el.selectedIndex = (el.selectedIndex + 1) % el.options.length;
    el.dispatchEvent(new Event("change", { bubbles: true }));
  } else if (el?.type === "range") {
    const next = Number(el.value) + Number(el.step || 0.1);
    el.value = String(next > Number(el.max) ? Number(el.min) : next);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  } else el?.click();
}
function pollPad(dt) {
  let pads = [];
  try {
    pads = navigator.getGamepads?.() || [];
  } catch {}
  const pad = [...pads].find((p) => p?.connected);
  if (!pad) {
    lastPadButtons = [];
    padName = "";
    return { x: 0, y: 0, run: false };
  }
  padName = pad.id;
  const pressed = pad.buttons.map((b) => b.pressed),
    edge = (i) => pressed[i] && !lastPadButtons[i];
  const a = pad.axes || [];
  if ($("panel").open || !started) {
    const now = performance.now();
    let nav = 0;
    if (
      edge(13) ||
      edge(15) ||
      ((a[1] > 0.65 || a[0] > 0.65) && now - lastNav > 230)
    )
      nav = 1;
    if (
      edge(12) ||
      edge(14) ||
      ((a[1] < -0.65 || a[0] < -0.65) && now - lastNav > 230)
    )
      nav = -1;
    if (nav) {
      const container = $("panel").open ? $("panel") : $("title-screen");
      const focus = [
        ...container.querySelectorAll("button:not(:disabled),a,input,select"),
      ].filter((b) => b.offsetParent !== null);
      let i = focus.indexOf(document.activeElement);
      if (focus.length) {
        const next = focus[(i + nav + focus.length) % focus.length];
        next.focus();
        next.scrollIntoView({ block: "nearest" });
      }
      lastNav = now;
    }
    if (edge(0)) activateFocusedControl();
    if (edge(1) && $("panel").open) closePanel();
    if (edge(9) && $("panel").open) closePanel();
  } else {
    if (edge(0)) interact();
    if (edge(1) || edge(9)) settings();
    if (edge(3)) journal();
    if (edge(2)) map();
    if (!isPaused()) {
      const look = radial(a[2] || 0, a[3] || 0, 0.12);
      yaw -= look.x * dt * 2.1 * state.settings.sensitivity;
      pitch = Math.max(
        -1.2,
        Math.min(1.1, pitch - look.y * dt * 1.6 * state.settings.sensitivity),
      );
    }
  }
  lastPadButtons = pressed;
  const move = radial(a[0] || 0, a[1] || 0);
  return { ...move, run: pressed[10] || pressed[7] };
}
function frame(ms) {
  const dt = Math.min(0.05, (ms - lastTime) / 1000 || 0.016);
  lastTime = ms;
  const pad = pollPad(dt);
  const paused = isPaused();
  let moving = false;
  if (!paused) {
    const input = {
      x:
        (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) -
        (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0) +
        stick.x +
        pad.x,
      y:
        (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0) -
        (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) +
        stick.y +
        pad.y,
    };
    moving = Math.hypot(input.x, input.y) > 0.05;
    position = movePosition(
      position,
      input,
      yaw,
      dt,
      world.obstacles,
      keys.has("ShiftLeft") || pad.run ? 7.2 : 5.2,
    );
  }
  if (!paused || changing || ms - lastPaint > 180) {
    world?.render(position, yaw, pitch, dt, moving, paused);
    lastPaint = ms;
  }
  if (started && ++frameCount % 3 === 0) updateNearby();
  requestAnimationFrame(frame);
}
async function startGame(index = state.stage) {
  if (!world || changing) return;
  started = true;
  $("title-screen").hidden = true;
  $("hud").hidden = false;
  $("travel-hint").hidden = false;
  setControls();
  sound.start();
  closePanel();
  await visit(index);
  if (!storageAvailable)
    toast("Il salvataggio locale non è disponibile in questo browser.");
}
$("start").onclick = () => startGame();
$("start-map").onclick = map;
$("map-button").onclick = map;
$("journal-button").onclick = journal;
$("pause-button").onclick = settings;
$("panel-close").onclick = closePanel;
$("interact").onclick = interact;
$("touch-action").onclick = interact;
$("panel").addEventListener("cancel", (e) => {
  e.preventDefault();
  closePanel();
});
$("lock-mouse").onclick = async () => {
  try {
    await $("world").requestPointerLock();
  } catch {
    toast("Puoi continuare trascinando il mouse sul paesaggio.");
  }
};
addEventListener("keydown", (e) => {
  if ($("panel").open) {
    if (e.code === "Escape") {
      e.preventDefault();
      closePanel();
    }
    return;
  }
  if (!started) return;
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
      e.code,
    )
  )
    e.preventDefault();
  keys.add(e.code);
  if (e.repeat) return;
  if (e.code === "KeyE" || e.code === "Space") interact();
  if (e.code === "KeyJ") journal();
  if (e.code === "KeyM") map();
  if (e.code === "Escape") settings();
});
addEventListener("keyup", (e) => keys.delete(e.code));
addEventListener("blur", () => {
  clearInput();
  if (started && !$("panel").open && !changing) settings();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInput();
    sound.pause();
    if (started && !$("panel").open && !changing) settings();
  }
});
document.addEventListener("pointerlockchange", () => {
  if (!document.pointerLockElement) clearInput();
});
const movePad = $("move-pad");
movePad.addEventListener("pointerdown", (e) => {
  if (isPaused() || pointers.move !== null) return;
  e.preventDefault();
  pointers.move = e.pointerId;
  const r = movePad.getBoundingClientRect();
  moveOrigin = {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
    r: r.width * 0.32,
  };
  try {
    movePad.setPointerCapture(e.pointerId);
  } catch {}
  updateStick(e);
});
function updateStick(e) {
  if (e.pointerId !== pointers.move || !moveOrigin) return;
  const dx = (e.clientX - moveOrigin.x) / moveOrigin.r,
    dy = (e.clientY - moveOrigin.y) / moveOrigin.r;
  stick = radial(dx, dy, 0.08);
  $("move-knob").style.transform =
    `translate(${stick.x * moveOrigin.r}px,${stick.y * moveOrigin.r}px)`;
}
movePad.addEventListener("pointermove", updateStick);
function releaseMove(e) {
  if (e.pointerId !== pointers.move) return;
  pointers.move = null;
  moveOrigin = null;
  stick = { x: 0, y: 0 };
  $("move-knob").style.transform = "";
}
for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
  movePad.addEventListener(event, releaseMove);
function startLook(e) {
  if (
    isPaused() ||
    pointers.look !== null ||
    e.button > 0 ||
    document.pointerLockElement
  )
    return;
  e.preventDefault();
  pointers.look = e.pointerId;
  lookLast = { x: e.clientX, y: e.clientY };
  try {
    e.currentTarget.setPointerCapture(e.pointerId);
  } catch {}
}
function updateLook(e) {
  if (isPaused() || (document.pointerLockElement && e.type === "pointermove"))
    return;
  let dx, dy;
  if (document.pointerLockElement) {
    dx = e.movementX;
    dy = e.movementY;
  } else {
    if (e.pointerId !== pointers.look || !lookLast) return;
    dx = e.clientX - lookLast.x;
    dy = e.clientY - lookLast.y;
    lookLast = { x: e.clientX, y: e.clientY };
  }
  const sens = 0.003 * state.settings.sensitivity;
  yaw -= dx * sens;
  pitch = Math.max(-1.2, Math.min(1.1, pitch - dy * sens));
}
function endLook(e) {
  if (e.pointerId === pointers.look) {
    pointers.look = null;
    lookLast = null;
  }
}
for (const el of [$("world"), $("look-pad")]) {
  el.addEventListener("pointerdown", startLook);
  el.addEventListener("pointermove", updateLook);
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    el.addEventListener(event, endLook);
  el.addEventListener("contextmenu", (e) => e.preventDefault());
}
document.addEventListener("mousemove", (e) => {
  if (document.pointerLockElement) updateLook(e);
});
addEventListener("resize", () => {
  world?.resize();
  clearInput();
  setControls();
});
addEventListener("gamepaddisconnected", () => {
  lastPadButtons = [];
  clearInput();
  toast("Controller scollegato. Puoi usare gli altri comandi.");
});
$("world").addEventListener("webglcontextlost", (e) => {
  e.preventDefault();
  clearInput();
  if (started)
    panel(
      "PAUSA",
      "Il paesaggio si è fermato.",
      `<p>Il browser ha sospeso la grafica. I frammenti raccolti sono salvati.</p>${actions([["reload-game", "Ricarica e riprendi", true]])}`,
      "error",
    );
  $("reload-game")?.addEventListener("click", () => location.reload());
});
async function boot() {
  try {
    world = new World($("world"), state.settings);
    await world.load();
    world.build(levels[state.stage], solved(state));
    refresh();
    $("start").disabled = false;
    $("start").focus();
    $("load-status").textContent =
      "Otto livelli · salvataggio automatico su questo dispositivo";
    requestAnimationFrame(frame);
    if ("serviceWorker" in navigator && location.protocol !== "file:")
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    // Local development diagnostics are available only on loopback hosts.
    if (["localhost", "127.0.0.1"].includes(location.hostname))
      window.__foscolo = {
        getState: () => JSON.parse(JSON.stringify(state)),
        getPosition: () => ({ ...position, yaw, pitch }),
        getWorld: () => world.info(),
        getObstacles: () => world.obstacles.map((o) => ({ ...o })),
        ready: () => !changing && !$("panel").open,
        goTo: (x, z) => {
          if (
            !Number.isFinite(x) ||
            !Number.isFinite(z) ||
            Math.abs(x) > 22 ||
            z > 20 ||
            z < -29
          )
            throw Error("Coordinate non valide");
          position = { x, z };
        },
        reset: () => {
          state = fresh();
          save();
          return visit(0);
        },
      };
  } catch (error) {
    console.error(error);
    $("load-status").textContent =
      "La grafica 3D non si è avviata. Controlla che WebGL sia disponibile nel browser e ricarica.";
    $("start").textContent = "Riprova";
    $("start").disabled = false;
    $("start").onclick = () => location.reload();
  }
}
boot();
