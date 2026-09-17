#!/usr/bin/env python3
"""Rigenera la PWA statica. Solo libreria standard; nessuna build necessaria al deploy."""
from pathlib import Path
import sys,json,html,re,hashlib
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'contenuti'))
from base import PHASES,SOURCES
from diario import EVENTS
from persone import PEOPLE
from gruppi import GROUPS
from documenti import DOCUMENTS
from studio import ESSENTIALS,GLOSSARY,QUIZ,ACTIVITIES
E=html.escape
PAGES={};INDEX=[]
PH={x[0]:x for x in PHASES};EV={x[0]:x for x in EVENTS}
NAV=[('index.html','Home','home'),('diario.html','Il diario','diario'),('protagonisti.html','I protagonisti','persone'),('gruppi.html','Club e gruppi','gruppi'),('documenti.html','Documenti','documenti'),('studio.html','Studia e verifica','studio'),('cerca.html','Cerca','cerca')]
def paragraphs(s):return ''.join('<p>'+E(t)+'</p>' for t in s.split('\n') if t.strip())
def link(h,t):return f'<a href="{E(h)}">{E(t)}</a>'
def sources(ids):
 return '<section class="sources" aria-label="Fonti e letture"><h2>Fonti e letture</h2><ul>'+''.join('<li>'+link(SOURCES[k][1],SOURCES[k][0])+'</li>' for k in dict.fromkeys(ids))+'</ul><p>Le schede distinguono ricostruzione, interpretazione e limiti delle fonti. '+link('fonti.html','Metodo e bibliografia')+'. I collegamenti esterni richiedono la connessione.</p></section>'
def card(h,title,desc,kicker='',extra=''):
 return f'<a class="tile {extra}" href="{h}" data-page="{h}"><span class="kicker">{E(kicker)}</span><h3>{E(title)}</h3><p>{E(desc)}</p><span class="arrow">Esplora →</span></a>'
def figure(which):
 caption={'bastiglia':'Jean-Pierre Houël, La presa della Bastiglia (1789). Acquerello, BnF. Un’immagine contemporanea è una rappresentazione da interrogare, non una fotografia.','brumaio':'François Bouchot, Bonaparte al Consiglio dei Cinquecento (1840). Il dipinto ricostruisce il 10 novembre 1799 circa quarant’anni dopo: è anche una fonte sulla memoria napoleonica.'}[which]
 key='houel' if which=='bastiglia' else 'bouchot'
 alt={'bastiglia':'Folla e soldati davanti alle torri della Bastiglia, nel dipinto di Houël.','brumaio':'Bonaparte al centro dello scontro con i deputati, circondato da militari nel dipinto di Bouchot.'}[which]
 return f'<figure><img src="assets/{which}.webp" alt="{alt}" width="'+('1600" height="1216' if which=='bastiglia' else '1502" height="1600')+f'" loading="lazy"><figcaption>{E(caption)} {link(SOURCES[key][1],"Opera e attribuzione")}.</figcaption></figure>'
def side(active=''):
 return '<aside class="side"><h2>Il filo della storia</h2><ul>'+''.join(f'<li><a class="{"current" if p[0]==active else ""}" href="fase-{p[0]}.html">{E(p[1])}<br>{E(p[2])}</a></li>' for p in PHASES)+'</ul><p>'+link('studio.html#essenziali','I saperi irrinunciabili')+'</p></aside>'
