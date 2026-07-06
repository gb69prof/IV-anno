# Leopardi · Biblioteca viva

PWA statica generata a partire dai materiali caricati.

## Contenuto
- Paper universitario: `data/paper.json`
- Catalogo opere: `data/catalog.json`
- Testi integrali: `data/works/*.json`
- Service worker: `sw.js`

## Uso
Apri `index.html` in un server locale oppure pubblica l'intera cartella su GitHub Pages / Netlify / Cloudflare Pages.
Per test locale:

```bash
python3 -m http.server 8000
```

Poi visita `http://localhost:8000`.

## Nota sul corpus
La PWA include i testi integrali presenti nei file caricati. Il catalogo critico segnala anche gruppi di scritti non presenti come testo integrale nei materiali.
