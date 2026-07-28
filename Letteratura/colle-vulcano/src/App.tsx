"use client";

import { useEffect, useRef, useState } from "react";

type SceneId =
  | "house"
  | "hill"
  | "village"
  | "nature"
  | "rebellion"
  | "ginestra"
  | "naples"
  | null;
type HouseStopId = "romanticismo" | "sensismo" | "piacere" | "natura";
type HillStageId =
  | "limite"
  | "spazio"
  | "sgomento"
  | "vento"
  | "tempo"
  | "naufragio";
type VillageStageId =
  | "silvia"
  | "promessa"
  | "sabato"
  | "festa"
  | "stelle"
  | "ricordanza";
type NatureStageId =
  | "fuga"
  | "patimento"
  | "indifferenza"
  | "circuito"
  | "domanda"
  | "finale";
type RebellionStageId =
  | "filippi"
  | "fato"
  | "indomito"
  | "bellezza"
  | "arcano"
  | "rifiuto";
type GinestraStageId =
  | "deserto"
  | "potenza"
  | "progresso"
  | "nobilta"
  | "catena"
  | "fiore";
type NaplesStageId =
  | "riva"
  | "stelle"
  | "misura"
  | "orgoglio"
  | "alleanza"
  | "civilta";

type VideoItem = {
  id: string;
  title: string;
  youtubeId: string;
};

type KnowledgeItem = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  consequence: string;
  work: string;
  quote?: string;
  x: number;
  y: number;
};

const houseStops: KnowledgeItem[] = [
  {
    id: "romanticismo",
    label: "Leopardi e il Romanticismo",
    eyebrow: "Una posizione autonoma",
    title: "Leopardi e il Romanticismo",
    body:
      "Leopardi entra nel dibattito tra classicisti e romantici senza lasciarsi rinchiudere in uno schieramento. Difende la forza dell’immaginazione antica, ma condivide con la nuova sensibilità il valore dell’interiorità e dell’esperienza individuale.",
    consequence:
      "La poesia non è ornamento: diventa uno strumento per interrogare il limite, il desiderio e la condizione umana.",
    work: "Discorso di un italiano intorno alla poesia romantica",
    x: 56,
    y: 26,
  },
  {
    id: "sensismo",
    label: "Il sensismo",
    eyebrow: "La filosofia di partenza",
    title: "Il sensismo",
    body:
      "La conoscenza nasce dalle sensazioni. L’immaginazione conserva, combina e amplia ciò che i sensi hanno sperimentato: per questo parole, ricordi e immagini possono aprire spazi che la realtà presente non contiene.",
    consequence:
      "Il vago e l’indefinito non sono evasione irrazionale: sono effetti concreti del modo in cui la mente trasforma l’esperienza.",
    work: "Zibaldone",
    x: 31,
    y: 82,
  },
  {
    id: "piacere",
    label: "La teoria del piacere",
    eyebrow: "Il cuore del problema",
    title: "La teoria del piacere",
    body:
      "L’essere umano non desidera un piacere particolare e limitato: desidera il piacere, senza confini di durata e intensità. Nessun oggetto reale può quindi colmare interamente questo desiderio.",
    consequence:
      "La sproporzione fra desiderio infinito e piaceri finiti spiega l’insoddisfazione, ma anche la potenza delle illusioni e dell’immaginazione.",
    work: "Zibaldone, teoria del piacere",
    x: 62,
    y: 79,
  },
  {
    id: "natura",
    label: "Madre Natura",
    eyebrow: "La prima immagine della natura",
    title: "La Natura offre illusioni",
    body:
      "Nella prima fase del pensiero leopardiano la Natura appare ancora capace di proteggere l’uomo attraverso illusioni, speranze e immaginazione. Non elimina il dolore, ma impedisce alla ragione di mostrarlo in tutta la sua nudità.",
    consequence:
      "La civiltà e l’eccesso di ragione consumano quelle illusioni. Più avanti, questa immagine materna entrerà in crisi.",
    work: "Zibaldone e Canti",
    x: 84,
    y: 43,
  },
];

const hillStages: KnowledgeItem[] = [
  {
    id: "limite",
    label: "Il limite",
    eyebrow: "1 · Il dato sensibile",
    title: "La siepe interrompe lo sguardo",
    quote:
      "Sempre caro mi fu quest’ermo colle,\ne questa siepe, che da tanta parte\ndell’ultimo orizzonte il guardo esclude.",
    body:
      "La poesia comincia da elementi reali e vicini: un colle, una siepe, uno sguardo impedito. Il limite non è ancora l’infinito, ma la condizione concreta da cui l’esperienza può nascere.",
    consequence:
      "Non potendo vedere tutto, la mente è spinta a immaginare ciò che resta oltre la siepe.",
    work: "L’infinito, vv. 1–3",
    x: 31,
    y: 67,
  },
  {
    id: "spazio",
    label: "Gli spazi interminati",
    eyebrow: "2 · L’infinito spaziale",
    title: "La mente finge ciò che gli occhi non vedono",
    quote:
      "Ma sedendo e mirando, interminati\nspazi di là da quella, e sovrumani\nsilenzi, e profondissima quiete\nio nel pensier mi fingo;",
    body:
      "Leopardi non afferma di percepire un infinito reale. Lo costruisce nel pensiero: il verbo “fingo” indica l’atto creativo dell’immaginazione, che oltrepassa il confine visibile.",
    consequence:
      "Dal limite nasce uno spazio mentale senza misura, fatto di silenzio e quiete.",
    work: "L’infinito, vv. 4–7",
    x: 70,
    y: 35,
  },
  {
    id: "sgomento",
    label: "Il cuore si spaura",
    eyebrow: "3 · La vertigine",
    title: "L’infinito non consola subito",
    quote: "ove per poco\nil cor non si spaura.",
    body:
      "Davanti alla vastità immaginata l’io rischia di smarrirsi. La percezione dell’infinito produce una breve paura: la coscienza avverte di non poter dominare ciò che ha evocato.",
    consequence:
      "L’esperienza leopardiana resta fisica e concreta: il pensiero coinvolge anche il cuore e il corpo.",
    work: "L’infinito, vv. 7–8",
    x: 51,
    y: 55,
  },
  {
    id: "vento",
    label: "La voce del vento",
    eyebrow: "4 · Il ritorno al presente",
    title: "Un suono reale riapre il confronto",
    quote:
      "E come il vento\nodo stormir tra queste piante, io quello\ninfinito silenzio a questa voce\nvo comparando:",
    body:
      "Il vento tra le foglie interrompe il silenzio immaginato. Leopardi mette a confronto una voce presente e finita con l’infinito silenzio costruito dalla mente.",
    consequence:
      "La sensazione non distrugge l’immaginazione: le offre un termine concreto con cui misurarsi.",
    work: "L’infinito, vv. 8–11",
    x: 23,
    y: 38,
  },
  {
    id: "tempo",
    label: "L’eterno e le stagioni",
    eyebrow: "5 · L’infinito temporale",
    title: "Dallo spazio al tempo",
    quote:
      "e mi sovvien l’eterno,\ne le morte stagioni, e la presente\ne viva, e il suon di lei.",
    body:
      "Il pensiero passa dall’orizzonte senza confini al tempo: l’eterno, le epoche trascorse e l’istante vivo coesistono nella coscienza.",
    consequence:
      "Il suono del vento rende percepibile il presente; proprio da quel presente la mente immagina ciò che lo precede e lo supera.",
    work: "L’infinito, vv. 11–13",
    x: 64,
    y: 18,
  },
  {
    id: "naufragio",
    label: "Il dolce naufragio",
    eyebrow: "6 · La perdita dei confini",
    title: "Il pensiero accetta di non dominare",
    quote:
      "Così tra questa\nimmensità s’annega il pensier mio:\ne il naufragar m’è dolce in questo mare.",
    body:
      "Il mare è una metafora dell’immensità, non un luogo reale della scena. L’io non conquista l’infinito: lascia che il proprio pensiero perda per un momento i confini.",
    consequence:
      "Il naufragio è “dolce” perché sospende la misura dell’io senza cancellarne la lucidità.",
    work: "L’infinito, vv. 13–15",
    x: 70,
    y: 72,
  },
];

