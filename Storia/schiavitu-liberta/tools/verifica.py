#!/usr/bin/env python3
"""Controlla i collegamenti locali e la coerenza degli asset generati."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,sys,re,hashlib
BASE=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,p):
  super().__init__();self.refs=[];self.ids=[];self.missing_alt=[];self.feed(p.read_text())
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='img' and 'alt' not in a:self.missing_alt.append(a)
  for k in ('href','src','data-map-src'):
   if k in a:self.refs.append(a[k])
pages={p:Page(p) for p in BASE.rglob('*.html') if 'tools' not in p.parts};errors=[];links=0
for p,d in pages.items():
 if len(d.ids)!=len(set(d.ids)):errors.append(f'{p.name}: ID duplicati')
 if d.missing_alt:errors.append(f'{p.name}: immagine senza alt')
 for ref in d.refs:
  u=urlsplit(ref)
  if u.scheme or ref.startswith('//'):continue
  links+=1;q=(p.parent/unquote(u.path)).resolve() if u.path else p
  if q.is_dir():q=q/'index.html'
  if not q.exists():errors.append(f'{p.relative_to(BASE)} → {ref}: mancante');continue
  if u.fragment and q.suffix=='.html':
   target=pages.get(q) or Page(q)
   if unquote(u.fragment) not in target.ids:errors.append(f'{p.relative_to(BASE)} → {ref}: ancora mancante')
sw=(BASE/'service-worker.js').read_text();cached=json.loads(re.search(r'const LOCAL=(.*);',sw).group(1));shared=json.loads(re.search(r'const SHARED=(.*);',sw).group(1))
for f in cached+shared:
 if not (BASE/f).is_file():errors.append('Cache: '+f)
manifest=json.loads((BASE/'manifest.json').read_text())
for icon in manifest['icons']:
 if not (BASE/icon['src']).is_file():errors.append('Icona: '+icon['src'])
print(json.dumps({'pagine':len(pages),'collegamenti_locali':links,'risorse_cache':len(cached+shared),'errori':errors},ensure_ascii=False,indent=2))
sys.exit(bool(errors))
