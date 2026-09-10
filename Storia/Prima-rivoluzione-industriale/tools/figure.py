from pathlib import Path
import json,html,textwrap
from PIL import Image, ImageDraw, ImageFont
P=Path(__file__).resolve().parents[1]
def txt(s,x,y,size=26,color='#203641',width=55):
 lines=textwrap.wrap(s,width)
 return f'<text x="{x}" y="{y}" fill="{color}" font-family="Arial,sans-serif" font-size="{size}">'+''.join(f'<tspan x="{x}" dy="{0 if i==0 else size*1.4}">{html.escape(l)}</tspan>' for i,l in enumerate(lines))+'</text>'
def base(title,desc,w=1400,h=1000):
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-labelledby="t d"><title id="t">{html.escape(title)}</title><desc id="d">{html.escape(desc)}</desc><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#93672c"/></marker></defs><rect width="{w}" height="{h}" fill="#f6f0e2"/>'+txt('PRIMA RIVOLUZIONE INDUSTRIALE · gbprof e Libera',55,45,20,'#823d32',95)+txt(title,55,105,38,'#152f43',60)
def box(title,body,x,y,w=550,h=145):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#fffdf8" stroke="#c5b99f"/>'+txt(title,x+22,y+42,28,'#823d32',int(w/17))+txt(body,x+22,y+86,24,'#203641',int(w/14))
def arrow(x1,y1,x2,y2,label='',lx=None,ly=None):
 return f'<path d="M{x1} {y1}L{x2} {y2}" stroke="#93672c" stroke-width="3" fill="none" marker-end="url(#arrow)"/>'+(txt(label,lx if lx is not None else x1+15,ly if ly is not None else (y1+y2)/2,21,'#485966',45) if label else '')
s=base('Dal campo al tessuto','Filiera funzionale, con distinzione dei rapporti di lavoro.')
s+=box('1. Coltivazione e raccolta','Più regioni produttrici; nelle piantagioni atlantiche anche lavoro schiavizzato.',55,175,600,160)
s+=box('Mercati e poteri coloniali','L’India possiede una tradizione tessile precedente; non è un mondo senza industria.',745,175,600,160)
s+=arrow(355,335,355,410,'fibra grezza')
s+=box('2. Preparazione e trasporto','Separazione dei semi; porti, credito, assicurazioni e magazzini.',55,410,600,150)
s+=arrow(655,485,745,485)
s+=box('3. Filatura','Le fibre diventano filo. Nelle fabbriche britanniche: lavoro salariato.',745,410,600,150)
s+=arrow(1045,560,1045,660,'filato')
s+=box('4. Tessitura e finitura','I fili vengono intrecciati e la stoffa rifinita.',745,660,600,145)
s+=arrow(745,733,655,733)
s+=box('5. Distribuzione e consumo','Il tessuto raggiunge mercati interni ed esteri; la domanda sostiene nuovi ordini.',55,660,600,145)
s+=txt('La filiera connette condizioni diverse: schiavitù e lavoro salariato non sono sinonimi.',55,890,26,'#152f43',88)
s+=txt('Schema didattico originale. Le tappe non impongono un’unica rotta geografica.',55,950,22,'#485966',98)+'</svg>'
(P/'assets/img/filiera.svg').write_text(s)
s=base('Dal calore al movimento','Schema semplificato di sistema rotativo con condensazione separata.')
s+=box('Carbone','Combustibile: energia chimica.',55,200,380,140)+arrow(435,270,505,270)
s+=box('Caldaia','Il calore produce vapore.',505,200,390,140)+arrow(895,270,965,270)
s+=box('Cilindro e pistone','Pressioni diverse generano moto.',965,200,380,140)
s+=arrow(1155,340,1155,480,'movimento',1000,415)
s+=box('Trasmissione meccanica','Bilancieri, collegamenti e albero rotante secondo il tipo di motore.',790,480,555,160)
s+=arrow(790,560,640,560)
s+=box('Macchine operatrici','Usano il movimento: per esempio gli apparati di una fabbrica.',55,480,585,160)
s+=f'<path d="M1345 290H1380V760H1070" stroke="#93672c" stroke-width="3" fill="none" marker-end="url(#arrow)"/>'
s+=box('Condensatore separato','Il vapore condensa fuori dal cilindro, limitandone il raffreddamento ripetuto.',480,730,590,155)
s+=txt('vapore',1210,710,22,'#485966',15)
s+=txt('Watt migliora un percorso già avviato: Newcomen usa prima una macchina atmosferica per pompe.',55,940,24,'#152f43',99)
s+='</svg>';(P/'assets/img/motore.svg').write_text(s)
# Carta: geometria da Natural Earth; proiezione cilindrica locale semplificata.
g=json.loads((P/'content/coste-natural-earth.geojson').read_text())
def project(lon,lat):return 65+(lon+11)*51,180+(59.2-lat)*80
s=base('Gran Bretagna: territori e poli industriali','Carta didattica di localizzazione; costa semplificata da Natural Earth, pubblico dominio.',1400,1120)
s+=f'<rect x="40" y="145" width="745" height="850" rx="8" fill="#e1e9e7"/>'
for f in g['features']:
 polys=f['geometry']['coordinates'] if f['geometry']['type']=='MultiPolygon' else [f['geometry']['coordinates']]
 for poly in polys:
  ring=poly[0];points=[project(*v[:2]) for v in ring]
  if not any(40<x<785 and 145<y<995 for x,y in points):continue
  d='M'+'L'.join(f'{x:.1f},{y:.1f}' for x,y in points)+'Z'
  s+=f'<path d="{d}" fill="#f9f3df" stroke="#8f9e90" stroke-width="1.5"/>'
