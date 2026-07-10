import * as THREE from 'three';

const $ = (id) => document.getElementById(id);
const canvas = $('game-canvas');
const loading = $('loading');
const startScreen = $('start-screen');
const startButton = $('start-button');
const hud = $('hud');
const crosshair = $('crosshair');
const interactionPrompt = $('interaction-prompt');
const interactionText = $('interaction-text');
const objectiveText = $('objective-text');
const chapterNumber = $('chapter-number');
const chapterTitle = $('chapter-title');
const pressureBar = $('pressure-bar');
const pressureValue = $('pressure-value');
const toast = $('toast');
const journal = $('journal');
const journalContent = $('journal-content');
const dialogue = $('dialogue');
const dialogueKicker = $('dialogue-kicker');
const dialogueTitle = $('dialogue-title');
const dialogueBody = $('dialogue-body');
const dialogueNext = $('dialogue-next');
const choice = $('choice');
const choiceButtons = $('choice-buttons');
const choiceCancel = $('choice-cancel');
const ending = $('ending');
const endingSummary = $('ending-summary');
const restartButton = $('restart-button');
const audioButton = $('audio-button');
const mobileControls = $('mobile-controls');
const joystick = $('joystick');
const joystickKnob = $('joystick-knob');
const lookZone = $('look-zone');
const mobileAction = $('mobile-action');
const mobileJournal = $('mobile-journal');

const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
const roman = ['I', 'II', 'III'];
const chapterNames = ['La macchina', 'Le fratture', 'Scrivere Jacopo'];
const illusionInfo = {
  patria: { title: 'Patria', desc: 'Una comunità immaginata che dà appartenenza e dignità.' },
  amore: { title: 'Amore', desc: 'Il legame che strappa l’individuo alla solitudine.' },
  memoria: { title: 'Memoria', desc: 'Gli affetti che continuano nei vivi oltre la morte.' },
  arte: { title: 'Arte', desc: 'La parola che conserva ciò che la materia distrugge.' },
  bellezza: { title: 'Bellezza', desc: 'Una forma ideale che sospende per un istante la brutalità.' }
};

const state = {
  started: false,
  paused: true,
  chapter: 0,
  pressure: 0,
  laws: new Set(),
  fractures: new Set(),
  written: new Set(),
  illusions: { patria: 0, amore: 0, memoria: 0, arte: 0, bellezza: 0 },
  journal: [],
  modal: false,
  ending: false,
  audioOn: true,
  objective: 'Scopri le leggi del mondo meccanico.'
};

let scene, camera, renderer, clock;
let worldRoot, machineGroup, fracturesGroup, ortisGroup;
let keyLight, fillLight, rimLight;
let yaw = 0, pitch = 0;
let velocityY = 0;
let currentInteractable = null;
let toastTimer = null;
let dialogueCallback = null;
let audioCtx = null, masterGain = null, droneNodes = [];
let cinematic = false;
let cinematicStart = 0;
let ortisWalls = null;
const keys = new Set();
const interactables = [];
const animated = [];
const illusionOrbs = {};
const mobileMove = new THREE.Vector2();

const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();
const tmpBox = new THREE.Box3();

init().catch((error) => {
  console.error(error);
  loading.querySelector('p').textContent = 'Impossibile inizializzare il 3D. Controlla la connessione e WebGL.';
});

async function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1118);
  scene.fog = new THREE.FogExp2(0x0b1118, 0.028);

  camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.08, 180);
  camera.position.set(0, 1.72, 7.5);
  camera.rotation.order = 'YXZ';

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, isTouch ? 1.35 : 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  clock = new THREE.Clock();
  worldRoot = new THREE.Group();
  scene.add(worldRoot);

  setupLights();
  addDust();
  machineGroup = buildMachineWorld();
  fracturesGroup = buildFracturesWorld();
  ortisGroup = buildOrtisWorld();
  worldRoot.add(machineGroup, fracturesGroup, ortisGroup);
  fracturesGroup.visible = false;
  ortisGroup.visible = false;

  await addFoscoloPortrait(machineGroup);
  bindEvents();
  renderJournal();
  updateHUD();
  onResize();

  loading.classList.remove('screen--active');
  startScreen.classList.add('screen--active');
  requestAnimationFrame(animate);

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function setupLights() {
  scene.add(new THREE.HemisphereLight(0x9db3c5, 0x17100b, 0.55));
  keyLight = new THREE.SpotLight(0xd3e3f0, 900, 55, Math.PI / 5, 0.55, 1.1);
  keyLight.position.set(5, 12, 8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1536, 1536);
  keyLight.shadow.bias = -0.0002;
  keyLight.target.position.set(0, 0, -4);
  scene.add(keyLight, keyLight.target);

  fillLight = new THREE.PointLight(0x776a58, 180, 28, 1.5);
  fillLight.position.set(-7, 4, 2);
  scene.add(fillLight);

  rimLight = new THREE.PointLight(0xb37848, 130, 22, 1.6);
  rimLight.position.set(4, 3, -10);
  scene.add(rimLight);
}

