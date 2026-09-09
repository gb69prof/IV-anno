# La Rivoluzione americana · gbprof

PWA didattica per la quarta classe della scuola secondaria superiore. Copertina: `index.html`; percorso: `app.html#lezioni`.

**Domanda unificante:** come può una rivoluzione proclamare diritti universali e nascere dentro una società che non li riconosce ancora a tutti?

## Percorso didattico

Cinque lezioni estese: colonie; tasse e rappresentanza; indipendenza; guerra internazionale; costruzione della repubblica. Ogni lezione segue otto passaggi: domanda, mondo precedente, fratture, attori e conflitti, processo, fonti, conseguenze, conclusione. Ogni passaggio presenta una sintesi. Completano la lezione 10–12 saperi irrinunciabili, lessico, mappa, collegamenti e tre domande con spiegazione e recupero.

Sono presenti 14 approfondimenti tematici, la sezione trasversale «Libertà per chi?» e il «Riassunto generale» corretto a partire dal documento del docente; 11 biografie; 24 mappe/schemi; una timeline di 24 eventi; un quiz finale di 15 domande con voto proporzionale indicativo, report e recupero mirato. Il confronto con la Rivoluzione francese è un collegamento didattico intenzionale, non un residuo del modello.

## Strumenti per lo studente

- History Focus nelle cinque lezioni: lettura, Osserva, Appunti, Ripassa; su schermi piccoli i materiali si alternano al testo.
- Tre dimensioni del testo. Selezione ed evidenziazione anche su più paragrafi; eliminazione evidenziati; raccolta negli appunti; salvataggio automatico e download TXT.
- Ricerca nel titolo e nel testo degli approfondimenti, senza distinzione di maiuscole o accenti.
- Schemi SVG con modal nativo, zoom, download e equivalente testuale HTML. Facsimili autentici di tre documenti.
- Mini-quiz e quiz finale: spiegazione per tutte le risposte e scheda di recupero per gli errori. Il quiz finale riprende dopo la riapertura.
- Navigazione da tastiera, focus visibile, dialoghi chiudibili con Esc, feedback annunciati, riduzione del movimento, layout responsive. La copertina mobile usa collegamenti in flusso, senza hotspot posizionali.

## Dati locali e privacy

Nessun account, tracciamento, analytics o backend applicativo. `localStorage` è usato soltanto per dati dello studente con prefisso `ra-`: `ra-font`, `ra-notes-*`, `ra-highlights-*`, `ra-mini-*`, `ra-quiz`. L’adattamento locale intercetta i controlli del carattere di History Focus evitando di scrivere la preferenza nel namespace condiviso. I dati non vengono sincronizzati: esportare gli appunti per conservarne una copia. In caso di memoria locale bloccata o esaurita la PWA segnala l’errore di salvataggio degli appunti.

La sola modifica esterna al modulo è una riga in `pwa-common/gbprof-accessibility.js`: aggiunta dello scope `/storia/rivoluzione-americana/` con prefisso `ra-`. Il footer può così cancellare soltanto i dati di questo percorso. Nessuna modifica a History Focus, all’indice di Storia o alla PWA francese.

## PWA e aggiornamento

Manifest relativo, scope `./`, icone 192/512 e `.nojekyll`. Installazione dal menu del browser; su iOS/iPadOS, Safari → Condividi → Aggiungi alla schermata Home. Non tutti i browser mostrano un prompt automatico.

Il service worker precache comprende entrambe le pagine, testi, codice, stile, manifest, icone, tutte le immagini e mappe, README, attribuzioni, privacy, accessibilità e componenti condivisi. Primo avvio connesso: attendere «Percorso pronto offline». Fonti esterne e percorsi didattici vicini richiedono rete se non già salvati dalle rispettive PWA.

