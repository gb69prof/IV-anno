# Vittorio Alfieri — Tragedia e libertà

PWA del quarto anno basata sui quattro materiali del docente elencati in `fonti.html`. Le sei lezioni principali riprendono l'ambiente di studio di `Letteratura/Foscolo`: pannelli di lettura e osservazione, mappe a schermo intero, evidenziature, taccuino esportabile, sintesi, glossario, verifica e recupero. Non sono presenti video.

## Contenuti

- Sei movimenti: mondo ereditato, fratture, immagine del mondo, poetica, opere, conclusione.
- Due laboratori: Saul e Mirra.
- Dieci domande per ciascuna delle otto nuove lezioni, tre alternative plausibili, ordine variabile, voto e retest degli errori.
- Otto mappe SVG locali, ritratto fornito dal docente, icone PNG da 180/192/512 pixel.
- Pagina `lezioni/scrittore.html` e relativi asset conservati dalla versione comparsa su main durante questo lavoro; restano accessibili dalla home e dall'indice. Questa pagina mantiene la propria interfaccia e il proprio test originari.

## Funzionamento

Servire la cartella tramite HTTPS o localhost. Manifest e service worker hanno scope limitato ad Alfieri. I dati di studio usano il prefisso `alfieri-study-v10-`; il comando di azzeramento non tocca quelli delle altre PWA. Il service worker rimuove esclusivamente le proprie vecchie cache.

## Verifiche effettuate

- Sintassi JavaScript, esistenza delle risorse locali, struttura del manifest.
- Tre opzioni uniche e una soluzione per tutti gli 80 quesiti; ancore di recupero presenti nei testi.
- Esecuzione della logica dei quiz con DOM simulato: punteggio pieno, 8/10 con errore e omissione, recupero limitato alle due domande, conservazione dello storico.
- Simulazione installazione e fetch del service worker: risorse presenti, lettura di una lezione senza rete, conservazione delle cache di altre app.

- Browser reale sul sito pubblicato: navigazione delle lezioni, apertura della mappa, test con 9/10 e recupero 1/1, salvataggio degli appunti verificato dopo ricaricamento.
- Collegamento dall'indice di Letteratura e scheda Alfieri nella linea del tempo verificati sul sito.

Il test offline è stato eseguito con simulazione del service worker; installazione e funzionamento offline su iPad fisico restano da verificare sul dispositivo.

## Pubblicazione

La PR #14 è stata integrata in main il 27 settembre 2026. La PWA è disponibile su https://gbprof.it/IV-anno/Letteratura/Alfieri/.

L'indice di Letteratura e la linea del tempo del repository UTILITY collegano la stessa destinazione. La home e la lezione sullo scrittore indipendente già presenti su main sono state conservate e integrate con i nuovi materiali.
