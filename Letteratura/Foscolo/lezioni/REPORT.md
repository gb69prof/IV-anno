# Autonomia verificabile — Correzione scorrimento Ortis-Parini

- **Obiettivo:** ripristinare lo scorrimento verticale della pagina `lezioni/ortis-parini-due-lezioni.html`.
- **Diagnosi:** il foglio condiviso `assets/css/style.css` applica a `body[data-page="lesson"]` altezza `100svh` e `overflow:hidden`, predisposti per un ambiente di studio a pannelli. La nuova dispensa web, invece, è una pagina lunga senza contenitore scorrevole interno.
- **Intervento:** sostituito soltanto l'attributo `data-page="lesson"` con `data-page="book"` nel body della pagina; CSS e JS condivisi non modificati.
- **Fonti:** HTML della pagina e CSS condiviso nel repository `gb69prof/IV-anno`.
- **Decisione:** usare un tipo di pagina distinto per evitare regressioni nelle altre lezioni interattive.
- **Verifiche:** rilettura del file GitHub aggiornata; contenuti principali e collegamento PDF ancora presenti. Test browser dello scorrimento e pubblicazione effettiva sul sito non verificati.
- **Commit:** `36686e7b2ebea67253aba2e735a141afddebf787`.
