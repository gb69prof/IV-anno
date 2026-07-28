"use strict";

const LESSON_BASE = "../Foscolo/lezioni/";

const lessons = [
  {
    id: "introduzione",
    title: "Introduzione politica e filosofica",
    description: "Campoformio, materialismo, meccanicismo e bisogno di costruire un’eternità simbolica.",
    href: `${LESSON_BASE}introduzione.html`
  },
  {
    id: "fratture",
    title: "Le fratture biografiche",
    description: "Zacinto, patria tradita, esilio, morte del fratello e lontananza dalla madre.",
    href: `${LESSON_BASE}fratture.html`
  },
  {
    id: "immagine-del-mondo",
    title: "La religione delle illusioni",
    description: "Affetti, patria, memoria, gloria, arte e bellezza davanti al nulla.",
    href: `${LESSON_BASE}immagine-del-mondo.html`
  },
  {
    id: "poetica",
    title: "Neoclassicismo e preromanticismo",
    description: "La forma classica chiamata a contenere la ferita moderna dell’io.",
    href: `${LESSON_BASE}poetica.html`
  },
  {
    id: "opere",
    title: "Le opere principali",
    description: "Il quadro d’insieme di Ortis, sonetti, Sepolcri e Grazie.",
    href: `${LESSON_BASE}opere.html`
  },
  {
    id: "alla-sera",
    title: "Dentro “Alla sera”",
    description: "Lettura guidata del sonetto: fatal quiete, nulla eterno, reo tempo e spirto guerrier.",
    href: `${LESSON_BASE}alla-sera.html`
  },
  {
    id: "ortis-parini",
    title: "L’incontro con Parini",
    description: "La passione politica di Jacopo incontra la lucidità morale di Parini.",
    href: `${LESSON_BASE}ortis-parini.html`
  }
];

