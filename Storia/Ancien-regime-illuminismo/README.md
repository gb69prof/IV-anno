# Quando il mondo smise di sembrare naturale

Antico regime, Illuminismo e nascita dell’uomo moderno. Classe quarta, a cura di gbprof e Libera.

## Usare il percorso

Aprire `index.html` via HTTP/HTTPS e scegliere **Entra nel Settecento**. La copertina confronta ordine ereditato e critica attraverso due pulsanti accessibili da tastiera e tocco. La luce è una metafora dichiarata, non un giudizio sul passato.

Otto lezioni (circa 5.600 parole), nove schede tematiche e un riassunto, quattordici biografie, tredici snodi cronologici, otto mappe SVG con descrizioni testuali, trentanove voci di vocabolario, sedici domande finali e ventiquattro domande per il ripasso delle lezioni. Ogni quiz spiega la risposta e rimanda al recupero. I tentativi si possono ripetere.

History Focus è lo stesso componente comune delle PWA di Storia. Nelle lezioni: **Osserva**, **Appunti**, **Ripassa**, regolazione del testo, evidenziazioni ed esportazione TXT. Gli strumenti di ripasso sono disponibili anche dalla pagina Recupero. La conclusione apre i collegamenti a Rivoluzione americana, Rivoluzione francese e Schiavitù e libertà.

`testi.html` offre tutti i testi in forma statica leggibile senza JavaScript e stampabile dal browser. Non è necessario installare dipendenze, eseguire build o disporre di un backend.

## Installazione e offline

Su Safari per iPad usare Condividi → Aggiungi alla schermata Home; sui browser compatibili usare il comando di installazione. Aspettare **Percorso pronto offline** dopo la prima apertura connessa. Il service worker precarica testi, immagini, mappe, icone e componenti condivisi. Fonti e PWA esterne richiedono la rete, salvo installazione autonoma dei rispettivi percorsi. L’installazione effettiva dipende da browser e sistema.

## Privacy

Nessun account, tracking, analytics o servizio remoto nel percorso. Appunti, evidenziati, preferenze e quiz sono salvati nel browser con prefisso `ancien-lumi:`. Non vengono inviati a un server. Il server che ospita le pagine riceve le normali richieste dei file e può avere propri log tecnici: la PWA non li controlla. Le fonti esterne vengono aperte solo su richiesta. Per eliminare lo stato locale usare il comando nel footer; per conservarlo esportare gli appunti. I dati non si sincronizzano fra dispositivi.

## Architettura

- `index.html`, `js/cover.js`: copertina narrativa.
- `app.html`, `js/app.js`: ambiente derivato dal modello Rivoluzione americana.
- `js/data.js`: metadati, apparati, fonti, quiz, descrizioni delle mappe.
- `js/content.js`: testi originali delle lezioni e degli approfondimenti.
- `css/style.css`: stile del modello, esteso localmente.
- `assets/img`: opere in pubblico dominio, mappe esatte e icone.
- `manifest.webmanifest`, `service-worker.js`: installabilità e cache isolata.
- `../../pwa-common/` e `../ui-focus/`: componenti comuni riusati senza modifiche.

Percorso previsto: `/IV-anno/Storia/Ancien-regime-illuminismo/`. Tutti gli asset usano riferimenti relativi. Dopo modifiche ai file precaricati aggiornare la versione della cache. Il service worker cancella solo cache del proprio prefisso.

Le citazioni letterali sono distinte dalle parafrasi. La formula sul dispotismo è indicata come sintesi didattica senza attribuzione certa. Il dipinto di Lemonnier è datato 1812 e presentato come ricostruzione retrospettiva. Vedere `ATTRIBUTIONS.md` per fonti e risorse e `COLLAUDO.md` per verifiche e limiti effettivi.
