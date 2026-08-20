# Le rivoluzioni del 1848-1849

La cartella tecnica mantiene il nome richiesto `Storia/1849`; il titolo storico del modulo è **Le rivoluzioni del 1848-1849**. Domanda generatrice: **perché il 1848 fu insieme una rivoluzione politica, nazionale e sociale, e perché la sua sconfitta non cancellò ciò che aveva messo in movimento?**

## Tesi e percorso

Crisi economica, costituzioni, questione nazionale e questione sociale produssero coalizioni ampie ma non omogenee. Quando si dovettero decidere suffragio, lavoro, confini, comando e guerra, quelle coalizioni si divisero. La restaurazione militare abbatté regimi e repubbliche, ma non cancellò riforme, partecipazione e linguaggio politico. Le sette lezioni vanno dalle cause europee a Francia, imperi e Francoforte, marzo italiano, guerra, Roma e Venezia, sconfitte ed eredità.

## Funzioni

Indice, ricerca, navigazione completa; timeline; tre carte ingrandibili; otto biografie; sette laboratori di fonti; attività salvate; laboratorio finale della tesi; quiz di 14 domande con recupero; taccuino ed esportazione; evidenziazione; stato di avanzamento; PWA installabile e offline; tastiera, focus, skip link, movimento ridotto, responsive e stampa.

## Architettura e uso

`js/data.js` è la fonte comune a interfaccia e PDF. Avvio locale: `python3 -m http.server` dalla radice, poi `/Storia/1849/`. Il service worker conserva il nucleo completo. Nessun dato personale è raccolto; appunti e progressi restano nel dispositivo.

## PDF

`python3 tools/generate_pdfs.py` produce sette lezioni, `fonti-in-dialogo.pdf` e `mappe-e-schemi.pdf`. Provenienze e licenze: `ATTRIBUTIONS.md`.

Sequenza: **Ideologie politiche → Rivoluzioni del 1848-1849**.
