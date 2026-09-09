# Rapporto di collaudo

Eseguito il 9–10 settembre 2026, prima del deposito del modulo.

## Verifiche automatiche

`node tests/verify.mjs`: **478 controlli superati**.

- Cinque lezioni complete, otto sezioni per lezione, nessun paragrafo perso nel montaggio; saperi e mini-quiz presenti.
- Tutte le rotte nei metadati, nei recuperi, nella timeline e nei collegamenti contestuali risolte.
- Tutte le chiavi bibliografiche definite; 24 mappe con titolo, descrizione SVG ed equivalente testuale HTML.
- Manifest relativo e icone presenti; risorse HTML locali esistenti; lingua e landmark.
- Service worker reale eseguito in un ambiente simulato: installazione, attivazione, pulizia limitata al proprio prefisso, conservazione della cache di un’altra PWA, recupero di **47 risorse senza rete**.
- Percorsi precache provati sotto `/IV-anno/`, senza dipendenza dalla radice del dominio. Nessuna intercettazione delle fonti esterne o delle pagine di altre PWA.
- Nessun invio di dati nel codice applicativo; namespace `ra-`; scope di cancellazione presente.
- Sintassi JavaScript verificata con `node --check`.

## Prove nel browser Chrome

| Area | Esito |
|---|---|
| Copertina desktop | Controllo visivo eseguito; navigazione, avvio del percorso, tappe e strumenti accessibili mediante collegamenti semantici |
| Cinque lezioni | Aperte tutte; 8 sezioni ciascuna; nessun overflow orizzontale desktop |
| Sedici schede | Aperte tutte, incluse Libertà per chi? e Riassunto generale |
| Ricerca | «Tea Act» restituisce le schede pertinenti; svuotando il campo tornano le 16 schede |
| Figure e timeline | Renderizzate 11 biografie e 24 voci cronologiche |
| Mappe | Galleria di 24 strumenti, apertura del dialogo, zoom, collegamento alla descrizione; chiusura con Esc |
| Appunti | Immissione desktop e mobile, salvataggio automatico, riapertura e download TXT; verificato il contenuto del file esportato |
| Evidenziazioni | Selezione di una parola, evidenziazione esatta, persistenza dopo riapertura, raccolta negli appunti, cancellazione |
| Mini-quiz | Provate tre risposte della lezione 1 con un errore: 2/3, spiegazione di ogni risposta e recupero pertinente |
| Quiz finale | Completate 15 domande, anche usando Invio; ottenuti 5/15 e 3,3/10, 15 voci nel report e 10 recuperi; esportazione TXT verificata |
| Recupero | Il collegamento del report apre la scheda «Diritti naturali e schiavitù» |
| Console | Nessun errore applicativo rilevato nelle verifiche; esclusi i messaggi dell’estensione del browser di collaudo |

## Responsive e accessibilità

Copertina verificata in viewport contenuti di 320, 390, 768 e 1024 pixel: nessun overflow orizzontale. Il controllo usa un iframe di dimensioni note nello stesso Chrome: è una prova del layout, non un test su hardware mobile.

Sul formato telefono provati i pannelli Appunti e Osserva, la scrittura, il dialogo delle mappe e la chiusura con Esc. Corrette durante il collaudo la visibilità del menu ordinario in History Focus e l’eredità dei colori nei pannelli laterali.

Verificati pulsanti e collegamenti semantici, gruppi radio con legenda, nomi dei dialoghi, tab di ripasso, feedback `aria-live`, focus visibile e ripristino dopo la chiusura. La regolazione del testo viene conservata nel namespace locale. La regola `prefers-reduced-motion` disattiva transizioni e animazioni.

Contrasti dei colori principali: inchiostro/avorio 13,59:1; testo secondario/carta 6,38:1; rosso scuro/carta 6,94:1. Questo controllo non costituisce una certificazione completa WCAG né una prova con tutti gli screen reader.

## Limiti dichiarati

- L’anteprima di collaudo è HTTP e non espone il service worker: l’offline è stato verificato con la simulazione descritta, non con una disconnessione fisica del browser. Registrazione e installazione richiedono HTTPS o localhost.
- L’installazione effettiva e il comportamento su Safari/iPadOS e Android fisici restano da verificare sul sito HTTPS pubblicato. Le istruzioni per installare sono incluse nella PWA.
- Le risorse esterne, i percorsi didattici vicini e la loro disponibilità offline non sono garantiti da questo modulo.
- Le carte geografiche sono schematiche, senza confini coloniali e senza scala di precisione.
- Il controllo di tutti i contenuti e delle correzioni storiche è documentato in ATTRIBUTIONS.md; nessuna affermazione di revisione scientifica esterna.

Le eventuali verifiche successive del deposito e del sito pubblico sono riportate nella consegna conclusiva.

## Verifica dopo la pubblicazione

Deploy automatico del repository riuscito sia sul server gbprof sia su GitHub Pages. L’indice di Storia riconosce la nuova voce come disponibile. Copertina e prima lezione aperte dal percorso pubblico; messaggio «Percorso pronto offline» e pulsante di installazione presenti in Chrome HTTPS. Nessun errore applicativo rilevato nella console pubblica.

Su GitHub Pages è stata rilevata una precedente copia HTTP del componente comune, caricata durante la visita all’indice prima del deposito. La cache v1.0.1 ricarica esplicitamente le risorse al precache e rivalida i contenuti dinamici per recuperare anche lo scope `ra-`. Il test automatico verifica questa modalità di aggiornamento. Gli eventuali errori di scrittura della cache durante un aggiornamento non impediscono di mostrare una risposta di rete valida.

La preparazione della cache è stata verificata anche nel browser pubblico. Rimangono distinti e non eseguiti il test fisico con rete disattivata e l’installazione sui dispositivi mobili reali.
