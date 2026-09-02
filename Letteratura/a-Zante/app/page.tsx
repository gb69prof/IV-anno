"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "guided" | "free" | null;
type View =
  | "map"
  | "approdo"
  | "fratture"
  | "illusioni"
  | "ortis"
  | "sepolcri"
  | "grazie"
  | "sera"
  | "zacinto";
type MechanismId = "materia" | "causa" | "tempo" | "uomo";
type FractureId =
  | "patria"
  | "liberta"
  | "esilio"
  | "fratello"
  | "amore"
  | "morte"
  | "gloria";
type IllusionId =
  | "patria"
  | "affetti"
  | "memoria"
  | "liberta"
  | "bellezza"
  | "gloria"
  | "poesia";
type OrtisId =
  | "scrittura"
  | "patria"
  | "amore"
  | "natura"
  | "azione"
  | "suicidio";
type SepolcriId =
  | "editto"
  | "materia"
  | "affetti"
  | "parini"
  | "santacroce"
  | "poesia";
type GrazieId =
  | "frammento"
  | "venere"
  | "vesta"
  | "pallade"
  | "velo"
  | "canova";
type SeraId = "quiete" | "stagioni" | "tempo" | "spirito";
type ZacintoId = "mai" | "madre" | "venere" | "ulisse" | "canto";

type Stop = {
  id: string;
  eyebrow: string;
  title: string;
  short: string;
  prompt: string;
  x: number;
  y: number;
};

type MechanismNote = {
  id: MechanismId;
  number: string;
  label: string;
  title: string;
  explanation: string;
  consequence: string;
};

type Fracture = {
  id: FractureId;
  number: string;
  label: string;
  title: string;
  image: string;
  wound: string;
  consequence: string;
};

type Illusion = {
  id: IllusionId;
  number: string;
  label: string;
  title: string;
  construction: string;
  effect: string;
  works: string;
};

type OrtisNode = {
  id: OrtisId;
  number: string;
  label: string;
  title: string;
  focus: string;
  meaning: string;
};

type SepolcriNode = {
  id: SepolcriId;
  number: string;
  label: string;
  title: string;
  poem: string;
  meaning: string;
};

type GrazieNode = {
  id: GrazieId;
  number: string;
  label: string;
  title: string;
  scene: string;
  meaning: string;
};

type SeraNode = {
  id: SeraId;
  number: string;
  label: string;
  title: string;
  verses: string;
  movement: string;
  meaning: string;
};

type ZacintoNode = {
  id: ZacintoId;
  number: string;
  label: string;
  title: string;
  verses: string;
  image: string;
  meaning: string;
};

const stops: Stop[] = [
  {
    id: "approdo",
    eyebrow: "Tappa 1 · Filosofia di base",
    title: "Approdo — Natura meccanicista",
    short: "Materia, movimento, causa, necessità",
    prompt: "Se tutto è materia in movimento, dove può trovare posto la libertà?",
    x: 87,
    y: 82,
  },
  {
    id: "fratture",
    eyebrow: "Tappa 2 · Le fratture",
    title: "Fortezza delle fratture",
    short: "Patria, storia, esilio, morte",
    prompt: "Che cosa accade quando la ragione non riesce più a rendere abitabile il mondo?",
    x: 47,
    y: 71,
  },
  {
    id: "illusioni",
    eyebrow: "Tappa 3 · Immagine del mondo",
    title: "Casa delle illusioni",
    short: "Affetti, bellezza, memoria, poesia",
    prompt: "Un valore può salvarci anche quando sappiamo che è stato costruito dall’uomo?",
    x: 39,
    y: 47,
  },
  {
    id: "ortis",
    eyebrow: "Tappa 4 · Opera",
    title: "Radura di Jacopo — Ortis",
    short: "La crisi diventa scrittura",
    prompt: "Quando patria e amore falliscono insieme, che cosa resta all’individuo?",
    x: 56,
    y: 20,
  },
  {
    id: "sepolcri",
    eyebrow: "Tappa 5 · Opera",
    title: "Memoria e sepoltura",
    short: "Dei Sepolcri",
    prompt: "La tomba serve a chi muore o a chi continua a ricordare?",
    x: 79,
    y: 28,
  },
  {
    id: "grazie",
    eyebrow: "Tappa 6 · Opera",
    title: "Giardino delle Grazie",
    short: "La bellezza educa la forza",
    prompt: "Può l’arte rendere più civile ciò che nell’uomo resta violento?",
    x: 67,
    y: 59,
  },
  {
    id: "sera",
    eyebrow: "Tappa 7 · Opera",
    title: "Scogliera — Alla sera",
    short: "Quiete, tempo, annullamento",
    prompt: "Perché la sera placa il conflitto interiore del poeta?",
    x: 25,
    y: 13,
  },
  {
    id: "zacinto",
    eyebrow: "Epilogo · Il ritorno impossibile",
    title: "Nave dell’esilio — A Zacinto",
    short: "L’isola diventa memoria",
    prompt: "Si può tornare in una patria soltanto attraverso la poesia?",
    x: 8,
    y: 18,
  },
];

const manualTargets: Record<
  View,
  { href: string; eyebrow: string; title: string }
> = {
  map: {
    href: "../Foscolo/index.html",
    eyebrow: "L’altra porta",
    title: "Apri il manuale di studio",
  },
  approdo: {
    href: "../Foscolo/lezioni/introduzione.html#meccanicismo",
    eyebrow: "Dal simbolo al concetto",
    title: "Studia il meccanicismo",
  },
  fratture: {
    href: "../Foscolo/lezioni/fratture.html#biografia-ferita",
    eyebrow: "Dalla fortezza alla biografia",
    title: "Studia le fratture",
  },
  illusioni: {
    href: "../Foscolo/lezioni/immagine-del-mondo.html#religione-illusioni",
    eyebrow: "Dalla casa alla teoria",
    title: "Studia le illusioni",
  },
  ortis: {
    href: "../Foscolo/lezioni/ortis-parini.html#prima-di-leggere",
    eyebrow: "Dalla radura al testo",
    title: "Studia Ortis e Parini",
  },
  sepolcri: {
    href: "../Foscolo/lezioni/opere.html#dei-sepolcri",
    eyebrow: "Dalla memoria al carme",
    title: "Studia Dei Sepolcri",
  },
  grazie: {
    href: "../Foscolo/lezioni/opere.html#le-grazie",
    eyebrow: "Dal giardino all’opera",
    title: "Studia Le Grazie",
  },
  sera: {
    href: "../Foscolo/lezioni/alla-sera.html#testo-alla-sera",
    eyebrow: "Dalla scogliera ai versi",
    title: "Leggi Alla sera",
  },
  zacinto: {
    href: "../Foscolo/lezioni/opere.html#a-zacinto",
    eyebrow: "Dalla nave al sonetto",
    title: "Studia A Zacinto",
  },
};

const mechanismNotes: MechanismNote[] = [
  {
    id: "materia",
    number: "01",
    label: "Materia",
    title: "Nulla esiste fuori dalla natura",
    explanation:
      "La realtà non è guidata da uno spirito provvidenziale: è materia che nasce, si trasforma e si dissolve.",
    consequence:
      "L’uomo non possiede una sostanza separata dal corpo e non occupa un posto privilegiato nel cosmo.",
  },
  {
    id: "causa",
    number: "02",
    label: "Causa",
    title: "Ogni movimento produce un altro movimento",
    explanation:
      "Come negli ingranaggi, ogni evento deriva da cause e diventa a sua volta causa di altri eventi.",
    consequence:
      "La natura non premia il bene e non punisce il male: ciò che accade non risponde a un criterio di giustizia.",
  },
  {
    id: "tempo",
    number: "03",
    label: "Tempo",
    title: "La macchina non si arresta",
    explanation:
      "Il tempo consuma individui, affetti, popoli e civiltà. La natura continua oltre ogni singola vita.",
    consequence:
      "La morte non apre un’altra esistenza: restituisce il corpo al ciclo impersonale della materia.",
  },
  {
    id: "uomo",
    number: "04",
    label: "Uomo",
    title: "Consapevole, ma non sovrano",
    explanation:
      "L’essere umano è parte della macchina naturale, ma sa di dover morire e desidera ciò che il mondo non garantisce.",
    consequence:
      "Patria, amore, memoria, gloria e poesia diventano costruzioni umane necessarie per dare forma alla vita.",
  },
];

const fractures: Fracture[] = [
  {
    id: "patria",
    number: "01",
    label: "Patria perduta",
    title: "Zante resta visibile, ma irraggiungibile",
    image: "L’isola oltre l’arco",
    wound:
      "Foscolo nasce a Zante e ne porta con sé lingua, luce e mito. L’esilio trasforma la patria in un luogo che può essere ricordato e cantato, ma non più abitato.",
    consequence:
      "L’appartenenza non coincide più con il possesso di una terra: diventa nostalgia, identità ferita e desiderio di ritorno.",
  },
  {
    id: "liberta",
    number: "02",
    label: "Libertà tradita",
    title: "Napoleone spezza la promessa politica",
    image: "Campoformio sulla carta lacerata",
    wound:
      "Foscolo aveva riconosciuto in Napoleone il liberatore capace di rinnovare l’Italia. Il trattato di Campoformio consegna Venezia all’Austria e distrugge quella fiducia.",
    consequence:
      "La storia non appare come progresso morale: gli ideali possono essere usati dal potere e poi sacrificati.",
  },
  {
    id: "esilio",
    number: "03",
    label: "Esilio",
    title: "La nave si allontana dalla costa",
    image: "Una rotta senza ritorno",
    wound:
      "Lasciare la propria terra non è soltanto cambiare luogo. Significa vivere senza una dimora definitiva, attraversando città e nazioni come ospite o fuggiasco.",
    consequence:
      "L’identità diventa mobile e inquieta. La scrittura assume il compito di conservare ciò che la vita disperde.",
  },
  {
    id: "fratello",
    number: "04",
    label: "Morte di Giovanni",
    title: "Una sedia vuota accanto alla madre",
    image: "Il lutto nella stanza familiare",
    wound:
      "La morte del giovane fratello Giovanni rende concreta la dissoluzione degli affetti. Foscolo è lontano e non può condividere pienamente il dolore della madre.",
    consequence:
      "La tomba e il ricordo diventano il luogo simbolico in cui una famiglia dispersa può ancora ricomporsi.",
  },
  {
    id: "amore",
    number: "05",
    label: "Amore impossibile",
    title: "La figura amata svanisce",
    image: "Una presenza che si dissolve",
    wound:
      "Nella vita e nella scrittura l’amore promette rifugio, pienezza e riconciliazione. Ma la precarietà personale e storica impedisce che quella promessa duri.",
    consequence:
      "L’amore resta necessario pur essendo fragile: un’illusione vitale che consola, ma non elimina il conflitto.",
  },
  {
    id: "morte",
    number: "06",
    label: "Dissoluzione",
    title: "Il corpo ritorna alla materia",
    image: "La figura assorbita dalla natura",
    wound:
      "La filosofia materialista non offre a Foscolo la certezza di un’anima immortale o di un’esistenza oltre la morte.",
    consequence:
      "La sopravvivenza non può essere biologica o ultraterrena: dovrà essere affidata agli affetti, alla memoria e alle opere.",
  },
  {
    id: "gloria",
    number: "07",
    label: "Gloria incerta",
    title: "I manoscritti sono esposti al vento",
    image: "Pagine che il tempo può disperdere",
    wound:
      "Anche la fama letteraria è fragile. Un’opera può essere dimenticata, deformata o distrutta: il poeta non controlla il proprio futuro.",
    consequence:
      "La poesia è una sfida contro il tempo, non una vittoria garantita. La gloria resta una costruzione affidata alla memoria degli altri.",
  },
];

