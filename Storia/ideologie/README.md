# Le ideologie politiche italiane dopo il 1831

PWA autonoma del percorso di Storia del IV anno. Domanda generatrice: **dopo il fallimento delle società segrete, quale progetto poteva liberare e unire l'Italia?**

## Tesi e percorso

Dalla crisi carbonara non uscì una soluzione obbligata: mazziniani, federalisti democratici e moderati risposero diversamente a sei problemi costanti — monarchia/repubblica, unità/federazione, rivoluzione/riforme, popolo/sovrani, indipendenza/trasformazione sociale, insurrezione/preparazione. Le sette lezioni evitano il senno di poi e verificano risorse, limiti e mutamenti dei progetti fino alla soglia del 1848.

## Funzioni

Indice e navigazione completa; ricerca globale; timeline; tre mappe e matrici ingrandibili; sette biografie; sette laboratori di fonti; attività salvate per lezione; confronto finale sugli assi; quiz di 14 domande con spiegazione e recupero; completamento, taccuino ed esportazione locale; evidenziazione; installazione e cache offline; accessibilità da tastiera, riduzione del movimento, responsive design e stampa.

## Architettura e uso

`js/data.js` alimenta sito e generatore PDF. Avvio locale: `python3 -m http.server` dalla radice del repository, poi `/Storia/ideologie/`. Il service worker conserva app, asset e PDF. Stato, attività e appunti sono memorizzati solo in `localStorage`.

## PDF

`python3 tools/generate_pdfs.py` produce sette lezioni, il dossier delle fonti e il dossier di mappe e schemi. Bibliografia, testi e immagini: `ATTRIBUTIONS.md`.

Sequenza: **Moti 1820-1831 → Ideologie politiche → Rivoluzioni 1848-1849**.
