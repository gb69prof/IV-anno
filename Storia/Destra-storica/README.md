# La Destra storica — costruire lo Stato italiano

PWA didattica per il IV anno della scuola secondaria superiore, parte del percorso `IV-anno/Storia`.

## Domanda generatrice

> Come si costruisce realmente uno Stato dopo averne proclamato l'esistenza, chi sostiene i costi di questa costruzione e quali fratture produce il modello scelto dalla Destra storica?

## Percorso

1. Uno Stato che esiste solo sulla carta.
2. Unificare o decentrare?
3. Costruire cittadini italiani.
4. Chi paga lo Stato?
5. Una guerra dentro il nuovo Stato.
6. Esisteva già una questione meridionale?
7. Completare l'Italia, dividere gli italiani?

Il modulo contiene 42 sezioni narrative, 8 laboratori documentari, 13 biografie, 18 eventi in timeline, 4 visualizzazioni originali, attività salvabili, simulatore di bilancio, lettura guidata dei dati, laboratorio finale e quiz di 18 domande con recupero mirato.

## Architettura

- `js/data.js`: unica sorgente concettuale per lezioni, fonti, apparati, mappe, biografie e quiz.
- `index.html`: copertina e accesso al percorso.
- `app.html` + `js/app.js`: applicazione a route hash, ricerca, progressione, taccuino, attività, evidenziazione e installazione.
- `tools/generate_pdfs.py`: genera 7 lezioni, dossier fonti, dossier cartografico e sintesi generale.
- `service-worker.js`: cache offline della PWA e dei materiali stampabili.

## Verifica locale

```bash
python3 tools/generate_pdfs.py
python3 -m http.server 8000
```

Aprire `http://localhost:8000`, verificare console, navigazione, quiz, salvataggi e modalità offline dopo il primo caricamento.

## Metodo storico

Il materiale di partenza del docente è stato letto integralmente, controllato e ristrutturato. Il modulo distingue fatti documentabili, sintesi didattiche e questioni storiografiche aperte. Le formule riduttive sul brigantaggio e sul divario Nord-Sud sono sostituite da confronti fra fonti, indicatori e interpretazioni accademiche.
