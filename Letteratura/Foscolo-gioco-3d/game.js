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
const toast = $('toast');
const journal = $('journal');
const journalContent = $('journal-content');
const dialogue = $('dialogue');
const dialogueKicker = $('dialogue-kicker');
const dialogueTitle = $('dialogue-title');
const dialogueBody = $('dialogue-body');
const dialogueNext = $('dialogue-next');
const quiz = $('quiz');
const quizKicker = $('quiz-kicker');
const quizTitle = $('quiz-title');
const quizIntro = $('quiz-intro');
const quizForm = $('quiz-form');
const quizFeedback = $('quiz-feedback');
const quizSubmit = $('quiz-submit');
const quizClose = $('quiz-close');
const sceneTransition = $('scene-transition');
const transitionTitle = $('transition-title');
const transitionCopy = $('transition-copy');
const audioButton = $('audio-button');
const mobileControls = $('mobile-controls');
const joystick = $('joystick');
const joystickKnob = $('joystick-knob');
const lookZone = $('look-zone');
const mobileAction = $('mobile-action');
const mobileJournal = $('mobile-journal');

const STORAGE_KEY = 'foscolo-tempio-3d-v1';
const QUIZ_ORDER_KEY = 'foscolo-tempio-quiz-order-v1';
const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
const stageOrder = ['materia', 'nulla', 'fratture', 'illusioni', 'opere'];
const previewWorld = ['localhost', '127.0.0.1'].includes(location.hostname)
  ? new URLSearchParams(location.search).get('preview')
  : null;
const previewQuiz = ['localhost', '127.0.0.1'].includes(location.hostname)
  ? new URLSearchParams(location.search).get('quiz')
  : null;
const previewAutoStart = ['localhost', '127.0.0.1'].includes(location.hostname)
  && new URLSearchParams(location.search).get('autostart') === '1';

const worldInfo = {
  tempio: {
    numeral: 'S',
    title: 'Tempio delle soglie',
    copy: 'Tre porte, una sola direzione: comprendere.',
    background: 0x0d1420,
    fog: 0x0d1420,
    density: 0.018,
    key: 0xffe3ad,
    fill: 0x6c87a0,
    rim: 0xc68b55,
    start: [0, 1.72, 8.8]
  },
  materia: {
    numeral: 'I',
    title: 'Materia',
    copy: 'Tutto è corpo, movimento, trasformazione.',
    background: 0x0b1117,
    fog: 0x0b1117,
    density: 0.025,
    key: 0xc9d9e4,
    fill: 0x51616a,
    rim: 0xa86f43,
    start: [0, 1.72, 9.5]
  },
  nulla: {
    numeral: 'II',
    title: 'Nulla eterno',
    copy: 'Ogni figura passa; la macchina continua.',
    background: 0x05070b,
    fog: 0x05070b,
    density: 0.032,
    key: 0x8794a4,
    fill: 0x343c4b,
    rim: 0x675170,
    start: [0, 1.72, 9.5]
  },
  fratture: {
    numeral: 'III',
    title: 'Le fratture',
    copy: 'La teoria del nulla diventa storia e biografia.',
    background: 0x1a1c1d,
    fog: 0x1a1c1d,
    density: 0.023,
    key: 0xd0c2ad,
    fill: 0x6c665a,
    rim: 0x9b5544,
    start: [0, 1.72, 10.2]
  },
  illusioni: {
    numeral: 'IV',
    title: 'Religione delle illusioni',
    copy: 'Fragili, consapevoli, necessarie.',
    background: 0x17131f,
    fog: 0x17131f,
    density: 0.019,
    key: 0xf1dbb0,
    fill: 0x696181,
    rim: 0xc39258,
    start: [0, 1.72, 10.4]
  },
  opere: {
    numeral: 'V',
    title: 'La sala delle opere',
    copy: 'Le illusioni diventano forme che attraversano il tempo.',
    background: 0x11161b,
    fog: 0x11161b,
    density: 0.017,
    key: 0xead7b6,
    fill: 0x526b70,
    rim: 0x8d6c9b,
    start: [0, 1.72, 10.8]
  }
};

const fractureInfo = {
  zante: {
    title: 'L’esilio da Zante',
    source: 'Biografia · sradicamento',
    body: `<p>Zante è la terra dell’origine, della luce e degli affetti. Lasciarla significa perdere un luogo stabile a cui appartenere.</p><p class="concept-line"><strong>La patria reale è perduta:</strong> proprio per questo può diventare memoria e mito poetico.</p>`,
    journal: 'L’esilio da Zante trasforma la patria da possesso geografico in luogo della memoria e del desiderio.'
  },
  campoformio: {
    title: 'Il trattato di Campoformio',
    source: '1797 · patria tradita',
    body: `<p>Napoleone cede Venezia all’Austria. Gli ideali rivoluzionari di libertà si piegano all’interesse politico.</p><p class="concept-line"><strong>La storia non garantisce giustizia:</strong> la patria diventa insieme ferita reale e ideale necessario.</p>`,
    journal: 'Campoformio mostra che la storia non realizza automaticamente libertà e giustizia.'
  },
  giovanni: {
    title: 'La morte del fratello Giovanni',
    source: 'Dolore privato · memoria',
    body: `<p>La morte di Giovanni rende concreta la visione materialistica: il nulla non è più una teoria astratta, ma una perdita familiare.</p><p class="concept-line"><strong>Gli affetti non restituiscono il corpo,</strong> ma la memoria impedisce che il legame diventi insignificante.</p>`,
    journal: 'Con Giovanni il nulla diventa esperienza personale; poesia, tomba e memoria custodiscono l’affetto.'
  },
  inghilterra: {
    title: 'L’esilio in Inghilterra',
    source: 'Ultimi anni · lontananza',
    body: `<p>Foscolo conclude la vita lontano dall’Italia, in Inghilterra. Lo sradicamento non è un episodio: accompagna la sua intera esistenza.</p><p class="concept-line"><strong>L’esule abita nella lingua e nelle opere:</strong> la scrittura diventa una patria trasportabile.</p>`,
    journal: 'L’esilio inglese chiude la biografia nella lontananza e affida alla scrittura una forma di appartenenza.'
  }
};

const illusionInfo = {
  amore: {
    title: 'Amore',
    color: 0xc87876,
    body: 'Spezza la solitudine e riconosce nell’altro un valore, anche quando non può garantire felicità.'
  },
  patria: {
    title: 'Patria',
    color: 0x6b91b1,
    body: 'Dà appartenenza, responsabilità civile e un criterio con cui giudicare la storia che la tradisce.'
  },
  arte: {
    title: 'Arte',
    color: 0x947ec2,
    body: 'Non cambia i fatti, ma dà forma al dolore e rende condivisibile ciò che altrimenti scomparirebbe.'
  },
  bellezza: {
    title: 'Bellezza',
    color: 0xdfbd72,
    body: 'Sospende la brutalità e ingentilisce l’essere umano senza cancellare la durezza del reale.'
  },
  famiglia: {
    title: 'Famiglia e affetti',
    color: 0xb78863,
    body: 'Offre legami, cura e continuità: non rende immortali, ma impedisce di vivere come individui isolati.'
  },
  memoria: {
    title: 'Memoria',
    color: 0x75aa8f,
    body: 'Non vince biologicamente la morte; conserva nei vivi affetti, esempi e responsabilità.'
  }
};

const worksInfo = {
  ortis: {
    title: 'Ultime lettere di Jacopo Ortis',
    date: '1798–1802 · romanzo epistolare',
    color: 0x7c3f3f,
    body: `<p>Jacopo vive il crollo di due illusioni fondamentali: la <strong>patria</strong>, tradita da Campoformio, e l’<strong>amore</strong> impossibile per Teresa.</p><p>Le lettere a Lorenzo tentano di dare forma a una frattura che la vita non riesce a ricomporre.</p>`
  },
  sepolcri: {
    title: 'Dei sepolcri',
    date: '1807 · carme civile',
    color: 0x7d725c,
    body: `<p>La tomba non serve al morto, ma ai vivi: custodisce gli affetti, tramanda esempi e crea una continuità civile.</p><p>La memoria è un’illusione consapevole che contraddice il nulla nella coscienza umana.</p>`
  },
  grazie: {
    title: 'Le Grazie',
    date: '1812–1815 · carme incompiuto',
    color: 0x9d8bb6,
    body: `<p>Arte, armonia e bellezza hanno una funzione civilizzatrice. Le Grazie ingentiliscono l’umanità e la sottraggono alla pura violenza.</p><p>È la forma più alta della religione laica delle illusioni.</p>`
  },
  giovanni: {
    title: 'In morte del fratello Giovanni',
    date: '1803 · sonetto',
    color: 0x5b7184,
    body: `<p>Esilio, famiglia, tomba e memoria si intrecciano. Il poeta immagina il colloquio impossibile presso il sepolcro del fratello.</p><p>La poesia conserva un legame che la materia ha spezzato.</p>`
  },
  sera: {
    title: 'Alla sera',
    date: '1803 · sonetto',
    color: 0x41536e,
    body: `<p>La sera diventa immagine della quiete finale. La ragione non promette un aldilà, ma la poesia trasforma la morte in una figura pacificante.</p><p>Il pensiero del nulla resta; per un istante, però, trova una forma abitabile.</p>`
  }
};

