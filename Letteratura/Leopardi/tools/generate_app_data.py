from pathlib import Path
import json
import re

from docx import Document


ROOT = Path(__file__).resolve().parents[1]


def docx_text(relative_path):
    doc = Document(ROOT / relative_path)
    paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    return "\n\n".join(paragraphs)


def txt_text(relative_path):
    return (ROOT / relative_path).read_text(encoding="utf-8").strip()


def slug(value):
    value = value.lower().replace("à", "a").replace("è", "e").replace("é", "e")
    value = value.replace("ì", "i").replace("ò", "o").replace("ù", "u")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


videos = {
    "introduzione": {
        "title": "Introduzione",
        "online": "https://youtube.com/shorts/XX9AAJd_e5c?si=NHPK3sHPVdn8anrI",
        "local": "VIDEO/1-LeopardiIntro.mp4",
    },
    "pessimismo-storico": {
        "title": "Pessimismo storico",
        "online": "https://youtube.com/shorts/okms117e0kY?feature=share",
        "local": "VIDEO/2-LeopardiPessimismoStorico_1080p.mp4",
    },
    "poetica": {
        "title": "Poetica",
        "online": "https://youtube.com/shorts/If1NOtDiyPI",
        "local": "VIDEO/3-Poetica_1080p.mp4",
    },
    "infinito-poesia": {
        "title": "Infinito - poesia",
        "online": "https://youtube.com/shorts/5ngp_G77iLA?feature=share",
        "local": "VIDEO/4-LeopardiInfinito_1080p.mp4",
    },
    "infinito-commento": {
        "title": "Infinito - commento",
        "online": "https://www.youtube.com/embed/IO4ugBvYVBQ?si=4GUG-ow286wrOKl-",
        "local": "VIDEO/4-LeopardiInfinito_1080p.mp4",
    },
    "pessimismo-cosmico": {
        "title": "Pessimismo cosmico",
        "online": "https://youtube.com/shorts/znaOWswKTno?feature=share",
        "local": "VIDEO/5-LeopardiPessimismoCosmico_1080p.mp4",
    },
    "natura-islandese": {
        "title": "Dialogo della Natura e di un Islandese",
        "online": "https://youtube.com/shorts/br5fkw1UuPI?feature=share",
        "local": "VIDEO/6-Islandese_1080p.mp4",
    },
    "bruto": {
        "title": "Bruto minore",
        "online": "https://youtube.com/shorts/QQhjL_ukLvI?feature=share",
        "local": "VIDEO/7-Bruto minore - Leopardi_1080p.mp4",
    },
    "saffo": {
        "title": "L'ultimo canto di Saffo",
        "online": "https://youtube.com/shorts/SlPift1LWGE?feature=share",
        "local": "VIDEO/8-Saffo_1080p.mp4",
    },
    "ginestra": {
        "title": "La ginestra",
        "online": "https://youtube.com/shorts/ZFBV2QtkhlQ?feature=share",
        "local": "VIDEO/9-La ginestra_1080p.mp4",
    },
    "sensismo": {
        "title": "Sensismo",
        "online": "https://youtube.com/shorts/i6fS5h9jvho",
        "local": "VIDEO/gbprof - sensismo_1080p.mp4",
    },
    "stoicismo": {
        "title": "Stoicismo",
        "online": "https://youtube.com/shorts/IXSkxOtY6sI?si=W1pCy92rGLuVPr_i",
        "local": "VIDEO/gbprof - stoicismo_1080p.mp4",
    },
    "meccanicismo": {
        "title": "Meccanicismo",
        "online": "",
        "local": "VIDEO/gbprof - meccanicismo_1080p.mp4",
    },
    "sconforto": {
        "title": "Leopardi - sconforto",
        "online": "",
        "local": "VIDEO/Leopardi - sconforto_1080p.mp4",
    },
}


def q(question, options, answer, recovery):
    return {
        "question": question,
        "options": options,
        "answer": answer,
        "recovery": recovery,
    }


