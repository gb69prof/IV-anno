# Installazione su iPad, iPhone e Android

## Soluzione consigliata: pubblicazione come PWA

Carica **tutto il contenuto** della cartella `italia-1861-game` in uno spazio web HTTPS. La struttura è già completa: non occorrono compilazione, database o servizi esterni.

### Con GitHub Pages

1. Crea un repository e carica nella radice tutti i file e le cartelle del gioco.
2. Nelle impostazioni del repository attiva **Pages** scegliendo il ramo principale e la cartella radice.
3. Apri l'indirizzo fornito da GitHub Pages sul dispositivo.

### iPad e iPhone

1. Apri il gioco con Safari.
2. Tocca **Condividi**.
3. Scegli **Aggiungi alla schermata Home**.
4. Avvia l'icona *Italia 1861* e ruota il dispositivo in orizzontale.

### Android

1. Apri il gioco con Chrome.
2. Tocca **Installa app** quando compare, oppure usa il menu del browser.
3. Avvia l'icona *Italia 1861* e ruota il dispositivo in orizzontale.

La prima apertura richiede la rete. Dopo il caricamento iniziale, il gioco viene conservato nel dispositivo e può essere utilizzato offline.

## Aggiornamenti

Quando sostituisci i file online, modifica il nome della cache nella prima riga di `service-worker.js` — per esempio da `italia-1861-v2` a `italia-1861-v3`. In questo modo i dispositivi riceveranno la nuova versione.
