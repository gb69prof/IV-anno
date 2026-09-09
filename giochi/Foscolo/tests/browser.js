import { levels } from "../src/content.js";
const log = document.querySelector("#log"),
  frame = document.querySelector("#app");
let count = 0;
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const output = (text) => {
  log.textContent += text + "\n";
};
const assert = (check, text) => {
  if (!check) throw Error(text);
  output(`✓ ${++count}. ${text}`);
};
async function until(predicate, label, timeout = 15000) {
  const start = performance.now();
  while (performance.now() - start < timeout) {
    if (predicate()) return;
    await pause(60);
  }
  throw Error("Tempo scaduto: " + label);
}
function click(w, id) {
  const el = w.document.querySelector(id);
  if (!el) throw Error("Elemento assente " + id);
  el.click();
}
document.querySelector("#run").onclick = async () => {
  if (!["localhost", "127.0.0.1"].includes(location.hostname)) {
    log.textContent = "Disponibile soltanto in locale.";
    return;
  }
  document.querySelector("#run").disabled = true;
  log.textContent = "";
  count = 0;
  try {
    const w = frame.contentWindow;
    await until(() => w.__foscolo, "motore pronto");
    const api = w.__foscolo;
    const errorList = [];
    w.addEventListener("error", (e) => errorList.push(e.message));
    click(w, "#start");
    await until(
      () =>
        w.document.querySelector("#panel").open &&
        w.document.querySelector("#enter-level"),
      "introduzione",
    );
    click(w, "#enter-level");
    await api.reset();
    await until(
      () =>
        w.document.querySelector("#panel").open &&
        w.document.querySelector("#enter-level"),
      "ripartenza",
    );
    click(w, "#enter-level");
    await until(() => api.ready(), "livello attivo");
    const p0 = api.getPosition();
    w.dispatchEvent(new w.KeyboardEvent("keydown", { code: "KeyW" }));
    await pause(350);
    w.dispatchEvent(new w.KeyboardEvent("keyup", { code: "KeyW" }));
    const p1 = api.getPosition();
    assert(p1.z < p0.z - 0.4, "W muove realmente il giocatore");
    click(w, "#pause-button");
    const pp = api.getPosition();
    w.dispatchEvent(new w.KeyboardEvent("keydown", { code: "KeyW" }));
    await pause(200);
    assert(
      api.getPosition().z === pp.z,
      "La pausa arresta il movimento e cancella gli input",
    );
    click(w, "#resume");
    const move = w.document.querySelector("#move-pad"),
      look = w.document.querySelector("#look-pad");
    const rect = move.getBoundingClientRect(),
      x = rect.left + rect.width / 2,
      y = rect.top + rect.height / 2;
    const pointer = (el, type, id, xx, yy) =>
      el.dispatchEvent(
        new w.PointerEvent(type, {
          bubbles: true,
          pointerId: id,
          pointerType: "touch",
          isPrimary: id === 11,
          clientX: xx,
          clientY: yy,
          button: 0,
        }),
      );
    const tp = api.getPosition();
    pointer(move, "pointerdown", 11, x, y - 30);
    pointer(look, "pointerdown", 12, 500, 300);
    pointer(look, "pointermove", 12, 530, 306);
    await pause(300);
    const tq = api.getPosition();
    assert(
      Math.hypot(tq.x - tp.x, tq.z - tp.z) > 0.2 &&
        Math.abs(tq.yaw - tp.yaw) > 0.03,
      "Due puntatori touch muovono e ruotano insieme",
    );
    pointer(move, "pointercancel", 11, x, y);
    pointer(look, "pointerup", 12, 530, 306);
    const stopped = api.getPosition();
    await pause(180);
    assert(
      Math.hypot(
        api.getPosition().x - stopped.x,
        api.getPosition().z - stopped.z,
      ) < 0.001,
      "Il rilascio o la cancellazione touch arresta il joystick",
    );
    const buttons = Array.from({ length: 17 }, () => ({
      pressed: false,
      value: 0,
      touched: false,
    }));
    const pad = {
      connected: true,
      id: "Controller simulato di verifica",
      index: 0,
      mapping: "standard",
      axes: [0.5, -0.5, 0.5, 0],
      buttons,
    };
    const native = w.navigator.getGamepads;
    Object.defineProperty(w.navigator, "getGamepads", {
      configurable: true,
      value: () => [pad],
    });
    const gp = api.getPosition();
    await pause(300);
    const gq = api.getPosition();
    assert(
      Math.hypot(gq.x - gp.x, gq.z - gp.z) > 0.2 &&
        Math.abs(gq.yaw - gp.yaw) > 0.05,
      "Le due levette del controller simulato governano movimento e sguardo",
    );
    pad.axes = [0, 0, 0, 0];
    buttons[9].pressed = true;
    await until(
      () =>
        w.document.querySelector("#panel").open &&
        w.document.querySelector("#resume"),
      "Start apre pausa",
    );
    buttons[9].pressed = false;
    assert(
      w.document.querySelector("#panel").open,
      "Start del controller apre il menu",
    );
    click(w, "#resume");
    Object.defineProperty(w.navigator, "getGamepads", {
      configurable: true,
      value: native,
    });
    const totals = [];
    for (let i = 0; i < levels.length; i++) {
      const l = levels[i];
      assert(
        api.getState().stage === i,
        `Ordine del livello ${i + 1}: ${l.title}`,
      );
      const obstacles = api.getObstacles();
      // Grid connectivity checks the actual generated collision field.
      const free = (x, z) =>
        Math.abs(x) < 23 &&
        z < 21 &&
        z > -30 &&
        !obstacles.some((o) => Math.hypot(x - o.x, z - o.z) < o.r + 0.42);
      const queue = [[0, 17]],
        seen = new Set(["0,17"]);
      for (let k = 0; k < queue.length; k++) {
        const [xx, zz] = queue[k];
        for (const [dx, dz] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nx = xx + dx,
            nz = zz + dz,
            key = nx + "," + nz;
          if (!seen.has(key) && free(nx, nz)) {
            seen.add(key);
            queue.push([nx, nz]);
          }
        }
      }
      assert(
        [...l.nodes, { x: 0, z: -24 }].every((n) =>
          queue.some(([xx, zz]) => Math.hypot(xx - n.x, zz - n.z) < 3.5),
        ),
        `Tutti gli obiettivi del livello ${i + 1} sono raggiungibili`,
      );
      if (i === 7) {
        const last = l.nodes[2];
        api.goTo(last.x, last.z + 2.4);
        await pause(150);
        click(w, "#interact");
        assert(
          !w.document.querySelector("#panel").open,
          "Alla sera non consente di saltare le immagini precedenti",
        );
      }
      for (const n of l.nodes) {
        api.goTo(n.x, n.z + 2.4);
        await until(
          () =>
            !w.document.querySelector("#interact").hidden &&
            w.document
              .querySelector("#interact span")
              .textContent.includes(n.title),
          "interazione disponibile",
        );
        click(w, "#interact");
        await until(() => w.document.querySelector("[data-answer]"), "scelte");
        const before = (api.getState().solved[l.id] || []).length;
        click(w, `[data-answer="${(n.correct + 1) % 3}"]`);
        assert(
          (api.getState().solved[l.id] || []).length === before,
          `${n.id}: errore recuperabile senza sblocco`,
        );
        click(w, `[data-answer="${n.correct}"]`);
        assert(
          api.getState().solved[l.id].includes(n.id),
          `${n.id}: risposta e taccuino salvati`,
        );
        click(w, "#keep-going");
      }
      api.goTo(0, -21.5);
      await until(
        () =>
          !w.document.querySelector("#interact").hidden &&
          /soglia|Concludi/.test(
            w.document.querySelector("#interact span").textContent,
          ),
        "portale",
      );
      click(w, "#interact");
      await until(
        () => w.document.querySelector("[data-answer]"),
        "chiave finale",
      );
      click(w, `[data-answer="${l.answer}"]`);
      assert(
        api.getState().completed.includes(l.id),
        `Soglia ${i + 1} completata`,
      );
      totals.push(api.getWorld());
      click(w, "#next-level");
      if (i < 7) {
        await until(
          () =>
            w.document.querySelector("#panel").open &&
            w.document.querySelector("#enter-level"),
          "livello seguente",
        );
        click(w, "#enter-level");
        await until(() => api.ready(), "transizione conclusa");
      }
    }
    assert(
      w.document
        .querySelector(".poem")
        ?.textContent.includes("quello spirto guerrier"),
      "Il finale mostra tutto Alla sera",
    );
    assert(
      api.getState().completed.length === 8,
      "Tutti gli otto livelli completati",
    );
    assert(
      errorList.length === 0,
      "Nessun errore JavaScript durante la partita",
    );
    assert(
      Math.max(...totals.map((t) => t.textures)) -
        Math.min(...totals.map((t) => t.textures)) <=
        1,
      "I cambi di livello non accumulano texture nella memoria grafica",
    );
    output("Metriche rendering per livello: " + JSON.stringify(totals));
    const saved = JSON.parse(w.localStorage.getItem("foscolo-soglie-v2"));
    assert(
      saved.completed.length === 8 && saved.stage === 7,
      "Il salvataggio conserva conclusione e ultimo livello",
    );
    frame.src = "../?verifica=reload";
    await until(
      () =>
        frame.contentWindow.__foscolo &&
        frame.contentWindow.document
          .querySelector("#start")
          ?.textContent.includes("Ritorna"),
      "riapertura del salvataggio",
    );
    assert(
      frame.contentWindow.__foscolo.getState().completed.length === 8,
      "La riapertura ripristina la partita completata",
    );
    output(
      `ESITO: ${count} controlli superati. Controller e touch simulati; dispositivi fisici non provati.`,
    );
  } catch (e) {
    output("ERRORE: " + e.stack);
  } finally {
    document.querySelector("#run").disabled = false;
  }
};