s+=txt('SCOZIA',390,315,23,'#6b705e',12)+txt('INGHILTERRA',460,760,22,'#6b705e',13)+txt('GALLES',306,803,20,'#6b705e',10)+txt('IRLANDA',85,655,20,'#6b705e',12)+txt('Mare del Nord',570,360,20,'#485966',16)
cities=[('Glasgow',-4.25,55.86,'Manifatture e regione del Clyde'),('New Lanark',-3.78,55.66,'Cotonifici idraulici e riforma sociale'),('Newcastle',-1.61,54.98,'Carbone e attività connesse'),('Liverpool',-2.98,53.41,'Porto e commercio atlantico'),('Manchester',-2.24,53.48,'Cotone nel Lancashire'),('Leeds',-1.55,53.8,'Lana e manifatture tessili'),('Sheffield',-1.47,53.38,'Lavorazioni metalliche'),('Cromford',-1.56,53.11,'Cotonifici della valle del Derwent'),('Birmingham',-1.9,52.49,'Lavorazioni metalliche e officine'),('Galles meridionale',-3.38,51.75,'Carbone e ferro; punto indicativo'),('Londra',-.13,51.51,'Mercato, porto, finanza e politica')]
# Piccoli contrassegni; callout sfalsati per i centri vicini.
shift={1:(-54,-24),2:(35,22),3:(35,-8),4:(-68,12),5:(-18,46),6:(35,-40),7:(60,-4),8:(70,37),9:(-42,23),10:(-62,28),11:(24,10)}
for i,(name,lon,lat,desc) in enumerate(cities,1):
 x,y=project(lon,lat);dx,dy=shift[i];tx,ty=x+dx,y+dy
 s+=f'<path d="M{x},{y}L{tx},{ty}" stroke="#823d32" stroke-width="1.5"/><circle cx="{x}" cy="{y}" r="4" fill="#823d32"/><circle cx="{tx}" cy="{ty}" r="15" fill="#823d32"/><text x="{tx}" y="{ty+6}" text-anchor="middle" font-family="Arial" font-size="17" fill="#fff">{i}</text>'
 yy=185+(i-1)*72;s+=txt(f'{i:02d}  {name}',830,yy,25,'#823d32',35)+txt(desc,876,yy+29,20,'#203641',39)
s+=txt('Localizzazioni indicative · XVIII–prima metà XIX secolo · Nessuna quantità di produzione rappresentata.',55,1040,22,'#485966',106)
s+=txt('Coste: Natural Earth 1:110m, pubblico dominio. Non sono riprodotti confini amministrativi storici.',55,1080,21,'#485966',110)+'</svg>'
(P/'assets/img/geografia.svg').write_text(s)
font='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
for size in [192,512]:
 im=Image.new('RGB',(size,size),'#152f43');d=ImageDraw.Draw(im);d.ellipse((size*.16,size*.16,size*.84,size*.84),outline='#d8bc83',width=max(2,int(size*.013)));f=ImageFont.truetype(font,int(size*.3));d.text((size/2,size*.5),'RI',font=f,fill='#f6f0e2',anchor='mm');im.save(P/f'assets/img/icons/icon-{size}.png')
print('Tre schemi e due icone creati')