const villageStages: KnowledgeItem[] = [
  {
    id: "silvia",
    label: "La voce di Silvia",
    eyebrow: "1 · La giovinezza immaginata",
    title: "Una voce riempie il borgo",
    quote:
      "Sonavan le quiete\nstanze, e le vie dintorno,\nal tuo perpetuo canto,\nallor che all’opre femminili intenta\nsedevi, assai contenta\ndi quel vago avvenir che in mente avevi.",
    body:
      "Silvia non è osservata come un ritratto fermo. La sua voce attraversa le stanze e le strade, mentre il lavoro quotidiano convive con l’immagine di un futuro ancora aperto.",
    consequence:
      "La giovinezza appare come attesa: possiede valore non perché abbia già ottenuto la felicità, ma perché può ancora immaginarla.",
    work: "A Silvia, vv. 7–12",
    x: 17,
    y: 35,
  },
  {
    id: "promessa",
    label: "La promessa tradita",
    eyebrow: "2 · L’apparire del vero",
    title: "La Natura promette ciò che non mantiene",
    quote:
      "O natura, o natura,\nperché non rendi poi\nquel che prometti allor? perché di tanto\ninganni i figli tuoi?",
    body:
      "Il ricordo della speranza non consola. Nel presente, Leopardi misura la distanza tra ciò che la giovinezza prometteva e ciò che la vita ha realmente concesso a Silvia e a lui.",
    consequence:
      "Il disinganno non riguarda soltanto una vicenda privata: diventa un’accusa rivolta al meccanismo stesso della vita.",
    work: "A Silvia, vv. 36–39",
    x: 29,
    y: 57,
  },
  {
    id: "sabato",
    label: "Il villaggio attende",
    eyebrow: "3 · Il piacere dell’attesa",
    title: "Tutto il borgo prepara il domani",
    quote:
      "La donzelletta vien dalla campagna,\nin sul calar del sole,\ncol suo fascio dell’erba, e reca in mano\nun mazzolin di rose e di viole",
    body:
      "La piazza raccoglie età, gesti e suoni diversi: la giovane, la vecchierella, i bambini, il contadino, l’artigiano. Tutti sono protesi verso la festa che deve ancora arrivare.",
    consequence:
      "La felicità è più intensa nella preparazione che nel possesso: l’immaginazione colma il futuro di possibilità.",
    work: "Il sabato del villaggio, vv. 1–4",
    x: 49,
    y: 59,
  },
  {
    id: "festa",
    label: "La festa che verrà",
    eyebrow: "4 · Attesa e possesso",
    title: "Il sabato è più lieto della domenica",
    quote:
      "Questo di sette è il piú gradito giorno,\npien di speme e di gioia:\ndiman tristezza e noia\nrecheran l’ore",
    body:
      "Il giorno più desiderato non è la festa, ma quello che la precede. Quando il piacere diventa presente e finito, perde la ricchezza che possedeva nell’attesa.",
    consequence:
      "Il borgo rende concreta la teoria del piacere: il desiderio vive di un futuro indefinito, mentre ogni soddisfazione reale ha confini.",
    work: "Il sabato del villaggio, vv. 38–41",
    x: 63,
    y: 42,
  },
  {
    id: "stelle",
    label: "Le stelle ritrovate",
    eyebrow: "5 · Il ritorno",
    title: "Lo stesso cielo incontra un uomo diverso",
    quote:
      "Vaghe stelle dell’Orsa, io non credea\ntornare ancor per uso a contemplarvi\nsul paterno giardino scintillanti,\ne ragionar con voi dalle finestre\ndi questo albergo ove abitai fanciullo",
    body:
      "Le stelle, il giardino e le finestre sono rimasti; chi li guarda è cambiato. Il ritorno sovrappone il presente adulto al tempo dell’infanzia.",
    consequence:
      "La memoria non recupera il passato: lo rende nuovamente presente e, proprio così, ne mostra l’irreparabile distanza.",
    work: "Le ricordanze, vv. 1–5",
    x: 81,
    y: 24,
  },
  {
    id: "ricordanza",
    label: "La rimembranza acerba",
    eyebrow: "6 · Presenza dell’assenza",
    title: "I luoghi parlano di chi non c’è più",
    quote:
      "O Nerina! e di te forse non odo\nquesti luoghi parlar? caduta forse\ndal mio pensier sei tu? Dove sei gita,\nche qui sola di te la ricordanza\ntrovo, dolcezza mia?",
    body:
      "Il borgo conserva finestre, voci e percorsi, ma li restituisce come tracce. Nerina vive nel canto non come presenza recuperata, bensì come assenza che ogni luogo continua a nominare.",
    consequence:
      "Ricordare produce insieme dolcezza e dolore: salva le immagini della giovinezza, ma conferma che quel tempo non può tornare.",
    work: "Le ricordanze, vv. 136–140",
    x: 82,
    y: 62,
  },
];

const natureStages: KnowledgeItem[] = [
  {
    id: "fuga",
    label: "La fuga impossibile",
    eyebrow: "1 · Il viaggiatore",
    title: "L’Islandese cerca un luogo senza dolore",
    quote:
      "Sono un povero Islandese, che vo fuggendo la Natura; e fuggitala quasi tutto il tempo della mia vita per cento parti della terra, la fuggo adesso per questa.",
    body:
      "L’Islandese non cerca il piacere né la gloria. Ha ridotto la propria ambizione a una richiesta minima: vivere senza offendere e senza essere offeso, lontano dagli uomini e dai patimenti.",
    consequence:
      "Il viaggio dimostra che non esiste un luogo esterno alla Natura: cambiare clima e paese modifica le forme del dolore, non lo elimina.",
    work: "Dialogo della Natura e di un Islandese",
    x: 23,
    y: 67,
  },
  {
    id: "patimento",
    label: "Nessun riparo",
    eyebrow: "2 · L’esperienza universale",
    title: "Il patimento non dipende soltanto dagli uomini",
    quote:
      "Io non mi ricordo aver passato un giorno solo della vita senza qualche pena.",
    body:
      "Caldo, freddo, malattie, tempeste, animali e vecchiaia mostrano che la sofferenza appartiene alla condizione dei viventi. Non è soltanto il prodotto di una società corrotta.",
    consequence:
      "Il pessimismo diventa cosmico: l’infelicità non riguarda una singola epoca o civiltà, ma ogni essere inserito nel ciclo naturale.",
    work: "Dialogo della Natura e di un Islandese",
    x: 39,
    y: 43,
  },
  {
    id: "indifferenza",
    label: "Il mondo non è per noi",
    eyebrow: "3 · La risposta della Natura",
    title: "La Natura non è una volontà nemica",
    quote:
      "Immaginavi tu forse che il mondo fosse fatto per causa vostra?",
    body:
      "L’Islandese accusa la Natura di essere nemica e carnefice. Lei corregge quella lettura: non agisce per rendere felici gli uomini, ma neppure per punirli. Le sue operazioni perseguono tutt’altro.",
    consequence:
      "“Matrigna” è una metafora utile solo se non le attribuiamo odio o intenzione morale. La scoperta più dura è l’indifferenza.",
    work: "Dialogo della Natura e di un Islandese",
    x: 64,
    y: 28,
  },
  {
    id: "circuito",
    label: "Produzione e distruzione",
    eyebrow: "4 · La legge del mondo",
    title: "Ogni vita alimenta un ciclo che non la protegge",
    quote:
      "La vita di quest’universo è un perpetuo circuito di produzione e distruzione.",
    body:
      "Per la Natura, nascita e morte sono collegate: ciascuna serve all’altra e alla conservazione del mondo. Il singolo vivente non è il fine del processo.",
    consequence:
      "La continuità dell’universo si mantiene attraverso la trasformazione e il consumo delle sue parti, non attraverso la loro felicità.",
    work: "Dialogo della Natura e di un Islandese",
    x: 76,
    y: 51,
  },
  {
    id: "domanda",
    label: "A chi giova?",
    eyebrow: "5 · La domanda senza risposta",
    title: "L’Islandese porta il sistema alla contraddizione",
    quote:
      "A chi piace o a chi giova cotesta vita infelicissima dell’universo?",
    body:
      "Se chi viene distrutto patisce, mentre chi distrugge non gode ed è a sua volta destinato a perire, la conservazione del ciclo non offre una giustificazione comprensibile al dolore.",
    consequence:
      "Il dialogo non chiude la ferita con una teoria consolatoria. La domanda resta aperta e smaschera ogni facile antropocentrismo.",
    work: "Dialogo della Natura e di un Islandese",
    x: 51,
    y: 72,
  },
  {
    id: "finale",
    label: "Il finale senza risposta",
    eyebrow: "6 · L’ironia tragica",
    title: "Il meccanismo continua mentre l’uomo domanda",
    quote:
      "È fama che sopraggiungessero due leoni, così rifiniti e maceri dall’inedia, che appena ebbero forza di mangiarsi quell’Islandese.",
    body:
      "Leopardi offre due finali: l’Islandese viene divorato da leoni affamati oppure sepolto da un vento furioso e trasformato in mummia. In entrambi, il ragionamento è interrotto materialmente dal ciclo naturale.",
    consequence:
      "La morte dell’Islandese non confuta la sua domanda: la rende scena. Produzione e distruzione proseguono senza fornire una risposta morale.",
    work: "Dialogo della Natura e di un Islandese",
    x: 82,
    y: 70,
  },
];

const rebellionStages: KnowledgeItem[] = [
  {
    id: "filippi",
    label: "La virtù sconfitta",
    eyebrow: "1 · Bruto dopo Filippi",
    title: "La storia ha sconfitto l’ideale",
    quote:
      "Poi che divelta, nella tracia polve\ngiacque, ruina immensa,\nl’italica virtute",
    body:
      "Leopardi colloca Bruto nella notte successiva alla sconfitta di Filippi. Non parla il semplice perdente di una battaglia: parla un uomo che vede crollare insieme la libertà repubblicana e la fiducia in un ordine giusto della storia.",
    consequence:
      "Quando la virtù non riceve premio e la forza decide gli eventi, la storia cessa di apparire come un processo morale.",
    work: "Bruto minore, vv. 1–3",
    x: 20,
    y: 63,
  },
  {
    id: "fato",
    label: "La sfida al fato",
    eyebrow: "2 · Bruto contro la necessità",
    title: "Resistere anche senza speranza",
    quote:
      "Guerra mortale, eterna, o fato indegno,\nteco il prode guerreggia,\ndi cedere inesperto",
    body:
      "Bruto sa che il destino è invincibile. La sua grandezza non consiste nell’illusione di poterlo dominare, ma nel rifiuto di riconoscerlo come giusto.",
    consequence:
      "La ribellione leopardiana non promette la vittoria: conserva la dignità di chi non trasforma la necessità in obbedienza interiore.",
    work: "Bruto minore, vv. 38–40",
    x: 36,
    y: 39,
  },
  {
    id: "indomito",
    label: "L’animo indomito",
    eyebrow: "3 · Una resistenza solitaria",
    title: "La sconfitta non ottiene il consenso",
    quote:
      "e la tiranna\ntua destra, allor che vincitrice il grava,\nindomito scrollando si pompeggia",
    body:
      "Il fato può schiacciare Bruto, ma non costringerlo ad approvare il proprio destino. Il gesto estremo diventa, nella canzone, l’ultima affermazione di autonomia contro dèi muti e storia violenta.",
    consequence:
      "È uno stoicismo tragico e poetico, non una dottrina consolatoria: l’uomo resta padrone del proprio giudizio anche quando non è padrone degli eventi.",
    work: "Bruto minore, vv. 40–42",
    x: 42,
    y: 70,
  },
  {
    id: "bellezza",
    label: "Esclusa dalla bellezza",
    eyebrow: "4 · Saffo davanti alla Natura",
    title: "Il mondo è bello, ma non per tutti",
    quote:
      "Bello il tuo manto, o divo cielo, e bella\nsei tu, rorida terra.",
    body:
      "La Saffo immaginata da Leopardi riconosce la bellezza del cielo e della terra, ma non riesce più a sentirsi parte di essa. La Natura non è ancora il meccanismo impersonale dell’Islandese: è una bellezza che appare selettiva ed escludente.",
    consequence:
      "Il contrasto fra valore interiore e aspetto esteriore denuncia un mondo che non riconosce l’ingegno, la sensibilità e la virtù.",
    work: "Ultimo canto di Saffo, vv. 19–20",
    x: 64,
    y: 28,
  },
  {
    id: "arcano",
    label: "Arcano è tutto",
    eyebrow: "5 · Il dolore senza colpa",
    title: "La ragione non trova una giustificazione",
    quote: "Arcano è tutto,\nfuor che il nostro dolor.",
    body:
      "Saffo cerca una colpa che possa spiegare la propria esclusione, ma non la trova. L’ordine che determina i destini rimane oscuro; soltanto il dolore è immediatamente certo.",
    consequence:
      "La sofferenza non viene redenta da un disegno provvidenziale. La lucidità consiste nel non inventare una risposta che il mondo non offre.",
    work: "Ultimo canto di Saffo, vv. 46–47",
    x: 76,
    y: 51,
  },
  {
    id: "rifiuto",
    label: "Il rifiuto finale",
    eyebrow: "6 · La dignità ferita",
    title: "L’illusione finisce, la voce resiste",
    quote:
      "Morremo. Il velo indegno a terra sparto,\nrifuggirà l’ignudo animo a Dite",
    body:
      "La morte non è presentata come una soluzione felice. È il limite estremo entro cui il personaggio leopardiano pronuncia la propria protesta contro una sorte che ha separato bellezza, amore e valore.",
    consequence:
      "Come Bruto, Saffo non vince. Ma trasforma l’esclusione in parola e impedisce che il dolore resti muto o venga scambiato per colpa.",
    work: "Ultimo canto di Saffo, vv. 55–56",
    x: 84,
    y: 69,
  },
];