const works = [
  {
    id: "ortis",
    filter: "ortis",
    kind: "Romanzo epistolare",
    title: "Ultime lettere di Jacopo Ortis",
    date: "redazioni 1798–1816",
    description: "Tre lettere decisive, conservate come unità autonome: la patria sacrificata, le tombe di Santa Croce e il dialogo politico con Parini.",
    themes: ["patria", "esilio", "memoria", "sepolcri", "illusioni"],
    edition: "Testo di lettura controllato sulla trascrizione Wikisource dell’edizione 1801. La storia redazionale dell’Ortis comprende le redazioni 1798-99, 1802 e 1816.",
    philology: "I passi di Firenze (27 agosto) e Milano (4 dicembre) sono lettere diverse. Qui non vengono più saldati in un falso testo continuo.",
    source: "https://it.wikisource.org/wiki/Ultime_lettere_di_Jacopo_Ortis",
    sourceLabel: "Wikisource — testo riletto e controllato",
    lessonIds: ["introduzione", "fratture", "immagine-del-mondo", "opere", "ortis-parini"],
    passages: [
      {
        id: "11-ottobre-1797",
        label: "Da’ colli Euganei, 11 ottobre 1797",
        title: "Il sacrificio della patria",
        format: "prose",
        paragraphs: [
          "Il sacrificio della patria nostra è consumato: tutto è perduto; e la vita, seppure ne verrà concessa, non ci resterà che per piangere le nostre sciagure e la nostra infamia. Il mio nome è nella lista di proscrizione, lo so; ma vuoi tu ch’io per salvarmi da chi m’opprime mi commetta a chi mi ha tradito? Consola mia madre: vinto dalle sue lagrime le ho ubbidito, e ho lasciato Venezia per evitare le prime persecuzioni, e le più feroci.",
          "Or dovrò io abbandonare anche questa mia solitudine antica, dove, senza perdere dagli occhi il mio sciagurato paese, posso ancora sperare qualche giorno di pace? Tu mi fai raccapricciare, Lorenzo: quanti sono dunque gli sventurati? E noi, pur troppo, noi stessi Italiani ci laviamo le mani nel sangue degl’Italiani. Per me segua che può. Poiché ho disperato e della mia patria e di me, aspetto tranquillamente la prigione e la morte.",
          "Il mio cadavere almeno non cadrà fra braccia straniere; il mio nome sarà sommessamente compianto da pochi uomini buoni, compagni delle nostre miserie; e le mie ossa poseranno su la terra de’ miei padri."
        ],
        note: "La data precede di pochi giorni la firma del trattato di Campoformio: nel romanzo la coscienza del tradimento politico irrompe prima della cronaca diplomatica."
      },
      {
        id: "firenze-27-agosto",
        label: "Firenze, 27 agosto",
        title: "Santa Croce: gloria e persecuzione",
        format: "prose",
        paragraphs: [
          "Dianzi io adorava le sepolture di Galileo, del Machiavelli, e di Michelangelo; e nell’appressarmivi io tremava preso da brivido. Coloro che hanno eretti que’ mausolei sperano forse di scolparsi della povertà e delle carceri con le quali i loro avi punivano la grandezza di que’ divini intelletti? Oh quanti perseguitati nel nostro secolo saranno venerati da’ posteri! Ma e le persecuzioni a’ vivi, e gli onori a’ morti sono documenti della maligna ambizione che rode l’umano gregge.",
          "Presso a que’ marmi mi parea di rivivere in quegli anni miei fervidi, quand’io, vegliando su gli scritti de’ grandi mortali, mi gittava con la immaginazione fra i plausi delle generazioni future. Ma ora troppo alte cose per me! — e pazze forse. La mia mente è cieca, le membra vacillanti, e il cuore guasto qui — nel profondo.",
          "Ritienti le commendatizie di cui mi scrivi: quelle che mi mandasti io le ho bruciate. Non voglio più oltraggi, nè favori da veruno degli uomini potenti. L’unico mortale ch’io desiderava conoscere era Vittorio Alfieri: ma odo dire ch’ei non accoglie persone nuove; nè io presumo di fargli rompere questo suo proponimento che deriva forse da’ tempi, da’ suoi studj, e più ancora dalle sue passioni e dall’esperienza del mondo.",
          "E fosse anche una debolezza; le debolezze di sì fatti mortali vanno rispettate: e chi n’è senza, scagli la prima pietra."
        ],
        note: "Questo passo anticipa la sequenza di Santa Croce nei Sepolcri, ma non appartiene alla lettera milanese dell’incontro con Parini."
      },
      {
        id: "milano-4-dicembre",
        label: "Milano, 4 dicembre",
        title: "L’incontro con Parini",
        format: "prose",
        paragraphs: [
          "Jer sera dunque io passeggiava con quel vecchio venerando nel sobborgo orientale della città sotto un boschetto di tigli: egli si sosteneva da una parte sul mio braccio, dall’altra sul suo bastone: e talora guardava gli storpj suoi piedi, e poi senza dire parola volgevasi a me, quasi si dolesse di quella sua infermità, e mi ringraziasse della pazienza con la quale io lo accompagnava. S’assise sopra uno di que’ sedili; ed io con lui: il suo servo ci stava poco discosto.",
          "Il Parini è il personaggio più dignitoso e più eloquente ch’io m’abbia mai conosciuto; e d’altronde un profondo, generoso, meditato dolore a chi non dà somma eloquenza? Mi parlò a lungo della sua patria, e fremeva e per le antiche tirannidi e per la nuova licenza.",
          "Le lettere prostituite; tutte le passioni languenti e degenerate in una indolente vilissima corruzione; non più la sacra ospitalità, non la benevolenza, non più l’amore figliale — e poi mi tesseva gli annali recenti, e i delitti di tanti uomicciattoli ch’io degnerei di nominare, se le loro scelleraggini mostrassero il vigore d’animo, non dirò di Silla e di Catilina, ma di quegli animosi masnadieri che affrontano il misfatto quantunque gli vedano presso il patibolo — ma ladroncelli, tremanti, saccenti — più onesto insomma è tacerne.",
          "— A quelle parole io m’infiammava di un sovrumano furore, e sorgeva gridando: Chè non si tenta? morremo? ma frutterà dal nostro sangue il vendicatore. — Egli mi guardò attonito: gli occhi miei in quel dubbio chiarore scintillavano spaventosi, e il mio dimesso e pallido aspetto si rialzò con aria minaccevole: — io taceva, ma si sentiva ancora un fremito rumoreggiare cupamente dentro il mio petto.",
          "E ripresi: Non avremo salute mai? ah se gli uomini si conducessero sempre al fianco la morte, non servirebbero sì vilmente. — Il Parini non apria bocca; ma stringendomi il braccio, mi guardava ogni ora più fisso.",
          "Poi mi trasse, come accennandomi perch’io tornassi a sedermi: — E pensi tu, proruppe, che s’io discernessi un barlume di libertà, mi perderei, ad onta della mia inferma vecchiaja, in questi vani lamenti? o giovine degno di patria più grata! se non puoi spegnere quel tuo ardore fatale, chè non lo volgi ad altre passioni?",
          "Allora io guardai nel passato — allora io mi voltava avidamente al futuro; ma io errava sempre nel vano, e le mie braccia tornavano deluse senza poter mai stringere nulla, e conobbi tutta tutta la disperazione del mio stato. Narrai a quel generoso Italiano la storia delle mie passioni, e gli dipinsi Teresa come uno di que’ genj celesti i quali par che discendano a illuminare la stanza tenebrosa di questa vita. E alle mie parole e al mio pianto, il vecchio pietoso più volte sospirò dal cuore profondo.",
          "— No, io gli dissi, non veggo più che il sepolcro: sono figlio di madre affettuosa e benefica; spesso mi sembrò di vederla calcare tremando le mie pedate e seguirmi fino a sommo il monte, donde io stava per diruparmi; e mentre era quasi con tutto il corpo abbandonato nell’aria — essa afferravami per la falda delle vesti, e mi ritraeva; ed io volgendomi non udiva più che il suo pianto. Pure — s’ella spiasse tutti gli occulti miei guai, implorerebbe ella stessa dal cielo il termine degli ansiosi miei giorni.",
          "Ma l’unica fiamma vitale che anima ancora questo travagliato mio corpo, è la speranza di tentare la libertà della patria. — Egli sorrise mestamente; e poichè s’accorse che la mia voce infiochiva, e i miei sguardi si abbassavano immoti sul suolo, ricominciò: — Forse questo tuo furore di gloria potrebbe trarti a difficili imprese; ma — credimi; la fama degli eroi spetta un quarto alla loro audacia; due quarti alla sorte; e l’altro quarto a’ loro delitti.",
          "Pur se ti reputi bastevolmente fortunato e crudele per aspirare a questa gloria, pensi tu che i tempi te ne porgano i mezzi? I gemiti di tutte le età, e questo giogo della nostra patria non ti hanno per anco insegnato che non si dee aspettare libertà dallo straniero? Chiunque s’intrica nelle faccende di un paese conquistato non ritrae che il pubblico danno, e la propria infamia.",
          "Quando e doveri e diritti stanno su la punta della spada, il forte scrive le leggi col sangue, e pretende il sacrificio della virtù. E allora? avrai tu la fama e il valore di Annibale che profugo cercava per l’universo un nemico al popolo romano? — Nè ti sarà dato di essere giusto impunemente. Un giovine dritto e bollente di cuore, ma povero di ricchezze, ed incauto d’ingegno, quale sei tu, sarà sempre o l’ordigno del fazioso, o la vittima del potente.",
          "E dove tu nelle pubbliche cose possa preservarti incontaminato dalla comune bruttura, oh! tu sarai altamente laudato; ma spento poscia dal pugnale notturno della calunnia; la tua prigione sarà abbandonata da’ tuoi amici, e il tuo sepolcro degnato appena di un secreto sospiro.",
          "— Ma poniamo che tu, superando e la prepotenza degli stranieri, e la malignità de’ tuoi concittadini, e la corruzione de’ tempi, potessi aspirare al tuo intento; di’? spargerai tutto il sangue col quale conviene nutrire una nascente repubblica? arderai le tue case con le faci della guerra civile? unirai col terrore i partiti? spegnerai con la morte le opinioni? adeguerai con le stragi le fortune? Ma se tu cadi tra via, vediti esecrato dagli uni come demagogo, dagli altri come tiranno.",
          "Gli amori della moltitudine sono brevi ed infausti; giudica, più che dall’intento, dalla fortuna; chiama virtù il delitto utile, e scelleraggine l’onestà che le pare dannosa; e per avere i suoi plausi conviene o atterrirla, o ingrassarla, e ingannarla sempre. E ciò sia.",
          "Potrai tu allora inorgoglito dalla sterminata fortuna, reprimere in te la libidine del supremo potere che ti sarà fomentata e dal sentimento della tua superiorità, e della conoscenza del comune avvilimento? I mortali sono naturalmente schiavi, naturalmente tiranni, naturalmente ciechi. Intento tu allora a puntellare il tuo trono, di filosofo saresti fatto tiranno; e per pochi anni di possanza e di tremore, avresti perduta la tua pace, e confuso il tuo nome fra la immensa turba dei despoti.",
          "— Ti avanza ancora un seggio fra’ capitani; il quale si afferra per mezzo di un ardire feroce, di una avidità che rapisce per profondere, e spesso di una viltà per cui si lambe la mano che t’aita a salire. Ma — o figliuolo! l’umanità geme al nascere di un conquistatore; e non ha per conforto se non la speranza di sorridere su la sua bara.",
          "Tacque — ed io, dopo lunghissimo, silenzio esclamai: O Cocceo Nerva! tu almeno sapevi morire incontaminato. — Il vecchio mi guardò: — Se tu nè speri, nè temi fuori di questo mondo — e mi stringeva la mano — ma io! — Alzò gli occhi al cielo, e quella severa sua fisonomia si raddolciva di un soave conforto, come s’ei lassù contemplasse tutte le sue speranze. — Intesi un calpestìo che s’avanzava verso di noi; e poi travidi gente fra’ tiglj; ci rizzammo: e l’accompagnai sino alle sue stanze."
        ],
        note: "Sono stati eliminati il numero di nota isolato e gli errori materiali presenti nella vecchia trascrizione; il passo resta nella grafia storica del testimone adottato."
      }
    ]
  },
  {
    id: "alla-sera",
    filter: "sonetti",
    kind: "Sonetto",
    title: "Alla sera",
    date: "1803",
    description: "La sera diventa immagine della morte, pace capace di sospendere per un momento il conflitto dello spirto guerrier.",
    themes: ["illusioni", "natura", "poesia", "memoria"],
    edition: "Testo controllato su Biblioteca Italiana, Odi e sonetti. Numerazione dei quattordici versi aggiunta per la navigazione.",
    philology: "Nel v. 13 è ripristinato «io», assente nella trascrizione della vecchia lezione. Il titolo Alla sera è editoriale; il sonetto nasce dall’incipit «Forse perché della fatal quïete».",
    source: "https://www.bibliotecaitaliana.it/testo/bibit001069",
    sourceLabel: "Biblioteca Italiana — Odi e sonetti",
    lessonIds: ["immagine-del-mondo", "poetica", "opere", "alla-sera"],
    passages: [
      {
        id: "testo-integrale",
        label: "Testo integrale",
        title: "Forse perché della fatal quïete",
        format: "verse",
        start: 1,
        lines: [
          "Forse perché della fatal quïete",
          "tu sei l’imago, a me sì cara vieni,",
          "o Sera! E quando ti corteggian liete",
          "le nubi estive e i zeffiri sereni,",
          "e quando dal nevoso aere inquïete",
          "tenebre e lunghe all’universo meni,",
          "sempre scendi invocata, e le secrete",
          "vie del mio cor soavemente tieni.",
          "Vagar mi fai co’ miei pensier su l’orme",
          "che vanno al nulla eterno; e intanto fugge",
          "questo reo tempo, e van con lui le torme",
          "delle cure onde meco egli si strugge;",
          "e mentre io guardo la tua pace, dorme",
          "quello spirto guerrier ch’entro mi rugge."
        ],
        note: "I vv. 9-10 concentrano il materialismo del «nulla eterno»; i vv. 13-14 trasformano la sera in una temporanea pacificazione."
      },
      {
        id: "vv9-10",
        label: "Versi 9–10",
        title: "Il nulla eterno",
        format: "verse",
        start: 9,
        lines: [
          "Vagar mi fai co’ miei pensier su l’orme",
          "che vanno al nulla eterno; e intanto fugge"
        ],
        note: "Il testo non promette un aldilà: la forma poetica rende abitabile, non falsa, la conclusione materialistica."
      },
      {
        id: "vv13-14",
        label: "Versi 13–14",
        title: "Lo spirto guerrier",
        format: "verse",
        start: 13,
        lines: [
          "e mentre io guardo la tua pace, dorme",
          "quello spirto guerrier ch’entro mi rugge."
        ],
        note: "La lezione corretta comprende «io»: non «e mentre guardo», ma «e mentre io guardo»."
      }
    ]
  },
  {
    id: "a-zacinto",
    filter: "sonetti",
    kind: "Sonetto",
    title: "A Zacinto",
    date: "1803",
    description: "La patria perduta viene ricostruita come madre, mito e canto; Ulisse torna, Foscolo avrà una sepoltura illacrimata.",
    themes: ["patria", "esilio", "natura", "poesia", "memoria"],
    edition: "Testo controllato su Biblioteca Italiana, Odi e sonetti.",
    philology: "La tradizione moderna legge «Né più mai»; il testimone Orlandini 1856 presenta «Nè mai più». La scheda adotta la lezione più comune nelle edizioni scolastiche controllate.",
    source: "https://www.bibliotecaitaliana.it/testo/bibit001069",
    sourceLabel: "Biblioteca Italiana — Odi e sonetti",
    lessonIds: ["fratture", "immagine-del-mondo", "poetica", "opere"],
    passages: [
      {
        id: "testo-integrale",
        label: "Testo integrale",
        title: "Né più mai toccherò le sacre sponde",
        format: "verse",
        start: 1,
        lines: [
          "Né più mai toccherò le sacre sponde",
          "ove il mio corpo fanciulletto giacque,",
          "Zacinto mia, che te specchi nell’onde",
          "del greco mar da cui vergine nacque",
          "Venere, e fea quelle isole feconde",
          "col suo primo sorriso, onde non tacque",
          "le tue limpide nubi e le tue fronde",
          "l’inclito verso di colui che l’acque",
          "cantò fatali, ed il diverso esiglio",
          "per cui bello di fama e di sventura",
          "baciò la sua petrosa Itaca Ulisse.",
          "Tu non altro che il canto avrai del figlio,",
          "o materna mia terra; a noi prescrisse",
          "il fato illacrimata sepoltura."
        ],
        note: "Il movimento va dall’origine autobiografica al mito di Venere e Ulisse, poi torna al destino personale dell’esule."
      },
      {
        id: "vv12-14",
        label: "Versi 12–14",
        title: "Il canto e la sepoltura",
        format: "verse",
        start: 12,
        lines: [
          "Tu non altro che il canto avrai del figlio,",
          "o materna mia terra; a noi prescrisse",
          "il fato illacrimata sepoltura."
        ],
        note: "Il v. 14 è indispensabile: senza la «illacrimata sepoltura» il confronto con il ritorno di Ulisse resta incompleto."
      }
    ]
  },
  {
    id: "fratello-giovanni",
    filter: "sonetti",
    kind: "Sonetto",
    title: "In morte del fratello Giovanni",
    date: "1803",
    description: "Il fratello morto, la madre e l’esule formano un triangolo degli affetti che soltanto la poesia può ricongiungere.",
    themes: ["esilio", "memoria", "sepolcri", "poesia"],
    edition: "Testo di lettura coerente con il testimone Caleffi 1835 per il finale «Straniere genti, l’ossa mie rendete».",
    philology: "L’edizione Orlandini 1856 legge «Straniere genti, almen l’ossa rendete» e presenta altre varianti. La differenza è dichiarata, non normalizzata in silenzio.",
    source: "https://it.wikisource.org/wiki/In_morte_del_fratello_Giovanni_(1835)",
    sourceLabel: "Wikisource — testimone Caleffi 1835",
    lessonIds: ["fratture", "immagine-del-mondo", "opere"],
    passages: [
      {
        id: "testo-integrale",
        label: "Testo integrale",
        title: "Un dì, s’io non andrò sempre fuggendo",
        format: "verse",
        start: 1,
        lines: [
          "Un dì, s’io non andrò sempre fuggendo",
          "di gente in gente, me vedrai seduto",
          "su la tua pietra, o fratel mio, gemendo",
          "il fior de’ tuoi gentili anni caduto.",
          "La Madre or sol suo dì tardo traendo",
          "parla di me col tuo cenere muto:",
          "ma io deluse a voi le palme tendo;",
          "e se da lunge i miei tetti saluto,",
          "sento gli avversi Numi, e le secrete",
          "cure che al viver tuo furon tempesta,",
          "e prego anch’io nel tuo porto quiete.",
          "Questo di tanta speme oggi mi resta!",
          "Straniere genti, l’ossa mie rendete",
          "allora al petto della madre mesta."
        ],
        note: "La tomba non è prova di immortalità religiosa: rende possibile il colloquio affettivo fra vivi e morti."
      },
      {
        id: "vv13-14",
        label: "Versi 13–14",
        title: "Restituire le ossa alla madre",
        format: "verse",
        start: 13,
        lines: [
          "Straniere genti, l’ossa mie rendete",
          "allora al petto della madre mesta."
        ],
        note: "Variante 1856: «Straniere genti, almen l’ossa rendete». Il senso resta la restituzione postuma dell’esule al grembo materno."
      }
    ]
  },
  {
    id: "sepolcri",
    filter: "sepolcri",
    kind: "Carme",
    title: "Dei Sepolcri",
    date: "1807",
    description: "La tomba non salva la materia: affetti, memoria civile e poesia possono però opporsi all’oblio e rendere operante il passato.",
    themes: ["sepolcri", "memoria", "patria", "poesia", "illusioni"],
    edition: "Estratti numerati controllati sull’edizione Bettoni 1808. Il carme completo conta 295 endecasillabi sciolti.",
    philology: "La PWA propone i nuclei direttamente richiamati dalle lezioni e rinvia al testimone digitale per il testo integrale e le note foscoliane.",
    source: "https://it.wikisource.org/wiki/Dei_sepolcri_(Bettoni_1808)/Dei_Sepolcri",
    sourceLabel: "Wikisource — edizione Bettoni 1808",
    lessonIds: ["immagine-del-mondo", "poetica", "opere", "ortis-parini"],
    passages: [
      {
        id: "vv1-50",
        label: "Versi 1–50",
        title: "L’illusione degli affetti",
        format: "verse",
        start: 1,
        lines: [
          "All’ombra de’ cipressi e dentro l’urne",
          "confortate di pianto è forse il sonno",
          "della morte men duro? Ove più il Sole",
          "per me alla terra non fecondi questa",
          "bella d’erbe famiglia e d’animali,",
          "e quando vaghe di lusinghe innanzi",
          "a me non danzeran l’ore future,",
          "nè da te, dolce amico, udrò più il verso",
          "e la mesta armonia che lo governa,",
          "nè più nel cor mi parlerà lo spirto",
          "delle vergini Muse e dell’amore,",
          "unico spirto a mia vita raminga,",
          "qual fia ristoro a’ dì perduti un sasso",
          "che distingua le mie dalle infinite",
          "ossa che in terra e in mar semina morte?",
          "Vero è ben, Pindemonte! Anche la Speme",
          "ultima Dea, fugge i sepolcri; e involve",
          "tutte cose l’obblio nella sua notte;",
          "e una forza operosa le affatica",
          "di moto in moto; e l’uomo e le sue tombe",
          "e l’estreme sembianze e le reliquie",
          "della terra e del ciel traveste il tempo.",
          "Ma perchè pria del tempo a sè il mortale",
          "invidierà l’illusion che spento",
          "pur lo sofferma al limitar di Dite?",
          "Non vive ei forse anche sotterra, quando",
          "gli sarà muta l’armonia del giorno,",
          "se può destarla con soavi cure",
          "nella mente de’ suoi? Celeste è questa",
          "corrispondenza d’amorosi sensi,",
          "celeste dote è negli umani; e spesso",
          "per lei si vive con l’amico estinto",
          "e l’estinto con noi, se pia la terra",
          "che lo raccolse infante e lo nutriva,",
          "nel suo grembo materno ultimo asilo",
          "porgendo, sacre le reliquie renda",
          "dall’insultar de’ nembi e dal profano",
          "piede del vulgo, e serbi un sasso il nome,",
          "e di fiori odorata arbore amica",
          "le ceneri di molli ombre consoli.",
          "Sol chi non lascia eredità d’affetti",
          "poca gioja ha dell’urna; e se pur mira",
          "dopo l’esequie, errar vede il suo spirto",
          "fra ’l compianto de’ templi Acherontei,",
          "o ricovrarsi sotto le grandi ale",
          "del perdono d’Iddio: ma la sua polve",
          "lascia alle ortiche di deserta gleba",
          "ove nè donna innamorata preghi,",
          "nè passeggier solingo oda il sospiro",
          "che dal tumulo a noi manda Natura."
        ],
        note: "La «corrispondenza d’amorosi sensi» non nega il materialismo iniziale: sposta la sopravvivenza dalla materia alla relazione."
      },
      {
        id: "vv151-185",
        label: "Versi 151–185",
        title: "Le urne dei forti e Santa Croce",
        format: "verse",
        start: 151,
        lines: [
          "A egregie cose il forte animo accendono",
          "l’urne de’ forti, o Pindemonte; e bella",
          "e santa fanno al peregrin la terra",
          "che le ricetta. Io quando il monumento",
          "vidi ove posa il corpo di quel grande",
          "che temprando lo scettro a’ regnatori",
          "gli allôr ne sfronda, ed alle genti svela",
          "di che lagrime grondi e di che sangue;",
          "e l’arca di colui che nuovo Olimpo",
          "alzò in Roma a’ Celesti; e di chi vide",
          "sotto l’etereo padiglion rotarsi",
          "più mondi, e il Sole irradïarli immoto,",
          "onde all’Anglo che tanta ala vi stese",
          "sgombrò primo le vie del firmamento;",
          "te beata, gridai, per le felici",
          "aure pregne di vita, e pe’ lavacri",
          "che da’ suoi gioghi a te versa Apennino!",
          "Lieta dell’äer tuo veste la Luna",
          "di luce limpidissima i tuoi colli",
          "per vendemmia festanti, e le convalli",
          "popolate di case e d’oliveti",
          "mille di fiori al ciel mandano incensi:",
          "e tu prima, Firenze, udivi il carme",
          "che allegrò l’ira al Ghibellin fuggiasco,",
          "e tu i cari parenti e l’idïoma",
          "desti a quel dolce di Calliope labbro",
          "che Amore in Grecia nudo e nudo in Roma",
          "d’un velo candidissimo adornando,",
          "rendea nel grembo a Venere Celeste:",
          "ma più beata chè in un tempio accolte",
          "serbi l’Itale glorie, uniche forse",
          "da che le mal vietate Alpi e l’alterna",
          "onnipotenza delle umane sorti",
          "armi e sostanze t’invadeano ed are",
          "e patria e, tranne la memoria, tutto."
        ],
        note: "La sequenza riprende Machiavelli, Michelangelo e Galileo, già evocati nella lettera fiorentina dell’Ortis."
      },
      {
        id: "vv226-295",
        label: "Versi 226–295",
        title: "La poesia vince il silenzio",
        format: "verse",
        start: 226,
        lines: [
          "E me che i tempi ed il desio d’onore",
          "fan per diversa gente ir fuggitivo,",
          "me ad evocar gli eroi chiamin le Muse",
          "del mortale pensiero animatrici.",
          "Siedon custodi de’ sepolcri, e quando",
          "il tempo con sue fredde ale vi spazza",
          "fin le rovine, le Pimplée fan lieti",
          "di lor canto i deserti, e l’armonia",
          "vince di mille secoli il silenzio.",
          "Ed oggi nella Tróade inseminata",
          "eterno splende a’ peregrini un loco",
          "eterno per la Ninfa a cui fu sposo",
          "Giove, ed a Giove die’ Dárdano figlio",
          "onde fur Troja e Assáraco e i cinquanta",
          "talami e il regno della Giulia gente.",
          "Però che quando Elettra udì la Parca",
          "che lei dalle vitali aure del giorno",
          "chiamava a’ cori dell’Eliso, a Giove",
          "mandò il voto supremo: E se, diceva,",
          "a te fur care le mie chiome e il viso",
          "e le dolci vigilie, e non mi assente",
          "premio miglior la volontà de’ fati,",
          "la morta amica almen guarda dal cielo",
          "onde d’Elettra tua resti la fama.",
          "Così orando moriva. E ne gemea",
          "l’Olimpio; e l’immortal capo accennando",
          "piovea da crini ambrosia su la Ninfa",
          "e fe’ sacro quel corpo e la sua tomba.",
          "Ivi posò Erittonio, e dorme il giusto",
          "cenere d’Ilo; ivi l’Iliache donne",
          "sciogliean le chiome, indarno ahi! deprecando",
          "da’ lor mariti l’imminente fato;",
          "ivi Cassandra, allor che il Nume in petto",
          "le fea parlar di Troja il dì mortale,",
          "venne; e all’ombre cantò carme amoroso,",
          "e guidava i nepoti, e l’amoroso",
          "apprendeva lamento a’ giovinetti.",
          "E dicea sospirando: Oh se mai d’Argo,",
          "ove al Tidíde e di Laérte al figlio",
          "pascerete i cavalli, a voi permetta",
          "ritorno il cielo, invan la patria vostra",
          "cercherete! Le mura opra di Febo",
          "sotto le lor reliquie fumeranno.",
          "Ma i Penati di Troja avranno stanza",
          "in queste tombe; chè de’ Numi è dono",
          "servar nelle miserie altero nome.",
          "E voi palme e cipressi che le nuore",
          "piantan di Príamo, e crescerete ahi presto",
          "di vedovili lagrime innaffiati,",
          "proteggete i miei padri: e chi la scure",
          "asterrà pio dalle devote frondi",
          "men si dorrà di consanguinei lutti",
          "e santamente toccherà l’altare.",
          "Proteggete i miei padri. Un dì vedrete",
          "mendico un cieco errar sotto le vostre",
          "antichissime ombre, e brancolando",
          "penetrar negli avelli, e abbracciar l’urne,",
          "e interrogarle. Gemeranno gli antri",
          "secreti, e tutta narrerà la tomba",
          "Ilio raso due volte e due risorto",
          "splendidamente su le mute vie",
          "per far più bello l’ultimo trofeo",
          "ai fatati Pelidi. Il sacro vate,",
          "placando quelle afflitte alme col canto,",
          "i Prenci Argivi eternerà per quante",
          "abbraccia terre il gran padre Oceáno.",
          "E tu onore di pianti, Ettore, avrai",
          "ove fia santo e lagrimato il sangue",
          "per la patria versato, e finchè il Sole",
          "risplenderà su le sciagure umane."
        ],
        note: "Quando persino le tombe sono distrutte, la poesia interroga le rovine e restituisce voce ai vinti: Ettore sopravvive nel canto."
      }
    ]
  },
  {
    id: "grazie",
    filter: "grazie",
    kind: "Carme incompiuto",
    title: "Le Grazie",
    date: "1803–1822",
    description: "Tre nuclei dell’Inno primo mostrano l’arte poetica, l’umanità ferina e l’opera civilizzatrice delle Grazie.",
    themes: ["illusioni", "natura", "poesia", "memoria"],
    edition: "Estratti dall’Inno primo nella ricostruzione Orlandini 1856, usata come testimone storico consultabile.",
    philology: "Le Grazie non raggiunsero una sistemazione definitiva. I numeri di verso dipendono dalla ricostruzione editoriale e non descrivono un testo finale voluto dall’autore.",
    source: "https://it.wikisource.org/wiki/Le_Grazie_(1856)/Inno_primo",
    sourceLabel: "Wikisource — ricostruzione Orlandini 1856",
    lessonIds: ["immagine-del-mondo", "poetica", "opere"],
    passages: [
      {
        id: "inno-i-vv1-25",
        label: "Inno I, vv. 1–25",
        title: "La poesia che crea",
        format: "verse",
        start: 1,
        lines: [
          "Cantando, o Grazie, degli eterei pregi",
          "di che il cielo v’adorna, e della gioja",
          "che, vereconde, voi date alla terra,",
          "belle vergini! a voi chieggio l’arcana",
          "armonïosa melodia pittrice",
          "della vostra beltà, sì che all’Italia",
          "afflitta di regali ire straniere",
          "voli improvviso, a rallegrarla, il carme.",
          "Nella convalle fra gli aerei poggi",
          "di Bellosguardo, ov’io, cinta d’un fonte",
          "limpido, fra le queto ombre di mille",
          "giovinetti cipressi, alle tre Dive",
          "l’ara innalzo (e un fatidico laureto,",
          "in cui men verde serpeggia la vite,",
          "la protegge di tempio), al vago rito",
          "vieni, o Canova, e agl’Inni. Al cor men fece",
          "dono la bella Dea che tu sacrasti",
          "qui sull’Arno alle belle Arti custode;",
          "ed ella d’immortal lume e d’ambrosia",
          "la santa imago sua tutta precinse.",
          "Forse (o ch’io spero!) artefice di Numi,",
          "nuovo meco darai spirto alle Grazie",
          "ch’or di tua mano escon del marmo. Anch’io",
          "pingo e spiro a’ fantasmi anima eterna:",
          "sdegno il verso che suona e che non crea;"
        ],
        note: "Canova scolpisce il marmo, Foscolo anima i fantasmi con la parola: la bellezza è un’azione civilizzatrice, non un ornamento."
      },
      {
        id: "inno-i-vv107-149",
        label: "Inno I, vv. 107–149",
        title: "L’umanità ferina depone l’arco",
        format: "verse",
        start: 107,
        lines: [
          "Ma da’ Celesti rimanea negletto",
          "il picciol globo della Terra; e, nati",
          "alle prede i suoi figli ed alla guerra,",
          "e dopo breve dì sacri alla morte,",
          "vagavan tutti colle belve all’ombra",
          "della gran selva della terra: e gli antri",
          "eran tetto, e i sepolcri erano altari;",
          "e col sangue di vergini innocenti",
          "placavan l’aspre Deità d’Averno,",
          "alle menti atterrite unico Nume. —",
          "Non prieghi d’inni o danze d’imenei,",
          "ma di veltri perpetuo ululato",
          "tutta l’isola udia, quindi; e di dardi",
          "correa dagli archi un suon lungo sull’aure,",
          "e il provocate fremito di belve",
          "minaccianti, e degli uomini la pugna",
          "sulle membra del vinto orso rissosi,",
          "e de’ piagati cacciatori il grido.",
          "Cerere invan donato avea l’aratro",
          "a que’ feroci: invan d’oltre l’Eufrate",
          "chiamò un dì Bassarèo giovine Dio",
          "a ingentilir di pampini le balze.",
          "Il pio strumento irrugginia su’ brevi",
          "solchi, deserto; divorata, innanzi",
          "che i grappoli novelli imporporasse",
          "a’ rai d’autunno, era la vite. E quando",
          "ripassò col suo coro il giovin Dio,",
          "il fremir delle tigri, all’immortale",
          "cocchio ministre, que’ feroci a nuova",
          "rabbia di guerra concitava. Solo",
          "quando apparian le Grazie, i cacciatori,",
          "e le donne, e le vergini, e i fanciulli",
          "l’arco e ’l terror deponeano, ammirando.",
          "L’una tosto alla madre col gemmato",
          "pettine asterge mollemente e intreccia",
          "le chiome di marina onda stillanti;",
          "l’altra sorella a’ Zeffiri consegna,",
          "a rifiorirle i prati a primavera,",
          "l’ambrosio umore ond’è irrorato il seno",
          "della figlia di Giove; vereconda",
          "la terza ancella ricompone il peplo",
          "sulle membra divine, e le contende",
          "di que’ Selvaggi attoniti al desio."
        ],
        note: "Il gesto decisivo è «deponeano»: la bellezza sospende l’istinto di preda e apre uno spazio umano condiviso."
      },
      {
        id: "inno-i-vv191-205",
        label: "Inno I, vv. 191–205",
        title: "Are, colture e città",
        format: "verse",
        start: 191,
        lines: [
          "Lieta allor fia, pari alla Grecia, innanzi",
          "che onnipossente il Fato ogni felice",
          "vostro favor le invidïasse. — Or mentre",
          "procedeano le Grazie, il doloroso",
          "premio de’ lor vicini arti più miti",
          "persuase a’ Laconi. E dove in prima",
          "di burroni infecondo e di fumanti",
          "spelonche aperte da Vulcano, e ignoto",
          "per lo mare intentato era quel regno,",
          "al venir delle Dee fu pieno d’are",
          "ospitali, e di cólti, e di beate",
          "città: vide le pompe, e le amorose",
          "gare, e i regj conviti; e d’ogni parte",
          "correan d’Asia i guerrieri e i prenci argivi",
          "alla reggia di Leda."
        ],
        note: "La civiltà si misura in ospitalità, colture, città e riti: il mito traduce in immagini il passaggio dalla ferinità alla convivenza."
      }
    ]
  },
  {
    id: "bonaparte",
    filter: "politici",
    kind: "Ode e dedica politica",
    title: "Bonaparte liberatore",
    date: "1797; ristampa 1799",
    description: "Dossier di confronto fra l’entusiasmo giovanile per il liberatore e il successivo disinganno politico.",
    themes: ["patria", "illusioni"],
    edition: "Scheda di orientamento: il testo digitale completo è raggiungibile dalla fonte. L’opera è un presupposto plausibile delle lezioni, non un richiamo testuale certo.",
    philology: "Non va presentata come testo già citato nel percorso. È un approfondimento utile per misurare la trasformazione del giudizio su Napoleone.",
    source: "https://it.wikisource.org/wiki/Bonaparte_liberatore,_oda",
    sourceLabel: "Wikisource — Bonaparte liberatore",
    lessonIds: ["introduzione", "fratture"],
    passages: [
      {
        id: "guida-al-confronto",
        label: "Dossier",
        title: "Dal liberatore al disinganno",
        format: "editorial",
        paragraphs: [
          "Confronta l’ode del 1797 con la dedica della ristampa successiva e con la lettera dell’Ortis dell’11 ottobre. Il punto non è cercare una conversione lineare, ma osservare la tensione fra energia rivoluzionaria, dominio militare e libertà italiana.",
          "Questa scheda non sostituisce il testo: usa il collegamento alla fonte per leggerlo integralmente."
        ],
        note: "Approfondimento editoriale, non citazione foscoliana presente nelle lezioni."
      }
    ]
  }
];

