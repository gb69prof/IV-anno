# Napoleone — PWA didattica

Percorso interattivo per la scuola secondaria superiore costruito attorno alla domanda: **Napoleone conclude la Rivoluzione francese o la porta in Europa?**

## Struttura

- 7 lezioni estese con domanda generatrice, coordinate, sintesi, saperi irrinunciabili e lessico;
- 6 laboratori su fonti primarie o visive, sempre con provenienza, scopo e limiti;
- 3 mappe originali e ragionate;
- 8 biografie, timeline causale, ricerca globale, appunti locali ed evidenziatore;
- 4 attività argomentative e quiz finale di 14 domande con recupero mirato;
- manifest, service worker e cache completa per l'uso offline;
- 7 PDF delle lezioni e 2 dossier stampabili.

## Avvio locale

```bash
python3 -m http.server 8000
```

Aprire `http://localhost:8000/Storia/Napoleone/`.

## Rigenerare i PDF

Serve Python con `reportlab` e Node.js:

```bash
python3 Storia/Napoleone/tools/generate_pdfs.py
```

`js/data.js` è l'unica fonte dei contenuti testuali per sito e PDF.

## Scelte didattiche

Il modulo distingue esplicitamente fatti, testi delle fonti e interpretazioni. Evita l'alternativa celebrativa “genio o tiranno” e chiede invece di precisare soggetto, spazio, tempo e criterio. Modernizzazione, libertà e dominio sono trattati come categorie da verificare, non come sinonimi.

Il percorso continua da [Rivoluzione francese](../Rivoluzione-francese/) e conduce a [Restaurazione](../Restaurazione/).

## Accessibilità e privacy

Interfaccia responsive, navigazione da tastiera, focus visibile, skip link, `prefers-reduced-motion` e stili di stampa. Completamento e appunti restano nel `localStorage` del dispositivo e non vengono inviati a servizi esterni.

Licenze e provenienze delle immagini sono documentate in [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
