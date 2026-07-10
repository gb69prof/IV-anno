# Foscolo — Il laboratorio delle illusioni

Prototipo giocabile 3D, in prima persona, sul rapporto fra **meccanicismo**, **fratture biografiche e storiche** e **religione delle illusioni**. Il giocatore interpreta Foscolo e costruisce nel manoscritto dell’*Ortis* alcune illusioni necessarie. Il finale non può essere “vinto”: Jacopo resta dentro una struttura tragica.

## Avvio rapido

### macOS

1. Decomprimi la cartella.
2. Fai doppio clic su `start.command`.
3. Si aprirà il browser su `http://localhost:8000`.

Se macOS blocca il file, usa clic destro → **Apri** una prima volta.

### Windows

1. Decomprimi la cartella.
2. Fai doppio clic su `start.bat`.
3. Si aprirà il browser su `http://localhost:8000`.

### Avvio manuale

Dalla cartella del progetto:

```bash
python3 -m http.server 8000
```

Poi apri `http://localhost:8000`.

## Utilizzo da iPad sulla stessa rete Wi‑Fi

Sul computer avvia:

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Trova l’indirizzo locale del computer, per esempio `192.168.1.25`, e sull’iPad apri:

```text
http://192.168.1.25:8000
```

I comandi touch compaiono automaticamente. Da Safari puoi usare **Condividi → Aggiungi alla schermata Home**.

## Controlli

- `W A S D`: movimento
- mouse: sguardo
- `Maiusc`: corsa
- `E`: interazione
- `J`: taccuino
- su tablet: joystick sinistro, trascinamento a destra, pulsanti `E` e `J`

## Struttura narrativa

1. **La macchina** — materia, necessità causale, nulla.
2. **Le fratture** — Zacinto/esilio, morte di Giovanni, Campoformio.
3. **Scrivere Jacopo** — scelta di tre illusioni fra patria, amore, memoria, arte e bellezza.
4. **Finale inevitabile** — la realtà storica e personale chiude lo spazio del manoscritto.

## Nota tecnica e grafica

Questa è una **vertical slice**, non un gioco AAA. Ambienti, luci, materiali, particelle, avatar e oggetti sono generati proceduralmente. Il personaggio di Foscolo è un modello provvisorio ispirato al ritratto fornito: capelli ricci castano‑ramati, basette, camicia bianca aperta e abito blu scuro.

Per raggiungere un vero realismo fotografico, la fase successiva richiede un personaggio creato in Character Creator, MetaHuman o Blender e animazioni dedicate. La struttura narrativa e le meccaniche sono già predisposte per quel salto di qualità.

## Dipendenza esterna

Al primo avvio serve una connessione internet per caricare Three.js da CDN. I file del gioco e il ritratto vengono poi gestiti dalla PWA; il motore 3D remoto può comunque richiedere la cache del browser.

## Materiali

I testi di partenza sono conservati in `docs/materiali/`. Il documento progettuale completo è in `docs/GAME_DESIGN.md`.