const quizBank = {
  materia: {
    title: 'La natura secondo il meccanicismo',
    intro: 'La soglia si apre solo se distingui una legge fisica da una consolazione morale.',
    success: 'Hai compreso il mondo-macchina: la natura funziona, ma non promette un significato.',
    questions: [
      {
        prompt: 'Che cos’è la natura nella visione meccanicista?',
        options: [
          'Materia in movimento regolata da leggi impersonali',
          'Una volontà morale che premia i giusti',
          'Un mistero che non può essere conosciuto'
        ],
        correct: 0
      },
      {
        prompt: 'Che rapporto c’è tra gli eventi?',
        options: [
          'Ogni evento dipende dal caso assoluto',
          'Cause ed effetti seguono un ordine deterministico',
          'Gli eventi obbediscono ai desideri umani'
        ],
        correct: 1
      },
      {
        prompt: 'Quale conseguenza riguarda l’uomo?',
        options: [
          'È al centro e al di sopra della natura',
          'È materia anche lui e non gode di privilegi cosmici',
          'La sua anima dirige le leggi fisiche'
        ],
        correct: 1
      }
    ]
  },
  nulla: {
    title: 'Le conseguenze del nulla eterno',
    intro: 'Le figure si dissolvono, ma la domanda riguarda chi resta vivo.',
    success: 'Hai riconosciuto il problema: la finitezza non offre senso, costringe l’uomo a costruirlo.',
    questions: [
      {
        prompt: 'Che cosa indica il “nulla eterno” per il Foscolo materialista?',
        options: [
          'Il passaggio certo a una vita ultraterrena',
          'La cessazione dell’individuo, senza anima immortale',
          'Un castigo temporaneo della natura'
        ],
        correct: 1
      },
      {
        prompt: 'Qual è la conseguenza nella vita concreta?',
        options: [
          'Nulla ha valore e ogni legame è inutile',
          'Il significato non è garantito: va costruito attraverso scelte e legami',
          'La storia diventa automaticamente giusta'
        ],
        correct: 1
      },
      {
        prompt: 'Perché sullo sfondo gli ingranaggi continuano?',
        options: [
          'La natura continua anche quando il singolo scompare',
          'La macchina promette la resurrezione individuale',
          'Gli uomini controllano per sempre l’universo'
        ],
        correct: 0
      }
    ]
  },
  fratture: {
    title: 'Dalla filosofia alla vita',
    intro: 'Le quattro ferite hanno forme diverse, ma conducono alla stessa domanda sul senso.',
    success: 'Hai collegato storia, biografia e poesia: le fratture non scompaiono, generano il bisogno delle illusioni.',
    questions: [
      {
        prompt: 'Che cosa rappresenta Campoformio per Foscolo?',
        options: [
          'Il compimento degli ideali rivoluzionari',
          'Il tradimento politico della patria e della libertà',
          'Il ritorno definitivo a Zante'
        ],
        correct: 1
      },
      {
        prompt: 'Perché la morte di Giovanni è una frattura decisiva?',
        options: [
          'Rende il nulla un’esperienza affettiva e personale',
          'Dimostra l’immortalità dell’anima',
          'Riconcilia Foscolo con la storia'
        ],
        correct: 0
      },
      {
        prompt: 'Che cosa accomuna Zante e l’Inghilterra?',
        options: [
          'Mostrano una vita segnata dallo sradicamento e dall’esilio',
          'Sono due vittorie militari',
          'Cancellano il bisogno di patria'
        ],
        correct: 0
      }
    ]
  },
  illusioni: {
    title: 'La religione delle illusioni',
    intro: 'Non basta riconoscere le luci: occorre capirne il valore e il limite.',
    success: 'Hai compreso il nucleo foscoliano: illusioni, sì, ma necessarie per vivere da uomini e non da bruti.',
    questions: [
      {
        prompt: 'Che cosa sono le illusioni per Foscolo?',
        options: [
          'Menzogne ingenue che nascondono per sempre la realtà',
          'Costruzioni poetiche e morali consapevoli',
          'Prove scientifiche di un aldilà'
        ],
        correct: 1
      },
      {
        prompt: 'Perché sono necessarie?',
        options: [
          'Perché eliminano morte e dolore',
          'Perché rendono inutili la ragione e la storia',
          'Perché amore, patria, arte e affetti danno forma umana alla vita'
        ],
        correct: 2
      },
      {
        prompt: 'Qual è il loro limite?',
        options: [
          'Non cancellano il mondo materiale né le fratture',
          'Funzionano soltanto per i poeti',
          'Sono vere solo se diventano religione tradizionale'
        ],
        correct: 0
      }
    ]
  }
};

const expectedQuizAnswers = {
  materia: [
    'Materia in movimento regolata da leggi impersonali',
    'Cause ed effetti seguono un ordine deterministico',
    'È materia anche lui e non gode di privilegi cosmici'
  ],
  nulla: [
    'La cessazione dell’individuo, senza anima immortale',
    'Il significato non è garantito: va costruito attraverso scelte e legami',
    'La natura continua anche quando il singolo scompare'
  ],
  fratture: [
    'Il tradimento politico della patria e della libertà',
    'Rende il nulla un’esperienza affettiva e personale',
    'Mostrano una vita segnata dallo sradicamento e dall’esilio'
  ],
  illusioni: [
    'Costruzioni poetiche e morali consapevoli',
    'Perché amore, patria, arte e affetti danno forma umana alla vita',
    'Non cancellano il mondo materiale né le fratture'
  ]
};

validateQuizBank();
const quizSessionBank = createQuizSessionBank();

function validateQuizBank() {
  Object.entries(expectedQuizAnswers).forEach(([stage, expectedAnswers]) => {
    const quizData = quizBank[stage];
    if (!quizData || quizData.questions.length !== expectedAnswers.length) {
      throw new Error(`Struttura del quiz non valida: ${stage}`);
    }
    quizData.questions.forEach((question, questionIndex) => {
      const selectedAnswer = question.options[question.correct];
      if (selectedAnswer !== expectedAnswers[questionIndex]) {
        throw new Error(`Risposta corretta incoerente: ${stage}, domanda ${questionIndex + 1}`);
      }
      if (new Set(question.options).size !== question.options.length) {
        throw new Error(`Risposte duplicate: ${stage}, domanda ${questionIndex + 1}`);
      }
    });
  });
}

function createQuizSessionBank() {
  let previousPositions = {};
  try {
    previousPositions = JSON.parse(localStorage.getItem(QUIZ_ORDER_KEY) || '{}');
  } catch (error) {
    previousPositions = {};
  }

  const nextPositions = {};
  const sessionBank = {};
  Object.entries(quizBank).forEach(([stage, quizData]) => {
    sessionBank[stage] = {
      ...quizData,
      questions: quizData.questions.map((question, questionIndex) => {
        const options = question.options.map((text, originalIndex) => ({
          text,
          correct: originalIndex === question.correct
        }));
        shuffleArray(options);

        const positionKey = `${stage}-${questionIndex}`;
        let correctIndex = options.findIndex((option) => option.correct);
        const previousIndex = Number(previousPositions[positionKey]);
        if (Number.isInteger(previousIndex) && previousIndex === correctIndex && options.length > 1) {
          const offset = 1 + Math.floor(Math.random() * (options.length - 1));
          const swapIndex = (correctIndex + offset) % options.length;
          [options[correctIndex], options[swapIndex]] = [options[swapIndex], options[correctIndex]];
          correctIndex = swapIndex;
        }
        nextPositions[positionKey] = correctIndex;

        return {
          prompt: question.prompt,
          options: options.map((option) => option.text),
          correct: correctIndex
        };
      })
    };
  });

  try {
    localStorage.setItem(QUIZ_ORDER_KEY, JSON.stringify(nextPositions));
  } catch (error) {
    console.warn('Ordine dei quiz non memorizzabile', error);
  }
  return sessionBank;
}

function shuffleArray(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function freshState() {
  return {
    started: false,
    paused: true,
    modal: false,
    current: 'tempio',
    completed: new Set(),
    fractures: new Set(),
    illusions: new Set(),
    works: new Set(),
    journal: [],
    audioOn: true
  };
}

function loadState() {
  const base = freshState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved) return base;
    base.current = worldInfo[saved.current] ? saved.current : 'tempio';
    base.completed = new Set((saved.completed || []).filter((x) => stageOrder.includes(x)));
    base.fractures = new Set((saved.fractures || []).filter((x) => fractureInfo[x]));
    base.illusions = new Set((saved.illusions || []).filter((x) => illusionInfo[x]));
    base.works = new Set((saved.works || []).filter((x) => worksInfo[x]));
    base.journal = Array.isArray(saved.journal) ? saved.journal.slice(0, 60) : [];
    base.audioOn = saved.audioOn !== false;
  } catch (error) {
    console.warn('Salvataggio non leggibile', error);
  }
  return base;
}

const state = loadState();

let scene;
let camera;
let renderer;
let clock;
let keyLight;
let fillLight;
let rimLight;
let currentInteractable = null;
let toastTimer = null;
let dialogueCallback = null;
let activeQuiz = null;
let yaw = 0;
let pitch = 0;
let audioCtx = null;
let masterGain = null;
let ambientNodes = [];
let switching = false;
let draggingLook = false;
let dragLookX = 0;
let dragLookY = 0;

const worlds = {};
const portalRefs = {};
const fractureRefs = {};
const illusionRefs = {};
const interactables = [];
const animated = [];
const keys = new Set();
const movementKeys = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight',
  'ShiftLeft', 'ShiftRight'
]);
const mobileMove = new THREE.Vector2();
const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();

