# La Restaurazione — PWA didattica

Percorso interattivo per la scuola secondaria superiore, a cura di **gbprof e Libera**.

## Domanda generatrice

> Si può restaurare un ordine politico senza poter restaurare il mondo che lo rendeva possibile?

## Le sei lezioni

1. Il mondo precedente
2. La frattura
3. L'idea di un mondo nuovo
4. L'Europa restaurata
5. Forza e limiti della Restaurazione
6. Liberali e conservatori

Ogni lezione contiene spiegazione problematica, sintesi, coordinate essenziali, saperi irrinunciabili, vocabolario e collegamenti a fonti, mappe e protagonisti.

## Funzioni

- copertina e indice interattivi;
- sei lezioni complete, leggibili anche offline;
- sette mappe e schemi, con carte storiche ingrandibili;
- laboratorio guidato su tre fonti;
- sei biografie interattive;
- timeline ragionata di quindici snodi;
- quiz finale con spiegazione, percentuale e recupero mirato;
- ricerca globale;
- evidenziazione temporanea del testo;
- taccuino locale con esportazione `.txt`;
- tracciamento delle lezioni completate;
- otto PDF stampabili;
- manifest e service worker per l'installazione come PWA;
- layout responsive e navigazione da tastiera.

## Avvio locale

Per la lettura di base si possono aprire `index.html` o `app.html` direttamente. Per installazione, cache offline e comportamento PWA completo è necessario un server locale:

```bash
python -m http.server 8080
```

Aprire quindi `http://localhost:8080/Storia/Restaurazione/` dalla radice del repository, oppure `http://localhost:8080/` se il server è avviato dentro questa cartella.

## Rigenerare i PDF

Il contenuto didattico ha una sola fonte, `js/data.js`. I PDF vengono generati da quella fonte:

```bash
python tools/generate_pdfs.py
```

Dipendenze: Node.js, Python 3 e `reportlab`.

## Struttura essenziale

```text
Restaurazione/
├── index.html
├── app.html
├── manifest.webmanifest
├── service-worker.js
├── css/style.css
├── js/
│   ├── data.js
│   ├── home.js
│   └── app.js
├── assets/
│   ├── img/
│   └── pdf/
└── tools/generate_pdfs.py
```

## Fonti e immagini

Il testo di partenza è `1-Restaurazione_revisionata.docx`, fornito da gbprof. Le integrazioni sono state verificate su fonti e repertori indicati in [ATTRIBUTIONS.md](ATTRIBUTIONS.md).

La cartella `Storia/Rivoluzione-francese` è stata usata soltanto come riferimento architettonico e grafico e non è stata modificata.

