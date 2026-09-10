# Quando il mondo cominciò a vivere al ritmo delle macchine

La prima rivoluzione industriale: lavoro, economia e vita quotidiana. Classe quarta · gbprof e Libera.

## Studiare

Aprire `index.html` via HTTP/HTTPS. La copertina confronta il tempo dei campi e delle botteghe con quello della fabbrica; i pulsanti cambiano immagine, testo e destinazione. Entrare nelle otto lezioni oppure scegliere direttamente gli strumenti.

Il percorso contiene circa 5.900 parole di lezione, 10 approfondimenti (incluso il riassunto), 80 saperi irrinunciabili, 48 termini ricercabili, 8 mappe concettuali, una carta geografica e due schemi funzionali, 8 figure/prospettive, 18 snodi cronologici, 24 domande di ripasso e 16 domande finali. Il quiz finale riprende due quesiti per lezione per un ripasso cumulativo. Ogni errore rimanda al recupero della lezione pertinente.

L’ambiente riutilizza il modello `Ancien-regime-illuminismo`: History Focus, Osserva, Appunti, Ripassa, evidenziazioni, esportazione TXT e dimensioni del testo. Tutti i testi sono disponibili anche in `testi.html`, senza JavaScript e stampabili. Le mappe hanno descrizioni testuali e download SVG.

## Dati e offline

Non sono presenti account, analytics, database studenti, sincronizzazione o invio di appunti. I dati rimangono nel browser con prefisso `prima-industriale:`. Il comando nel footer cancella soltanto quei dati. Esportare gli appunti per conservarli prima di cancellare dati del browser. Le normali richieste HTTP possono essere registrate dall’hosting secondo le sue regole: questa PWA non gestisce i log del server.

Il service worker richiede HTTPS (oppure localhost durante lo sviluppo). Aspettare “Percorso pronto offline” dopo la prima visita connessa. Sono precaricati lezioni, illustrazioni, mappe, strumenti comuni e pagine di privacy/accessibilità. I siti delle fonti e gli altri percorsi richiedono la rete, salvo autonomo salvataggio. Su iPad il percorso può essere aggiunto alla schermata Home dal menu Condividi di Safari; installazione e disponibilità dello spazio dipendono da browser e sistema.

## Aggiornare

La destinazione è `Storia/Prima-rivoluzione-industriale/`. Non occorre una build per usare la PWA: HTML, CSS, JavaScript e immagini sono già pronti. Componenti condivisi: `../../pwa-common/` e `../ui-focus/`, mantenuti invariati.

- Testi editoriali e apparati: `content/`.
- `node tools/genera.mjs`, dalla cartella del modulo: rigenera dati, testi statici, mappe concettuali e copertina.
- `python tools/figure.py`: rigenera carta, schemi e icone (richiede Pillow).
- `python tools/cache.py`: aggiorna elenco e versione della cache dopo le modifiche.
- `js/app.js`: ambiente di lettura adattato dal modello; `js/offline.js`: registrazione offline.
- `js/scope.js`: espone al footer comune il solo prefisso di questo percorso.

Il manifest e il service worker hanno scope relativo alla cartella. Il service worker elimina esclusivamente vecchie cache `prima-rivoluzione-industriale-`. Non si devono copiare namespace e identificativi di altre PWA.

Per il collaudo browser del repository sono aggiunti alla radice un comando di anteprima Vite e la relativa configurazione. Sono strumenti di sviluppo: il server pubblico continua a servire direttamente i file statici. Vedere `COLLAUDO.md` per prove e limiti effettivi.

Per ripetere i test automatici, dalla radice: `npm ci` e `npm run test:industriale`. Il generatore richiede Node 20.11 o successivo; collaudo eseguito con Node 24.
