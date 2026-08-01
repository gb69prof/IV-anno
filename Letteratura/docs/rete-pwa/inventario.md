# Inventario tecnico e funzionale

## Superfici pubblicate

| Modulo | Entry point effettivo | Struttura | Stato PWA e dati locali | Integrazione scelta |
| --- | --- | --- | --- | --- |
| Manuale dell’Ottocento | `Letteratura/Ottocento_letterario.html` | HTML autonomo di grandi dimensioni, capitoli aperti dinamicamente | Non possiede manifest o service worker propri | Loader diretto, otto ponti contestuali e hub globale |
| Foscolo | `Letteratura/Foscolo/` | 10 pagine HTML, CSS e JavaScript condivisi | Manifest e service worker; appunti in `localStorage` | Loader condiviso nell’app, tre ponti contestuali, cache comune |
| Leopardi | `Letteratura/Leopardi/` | 19 pagine HTML; applicazione attiva in `assets/` | Manifest e service worker attivi; appunti e posizione del percorso in `localStorage` | Loader nell’app attiva, due ponti contestuali, cache comune |
| Manzoni | `Letteratura/Manzoni/` | 10 pagine HTML, CSS e JavaScript condivisi | Service worker; il riferimento a un manifest mancante è stato riparato | Loader condiviso, due ponti contestuali, cache comune |
| Romanticismo | `Letteratura/Romanticismo/` | Una pagina interattiva | Manifest e service worker; ultima sezione e quiz in `localStorage` | Loader condiviso, quattro ponti contestuali, cache comune |
| Romanticismo – lezioni | `Letteratura/Romanticismo-lezioni/` | Lezione lunga in pagina singola più materiali | Manifest e service worker; preferenze e stato in `localStorage` | Prototipo bidirezionale, due ponti contestuali, link esistenti resi profondi |
| Parini | `Letteratura/Parini/` | Una pagina interattiva | Manifest e service worker | Loader condiviso, due ponti contestuali, cache comune |

La cartella `Letteratura/manuale-ottocento-letterario/` non è un sito pubblicato: contiene sorgenti, dati e capitoli usati per produrre il manuale. Non è stata trattata come entry point e non le è stato inventato un `index.html`.

## Tecnologie

Tutte le applicazioni usano HTML, CSS e JavaScript senza framework né processo di build. L’integrazione comune segue quindi la stessa scelta: un file JavaScript, un foglio di stile e un registro JSON statico.

Non sono state modificate le chiavi `localStorage` esistenti. La rete usa soltanto `sessionStorage` con la chiave `ottocento.bridge.return.v1`, limitata al ritorno temporaneo tra percorsi.

## Osservazioni strutturali

- Foscolo, Leopardi e Manzoni condividono una famiglia visiva, ma restano applicazioni distinte.
- Leopardi contiene anche file di una generazione precedente alla radice (`app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`); le pagine attive usano invece `assets/js/app.js`, `assets/css/styles.css`, `service-worker.js` e `manifest.json`. La rete è stata collegata solo al ramo attivo.
- Manzoni dichiarava `manifest.json`, ma il file non esisteva. È stato aggiunto con nome, colori, start URL e icone già presenti.
- Il manuale apre e chiude i capitoli con logica propria; il ponte comune apre automaticamente il capitolo che contiene un’ancora profonda.