init().catch((error) => {
  console.error(error);
  loading.querySelector('.loading-card > p:not(.eyebrow)').textContent = 'Impossibile inizializzare il 3D. Controlla la connessione e il supporto WebGL.';
});

async function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(worldInfo.tempio.background);
  scene.fog = new THREE.FogExp2(worldInfo.tempio.fog, worldInfo.tempio.density);

  camera = new THREE.PerspectiveCamera(66, innerWidth / innerHeight, 0.08, 180);
  camera.rotation.order = 'YXZ';

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, isTouch ? 1.3 : 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  clock = new THREE.Clock();
  setupLights();

  worlds.tempio = buildTempleWorld();
  worlds.materia = buildMatterWorld();
  worlds.nulla = buildNothingWorld();
  worlds.fratture = buildFracturesWorld();
  worlds.illusioni = buildIllusionsWorld();
  worlds.opere = buildWorksWorld();
  Object.values(worlds).forEach((group) => scene.add(group));

  bindEvents();
  renderJournal();
  const initialWorld = worldInfo[previewWorld] ? previewWorld : (isStageAvailable(state.current) ? state.current : 'tempio');
  setWorldNow(initialWorld);
  refreshDiscoveries();
  onResize();

  loading.classList.remove('screen--active');
  startScreen.classList.add('screen--active');
  if (state.completed.size || state.fractures.size || state.illusions.size) {
    startButton.textContent = 'Riprendi il viaggio';
  }
  requestAnimationFrame(animate);
  if (previewAutoStart) setTimeout(beginGame, 80);

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function setupLights() {
  scene.add(new THREE.HemisphereLight(0xb8c6d0, 0x17110d, 0.58));
  keyLight = new THREE.SpotLight(0xffe3ad, 720, 58, Math.PI / 4, 0.54, 1.1);
  keyLight.position.set(5, 13, 9);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(isTouch ? 1024 : 1536, isTouch ? 1024 : 1536);
  keyLight.shadow.bias = -0.0002;
  keyLight.target.position.set(0, 0, -5);
  scene.add(keyLight, keyLight.target);

  fillLight = new THREE.PointLight(0x6c87a0, 210, 32, 1.5);
  fillLight.position.set(-8, 5, 4);
  rimLight = new THREE.PointLight(0xc68b55, 170, 30, 1.6);
  rimLight.position.set(7, 4, -11);
  scene.add(fillLight, rimLight);
}

function buildTempleWorld() {
  const group = createCircularRoom({ radius: 17.4, floor: 0xc9c0ad, wall: 0x373b42, ceiling: 0x242a34, metalness: 0.08 });
  group.name = 'tempio';

  const marble = new THREE.MeshStandardMaterial({ color: 0xd1c6b2, roughness: 0.76, metalness: 0.04 });
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    if (Math.cos(angle) < -0.58 && Math.abs(Math.sin(angle)) < 0.9) continue;
    const column = createDoricColumn(7.5, marble);
    column.position.set(Math.sin(angle) * 13.9, 0, Math.cos(angle) * 13.9);
    column.lookAt(0, 3, 0);
    group.add(column);
  }

  const oculus = new THREE.Mesh(
    new THREE.TorusGeometry(3.35, 0.28, 16, 80),
    new THREE.MeshStandardMaterial({ color: 0xd8c79f, roughness: 0.45, metalness: 0.16, emissive: 0x5d4829, emissiveIntensity: 0.3 })
  );
  oculus.rotation.x = Math.PI / 2;
  oculus.position.y = 8.45;
  group.add(oculus);

  const moon = new THREE.Mesh(
    new THREE.CircleGeometry(3.1, 64),
    new THREE.MeshBasicMaterial({ color: 0xbfd5e3, transparent: true, opacity: 0.34, side: THREE.DoubleSide })
  );
  moon.rotation.x = Math.PI / 2;
  moon.position.y = 8.48;
  group.add(moon);

  const inlay = new THREE.Mesh(
    new THREE.RingGeometry(3.3, 3.56, 80),
    new THREE.MeshStandardMaterial({ color: 0xa98249, roughness: 0.32, metalness: 0.64, emissive: 0x2c1d0c, emissiveIntensity: 0.35 })
  );
  inlay.rotation.x = -Math.PI / 2;
  inlay.position.y = 0.015;
  group.add(inlay);

  const header = createTextPanel('IL TEMPIO DELLE SOGLIE', 'le colonne sono porte del pensiero', 0xd9b16d, 8.4, 1.3);
  header.position.set(0, 6.7, -12.9);
  group.add(header);

  const portalData = [
    ['materia', 'MATERIA', -7.3, 0x778b91],
    ['nulla', 'NULLA', 0, 0x6d627d],
    ['fratture', 'FRATTURE', 7.3, 0xb56c50]
  ];
  portalData.forEach(([key, label, x, color]) => {
    const portal = createGateway(label, key === 'materia' ? 'la natura come macchina' : key === 'nulla' ? 'la fine dell’individuo' : 'storia, esilio, perdita', color, true);
    portal.position.set(x, 0, -10.6);
    group.add(portal);
    portalRefs[key] = portal;
    registerInteractable(portal, {
      label: `Entra: ${label}`,
      action: () => enterFromTemple(key)
    });
  });

  addParticles(group, 430, 0xe8d9ba, { radius: 15, height: 9, opacity: 0.22, size: 0.035, type: 'drift' });
  return group;
}

function buildMatterWorld() {
  const group = createCircularRoom({ radius: 17, floor: 0x171d23, wall: 0x242a30, ceiling: 0x14191f, metalness: 0.42 });
  group.name = 'materia';

  const ringMat = new THREE.MeshStandardMaterial({ color: 0x846c49, metalness: 0.78, roughness: 0.28, emissive: 0x20160c, emissiveIntensity: 0.45 });
  [4.5, 8.5, 12.5].forEach((radius) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(radius, radius + 0.16, 96), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    group.add(ring);
  });

  const metalColors = [0x59636a, 0x7d6a4c, 0x46545a, 0x76685d];
  const gearLayout = [
    [-8.2, 5.2, -13.5, 2.3], [-4.8, 2.8, -13.2, 1.45], [-1.7, 6.2, -13.4, 2.0],
    [2.0, 3.4, -13.3, 2.5], [6.4, 6.0, -13.5, 1.8], [9.1, 2.8, -13.1, 1.35],
    [-10.5, 8.4, -10.8, 1.25], [10.6, 8.2, -10.7, 1.3]
  ];
  gearLayout.forEach(([x, y, z, radius], index) => {
    const material = new THREE.MeshStandardMaterial({ color: metalColors[index % metalColors.length], metalness: 0.72, roughness: 0.32 });
    const gear = createGear(radius, Math.max(12, Math.round(radius * 10)), 0.48, material);
    gear.position.set(x, y, z);
    group.add(gear);
    animated.push({ type: 'gear', object: gear, speed: (index % 2 ? -1 : 1) * (0.22 + 0.08 * index), stage: 'materia' });
  });

  for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshStandardMaterial({ color: metalColors[(i + 1) % metalColors.length], metalness: 0.75, roughness: 0.29, transparent: true });
    const gear = createGear(0.75 + Math.random() * 0.7, 14 + i * 2, 0.36, material);
    gear.position.set(-8 + Math.random() * 16, 4 + Math.random() * 5, -4 - Math.random() * 6);
    group.add(gear);
    animated.push({
      type: 'fallingGear',
      object: gear,
      speed: (i % 2 ? -1 : 1) * (0.8 + Math.random() * 0.5),
      fallSpeed: 1.8 + Math.random() * 1.6,
      delay: 1.6 + i * 2.15,
      nextFall: 0,
      armed: false,
      stage: 'materia'
    });
  }

  const cause = createTextPanel('CAUSA → EFFETTO', 'nessun disegno morale', 0x8ea4ad, 5.2, 1.05);
  cause.position.set(-7.8, 5.1, -8.8);
  cause.rotation.y = 0.32;
  group.add(cause);

  const law = createTextPanel('MATERIA IN MOVIMENTO', 'la natura funziona', 0xd0ae70, 5.8, 1.05);
  law.position.set(7.7, 5.4, -8.7);
  law.rotation.y = -0.32;
  group.add(law);

  const gate = createGateway('VERIFICA: NATURA', 'comprendi il meccanicismo', 0x8fa7ad, false);
  gate.position.set(0, 0, -12.4);
  group.add(gate);
  registerInteractable(gate, { label: 'Apri il test sulla natura', action: () => openQuiz('materia') });

  addParticles(group, 520, 0xc8b687, { radius: 16, height: 10, opacity: 0.22, size: 0.03, type: 'drift' });
  return group;
}

