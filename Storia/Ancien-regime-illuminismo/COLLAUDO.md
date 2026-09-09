# Collaudo — Antico regime e Illuminismo

## Stato

Implementazione completa. Verifiche statiche e della logica superate. **Collaudo nel browser non completato: l’ambiente restituisce `net::ERR_BLOCKED_BY_CLIENT` sull’anteprima**, sia sul percorso previsto sia sulla sua radice. Il servizio di anteprima risultava avviato. Non si dichiara superato il requisito di collaudo visivo precedente alla pubblicazione su main.

## Eseguito

- 1.273 asserzioni con JSDOM: tutte le sezioni e le otto lezioni, applicazione della struttura History Focus, schede di ripasso, mini quiz, cambio fra Osserva/Appunti, salvataggio delle note nel rispettivo prefisso, evidenziazioni e loro rimozione, schede di approfondimento, otto mappe, apertura/chiusura delle modali e comando zoom.
- Quiz finale percorso con una risposta errata e quindici corrette: feedback specifici, risultato 15/16, collegamento al recupero e riavvio. Mini quiz delle otto lezioni: 3/3 con risposte corrette e motivazioni presenti.
- Navigazione risolta per tutti gli hash generati; collegamenti e asset locali controllati dal percorso `/IV-anno/Storia/Ancien-regime-illuminismo/`, non dalla root. Presenza delle destinazioni delle tre PWA collegate.
- Nessun errore JavaScript rilevato nell’esecuzione DOM simulata. Controllo sintattico dei JavaScript e controllo differenze Git.
- 96 asserzioni sul service worker eseguito in VM con Cache/Fetch in memoria: precache di 30 risorse; risposta da cache in assenza di rete per tutte; rimozione della vecchia cache del modulo senza cancellare cache di altre PWA; nessuna intercettazione di richieste a origini esterne. Scope e icone del manifest controllati.
- Revisioni strutturali: testi completi, nessuna sezione vuota, otto lezioni da 567 a 961 parole, nove schede tematiche più riassunto, quattordici biografie, trentanove definizioni, otto SVG con descrizione testuale. Circa 1 MB complessivo.
- Accessibilità verificabile nel sorgente: lingua italiana, landmark principale, salto al contenuto, focus visibile, pulsanti di almeno 44 px, testi reali separati dalle immagini, dialog nativi, alt, radio con etichette, feedback, navigazione delle schede con frecce e Home/End, stile per movimento ridotto, versione statica senza JavaScript.
- Componenti `pwa-common` e `ui-focus` riusati e non modificati. Isolamento dei dati con prefisso `ancien-lumi:`; uso dell’aggancio `HIST_DATA.meta.storageKey` per il comando comune di cancellazione.
- Collegamenti inversi pertinenti: sezione Libertà per chi? della PWA americana, lezione Illuminismo della PWA sulla schiavitù, copertina della PWA francese. Aggiornate le sole versioni delle cache interessate; mantenuti i rispettivi prefissi.
- Corretto nell’indice di Storia il vecchio percorso `Antico-regime-Illuminismo` verso `Ancien-regime-illuminismo` e indicato il nuovo modulo come disponibile nella modifica predisposta.

## Non verificato nell’ambiente attuale

- Resa visuale reale su desktop/LIM, iPad/tablet e smartphone, ingrandimento del testo al 200%, dimensionamento effettivo dei pannelli.
- Interazioni in un browser reale, scorrimento e gestione del focus da parte del browser, lettori di schermo e contrasto calcolato sulle superfici effettivamente renderizzate.
- Registrazione e controllo nativo del service worker, riapertura reale senza rete, installazione e comportamento specifico di Safari iPadOS.
- Risposta del percorso pubblico della nuova PWA: non pubblicato su main in assenza del collaudo obbligatorio.

JSDOM e la VM controllano logica e integrità, **non equivalgono a un collaudo end-to-end nel browser**. I polyfill usati nel test riproducono solo le API necessarie alla logica, non geometria, rendering o installazione nativa. Le verifiche browser rimangono il passaggio necessario prima della pubblicazione, salvo esplicita autorizzazione a procedere con questo limite.