function buildMachineWorld() {
  const group = new THREE.Group();
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x171d23, metalness: 0.3, roughness: 0.58 });
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(17, 17, 0.7, 96), floorMat);
  floor.position.y = -0.38;
  floor.receiveShadow = true;
  group.add(floor);

  const inlay = new THREE.Mesh(
    new THREE.RingGeometry(4.7, 5.0, 96),
    new THREE.MeshStandardMaterial({ color: 0x8a6d42, metalness: 0.78, roughness: 0.24, emissive: 0x24170c, emissiveIntensity: 0.5 })
  );
  inlay.rotation.x = -Math.PI / 2;
  inlay.position.y = 0.01;
  group.add(inlay);

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.62, 7.2, 12),
      new THREE.MeshStandardMaterial({ color: 0x30343a, metalness: 0.15, roughness: 0.85 })
    );
    col.position.set(Math.sin(a) * 13.3, 3.2, Math.cos(a) * 13.3);
    col.castShadow = col.receiveShadow = true;
    group.add(col);
  }

  const gearMat = new THREE.MeshStandardMaterial({ color: 0x6c5e4a, metalness: 0.88, roughness: 0.28 });
  const gearData = [
    [5.2, 18, -10, 5.8, -10, 0.18],
    [3.4, 14, -5.8, 7.0, -12, -0.28],
    [2.6, 12, 8.8, 4.7, -10.5, 0.38],
    [4.1, 16, 10.8, 8.2, -12.8, -0.16],
    [2.0, 10, 3.6, 9.3, -13.5, 0.44]
  ];
  for (const [r, teeth, x, y, z, speed] of gearData) {
    const gear = createGear(r, teeth, 0.65, gearMat);
    gear.position.set(x, y, z);
    gear.rotation.y = Math.PI / 2;
    gear.castShadow = true;
    group.add(gear);
    animated.push({ type: 'gear', object: gear, speed, chapter: 0 });
  }

  const avatar = createFoscoloAvatar();
  avatar.position.set(0, 0, -7.7);
  avatar.rotation.y = 0;
  group.add(avatar);

  const avatarSpot = new THREE.SpotLight(0xf1d7b0, 420, 14, Math.PI / 7, 0.55, 1.2);
  avatarSpot.position.set(0, 7, -2.8);
  avatarSpot.target = avatar;
  group.add(avatarSpot);

  const lawDefs = [
    { id: 'materia', title: 'Materia', subtitle: 'Tutto è corpo e movimento', angle: -1.05, color: 0x788793 },
    { id: 'causa', title: 'Causa', subtitle: 'Ogni evento segue una legge', angle: 0, color: 0x8c806d },
    { id: 'nulla', title: 'Nulla', subtitle: 'La morte è spegnimento', angle: 1.05, color: 0x6b6670 }
  ];
  lawDefs.forEach((def) => {
    const x = Math.sin(def.angle) * 8.4;
    const z = -1.8 - Math.cos(def.angle) * 7.1;
    const altar = createAltar(def.title, def.subtitle, def.color);
    altar.position.set(x, 0, z);
    altar.rotation.y = -def.angle;
    group.add(altar);
    registerInteractable(altar, {
      id: `law-${def.id}`,
      label: `Comprendi: ${def.title}`,
      action: () => discoverLaw(def.id, altar)
    });
  });

  const gate = createPortal(0x7b8791, 'LA FRATTURA');
  gate.position.set(0, 0, -14.4);
  gate.userData.locked = true;
  group.add(gate);
  registerInteractable(gate, {
    id: 'machine-gate',
    label: 'Attraversa la frattura',
    action: () => {
      if (state.laws.size < 3) {
        showToast('La porta non cede: devi prima accettare tutte le conseguenze della macchina.');
        playTone(120, 0.12, 'sawtooth', 0.03);
        return;
      }
      openDialogue({
        kicker: 'Passaggio',
        title: 'La verità non consola',
        html: `<p>Hai compreso il funzionamento della macchina: <strong>materia, necessità, nulla</strong>.</p><p>Ma una filosofia diventa davvero pericolosa quando entra nella vita. Ora il mondo colpirà Foscolo nella patria, negli affetti e nella storia.</p>`,
        onClose: () => switchChapter(1)
      });
    }
  });

  return group;
}

function buildFracturesWorld() {
  const group = new THREE.Group();
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(17, 96),
    new THREE.MeshStandardMaterial({ color: 0x24282a, roughness: 0.94, metalness: 0.04 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 15),
    new THREE.MeshStandardMaterial({ color: 0x20272c, roughness: 0.92, side: THREE.DoubleSide })
  );
  back.position.set(0, 6.5, -15.5);
  group.add(back);

  const crackMat = new THREE.LineBasicMaterial({ color: 0x9a7951, transparent: true, opacity: 0.58 });
  for (let i = 0; i < 18; i++) {
    const points = [];
    let x = (Math.random() - 0.5) * 28;
    let y = Math.random() * 12;
    for (let k = 0; k < 5; k++) {
      points.push(new THREE.Vector3(x, y, -15.42));
      x += (Math.random() - 0.5) * 1.5;
      y -= 0.7 + Math.random() * 1.2;
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), crackMat));
  }

  const defs = [
    { id: 'esilio', x: -8.3, title: 'Zacinto', sub: 'Esilio e sradicamento', prop: createShip(), color: 0x5d7f91 },
    { id: 'giovanni', x: 0, title: 'Giovanni', sub: 'La morte diventa esperienza', prop: createTomb(), color: 0x83756f },
    { id: 'campoformio', x: 8.3, title: 'Campoformio', sub: 'La storia tradisce gli ideali', prop: createTreatyTable(), color: 0x95664d }
  ];

  defs.forEach((def) => {
    const island = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(3.35, 3.65, 0.55, 32),
      new THREE.MeshStandardMaterial({ color: 0x303335, roughness: 0.83 })
    );
    base.position.y = 0.25;
    base.receiveShadow = true;
    island.add(base);
    def.prop.position.y = 0.55;
    island.add(def.prop);
    const label = createTextPanel(def.title, def.sub, def.color, 3.8, 1.15);
    label.position.set(0, 3.8, 0);
    island.add(label);
    island.position.set(def.x, 0, -5.5);
    group.add(island);
    registerInteractable(island, {
      id: `fracture-${def.id}`,
      label: `Attraversa: ${def.title}`,
      action: () => discoverFracture(def.id, island)
    });
  });

  const exit = createPortal(0xd1ab69, 'IL MANOSCRITTO');
  exit.position.set(0, 0, -14.5);
  group.add(exit);
  registerInteractable(exit, {
    id: 'fracture-gate',
    label: 'Entra nelle Ultime lettere',
    action: () => {
      if (state.fractures.size < 3) {
        showToast('Foscolo non può scrivere la risposta prima che le fratture siano diventate esperienza.');
        return;
      }
      openDialogue({
        kicker: 'Atto creativo',
        title: 'Foscolo crea Jacopo',
        html: `<p>La storia reale non cambia. Foscolo apre allora un secondo spazio: <strong>l’opera</strong>.</p><p>Nel manoscritto può affidare a Jacopo le illusioni necessarie: patria, amore, memoria, arte e bellezza. Ma il personaggio vivrà dentro la stessa realtà che le distrugge.</p>`,
        onClose: () => switchChapter(2)
      });
    }
  });

  return group;
}