def layout(file,title,body,cat='home',intro='',kicker='',aside='',readable=False,desc=None,hero=False):
 description=desc or intro or title
 words=len(re.sub('<[^>]+>',' ',body).split());minutes=max(1,round(words/180))
 nav=''.join(f'<a href="{u}"'+(' aria-current="page"' if c==cat else '')+f'>{t}</a>' for u,t,c in NAV)
 crumbs=link('../../index.html','Quarto anno')+' <span>›</span> '+link('../index.html','Approfondimenti')+' <span>›</span> '+(link('index.html','Rivoluzione francese') if file!='index.html' else '<span>Rivoluzione francese</span>')
 head='' if hero else f'<header class="page-head"><span class="kicker">{E(kicker)}</span><h1>{E(title)}</h1>'+ (f'<p class="lead">{E(intro)}</p>' if intro else '')+ (f'<div class="meta"><span>{minutes} min di lettura</span><span>Quarto anno · Storia</span></div>' if readable else '')+'</header>'
 if readable:body+=f'<button class="read-control" type="button" data-read="{file}" aria-pressed="false">Segna come letto</button><span class="quiet read-status" role="status"></span>'
 if aside:body='<div class="columns">'+aside+'<article class="reading">'+body+'</article></div>'
 elif readable:body='<article class="reading" style="max-width:820px">'+body+'</article>'
 page=f'''<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>{E(title)} · Rivoluzione francese · gbprof</title><meta name="description" content="{E(description)}"><meta name="theme-color" content="#1d303c"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="assets/icon-192.png"><link rel="apple-touch-icon" href="assets/icon-180.png"><link rel="stylesheet" href="styles.css"><script src="app.js" defer></script></head>
<body><a class="skip" href="#contenuto">Vai al contenuto</a><div class="topbar"><a href="../../index.html" class="brand">gbprof / Quarto anno</a><span>APPROFONDIMENTI · STORIA</span><a href="../index.html">Tutti gli approfondimenti</a></div><header class="masthead"><a class="wordmark" href="index.html"><small>1789 — 1799</small>Rivoluzione francese</a><div class="tools"><button type="button" id="font-size" aria-label="Ingrandisci il testo" title="Dimensione del testo">A+</button><button type="button" id="print">Stampa</button><a class="button" href="installazione.html">Installa</a></div></header><div class="navbar"><nav aria-label="Navigazione principale">{nav}</nav></div><div class="notice" id="update-notice" hidden>È pronta una nuova versione. <button id="update-app" type="button">Aggiorna</button></div><main id="contenuto" class="wrap"><nav class="breadcrumbs" aria-label="Percorso">{crumbs}</nav>{head}{body}</main><footer class="footer"><span>gbprof e Libera · La storia come problema da comprendere</span><nav aria-label="Informazioni"><a href="fonti.html">Fonti e metodo</a><a href="installazione.html">Offline e installazione</a><a href="privacy.html">Dati e accessibilità</a></nav></footer></body></html>'''
 PAGES[file]=page
 plain=html.unescape(re.sub('<[^>]+>',' ',head+body));plain=re.sub(r'\s+',' ',plain).strip()
 INDEX.append({'url':file,'title':title,'category':cat,'text':plain})
def eventlinks(ids):return '<ul>'+''.join('<li>'+link('evento-'+i+'.html',EV[i][2]+' · '+EV[i][3])+'</li>' for i in ids)+'</ul>'
def pager(prev,next):
 return '<nav class="pager" aria-label="Lettura precedente e successiva">'+(link(prev[0],'← '+prev[1]) if prev else '<span></span>')+(link(next[0],next[1]+' →') if next else '')+'</nav>'