const illusions: Illusion[] = [
  {
    id: "patria",
    number: "01",
    label: "Patria",
    title: "Una terra diventa appartenenza",
    construction:
      "La patria non è soltanto un territorio. È il racconto condiviso con cui gli uomini riconoscono un’origine, una lingua e un destino comune.",
    effect:
      "Dà identità a chi è disperso e trasforma il ricordo di Zante in una casa interiore che l’esilio non può confiscare.",
    works: "A Zacinto · Ultime lettere di Jacopo Ortis",
  },
  {
    id: "affetti",
    number: "02",
    label: "Affetti",
    title: "I legami rendono abitabile la vita",
    construction:
      "Amore, amicizia e famiglia non cancellano la morte. Creano però una rete di significati che sottrae l’individuo alla solitudine.",
    effect:
      "Una vita mortale acquista valore perché qualcuno la ama, la attende e continuerà a ricordarla.",
    works: "In morte del fratello Giovanni · Ortis",
  },
  {
    id: "memoria",
    number: "03",
    label: "Memoria",
    title: "I morti continuano nel dialogo dei vivi",
    construction:
      "La tomba non conserva biologicamente una persona. La memoria costruisce una presenza simbolica attraverso nomi, gesti e luoghi.",
    effect:
      "Unisce le generazioni, custodisce gli esempi civili e permette agli affetti di resistere alla dissoluzione materiale.",
    works: "Dei Sepolcri · In morte del fratello Giovanni",
  },
  {
    id: "liberta",
    number: "04",
    label: "Libertà",
    title: "Un ideale resta necessario anche se tradito",
    construction:
      "La libertà politica non è garantita dalla natura né dalla storia. È un progetto umano che può essere sconfitto o manipolato.",
    effect:
      "Consente di giudicare il potere e impedisce di accettare l’oppressione come semplice necessità dei fatti.",
    works: "Ultime lettere di Jacopo Ortis · Orazioni",
  },
  {
    id: "bellezza",
    number: "05",
    label: "Bellezza",
    title: "L’armonia educa ciò che nell’uomo è violento",
    construction:
      "La bellezza nasce da forme, miti e gesti creati dagli uomini. Non elimina la forza, ma le impone misura.",
    effect:
      "Rende possibile la civiltà: trasforma l’istinto in rispetto, il dolore in forma e il conflitto in convivenza.",
    works: "Le Grazie · All’amica risanata",
  },
  {
    id: "gloria",
    number: "06",
    label: "Gloria",
    title: "Il nome tenta di oltrepassare la morte",
    construction:
      "La gloria dipende dalla memoria degli altri. È incerta e fragile, ma offre all’azione umana un orizzonte più lungo della vita individuale.",
    effect:
      "Spinge a lasciare opere ed esempi degni di essere trasmessi, opponendo alla scomparsa una sopravvivenza pubblica.",
    works: "Dei Sepolcri · All’amica risanata",
  },
  {
    id: "poesia",
    number: "07",
    label: "Poesia",
    title: "La parola ricompone ciò che la storia disperde",
    construction:
      "La poesia non rende immortale il corpo. Seleziona, ordina e trasfigura l’esperienza, consegnandola alla coscienza di altri uomini.",
    effect:
      "Conserva i nomi, restituisce una patria all’esule e crea l’unica eternità che Foscolo può accettare senza negare il materialismo.",
    works: "A Zacinto · Dei Sepolcri · Le Grazie",
  },
];

const ortisNodes: OrtisNode[] = [
  {
    id: "scrittura",
    number: "01",
    label: "Le lettere",
    title: "Jacopo scrive perché non può agire",
    focus:
      "Il romanzo è costruito come una raccolta di lettere indirizzate all’amico Lorenzo Alderani. Date, luoghi e confessioni danno alla crisi l’immediatezza di una voce vissuta.",
    meaning:
      "La forma epistolare non racconta il crollo dall’esterno: costringe il lettore ad attraversarlo giorno dopo giorno, senza conoscere ancora la fine.",
  },
  {
    id: "patria",
    number: "02",
    label: "La patria",
    title: "Campoformio distrugge l’azione politica",
    focus:
      "La cessione di Venezia all’Austria dimostra a Jacopo che la libertà promessa può essere venduta dalla stessa storia che sembrava realizzarla.",
    meaning:
      "La frattura pubblica diventa personale: non potendo servire una patria libera, Jacopo sente che la propria esistenza ha perduto direzione.",
  },
  {
    id: "amore",
    number: "03",
    label: "Teresa",
    title: "L’amore promette una patria privata",
    focus:
      "Teresa offre a Jacopo la possibilità di un rifugio negli affetti. Ma è destinata per volontà familiare a sposare Odoardo.",
    meaning:
      "L’amore non fallisce perché è falso: fallisce perché la società e la storia impediscono che diventi una vita condivisa.",
  },
  {
    id: "natura",
    number: "04",
    label: "La natura",
    title: "Il paesaggio diventa uno specchio interiore",
    focus:
      "Colli, tramonti, tempeste e rovine mutano insieme allo stato d’animo di Jacopo. La natura concede tregua, ma non offre una soluzione morale.",
    meaning:
      "Il paesaggio preromantico rende visibile l’interiorità: armonia quando l’illusione resiste, disordine quando la crisi prevale.",
  },
  {
    id: "azione",
    number: "05",
    label: "Il conflitto",
    title: "Jacopo rifiuta il compromesso",
    focus:
      "Non accetta di adattarsi al tradimento politico né di trasformare l’amore in una relazione clandestina o rassegnata.",
    meaning:
      "La sua assolutezza è insieme grandezza e limite: se ogni compromesso appare corruzione, nessuna azione concreta resta possibile.",
  },
  {
    id: "suicidio",
    number: "06",
    label: "La fine",
    title: "Il suicidio chiude ciò che Jacopo non sa trasformare",
    focus:
      "Dopo il fallimento della patria e dell’amore, Jacopo rivolge contro se stesso l’energia che non riesce più a convertire in azione.",
    meaning:
      "Il romanzo non propone un modello da imitare: mostra l’esito tragico di un individuo che identifica completamente la vita con illusioni ormai spezzate.",
  },
];

const sepolcriNodes: SepolcriNode[] = [
  {
    id: "editto",
    number: "01",
    label: "L’editto",
    title: "Una legge moderna rischia di cancellare le differenze",
    poem:
      "Nel 1806 la normativa napoleonica sulle sepolture viene applicata anche in Italia: i cimiteri sono collocati fuori dai centri abitati e le iscrizioni sottoposte al controllo pubblico.",
    meaning:
      "L’editto è l’occasione del carme, non la sua vera tesi. Il problema di Foscolo è capire che cosa si perde quando la tomba non distingue più una storia, un affetto e un esempio.",
  },
  {
    id: "materia",
    number: "02",
    label: "La materia",
    title: "Per chi è morto, la tomba non serve",
    poem:
      "Foscolo parte dalla propria filosofia materialista: la morte dissolve l’individuo e lo restituisce al ciclo della natura. Il morto non può ricevere consolazione dall’urna.",
    meaning:
      "Il carme non rinnega il meccanicismo e non introduce un aldilà religioso. Sposta la domanda: non che cosa faccia la tomba ai morti, ma che cosa produca nei vivi.",
  },
  {
    id: "affetti",
    number: "03",
    label: "Gli affetti",
    title: "La tomba rende possibile un dialogo dei vivi con i morti",
    poem:
      "Un nome, un luogo e la cura di chi resta alimentano la «corrispondenza d’amorosi sensi»: la persona perduta continua a vivere nella coscienza e nei gesti di chi l’ha amata.",
    meaning:
      "La memoria non è immortalità biologica. È una presenza simbolica costruita dagli affetti: fragile, umana, ma capace di modificare realmente la vita.",
  },
  {
    id: "parini",
    number: "04",
    label: "Parini",
    title: "Una sepoltura anonima può diventare un’ingiustizia civile",
    poem:
      "Il destino della tomba di Parini mostra il rischio della dimenticanza: il poeta che ha educato la città può essere confuso con chi non ha lasciato alcun esempio degno.",
    meaning:
      "Foscolo non difende il privilegio sociale delle tombe monumentali. Difende il diritto della comunità a riconoscere e trasmettere il valore di una vita.",
  },
  {
    id: "santacroce",
    number: "05",
    label: "Santa Croce",
    title: "Le tombe dei grandi trasformano il ricordo in energia civile",
    poem:
      "A Santa Croce i sepolcri di Machiavelli, Michelangelo e Galileo compongono una memoria nazionale: chi li visita incontra esempi capaci di suscitare azione e dignità.",
    meaning:
      "La tomba passa dalla sfera privata a quella pubblica. Una comunità diventa popolo quando sceglie quali esempi custodire e quale futuro immaginare attraverso di essi.",
  },
  {
    id: "poesia",
    number: "06",
    label: "La poesia",
    title: "Quando anche la pietra cade, resta la parola",
    poem:
      "I monumenti vengono consumati dal tempo. Nell’ultima parte del carme, Troia sopravvive perché Omero raccoglie le voci dei vinti e le consegna alle generazioni future.",
    meaning:
      "La poesia compie più a lungo la funzione del sepolcro: conserva i nomi, giudica la storia e restituisce una voce anche a ciò che la forza ha distrutto.",
  },
];