items = [
    {
        "id": "filosofia-base",
        "section": "lezioni",
        "title": "Filosofia base e contesto culturale",
        "source": "lezioni/01-filosofia-base.docx",
        "map": "immagini/1-Leopardi-Filosofia-base.png",
        "videos": ["introduzione", "sensismo", "stoicismo"],
        "quiz": [
            q("Secondo il sensismo, da dove nasce la conoscenza?", ["Dalle idee innate", "Dall'esperienza sensibile", "Dalla sola immaginazione", "Dalla tradizione classica"], 1, "Rivedi il passaggio sul sensismo: per questa corrente la mente conosce attraverso sensazioni ed esperienza."),
            q("Che cosa entra in crisi tra Settecento e Ottocento?", ["La fiducia automatica nel progresso", "La lingua italiana", "Lo studio dei classici", "La poesia lirica"], 0, "Torna al nodo sul progresso: Leopardi eredita un mondo in cui scienza e felicita non coincidono piu automaticamente."),
            q("Perche e importante il confronto antichi/moderni?", ["Per distinguere latino e greco", "Per capire il rapporto tra natura, illusioni e civilta", "Per ricostruire la cronologia delle opere", "Per separare poesia e filosofia"], 1, "Ripassa il confronto antichi/moderni: gli antichi appaiono piu vicini alla natura e alle illusioni vitali."),
        ],
    },
    {
        "id": "fratture",
        "section": "lezioni",
        "title": "Le fratture",
        "source": "lezioni/02-fratture.docx",
        "map": "immagini/2-fratture.png",
        "videos": ["introduzione", "sconforto"],
        "quiz": [
            q("Che cosa rappresenta Recanati nel percorso leopardiano?", ["Un semplice luogo geografico", "Il simbolo del limite", "Una scuola romantica", "Una meta politica"], 1, "Rileggi la parte su Recanati: il luogo diventa una forma concreta del limite esistenziale e culturale."),
            q("Perche il corpo e una frattura decisiva?", ["Perche separa biografia e pensiero", "Perche impone a Leopardi l'esperienza del limite", "Perche impedisce ogni studio", "Perche spiega da solo tutta la sua poesia"], 1, "Ritorna al passaggio sul corpo: non e un dettaglio, ma un luogo in cui la realta si fa limite."),
            q("Quale passaggio matura dopo le illusioni giovanili?", ["Dal pessimismo storico alla lucidita cosmica", "Dal Romanticismo al teatro", "Dalla prosa alla sola poesia", "Dalla natura alla provvidenza"], 0, "Ripassa l'ultima frattura: Leopardi allarga il problema dalla storia all'intera condizione naturale."),
        ],
    },
    {
        "id": "immagine-mondo",
        "section": "lezioni",
        "title": "L'immagine del mondo",
        "source": "lezioni/03-immagine-mondo.docx",
        "map": "immagini/3-immagine-mondo.png",
        "videos": ["pessimismo-storico", "pessimismo-cosmico", "meccanicismo"],
        "quiz": [
            q("Nel pessimismo storico, qual e la causa principale dell'infelicita?", ["La storia e la civilta", "La Natura matrigna", "Il caso grammaticale", "La mancanza di memoria"], 0, "Rivedi la distinzione iniziale: nella fase storica il male sembra nascere dall'allontanamento dalla natura."),
            q("Nel pessimismo cosmico, che cosa cambia?", ["La Natura diventa rifugio", "Il dolore riguarda ogni vivente", "La poesia scompare", "La civilta risolve il problema"], 1, "Ripassa il passaggio al pessimismo cosmico: il dolore non e solo moderno, ma appartiene alla vita stessa."),
            q("Che cosa desidera l'uomo secondo Leopardi?", ["Un piacere infinito", "Solo beni materiali", "Una gloria politica", "Una felicita sempre misurabile"], 0, "Rileggi il nodo del desiderio: l'uomo vuole un piacere illimitato, ma incontra solo esperienze finite."),
        ],
    },
    {
        "id": "poetica",
        "section": "lezioni",
        "title": "La poetica",
        "source": "lezioni/4-poetica.docx",
        "map": "immagini/4-poetica.png",
        "videos": ["poetica", "sensismo"],
        "quiz": [
            q("Perche il vago e l'indefinito sono poetici?", ["Perche eliminano ogni pensiero", "Perche aprono spazio all'immaginazione", "Perche rendono il testo piu breve", "Perche imitano la prosa scientifica"], 1, "Ritorna alla poetica del vago: il limite visivo o sonoro attiva l'immaginazione."),
            q("Quale elemento concreto puo generare poesia in Leopardi?", ["Una siepe", "Una formula matematica", "Un decreto", "Un archivio"], 0, "Rileggi gli esempi sensibili: siepe, vento, voce lontana e paesaggio diventano occasioni interiori."),
            q("Che cos'e la rimembranza?", ["Un ricordo che trasfigura il passato", "Una rinuncia alla memoria", "Una regola metrica", "Una forma di satira"], 0, "Ripassa la rimembranza: il passato diventa piu vago e quindi piu poeticamente intenso."),
        ],
    },
    {
        "id": "scritti",
        "section": "lezioni",
        "title": "Gli scritti",
        "source": "lezioni/5-percorso-opere.docx",
        "map": "immagini/5-scritti.png",
        "videos": ["infinito-poesia", "natura-islandese", "ginestra"],
        "quiz": [
            q("Come va letto il percorso delle opere leopardiane?", ["Come tappe di un'evoluzione", "Come testi isolati senza rapporti", "Come pura autobiografia", "Come un manuale storico"], 0, "Rileggi l'apertura: ogni opera e una tappa del rapporto tra illusione, verita e solidarieta."),
            q("Che cosa mostra L'infinito nel percorso?", ["Il potere dell'immaginazione", "La social catena", "Il processo alla Natura", "La fine della poesia"], 0, "Torna alla parte sull'Infinito: la siepe limita lo sguardo e accende l'immaginazione."),
            q("Qual e l'approdo della Ginestra?", ["La solidarieta lucida tra uomini fragili", "La vittoria tecnica sulla natura", "La negazione del dolore", "Il ritorno all'idillio puro"], 0, "Ripassa la chiusura del percorso: La ginestra sostituisce le illusioni con consapevolezza e solidarieta."),
        ],
    },
    {
        "id": "infinito",
        "section": "percorso-testi",
        "title": "L'Infinito",
        "source": "percorso-opere/infinito.docx",
        "map": "immagini/infinito.png",
        "videos": ["infinito-poesia", "infinito-commento"],
        "quiz": [
            q("Che funzione ha la siepe nell'Infinito?", ["Chiude e basta", "Esclude lo sguardo e apre l'immaginazione", "Rappresenta la societa", "Cancella il paesaggio"], 1, "Rileggi i primi versi e il commento: l'ostacolo rende possibile immaginare lo spazio oltre il visibile."),
            q("Che cosa significa il dolce naufragio?", ["Un perdersi appagante nell'immensita immaginata", "Un fallimento politico", "Una fuga realistica in mare", "Una rinuncia al pensiero"], 0, "Ripassa la conclusione: il pensiero si perde nell'immensita e questa perdita diventa dolce."),
            q("Quale contrasto organizza il testo?", ["Finito e infinito", "Citta e campagna", "Commedia e tragedia", "Latino e italiano"], 0, "Rivedi la struttura: limite reale e infinito immaginato si richiamano continuamente."),
        ],
    },
    {
        "id": "bruto-saffo",
        "section": "percorso-testi",
        "title": "Bruto minore e L'ultimo canto di Saffo",
        "source": "percorso-opere/bruto-Saffo.docx",
        "map": "immagini/bruto-saffo.png",
        "videos": ["bruto", "saffo"],
        "quiz": [
            q("Che cosa accomuna Bruto e Saffo?", ["La ribellione individuale davanti al dolore", "La fiducia nella provvidenza", "La serenita idillica", "La celebrazione del progresso"], 0, "Rileggi l'introduzione: entrambi mostrano una protesta solitaria contro una condizione dolorosa."),
            q("Che cosa crolla in Bruto?", ["Gli ideali eroici garantiti da un ordine superiore", "La passione amorosa", "Il valore della metrica", "La memoria dell'infanzia"], 0, "Ripassa Bruto: il personaggio scopre che virtù, gloria e giustizia non hanno garanzia cosmica."),
            q("Qual e il centro del dolore di Saffo?", ["L'esclusione dalla felicita e dalla bellezza", "La nostalgia di Recanati", "Il rifiuto della filosofia", "La noia scolastica"], 0, "Ritorna alla sezione su Saffo: il suo dolore diventa simbolo della sproporzione tra desiderio e natura."),
        ],
    },
    {
        "id": "natura-islandese",
        "section": "percorso-testi",
        "title": "Dialogo della Natura e di un Islandese",
        "source": "percorso-opere/dialogo_natura-islandese.docx",
        "map": "immagini/natura-islandese.png",
        "videos": ["natura-islandese", "pessimismo-cosmico"],
        "quiz": [
            q("Che forma assume il dialogo?", ["Un processo alla Natura", "Una scena comica", "Un manuale scientifico", "Una lettera privata"], 0, "Rileggi la parte centrale: l'Islandese accusa la Natura e cerca una risposta sul dolore."),
            q("Qual e la risposta piu terribile della Natura?", ["Non si accorge del male che produce", "Vuole punire solo gli uomini", "Ama gli esseri viventi", "Promette una salvezza futura"], 0, "Ripassa la risposta della Natura: la sua indifferenza e piu radicale della cattiveria."),
            q("Perche l'operetta e decisiva?", ["Distrugge l'idea di una Natura materna", "Rende Leopardi ottimista", "Elimina la prosa dal percorso", "Dimostra il progresso tecnico"], 0, "Rivedi la conclusione: il testo porta il pessimismo cosmico alla sua forma piu chiara."),
        ],
    },
    {
        "id": "ginestra",
        "section": "percorso-testi",
        "title": "La ginestra",
        "source": "percorso-opere/ginestra.docx",
        "map": "immagini/ginestra.png",
        "videos": ["ginestra"],
        "quiz": [
            q("Che cosa rappresenta la ginestra?", ["La fragilita consapevole dell'uomo", "La vittoria sulla Natura", "La fuga nell'idillio", "L'oblio del dolore"], 0, "Rileggi il simbolo del fiore: fragile, esposto, ma dignitoso davanti al Vesuvio."),
            q("Che cos'e la social catena?", ["La solidarieta tra uomini consapevoli della comune fragilita", "Una teoria economica", "Una metrica poetica", "Un ritorno alla provvidenza"], 0, "Ripassa il tema morale del canto: gli uomini devono unirsi contro il nemico comune, la Natura."),
            q("Perche il paesaggio del Vesuvio e importante?", ["Mostra la potenza distruttiva della Natura", "Nasconde ogni verita", "Rende il testo pastorale", "Celebra la citta moderna"], 0, "Torna all'inizio del canto: lava, cenere e deserto sostituiscono il paesaggio idillico."),
        ],
    },
    {
        "id": "siepe-lava",
        "section": "approfondimenti",
        "title": "La siepe e la lava",
        "source": "approfondimenti/siepe-lava.docx",
        "map": "immagini/siepe-lava.png",
        "videos": ["infinito-commento", "ginestra"],
        "quiz": [
            q("Che cosa mette in rapporto questo approfondimento?", ["La siepe dell'Infinito e la lava della Ginestra", "La grammatica e la metrica", "Recanati e Firenze soltanto", "La commedia e il teatro"], 0, "Rileggi l'apertura: le due immagini mostrano due stagioni dello sguardo leopardiano."),
            q("Che cosa apre la siepe?", ["L'immaginazione dell'immenso", "La social catena", "La condanna della scienza", "La certezza religiosa"], 0, "Ripassa l'Atto I: il limite visivo della siepe diventa forza immaginativa."),
            q("Che cosa rivela la lava?", ["La verita materiale e distruttiva della Natura", "La protezione della Natura", "La scomparsa del dolore", "La serenita degli antichi"], 0, "Rivedi l'Atto II: la lava porta davanti agli occhi la fragilita dell'uomo."),
        ],
    },
    {
        "id": "macchina-anima",
        "section": "approfondimenti",
        "title": "La Natura-macchina con l'anima",
        "source": "approfondimenti/un meccanicismo con l_anima.docx",
        "map": "immagini/macchina-anima.png",
        "videos": ["meccanicismo", "natura-islandese"],
        "quiz": [
            q("Perche la Natura sembra avere un'anima?", ["Perche l'uomo ha bisogno di rivolgere l'accusa a qualcuno", "Perche Leopardi torna alla provvidenza", "Perche la Natura e sempre buona", "Perche il dolore scompare"], 0, "Rileggi il nucleo dell'approfondimento: la personificazione nasce dal bisogno umano di interrogare il male."),
            q("Dal punto di vista della ragione, che cos'e la Natura?", ["Una macchina senza intenzioni", "Una madre provvidenziale", "Un giudice morale", "Un popolo antico"], 0, "Ripassa il passaggio meccanicistico: la Natura produce vita e morte senza coscienza o fini morali."),
            q("Quale tensione resta aperta?", ["Tra macchina cieca e bisogno umano di responsabilita", "Tra poesia e assenza di testi", "Tra ottimismo e progresso", "Tra latino e volgare"], 0, "Rivedi la conclusione: il dolore chiede un responsabile anche quando la ragione non lo trova."),
        ],
    },
    {
        "id": "senso-natura",
        "section": "lezioni",
        "title": "Senso, natura e pensiero",
        "source": "lezioni/testo gbprof senso natura.txt",
        "map": "immagini/1-Leopardi-Filosofia-base.png",
        "videos": ["sensismo", "stoicismo", "meccanicismo"],
        "quiz": [
            q("Quale tema guida questo materiale?", ["Il rapporto tra sensi, natura e pensiero", "La sola biografia familiare", "La metrica latina", "La storia editoriale"], 0, "Rileggi il testo di supporto: serve a consolidare sensismo, natura e visione filosofica."),
            q("Quale video e particolarmente collegato al tema?", ["Sensismo", "La ginestra soltanto", "Saffo soltanto", "Nessun video"], 0, "Torna alla sezione video: il sensismo spiega il ruolo dei sensi nella conoscenza."),
            q("A che cosa serve questo approfondimento nel percorso?", ["A rinforzare le basi filosofiche", "A sostituire tutti i testi", "A evitare i test", "A parlare solo di stile"], 0, "Ripassa l'uso del materiale: chiarisce le categorie filosofiche che tornano nel percorso."),
        ],
    },
]


