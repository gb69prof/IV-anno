# Collaudo · Prima rivoluzione industriale

Data: 10 settembre 2026. Percorso: `Storia/Prima-rivoluzione-industriale/`.

## Ambiente e limiti

Anteprima locale supervisionata con Vite; browser Chromium remoto. Controlli desktop nella finestra del browser e in viewport 1280×900, tablet 820×1180 e mobile 390×844 mediante iframe locale con dimensioni fissate. Sono prove di disposizione responsive, non prove su iPad/iPhone o smartphone fisici. Il confronto visivo con la copertina dell’Illuminismo è stato eseguito nella stessa anteprima.

L’anteprima usa HTTP su un host che Chromium non considera contesto sicuro: il browser non espone qui il service worker. Perciò non è stata verificata in questo ambiente l’installazione PWA né una sessione offline reale in Safari/Chromium. Il codice effettivo del service worker è stato eseguito separatamente con Cache API e rete simulate, utilizzando i file reali del repository. Per completare la verifica su dispositivi reali: aprire il percorso su HTTPS, attendere “Percorso pronto offline”, chiudere e riaprire in modalità aereo, verificare lezioni, immagini, appunti e quiz; ripetere dopo un aggiornamento.

## Prove nel browser

| Prova | Esito |
|---|---|
| Copertina e cambio ambientazione | Pulsante, stato premuto, spiegazione e collegamento alla lezione 5 verificati; copertina controllata su desktop, tablet e mobile. |
| Lettore | Lezioni aperte e controllate visivamente; struttura History Focus coerente con il modello. |
| Appunti | Testo digitato, salvataggio automatico e persistenza dopo ricaricamento verificati. |
| Evidenziazioni | Selezione reale con doppio clic, evidenziazione e persistenza dopo ricaricamento verificate. |
| Dimensione testo | Incremento tramite pulsante; livello `large` verificato nel DOM. |
| Ripassa e verifica | Schede aperte; tre risposte inviate con un errore intenzionale: risultato 2/3, spiegazione e recupero pertinente verificati. |
| Recupero | Dal feedback viene aperta la lezione 5 corretta. |
| Vocabolario | Ricerca “salario”: tre risultati pertinenti. |
| Carte, schemi e mappe | Mappa della lezione 1, carta geografica e schema energetico osservati ingranditi; zoom 150% e chiusura con Esc verificati. |
| Mobile | Lettore 390×844 e 820×1180, apertura del pannello Appunti e menu dell’indice verificati. |
| Indice Storia | Nuova voce raggiungibile e abilitata dal meccanismo HEAD esistente; periodizzazione trasversale 1750–1850. |
| Esportazione TXT | Pulsante attivato e messaggio di preparazione visualizzato. Il canale di automazione non ha restituito l’evento di download; il file scaricato dal browser non è stato ispezionato. Contenuto e nome del Blob sono verificati dal test DOM sottostante. |

È stato corretto un problema visivo ereditato dall’interazione dei componenti: il footer comune in flusso normale si sovrapponeva all’inizio del lettore fisso, soprattutto su mobile. Nella modalità di lettura il footer è nascosto localmente; un collegamento nel pannello Osserva porta a installazione e dati locali, dove il footer resta utilizzabile. Nessun file condiviso è stato modificato. La correzione è stata ricontrollata visivamente a 390×844.

## Prove automatiche riproducibili

Dalla radice del repository, con Node 24:

```sh
npm ci
npm run test:industriale
node tools/audit-pwa.mjs
```

`tools/verifica.mjs` nel modulo esegue il codice reale con jsdom e controlla:

- otto lezioni con otto sezioni, apparati completi e asset esistenti;
- 24 quesiti di lezione e relative correzioni;
- quiz finale completo: 16 risposte alternate corrette/errate, risultato atteso 8/16 e 5/10, spiegazioni, recuperi, esportazione del report e riavvio;
- appunti distinti per lezione, persistenza fra pagine, contenuto UTF-8 e nome del file TXT;
- evidenziazioni, ripristino e raccolta negli appunti; preferenza del testo separata;
- tutte le otto mappe e i tre schemi/carte, dialoghi e zoom;
- otto recuperi, dieci approfondimenti e tutte le altre sezioni;
- collegamenti al modello e a Schiavitù e libertà, con ancora della lezione dell’Illuminismo verificata;
- cancellazione dei soli dati del modulo, preservando una chiave di un altro percorso;
- presenza dei testi statici senza dipendenza da esecuzione JavaScript.

Il test del service worker esegue installazione, attivazione e richieste con rete simulata disattivata: tutte le 35 risorse del precache sono lette dai file reali; la vecchia cache del modulo è eliminata, quella dell’altro percorso rimane; le richieste agli altri percorsi non sono intercettate; è verificato il fallback di navigazione. Questo prova la logica del worker, non il ciclo di vita specifico di Safari.

**Esito dei test dedicati: superati.** Verificata anche la sintassi JavaScript e l’assenza di errori di whitespace nel diff.

L’audit generale segnala un errore già presente in `giochi/Foscolo/tests/browser.html` (titolo HTML assente) e un avviso preesistente in `Letteratura/Goldoni/timeline.html` (H1 non rilevato staticamente). Nessuna segnalazione riguarda la nuova PWA. Non sono stati modificati percorsi estranei per eliminare questi risultati.

Non sono stati effettuati test con screen reader, stampa fisica o installazione su dispositivi reali. `testi.html` contiene già testo e apparati nell’HTML e può essere letto con JavaScript disabilitato.