function buildOrtisWorld() {
  const group = new THREE.Group();
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(32, 32),
    new THREE.MeshStandardMaterial({ color: 0x231e19, roughness: 0.76, metalness: 0.02 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  const carpet = new THREE.Mesh(
    new THREE.PlaneGeometry(8.8, 18),
    new THREE.MeshStandardMaterial({ color: 0x392421, roughness: 0.9 })
  );
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.012, -4.5);
  group.add(carpet);

  const wallMatGlobal = new THREE.MeshStandardMaterial({ color: 0x34383d, roughness: 0.87, emissive: 0x090d13 });
  const wallMatPersonal = new THREE.MeshStandardMaterial({ color: 0x3a2f31, roughness: 0.88, emissive: 0x120708 });
  const wallGlobal = new THREE.Mesh(new THREE.BoxGeometry(1, 8, 28), wallMatGlobal);
  const wallPersonal = new THREE.Mesh(new THREE.BoxGeometry(1, 8, 28), wallMatPersonal);
  wallGlobal.position.set(-15.4, 4, -2);
  wallPersonal.position.set(15.4, 4, -2);
  wallGlobal.castShadow = wallPersonal.castShadow = true;
  group.add(wallGlobal, wallPersonal);
  ortisWalls = { global: wallGlobal, personal: wallPersonal };

  const globalLabel = createTextPanel('REALTÀ STORICA', 'Campoformio · esilio · Italia divisa', 0x75899c, 4.8, 1.1);
  globalLabel.rotation.y = Math.PI / 2;
  globalLabel.position.set(0.51, 0.4, -2);
  wallGlobal.add(globalLabel);
  const personalLabel = createTextPanel('REALTÀ PERSONALE', 'Teresa · solitudine · perdita', 0xa47676, 4.8, 1.1);
  personalLabel.rotation.y = -Math.PI / 2;
  personalLabel.position.set(-0.51, 0.4, -2);
  wallPersonal.add(personalLabel);

  const desk = createWritingDesk();
  desk.position.set(0, 0, -7.8);
  group.add(desk);
  registerInteractable(desk, {
    id: 'writing-desk',
    label: 'Scrivi un’illusione per Jacopo',
    action: openIllusionChoice
  });

  const jacopo = createJacopoFigure();
  jacopo.position.set(0, 0, -13.5);
  group.add(jacopo);

  const orbPositions = {
    patria: [-5.8, 2.4, -6.2],
    amore: [5.8, 2.4, -6.2],
    memoria: [-6.3, 2.1, -11.8],
    arte: [6.3, 2.1, -11.8],
    bellezza: [0, 5.4, -11.4]
  };
  Object.entries(orbPositions).forEach(([key, p]) => {
    const orb = createIllusionOrb(key);
    orb.position.set(...p);
    orb.visible = false;
    group.add(orb);
    illusionOrbs[key] = orb;
  });

  for (let i = 0; i < 25; i++) {
    const page = new THREE.Mesh(
      new THREE.PlaneGeometry(0.45 + Math.random() * 0.3, 0.65 + Math.random() * 0.45),
      new THREE.MeshStandardMaterial({ color: 0xd7cfb8, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.78 })
    );
    page.position.set((Math.random() - 0.5) * 11, 1 + Math.random() * 5, -4 - Math.random() * 12);
    page.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    group.add(page);
    animated.push({ type: 'page', object: page, speed: 0.25 + Math.random() * 0.35, phase: Math.random() * 10, chapter: 2 });
  }

  return group;
}

async function addFoscoloPortrait(group) {
  try {
    const texture = await new THREE.TextureLoader().loadAsync('assets/foscolo-reference.webp');
    texture.colorSpace = THREE.SRGBColorSpace;
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 4.8),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.72, metalness: 0.02 })
    );
    plane.position.set(0, 3.15, -10.7);
    plane.receiveShadow = true;
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(4.1, 5.3, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x4f3b27, metalness: 0.38, roughness: 0.42 })
    );
    frame.position.copy(plane.position);
    frame.position.z -= 0.11;
    group.add(frame, plane);
  } catch (error) {
    console.warn('Ritratto non caricato', error);
  }
}

function createGear(radius, teeth, depth, material) {
  const group = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.72, radius * 0.18, 14, 64), material);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.19, radius * 0.19, depth * 1.2, 24), material);
  hub.rotation.x = Math.PI / 2;
  group.add(hub);
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(radius * 0.24, depth, radius * 0.18), material);
    tooth.position.set(Math.cos(a) * radius * 0.91, 0, Math.sin(a) * radius * 0.91);
    tooth.rotation.y = -a;
    group.add(tooth);
  }
  const spokeMat = material;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(radius * 1.25, depth * 0.7, radius * 0.1), spokeMat);
    spoke.rotation.y = a;
    group.add(spoke);
  }
  group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return group;
}

function createFoscoloAvatar() {
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xc99170, roughness: 0.72 });
  const coat = new THREE.MeshStandardMaterial({ color: 0x111d2c, roughness: 0.7 });
  const shirt = new THREE.MeshStandardMaterial({ color: 0xd8d3c7, roughness: 0.92 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x3d1d11, roughness: 0.83 });

  const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 2.45, 12), coat);
  legs.position.y = 1.2;
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.78, 1.35, 8, 14), coat);
  torso.scale.set(1.05, 1, 0.62);
  torso.position.y = 3.0;
  const shirtFront = new THREE.Mesh(new THREE.BoxGeometry(0.82, 1.35, 0.12), shirt);
  shirtFront.position.set(0, 3.25, 0.62);
  const collarL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.38), shirt);
  const collarR = collarL.clone();
  collarL.position.set(-0.31, 3.9, 0.7); collarL.rotation.z = -0.35;
  collarR.position.set(0.31, 3.9, 0.7); collarR.rotation.z = 0.35;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.31, 0.55, 18), skin);
  neck.position.y = 4.25;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.57, 32, 24), skin);
  head.scale.set(0.88, 1.08, 0.9);
  head.position.y = 4.88;
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.32, 10), skin);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 4.89, 0.55);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x9fb0aa, roughness: 0.32 });
  [-0.19, 0.19].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 8), eyeMat);
    eye.position.set(x, 5.02, 0.49);
    g.add(eye);
  });
  for (let i = 0; i < 58; i++) {
    const a = (i / 58) * Math.PI * 2 + (Math.random() - 0.5) * 0.28;
    const y = 5.25 + Math.random() * 0.48;
    const r = 0.45 + Math.random() * 0.24;
    const curl = new THREE.Mesh(new THREE.DodecahedronGeometry(0.13 + Math.random() * 0.09, 1), hair);
    curl.position.set(Math.cos(a) * r, y, Math.sin(a) * r * 0.9);
    g.add(curl);
  }
  for (const side of [-1, 1]) {
    const burn = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.46, 4, 8), hair);
    burn.position.set(side * 0.49, 4.75, 0.2);
    burn.rotation.z = side * 0.08;
    g.add(burn);
  }
  g.add(legs, torso, shirtFront, collarL, collarR, neck, head, nose);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

function createAltar(title, subtitle, color) {
  const group = new THREE.Group();
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x34383c, metalness: 0.22, roughness: 0.68 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.8, 0.62, 10), baseMat);
  base.position.y = 0.3;
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 1.1, 2.2, 10), baseMat);
  pillar.position.y = 1.65;
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.48, 2),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.16, metalness: 0.58, roughness: 0.28 })
  );
  core.position.y = 3.08;
  core.userData.core = true;
  group.add(base, pillar, core);
  const label = createTextPanel(title.toUpperCase(), subtitle, color, 3.5, 1.05);
  label.position.set(0, 4.15, 0);
  group.add(label);
  group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  animated.push({ type: 'float', object: core, baseY: 3.08, speed: 0.75, phase: Math.random() * 10, chapter: 0 });
  return group;
}