const ginestraStages: KnowledgeItem[] = [
  {
    id: "deserto",
    label: "Il fiore del deserto",
    eyebrow: "1 · Il paesaggio della verità",
    title: "La ginestra abita l’arida schiena",
    quote:
      "Qui su l’arida schiena\ndel formidabil monte\nsterminator Vesevo",
    body:
      "Il viaggio arriva su un suolo di cenere e lava, dove le città e i campi distrutti mostrano senza veli la fragilità dell’opera umana. In questo spazio ostile cresce la ginestra: non cancella il deserto, lo abita.",
    consequence:
      "La verità non produce consolazione, ma permette di guardare la condizione umana senza illusioni.",
    work: "La ginestra, vv. 1–3",
    x: 79,
    y: 73,
  },
  {
    id: "potenza",
    label: "La forza del Vesuvio",
    eyebrow: "2 · La sproporzione",
    title: "Un lieve moto può annullare l’uomo",
    quote:
      "cui la dura nutrice, ov’ei men teme,\ncon lieve moto in un momento annulla",
    body:
      "Il Vesuvio rende visibile la sproporzione fra la potenza naturale e la presunzione umana. La Natura non organizza i propri processi in rapporto ai nostri meriti, progetti o dolori.",
    consequence:
      "L’uomo deve riconoscersi fragile e smettere di considerarsi il centro e il fine dell’universo.",
    work: "La ginestra, vv. 44–46",
    x: 66,
    y: 34,
  },
  {
    id: "progresso",
    label: "Il secol superbo e sciocco",
    eyebrow: "3 · La polemica",
    title: "Il progresso non rende immortali",
    quote: "le magnifiche sorti e progressive",
    body:
      "Leopardi non rifiuta il sapere o la civiltà. Attacca l’idea ingenua che il progresso cancelli la vulnerabilità dell’uomo o dimostri che la storia proceda verso una felicità garantita.",
    consequence:
      "La ragione è autenticamente civile quando distrugge le false grandezze, non quando ne costruisce di nuove.",
    work: "La ginestra, vv. 49–51",
    x: 47,
    y: 46,
  },
  {
    id: "nobilta",
    label: "La vera nobiltà",
    eyebrow: "4 · La lucidità coraggiosa",
    title: "Nobile è chi confessa il vero",
    quote:
      "Nobil natura è quella\nch’a sollevar s’ardisce\ngli occhi mortali incontra\nal comun fato",
    body:
      "La nobiltà non consiste nel proclamarsi potente. È la capacità di riconoscere apertamente il male comune e di sostenerne la verità senza vergogna, superbia o menzogna.",
    consequence:
      "La lucidità diventa una forma di coraggio condivisibile: nessuno è superiore alla condizione comune.",
    work: "La ginestra, vv. 111–114",
    x: 30,
    y: 59,
  },
  {
    id: "catena",
    label: "La social catena",
    eyebrow: "5 · La risposta umana",
    title: "La fragilità può diventare alleanza",
    quote:
      "tutti fra sé confederati estima\ngli uomini, e tutti abbraccia\ncon vero amor",
    body:
      "Se la Natura è il pericolo comune, gli uomini non devono aggiungere alle proprie miserie l’odio reciproco. La risposta leopardiana non è religiosa né provvidenziale: è una solidarietà concreta fra esseri fragili.",
    consequence:
      "La ribellione solitaria di Bruto e Saffo diventa responsabilità politica e fraternità: la “social catena”.",
    work: "La ginestra, vv. 129–132",
    x: 37,
    y: 76,
  },
  {
    id: "fiore",
    label: "La dignità della ginestra",
    eyebrow: "6 · Il simbolo conclusivo",
    title: "Né supplice né superba",
    quote:
      "ma non eretto\ncon forsennato orgoglio inver’ le stelle",
    body:
      "La ginestra sarà distrutta dalla lava, ma non supplica il proprio oppressore e non si immagina immortale. Piega il capo soltanto quando la forza naturale la raggiunge.",
    consequence:
      "La sua dignità consiste nell’accettare il limite senza umiliarsi e senza mentire: fragile, lucida, resistente.",
    work: "La ginestra, vv. 309–310",
    x: 71,
    y: 83,
  },
];

const naplesStages: KnowledgeItem[] = [
  {
    id: "riva",
    label: "La riva notturna",
    eyebrow: "1 · L’ultima soglia",
    title: "Il pensiero torna a sedere davanti al mare",
    quote:
      "Sovente in queste rive,\nche, desolate, a bruno\nveste il flutto indurato, e par che ondeggi,\nseggo la notte",
    body:
      "Napoli non chiude il viaggio con una riconciliazione fra l’uomo e la Natura. La riva notturna conserva il paesaggio vulcanico e la sua durezza; offre però uno spazio da cui guardare insieme il mondo e la condizione umana.",
    consequence:
      "La lucidità non elimina il dolore: cambia il modo di abitarlo e impedisce di trasformarlo in menzogna.",
    work: "La ginestra, vv. 158–161",
    x: 20,
    y: 35,
  },
  {
    id: "stelle",
    label: "Le stelle e il mare",
    eyebrow: "2 · Lo sguardo cosmico",
    title: "Il mare riflette un universo che non parla all’uomo",
    quote:
      "veggo dall’alto fiammeggiar le stelle,\ncui di lontan fa specchio\nil mare",
    body:
      "Le stelle e il mare ampliano lo sguardo oltre il Vesuvio. La bellezza del cosmo non è una promessa rivolta all’uomo: resta splendida e indifferente, estranea ai nostri desideri di centralità.",
    consequence:
      "La contemplazione non consola con una provvidenza; educa a misurare senza superbia il posto dell’uomo nel tutto.",
    work: "La ginestra, vv. 162–165",
    x: 65,
    y: 23,
  },
  {
    id: "misura",
    label: "La misura dell’uomo",
    eyebrow: "3 · La verità del limite",
    title: "Terra e mare sono soltanto un punto",
    quote: "un punto a petto a lor son terra e mare\nveracemente",
    body:
      "Lo sguardo verso le stelle ridimensiona non soltanto il singolo individuo, ma la Terra stessa. Il pensiero leopardiano rifiuta l’idea che l’universo abbia l’umanità come centro e fine.",
    consequence:
      "Riconoscersi piccoli non significa disprezzarsi: significa sostituire alla presunzione una misura più vera.",
    work: "La ginestra, vv. 169–171",
    x: 47,
    y: 45,
  },
  {
    id: "orgoglio",
    label: "La falsa eternità",
    eyebrow: "4 · L’ultima illusione",
    title: "La storia passa, la Natura non se ne accorge",
    quote:
      "Caggiono i regni intanto,\npassan genti e linguaggi: ella nol vede:\ne l’uom d’eternità s’arroga il vanto.",
    body:
      "Le civiltà, le lingue e i regni si succedono, mentre i processi naturali continuano senza attribuire loro un privilegio. L’ultima illusione da perdere è quella dell’immortalità collettiva.",
    consequence:
      "Una civiltà autentica non promette eternità: costruisce giustizia nel tempo fragile che le è dato.",
    work: "La ginestra, vv. 294–296",
    x: 80,
    y: 54,
  },
  {
    id: "alleanza",
    label: "Gli uomini insieme",
    eyebrow: "5 · La risposta possibile",
    title: "La fraternità nasce dalla comune esposizione",
    quote:
      "tutti fra sé confederati estima\ngli uomini, e tutti abbraccia\ncon vero amor",
    body:
      "Gli uomini raffigurati sulla riva non dominano il mare e non cancellano il Vesuvio. La loro forza consiste nel riconoscersi esposti allo stesso pericolo e nel non aggiungere odio umano al dolore naturale.",
    consequence:
      "La “social catena” traduce la verità filosofica in aiuto reciproco, responsabilità e convivenza.",
    work: "La ginestra, vv. 130–132",
    x: 29,
    y: 69,
  },
  {
    id: "civilta",
    label: "Giustizia e pietà",
    eyebrow: "6 · L’esito del viaggio",
    title: "Dal vero può nascere una civiltà più umana",
    quote:
      "l’onesto e il retto\nconversar cittadino,\ne giustizia e pietade altra radice\navranno allor",
    body:
      "Leopardi non offre una salvezza metafisica. Propone una radice terrena della vita civile: conoscere il limite comune, smascherare le false consolazioni e scegliere di sostenersi.",
    consequence:
      "Dalla biblioteca al mare, il pensiero approda a una dignità senza illusioni: lucidi davanti alla Natura, solidali fra noi.",
    work: "La ginestra, vv. 151–154",
    x: 62,
    y: 79,
  },
];

const mapVideos: VideoItem[] = [
  {
    id: "mappa-viaggio",
    title: "Introduzione al viaggio",
    youtubeId: "XX9AAJd_e5c",
  },
];

const houseVideos: VideoItem[] = [
  { id: "poetica", title: "La poetica", youtubeId: "If1NOtDiyPI" },
  {
    id: "natura-madre",
    title: "La Natura madre",
    youtubeId: "okms117e0kY",
  },
];

