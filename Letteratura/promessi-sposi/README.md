# I Promessi Sposi - Atlante del testo

PWA didattica per consultare il testo originale dei *Promessi sposi* e attraversarlo con capitoli, personaggi, temi, luoghi, fasi narrative, percorsi guidati e passi chiave ragionati.

Il testo originale resta nei file dati. Schede, tag, percorsi e interpretazioni sono gestiti separatamente.

## Avvio locale

Per usare ricerca, dati JSON e service worker è consigliato servire la cartella con un piccolo server locale:

```bash
python -m http.server 8000
```

Poi aprire:

```text
http://localhost:8000/
```

Aprire direttamente `index.html` può funzionare per una consultazione parziale, ma non è ideale per PWA e caricamento dei dati.

## File principali

- `index.html`: struttura dell'app e sezioni navigabili.
- `styles.css`: interfaccia responsiva in stile biblioteca/manoscritto.
- `app.js`: ricerca, filtri, reader, schede cliccabili e collegamenti tra dati.
- `manifest.webmanifest`: configurazione PWA.
- `service-worker.js`: cache offline di interfaccia, dati e asset.
- `data/chapters.json`: testo diviso in capitoli e paragrafi con tag.
- `data/taxonomy.json`: personaggi, luoghi, temi e fasi narrative.
- `data/didactic_index.json`: schede didattiche e percorsi guidati.
- `data/key_passages.json`: passi chiave ragionati.
- `data/chapter_guides.json`: guida sintetica ai capitoli.
- `data/promessi_sposi_testo_pulito.txt`: testo pulito separato.

## Pubblicazione su GitHub Pages

1. Caricare tutti i file della cartella in un repository GitHub.
2. In GitHub aprire `Settings` -> `Pages`.
3. Scegliere `Deploy from a branch`.
4. Selezionare il branch, di solito `main`, e la cartella `/root`.
5. Salvare e attendere la pubblicazione dell'URL Pages.

La PWA usa percorsi relativi (`./`), quindi può funzionare anche se pubblicata in una sottocartella del sito GitHub Pages.