function createPortal(color, labelText) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x3b4248, metalness: 0.66, roughness: 0.36 });
  const glowMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.55, transparent: true, opacity: 0.72 });
  const left = new THREE.Mesh(new THREE.BoxGeometry(1, 7.2, 1.3), mat);
  const right = left.clone();
  left.position.set(-2.35, 3.55, 0); right.position.set(2.35, 3.55, 0);
  const top = new THREE.Mesh(new THREE.BoxGeometry(5.7, 1, 1.3), mat);
  top.position.set(0, 7, 0);
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 6.1), glowMat);
  veil.position.set(0, 3.45, 0.08);
  const label = createTextPanel(labelText, 'attraversa', color, 4.5, 0.9);
  label.position.set(0, 7.8, 0);
  group.add(left, right, top, veil, label);
  group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  animated.push({ type: 'portal', object: veil, speed: 1.2, chapter: null });
  return group;
}

function createTextPanel(title, subtitle, color = 0xd6b475, width = 4, height = 1.2) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 300;
  const ctx = c.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 1024, 300);
  gradient.addColorStop(0, 'rgba(9,13,18,.88)');
  gradient.addColorStop(1, 'rgba(21,25,31,.72)');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1024, 300);
  ctx.strokeStyle = `#${new THREE.Color(color).getHexString()}`;
  ctx.lineWidth = 8; ctx.strokeRect(8, 8, 1008, 284);
  ctx.fillStyle = '#f3eee3';
  ctx.font = '700 70px Georgia'; ctx.textAlign = 'center';
  ctx.fillText(title, 512, 130);
  ctx.fillStyle = '#b9c0c6';
  ctx.font = '38px Arial';
  ctx.fillText(subtitle, 512, 215);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false });
  return new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
}

function createShip() {
  const g = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x3c2b20, roughness: 0.8 });
  const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 1.3, 4.3, 8, 1, false, 0, Math.PI), wood);
  hull.rotation.z = Math.PI / 2;
  hull.rotation.y = Math.PI / 2;
  hull.position.y = 0.9;
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 3.8, 10), wood);
  mast.position.y = 2.6;
  const sail = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.5), new THREE.MeshStandardMaterial({ color: 0xb9ad93, side: THREE.DoubleSide, roughness: 1 }));
  sail.position.set(0, 2.7, 0.02);
  g.add(hull, mast, sail);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function createTomb() {
  const g = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({ color: 0x76716b, roughness: 0.96 });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 1.25), stone);
  slab.position.y = 0.35;
  const stele = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.7, 0.42), stone);
  stele.position.set(0, 1.8, -0.35);
  const wreath = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 8, 30), new THREE.MeshStandardMaterial({ color: 0x675d39, roughness: 0.8 }));
  wreath.position.set(0, 2.0, -0.1);
  g.add(slab, stele, wreath);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function createTreatyTable() {
  const g = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x4a2f21, roughness: 0.75 });
  const paper = new THREE.MeshStandardMaterial({ color: 0xd1c6a8, roughness: 0.96, side: THREE.DoubleSide });
  const top = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.25, 1.8), wood); top.position.y = 1.6;
  for (const x of [-1.25, 1.25]) for (const z of [-0.6, 0.6]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.5, 0.22), wood); leg.position.set(x, 0.8, z); g.add(leg);
  }
  const doc = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.1), paper);
  doc.rotation.x = -Math.PI / 2; doc.position.set(0, 1.75, 0);
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 24), new THREE.MeshStandardMaterial({ color: 0x7f2323, roughness: 0.48 }));
  seal.position.set(0.72, 1.8, 0.22);
  g.add(top, doc, seal);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function createWritingDesk() {
  const g = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x3e281b, roughness: 0.66, metalness: 0.05 });
  const paper = new THREE.MeshStandardMaterial({ color: 0xd9cfb2, roughness: 0.98, side: THREE.DoubleSide });
  const top = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.32, 2.2), wood); top.position.y = 1.55;
  for (const x of [-2.2, 2.2]) for (const z of [-0.75, 0.75]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.5, 0.28), wood); leg.position.set(x, 0.75, z); g.add(leg);
  }
  const manuscript = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.55), paper);
  manuscript.rotation.x = -Math.PI / 2; manuscript.position.set(0, 1.74, 0);
  const ink = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x10151a, metalness: 0.32, roughness: 0.3 }));
  ink.position.set(1.9, 1.9, 0.35);
  const quill = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0xc8b88f, roughness: 0.8 }));
  quill.position.set(1.6, 2.45, 0.2); quill.rotation.z = -0.7;
  const label = createTextPanel('LE ULTIME LETTERE', 'scrivere è costruire un senso', 0xd6b475, 4.6, 1.05);
  label.position.set(0, 3.5, -0.8);
  g.add(top, manuscript, ink, quill, label);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

function createJacopoFigure() {
  const g = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x121519, roughness: 0.85, transparent: true, opacity: 0.9 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.65, 1.7, 8, 14), dark);
  body.scale.set(1, 1, 0.55); body.position.y = 2.15;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 18), dark); head.position.y = 4.1;
  g.add(body, head);
  const halo = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.17, 64), new THREE.MeshBasicMaterial({ color: 0x8e7654, transparent: true, opacity: 0.38, side: THREE.DoubleSide }));
  halo.position.y = 3.0;
  g.add(halo);
  animated.push({ type: 'halo', object: halo, speed: 0.18, chapter: 2 });
  return g;
}

function createIllusionOrb(key) {
  const colors = { patria: 0x6c91ad, amore: 0xb77976, memoria: 0xa38b66, arte: 0x8a78ad, bellezza: 0xd1b774 };
  const color = colors[key];
  const g = new THREE.Group();
  const orb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.46, 3),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.2, metalness: 0.15, roughness: 0.18, transparent: true, opacity: 0.9 })
  );
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.025, 8, 64), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.68 }));
  ring.rotation.x = Math.PI / 2;
  const label = createTextPanel(illusionInfo[key].title.toUpperCase(), 'illusione necessaria', color, 2.4, 0.62);
  label.position.y = 1.05;
  g.add(orb, ring, label);
  animated.push({ type: 'orb', object: g, speed: 0.55 + Math.random() * 0.3, phase: Math.random() * 5, chapter: 2 });
  return g;
}