const themes = [
  {
    id: "patria",
    label: "Patria",
    symbol: "⌂",
    description: "Da Zacinto alla patria venduta: luogo d’origine, comunità politica e memoria da consegnare ai posteri."
  },
  {
    id: "esilio",
    label: "Esilio",
    symbol: "⚓",
    description: "Il ritorno negato separa Foscolo da Ulisse e trasforma lo spazio perduto in canto."
  },
  {
    id: "illusioni",
    label: "Illusioni",
    symbol: "✦",
    description: "Valori costruiti dagli uomini — affetti, patria, gloria e bellezza — che non negano il nulla ma difendono la dignità."
  },
  {
    id: "sepolcri",
    label: "Sepolcri",
    symbol: "▥",
    description: "La tomba non rende immortale la materia: crea una relazione fra vivi, morti e comunità."
  },
  {
    id: "memoria",
    label: "Memoria",
    symbol: "◉",
    description: "La sopravvivenza possibile è affidata agli affetti, ai monumenti e soprattutto alla parola poetica."
  },
  {
    id: "natura",
    label: "Natura",
    symbol: "♧",
    description: "Paesaggio, materia e bellezza: la natura non garantisce un senso, ma offre immagini che la poesia trasforma."
  },
  {
    id: "poesia",
    label: "Poesia",
    symbol: "♬",
    description: "Quando il tempo cancella persino le tombe, il canto interroga le rovine e vince il silenzio."
  }
];

