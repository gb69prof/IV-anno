# Foscolo — Le soglie del tempo

Avventura didattica 3D per browser, creata per `IV-anno/giochi/Foscolo`. Tutti i file necessari al gioco sono locali: non servono CDN, account o servizi a pagamento.

## Giocare

La pagina iniziale è `index.html`, da servire via HTTP/HTTPS. La pubblicazione nel repository usa direttamente i file presenti in questa cartella.

In locale, con Node.js 22 o successivo:

```text
npm run dev
```

Aprire `http://localhost:4175`. Per la prova su un dispositivo nella stessa rete si può usare l’indirizzo LAN del computer, porta 4175. La modalità offline richiede HTTPS oppure localhost e almeno un caricamento completo online.

## Il percorso

1. Il mondo precedente — Antico Regime, Rivoluzione, ragione.
2. Le fratture — Zante, Campoformio, Giovanni, esilio.
3. L’immagine del mondo — materia, nulla eterno, religione delle illusioni.
4. La poetica — misura classica e inquietudine preromantica.
5. Ultime lettere di Jacopo Ortis — le lettere, patria e amore, Parini.
6. Le Grazie — bellezza e funzione civilizzatrice delle arti; opera incompiuta.
7. Dei sepolcri — affetti, virtù civile, durata della poesia.
8. Alla sera — fatal quiete, reo tempo, spirto guerrier; finale con il sonetto completo.

Ogni livello richiede di esplorare il paesaggio, comprendere i frammenti e risolvere una domanda di sintesi. Gli errori consentono di riprovare. Le tappe finali del sonetto vanno affrontate in ordine. I livelli superati restano visitabili dalla mappa.

## Comandi

| Dispositivo         | Movimento                        | Sguardo                                                            | Azione / menu                                                                    |
| ------------------- | -------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| PC                  | WASD, frecce; Maiusc per correre | Trascina il mouse, oppure attiva la cattura dal pulsante a schermo | E o spazio; J taccuino; M livelli; Esc pausa                                     |
| Controller standard | Levetta sinistra                 | Levetta destra                                                     | A interagisce/conferma; B o Start pausa; X livelli; Y taccuino; croce per i menu |
| Telefono e iPad     | Joystick a sinistra              | Trascina nella parte destra                                        | Pulsante Esamina e menu in alto                                                  |

Nella pausa si possono scegliere qualità grafica, sensibilità, audio e visibilità dei controlli touch. È possibile ritornare sul sentiero senza perdere i frammenti.

## Salvataggio e dati

I progressi e le preferenze sono conservati soltanto nel browser del dispositivo (`foscolo-soglie-v2`). Non sono sincronizzati tra PC e iPad. La partita non invia risposte a un server. In modalità privata, oppure quando lo spazio del browser non è disponibile, il salvataggio può non persistere.

## Contenuti e licenze

I contenuti didattici sono rielaborati dalle lezioni di GB Prof, consultate il 9 settembre 2026:

- https://gbprof.it/IV-anno/Letteratura/Foscolo/lezioni/introduzione.html
- https://gbprof.it/IV-anno/Letteratura/Foscolo/lezioni/fratture.html
- https://gbprof.it/IV-anno/Letteratura/Foscolo/lezioni/immagine-del-mondo.html
- https://gbprof.it/IV-anno/Letteratura/Foscolo/lezioni/poetica.html
- https://gbprof.it/IV-anno/Letteratura/Foscolo/lezioni/ortis-parini.html
- https://gbprof.it/IV-anno/Letteratura/Foscolo/lezioni/opere.html
- https://gbprof.it/IV-anno/Letteratura/Foscolo/lezioni/alla-sera.html

Le azioni nel paesaggio sono metafore didattiche, non ricostruzioni di eventi biografici o affermazioni scientifiche. I testi poetici di Foscolo sono di pubblico dominio.

Attribuzioni dei materiali in `CREDITS.md`. Architetture, scenari e interazioni sono composti in Three.js. Copertina e panorama sono immagini originali generate per questo progetto; vegetazione e texture sono asset CC0 ottimizzati per il web.

## Verifiche e build

```text
npm test
npm run build
```

La build genera `dist` e aggiorna `sw.js` nella cartella pubblicata, con l’elenco completo dei file offline. Rigenerarla quando si modificano sorgenti o asset.

La pagina locale `http://localhost:4175/tests/browser.html` esegue una partita automatizzata completa attraverso i controlli del gioco. Verifica risposte errate, sblocco dei livelli, salvataggi, raggiungibilità degli obiettivi, input da tastiera, due puntatori touch e controller simulato. Il rapporto distingue queste simulazioni da prove su dispositivi fisici. I file di test non sono inclusi in `dist` e le funzioni di diagnostica sono abilitate solo su localhost.

Serve un browser con WebGL 2. La qualità automatica riduce vegetazione, risoluzione e ombre sui dispositivi touch. I controller devono essere riconosciuti dal browser tramite la Gamepad API; si può iniziare premendo un pulsante del controller.
