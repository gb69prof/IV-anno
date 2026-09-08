# Carlo Goldoni — Il mondo va in scena

PWA didattica standalone di gbprof e Libera, per il quarto anno della scuola secondaria di secondo grado.

## Percorso

1. Il mondo precedente
2. Le fratture
3. L’immagine del mondo
4. La poetica
5. Le opere: La locandiera (tre percorsi interni di lettura)
6. Conclusione

I testi completi riprendono le sei lezioni preparate con i materiali di gbprof. Ogni step comprende saperi irrinunciabili, vocabolario, sintesi, mappa, attività aperte e sei quesiti a scelta multipla. Citazioni, riferimenti e distinzioni interpretative sono conservati nelle lezioni.

## Funzioni

- Copertina illustrata con tre ingressi interattivi: città, teatro, locanda.
- Lettura con dimensione del testo regolabile, modalità concentrazione, evidenziature persistenti e copia delle selezioni negli appunti.
- Ripresa dal punto di lettura e completamento dichiarato dallo studente.
- Taccuino per step, esportazione individuale o complessiva in TXT.
- Sette mappe, integrate e scaricabili, con ingrandimento e descrizioni testuali.
- 36 domande; correzioni motivate, percentuale, voto in decimi, recupero dei soli errori e retest parziale. Ogni tentativo conserva le risposte e il risultato; il recupero aggiorna il punteggio dell’intera verifica senza sovrascrivere i tentativi precedenti.
- Salvataggio esclusivamente locale con chiave `gbprof-goldoni-v1`; nessun account, invio dati, cookie analitico o dipendenza JavaScript esterna.

## Installazione e offline

Servire la cartella con HTTPS (oppure localhost in sviluppo), aprire `index.html` e attendere «Lezioni e mappe pronte offline». Su iPad: Safari → Condividi → Aggiungi alla schermata Home. Manifest, icone e service worker hanno percorsi relativi, adatti sia a GitHub Pages sia alla sottocartella del sito gbprof.

Il service worker precachea l’intero contenuto locale. Le fonti esterne e i collegamenti al resto del sito richiedono rete. L’apertura diretta come `file://` consente la lettura HTML, ma non abilita PWA, cache e caricamento delle verifiche. I dati locali possono essere rimossi dal browser: è disponibile l’esportazione degli appunti.

## Struttura e manutenzione

- `index.html`: copertina, percorso e timeline.
- `lezioni/*.html`: testi completi e apparati, leggibili senza dipendenze di rete.
- `mappe.html`: galleria delle sette mappe.
- `app.js`, `style.css`: comportamento e presentazione.
- `assets/quizzes.json`: quesiti, spiegazioni, sezioni di recupero e nuova domanda aperta con risposta di confronto.
- `assets/lessons.json`: metadati e sintesi dei sei step.
- `sw.js`: cache esclusiva di Goldoni; non cancella cache di altre PWA.

Quando cambiano risorse già pubblicate, aggiornare il nome della cache in `sw.js` e mantenere completo l’elenco delle risorse. Non aggiungere file esterni indispensabili allo studio. Il retest viene valutato con `voto = max(1, round(corrette / totale × 10))`.

## Materiali e immagini

Lezioni e mappe provengono dal percorso Goldoni preparato con gbprof nel settembre 2026. Il ritratto è quello fornito dall’utente. Le illustrazioni della copertina e delle mappe sono creazioni evocative realizzate per questo percorso, non documenti iconografici del Settecento. Le mappe sono versioni WebP delle immagini già realizzate, con i medesimi concetti e collegamenti.

La PWA di Foscolo in `Letteratura/Foscolo` è il riferimento per la copertina illustrata e per l’ambiente di studio. I suoi file non sono modificati da questo intervento.
