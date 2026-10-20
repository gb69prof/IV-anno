# L’Officina di Foscolo

PWA statica per il quarto anno: cinque opere, quattordici tappe complete.
Ortis (patria, Teresa, bacio, Santa Croce, Parini, Ventimiglia, Lorenzo), Alla sera,
In morte del fratello Giovanni, Sepolcri (affetti, memoria civile, poesia),
Grazie (bellezza civilizzatrice, velo e pietà).

Ogni tappa: contesto, testo originale, quattro passaggi interpretativi, mappa
responsive, poetica, collegamenti, quattro domande scritte e modelli dopo consegna.
Orientamento, indice tematico, sintesi e tre tracce trasversali completano l’app.

## Architettura
Questa cartella è la radice pubblicabile: `Letteratura/Officina-Foscolo/`.
Nell’anteprima Sites i medesimi file sono raccolti in `dist/`.
- content.js: testi, lezioni, mappe, domande e modelli.
- app.js: navigazione hash, verifica, localStorage, export TXT.
- atlas.js: geografia narrativa schematica dell’Ortis in SVG.
- styles.css: impaginazione editoriale responsive, LIM, stampa, movimento ridotto.
- manifest.webmanifest, sw.js, assets/: installazione e cache offline.
Nessuna dipendenza runtime, servizio IA o account studente. URL relativi per
hosting in sottocartella. Le fonti esterne richiedono la rete.

## Verifica e dati
LocalStorage `officina-foscolo-v2`: bozze, appunti, storico, autovalutazione.
Durante un tentativo lo studio è nascosto. Interrompere conserva la bozza;
consegnare apre i modelli; riprovare conserva il tentativo e nasconde i modelli.
Export TXT con modelli solo delle attività consegnate. Nessun voto automatico,
nessun invio al docente. Il blocco è didattico, non anti-ispezione del codice.

## Controlli
`node checks/verify.cjs`: 14 tappe, 5 opere, 56 domande, mappe, collegamenti,
navigazione, blocco modelli, risposte vuote, consegna, storico, export, escaping,
verifica finale, persistenza, manifest e asset offline. Sintassi controllata con Node.
Limite: controlli statici e Node VM. Nessuno screenshot, test su iPad/LIM o prova
reale a rete disconnessa eseguito in questa sessione. Offline implementato;
richiede HTTPS e primo caricamento completo.

## Fonti e altri progetti
Vedi FONTI.md e pagina Fonti. Foscolo, Foscolo-testi e Foscolo-gioco-3d restano
inalterati. L’indice di Letteratura aggiunge un ingresso all’Officina.
Foscolo in pubblico dominio; trascrizioni Wikisource attribuite con relativa
licenza. Mappe originali. Ritratto di Parini dai materiali gbprof.