const grazieNodes: GrazieNode[] = [
  {
    id: "frammento",
    number: "01",
    label: "Il frammento",
    title: "Un’opera incompiuta può possedere un disegno",
    scene:
      "Foscolo lavora alle Grazie per molti anni senza consegnare un testo definitivo. Restano frammenti, riscritture e tre inni dedicati a Venere, Vesta e Pallade.",
    meaning:
      "L’incompiutezza non è il significato dell’opera, ma una condizione della sua trasmissione. Dai frammenti emerge un progetto coerente: trasformare la bellezza in forza civile.",
  },
  {
    id: "venere",
    number: "02",
    label: "Venere",
    title: "La bellezza interrompe lo stato ferino",
    scene:
      "Nel primo inno Venere appare dal mare greco insieme alle Grazie. Gli esseri umani primitivi scoprono la bellezza, il pudore, gli affetti e le arti.",
    meaning:
      "La civiltà non nasce eliminando il corpo e il desiderio. Nasce quando l’energia sensuale riceve forma, misura e attenzione per l’altro.",
  },
  {
    id: "vesta",
    number: "03",
    label: "Vesta",
    title: "Il rito trasforma l’armonia in vita condivisa",
    scene:
      "Nel secondo inno, ambientato a Bellosguardo, tre donne celebrano le Grazie attraverso musica, poesia e danza sotto la protezione di Vesta, dea del focolare.",
    meaning:
      "La bellezza diventa civiltà quando entra nei gesti, nei legami e nei riti di una comunità. Non resta contemplazione privata: insegna una convivenza.",
  },
  {
    id: "pallade",
    number: "04",
    label: "Pallade",
    title: "La grazia ha bisogno di intelligenza e difesa",
    scene:
      "Nel terzo inno Pallade conduce le Grazie ad Atlantide, luogo sottratto per un momento alla corruzione e alla violenza delle passioni umane.",
    meaning:
      "La bellezza non è ingenua né indifesa. Per tornare fra gli uomini deve unirsi alla saggezza: soltanto così può resistere alla forza senza imitarla.",
  },
  {
    id: "velo",
    number: "05",
    label: "Il velo",
    title: "Il velo non nasconde: dà misura",
    scene:
      "Divinità minori tessono per le Grazie un velo sul quale appaiono virtù e affetti sacri. Il tessuto le proteggerà dagli impulsi ferini quando torneranno nel mondo.",
    meaning:
      "La forma artistica agisce come quel velo: non nega le passioni, ma le rende dicibili, condivisibili e umane. L’armonia è energia disciplinata.",
  },
  {
    id: "canova",
    number: "06",
    label: "Canova",
    title: "Poesia e scultura cercano la stessa armonia",
    scene:
      "Il poema è dedicato ad Antonio Canova e dialoga idealmente con il suo gruppo marmoreo delle Tre Grazie: corpi distinti che il gesto ricompone in un’unica forma.",
    meaning:
      "Il Neoclassicismo non è copia archeologica. Il mito antico diventa un linguaggio moderno con cui opporre alla brutalità della storia equilibrio, relazione e misura.",
  },
];

const seraNodes: SeraNode[] = [
  {
    id: "quiete",
    number: "01",
    label: "Fatal quiete",
    title: "La sera rende contemplabile la morte",
    verses:
      "«Forse perché della fatal quiete / tu sei l’immago a me sì cara vieni, / o Sera!»",
    movement:
      "Il sonetto si apre con una domanda esitante. La sera è personificata e diventa l’immagine visibile della morte.",
    meaning:
      "Foscolo non immagina un aldilà: la morte è cessazione della vita. La poesia, però, trasforma il nulla in una figura dolce e avvicinabile.",
  },
  {
    id: "stagioni",
    number: "02",
    label: "Due sere",
    title: "La quiete è desiderata in ogni stagione",
    verses:
      "«E quando ti corteggian liete / le nubi estive e i zeffiri sereni, / e quando dal nevoso aere inquïete / tenebre e lunghe all’universo meni»",
    movement:
      "La sera estiva è luminosa e lieve; quella invernale porta tenebre lunghe e inquietanti. Foscolo le accoglie entrambe.",
    meaning:
      "Il poeta non ama soltanto un paesaggio gradevole. Cerca nella sera una condizione interiore che supera il mutare delle stagioni.",
  },
  {
    id: "tempo",
    number: "03",
    label: "Reo tempo",
    title: "Il pensiero segue le tracce che conducono al nulla",
    verses:
      "«Vagar mi fai co’ miei pensier su l’orme / che vanno al nulla eterno; e intanto fugge / questo reo tempo»",
    movement:
      "Nelle terzine il paesaggio diventa meditazione. Il pensiero segue il movimento della luce che scompare.",
    meaning:
      "Il tempo è “reo” perché trascina con sé le preoccupazioni, i conflitti e la storia. Il nulla eterno non è una punizione: è la fine del tormento.",
  },
  {
    id: "spirito",
    number: "04",
    label: "Spirto guerrier",
    title: "La pace non sconfigge il conflitto: lo sospende",
    verses:
      "«E mentre io guardo la tua pace, dorme / quello spirto guerrier ch’entro mi rugge»",
    movement:
      "Il sonetto termina dentro Foscolo. Al silenzio del paesaggio corrisponde, per un momento, il silenzio delle passioni.",
    meaning:
      "Lo spirito combattivo resta parte della sua identità. La sera non lo cancella: gli concede una tregua che la vita e la storia non sanno offrirgli.",
  },
];

const zacintoNodes: ZacintoNode[] = [
  {
    id: "mai",
    number: "01",
    label: "Né più mai",
    title: "Il sonetto nasce da una certezza senza rimedio",
    verses:
      "«Né più mai toccherò le sacre sponde / ove il mio corpo fanciulletto giacque»",
    image:
      "La nave avanza, mentre la costa dell’infanzia diventa sempre più lontana.",
    meaning:
      "Il futuro si apre con una negazione assoluta. L’esilio non è più soltanto uno spostamento politico: diventa impossibilità di ricongiungersi con la propria origine.",
  },
  {
    id: "madre",
    number: "02",
    label: "Materna terra",
    title: "La patria è una madre che il figlio può soltanto ricordare",
    verses:
      "«Zacinto mia, che te specchi nell’onde / del greco mar»",
    image:
      "L’isola si riflette nel mare: è reale, ma già trasformata dalla distanza e dalla memoria.",
    meaning:
      "Il possessivo “mia” non indica proprietà. Esprime un’appartenenza affettiva: Foscolo non possiede più Zante, ma continua a essere formato dalla sua lingua, dalla sua luce e dal suo mito.",
  },
  {
    id: "venere",
    number: "03",
    label: "Venere",
    title: "Il mito restituisce alla patria un’origine sacra",
    verses:
      "«da cui vergine nacque / Venere, e fea quelle isole feconde / col suo primo sorriso»",
    image:
      "La luce sul mare richiama la nascita di Venere e trasforma la geografia in paesaggio mitico.",
    meaning:
      "Zacinto è inserita nel mondo greco di bellezza, fecondità e poesia. Il mito non cancella la perdita storica: costruisce un’immagine capace di sottrarre l’isola alla semplice lontananza.",
  },
  {
    id: "ulisse",
    number: "04",
    label: "Ulisse",
    title: "Il ritorno dell’eroe rivela la condanna del poeta",
    verses:
      "«il diverso esiglio / per cui bello di fama e di sventura / baciò la sua petrosa Itaca Ulisse»",
    image:
      "Nella memoria poetica appare un’altra nave: quella di Ulisse, destinata infine ad approdare.",
    meaning:
      "Ulisse soffre l’esilio ma ritorna a Itaca. Foscolo conosce un “diverso esiglio”: la sua fama potrà viaggiare, mentre il suo corpo non tornerà alla patria.",
  },
  {
    id: "canto",
    number: "05",
    label: "Il canto",
    title: "Dove il corpo non ritorna, può arrivare la poesia",
    verses:
      "«Tu non altro che il canto avrai del figlio, / o materna mia terra; a noi prescrisse / il fato illacrimata sepoltura»",
    image:
      "Foscolo stringe un foglio: è l’unica parte di sé che può raggiungere nuovamente l’isola.",
    meaning:
      "La morte lontano dalla patria sarà priva del pianto familiare. Il canto compie allora un ritorno sostitutivo: non salva il corpo, ma ricostruisce il legame fra il figlio, la terra e i lettori futuri.",
  },
];

function DraggablePanel({
  className,
  ariaLabel,
  children,
  onClose,
}: {
  className: string;
  ariaLabel: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const panelRef = useRef<HTMLElement | null>(null);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  function onDragStart(event: React.PointerEvent<HTMLButtonElement>) {
    const panel = panelRef.current;
    const container = panel?.offsetParent as HTMLElement | null;
    if (!panel || !container) return;

    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const panelRect = panel.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      minX: position.x + containerRect.left - panelRect.left,
      maxX: position.x + containerRect.right - panelRect.right,
      minY: position.y + containerRect.top - panelRect.top,
      maxY: position.y + containerRect.bottom - panelRect.bottom,
    };
    setDragging(true);
  }

  function onDragMove(event: React.PointerEvent<HTMLButtonElement>) {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const nextX = state.originX + event.clientX - state.startX;
    const nextY = state.originY + event.clientY - state.startY;
    setPosition({
      x: Math.max(state.minX, Math.min(state.maxX, nextX)),
      y: Math.max(state.minY, Math.min(state.maxY, nextY)),
    });
  }

  function onDragEnd(event: React.PointerEvent<HTMLButtonElement>) {
    if (dragState.current?.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragState.current = null;
    setDragging(false);
  }

  function onGripKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const step = event.shiftKey ? 40 : 16;
    const delta = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    }[event.key];
    if (!delta) return;
    event.preventDefault();
    setPosition((current) => ({
      x: current.x + delta.x,
      y: current.y + delta.y,
    }));
  }

  return (
    <aside
      ref={panelRef}
      className={`${className} draggable-panel ${dragging ? "is-dragging" : ""}`}
      aria-label={ariaLabel}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div className="panel-toolbar">
        <button
          className="panel-drag-grip"
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          onKeyDown={onGripKeyDown}
          aria-label="Trascina il pannello; usa le frecce della tastiera per spostarlo"
        >
          <span aria-hidden="true">✥</span>
          Trascina il pannello
        </button>
        {onClose && (
          <button
            className="panel-close"
            onClick={onClose}
            aria-label="Chiudi il pannello"
          >
            ×
          </button>
        )}
      </div>
      <div className="draggable-panel-content">{children}</div>
    </aside>
  );
}

