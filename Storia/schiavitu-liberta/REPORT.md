# Report di realizzazione e collaudo — 9 settembre 2026

## Ambito

La PWA è contenuta in `Storia/schiavitu-liberta/`. Unico intervento esterno: collegamento tematico «Diritti e contraddizioni» in `Storia/index.html`, aggiunto dopo le sezioni cronologiche senza spostare le tappe esistenti. Nessuna modifica alle PWA precedenti o a `pwa-common`.

La PWA Foscolo è stata esaminata nelle pagine, nei CSS, nei JavaScript di lettura e workspace, nelle mappe, nel manifest e nel service worker. La nuova implementazione riprende copertina con hotspot, articolo e sidebar, focus, appunti e mappe a tutta pagina, con contenuti e grafica propri.

## Risultato

23 pagine HTML: dieci lezioni e tredici pagine di ingresso e strumenti. Sono presenti tutti i dieci temi richiesti, 19 schede di documenti, 15 protagonisti illustrati con fonti dei ritratti, 12 mappe SVG, una carta interattiva, 24 eventi nella timeline e cinque tracce di scrittura. Stringfellow rimane una voce documentaria nel confronto, nelle lezioni e nei test; la galleria comprende i quindici personaggi per i quali è stato acquisito un ritratto identificato.

La copertina allegata non è stata alterata. Hash SHA-256 dell’originale e della copia pubblicata: `d0443852865b7daeaa7fed60fced824975b97a6c2b4e29e52ebe9533f80c4662`. Le coordinate dei 24 hotspot sono registrate in `assets/dati/hotspots.json` sul riferimento 941×1672.

## Fonti e precisazioni storiche

Le 39 risorse in bibliografia comprendono National Archives, National Park Service, Library of Congress e Smithsonian per il contesto e l’iconografia, Massachusetts Historical Society, UNC Documenting the American South, Conseil constitutionnel, Assemblée nationale, Digithèque dell’Université de Perpignan, National Archives britannici, SlaveVoyages, fonti normative ONU/ILO e documenti ecclesiastici. Per ogni estratto sono indicati attribuzione, contesto, traduzione redazionale e collegamento al testo integrale.

Precisazioni recepite:

- Haiti: rivolta dal 1791, indipendenza 1804. Il 1789 disegnato sulla copertina è spiegato da una nota, senza modificare l’immagine.
- Dichiarazione USA del 1776 distinta dalla Costituzione del 1787. Tre quinti come criterio di rappresentanza e imposizione diretta, senza voto alle persone schiavizzate; regole elettorali dipendenti dagli Stati, con il caso del New Jersey.
- La clausola del 1808 limita temporaneamente il Congresso: il divieto d’importazione deriva dalla legge del 1807. Il commercio interno continua.
- Francia: applicazione diseguale dell’abolizione del 1794; nel 1802 mantenimento o ripristino con atti ed esiti territoriali differenti, incluso il fallimento a Saint-Domingue; abolizione del 1848.
- Gran Bretagna: 1807 tratta; legge del 1833, principale applicazione nel 1834; apprenticeship nelle Indie occidentali fino al 1838.
- USA: limiti della Proclamazione del 1863 e portata nazionale del XIII Emendamento del 1865, compresa l’eccezione penale.
- Sojourner Truth: trascrizione Robinson 1851 distinta dalla versione Gage 1863. Equiano: autobiografia come intervento politico e discussione sulla prima infanzia.
- Douglass: discorso del 5 luglio 1852; corretto il riferimento a giugno nel sommario della pagina del National Constitution Center.
- Haiti dopo l’indipendenza: terra, élite, lingue, disciplina agricola, autoritarismo e pressioni esterne. Nessuna equivalenza tra abolizione e uguaglianza immediata.
- Dati contemporanei: rapporto del 2022 con stime del 2021, senza presentarli come conteggio attuale o equivalenza giuridica con il sistema atlantico.

## Verifiche effettuate

| Controllo | Esito |
|---|---|
| Collegamenti relativi, ancore, immagini con alt e ID | 752 riferimenti locali controllati, nessun errore |
| Browser: tutte le 23 pagine a 390 e 1024 px | 46 caricamenti, nessuna immagine mancante, un titolo H1 e un main per pagina, nessun overflow orizzontale |
| Lezione USA a 768, 1024, 1366 e 1920 px | Nessun overflow orizzontale |
| Copertina | Identità dell’immagine, proporzioni, 24 aree e destinazioni verificate |
| Strumenti | Appunti e salvataggio, ingrandimento testo, Focus, pannelli Osserva/Appunti, confronto con feedback e quiz con risposte corrette/mancanti provati nel browser |
| Mappe | Apertura a tutta pagina, adattamento alla finestra, chiusura con Esc e ritorno del focus provati; correzione dell’altezza intrinseca SVG |
| Tastiera | Skip link e ordine iniziale di tabulazione provati; controlli nativi e focus visibile presenti |
| Service worker | 63 risorse restituite senza rete nel test Node; avvio, query string, pagina di fallback, aggiornamento e isolamento da cache di altre PWA verificati |
| JavaScript | Controllo sintattico riuscito |
| Ritratti | 15 immagini identificate, controllate visivamente e ridotte per l’offline |

Il test del service worker è ripetibile con `node tools/verifica-sw.mjs`; il controllo dei collegamenti con `python tools/verifica.py`.

## Limiti della verifica

Non è stato possibile provare l’installazione su un iPad fisico o certificare il comportamento con VoiceOver. Le larghezze indicate sono viewport CSS in iframe nel browser di collaudo, non dispositivi fisici. Nell’anteprima HTTP il service worker non è attivabile; la prova senza rete è stata eseguita nel test del worker. Il fullscreen nativo dipende dal browser: il dialogo a tutta pagina resta disponibile.

Il controllo HTTP delle 39 fonti esterne ha restituito 23 risposte 200; 16 risorse hanno dato 403, 502 o timeout dall’ambiente di verifica. Non sono state rilevate risposte 404. Il dettaglio è in `tools/controllo-fonti.json`: questi esiti non certificano l’indisponibilità per un browser ordinario, ma impediscono di dichiarare verificati dal vivo tutti i collegamenti esterni. I testi brevi e il contesto didattico sono conservati localmente; i testi integrali degli archivi richiedono la connessione.

## Pubblicazione

Destinazione: branch `main` del repository `gb69prof/IV-anno`, nella cartella richiesta. Il repository contiene un workflow preesistente di deploy sul server gbprof, attivato dai push su main; non è stato modificato.

- [Cartella GitHub](https://github.com/gb69prof/IV-anno/tree/main/Storia/schiavitu-liberta)
- [URL GitHub Pages previsto](https://gb69prof.github.io/IV-anno/Storia/schiavitu-liberta/) — dipende dall’attivazione di Pages sul repository.

L’identificativo del commit di pubblicazione è riportato nella consegna finale e nella cronologia GitHub.
