# La Rivoluzione francese · gbprof

PWA didattica in italiano per il quarto anno, dalla crisi dell’Antico regime al colpo di Stato del **18–19 brumaio Anno VIII (9–10 novembre 1799)**.

## Percorso e contenuti

La struttura riprende le porte del Google Site originale: **diario, protagonisti (donne e uomini), club e gruppi, documenti**. La redazione è nuova, corretta e ampliata. I riferimenti al periodo successivo servono soltanto a distinguere gli esiti istituzionali.

- 6 lezioni di raccordo, 43 eventi, 27 protagonisti e voci collettive, 15 gruppi.
- 12 schede di documenti, confronto fra le costituzioni, fonti e note sulle correzioni.
- 20 saperi irrinunciabili, 30 voci di glossario, 5 attività argomentative.
- 28 domande: ogni tentativo ne seleziona 10, coprendo tutte le fasi, con spiegazioni e collegamenti di recupero.
- Ricerca locale nei testi, segni di lettura, ripresa dell’ultima scheda, caratteri ingrandibili e stampa.

Il sito non richiede dipendenze di produzione, account, chiavi API o build sul server. Tutti gli HTML sono già generati. I testi si leggono anche senza JavaScript; ricerca, test, progressi e offline richiedono JavaScript.

## Pubblicazione e installazione

Servire questa directory tramite HTTPS, conservando nomi e maiuscole. L’indice superiore si trova in `../index.html`; quello del quarto anno in `../../index.html`. Non aprire la PWA direttamente con `file://`: il service worker richiede HTTPS (o localhost in sviluppo).

Aprire `installazione.html` e attendere il messaggio di disponibilità offline. Il primo accesso scarica l’intero percorso, comprese immagini, dati della ricerca e domande. I collegamenti alle fonti esterne e agli indici superiori richiedono la rete. La cache può essere rimossa dal browser quando lo spazio è insufficiente.

Su iPhone/iPad usare Safari e **Condividi → Aggiungi alla schermata Home**. Nei browser che lo supportano compare il pulsante d’installazione. La procedura concreta può variare secondo versione e dispositivo.

Il service worker ha scope esclusivamente in questa cartella. Non elimina cache di altre PWA. Gli aggiornamenti sono versionati tramite hash: l’utente riceve un avviso e può applicare la nuova versione. I progressi sono solo in localStorage; non vengono trasmessi a servizi esterni. La pagina `privacy.html` consente di cancellarli.

## Modificare i contenuti

I file sorgente in `contenuti/` sono moduli Python con i testi; `tools/build.py` contiene i template. Modificare questi sorgenti, non gli HTML generati. Dopo modifiche a testi, CSS, JS, manifest o immagini:

```sh
python3 tools/build.py
python3 tools/verify.py
```

Il generatore ricrea pagine, indice di ricerca, domande, manifest e versione della cache. Non rimuove automaticamente vecchie pagine: in caso di eliminazione/rinomina di una scheda rimuovere anche l’HTML obsoleto, rigenerare e verificare. Le icone e le immagini sono già incluse in `assets/`.

Per aggiungere altri approfondimenti, creare una nuova cartella sotto `Approfondimenti/` e aggiungere una scheda nel suo `index.html`. Ogni nuova PWA deve conservare il proprio scope.

## Controlli ripetibili

`tools/verify.py` usa solo Python standard: controlla riferimenti locali, ancore, lingua, H1, immagini, cronologia, quiz, indice di ricerca, manifest e copertura offline. Sono state verificate 119 pagine (117 del percorso più i due indici), 4.086 riferimenti locali e 128 risorse precache.

Per i test di comportamento facoltativi:

```sh
npm install --prefix /tmp/rf-test jsdom@26 --no-audit --no-fund
NODE_PATH=/tmp/rf-test/node_modules node tools/test-app.cjs
```

Il test verifica segni di lettura, dimensione caratteri, memoria non disponibile, filtri, ricerca, quiz completo corretto/errato con recupero, precache senza rete e isolamento delle cache. Il service worker è testato in un ambiente simulato; questa verifica non equivale a un’installazione reale su ogni dispositivo. Le risorse esterne non sono scaricate nella cache.

## Fonti e immagini

La bibliografia ragionata, i collegamenti ai documenti e le correzioni sono in `fonti.html` e `contenuti/base.py`. I documenti sono presentati mediante **parafrasi italiane dichiarate**, non traduzioni integrali né false citazioni. Per i quaderni di doglianza è dichiarato che si tratta di una tipologia documentaria.

- Jean-Pierre Houël, *La presa della Bastiglia*, 1789: [Wikimedia Commons / BnF](https://commons.wikimedia.org/wiki/File:Prise_de_la_Bastille.jpg).
- François Bouchot, *Bonaparte al Consiglio dei Cinquecento*, 1840: [Wikimedia Commons / Versailles](https://commons.wikimedia.org/wiki/File:Bouchot_-_Le_general_Bonaparte_au_Conseil_des_Cinq-Cents.jpg). La data del dipinto è distinta esplicitamente dalla data dell’evento.

Le due opere sono in pubblico dominio; le copie incluse sono ridimensionate e convertite in WebP. Le icone sono una composizione tipografica originale.