# HOME
home=f'''<section class="hero"><div><p class="kicker">Un decennio che cambia il mondo</p><h1>La Rivoluzione<br><em>francese.</em></h1><p class="lead">Dalla crisi dell’Antico regime al colpo di Stato di Napoleone. Persone, scelte e conflitti dentro la nascita della politica moderna.</p><div class="hero-actions"><a class="button primary" href="fase-antefatto.html">Inizia il percorso →</a><a class="button" href="diario.html">Esplora il diario</a></div><a id="resume" class="overview-link" href="fase-antefatto.html" hidden>Riprendi l’ultima lettura</a></div>{figure('bastiglia')}</section>
<div class="ribbon"><span><strong>{len(PHASES)}</strong> passaggi storici</span><span><strong>{len(EVENTS)}</strong> eventi nel diario</span><span><strong>{len(PEOPLE)}</strong> protagonisti e voci</span><span><strong>{len(DOCUMENTS)}</strong> documenti commentati</span></div>
<section class="question"><span class="kicker">La domanda che ci accompagna</span><h2>Come si passa dalla promessa di libertà<br>al potere di un generale?</h2><p>La risposta attraversa dieci anni di diritti conquistati, esclusioni, guerra e scelte politiche. Nessun esito era già scritto nel 1789.</p></section>
<div class="section-heading"><h2>Le porte della Rivoluzione</h2><a href="studio.html">Sintesi, mappe e verifica →</a></div><div class="grid two">'''
home+=card('diario.html','Il diario della Rivoluzione','Segui gli eventi in ordine cronologico: per ogni snodo, antefatto, accadimento e conseguenze.','01 · Avvenimenti')
home+=card('protagonisti.html','I protagonisti','Donne e uomini: biografie collegate alle idee, alle istituzioni e ai conflitti.','02 · Persone')
home+=card('gruppi.html','Club, fazioni e gruppi sociali','Chi si allea con chi? Distingui club, schieramenti parlamentari e movimenti popolari.','03 · Conflitti')
home+=card('documenti.html','I documenti','Dichiarazioni, costituzioni, giornali e immagini: leggi le fonti senza confonderle con i fatti.','04 · Testimonianze')
home+='</div><h2>Il filo della storia</h2><p class="lead">Una prima lettura in sei tappe. Il diario e le schede permettono poi di approfondire.</p><div class="grid">'
for i,p in enumerate(PHASES):home+=card('fase-'+p[0]+'.html',p[2],p[3],f'0{i+1} · {p[1]}')
home+='</div><section class="question"><h2>Prima di cominciare</h2><p>Tre distinzioni da tenere aperte: <strong>diritti proclamati e diritti esercitati</strong>; <strong>fatti e interpretazioni</strong>; <strong>spiegare una scelta e giustificarla</strong>.</p><p>'+link('fonti.html','Come sono stati costruiti e corretti i contenuti')+'</p></section>'
layout('index.html','La Rivoluzione francese',home,hero=True,desc='PWA didattica completa dal 1789 al colpo di Stato del 18–19 brumaio: diario, protagonisti, fonti e attività.')
# PHASES
for i,p in enumerate(PHASES):
 id,date,title,question,sections,synthesis,refs=p
 body='<div class="question"><span class="kicker">Domanda generatrice</span>'+paragraphs(question)+'</div>'
 for j,(heading,txt) in enumerate(sections):
  body+=f'<section id="parte-{j+1}"><h2>{E(heading)}</h2>{paragraphs(txt)}</section>'
  if id=='1789' and j==1:body+=figure('bastiglia')
  if id=='brumaio' and j==2:body+=figure('brumaio')
 body+='<div class="summary"><strong>In sintesi</strong>'+E(synthesis)+'</div>'
 body+='<h2>Gli snodi da esplorare</h2>'+eventlinks([e[0] for e in EVENTS if e[4]==id])
 body+='<h2>Metti alla prova la comprensione</h2>'+paragraphs(question+' Rispondi collegando almeno due eventi, un gruppo sociale e una conseguenza. Distingui le condizioni di partenza dalle scelte dei protagonisti.')
 body+='<p>'+link('studio.html','Sintesi finale, saperi irrinunciabili, glossario e attività')+' · '+link('test.html','Verifica con recupero')+'</p>'+sources(refs)
 body+=pager(('fase-'+PHASES[i-1][0]+'.html',PHASES[i-1][2]) if i else ('index.html','Home'),('fase-'+PHASES[i+1][0]+'.html',PHASES[i+1][2]) if i+1<len(PHASES) else ('studio.html','Ricomponi il percorso'))
 layout('fase-'+id+'.html',title,body,'home',question,date,side(id),True)
# DIARY
body='<div class="filters"><label>Cerca nel diario<input type="search" id="filter-text" placeholder="Evento, data, parola…"></label><label>Fase<select id="filter-phase"><option value="">Tutte le fasi</option>'+''.join(f'<option value="{p[0]}">{E(p[1])} · {E(p[2])}</option>' for p in PHASES)+'</select></label></div><p id="filter-count" class="filter-note" role="status">'+str(len(EVENTS))+' eventi</p><div class="timeline">'
for e in EVENTS:
 body+=f'<article class="event" data-filter="{E(" ".join(e[2:]))}" data-phase="{e[4]}"><span class="kicker">{E(e[2])}</span><span class="phase-label">{E(PH[e[4]][1])}</span><h3>'+link('evento-'+e[0]+'.html',e[3])+'</h3>'+paragraphs(e[5])+'</article>'
body+='</div><p id="filter-empty" hidden>Nessun evento corrisponde alla ricerca. Prova un’altra parola o seleziona tutte le fasi.</p>'
layout('diario.html','Il diario della Rivoluzione',body,'diario','Dalla crisi del 1787 alle due giornate di brumaio. Le date orientano; i nessi spiegano.','1787 → 1799')
for i,e in enumerate(EVENTS):
 id,iso,date,title,phase,before,event,after,q=e
 body='<h2>Antefatto · come si arriva qui</h2>'+paragraphs(before)+'<h2>L’avvenimento</h2>'+paragraphs(event)+'<h2>Conseguenze · che cosa cambia</h2>'+paragraphs(after)+'<div class="question"><h3>Fermati e ragiona</h3>'+paragraphs(q)+'</div>'
 people=[p for p in PEOPLE if id in p[7]]
 if people:body+='<h2>Le persone dentro l’evento</h2><ul>'+''.join('<li>'+link('persona-'+p[0]+'.html',p[1])+'</li>' for p in people)+'</ul>'
 body+='<p>'+link('fase-'+phase+'.html','Ricomponi: '+PH[phase][2])+'</p>'
 refs=PH[phase][6][:]
 if id=='bastiglia':refs+=['bastiglia'];body+=figure('bastiglia')
 if id=='donne-escluse':refs+=['processo','societa']
 if id=='abolizione-schiavitu':refs+=['colonie']
 if id=='pratile-fleurus':refs+=['pratile']
 body+=sources(refs)+pager(('evento-'+EVENTS[i-1][0]+'.html',EVENTS[i-1][3]) if i else ('diario.html','Il diario'),('evento-'+EVENTS[i+1][0]+'.html',EVENTS[i+1][3]) if i+1<len(EVENTS) else ('studio.html','Sintesi finale'))
 layout('evento-'+id+'.html',title,body,'diario',q,date,side(phase),True)
