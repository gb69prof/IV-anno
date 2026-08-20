# I moti rivoluzionari del 1820-1821 e del 1830-1831

PWA autonoma del percorso di Storia del IV anno. Domanda generatrice: **perché i moti del 1820-1831 furono quasi tutti sconfitti e, tuttavia, cambiarono il modo di fare politica in Europa?**

## Tesi e percorso

Pronunciamenti, società segrete e Costituzioni resero possibile un rapido innesco, ma non garantirono consenso, amministrazione, difesa né alleanze. Gli esiti differenti di Grecia, Belgio, Francia, Polonia e Stati italiani mostrano il peso di geografia, mobilitazione e sistema internazionale. Le sette lezioni seguono Restaurazione e opposizioni; linguaggi politici e Carboneria; onda del 1820; Sicilia e Piemonte; Grecia e decabristi; onda del 1830; fallimenti ed eredità.

## Funzioni

Indice e navigazione completa; ricerca globale; timeline; tre carte ingrandibili; sette biografie; sette laboratori di fonti; attività salvate per lezione; laboratorio finale della tesi; quiz di 14 domande con spiegazione e recupero; completamento, taccuino ed esportazione locale; evidenziazione; installazione e cache offline; navigazione da tastiera, focus visibile, skip link, riduzione del movimento, layout responsive e stampa.

## Architettura e uso

`js/data.js` è la fonte strutturata comune a interfaccia e generatore PDF. Avvio locale: `python3 -m http.server` dalla radice del repository, poi aprire `/Storia/Moti-20-30/`. Il service worker richiede HTTP/HTTPS e conserva il nucleo dell'app e i PDF. Gli appunti restano nel `localStorage` del dispositivo e non vengono trasmessi.

## PDF

`python3 tools/generate_pdfs.py` genera sette lezioni in `assets/pdf/lezioni/`, il dossier `fonti-in-dialogo.pdf` e `mappe-e-schemi.pdf`. Le fonti e le immagini sono documentate in `ATTRIBUTIONS.md`.

Sequenza: **Rivoluzione francese → Napoleone → Restaurazione → Moti 1820-1831 → Ideologie politiche → Rivoluzioni 1848-1849**.
