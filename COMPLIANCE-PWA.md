# Checklist gbprof per nuove PWA didattiche

Questa checklist è un controllo tecnico prudenziale per materiali didattici esterni usati dalla scuola. Non trasforma la PWA in un sito istituzionale e non sostituisce una verifica legale o un test con tecnologie assistive.

Legenda:

- **[O] Obbligo da verificare**: dipende dal soggetto che pubblica, dal contesto d’uso e dalla normativa vigente.
- **[T] Requisito tecnico**: obiettivo del progetto, almeno WCAG 2.1 AA e requisiti pertinenti EN 301 549/AgID.
- **[B] Buona pratica**: misura prudenziale che riduce rischi e migliora l’esperienza.

## Accessibilità e struttura

- [ ] **[T]** `lang="it"`, `title` univoco, un H1 significativo e gerarchia H1/H2/H3 coerente.
- [ ] **[T]** Landmark `header`, `nav`, `main`, `footer` e `aside` usati secondo funzione.
- [ ] **[T]** Skip link “Vai al contenuto” funzionante e destinazione focalizzabile.
- [ ] **[T]** Link comprensibili fuori contesto; pulsanti con nome accessibile e `type` corretto.
- [ ] **[T]** `aria-current="page"` nella navigazione; ARIA usata solo quando l’HTML nativo non basta.
- [ ] **[T]** Form con label, istruzioni, errori associati e feedback dinamici tramite `role="status"`/`aria-live`.
- [ ] **[T]** Dialog con titolo, focus iniziale, focus contenuto, chiusura da tastiera e ritorno al controllo di apertura.
- [ ] **[T]** Tabelle con intestazioni reali; evitare tabelle per il layout.

## Tastiera, focus e screen reader

- [ ] **[T]** Tutte le funzioni sono raggiungibili e attivabili con tastiera, senza trap.
- [ ] **[T]** Ordine del focus coerente; evitare `tabindex` positivo.
- [ ] **[T]** Focus sempre visibile (`:focus-visible`) e non coperto da elementi fissi.
- [ ] **[T]** Quiz, taccuino, evidenziatore, menu e modali provati con sola tastiera.
- [ ] **[B]** Prova almeno VoiceOver/Safari su iPad o NVDA/Firefox su desktop.

## Aspetto, contrasto e dispositivi

- [ ] **[T]** Contrasto minimo WCAG AA per testo, controlli, bordi e stati di focus.
- [ ] **[T]** Nessuna informazione affidata solo a colore, forma, posizione o suono.
- [ ] **[T]** Zoom non bloccato; leggibilità al 200% e reflow fino a 320 CSS px senza perdita di contenuto.
- [ ] **[T]** Layout provato su smartphone, iPad e desktop, in orientamento verticale e orizzontale.
- [ ] **[B]** Target touch almeno 44 × 44 CSS px quando possibile.
- [ ] **[T]** Animazioni non indispensabili ridotte con `prefers-reduced-motion`.

## Immagini, mappe e documenti

- [ ] **[T]** Immagini informative con `alt` breve e utile; decorative con `alt=""`; funzionali nominate per l’azione.
- [ ] **[T]** Testo, titoli e navigazione non esistono soltanto dentro una homepage-immagine.
- [ ] **[T]** Le mappe restano visibili e hanno un equivalente testuale quando contengono informazioni indispensabili.
- [ ] **[O/T]** PDF e documenti distribuiti come materiali autonomi sono accessibili oppure affiancati da un’alternativa HTML equivalente.

## Video e servizi esterni

- [ ] **[B]** Nessun iframe YouTube caricato all’apertura: placeholder locale → pulsante → iframe.
- [ ] **[B]** Prima dell’apertura è indicato che si stabilirà una connessione con YouTube.
- [ ] **[B]** Usare `youtube-nocookie.com`; ogni iframe ha `title` e controlli da tastiera.
- [ ] **[T]** Sottotitoli e alternativa testuale presenti quando il video è necessario alla comprensione.
- [ ] **[B]** Font, librerie e immagini essenziali sono locali; le fonti esterne si aprono solo su scelta dell’utente.

## Privacy e dati locali

- [ ] **[O]** Verificare cosa viene davvero raccolto prima della pubblicazione; aggiornare l’informativa generale.
- [ ] **[O/B]** Nessun login, database studente, analytics, profilazione, fingerprinting, heatmap o telemetria non necessaria.
- [ ] **[T]** Quiz, appunti, progressi ed evidenziazioni restano nel browser e non vengono inviati al server.
- [ ] **[T]** Le chiavi `localStorage` hanno un prefisso univoco per PWA.
- [ ] **[T]** È disponibile “Cancella i dati salvati su questo dispositivo”, limitato ai dati della PWA corrente.
- [ ] **[O]** Non aggiungere un banner cookie se non esistono tracker o memorizzazioni non tecniche che richiedono consenso.
- [ ] **[O]** Log, conservazione e accessi del server vanno descritti soltanto dopo verifica dell’infrastruttura.

## Sicurezza

- [ ] **[T]** Input utente inserito con `textContent`/API DOM oppure sottoposto a escaping prima di `innerHTML`.
- [ ] **[T]** URL dinamici ammessi solo da dati controllati; niente `javascript:` o mixed content.
- [ ] **[T]** `target="_blank"` usa `rel="noopener noreferrer"`.
- [ ] **[B]** Dipendenze ridotte, locali, versionate e con licenza conservata; niente CDN runtime non necessarie.
- [ ] **[O/B]** HTTPS e header HTTP (almeno CSP, `X-Content-Type-Options`, `Referrer-Policy` e protezione framing secondo necessità) verificati sul server.

## Manifest, service worker e offline

- [ ] **[T]** Manifest JSON valido con `name`, `short_name`, `start_url`, `display`, colori e icone esistenti.
- [ ] **[T]** Registrazione e scope del service worker coerenti con la cartella della PWA.
- [ ] **[T]** Cache con namespace esclusivo: in `activate` eliminare soltanto vecchie cache della stessa PWA.
- [ ] **[T]** Aggiornare la versione cache quando cambia l’app shell.
- [ ] **[T]** Nessun file mancante nel precache; fallback offline ragionevole.
- [ ] **[T]** Privacy, accessibilità e risorse comuni restano consultabili offline.
- [ ] **[B]** Provare prima visita, aggiornamento, ricarica offline e disinstallazione su un browser reale.

## Verifica prima della pubblicazione

- [ ] Eseguire `node tools/audit-pwa.mjs`.
- [ ] Eseguire `node --check` sui JavaScript e una build pulita per i progetti compilati.
- [ ] Controllare console e rete senza errori sulle pagine principali.
- [ ] Percorrere almeno una lezione, un quiz, una mappa, un video e il reset dati con tastiera e touch.
- [ ] Non dichiarare “pienamente conforme” senza una verifica manuale completa.