function addDust() {
  const count = isTouch ? 650 : 1200;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 38;
    pos[i * 3 + 1] = Math.random() * 13;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 38;
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xc4bca8, size: 0.035, transparent: true, opacity: 0.28, depthWrite: false }));
  scene.add(pts);
  animated.push({ type: 'dust', object: pts, speed: 0.01, chapter: null });
}

function registerInteractable(object, data) {
  object.userData.interaction = data;
  interactables.push(object);
}

function discoverLaw(id, altar) {
  const definitions = {
    materia: {
      title: 'Tutto è materia',
      body: `<p>Il cosmo non è una scena costruita per l’uomo. È <strong>materia in movimento</strong>.</p><p>Corpo, passioni e coscienza appartengono allo stesso ordine fisico. Nessun privilegio metafisico ci sottrae alla natura.</p>`,
      journal: 'Il mondo non possiede un fine morale: esistono corpi, movimenti, trasformazioni.'
    },
    causa: {
      title: 'La necessità delle cause',
      body: `<p>Ogni evento nasce da cause precedenti. La natura <strong>non premia e non punisce</strong>: semplicemente funziona.</p><p>La ragione libera dalla superstizione, ma toglie anche l’idea che la storia garantisca giustizia.</p>`,
      journal: 'Il determinismo rende il mondo conoscibile, non necessariamente abitabile.'
    },
    nulla: {
      title: 'La morte è spegnimento',
      body: `<p>Non c’è un aldilà assicurato dalla macchina. La morte interrompe il movimento individuale.</p><p>Per Foscolo il <strong>nulla</strong> non è solo una teoria: diventerà ferita biografica.</p>`,
      journal: 'Senza anima immortale, l’eternità deve essere costruita nella memoria dei vivi.'
    }
  };
  const d = definitions[id];
  if (state.laws.has(id)) {
    showToast(`${d.title}: questa legge è già entrata nel taccuino.`);
    return;
  }
  state.laws.add(id);
  changePressure(8);
  addJournal(`law-${id}`, d.title, d.journal);
  altar.traverse((o) => {
    if (o.isMesh && o.userData.core && o.material.emissive) o.material.emissiveIntensity = 1.2;
  });
  playTone(190 + state.laws.size * 40, 0.35, 'sine', 0.045);
  openDialogue({ kicker: 'Legge della macchina', title: d.title, html: d.body, onClose: () => {
    if (state.laws.size === 3) {
      setObjective('Raggiungi la porta: la filosofia sta per diventare esperienza.');
      showToast('La macchina è completa. Ora entra nella vita di Foscolo.');
    } else {
      setObjective(`Scopri ancora ${3 - state.laws.size} ${state.laws.size === 2 ? 'legge' : 'leggi'} del mondo meccanico.`);
    }
  }});
}

function discoverFracture(id, island) {
  const data = {
    esilio: {
      title: 'Esilio e sradicamento',
      html: `<p>Zacinto non è soltanto un luogo perduto. È la prova che l’identità può essere separata dalla propria terra.</p><p>Nasce una ferita: <strong>non appartengo stabilmente a nessun luogo</strong>. L’illusione della patria diventa necessaria proprio perché la patria reale manca.</p>`,
      journal: 'L’esilio trasforma la patria da territorio posseduto a valore desiderato.',
      effects: { patria: 18, memoria: 8 }, pressure: 14
    },
    giovanni: {
      title: 'La morte di Giovanni',
      html: `<p>La morte del fratello rende concreta la conseguenza più dura del materialismo.</p><p>Il nulla non è più un’ipotesi filosofica. Foscolo deve inventare una continuità diversa: <strong>affetti, memoria, poesia</strong>.</p>`,
      journal: 'Quando la morte distrugge il corpo, resta la relazione custodita da chi ricorda.',
      effects: { memoria: 24, amore: 10 }, pressure: 16
    },
    campoformio: {
      title: 'Campoformio, 1797',
      html: `<p>Napoleone cede Venezia all’Austria. Gli ideali rivoluzionari vengono scambiati come territori su una carta.</p><p>La storia rivela di non essere giusta né provvidenziale. È guidata dall’interesse. Per questo la <strong>patria ideale</strong> entra nell’Ortis già ferita.</p>`,
      journal: 'La delusione politica diventa crisi morale: la storia può tradire le parole con cui si legittima.',
      effects: { patria: 25, arte: 8 }, pressure: 18
    }
  }[id];
  if (state.fractures.has(id)) {
    showToast(`${data.title}: la frattura resta aperta.`);
    return;
  }
  state.fractures.add(id);
  Object.entries(data.effects).forEach(([k, v]) => changeIllusion(k, v));
  changePressure(data.pressure);
  addJournal(`fracture-${id}`, data.title, data.journal);
  island.traverse((o) => { if (o.isMesh && o.material?.emissive) o.material.emissiveIntensity = 0.8; });
  playTone(110 + state.fractures.size * 35, 0.45, 'triangle', 0.04);
  openDialogue({ kicker: 'Frattura biografica e storica', title: data.title, html: data.html, onClose: () => {
    if (state.fractures.size === 3) {
      setObjective('Entra nel manoscritto e costruisci le illusioni di Jacopo.');
      showToast('Le tre fratture convergono nella stessa domanda: come vivere senza un senso già dato?');
    } else {
      setObjective(`Attraversa ancora ${3 - state.fractures.size} ${state.fractures.size === 2 ? 'frattura' : 'fratture'}.`);
    }
  }});
}

function openIllusionChoice() {
  if (state.written.size >= 3) {
    showToast('Il destino narrativo è ormai in movimento. Le lettere stanno per chiudersi.');
    return;
  }
  state.modal = true;
  state.paused = true;
  choiceButtons.innerHTML = '';
  Object.entries(illusionInfo).forEach(([key, info]) => {
    const b = document.createElement('button');
    b.className = 'choice-option';
    b.disabled = state.written.has(key);
    b.innerHTML = `<strong>${info.title}</strong><span>${state.written.has(key) ? 'Già affidata a Jacopo.' : info.desc}</span>`;
    b.addEventListener('click', () => writeIllusion(key));
    choiceButtons.appendChild(b);
  });
  choice.classList.remove('hidden');
  releasePointer();
}

