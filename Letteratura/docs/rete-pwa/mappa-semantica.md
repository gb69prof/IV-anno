# Mappa semantica

## Criterio di selezione

Un ponte è stato inserito quando aiuta a compiere almeno una di queste operazioni didattiche:

- passare dal quadro storico-letterario all’autore o al testo;
- confrontare risposte diverse allo stesso problema;
- seguire la trasformazione di una poetica in un’opera o in un genere;
- riconoscere una ripresa intertestuale esplicita.

Il registro contiene 23 punti contestuali e 22 destinazioni profonde uniche.

## Relazioni dirette o necessarie

| Relazione | Motivo | Esempi di ancore |
| --- | --- | --- |
| Manuale → autori e correnti | Il manuale fornisce il quadro; le PWA sviluppano autore, poetica e testi | `#foscolo-s5`, `#romanticismo-s8`, `#leopardi-s10` |
| Romanticismo – lezioni ↔ Manzoni | Il programma italiano “vero, utile, interessante” diventa poetica d’autore | `#romanticismo-italiano` ↔ `#4-1-le-tre-colonne-della-poetica` |
| Romanticismo ↔ Romanticismo – lezioni | Sintesi interattiva e lezione estesa sono due profondità dello stesso percorso | `#lezione-5` ↔ `#romanticismo-italiano` |
| Foscolo ↔ Parini | Il Parini storico diventa personaggio e coscienza civile nell’`Ortis` | `#prima-di-leggere` ↔ `#profilo` |
| Romanticismo ↔ Manzoni | Romanzo storico, verità e responsabilità legano genere e autore | `#lezione-7`, `#lezione-8` ↔ poetica manzoniana |

## Relazioni utili o comparative

- Foscolo ↔ Leopardi: crisi delle illusioni, materialismo, memoria e risposte al nulla.
- Leopardi ↔ Romanticismo: domande moderne condivise e dissenso rispetto al programma romantico italiano.
- Foscolo ↔ Romanticismo: autore di soglia tra eredità classica e fratture preromantiche.
- Manuale ↔ Parini: funzione civile, critica della nobiltà ed eredità illuministica.
- Manzoni ↔ Romanticismo europeo: dal modello di Walter Scott alla riflessione sul vero storico.

## Collegamenti evitati

- Nessun collegamento “tutti verso tutti”: avrebbe trasformato la rete in un elenco indistinto.
- Nessun pannello su ogni pagina: le pagine senza una relazione forte mantengono soltanto l’hub discreto.
- Nessun link alla cartella sorgente `manuale-ottocento-letterario/`, perché non è un entry point pubblicato.
- Nessun collegamento ai file legacy di Leopardi, perché non appartengono alla generazione attiva.
- Nessun ritorno basato soltanto sulla cronologia del browser: non funzionerebbe in una nuova scheda e sarebbe fragile dopo un refresh.

## Prototipo scelto

Il primo flusso verificato è stato `Romanticismo-lezioni/#romanticismo-italiano` → `Manzoni/Lezioni/poetica.html#4-1-le-tre-colonne-della-poetica` → ritorno al punto esatto.

È stato scelto perché la relazione era già implicita nei contenuti e parzialmente presente nei link originali, ma mancavano profondità, contesto e ritorno. Dopo il collaudo del prototipo, lo stesso schema è stato esteso alle altre applicazioni.