function buildNothingWorld() {
  const group = createCircularRoom({ radius: 18, floor: 0x0b0d12, wall: 0x11141b, ceiling: 0x090b10, metalness: 0.26 });
  group.name = 'nulla';

  const voidDisc = new THREE.Mesh(
    new THREE.CircleGeometry(6.2, 80),
    new THREE.MeshBasicMaterial({ color: 0x010205, transparent: true, opacity: 0.88, side: THREE.DoubleSide })
  );
  voidDisc.rotation.x = -Math.PI / 2;
  voidDisc.position.set(0, 0.025, -5.5);
  group.add(voidDisc);

  const gearMat = new THREE.MeshStandardMaterial({ color: 0x303640, metalness: 0.66, roughness: 0.38 });
  for (let i = 0; i < 7; i++) {
    const radius = 1.2 + (i % 3) * 0.7;
    const gear = createGear(radius, 14 + i * 2, 0.42, gearMat.clone());
    gear.position.set(-10.5 + i * 3.5, 2.8 + (i % 2) * 3.4, -14.5);
    group.add(gear);
    animated.push({ type: 'gear', object: gear, speed: (i % 2 ? -0.25 : 0.32), stage: 'nulla' });
  }

  const peoplePositions = [
    [-7.5, -1], [-4.8, -3.4], [-2.2, -7.3], [1.2, -2.1],
    [4.5, -5.5], [7.3, -1.8], [-7.2, -9], [7.6, -9.2]
  ];
  peoplePositions.forEach(([x, z], index) => {
    const person = createWalkingPerson(index);
    person.position.set(x, 0, z);
    group.add(person);
    animated.push({
      type: 'person',
      object: person,
      originX: x,
      originZ: z,
      phase: index * 1.31,
      age: index * 1.65,
      duration: 14 + (index % 4) * 2.2,
      stage: 'nulla'
    });
  });

  const title = createTextPanel('IL SINGOLO SCOMPARE', 'la natura continua', 0x807691, 6.5, 1.2);
  title.position.set(0, 6.9, -13.7);
  group.add(title);

  const gate = createGateway('VERIFICA: NULLA', 'le conseguenze nella vita', 0x776b8c, false);
  gate.position.set(0, 0, -12.3);
  group.add(gate);
  registerInteractable(gate, { label: 'Apri il test sul nulla eterno', action: () => openQuiz('nulla') });

  addParticles(group, 680, 0x918aa2, { radius: 17, height: 10, opacity: 0.16, size: 0.026, type: 'void' });
  return group;
}

function buildFracturesWorld() {
  const group = createCircularRoom({ radius: 18, floor: 0x2b2927, wall: 0x353230, ceiling: 0x252322, metalness: 0.08 });
  group.name = 'fratture';

  addFloorCracks(group);
  const title = createTextPanel('QUATTRO FRATTURE', 'esplorale prima della verifica', 0xc47a5f, 6.6, 1.15);
  title.position.set(0, 7.1, -13.5);
  group.add(title);

  const installations = [
    ['zante', -6.7, -2.0, createShip(), 0x668ba0],
    ['campoformio', 6.7, -2.0, createTreatyTable(), 0xa95f49],
    ['giovanni', -6.7, -8.6, createTomb(), 0x84909a],
    ['inghilterra', 6.7, -8.6, createEnglandExile(), 0x7c667f]
  ];

  installations.forEach(([key, x, z, object, color]) => {
    const station = createMemoryStation(fractureInfo[key].title, fractureInfo[key].source, object, color);
    station.position.set(x, 0, z);
    station.lookAt(0, 1.8, 10);
    group.add(station);
    fractureRefs[key] = station;
    registerInteractable(station, { label: `Esplora: ${fractureInfo[key].title}`, action: () => discoverFracture(key) });
  });

  const gate = createGateway('VERIFICA: FRATTURE', 'prima esplora tutte e quattro', 0xb46c54, false);
  gate.position.set(0, 0, -13.2);
  group.add(gate);
  registerInteractable(gate, {
    label: 'Apri il test sulle fratture',
    action: () => {
      if (state.fractures.size < 4) {
        showToast(`Mancano ${4 - state.fractures.size} fratture da esplorare.`);
        return;
      }
      openQuiz('fratture');
    }
  });

  addParticles(group, 520, 0xb4a38d, { radius: 17, height: 9, opacity: 0.16, size: 0.032, type: 'ash' });
  return group;
}

function buildIllusionsWorld() {
  const group = createCircularRoom({ radius: 18.5, floor: 0x24212b, wall: 0x393344, ceiling: 0x1b1822, metalness: 0.12 });
  group.name = 'illusioni';

  const pool = new THREE.Mesh(
    new THREE.RingGeometry(4.2, 8.6, 96),
    new THREE.MeshStandardMaterial({ color: 0x304b52, roughness: 0.2, metalness: 0.25, transparent: true, opacity: 0.7, emissive: 0x0c2023, emissiveIntensity: 0.38 })
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(0, 0.035, -5.3);
  group.add(pool);

  const title = createTextPanel('ILLUSIONI NECESSARIE', 'non negano il vero: rendono umana la vita', 0xdfbd72, 8.4, 1.05);
  title.position.set(0, 8.08, -14.6);
  group.add(title);

  const positions = [
    ['amore', -7.3, -1.2], ['patria', 0, -2.3], ['arte', 7.3, -1.2],
    ['bellezza', -7.4, -8.4], ['famiglia', 0, -9.6], ['memoria', 7.4, -8.4]
  ];

  positions.forEach(([key, x, z]) => {
    const shrine = createIllusionShrine(key);
    shrine.position.set(x, 0, z);
    shrine.lookAt(0, 1.7, 10);
    group.add(shrine);
    illusionRefs[key] = shrine;
    registerInteractable(shrine, { label: `Accendi: ${illusionInfo[key].title}`, action: () => activateIllusion(key) });
  });

  const gate = createGateway('VERIFICA: ILLUSIONI', 'accendi tutte le forme di senso', 0xd6ad68, false);
  gate.position.set(0, 0, -14.2);
  group.add(gate);
  registerInteractable(gate, {
    label: 'Apri il test sulle illusioni',
    action: () => {
      if (state.illusions.size < 6) {
        showToast(`Mancano ${6 - state.illusions.size} illusioni da comprendere.`);
        return;
      }
      openQuiz('illusioni');
    }
  });

  addParticles(group, 760, 0xe4c996, { radius: 18, height: 11, opacity: 0.3, size: 0.038, type: 'glow' });
  return group;
}

function buildWorksWorld() {
  const group = createCircularRoom({ radius: 19, floor: 0x20272a, wall: 0x394246, ceiling: 0x161d21, metalness: 0.08 });
  group.name = 'opere';

  const aisle = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 25),
    new THREE.MeshStandardMaterial({ color: 0x5a2e31, roughness: 0.92, side: THREE.DoubleSide })
  );
  aisle.rotation.x = -Math.PI / 2;
  aisle.position.set(0, 0.025, -1.5);
  group.add(aisle);

  const title = createTextPanel('LE OPERE', 'qui le illusioni diventano poesia, memoria, forma', 0xe0c18b, 9.5, 1.35);
  title.position.set(0, 7.6, -14.8);
  group.add(title);

  const keys = Object.keys(worksInfo);
  keys.forEach((key, index) => {
    const angle = THREE.MathUtils.degToRad(-58 + index * 29);
    const radius = 10.8;
    const station = createBookStation(key);
    station.position.set(Math.sin(angle) * radius, 0, 2.2 - Math.cos(angle) * radius);
    station.lookAt(0, 2, 11);
    group.add(station);
    registerInteractable(station, { label: `Apri: ${worksInfo[key].title}`, action: () => openWork(key) });
  });

  for (let i = 0; i < 12; i++) {
    const column = createDoricColumn(7.2, new THREE.MeshStandardMaterial({ color: 0x85827a, roughness: 0.84 }));
    const angle = (i / 12) * Math.PI * 2;
    column.position.set(Math.sin(angle) * 15.7, 0, Math.cos(angle) * 15.7);
    group.add(column);
  }

  addParticles(group, 580, 0xead6ad, { radius: 18, height: 10, opacity: 0.21, size: 0.034, type: 'drift' });
  return group;
}

function createCircularRoom({ radius, floor, wall, ceiling, metalness = 0.1 }) {
  const group = new THREE.Group();
  const floorMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 0.65, 96),
    new THREE.MeshStandardMaterial({ color: floor, roughness: 0.7, metalness })
  );
  floorMesh.position.y = -0.34;
  floorMesh.receiveShadow = true;

  const wallMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 9.2, 96, 1, true),
    new THREE.MeshStandardMaterial({ color: wall, roughness: 0.82, metalness: metalness * 0.4, side: THREE.BackSide })
  );
  wallMesh.position.y = 4.45;
  wallMesh.receiveShadow = true;

  const ceilingMesh = new THREE.Mesh(
    new THREE.RingGeometry(3.2, radius, 96),
    new THREE.MeshStandardMaterial({ color: ceiling, roughness: 0.86, side: THREE.DoubleSide })
  );
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.y = 8.75;
  group.add(floorMesh, wallMesh, ceilingMesh);
  return group;
}

function createDoricColumn(height, material) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.82, 0.28, 20), material);
  base.position.y = 0.14;
  const baseTop = new THREE.Mesh(new THREE.CylinderGeometry(0.61, 0.72, 0.22, 20), material);
  baseTop.position.y = 0.39;
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.58, height - 1.15, 20), material);
  shaft.position.y = height / 2 - 0.05;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.63, 0.46, 0.28, 20), material);
  neck.position.y = height - 0.5;
  const capital = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.28, 1.45), material);
  capital.position.y = height - 0.22;
  group.add(base, baseTop, shaft, neck, capital);
  group.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  return group;
}