function ManualBridge({ view }: { view: View }) {
  const target = manualTargets[view];

  return (
    <a className="manual-bridge-floating" href={target.href}>
      <span>{target.eyebrow}</span>
      <strong>{target.title}</strong>
      <i aria-hidden="true">↗</i>
    </a>
  );
}

function PageFrame({
  bridgeView,
  children,
}: {
  bridgeView: View;
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ManualBridge view={bridgeView} />
    </>
  );
}

function Approdo({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [activeNote, setActiveNote] = useState<MechanismId>("materia");
  const [motionPaused, setMotionPaused] = useState(false);
  const note =
    mechanismNotes.find((item) => item.id === activeNote) ?? mechanismNotes[0];

  return (
    <main className={`approdo-page ${motionPaused ? "motion-paused" : ""}`}>
      <header className="approdo-topbar">
        <button className="back-to-map" onClick={onBack}>
          <span aria-hidden="true">←</span>
          Torna alla mappa
        </button>
        <div className="approdo-crumb">
          <span>Tappa 1</span>
          <strong>L’approdo</strong>
        </div>
        <button
          className="motion-toggle"
          onClick={() => setMotionPaused((value) => !value)}
          aria-pressed={motionPaused}
        >
          <span aria-hidden="true">{motionPaused ? "▶" : "Ⅱ"}</span>
          {motionPaused ? "Avvia movimento" : "Ferma movimento"}
        </button>
      </header>

      <section className="mechanism-stage" aria-labelledby="approdo-title">
        <div className="stage-shade" aria-hidden="true" />

        <div className="animated-machine" aria-hidden="true">
          <span className="gear gear-main" />
          <span className="gear gear-middle" />
          <span className="gear gear-small" />
          <span className="pendulum">
            <i />
          </span>
        </div>

        <div className="approdo-title-block">
          <p className="scene-overline">Filosofia di base</p>
          <h1 id="approdo-title">La natura meccanicista</h1>
          <p>
            Osserva la macchina. Non ha intenzioni, non giudica, non si ferma.
          </p>
        </div>

        <div className="mechanism-hotspots" aria-label="Elementi della macchina">
          {mechanismNotes.map((item) => (
            <button
              key={item.id}
              className={`mechanism-hotspot hotspot-${item.id} ${
                activeNote === item.id ? "active" : ""
              }`}
              onClick={() => setActiveNote(item.id)}
              aria-pressed={activeNote === item.id}
            >
              <span>{item.number}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>

        <DraggablePanel
          className="philosophy-card"
          ariaLabel="Scheda sulla natura meccanicista, pannello spostabile"
        >
          <div className="card-heading">
            <p className="scene-overline">Leggi la macchina</p>
            <span>{note.number} / 04</span>
          </div>

          <h2>{note.title}</h2>
          <p>{note.explanation}</p>

          <div className="real-consequence">
            <span>Conseguenza nella vita</span>
            <p>{note.consequence}</p>
          </div>

          <div className="mechanism-tabs" role="tablist" aria-label="Nuclei concettuali">
            {mechanismNotes.map((item) => (
              <button
                key={item.id}
                className={activeNote === item.id ? "active" : ""}
                onClick={() => setActiveNote(item.id)}
                role="tab"
                aria-selected={activeNote === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="logic-chain" aria-label="Schema sintetico">
            <span>Materia</span>
            <i>→</i>
            <span>Necessità</span>
            <i>→</i>
            <span>Dissoluzione</span>
          </div>

          <blockquote>
            Se il mondo non conserva nulla di noi, perché amare, ricordare e
            creare bellezza?
          </blockquote>

          <button className="continue-journey" onClick={onComplete}>
            <span>Attraversa l’approdo</span>
            <small>Sblocca la Fortezza delle fratture</small>
          </button>
        </DraggablePanel>

        <p className="interaction-hint">
          <span aria-hidden="true">◎</span>
          Seleziona i quattro punti della macchina
        </p>
      </section>
    </main>
  );
}

function Fortezza({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [activeFracture, setActiveFracture] = useState<FractureId | null>(null);
  const [openedFractures, setOpenedFractures] = useState<Set<FractureId>>(
    new Set(),
  );
  const [videoOpen, setVideoOpen] = useState(false);
  const videoFrame = useRef<HTMLDivElement | null>(null);
  const fracture =
    fractures.find((item) => item.id === activeFracture) ?? null;

  function openFracture(id: FractureId) {
    setActiveFracture(id);
    setOpenedFractures((current) => new Set(current).add(id));
  }

  function openFullscreen() {
    videoFrame.current?.requestFullscreen?.();
  }

  return (
    <main className="fortress-page">
      <header className="fortress-topbar">
        <button className="back-to-map" onClick={onBack}>
          <span aria-hidden="true">←</span>
          Torna alla mappa
        </button>
        <div className="approdo-crumb">
          <span>Tappa 2</span>
          <strong>La fortezza</strong>
        </div>
        <div
          className="fracture-progress"
          aria-label={`${openedFractures.size} fratture esplorate su ${fractures.length}`}
        >
          <span>Finestre aperte</span>
          <strong>
            {openedFractures.size} / {fractures.length}
          </strong>
        </div>
      </header>

      <section className="fortress-stage" aria-labelledby="fortress-title">
        <div className="fortress-shade" aria-hidden="true" />
        <div className="fortress-dust" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="fortress-title-block">
          <p className="scene-overline">Le fratture</p>
          <h1 id="fortress-title">La fortezza non cadde in un solo giorno</h1>
          <p>
            Apri le finestre della memoria. Ogni perdita incrina il mondo di
            Foscolo e prepara la sua risposta.
          </p>
        </div>

        <div className="fracture-windows" aria-label="Finestre della memoria">
          {fractures.map((item) => (
            <button
              key={item.id}
              className={`fracture-window window-${item.id} ${
                activeFracture === item.id ? "active" : ""
              } ${openedFractures.has(item.id) ? "opened" : ""}`}
              onClick={() => openFracture(item.id)}
              aria-pressed={activeFracture === item.id}
            >
              <span>{openedFractures.has(item.id) ? "✓" : item.number}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>

        {fracture && (
          <DraggablePanel
            className="fracture-card"
            ariaLabel="Scheda della frattura, pannello spostabile"
            onClose={() => setActiveFracture(null)}
          >
            <div className="card-heading">
              <p className="scene-overline">Finestra della memoria</p>
              <span>{fracture.number} / 07</span>
            </div>
            <h2>{fracture.title}</h2>
            <p className="fracture-image-caption">{fracture.image}</p>

            <div className="fracture-reading">
              <span>La frattura</span>
              <p>{fracture.wound}</p>
            </div>
            <div className="fracture-reading consequence">
              <span>Ciò che cambia</span>
              <p>{fracture.consequence}</p>
            </div>

            <div className="fracture-tabs" aria-label="Seleziona un’altra frattura">
              {fractures.map((item) => (
                <button
                  key={item.id}
                  className={activeFracture === item.id ? "active" : ""}
                  onClick={() => openFracture(item.id)}
                  aria-label={item.label}
                >
                  {openedFractures.has(item.id) ? "✓" : item.number}
                </button>
              ))}
            </div>
          </DraggablePanel>
        )}

        <aside
          className={`foscolo-video-card ${videoOpen ? "playing" : ""}`}
          ref={videoFrame}
          aria-label="Foscolo racconta le sue fratture"
        >
          {!videoOpen ? (
            <button
              className="foscolo-portrait"
              onClick={() => setVideoOpen(true)}
              aria-label="Riproduci il video Foscolo fratture"
            >
              <img
                src="assets/fortezza-fratture.png"
                alt="La fortezza delle fratture, copertina locale del video"
              />
              <span className="portrait-shade" aria-hidden="true" />
              <span className="video-copy">
                <small>La voce del poeta</small>
                <strong>Foscolo racconta le fratture</strong>
              </span>
              <span className="play-medallion" aria-hidden="true">
                ▶
              </span>
            </button>
          ) : (
            <>
              <div className="video-toolbar">
                <span>Foscolo · Le fratture</span>
                <div>
                  <button onClick={openFullscreen} aria-label="Video a tutto schermo">
                    ⛶
                  </button>
                  <button
                    onClick={() => setVideoOpen(false)}
                    aria-label="Chiudi il video"
                  >
                    ×
                  </button>
                </div>
              </div>
              <iframe
                src="https://www.youtube-nocookie.com/embed/rXa62kZ0SC8?autoplay=1&rel=0"
                title="Foscolo fratture"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </>
          )}
        </aside>

        <div className="fortress-exit">
          <blockquote>
            Quando patria, storia, amore e vita si spezzano, con che cosa si
            può ancora costruire un mondo?
          </blockquote>
          <button
            className="continue-journey"
            onClick={onComplete}
            disabled={openedFractures.size < fractures.length}
          >
            <span>
              {openedFractures.size < fractures.length
                ? `Apri ancora ${fractures.length - openedFractures.size} ${
                    fractures.length - openedFractures.size === 1
                      ? "finestra"
                      : "finestre"
                  }`
                : "Esci dalla fortezza"}
            </span>
            <small>
              {openedFractures.size < fractures.length
                ? "Ricostruisci tutte le fratture"
                : "Sblocca la Casa delle illusioni"}
            </small>
          </button>
        </div>

        <p className="fortress-hint">
          <span aria-hidden="true">✦</span>
          Le sette finestre sono parti della stessa crisi
        </p>
      </section>
    </main>
  );
}

function CasaIllusioni({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [activeIllusion, setActiveIllusion] = useState<IllusionId | null>(null);
  const [discovered, setDiscovered] = useState<Set<IllusionId>>(new Set());
  const [videoOpen, setVideoOpen] = useState(false);
  const videoFrame = useRef<HTMLDivElement | null>(null);
  const illusion =
    illusions.find((item) => item.id === activeIllusion) ?? null;

  function openIllusion(id: IllusionId) {
    setActiveIllusion(id);
    setDiscovered((current) => new Set(current).add(id));
  }

  function openFullscreen() {
    videoFrame.current?.requestFullscreen?.();
  }

  return (
    <main className="illusions-page">
      <header className="house-topbar">
        <button className="back-to-map" onClick={onBack}>
          <span aria-hidden="true">←</span>
          Torna alla mappa
        </button>
        <div className="approdo-crumb">
          <span>Tappa 3</span>
          <strong>La casa</strong>
        </div>
        <div
          className="illusion-progress"
          aria-label={`${discovered.size} illusioni esplorate su ${illusions.length}`}
        >
          <span>Dipinti compresi</span>
          <strong>
            {discovered.size} / {illusions.length}
          </strong>
        </div>
      </header>

      <section className="illusions-stage" aria-labelledby="illusions-title">
        <div className="house-shade" aria-hidden="true" />
        <div className="sun-dust" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="house-title-block">
          <p className="scene-overline">Immagine del mondo</p>
          <h1 id="illusions-title">La religione delle illusioni</h1>
          <p>
            Non sono verità ricevute dall’alto. Sono opere umane che producono
            effetti reali.
          </p>
        </div>

        <div className="painted-illusions" aria-label="I sette dipinti delle illusioni">
          {illusions.map((item) => (
            <button
              key={item.id}
              className={`painted-illusion painting-${item.id} ${
                activeIllusion === item.id ? "active" : ""
              } ${discovered.has(item.id) ? "discovered" : ""}`}
              onClick={() => openIllusion(item.id)}
              aria-pressed={activeIllusion === item.id}
            >
              <span>{discovered.has(item.id) ? "✓" : item.number}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>

        {illusion && (
          <DraggablePanel
            className="illusion-card"
            ariaLabel="Scheda dell’illusione, pannello spostabile"
            onClose={() => setActiveIllusion(null)}
          >
            <div className="card-heading">
              <p className="scene-overline">Dipinto umano</p>
              <span>{illusion.number} / 07</span>
            </div>
            <h2>{illusion.title}</h2>

            <div className="illusion-reading">
              <span>Come viene costruita</span>
              <p>{illusion.construction}</p>
            </div>
            <div className="illusion-reading real">
              <span>Perché diventa reale</span>
              <p>{illusion.effect}</p>
            </div>
            <div className="works-trace">
              <span>Nelle opere</span>
              <strong>{illusion.works}</strong>
            </div>

            <div className="fracture-tabs" aria-label="Seleziona un altro dipinto">
              {illusions.map((item) => (
                <button
                  key={item.id}
                  className={activeIllusion === item.id ? "active" : ""}
                  onClick={() => openIllusion(item.id)}
                  aria-label={item.label}
                >
                  {discovered.has(item.id) ? "✓" : item.number}
                </button>
              ))}
            </div>
          </DraggablePanel>
        )}

        <aside
          className={`illusion-video-card ${videoOpen ? "playing" : ""}`}
          ref={videoFrame}
          aria-label="Foscolo spiega la religione delle illusioni"
        >
          {!videoOpen ? (
            <button
              className="foscolo-portrait"
              onClick={() => setVideoOpen(true)}
              aria-label="Riproduci il video sulla religione delle illusioni"
            >
              <img
                src="assets/casa-illusioni.png"
                alt="La casa delle illusioni, copertina locale del video"
              />
              <span className="portrait-shade" aria-hidden="true" />
              <span className="video-copy">
                <small>La voce del poeta</small>
                <strong>La religione delle illusioni</strong>
              </span>
              <span className="play-medallion" aria-hidden="true">
                ▶
              </span>
            </button>
          ) : (
            <>
              <div className="video-toolbar">
                <span>Foscolo · Le illusioni</span>
                <div>
                  <button onClick={openFullscreen} aria-label="Video a tutto schermo">
                    ⛶
                  </button>
                  <button
                    onClick={() => setVideoOpen(false)}
                    aria-label="Chiudi il video"
                  >
                    ×
                  </button>
                </div>
              </div>
              <iframe
                src="https://www.youtube-nocookie.com/embed/SADpAw3RFWI?autoplay=1&rel=0"
                title="Foscolo: la religione delle illusioni"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </>
          )}
        </aside>

        <div className="illusion-thesis">
          <span>Il paradosso di Foscolo</span>
          <p>
            Le illusioni sono costruite, ma non sono inutili: diventano vere nei
            comportamenti, nei legami e nella memoria che producono.
          </p>
        </div>

        <div className="house-exit">
          <blockquote>
            Che cosa accade quando patria e amore, le illusioni più forti, si
            spezzano insieme?
          </blockquote>
          <button
            className="continue-journey"
            onClick={onComplete}
            disabled={discovered.size < illusions.length}
          >
            <span>
              {discovered.size < illusions.length
                ? `Osserva ancora ${illusions.length - discovered.size} ${
                    illusions.length - discovered.size === 1
                      ? "dipinto"
                      : "dipinti"
                  }`
                : "Esci dalla casa"}
            </span>
            <small>
              {discovered.size < illusions.length
                ? "Comprendi tutte le illusioni"
                : "Sblocca la Radura di Jacopo"}
            </small>
          </button>
        </div>
      </section>
    </main>
  );
}

function RaduraJacopo({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [activeNode, setActiveNode] = useState<OrtisId | null>(null);
  const [readNodes, setReadNodes] = useState<Set<OrtisId>>(new Set());
  const node = ortisNodes.find((item) => item.id === activeNode) ?? null;

  function openNode(id: OrtisId) {
    setActiveNode(id);
    setReadNodes((current) => new Set(current).add(id));
  }

  return (
    <main className="ortis-page">
      <header className="ortis-topbar">
        <button className="back-to-map" onClick={onBack}>
          <span aria-hidden="true">←</span>
          Torna alla mappa
        </button>
        <div className="approdo-crumb">
          <span>Tappa 4</span>
          <strong>La radura</strong>
        </div>
        <div
          className="ortis-progress"
          aria-label={`${readNodes.size} nuclei esplorati su ${ortisNodes.length}`}
        >
          <span>Lettere ricomposte</span>
          <strong>
            {readNodes.size} / {ortisNodes.length}
          </strong>
        </div>
      </header>

      <section className="ortis-stage" aria-labelledby="ortis-title">
        <div className="ortis-shade" aria-hidden="true" />
        <div className="flying-pages" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="ortis-title-block">
          <p className="scene-overline">Le ultime lettere di Jacopo Ortis</p>
          <h1 id="ortis-title">Quando le illusioni non reggono più</h1>
          <p>
            Nella radura Jacopo scrive, ricorda e giudica. Ogni lettera avvicina
            il punto in cui la crisi privata e quella storica diventano una sola.
          </p>
        </div>

        <div className="ortis-hotspots" aria-label="Nuclei del romanzo">
          {ortisNodes.map((item) => (
            <button
              key={item.id}
              className={`ortis-hotspot ortis-${item.id} ${
                activeNode === item.id ? "active" : ""
              } ${readNodes.has(item.id) ? "read" : ""}`}
              onClick={() => openNode(item.id)}
              aria-pressed={activeNode === item.id}
            >
              <span>{readNodes.has(item.id) ? "✓" : item.number}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>

        {node && (
          <DraggablePanel
            className="ortis-card"
            ariaLabel="Scheda sul romanzo Ortis, pannello spostabile"
            onClose={() => setActiveNode(null)}
          >
            <div className="card-heading">
              <p className="scene-overline">Carta dalla radura</p>
              <span>{node.number} / 06</span>
            </div>
            <h2>{node.title}</h2>

            <div className="ortis-reading">
              <span>Nel romanzo</span>
              <p>{node.focus}</p>
            </div>
            <div className="ortis-reading meaning">
              <span>Per comprenderlo</span>
              <p>{node.meaning}</p>
            </div>

            <div className="ortis-tabs" aria-label="Seleziona un altro nucleo">
              {ortisNodes.map((item) => (
                <button
                  key={item.id}
                  className={activeNode === item.id ? "active" : ""}
                  onClick={() => openNode(item.id)}
                  aria-label={item.label}
                >
                  {readNodes.has(item.id) ? "✓" : item.number}
                </button>
              ))}
            </div>
          </DraggablePanel>
        )}

        <div className="ortis-quote">
          <span>11 ottobre 1797</span>
          <blockquote>
            «Il sacrificio della patria nostra è consumato.»
          </blockquote>
          <p>
            La prima ferita del romanzo è storica; tutte le altre vi si
            raccolgono attorno.
          </p>
        </div>

        <div className="ortis-exit">
          <blockquote>
            Jacopo muore. Ma che cosa può impedire che anche il suo nome e la
            sua storia si dissolvano?
          </blockquote>
          <button
            className="continue-journey"
            onClick={onComplete}
            disabled={readNodes.size < ortisNodes.length}
          >
            <span>
              {readNodes.size < ortisNodes.length
                ? `Ricostruisci ancora ${ortisNodes.length - readNodes.size} ${
                    ortisNodes.length - readNodes.size === 1
                      ? "lettera"
                      : "lettere"
                  }`
                : "Lascia la radura"}
            </span>
            <small>
              {readNodes.size < ortisNodes.length
                ? "Attraversa tutta la crisi di Jacopo"
                : "Sblocca Memoria e sepoltura"}
            </small>
          </button>
        </div>

        <p className="drag-hint">
          <span aria-hidden="true">✥</span>
          Le schede possono essere trascinate dove preferisci
        </p>
      </section>
    </main>
  );
}

function MemoriaSepoltura({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [activeNode, setActiveNode] = useState<SepolcriId | null>(null);
  const [readNodes, setReadNodes] = useState<Set<SepolcriId>>(new Set());
  const node = sepolcriNodes.find((item) => item.id === activeNode) ?? null;

  function openNode(id: SepolcriId) {
    setActiveNode(id);
    setReadNodes((current) => new Set(current).add(id));
  }

  return (
    <main className="ortis-page sepolcri-page">
      <header className="ortis-topbar sepolcri-topbar">
        <button className="back-to-map" onClick={onBack}>
          <span aria-hidden="true">←</span>
          Torna alla mappa
        </button>
        <div className="approdo-crumb">
          <span>Tappa 5</span>
          <strong>Il cimitero</strong>
        </div>
        <div
          className="ortis-progress"
          aria-label={`${readNodes.size} memorie esplorate su ${sepolcriNodes.length}`}
        >
          <span>Memorie ricomposte</span>
          <strong>
            {readNodes.size} / {sepolcriNodes.length}
          </strong>
        </div>
      </header>

      <section className="ortis-stage sepolcri-stage" aria-labelledby="sepolcri-title">
        <div className="ortis-shade sepolcri-shade" aria-hidden="true" />

        <div className="ortis-title-block sepolcri-title-block">
          <p className="scene-overline">Dei Sepolcri</p>
          <h1 id="sepolcri-title">La tomba non salva il morto. Educa i vivi.</h1>
          <p>
            Attraversa il cimitero: dalla dissoluzione materiale nasce una
            catena umana di affetti, esempi civili e poesia.
          </p>
        </div>

        <div className="ortis-hotspots" aria-label="Nuclei del carme Dei Sepolcri">
          {sepolcriNodes.map((item) => (
            <button
              key={item.id}
              className={`ortis-hotspot sepolcri-hotspot sepolcri-${item.id} ${
                activeNode === item.id ? "active" : ""
              } ${readNodes.has(item.id) ? "read" : ""}`}
              onClick={() => openNode(item.id)}
              aria-pressed={activeNode === item.id}
            >
              <span>{readNodes.has(item.id) ? "✓" : item.number}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>

        {node && (
          <DraggablePanel
            className="ortis-card sepolcri-card"
            ariaLabel="Scheda su Dei Sepolcri, pannello spostabile"
            onClose={() => setActiveNode(null)}
          >
            <div className="card-heading">
              <p className="scene-overline">Lapide della memoria</p>
              <span>{node.number} / 06</span>
            </div>
            <h2>{node.title}</h2>

            <div className="ortis-reading sepolcri-reading">
              <span>Nel carme</span>
              <p>{node.poem}</p>
            </div>
            <div className="ortis-reading meaning">
              <span>Il passaggio decisivo</span>
              <p>{node.meaning}</p>
            </div>

            <div className="sepulchral-chain" aria-label="Catena concettuale">
              <span>Morte</span>
              <i>→</i>
              <span>Tomba</span>
              <i>→</i>
              <span>Memoria</span>
              <i>→</i>
              <span>Civiltà</span>
            </div>

            <div className="ortis-tabs" aria-label="Seleziona un altro nucleo">
              {sepolcriNodes.map((item) => (
                <button
                  key={item.id}
                  className={activeNode === item.id ? "active" : ""}
                  onClick={() => openNode(item.id)}
                  aria-label={item.label}
                >
                  {readNodes.has(item.id) ? "✓" : item.number}
                </button>
              ))}
            </div>
          </DraggablePanel>
        )}

        <div className="ortis-quote sepolcri-quote">
          <span>La funzione civile</span>
          <blockquote>
            «A egregie cose il forte animo accendono l’urne de’ forti.»
          </blockquote>
          <p>
            La memoria dei grandi non consola soltanto: chiede ai vivi di
            diventare degni dell’esempio ricevuto.
          </p>
        </div>

        <div className="ortis-exit sepolcri-exit">
          <blockquote>
            La memoria oppone una forma alla dissoluzione. Ma che cosa può
            educare e armonizzare la forza che resta nell’uomo?
          </blockquote>
          <button
            className="continue-journey"
            onClick={onComplete}
            disabled={readNodes.size < sepolcriNodes.length}
          >
            <span>
              {readNodes.size < sepolcriNodes.length
                ? `Ricomponi ancora ${sepolcriNodes.length - readNodes.size} ${
                    sepolcriNodes.length - readNodes.size === 1
                      ? "memoria"
                      : "memorie"
                  }`
                : "Lascia il cimitero"}
            </span>
            <small>
              {readNodes.size < sepolcriNodes.length
                ? "Segui l’intero ragionamento del carme"
                : "Sblocca il Giardino delle Grazie"}
            </small>
          </button>
        </div>

        <p className="drag-hint">
          <span aria-hidden="true">✥</span>
          Trascina le schede per liberare la vista del cimitero
        </p>
      </section>
    </main>
  );
}

function GiardinoGrazie({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [activeNode, setActiveNode] = useState<GrazieId | null>(null);
  const [readNodes, setReadNodes] = useState<Set<GrazieId>>(new Set());
  const node = grazieNodes.find((item) => item.id === activeNode) ?? null;

  function openNode(id: GrazieId) {
    setActiveNode(id);
    setReadNodes((current) => new Set(current).add(id));
  }

  return (
    <main className="ortis-page grazie-page">
      <header className="ortis-topbar grazie-topbar">
        <button className="back-to-map" onClick={onBack}>
          <span aria-hidden="true">←</span>
          Torna alla mappa
        </button>
        <div className="approdo-crumb">
          <span>Tappa 6</span>
          <strong>Il giardino</strong>
        </div>
        <div
          className="ortis-progress"
          aria-label={`${readNodes.size} armonie esplorate su ${grazieNodes.length}`}
        >
          <span>Armonie ricomposte</span>
          <strong>
            {readNodes.size} / {grazieNodes.length}
          </strong>
        </div>
      </header>

      <section className="ortis-stage grazie-stage" aria-labelledby="grazie-title">
        <div className="ortis-shade grazie-shade" aria-hidden="true" />
        <div className="garden-petals" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="ortis-title-block grazie-title-block">
          <p className="scene-overline">Le Grazie</p>
          <h1 id="grazie-title">La bellezza non decora la civiltà. La costruisce.</h1>
          <p>
            Attraversa il giardino: il mito, il rito e l’arte trasformano
            l’energia delle passioni in misura condivisa.
          </p>
        </div>

        <div className="ortis-hotspots" aria-label="Nuclei del poema Le Grazie">
          {grazieNodes.map((item) => (
            <button
              key={item.id}
              className={`ortis-hotspot grazie-hotspot grazie-${item.id} ${
                activeNode === item.id ? "active" : ""
              } ${readNodes.has(item.id) ? "read" : ""}`}
              onClick={() => openNode(item.id)}
              aria-pressed={activeNode === item.id}
            >
              <span>{readNodes.has(item.id) ? "✓" : item.number}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>

        {node && (
          <DraggablePanel
            className="ortis-card grazie-card"
            ariaLabel="Scheda sul poema Le Grazie, pannello spostabile"
            onClose={() => setActiveNode(null)}
          >
            <div className="card-heading">
              <p className="scene-overline">Forma della civiltà</p>
              <span>{node.number} / 06</span>
            </div>
            <h2>{node.title}</h2>

            <div className="ortis-reading grazie-reading">
              <span>Nel poema</span>
              <p>{node.scene}</p>
            </div>
            <div className="ortis-reading meaning grazie-meaning">
              <span>Ciò che cambia nell’uomo</span>
              <p>{node.meaning}</p>
            </div>

            <div className="grace-chain" aria-label="Catena concettuale">
              <span>Forza</span>
              <i>→</i>
              <span>Forma</span>
              <i>→</i>
              <span>Misura</span>
              <i>→</i>
              <span>Civiltà</span>
            </div>

            <div className="ortis-tabs grazie-tabs" aria-label="Seleziona un altro nucleo">
              {grazieNodes.map((item) => (
                <button
                  key={item.id}
                  className={activeNode === item.id ? "active" : ""}
                  onClick={() => openNode(item.id)}
                  aria-label={item.label}
                >
                  {readNodes.has(item.id) ? "✓" : item.number}
                </button>
              ))}
            </div>
          </DraggablePanel>
        )}

        <div className="ortis-quote grazie-quote">
          <span>La tesi del giardino</span>
          <blockquote>
            La grazia non elimina la forza: le insegna una forma.
          </blockquote>
          <p>
            Bellezza, pudore, arti e affetti rendono possibile ciò che la natura
            meccanicista non garantisce: una convivenza umana.
          </p>
        </div>

        <div className="ortis-exit grazie-exit">
          <blockquote>
            L’armonia può educare la vita. Ma quale quiete resta quando il tempo
            e il conflitto tornano a premere?
          </blockquote>
          <button
            className="continue-journey"
            onClick={onComplete}
            disabled={readNodes.size < grazieNodes.length}
          >
            <span>
              {readNodes.size < grazieNodes.length
                ? `Ricomponi ancora ${grazieNodes.length - readNodes.size} ${
                    grazieNodes.length - readNodes.size === 1
                      ? "armonia"
                      : "armonie"
                  }`
                : "Lascia il giardino"}
            </span>
            <small>
              {readNodes.size < grazieNodes.length
                ? "Segui il cammino dalla forza alla civiltà"
                : "Sblocca la Scogliera di Alla sera"}
            </small>
          </button>
        </div>

        <p className="drag-hint">
          <span aria-hidden="true">✥</span>
          Trascina le schede per osservare liberamente il giardino
        </p>
      </section>
    </main>
  );
}

function ScoglieraSera({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [activeNode, setActiveNode] = useState<SeraId | null>(null);
  const [readNodes, setReadNodes] = useState<Set<SeraId>>(new Set());
  const [season, setSeason] = useState<"summer" | "winter">("summer");
  const node = seraNodes.find((item) => item.id === activeNode) ?? null;

  function openNode(id: SeraId) {
    setActiveNode(id);
    setReadNodes((current) => new Set(current).add(id));
  }

  return (
    <main className="sera-page">
      <header className="sera-topbar">
        <button className="back-to-map" onClick={onBack}>
          <span aria-hidden="true">←</span>
          Torna alla mappa
        </button>
        <div className="approdo-crumb">
          <span>Tappa 7</span>
          <strong>La scogliera</strong>
        </div>
        <div className="sera-controls">
          <button
            className="season-toggle"
            onClick={() =>
              setSeason((current) =>
                current === "summer" ? "winter" : "summer",
              )
            }
            aria-label={`Mostra la sera ${
              season === "summer" ? "invernale" : "estiva"
            }`}
          >
            <span aria-hidden="true">{season === "summer" ? "☀" : "❄"}</span>
            {season === "summer" ? "Sera estiva" : "Sera invernale"}
          </button>
          <div
            className="sera-progress"
            aria-label={`${readNodes.size} movimenti esplorati su ${seraNodes.length}`}
          >
            <span>Movimenti</span>
            <strong>
              {readNodes.size} / {seraNodes.length}
            </strong>
          </div>
        </div>
      </header>

      <section
        className={`sera-stage ${season === "winter" ? "is-winter" : ""}`}
        aria-labelledby="sera-title"
      >
        <div className="sera-shade" aria-hidden="true" />
        <div className="sera-sun" aria-hidden="true" />
        <div className="sera-clouds" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="sera-wind" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="sea-breath" aria-hidden="true" />

        <div className="sera-title-block">
          <p className="scene-overline">Alla sera · 1803</p>
          <h1 id="sera-title">
            Perché Foscolo ama la sera, se la sera gli ricorda la morte?
          </h1>
          <p>
            Segui la discesa della luce: il paesaggio diventa pensiero e lo
            spirito combattivo trova una tregua.
          </p>
        </div>

        <div className="sera-hotspots" aria-label="Quattro movimenti di Alla sera">
          {seraNodes.map((item) => (
            <button
              key={item.id}
              className={`sera-hotspot sera-${item.id} ${
                activeNode === item.id ? "active" : ""
              } ${readNodes.has(item.id) ? "read" : ""}`}
              onClick={() => openNode(item.id)}
              aria-pressed={activeNode === item.id}
            >
              <span>{readNodes.has(item.id) ? "✓" : item.number}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>

        {node && (
          <DraggablePanel
            className="sera-card"
            ariaLabel="Scheda di lettura di Alla sera, pannello spostabile"
            onClose={() => setActiveNode(null)}
          >
            <div className="card-heading">
              <p className="scene-overline">Dal verso all’immagine del mondo</p>
              <span>{node.number} / 04</span>
            </div>
            <h2>{node.title}</h2>

            <blockquote className="sera-verses">{node.verses}</blockquote>

            <div className="sera-reading">
              <span>Movimento del sonetto</span>
              <p>{node.movement}</p>
            </div>
            <div className="sera-reading meaning">
              <span>Che cosa significa</span>
              <p>{node.meaning}</p>
            </div>

            <div className="sera-form" aria-label="Forma del sonetto">
              <span>Sonetto</span>
              <i>·</i>
              <span>14 endecasillabi</span>
              <i>·</i>
              <span>ABAB ABAB CDC DCD</span>
            </div>

            <div className="sera-tabs" aria-label="Seleziona un altro movimento">
              {seraNodes.map((item) => (
                <button
                  key={item.id}
                  className={activeNode === item.id ? "active" : ""}
                  onClick={() => openNode(item.id)}
                  aria-label={item.label}
                >
                  {readNodes.has(item.id) ? "✓" : item.number}
                </button>
              ))}
            </div>
          </DraggablePanel>
        )}

        <div className="sera-thesis">
          <span>Dal mondo alla poesia</span>
          <p>
            Meccanicismo: la morte è dissoluzione. Poesia: il nulla assume il
            volto della «fatal quiete».
          </p>
        </div>

        <div className="sera-exit">
          <blockquote>
            La sera non cambia la verità della morte: cambia il modo in cui
            l’uomo può guardarla.
          </blockquote>
          <button
            className="continue-journey"
            onClick={onComplete}
            disabled={readNodes.size < seraNodes.length}
          >
            <span>
              {readNodes.size < seraNodes.length
                ? `Ascolta ancora ${seraNodes.length - readNodes.size} ${
                    seraNodes.length - readNodes.size === 1
                      ? "movimento"
                      : "movimenti"
                  }`
                : "Lascia che lo spirto guerrier riposi"}
            </span>
            <small>
              {readNodes.size < seraNodes.length
                ? "Attraversa l’intero sonetto"
                : "Sblocca la nave dell’esilio"}
            </small>
          </button>
        </div>

        <p className="sera-hint">
          <span aria-hidden="true">✦</span>
          Tocca i quattro segni del paesaggio e alterna estate e inverno
        </p>
      </section>
    </main>
  );
}

function NaveZacinto({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [activeNode, setActiveNode] = useState<ZacintoId | null>(null);
  const [readNodes, setReadNodes] = useState<Set<ZacintoId>>(new Set());
  const [ending, setEnding] = useState(false);
  const node = zacintoNodes.find((item) => item.id === activeNode) ?? null;

  function openNode(id: ZacintoId) {
    setActiveNode(id);
    setReadNodes((current) => new Set(current).add(id));
  }

  return (
    <main className="zacinto-page">
      <header className="zacinto-topbar">
        <button className="back-to-map" onClick={onBack}>
          <span aria-hidden="true">←</span>
          Torna alla mappa
        </button>
        <div className="approdo-crumb">
          <span>Epilogo</span>
          <strong>La nave dell’esilio</strong>
        </div>
        <div
          className="zacinto-progress"
          aria-label={`${readNodes.size} immagini esplorate su ${zacintoNodes.length}`}
        >
          <span>Il ritorno poetico</span>
          <strong>
            {readNodes.size} / {zacintoNodes.length}
          </strong>
        </div>
      </header>

      <section className="zacinto-stage" aria-labelledby="zacinto-title">
        <div className="zacinto-shade" aria-hidden="true" />
        <div className="zacinto-clouds" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="zacinto-rigging" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="zacinto-wake" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="zacinto-title-block">
          <p className="scene-overline">A Zacinto · Il ritorno impossibile</p>
          <h1 id="zacinto-title">
            Come si torna in una patria quando il ritorno reale è impossibile?
          </h1>
          <p>
            La nave si allontana da Zante. Segui ciò che resta al poeta:
            memoria, mito e canto.
          </p>
        </div>

        <div className="zacinto-hotspots" aria-label="Cinque immagini di A Zacinto">
          {zacintoNodes.map((item) => (
            <button
              key={item.id}
              className={`zacinto-hotspot zacinto-${item.id} ${
                activeNode === item.id ? "active" : ""
              } ${readNodes.has(item.id) ? "read" : ""}`}
              onClick={() => openNode(item.id)}
              aria-pressed={activeNode === item.id}
            >
              <span>{readNodes.has(item.id) ? "✓" : item.number}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>

        {node && (
          <DraggablePanel
            className="zacinto-card"
            ariaLabel="Scheda di lettura di A Zacinto, pannello spostabile"
            onClose={() => setActiveNode(null)}
          >
            <div className="card-heading">
              <p className="scene-overline">Esilio, mito e poesia</p>
              <span>{node.number} / 05</span>
            </div>
            <h2>{node.title}</h2>

            <blockquote className="zacinto-verses">{node.verses}</blockquote>

            <div className="zacinto-reading">
              <span>Nella scena</span>
              <p>{node.image}</p>
            </div>
            <div className="zacinto-reading meaning">
              <span>Nel pensiero di Foscolo</span>
              <p>{node.meaning}</p>
            </div>

            <div className="zacinto-form" aria-label="Forma del sonetto">
              <span>Sonetto</span>
              <i>·</i>
              <span>14 endecasillabi</span>
              <i>·</i>
              <span>ABAB ABAB CDE CED</span>
            </div>

            <div className="zacinto-tabs" aria-label="Seleziona un’altra immagine">
              {zacintoNodes.map((item) => (
                <button
                  key={item.id}
                  className={activeNode === item.id ? "active" : ""}
                  onClick={() => openNode(item.id)}
                  aria-label={item.label}
                >
                  {readNodes.has(item.id) ? "✓" : item.number}
                </button>
              ))}
            </div>
          </DraggablePanel>
        )}

        <div className="zacinto-thesis">
          <span>Il paradosso dell’esilio</span>
          <p>
            Il corpo non tornerà. Il canto, invece, raggiunge Zante e rende la
            perdita condivisibile.
          </p>
        </div>

        <div className="zacinto-exit">
          <blockquote>
            «Tu non altro che il canto avrai del figlio, o materna mia terra.»
          </blockquote>
          <button
            className="continue-journey"
            onClick={() => setEnding(true)}
            disabled={readNodes.size < zacintoNodes.length}
          >
            <span>
              {readNodes.size < zacintoNodes.length
                ? `Raccogli ancora ${zacintoNodes.length - readNodes.size} ${
                    zacintoNodes.length - readNodes.size === 1
                      ? "immagine"
                      : "immagini"
                  }`
                : "Affida il ritorno alla poesia"}
            </span>
            <small>
              {readNodes.size < zacintoNodes.length
                ? "Ricostruisci il viaggio del sonetto"
                : "Concludi Zante interiore"}
            </small>
          </button>
        </div>

        <p className="zacinto-hint">
          <span aria-hidden="true">≈</span>
          Tocca i segni della partenza e segui il ritorno del canto
        </p>

        {ending && (
          <div className="journey-conclusion" role="dialog" aria-modal="true">
            <div className="journey-conclusion-card">
              <p className="scene-overline">Zante interiore · Viaggio compiuto</p>
              <h2>
                Foscolo non torna a Zante. È Zante che continua a tornare nella
                sua poesia.
              </h2>
              <p>
                Il viaggio è partito da una natura indifferente e si chiude con
                una costruzione umana: il canto. Non annulla il nulla, ma salva
                legami, nomi e memoria dalla pura dispersione.
              </p>

              <div className="journey-chain" aria-label="Sintesi del percorso">
                <span>Natura</span>
                <i>→</i>
                <span>Fratture</span>
                <i>→</i>
                <span>Illusioni</span>
                <i>→</i>
                <span>Opere</span>
                <i>→</i>
                <span>Canto</span>
              </div>

              <blockquote>
                Il ritorno geografico è negato. Il ritorno poetico è compiuto.
              </blockquote>
              <button className="primary-action" onClick={onComplete}>
                <span>Ritorna all’isola</span>
                <small>Ora puoi scegliere liberamente il tuo percorso</small>
              </button>
              <a
                className="conclusion-manual-link"
                href={manualTargets.zacinto.href}
              >
                <span>Consolida il viaggio</span>
                <small>Ritrova A Zacinto e le opere nel manuale</small>
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>(null);
  const [view, setView] = useState<View>("map");
  const [active, setActive] = useState<Stop | null>(null);
  const [guidedIndex, setGuidedIndex] = useState(0);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );

  const progress = useMemo(
    () => Math.round((visited.size / stops.length) * 100),
    [visited],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("tappa") ?? window.location.hash.slice(1);
    const stop = stops.find((item) => item.id === requested);
    if (!stop) return;

    setMode("free");
    setActive(stop);
    setView(stop.id as View);
  }, []);

  function updateDeepLink(nextView: View) {
    const url = new URL(window.location.href);
    if (nextView === "map") {
      url.searchParams.delete("tappa");
      url.hash = "";
    } else {
      url.searchParams.set("tappa", nextView);
      url.hash = "";
    }
    window.history.replaceState({}, "", url);
  }

  function navigateTo(nextView: View) {
    setView(nextView);
    updateDeepLink(nextView);
  }

  function returnToMap() {
    setView("map");
    updateDeepLink("map");
  }

  function chooseMode(nextMode: Exclude<Mode, null>) {
    setMode(nextMode);
    setActive(nextMode === "guided" ? stops[0] : null);
  }

  function selectStop(stop: Stop, index: number) {
    const locked = mode === "guided" && index > guidedIndex;
    if (!mode || locked) return;
    setActive(stop);
  }

  function enterStop() {
    if (!active) return;
    if (active.id === "approdo") {
      navigateTo("approdo");
      return;
    }
    if (active.id === "fratture") {
      navigateTo("fratture");
      return;
    }
    if (active.id === "illusioni") {
      navigateTo("illusioni");
      return;
    }
    if (active.id === "ortis") {
      navigateTo("ortis");
      return;
    }
    if (active.id === "sepolcri") {
      navigateTo("sepolcri");
      return;
    }
    if (active.id === "grazie") {
      navigateTo("grazie");
      return;
    }
    if (active.id === "sera") {
      navigateTo("sera");
      return;
    }
    if (active.id === "zacinto") {
      navigateTo("zacinto");
      return;
    }

    setVisited((current) => new Set(current).add(active.id));
    if (mode === "guided") {
      const currentIndex = stops.findIndex((stop) => stop.id === active.id);
      setGuidedIndex((value) => Math.max(value, currentIndex + 1));
    }
  }

  function completeApprodo() {
    setVisited((current) => new Set(current).add("approdo"));
    if (mode === "guided") {
      setGuidedIndex((value) => Math.max(value, 1));
      setActive(stops[1]);
    } else {
      setActive(null);
    }
    returnToMap();
  }

  function completeFratture() {
    setVisited((current) => new Set(current).add("fratture"));
    if (mode === "guided") {
      setGuidedIndex((value) => Math.max(value, 2));
      setActive(stops[2]);
    } else {
      setActive(null);
    }
    returnToMap();
  }

  function completeIllusioni() {
    setVisited((current) => new Set(current).add("illusioni"));
    if (mode === "guided") {
      setGuidedIndex((value) => Math.max(value, 3));
      setActive(stops[3]);
    } else {
      setActive(null);
    }
    returnToMap();
  }

  function completeOrtis() {
    setVisited((current) => new Set(current).add("ortis"));
    if (mode === "guided") {
      setGuidedIndex((value) => Math.max(value, 4));
      setActive(stops[4]);
    } else {
      setActive(null);
    }
    returnToMap();
  }

  function completeSepolcri() {
    setVisited((current) => new Set(current).add("sepolcri"));
    if (mode === "guided") {
      setGuidedIndex((value) => Math.max(value, 5));
      setActive(stops[5]);
    } else {
      setActive(null);
    }
    returnToMap();
  }

  function completeGrazie() {
    setVisited((current) => new Set(current).add("grazie"));
    if (mode === "guided") {
      setGuidedIndex((value) => Math.max(value, 6));
      setActive(stops[6]);
    } else {
      setActive(null);
    }
    returnToMap();
  }

  function completeSera() {
    setVisited((current) => new Set(current).add("sera"));
    if (mode === "guided") {
      setGuidedIndex((value) => Math.max(value, 7));
      setActive(stops[7]);
    } else {
      setActive(null);
    }
    returnToMap();
  }

  function completeZacinto() {
    setVisited((current) => new Set(current).add("zacinto"));
    if (mode === "guided") {
      setGuidedIndex(stops.length);
    }
    setActive(null);
    returnToMap();
  }

  function updateZoom(amount: number) {
    setZoom((value) => Math.min(1.8, Math.max(1, value + amount)));
    if (zoom + amount <= 1) setOffset({ x: 0, y: 0 });
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const maxX = 360 * (zoom - 1);
    const maxY = 210 * (zoom - 1);
    const nextX = drag.current.ox + event.clientX - drag.current.x;
    const nextY = drag.current.oy + event.clientY - drag.current.y;
    setOffset({
      x: Math.max(-maxX, Math.min(maxX, nextX)),
      y: Math.max(-maxY, Math.min(maxY, nextY)),
    });
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current = null;
  }

  if (view === "approdo") {
    return (
      <PageFrame bridgeView="approdo">
        <Approdo onBack={returnToMap} onComplete={completeApprodo} />
      </PageFrame>
    );
  }

  if (view === "fratture") {
    return (
      <PageFrame bridgeView="fratture">
        <Fortezza onBack={returnToMap} onComplete={completeFratture} />
      </PageFrame>
    );
  }

  if (view === "illusioni") {
    return (
      <PageFrame bridgeView="illusioni">
        <CasaIllusioni onBack={returnToMap} onComplete={completeIllusioni} />
      </PageFrame>
    );
  }

  if (view === "ortis") {
    return (
      <PageFrame bridgeView="ortis">
        <RaduraJacopo onBack={returnToMap} onComplete={completeOrtis} />
      </PageFrame>
    );
  }

  if (view === "sepolcri") {
    return (
      <PageFrame bridgeView="sepolcri">
        <MemoriaSepoltura onBack={returnToMap} onComplete={completeSepolcri} />
      </PageFrame>
    );
  }

  if (view === "grazie") {
    return (
      <PageFrame bridgeView="grazie">
        <GiardinoGrazie onBack={returnToMap} onComplete={completeGrazie} />
      </PageFrame>
    );
  }

  if (view === "sera") {
    return (
      <PageFrame bridgeView="sera">
        <ScoglieraSera onBack={returnToMap} onComplete={completeSera} />
      </PageFrame>
    );
  }

  if (view === "zacinto") {
    return (
      <PageFrame bridgeView="zacinto">
        <NaveZacinto onBack={returnToMap} onComplete={completeZacinto} />
      </PageFrame>
    );
  }

  return (
    <PageFrame bridgeView={(active?.id as View | undefined) ?? "map"}>
      <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">Ζ</span>
          <div>
            <p className="kicker">Un viaggio nella mente di Ugo Foscolo</p>
            <h1>Zante interiore</h1>
          </div>
        </div>

        <div className="journey-status" aria-label={`Progresso ${progress}%`}>
          <div className="status-copy">
            <span>{mode === "free" ? "La mia Zante" : "Il viaggio di Foscolo"}</span>
            <strong>{visited.size} / {stops.length} tappe</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button className="icon-button" aria-label="Apri il diario di viaggio">
          <span>✦</span>
          <small>Diario</small>
        </button>
      </header>

      <section className="map-frame" aria-label="Mappa interattiva di Zante">
        <div
          className="map-viewport"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
        >
          <div
            className="map-scene"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            }}
          >
            <img
              src="assets/zante-map.png"
              alt="Veduta pittorica dell’isola di Zante con i luoghi del viaggio foscoliano"
              draggable={false}
            />

            {stops.map((stop, index) => {
              const locked = mode === "guided" && index > guidedIndex;
              const isVisited = visited.has(stop.id);
              const isCurrent = mode === "guided" && index === guidedIndex;
              return (
                <button
                  key={stop.id}
                  className={`map-pin ${locked ? "locked" : ""} ${
                    isVisited ? "visited" : ""
                  } ${isCurrent ? "current" : ""}`}
                  style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                  onClick={() => selectStop(stop, index)}
                  aria-label={`${stop.title}${locked ? ", tappa non ancora disponibile" : ""}`}
                  disabled={!mode || locked}
                >
                  <span className="pin-core">{isVisited ? "✓" : index + 1}</span>
                  <span className="pin-label">{stop.title}</span>
                </button>
              );
            })}
          </div>

          <div className="map-vignette" aria-hidden="true" />

          <div className="map-tools" aria-label="Controlli della mappa">
            <button onClick={() => updateZoom(0.2)} aria-label="Ingrandisci">
              +
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={() => updateZoom(-0.2)} aria-label="Riduci">
              −
            </button>
          </div>

          <div className="map-hint">
            <span className="mouse-symbol">↔</span>
            Trascina la mappa · usa + e − per esplorare
          </div>
        </div>

        {!mode && (
          <section className="welcome-card" aria-labelledby="welcome-title">
            <p className="card-overline">Benvenuto a Zante</p>
            <h2 id="welcome-title">
              Prima attraversa Foscolo.
              <br />
              Poi costruisci il tuo viaggio.
            </h2>
            <p>
              L’isola che stai per esplorare non è soltanto un luogo geografico:
              è la forma visibile del pensiero, delle ferite e delle opere di
              Ugo Foscolo.
            </p>
            <div className="mode-actions">
              <button className="primary-action" onClick={() => chooseMode("guided")}>
                <span>Inizia il primo viaggio</span>
                <small>Percorso guidato · consigliato</small>
              </button>
              <button className="secondary-action" onClick={() => chooseMode("free")}>
                Esplora liberamente
              </button>
            </div>
            <p className="time-note">
              <span>◷</span> Percorso completo: circa 45 minuti
            </p>
          </section>
        )}

        {mode && active && (
          <aside className="stop-card" aria-live="polite">
            <button
              className="close-card"
              onClick={() => setActive(null)}
              aria-label="Chiudi la scheda"
            >
              ×
            </button>
            <p className="card-overline">{active.eyebrow}</p>
            <h2>{active.title}</h2>
            <p className="stop-short">{active.short}</p>
            <blockquote>{active.prompt}</blockquote>
            <button className="primary-action compact" onClick={enterStop}>
              <span>{visited.has(active.id) ? "Rientra nella tappa" : "Entra nella tappa"}</span>
              <small>
                {active.id === "approdo" ||
                active.id === "fratture" ||
                active.id === "illusioni" ||
                active.id === "ortis" ||
                active.id === "sepolcri" ||
                active.id === "grazie" ||
                active.id === "sera" ||
                active.id === "zacinto"
                  ? "Apri ambiente e lezione"
                  : "Tappa in preparazione"}
              </small>
            </button>
          </aside>
        )}

        {mode && (
          <button className="mode-switcher" onClick={() => setMode(null)}>
            Cambia modalità
          </button>
        )}
      </section>
      </main>
    </PageFrame>
  );
}