const hillVideos: VideoItem[] = [
  { id: "infinito", title: "La collina dell’Infinito", youtubeId: "5ngp_G77iLA" },
];

const natureVideos: VideoItem[] = [
  {
    id: "natura-indifferente-1",
    title: "La Natura indifferente",
    youtubeId: "znaOWswKTno",
  },
  {
    id: "natura-indifferente-2",
    title: "Il dialogo con la Natura",
    youtubeId: "br5fkw1UuPI",
  },
];

const rebellionVideos: VideoItem[] = [
  {
    id: "bruto-minore",
    title: "Bruto minore",
    youtubeId: "QQhjL_ukLvI",
  },
  {
    id: "ultimo-canto-saffo",
    title: "L’ultimo canto di Saffo",
    youtubeId: "SlPift1LWGE",
  },
];

const ginestraVideos: VideoItem[] = [
  {
    id: "la-ginestra",
    title: "La ginestra",
    youtubeId: "ZFBV2QtkhlQ",
  },
];

const fullPoem = `Sempre caro mi fu quest’ermo colle,
e questa siepe, che da tanta parte
dell’ultimo orizzonte il guardo esclude.
Ma sedendo e mirando, interminati
spazi di là da quella, e sovrumani
silenzi, e profondissima quiete
io nel pensier mi fingo; ove per poco
il cor non si spaura. E come il vento
odo stormir tra queste piante, io quello
infinito silenzio a questa voce
vo comparando: e mi sovvien l’eterno,
e le morte stagioni, e la presente
e viva, e il suon di lei. Così tra questa
immensità s’annega il pensier mio:
e il naufragar m’è dolce in questo mare.`;