function writeIllusion(key) {
  if (state.written.has(key) || state.written.size >= 3) return;
  choice.classList.add('hidden');
  state.written.add(key);
  illusionOrbs[key].visible = true;
  changeIllusion(key, 46);
  changePressure(7);
  addJournal(`illusion-${key}`, `Illusione: ${illusionInfo[key].title}`, illusionInfo[key].desc);
  playChord(key);

  const counter = {
    patria: { title: 'La patria contro la storia', loss: 22, text: 'Campoformio ha già consumato il sacrificio della patria. L’ideale resta nobile, ma non possiede uno Stato in cui incarnarsi.' },
    amore: { title: 'Teresa è promessa a Odoardo', loss: 24, text: 'L’amore offre a Jacopo un assoluto privato. Le convenzioni economiche e familiari lo rendono però irrealizzabile.' },
    memoria: { title: 'Ricordare non restituisce', loss: 13, text: 'La memoria conserva il legame, ma non annulla la morte né riporta Jacopo presso la madre.' },
    arte: { title: 'La parola non modifica i fatti', loss: 10, text: 'Scrivere ordina il dolore e lo trasmette. Non può però cambiare il trattato, il matrimonio o l’esilio.' },
    bellezza: { title: 'La natura resta indifferente', loss: 10, text: 'La bellezza sospende la ferita; la materia continua il proprio corso senza riconoscere il bisogno umano.' }
  }[key];

  setObjective(`Costruisci ancora ${3 - state.written.size} ${state.written.size === 2 ? 'illusione' : 'illusioni'} per Jacopo.`);
  openDialogue({
    kicker: `Illusione costruita · ${illusionInfo[key].title}`,
    title: counter.title,
    html: `<p>${counter.text}</p><p>L’illusione non è falsa perché fragile. È <strong>necessaria proprio perché la realtà non la garantisce</strong>.</p>`,
    onClose: () => {
      changeIllusion(key, -counter.loss);
      changePressure(6);
      if (state.written.size >= 3) beginEnding();
      else resumeGame();
    }
  });
}

function beginEnding() {
  setObjective('Assisti allo scontro finale tra il manoscritto e la realtà.');
  openDialogue({
    kicker: 'Il gioco che non si vince',
    title: 'Le illusioni non bastano a Jacopo',
    html: `<p>Hai costruito tre forme di senso. Ma Jacopo vive dentro una struttura tragica: <strong>patria tradita, amore impossibile, esilio, solitudine</strong>.</p><p>Non esiste una combinazione corretta che cancelli questi fatti. Il valore del gioco è nel tentativo, non nella vittoria.</p>`,
    onClose: () => {
      state.modal = false;
      state.ending = true;
      cinematic = true;
      cinematicStart = performance.now();
      state.pressure = 100;
      updateHUD();
      releasePointer();
      setTimeout(showEnding, 4200);
    }
  });
}

function showEnding() {
  cinematic = false;
  hud.classList.add('hidden');
  crosshair.classList.add('hidden');
  interactionPrompt.classList.add('hidden');
  mobileControls.classList.add('hidden');
  endingSummary.innerHTML = '';
  const chosen = [...state.written];
  chosen.forEach((key) => {
    const article = document.createElement('article');
    const finalValue = Math.round(state.illusions[key]);
    article.innerHTML = `<strong>${illusionInfo[key].title} · ${finalValue}%</strong><span>${endingTextFor(key)}</span>`;
    endingSummary.appendChild(article);
  });
  ending.classList.add('screen--active');
  playTone(73, 1.8, 'sine', 0.035);
}

function endingTextFor(key) {
  const texts = {
    patria: 'È stata tradita dalla storia, ma resta un criterio con cui giudicare la storia.',
    amore: 'Non salva Jacopo, ma rende visibile quanto radicale sia il suo bisogno di legame.',
    memoria: 'Non vince biologicamente la morte; la contraddice nella coscienza dei vivi.',
    arte: 'Non cambia gli eventi, ma trasforma la sconfitta in opera condivisibile.',
    bellezza: 'Non elimina la brutalità; apre uno spazio umano dentro di essa.'
  };
  return texts[key];
}

function switchChapter(index) {
  state.chapter = index;
  machineGroup.visible = index === 0;
  fracturesGroup.visible = index === 1;
  ortisGroup.visible = index === 2;
  camera.position.set(0, 1.72, index === 2 ? 6.8 : 8.5);
  yaw = 0; pitch = 0;
  camera.rotation.set(0, 0, 0);
  if (index === 0) {
    scene.background.set(0x0b1118); scene.fog.color.set(0x0b1118); scene.fog.density = 0.028;
    keyLight.color.set(0xd3e3f0); fillLight.color.set(0x776a58); rimLight.color.set(0xb37848);
  } else if (index === 1) {
    scene.background.set(0x20272a); scene.fog.color.set(0x20272a); scene.fog.density = 0.022;
    keyLight.color.set(0xc6d2cf); fillLight.color.set(0x6d6a5b); rimLight.color.set(0x8f5c45);
    setObjective('Attraversa le tre fratture che trasformano la teoria in esperienza.');
  } else {
    scene.background.set(0x161311); scene.fog.color.set(0x161311); scene.fog.density = 0.025;
    keyLight.color.set(0xe2d2b5); fillLight.color.set(0x6a4f45); rimLight.color.set(0x745b82);
    setObjective('Alla scrivania, affida tre illusioni a Jacopo.');
    changeIllusion('arte', 10); changeIllusion('bellezza', 10);
  }
  updateHUD();
  resumeGame();
  playTone(140 + index * 55, 0.7, 'sine', 0.04);
}

function openDialogue({ kicker, title, html, onClose = null }) {
  state.modal = true;
  state.paused = true;
  dialogueKicker.textContent = kicker;
  dialogueTitle.textContent = title;
  dialogueBody.innerHTML = html;
  dialogueCallback = onClose;
  dialogue.classList.remove('hidden');
  releasePointer();
}

function closeDialogue() {
  dialogue.classList.add('hidden');
  const cb = dialogueCallback;
  dialogueCallback = null;
  state.modal = false;
  if (cb) cb();
  if (!state.modal && !state.ending && dialogue.classList.contains('hidden') && choice.classList.contains('hidden')) {
    resumeGame();
  }
}

function resumeGame() {
  state.modal = false;
  if (!state.started || state.ending) return;
  if (isTouch) state.paused = false;
  else {
    state.paused = document.pointerLockElement !== canvas;
    canvas.requestPointerLock?.();
  }
}

function releasePointer() {
  if (document.pointerLockElement) document.exitPointerLock?.();
}

function setObjective(text) {
  state.objective = text;
  objectiveText.textContent = text;
}

function changePressure(amount) {
  state.pressure = THREE.MathUtils.clamp(state.pressure + amount, 0, 100);
  updateHUD();
}

function changeIllusion(key, amount) {
  state.illusions[key] = THREE.MathUtils.clamp(state.illusions[key] + amount, 0, 100);
  updateHUD();
}

