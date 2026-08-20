# L'Unità d'Italia

PWA didattica per la scuola secondaria superiore sul processo di unificazione fra il 1849 e Roma capitale. La domanda generatrice è: **come fu possibile unificare l'Italia, e perché lo Stato nato non coincise pienamente con la nazione immaginata dai diversi progetti risorgimentali?**

## Tesi e percorso

L'unificazione non è presentata come un esito inevitabile. Il percorso mette in relazione monarchia sabauda, Parlamento, diplomazia, guerre, reti patriottiche, rivoluzioni locali, iniziativa garibaldina e crisi degli Stati preunitari. Le sette lezioni distinguono condizioni, scelte, alternative contemporanee ed esiti imprevisti; arrivano alla costruzione amministrativa del Regno, al brigantaggio, al Veneto e a Roma.

Le tappe sono: laboratorio piemontese dopo il 1849; modernizzazione e ingresso nel sistema europeo; diplomazia e guerra del 1858-1859; annessioni dell'Italia centrale; Mille e conquista del Mezzogiorno; costruzione dello Stato e governo delle differenze; Veneto, Roma ed eredità aperte. Ogni lezione comprende problema, mondo precedente, fratture, attori, processo, conseguenze, fonte, attività, connessioni, sintesi, coordinate, saperi, vocabolario e risposta progressiva.

## Funzioni

Indice e ricerca; sette lezioni estese; timeline di 23 eventi; tre carte ingrandibili; sedici biografie; sette laboratori di fonti; attività e tesi salvate nel browser; quiz di 18 domande con spiegazione e recupero mirato; taccuino esportabile; evidenziazione; avanzamento; nove PDF; installazione PWA e lettura offline. L'interfaccia comprende skip link, focus visibile, controllo da tastiera, modalità a movimento ridotto, layout responsive e stampa.

## Architettura e uso

`js/data.js` è la fonte comune dell'interfaccia e dei PDF. Per l'avvio locale, eseguire `python3 -m http.server` dalla radice del repository e aprire `/Storia/Unita/`. Il service worker conserva il nucleo completo della PWA e rimuove soltanto le versioni precedenti della propria cache. Appunti, attività e progressi restano nel dispositivo; non vengono raccolti dati personali.

## Fonti e installazione

Il percorso mette in dialogo sette fonti primarie provenienti da Senato, Camera dei deputati e Archivi di Stato con studi di Riall, Banti, Isabella, Davis e Duggan. La documentazione completa è in `ATTRIBUTIONS.md`.

Per installare la PWA, aprire la versione pubblicata in un browser compatibile e scegliere **Installa** oppure **Aggiungi alla schermata Home**. Dopo il primo caricamento online, lezioni, ritratti, carte e PDF essenziali sono disponibili offline. Per ricevere una versione aggiornata è sufficiente riaprire la PWA con una connessione attiva.

## PDF

`python3 Storia/Unita/tools/generate_pdfs.py` rigenera sette lezioni, `fonti-in-dialogo.pdf` e `mappe-e-schemi.pdf`. Fonti, provenienze e licenze sono documentate in `ATTRIBUTIONS.md`.

Sequenza: **Rivoluzioni del 1848-1849 → Unità d'Italia → Italia postunitaria (tappa futura)**.