function VideoDock({
  videos,
  activeVideo,
  onOpen,
  onClose,
  placement = "scene",
}: {
  videos: VideoItem[];
  activeVideo: VideoItem | null;
  onOpen: (video: VideoItem) => void;
  onClose: () => void;
  placement?: "map" | "scene";
}) {
  const selectedVideo =
    activeVideo && videos.some((video) => video.id === activeVideo.id)
      ? activeVideo
      : null;

  return (
    <>
      <aside
        className={`video-dock video-dock-${placement}`}
        aria-label="Video della tappa"
      >
        <span className="video-dock-label">Video</span>
        <div>
          {videos.map((video, index) => (
            <button
              key={video.id}
              className={selectedVideo?.id === video.id ? "active" : ""}
              onClick={() => onOpen(video)}
              aria-label={`Apri video: ${video.title}`}
              title={video.title}
            >
              <i aria-hidden="true">▶</i>
              <b>{videos.length > 1 ? index + 1 : ""}</b>
            </button>
          ))}
        </div>
      </aside>

      {selectedVideo && (
        <section
          className="video-player"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`video-title-${selectedVideo.id}`}
        >
          <header>
            <div>
              <span>Video · Leopardi</span>
              <h2 id={`video-title-${selectedVideo.id}`}>
                {selectedVideo.title}
              </h2>
            </div>
            <button onClick={onClose} aria-label="Chiudi il video">
              ×
            </button>
          </header>
          <div className="video-frame">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0&playsinline=1`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
      )}
    </>
  );
}

function DraggableCard({
  item,
  onClose,
}: {
  item: KnowledgeItem;
  onClose: () => void;
}) {
  const [position, setPosition] = useState({ x: 48, y: 104 });
  const drag = useRef<{
    pointerX: number;
    pointerY: number;
    startX: number;
    startY: number;
  } | null>(null);

  function beginDrag(event: React.PointerEvent<HTMLDivElement>) {
    drag.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: position.x,
      startY: position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveCard(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const maxX = Math.max(12, window.innerWidth - 480);
    const maxY = Math.max(88, window.innerHeight - 410);
    setPosition({
      x: Math.min(
        maxX,
        Math.max(12, drag.current.startX + event.clientX - drag.current.pointerX),
      ),
      y: Math.min(
        maxY,
        Math.max(88, drag.current.startY + event.clientY - drag.current.pointerY),
      ),
    });
  }

  function endDrag() {
    drag.current = null;
  }

  return (
    <article
      className="knowledge-card"
      style={{ left: position.x, top: position.y }}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`title-${item.id}`}
    >
      <div
        className="card-drag"
        onPointerDown={beginDrag}
        onPointerMove={moveCard}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <span>Trascina il pannello</span>
        <button
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onClose}
          aria-label="Chiudi il pannello"
        >
          ×
        </button>
      </div>
      <div className="card-body">
        <p className="eyebrow">{item.eyebrow}</p>
        <h2 id={`title-${item.id}`}>{item.title}</h2>
        {item.quote && <blockquote>{item.quote}</blockquote>}
        <p>{item.body}</p>
        <div className="card-note">
          <strong>Che cosa accade</strong>
          <p>{item.consequence}</p>
        </div>
        <p className="work-link">
          <span>Testo collegato</span>
          {item.work}
        </p>
      </div>
    </article>
  );
}

export default function Home() {
  const [introOpen, setIntroOpen] = useState(true);
  const [mode, setMode] = useState<"guided" | "free">("guided");
  const [scene, setScene] = useState<SceneId>(null);
  const [activeItem, setActiveItem] = useState<KnowledgeItem | null>(null);
  const [houseVisited, setHouseVisited] = useState<HouseStopId[]>([]);
  const [hillVisited, setHillVisited] = useState<HillStageId[]>([]);
  const [villageVisited, setVillageVisited] = useState<VillageStageId[]>([]);
  const [natureVisited, setNatureVisited] = useState<NatureStageId[]>([]);
  const [rebellionVisited, setRebellionVisited] = useState<
    RebellionStageId[]
  >([]);
  const [ginestraVisited, setGinestraVisited] = useState<GinestraStageId[]>([]);
  const [naplesVisited, setNaplesVisited] = useState<NaplesStageId[]>([]);
  const [poemOpen, setPoemOpen] = useState(false);
  const [villageSynthesisOpen, setVillageSynthesisOpen] = useState(false);
  const [natureSynthesisOpen, setNatureSynthesisOpen] = useState(false);
  const [rebellionSynthesisOpen, setRebellionSynthesisOpen] = useState(false);
  const [ginestraSynthesisOpen, setGinestraSynthesisOpen] = useState(false);
  const [naplesSynthesisOpen, setNaplesSynthesisOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [zoom, setZoom] = useState(1);
  const [notice, setNotice] = useState("");
  const mapViewport = useRef<HTMLDivElement>(null);
  const mapDrag = useRef<{
    x: number;
    y: number;
    scrollLeft: number;
    scrollTop: number;
  } | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function startJourney(selectedMode: "guided" | "free") {
    setMode(selectedMode);
    setIntroOpen(false);
    if (selectedMode === "guided") {
      window.setTimeout(
        () => setNotice("Prima tappa sbloccata: Casa Leopardi"),
        300,
      );
    }
  }

  function enterScene(nextScene: Exclude<SceneId, null>) {
    setScene(nextScene);
    setActiveItem(null);
    setPoemOpen(false);
    setVillageSynthesisOpen(false);
    setNatureSynthesisOpen(false);
    setRebellionSynthesisOpen(false);
    setGinestraSynthesisOpen(false);
    setNaplesSynthesisOpen(false);
    setActiveVideo(null);
  }

  function openHouseStop(item: KnowledgeItem) {
    setActiveItem(item);
    setHouseVisited((current) =>
      current.includes(item.id as HouseStopId)
        ? current
        : [...current, item.id as HouseStopId],
    );
  }

  function openHillStage(item: KnowledgeItem, index: number) {
    const unlocked = mode === "free" || index <= hillVisited.length;
    if (!unlocked) {
      setNotice("Segui prima il movimento precedente della poesia.");
      return;
    }

    setActiveItem(item);
    setHillVisited((current) =>
      current.includes(item.id as HillStageId)
        ? current
        : [...current, item.id as HillStageId],
    );
  }

  function openVillageStage(item: KnowledgeItem, index: number) {
    const unlocked = mode === "free" || index <= villageVisited.length;
    if (!unlocked) {
      setNotice("Segui prima il movimento precedente del borgo.");
      return;
    }

    setActiveItem(item);
    setVillageVisited((current) =>
      current.includes(item.id as VillageStageId)
        ? current
        : [...current, item.id as VillageStageId],
    );
  }

  function openNatureStage(item: KnowledgeItem, index: number) {
    const unlocked = mode === "free" || index <= natureVisited.length;
    if (!unlocked) {
      setNotice("Segui prima il passaggio precedente del dialogo.");
      return;
    }

    setActiveItem(item);
    setNatureVisited((current) =>
      current.includes(item.id as NatureStageId)
        ? current
        : [...current, item.id as NatureStageId],
    );
  }

  function openRebellionStage(item: KnowledgeItem, index: number) {
    const unlocked = mode === "free" || index <= rebellionVisited.length;
    if (!unlocked) {
      setNotice("Segui prima il passaggio precedente della ribellione.");
      return;
    }

    setActiveItem(item);
    setRebellionVisited((current) =>
      current.includes(item.id as RebellionStageId)
        ? current
        : [...current, item.id as RebellionStageId],
    );
  }

  function openGinestraStage(item: KnowledgeItem, index: number) {
    const unlocked = mode === "free" || index <= ginestraVisited.length;
    if (!unlocked) {
      setNotice("Segui prima il passaggio precedente della Ginestra.");
      return;
    }

    setActiveItem(item);
    setGinestraVisited((current) =>
      current.includes(item.id as GinestraStageId)
        ? current
        : [...current, item.id as GinestraStageId],
    );
  }

  function openNaplesStage(item: KnowledgeItem, index: number) {
    const unlocked = mode === "free" || index <= naplesVisited.length;
    if (!unlocked) {
      setNotice("Segui prima il passaggio precedente dell’ultima soglia.");
      return;
    }

    setActiveItem(item);
    setNaplesVisited((current) =>
      current.includes(item.id as NaplesStageId)
        ? current
        : [...current, item.id as NaplesStageId],
    );
  }

  function beginMapDrag(event: React.PointerEvent<HTMLDivElement>) {
    const viewport = mapViewport.current;
    if (!viewport || (event.target as HTMLElement).closest("button")) return;
    mapDrag.current = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
    };
    viewport.setPointerCapture(event.pointerId);
  }

  function moveMap(event: React.PointerEvent<HTMLDivElement>) {
    const viewport = mapViewport.current;
    if (!viewport || !mapDrag.current) return;
    viewport.scrollLeft =
      mapDrag.current.scrollLeft - (event.clientX - mapDrag.current.x);
    viewport.scrollTop =
      mapDrag.current.scrollTop - (event.clientY - mapDrag.current.y);
  }

  function endMapDrag() {
    mapDrag.current = null;
  }

  const houseCompleted = houseVisited.length === houseStops.length;
  const hillCompleted = hillVisited.length === hillStages.length;
  const villageCompleted = villageVisited.length === villageStages.length;
  const natureCompleted = natureVisited.length === natureStages.length;
  const rebellionCompleted =
    rebellionVisited.length === rebellionStages.length;
  const ginestraCompleted = ginestraVisited.length === ginestraStages.length;
  const naplesCompleted = naplesVisited.length === naplesStages.length;
  const sceneCount =
    scene === "naples"
      ? naplesVisited.length
      : scene === "ginestra"
      ? ginestraVisited.length
      : scene === "rebellion"
      ? rebellionVisited.length
      : scene === "nature"
      ? natureVisited.length
      : scene === "village"
      ? villageVisited.length
      : scene === "hill"
        ? hillVisited.length
        : scene === "house"
          ? houseVisited.length
          : houseVisited.length +
            hillVisited.length +
            villageVisited.length +
            natureVisited.length +
            rebellionVisited.length +
            ginestraVisited.length +
            naplesVisited.length;
  const sceneTotal =
    scene === "naples"
      ? naplesStages.length
      : scene === "ginestra"
      ? ginestraStages.length
      : scene === "rebellion"
      ? rebellionStages.length
      : scene === "nature"
      ? natureStages.length
      : scene === "village"
      ? villageStages.length
      : scene === "hill"
        ? hillStages.length
        : scene === "house"
          ? houseStops.length
          : houseStops.length +
            hillStages.length +
            villageStages.length +
            natureStages.length +
            rebellionStages.length +
            ginestraStages.length +
            naplesStages.length;
  const progressLabel =
    scene === "naples"
      ? "Napoli e il mare"
      : scene === "ginestra"
      ? "Il Vesuvio e la Ginestra"
      : scene === "rebellion"
      ? "Bruto e Saffo"
      : scene === "nature"
      ? "La Natura indifferente"
      : scene === "village"
      ? "Il borgo di Recanati"
      : scene === "hill"
        ? "Collina dell’Infinito"
        : scene === "house"
          ? "Casa Leopardi"
          : "Viaggio esplorato";
  const activeHillClass =
    scene === "hill" && activeItem ? `hill-stage-${activeItem.id}` : "hill-stage-base";
  const activeVillageClass =
    scene === "village" && activeItem
      ? `village-stage-${activeItem.id}`
      : "village-stage-base";
  const activeNatureClass =
    scene === "nature" && activeItem
      ? `nature-stage-${activeItem.id}`
      : "nature-stage-base";
  const activeRebellionClass =
    scene === "rebellion" && activeItem
      ? `rebellion-stage-${activeItem.id}`
      : "rebellion-stage-base";
  const activeGinestraClass =
    scene === "ginestra" && activeItem
      ? `ginestra-stage-${activeItem.id}`
      : "ginestra-stage-base";
  const activeNaplesClass =
    scene === "naples" && activeItem
      ? `naples-stage-${activeItem.id}`
      : "naples-stage-base";

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ∞
          </span>
          <div>
            <p>Un viaggio nella mente di Giacomo Leopardi</p>
            <h1>Dalla collina al vulcano</h1>
          </div>
        </div>
        <div
          className="progress-wrap"
          aria-label={`Progresso: ${sceneCount} nuclei su ${sceneTotal}`}
        >
          <div className="progress-label">
            <span>{progressLabel}</span>
            <strong>
              {sceneCount} / {sceneTotal}
            </strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${(sceneCount / sceneTotal) * 100}%` }} />
          </div>
        </div>
        <button className="route-button" onClick={() => setIntroOpen(true)}>
          <span aria-hidden="true">✦</span>
          Il viaggio
        </button>
      </header>

      <section
        className="map-viewport"
        ref={mapViewport}
        onPointerDown={beginMapDrag}
        onPointerMove={moveMap}
        onPointerUp={endMapDrag}
        onPointerCancel={endMapDrag}
        aria-label="Mappa interattiva del viaggio leopardiano"
      >
        <div
          className="map-canvas"
          style={{
            width: `${Math.max(100, zoom * 100)}%`,
            minWidth: `${Math.max(1000, zoom * 1000)}px`,
          }}
        >
          <img
            src="images/leopardi-map.png"
            alt="Mappa pittorica da Casa Leopardi al Vesuvio e al mare di Napoli"
            draggable="false"
          />

          <button
            className="map-node active node-casa"
            onClick={() => enterScene("house")}
            aria-label="Apri Casa Leopardi"
          >
            <span>1</span>
            <b>Entra nella biblioteca</b>
          </button>
          <button
            className={`map-node node-collina ${mode === "free" || houseCompleted ? "active" : "locked"}`}
            onClick={() => {
              if (mode === "free" || houseCompleted) enterScene("hill");
              else setNotice("La collina si apre dopo i quattro nuclei di Casa Leopardi.");
            }}
            aria-label="Apri la Collina dell'Infinito"
            aria-disabled={mode !== "free" && !houseCompleted}
          >
            <span>2</span>
            {(mode === "free" || houseCompleted) && <b>Sali alla collina</b>}
          </button>
          <button
            className={`map-node node-recanati ${mode === "free" || hillCompleted ? "active" : "locked"}`}
            onClick={() => {
              if (mode === "free" || hillCompleted) enterScene("village");
              else setNotice("Recanati si apre dopo aver ricomposto L’infinito.");
            }}
            aria-label="Apri il borgo di Recanati"
            aria-disabled={mode !== "free" && !hillCompleted}
          >
            <span>3</span>
            {(mode === "free" || hillCompleted) && <b>Entra nel borgo</b>}
          </button>
          <button
            className={`map-node node-natura ${mode === "free" || villageCompleted ? "active" : "locked"}`}
            onClick={() => {
              if (mode === "free" || villageCompleted) enterScene("nature");
              else
                setNotice(
                  "La Natura indifferente si apre dopo aver attraversato il borgo.",
                );
            }}
            aria-label="Apri la Natura indifferente"
            aria-disabled={mode !== "free" && !villageCompleted}
          >
            <span>4</span>
            {(mode === "free" || villageCompleted) && (
              <b>Incontra la Natura</b>
            )}
          </button>
          <button
            className={`map-node node-ribellione ${mode === "free" || natureCompleted ? "active" : "locked"}`}
            onClick={() => {
              if (mode === "free" || natureCompleted) enterScene("rebellion");
              else
                setNotice(
                  "Bruto e Saffo si aprono dopo il confronto con la Natura.",
                );
            }}
            aria-label="Apri Bruto e Saffo"
            aria-disabled={mode !== "free" && !natureCompleted}
          >
            <span>5</span>
            {(mode === "free" || natureCompleted) && (
              <b>Incontra Bruto e Saffo</b>
            )}
          </button>
          <button
            className={`map-node node-ginestra ${mode === "free" || rebellionCompleted ? "active" : "locked"}`}
            onClick={() => {
              if (mode === "free" || rebellionCompleted) enterScene("ginestra");
              else
                setNotice(
                  "Il Vesuvio si apre dopo aver attraversato Bruto e Saffo.",
                );
            }}
            aria-label="Apri il Vesuvio e la Ginestra"
            aria-disabled={mode !== "free" && !rebellionCompleted}
          >
            <span>6</span>
            {(mode === "free" || rebellionCompleted) && (
              <b>Raggiungi la Ginestra</b>
            )}
          </button>
          <button
            className={`map-node node-napoli ${mode === "free" || ginestraCompleted ? "active" : "locked"}`}
            onClick={() => {
              if (mode === "free" || ginestraCompleted) enterScene("naples");
              else
                setNotice(
                  "Napoli e il mare si aprono dopo aver attraversato la Ginestra.",
                );
            }}
            aria-label="Apri Napoli e il mare"
            aria-disabled={mode !== "free" && !ginestraCompleted}
          >
            <span>7</span>
            {(mode === "free" || ginestraCompleted) && (
              <b>Raggiungi Napoli e il mare</b>
            )}
          </button>

          <div className="map-controls" aria-label="Controlli della mappa">
            <button
              onClick={() => setZoom((value) => Math.min(1.65, value + 0.15))}
              aria-label="Ingrandisci"
            >
              +
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((value) => Math.max(1, value - 0.15))}
              aria-label="Riduci"
            >
              −
            </button>
          </div>
          <VideoDock
            videos={mapVideos}
            activeVideo={activeVideo}
            onOpen={setActiveVideo}
            onClose={() => setActiveVideo(null)}
            placement="map"
          />
          <p className="map-hint">↔ Trascina la mappa · usa + e − per esplorare</p>
        </div>
      </section>

      {introOpen && (
        <section
          className="welcome-panel"
          role="dialog"
          aria-labelledby="welcome-title"
        >
          <button
            className="panel-close"
            onClick={() => setIntroOpen(false)}
            aria-label="Chiudi introduzione"
          >
            ×
          </button>
          <p className="eyebrow">Benvenuto nel viaggio</p>
          <h2 id="welcome-title">
            Dalla stanza chiusa
            <br />
            all’orizzonte.
          </h2>
          <p>
            Il paesaggio che attraverserai non illustra soltanto Leopardi:
            rende visibile il movimento del suo pensiero, dalle illusioni di
            Recanati alla lucidità della <em>Ginestra</em>, fino alla fraternità
            possibile di Napoli e il mare.
          </p>
          <button
            className="primary-action"
            onClick={() => startJourney("guided")}
          >
            <strong>Inizia da Casa Leopardi</strong>
            <span>Percorso guidato · consigliato</span>
          </button>
          <button
            className="secondary-action"
            onClick={() => startJourney("free")}
          >
            Esplora liberamente
          </button>
          <small>◷ Sette tappe: circa 65 minuti</small>
        </section>
      )}

      {scene === "house" && (
        <section className="scene" aria-label="La biblioteca di Casa Leopardi">
          <img
            className="scene-image"
            src="images/casa-leopardi.png"
            alt="Giacomo Leopardi scrive nella biblioteca di Recanati"
            draggable="false"
          />
          <div className="scene-shade" />
          <header className="scene-header">
            <button
              className="back-button"
              onClick={() => {
                setScene(null);
                setActiveItem(null);
              }}
            >
              ← Torna alla mappa
            </button>
            <div>
              <p>Tappa 1</p>
              <h2>La biblioteca di Recanati</h2>
            </div>
            <span>{houseVisited.length} / 4 esplorati</span>
          </header>

          <aside className="scene-question">
            <span>Domanda generatrice</span>
            Come può il sapere diventare anche desiderio di evasione?
          </aside>

          {houseStops.map((item, index) => (
            <button
              key={item.id}
              className={`scene-hotspot ${houseVisited.includes(item.id as HouseStopId) ? "seen" : ""}`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              onClick={() => openHouseStop(item)}
              aria-label={`Esplora: ${item.label}`}
            >
              <span>{index + 1}</span>
              <b>{item.label}</b>
            </button>
          ))}

          <div className="scene-guide">
            <span aria-hidden="true">✦</span>
            Tocca i quattro nuclei della stanza
          </div>

          <VideoDock
            videos={houseVideos}
            activeVideo={activeVideo}
            onOpen={setActiveVideo}
            onClose={() => setActiveVideo(null)}
          />

          {houseCompleted && (
            <button
              className="next-threshold"
              onClick={() => enterScene("hill")}
            >
              <span>La stanza non basta più</span>
              Verso la collina dell’Infinito →
            </button>
          )}

          {activeItem && (
            <DraggableCard
              key={activeItem.id}
              item={activeItem}
              onClose={() => setActiveItem(null)}
            />
          )}
        </section>
      )}

      {scene === "hill" && (
        <section
          className={`scene hill-scene ${activeHillClass}`}
          aria-label="La collina dell'Infinito"
        >
          <img
            className="scene-image hill-image"
            src="images/collina-infinito.png"
            alt="Leopardi sulla collina, davanti alla siepe e a un orizzonte indefinito"
            draggable="false"
          />
          <div className="hill-haze" aria-hidden="true" />
          <div className="hill-wind" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>
          <div className="hill-time" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="hill-wave" aria-hidden="true" />
          <div className="scene-shade" />

          <header className="scene-header">
            <button
              className="back-button"
              onClick={() => {
                setScene(null);
                setActiveItem(null);
                setPoemOpen(false);
              }}
            >
              ← Torna alla mappa
            </button>
            <div>
              <p>Tappa 2 · Poesia per immagini</p>
              <h2>La collina dell’Infinito</h2>
            </div>
            <span>{hillVisited.length} / 6 movimenti</span>
          </header>

          <aside className="scene-question hill-question">
            <span>Domanda generatrice</span>
            Come può un ostacolo allo sguardo generare l’infinito?
          </aside>

          {hillStages.map((item, index) => {
            const seen = hillVisited.includes(item.id as HillStageId);
            const unlocked = mode === "free" || index <= hillVisited.length;
            return (
              <button
                key={item.id}
                className={`scene-hotspot hill-hotspot hill-${item.id} ${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""} ${unlocked ? "" : "locked"}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onClick={() => openHillStage(item, index)}
                aria-label={`${unlocked ? "Esplora" : "Bloccato"}: ${item.label}`}
                aria-disabled={!unlocked}
              >
                <span>{index + 1}</span>
                <b>{item.label}</b>
              </button>
            );
          })}

          <nav className="verse-route" aria-label="Movimenti interni della poesia">
            {hillStages.map((item, index) => {
              const seen = hillVisited.includes(item.id as HillStageId);
              const unlocked = mode === "free" || index <= hillVisited.length;
              return (
                <button
                  key={item.id}
                  className={`${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""}`}
                  onClick={() => openHillStage(item, index)}
                  aria-disabled={!unlocked}
                >
                  <span>{index + 1}</span>
                  <b>{item.label}</b>
                </button>
              );
            })}
          </nav>

          <div className="scene-guide">
            <span aria-hidden="true">✦</span>
            {hillCompleted
              ? "I sei movimenti ora formano un’unica esperienza"
              : `Segui le immagini · prossimo movimento ${Math.min(hillVisited.length + 1, 6)} di 6`}
          </div>

          <VideoDock
            videos={hillVideos}
            activeVideo={activeVideo}
            onOpen={setActiveVideo}
            onClose={() => setActiveVideo(null)}
          />

          {hillCompleted && (
            <>
              <button
                className="poem-action"
                onClick={() => {
                  setActiveItem(null);
                  setPoemOpen(true);
                }}
              >
                Ricomponi la poesia
              </button>
              <button
                className="next-threshold"
                onClick={() => enterScene("village")}
              >
                <span>Dall’infinito alla vita</span>
                Verso il borgo di Recanati →
              </button>
            </>
          )}

          {activeItem && (
            <DraggableCard
              key={activeItem.id}
              item={activeItem}
              onClose={() => setActiveItem(null)}
            />
          )}

          {poemOpen && (
            <section
              className="poem-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="poem-title"
            >
              <button
                className="panel-close"
                onClick={() => setPoemOpen(false)}
                aria-label="Chiudi la poesia"
              >
                ×
              </button>
              <p className="eyebrow">Giacomo Leopardi · Canti, XII</p>
              <h2 id="poem-title">L’infinito</h2>
              <blockquote>{fullPoem}</blockquote>
              <div className="poem-synthesis">
                <strong>Il movimento completo</strong>
                <p>
                  La sensazione incontra un limite; l’immaginazione apre lo
                  spazio e il tempo; l’io avverte la vertigine e infine accetta
                  di perdersi nell’immensità che ha costruito.
                </p>
              </div>
            </section>
          )}
        </section>
      )}

      {scene === "village" && (
        <section
          className={`scene village-scene ${activeVillageClass}`}
          aria-label="Il borgo di Recanati"
        >
          <img
            className="scene-image village-image"
            src="images/recanati-borgo.png"
            alt="Recanati al crepuscolo: la finestra di Silvia, la piazza in attesa della festa e Leopardi che ricorda"
            draggable="false"
          />
          <div className="village-window-glow" aria-hidden="true" />
          <div className="village-bell" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="village-petals" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>
          <div className="village-star" aria-hidden="true" />
          <div className="village-memory" aria-hidden="true" />
          <div className="scene-shade" />

          <header className="scene-header">
            <button
              className="back-button"
              onClick={() => {
                setScene(null);
                setActiveItem(null);
                setVillageSynthesisOpen(false);
              }}
            >
              ← Torna alla mappa
            </button>
            <div>
              <p>Tappa 3 · Il paese dell’attesa</p>
              <h2>Il borgo di Recanati</h2>
            </div>
            <span>{villageVisited.length} / 6 movimenti</span>
          </header>

          <aside className="scene-question village-question">
            <span>Domanda generatrice</span>
            Perché l’attesa della felicità è spesso più intensa della felicità
            posseduta?
          </aside>

          {villageStages.map((item, index) => {
            const seen = villageVisited.includes(item.id as VillageStageId);
            const unlocked = mode === "free" || index <= villageVisited.length;
            return (
              <button
                key={item.id}
                className={`scene-hotspot village-hotspot village-${item.id} ${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""} ${unlocked ? "" : "locked"}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onClick={() => openVillageStage(item, index)}
                aria-label={`${unlocked ? "Esplora" : "Bloccato"}: ${item.label}`}
                aria-disabled={!unlocked}
              >
                <span>{index + 1}</span>
                <b>{item.label}</b>
              </button>
            );
          })}

          <nav
            className="verse-route village-route"
            aria-label="Movimenti interni del borgo"
          >
            {villageStages.map((item, index) => {
              const seen = villageVisited.includes(item.id as VillageStageId);
              const unlocked = mode === "free" || index <= villageVisited.length;
              return (
                <button
                  key={item.id}
                  className={`${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""}`}
                  onClick={() => openVillageStage(item, index)}
                  aria-disabled={!unlocked}
                >
                  <span>{index + 1}</span>
                  <b>{item.label}</b>
                </button>
              );
            })}
          </nav>

          <div className="scene-guide">
            <span aria-hidden="true">✦</span>
            {villageCompleted
              ? "Le tre poesie ora raccontano un unico movimento"
              : `Segui il borgo · prossimo movimento ${Math.min(villageVisited.length + 1, 6)} di 6`}
          </div>

          {villageCompleted && (
            <>
              <button
                className="poem-action village-synthesis-action"
                onClick={() => {
                  setActiveItem(null);
                  setVillageSynthesisOpen(true);
                }}
              >
                Ricomponi il senso del borgo
              </button>
              <button
                className="next-threshold"
                onClick={() => enterScene("nature")}
              >
                <span>Dalla promessa al vero</span>
                Verso la Natura indifferente →
              </button>
            </>
          )}

          {activeItem && (
            <DraggableCard
              key={activeItem.id}
              item={activeItem}
              onClose={() => setActiveItem(null)}
            />
          )}

          {villageSynthesisOpen && (
            <section
              className="poem-panel village-synthesis"
              role="dialog"
              aria-modal="true"
              aria-labelledby="village-synthesis-title"
            >
              <button
                className="panel-close"
                onClick={() => setVillageSynthesisOpen(false)}
                aria-label="Chiudi la sintesi"
              >
                ×
              </button>
              <p className="eyebrow">Recanati · Tre forme del tempo</p>
              <h2 id="village-synthesis-title">Il paese dell’attesa</h2>
              <div className="village-synthesis-grid">
                <article>
                  <strong>A Silvia</strong>
                  <p>
                    La giovinezza vive di una promessa che il vero interrompe.
                  </p>
                </article>
                <article>
                  <strong>Il sabato del villaggio</strong>
                  <p>
                    Il piacere più vivo abita nell’attesa, non nella festa
                    posseduta.
                  </p>
                </article>
                <article>
                  <strong>Le ricordanze</strong>
                  <p>
                    La memoria restituisce il passato come dolcezza e come
                    perdita irreparabile.
                  </p>
                </article>
              </div>
              <div className="poem-synthesis">
                <strong>Il movimento completo</strong>
                <p>
                  Nel borgo, Leopardi scopre che desiderio, attesa e memoria
                  nascono dalla stessa sproporzione: l’uomo immagina una
                  felicità senza confini, ma incontra esperienze finite e
                  destinate a passare.
                </p>
              </div>
            </section>
          )}
        </section>
      )}

      {scene === "nature" && (
        <section
          className={`scene nature-scene ${activeNatureClass}`}
          aria-label="La Natura indifferente"
        >
          <img
            className="scene-image nature-image"
            src="images/natura-indifferente.png"
            alt="L’Islandese, minuscolo nel deserto, davanti a una montagna con forma di donna impassibile"
            draggable="false"
          />
          <div className="nature-dust" aria-hidden="true" />
          <div className="nature-wind" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>
          <div className="nature-cycle" aria-hidden="true">
            <i />
            <i />
          </div>
          <div className="scene-shade" />

          <header className="scene-header">
            <button
              className="back-button"
              onClick={() => {
                setScene(null);
                setActiveItem(null);
                setNatureSynthesisOpen(false);
                setActiveVideo(null);
              }}
            >
              ← Torna alla mappa
            </button>
            <div>
              <p>Tappa 4 · La scoperta</p>
              <h2>La Natura indifferente</h2>
            </div>
            <span>{natureVisited.length} / 6 passaggi</span>
          </header>

          <aside className="scene-question nature-question">
            <span>Domanda generatrice</span>
            Che cosa cambia quando la Natura non appare più madre, ma neppure
            nemica?
          </aside>

          {natureStages.map((item, index) => {
            const seen = natureVisited.includes(item.id as NatureStageId);
            const unlocked = mode === "free" || index <= natureVisited.length;
            return (
              <button
                key={item.id}
                className={`scene-hotspot nature-hotspot nature-${item.id} ${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""} ${unlocked ? "" : "locked"}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onClick={() => openNatureStage(item, index)}
                aria-label={`${unlocked ? "Esplora" : "Bloccato"}: ${item.label}`}
                aria-disabled={!unlocked}
              >
                <span>{index + 1}</span>
                <b>{item.label}</b>
              </button>
            );
          })}

          <nav
            className="verse-route nature-route"
            aria-label="Passaggi del Dialogo della Natura e di un Islandese"
          >
            {natureStages.map((item, index) => {
              const seen = natureVisited.includes(item.id as NatureStageId);
              const unlocked = mode === "free" || index <= natureVisited.length;
              return (
                <button
                  key={item.id}
                  className={`${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""}`}
                  onClick={() => openNatureStage(item, index)}
                  aria-disabled={!unlocked}
                >
                  <span>{index + 1}</span>
                  <b>{item.label}</b>
                </button>
              );
            })}
          </nav>

          <div className="scene-guide">
            <span aria-hidden="true">✦</span>
            {natureCompleted
              ? "Il dialogo ha smontato l’illusione di un mondo fatto per l’uomo"
              : mode === "free"
                ? "Esplora liberamente i sei passaggi del dialogo"
                : `Segui il confronto · prossimo passaggio ${Math.min(natureVisited.length + 1, 6)} di 6`}
          </div>

          <VideoDock
            videos={natureVideos}
            activeVideo={activeVideo}
            onOpen={setActiveVideo}
            onClose={() => setActiveVideo(null)}
          />

          {natureCompleted && (
            <>
              <button
                className="poem-action nature-synthesis-action"
                onClick={() => {
                  setActiveItem(null);
                  setNatureSynthesisOpen(true);
                }}
              >
                Ricomponi la scoperta
              </button>
              <button
                className="next-threshold"
                onClick={() => enterScene("rebellion")}
              >
                <span>Dalla scoperta alla ribellione</span>
                Verso Bruto e Saffo →
              </button>
            </>
          )}

          {activeItem && (
            <DraggableCard
              key={activeItem.id}
              item={activeItem}
              onClose={() => setActiveItem(null)}
            />
          )}

          {natureSynthesisOpen && (
            <section
              className="poem-panel nature-synthesis"
              role="dialog"
              aria-modal="true"
              aria-labelledby="nature-synthesis-title"
            >
              <button
                className="panel-close"
                onClick={() => setNatureSynthesisOpen(false)}
                aria-label="Chiudi la sintesi"
              >
                ×
              </button>
              <p className="eyebrow">Operette morali · La scoperta</p>
              <h2 id="nature-synthesis-title">Non odio. Indifferenza.</h2>
              <div className="nature-equation" aria-label="Sintesi concettuale">
                <span>Desiderio di quiete</span>
                <b>→</b>
                <span>Patimento universale</span>
                <b>→</b>
                <span>Natura indifferente</span>
              </div>
              <div className="poem-synthesis">
                <strong>Il movimento completo</strong>
                <p>
                  L’Islandese parte dall’esperienza del dolore, scopre che
                  nessun luogo ne è immune e interroga la Natura. La risposta
                  spezza l’ultima illusione antropocentrica: il mondo non è
                  organizzato per la felicità né per l’infelicità umana. Il
                  ciclo continua, mentre la domanda sul suo senso resta aperta.
                </p>
              </div>
            </section>
          )}
        </section>
      )}

      {scene === "rebellion" && (
        <section
          className={`scene rebellion-scene ${activeRebellionClass}`}
          aria-label="Bruto e Saffo: la ribellione"
        >
          <img
            className="scene-image rebellion-image"
            src="images/bruto-saffo.png"
            alt="Bruto dopo Filippi e Saffo sulla rupe di Leucade, separati nello stesso paesaggio sotto un cielo indifferente"
            draggable="false"
          />
          <div className="rebellion-sky" aria-hidden="true" />
          <div className="rebellion-wind" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>
          <div className="rebellion-divide" aria-hidden="true" />
          <div className="scene-shade" />

          <header className="scene-header">
            <button
              className="back-button"
              onClick={() => {
                setScene(null);
                setActiveItem(null);
                setRebellionSynthesisOpen(false);
                setActiveVideo(null);
              }}
            >
              ← Torna alla mappa
            </button>
            <div>
              <p>Tappa 5 · La ribellione</p>
              <h2>Bruto e Saffo</h2>
            </div>
            <span>{rebellionVisited.length} / 6 passaggi</span>
          </header>

          <aside className="scene-question rebellion-question">
            <span>Domanda generatrice</span>
            Che cosa resta all’uomo quando conosce il vero e non può cambiarlo?
          </aside>

          <div className="character-seal bruto-seal" aria-hidden="true">
            <span>Bruto</span>
            La storia
          </div>
          <div className="character-seal saffo-seal" aria-hidden="true">
            <span>Saffo</span>
            La natura
          </div>

          {rebellionStages.map((item, index) => {
            const seen = rebellionVisited.includes(
              item.id as RebellionStageId,
            );
            const unlocked =
              mode === "free" || index <= rebellionVisited.length;
            return (
              <button
                key={item.id}
                className={`scene-hotspot rebellion-hotspot rebellion-${item.id} ${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""} ${unlocked ? "" : "locked"}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onClick={() => openRebellionStage(item, index)}
                aria-label={`${unlocked ? "Esplora" : "Bloccato"}: ${item.label}`}
                aria-disabled={!unlocked}
              >
                <span>{index + 1}</span>
                <b>{item.label}</b>
              </button>
            );
          })}

          <nav
            className="verse-route rebellion-route"
            aria-label="Passaggi di Bruto minore e Ultimo canto di Saffo"
          >
            {rebellionStages.map((item, index) => {
              const seen = rebellionVisited.includes(
                item.id as RebellionStageId,
              );
              const unlocked =
                mode === "free" || index <= rebellionVisited.length;
              return (
                <button
                  key={item.id}
                  className={`${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""}`}
                  onClick={() => openRebellionStage(item, index)}
                  aria-disabled={!unlocked}
                >
                  <span>{index + 1}</span>
                  <b>{item.label}</b>
                </button>
              );
            })}
          </nav>

          <div className="scene-guide">
            <span aria-hidden="true">✦</span>
            {rebellionCompleted
              ? "Due sconfitte hanno prodotto la stessa scelta: non dare ragione al destino"
              : mode === "free"
                ? "Esplora liberamente Bruto e Saffo"
                : `Segui la ribellione · prossimo passaggio ${Math.min(rebellionVisited.length + 1, 6)} di 6`}
          </div>

          <VideoDock
            videos={rebellionVideos}
            activeVideo={activeVideo}
            onOpen={setActiveVideo}
            onClose={() => setActiveVideo(null)}
          />

          {rebellionCompleted && (
            <>
              <button
                className="poem-action rebellion-synthesis-action"
                onClick={() => {
                  setActiveItem(null);
                  setRebellionSynthesisOpen(true);
                }}
              >
                Confronta le due ribellioni
              </button>
              <button
                className="next-threshold"
                onClick={() => {
                  enterScene("ginestra");
                }}
              >
                <span>Dall’eroe solitario alla social catena</span>
                Verso il Vesuvio →
              </button>
            </>
          )}

          {activeItem && (
            <DraggableCard
              key={activeItem.id}
              item={activeItem}
              onClose={() => setActiveItem(null)}
            />
          )}

          {rebellionSynthesisOpen && (
            <section
              className="poem-panel rebellion-synthesis"
              role="dialog"
              aria-modal="true"
              aria-labelledby="rebellion-synthesis-title"
            >
              <button
                className="panel-close"
                onClick={() => setRebellionSynthesisOpen(false)}
                aria-label="Chiudi il confronto"
              >
                ×
              </button>
              <p className="eyebrow">Canti · Due figure estreme</p>
              <h2 id="rebellion-synthesis-title">
                La dignità senza consolazione
              </h2>
              <div className="rebellion-compare">
                <article>
                  <strong>Bruto</strong>
                  <span>La virtù sconfitta dalla storia</span>
                  <p>
                    Non accetta che la vittoria trasformi la forza in
                    giustizia.
                  </p>
                </article>
                <article>
                  <strong>Saffo</strong>
                  <span>Il valore escluso dalla bellezza</span>
                  <p>
                    Non accetta che la sorte trasformi il dolore in colpa.
                  </p>
                </article>
              </div>
              <div className="poem-synthesis">
                <strong>Il movimento completo</strong>
                <p>
                  Bruto e Saffo non sono modelli da imitare nel loro gesto
                  estremo. Sono figure poetiche attraverso cui Leopardi mette
                  alla prova una possibilità: restare interiormente liberi
                  anche quando storia e Natura negano ogni ricompensa. È un
                  titanismo ancora solitario. Sul Vesuvio dovrà trasformarsi
                  in solidarietà fra uomini.
                </p>
              </div>
            </section>
          )}
        </section>
      )}

      {scene === "ginestra" && (
        <section
          className={`scene ginestra-scene ${activeGinestraClass}`}
          aria-label="Il Vesuvio e la Ginestra"
        >
          <img
            className="scene-image ginestra-image"
            src="images/leopardi-map.png"
            alt="Il Vesuvio sul deserto di lava e le ginestre gialle che crescono sul pendio"
            draggable="false"
          />
          <div className="ginestra-glow" aria-hidden="true" />
          <div className="ginestra-smoke" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>
          <div className="ginestra-embers" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>
          <div className="scene-shade" />

          <header className="scene-header">
            <button
              className="back-button"
              onClick={() => {
                setScene(null);
                setActiveItem(null);
                setGinestraSynthesisOpen(false);
                setActiveVideo(null);
              }}
            >
              ← Torna alla mappa
            </button>
            <div>
              <p>Tappa 6 · La solidarietà</p>
              <h2>Il Vesuvio e la Ginestra</h2>
            </div>
            <span>{ginestraVisited.length} / 6 passaggi</span>
          </header>

          <aside className="scene-question ginestra-question">
            <span>Domanda generatrice</span>
            Come può l’uomo restare degno sapendo di essere fragile e mortale?
          </aside>

          {ginestraStages.map((item, index) => {
            const seen = ginestraVisited.includes(item.id as GinestraStageId);
            const unlocked =
              mode === "free" || index <= ginestraVisited.length;
            return (
              <button
                key={item.id}
                className={`scene-hotspot ginestra-hotspot ginestra-${item.id} ${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""} ${unlocked ? "" : "locked"}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onClick={() => openGinestraStage(item, index)}
                aria-label={`${unlocked ? "Esplora" : "Bloccato"}: ${item.label}`}
                aria-disabled={!unlocked}
              >
                <span>{index + 1}</span>
                <b>{item.label}</b>
              </button>
            );
          })}

          <nav
            className="verse-route ginestra-route"
            aria-label="Passaggi della Ginestra"
          >
            {ginestraStages.map((item, index) => {
              const seen = ginestraVisited.includes(
                item.id as GinestraStageId,
              );
              const unlocked =
                mode === "free" || index <= ginestraVisited.length;
              return (
                <button
                  key={item.id}
                  className={`${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""}`}
                  onClick={() => openGinestraStage(item, index)}
                  aria-disabled={!unlocked}
                >
                  <span>{index + 1}</span>
                  <b>{item.label}</b>
                </button>
              );
            })}
          </nav>

          <div className="scene-guide">
            <span aria-hidden="true">✦</span>
            {ginestraCompleted
              ? "La fragilità riconosciuta è diventata dignità comune e alleanza"
              : mode === "free"
                ? "Esplora liberamente il Vesuvio e la Ginestra"
                : `Segui il percorso · prossimo passaggio ${Math.min(ginestraVisited.length + 1, 6)} di 6`}
          </div>

          <VideoDock
            videos={ginestraVideos}
            activeVideo={activeVideo}
            onOpen={setActiveVideo}
            onClose={() => setActiveVideo(null)}
          />

          {ginestraCompleted && (
            <>
              <button
                className="poem-action ginestra-synthesis-action"
                onClick={() => {
                  setActiveItem(null);
                  setGinestraSynthesisOpen(true);
                }}
              >
                Ricomponi il pensiero
              </button>
              <button
                className="next-threshold"
                onClick={() => {
                  enterScene("naples");
                  setNotice("Ultima soglia sbloccata: Napoli e il mare.");
                }}
              >
                <span>Dalla verità alla fraternità</span>
                Verso Napoli e il mare →
              </button>
            </>
          )}

          {activeItem && (
            <DraggableCard
              key={activeItem.id}
              item={activeItem}
              onClose={() => setActiveItem(null)}
            />
          )}

          {ginestraSynthesisOpen && (
            <section
              className="poem-panel ginestra-synthesis"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ginestra-synthesis-title"
            >
              <button
                className="panel-close"
                onClick={() => setGinestraSynthesisOpen(false)}
                aria-label="Chiudi la sintesi"
              >
                ×
              </button>
              <p className="eyebrow">La Ginestra · Esito del viaggio</p>
              <h2 id="ginestra-synthesis-title">
                Lucidi, fragili, insieme
              </h2>
              <div className="ginestra-equation" aria-label="Sintesi concettuale">
                <span>
                  <strong>Verità</strong>
                  Nessuna provvidenza protegge l’uomo
                </span>
                <b>+</b>
                <span>
                  <strong>Dignità</strong>
                  Né supplici né superbamente immortali
                </span>
                <b>=</b>
                <span>
                  <strong>Social catena</strong>
                  Confederati contro il dolore comune
                </span>
              </div>
              <div className="poem-synthesis">
                <strong>Il movimento completo</strong>
                <p>
                  Leopardi non torna alle illusioni perdute e non promette una
                  vittoria sulla Natura. Compie però un passaggio ulteriore
                  rispetto a Bruto e Saffo: la dignità non deve restare il gesto
                  solitario dell’eroe sconfitto. La conoscenza del limite può
                  fondare giustizia, pietà e aiuto reciproco. La ginestra non
                  sconfigge il Vesuvio; mostra come abitare il deserto senza
                  menzogna e senza resa morale.
                </p>
              </div>
            </section>
          )}
        </section>
      )}

      {scene === "naples" && (
        <section
          className={`scene naples-scene ${activeNaplesClass}`}
          aria-label="Napoli e il mare"
        >
          <img
            className="scene-image naples-image"
            src="images/napoli-mare.png"
            alt="Il golfo di Napoli sotto le stelle, con il Vesuvio lontano e un piccolo gruppo di persone unite sulla terrazza"
            draggable="false"
          />
          <div className="naples-stars" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>
          <div className="naples-reflection" aria-hidden="true" />
          <div className="naples-human-light" aria-hidden="true" />
          <div className="scene-shade" />

          <header className="scene-header">
            <button
              className="back-button"
              onClick={() => {
                setScene(null);
                setActiveItem(null);
                setNaplesSynthesisOpen(false);
                setActiveVideo(null);
              }}
            >
              ← Torna alla mappa
            </button>
            <div>
              <p>Tappa 7 · L’ultima soglia</p>
              <h2>Napoli e il mare</h2>
            </div>
            <span>{naplesVisited.length} / 6 passaggi</span>
          </header>

          <aside className="scene-question naples-question">
            <span>Domanda generatrice</span>
            Se la Natura resta indifferente, da dove può nascere una forma di
            bene?
          </aside>

          {naplesStages.map((item, index) => {
            const seen = naplesVisited.includes(item.id as NaplesStageId);
            const unlocked = mode === "free" || index <= naplesVisited.length;
            return (
              <button
                key={item.id}
                className={`scene-hotspot naples-hotspot naples-${item.id} ${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""} ${unlocked ? "" : "locked"}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onClick={() => openNaplesStage(item, index)}
                aria-label={`${unlocked ? "Esplora" : "Bloccato"}: ${item.label}`}
                aria-disabled={!unlocked}
              >
                <span>{index + 1}</span>
                <b>{item.label}</b>
              </button>
            );
          })}

          <nav
            className="verse-route naples-route"
            aria-label="Passaggi conclusivi di Napoli e il mare"
          >
            {naplesStages.map((item, index) => {
              const seen = naplesVisited.includes(item.id as NaplesStageId);
              const unlocked = mode === "free" || index <= naplesVisited.length;
              return (
                <button
                  key={item.id}
                  className={`${seen ? "seen" : ""} ${activeItem?.id === item.id ? "current" : ""}`}
                  onClick={() => openNaplesStage(item, index)}
                  aria-disabled={!unlocked}
                >
                  <span>{index + 1}</span>
                  <b>{item.label}</b>
                </button>
              );
            })}
          </nav>

          <div className="scene-guide">
            <span aria-hidden="true">✦</span>
            {naplesCompleted
              ? "Il viaggio è compiuto: nessuna illusione, nessuna resa morale"
              : mode === "free"
                ? "Esplora liberamente l’ultima soglia"
                : `Segui il percorso · prossimo passaggio ${Math.min(naplesVisited.length + 1, 6)} di 6`}
          </div>

          {naplesCompleted && (
            <>
              <button
                className="poem-action naples-synthesis-action"
                onClick={() => {
                  setActiveItem(null);
                  setNaplesSynthesisOpen(true);
                }}
              >
                Ricomponi il viaggio
              </button>
              <button
                className="next-threshold naples-finish"
                onClick={() => {
                  setScene(null);
                  setActiveItem(null);
                  setNaplesSynthesisOpen(false);
                  setNotice(
                    "Viaggio completato: dalla collina al vulcano, dal limite alla fraternità.",
                  );
                }}
              >
                <span>Il percorso resta aperto</span>
                Ritorna alla mappa →
              </button>
            </>
          )}

          {activeItem && (
            <DraggableCard
              key={activeItem.id}
              item={activeItem}
              onClose={() => setActiveItem(null)}
            />
          )}

          {naplesSynthesisOpen && (
            <section
              className="poem-panel naples-synthesis"
              role="dialog"
              aria-modal="true"
              aria-labelledby="naples-synthesis-title"
            >
              <button
                className="panel-close"
                onClick={() => setNaplesSynthesisOpen(false)}
                aria-label="Chiudi la conclusione"
              >
                ×
              </button>
              <p className="eyebrow">Dalla collina al vulcano · Conclusione</p>
              <h2 id="naples-synthesis-title">
                Nessuna consolazione. Una responsabilità.
              </h2>
              <div
                className="naples-compass"
                aria-label="Sintesi del viaggio leopardiano"
              >
                <span>
                  <strong>Limite</strong>
                  La siepe apre l’immaginazione
                </span>
                <span>
                  <strong>Vero</strong>
                  La Natura non protegge l’uomo
                </span>
                <span>
                  <strong>Fraternità</strong>
                  La fragilità comune diventa alleanza
                </span>
              </div>
              <div className="poem-synthesis">
                <strong>L’approdo</strong>
                <p>
                  Leopardi non riconsegna all’uomo le illusioni perdute e non
                  trasforma la bellezza del golfo in una prova di armonia
                  universale. Il mare e le stelle restano estranei. Proprio per
                  questo la fraternità acquista valore: non è garantita dalla
                  Natura, è una scelta umana. La verità toglie consolazioni, ma
                  può fondare giustizia, pietà e aiuto reciproco.
                </p>
              </div>
            </section>
          )}
        </section>
      )}

      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
    </main>
  );
}