function updateHUD() {
  chapterNumber.textContent = roman[state.chapter];
  chapterTitle.textContent = chapterNames[state.chapter];
  objectiveText.textContent = state.objective;
  const p = Math.round(state.pressure);
  pressureValue.textContent = `${p}%`;
  pressureBar.style.width = `${p}%`;
  document.querySelectorAll('#illusion-strip [data-key]').forEach((el) => {
    const key = el.dataset.key;
    el.querySelector('i').style.width = `${Math.round(state.illusions[key])}%`;
  });
}

function addJournal(id, title, text) {
  if (state.journal.some((entry) => entry.id === id)) return;
  state.journal.push({ id, title, text });
  renderJournal();
}

function renderJournal() {
  if (!state.journal.length) {
    journalContent.innerHTML = `<p class="journal-empty">Il taccuino è ancora vuoto. Avvicinati agli oggetti, guardali e interagisci: le idee raccolte qui formeranno la tua mappa del pensiero foscoliano.</p>`;
    return;
  }
  journalContent.innerHTML = state.journal.map((e) => `<article class="journal-entry"><h3>${e.title}</h3><p>${e.text}</p></article>`).join('');
}

function toggleJournal(force) {
  const shouldOpen = typeof force === 'boolean' ? force : !journal.classList.contains('open');
  journal.classList.toggle('open', shouldOpen);
  journal.setAttribute('aria-hidden', String(!shouldOpen));
  state.paused = shouldOpen || (!isTouch && document.pointerLockElement !== canvas);
  if (shouldOpen) releasePointer(); else resumeGame();
}

function showToast(text, duration = 3200) {
  clearTimeout(toastTimer);
  toast.textContent = text;
  toast.classList.remove('hidden');
  toast.style.transform = 'translate(-50%, 0)';
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
    toast.style.transform = 'translate(-50%, -8px)';
  }, duration);
}

function findInteractable() {
  if (!state.started || state.paused || state.modal || state.ending) return null;
  camera.getWorldDirection(tmpV);
  let best = null;
  let bestScore = Infinity;
  for (const object of interactables) {
    if (!isObjectVisible(object)) continue;
    object.getWorldPosition(tmpV2);
    const distance = camera.position.distanceTo(tmpV2);
    if (distance > 5.4) continue;
    const to = tmpV2.clone().sub(camera.position).normalize();
    const dot = tmpV.dot(to);
    if (dot < 0.82) continue;
    const score = distance + (1 - dot) * 8;
    if (score < bestScore) { bestScore = score; best = object; }
  }
  return best;
}

function isObjectVisible(object) {
  let current = object;
  while (current) {
    if (current.visible === false) return false;
    current = current.parent;
  }
  return true;
}

function performInteraction() {
  if (state.modal || state.ending) return;
  const target = currentInteractable || findInteractable();
  if (target?.userData.interaction) {
    target.userData.interaction.action();
    playTone(320, 0.08, 'square', 0.012);
  }
}

function bindEvents() {
  startButton.addEventListener('click', () => {
    state.started = true;
    state.paused = false;
    startScreen.classList.remove('screen--active');
    hud.classList.remove('hidden');
    crosshair.classList.remove('hidden');
    if (isTouch) {
      mobileControls.classList.remove('hidden');
      mobileControls.setAttribute('aria-hidden', 'false');
    } else {
      canvas.requestPointerLock?.();
    }
    initAudio();
    addJournal('start', 'La domanda iniziale', 'Come si vive dentro un mondo che non possiede un senso prestabilito?');
    showToast('Guarda gli altari della macchina. Avvicinati e interagisci.');
  });

  canvas.addEventListener('click', () => {
    if (state.started && !isTouch && !state.modal && !journal.classList.contains('open') && !state.ending) canvas.requestPointerLock?.();
  });

  document.addEventListener('pointerlockchange', () => {
    if (!isTouch && state.started && !state.modal && !state.ending && !journal.classList.contains('open')) {
      state.paused = document.pointerLockElement !== canvas;
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== canvas || state.paused || state.modal) return;
    yaw -= e.movementX * 0.0021;
    pitch -= e.movementY * 0.0019;
    pitch = THREE.MathUtils.clamp(pitch, -1.28, 1.28);
  });

  document.addEventListener('keydown', (e) => {
    keys.add(e.code);
    if (e.code === 'KeyE') performInteraction();
    if (e.code === 'KeyJ') toggleJournal();
    if (e.code === 'Escape' && journal.classList.contains('open')) toggleJournal(false);
  });
  document.addEventListener('keyup', (e) => keys.delete(e.code));

  dialogueNext.addEventListener('click', closeDialogue);
  choiceCancel.addEventListener('click', () => { choice.classList.add('hidden'); state.modal = false; resumeGame(); });
  $('journal-close').addEventListener('click', () => toggleJournal(false));
  mobileAction.addEventListener('pointerdown', (e) => { e.preventDefault(); performInteraction(); });
  mobileJournal.addEventListener('pointerdown', (e) => { e.preventDefault(); toggleJournal(); });
  audioButton.addEventListener('click', () => setAudio(!state.audioOn));
  restartButton.addEventListener('click', () => location.reload());
  addEventListener('resize', onResize);

  setupTouchControls();
}

function setupTouchControls() {
  if (!isTouch) return;
  let joyId = null;
  let joyCenter = { x: 0, y: 0 };
  joystick.addEventListener('pointerdown', (e) => {
    joyId = e.pointerId;
    joystick.setPointerCapture(e.pointerId);
    const r = joystick.getBoundingClientRect();
    joyCenter = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    updateJoystick(e);
  });
  joystick.addEventListener('pointermove', (e) => { if (e.pointerId === joyId) updateJoystick(e); });
  const endJoy = (e) => {
    if (e.pointerId !== joyId) return;
    joyId = null; mobileMove.set(0, 0); joystickKnob.style.transform = 'translate(0px, 0px)';
  };
  joystick.addEventListener('pointerup', endJoy); joystick.addEventListener('pointercancel', endJoy);
  function updateJoystick(e) {
    const dx = e.clientX - joyCenter.x, dy = e.clientY - joyCenter.y;
    const len = Math.hypot(dx, dy) || 1, max = 31;
    const scale = Math.min(1, max / len);
    const x = dx * scale, y = dy * scale;
    joystickKnob.style.transform = `translate(${x}px, ${y}px)`;
    mobileMove.set(x / max, -y / max);
  }

  let lookId = null, lastX = 0, lastY = 0;
  lookZone.addEventListener('pointerdown', (e) => {
    lookId = e.pointerId; lastX = e.clientX; lastY = e.clientY; lookZone.setPointerCapture(e.pointerId);
  });
  lookZone.addEventListener('pointermove', (e) => {
    if (e.pointerId !== lookId || state.paused || state.modal) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    yaw -= dx * 0.006; pitch -= dy * 0.005;
    pitch = THREE.MathUtils.clamp(pitch, -1.28, 1.28);
  });
  const endLook = (e) => { if (e.pointerId === lookId) lookId = null; };
  lookZone.addEventListener('pointerup', endLook); lookZone.addEventListener('pointercancel', endLook);
}