# PEOPLE
body='<div class="grid two">'+card('donne.html','Le donne della Rivoluzione','Militanza, scrittura, potere dinastico e opposizione: nessuna voce unica.','9 voci')+card('uomini.html','Gli uomini della Rivoluzione','Dalla crisi della monarchia alla Repubblica e al potere dei generali.','18 percorsi')+'</div><div class="question"><h2>Le persone non sono etichette</h2><p>Le posizioni cambiano nel tempo. Leggi ogni biografia insieme agli eventi e ai gruppi: nessun protagonista agisce fuori dalle condizioni della propria epoca.</p></div>'
layout('protagonisti.html','I protagonisti',body,'persone','Donne e uomini dentro un processo collettivo.','Persone · scelte · responsabilità')
for gender in ['donne','uomini']:
 body='<div class="grid">'+''.join(card('persona-'+p[0]+'.html',p[1],p[4],p[2]) for p in PEOPLE if p[3]==gender)+'</div>'
 layout(gender+'.html',('Le donne' if gender=='donne' else 'Gli uomini')+' della Rivoluzione',body,'persone','Biografie, idee e scelte collegate al diario.','I protagonisti')
for p in PEOPLE:
 id,name,years,gender,role,txt,nodo,events,refs=p
 body='<h2>Il percorso</h2>'+paragraphs(txt)+'<div class="question"><h3>Il nodo da comprendere</h3>'+paragraphs(nodo)+'</div><h2>Collega la biografia agli eventi</h2>'+eventlinks(events)+sources(refs)+pager((gender+'.html','Tutte le biografie'),('gruppi.html','Club, fazioni e gruppi'))
 layout('persona-'+id+'.html',name,body,'persone',role,years,side(),True)
# GROUPS
body='<div class="question"><h2>Quattro cose diverse</h2><p>Un <strong>club</strong> organizza discussione e militanza; una <strong>fazione</strong> aggrega alleati; un’<strong>ideologia</strong> propone principi; un <strong>gruppo sociale</strong> condivide condizioni di vita. Le appartenenze possono sovrapporsi, ma non sono sinonimi.</p></div><div class="grid">'
for g in GROUPS:body+=card('gruppo-'+g[0]+'.html',g[1],g[3],g[2])
body+='</div>'
layout('gruppi.html','Club, fazioni, ideologie e gruppi sociali',body,'gruppi','La Rivoluzione cambia anche chi l’ha iniziata. Segui la formazione e la rottura delle alleanze.','Gli attori collettivi')
for g in GROUPS:
 id,name,kind,goal,base,evolution,nodo,events=g
 body='<h2>Idee e obiettivi</h2>'+paragraphs(goal)+'<h2>Persone e luoghi</h2>'+paragraphs(base)+'<h2>Come cambia nel tempo</h2>'+paragraphs(evolution)+'<div class="summary"><strong>Da non confondere</strong>'+E(nodo)+'</div><h2>Gli eventi collegati</h2>'+eventlinks(events)+sources(['societa','donne'] if id=='repubblicane' else ['archivio','guerra'])
 layout('gruppo-'+id+'.html',name,body,'gruppi',nodo,kind,side(),True)
