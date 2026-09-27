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

La prova visuale e di interazione in un browser reale su viewport iPad e il test offline completo non sono stati eseguibili in questa sessione: il browser disponibile impedisce l'apertura dei file locali. Questi controlli restano da effettuare prima di integrare la proposta.

## Integrazione concorrente

Durante il lavoro è comparsa su main una prima PWA Alfieri (commit `0645216722849dce9802cb8c5317e23b748cf9ca`) insieme al collegamento nell'indice di Letteratura. Nel repository UTILITY, la scheda Alfieri e la cache della linea del tempo sono già state aggiornate (commit `6300b0ff731b216e9f926f1a6cc2489e8d9a10d3`). La home attuale viene preservata nella struttura e nello stile, aggiungendo i nuovi collegamenti. Questa proposta viene perciò presentata separatamente per evitare la sostituzione automatica delle modifiche concorrenti. Il titolo della home e la destinazione dei link restano compatibili con quelli registrati nella linea del tempo.