const timeline = [
  {
    year: "1778",
    title: "Nasce a Zacinto",
    description: "L’isola greca diventerà origine perduta, madre e mito.",
    work: "a-zacinto",
    passage: "testo-integrale"
  },
  {
    year: "1797",
    title: "Campoformio",
    description: "La cessione di Venezia incrina l’immagine di Napoleone liberatore.",
    work: "ortis",
    passage: "11-ottobre-1797"
  },
  {
    year: "1802",
    title: "L’Ortis",
    description: "La forma epistolare unisce fallimento privato e rovina politica.",
    work: "ortis",
    passage: "milano-4-dicembre"
  },
  {
    year: "1803",
    title: "Poesie",
    description: "I tre sonetti costruiscono una costellazione di morte, esilio e affetti.",
    work: "alla-sera",
    passage: "testo-integrale"
  },
  {
    year: "1807",
    title: "Dei Sepolcri",
    description: "Il carme porta la memoria dalla famiglia alla nazione e al mito.",
    work: "sepolcri",
    passage: "vv151-185"
  },
  {
    year: "1812–13",
    title: "Le Grazie",
    description: "A Firenze prende forma il progetto dell’arte che civilizza.",
    work: "grazie",
    passage: "inno-i-vv107-149"
  }
];

const documents = [
  {
    label: "Documento storico",
    title: "Trattato di Campoformio",
    description: "17 ottobre 1797. Per le lezioni interessano gli articoli sulla cessione di Venezia e dei territori veneti all’Austria.",
    linkLabel: "Inquadramento Treccani",
    href: "https://www.treccani.it/enciclopedia/trattato-di-campoformio/"
  },
  {
    label: "Normativa funeraria",
    title: "Saint-Cloud e l’applicazione italiana",
    description: "Il decreto francese del 1804 e l’estensione italiana del 1806 vanno distinti: non sono un unico “editto” indistinto.",
    linkLabel: "Percorso ICCU sui Sepolcri",
    href: "https://www.internetculturale.it/directories/ViaggiNelTesto/foscolo/b20.html"
  },
  {
    label: "Intertesto antico",
    title: "Odissea: il ritorno di Ulisse",
    description: "Il nostos dei libri V–XIII, soprattutto l’arrivo a Itaca, chiarisce per contrasto il destino dell’esule in A Zacinto.",
    linkLabel: "Apri A Zacinto",
    work: "a-zacinto",
    passage: "testo-integrale"
  }
];

