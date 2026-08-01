# Architettura della rete

## Componenti comuni

- `Letteratura/rete-pwa/links.json`: registro dichiarativo di applicazioni, relazioni e ponti.
- `Letteratura/rete-pwa/bridge.js`: rilevamento dell’app, deep link, ritorno e rendering progressivo.
- `Letteratura/rete-pwa/bridge.css`: componenti accessibili adattati alla palette di ogni PWA.

Ogni app carica il ponte alla fine della propria inizializzazione. Nessuna pagina è spostata e nessun router globale sostituisce la navigazione originale.

## Tre livelli

### 1. Ponte contestuale

Un pannello viene inserito subito dopo una sezione identificata da un selettore stabile. Titolo e descrizione spiegano perché le destinazioni sono pertinenti. Se il selettore non esiste o il registro non è disponibile, il contenuto originale resta intatto.

### 2. Hub globale

Un elemento nativo `details/summary`, chiuso per impostazione predefinita, offre il manuale e poche PWA correlate. Non propone l’intero catalogo indiscriminatamente. Il controllo ha area minima di 44 px, focus visibile e variante mobile.

### 3. Collegamento profondo

Ogni URL conserva tre informazioni:

```text
destinazione?from=/Letteratura/sorgente/#sezione&topic=regola-semantica#ancora
```

- il percorso e l’ancora finali portano al punto preciso;
- `from` conserva il punto di partenza, anche in una nuova scheda;
- `topic` rende verificabile il motivo semantico del passaggio.

## Ritorno intelligente

1. Viene preferito un parametro `from` valido.
2. Sono accettati solo URL della stessa origine e dentro `Letteratura/`.
3. I parametri di rete vengono rimossi dalla sorgente prima di costruire un nuovo passaggio, evitando catene ricorsive.
4. `sessionStorage` conserva l’ultima sorgente come supporto al refresh, ma viene usato solo se il referrer appartiene alla rete.
5. Un ritorno verso la pagina corrente viene scartato.

Il normale pulsante “indietro” del browser continua a funzionare; il link “Torna al percorso precedente” è un’alternativa esplicita e stabile.

## Ancore e contenuti dinamici

Le ancore già presenti sono preservate. Per i titoli generati a runtime privi di `id`, il ponte assegna uno slug deterministico dopo che l’app ha costruito la pagina. Gli identificatori esistenti non vengono rinominati.

Nel manuale, l’arrivo a un’ancora dentro un capitolo chiuso attiva il comando originale di apertura, poi scorre e sposta il focus sul bersaglio.

## Offline e fallback

I sei service worker esistenti memorizzano le risorse comuni con la stessa versione (`v=2`) usata dai loader. Questo evita che una query di versione renda il ponte indisponibile offline.

Se `links.json` non può essere letto, `bridge.js` usa un registro minimo incorporato: l’hub e il ritorno restano disponibili, mentre i pannelli contestuali vengono omessi. Il contenuto e la navigazione originari non dipendono mai dal registro.

Il manuale non aveva e non riceve un service worker: rimane un documento autonomo, non un’app installabile. Aggiungere una strategia offline al manuale è un intervento separato, perché il file incorpora molti megabyte di risorse.

## Autonomia e dati

- Nessun namespace, manifest o service worker è unificato.
- Nessuna chiave `localStorage` viene cancellata o rinominata.
- Nessuna nota, quiz o stato utente viene letto dal ponte.
- La sola nuova persistenza è temporanea e vive in `sessionStorage`.
- Le regole CSS comuni sono limitate alle classi `ottocento-*` e alle varianti `data-app`.

## Aggiungere un ponte

1. Scegliere una sezione con relazione didattica esplicita.
2. Verificare pagina, maiuscole del percorso e ancora di destinazione.
3. Aggiungere una regola con `id`, `kindLabel`, titolo, descrizione, sorgente e destinazioni in `links.json`.
4. Eseguire `node Letteratura/docs/rete-pwa/verify-links.mjs`.
5. Aprire sorgente e destinazione in browser, poi provare ritorno, refresh, nuova scheda, mobile e offline.