function onResize() {
  if (!camera || !renderer) return;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, isTouch ? 1.35 : 1.8));
}

function updateMovement(dt, time) {
  if (state.paused || state.modal || state.ending || cinematic) return;
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;

  const inputX = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0) + mobileMove.x;
  const inputZ = (keys.has('KeyW') ? 1 : 0) - (keys.has('KeyS') ? 1 : 0) + mobileMove.y;
  const input = new THREE.Vector2(inputX, inputZ);
  if (input.lengthSq() > 1) input.normalize();
  const speed = keys.has('ShiftLeft') ? 6.1 : 4.05;

  camera.getWorldDirection(tmpV);
  tmpV.y = 0; tmpV.normalize();
  tmpV2.crossVectors(tmpV, camera.up).normalize();
  camera.position.addScaledVector(tmpV, input.y * speed * dt);
  camera.position.addScaledVector(tmpV2, input.x * speed * dt);

  const moving = input.lengthSq() > 0.04;
  camera.position.y = 1.72 + (moving ? Math.sin(time * 8.5) * 0.028 : 0);

  let maxRadius = state.chapter === 2 ? 14.1 : 15.2;
  if (state.chapter === 2 && ortisWalls) {
    const inward = Math.max(0, (state.pressure - 54) / 46) * 9.1;
    maxRadius = 14.1 - inward * 0.5;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -14.1 + inward + 0.9, 14.1 - inward - 0.9);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -15.0, 8.5);
  } else {
    const radial = Math.hypot(camera.position.x, camera.position.z);
    if (radial > maxRadius) {
      camera.position.x *= maxRadius / radial;
      camera.position.z *= maxRadius / radial;
    }
  }
}

function updateInteractions(time) {
  if (!state.started || state.paused || state.modal || state.ending || cinematic) {
    interactionPrompt.classList.add('hidden');
    currentInteractable = null;
    return;
  }
  currentInteractable = findInteractable();
  if (currentInteractable) {
    interactionText.textContent = currentInteractable.userData.interaction.label;
    interactionPrompt.classList.remove('hidden');
    currentInteractable.scale.setScalar(1 + Math.sin(time * 4) * 0.008);
  } else {
    interactionPrompt.classList.add('hidden');
  }
}

function updateAnimated(dt, time) {
  for (const a of animated) {
    if (a.chapter !== null && a.chapter !== undefined && a.chapter !== state.chapter) continue;
    if (!isObjectVisible(a.object)) continue;
    if (a.type === 'gear') a.object.rotation.z += a.speed * dt * (1 + state.pressure / 80);
    else if (a.type === 'float') {
      a.object.position.y = a.baseY + Math.sin(time * a.speed + a.phase) * 0.18;
      a.object.rotation.y += dt * 0.4;
    } else if (a.type === 'portal') {
      a.object.material.opacity = 0.56 + Math.sin(time * a.speed) * 0.12;
    } else if (a.type === 'dust') {
      a.object.rotation.y += a.speed * dt;
      a.object.position.y = Math.sin(time * 0.08) * 0.25;
    } else if (a.type === 'page') {
      a.object.rotation.x += dt * a.speed * 0.35;
      a.object.rotation.y += dt * a.speed * 0.24;
      a.object.position.y += Math.sin(time * a.speed + a.phase) * dt * 0.08;
    } else if (a.type === 'halo') a.object.rotation.z += dt * a.speed;
    else if (a.type === 'orb') {
      a.object.rotation.y += dt * a.speed;
      a.object.position.y += Math.sin(time * a.speed + a.phase) * dt * 0.05;
    }
  }
  if (state.chapter === 2 && ortisWalls) {
    const inward = Math.max(0, (state.pressure - 54) / 46) * 9.1;
    ortisWalls.global.position.x = -15.4 + inward;
    ortisWalls.personal.position.x = 15.4 - inward;
  }
}

function updateCinematic(now) {
  if (!cinematic || !ortisWalls) return;
  const t = Math.min(1, (now - cinematicStart) / 4000);
  const eased = 1 - Math.pow(1 - t, 3);
  ortisWalls.global.position.x = THREE.MathUtils.lerp(-6.3, -1.25, eased);
  ortisWalls.personal.position.x = THREE.MathUtils.lerp(6.3, 1.25, eased);
  camera.position.z = THREE.MathUtils.lerp(5.5, -1.0, eased);
  camera.position.x = Math.sin(now * 0.006) * 0.035 * t;
  yaw = Math.sin(now * 0.0015) * 0.04;
  pitch = -0.05 + t * 0.08;
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
  renderer.toneMappingExposure = THREE.MathUtils.lerp(1.05, 0.58, eased);
}

function animate(now = 0) {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const time = now / 1000;
  updateMovement(dt, time);
  updateInteractions(time);
  updateAnimated(dt, time);
  updateCinematic(now);
  renderer.render(scene, camera);
}

function initAudio() {
  if (audioCtx) { audioCtx.resume(); return; }
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = state.audioOn ? 0.55 : 0;
    masterGain.connect(audioCtx.destination);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 310; filter.Q.value = 0.7;
    filter.connect(masterGain);
    [43, 64.5, 87].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = i === 0 ? 'sawtooth' : 'sine';
      osc.frequency.value = freq;
      gain.gain.value = [0.018, 0.012, 0.007][i];
      osc.connect(gain).connect(filter); osc.start();
      droneNodes.push(osc, gain);
    });
  } catch (e) {
    console.warn('Audio non disponibile', e);
  }
}

function setAudio(on) {
  state.audioOn = on;
  audioButton.textContent = on ? '◉' : '○';
  if (audioCtx && masterGain) masterGain.gain.setTargetAtTime(on ? 0.55 : 0, audioCtx.currentTime, 0.08);
}

function playTone(freq = 220, duration = 0.2, type = 'sine', volume = 0.025) {
  if (!audioCtx || !masterGain || !state.audioOn) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type; osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.connect(gain).connect(masterGain); osc.start(); osc.stop(audioCtx.currentTime + duration + 0.03);
}

function playChord(key) {
  const chords = {
    patria: [196, 246.94, 293.66],
    amore: [220, 261.63, 329.63],
    memoria: [174.61, 220, 261.63],
    arte: [207.65, 261.63, 311.13],
    bellezza: [233.08, 293.66, 349.23]
  };
  chords[key].forEach((f, i) => setTimeout(() => playTone(f, 0.7, 'sine', 0.025), i * 85));
}
