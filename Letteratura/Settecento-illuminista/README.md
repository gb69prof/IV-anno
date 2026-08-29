# Il Settecento illuminista — Tre vie alla libertà

PWA didattica installabile per la quarta superiore. Il percorso è composto da quattro ambienti di studio:

1. Il Settecento illuminista — la libertà come problema
2. Carlo Goldoni — liberarsi dalle maschere
3. Giuseppe Parini — liberarsi dai privilegi
4. Vittorio Alfieri — liberarsi dalla tirannide

Ogni lezione conserva il testo integrale fornito e lo organizza nei sei passaggi: mondo precedente, fratture, immagine del mondo, poetica, opere, conclusione.

## Ambiente di studio

Su desktop e iPad orizzontale la pagina usa una griglia 2/3 + 1/3: lezione a sinistra, apparato contestuale e taccuino a destra. Su iPad verticale e smartphone i tre ambienti diventano pannelli separati.

Sono disponibili:

- copertina-indice con hotspot responsive e indice semantico alternativo;
- evidenziazioni persistenti senza menu flottanti;
- inserimento singolo o cumulativo degli evidenziati nel taccuino;
- appunti e citazioni separati per lezione, senza numerazione;
- esportazione TXT UTF-8;
- mappe ingrandibili con zoom;
- materiali visivi sincronizzati ai sei passaggi;
- sintesi, saperi irrinunciabili e vocabolario;
- venti quesiti di sezione e otto quesiti finali;
- recupero mirato e ripetizione dei soli errori;
- tema chiaro/scuro, tre dimensioni del testo e avanzamento;
- installazione e funzionamento offline dopo il primo caricamento completo.

## Avvio locale

Servire questa cartella con un server HTTP e aprire la radice. Il service worker non funziona aprendo direttamente `index.html` dal filesystem.

## Persistenza

Tema, dimensione del testo, posizione di lettura, evidenziazioni, taccuini e risultati restano nel `localStorage` del dispositivo. Il comando «Azzera tutti i dati locali» cancella esclusivamente i dati di questa PWA.

