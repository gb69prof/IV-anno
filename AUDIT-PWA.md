# Audit e adeguamento delle PWA didattiche

Data dell’audit: **2 settembre 2026**

Repository: `gb69prof/IV-anno`, ramo `main`

## Inquadramento

`gbprof.it` ospita materiali didattici personali, pubblici e senza autenticazione; non è il sito istituzionale della scuola. La Direttiva (UE) 2016/2102 riguarda siti e applicazioni mobili degli organismi del settore pubblico; la sua applicazione diretta a questi materiali esterni non va presunta. Il progetto adotta comunque WCAG 2.1 AA e i requisiti tecnici pertinenti EN 301 549/AgID come obiettivo prudenziale, perché le lezioni saranno collegate dal sito scolastico.

Distinzione adottata:

- **obbligo normativo**: va determinato dal titolare/gestore e dalla scuola in base al ruolo effettivo e al contesto;
- **requisito tecnico**: criteri verificabili scelti per il repository, almeno WCAG 2.1 AA;
- **buona pratica**: misure ulteriori di privacy e robustezza, come caricamento volontario di YouTube e dipendenze locali.

Fonti ufficiali consultate:

- [W3C — WCAG 2.1](https://www.w3.org/TR/WCAG21/) e [panoramica WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/);
- [AgID — Linee guida sull’accessibilità](https://www.agid.gov.it/it/design-servizi/accessibilita/linee-guida-accessibilita-pa) e [quadro normativo](https://www.agid.gov.it/it/design-servizi/accessibilita/normativa);
- [EUR-Lex — Direttiva (UE) 2016/2102](https://eur-lex.europa.eu/eli/dir/2016/2102/oj/eng);
- [Normattiva — Legge 4/2004](https://www.normattiva.it/uri-res/N2Ls?urn%3Anir%3Astato%3Alegge%3A2004-01-09%3B4=);
- [Garante — Linee guida cookie e altri strumenti di tracciamento](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876) e [FAQ cookie](https://www.garanteprivacy.it/faq/cookie).

Questo audit tecnico non è una certificazione legale né una dichiarazione di piena conformità.

## Censimento

- 92 file HTML, inclusi gli entry point sorgente dei progetti compilati;
- 28 manifest e 28 service worker;
- 110 PDF e 49 DOCX;
- famiglie principali: indici generali, Foscolo, Leopardi, Manzoni, Romanticismo, Settecento/Parini, manuali, PWA storiche, giochi 3D e due applicazioni React compilate;
- dati persistenti: `localStorage` per preferenze, appunti, progressi e autoverifiche; `sessionStorage` soltanto per ritorno temporaneo fra percorsi;
- nessun uso rilevato di cookie, analytics, pixel, fingerprinting o invio di risultati al server.

## Matrice iniziale, prima delle modifiche

| Problema | PWA interessate | Gravità | Intervento |
| --- | --- | --- | --- |
| YouTube caricato automaticamente | 14 pagine, 54 iframe | Alta privacy | Placeholder locale e caricamento solo su scelta; dominio `youtube-nocookie.com` |
| Skip link, focus, touch e riduzione movimento non uniformi | circa 60 pagine senza skip link comune | Alta accessibilità | CSS/JS condivisi gbprof |
| Cache eliminate senza limitarsi alla PWA proprietaria | 15 service worker | Alta robustezza | Namespace esclusivi e pulizia limitata al prefisso |
| Dati locali senza reset uniforme o con chiavi generiche | più famiglie | Alta privacy/usabilità | Scope per PWA, namespace e reset selettivo |
| Font/librerie CDN a runtime | 2 esperienze 3D | Media privacy/offline | Dipendenze Three.js locali con licenza |
| Zoom bloccato | 2 pagine | Alta accessibilità | Rimozione di `user-scalable=no`/`maximum-scale=1` |
| Immagini senza `alt` | 16 segnaposto QR in un manuale | Media | Testo alternativo conciso |
| Homepage grafiche senza H1 HTML esplicito | Foscolo, Leopardi, Manzoni | Media | H1 accessibile conservando grafica e hotspot |
| Manifest con icona risolta nella cartella sbagliata | Colle-vulcano | Alta PWA | Correzione alla fonte e nuova build |
| Giochi/ambienti immersivi senza percorso testuale immediato | 3 esperienze | Alta inclusione | Link visibile alle lezioni testuali equivalenti |
| Privacy/accessibilità non descritte in modo comune | tutte | Media trasparenza | Due pagine generali, senza footer istituzionale |

## Modifiche applicate

È stato creato lo standard condiviso `pwa-common/`:

- skip link e landmark principale di recupero;
- focus visibile, target touch, reflow, wrapping e `prefers-reduced-motion`;
- `aria-current`, regioni dinamiche annunciabili e gestione del focus nei dialog;
- placeholder video con informativa discreta e attivazione volontaria;
- footer didattico comune con Privacy, Accessibilità e reset selettivo dei dati locali;
- hardening dei link in nuova scheda.

Altri interventi:

- standard inserito in tutti i 92 HTML e nelle cache delle PWA;
- pagine generali `privacy.html` e `accessibilita.html`, senza simulare un sito o una dichiarazione AgID della scuola;
- `localStorage` separato per PWA e correzione delle chiavi generiche nelle app Leopardi-testi e Prova;
- service worker corretti per non cancellare cache altrui; pagine informative disponibili offline;
- build React A-Zante e Colle-vulcano rigenerate, bundle obsoleti rimossi;
- miniature YouTube remote sostituite con copertine locali in A-Zante;
- Three.js, OrbitControls e licenze conservati localmente nelle esperienze che usavano CDN;
- equivalenti testuali collegati alle mappe legacy e alle esperienze 3D;
- strumento riutilizzabile `tools/audit-pwa.mjs` e script per applicare lo standard alle future pagine/service worker.

## Verifiche eseguite

- `node tools/audit-pwa.mjs`: **0 errori, 0 avvisi**;
- sintassi di tutti i JavaScript: **0 errori**;
- 28 manifest: JSON e proprietà essenziali validi, **0 icone mancanti**;
- precache di 28 service worker: **0 risorse mancanti**;
- HTML: **0 immagini senza `alt`**, **0 iframe senza `title`**, **0 blocchi dello zoom**, **0 iframe remoti caricati staticamente**;
- cookie/tracker: nessuna chiamata rilevata nel codice attivo;
- build di A-Zante e Colle-vulcano completate;
- risposta HTTP 200 su 14 percorsi rappresentativi, inclusi pagine generali, lezioni, giochi, app React e risorse comuni.

Non è stato possibile completare in questo ambiente un collaudo con motore browser reale: il browser non era installato e il download del runtime è scaduto. Console, layout visivo, navigazione completa con VoiceOver/NVDA e ciclo offline reale restano quindi verifiche manuali necessarie prima dell’uso ufficiale.

## Stato finale

| Area | Problema trovato | Modifica eseguita | Stato |
| --- | --- | --- | --- |
| Inquadramento | Rischio di trasformare materiali esterni in portale PA | Separati obblighi, requisiti tecnici e buone pratiche; nessuna dichiarazione istituzionale simulata | ✅ risolto |
| Struttura HTML | Semantica, H1 e skip link non uniformi | Standard comune, H1 nelle homepage grafiche, landmark e skip link | ✅ risolto |
| Tastiera e modali | Focus e feedback dinamici non uniformi | `focus-visible`, trap controllato nei dialog, ritorno del focus, `aria-live` | 🟡 migliorato ma richiede verifica/manualità |
| Contrasto, zoom e responsive | Zoom bloccato e regole non uniformi | Zoom sbloccato, reflow/wrapping, touch target e movimento ridotto | 🟡 migliorato ma richiede verifica/manualità |
| Immagini | Segnaposto senza alternativa | Tutti gli `<img>` statici hanno `alt`; homepage grafiche conservate con HTML accessibile | ✅ risolto |
| Mappe | Informazione concentrata in immagini | Mappe conservate e collegate alle lezioni testuali corrispondenti | 🟡 migliorato ma richiede verifica/manualità |
| Video | Contatto automatico con YouTube | 54 iframe differiti, avviso discreto e `youtube-nocookie.com`; copertine locali | ✅ risolto |
| Dati locali | Reset e namespace non uniformi | Dati solo nel browser, scope per PWA e comando di cancellazione selettiva | ✅ risolto |
| Cookie e tracker | Necessità da verificare realmente | Nessun cookie/tracker rilevato; nessun banner inutile aggiunto | ✅ risolto |
| Dipendenze esterne | CDN e font a runtime | Librerie/font essenziali resi locali; fonti esterne solo su scelta | ✅ risolto |
| Sicurezza codice | `innerHTML`, link esterni e collisioni fra cache | Input controllabili sottoposti a escaping, link hardenizzati, cache isolate | ✅ risolto |
| Manifest e service worker | Icona errata, cache distruttive e pagine comuni non offline | Manifest corretto, 0 asset mancanti, cache versionate e limitate al proprio prefisso | ✅ risolto |
| Offline | Rischio di regressioni con risorse comuni | Risorse comuni e pagine informative aggiunte al precache | 🟡 migliorato ma richiede verifica/manualità |
| PDF/DOCX | Accessibilità dei singoli file non certificata | Lezioni HTML fungono da alternativa per i nuclei didattici; originali conservati | 🟡 migliorato ma richiede verifica/manualità |
| Server | Log, HTTPS e header non verificabili dal repository | Nessuna caratteristica inventata; limiti indicati nella privacy | 🔴 richiede intervento esterno al repository |
| Contatto | Email del gestore non disponibile nel repository | Placeholder chiaramente riconoscibile nelle pagine generali | 🔴 richiede intervento esterno al repository |

## Azioni eventualmente necessarie fuori dal repository

| Azione eventualmente necessaria fuori dal repository | Chi deve farla |
| --- | --- |
| Sostituire i due placeholder con un indirizzo email dedicato e realmente presidiato | Docente/gestore di `gbprof.it` |
| Verificare log tecnici, tempi di conservazione, HTTPS e header HTTP di sicurezza; aggiornare l’informativa solo con dati verificati | Gestore del server |
| Eseguire collaudo manuale su iPad/iPhone/desktop con tastiera, VoiceOver o NVDA, console e modalità offline; correggere eventuali ostacoli emersi | Docente con supporto tecnico/accessibilità |
| Se PDF o DOCX vengono consegnati come materiali autonomi invece dell’HTML, verificarli e renderli accessibili o fornire esplicitamente l’alternativa HTML | Docente che distribuisce il materiale |
| Valutare il collegamento ai materiali nel proprio processo di accessibilità e garantire un canale scolastico per richieste di accomodamento, senza attribuire `gbprof.it` alla scuola | Scuola/RTD o referente accessibilità |
