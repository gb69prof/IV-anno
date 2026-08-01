# Changelog

## 2026-08-01 — Rete PWA dell’Ottocento

### Aggiunto

- registro semantico centrale con 7 moduli, 23 punti contestuali e 22 destinazioni profonde uniche;
- hub globale discreto e adattato all’identità visiva di ogni PWA;
- deep link con contesto, ritorno esplicito e supporto a refresh/nuova scheda;
- apertura automatica dei capitoli del manuale raggiunti tramite hash;
- fallback minimo se il registro non è disponibile;
- risorse comuni nelle cache offline delle sei PWA installabili;
- manifest mancante di Manzoni;
- validatore statico e documentazione completa.

### Modificato

- i link generici già presenti in Romanticismo – lezioni ora puntano a sezioni precise;
- versioni dei service worker incrementate per distribuire in modo coerente le nuove risorse;
- loader comuni inseriti nei JavaScript condivisi, senza duplicare markup nelle pagine multipagina.

### Preservato

- entry point e URL esistenti;
- navigazione, stile e contenuti delle singole PWA;
- chiavi e dati `localStorage` degli utenti;
- autonomia di manifest e service worker;
- file legacy di Leopardi, non coinvolti dalla generazione attiva.