function createGateway(title, subtitle, color, doric) {
  const group = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({ color: doric ? 0xb8ae9b : 0x444a50, roughness: doric ? 0.77 : 0.46, metalness: doric ? 0.04 : 0.4 });
  const left = createDoricColumn(6.4, stone);
  const right = createDoricColumn(6.4, stone);
  left.position.x = -2.3;
  right.position.x = 2.3;
  const beam = new THREE.Mesh(new THREE.BoxGeometry(6.1, 0.7, 1.25), stone);
  beam.position.y = 6.45;
  beam.castShadow = true;

  const glow = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.7, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false });
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(3.7, 5.6), glow);
  veil.position.set(0, 3.05, 0.15);
  veil.userData.veil = true;
  const label = createTextPanel(title, subtitle, color, 5.6, 0.95);
  label.position.set(0, 7.15, 0.1);
  group.add(left, right, beam, veil, label);
  group.userData.veil = veil;
  animated.push({ type: 'portal', object: veil, speed: 1 + Math.random() * 0.5, stage: null });
  return group;
}

function createTextPanel(title, subtitle, color = 0xd9b16d, width = 4, height = 1.1) {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 1024;
  textureCanvas.height = 300;
  const context = textureCanvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 1024, 300);
  gradient.addColorStop(0, 'rgba(8,12,18,.9)');
  gradient.addColorStop(1, 'rgba(24,28,34,.76)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1024, 300);
  context.strokeStyle = `#${new THREE.Color(color).getHexString()}`;
  context.lineWidth = 8;
  context.strokeRect(8, 8, 1008, 284);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#f3eee3';
  let fontSize = 69;
  do {
    context.font = `700 ${fontSize}px Georgia`;
    fontSize -= 2;
  } while (context.measureText(title).width > 900 && fontSize > 34);
  context.fillText(title, 512, 122);
  context.fillStyle = '#b8c0c6';
  context.font = '36px Arial';
  context.fillText(subtitle, 512, 213);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false });
  return new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
}

function createGear(radius, teeth, depth, material) {
  const group = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.7, radius * 0.17, 12, 48), material);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, depth, 20), material);
  hub.rotation.x = Math.PI / 2;
  group.add(ring, hub);
  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(radius * 0.2, radius * 0.19, depth), material);
    tooth.position.set(Math.cos(angle) * radius * 0.9, Math.sin(angle) * radius * 0.9, 0);
    tooth.rotation.z = angle;
    group.add(tooth);
  }
  for (let i = 0; i < 6; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(radius * 1.22, radius * 0.1, depth * 0.72), material);
    spoke.rotation.z = (i / 6) * Math.PI * 2;
    group.add(spoke);
  }
  group.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  return group;
}

function createWalkingPerson(index) {
  const group = new THREE.Group();
  const palette = [0x687584, 0x7e665e, 0x596b61, 0x776f83, 0x6e6d58];
  const cloth = new THREE.MeshStandardMaterial({ color: palette[index % palette.length], roughness: 0.85, transparent: true });
  const skin = new THREE.MeshStandardMaterial({ color: 0xac806a, roughness: 0.82, transparent: true });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.95, 5, 10), cloth);
  body.position.y = 1.12;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 10), skin);
  head.position.y = 2.15;
  const bubble = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), new THREE.MeshBasicMaterial({ color: 0xbfc6d0, transparent: true, opacity: 0.72 }));
    dot.position.x = (i - 1) * 0.17;
    bubble.add(dot);
  }
  bubble.position.set(0, 2.78, 0);
  group.add(body, head, bubble);
  group.userData.fadeMaterials = [cloth, skin, ...bubble.children.map((dot) => dot.material)];
  group.userData.bubble = bubble;
  group.traverse((object) => { if (object.isMesh) object.castShadow = true; });
  return group;
}

function createMemoryStation(title, subtitle, object, color) {
  const group = new THREE.Group();
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.55, 0.45, 12),
    new THREE.MeshStandardMaterial({ color: 0x45413d, roughness: 0.79, metalness: 0.08 })
  );
  platform.position.y = 0.18;
  object.position.y = 0.42;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.05, 8, 60),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.68 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.44;
  const label = createTextPanel(title.toUpperCase(), subtitle, color, 4.7, 0.96);
  label.position.set(0, 4.9, 0);
  group.add(platform, object, ring, label);
  group.userData.ring = ring;
  group.traverse((mesh) => { if (mesh.isMesh) mesh.castShadow = true; });
  return group;
}

function createShip() {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x4a3022, roughness: 0.82 });
  const hull = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 1.15), wood);
  hull.position.y = 0.7;
  const bow = new THREE.Mesh(new THREE.ConeGeometry(0.58, 1.25, 5), wood);
  bow.rotation.z = -Math.PI / 2;
  bow.position.set(1.75, 0.72, 0);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.0, 10), wood);
  mast.position.y = 2.0;
  const sail = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 2.0), new THREE.MeshStandardMaterial({ color: 0xd1c5aa, side: THREE.DoubleSide, roughness: 0.95 }));
  sail.position.set(0.68, 2.2, 0.02);
  group.add(hull, bow, mast, sail);
  return group;
}

function createTreatyTable() {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x4d3020, roughness: 0.76 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.25, 1.65), wood);
  top.position.y = 1.55;
  for (const x of [-1.2, 1.2]) {
    for (const z of [-0.55, 0.55]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 0.2), wood);
      leg.position.set(x, 0.75, z);
      group.add(leg);
    }
  }
  const document = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 1.0), new THREE.MeshStandardMaterial({ color: 0xd7c9a7, roughness: 0.98, side: THREE.DoubleSide }));
  document.rotation.x = -Math.PI / 2;
  document.position.set(0, 1.69, 0);
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.06, 20), new THREE.MeshStandardMaterial({ color: 0x842f2c, roughness: 0.5 }));
  seal.position.set(0.67, 1.75, 0.15);
  group.add(top, document, seal);
  return group;
}

function createTomb() {
  const group = new THREE.Group();
  const stone = new THREE.MeshStandardMaterial({ color: 0x777570, roughness: 0.96 });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.45, 1.2), stone);
  slab.position.y = 0.3;
  const stele = new THREE.Mesh(new THREE.BoxGeometry(1.45, 2.55, 0.4), stone);
  stele.position.set(0, 1.62, -0.35);
  const wreath = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.07, 8, 28), new THREE.MeshStandardMaterial({ color: 0x706844, roughness: 0.83 }));
  wreath.position.set(0, 1.75, -0.1);
  group.add(slab, stele, wreath);
  return group;
}

function createEnglandExile() {
  const group = new THREE.Group();
  const leather = new THREE.MeshStandardMaterial({ color: 0x5b3c2d, roughness: 0.78 });
  const suitcase = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.35, 0.75), leather);
  suitcase.position.set(-0.4, 0.9, 0.15);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.07, 8, 20, Math.PI), leather);
  handle.position.set(-0.4, 1.63, 0.15);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x55585e, roughness: 0.84 });
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.85, 3.4, 0.85), towerMat);
  tower.position.set(1.0, 1.8, -0.25);
  const clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.28, 24), new THREE.MeshBasicMaterial({ color: 0xc7b98d }));
  clockFace.position.set(1.0, 2.55, 0.19);
  group.add(suitcase, handle, tower, clockFace);
  return group;
}

function createIllusionShrine(key) {
  const info = illusionInfo[key];
  const group = new THREE.Group();
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.35, 1.65, 1.2, 12),
    new THREE.MeshStandardMaterial({ color: 0x514c55, roughness: 0.7, metalness: 0.12 })
  );
  pedestal.position.y = 0.6;
  const orbMaterial = new THREE.MeshStandardMaterial({ color: info.color, emissive: info.color, emissiveIntensity: 0.3, metalness: 0.15, roughness: 0.2, transparent: true, opacity: 0.72 });
  const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 3), orbMaterial);
  orb.position.y = 2.3;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.035, 8, 64), new THREE.MeshBasicMaterial({ color: info.color, transparent: true, opacity: 0.4 }));
  ring.position.y = 2.3;
  ring.rotation.x = Math.PI / 2;
  const label = createTextPanel(info.title.toUpperCase(), 'illusione necessaria', info.color, 3.25, 0.7);
  label.position.y = 3.65;
  group.add(pedestal, orb, ring, label);
  group.userData.orb = orb;
  group.userData.ring = ring;
  animated.push({ type: 'illusion', object: group, orb, ring, baseY: 2.3, speed: 0.75 + Math.random() * 0.3, phase: Math.random() * 5, stage: 'illusioni' });
  return group;
}

function createBookStation(key) {
  const info = worksInfo[key];
  const group = new THREE.Group();
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 1.55, 1.7, 12),
    new THREE.MeshStandardMaterial({ color: 0x4e5353, roughness: 0.75 })
  );
  pedestal.position.y = 0.85;
  const coverMaterial = new THREE.MeshStandardMaterial({ color: info.color, roughness: 0.58, metalness: 0.07 });
  const pagesMaterial = new THREE.MeshStandardMaterial({ color: 0xd7cdb3, roughness: 0.95 });
  const pages = new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.3, 0.42), pagesMaterial);
  pages.position.y = 2.8;
  pages.rotation.x = -0.1;
  const coverFront = new THREE.Mesh(new THREE.BoxGeometry(1.86, 2.42, 0.08), coverMaterial);
  coverFront.position.set(0, 2.8, 0.25);
  coverFront.rotation.x = -0.1;
  const coverBack = coverFront.clone();
  coverBack.position.z = -0.25;
  const label = createTextPanel(info.title.toUpperCase(), info.date, info.color, 4.4, 0.96);
  label.position.y = 4.75;
  group.add(pedestal, pages, coverFront, coverBack, label);
  animated.push({ type: 'book', object: pages, covers: [coverFront, coverBack], baseY: 2.8, phase: Math.random() * 5, stage: 'opere' });
  group.traverse((object) => { if (object.isMesh) object.castShadow = true; });
  return group;
}