# DOCUMENTS
body='<div class="question"><h2>Una fonte non parla da sola</h2><p>Chiedi sempre: chi la produce, quando, per chi, con quale scopo e che cosa non può dimostrare? Le schede propongono <strong>parafrasi didattiche</strong>, non citazioni letterali. Il testo di riferimento è collegato in ogni pagina.</p></div><div class="grid">'
for d in DOCUMENTS:body+=card('documento-'+d[0]+'.html',d[1],d[3],d[2])
body+='</div><h2 id="confronto">Tre costituzioni a confronto</h2><div class="table-scroll"><table><caption>Il progetto istituzionale cambia; l’applicazione va verificata separatamente.</caption><thead><tr><th>Dimensione</th><th>1791</th><th>1793</th><th>1795</th></tr></thead><tbody>'
for row in [('Forma di governo','Monarchia costituzionale','Repubblica democratica','Repubblica del Direttorio'),('Partecipazione prevista','Maschile, censitaria, indiretta','Maschile ampia; assemblee primarie','Maschile, censitaria, indiretta'),('Esecutivo previsto','Re e ministri','Consiglio esecutivo','Cinque direttori'),('Problema centrale','Limitare il re e stabilizzare il 1789','Democrazia e diritti sociali','Ordine e separazione dei poteri'),('Applicazione','1791–1792','Non attuata','1795–1799'),('Donne','Escluse dal voto nazionale','Escluse dal voto nazionale','Escluse dal voto nazionale')]:body+='<tr>'+''.join('<td>'+E(x)+'</td>' for x in row)+'</tr>'
body+='</tbody></table></div>'+sources(['1791','1793','1795'])
layout('documenti.html','Documenti della Rivoluzione francese',body,'documenti','Leggere i principi, le istituzioni e le parole degli attori.','Il laboratorio delle fonti')
for d in DOCUMENTS:
 id,title,date,author,kind,paraphrase,reading,limits,q,ref,event=d
 body='<h2>Identità del documento</h2><p><strong>Autore / provenienza:</strong> '+E(author)+'</p><p><strong>Genere e destinatari:</strong> '+E(kind)+'</p><h2>Che cosa sostiene</h2><p class="quiet">Parafrasi didattica italiana. Non è una citazione letterale.</p>'+paragraphs(paraphrase)+'<h2>Come leggerlo</h2>'+paragraphs(reading)+'<div class="summary"><strong>Limiti della fonte</strong>'+E(limits)+'</div>'
 if id=='brumaio-immagine':body+=figure('brumaio')
 body+='<div class="question"><h3>Domanda di lettura</h3>'+paragraphs(q)+'</div><p>'+link('evento-'+event+'.html','Ritorna all’evento nel diario')+'</p>'+sources([ref])
 layout('documento-'+id+'.html',title,body,'documenti',q,date,side(),True)
