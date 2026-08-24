# La Sinistra storica — riformare lo Stato liberale

PWA didattica per il IV anno della scuola secondaria superiore, parte del percorso IV-anno/Storia.

## Domanda generatrice

> La Sinistra storica rese davvero più democratico lo Stato liberale, oppure ne allargò soltanto la base senza cambiarne la natura?

## Percorso

1. Una rivoluzione senza barricate.
2. Scuola, voto e fisco: chi entra nello Stato?
3. Governare trasformando le maggioranze.
4. Una società che si organizza fuori dal Parlamento.
5. Proteggere l'economia, dividere gli interessi.
6. Dall'isolamento alla Triplice Alleanza.
7. Il colonialismo alla prova di Dogali.
8. Più democrazia o liberalismo allargato?

Il modulo contiene 48 sezioni narrative, fonti contestualizzate, biografie, timeline filtrabile, quattro visualizzazioni originali, attività salvabili, laboratorio finale e quiz di 20 domande con recupero mirato.

## Architettura

- js/data.js: sorgente unica per lezioni, fonti, apparati, mappe, biografie e quiz.
- index.html: copertina e accesso al percorso.
- app.html + js/app.js: applicazione a route hash, ricerca, progressione, taccuino, attività, evidenziazione e installazione.
- tools/generate_pdfs.py: genera otto lezioni, dossier fonti, dossier visuale e sintesi generale.
- service-worker.js: cache offline della PWA e dei materiali stampabili.

## Verifica locale

~~~bash
python3 tools/generate_pdfs.py
python3 -m http.server 8000
~~~

Aprire http://localhost:8000, verificare console, navigazione, quiz, salvataggi e modalità offline dopo il primo caricamento.

## Metodo storico

Il documento del docente è stato letto integralmente, verificato e ristrutturato secondo il Metodo gbprof. Il modulo distingue riforme effettive e limiti di applicazione, evita di ridurre il trasformismo a un vizio meridionale e presenta colonialismo e politica estera anche dal punto di vista delle società africane coinvolte.
