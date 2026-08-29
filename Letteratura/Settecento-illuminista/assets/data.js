/* Contenuti didattici: i testi integrali sono nei file content/*.txt. */
window.SETTECENTO_DATA = {
  lessons: [
    {
      id: "introduzione",
      number: "00",
      title: "Il Settecento illuminista",
      subtitle: "La libertà come problema",
      question: "Come si diventa liberi in un mondo che ha già deciso chi dobbiamo essere?",
      source: "content/00-introduzione.txt",
      map: "assets/images/mappa-introduzione.png",
      mapPreview: "assets/images/mappa-introduzione.webp",
      mapAlt: "Mappa del Settecento illuminista: dall’Antico Regime, attraverso ragione e opinione pubblica, si aprono le tre vie alla libertà di Goldoni, Parini e Alfieri.",
      summary: "Il Settecento trasforma la libertà in un criterio pubblico con cui giudicare istituzioni, privilegi e cultura. L’Antico Regime assegna valore e funzione in base alla nascita; l’Illuminismo mostra invece che società e leggi sono opere umane, dunque discutibili e modificabili. Ragione, esperienza, sensibilità e opinione pubblica rendono l’individuo capace di valutare l’autorità. La letteratura partecipa a questa svolta: la commedia mostra la persona dietro la maschera, la satira smaschera il privilegio e la tragedia rappresenta lo scontro fra libertà e dominio. Goldoni, Parini e Alfieri propongono tre strade diverse e incomplete. Proprio i loro limiti preparano l’Ottocento, nel quale la libertà dovrà diventare anche storia, popolo, nazione e partecipazione collettiva.",
      essentials: [
        "L’Antico Regime fonda l’ordine sociale sulla nascita e divide la popolazione in ordini giuridicamente diseguali.",
        "Nel Settecento la libertà diventa un criterio con cui giudicare leggi, privilegi, educazione, cultura e rapporti sociali.",
        "La ragione illuminista diventa discussione pubblica attraverso libri, giornali, accademie, caffè, salotti e teatro.",
        "La società viene considerata un’opera umana e quindi modificabile.",
        "L’universalismo illuminista resta incompiuto perché molti diritti non sono estesi a donne, poveri, schiavi e popoli colonizzati.",
        "La letteratura assume una funzione civile: rende visibili i meccanismi del dominio e forma il giudizio."
      ],
      vocab: {
        "Antico Regime": "Sistema politico e sociale europeo fondato su monarchia, privilegi e divisione in ordini.",
        "Privilegio": "Vantaggio giuridico, fiscale o sociale riservato a un gruppo per nascita o condizione.",
        "Terzo Stato": "Insieme eterogeneo di coloro che non appartengono né al clero né alla nobiltà.",
        "Illuminismo": "Movimento culturale che sottopone istituzioni e tradizioni al giudizio della ragione, dell’esperienza e dell’utilità pubblica.",
        "Opinione pubblica": "Spazio nel quale lettori e cittadini discutono questioni comuni fuori dal controllo esclusivo della corte.",
        "Diritti naturali": "Diritti considerati propri dell’essere umano e non concessi arbitrariamente dal sovrano.",
        "Dispotismo illuminato": "Governo assoluto che promuove riforme senza riconoscere una reale sovranità politica ai cittadini.",
        "Utilità pubblica": "Capacità di un’azione, una legge o un sapere di contribuire al bene comune.",
        "Non-dominio": "Condizione di chi non dipende dalla volontà arbitraria di un altro, anche se quell’arbitrio non viene esercitato continuamente."
      },
      quiz: [
        {
          id:"i1", q:"Quale principio regge la società d’Antico Regime?", options:["L’uguaglianza giuridica dei cittadini","La distinzione degli ordini fondata sulla nascita","La mobilità sociale garantita dall’istruzione"], correct:1,
          explanation:"L’Antico Regime attribuisce diritti e privilegi differenti secondo l’ordine di nascita.",
          recovery:{concept:"Nascita e ordine sociale",text:"Il valore pubblico non dipende anzitutto dal merito, ma dall’appartenenza a clero, nobiltà o Terzo Stato.",example:"Un nobile conserva privilegi fiscali e giuridici per nascita.",anchor:"section-1",q:"Che cosa determina soprattutto il rango nell’Antico Regime?",options:["La nascita","Il titolo di studio","La professione"],correct:0}
        },
        {
          id:"i2", q:"Che cosa rende specificamente illuminista il problema della libertà?", options:["La libertà diventa un criterio per giudicare istituzioni e rapporti sociali","La libertà viene limitata alla creazione artistica","La libertà coincide con l’assenza di qualsiasi regola"], correct:0,
          explanation:"L’Illuminismo usa la libertà come misura critica di leggi, privilegi, educazione e potere.",
          recovery:{concept:"Libertà come criterio pubblico",text:"La libertà non è soltanto desiderio individuale: diventa una domanda rivolta alle istituzioni.",example:"Una pena deve giustificare razionalmente la propria utilità e proporzione.",anchor:"section-2",q:"La libertà illuminista giudica anche le istituzioni?",options:["Sì","No","Soltanto le corti"],correct:0}
        },
        {
          id:"i3", q:"Quale spazio favorisce la nascita dell’opinione pubblica?", options:["Soltanto la corte","Caffè, giornali, salotti, accademie e teatro","Esclusivamente le università ecclesiastiche"], correct:1,
          explanation:"Questi luoghi permettono a lettori e spettatori di confrontare e giudicare idee fuori dalla comunicazione di corte.",
          recovery:{concept:"Opinione pubblica",text:"La ragione diventa pubblica quando circola fra più interlocutori e non dipende da un unico centro di autorità.",example:"Il lettore di un giornale può discutere riforme e pene in un caffè.",anchor:"section-2",q:"Quale luogo appartiene alla nuova discussione pubblica?",options:["Il caffè","La sola anticamera reale","Il feudo chiuso"],correct:0}
        },
        {
          id:"i4", q:"Quale contraddizione accompagna i diritti proclamati universali?", options:["Sono applicati immediatamente a tutti","Riguardano soltanto il diritto di leggere","Restano spesso negati a donne, poveri, schiavi e colonizzati"], correct:2,
          explanation:"L’universalismo dei principi è più ampio della loro applicazione storica.",
          recovery:{concept:"Universalismo incompiuto",text:"Dire «tutti gli uomini» non significa ancora includere concretamente ogni essere umano nei diritti.",example:"La schiavitù sopravvive mentre si proclamano diritti naturali.",anchor:"section-2",q:"Principi universali e applicazione storica coincidono subito?",options:["Sì, sempre","No, resta una distanza","Solo nelle colonie"],correct:1}
        },
        {
          id:"i5", q:"Quale funzione comune assume la letteratura nei tre autori?", options:["Ornare il potere senza giudicarlo","Rendere il mondo visibile e giudicabile","Rifiutare ogni rapporto con il pubblico"], correct:1,
          explanation:"Commedia, satira e tragedia diventano differenti laboratori della libertà.",
          recovery:{concept:"Funzione civile della letteratura",text:"La forma letteraria fa vedere ciò che l’abitudine o il prestigio nascondono.",example:"La satira rende ridicolo il privilegio che pretende rispetto.",anchor:"section-4",q:"La letteratura illuminista del percorso serve soprattutto a…",options:["nascondere i conflitti","mostrare e giudicare la realtà","celebrare ogni tradizione"],correct:1}
        }
      ]
    },
    {
      id: "goldoni",
      number: "01",
      title: "Carlo Goldoni",
      subtitle: "Liberarsi dalle maschere",
      question: "Si può essere liberi se gli altri ci vedono soltanto attraverso il ruolo che ricopriamo?",
      source: "content/01-goldoni.txt",
      map: "assets/images/mappa-goldoni.png",
      mapPreview: "assets/images/mappa-goldoni.webp",
      mapAlt: "Mappa di Goldoni: dalla Commedia dell’Arte alla riforma graduale, dalla maschera al carattere e dal canovaccio al copione; libertà concreta nelle relazioni.",
      summary: "Goldoni trasforma gradualmente la commedia professionale senza negare la vitalità della Commedia dell’Arte. La crescita di un pubblico cittadino e l’attenzione illuministica all’esperienza gli impongono personaggi più credibili. La maschera fissa lascia spazio al carattere, il canovaccio al copione e il lazzo a una comicità fondata sulle relazioni. Il «Mondo» offre la varietà sociale; il «Teatro» insegna efficacia scenica e rapporto con gli attori. Nelle opere la libertà resta concreta: Mirandolina governa il linguaggio e l’economia della locanda, ma incontra i limiti dell’ordine patriarcale; nei Rusteghi l’autorità familiare viene costretta alla mediazione; nelle Baruffe la comunità deve ricomporsi; nella Trilogia della villeggiatura l’apparenza diventa una nuova dipendenza. Goldoni libera la persona quando impedisce al ruolo di esaurirne l’identità.",
      essentials: [
        "Goldoni riforma la commedia gradualmente, lavorando dall’interno del teatro professionale.",
        "La riforma passa dalla maschera al carattere, dal canovaccio al copione e dal lazzo alla comicità delle relazioni.",
        "Il «Mondo» e il «Teatro» sono le due fonti della poetica goldoniana.",
        "La libertà goldoniana è concreta e relazionale: non elimina i legami, ma impedisce che un ruolo definisca interamente la persona.",
        "Mirandolina possiede autonomia economica e linguistica, ma il finale mostra anche i limiti della sua libertà.",
        "Goldoni non idealizza automaticamente la borghesia: giudica comportamenti e responsabilità."
      ],
      vocab: {
        "Commedia dell’Arte": "Teatro professionale fondato su maschere, canovacci, improvvisazione e repertori scenici.",
        "Maschera": "Tipo scenico stabile, riconoscibile per costume, linguaggio e comportamento convenzionale.",
        "Canovaccio": "Traccia dell’intreccio che guida l’improvvisazione senza fissare tutte le battute.",
        "Lazzo": "Sequenza comica verbale o gestuale inserita dall’attore nello spettacolo.",
        "Carattere": "Personaggio individualizzato, costruito dall’incontro fra temperamento, ambiente e relazioni.",
        "Mondo e Teatro": "Le due fonti della poetica goldoniana: osservazione sociale e conoscenza concreta della scena.",
        "Commedia d’ambiente": "Commedia in cui il protagonista reale è una comunità con i propri linguaggi e conflitti."
      },
      quiz: [
        {
          id:"g1",q:"Perché Goldoni non elimina subito la Commedia dell’Arte?",options:["Perché considera inutile ogni riforma","Perché la trasformazione deve funzionare con attori e pubblico reali","Perché vuole conservare soltanto l’improvvisazione"],correct:1,
          explanation:"La riforma procede per gradi dentro il teatro professionale e tiene conto delle condizioni concrete della scena.",
          recovery:{concept:"Riforma graduale",text:"Goldoni scrive progressivamente più parti fino al copione completo.",example:"Conserva alcune maschere, ma le rende meno rigide.",anchor:"section-2",q:"La riforma goldoniana avviene…",options:["per decreto improvviso","per trasformazioni graduali","fuori dai teatri"],correct:1}
        },
        {
          id:"g2",q:"Che cosa distingue il carattere dalla maschera?",options:["Il carattere nasce dall’incontro fra persona, ambiente e relazioni","Il carattere ripete sempre gli stessi gesti","Il carattere è riconoscibile soltanto dal costume"],correct:0,
          explanation:"Il carattere è individualizzato e può contraddirsi, cambiare e rivelarsi attraverso le azioni.",
          recovery:{concept:"Dal tipo alla persona",text:"La maschera è fissa; il carattere assume forma nella situazione concreta.",example:"Mirandolina non coincide con una sola etichetta.",anchor:"section-4",q:"Quale figura può cambiare nel corso dell’azione?",options:["Il carattere","La maschera fissa","Il costume"],correct:0}
        },
        {
          id:"g3",q:"Quali sono i due maestri dichiarati da Goldoni?",options:["La Corte e l’Accademia","Il Mondo e il Teatro","Il Principe e la Chiesa"],correct:1,
          explanation:"Dal Mondo apprende caratteri e costumi; dal Teatro efficacia scenica, attori e pubblico.",
          recovery:{concept:"Mondo e Teatro",text:"La società fornisce la materia umana; la scena insegna come renderla teatralmente efficace.",example:"Un comportamento osservato deve diventare azione e dialogo.",anchor:"section-4",q:"Da dove Goldoni ricava i comportamenti sociali?",options:["Dal Mondo","Dalla sola mitologia","Dal cerimoniale di corte"],correct:0}
        },
        {
          id:"g4",q:"Perché Mirandolina non è un simbolo semplice di emancipazione?",options:["Perché non possiede alcuna competenza","Perché la sua autonomia è reale ma incontra limiti sociali e conseguenze","Perché obbedisce sempre passivamente ai nobili"],correct:1,
          explanation:"Gestisce la locanda e domina il linguaggio, ma il gioco con il Cavaliere e il matrimonio finale mostrano confini concreti.",
          recovery:{concept:"Libertà limitata",text:"La libertà goldoniana agisce dentro rapporti che non possono essere eliminati con un gesto.",example:"Il matrimonio con Fabrizio protegge la locanda ma ristabilisce anche un ordine.",anchor:"section-5",q:"La libertà di Mirandolina è…",options:["assoluta","reale ma limitata","inesistente"],correct:1}
        },
        {
          id:"g5",q:"Quale dipendenza mostra la Trilogia della villeggiatura?",options:["La dipendenza esclusiva dal sovrano","La paura della lingua italiana","La soggezione volontaria allo status e all’apparenza"],correct:2,
          explanation:"I personaggi spendono e mentono per corrispondere allo sguardo sociale.",
          recovery:{concept:"Schiavitù dell’apparenza",text:"Anche senza un padrone visibile, l’individuo può dipendere dal bisogno di essere ammirato.",example:"Si spende oltre le proprie possibilità per imitare un modello sociale.",anchor:"section-5",q:"Che cosa domina i personaggi della Villeggiatura?",options:["Il bisogno di apparire","La ricerca scientifica","La vita monastica"],correct:0}
        }
      ]
    },
    {
      id: "parini",
      number: "02",
      title: "Giuseppe Parini",
      subtitle: "Liberarsi dai privilegi",
      question: "Può dirsi libera una società nella quale alcuni ricevono onori senza meritarli e altri lavorano senza dignità?",
      source: "content/02-parini.txt",
      map: "assets/images/mappa-parini.png",
      mapPreview: "assets/images/mappa-parini.webp",
      mapAlt: "Mappa di Parini: privilegio senza merito, educazione civile, antifrasi ed eroicomico; dal Giorno alle Odi, responsabilità e utilità sociale.",
      summary: "Parini giudica la società d’Antico Regime dall’interno del mondo aristocratico. Il privilegio perde legittimità quando nascita e merito cessano di coincidere. La dignità dipende dalle azioni utili, dal lavoro e dalla capacità di riconoscere l’umanità altrui. La poesia deve educare il giudizio senza ridursi a predica. Nel Giorno il finto precettore celebra le occupazioni insignificanti del «giovin signore»: antifrasi e stile eroicomico fanno emergere la sproporzione fra prestigio e vuoto morale. L’episodio della «vergine cuccia» rivela una sensibilità deformata che compatisce l’animale e ignora il servo licenziato. Le Odi mostrano una poesia capace di intervenire su salute, ambiente, scienza e indipendenza dello scrittore. Parini non abolisce la gerarchia: pretende che chi occupa una posizione elevata la trasformi in responsabilità pubblica.",
      essentials: [
        "Parini sottopone il privilegio ai criteri del merito, dell’utilità sociale e della dignità umana.",
        "La vera nobiltà è morale e dipende dalle azioni, non dalla genealogia.",
        "Nel Giorno l’antifrasi e il contrasto eroicomico smascherano il vuoto della vita aristocratica.",
        "Il «giovin signore» rappresenta una nobiltà oziosa, occupata da rituali privi di funzione.",
        "Parini propone la rieducazione della nobiltà, non la sua abolizione rivoluzionaria.",
        "Le Odi civili collegano poesia, salute, scienza, ambiente e indipendenza morale."
      ],
      vocab: {
        "Poesia civile": "Poesia che interviene sulla vita collettiva e forma il giudizio morale e politico.",
        "Satira": "Critica di comportamenti e istituzioni attraverso ironia, contrasto e ridicolo.",
        "Antifrasi": "Figura con cui si afferma ironicamente il contrario di ciò che si intende.",
        "Eroicomico": "Effetto prodotto dall’uso di uno stile eroico per una materia bassa o insignificante.",
        "Endecasillabo sciolto": "Verso di undici sillabe non organizzato in uno schema regolare di rime.",
        "Cicisbeismo": "Convenzione mondana per cui una dama sposata era accompagnata da un cavalier servente.",
        "Giovin signore": "Protagonista-tipico del Giorno, educato ironicamente dal narratore."
      },
      quiz: [
        {
          id:"p1",q:"Quale criterio sostituisce la nascita nel giudizio di Parini?",options:["Il merito unito all’utilità sociale","La ricchezza comunque ottenuta","La vicinanza personale al sovrano"],correct:0,
          explanation:"La dignità dipende dalla qualità morale e dalla funzione utile delle azioni.",
          recovery:{concept:"Nobiltà morale",text:"Il rango ereditario non garantisce virtù; le azioni devono renderlo degno.",example:"Il contadino operoso possiede una dignità che il nobile ozioso spreca.",anchor:"section-3",q:"La vera nobiltà, per Parini, dipende soprattutto…",options:["dal sangue","dalle azioni","dal lusso"],correct:1}
        },
        {
          id:"p2",q:"Come funziona l’antifrasi nel Giorno?",options:["Il narratore condanna direttamente ogni gesto","Il narratore finge di lodare ciò che il testo vuole criticare","Il narratore elimina ogni ironia"],correct:1,
          explanation:"La lode apparente costringe il lettore a riconoscere l’insignificanza dell’oggetto celebrato.",
          recovery:{concept:"Antifrasi",text:"La voce dice il contrario del proprio giudizio reale.",example:"La scelta di una bevanda viene presentata come impresa memorabile.",anchor:"section-4",q:"Nell’antifrasi, la lode apparente può nascondere…",options:["una critica","un dato scientifico","una preghiera"],correct:0}
        },
        {
          id:"p3",q:"Che cosa rivela l’episodio della «vergine cuccia»?",options:["L’uguaglianza già realizzata fra servo e nobile","Una gerarchia morale che compatisce l’animale e ignora il dolore del servo","La superiorità economica dei contadini"],correct:1,
          explanation:"La sensibilità aristocratica appare raffinata ma incapace di riconoscere la sofferenza umana di chi serve.",
          recovery:{concept:"Sensibilità deformata",text:"Il privilegio decide anche quale dolore merita attenzione.",example:"Il servo viene licenziato mentre la cagnolina è consolata.",anchor:"section-5",q:"Chi subisce la conseguenza più grave nell’episodio?",options:["La cagnolina","Il servo","Il giovin signore"],correct:1}
        },
        {
          id:"p4",q:"Quale rapporto unisce classicismo e Illuminismo in Parini?",options:["Il classicismo cancella ogni tema contemporaneo","L’Illuminismo impone il rifiuto di ogni forma poetica","La forma classica serve a giudicare problemi civili moderni"],correct:2,
          explanation:"Lingua controllata e forme classiche diventano strumenti per affrontare disuguaglianza, salute, scienza e lavoro.",
          recovery:{concept:"Forma antica, funzione moderna",text:"Parini non fugge nel passato: usa precisione e solennità per misurare il presente.",example:"L’endecasillabo sciolto racconta i rituali vuoti del nobile.",anchor:"section-4",q:"La forma classica è per Parini…",options:["uno strumento di giudizio","una fuga obbligatoria","un semplice ornamento"],correct:0}
        },
        {
          id:"p5",q:"Qual è il limite politico della proposta pariniana?",options:["Dipende dalla disponibilità dei privilegiati a riformarsi","Rifiuta ogni educazione","Affida tutto a una rivoluzione popolare già compiuta"],correct:0,
          explanation:"Parini spera che la classe dirigente accetti di trasformare prestigio e potere in responsabilità.",
          recovery:{concept:"Riforma dall’alto",text:"L’educazione civile può fallire se chi possiede vantaggi non vuole rinunciarvi.",example:"La satira smaschera il nobile, ma non può obbligarlo a cambiare.",anchor:"section-6",q:"Da chi dipende in parte la riforma pariniana?",options:["Dalla classe privilegiata","Da nessuno","Soltanto dagli attori"],correct:0}
        }
      ]
    },
    {
      id: "alfieri",
      number: "03",
      title: "Vittorio Alfieri",
      subtitle: "Liberarsi dalla tirannide",
      question: "Che cosa resta all’individuo quando il potere pretende il possesso della sua volontà?",
      source: "content/03-alfieri.txt",
      map: "assets/images/mappa-alfieri.png",
      mapPreview: "assets/images/mappa-alfieri.webp",
      mapAlt: "Mappa di Alfieri: rifiuto della corte e della tirannide, disciplina della volontà, scrittore indipendente e tragedia come collisione di forze inconciliabili.",
      summary: "Alfieri trasforma la libertà in opposizione radicale al dominio. Il privilegio di corte gli appare una servitù elegante, mentre persino il sovrano riformatore resta pericoloso se può collocarsi sopra la legge. Essere liberi significa non dipendere dall’arbitrio altrui e disciplinare la propria volontà. La decisione di «farsi» scrittore collega autoformazione, lingua e indipendenza. Nelle tragedie lo scontro fra volontà incompatibili viene concentrato fino alla catastrofe; lo stile spezzato rende la pressione delle passioni. Della tirannide analizza la struttura del potere arbitrario; Del principe e delle lettere difende lo scrittore dal mecenatismo; Saul e Mirra mostrano che il dominio può trasferirsi nella coscienza. La grandezza e il limite coincidono: Alfieri sa dire il «no» dell’individuo libero, ma fatica a immaginare istituzioni e libertà collettive.",
      essentials: [
        "Per Alfieri è tirannico ogni potere capace di porsi sopra la legge e restare impunito.",
        "La libertà è politica e interiore: rifiuto dell’arbitrio altrui e disciplina della propria volontà.",
        "Lo scrittore deve essere indipendente dal principe perché il favore può diventare censura interiore.",
        "La tragedia alfieriana concentra lo scontro fra volontà inconciliabili.",
        "Saul e Mirra mostrano che la tirannide può agire anche dentro la coscienza.",
        "Alfieri trasmette all’Ottocento il culto della volontà e l’eroe solitario, ma non una teoria democratica compiuta."
      ],
      vocab: {
        "Tirannide": "Potere nel quale chi governa può fare o violare le leggi senza subire conseguenze.",
        "Uomo libero": "Individuo che non consegna al potere il proprio giudizio e la propria dignità.",
        "Eroe tragico": "Personaggio costretto a scegliere dentro un conflitto senza conciliazione possibile.",
        "Volontarismo": "Centralità attribuita alla volontà come forza di autoformazione e resistenza.",
        "Titanismo": "Sfida smisurata dell’individuo contro un potere o un limite superiore alle sue forze.",
        "Ideare, stendere, verseggiare": "Le tre fasi con cui Alfieri descrive la costruzione delle tragedie.",
        "Mecenatismo": "Protezione economica di un potente che può compromettere l’indipendenza dello scrittore.",
        "Tragedia interiore": "Conflitto nel quale la forza oppressiva agisce nella coscienza e nelle passioni."
      },
      quiz: [
        {
          id:"a1",q:"Quando un potere è tirannico secondo Alfieri?",options:["Quando il sovrano è personalmente sgarbato","Quando chi governa può porsi sopra la legge senza conseguenze","Quando esistono leggi scritte"],correct:1,
          explanation:"Il criterio riguarda la struttura arbitraria del potere, non il carattere più o meno mite del governante.",
          recovery:{concept:"Arbitrio sopra la legge",text:"Un sovrano benefico resta pericoloso se la libertà dipende soltanto dalla sua volontà.",example:"Può sospendere una legge senza dover rispondere a nessuno.",anchor:"section-5",q:"Un sovrano mite può restare tirannico?",options:["Sì, se è sopra la legge","No, mai","Solo se è povero"],correct:0}
        },
        {
          id:"a2",q:"Che cosa significa «farsi» scrittore per Alfieri?",options:["Attendere l’ispirazione senza esercizio","Sottoporsi a una disciplina severa di lingua e composizione","Accettare un incarico stabile a corte"],correct:1,
          explanation:"La libertà richiede autoformazione e dominio dell’inerzia, non soltanto fuga dai padroni esterni.",
          recovery:{concept:"Volontà e disciplina",text:"La volontà libera dà forma a se stessa attraverso un lavoro continuato.",example:"Alfieri conquista l’italiano letterario con studio intenzionale.",anchor:"section-2",q:"La volontà alfieriana richiede…",options:["disciplina","passività","protezione del principe"],correct:0}
        },
        {
          id:"a3",q:"Perché lo scrittore deve essere indipendente dal principe?",options:["Per evitare che gratitudine e favore diventino censura interiore","Perché ogni lettore appartiene alla corte","Per rinunciare alla responsabilità pubblica"],correct:0,
          explanation:"Il mecenatismo può orientare la parola senza bisogno di una censura esplicita.",
          recovery:{concept:"Parola non servile",text:"Chi dipende dal potere può iniziare a tacere prima ancora di ricevere un divieto.",example:"La ricompensa seleziona gli autori compatibili con il dominio.",anchor:"section-4",q:"Il favore del principe può limitare…",options:["l’indipendenza dello scrittore","la metrica soltanto","la stampa dei dizionari"],correct:0}
        },
        {
          id:"a4",q:"Quale caratteristica definisce la tragedia alfieriana?",options:["La moltiplicazione degli episodi comici","La descrizione tranquilla della vita quotidiana","La collisione concentrata di volontà incompatibili"],correct:2,
          explanation:"Personaggi e azioni secondarie vengono ridotti perché resti visibile il conflitto senza conciliazione.",
          recovery:{concept:"Collisione tragica",text:"Il compromesso annullerebbe l’identità dei protagonisti e l’azione tende alla catastrofe.",example:"Dominio e rifiuto del dominio non trovano una mediazione.",anchor:"section-4",q:"La tragedia alfieriana tende verso…",options:["la catastrofe","il lieto fine comico","la cronaca neutra"],correct:0}
        },
        {
          id:"a5",q:"Quale limite presenta la libertà alfieriana?",options:["È incapace di opporsi al potere","Resta eroica e individuale, con poche forme collettive e istituzionali","Coincide con la riforma graduale della nobiltà"],correct:1,
          explanation:"Alfieri difende potentemente l’indipendenza morale, ma il suo soggetto è l’individuo eccezionale più che il cittadino fra cittadini.",
          recovery:{concept:"Libertà solitaria",text:"Dire «no» al tiranno non basta ancora a costruire un ordine libero condiviso.",example:"L’eroe resiste, ma non progetta istituzioni democratiche.",anchor:"section-6",q:"La libertà alfieriana è soprattutto…",options:["collettiva e istituzionale","individuale ed eroica","economica e commerciale"],correct:1}
        }
      ]
    }
  ],
  finalQuiz: [
    {id:"f1",q:"Quale formula riassume la via di Goldoni?",options:["Dalla maschera al carattere","Dal carattere alla maschera","Dal cittadino al cortigiano"],correct:0,explanation:"Goldoni restituisce alla scena persone determinate da ambiente e relazioni, non tipi fissi."},
    {id:"f2",q:"Quale formula riassume la via di Parini?",options:["Dal privilegio alla responsabilità","Dalla responsabilità al privilegio","Dalla ragione al silenzio"],correct:0,explanation:"Il rango deve giustificarsi attraverso merito, utilità e dignità umana."},
    {id:"f3",q:"Quale formula riassume la via di Alfieri?",options:["Dalla tirannide alla volontà libera","Dalla legge all’arbitrio","Dall’indipendenza al mecenatismo"],correct:0,explanation:"La libertà è rifiuto del dominio esterno e disciplina di sé."},
    {id:"f4",q:"Quale autore confida maggiormente nella correzione graduale delle relazioni?",options:["Goldoni","Parini","Alfieri"],correct:0,explanation:"Il teatro di Goldoni trasforma concretamente ruoli e comportamenti senza rottura assoluta."},
    {id:"f5",q:"Quale autore usa antifrasi ed eroicomico contro il privilegio?",options:["Alfieri","Parini","Goldoni"],correct:1,explanation:"Nel Giorno lo stile sublime rende ridicola la materia aristocratica insignificante."},
    {id:"f6",q:"Quale autore considera sospetto anche il sovrano benefico?",options:["Goldoni","Parini","Alfieri"],correct:2,explanation:"Per Alfieri conta che nessuna volontà possa collocarsi sopra la legge."},
    {id:"f7",q:"Che cosa accomuna i tre autori?",options:["La stessa teoria politica compiuta","La letteratura come laboratorio per rendere visibile il dominio","Il rifiuto del pubblico"],correct:1,explanation:"Commedia, satira e tragedia espongono diversi ostacoli alla libertà."},
    {id:"f8",q:"Che cosa resta da compiere nell’Ottocento?",options:["Trasformare le libertà individuali e morali in libertà storica e collettiva","Ripristinare integralmente l’Antico Regime","Abbandonare il problema della libertà"],correct:0,explanation:"L’Ottocento eredita strumenti e limiti del Settecento e cerca forme politiche, nazionali e sociali della libertà."}
  ]
};
