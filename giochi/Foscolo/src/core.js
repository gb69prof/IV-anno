import { levels } from "./content.js";
export const KEY = "foscolo-soglie-v2";
export const defaults = {
  audio: false,
  touch: "auto",
  quality: "auto",
  sensitivity: 1,
  reducedMotion: false,
};
export function fresh() {
  return {
    version: 2,
    stage: 0,
    solved: {},
    completed: [],
    settings: { ...defaults },
  };
}
export function restore(raw) {
  const state = fresh();
  try {
    const saved = JSON.parse(raw);
    if (saved?.version !== 2) return state;
    for (const level of levels) {
      const ids = new Set(level.nodes.map((n) => n.id));
      state.solved[level.id] = Array.isArray(saved.solved?.[level.id])
        ? [...new Set(saved.solved[level.id].filter((x) => ids.has(x)))]
        : [];
    }
    for (const level of levels) {
      if (
        saved.completed?.includes(level.id) &&
        state.solved[level.id].length === level.nodes.length
      )
        state.completed.push(level.id);
      else break;
    }
    state.stage = Number.isInteger(saved.stage)
      ? Math.max(
          0,
          Math.min(saved.stage, state.completed.length, levels.length - 1),
        )
      : 0;
    const s = saved.settings || {};
    state.settings = {
      audio: s.audio === true,
      touch: ["auto", "on", "off"].includes(s.touch) ? s.touch : "auto",
      quality: ["auto", "high", "low"].includes(s.quality) ? s.quality : "auto",
      sensitivity: Number.isFinite(s.sensitivity)
        ? Math.max(0.4, Math.min(2, s.sensitivity))
        : 1,
      reducedMotion: s.reducedMotion === true,
    };
  } catch {}
  return state;
}
export function solved(state, index = state.stage) {
  return state.solved[levels[index].id] || [];
}
export function canVisit(state, index) {
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < levels.length &&
    index <= state.completed.length
  );
}
export function canSolve(state, nodeId) {
  const ns = levels[state.stage].nodes;
  const index = ns.findIndex((n) => n.id === nodeId);
  return (
    index >= 0 &&
    (state.stage !== 7 ||
      ns.slice(0, index).every((n) => solved(state).includes(n.id)))
  );
}
export function answerNode(state, nodeId, choice) {
  const level = levels[state.stage],
    n = level.nodes.find((n) => n.id === nodeId);
  if (!n || !canSolve(state, nodeId) || choice !== n.correct) return false;
  state.solved[level.id] = [...new Set([...solved(state), nodeId])];
  return true;
}
export function finishLevel(state, choice) {
  const level = levels[state.stage];
  if (solved(state).length !== level.nodes.length || choice !== level.answer)
    return false;
  if (!state.completed.includes(level.id)) state.completed.push(level.id);
  return true;
}
export function nextTarget(state) {
  return (
    levels[state.stage].nodes.find((n) => !solved(state).includes(n.id)) || {
      id: "gate",
      title: state.stage === 7 ? "La quiete della sera" : "La prossima soglia",
      x: 0,
      z: -24,
    }
  );
}
export function radial(x, y, dead = 0.14) {
  const mag = Math.hypot(x, y);
  if (mag <= dead) return { x: 0, y: 0 };
  const scale = Math.min(1, (mag - dead) / (1 - dead)) / mag;
  return { x: x * scale, y: y * scale };
}
export function movePosition(
  position,
  input,
  yaw,
  dt,
  obstacles = [],
  speed = 5,
) {
  const len = Math.max(1, Math.hypot(input.x, input.y));
  const x = input.x / len,
    y = input.y / len;
  const dx =
    (Math.cos(yaw) * x + Math.sin(yaw) * y) *
    speed *
    Math.min(0.05, Math.max(0, dt));
  const dz =
    (-Math.sin(yaw) * x + Math.cos(yaw) * y) *
    speed *
    Math.min(0.05, Math.max(0, dt));
  const free = (xx, zz) =>
    Math.abs(xx) < 23 &&
    zz < 21 &&
    zz > -30 &&
    !obstacles.some((o) => Math.hypot(xx - o.x, zz - o.z) < o.r + 0.42);
  let nx = position.x,
    nz = position.z;
  if (free(nx + dx, nz)) nx += dx;
  if (free(nx, nz + dz)) nz += dz;
  return { x: nx, z: nz };
}
