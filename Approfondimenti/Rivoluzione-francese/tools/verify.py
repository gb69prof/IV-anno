#!/usr/bin/env python3
"""Verifica collegamenti locali, ancore, dati didattici e copertura offline."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, re, sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'contenuti'))
from base import PHASES
from diario import EVENTS
from persone import PEOPLE
from gruppi import GROUPS
from documenti import DOCUMENTS
from studio import QUIZ
class Page(HTMLParser):
 def __init__(self,p):
  super().__init__();self.ids=set();self.refs=[];self.h1=0;self.lang=False;self.errors=[];self.feed(p.read_text())
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:
   if a['id'] in self.ids:self.errors.append('id duplicato '+a['id'])
   self.ids.add(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='html':self.lang=a.get('lang')=='it'
  if tag=='img' and not a.get('alt'):self.errors.append('immagine priva di testo alternativo')
  for key in ['href','src']:
   if key in a:self.refs.append(a[key])
pages={p.resolve():Page(p) for p in [*ROOT.glob('*.html'),ROOT.parent/'index.html',ROOT.parents[1]/'index.html']}
errors=[];links=0
for p,page in pages.items():
 if page.h1!=1 or not page.lang:errors.append(f'{p.name}: H1 o lingua')
 errors.extend(f'{p.name}: {s}' for s in page.errors)
 for ref in page.refs:
  u=urlsplit(ref)
  if u.scheme or u.netloc:continue
  target=(p.parent/unquote(u.path)).resolve() if u.path else p
  if target.is_dir():target=target/'index.html'
  links+=1
  if not target.exists():errors.append(f'{p.name}: manca {ref}')
  elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append(f'{p.name}: ancora mancante {ref}')
for name,data in [('fasi',PHASES),('eventi',EVENTS),('persone',PEOPLE),('gruppi',GROUPS),('documenti',DOCUMENTS)]:
 if len({x[0] for x in data})!=len(data):errors.append('id duplicati '+name)
phaseids={p[0] for p in PHASES}
if [e[1] for e in EVENTS]!=sorted(e[1] for e in EVENTS):errors.append('eventi fuori ordine')
for e in EVENTS:
 if e[4] not in phaseids:errors.append('fase sconosciuta '+e[0])
quiz=json.loads((ROOT/'quiz.json').read_text())
for q in quiz:
 if len(set(q['answers']))!=3 or q['correct'] not in q['answers']:errors.append('risposte quiz errate')
 if not (ROOT/urlsplit(q['recovery']).path).exists():errors.append('recupero mancante')
 if q['phase'] not in phaseids:errors.append('fase quiz mancante')
assets=json.loads(re.search(r'const ASSETS = (\[.*?\]);',(ROOT/'sw.js').read_text(),re.S)[1])
for asset in assets:
 if not (ROOT/asset).exists():errors.append('precache mancante '+asset)
 elif (ROOT/asset).is_file() and (ROOT/asset).stat().st_size==0:errors.append('risorsa vuota '+asset)
for page in ROOT.glob('*.html'):
 if './'+page.name not in assets and page.name not in assets:errors.append('pagina non offline '+page.name)
manifest=json.loads((ROOT/'manifest.webmanifest').read_text())
if manifest['scope']!='./' or manifest['start_url']!='./index.html':errors.append('scope manifest inatteso')
for icon in manifest['icons']:
 if not (ROOT/icon['src']).exists():errors.append('icona mancante')
search=json.loads((ROOT/'search-index.json').read_text())
if len(search)!=len(list(ROOT.glob('*.html'))):errors.append('indice di ricerca incompleto')
if errors:
 print('\n'.join(errors));sys.exit(1)
print(f'OK: {len(pages)} pagine, {links} riferimenti locali, {len(assets)} risorse offline, {len(quiz)} domande.')