# STUDY
body='<div class="study-actions"><a class="button primary" href="test.html">Avvia la verifica →</a><a class="button" href="glossario.html">Vocabolario</a><a class="button" href="#mappa">Mappa concettuale</a><a class="button" href="#attivita">Attività</a></div><section><h2>Ricomponi: dalla libertà a brumaio</h2>'
body+=paragraphs('La crisi della monarchia apre una discussione sulla sovranità. Nel 1789 assemblea, città e campagne abbattono l’ordine dei privilegi, ma non condividono tutte le stesse aspettative. I diritti universali diventano un linguaggio con cui gli esclusi contestano i limiti della cittadinanza.\nIl conflitto religioso, Varennes e la guerra fanno crollare il compromesso monarchico. La Repubblica nasce sotto minaccia e ricorre a un governo d’eccezione: difende conquiste e sospende garanzie, mobilita il popolo e ne reprime componenti autonome.\nDopo termidoro, il Direttorio tenta la stabilizzazione e restringe la partecipazione. Annullamenti elettorali e interventi militari ne indeboliscono la legittimità. Brumaio conserva alcune trasformazioni sociali della Rivoluzione mentre chiude lo spazio politico che l’aveva alimentata. Questo esito deriva da conflitti e scelte: non dimostra che ogni rivoluzione debba finire con un generale.')+'</section>'
body+='<h2>Coordinate essenziali</h2><div class="table-scroll"><table><caption>Luoghi e scale del processo</caption><thead><tr><th>Luogo</th><th>Perché conta</th></tr></thead><tbody>'
for row in [('Versailles','Corte, Stati Generali, Pallacorda e marcia delle donne.'),('Parigi','Assemblee, club, sezioni, giornali e giornate insurrezionali.'),('Varennes e frontiere orientali','Fuga del re, emigrati e guerra europea.'),('Vandea, Nantes, Lione','Guerra civile e opposizioni diverse al potere rivoluzionario.'),('Saint-Domingue','Rivolta degli schiavi, cittadinanza e abolizione.'),('Italia ed Egitto','Espansione militare, risorse e prestigio di Bonaparte.'),('Saint-Cloud','Trasferimento e sgombero dei consigli a brumaio.')]:body+='<tr><td>'+E(row[0])+'</td><td>'+E(row[1])+'</td></tr>'
body+='</tbody></table></div><h2 id="essenziali">Saperi irrinunciabili</h2><ol>'+''.join('<li>'+E(x)+'</li>' for x in ESSENTIALS)+'</ol><h2 id="mappa">Mappa concettuale</h2><p>Leggi dall’alto verso il basso: condizioni, rotture e scelte. Le frecce indicano un nesso da spiegare, non un destino inevitabile.</p><div class="map-root">Chi ha il diritto di governare, e in nome di chi?</div><div class="concept-map">'
for title,txt,href in [('1 · Crisi dell’Antico regime','Debito + privilegi + crisi del pane → convocazione degli Stati Generali.','fase-antefatto.html'),('2 · Nazione e diritti','Conflitto sulla rappresentanza + mobilitazione → Costituente e fine dei privilegi.','fase-1789.html'),('3 · Fiducia spezzata','Conflitto religioso + Varennes + guerra → caduta della monarchia.','fase-monarchia-costituzionale.html'),('4 · Repubblica ed eccezione','Guerra esterna + rivolte + lotte politiche → mobilitazione e Terrore.','fase-repubblica-terrore.html'),('5 · Stabilità cercata','Termidoro + esclusione popolare → Direttorio, elezioni e colpi di forza.','fase-direttorio.html'),('6 · Il potere del generale','Crisi politica + prestigio militare + progetto di Sieyès → brumaio e Consolato.','fase-brumaio.html')]:body+='<section><h3>'+E(title)+'</h3><p>'+E(txt)+'</p>'+link(href,'Spiega il passaggio →')+'</section>'
body+='</div><h2>Linea del tempo ragionata</h2>'
for p in PHASES:body+=f'<a class="overview-link" href="fase-{p[0]}.html"><small>{E(p[1])}</small><strong>{E(p[2])}</strong><span>{E(p[5])}</span></a>'
body+='<h2 id="attivita">Attività di comprensione e argomentazione</h2>'
for title,task,guide,refs in ACTIVITIES:body+='<section><h3>'+E(title)+'</h3>'+paragraphs(task)+'<p>'+ ' · '.join(link(r,'Leggi la scheda '+str(i+1)) for i,r in enumerate(refs))+'</p><details><summary>Criteri per controllare la risposta</summary>'+paragraphs(guide)+'</details></section>'
body+='<div class="question"><h3>Come valutare un’argomentazione</h3><p>Una risposta solida colloca i fatti nel tempo, usa correttamente il lessico, collega almeno due cause o condizioni e distingue una fonte dalla propria interpretazione. La lunghezza da sola non misura la comprensione.</p></div>'
layout('studio.html','Studia, collega, verifica',body,'studio','Dal racconto alla comprensione: una sintesi e gli strumenti per usarla.','Il tuo laboratorio',readable=True)
body='<div class="filters"><label>Cerca una parola<input type="search" id="filter-text" placeholder="Sovranità, Terrore, Direttorio…"></label></div><p id="filter-count" role="status" class="quiet"></p><dl class="glossary">'
for term,definition in sorted(GLOSSARY.items()):body+='<div data-filter="'+E(term+' '+definition)+'"><dt>'+E(term)+'</dt><dd>'+E(definition)+'</dd></div>'
body+='</dl><p id="filter-empty" hidden>Nessun termine trovato.</p>'
layout('glossario.html','Vocabolario essenziale',body,'studio','Le parole indispensabili per distinguere istituzioni, idee e gruppi.','30 parole per orientarsi')
# TEST
body='''<div class="question"><h2>Dieci domande, un percorso di recupero</h2><p>Ogni tentativo estrae dieci domande e mescola le tre risposte. Alla fine trovi punteggio, spiegazioni e pagine da rileggere. Il risultato resta soltanto su questo dispositivo: è un’autoverifica, non un voto registrato dal docente.</p></div><div id="quiz-start"><button type="button" id="start-quiz" class="primary">Comincia il test</button><p id="last-score" class="quiet"></p></div><form id="quiz" class="quiz" hidden></form><div id="quiz-result" tabindex="-1" aria-live="polite"></div><noscript><p>Per il test interattivo serve JavaScript. Puoi comunque usare le domande e i criteri delle <a href="studio.html#attivita">attività guidate</a>.</p></noscript>'''
layout('test.html','Verifica e recupero',body,'studio','Capire perché una risposta è sbagliata è parte dello studio.','Autoverifica')
# SEARCH
body='''<label for="search-all">Cerca una persona, un evento o un concetto</label><div class="filters"><input type="search" id="search-all" placeholder="Prova: cittadinanza, Varennes, donne…" style="width:100%"></div><p class="quiet" id="search-status" role="status">La ricerca comprende i testi di tutte le schede.</p><ul class="search-results" id="search-results"></ul><noscript>La ricerca richiede JavaScript. Usa gli indici del diario, dei protagonisti e dei documenti.</noscript>'''
layout('cerca.html','Cerca nel percorso',body,'cerca','Tutti i testi, anche dopo il salvataggio offline.','Una parola, più collegamenti')
# SOURCES & METHOD
body='<h2>Come leggere questo lavoro</h2>'+paragraphs('La struttura riprende il Google Site di partenza. I testi sono una nuova redazione didattica: non una copia automatica. Il racconto è organizzato fino al colpo di Stato del 9–10 novembre 1799. Le menzioni successive servono solo a distinguere conseguenze e cronologie.\nLe schede usano parafrasi italiane dichiarate. Non sono presentate come citazioni letterali parole non controllate sull’originale. I documenti normativi, i testi polemici, le memorie e le immagini richiedono domande differenti. Le fonti esterne possono essere in francese o in inglese.\nFatto documentato: un atto viene approvato in una data. Interpretazione: si spiega il significato di una scelta collegandola ad altre. Questione discussa: le prove non permettono una conclusione univoca o gli storici ne propongono letture diverse. Le tre categorie non vanno sovrapposte.')
body+='<h2>Correzioni e cautele rispetto al sito di partenza</h2><ul>'
for x in ['Riordinati Varennes, Campo di Marte e Costituzione del settembre 1791.','Distinta la proclamazione dell’abolizione dei privilegi dall’applicazione e dall’abolizione senza indennizzo del 1793.','Comitato di salute pubblica: 6 aprile 1793; ingresso di Robespierre: 27 luglio.','Separati arresto di Robespierre (27 luglio 1794) ed esecuzione (28 luglio).','18 fruttidoro Anno V: 4 settembre 1797.','Brumaio: due giornate, 9 e 10 novembre 1799; distinto il Consolato dall’Impero.','Olympe: distinta la Dichiarazione del 1791 dal contesto politico dell’arresto e del processo del 1793.','Kéralio: adottata la cronologia 1756–1822 dello studio di Annie Geffroy; altre sintesi riportano date divergenti.','Tricoteuses: distinta la partecipazione femminile dallo stereotipo successivo.','Eliminati richiami numerati senza bibliografia corrispondente e citazioni non verificabili.','Le reazioni di Burke alla Rivoluzione non sono usate come causa anteriore dello scoppio del 1789.','Vandea, rivolte federaliste, club giacobino, Montagna e sanculotti sono trattati come realtà distinte.']:body+='<li>'+E(x)+'</li>'
body+='</ul><h2>Fonti primarie, raccolte e studi</h2>'
for k,(title,url,note) in SOURCES.items():body+=f'<section id="{k}"><h3>{E(title)}</h3>'+paragraphs(note)+'<p>'+link(url,'Apri il riferimento →')+'</p></section>'
body+='<h2>Per proseguire la ricerca</h2>'+paragraphs('Una bibliografia di orientamento: Georges Lefebvre, L’Ottantanove; Albert Soboul, La Rivoluzione francese; François Furet, Critica della Rivoluzione francese; Lynn Hunt, La Rivoluzione francese. Politica, cultura, classi sociali; Timothy Tackett, Becoming a Revolutionary. Questi titoli sono proposte di approfondimento, non fonti di citazioni testuali inserite nella PWA.\nLe opere visive riprodotte sono in pubblico dominio. Le didascalie riportano autore, data e provenienza; il dipinto di Bouchot del 1840 è esplicitamente distinto da una testimonianza oculare del 1799. Le icone sono una composizione grafica originale di lettere e colori.')
layout('fonti.html','Fonti, metodo e attribuzioni',body,'documenti','Leggere la storia significa anche controllare come viene raccontata.','Trasparenza delle fonti',readable=True)
body='''<h2>Installa la PWA</h2><p>Apri questa pagina tramite un sito HTTPS. Su iPad e iPhone, in Safari, usa <strong>Condividi → Aggiungi alla schermata Home</strong>. Su un browser compatibile per computer o Android può comparire il pulsante di installazione.</p><button id="install-app" type="button" hidden>Installa sul dispositivo</button><h2>Leggere senza connessione</h2><p>Alla prima visita con connessione vengono salvati pagine, testi, immagini e test di questo approfondimento. Attendi il messaggio di completamento qui sotto prima di scollegarti. Le fonti esterne e gli altri percorsi del quarto anno richiedono la rete.</p><p class="notice" id="offline-status" role="status">Verifica della disponibilità offline…</p><h2>Aggiornamenti</h2><p>Quando una nuova versione è pronta, appare il pulsante Aggiorna. Completa prima l’eventuale test in corso: l’aggiornamento ricarica la pagina. I segnalibri di lettura rimangono sul dispositivo.</p><p>Il browser può eliminare i dati offline quando libera spazio o quando cancelli i dati del sito. In quel caso apri di nuovo il percorso con connessione. Installazione e conservazione dipendono dal browser.</p><noscript><p>JavaScript è disattivato: puoi leggere le pagine online, ma il salvataggio offline e il test non sono attivi.</p></noscript>'''
layout('installazione.html','Porta il percorso con te',body,'home','Installazione su iPad, computer e telefono.','Una PWA per studiare',readable=True)
body='''<h2>I tuoi dati</h2><p>Questa PWA non richiede account, non invia risposte al docente e non include pubblicità o strumenti di analisi. Salva localmente le pagine contrassegnate come lette, l’ultima lettura, la dimensione del testo e l’ultimo risultato dell’autoverifica. L’hosting e i siti esterni possono avere proprie politiche e registri di accesso.</p><button id="clear-progress" type="button">Cancella i miei progressi su questo dispositivo</button><p id="clear-status" role="status"></p><h2>Accessibilità</h2><p>I testi rimangono leggibili senza JavaScript. Sono presenti navigazione da tastiera, collegamento per saltare al contenuto, titoli gerarchici, etichette dei campi, descrizioni delle immagini e aumento della dimensione del testo. Le animazioni non sono necessarie per comprendere i contenuti.</p><p>Le tabelle si possono scorrere orizzontalmente sugli schermi stretti. Il comando Stampa produce una versione adatta alla carta o al salvataggio PDF attraverso il browser. Il test comunica l’esito con testo, non soltanto con il colore.</p><h2>Uso in classe</h2><p>L’autoverifica serve a individuare gli argomenti da riprendere. Il punteggio non certifica da solo una competenza storica: per valutarla occorre anche argomentare, collegare eventi e discutere fonti.</p>'''
layout('privacy.html','Dati, accessibilità e uso in classe',body,'home',kicker='Informazioni',readable=True)
for name,txt in PAGES.items():(ROOT/name).write_text(txt,encoding='utf-8')
(ROOT/'search-index.json').write_text(json.dumps(INDEX,ensure_ascii=False,separators=(',',':')))
qs=[{'question':q[0],'answers':[q[1],q[2],q[3]],'correct':q[1],'explanation':q[4],'recovery':q[5],'phase':q[6]} for q in QUIZ]
(ROOT/'quiz.json').write_text(json.dumps(qs,ensure_ascii=False,separators=(',',':')))
manifest={'name':'Rivoluzione francese · gbprof','short_name':'Rivoluzione','lang':'it','id':'./','start_url':'./index.html','scope':'./','display':'standalone','background_color':'#f5f0e5','theme_color':'#1d303c','description':'Dal 1789 al 18 brumaio: storia, protagonisti, documenti e verifica.','icons':[{'src':f'assets/icon-{s}.png','sizes':f'{s}x{s}','type':'image/png','purpose':'any maskable'} for s in [192,512]]}
(ROOT/'manifest.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
# Il cache name dipende dai byte della distribuzione: nessuna cache incoerente dopo una modifica.
assets=['./','index.html','styles.css','app.js','search-index.json','quiz.json','manifest.webmanifest']+list(PAGES)+['assets/'+p.name for p in (ROOT/'assets').iterdir() if p.is_file()]
assets=sorted(set(assets));digest=hashlib.sha256()
for p in assets:
 if p!='./':digest.update((ROOT/p).read_bytes())
version=digest.hexdigest()[:12]
sw=(ROOT/'tools/sw-template.js').read_text().replace('__VERSION__',version).replace('__ASSETS__',json.dumps(assets,ensure_ascii=False))
(ROOT/'sw.js').write_text(sw)
print(json.dumps({'pages':len(PAGES),'events':len(EVENTS),'people':len(PEOPLE),'groups':len(GROUPS),'documents':len(DOCUMENTS),'quiz':len(QUIZ),'version':version,'words':sum(len(x['text'].split()) for x in INDEX)},ensure_ascii=False))