const filters = [
  ["tutti", "Tutti"],
  ["ortis", "Ortis"],
  ["sonetti", "Sonetti"],
  ["sepolcri", "Dei Sepolcri"],
  ["grazie", "Le Grazie"],
  ["politici", "Scritti politici"]
];

const state = {
  filter: "tutti",
  query: "",
  activeWork: null,
  deferredInstall: null,
  notes: readStorage("foscolo-notes", {}),
  favorites: readStorage("foscolo-favorites", []),
  readerSize: Number(localStorage.getItem("foscolo-reader-size")) || 1.08
};

const els = {
  filters: document.querySelector("[data-filters]"),
  worksGrid: document.querySelector("[data-works-grid]"),
  search: document.querySelector("[data-search]"),
  resultsStatus: document.querySelector("[data-results-status]"),
  themes: document.querySelector("[data-themes]"),
  themeResult: document.querySelector("[data-theme-result]"),
  themeTitle: document.querySelector("[data-theme-title]"),
  themeDescription: document.querySelector("[data-theme-description]"),
  themeLinks: document.querySelector("[data-theme-links]"),
  timeline: document.querySelector("[data-timeline]"),
  lessons: document.querySelector("[data-lessons]"),
  documents: document.querySelector("[data-documents]"),
  reader: document.querySelector("[data-reader]"),
  readerTitle: document.querySelector("[data-reader-title]"),
  readerKind: document.querySelector("[data-reader-kind]"),
  readerMeta: document.querySelector("[data-reader-meta]"),
  readerDescription: document.querySelector("[data-reader-description]"),
  readerIndex: document.querySelector("[data-reader-index]"),
  readerPassages: document.querySelector("[data-reader-passages]"),
  readerEdition: document.querySelector("[data-reader-edition]"),
  readerSource: document.querySelector("[data-reader-source]"),
  readerNote: document.querySelector("[data-reader-note]"),
  readerLessons: document.querySelector("[data-reader-lessons]"),
  favorite: document.querySelector("[data-favorite]"),
  notesDialog: document.querySelector("[data-notes-dialog]"),
  notesList: document.querySelector("[data-notes-list]"),
  noteCount: document.querySelector("[data-note-count]"),
  install: document.querySelector("[data-install]"),
  offline: document.querySelector("[data-offline-status]"),
  menuToggle: document.querySelector(".menu-toggle"),
  mainNav: document.querySelector(".main-nav")
};

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // La consultazione resta possibile anche quando lo storage è disabilitato.
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function passageText(passage) {
  return passage.lines?.join(" ") || passage.paragraphs?.join(" ") || "";
}