Strategia: rete prima con fallback alla cache per pagine/CSS/JS; cache prima per media. Solo richieste GET della stessa origine appartenenti al modulo o all’elenco condiviso vengono intercettate. L’attivazione rimuove soltanto cache con prefisso `rivoluzione-americana-`. Aggiornare `CACHE_NAME` a ogni modifica dei file precache. Gli appunti non sono nella cache del service worker.

Funziona in una sottocartella di GitHub Pages e sul server gbprof tramite HTTPS; per sviluppo usare un server HTTP su localhost. Non aprire `index.html` con `file://` per verificare offline/installazione.

## Correzioni al documento iniziale

Schiavitù in tutte le colonie e connessioni atlantiche del Nord; sovranità native e colonialismo d’insediamento; Proclamation del 1763; Tea Act senza nuova tassa; uso circoscritto dei simboli Mohawk; Committee of Five e revisione congressuale; resa dell’esercito di Cornwallis a Yorktown; Trattato di Parigi del 1783; Articoli approvati nel 1777 e operativi nel 1781–1789; firma costituzionale 1787, nona ratifica 1788, governo 1789; Collegio elettorale e ruolo del Senato; judicial review distinto dal testo esplicito del 1787; proposta del Bill of Rights 1789 e ratifica 1791; repubblica costituzionale federale con partecipazione limitata.

## Sviluppo e collaudo riproducibile

Il sito pubblicato è statico e non richiede installazione di dipendenze o build. Per sviluppare localmente: `npm ci`, quindi `npm run dev` dalla cartella del modulo. La configurazione Vite serve la radice del repository per rispettare i percorsi dei componenti condivisi. Aprire `/Storia/Rivoluzione-americana/index.html` all’indirizzo indicato dal server. Non pubblicare `node_modules`.

Test automatici senza dipendenze: `node tests/verify.mjs` (Node 22 o superiore). Il test esegue il vero service worker in un ambiente simulato e verifica il recupero delle risorse a rete assente; non sostituisce un test di installazione su Safari o su un dispositivo fisico.

## Struttura dei file

- `.gitignore`
- `.nojekyll`
- `ATTRIBUTIONS.md`
- `COLLAUDO.md`
- `README.md`
- `app.html`
- `assets/img/documents/bill-of-rights.jpg`
- `assets/img/documents/constitution.jpg`
- `assets/img/documents/declaration.jpg`
- `assets/img/documents/wheatley.webp`
- `assets/img/icons/icon-192.png`
- `assets/img/icons/icon-512.png`
- `assets/img/schemi/bill-rights.svg`
- `assets/img/schemi/colonie.svg`
- `assets/img/schemi/confederazione.svg`
- `assets/img/schemi/controlli.svg`
- `assets/img/schemi/costituzione.svg`
- `assets/img/schemi/crisi.svg`
- `assets/img/schemi/dichiarazione.svg`
- `assets/img/schemi/economie.svg`
- `assets/img/schemi/federalismo.svg`
- `assets/img/schemi/federalisti.svg`
- `assets/img/schemi/francia.svg`
- `assets/img/schemi/geografia.svg`
- `assets/img/schemi/guerra.svg`
- `assets/img/schemi/indipendenza.svg`
- `assets/img/schemi/liberta.svg`
- `assets/img/schemi/marbury.svg`
- `assets/img/schemi/paine.svg`
- `assets/img/schemi/percorso.svg`
- `assets/img/schemi/proclamazione.svg`
- `assets/img/schemi/rappresentanza.svg`
- `assets/img/schemi/saratoga.svg`
- `assets/img/schemi/tasse.svg`
- `assets/img/schemi/tea-act.svg`
- `assets/img/schemi/teatri-guerra.svg`
- `css/style.css`
- `index.html`
- `js/app.js`
- `js/content.js`
- `js/cover.js`
- `js/data.js`
- `manifest.webmanifest`
- `package-lock.json`
- `package.json`
- `service-worker.js`
- `tests/verify.mjs`
- `vite.config.js`

Risultati e limiti del collaudo in [COLLAUDO.md](COLLAUDO.md). Fonti e diritti in [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