function addFloorCracks(group) {
  const material = new THREE.LineBasicMaterial({ color: 0xa05e4e, transparent: true, opacity: 0.72 });
  const paths = [
    [[0, 5], [-1, 2], [1, -1], [-2, -4], [-1, -8], [-3, -12]],
    [[0, 3], [3, 1], [4, -2], [7, -4], [8, -8]],
    [[-1, -1], [-5, -2], [-7, -5], [-10, -7]],
    [[1, -3], [2, -6], [0, -9], [2, -13]]
  ];
  paths.forEach((path) => {
    const points = path.map(([x, z]) => new THREE.Vector3(x, 0.035, z));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(geometry, material));
  });
}

function addParticles(group, count, color, options) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * options.radius;
    positions[i * 3] = Math.sin(angle) * radius;
    positions[i * 3 + 1] = 0.3 + Math.random() * options.height;
    positions[i * 3 + 2] = Math.cos(angle) * radius;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ color, size: options.size, transparent: true, opacity: options.opacity, depthWrite: false })
  );
  group.add(points);
  animated.push({ type: options.type, object: points, speed: 0.012 + Math.random() * 0.01, stage: group.name });
}

function registerInteractable(object, data) {
  object.userData.interaction = data;
  interactables.push(object);
}

function enterFromTemple(stage) {
  if (!isStageUnlocked(stage)) {
    const previous = stageOrder[stageOrder.indexOf(stage) - 1];
    showToast(`La soglia è chiusa. Supera prima ${worldInfo[previous].title}.`);
    playTone(95, 0.22, 'sawtooth', 0.018);
    return;
  }
  switchWorld(stage);
}

function discoverFracture(key) {
  const info = fractureInfo[key];
  const firstTime = !state.fractures.has(key);
  state.fractures.add(key);
  if (firstTime) {
    addJournal(`frattura-${key}`, info.title, info.journal, info.source);
    saveState();
    refreshDiscoveries();
    playChord(THREE.MathUtils.randInt(0, 3));
  }
  openDialogue({
    kicker: info.source,
    title: info.title,
    html: info.body,
    onClose: () => {
      if (state.fractures.size === 4) showToast('Le quattro fratture convergono. Ora raggiungi la verifica.');
      updateHUD();
    }
  });
}

function activateIllusion(key) {
  const info = illusionInfo[key];
  const firstTime = !state.illusions.has(key);
  state.illusions.add(key);
  if (firstTime) {
    addJournal(`illusione-${key}`, info.title, `${info.body} È un’illusione consapevole: non cancella la realtà, ma consente di attraversarla.`, 'Religione delle illusioni');
    saveState();
    refreshDiscoveries();
    playChord(Object.keys(illusionInfo).indexOf(key));
  }
  openDialogue({
    kicker: 'Religione laica · forma di resistenza',
    title: info.title,
    html: `<p>${info.body}</p><p class="concept-line"><strong>Non è una fuga:</strong> la realtà rimane, ma senza questa costruzione l’uomo sarebbe soltanto materia che cade.</p>`,
    onClose: () => {
      if (state.illusions.size === 6) showToast('Hai acceso tutte le illusioni. La verifica finale di questo percorso è pronta.');
      updateHUD();
    }
  });
}

function openWork(key) {
  const info = worksInfo[key];
  if (!state.works.has(key)) {
    state.works.add(key);
    addJournal(`opera-${key}`, info.title, stripHtml(info.body), info.date);
    saveState();
    updateHUD();
    playChord(Object.keys(worksInfo).indexOf(key) + 2);
  }
  openDialogue({
    kicker: info.date,
    title: info.title,
    html: `${info.body}<p class="concept-line"><strong>Opera esplorata:</strong> ${state.works.size} di ${Object.keys(worksInfo).length}.</p>`
  });
}

function stripHtml(html) {
  const node = document.createElement('div');
  node.innerHTML = html;
  return node.textContent.replace(/\s+/g, ' ').trim();
}

function openQuiz(stage) {
  const data = quizSessionBank[stage];
  if (!data) return;
  activeQuiz = { stage, passed: false };
  state.modal = true;
  state.paused = true;
  releasePointer();
  quizKicker.textContent = `Soglia ${worldInfo[stage].numeral}`;
  quizTitle.textContent = data.title;
  quizIntro.textContent = data.intro;
  quizFeedback.hidden = true;
  quizFeedback.className = 'quiz-feedback';
  quizSubmit.textContent = 'Verifica e attraversa';
  quizForm.innerHTML = data.questions.map((question, qIndex) => `
    <fieldset class="quiz-question">
      <legend>${qIndex + 1}. ${question.prompt}</legend>
      ${question.options.map((option, oIndex) => `
        <label class="quiz-option">
          <input type="radio" name="question-${qIndex}" value="${oIndex}">
          <span>${option}</span>
        </label>
      `).join('')}
    </fieldset>
  `).join('');
  quiz.classList.remove('hidden');
}

function submitQuiz() {
  if (!activeQuiz) return;
  if (activeQuiz.passed) {
    completeQuizTransition(activeQuiz.stage);
    return;
  }
  const data = quizSessionBank[activeQuiz.stage];
  const answers = data.questions.map((_, index) => quizForm.querySelector(`input[name="question-${index}"]:checked`));
  if (answers.some((answer) => !answer)) {
    showQuizFeedback('Rispondi a tutte le domande prima di attraversare.', false);
    return;
  }
  const correctCount = answers.reduce((total, answer, index) => total + (Number(answer.value) === data.questions[index].correct ? 1 : 0), 0);
  if (correctCount !== data.questions.length) {
    showQuizFeedback(`Hai risposto correttamente a ${correctCount} domande su ${data.questions.length}. Rileggi lo spazio e riprova: puoi cambiare subito le risposte.`, false);
    playTone(100, 0.25, 'sawtooth', 0.018);
    return;
  }

  state.completed.add(activeQuiz.stage);
  activeQuiz.passed = true;
  addJournal(`soglia-${activeQuiz.stage}`, `Soglia superata: ${worldInfo[activeQuiz.stage].title}`, data.success, 'Verifica completata');
  saveState();
  refreshDiscoveries();
  updateHUD();
  showQuizFeedback(data.success, true);
  quizSubmit.textContent = activeQuiz.stage === 'illusioni' ? 'Entra nella sala delle opere' : activeQuiz.stage === 'fratture' ? 'Entra nelle illusioni' : 'Ritorna al tempio';
  playChord(5);
}

function showQuizFeedback(message, success) {
  quizFeedback.textContent = message;
  quizFeedback.hidden = false;
  quizFeedback.className = `quiz-feedback ${success ? 'is-success' : 'is-error'}`;
}

function completeQuizTransition(stage) {
  quiz.classList.add('hidden');
  state.modal = false;
  activeQuiz = null;
  const next = stage === 'materia' || stage === 'nulla' ? 'tempio' : stage === 'fratture' ? 'illusioni' : 'opere';
  switchWorld(next);
}

function closeQuiz() {
  if (activeQuiz?.passed) {
    completeQuizTransition(activeQuiz.stage);
    return;
  }
  quiz.classList.add('hidden');
  activeQuiz = null;
  state.modal = false;
  resumeGame();
}

function openDialogue({ kicker, title, html, onClose = null }) {
  state.modal = true;
  state.paused = true;
  releasePointer();
  dialogueKicker.textContent = kicker;
  dialogueTitle.textContent = title;
  dialogueBody.innerHTML = html;
  dialogueCallback = onClose;
  dialogue.classList.remove('hidden');
}

function closeDialogue() {
  dialogue.classList.add('hidden');
  const callback = dialogueCallback;
  dialogueCallback = null;
  state.modal = false;
  if (callback) callback();
  if (!state.modal) resumeGame();
}

function isStageUnlocked(stage) {
  if (stage === 'materia') return true;
  const index = stageOrder.indexOf(stage);
  if (index < 1) return false;
  return state.completed.has(stageOrder[index - 1]);
}

function isStageAvailable(stage) {
  return stage === 'tempio' || isStageUnlocked(stage) || state.completed.has(stage);
}

function setWorldNow(key) {
  state.current = key;
  Object.entries(worlds).forEach(([worldKey, group]) => { group.visible = worldKey === key; });
  const info = worldInfo[key];
  scene.background.set(info.background);
  scene.fog.color.set(info.fog);
  scene.fog.density = info.density;
  keyLight.color.set(info.key);
  fillLight.color.set(info.fill);
  rimLight.color.set(info.rim);
  camera.position.set(...info.start);
  yaw = 0;
  pitch = 0;
  camera.rotation.set(0, 0, 0);
  refreshDiscoveries();
  updateHUD();
  saveState();
}

function switchWorld(key, withTransition = true) {
  if (switching || !worlds[key]) return;
  switching = true;
  state.paused = true;
  releasePointer();
  transitionTitle.textContent = worldInfo[key].title;
  transitionCopy.textContent = worldInfo[key].copy;
  if (!withTransition) {
    setWorldNow(key);
    switching = false;
    return;
  }
  sceneTransition.classList.add('is-active');
  setTimeout(() => {
    setWorldNow(key);
    setTimeout(() => {
      sceneTransition.classList.remove('is-active');
      switching = false;
      if (state.started) resumeGame();
    }, 650);
  }, 580);
}