function getLesson(id) {
  return lessons.find(lesson => lesson.id === id);
}

function renderFilters() {
  els.filters.innerHTML = filters.map(([id, label]) => `
    <button class="filter-chip" type="button" data-filter="${id}" aria-pressed="${state.filter === id}">
      ${label}
    </button>
  `).join("");
}

function matchingWorks() {
  const query = normalize(state.query.trim());
  return works.filter(work => {
    const filterMatch = state.filter === "tutti" || work.filter === state.filter;
    if (!filterMatch) return false;
    if (!query) return true;
    const haystack = normalize([
      work.title,
      work.kind,
      work.description,
      work.themes.join(" "),
      ...work.passages.map(passage => `${passage.title} ${passageText(passage)}`)
    ].join(" "));
    return haystack.includes(query);
  });
}

function renderWorks() {
  const matches = matchingWorks();
  els.resultsStatus.textContent = `${matches.length} ${matches.length === 1 ? "scheda trovata" : "schede trovate"}`;
  if (!matches.length) {
    els.worksGrid.innerHTML = `<div class="empty-state">Nessun testo corrisponde alla ricerca. Prova un titolo, un tema o una parola del passo.</div>`;
    return;
  }

  els.worksGrid.innerHTML = matches.map(work => `
    <article class="work-card" data-favorite="${state.favorites.includes(work.id)}">
      <p class="work-type">${escapeHtml(work.kind)}</p>
      <h3>${escapeHtml(work.title)}</h3>
      <p class="work-date">${escapeHtml(work.date)}</p>
      <p class="work-description">${escapeHtml(work.description)}</p>
      <div class="tag-row">
        ${work.themes.map(theme => `<span class="tag">${escapeHtml(themes.find(item => item.id === theme)?.label || theme)}</span>`).join("")}
      </div>
      <button class="work-action" type="button" data-open-work="${work.id}">
        <span>${work.filter === "politici" ? "Apri il dossier" : `Leggi ${work.passages.length === 1 ? "il testo" : "i passi"}`}</span>
        <span aria-hidden="true">→</span>
      </button>
    </article>
  `).join("");
}

