(() => {
  "use strict";

  if (document.body.dataset.page !== "lesson") return;

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const lessonId = document.body.dataset.lesson;
  const root = document.body.dataset.root || "../";
  const storageKey = name => `foscolo-study-v10-${name}`;
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
  const normalizeText = value => String(value).replace(/\s+/g, " ").trim();
  const normalizeKey = value => String(value)
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const safeGet = (name, fallback) => {
    try {
      const value = localStorage.getItem(storageKey(name));
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const safeSet = (name, value) => {
    try {
      localStorage.setItem(storageKey(name), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };

  const LESSON_META = {
    introduzione: { number: "01", title: "Introduzione politica e filosofica", href: "introduzione.html" },
    fratture: { number: "02", title: "Le fratture biografiche", href: "fratture.html" },
    "immagine-del-mondo": { number: "03", title: "L’immagine del mondo", href: "immagine-del-mondo.html" },
    poetica: { number: "04", title: "La poetica", href: "poetica.html" },
    opere: { number: "05", title: "Le opere principali", href: "opere.html" },
    conclusione: { number: "06", title: "Conclusione generale", href: "conclusione.html" },
    "ortis-parini": { number: "A", title: "Ortis: l’incontro con Parini", href: "ortis-parini.html", deepening: true },
    "alla-sera": { number: "B", title: "Alla sera", href: "alla-sera.html", deepening: true }
  };

  const EXTRA_STUDY_DATA = {
    introduzione: {
      summary: "Foscolo nasce dentro una trasformazione storica che rende instabili tutte le certezze ricevute. La Rivoluzione francese accende la speranza di libertà e cittadinanza; Napoleone sembra incarnarla, ma il trattato di Campoformio del 1797 consegna Venezia all’Austria e trasforma l’entusiasmo politico in una ferita personale. Sul piano filosofico, il materialismo e il meccanicismo spiegano l’universo come materia regolata da cause fisiche: liberano dalla superstizione, ma non garantiscono né immortalità né significato. Da questa doppia crisi nasce il problema centrale di Foscolo. La ragione gli mostra il nulla, mentre il bisogno umano di amore, patria, memoria e bellezza continua a chiedere senso. La poesia diventa allora una forma di resistenza: non dimostra un aldilà, ma costruisce un’eternità simbolica. Per questo Foscolo è un autore di soglia, ancora illuminista nella visione laica e già vicino al Romanticismo per la centralità dell’io ferito, dell’esilio e del bisogno di assoluto.",
      vocabulary: [
        ["Cittadinanza", "Condizione politica moderna fondata su diritti e partecipazione, opposta ai privilegi di nascita."],
        ["Eternità simbolica", "Sopravvivenza affidata alla memoria, agli affetti e alla poesia, non a un aldilà dimostrato."]
      ],
      quiz: [
        {
          question: "Quale terza strada cerca Foscolo fra fede tradizionale e accettazione passiva del nulla?",
          options: ["Ignorare il problema della morte.", "Restaurare l’Antico Regime.", "Costruire un’eternità simbolica mediante memoria e poesia."],
          answer: 2,
          recovery: "Foscolo non torna a una certezza religiosa e non considera sufficiente il puro nulla: affida a memoria, affetti, patria, bellezza e poesia una sopravvivenza simbolica.",
          recoveryQuestion: "Quali strumenti umani sostituiscono la garanzia religiosa?",
          anchor: "4-perche-questo-serve-per-capire-foscolo"
        },
        {
          question: "Perché Foscolo può essere definito un autore di passaggio?",
          options: ["Perché rifiuta sia Illuminismo sia Romanticismo.", "Perché scrive esclusivamente opere politiche.", "Perché unisce una visione laica illuministica alla centralità moderna dell’io ferito."],
          answer: 2,
          recovery: "La sua formazione materialistica appartiene all’Illuminismo; esilio, nostalgia, conflitto interiore e bisogno di assoluto anticipano invece temi romantici.",
          recoveryQuestion: "Quale elemento appartiene all’eredità illuministica e quale anticipa il Romanticismo?",
          anchor: "4-perche-questo-serve-per-capire-foscolo"
        }
      ]
    },
    fratture: {
      summary: "Le fratture biografiche di Foscolo non costituiscono un semplice elenco di eventi: rendono intelligibile la tensione costante della sua scrittura. Zante diventa l’origine perduta, insieme terra materna, Grecia mitica e luogo al quale il poeta sa di non poter tornare. Campoformio spezza la fiducia politica: Napoleone resta una figura doppia, ammirata per l’energia rivoluzionaria e condannata per il sacrificio di Venezia. La morte del fratello Giovanni trasforma il lutto familiare in esperienza dell’assenza e del colloquio impossibile. Infine l’esilio, scelto nel 1815 per non giurare fedeltà agli Austriaci, rende permanente la distanza da patria, madre e sepoltura familiare. Questi eventi non producono automaticamente le opere, ma offrono il contesto per comprenderne i nuclei: origine, patria, memoria, tomba e poesia. Foscolo risponde alla dispersione costruendo legami simbolici. Ciò che la storia e la morte separano può continuare a vivere nella parola e nel ricordo dei vivi.",
      vocabulary: [
        ["Patria", "Comunità politica e affettiva desiderata, ma storicamente negata o tradita."],
        ["Disinganno", "Caduta di una speranza ideale davanti alla realtà, soprattutto dopo Campoformio."]
      ],
      quiz: [
        {
          question: "Quale evento familiare approfondisce in Foscolo il tema del colloquio con i morti?",
          options: ["La morte del fratello Giovanni.", "La nascita a Zante.", "Il trasferimento a Milano."],
          answer: 0,
          recovery: "Il suicidio del fratello Giovanni rende il lutto una frattura decisiva e confluisce nel sonetto In morte del fratello Giovanni, dominato da distanza, madre e tomba.",
          recoveryQuestion: "Quali tre legami vengono riuniti simbolicamente nel sonetto?",
          anchor: "fratello-giovanni"
        },
        {
          question: "Perché l’esilio del 1815 ha anche un valore morale?",
          options: ["Perché garantisce a Foscolo una carriera diplomatica.", "Perché gli permette di tornare stabilmente a Zante.", "Perché nasce dal rifiuto di giurare fedeltà al potere austriaco."],
          answer: 2,
          recovery: "Nel 1815 Foscolo sceglie l’esilio invece di collaborare con il nuovo dominio austriaco: la lontananza diventa prezzo della coerenza politica.",
          recoveryQuestion: "Quale scelta collega esilio e coerenza?",
          anchor: "esilio"
        }
      ]
    },
    "immagine-del-mondo": {
      summary: "L’immagine del mondo foscoliana nasce da una contraddizione che non viene risolta. Il materialismo conduce all’idea del nulla eterno: dopo la morte l’individuo non continua a sentire e nessuna Provvidenza garantisce un significato universale. Tuttavia l’uomo non può vivere ridotto a puro meccanismo naturale. Per questo Foscolo chiama illusioni l’amore, la patria, la bellezza, la memoria e la poesia. Non sono menzogne ingenue, perché egli ne conosce la fragilità; sono costruzioni umane capaci di rendere la vita degna, di unire le generazioni e di opporre memoria all’oblio. La tomba, quindi, non serve materialmente al morto, ma ai vivi: custodisce la corrispondenza degli affetti e può trasformare il ricordo individuale in energia civile. Si può parlare di religione laica delle illusioni perché questi valori svolgono funzioni consolatrici e comunitarie senza dipendere dalla fede nell’aldilà. La poesia non cancella il nulla: crea un rapporto umano che continua oltre la scomparsa fisica.",
      vocabulary: [
        ["Memoria civile", "Ricordo condiviso che trasmette esempi, valori e identità a una comunità."],
        ["Corrispondenza d’amorosi sensi", "Legame affettivo fra vivi e morti custodito dal ricordo e dalla tomba."]
      ],
      quiz: [
        {
          question: "In quale senso la poesia contrasta il nulla senza negarlo?",
          options: ["Dimostra scientificamente l’immortalità dell’anima.", "Promette una resurrezione fisica.", "Conserva persone e valori nella memoria dei vivi."],
          answer: 2,
          recovery: "La poesia non modifica il destino materiale dell’individuo; rende però possibile una durata simbolica nella memoria affettiva e civile.",
          recoveryQuestion: "Quale forma di sopravvivenza può offrire la parola poetica?",
          anchor: "religione-illusioni"
        },
        {
          question: "Che rapporto esiste fra consapevolezza e illusioni?",
          options: ["Le illusioni restano necessarie proprio perché Foscolo ne conosce la fragilità.", "Le illusioni funzionano solo se scambiate per prove scientifiche.", "La consapevolezza obbliga a eliminarle tutte."],
          answer: 0,
          recovery: "Foscolo non crede ingenuamente alle illusioni: sa che sono costruzioni umane e, proprio per questo, ne assume la responsabilità.",
          recoveryQuestion: "Perché consapevolezza e bisogno di illusioni non si escludono?",
          anchor: "religione-illusioni"
        }
      ]
    },
    poetica: {
      summary: "La poetica di Foscolo unisce due spinte che non devono essere separate meccanicamente. Dal Neoclassicismo derivano la ricerca di armonia, la misura formale, il mito greco e la bellezza ideale. Dal clima preromantico provengono invece l’io inquieto, la notte, la morte, l’esilio, la nostalgia e il conflitto fra desiderio e realtà. La forma classica non è un rivestimento elegante applicato a contenuti moderni: è la disciplina che impedisce al dolore di restare informe. Il sonetto, il carme e il mito ordinano l’esperienza senza cancellarne l’abisso. Per questo nella stessa opera possono convivere equilibrio e turbamento: Alla sera possiede una costruzione rigorosa, ma mette in scena il nulla eterno e lo spirto guerrier; A Zacinto richiama Venere e Ulisse, ma parla di un ritorno impossibile; Le Grazie affidano alla bellezza una funzione civilizzatrice. La poesia rende comunicabile la frattura e trasforma il trauma individuale in memoria condivisa. La classicità diventa così una forma di resistenza moderna.",
      vocabulary: [
        ["Mito", "Patrimonio di figure antiche che permette di dare forma universale all’esperienza personale."],
        ["Armonia", "Ordine formale che contiene il conflitto senza fingere che sia scomparso."]
      ],
      quiz: [
        {
          question: "Quale funzione assume il mito classico nella poesia foscoliana?",
          options: ["Sostituisce ogni riferimento alla vita moderna.", "Serve soltanto come ornamento erudito.", "Universalizza l’esperienza personale e le dà una forma condivisibile."],
          answer: 2,
          recovery: "Figure come Ulisse, Venere e le Grazie collegano la vicenda individuale a un patrimonio comune e trasformano il dolore privato in significato universale.",
          recoveryQuestion: "Che cosa aggiunge il mito al dato autobiografico?",
          anchor: "neoclassicismo"
        },
        {
          question: "Perché la classicità può essere definita una resistenza moderna?",
          options: ["Perché la misura formale contiene una realtà storica e interiore ormai frantumata.", "Perché Foscolo ignora completamente la modernità.", "Perché elimina dall’opera ogni conflitto."],
          answer: 0,
          recovery: "Foscolo usa forme rigorose non per fuggire dal presente, ma per rendere pensabile e comunicabile il disordine moderno.",
          recoveryQuestion: "Che rapporto c’è fra misura della forma e caos dell’esperienza?",
          anchor: "preromanticismo"
        }
      ]
    },
    opere: {
      summary: "Le opere principali di Foscolo costituiscono risposte diverse alla stessa domanda: come vivere e lasciare una traccia in un mondo privo di garanzie assolute? Le Ultime lettere di Jacopo Ortis mostrano il crollo congiunto delle illusioni politiche e amorose; il romanzo epistolare trasforma il dramma storico in voce individuale. Nei sonetti l’esperienza viene concentrata in forme brevi e rigorose: Alla sera interroga il nulla, A Zacinto l’origine e l’esilio, In morte del fratello Giovanni il lutto e la tomba. Dei Sepolcri sposta il problema dall’individuo alla comunità: la sepoltura vale per i vivi, perché custodisce affetti, esempi e memoria civile. Le Grazie affidano infine alla bellezza e all’arte una forza capace di ingentilire l’uomo e contenere la violenza. Non sono quindi opere isolate o un catalogo di generi. Romanzo, sonetti, carme e poema incompiuto formano una traiettoria che va dalla caduta delle illusioni alla costruzione di una sopravvivenza simbolica nella memoria e nella poesia.",
      vocabulary: [
        ["Autobiografismo", "Trasformazione letteraria di esperienze personali, senza coincidenza totale fra autore e personaggio."],
        ["Memoria poetica", "Durata simbolica affidata alla parola, capace di sottrarre persone e valori all’oblio."]
      ],
      quiz: [
        {
          question: "Quale funzione svolgono i sonetti nel percorso delle opere?",
          options: ["Sostituiscono ogni tema politico con descrizioni naturali.", "Concentrano in forme rigorose esilio, lutto, nulla e memoria.", "Rifiutano la tradizione metrica italiana."],
          answer: 1,
          recovery: "Alla sera, A Zacinto e In morte del fratello Giovanni condensano i grandi nuclei foscoliani nella forma chiusa e controllata del sonetto.",
          recoveryQuestion: "Quali tre esperienze vengono concentrate nei sonetti maggiori?",
          anchor: "sonetti"
        },
        {
          question: "Quale traiettoria collega Ortis, Sepolcri e Grazie?",
          options: ["Dal rifiuto della poesia alla fede religiosa.", "Dalla serenità politica al disimpegno.", "Dal crollo delle illusioni alla memoria civile e alla bellezza civilizzatrice."],
          answer: 2,
          recovery: "L’Ortis mette in scena la crisi; i Sepolcri costruiscono memoria condivisa; Le Grazie affidano all’arte una funzione di civiltà.",
          recoveryQuestion: "Quale risposta offre ciascuna delle tre opere alla crisi del senso?",
          anchor: "opere-percorso"
        }
      ]
    },
    "ortis-parini": {
      summary: "L’incontro fra Jacopo Ortis e Parini mette in scena due modi di reagire alla libertà tradita. Jacopo porta l’urgenza dell’azione, il desiderio di gloria e la disponibilità al sacrificio; Parini oppone la lucidità di chi conosce la corruzione del potere e teme che anche l’ideale più nobile possa trasformarsi in tirannide. La frase secondo cui non si deve aspettare la libertà dallo straniero smaschera l’ambiguità napoleonica: un conquistatore può abbattere vecchi regimi senza rendere davvero autonomo un popolo. Il dialogo non spegne la passione di Jacopo, ma ne mostra il rischio. Patria, amore e desiderio di morte si intrecciano perché il protagonista non riesce a trasformare le sue illusioni in un progetto storico praticabile. La forma epistolare avvicina il lettore alla coscienza del personaggio, mentre il confronto con Parini introduce una distanza critica. Il brano diventa così un laboratorio politico e morale: slancio e disinganno si illuminano reciprocamente senza trovare una conciliazione rassicurante.",
      essentials: [
        "L’incontro con Parini oppone la passione politica di Jacopo alla lucidità critica dell’anziano poeta.",
        "La libertà non può essere attesa come dono di una potenza straniera.",
        "Parini teme che il potere corrompa anche chi parte da ideali nobili.",
        "In Jacopo patria, amore e desiderio di morte formano un’unica crisi.",
        "La forma epistolare rende immediata la voce di Jacopo, ma il dialogo introduce un punto di vista critico."
      ],
      vocabulary: [
        ["Tirannide", "Potere che soffoca la libertà e può nascere anche da una rivoluzione tradita."],
        ["Disinganno politico", "Consapevolezza che la promessa di liberazione può nascondere un nuovo dominio."]
      ],
      quiz: [
        {
          question: "Quale funzione narrativa svolge Parini rispetto a Jacopo?",
          options: ["Conferma senza riserve ogni suo impulso.", "Introduce una distanza critica rispetto al desiderio di azione e gloria.", "Elimina dal romanzo il tema politico."],
          answer: 1,
          recovery: "Parini comprende il dolore di Jacopo, ma ne mette alla prova l’eroismo mostrando i rischi della violenza e del potere.",
          recoveryQuestion: "Quale rischio vede Parini nello slancio di Jacopo?",
          anchor: "prima-di-leggere"
        },
        {
          question: "Perché patria e amore conducono Jacopo verso la disperazione?",
          options: ["Perché entrambi diventano successi facili.", "Perché Parini gli vieta di scrivere.", "Perché entrambe le illusioni risultano impraticabili nella realtà."],
          answer: 2,
          recovery: "La patria è stata tradita e Teresa è irraggiungibile: il protagonista perde contemporaneamente i due valori ai quali aveva affidato il senso della vita.",
          recoveryQuestion: "Quali due illusioni crollano insieme nell’Ortis?",
          anchor: "testo-originale"
        }
      ]
    },
    "alla-sera": {
      summary: "Alla sera trasforma un momento naturale in una meditazione sulla morte. La sera è cara al poeta perché appare come immagine della fatal quiete: non una salvezza religiosa, ma la pace definitiva del nulla. Le due forme del paesaggio, estiva e invernale, non cambiano la funzione simbolica della sera, che induce il pensiero a vagare verso il nulla eterno. In quel movimento il tempo presente e le preoccupazioni della vita si allontanano; lo spirto guerrier, cioè la parte inquieta e combattiva dell’io, per un momento tace. Il sonetto non elimina il conflitto: lo contiene in una struttura rigorosa di endecasillabi, quartine e terzine, antitesi ed enjambement. Qui Neoclassicismo e sensibilità preromantica convivono: la forma è misurata, mentre i temi sono notte, morte, inquietudine e desiderio di pace. La poesia svolge la funzione tipica delle illusioni foscoliane: non nega il destino materiale, ma rende il nulla pensabile attraverso un’immagine capace di dare quiete.",
      essentials: [
        "La sera è immagine della morte intesa come fatal quiete.",
        "Il nulla eterno esprime la visione materialistica della fine dell’individuo.",
        "Lo spirto guerrier rappresenta l’io inquieto e combattivo del poeta.",
        "La forma rigorosa del sonetto contiene un contenuto profondamente tormentato.",
        "La poesia non cancella il nulla, ma lo trasforma in un’immagine temporaneamente consolatrice."
      ],
      vocabulary: [
        ["Enjambement", "Prosecuzione di una frase oltre il limite del verso, che crea tensione e movimento."],
        ["Antitesi", "Accostamento di elementi opposti, come quiete e spirto guerrier, luce e tenebra."]
      ],
      quiz: [
        {
          question: "Quale rapporto unisce forma e contenuto in Alla sera?",
          options: ["Entrambi sono privi di tensione.", "La forma rigorosa contiene un’esperienza interiore inquieta.", "Il contenuto elimina la struttura del sonetto."],
          answer: 1,
          recovery: "L’ordine metrico e sintattico non cancella il conflitto: gli offre una forma capace di renderlo pensabile e comunicabile.",
          recoveryQuestion: "Che cosa contiene la struttura rigorosa del sonetto?",
          anchor: "testo-alla-sera"
        },
        {
          question: "Perché la sera può essere letta come un’illusione foscoliana?",
          options: ["Perché promette un aldilà dimostrato.", "Perché nasconde al poeta l’esistenza della morte.", "Perché rende consolatrice e abitabile l’idea materialistica della fine."],
          answer: 2,
          recovery: "La sera non smentisce il nulla eterno; gli dà una figura di pace che placa temporaneamente lo spirto guerrier.",
          recoveryQuestion: "In che modo l’immagine della sera modifica la percezione del nulla?",
          anchor: "illusioni-alla-sera"
        }
      ]
    },
    conclusione: {
      summary: "Foscolo porta nell’Ottocento una crisi che appartiene pienamente alla modernità: la perdita di fondamenti religiosi e politici sicuri. La ragione materialistica gli impedisce di credere ingenuamente nell’immortalità; Campoformio e l’esilio mostrano che anche la storia può tradire; il cuore, tuttavia, non accetta di ridurre l’uomo a un puro meccanismo destinato al nulla. La risposta foscoliana è una costruzione laica di senso. Amore, patria, memoria, bellezza e poesia sono illusioni consapevoli che uniscono gli uomini e resistono all’oblio. Nelle opere questa risposta assume forme diverse: l’Ortis registra il crollo, i sonetti concentrano esilio e lutto, i Sepolcri trasformano la tomba in memoria civile, Le Grazie affidano all’arte una funzione civilizzatrice. Foscolo rimane così fra Illuminismo, Neoclassicismo e Romanticismo: ragione senza fede, cuore senza pace, poesia come resistenza. Non risolve la morte, ma la trasforma in memoria e dignità umana.",
      essentials: [
        "Foscolo è un autore di soglia fra Illuminismo, Neoclassicismo e Romanticismo.",
        "La sua domanda centrale è come dare senso alla vita senza una certezza religiosa dell’eternità.",
        "La religione delle illusioni affida senso ad amore, patria, memoria, bellezza e poesia.",
        "Le opere trasformano la crisi individuale in memoria affettiva e civile.",
        "La formula conclusiva è: ragione senza fede, cuore senza pace, poesia come resistenza."
      ],
      vocabulary: [
        ["Crisi dei fondamenti", "Perdita di certezze religiose, politiche e metafisiche capaci di garantire il senso."],
        ["Autore di soglia", "Scrittore collocato fra tradizioni diverse e capace di aprire una nuova epoca."],
        ["Dignità laica", "Valore umano costruito senza dipendere da una salvezza ultraterrena."],
        ["Resistenza all’oblio", "Funzione della memoria e della poesia nel conservare persone e valori."],
        ["Funzione civile", "Capacità della letteratura di educare una comunità attraverso esempi e memoria condivisa."]
      ],
      quiz: [
        {
          question: "Che cosa significa definire Foscolo un autore di soglia?",
          options: ["Che collega eredità illuministica e classica a temi che anticipano il Romanticismo.", "Che appartiene soltanto al mondo antico.", "Che rifiuta ogni forma della tradizione."],
          answer: 0,
          recovery: "Foscolo conserva laicità e misura classica, ma mette al centro io, esilio, patria, dolore e bisogno di assoluto.",
          recoveryQuestion: "Quali due eredità confluiscono nella sua posizione di soglia?",
          anchor: "foscolo-passaggio"
        },
        {
          question: "Qual è la risposta foscoliana alla crisi dei fondamenti?",
          options: ["La rinuncia a ogni valore.", "La costruzione consapevole delle illusioni umane.", "Il ritorno a una certezza religiosa tradizionale."],
          answer: 1,
          recovery: "Amore, patria, memoria, bellezza e poesia non cancellano il nulla, ma rendono possibile una vita dotata di legami e dignità.",
          recoveryQuestion: "Quali valori compongono la religione delle illusioni?",
          anchor: "che-cosa-resta"
        },
        {
          question: "Quale opera trasforma più chiaramente la memoria in valore civile?",
          options: ["Le Ultime lettere di Jacopo Ortis.", "Alla sera.", "Dei Sepolcri."],
          answer: 2,
          recovery: "Nei Sepolcri la tomba unisce i vivi, conserva gli esempi dei grandi e alimenta l’identità di una comunità.",
          recoveryQuestion: "Per chi e in quale modo è utile la tomba?",
          anchor: "schema-finale"
        },
        {
          question: "Come va interpretata la formula «ragione senza fede, cuore senza pace»?",
          options: ["La ragione vede il nulla, ma il bisogno umano di senso resta aperto.", "Foscolo rifiuta sia la ragione sia i sentimenti.", "La fede risolve definitivamente ogni conflitto."],
          answer: 0,
          recovery: "La ragione materialistica nega garanzie ultraterrene; il cuore continua però a cercare affetti, memoria e bellezza.",
          recoveryQuestion: "Quali due forze restano in tensione?",
          anchor: "formula-sintetica"
        },
        {
          question: "Qual è la funzione conclusiva della poesia in Foscolo?",
          options: ["Dimostrare scientificamente l’aldilà.", "Sostituire la storia con l’immaginazione.", "Trasformare la perdita in memoria e resistenza all’oblio."],
          answer: 2,
          recovery: "La parola poetica non salva fisicamente l’individuo, ma conserva legami, esempi e dignità nella memoria dei vivi.",
          recoveryQuestion: "Che cosa può salvare la poesia e che cosa non può salvare?",
          anchor: "formula-sintetica"
        }
      ]
    }
  };

  const QUESTION_ANCHORS = {
    introduzione: ["2-il-quadro-politico-antico-regime-rivoluzione-napoleone", "2-il-quadro-politico-antico-regime-rivoluzione-napoleone", "meccanicismo"],
    fratture: ["zante-origine", "napoleone", "esilio"],
    "immagine-del-mondo": ["religione-illusioni", "religione-illusioni", "nulla-eterno"],
    poetica: ["neoclassicismo", "preromanticismo", "preromanticismo"],
    opere: ["jacopo-ortis", "dei-sepolcri", "le-grazie"],
    "ortis-parini": ["prima-di-leggere", "prima-di-leggere", "prima-di-leggere"],
    "alla-sera": ["testo-alla-sera", "nulla-alla-sera", "illusioni-alla-sera"]
  };

  const CONTEXT_HINTS = {
    introduzione: ["vita, pensiero", "vita, pensiero", "meccanicismo", "vita, pensiero"],
    fratture: ["foscolo: vita", "fortezza", "fortezza", "foscolo: vita", "foscolo: vita"],
    "immagine-del-mondo": ["meccanicismo", "religione delle illusioni", "religione delle illusioni", "religione delle illusioni", "religione delle illusioni"],
    poetica: ["neoclassicismo", "neoclassicismo", "neoclassicismo", "vita, pensiero", "vita, pensiero"],
    opere: ["vita, pensiero", "ultime lettere", "sonetti", "sepolcri", "grazie", "vita, pensiero"],
    "ortis-parini": ["ultime lettere"],
    "alla-sera": ["alla sera", "alla sera", "alla sera", "alla sera", "alla sera", "sonetti", "sonetti", "alla sera", "ultime lettere", "alla sera", "alla sera"],
    conclusione: ["vita, pensiero", "neoclassicismo", "religione delle illusioni", "vita, pensiero", "vita, pensiero", "vita, pensiero"]
  };

  const meta = LESSON_META[lessonId];
  const article = $(".lesson-article");
  const sidebar = $(".lesson-sidebar");
  const header = $(".site-header");
  if (!meta || !article || !sidebar || !header) return;

  const baseData = typeof LESSON_STUDY_DATA === "object" ? (LESSON_STUDY_DATA[lessonId] || {}) : {};
  const extraData = EXTRA_STUDY_DATA[lessonId] || {};
  const studyData = {
    summary: extraData.summary || "",
    essentials: extraData.essentials || [],
    vocabulary: [...(baseData.vocabulary || []), ...(extraData.vocabulary || [])],
    quiz: [...(baseData.quiz || []), ...(extraData.quiz || [])].slice(0, 5)
  };

  $(".study-panel", article)?.remove();
  $$(".study-panel", article).forEach(panel => panel.remove());
  $(".notes-tool", sidebar)?.remove();

  const readingSurface = document.createElement("div");
  readingSurface.className = "lesson-reading";
  readingSurface.dataset.lessonReading = "";
  [...article.childNodes].forEach(node => readingSurface.append(node));
  article.append(readingSurface);

  const headingIds = {
    introduzione: ["vita-frattura", "quadro-politico", "meccanicismo", "senso-foscolo"],
    fratture: ["biografia-ferita", "zante-origine", "napoleone", "fratello-giovanni", "esilio"],
    "immagine-del-mondo": ["nulla-eterno", "religione-illusioni", "perche-religione", "illusioni-opere", "illusioni-vere"],
    poetica: ["tempo-passaggio", "neoclassicismo", "preromanticismo", "due-correnti", "punto-decisivo"],
    opere: ["opere-percorso", "jacopo-ortis", "sonetti", "dei-sepolcri", "le-grazie", "collegare-opere"],
    "ortis-parini": ["prima-di-leggere", "scena", "liberta-tradita", "critica-eroismo", "jacopo", "illusioni-ortis", "confronto", "stile-ortis", "conclusione-ortis", "domande-ortis", "testo-originale"],
    "alla-sera": ["testo-alla-sera", "parafrasi-alla-sera", "sonetto-decisivo", "nulla-alla-sera", "illusioni-alla-sera", "struttura-alla-sera", "poetica-alla-sera", "stile-alla-sera", "confronto-parini", "conclusione-alla-sera", "domande-alla-sera"],
    conclusione: ["che-cosa-resta", "foscolo-passaggio", "formula-sintetica", "studiare-oggi", "schema-finale", "traccia-orale"]
  };
  $$("h2", readingSurface).forEach((heading, index) => {
    if (!heading.id) heading.id = headingIds[lessonId]?.[index] || `sezione-${index + 1}`;
  });

  const existingEssentials = $$(".lesson-note", readingSurface).find(note => /saperi irrinunciabili/i.test(note.textContent));
  if (existingEssentials) {
    existingEssentials.id = "saperi-irrinunciabili";
    existingEssentials.classList.add("essentials-block");
  } else if (studyData.essentials.length) {
    readingSurface.insertAdjacentHTML(
      "beforeend",
      `<aside id="saperi-irrinunciabili" class="lesson-note essentials-block"><h2>Saperi irrinunciabili</h2><ul>${studyData.essentials.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></aside>`
    );
  }

  if (studyData.summary) {
    article.insertAdjacentHTML(
      "beforeend",
      `<section class="lesson-summary" aria-labelledby="summary-title"><p class="study-kicker">Sintesi</p><h2 id="summary-title">La lezione in breve</h2><p>${escapeHtml(studyData.summary)}</p></section>`
    );
  }

  const readingTools = document.createElement("div");
  readingTools.className = "reading-tools";
  readingTools.setAttribute("role", "toolbar");
  readingTools.setAttribute("aria-label", "Strumenti per evidenziare e raccogliere passaggi");
  readingTools.innerHTML = `
    <p data-selection-status role="status" aria-live="polite">Seleziona un passo, poi evidenzialo.</p>
    <button type="button" data-highlight-selection disabled>Evidenzia selezione</button>
    <button type="button" data-add-selection disabled>Incolla questa selezione</button>
    <button type="button" data-add-highlights disabled>Incolla evidenziati <span data-highlight-count>0</span></button>
    <button type="button" data-clear-highlights disabled>Rimuovi evidenziature</button>
  `;
  article.insertBefore(readingTools, readingSurface);

  header.innerHTML = `
    <a class="study-home" href="${root}index.html" aria-label="Torna alla home di Ugo Foscolo"><span aria-hidden="true">←</span> Home</a>
    <div class="study-title"><span>Ugo Foscolo · ${escapeHtml(meta.number)}</span><strong>${escapeHtml(meta.title)}</strong></div>
    <div class="study-actions">
      <button type="button" data-font="-" aria-label="Riduci il testo">A−</button>
      <button type="button" data-font="+" aria-label="Ingrandisci il testo">A+</button>
      <button type="button" data-open-index>Indice</button>
    </div>
    <nav class="mobile-study-tabs" aria-label="Pannelli dell’ambiente di studio">
      <button type="button" class="active" data-mobile-view="read">Lezione</button>
      <button type="button" data-mobile-view="visual">Apparato</button>
      <button type="button" data-mobile-view="notes">Taccuino</button>
    </nav>
  `;
  header.classList.add("study-topbar");

  const visualPane = document.createElement("section");
  visualPane.className = "visual-context-pane";
  visualPane.setAttribute("aria-labelledby", "visual-context-title");
  const visualScroll = document.createElement("div");
  visualScroll.className = "visual-context-scroll";
  [...sidebar.children].forEach(child => visualScroll.append(child));
  visualPane.innerHTML = `<header class="workspace-panel-header"><p>Osserva mentre leggi</p><h2 id="visual-context-title">Apparato visivo</h2><span data-context-status aria-live="polite"></span><span class="panel-scroll-hint" aria-hidden="true">Scorri il pannello ↓</span></header>`;
  visualPane.append(visualScroll);

  const notebookPane = document.createElement("section");
  notebookPane.className = "notebook-pane";
  notebookPane.setAttribute("aria-labelledby", "notebook-title");
  notebookPane.innerHTML = `
    <header class="workspace-panel-header notebook-header">
      <div><p>Elabora</p><h2 id="notebook-title">Taccuino</h2></div>
      <div class="notebook-header-meta"><span data-autosave-state role="status">Salvataggio automatico</span><span class="panel-scroll-hint" aria-hidden="true">Scorri il taccuino ↓</span></div>
    </header>
    <label for="notebook-text">Appunti personali</label>
    <textarea id="notebook-text" rows="6" spellcheck="true" placeholder="Scrivi osservazioni, domande e collegamenti personali…"></textarea>
    <section class="citation-area" aria-labelledby="citation-title">
      <h3 id="citation-title">Citazioni dalla lezione</h3>
      <div class="citation-list" data-citation-list></div>
      <p data-empty-citations>Evidenzia i passaggi che vuoi conservare, poi usa “Incolla evidenziati”.</p>
    </section>
    <div class="notebook-actions">
      <button type="button" data-download-notes>Scarica TXT</button>
      <button type="button" class="danger" data-clear-notebook>Cancella</button>
    </div>
  `;
  sidebar.append(visualPane, notebookPane);

  const dismissScrollHint = (scroller, panel) => {
    const hint = $(".panel-scroll-hint", panel);
    if (!hint) return;
    scroller.addEventListener("scroll", () => hint.remove(), { once: true, passive: true });
  };
  dismissScrollHint(visualScroll, visualPane);
  dismissScrollHint(notebookPane, notebookPane);

  const dock = document.createElement("nav");
  dock.className = "study-bottombar";
  dock.setAttribute("aria-label", "Strumenti per sedimentare");
  dock.innerHTML = `
    <div class="reading-progress" aria-label="Progresso di lettura della sessione corrente"><span class="reading-progress-label"><strong data-progress-label>0%</strong><small>sessione</small></span><i><b data-progress-bar></b></i></div>
    <button type="button" data-learning-panel="essentials">Saperi irrinunciabili</button>
    <button type="button" data-learning-panel="vocab">Vocabolario</button>
    <button type="button" data-learning-panel="test">Test</button>
  `;
  document.body.append(dock);

  const indexDialog = document.createElement("dialog");
  indexDialog.className = "study-dialog index-dialog";
  indexDialog.innerHTML = `
    <form method="dialog"><button class="dialog-x" aria-label="Chiudi">×</button></form>
    <header><p>Sei movimenti e due approfondimenti</p><h2>Indice</h2></header>
    <nav class="full-index" aria-label="Indice completo">
      ${Object.entries(LESSON_META).map(([id, item]) => `<a href="${item.href}" ${id === lessonId ? 'aria-current="page"' : ""}><b>${escapeHtml(item.number)}</b><span>${escapeHtml(item.title)}${item.deepening ? " · Approfondimento" : ""}</span></a>`).join("")}
      <a href="${root}mappe.html"><b>M</b><span>Mappe concettuali</span></a>
      <a href="${root}video.html"><b>V</b><span>Video</span></a>
    </nav>
    <div class="dialog-actions"><button type="button" data-resume-reading>Riprendi questa lezione</button><button type="button" class="danger-link" data-reset-study>Azzera i dati di studio</button></div>
  `;
  document.body.append(indexDialog);

  const learningDialog = document.createElement("dialog");
  learningDialog.className = "study-dialog learning-dialog";
  learningDialog.innerHTML = `
    <form method="dialog"><button class="dialog-x" aria-label="Chiudi">×</button></form>
    <header><p data-learning-kicker>Consolida</p><h2 data-learning-title>Saperi irrinunciabili</h2></header>
    <div data-learning-content></div>
  `;
  document.body.append(learningDialog);

  const toast = document.createElement("div");
  toast.className = "study-toast";
  toast.hidden = true;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.append(toast);

  let toastTimer = null;
  const showToast = message => {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2400);
  };

  let notebook = safeGet(`notebook-${lessonId}`, { notes: "", citations: [] });
  if (!notebook || typeof notebook !== "object") notebook = { notes: "", citations: [] };
  notebook.notes = typeof notebook.notes === "string" ? notebook.notes : "";
  notebook.citations = Array.isArray(notebook.citations) ? notebook.citations : [];
  if (!notebook.notes) {
    const legacyNotes = localStorage.getItem(`foscolo-notes-${lessonId}`);
    if (legacyNotes) {
      notebook.notes = legacyNotes;
      safeSet(`notebook-${lessonId}`, notebook);
    }
  }

  const notebookText = $("#notebook-text", notebookPane);
  const autosaveState = $("[data-autosave-state]", notebookPane);
  notebookText.value = notebook.notes;
  let saveTimer = null;

  const saveNotebook = () => {
    clearTimeout(saveTimer);
    notebook.notes = notebookText.value;
    autosaveState.textContent = safeSet(`notebook-${lessonId}`, notebook) ? "Salvato" : "Salvataggio non disponibile";
  };

  const scheduleNotebookSave = () => {
    autosaveState.textContent = "Salvataggio…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNotebook, 320);
  };

  const renderCitations = () => {
    const list = $("[data-citation-list]", notebookPane);
    list.innerHTML = notebook.citations.map((citation, index) => `
      <article class="citation-card">
        <q>${escapeHtml(citation.text)}</q>
        <small>${escapeHtml(citation.source || meta.title)}</small>
        <button type="button" data-remove-citation="${index}" aria-label="Rimuovi questa citazione">×</button>
      </article>
    `).join("");
    $("[data-empty-citations]", notebookPane).hidden = notebook.citations.length > 0;
  };
  renderCitations();
  notebookText.addEventListener("input", scheduleNotebookSave);

  notebookPane.addEventListener("click", event => {
    const remove = event.target.closest("[data-remove-citation]");
    if (!remove) return;
    notebook.citations.splice(Number(remove.dataset.removeCitation), 1);
    saveNotebook();
    renderCitations();
    updateReadingTools();
  });

  const highlightsForLesson = () => {
    const value = safeGet(`highlights-${lessonId}`, []);
    if (!Array.isArray(value)) return [];
    return value.filter(item => item && Number.isInteger(item.start) && Number.isInteger(item.end) && item.end > item.start && typeof item.text === "string");
  };

  const saveHighlights = highlights => safeSet(`highlights-${lessonId}`, highlights);

  const markTextOffsets = (start, end, highlightId) => {
    if (start < 0 || end <= start || end > readingSurface.textContent.length) return false;
    const walker = document.createTreeWalker(readingSurface, NodeFilter.SHOW_TEXT);
    const segments = [];
    let offset = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const nodeEnd = offset + node.nodeValue.length;
      if (nodeEnd > start && offset < end) {
        segments.push({ node, start: Math.max(0, start - offset), end: Math.min(node.nodeValue.length, end - offset) });
      }
      offset = nodeEnd;
      if (offset >= end) break;
    }
    segments.reverse().forEach(segment => {
      if (segment.end <= segment.start || segment.node.parentElement?.closest(".student-highlight")) return;
      const selectedNode = segment.node.splitText(segment.start);
      selectedNode.splitText(segment.end - segment.start);
      const mark = document.createElement("mark");
      mark.className = "student-highlight";
      mark.dataset.highlightId = highlightId;
      mark.title = "Passo evidenziato";
      selectedNode.parentNode.insertBefore(mark, selectedNode);
      mark.append(selectedNode);
    });
    return segments.length > 0;
  };

  highlightsForLesson().sort((a, b) => b.start - a.start).forEach(item => markTextOffsets(item.start, item.end, item.id));

  let pendingSelection = null;
  let selectionTimer = null;
  const citationMatches = (citation, highlight) => {
    if (citation.highlightId && citation.highlightId === highlight.id) return true;
    return normalizeText(citation.text) === normalizeText(highlight.text);
  };

  const updateReadingTools = () => {
    const highlights = highlightsForLesson();
    const waiting = highlights.filter(highlight => !notebook.citations.some(citation => citationMatches(citation, highlight)));
    const canUseSelection = !!pendingSelection;
    $("[data-highlight-selection]", readingTools).disabled = !canUseSelection;
    $("[data-add-selection]", readingTools).disabled = !canUseSelection;
    $("[data-add-highlights]", readingTools).disabled = waiting.length === 0;
    $("[data-clear-highlights]", readingTools).disabled = highlights.length === 0;
    $("[data-highlight-count]", readingTools).textContent = String(waiting.length);
    const status = $("[data-selection-status]", readingTools);
    if (canUseSelection) {
      const words = pendingSelection.text.split(/\s+/).filter(Boolean).length;
      status.textContent = `Selezione pronta: ${words} ${words === 1 ? "parola" : "parole"}. Puoi evidenziarla o incollarla subito.`;
    } else if (highlights.length && waiting.length) {
      status.textContent = `${highlights.length} ${highlights.length === 1 ? "passaggio evidenziato" : "passaggi evidenziati"}; ${waiting.length} ancora da incollare.`;
    } else if (highlights.length) {
      status.textContent = "Tutti i passaggi evidenziati sono già nel taccuino.";
    } else {
      status.textContent = "Seleziona un passo, poi evidenzialo.";
    }
  };

  const captureSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      pendingSelection = null;
      updateReadingTools();
      return;
    }
    const range = selection.getRangeAt(0);
    if (!readingSurface.contains(range.startContainer) || !readingSurface.contains(range.endContainer)) return;
    const text = normalizeText(range.toString()).slice(0, 5000);
    if (!text) return;
    const beforeStart = document.createRange();
    beforeStart.selectNodeContents(readingSurface);
    beforeStart.setEnd(range.startContainer, range.startOffset);
    const beforeEnd = document.createRange();
    beforeEnd.selectNodeContents(readingSurface);
    beforeEnd.setEnd(range.endContainer, range.endOffset);
    pendingSelection = {
      text,
      start: beforeStart.toString().length,
      end: beforeEnd.toString().length
    };
    updateReadingTools();
  };

  readingSurface.addEventListener("pointerup", () => setTimeout(captureSelection, 0));
  readingSurface.addEventListener("keyup", event => {
    if (event.key === "Shift" || event.key.startsWith("Arrow")) setTimeout(captureSelection, 0);
  });
  document.addEventListener("selectionchange", () => {
    clearTimeout(selectionTimer);
    selectionTimer = setTimeout(captureSelection, 100);
  });
  $$("button", readingTools).forEach(button => button.addEventListener("pointerdown", event => event.preventDefault()));

  $("[data-highlight-selection]", readingTools).addEventListener("click", () => {
    if (!pendingSelection) return;
    const highlights = highlightsForLesson();
    if (highlights.some(item => pendingSelection.start < item.end && pendingSelection.end > item.start)) {
      pendingSelection = null;
      window.getSelection()?.removeAllRanges();
      updateReadingTools();
      showToast("Questa selezione contiene già un passaggio evidenziato.");
      return;
    }
    const item = {
      id: `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      text: pendingSelection.text,
      start: pendingSelection.start,
      end: pendingSelection.end,
      source: meta.title,
      date: new Date().toISOString()
    };
    highlights.push(item);
    saveHighlights(highlights);
    markTextOffsets(item.start, item.end, item.id);
    pendingSelection = null;
    window.getSelection()?.removeAllRanges();
    updateReadingTools();
    showToast("Passo evidenziato. Puoi continuare a leggere.");
  });

  $("[data-add-selection]", readingTools).addEventListener("click", () => {
    if (!pendingSelection) return;
    const duplicate = notebook.citations.some(citation => normalizeText(citation.text) === pendingSelection.text);
    if (!duplicate) {
      notebook.citations.push({ text: pendingSelection.text, source: meta.title, date: new Date().toISOString() });
      saveNotebook();
      renderCitations();
    }
    pendingSelection = null;
    window.getSelection()?.removeAllRanges();
    updateReadingTools();
    showToast(duplicate ? "Questo passo è già nel taccuino." : "Selezione incollata nel taccuino.");
  });

  $("[data-add-highlights]", readingTools).addEventListener("click", () => {
    const highlights = highlightsForLesson();
    const waiting = highlights.filter(highlight => !notebook.citations.some(citation => citationMatches(citation, highlight)));
    if (!waiting.length) return;
    waiting.forEach(highlight => notebook.citations.push({
      text: highlight.text,
      source: highlight.source,
      date: new Date().toISOString(),
      highlightId: highlight.id
    }));
    saveNotebook();
    renderCitations();
    updateReadingTools();
    showToast(`${waiting.length} ${waiting.length === 1 ? "passaggio incollato" : "passaggi incollati"} nel taccuino.`);
  });

  $("[data-clear-highlights]", readingTools).addEventListener("click", () => {
    const highlights = highlightsForLesson();
    if (!highlights.length || !window.confirm(`Rimuovere ${highlights.length === 1 ? "il passaggio evidenziato" : `i ${highlights.length} passaggi evidenziati`}? Le citazioni già nel taccuino resteranno conservate.`)) return;
    const parents = new Set();
    $$("mark.student-highlight", readingSurface).forEach(mark => {
      parents.add(mark.parentNode);
      mark.replaceWith(...mark.childNodes);
    });
    parents.forEach(parent => parent?.normalize());
    saveHighlights([]);
    pendingSelection = null;
    window.getSelection()?.removeAllRanges();
    updateReadingTools();
    showToast("Evidenziature rimosse; il taccuino non è stato modificato.");
  });
  updateReadingTools();

  $("[data-download-notes]", notebookPane).addEventListener("click", () => {
    saveNotebook();
    const date = new Intl.DateTimeFormat("it-IT", { dateStyle: "long", timeStyle: "short" }).format(new Date());
    const citations = notebook.citations.length
      ? notebook.citations.map(citation => `“${citation.text}”\nFonte: ${citation.source || meta.title}`).join("\n\n—\n\n")
      : "Nessuna citazione conservata.";
    const text = `Ugo Foscolo — ${meta.title}\nData e ora: ${date}\n\nAPPUNTI DELLO STUDENTE\n${notebook.notes || "Nessun appunto personale."}\n\nCITAZIONI DALLA LEZIONE\n${citations}\n`;
    const blob = new Blob(["\ufeff", text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `foscolo-${lessonId}-taccuino.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Download TXT avviato.");
  });

  $("[data-clear-notebook]", notebookPane).addEventListener("click", () => {
    if (!window.confirm(`Cancellare appunti e citazioni di “${meta.title}”?`)) return;
    notebook = { notes: "", citations: [] };
    notebookText.value = "";
    safeSet(`notebook-${lessonId}`, notebook);
    renderCitations();
    updateReadingTools();
    autosaveState.textContent = "Taccuino cancellato";
  });

  const contextCards = [
    ...$$(".lesson-map-card, .foscolo-media, .biblioteca-bridge-card, .zante-bridge-card", visualScroll)
  ];
  const contextStatus = $("[data-context-status]", visualPane);
  const headings = $$("h2", readingSurface).filter(heading => !heading.closest("#saperi-irrinunciabili"));
  const hints = CONTEXT_HINTS[lessonId] || [];
  let activeContextIndex = -1;

  const activateContext = index => {
    if (!contextCards.length || index === activeContextIndex) return;
    activeContextIndex = index;
    const hint = normalizeKey(hints[index] || hints[hints.length - 1] || "");
    const mapCards = contextCards.filter(item => item.matches(".lesson-map-card"));
    const card = mapCards.find(item => normalizeKey(item.textContent).includes(hint))
      || contextCards.find(item => normalizeKey(item.textContent).includes(hint))
      || contextCards[0];
    contextCards.forEach(item => item.classList.toggle("is-contextual", item === card));
    const heading = headings[index];
    contextStatus.textContent = heading ? `Collegato a: ${normalizeText(heading.textContent).replace(/^\d+\.\s*/, "")}` : "Materiali della lezione";
    const target = Math.max(0, card.offsetTop - visualScroll.offsetTop - 8);
    visualScroll.scrollTo({ top: target, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const updateContextFromReading = () => {
    const articleTop = article.getBoundingClientRect().top;
    let index = 0;
    headings.forEach((heading, candidate) => {
      if (heading.getBoundingClientRect().top - articleTop < 170) index = candidate;
    });
    activateContext(index);
  };
  article.addEventListener("scroll", updateContextFromReading, { passive: true });
  activateContext(0);

  const progressLabel = $("[data-progress-label]", dock);
  const progressBar = $("[data-progress-bar]", dock);
  let progressTimer = null;
  const updateProgress = () => {
    const max = Math.max(1, article.scrollHeight - article.clientHeight);
    const ratio = Math.min(1, Math.max(0, article.scrollTop / max));
    const percent = Math.round(ratio * 100);
    progressLabel.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
    clearTimeout(progressTimer);
    progressTimer = setTimeout(() => {
      safeSet(`progress-${lessonId}`, { scrollTop: article.scrollTop, ratio, updated: new Date().toISOString() });
      safeSet("last-lesson", { id: lessonId, updated: new Date().toISOString() });
    }, 180);
  };
  article.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const savedProgress = safeGet(`progress-${lessonId}`, null);
  const resumeReading = () => {
    if (savedProgress && Number.isFinite(savedProgress.scrollTop)) article.scrollTop = savedProgress.scrollTop;
    indexDialog.close();
  };
  $("[data-resume-reading]", indexDialog).addEventListener("click", resumeReading);
  if (new URLSearchParams(location.search).get("resume") === "1") setTimeout(resumeReading, 120);

  const renderEssentials = () => {
    if (studyData.essentials.length) {
      return `<ul class="essentials-dialog-list">${studyData.essentials.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    }
    const source = $("#saperi-irrinunciabili", readingSurface);
    if (!source) return "<p>I saperi irrinunciabili sono integrati nella conclusione della lezione.</p>";
    const paragraphs = $$("p", source).map(item => normalizeText(item.textContent)).filter(item => item && !/^saperi irrinunciabili$/i.test(item));
    return `<div class="essentials-source">${paragraphs.map(item => `<p>${escapeHtml(item)}</p>`).join("")}</div>`;
  };

  const renderVocabulary = () => `<dl class="vocabulary-dialog">${studyData.vocabulary.map(([term, definition]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd></div>`).join("")}</dl>`;

  const normalizeQuizItem = (item, index) => ({
    ...item,
    anchor: item.anchor || QUESTION_ANCHORS[lessonId]?.[index] || headings[0]?.id || "",
    recoveryQuestion: item.recoveryQuestion || `Qual è il nesso corretto richiamato dalla domanda “${item.question}”?`
  });

  const renderQuiz = () => {
    const items = studyData.quiz.map(normalizeQuizItem);
    return `
      <form class="advanced-quiz" data-advanced-quiz data-mode="full">
        ${items.map((item, index) => `
          <fieldset data-question-index="${index}">
            <legend>${escapeHtml(item.question)}</legend>
            ${item.options.map((option, optionIndex) => `<label><input type="radio" name="advanced-${lessonId}-${index}" value="${optionIndex}"><span>${escapeHtml(option)}</span></label>`).join("")}
            <div class="question-feedback" data-question-feedback hidden></div>
          </fieldset>
        `).join("")}
        <p class="grade-formula">Le domande hanno lo stesso peso. Il voto è la percentuale convertita in decimi; minimo 1/10.</p>
        <button type="submit" class="quiz-submit">Correggi il test</button>
      </form>
      <div class="advanced-quiz-report" data-advanced-quiz-report hidden></div>
    `;
  };

  const setupQuiz = () => {
    const form = $("[data-advanced-quiz]", learningDialog);
    const report = $("[data-advanced-quiz-report]", learningDialog);
    if (!form || !report) return;
    const items = studyData.quiz.map(normalizeQuizItem);
    let retryIndexes = null;

    const showFullTest = () => {
      retryIndexes = null;
      form.dataset.mode = "full";
      $$(`fieldset`, form).forEach(fieldset => {
        fieldset.hidden = false;
        $$(`input`, fieldset).forEach(input => { input.checked = false; });
        $("[data-question-feedback]", fieldset).hidden = true;
      });
      $(".quiz-submit", form).textContent = "Correggi il test";
      report.hidden = true;
    };

    form.addEventListener("submit", event => {
      event.preventDefault();
      const activeIndexes = retryIndexes || items.map((_, index) => index);
      const wrong = [];
      let correct = 0;
      activeIndexes.forEach(index => {
        const item = items[index];
        const fieldset = $(`fieldset[data-question-index="${index}"]`, form);
        const chosen = $(`input[name="advanced-${lessonId}-${index}"]:checked`, fieldset);
        const chosenIndex = chosen ? Number(chosen.value) : -1;
        const feedback = $("[data-question-feedback]", fieldset);
        const isCorrect = chosenIndex === item.answer;
        if (isCorrect) correct += 1;
        else wrong.push(index);
        fieldset.classList.toggle("is-correct", isCorrect);
        fieldset.classList.toggle("is-wrong", !isCorrect);
        feedback.hidden = false;
        feedback.innerHTML = isCorrect
          ? `<strong>Corretto.</strong> <span>${escapeHtml(item.recovery)}</span>`
          : `<strong>Da rivedere.</strong> <span>La risposta corretta è “${escapeHtml(item.options[item.answer])}”. ${escapeHtml(item.recovery)}</span>`;
      });
      const percentage = Math.round((correct / activeIndexes.length) * 100);
      const grade = Math.max(1, Math.round(percentage / 10));
      const history = safeGet(`quiz-${lessonId}`, []);
      history.push({ type: retryIndexes ? "recupero" : "test", date: new Date().toISOString(), correct, total: activeIndexes.length, percentage, grade, wrong });
      safeSet(`quiz-${lessonId}`, history.slice(-12));
      report.hidden = false;
      report.innerHTML = `
        <h3>${retryIndexes ? "Esito del recupero" : "Esito del test"}</h3>
        <p class="score-line">${correct}/${activeIndexes.length} · ${percentage}% · voto ${grade}/10</p>
        ${wrong.length ? `<div class="recovery-list"><h4>Nodi da recuperare</h4>${wrong.map(index => {
          const item = items[index];
          return `<article><strong>${escapeHtml(item.question)}</strong><p>${escapeHtml(item.recovery)}</p><p><b>Controllo:</b> ${escapeHtml(item.recoveryQuestion)}</p>${item.anchor ? `<a href="#${escapeHtml(item.anchor)}" data-return-anchor="${escapeHtml(item.anchor)}">Rileggi il punto collegato</a>` : ""}</article>`;
        }).join("")}</div><button type="button" data-retry-wrong>Riprova solo le domande errate</button>` : `<p class="quiz-success">Tutti i nessi sono stati riconosciuti.</p>${retryIndexes ? `<button type="button" data-full-test>Rifai il test completo</button>` : ""}`}
      `;
      $("[data-retry-wrong]", report)?.addEventListener("click", () => {
        retryIndexes = [...wrong];
        form.dataset.mode = "retry";
        $$(`fieldset`, form).forEach((fieldset, index) => {
          fieldset.hidden = !retryIndexes.includes(index);
          $$(`input`, fieldset).forEach(input => { input.checked = false; });
          fieldset.classList.remove("is-correct", "is-wrong");
          $("[data-question-feedback]", fieldset).hidden = true;
        });
        $(".quiz-submit", form).textContent = "Correggi il recupero";
        report.hidden = true;
        form.scrollIntoView({ block: "start" });
      });
      $("[data-full-test]", report)?.addEventListener("click", showFullTest);
      $$('[data-return-anchor]', report).forEach(link => link.addEventListener("click", event => {
        event.preventDefault();
        learningDialog.close();
        const target = document.getElementById(link.dataset.returnAnchor);
        target?.scrollIntoView({ block: "start" });
        target?.focus?.({ preventScroll: true });
      }));
    });
  };

  const openLearningPanel = type => {
    const title = $("[data-learning-title]", learningDialog);
    const kicker = $("[data-learning-kicker]", learningDialog);
    const content = $("[data-learning-content]", learningDialog);
    if (type === "essentials") {
      kicker.textContent = "Conoscenze stabili";
      title.textContent = "Saperi irrinunciabili";
      content.innerHTML = renderEssentials();
    } else if (type === "vocab") {
      kicker.textContent = "Parole necessarie";
      title.textContent = "Vocabolario essenziale";
      content.innerHTML = renderVocabulary();
    } else {
      kicker.textContent = "Comprensione e recupero";
      title.textContent = "Test della lezione";
      content.innerHTML = renderQuiz();
      setupQuiz();
    }
    learningDialog.showModal();
  };

  dock.addEventListener("click", event => {
    const button = event.target.closest("[data-learning-panel]");
    if (button) openLearningPanel(button.dataset.learningPanel);
  });

  $("[data-open-index]", header).addEventListener("click", () => indexDialog.showModal());
  indexDialog.addEventListener("click", event => {
    if (event.target === indexDialog) indexDialog.close();
  });
  learningDialog.addEventListener("click", event => {
    if (event.target === learningDialog) learningDialog.close();
  });

  $$("[data-font]", header).forEach(button => button.addEventListener("click", () => {
    const current = Number(safeGet("font-scale", 1));
    const next = Math.min(1.25, Math.max(0.9, current + (button.dataset.font === "+" ? 0.05 : -0.05)));
    document.documentElement.style.setProperty("--study-font-scale", next);
    safeSet("font-scale", next);
    showToast(`Dimensione del testo: ${Math.round(next * 100)}%`);
  }));
  document.documentElement.style.setProperty("--study-font-scale", Number(safeGet("font-scale", 1)));

  $("[data-reset-study]", indexDialog).addEventListener("click", () => {
    if (!window.confirm("Azzerare evidenziazioni, taccuini, progressi e risultati dei test di questa PWA?")) return;
    const keys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith("foscolo-study-v10-") || key?.startsWith("foscolo-notes-")) keys.push(key);
    }
    keys.forEach(key => localStorage.removeItem(key));
    location.reload();
  });

  document.body.dataset.mobilePanel = "read";
  $$("[data-mobile-view]", header).forEach(button => button.addEventListener("click", () => {
    const panel = button.dataset.mobileView;
    document.body.dataset.mobilePanel = panel;
    $$("[data-mobile-view]", header).forEach(item => item.classList.toggle("active", item === button));
  }));

  const updateChromeSizes = () => {
    document.documentElement.style.setProperty("--study-header-height", `${header.offsetHeight}px`);
    document.documentElement.style.setProperty("--study-dock-height", `${dock.offsetHeight}px`);
  };
  updateChromeSizes();
  window.addEventListener("resize", updateChromeSizes, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener("resize", updateChromeSizes, { passive: true });
})();