function objectiveForCurrentWorld() {
  if (state.current === 'tempio') {
    if (!state.completed.has('materia')) return 'Trova la porta-colonna della Materia.';
    if (!state.completed.has('nulla')) return 'La porta del Nulla è ora aperta.';
    if (!state.completed.has('fratture')) return 'Attraversa la porta delle Fratture.';
    return 'Le prime tre soglie sono state comprese.';
  }
  if (state.current === 'materia') return 'Osserva gli ingranaggi e raggiungi il test sulla natura.';
  if (state.current === 'nulla') return 'Osserva le vite che si dissolvono, poi raggiungi il test.';
  if (state.current === 'fratture') {
    return state.fractures.size < 4 ? `Esplora le fratture: ${state.fractures.size}/4.` : 'Le quattro fratture sono raccolte: raggiungi la verifica.';
  }
  if (state.current === 'illusioni') {
    return state.illusions.size < 6 ? `Accendi e comprendi le illusioni: ${state.illusions.size}/6.` : 'Le sei illusioni sono accese: raggiungi la verifica.';
  }
  return state.works.size < 5 ? `Esplora le opere di Foscolo: ${state.works.size}/5.` : 'Hai esplorato tutte le opere presenti in questa prima versione.';
}

function updateHUD() {
  const info = worldInfo[state.current];
  chapterNumber.textContent = info.numeral;
  chapterTitle.textContent = info.title;
  objectiveText.textContent = objectiveForCurrentWorld();
  document.querySelectorAll('#journey [data-stage]').forEach((element) => {
    const stage = element.dataset.stage;
    element.classList.toggle('is-unlocked', isStageUnlocked(stage));
    element.classList.toggle('is-complete', state.completed.has(stage));
    element.classList.toggle('is-current', state.current === stage || (state.current === 'tempio' && stage === nextIncompleteStage()));
  });
}

function nextIncompleteStage() {
  return stageOrder.find((stage) => !state.completed.has(stage)) || 'opere';
}

function refreshDiscoveries() {
  Object.entries(portalRefs).forEach(([key, portal]) => {
    const unlocked = isStageUnlocked(key);
    const completed = state.completed.has(key);
    const veil = portal.userData.veil;
    if (!veil) return;
    veil.material.opacity = unlocked ? (completed ? 0.34 : 0.62) : 0.09;
    veil.material.emissiveIntensity = unlocked ? 0.82 : 0.06;
  });
  Object.entries(fractureRefs).forEach(([key, station]) => {
    const found = state.fractures.has(key);
    station.userData.ring.material.opacity = found ? 1 : 0.38;
    station.userData.ring.scale.setScalar(found ? 1.07 : 1);
  });
  Object.entries(illusionRefs).forEach(([key, shrine]) => {
    const active = state.illusions.has(key);
    shrine.userData.orb.material.emissiveIntensity = active ? 2.1 : 0.3;
    shrine.userData.orb.material.opacity = active ? 1 : 0.72;
    shrine.userData.ring.material.opacity = active ? 0.94 : 0.4;
  });
}

function addJournal(id, title, text, source) {
  if (state.journal.some((entry) => entry.id === id)) return;
  state.journal.push({ id, title, text, source });
  renderJournal();
}

function renderJournal() {
  if (!state.journal.length) {
    journalContent.innerHTML = '<p class="journal-empty">Il taccuino è ancora vuoto. Attraversa le colonne, osserva gli oggetti e interagisci: qui raccoglierai la logica del pensiero foscoliano.</p>';
    return;
  }
  journalContent.innerHTML = state.journal.map((entry) => `
    <article class="journal-entry">
      <h3>${entry.title}</h3>
      <p>${entry.text}</p>
      <small>${entry.source || 'Esperienza di gioco'}</small>
    </article>
  `).join('');
}

function toggleJournal(force) {
  const open = typeof force === 'boolean' ? force : !journal.classList.contains('open');
  journal.classList.toggle('open', open);
  journal.setAttribute('aria-hidden', String(!open));
  if (open) {
    state.paused = true;
    releasePointer();
  } else {
    resumeGame();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      current: state.current,
      completed: [...state.completed],
      fractures: [...state.fractures],
      illusions: [...state.illusions],
      works: [...state.works],
      journal: state.journal,
      audioOn: state.audioOn
    }));
  } catch (error) {
    console.warn('Salvataggio non disponibile', error);
  }
}

function showToast(message, duration = 3400) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove('hidden');
  toastTimer = setTimeout(() => toast.classList.add('hidden'), duration);
}

function findInteractable() {
  if (!state.started || state.paused || state.modal || switching) return null;
  camera.getWorldDirection(tmpV);
  let best = null;
  let bestScore = Infinity;
  for (const object of interactables) {
    if (!isObjectVisible(object)) continue;
    object.getWorldPosition(tmpV2);
    tmpV2.y = Math.max(1.3, tmpV2.y);
    const distance = camera.position.distanceTo(tmpV2);
    if (distance > (isTouch ? 6.4 : 5.8)) continue;
    const direction = tmpV2.clone().sub(camera.position).normalize();
    const dot = tmpV.dot(direction);
    if (dot < (isTouch ? 0.55 : 0.72)) continue;
    const score = distance + (1 - dot) * 7;
    if (score < bestScore) {
      bestScore = score;
      best = object;
    }
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
  if (state.modal || switching) return;
  const target = currentInteractable || findInteractable();
  if (target?.userData.interaction) {
    target.userData.interaction.action();
    playTone(320, 0.08, 'square', 0.012);
  }
}

function bindEvents() {
  startButton.addEventListener('click', beginGame);

  canvas.addEventListener('click', () => {
    if (state.started && !isTouch && !state.modal && !journal.classList.contains('open') && !switching) {
      requestFirstPersonLock();
    }
  });

  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement !== canvas) clearMovementInput();
    if (!isTouch && state.started && !state.modal && !journal.classList.contains('open') && !switching) {
      state.paused = false;
    }
  });

  document.addEventListener('mousemove', (event) => {
    if (state.paused || state.modal) return;
    if (document.pointerLockElement === canvas) {
      yaw -= event.movementX * 0.0021;
      pitch -= event.movementY * 0.0019;
    } else if (draggingLook) {
      yaw -= (event.clientX - dragLookX) * 0.005;
      pitch -= (event.clientY - dragLookY) * 0.004;
      dragLookX = event.clientX;
      dragLookY = event.clientY;
    } else {
      return;
    }
    pitch = THREE.MathUtils.clamp(pitch, -1.2, 1.2);
  });

  canvas.addEventListener('mousedown', (event) => {
    if (document.pointerLockElement === canvas) return;
    draggingLook = true;
    dragLookX = event.clientX;
    dragLookY = event.clientY;
  });
  document.addEventListener('mouseup', () => { draggingLook = false; });

  document.addEventListener('keydown', (event) => {
    if (movementKeys.has(event.code)) {
      if (state.started && !state.modal && !switching && !journal.classList.contains('open')) {
        event.preventDefault();
        keys.add(event.code);
      }
      return;
    }
    if (event.code === 'KeyE' && !event.repeat) performInteraction();
    if (event.code === 'KeyJ' && !event.repeat) toggleJournal();
    if (event.code === 'Escape' && journal.classList.contains('open')) toggleJournal(false);
  });
  document.addEventListener('keyup', (event) => {
    if (movementKeys.has(event.code)) {
      event.preventDefault();
      keys.delete(event.code);
    }
  });
  window.addEventListener('blur', clearMovementInput);
  window.addEventListener('focus', clearMovementInput);
  window.addEventListener('pagehide', clearMovementInput);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearMovementInput();
  });

  dialogueNext.addEventListener('click', closeDialogue);
  quizForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitQuiz();
  });
  quizClose.addEventListener('click', closeQuiz);
  $('journal-button').addEventListener('click', () => toggleJournal());
  $('journal-close').addEventListener('click', () => toggleJournal(false));
  mobileAction.addEventListener('pointerdown', (event) => { event.preventDefault(); performInteraction(); });
  mobileJournal.addEventListener('pointerdown', (event) => { event.preventDefault(); toggleJournal(); });
  audioButton.addEventListener('click', () => setAudio(!state.audioOn));
  $('reset-button').addEventListener('click', () => {
    if (confirm('Vuoi cancellare i progressi e ricominciare dal tempio?')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });
  addEventListener('resize', onResize);
  setupTouchControls();
}

function beginGame() {
  if (state.started) return;
  clearMovementInput();
  state.started = true;
  state.paused = false;
  startScreen.classList.remove('screen--active');
  hud.classList.remove('hidden');
  crosshair.classList.remove('hidden');
  if (isTouch) {
    mobileControls.classList.remove('hidden');
    mobileControls.setAttribute('aria-hidden', 'false');
  } else if (!previewAutoStart) {
    requestFirstPersonLock();
  }
  initAudio();
  if (!state.journal.length) {
    addJournal('inizio', 'La domanda iniziale', 'Come si vive dentro un mondo che non possiede un senso prestabilito?', 'Tempio delle soglie');
    saveState();
  }
  showToast(objectiveForCurrentWorld());
  if (previewQuiz === state.current && quizSessionBank[previewQuiz]) {
    setTimeout(() => openQuiz(previewQuiz), 250);
  }
}