section_labels = {
    "lezioni": "Lezioni",
    "percorso-testi": "Percorso testi",
    "approfondimenti": "Approfondimenti",
}


for item in items:
    source = item["source"]
    item["content"] = txt_text(source) if source.endswith(".txt") else docx_text(source)
    item["videos"] = [videos[key] for key in item["videos"]]
    item["kicker"] = section_labels[item["section"]]


final_quiz = [
    q("Quale passaggio descrive meglio l'evoluzione leopardiana?", ["Dall'immaginazione alla verita lucida e solidale", "Dal teatro alla commedia", "Dalla scienza alla provvidenza", "Dalla prosa alla rinuncia"], 0, "Rivedi il percorso degli scritti: Infinito, Bruto/Saffo, Dialogo e Ginestra formano una progressione."),
    q("Quale coppia rende meglio la tensione centrale di Leopardi?", ["Desiderio infinito e realta limitata", "Ricchezza e potere", "Viaggio e conquista", "Satira e romanzo"], 0, "Ripassa poetica e immagine del mondo: il desiderio umano supera sempre cio che la realta concede."),
    q("Che cosa distingue pessimismo storico e cosmico?", ["Nel primo pesa la civilta, nel secondo la Natura stessa", "Nel primo non c'e dolore, nel secondo solo politica", "Sono identici", "Riguardano solo la metrica"], 0, "Torna alla lezione sull'immagine del mondo: il bersaglio si sposta dalla storia alla condizione naturale."),
    q("Che cosa fa la poesia leopardiana davanti al limite?", ["Lo trasforma in esperienza immaginativa o conoscitiva", "Lo elimina davvero", "Lo nasconde sempre", "Lo riduce a ornamento"], 0, "Rivedi la poetica: siepe, suoni, ricordi e paesaggi attivano l'interiorita."),
    q("Quale testo porta alla critica piu netta della Natura materna?", ["Dialogo della Natura e di un Islandese", "L'Infinito", "La polemica classico-romantica", "Il solo vocabolario"], 0, "Ripassa il Dialogo: la Natura appare indifferente e non finalizzata alla felicita umana."),
    q("Quale valore resta alla fine nella Ginestra?", ["La solidarieta consapevole", "La fuga dalle responsabilita", "Il trionfo dell'uomo sulla Natura", "La cancellazione del dolore"], 0, "Rivedi la social catena: l'unica nobilta e riconoscere la fragilita comune e unirsi."),
]


data = {
    "title": "Leopardi",
    "subtitle": "PWA didattica: lezioni, testi, approfondimenti, mappe, video, test e appunti.",
    "homeImage": "immagini/index.png",
    "sections": [
        {"id": "lezioni", "label": "Lezioni", "description": "Le basi filosofiche, biografiche, poetiche e il percorso delle opere."},
        {"id": "percorso-testi", "label": "Percorso testi", "description": "Lettura guidata delle opere: dall'Infinito alla Ginestra."},
        {"id": "approfondimenti", "label": "Approfondimenti", "description": "Nodi interpretativi e materiali di consolidamento."},
    ],
    "items": items,
    "finalQuiz": final_quiz,
}


target = ROOT / "app-data.js"
target.write_text("window.LEOPARDI_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
print(f"Generated {target}")
