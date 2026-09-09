import * as T from "../assets/three.module.js";
import { GLTFLoader } from "../assets/loaders/GLTFLoader.js";
import { mergeGeometries } from "../assets/utils/BufferGeometryUtils.js";
const palettes = {
  gold: {
    fog: 0xc7ad85,
    sky: 0xffd9a2,
    sun: 0xffe1a6,
    ground: 0x73815a,
    water: 0x477e85,
  },
  storm: {
    fog: 0x839398,
    sky: 0xb3bac3,
    sun: 0xd8c0a1,
    ground: 0x64745f,
    water: 0x365e70,
  },
  machine: {
    fog: 0x879b9f,
    sky: 0xc5d8d9,
    sun: 0xf4d1a1,
    ground: 0x62766a,
    water: 0x366478,
  },
  garden: {
    fog: 0xa6ae9c,
    sky: 0xe8d9bf,
    sun: 0xffe5b5,
    ground: 0x697f51,
    water: 0x568990,
  },
  ortis: {
    fog: 0xb19d8b,
    sky: 0xe4c69a,
    sun: 0xffd5a1,
    ground: 0x767258,
    water: 0x496a73,
  },
  graces: {
    fog: 0xb8c2ac,
    sky: 0xf6e8ca,
    sun: 0xffedd0,
    ground: 0x78925f,
    water: 0x72a5ab,
  },
  memory: {
    fog: 0x819296,
    sky: 0xd4c5b2,
    sun: 0xf3cb9a,
    ground: 0x586c59,
    water: 0x375766,
  },
  evening: {
    fog: 0x697687,
    sky: 0xc9a7a4,
    sun: 0xffb679,
    ground: 0x50635d,
    water: 0x3b5470,
  },
};
function rng(seed) {
  return () => {
    seed = (Math.imul(1664525, seed) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
}
let rand = rng(8827);
export function groundHeight(x, z) {
  const edge = Math.max(Math.abs(x) / 36, Math.abs(z + 3) / 44);
  return (
    0.3 * Math.sin(x * 0.12) * Math.cos(z * 0.13) +
    0.18 * Math.sin(z * 0.33 + x * 0.11) -
    Math.max(0, edge - 0.78) ** 2 * 40
  );
}
function makeTexture(type) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  const pixels = ctx.createImageData(256, 256);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const k = rand() * 32;
    const base = type === "stone" ? [172, 168, 147] : [115, 114, 84];
    pixels.data[i] = base[0] + k;
    pixels.data[i + 1] = base[1] + k;
    pixels.data[i + 2] = base[2] + k;
    pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  if (type === "stone") {
    for (let i = 0; i < 25; i++) {
      ctx.strokeStyle = `rgba(72,66,52,${0.03 + rand() * 0.09})`;
      ctx.lineWidth = 0.5 + rand() * 2;
      ctx.beginPath();
      let x = rand() * 256,
        y = rand() * 256;
      ctx.moveTo(x, y);
      for (let j = 0; j < 10; j++) {
        x += rand() * 45 - 22;
        y += rand() * 30;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  const tex = new T.CanvasTexture(c);
  tex.wrapS = tex.wrapT = T.RepeatWrapping;
  tex.repeat.set(type === "stone" ? 1 : 35, type === "stone" ? 1 : 35);
  tex.colorSpace = T.SRGBColorSpace;
  return tex;
}
export class World {
  constructor(canvas, settings) {
    this.canvas = canvas;
    this.settings = settings;
    this.renderer = new T.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.14;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.scene = new T.Scene();
    this.camera = new T.PerspectiveCamera(66, 1, 0.1, 380);
    this.camera.rotation.order = "YXZ";
    this.clock = 0;
    this.level = null;
    this.items = [];
    this.obstacles = [];
    this.disposables = new Set();
    this.loaded = false;
    this.texStone = makeTexture("stone");
    this.texEarth = makeTexture("earth");
    this.sharedTextures = [this.texStone, this.texEarth];
    this.materials = {
      stone: new T.MeshStandardMaterial({
        color: 0xd7cbb4,
        map: this.texStone,
        roughness: 0.94,
      }),
      darkstone: new T.MeshStandardMaterial({
        color: 0x7d8079,
        map: this.texStone,
        roughness: 1,
      }),
      gold: new T.MeshStandardMaterial({
        color: 0xc5a363,
        metalness: 0.72,
        roughness: 0.3,
      }),
      bronze: new T.MeshStandardMaterial({
        color: 0x88714c,
        metalness: 0.7,
        roughness: 0.48,
      }),
      wood: new T.MeshStandardMaterial({ color: 0x4d4032, roughness: 0.95 }),
      ink: new T.MeshStandardMaterial({ color: 0x433a34, roughness: 1 }),
      paper: new T.MeshStandardMaterial({ color: 0xecdbb5, roughness: 1 }),
      leaf: new T.MeshStandardMaterial({ color: 0x526d46, roughness: 1 }),
      glow: new T.MeshStandardMaterial({
        color: 0xf8d48c,
        emissive: 0xffbc56,
        emissiveIntensity: 0.5,
        roughness: 0.4,
      }),
    };
    this.applyQuality();
    this.resize();
  }
  async load() {
    const loader = new T.TextureLoader();
    const [sky, ground, normal, tree, grass, stone, stoneNormal] =
      await Promise.all([
        loader.loadAsync("assets/sky.webp"),
        loader.loadAsync("assets/ground-color.jpg"),
        loader.loadAsync("assets/ground-normal.jpg"),
        new GLTFLoader().loadAsync("assets/coastal-tree.glb"),
        new GLTFLoader().loadAsync("assets/grass.glb"),
        loader.loadAsync("assets/stone-color.jpg"),
        loader.loadAsync("assets/stone-normal.jpg"),
      ]);
    this.sky = sky;
    sky.colorSpace = T.SRGBColorSpace;
    this.texGround = ground;
    this.texNormal = normal;
    ground.colorSpace = stone.colorSpace = T.SRGBColorSpace;
    for (const t of [ground, normal]) {
      t.wrapS = t.wrapT = T.RepeatWrapping;
      t.repeat.set(9, 9);
      t.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    }
    this.sharedTextures.push(sky, ground, normal, stone, stoneNormal);
    for (const m of [this.materials.stone, this.materials.darkstone]) {
      m.map = stone;
      m.normalMap = stoneNormal;
      m.normalScale = new T.Vector2(0.5, 0.5);
    }
    this.materials.stone.color.set(0xf0ece3);
    this.grassTemplate = grass.scene;
    this.grassTemplate.updateMatrixWorld(true);
    this.grassBounds = new T.Box3().setFromObject(grass.scene);
    this.treeTemplate = tree.scene;
    this.treeTemplate.updateMatrixWorld(true);
    this.treeBounds = new T.Box3().setFromObject(tree.scene);
    this.loaded = true;
  }
  applyQuality() {
    const small =
      matchMedia("(any-pointer:coarse)").matches ||
      navigator.maxTouchPoints > 1;
    this.low =
      this.settings.quality === "low" ||
      (this.settings.quality === "auto" && small);
    this.renderer.setPixelRatio(
      Math.min(devicePixelRatio || 1, this.low ? 1.15 : 1.7),
    );
    this.renderer.shadowMap.enabled = !this.low;
    this.resize();
  }
  resize() {
    const w = innerWidth,
      h = innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }
  mesh(geometry, material, parent, x = 0, y = 0, z = 0) {
    const m = new T.Mesh(geometry, material);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    (parent || this.group).add(m);
    this.disposables.add(geometry);
    return m;
  }
  box(w, h, d, mat, parent, x = 0, y = 0, z = 0) {
    return this.mesh(new T.BoxGeometry(w, h, d), mat, parent, x, y, z);
  }
  cylinder(rt, rb, h, mat, parent, x = 0, y = 0, z = 0, n = 24) {
    return this.mesh(
      new T.CylinderGeometry(rt, rb, h, n),
      mat,
      parent,
      x,
      y,
      z,
    );
  }
  sphere(r, mat, parent, x = 0, y = 0, z = 0) {
    return this.mesh(new T.SphereGeometry(r, 24, 16), mat, parent, x, y, z);
  }
  groupAt(x, y, z, parent = this.group) {
    const g = new T.Group();
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  }
  column(x, z, height = 5, parent = this.group, broken = false) {
    const g = this.groupAt(x, groundHeight(x, z), z, parent);
    const m = this.materials.stone;
    this.box(1.45, 0.24, 1.45, m, g, 0, 0.12);
    this.box(1.16, 0.2, 1.16, m, g, 0, 0.34);
    this.cylinder(0.43, 0.55, height, m, g, 0, height / 2 + 0.45);
    for (let j = 0; j < 12; j++) {
      const a = (j / 12) * Math.PI * 2;
      const flute = this.cylinder(
        0.033,
        0.041,
        height - 0.35,
        this.materials.darkstone,
        g,
        Math.cos(a) * 0.455,
        height / 2 + 0.46,
        Math.sin(a) * 0.455,
        5,
      );
      flute.material = this.materials.stone;
    }
    if (!broken) {
      this.cylinder(0.66, 0.48, 0.28, m, g, 0, height + 0.55);
      this.box(1.4, 0.24, 1.4, m, g, 0, height + 0.8);
    }
    this.obstacles.push({ x, z, r: 0.68 });
    return g;
  }
  arch(x, z) {
    const g = this.groupAt(x, 0, z);
    const m = this.materials.stone;
    for (const side of [-1, 1]) {
      this.column(x + side * 3.1, z, 6.8);
      this.column(x + side * 3.1, z - 1.2, 6.8);
    }
    this.box(8, 1, 2.8, m, g, 0, 7.35, -0.6);
    const shape = new T.Shape();
    shape.moveTo(-4.4, 0);
    shape.lineTo(0, 2.2);
    shape.lineTo(4.4, 0);
    shape.closePath();
    this.mesh(
      new T.ExtrudeGeometry(shape, { depth: 0.9, bevelEnabled: false }),
      m,
      g,
      0,
      7.85,
      -1.1,
    );
    this.box(8.6, 0.23, 3, m, g, 0, 7.83, -0.6);
    for (let i = 0; i < 4; i++)
      this.box(
        9.6 - i * 0.4,
        0.12,
        3.9 - i * 0.35,
        m,
        g,
        0,
        -0.18 + i * 0.12,
        -0.6,
      );
    return g;
  }
  tree(x, z, s = 1, cypress = false) {
    const g = this.groupAt(x, groundHeight(x, z) - 0.2, z);
    g.scale.setScalar(s);
    const wood = this.materials.wood,
      leaf = this.materials.leaf;
    this.cylinder(0.14, 0.33, 3.7, wood, g, 0, 1.7);
    if (cypress) {
      for (let i = 0; i < 4; i++)
        this.mesh(
          new T.SphereGeometry(1.2 - i * 0.21, 12, 12),
          leaf,
          g,
          0.08 * Math.sin(i),
          3.2 + i * 0.9,
        ).scale.set(0.8, 1.75, 0.8);
    } else {
      for (let i = 0; i < 5; i++) {
        const a = i * 2.4;
        const branch = this.cylinder(
          0.07,
          0.15,
          2,
          wood,
          g,
          Math.cos(a) * 0.5,
          2.8,
          Math.sin(a) * 0.5,
          8,
        );
        branch.rotation.z = Math.cos(a) * 0.7;
        branch.rotation.x = Math.sin(a) * 0.7;
        const crown = this.mesh(
          new T.IcosahedronGeometry(1.35, 2),
          leaf,
          g,
          Math.cos(a) * 0.95,
          3.5 + rand() * 0.65,
          Math.sin(a) * 0.95,
        );
        crown.scale.set(1.3, 0.8, 1.1);
      }
    }
    if (Math.abs(x) < 23 && z > -30 && z < 21)
      this.obstacles.push({ x, z, r: 0.4 * s });
  }
  treeField() {
    const count = this.low ? 12 : 26;
    const transforms = [];
    const h = this.treeBounds.max.y - this.treeBounds.min.y;
    const dummy = new T.Object3D();
    for (let i = 0; i < count; i++) {
      const x = (i % 2 ? 1 : -1) * (19 + rand() * 15),
        z = (rand() - 0.5) * 64 - 4,
        s = (4.8 + rand() * 2.5) / h;
      dummy.position.set(
        x,
        groundHeight(x, z) - this.treeBounds.min.y * s - 0.08,
        z,
      );
      dummy.rotation.set(0, rand() * Math.PI * 2, 0);
      dummy.scale.set(s, s, s);
      if (this.level.theme === "memory") {
        dummy.scale.x *= 0.45;
        dummy.scale.z *= 0.45;
        dummy.scale.y *= 1.3;
      }
      dummy.updateMatrix();
      transforms.push(dummy.matrix.clone());
      if (Math.abs(x) < 23 && z > -30 && z < 21)
        this.obstacles.push({ x, z, r: 0.6 });
    }
    this.treeTemplate.traverse((part) => {
      if (!part.isMesh) return;
      const mesh = new T.InstancedMesh(part.geometry, part.material, count);
      mesh.castShadow = !this.low;
      mesh.receiveShadow = true;
      mesh.userData.keepSeparate = true;
      for (let i = 0; i < count; i++)
        mesh.setMatrixAt(
          i,
          new T.Matrix4().multiplyMatrices(transforms[i], part.matrixWorld),
        );
      this.group.add(mesh);
    });
  }
  rock(x, z, s = 1) {
    const g = new T.DodecahedronGeometry(s, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      p.setY(i, p.getY(i) * (0.65 + rand() * 0.3));
    }
    g.computeVertexNormals();
    const m = this.mesh(
      g,
      this.materials.darkstone,
      null,
      x,
      groundHeight(x, z) - s * 0.12,
      z,
    );
    m.rotation.y = rand() * 6.28;
    if (Math.abs(x) < 23 && z > -30 && z < 21 && s > 0.65)
      this.obstacles.push({ x, z, r: s * 0.72 });
    return m;
  }
  grass() {
    const count = this.low ? 16000 : 38000;
    const geo = new T.BufferGeometry();
    geo.setAttribute(
      "position",
      new T.Float32BufferAttribute(
        [-0.025, 0, 0, 0.025, 0, 0, 0.04, 0.38, 0],
        3,
      ),
    );
    geo.setAttribute(
      "uv",
      new T.Float32BufferAttribute([0, 0, 1, 0, 0.6, 1], 2),
    );
    geo.computeVertexNormals();
    const mat = new T.MeshStandardMaterial({
      color: 0xc9cb8d,
      side: T.DoubleSide,
      roughness: 1,
    });
    this.disposables.add(geo);
    this.disposables.add(mat);
    const mesh = new T.InstancedMesh(geo, mat, count);
    mesh.receiveShadow = true;
    const dummy = new T.Object3D(),
      color = new T.Color();
    for (let i = 0; i < count; i++) {
      let x = (rand() - 0.5) * 67,
        z = (rand() - 0.5) * 76 - 3;
      const path = Math.abs(x - 1.8 * Math.sin(z * 0.12));
      if (
        path < 2.6 ||
        (Math.abs(x) < 5 && z < -20) ||
        this.level.nodes.some((n) => Math.hypot(x - n.x, z - n.z) < 1.5)
      ) {
        x += x > 0 ? 4 : -4;
      }
      dummy.position.set(x, groundHeight(x, z), z);
      dummy.rotation.y = rand() * 6.28;
      dummy.rotation.z = (rand() - 0.5) * 0.35;
      dummy.scale.setScalar(0.6 + rand() * 1.1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.setHSL(
        0.17 + rand() * 0.055,
        0.2 + rand() * 0.22,
        0.32 + rand() * 0.17,
      );
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    this.group.add(mesh);
  }
  batchStatic() {
    this.group.updateMatrixWorld(true);
    const dynamic = new Set([
      this.portal,
      this.water,
      this.dust,
      ...this.items.map((n) => n.group),
      ...this.anim.map((a) => a.mesh),
    ]);
    const batches = new Map();
    const originals = [];
    this.group.traverse((o) => {
      if (
        !o.isMesh ||
        o.isInstancedMesh ||
        o.userData.keepSeparate ||
        Array.isArray(o.material) ||
        o.material.transparent ||
        o.geometry.attributes.color
      )
        return;
      let p = o;
      while (p && p !== this.group) {
        if (dynamic.has(p)) return;
        p = p.parent;
      }
      const g = o.geometry.clone().applyMatrix4(o.matrixWorld);
      if (!g.attributes.normal) g.computeVertexNormals();
      if (!g.attributes.uv)
        g.setAttribute(
          "uv",
          new T.Float32BufferAttribute(
            new Float32Array(g.attributes.position.count * 2),
            2,
          ),
        );
      for (const attr of Object.keys(g.attributes))
        if (!["position", "normal", "uv"].includes(attr))
          g.deleteAttribute(attr);
      const nonIndexed = g.index ? g.toNonIndexed() : g;
      if (g.index) g.dispose();
      const key = o.material.uuid;
      if (!batches.has(key))
        batches.set(key, { material: o.material, geometries: [] });
      batches.get(key).geometries.push(nonIndexed);
      originals.push(o);
    });
    for (const o of originals) {
      o.removeFromParent();
      o.geometry.dispose();
      this.disposables.delete(o.geometry);
    }
    for (const b of batches.values()) {
      const merged = mergeGeometries(b.geometries, false);
      b.geometries.forEach((g) => g.dispose());
      if (merged) this.mesh(merged, b.material);
    }
  }
  grassField() {
    const count = this.low ? 450 : 850,
      transforms = [];
    const h = this.grassBounds.max.y - this.grassBounds.min.y;
    const dummy = new T.Object3D();
    for (let i = 0; i < count; i++) {
      let x = (rand() - 0.5) * 58,
        z = (rand() - 0.5) * 65 - 3;
      if (
        Math.abs(x - 1.8 * Math.sin(z * 0.12)) < 2.5 ||
        this.level.nodes.some((n) => Math.hypot(x - n.x, z - n.z) < 1.5)
      ) {
        x += x < 0 ? -3.5 : 3.5;
      }
      const s = (0.22 + rand() * 0.35) / h;
      dummy.position.set(x, groundHeight(x, z) - this.grassBounds.min.y * s, z);
      dummy.rotation.set(0, rand() * 6.28, 0);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      transforms.push(dummy.matrix.clone());
    }
    this.grassTemplate.traverse((part) => {
      if (!part.isMesh) return;
      const mesh = new T.InstancedMesh(part.geometry, part.material, count);
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      for (let i = 0; i < count; i++)
        mesh.setMatrixAt(
          i,
          new T.Matrix4().multiplyMatrices(transforms[i], part.matrixWorld),
        );
      this.group.add(mesh);
    });
  }
  gear(parent, r = 1) {
    const shape = new T.Shape();
    for (let i = 0; i < 96; i++) {
      const angle = (i / 96) * Math.PI * 2;
      const radius = i % 4 < 2 ? r : r * 0.82;
      const x = Math.cos(angle) * radius,
        y = Math.sin(angle) * radius;
      i ? shape.lineTo(x, y) : shape.moveTo(x, y);
    }
    shape.closePath();
    const hole = new T.Path();
    hole.absarc(0, 0, r * 0.34, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const mesh = this.mesh(
      new T.ExtrudeGeometry(shape, {
        depth: 0.24,
        bevelEnabled: true,
        bevelSegments: 1,
        steps: 1,
        bevelSize: 0.025,
        bevelThickness: 0.025,
      }),
      this.materials.bronze,
      parent,
    );
    for (let j = 0; j < 6; j++) {
      const a = (j * Math.PI) / 3;
      const bar = this.box(r * 1.4, 0.11, 0.18, this.materials.gold, mesh);
      bar.rotation.z = a;
    }
    this.cylinder(0.17, 0.17, 0.48, this.materials.gold, mesh).rotation.x =
      Math.PI / 2;
    return mesh;
  }
  symbol(type, parent) {
    const m = this.materials;
    const g = new T.Group();
    parent.add(g);
    if (type === "book" || type === "scroll") {
      const b = this.box(1.15, 0.16, 0.8, m.wood, g);
      b.rotation.z = 0.06;
      this.box(1.08, 0.14, 0.74, m.paper, g, 0, 0.1);
      this.box(0.025, 0.015, 0.74, m.ink, g, 0, 0.18);
      for (let i = 0; i < 7; i++)
        for (let side of [-1, 1])
          this.box(
            0.36,
            0.008,
            0.009,
            m.ink,
            g,
            side * 0.28,
            0.185,
            -0.23 + i * 0.065,
          );
      if (type === "scroll") {
        this.cylinder(0.11, 0.11, 0.95, m.paper, g, -0.58, 0.13).rotation.x =
          Math.PI / 2;
        this.cylinder(0.11, 0.11, 0.95, m.paper, g, 0.58, 0.13).rotation.x =
          Math.PI / 2;
      }
    } else if (type === "gear") {
      const v = this.gear(g, 0.9);
      v.rotation.y = 0.3;
      g.userData.spin = true;
    } else if (type === "lyre") {
      for (const side of [-1, 1]) {
        this.cylinder(
          0.055,
          0.085,
          1.3,
          m.gold,
          g,
          side * 0.42,
          0.45,
        ).rotation.z = -side * 0.12;
      }
      this.box(1.05, 0.12, 0.15, m.gold, g, 0, 1.1);
      this.mesh(
        new T.TorusGeometry(0.35, 0.095, 8, 28, Math.PI),
        m.gold,
        g,
        0,
        -0.11,
      ).rotation.z = Math.PI;
      for (let i = 0; i < 7; i++)
        this.cylinder(
          0.008,
          0.008,
          1.13,
          m.glow,
          g,
          -0.3 + i * 0.1,
          0.48,
          0,
          4,
        );
    } else if (type === "tomb") {
      this.box(1, 0.9, 0.26, m.stone, g, 0, 0.15);
      this.cylinder(0.5, 0.5, 0.26, m.stone, g, 0, 0.59).rotation.x =
        Math.PI / 2;
      for (let i = 0; i < 4; i++)
        this.box(
          0.65 - i * 0.08,
          0.013,
          0.025,
          m.darkstone,
          g,
          0,
          0.48 - i * 0.15,
          0.145,
        );
    } else if (type === "banner") {
      this.cylinder(0.035, 0.05, 1.9, m.bronze, g, -0.4, 0.4);
      const cloth = this.mesh(
        new T.PlaneGeometry(1.15, 0.72, 12, 6),
        new T.MeshStandardMaterial({
          color: 0x955b43,
          side: T.DoubleSide,
          roughness: 1,
        }),
        g,
        0.15,
        0.88,
      );
      const ps = cloth.geometry.attributes.position;
      for (let i = 0; i < ps.count; i++)
        ps.setZ(i, 0.09 * Math.sin(ps.getX(i) * 8));
      cloth.geometry.computeVertexNormals();
      this.disposables.add(cloth.material);
    } else if (type === "boat") {
      const pts = [
        new T.Vector2(0.03, -0.25),
        new T.Vector2(0.28, -0.1),
        new T.Vector2(0.46, 0.12),
        new T.Vector2(0.47, 0.18),
      ];
      this.mesh(new T.LatheGeometry(pts, 24), m.wood, g).scale.set(1.8, 1, 0.7);
      this.cylinder(0.025, 0.03, 1.4, m.gold, g, 0, 0.65);
      const sail = new T.Shape();
      sail.moveTo(0.04, 0.2);
      sail.lineTo(0.04, 1.25);
      sail.lineTo(0.63, 0.25);
      sail.closePath();
      this.mesh(new T.ShapeGeometry(sail), m.paper, g);
    } else if (type === "statue") {
      const pts = [
        new T.Vector2(0.37, 0),
        new T.Vector2(0.32, 0.25),
        new T.Vector2(0.19, 0.72),
        new T.Vector2(0.26, 1.05),
        new T.Vector2(0.18, 1.3),
      ];
      this.mesh(new T.LatheGeometry(pts, 32), m.stone, g);
      this.sphere(0.17, m.stone, g, 0, 1.48);
      for (const side of [-1, 1]) {
        const arm = this.cylinder(
          0.06,
          0.08,
          0.7,
          m.stone,
          g,
          side * 0.27,
          0.92,
          0,
          12,
        );
        arm.rotation.z = side * 0.27;
      }
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        this.cylinder(
          0.009,
          0.022,
          0.7,
          m.stone,
          g,
          Math.cos(a) * 0.25,
          0.38,
          Math.sin(a) * 0.25,
          5,
        );
      }
    } else if (type === "crown") {
      this.mesh(new T.TorusGeometry(0.5, 0.085, 8, 32), m.gold, g).rotation.x =
        Math.PI / 2;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        this.mesh(
          new T.ConeGeometry(0.11, 0.5, 6),
          m.gold,
          g,
          Math.cos(a) * 0.5,
          0.2,
          Math.sin(a) * 0.5,
        );
      }
    } else if (type === "rose") {
      this.cylinder(0.02, 0.03, 0.8, m.leaf, g, 0, 0.25);
      for (let j = 0; j < 8; j++) {
        const a = j * 0.78;
        const petal = this.sphere(
          0.19,
          m.glow,
          g,
          Math.cos(a) * 0.18,
          0.68 + Math.sin(j * 2) * 0.05,
          Math.sin(a) * 0.18,
        );
        petal.scale.y = 0.38;
      }
    } else if (type === "shell") {
      for (let i = 0; i < 10; i++) {
        const a = (i / 9 - 0.5) * 2;
        const sl = this.sphere(
          0.29,
          m.paper,
          g,
          Math.sin(a) * 0.29,
          Math.cos(a) * 0.2,
          0,
        );
        sl.scale.set(0.38, 1, 0.5);
        sl.rotation.z = -a;
      }
    } else if (type === "flame") {
      const fire = this.mesh(
        new T.IcosahedronGeometry(0.35, 2),
        m.glow,
        g,
        0,
        0.35,
      );
      fire.scale.set(0.6, 1.7, 0.6);
      this.cylinder(0.4, 0.19, 0.18, m.bronze, g, 0, -0.1);
    } else {
      this.sphere(0.48, m.glow, g, 0, 0.35);
      const ring = this.mesh(
        new T.TorusGeometry(0.71, 0.025, 8, 64),
        m.gold,
        g,
        0,
        0.35,
      );
      ring.rotation.x = 0.85;
      ring.rotation.y = 0.45;
    }
    return g;
  }
  pedestal(n) {
    const g = this.groupAt(n.x, groundHeight(n.x, n.z), n.z);
    const m = this.materials;
    this.cylinder(1.15, 1.35, 0.22, m.darkstone, g, 0, 0.11);
    this.cylinder(0.7, 0.85, 0.23, m.stone, g, 0, 0.32);
    this.cylinder(0.48, 0.61, 1, m.stone, g, 0, 0.95);
    this.cylinder(0.78, 0.5, 0.22, m.stone, g, 0, 1.54);
    const object = this.symbol(n.kind, g);
    object.position.y = 2;
    const ring = this.mesh(
      new T.TorusGeometry(1.35, 0.025, 8, 64),
      m.glow,
      g,
      0,
      0.25,
    );
    ring.rotation.x = Math.PI / 2;
    const beamMat = new T.MeshBasicMaterial({
      color: 0xffd591,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
      side: T.DoubleSide,
    });
    this.disposables.add(beamMat);
    const beam = this.mesh(
      new T.CylinderGeometry(0.24, 0.6, 6, 16, 1, true),
      beamMat,
      g,
      0,
      3.1,
    );
    beam.castShadow = false;
    this.obstacles.push({ x: n.x, z: n.z, r: 0.85 });
    const item = { ...n, group: g, object, ring, beam, solved: false };
    this.items.push(item);
    return item;
  }
  centerpiece() {
    const m = this.materials;
    const type = this.level.theme;
    this.anim = [];
    if (type === "machine") {
      for (let i = 0; i < 5; i++) {
        const gg = this.groupAt((i - 2) * 2.4, 3.8 + (i % 2) * 1.6, -5);
        const gear = this.gear(gg, 1.6);
        gear.rotation.y = 0.12;
        this.anim.push({
          mesh: gear,
          axis: "z",
          speed: (i % 2 ? -1 : 1) * 0.16,
        });
        this.box(0.25, 5.5, 0.4, m.darkstone, null, (i - 2) * 2.4, 2.2, -5.3);
        this.obstacles.push({ x: (i - 2) * 2.4, z: -5, r: 1.1 });
      }
      this.box(14, 0.6, 3, m.darkstone, null, 0, 0.05, -5);
    } else if (type === "graces" || type === "garden") {
      this.cylinder(3.5, 3.65, 0.27, m.stone, null, 0, 0.18, -5, 48);
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const g = this.groupAt(
          Math.sin(angle) * 1.7,
          0.45,
          -5 + Math.cos(angle) * 1.7,
        );
        const s = this.symbol(type === "graces" ? "statue" : "lyre", g);
        s.scale.setScalar(type === "graces" ? 1.8 : 1.3);
        s.rotation.y = angle;
      }
      this.obstacles.push({ x: 0, z: -5, r: 3.5 });
    } else if (type === "storm") {
      for (let i = 0; i < 7; i++) {
        const x = (i - 3) * 1.2;
        const b = this.box(
          1.1,
          0.18,
          2.5,
          m.stone,
          null,
          x,
          -0.04 + Math.abs(i - 3) * 0.05,
          -4,
        );
        b.rotation.z = (rand() - 0.5) * 0.1;
        this.anim.push({ mesh: b, bridge: true, base: b.position.y });
      }
      for (let i = 0; i < 6; i++)
        this.rock(
          (i % 2 ? 1 : -1) * (5 + rand() * 2),
          -4 + (rand() - 0.5) * 8,
          1.2,
        );
    } else if (type === "ortis") {
      for (let i = 0; i < 5; i++)
        this.column(-3.6, -4 - i * 2, 2 + rand() * 2, this.group, true);
      this.box(0.8, 3, 9, m.darkstone, null, 3.8, 1.1, -8);
      for (let i = 0; i < 7; i++)
        this.rock(4 + (rand() - 0.5) * 4, -8 + (rand() - 0.5) * 10, 0.8);
      this.obstacles.push({ x: 3.8, z: -8, r: 2.4 });
    } else if (type === "memory") {
      for (let i = 0; i < 6; i++) {
        const x = (i % 2 ? 1 : -1) * 4.4,
          z = 4 - Math.floor(i / 2) * 7;
        const g = this.groupAt(x, groundHeight(x, z), z);
        this.box(1.6, 0.25, 2.4, m.stone, g, 0, 0.15);
        const tomb = this.symbol("tomb", g);
        tomb.position.y = 0.9;
        tomb.scale.set(1.3, 1.5, 1);
        this.obstacles.push({ x, z, r: 1.05 });
        this.anim.push({ mesh: tomb, tomb: true });
      }
    } else if (type === "evening") {
      for (let i = 0; i < 3; i++) {
        const g = this.groupAt((i - 1) * 3, 0.15, -5);
        const ring = this.mesh(
          new T.TorusGeometry(0.85, 0.025, 8, 64),
          m.gold,
          g,
          0,
          1.8,
        );
        this.anim.push({ mesh: ring, axis: "y", speed: 0.08 });
      }
    } else {
      this.cylinder(2.4, 2.6, 0.4, m.stone, null, 0, 0.1, -5);
      const g = this.groupAt(0, 0.4, -5);
      this.symbol("sphere", g).scale.setScalar(2.8);
      this.obstacles.push({ x: 0, z: -5, r: 2.5 });
    }
  }
  build(level, solved = []) {
    if (this.group) {
      this.group.traverse((o) => {
        if (o.isLight && o.shadow) {
          o.shadow.map?.dispose();
          o.shadow.mapPass?.dispose();
        }
      });
      this.scene.remove(this.group);
      for (const r of this.disposables) r.dispose();
      this.disposables.clear();
    }
    rand = rng(8827 + Object.keys(palettes).indexOf(level.theme) * 173);
    this.level = level;
    this.items = [];
    this.obstacles = [];
    this.group = new T.Group();
    this.scene.add(this.group);
    const p = palettes[level.theme];
    this.palette = p;
    this.scene.background = new T.Color(p.sky);
    this.scene.fog = new T.FogExp2(
      p.fog,
      level.theme === "storm" ? 0.015 : 0.009,
    );
    const skyGeo = new T.SphereGeometry(220, 48, 28);
    const uv = skyGeo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) * 0.6 - 0.12);
    const skyMat = new T.MeshBasicMaterial({
      map: this.sky,
      side: T.BackSide,
      fog: false,
      color:
        level.theme === "evening"
          ? 0xadb0d2
          : level.theme === "storm"
            ? 0xb2b8c6
            : 0xffffff,
    });
    this.disposables.add(skyMat);
    this.skyDome = this.mesh(skyGeo, skyMat);
    this.skyDome.rotation.y = 2.2;
    this.skyDome.castShadow = this.skyDome.receiveShadow = false;
    this.skyDome.userData.keepSeparate = true;
    this.group.add(new T.HemisphereLight(p.sky, 0x5a5949, 2.1));
    const sun = new T.DirectionalLight(p.sun, 3.1);
    sun.position.set(-30, 42, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, {
      left: -36,
      right: 36,
      top: 36,
      bottom: -36,
      near: 1,
      far: 120,
    });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.025;
    this.group.add(sun);
    this.sun = sun;
    const groundGeo = new T.PlaneGeometry(100, 115, 140, 150);
    groundGeo.rotateX(-Math.PI / 2);
    groundGeo.translate(0, 0, -3);
    const positions = groundGeo.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    const col = new T.Color();
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        z = positions.getZ(i);
      positions.setY(i, groundHeight(x, z));
      const path = Math.abs(x - 1.8 * Math.sin(z * 0.12)) < 2.35;
      col.set(path ? 0xfff2ca : 0xc3d0a8);
      col.multiplyScalar(0.91 + rand() * 0.09);
      col.toArray(colors, i * 3);
    }
    groundGeo.setAttribute("color", new T.BufferAttribute(colors, 3));
    groundGeo.computeVertexNormals();
    const groundMat = new T.MeshStandardMaterial({
      map: this.texGround,
      normalMap: this.texNormal,
      normalScale: new T.Vector2(0.8, 0.8),
      vertexColors: true,
      roughness: 1,
    });
    this.disposables.add(groundMat);
    this.mesh(groundGeo, groundMat);
    const waterMat = new T.MeshStandardMaterial({
      color: p.water,
      metalness: 0.45,
      roughness: 0.25,
      transparent: true,
      opacity: 0.91,
    });
    this.disposables.add(waterMat);
    const waterGeo = new T.PlaneGeometry(300, 300, 60, 60);
    waterGeo.rotateX(-Math.PI / 2);
    this.water = this.mesh(waterGeo, waterMat, null, 0, -2.3, -18);
    this.water.castShadow = false;
    this.water.receiveShadow = false;
    this.treeField();
    for (let i = 0; i < 50; i++) {
      const x = (rand() - 0.5) * 64,
        z = (rand() - 0.5) * 70 - 5;
      if (Math.abs(x) < 14) continue;
      this.rock(x, z, 0.35 + rand() * 1.2);
    }
    for (let i = 0; i < 6; i++) {
      this.column(-17, -8 - i * 3.3, 4 + rand() * 2, this.group, i % 3 === 0);
      if (level.theme !== "ortis")
        this.column(17, -8 - i * 3.3, 4 + rand() * 2, this.group, i % 2 === 0);
    }
    this.arch(0, -25);
    for (let i = 0; i < 5; i++) {
      this.column(-8 + i * 4, -34, 7.6);
    }
    this.box(21, 1.2, 4.3, this.materials.stone, null, 0, 7.8, -35);
    this.box(22, 0.3, 5.1, this.materials.stone, null, 0, 8.6, -35);
    this.grassField();
    this.centerpiece();
    for (const n of level.nodes) this.pedestal(n);
    const gateMat = new T.MeshBasicMaterial({
      color: 0xa6e3d1,
      transparent: true,
      opacity: 0.07,
      side: T.DoubleSide,
      depthWrite: false,
    });
    this.disposables.add(gateMat);
    this.portal = this.mesh(
      new T.PlaneGeometry(5.6, 6.9),
      gateMat,
      null,
      0,
      3.4,
      -24.8,
    );
    this.portal.castShadow = false;
    const dustGeo = new T.BufferGeometry();
    const count = this.low ? 80 : 180;
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pts[i * 3] = (rand() - 0.5) * 40;
      pts[i * 3 + 1] = rand() * 7 + 0.5;
      pts[i * 3 + 2] = (rand() - 0.5) * 55 - 3;
    }
    dustGeo.setAttribute("position", new T.BufferAttribute(pts, 3));
    const dustMat = new T.PointsMaterial({
      size: 0.04,
      color: 0xffe0a3,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    this.disposables.add(dustGeo);
    this.disposables.add(dustMat);
    this.dust = new T.Points(dustGeo, dustMat);
    this.group.add(this.dust);
    this.setSolved(solved);
    this.batchStatic();
  }
  setSolved(ids) {
    this.solvedCount = ids.length;
    for (const item of this.items) {
      item.solved = ids.includes(item.id);
      item.beam.visible = !item.solved;
      item.ring.visible = !item.solved;
    }
    this.portal.material.opacity =
      ids.length === this.items.length ? 0.34 : 0.035;
    this.portal.material.color.set(
      ids.length === this.items.length ? 0xfad99b : 0x8a9b9e,
    );
    if (this.level.theme === "evening") {
      this.skyDome.material.color.setRGB(
        0.68 - ids.length * 0.075,
        0.69 - ids.length * 0.065,
        0.82 - ids.length * 0.04,
      );
      this.scene.fog.color.lerpColors(
        new T.Color(0x8793a1),
        new T.Color(0x38465f),
        ids.length / 3,
      );
      this.sun.intensity = 2.3 - ids.length * 0.35;
    }
    for (const a of this.anim) {
      if (a.bridge)
        a.mesh.position.y = a.base + (ids.length / this.items.length) * 0.35;
      if (a.tomb) a.mesh.scale.y = Math.max(0.3, 1.5 - ids.length * 0.3);
    }
  }
  render(position, yaw, pitch, dt, moving = false, paused = false) {
    if (!paused) this.clock += dt;
    const time = this.settings.reducedMotion ? 0 : this.clock;
    this.camera.position.set(
      position.x,
      groundHeight(position.x, position.z) +
        1.78 +
        (moving && !this.settings.reducedMotion
          ? Math.sin(time * 8) * 0.025
          : 0),
      position.z,
    );
    this.camera.rotation.set(pitch, yaw, 0, "YXZ");
    for (let i = 0; i < this.items.length; i++) {
      const n = this.items[i];
      n.object.position.y = 2 + Math.sin(time * 1.4 + i) * 0.07;
      if (n.kind === "gear") n.object.rotation.z = time * 0.14;
      n.ring.rotation.z = time * 0.15;
    }
    for (const a of this.anim) {
      if (a.axis) a.mesh.rotation[a.axis] = time * a.speed;
    }
    if (this.dust) this.dust.rotation.y = time * 0.004;
    if (this.water && !this.low) {
      const attr = this.water.geometry.attributes.position;
      for (let i = 0; i < attr.count; i++)
        attr.setY(
          i,
          Math.sin(attr.getX(i) * 0.22 + time * 0.6) * 0.07 +
            Math.sin(attr.getZ(i) * 0.2 + time * 0.7) * 0.045,
        );
      attr.needsUpdate = true;
    }
    this.renderer.render(this.scene, this.camera);
  }
  project(x, z, height = 3.4) {
    const v = new T.Vector3(x, groundHeight(x, z) + height, z);
    v.project(this.camera);
    return {
      x: (v.x * 0.5 + 0.5) * innerWidth,
      y: (-v.y * 0.5 + 0.5) * innerHeight,
      visible:
        v.z < 1 && v.z > -1 && Math.abs(v.x) < 1.2 && Math.abs(v.y) < 1.3,
    };
  }
  info() {
    return {
      drawCalls: this.renderer.info.render.calls,
      triangles: this.renderer.info.render.triangles,
      geometries: this.renderer.info.memory.geometries,
      textures: this.renderer.info.memory.textures,
    };
  }
}