function renderThemes() {
  els.themes.innerHTML = themes.map(theme => `
    <button class="theme-button" type="button" data-theme="${theme.id}" aria-pressed="false">
      <span class="theme-symbol" aria-hidden="true">${theme.symbol}</span>
      <span class="theme-name">${theme.label}</span>
    </button>
  `).join("");
}

function showTheme(themeId) {
  const theme = themes.find(item => item.id === themeId);
  if (!theme) return;
  document.querySelectorAll("[data-theme]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.theme === themeId));
  });
  const matches = works.filter(work => work.themes.includes(themeId));
  els.themeTitle.textContent = theme.label;
  els.themeDescription.textContent = theme.description;
  els.themeLinks.innerHTML = matches.map(work => `
    <a class="theme-link" href="#testo/${work.id}/${work.passages[0].id}">
      <span>${escapeHtml(work.title)}</span><span aria-hidden="true">→</span>
    </a>
  `).join("");
  els.themeResult.hidden = false;
  els.themeResult.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function renderTimeline() {
  els.timeline.innerHTML = timeline.map(item => `
    <li class="timeline-item">
      <span class="timeline-year">${escapeHtml(item.year)}</span>
      <div class="timeline-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <button type="button" data-open-work="${item.work}" data-passage="${item.passage}">Apri il testo</button>
      </div>
    </li>
  `).join("");
}

function renderLessons() {
  els.lessons.innerHTML = lessons.map(lesson => `
    <article class="lesson-card">
      <h3>${escapeHtml(lesson.title)}</h3>
      <p>${escapeHtml(lesson.description)}</p>
      <a href="${lesson.href}" data-lesson-link="${lesson.id}">Vai alla lezione <span aria-hidden="true">→</span></a>
    </article>
  `).join("");
}

function renderDocuments() {
  els.documents.innerHTML = documents.map(documentItem => `
    <article class="document-card">
      <p class="document-label">${escapeHtml(documentItem.label)}</p>
      <h3>${escapeHtml(documentItem.title)}</h3>
      <p>${escapeHtml(documentItem.description)}</p>
      ${documentItem.work
        ? `<a href="#testo/${documentItem.work}/${documentItem.passage}">${escapeHtml(documentItem.linkLabel)} <span aria-hidden="true">→</span></a>`
        : `<a href="${documentItem.href}" target="_blank" rel="noopener">${escapeHtml(documentItem.linkLabel)} <span aria-hidden="true">↗</span></a>`
      }
    </article>
  `).join("");
}

function renderPassage(work, passage) {
  const noteKey = `${work.id}:${passage.id}`;
  const noteValue = state.notes[noteKey]?.text || "";
  let body = "";

  if (passage.format === "verse") {
    body = `<div class="original-text verse">` + passage.lines.map((line, index) => {
      const number = (passage.start || 1) + index;
      return `
        <div class="verse-line">
          <span class="line-number">${number % 5 === 0 || index === 0 ? number : ""}</span>
          <span>${escapeHtml(line)}</span>
        </div>
      `;
    }).join("") + `</div>`;
  } else {
    const className = passage.format === "editorial" ? "original-text prose editorial-text" : "original-text prose";
    body = `<div class="${className}">${passage.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>`;
  }

  return `
    <section class="passage" id="${passage.id}" data-passage-section="${passage.id}">
      <header class="passage-header">
        <div>
          <p class="passage-label">${escapeHtml(passage.label)}</p>
          <h3>${escapeHtml(passage.title)}</h3>
        </div>
        <button class="passage-copy" type="button" data-copy-passage="${passage.id}">Copia</button>
      </header>
      ${body}
      <p class="passage-note"><strong>Chiave di lettura:</strong> ${escapeHtml(passage.note)}</p>
      <details class="note-editor"${noteValue ? " open" : ""}>
        <summary>${noteValue ? "Modifica il tuo appunto" : "Aggiungi un appunto"}</summary>
        <label>
          <span class="sr-only">Appunto su ${escapeHtml(passage.title)}</span>
          <textarea data-note-input="${noteKey}" placeholder="Scrivi qui…">${escapeHtml(noteValue)}</textarea>
        </label>
        <button class="note-save" type="button" data-save-note="${noteKey}">Salva l’appunto</button>
      </details>
    </section>
  `;
}

function openWork(workId, passageId, updateHash = true) {
  const work = works.find(item => item.id === workId);
  if (!work) return;
  const targetPassage = work.passages.find(item => item.id === passageId) || work.passages[0];
  state.activeWork = work;

  els.readerKind.textContent = work.kind;
  els.readerTitle.textContent = work.title;
  els.readerMeta.textContent = work.date;
  els.readerDescription.textContent = work.description;
  els.readerEdition.textContent = work.edition;
  els.readerNote.textContent = work.philology;
  els.readerSource.href = work.source;
  els.readerSource.textContent = `${work.sourceLabel} ↗`;
  els.readerIndex.innerHTML = work.passages.map(passage => `
    <a href="#testo/${work.id}/${passage.id}" data-reader-index-link="${passage.id}">
      ${escapeHtml(passage.label)}
    </a>
  `).join("");
  els.readerPassages.innerHTML = work.passages.map(passage => renderPassage(work, passage)).join("");
  els.readerLessons.innerHTML = work.lessonIds.map(getLesson).filter(Boolean).map(lesson => `
    <a href="${lesson.href}?from=biblioteca&work=${work.id}&passage=${targetPassage.id}">
      ${escapeHtml(lesson.title)} ↗
    </a>
  `).join("");

  const favorite = state.favorites.includes(work.id);
  els.favorite.setAttribute("aria-pressed", String(favorite));
  els.favorite.textContent = `${favorite ? "★" : "☆"} ${favorite ? "Preferito" : "Aggiungi ai preferiti"}`;
  document.documentElement.style.setProperty("--reader-size", `${state.readerSize}rem`);

  if (!els.reader.open) els.reader.showModal();
  document.body.classList.add("dialog-open");

  if (updateHash) {
    sessionStorage.setItem("foscolo-return-hash", location.hash.startsWith("#testo/") ? "#opere" : location.hash || "#opere");
    history.pushState({ reader: true }, "", `#testo/${work.id}/${targetPassage.id}`);
  }

  requestAnimationFrame(() => {
    document.querySelectorAll("[data-passage-section]").forEach(section => section.classList.remove("is-target"));
    document.querySelectorAll("[data-reader-index-link]").forEach(link => {
      link.setAttribute("aria-current", String(link.dataset.readerIndexLink === targetPassage.id));
    });
    const target = document.getElementById(targetPassage.id);
    if (target) {
      target.classList.add("is-target");
      target.scrollIntoView({ block: "start" });
    }
    els.reader.querySelector("[data-reader-close]")?.focus({ preventScroll: true });
  });
}

function closeReader(updateHash = true) {
  if (els.reader.open) els.reader.close();
  state.activeWork = null;
  document.body.classList.remove("dialog-open");
  if (updateHash && location.hash.startsWith("#testo/")) {
    const returnHash = sessionStorage.getItem("foscolo-return-hash") || "#opere";
    history.pushState({}, "", returnHash);
  }
}