function setupTouchControls() {
  if (!isTouch) return;
  let joyId = null;
  let joyCenter = { x: 0, y: 0 };
  joystick.addEventListener('pointerdown', (event) => {
    joyId = event.pointerId;
    joystick.setPointerCapture(event.pointerId);
    const rect = joystick.getBoundingClientRect();
    joyCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    updateJoystick(event);
  });
  joystick.addEventListener('pointermove', (event) => { if (event.pointerId === joyId) updateJoystick(event); });
  const endJoystick = (event) => {
    if (event.pointerId !== joyId) return;
    joyId = null;
    mobileMove.set(0, 0);
    joystickKnob.style.transform = 'translate(0px, 0px)';
  };
  joystick.addEventListener('pointerup', endJoystick);
  joystick.addEventListener('pointercancel', endJoystick);

  function updateJoystick(event) {
    const dx = event.clientX - joyCenter.x;
    const dy = event.clientY - joyCenter.y;
    const length = Math.hypot(dx, dy) || 1;
    const max = 31;
    const scale = Math.min(1, max / length);
    const x = dx * scale;
    const y = dy * scale;
    joystickKnob.style.transform = `translate(${x}px, ${y}px)`;
    mobileMove.set(x / max, -y / max);
  }

  let lookId = null;
  let lastX = 0;
  let lastY = 0;
  lookZone.addEventListener('pointerdown', (event) => {
    lookId = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    lookZone.setPointerCapture(event.pointerId);
  });
  lookZone.addEventListener('pointermove', (event) => {
    if (event.pointerId !== lookId || state.paused || state.modal) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    yaw -= dx * 0.006;
    pitch -= dy * 0.005;
    pitch = THREE.MathUtils.clamp(pitch, -1.2, 1.2);
  });
  const endLook = (event) => { if (event.pointerId === lookId) lookId = null; };
  lookZone.addEventListener('pointerup', endLook);
  lookZone.addEventListener('pointercancel', endLook);
}

function resumeGame() {
  if (!state.started || state.modal || switching) return;
  if (isTouch) {
    state.paused = false;
  } else {
    state.paused = false;
    requestFirstPersonLock();
  }
}

function requestFirstPersonLock() {
  if (isTouch || !canvas.requestPointerLock) return;
  try {
    const request = canvas.requestPointerLock();
    request?.catch?.(() => { state.paused = false; });
  } catch (error) {
    state.paused = false;
  }
}

function releasePointer() {
  clearMovementInput();
  if (document.pointerLockElement) document.exitPointerLock?.();
}

function clearMovementInput() {
  keys.clear();
  mobileMove.set(0, 0);
  draggingLook = false;
  if (joystickKnob) joystickKnob.style.transform = 'translate(0px, 0px)';
}

function onResize() {
  if (!renderer || !camera) return;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, isTouch ? 1.3 : 1.75));
}

function updateMovement(delta, time) {
  if (state.paused || state.modal || switching) return;
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;

  const moveRight = keys.has('KeyD') || keys.has('ArrowRight');
  const moveLeft = keys.has('KeyA') || keys.has('ArrowLeft');
  const moveForward = keys.has('KeyW') || keys.has('ArrowUp');
  const moveBackward = keys.has('KeyS') || keys.has('ArrowDown');
  const inputX = (moveRight ? 1 : 0) - (moveLeft ? 1 : 0) + mobileMove.x;
  const inputZ = (moveForward ? 1 : 0) - (moveBackward ? 1 : 0) + mobileMove.y;
  const input = new THREE.Vector2(inputX, inputZ);
  if (input.lengthSq() > 1) input.normalize();
  const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? 6.2 : 4.1;

  camera.getWorldDirection(tmpV);
  tmpV.y = 0;
  tmpV.normalize();
  tmpV2.crossVectors(tmpV, camera.up).normalize();
  camera.position.addScaledVector(tmpV, input.y * speed * delta);
  camera.position.addScaledVector(tmpV2, input.x * speed * delta);

  const moving = input.lengthSq() > 0.04;
  camera.position.y = 1.72 + (moving ? Math.sin(time * 8.4) * 0.026 : 0);
  const maxRadius = state.current === 'opere' ? 17.1 : state.current === 'illusioni' ? 16.6 : 15.6;
  const radius = Math.hypot(camera.position.x, camera.position.z);
  if (radius > maxRadius) {
    camera.position.x *= maxRadius / radius;
    camera.position.z *= maxRadius / radius;
  }
}

function updateInteractions() {
  if (!state.started || state.paused || state.modal || switching) {
    interactionPrompt.classList.add('hidden');
    currentInteractable = null;
    return;
  }
  currentInteractable = findInteractable();
  if (currentInteractable) {
    interactionText.textContent = currentInteractable.userData.interaction.label;
    interactionPrompt.classList.remove('hidden');
  } else {
    interactionPrompt.classList.add('hidden');
  }
}

function updateAnimated(delta, time) {
  for (const animation of animated) {
    if (animation.stage && animation.stage !== state.current) continue;
    if (!isObjectVisible(animation.object)) continue;
    if (animation.type === 'gear') {
      animation.object.rotation.z += animation.speed * delta;
    } else if (animation.type === 'fallingGear') {
      animation.object.rotation.z += animation.speed * delta;
      if (!animation.armed) {
        animation.armed = true;
        animation.nextFall = time + animation.delay;
      }
      if (time >= animation.nextFall) animation.object.position.y -= animation.fallSpeed * delta;
      if (animation.object.position.y < -2.3) {
        animation.object.position.set(-8 + Math.random() * 16, 6 + Math.random() * 4, -4 - Math.random() * 6);
        animation.nextFall = time + 3 + Math.random() * 8;
      }
    } else if (animation.type === 'portal') {
      const base = animation.object.material.emissiveIntensity < 0.1 ? 0.08 : 0.5;
      if (base > 0.1) animation.object.material.opacity = base + Math.sin(time * animation.speed) * 0.1;
    } else if (animation.type === 'person') {
      animation.age += delta;
      const progress = (animation.age % animation.duration) / animation.duration;
      animation.object.position.x = animation.originX + Math.sin(time * 0.42 + animation.phase) * 1.25;
      animation.object.position.z = animation.originZ + Math.sin(time * 0.3 + animation.phase * 0.7) * 0.9;
      animation.object.rotation.y = Math.sin(time * 0.4 + animation.phase) * 0.7;
      const opacity = progress < 0.58 ? 1 : Math.max(0, 1 - (progress - 0.58) / 0.34);
      animation.object.userData.fadeMaterials.forEach((material) => { material.opacity = opacity; });
      animation.object.userData.bubble.visible = opacity > 0.58 && Math.sin(time * 1.1 + animation.phase) > -0.2;
    } else if (animation.type === 'illusion') {
      animation.orb.position.y = animation.baseY + Math.sin(time * animation.speed + animation.phase) * 0.16;
      animation.orb.rotation.y += delta * 0.42;
      animation.ring.rotation.z += delta * 0.26;
    } else if (animation.type === 'book') {
      const y = animation.baseY + Math.sin(time * 0.65 + animation.phase) * 0.09;
      animation.object.position.y = y;
      animation.covers.forEach((cover) => { cover.position.y = y; });
    } else if (animation.type === 'void') {
      animation.object.rotation.y -= delta * animation.speed;
      animation.object.position.y = Math.sin(time * 0.08) * 0.2;
    } else if (animation.type === 'ash') {
      animation.object.rotation.y += delta * animation.speed;
      animation.object.position.y = -((time * 0.04) % 1);
    } else if (animation.type === 'glow') {
      animation.object.rotation.y += delta * animation.speed;
      animation.object.position.y = Math.sin(time * 0.16) * 0.3;
    } else if (animation.type === 'drift') {
      animation.object.rotation.y += delta * animation.speed;
      animation.object.position.y = Math.sin(time * 0.12) * 0.22;
    }
  }
}

function animate(now = 0) {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  const time = now / 1000;
  updateMovement(delta, time);
  updateInteractions();
  updateAnimated(delta, time);
  renderer.render(scene, camera);
}

function initAudio() {
  if (audioCtx) {
    audioCtx.resume();
    return;
  }
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = state.audioOn ? 0.46 : 0;
    masterGain.connect(audioCtx.destination);
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 270;
    filter.Q.value = 0.7;
    filter.connect(masterGain);
    [43, 64.5, 86].forEach((frequency, index) => {
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      oscillator.type = index === 1 ? 'triangle' : 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.023 : 0.012;
      oscillator.connect(gain).connect(filter);
      oscillator.start();
      ambientNodes.push(oscillator, gain);
    });
  } catch (error) {
    state.audioOn = false;
    console.warn('Audio non disponibile', error);
  }
  updateAudioButton();
}

function setAudio(on) {
  state.audioOn = on;
  if (!audioCtx) initAudio();
  if (masterGain && audioCtx) {
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(on ? 0.46 : 0, audioCtx.currentTime + 0.18);
  }
  saveState();
  updateAudioButton();
}

function updateAudioButton() {
  audioButton.textContent = state.audioOn ? '◉' : '○';
  audioButton.setAttribute('aria-label', state.audioOn ? 'Disattiva audio' : 'Attiva audio');
}

function playTone(frequency = 220, duration = 0.2, type = 'sine', volume = 0.025) {
  if (!audioCtx || !masterGain || !state.audioOn) return;
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  oscillator.connect(gain).connect(masterGain);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

function playChord(index = 0) {
  const roots = [196, 220, 246.94, 261.63, 293.66, 329.63];
  const root = roots[index % roots.length];
  [1, 1.25, 1.5].forEach((ratio, noteIndex) => {
    setTimeout(() => playTone(root * ratio, 0.75, 'sine', 0.016), noteIndex * 55);
  });
}

updateAudioButton();
