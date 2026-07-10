# Foscolo — Il tempio delle illusioni

Esperienza didattica 3D in prima persona dedicata al pensiero di Ugo Foscolo. Il giocatore attraversa spazi autonomi e comprende progressivamente il rapporto tra **meccanicismo**, **nulla eterno**, **fratture biografiche e storiche** e **religione delle illusioni**.

## Avvio

Il gioco usa Three.js e va aperto tramite un piccolo server locale.

### Windows

Fai doppio clic su `start.bat`, quindi apri `http://localhost:8000` se il browser non si apre automaticamente.

### macOS

Fai doppio clic su `start.command`. Se macOS lo blocca al primo avvio, usa clic destro → **Apri**.

### Avvio manuale

```bash
python3 -m http.server 8000
```

Poi visita `http://localhost:8000`.

Al primo avvio è necessaria una connessione internet per caricare Three.js da CDN.

## Percorso attuale

1. **Tempio delle soglie** — interno di un tempio greco circolare; le coppie di colonne sono porte.
2. **Materia** — ingranaggi eterni, caduta e sostituzione della materia, quiz sul meccanicismo.
3. **Nulla eterno** — figure umane camminano, conversano e si dissolvono mentre la macchina continua; quiz sulle conseguenze esistenziali.
4. **Fratture** — Zante, Campoformio, morte di Giovanni ed esilio inglese diventano installazioni esplorabili; quiz di sintesi.
5. **Religione delle illusioni** — amore, patria, arte, bellezza, famiglia/affetti e memoria vengono accesi come forme consapevoli e necessarie; quiz finale.
6. **Sala delle opere** — prima galleria dedicata a *Ultime lettere di Jacopo Ortis*, *Dei sepolcri*, *Le Grazie*, *In morte del fratello Giovanni* e *Alla sera*.

Il percorso è sequenziale: una soglia si apre soltanto dopo il superamento del quiz precedente. Le risposte errate non producono una punizione arbitraria; invitano a osservare di nuovo lo spazio e a riprovare.

## Controlli

- `W A S D` oppure frecce direzionali: movimento
- mouse: sguardo
- `Maiusc`: corsa
- `E`: interazione
- `J`: taccuino
- tablet: joystick sinistro, trascinamento a destra, pulsanti `E` e `J`

## Funzioni

- sei ambienti 3D indipendenti e caricati senza modelli esterni;
- animazioni procedurali di ingranaggi, cadute, dissolvenze, particelle e libri;
- quattro fratture e sei illusioni da esplorare;
- quiz obbligatori e sblocco progressivo;
- taccuino didattico automatico;
- salvataggio locale;
- audio ambientale generato dal browser;
- controlli desktop e touch;
- PWA con cache dei file locali.

## Uso didattico

Il gioco non presenta le illusioni come una consolazione facile. La realtà materiale, la morte e le fratture restano. Amore, patria, arte, bellezza, famiglia e memoria sono invece costruzioni poetiche e morali che consentono di vivere umanamente dentro quella realtà.

La sala delle opere è volutamente un punto di arrivo provvisorio: le singole sezioni dedicate ai testi potranno essere sviluppate nella fase successiva.
