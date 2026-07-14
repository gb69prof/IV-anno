/* Italia 1861 — Il cantiere dell'Unità
   Gioco didattico 3D a blocchi, a cura di gbprof e Libera. */

(() => {
  'use strict';

  const $ = (q) => document.querySelector(q);
  const gameRoot = $('#game');
  const startScreen = $('#start-screen');
  const hud = $('#hud');
  const modal = $('#modal');
  const modalContent = $('#modal-content');
  const pause = $('#pause');
  const promptEl = $('#interaction-prompt');
  const toastEl = $('#toast');
  const SAVE_KEY = 'italia1861-cantiere-v1';
  const isTouchDevice = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  const touchUi = $('#touch-ui');
  const rotateDevice = $('#rotate-device');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9fc5d5);
  scene.fog = new THREE.Fog(0x9fc5d5, 28, 82);
  const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.08, 140);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  gameRoot.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xdaf2ff, 0x7d684a, 2.2));
  const sun = new THREE.DirectionalLight(0xfff0ca, 2.6);
  sun.position.set(-24, 35, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -48;
  sun.shadow.camera.right = 48;
  sun.shadow.camera.top = 28;
  sun.shadow.camera.bottom = -28;
  scene.add(sun);

  const materials = {};
  const materialData = {
    grass: [0x618c49, 0x6f9a54, 0x577f42], dirt: [0x8a6948], stone: [0x777c7b, 0x8a8f8e],
    road: [0xbba982, 0xc7b993], wood: [0x765039], leaf: [0x3f743f, 0x4f854a],
    brick: [0x9c5c4e], cream: [0xd9c9a4], roof: [0x7c3e39], red: [0xb7353f],
    white: [0xe7e1d4], green: [0x2b714c], blue: [0x315d80], gold: [0xd8a936],
    black: [0x24292e], sand: [0xd0b978], crate: [0x9a7040], darkstone: [0x4e555a],
    diplomacy: [0x3679a7], alliance: [0xd3a432], conflict: [0xb52e38],
    people: [0xd96b32], legitimacy: [0x6c4b91]
  };
  for (const [key, colors] of Object.entries(materialData)) {
    materials[key] = colors.map(c => new THREE.MeshLambertMaterial({ color: c, flatShading: true }));
  }
  const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
  const worldBlocks = [];
  const mineables = [];
  const colliders = [];
  const interactables = [];
  const pads = [];
  let activeMarker = null;

  function mat(type, variant = 0) {
    const list = materials[type] || materials.stone;
    return list[variant % list.length];
  }

  function cube(x, y, z, type = 'stone', options = {}) {
    const mesh = new THREE.Mesh(blockGeometry, mat(type, options.variant || 0));
    const scale = options.scale || [1, 1, 1];
    mesh.position.set(x, y, z);
    mesh.scale.set(scale[0], scale[1], scale[2]);
    mesh.castShadow = options.castShadow !== false;
    mesh.receiveShadow = options.receiveShadow !== false;
    mesh.userData = { type, mineable: !!options.mineable, label: options.label || '' };
    scene.add(mesh);
    worldBlocks.push(mesh);
    if (options.mineable) mineables.push(mesh);
    if (options.solid) colliders.push(mesh);
    return mesh;
  }

  function labelSprite(text, color = '#172028', scale = 1) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '900 34px system-ui';
    const width = Math.ceil(ctx.measureText(text).width) + 50;
    canvas.width = Math.max(220, width);
    canvas.height = 74;
    ctx.fillStyle = 'rgba(246,239,220,.94)';
    ctx.fillRect(4, 4, canvas.width - 8, canvas.height - 8);
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    ctx.fillStyle = color;
    ctx.font = '900 34px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 1);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    sprite.scale.set((canvas.width / 74) * scale, scale, 1);
    return sprite;
  }

  function zoneLabel(x, text, year) {
    const group = new THREE.Group();
    const title = labelSprite(text, '#21333e', 1.05);
    title.position.y = 4.7;
    const date = labelSprite(year, '#a42d37', .7);
    date.position.y = 3.85;
    group.add(title, date);
    group.position.set(x, 0, -5.5);
    scene.add(group);
  }

  function makeNPC(x, z, colors, name, stage) {
    const g = new THREE.Group();
    const body = cubePart(0, 1.15, 0, colors.body, [0.82, 1.05, .45]);
    const head = cubePart(0, 2.13, 0, colors.skin || 0xd1a477, [.62, .62, .62]);
    const hair = cubePart(0, 2.46, -.02, colors.hair || 0x47372c, [.66, .16, .66]);
    const armL = cubePart(-.55, 1.15, 0, colors.body, [.22, .95, .26]);
    const armR = cubePart(.55, 1.15, 0, colors.body, [.22, .95, .26]);
    const legL = cubePart(-.22, .38, 0, colors.legs || 0x292e35, [.3, .65, .34]);
    const legR = cubePart(.22, .38, 0, colors.legs || 0x292e35, [.3, .65, .34]);
    g.add(body, head, hair, armL, armR, legL, legR);
    if (colors.sash) {
      const sash = cubePart(.22, 1.2, -.25, colors.sash, [.16, .95, .06]);
      sash.rotation.z = -.4;
      g.add(sash);
    }
    const tag = labelSprite(name, '#172028', .5);
    tag.position.y = 3.15;
    g.add(tag);
    g.position.set(x, 0, z);
    g.userData = { kind: 'npc', stage, name };
    scene.add(g);
    interactables.push(g);
    return g;
  }

  function cubePart(x, y, z, color, scale) {
    const material = new THREE.MeshLambertMaterial({ color, flatShading: true });
    const mesh = new THREE.Mesh(blockGeometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(...scale);
    mesh.castShadow = true;
    return mesh;
  }

  function tree(x, z, height = 2.5) {
    cube(x, height / 2, z, 'wood', { scale: [.55, height, .55], solid: true });
    cube(x, height + .35, z, 'leaf', { scale: [1.8, 1.5, 1.8], solid: true, variant: (x + z) & 1 });
    cube(x + .45, height + 1.05, z, 'leaf', { scale: [1.2, 1, 1.2], solid: true, variant: 1 });
  }

  function flag(x, y, z, rotation = 0) {
    const g = new THREE.Group();
    const pole = cubePart(0, 1.5, 0, 0x5b4938, [.12, 3, .12]);
    const f1 = cubePart(.34, 2.4, 0, 0x2b714c, [.62, 1, .12]);
    const f2 = cubePart(.95, 2.4, 0, 0xe7e1d4, [.62, 1, .12]);
    const f3 = cubePart(1.56, 2.4, 0, 0xb7353f, [.62, 1, .12]);
    g.add(pole, f1, f2, f3);
    g.position.set(x, y, z);
    g.rotation.y = rotation;
    scene.add(g);
  }

  function buildWorld() {
    // Acqua e “sentiero del tempo”. La geografia è deliberatamente simbolica.
    const water = new THREE.Mesh(new THREE.PlaneGeometry(120, 55), new THREE.MeshLambertMaterial({ color: 0x4d8aa1, transparent: true, opacity: .9 }));
    water.rotation.x = -Math.PI / 2;
    water.position.y = -1.03;
    scene.add(water);

    for (let x = -38; x <= 39; x++) {
      const halfWidth = 7 + Math.floor(2 * Math.sin((x + 12) * .2));
      for (let z = -halfWidth; z <= halfWidth; z++) {
        const edge = Math.abs(z) > halfWidth - 2;
        cube(x, -.5, z, edge ? 'dirt' : 'grass', { castShadow: false, variant: Math.abs(x * 7 + z * 3) % 3 });
      }
      cube(x, .02, 0, 'road', { scale: [1, .12, 1.7], castShadow: false, variant: Math.abs(x) % 2 });
    }

    // Torino: palazzo e tavolo diplomatico.
    for (let z = -4; z <= 4; z++) for (let y = 0; y < 4; y++) cube(-34, y + .5, z, 'cream', { solid: true, variant: y % 2 });
    for (let z = -4; z <= 4; z += 2) cube(-33.45, 1.8, z, 'blue', { scale: [.12, 1.2, .7] });
    for (let z = -4.5; z <= 4.5; z++) cube(-34, 4.3, z, 'roof', { scale: [1.6, .7, 1] });
    cube(-29, .35, 2.6, 'wood', { scale: [2.4, .7, 1.2], solid: true });
    cube(-30, 1.1, 2.6, 'wood', { scale: [.25, 1.4, .25] });
    cube(-28, 1.1, 2.6, 'wood', { scale: [.25, 1.4, .25] });
    zoneLabel(-29, 'TORINO', '1855–1856');

    // Plombières: bosco e carrozza.
    tree(-20, -4); tree(-15, -4); tree(-19, 4); tree(-14, 4);
    cube(-17, .75, 2.8, 'brick', { scale: [2.5, 1.5, 1.35], solid: true });
    cube(-18.1, .35, 3.7, 'black', { scale: [.75, .75, .35] });
    cube(-15.9, .35, 3.7, 'black', { scale: [.75, .75, .35] });
    cube(-17, 1.7, 2.8, 'roof', { scale: [2.7, .4, 1.5] });
    zoneLabel(-17, 'PLOMBIÈRES', '21 luglio 1858');

    // Campo di battaglia 1859.
    for (let i = 0; i < 12; i++) {
      const x = -9 + (i * 7 % 13);
      const z = -5 + (i * 5 % 10);
      cube(x, .4, z, 'darkstone', { scale: [.8, .8, .8], mineable: true, label: 'Roccia scavabile', variant: i });
    }
    for (let z = -4; z <= 4; z += 2) cube(-3, .55, z, 'wood', { scale: [.25, 1.1, 1.7], solid: true });
    flag(-7, 0, -3); flag(1, 0, 3, Math.PI);
    zoneLabel(-4, 'LOMBARDIA', '1859');

    // Marsala: molo, nave e casse.
    for (let x = 7; x <= 14; x++) cube(x, .15, 5.5, 'wood', { scale: [1, .3, 2.2], solid: true });
    cube(12, .7, 7.1, 'darkstone', { scale: [5.8, 1.2, 1.5], solid: true });
    cube(11, 1.7, 7.1, 'wood', { scale: [2.5, 1.1, 1.25], solid: true });
    cube(12, 3.1, 7.1, 'wood', { scale: [.15, 3.7, .15] });
    flag(12, 1.6, 7.1);
    const cratePos = [[7,2.4],[10,-3.6],[14,2.2]];
    cratePos.forEach((p, i) => {
      const c = cube(p[0], .48, p[1], 'crate', { scale: [.95,.95,.95], solid: true });
      c.userData = { kind: 'crate', crateId: i, label: 'Cassa dei volontari' };
      interactables.push(c);
    });
    zoneLabel(10, 'MARSALA', '11 maggio 1860');

    // Teano e urne plebiscitarie.
    for (let x = 18; x <= 26; x++) for (let z = -4; z <= 4; z += 4) cube(x, .3, z, 'stone', { scale: [1,.6,1], variant: x + z });
    const ballot = cube(20, .72, 2.8, 'wood', { scale: [1.15,1.45,1.15], solid: true });
    cube(20, 1.47, 2.8, 'black', { scale: [.62,.08,.14] });
    ballot.userData.label = 'Urna del plebiscito';
    zoneLabel(22, 'TEANO', '26 ottobre 1860');

    // Cantiere finale: cinque basamenti e fondazioni incomplete.
    for (let x = 29; x <= 38; x++) for (let z = -5; z <= 5; z++) {
      if (Math.abs(z) === 5 || x === 29 || x === 38) cube(x, .25, z, 'stone', { scale: [1,.5,1], variant: x+z });
    }
    const padPositions = [[31,2.4],[33,2.4],[35,2.4],[32,-2.2],[34,-2.2]];
    const concepts = ['Diplomazia','Alleanza','Conflitto','Iniziativa','Legittimazione'];
    padPositions.forEach((p, i) => {
      const pad = cube(p[0], .12, p[1], 'gold', { scale: [1.3,.22,1.3], solid: false });
      pad.userData = { kind: 'pad', require: i, label: `Basamento: ${concepts[i]}` };
      pads.push(pad);
    });
    cube(30, 1, -4, 'cream', { scale: [1.2,2,1.2], solid: true });
    cube(37, 1, -4, 'cream', { scale: [1.2,2,1.2], solid: true });
    zoneLabel(34, 'REGNO D’ITALIA', '17 marzo 1861');
    flag(36.5, 0, 3.8);

    // Confini naturali e dettagli.
    [-36,-25,-23,-12,4,16,27,39].forEach((x,i) => { tree(x, i%2 ? 6 : -6, 2.1 + (i%3)*.4); });
    for (let x = -36; x < 40; x += 4) {
      cube(x, .15, -8.4, 'stone', { scale: [2.8,.3,.55], solid: true, variant: x });
      cube(x, .15, 8.4, 'stone', { scale: [2.8,.3,.55], solid: true, variant: x+1 });
    }
  }

  const missions = [
    {
      title: 'Torino e la Crimea', kicker: 'CANTIERE 1/6 · 1855–1856', x: -29, z: -1.8,
      speaker: 'Camillo Benso di Cavour', heading: 'Una guerra lontana, un tavolo vicino',
      intro: 'Il Regno di Sardegna ha mandato circa 15.000 uomini in Crimea. È una scelta costosa e impopolare: non porta territori italiani e non garantisce compensi.',
      note: 'Il risultato decisivo arriva nel 1856: al Congresso di Parigi la questione italiana entra nella diplomazia europea. L’Austria, intanto, è più isolata.',
      question: 'Qual è la logica politica più importante della partecipazione piemontese?',
      answers: ['Conquistare immediatamente la Crimea.', 'Inserire il Piemonte fra le potenze europee e creare alleanze contro l’Austria.', 'Difendere militarmente il Regno delle Due Sicilie.'], correct: 1,
      reward: 'Diplomazia', rewardText: 'Hai sbloccato il blocco Diplomazia: la questione italiana esce dai confini della penisola.'
    },
    {
      title: 'L’accordo di Plombières', kicker: 'CANTIERE 2/6 · 1858', x: -17, z: -1.2,
      speaker: 'Napoleone III', heading: 'Due alleati, due progetti',
      intro: 'Cavour e l’imperatore francese progettano in segreto una guerra contro l’Austria. Ma la Francia non combatte gratis: vuole Nizza e Savoia e immagina un’Italia confederale sotto influenza francese.',
      note: 'L’intesa prevede un Regno dell’Alta Italia e una confederazione di quattro Stati. Cavour mira a espandere il Piemonte; Napoleone III vuole ridisegnare l’Europa senza creare un’Italia troppo forte.',
      question: 'Quale condizione deve verificarsi perché la Francia intervenga?',
      answers: ['L’Austria deve apparire come l’aggressore del Piemonte.', 'Il papa deve dichiarare guerra alla Francia.', 'Garibaldi deve conquistare Roma.'], correct: 0,
      reward: 'Alleanza', rewardText: 'Hai sbloccato il blocco Alleanza: l’aiuto francese rende possibile la guerra, ma pone limiti al progetto italiano.'
    },
    {
      title: 'Guerra e Villafranca', kicker: 'CANTIERE 3/6 · 1859', x: -4, z: -1.8,
      speaker: 'Un soldato piemontese', heading: 'La vittoria interrotta',
      intro: 'L’ultimatum austriaco del 23 aprile fa apparire Vienna come aggressore. Francesi e piemontesi vincono a Magenta e Solferino, ma Napoleone III interrompe improvvisamente la guerra.',
      note: 'A Villafranca la Lombardia passa al Piemonte, ma il Veneto resta austriaco. Il progetto di Plombières è spezzato e Cavour si dimette.',
      question: 'Perché Villafranca è una svolta ambigua?',
      answers: ['Perché annulla ogni risultato della guerra.', 'Perché consegna subito Roma a Vittorio Emanuele II.', 'Perché porta la Lombardia, ma ferma la guerra prima della conquista del Veneto.'], correct: 2,
      reward: 'Conflitto', rewardText: 'Hai sbloccato il blocco Conflitto: le vittorie militari aprono possibilità, ma la politica decide fin dove spingersi.'
    },
    {
      title: 'La spedizione dei Mille', kicker: 'CANTIERE 4/6 · 1860', x: 10, z: -.8,
      speaker: 'Giuseppe Garibaldi', heading: 'La rivoluzione e il suo limite',
      intro: 'I volontari partono da Quarto, sbarcano a Marsala e vincono a Calatafimi. L’impresa accende l’iniziativa dal basso, ma in Sicilia emergono anche richieste sociali che i dirigenti garibaldini non vogliono trasformare in rivoluzione.',
      note: 'A Bronte le rivolte contadine contro proprietari e latifondo vengono represse duramente. Unificazione politica e trasformazione sociale non coincidono.',
      question: 'Che cosa mostra soprattutto l’episodio di Bronte?',
      answers: ['Che tutti i contadini erano contrari a Garibaldi.', 'Che il movimento nazionale accolse alcune richieste popolari, ma non volle rovesciare l’ordine sociale.', 'Che i Borboni avevano già abolito il latifondo.'], correct: 1,
      reward: 'Iniziativa popolare', rewardText: 'Hai sbloccato il blocco Iniziativa popolare: senza volontari e insurrezioni la diplomazia non sarebbe bastata.'
    },
    {
      title: 'Plebisciti e Teano', kicker: 'CANTIERE 5/6 · 1860', x: 22, z: -1,
      speaker: 'Vittorio Emanuele II', heading: 'Dalla camicia rossa alla Corona',
      intro: 'I plebisciti legittimano le annessioni, anche se non hanno le garanzie di un referendum moderno. A Teano l’iniziativa garibaldina entra nel quadro monarchico sabaudo.',
      note: 'Il voto è spesso poco segreto e la propaganda contraria incontra ostacoli. Il risultato mostra comunque l’orientamento prevalente dei gruppi politicamente attivi.',
      question: 'Quale significato politico assume l’incontro di Teano?',
      answers: ['Garibaldi proclama la repubblica sociale.', 'Il re rinuncia al Mezzogiorno.', 'L’iniziativa volontaria viene ricondotta entro lo Stato monarchico.'], correct: 2,
      reward: 'Legittimazione', rewardText: 'Hai sbloccato il blocco Legittimazione: annessioni e monarchia cercano una base nel voto popolare.'
    }
  ];

  const archives = [
    ['Crimea e Parigi', 'La guerra non dà compensi immediati, ma consente al Piemonte di sedere fra le grandi potenze e di discutere la “questione italiana” l’8 aprile 1856.'],
    ['Plombières', 'L’accordo del luglio 1858 è un compromesso segreto: aiuto francese contro l’Austria in cambio di Nizza e Savoia, con progetti diversi sul futuro della penisola.'],
    ['1859 e Villafranca', 'L’ultimatum austriaco permette l’intervento francese. Dopo Magenta e Solferino, l’armistizio assegna la Lombardia ma lascia il Veneto all’Austria.'],
    ['I Mille e Bronte', 'La spedizione unisce iniziativa democratica e obiettivo nazionale. In Sicilia, però, le richieste contadine sulla terra entrano in conflitto con la difesa dell’ordine sociale.'],
    ['Plebisciti e Teano', 'Le consultazioni offrono legittimazione internazionale senza equivalere a referendum moderni. Teano simboleggia l’assorbimento dell’impresa garibaldina nella monarchia.'],
    ['L’Italia del 1861', 'Il Regno nasce con circa 22 milioni di abitanti; tre persone su quattro sopra i sei anni sono analfabete. Il voto riguarda meno del 2% della popolazione. Roma e Veneto restano fuori.']
  ];

  buildWorld();
  makeNPC(-29, -1.8, { body: 0x304b68, skin: 0xd4aa7d, hair: 0x5b3f2e }, 'CAVOUR', 0);
  makeNPC(-17, -1.2, { body: 0x3f3f64, skin: 0xd4aa7d, hair: 0x3b2d25, sash: 0xb7353f }, 'NAPOLEONE III', 1);
  makeNPC(-4, -1.8, { body: 0x365d4e, skin: 0xc9996f, hair: 0x443229, sash: 0xe7e1d4 }, 'SOLDATO', 2);
  makeNPC(10, -.8, { body: 0xb7353f, skin: 0xd0a176, hair: 0x9a8063, legs: 0x78664f }, 'GARIBALDI', 3);
  makeNPC(22, -1, { body: 0x2d4f73, skin: 0xd0a176, hair: 0x49362e, sash: 0xb7353f }, 'VITTORIO EMANUELE II', 4);
  const builder = makeNPC(34, .2, { body: 0x8c734e, skin: 0xc78e66, hair: 0x382b24, legs: 0x3d4248 }, 'CAPOMASTRO', 5);
  builder.userData.kind = 'builder';

  const conceptSlots = [
    { name: 'Diplomazia', color: '#3679a7' }, { name: 'Alleanza', color: '#d3a432' },
    { name: 'Conflitto', color: '#b52e38' }, { name: 'Iniziativa', color: '#d96b32' },
    { name: 'Legittimazione', color: '#6c4b91' }, { name: 'Pietra', color: '#777c7b' }
  ];

  let state = defaultState();
  let gameStarted = false;
  let uiOpen = false;
  let selectedSlot = 0;
  let currentNearby = null;
  let yaw = -Math.PI / 2;
  let pitch = 0;
  const keys = {};
  const velocity = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  raycaster.far = 5.3;
  const clock = new THREE.Clock();
  let audioEnabled = false;
  let audioCtx = null;
  let drone = null;
  let toastTimer = null;
  const touchMove = { x: 0, y: 0 };
  let movePointer = null;
  let lookPointer = null;
  let lookLastX = 0;
  let lookLastY = 0;
  let deferredInstallPrompt = null;

  function defaultState() {
    return { stage: 0, score: 0, errors: 0, crates: [], placed: [], startedAt: Date.now(), elapsed: 0, completed: false };
  }

  function save() {
    if (!gameStarted) return;
    state.elapsed = (state.elapsed || 0) + (Date.now() - state.startedAt);
    state.startedAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      return { ...defaultState(), ...JSON.parse(raw), startedAt: Date.now() };
    } catch { return null; }
  }

  function startGame(isContinue) {
    state = isContinue && load() ? load() : defaultState();
    if (!isContinue) localStorage.removeItem(SAVE_KEY);
    restoreWorldState();
    gameStarted = true;
    startScreen.hidden = true;
    hud.hidden = false;
    camera.position.set(isContinue ? missionPosition().x : -31.5, 1.72, isContinue ? missionPosition().z : 0);
    yaw = -Math.PI / 2;
    pitch = 0;
    updateHUD();
    save();
    if (isTouchDevice) {
      touchUi.hidden = false;
      updateOrientation();
    } else renderer.domElement.requestPointerLock();
  }

  function missionPosition() {
    if (state.stage < 5) return { x: missions[state.stage].x - 2.5, z: missions[state.stage].z };
    return { x: 30, z: 0 };
  }

  function restoreWorldState() {
    interactables.filter(x => x.userData.kind === 'crate').forEach(c => { c.visible = !state.crates.includes(c.userData.crateId); });
    pads.forEach((pad, i) => {
      const old = scene.getObjectByName(`concept-${i}`);
      if (old) scene.remove(old);
      if (state.placed.includes(i)) placeConceptVisual(pad, i);
    });
    renderHotbar();
    updateMarker();
    if (state.completed) buildArchTop();
  }

  function renderHotbar() {
    $('#hotbar').innerHTML = conceptSlots.map((slot, i) => {
      const unlocked = i === 5 || state.stage > i;
      return `<div class="slot ${selectedSlot === i ? 'selected' : ''} ${unlocked ? '' : 'locked'}" data-slot="${i}"><em>${i+1}</em><div class="cube" style="--cube:${slot.color}"></div><small>${unlocked ? slot.name : 'BLOCCATO'}</small></div>`;
    }).join('');
  }

  function updateHUD() {
    $('#score').textContent = state.score;
    if (state.stage < 5) {
      const m = missions[state.stage];
      $('#mission-kicker').textContent = m.kicker;
      $('#mission-title').textContent = m.title;
      $('#mission-objective').textContent = state.stage === 3 && state.crates.length < 3
        ? `Recupera le casse dei volontari: ${state.crates.length}/3. Avvicinati e premi E.`
        : `Raggiungi ${m.speaker} e premi E.`;
    } else if (!state.completed) {
      $('#mission-kicker').textContent = 'CANTIERE 6/6 · 1861';
      $('#mission-title').textContent = 'Costruisci l’Arco dell’Unità';
      $('#mission-objective').textContent = state.placed.length < 5
        ? `Seleziona i blocchi con 1–5 e posali sui basamenti con il tasto destro: ${state.placed.length}/5.`
        : 'Interpreta la costruzione appena completata.';
    } else {
      $('#mission-kicker').textContent = 'CANTIERE COMPLETATO';
      $('#mission-title').textContent = 'Il Regno è nato. Il lavoro no.';
      $('#mission-objective').textContent = 'Premi H per rileggere l’archivio o parla al capomastro per il rapporto finale.';
    }
    $('#mission-progress').style.width = `${Math.min(100, ((state.stage + (state.placed.length/5)) / 6) * 100)}%`;
    renderHotbar();
    updateMarker();
  }

  function updateMarker() {
    if (activeMarker) scene.remove(activeMarker);
    const pos = state.stage < 5 ? missions[state.stage] : { x: 34, z: .2 };
    const geom = new THREE.CylinderGeometry(.65, .65, 5, 18, 1, true);
    const material = new THREE.MeshBasicMaterial({ color: 0xf2c94c, transparent: true, opacity: .19, side: THREE.DoubleSide });
    activeMarker = new THREE.Mesh(geom, material);
    activeMarker.position.set(pos.x, 2.5, pos.z);
    scene.add(activeMarker);
  }

  function showMission(index) {
    const m = missions[index];
    if (!m) return;
    if (index === 3 && state.crates.length < 3) {
      openModal(`<p class="speaker">${m.speaker}</p><h2>Prima di salpare</h2><p>Una spedizione non vive di soli ideali. Cerca nel porto le tre casse dei volontari e portamele.</p><div class="historical-note"><b>Indizio</b><br>Le casse sono attorno al molo. Avvicinati e premi <b>E</b>.</div>`);
      return;
    }
    openModal(`<p class="speaker">${m.speaker}</p><h2>${m.heading}</h2><p>${m.intro}</p><div class="historical-note">${m.note}</div><p class="question">${m.question}</p><div class="answers">${m.answers.map((a,i)=>`<button class="answer" data-answer="${i}">${a}</button>`).join('')}</div><p class="feedback"></p>`, false);
    modalContent.querySelectorAll('[data-answer]').forEach(btn => {
      btn.addEventListener('click', () => answerMission(index, Number(btn.dataset.answer), btn));
    });
  }

  function answerMission(index, answer, btn) {
    const m = missions[index];
    const feedback = modalContent.querySelector('.feedback');
    if (answer !== m.correct) {
      btn.classList.add('wrong');
      state.errors++;
      feedback.textContent = 'Non regge storicamente. Rileggi gli indizi e prova ancora.';
      feedback.style.color = '#9b3439';
      tone(110, .16);
      save();
      setTimeout(() => btn.classList.remove('wrong'), 400);
      return;
    }
    modalContent.querySelectorAll('.answer').forEach(x => x.disabled = true);
    btn.classList.add('correct');
    state.score += state.errors === 0 ? 100 : 75;
    state.stage = index + 1;
    feedback.innerHTML = `<span style="color:#236b4c">✓ ${m.rewardText}</span>`;
    discover(m.reward, m.rewardText);
    tone(520, .18); setTimeout(() => tone(660, .2), 130);
    save();
    updateHUD();
    setTimeout(closeModal, 1500);
  }

  function collectCrate(mesh) {
    if (state.stage !== 3 || state.crates.includes(mesh.userData.crateId)) return;
    state.crates.push(mesh.userData.crateId);
    mesh.visible = false;
    state.score += 20;
    toast(`Cassa recuperata · ${state.crates.length}/3`);
    tone(360 + state.crates.length * 70, .12);
    save(); updateHUD();
    if (state.crates.length === 3) discover('Rifornimenti completi', 'Ora Garibaldi può affidarti il nodo storico della spedizione.');
  }

  function showBuilder() {
    if (state.completed) { showReport(); return; }
    if (state.placed.length < 5) {
      openModal(`<p class="speaker">Capomastro del Regno</p><h2>Le forze non si sommano da sole</h2><p>Hai raccolto cinque blocchi storici. Selezionali con i tasti <b>1–5</b>, mira al basamento con lo stesso nome e posa ogni blocco con il <b>tasto destro</b>.</p><div class="historical-note">Non stai costruendo un monumento perfetto. Roma e il Veneto sono ancora fuori dal Regno; cittadinanza, scuola e uguaglianza sociale sono fondamenta fragili.</div>`);
    } else showFinalQuestion();
  }

  function showFinalQuestion() {
    openModal(`<p class="speaker">Sintesi finale</p><h2>Chi ha fatto l’Italia?</h2><p>Guarda i cinque blocchi che hai dovuto usare. Nessuno avrebbe sostenuto l’arco da solo.</p><p class="question">Quale interpretazione spiega meglio il processo unitario?</p><div class="answers">
      <button class="answer" data-final="0">Fu esclusivamente una rivoluzione popolare guidata da Garibaldi.</button>
      <button class="answer" data-final="1">Nacque dalla convergenza conflittuale di monarchia, moderati, democratici e mutamenti internazionali.</button>
      <button class="answer" data-final="2">Fu soltanto una conquista militare piemontese priva di consenso.</button>
    </div><p class="feedback"></p>`, false);
    modalContent.querySelectorAll('[data-final]').forEach(btn => btn.addEventListener('click', () => {
      const answer = Number(btn.dataset.final);
      const feedback = modalContent.querySelector('.feedback');
      if (answer !== 1) {
        btn.classList.add('wrong'); state.errors++; save();
        feedback.textContent = 'È una spiegazione monocausale: lascia fuori troppi blocchi che hai appena usato.';
        setTimeout(() => btn.classList.remove('wrong'), 400); return;
      }
      state.score += 200;
      state.stage = 6;
      state.completed = true;
      save(); updateHUD(); buildArchTop(); tone(523,.15); setTimeout(()=>tone(659,.15),140); setTimeout(()=>tone(784,.35),280);
      feedback.innerHTML = '<span style="color:#236b4c">✓ L’arco regge. Ma la storia continua nelle sue crepe.</span>';
      setTimeout(showReport, 1300);
    }));
  }

  function showReport() {
    const elapsed = Math.round(((state.elapsed || 0) + (Date.now() - state.startedAt)) / 60000);
    const grade = state.score >= 760 ? 'Stratega del Risorgimento' : state.score >= 620 ? 'Costruttore consapevole' : 'Esploratore storico';
    openModal(`<p class="speaker">Rapporto di fine cantiere</p><h2>${grade}</h2><div class="report-grid"><div><b>${state.score}</b>punti</div><div><b>${state.errors}</b>errori ragionati</div><div><b>${Math.max(1,elapsed)}</b>minuti</div></div>
      <p><b>Hai costruito il Regno, non una favola rassicurante.</b> L’Unità fu resa possibile dalla convergenza di diplomazia, guerra, iniziativa volontaria, monarchia e voto; nacque però con una cittadinanza ristrettissima, un analfabetismo enorme, profonde differenze territoriali e due grandi assenze: Roma e il Veneto.</p>
      <div class="historical-note"><b>La crepa più importante</b><br>Nel 1861 meno del 2% della popolazione poteva votare e circa tre persone su quattro, sopra i sei anni, risultavano analfabete. Fare lo Stato non significava ancora fare una comunità nazionale pienamente partecipe.</div>
      <p style="text-align:center"><button id="review-archive" class="primary">Apri l’archivio storico</button></p>`);
    $('#review-archive').addEventListener('click', openArchive);
  }

  function openArchive() {
    const unlocked = state.completed ? 6 : Math.min(5, state.stage);
    openModal(`<p class="speaker">Taccuino del giocatore</p><h2>Archivio storico</h2><p>Le schede si sbloccano quando attraversi i cantieri.</p><div class="archive-grid">${archives.map((a,i)=>`<article class="archive-entry ${i < unlocked || (i===5 && state.stage>=5) ? '' : 'locked'}"><b>${i < unlocked || (i===5 && state.stage>=5) ? a[0] : 'Scheda bloccata'}</b><span>${i < unlocked || (i===5 && state.stage>=5) ? a[1] : 'Completa il cantiere precedente.'}</span></article>`).join('')}</div>`);
  }

  function openModal(html, closable = true) {
    uiOpen = true;
    modal.hidden = false;
    modalContent.innerHTML = html;
    $('#modal-close').style.display = closable ? '' : 'none';
    if (!isTouchDevice && document.pointerLockElement) document.exitPointerLock();
  }

  function closeModal() {
    modal.hidden = true;
    uiOpen = false;
    if (gameStarted && !isTouchDevice) renderer.domElement.requestPointerLock();
  }

  function discover(title, text) {
    const item = document.createElement('div');
    item.innerHTML = `<b>${title}</b>${text}`;
    $('#discovery').prepend(item);
    while ($('#discovery').children.length > 3) $('#discovery').lastElementChild.remove();
    setTimeout(() => item.remove(), 6500);
  }

  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  function placeConceptVisual(pad, index) {
    const types = ['diplomacy','alliance','conflict','people','legitimacy'];
    const b = cube(pad.position.x, .78, pad.position.z, types[index], { scale: [1.05,1.05,1.05] });
    b.name = `concept-${index}`;
    const tag = labelSprite(conceptSlots[index].name.toUpperCase(), '#172028', .36);
    tag.position.set(pad.position.x, 1.75, pad.position.z);
    tag.name = `concept-label-${index}`;
    scene.add(tag);
  }

  function tryPlace() {
    if (state.stage !== 5 || uiOpen) return;
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const hit = raycaster.intersectObjects(pads, false)[0];
    if (!hit) return;
    const pad = hit.object;
    const required = pad.userData.require;
    if (state.placed.includes(required)) { toast('Questo basamento è già completo.'); return; }
    if (selectedSlot !== required) {
      state.errors++;
      toast(`Serve il blocco ${conceptSlots[required].name}.`);
      tone(105,.12); save(); return;
    }
    if (state.stage <= selectedSlot) { toast('Questo blocco non è ancora sbloccato.'); return; }
    state.placed.push(required);
    state.score += 30;
    placeConceptVisual(pad, required);
    tone(430 + required * 55, .16);
    toast(`${conceptSlots[required].name} posato · ${state.placed.length}/5`);
    save(); updateHUD();
    if (state.placed.length === 5) {
      buildArchTop();
      setTimeout(showFinalQuestion, 850);
    }
  }

  function buildArchTop() {
    if (scene.getObjectByName('arch-top')) return;
    const g = new THREE.Group(); g.name = 'arch-top';
    for (let x = 31; x <= 35; x++) {
      const b = cubePart(x - 33, 3.2, 0, x % 3 === 0 ? 0xe7e1d4 : (x % 2 ? 0x2b714c : 0xb7353f), [.95,.85,1]);
      g.add(b);
    }
    const plaque = labelSprite('17 MARZO 1861', '#9e2d36', .65);
    plaque.position.set(0, 4.15, 0);
    g.add(plaque);
    g.position.set(33, 0, 0);
    scene.add(g);
  }

  function mineBlock() {
    if (uiOpen) return;
    raycaster.setFromCamera({x:0,y:0}, camera);
    const hit = raycaster.intersectObjects(mineables.filter(m=>m.visible), false)[0];
    if (!hit) return;
    hit.object.visible = false;
    state.score += 2;
    toast('Roccia rimossa · il percorso è più libero');
    tone(150,.08); save(); updateHUD();
  }

  function interactionCandidate() {
    let best = null, bestD = 3.35;
    const p = camera.position;
    for (const obj of interactables) {
      if (!obj.visible) continue;
      const d = Math.hypot(p.x - obj.position.x, p.z - obj.position.z);
      if (d >= bestD) continue;
      const kind = obj.userData.kind;
      if (kind === 'crate' && state.stage !== 3) continue;
      if (kind === 'npc' && obj.userData.stage !== state.stage) continue;
      if (kind === 'builder' && state.stage < 5) continue;
      best = obj; bestD = d;
    }
    return best;
  }

  function interact() {
    const obj = interactionCandidate();
    if (!obj) return;
    if (obj.userData.kind === 'crate') collectCrate(obj);
    else if (obj.userData.kind === 'builder') showBuilder();
    else if (obj.userData.kind === 'npc') showMission(obj.userData.stage);
  }

  function updatePrompt() {
    currentNearby = interactionCandidate();
    let html = '';
    if (currentNearby) {
      const kind = currentNearby.userData.kind;
      html = `<kbd>E</kbd>${kind === 'crate' ? 'Raccogli la cassa' : kind === 'builder' ? (state.completed ? 'Apri il rapporto finale' : 'Parla al capomastro') : `Parla con ${currentNearby.userData.name}`}`;
    } else if (state.stage === 5) {
      raycaster.setFromCamera({x:0,y:0}, camera);
      const hit = raycaster.intersectObjects(pads, false)[0];
      if (hit) html = `<kbd>DESTRO</kbd>${hit.object.userData.label}`;
    }
    promptEl.innerHTML = html;
    promptEl.classList.toggle('show', !!html);
  }

  function horizontalBlocked(x, z) {
    for (const b of colliders) {
      if (!b.visible || b.position.y < .2) continue;
      const hx = b.scale.x / 2 + .28, hz = b.scale.z / 2 + .28;
      if (Math.abs(x - b.position.x) < hx && Math.abs(z - b.position.z) < hz) return true;
    }
    return Math.abs(z) > 7.8 || x < -37.5 || x > 39.2;
  }

  function updatePlayer(dt) {
    if ((!isTouchDevice && document.pointerLockElement !== renderer.domElement) || uiOpen) return;
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const move = new THREE.Vector3();
    if (keys.KeyW) move.add(forward);
    if (keys.KeyS) move.sub(forward);
    if (keys.KeyD) move.add(right);
    if (keys.KeyA) move.sub(right);
    if (isTouchDevice) {
      move.addScaledVector(forward, -touchMove.y);
      move.addScaledVector(right, touchMove.x);
    }
    if (move.lengthSq()) move.normalize();
    const speed = (keys.ShiftLeft || keys.ShiftRight) ? 7.2 : 4.8;
    const nx = camera.position.x + move.x * speed * dt;
    const nz = camera.position.z + move.z * speed * dt;
    if (!horizontalBlocked(nx, camera.position.z)) camera.position.x = nx;
    if (!horizontalBlocked(camera.position.x, nz)) camera.position.z = nz;
    velocity.y -= 16 * dt;
    camera.position.y += velocity.y * dt;
    if (camera.position.y < 1.72) { camera.position.y = 1.72; velocity.y = 0; }
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
  }

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(.04, clock.getDelta());
    updatePlayer(dt);
    updatePrompt();
    if (activeMarker) {
      activeMarker.rotation.y += dt * .5;
      activeMarker.material.opacity = .14 + Math.sin(performance.now()*.003) * .05;
    }
    interactables.filter(x => x.userData.kind === 'crate' && x.visible).forEach((c,i)=> c.rotation.y += dt * (.35+i*.05));
    renderer.render(scene, camera);
  }

  function toggleAudio() {
    audioEnabled = !audioEnabled;
    $('#audio-toggle').style.color = audioEnabled ? '#f1c958' : 'white';
    if (audioEnabled) {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (!drone) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.value = 73.42; gain.gain.value = .018;
        osc.connect(gain).connect(audioCtx.destination); osc.start(); drone = {osc,gain};
      }
      drone.gain.gain.setTargetAtTime(.018, audioCtx.currentTime, .1);
    } else if (drone) drone.gain.gain.setTargetAtTime(0, audioCtx.currentTime, .1);
  }

  function tone(freq, duration) {
    if (!audioEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'triangle'; osc.frequency.value = freq; gain.gain.value = .06;
    gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + duration);
    osc.connect(gain).connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + duration);
  }

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && camera.position.y <= 1.73 && !uiOpen) velocity.y = 6.2;
    if (e.code === 'KeyE' && !uiOpen) interact();
    if (e.code === 'KeyH' && gameStarted && !e.repeat) openArchive();
    if (/^Digit[1-6]$/.test(e.code)) { selectedSlot = Number(e.code.slice(-1))-1; renderHotbar(); }
  });
  addEventListener('keyup', e => { keys[e.code] = false; });
  addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== renderer.domElement || uiOpen) return;
    yaw -= e.movementX * .0022;
    pitch -= e.movementY * .0022;
    pitch = Math.max(-1.45, Math.min(1.45, pitch));
  });
  renderer.domElement.addEventListener('mousedown', e => {
    if (!gameStarted || uiOpen) return;
    if (document.pointerLockElement !== renderer.domElement) { renderer.domElement.requestPointerLock(); return; }
    if (e.button === 2) tryPlace();
    if (e.button === 0) mineBlock();
  });
  renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('pointerlockchange', () => {
    if (isTouchDevice || !gameStarted || uiOpen || !startScreen.hidden) return;
    pause.hidden = document.pointerLockElement === renderer.domElement;
  });
  addEventListener('beforeunload', save);

  $('#new-game').addEventListener('click', () => startGame(false));
  $('#continue-game').addEventListener('click', () => startGame(true));
  $('#resume').addEventListener('click', () => { pause.hidden = true; renderer.domElement.requestPointerLock(); });
  $('#modal-close').addEventListener('click', closeModal);
  $('#archive-toggle').addEventListener('click', openArchive);
  $('#audio-toggle').addEventListener('click', toggleAudio);

  $('#hotbar').addEventListener('pointerdown', e => {
    const slot = e.target.closest('[data-slot]');
    if (!slot) return;
    e.preventDefault(); e.stopPropagation();
    selectedSlot = Number(slot.dataset.slot);
    renderHotbar();
  });

  function updateOrientation() {
    rotateDevice.hidden = !(isTouchDevice && innerHeight > innerWidth);
  }

  function setupTouchControls() {
    if (!isTouchDevice) return;
    const movePad = $('#move-pad');
    const knob = $('#move-knob');
    const lookPad = $('#look-pad');

    function updateStick(e) {
      const r = movePad.getBoundingClientRect();
      const max = r.width * .34;
      let dx = e.clientX - (r.left + r.width / 2);
      let dy = e.clientY - (r.top + r.height / 2);
      const len = Math.hypot(dx, dy);
      if (len > max) { dx = dx / len * max; dy = dy / len * max; }
      touchMove.x = dx / max;
      touchMove.y = dy / max;
      knob.style.transform = `translate(${dx}px,${dy}px)`;
    }
    function releaseStick(e) {
      if (e.pointerId !== movePointer) return;
      movePointer = null; touchMove.x = 0; touchMove.y = 0;
      knob.style.transform = 'translate(0,0)';
    }
    movePad.addEventListener('pointerdown', e => {
      e.preventDefault(); movePointer = e.pointerId; movePad.setPointerCapture(e.pointerId); updateStick(e);
    });
    movePad.addEventListener('pointermove', e => { if (e.pointerId === movePointer) { e.preventDefault(); updateStick(e); } });
    movePad.addEventListener('pointerup', releaseStick);
    movePad.addEventListener('pointercancel', releaseStick);

    lookPad.addEventListener('pointerdown', e => {
      e.preventDefault(); lookPointer = e.pointerId; lookLastX = e.clientX; lookLastY = e.clientY; lookPad.setPointerCapture(e.pointerId);
    });
    lookPad.addEventListener('pointermove', e => {
      if (e.pointerId !== lookPointer || uiOpen) return;
      e.preventDefault();
      const dx = e.clientX - lookLastX, dy = e.clientY - lookLastY;
      lookLastX = e.clientX; lookLastY = e.clientY;
      yaw -= dx * .006;
      pitch -= dy * .006;
      pitch = Math.max(-1.45, Math.min(1.45, pitch));
    });
    const releaseLook = e => { if (e.pointerId === lookPointer) lookPointer = null; };
    lookPad.addEventListener('pointerup', releaseLook);
    lookPad.addEventListener('pointercancel', releaseLook);

    const bindAction = (selector, action) => $(selector).addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation(); action();
    });
    bindAction('#touch-interact', interact);
    bindAction('#touch-jump', () => { if (camera.position.y <= 1.73 && !uiOpen) velocity.y = 6.2; });
    bindAction('#touch-mine', mineBlock);
    bindAction('#touch-place', tryPlace);
    addEventListener('orientationchange', () => setTimeout(updateOrientation, 150));
    addEventListener('resize', updateOrientation);
    updateOrientation();
  }

  addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    $('#install-app').hidden = false;
  });
  $('#install-app').addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    $('#install-app').hidden = true;
  });
  addEventListener('appinstalled', () => { $('#install-app').hidden = true; deferredInstallPrompt = null; });

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }

  const existingSave = load();
  if (existingSave) $('#continue-game').hidden = false;
  camera.position.set(-31.5, 1.72, 0);
  renderHotbar();
  setupTouchControls();
  animate();
})();
