# Romanticismo — Ambiente di studio

PWA didattica completa sul Romanticismo per la classe quarta. Mantiene il percorso gbprof:

`mondo precedente → fratture → nuova immagine del mondo → nuova letteratura → vie europee → via italiana → romanzo storico → conclusione`

e lo trasforma in uno spazio di lettura, osservazione, elaborazione e sedimentazione. La [PWA introduttiva sul Romanticismo](../Romanticismo/) rimane un percorso parallelo, non un prerequisito.

## Apertura

- Online: `https://gb69prof.github.io/IV-anno/Letteratura/Romanticismo-lezioni/`
- In locale: avviare un server HTTP nella radice del repository e aprire `Letteratura/Romanticismo-lezioni/`.

## Funzioni

- copertina-indice accessibile con hotspot, tastiera e indice testuale;
- lezione completa ricavata dalla dispensa e dai materiali già presenti;
- ambiente 2/3 + 1/3 su desktop e iPad orizzontale, con apparato visivo contestuale e taccuino scorrevole;
- dimensione del testo regolabile e doppio tema carta/notte;
- evidenziazioni persistenti nel browser;
- taccuino con appunti e citazioni non numerate, dotate di provenienza, copia ed esportazione TXT con data e ora;
- micro-antologia con brevi fonti autentiche e domande operative;
- sette mappe SVG locali ingrandibili e tre tavole illustrate conservate integralmente;
- timeline interattiva;
- barra stabile per saperi irrinunciabili, vocabolario e test;
- verifica ragionata con tre alternative, percentuale, voto orientativo, recupero mirato e ripetizione dei soli errori;
- ripresa dell’ultimo punto letto e comando esplicito per azzerare i dati locali;
- manifest e service worker per installazione e uso offline, con cache limitata a questa PWA.

## Registro delle correzioni — versione 7

- Eliminato il rinvio obbligatorio a un’altra PWA: questa versione contiene il percorso didattico completo.
- Conservate senza modifiche la copertina e le tre tavole illustrate originali.
- Trasformate le mappe concettuali da strutture HTML a immagini SVG locali con relazioni nominate e testo alternativo.
- Corretto il service worker: ora elimina soltanto le vecchie cache di `Romanticismo-lezioni` e non quelle delle altre PWA ospitate sullo stesso dominio.
- Resi contestuali i materiali visivi e corretto il conteggio degli evidenziati: mostra soltanto i passaggi non ancora trasferiti nel taccuino.
- Adeguata l’esportazione TXT con titolo, data e ora, appunti personali e citazioni dalla lezione.

## Ponti

La PWA non duplica i capitoli d’autore. I collegamenti relativi puntano alle PWA autonome:

- `../Manzoni/`
- `../Leopardi/`

## Privacy e dati locali

Appunti, citazioni, evidenziazioni, preferenze di lettura e tentativi della verifica usano soltanto `localStorage`; nessun dato personale viene inviato all’esterno.
