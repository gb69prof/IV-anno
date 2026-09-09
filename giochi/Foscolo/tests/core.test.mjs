import test from "node:test";
import assert from "node:assert/strict";
import { levels, poem } from "../src/content.js";
import {
  fresh,
  restore,
  solved,
  canVisit,
  canSolve,
  answerNode,
  finishLevel,
  radial,
  movePosition,
} from "../src/core.js";
test("eight levels in the requested order; Alla sera remains final", () => {
  assert.deepEqual(
    levels.map((l) => l.id),
    [
      "mondo",
      "fratture",
      "immagine",
      "poetica",
      "ortis",
      "grazie",
      "sepolcri",
      "sera",
    ],
  );
  assert.equal(poem.split("\n").filter(Boolean).length, 14);
});
test("complete journey: wrong choices never unlock, right choices save and unlock exactly one next level", () => {
  let s = fresh();
  for (let stage = 0; stage < levels.length; stage++) {
    const l = levels[stage];
    s.stage = stage;
    assert.equal(canVisit(s, stage), true);
    if (stage < 7) assert.equal(canVisit(s, stage + 1), false);
    assert.equal(finishLevel(s, l.answer), false);
    for (const n of l.nodes) {
      const before = solved(s).length;
      assert.equal(answerNode(s, n.id, (n.correct + 1) % 3), false);
      assert.equal(solved(s).length, before);
      assert.equal(answerNode(s, n.id, n.correct), true);
      assert.equal(answerNode(s, n.id, n.correct), true);
      assert.equal(solved(s).length, before + 1);
    }
    assert.equal(finishLevel(s, (l.answer + 1) % 3), false);
    assert.equal(finishLevel(s, l.answer), true);
    assert.equal(finishLevel(s, l.answer), true);
    assert.equal(s.completed.length, stage + 1);
    s = restore(JSON.stringify(s));
    assert.equal(s.completed.length, stage + 1);
  }
  assert.equal(s.completed.length, 8);
  assert.equal(canVisit(s, 8), false);
});
test("final sonnet must be followed in order", () => {
  const s = fresh();
  s.stage = 7;
  const ns = levels[7].nodes;
  assert.equal(canSolve(s, ns[1].id), false);
  assert.equal(answerNode(s, ns[2].id, ns[2].correct), false);
  assert.equal(answerNode(s, ns[0].id, ns[0].correct), true);
  assert.equal(canSolve(s, ns[1].id), true);
});
test("missing, old, malformed and incomplete saves recover without unlocking future levels", () => {
  for (const raw of [
    null,
    "{",
    "[]",
    "null",
    '{"version":1}',
    '{"version":2,"stage":99,"completed":["sera"],"solved":{"sera":["spirito"]}}',
  ]) {
    const s = restore(raw);
    assert.equal(s.stage, 0);
    assert.equal(canVisit(s, 1), false);
  }
  const s = restore(
    JSON.stringify({
      version: 2,
      settings: { sensitivity: 500, touch: "bad", quality: "bad" },
      solved: { mondo: ["fake", "ordine", "ordine"] },
    }),
  );
  assert.equal(s.settings.sensitivity, 2);
  assert.equal(s.settings.touch, "auto");
  assert.deepEqual(s.solved.mondo, ["ordine"]);
});
test("joystick dead zone and radial normalization eliminate drift and diagonal speed gain", () => {
  assert.deepEqual(radial(0.02, 0.03), { x: 0, y: 0 });
  assert.ok(Math.abs(Math.hypot(...Object.values(radial(1, 1))) - 1) < 1e-8);
  const p = { x: 0, z: 0 };
  const straight = movePosition(p, { x: 1, y: 0 }, 0, 0.05);
  const diagonal = movePosition(p, { x: 1, y: 1 }, 0, 0.05);
  assert.ok(
    Math.abs(
      Math.hypot(straight.x, straight.z) - Math.hypot(diagonal.x, diagonal.z),
    ) < 1e-8,
  );
});
test("movement uses camera orientation, stops at obstacles, and cannot leave the map", () => {
  assert.ok(movePosition({ x: 0, z: 0 }, { x: 0, y: -1 }, 0, 0.05).z < 0);
  assert.ok(
    movePosition({ x: 0, z: 0 }, { x: 0, y: -1 }, Math.PI / 2, 0.05).x < 0,
  );
  const p = movePosition({ x: 0, z: 0 }, { x: 1, y: 0 }, 0, 0.05, [
    { x: 0.6, z: 0, r: 0.3 },
  ]);
  assert.equal(p.x, 0);
  assert.equal(
    movePosition({ x: 22.99, z: 0 }, { x: 1, y: 0 }, 0, 0.05).x,
    22.99,
  );
});
test("each learning node and gate has valid distinct answer choices and a source", () => {
  for (const l of levels) {
    assert.match(l.source, /^https:\/\/gbprof.it\//);
    assert.equal(l.options.length, 3);
    assert.ok(l.answer >= 0 && l.answer < 3);
    assert.equal(new Set(l.nodes.map((n) => n.id)).size, l.nodes.length);
    for (const n of l.nodes) {
      assert.equal(new Set(n.choices).size, 3);
      assert.ok(n.correct >= 0 && n.correct < 3);
      assert.ok(n.text.length > 80);
      assert.ok(n.why.length > 30);
      assert.ok(Math.abs(n.x) < 22 && n.z > -23 && n.z < 19);
    }
  }
});
