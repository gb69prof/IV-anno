# Schiavitù e libertà

PWA didattica di Storia per gbprof, realizzata da Libera. Domanda guida: «Come può una società proclamare che gli uomini sono liberi e, nello stesso tempo, possedere esseri umani?»

Aprire `index.html` attraverso un server HTTP/HTTPS. Per l’installazione e il service worker occorre HTTPS (oppure localhost durante lo sviluppo). Nessuna build JavaScript, dipendenza runtime o account è necessario: i file pubblicati sono statici.

## Materiali

- Dieci lezioni: definizione di schiavitù; tratta atlantica; Illuminismo; USA; Francia; voci degli schiavizzati; Haiti; confronto delle tesi; abolizioni; passato e presente.
- Copertina originale con 24 hotspot e indice testuale equivalente.
- 19 schede di fonti primarie, estratti e traduzioni redazionali, contesto e domande di analisi.
- 15 protagonisti con ritratti documentati conservati localmente; attribuzioni in `assets/dati/portraits.json`.
- 12 mappe SVG, carta schematica interattiva dell’Atlantico, timeline di 24 eventi, test formativi e cinque tracce di scrittura.
- Appunti, esportazione TXT, progressi, evidenziatura temporanea, dimensione del testo, Focus / LIM e pannelli mobili.

Le pagine principali sono `percorso.html`, `documenti.html`, `mappe.html`, `protagonisti.html`, `carte.html`, `timeline.html`, `confronto.html`, `test.html`, `laboratorio.html`, `bibliografia.html` e `privacy-accessibilita.html`. Le lezioni sono in `lezioni/`.

## Aggiornamento dei contenuti

Modificare `tools/contenuti.py`, `tools/apparati.py` e, per struttura e mappe, `tools/build.py`. CSS e JavaScript sono in `assets/css/style.css` e `assets/js/app.js`.

Dalla cartella della PWA:

```sh
python tools/build.py
python tools/verifica.py
node tools/verifica-sw.mjs
node --check assets/js/app.js
```

Il generatore aggiorna le pagine, i dati e la versione della cache usando l’hash dei file, comprese le immagini. Rigenerare prima di pubblicare ogni modifica. I ritratti sono riproduzioni ridimensionate; gli originali e i crediti sono registrati nel dataset. La copertina fornita è mantenuta identica, byte per byte.

## Privacy, accessibilità e offline

I dati di studio restano nel localStorage del dispositivo con prefisso `schiavitu-liberta:v1:`; la pagina Privacy permette di cancellarli. Non vengono inviati appunti o risposte a un server. Non ci sono analytics, font remoti o risorse multimediali incorporate da terzi.

Sono integrate le due risorse di `pwa-common` del repository. La navigazione comprende skip link, focus visibile, etichette, alternative testuali, messaggi di correzione espliciti e riduzione del movimento. Le mappe aprono un dialogo a tutta pagina, con zoom e ritorno del focus; il fullscreen nativo dipende dalle capacità del browser.

Il service worker precachea 63 risorse locali e condivise dopo il primo caricamento completato. Le fonti esterne richiedono Internet. L’attivazione di una nuova versione elimina esclusivamente le precedenti cache con il prefisso della PWA. Il pulsante di aggiornamento attiva una versione già scaricata. Dimensione dei materiali: circa 5 MB, variabile con gli aggiornamenti.

Vedere [REPORT.md](REPORT.md) per controlli, precisazioni storiche e limiti della verifica.