function routeFromHash() {
  const match = location.hash.match(/^#testo\/([^/]+)\/([^/]+)/);
  if (match) {
    openWork(decodeURIComponent(match[1]), decodeURIComponent(match[2]), false);
  } else if (els.reader.open) {
    closeReader(false);
  }
}

function saveNote(key) {
  const input = document.querySelector(`[data-note-input="${CSS.escape(key)}"]`);
  if (!input || !state.activeWork) return;
  const [workId, passageId] = key.split(":");
  const work = works.find(item => item.id === workId);
  const passage = work?.passages.find(item => item.id === passageId);
  const text = input.value.trim();
  if (text) {
    state.notes[key] = {
      text,
      workTitle: work?.title || workId,
      passageTitle: passage?.title || passageId,
      updated: new Date().toISOString()
    };
  } else {
    delete state.notes[key];
  }
  writeStorage("foscolo-notes", state.notes);
  updateNoteCount();
  const button = document.querySelector(`[data-save-note="${CSS.escape(key)}"]`);
  if (button) {
    const old = button.textContent;
    button.textContent = "Salvato";
    window.setTimeout(() => { button.textContent = old; }, 1200);
  }
}

function updateNoteCount() {
  els.noteCount.textContent = Object.keys(state.notes).length;
}

function showNotes() {
  const entries = Object.entries(state.notes).sort(([, a], [, b]) => b.updated.localeCompare(a.updated));
  els.notesList.innerHTML = entries.length ? entries.map(([key, note]) => `
    <article class="saved-note">
      <h3>${escapeHtml(note.workTitle)} · ${escapeHtml(note.passageTitle)}</h3>
      <p>${escapeHtml(note.text)}</p>
      <a href="#testo/${key.replace(":", "/")}">Riapri il passo</a>
    </article>
  `).join("") : `<p class="empty-state">Non hai ancora scritto appunti.</p>`;
  els.notesDialog.showModal();
}

function exportNotes() {
  const entries = Object.values(state.notes);
  const content = entries.length
    ? entries.map(note => `${note.workTitle} — ${note.passageTitle}\n${note.text}`).join("\n\n---\n\n")
    : "Nessun appunto salvato.";
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "appunti-biblioteca-foscolo.txt";
  anchor.click();
  URL.revokeObjectURL(url);
}

function toggleFavorite() {
  if (!state.activeWork) return;
  const id = state.activeWork.id;
  state.favorites = state.favorites.includes(id)
    ? state.favorites.filter(item => item !== id)
    : [...state.favorites, id];
  writeStorage("foscolo-favorites", state.favorites);
  const favorite = state.favorites.includes(id);
  els.favorite.setAttribute("aria-pressed", String(favorite));
  els.favorite.textContent = `${favorite ? "★" : "☆"} ${favorite ? "Preferito" : "Aggiungi ai preferiti"}`;
  renderWorks();
}

async function copyPassage(passageId) {
  if (!state.activeWork) return;
  const passage = state.activeWork.passages.find(item => item.id === passageId);
  if (!passage) return;
  const text = passage.format === "verse"
    ? passage.lines.join("\n")
    : passage.paragraphs.join("\n\n");
  try {
    await navigator.clipboard.writeText(text);
    const button = document.querySelector(`[data-copy-passage="${CSS.escape(passageId)}"]`);
    if (button) {
      const old = button.textContent;
      button.textContent = "Copiato";
      window.setTimeout(() => { button.textContent = old; }, 1200);
    }
  } catch {
    // Il testo resta selezionabile anche se Clipboard API non è disponibile.
  }
}

function updateOfflineStatus() {
  els.offline.hidden = navigator.onLine;
}

function setFilter(filter) {
  state.filter = filters.some(([id]) => id === filter) ? filter : "tutti";
  renderFilters();
  renderWorks();
}

function setupEvents() {
  document.addEventListener("click", event => {
    const openButton = event.target.closest("[data-open-work]");
    if (openButton) {
      openWork(openButton.dataset.openWork, openButton.dataset.passage);
      return;
    }

    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) {
      setFilter(filterButton.dataset.filter);
      return;
    }

    const themeButton = event.target.closest("[data-theme]");
    if (themeButton) {
      showTheme(themeButton.dataset.theme);
      return;
    }

    const filterLink = event.target.closest("[data-filter-link]");
    if (filterLink) {
      setFilter(filterLink.dataset.filterLink);
      window.setTimeout(() => document.getElementById("opere")?.scrollIntoView(), 0);
      return;
    }

    const copyButton = event.target.closest("[data-copy-passage]");
    if (copyButton) {
      copyPassage(copyButton.dataset.copyPassage);
      return;
    }

    const noteButton = event.target.closest("[data-save-note]");
    if (noteButton) {
      saveNote(noteButton.dataset.saveNote);
      return;
    }

    if (event.target.closest("[data-random-text]")) {
      const work = works[Math.floor(Math.random() * works.length)];
      const passage = work.passages[Math.floor(Math.random() * work.passages.length)];
      openWork(work.id, passage.id);
    }
  });

  els.search.addEventListener("input", () => {
    state.query = els.search.value;
    renderWorks();
  });

  document.querySelector("[data-reader-close]").addEventListener("click", () => closeReader());
  els.reader.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (location.hash.startsWith("#testo/")) closeReader(true);
  });
  els.favorite.addEventListener("click", toggleFavorite);
  document.querySelector("[data-font-increase]").addEventListener("click", () => {
    state.readerSize = Math.min(1.6, state.readerSize + 0.1);
    localStorage.setItem("foscolo-reader-size", state.readerSize);
    document.documentElement.style.setProperty("--reader-size", `${state.readerSize}rem`);
  });
  document.querySelector("[data-font-decrease]").addEventListener("click", () => {
    state.readerSize = Math.max(0.9, state.readerSize - 0.1);
    localStorage.setItem("foscolo-reader-size", state.readerSize);
    document.documentElement.style.setProperty("--reader-size", `${state.readerSize}rem`);
  });

  document.querySelectorAll("[data-open-notes]").forEach(button => button.addEventListener("click", showNotes));
  document.querySelector("[data-close-notes]").addEventListener("click", () => els.notesDialog.close());
  document.querySelector("[data-export-notes]").addEventListener("click", exportNotes);

  els.menuToggle.addEventListener("click", () => {
    const open = !els.mainNav.classList.contains("is-open");
    els.mainNav.classList.toggle("is-open", open);
    els.menuToggle.setAttribute("aria-expanded", String(open));
  });
  els.mainNav.addEventListener("click", event => {
    if (event.target.closest("a")) {
      els.mainNav.classList.remove("is-open");
      els.menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("hashchange", routeFromHash);
  window.addEventListener("online", updateOfflineStatus);
  window.addEventListener("offline", updateOfflineStatus);

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    state.deferredInstall = event;
    els.install.hidden = false;
  });
  els.install.addEventListener("click", async () => {
    if (!state.deferredInstall) return;
    state.deferredInstall.prompt();
    await state.deferredInstall.userChoice;
    state.deferredInstall = null;
    els.install.hidden = true;
  });
}

function setupSectionObserver() {
  const links = [...document.querySelectorAll(".main-nav a[href^='#']")];
  const sections = links
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(link => {
      link.setAttribute("aria-current", String(link.getAttribute("href") === `#${visible.target.id}`));
    });
  }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.2, 0.6] });
  sections.forEach(section => observer.observe(section));
}

function init() {
  renderFilters();
  renderWorks();
  renderThemes();
  renderTimeline();
  renderLessons();
  renderDocuments();
  updateNoteCount();
  updateOfflineStatus();
  setupEvents();
  setupSectionObserver();
  routeFromHash();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
  }
}

init();
