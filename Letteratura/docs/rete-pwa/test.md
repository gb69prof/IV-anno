# Collaudo

Data dell’ultima esecuzione: 2026-08-01.

## Controlli automatici

| Controllo | Esito |
| --- | --- |
| Sintassi JavaScript | Superata su 13 file modificati, inclusi i sei service worker |
| Parsing JSON | Superato per `links.json` e il nuovo manifest di Manzoni |
| `git diff --check` | Superato |
| Registro, percorsi e maiuscole | Superato: 7 moduli, 23 ponti contestuali |
| Destinazioni presenti | Superato per tutti i percorsi dichiarati |

Comando ripetibile:

```text
node Letteratura/docs/rete-pwa/verify-links.mjs
```

## Browser: matrice funzionale

Sono state aperte le 10 pagine sorgente distinte usate dal registro:

- manuale;
- tre lezioni di Foscolo;
- due pagine di Leopardi;
- poetica di Manzoni;
- Romanticismo;
- Romanticismo – lezioni;
- Parini.

Risultato: un hub per pagina, 23 pannelli attesi su 23, nessun duplicato e nessun selettore mancante.

Sono state poi aperte le 22 destinazioni profonde uniche. Tutte le ancore esistono nel DOM dopo l’inizializzazione. Sulle destinazioni diverse dalla sorgente il link di ritorno ricostruisce esattamente percorso, query e hash originali. Il ritorno verso la stessa URL viene correttamente omesso.

Il prototipo Romanticismo – lezioni ↔ Manzoni è stato provato anche con:

- normale navigazione e pulsante indietro;
- refresh sulla destinazione;
- arrivo diretto equivalente a una nuova scheda;
- ritorno esplicito al punto di partenza.

Il deep link del manuale apre il capitolo corretto e porta il bersaglio visibile vicino alla parte alta del viewport.

## Responsive e accessibilità

Viewport provati:

- desktop: 1280 × 720;
- tablet: 768 × 1024 su manuale, Manzoni, Romanticismo – lezioni e Parini;
- mobile: 390 × 844.

Il pannello contestuale resta nel contenitore; l’hub mobile usa margini laterali reali e non `100vw`, così la barra di scorrimento desktop non lo sposta fuori schermo. I link si dispongono in colonna sotto 620 px.

Tutti i controlli comuni misurati hanno altezza minima di 44 px. Il focus espone un contorno solido di 3 px. `summary`, link e navigazione usano elementi HTML nativi e nomi accessibili.

Nota: nell’emulazione mobile di Romanticismo – lezioni il documento originale misura 382 px contro 375 px di area utile, a causa della copertina/indice preesistenti e della barra di scorrimento desktop. I componenti della rete restano entro i 375 px e non aumentano l’overflow.

## Offline reale

Procedura:

1. caricamento online delle sei PWA dotate di service worker;
2. secondo caricamento per assicurare l’attivazione del worker aggiornato;
3. arresto del server locale;
4. nuova navigazione agli entry point.

Risultato: Foscolo, Leopardi, Manzoni, Romanticismo, Romanticismo – lezioni e Parini si riaprono tutte con titolo, contenuto e hub comune. Gli URL caricati usano `bridge.js?v=2`; non sono comparsi errori nella console del browser.

Il manuale non è incluso in questa prova perché nel repository non è una PWA installabile e non possiede service worker. Il suo funzionamento online, i ponti e i deep link sono stati verificati.

## Dati locali e regressioni

Il diff non modifica le funzioni che leggono o scrivono note, quiz o stato utente. Non vengono eseguite cancellazioni globali di `localStorage` o cache applicative. I bump di cache eliminano soltanto le precedenti versioni dello stesso service worker, secondo il comportamento già presente nelle singole PWA.

## Verifiche da ripetere dopo la pubblicazione

- attendere il deploy GitHub Pages della branch/PR se previsto dal repository;
- aprire una volta ogni PWA online per installare il nuovo worker;
- verificare offline dopo l’attivazione;
- controllare installazione e icone di Manzoni su un dispositivo reale;
- fare uno smoke test in Safari iOS, dove gestione della cache e standalone mode differiscono da Chromium.

