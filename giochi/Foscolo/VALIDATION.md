# Verifica del 9 settembre 2026

## Esiti osservati

- Build statica completata; motore e asset serviti localmente.
- 7 test della logica superati: progressione, ordine, risposte errate, salvataggi danneggiati, joystick, collisioni e contenuti.
- 87 controlli nel browser superati tramite `tests/browser.html`: tutti gli otto livelli, tutte le scelte corrette/errate, raggiungibilità degli obiettivi, finale e riapertura della partita.
- Movimento da tastiera osservato; pausa e cancellazione degli input verificati.
- Due puntatori touch simultanei e relative cancellazioni verificati tramite eventi simulati.
- Movimento, sguardo e menu Start verificati con un controller standard simulato.
- Texture GPU stabili a 17 nei cambi di livello della prova in qualità automatica; nessun accumulo osservato.
- Resa controllata nel browser a 1280×800, 390×844, 1024×768 e 844×390. Nessuno scorrimento orizzontale. Nella prova telefono, menu con bersagli di 44 px, titolo e missione senza sovrapposizioni.

## Limiti delle prove

Le dimensioni telefono/iPad e gli input touch/controller sono stati simulati nel browser su Windows. Non è stata effettuata una prova su un iPad fisico, su Safari iOS o con un controller fisicamente collegato. Non si attribuisce a queste simulazioni una certificazione di compatibilità con tutti i dispositivi.

La navigazione del test completo usa la diagnostica locale per raggiungere gli oggetti, mentre un controllo di connettività separato verifica la percorribilità del campo di collisione generato. Il movimento e gli input sono verificati anche direttamente, con brevi tratti percorsi nel motore. Non equivale a una partita manuale integrale.

La cache offline contiene tutti i file locali previsti dalla build; la modalità aereo di un dispositivo fisico non è stata provata. Non sono stati misurati FPS su hardware mobile reale.
