# Rete delle PWA dell’Ottocento

Questa cartella documenta la rete semantica che collega il manuale e le sei PWA didattiche pubblicate in `Letteratura/`, senza fonderle in un’unica applicazione.

## Documenti

- [inventario.md](inventario.md): struttura, entry point, tecnologie, stato PWA e persistenza locale.
- [mappa-semantica.md](mappa-semantica.md): relazioni didattiche selezionate e collegamenti volutamente esclusi.
- [architettura.md](architettura.md): livelli della rete, deep link, ritorno intelligente, fallback e manutenzione.
- [test.md](test.md): matrice di collaudo, risultati, limiti e comandi ripetibili.
- [CHANGELOG.md](CHANGELOG.md): modifiche introdotte.

Il registro eseguibile della rete è [`../../rete-pwa/links.json`](../../rete-pwa/links.json). Per verificare percorsi, maiuscole e integrità delle relazioni:

```text
node Letteratura/docs/rete-pwa/verify-links.mjs
```

## Principi

1. Le PWA restano autonome per grafica, navigazione, manifest, service worker e dati locali.
2. I ponti compaiono solo dove esiste una relazione didattica spiegabile.
3. Ogni passaggio conserva il punto di partenza e offre un ritorno esplicito.
4. Un guasto al registro semantico non rende inutilizzabili le applicazioni.
5. L’integrazione è progressiva: HTML e JavaScript originali continuano a funzionare anche senza il livello comune.

