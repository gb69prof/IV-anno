#!/usr/bin/env python3
"""Genera sette lezioni, dossier fonti e dossier cartografico da js/data.js."""
from __future__ import annotations
import json, subprocess, tempfile
from pathlib import Path
from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, Image, KeepTogether, PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle

ROOT=Path(__file__).resolve().parents[1]; OUTL=ROOT/'assets/pdf/lezioni'; OUTA=ROOT/'assets/pdf/approfondimenti'
DEEP=colors.HexColor('#293a32'); ACCENT=colors.HexColor('#8f493c'); GOLD=colors.HexColor('#ba9554'); PAPER=colors.HexColor('#fffaf0'); INK=colors.HexColor('#292e2a'); MUTED=colors.HexColor('#687069')
FONT_DIR=Path('/usr/share/fonts/truetype/dejavu')
for name, file in {
    'UnitSerif':'DejaVuSerif.ttf', 'UnitSerif-Bold':'DejaVuSerif-Bold.ttf',
    'UnitSerif-Italic':'DejaVuSerif.ttf', 'UnitSans':'DejaVuSans.ttf',
    'UnitSans-Bold':'DejaVuSans-Bold.ttf'
}.items():
    pdfmetrics.registerFont(TTFont(name, FONT_DIR/file))
def load():
    code="global.window={};require('./js/data.js');process.stdout.write(JSON.stringify(window.HIST_DATA));"
    return json.loads(subprocess.check_output(['node','-e',code],cwd=ROOT,text=True))
D=load(); S=getSampleStyleSheet()
S.add(ParagraphStyle(name='K',parent=S['Normal'],fontName='UnitSans-Bold',fontSize=9,leading=12,textColor=GOLD,alignment=TA_CENTER,spaceAfter=10))
S.add(ParagraphStyle(name='T',parent=S['Title'],fontName='UnitSerif-Bold',fontSize=31,leading=34,textColor=DEEP,alignment=TA_CENTER,spaceAfter=10))
S.add(ParagraphStyle(name='Q',parent=S['BodyText'],fontName='UnitSerif-Italic',fontSize=13,leading=19,textColor=ACCENT,alignment=TA_CENTER,spaceAfter=14))
S.add(ParagraphStyle(name='H1x',parent=S['Heading1'],fontName='UnitSerif-Bold',fontSize=22,leading=25,textColor=DEEP,spaceBefore=10,spaceAfter=9))
S.add(ParagraphStyle(name='H2x',parent=S['Heading2'],fontName='UnitSerif-Bold',fontSize=16,leading=20,textColor=ACCENT,spaceBefore=13,spaceAfter=6))
S.add(ParagraphStyle(name='B',parent=S['BodyText'],fontName='UnitSerif',fontSize=10.8,leading=16.4,textColor=INK,spaceAfter=8))
S.add(ParagraphStyle(name='Small',parent=S['BodyText'],fontName='UnitSans',fontSize=8.6,leading=12.2,textColor=MUTED,spaceAfter=4))
S.add(ParagraphStyle(name='Sum',parent=S['BodyText'],fontName='UnitSans-Bold',fontSize=9.2,leading=13.5,textColor=INK,leftIndent=10,rightIndent=10,borderColor=GOLD,borderWidth=.7,borderPadding=8,backColor=colors.HexColor('#f0e3c7'),spaceAfter=10))
S.add(ParagraphStyle(name='Quote',parent=S['BodyText'],fontName='UnitSerif-Italic',fontSize=12,leading=17,leftIndent=14,rightIndent=14,textColor=INK,spaceAfter=9))
class Doc(BaseDocTemplate):
    def __init__(self,path,title,pagesize=A4):
        super().__init__(str(path),title=title,author='gbprof e Libera',pagesize=pagesize,leftMargin=1.75*cm,rightMargin=1.75*cm,topMargin=1.85*cm,bottomMargin=1.7*cm)
        self.addPageTemplates(PageTemplate(id='p',frames=Frame(self.leftMargin,self.bottomMargin,self.width,self.height,id='f'),onPage=self.page))
    def page(self,c,doc):
        c.saveState();c.setFillColor(DEEP);c.rect(0,doc.pagesize[1]-16,doc.pagesize[0],16,fill=1,stroke=0);c.setStrokeColor(GOLD);c.line(doc.leftMargin,1.18*cm,doc.pagesize[0]-doc.rightMargin,1.18*cm);c.setFont('UnitSans',8);c.setFillColor(MUTED);c.drawString(doc.leftMargin,.78*cm,D['meta']['shortTitle']+' · gbprof e Libera');c.drawRightString(doc.pagesize[0]-doc.rightMargin,.78*cm,str(doc.page));c.restoreState()
def cover(title,sub,kicker,q=''):
    z=[Spacer(1,2*cm),Paragraph(kicker.upper(),S['K']),Paragraph(title,S['T']),Paragraph(sub,S['Q'])]
    if q:z.append(Table([[Paragraph(q,S['B'])]],colWidths=[15.2*cm],style=TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#eee1c9')),('BOX',(0,0),(-1,-1),1,GOLD),('PADDING',(0,0),(-1,-1),14)])))
    return z+[Spacer(1,1.2*cm),Paragraph('Percorso interattivo di storia per la scuola secondaria superiore',S['Small']),PageBreak()]
def bullets(items):
    return Table([[Paragraph('•',S['B']),Paragraph(x,S['Small'])] for x in items],colWidths=[.5*cm,14.8*cm],style=TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('TEXTCOLOR',(0,0),(0,-1),ACCENT),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
def lesson_pdf(l):
    path=OUTL/f"{l['number']}-{l['id']}.pdf";doc=Doc(path,l['title']);story=cover(l['title'],l['eyebrow'],f"Lezione {l['number']} · {l['period']}",l['question']);story+=[Paragraph(l['lead'],S['B'])]
    for sec in l['sections']:
        block=[Paragraph(sec['title'],S['H2x'])]+[Paragraph(p,S['B']) for p in sec['paragraphs']]+[Paragraph('<b>In sintesi.</b> '+sec['summary'],S['Sum'])]
        story.append(KeepTogether(block))
    story+=[Paragraph('Attività breve',S['H1x']),Paragraph('<b>'+l['activity']['title']+'.</b> '+l['activity']['prompt'],S['B']),PageBreak(),Paragraph('Coordinate essenziali',S['H1x']),bullets(l['coordinates']),Paragraph('Saperi irrinunciabili',S['H1x']),bullets(l['essentials']),Paragraph('Vocabolario essenziale',S['H1x'])]
    rows=[[Paragraph('<b>'+k+'</b>',S['Small']),Paragraph(v,S['Small'])] for k,v in l['vocab'].items()];story.append(Table(rows,colWidths=[4*cm,11.3*cm],style=TableStyle([('GRID',(0,0),(-1,-1),.4,colors.HexColor('#c8b78f')),('BACKGROUND',(0,0),(0,-1),colors.HexColor('#eee1c9')),('VALIGN',(0,0),(-1,-1),'TOP'),('PADDING',(0,0),(-1,-1),7)])));story+=[Paragraph('Risposta progressiva',S['H1x']),Paragraph(l['answer'],S['B'])];doc.build(story)
def sources_pdf():
    doc=Doc(OUTA/'fonti-in-dialogo.pdf','Fonti in dialogo');story=cover('Fonti in dialogo','Documenti, scopi e limiti','Laboratorio storico',D['meta']['question'])
    for i,s in enumerate(D['sources']):
        mode='Estratti testuali brevi' if s.get('verbatim') else 'Sintesi e passi modernizzati: verificare sul documento collegato'
        story += [Paragraph(s['title'],S['H1x']),Paragraph(f"{s['type']} · {s['date']} · {s['provenance']}",S['Small']),Paragraph(mode,S['K'])]+[Paragraph(('«'+q+'»') if s.get('verbatim') else q,S['Quote']) for q in s['excerpt']]
        rows=[('Autore',s['author']),('Contesto',s['context']),('Destinatario',s['audience']),('Scopo',s['purpose']),('Limiti',s['limits']),('Lettura guidata',s['interpretation']),('Domande',' · '.join(s['questions'])),('URL',s['url'])]
        story.append(Table([[Paragraph('<b>'+a+'</b>',S['Small']),Paragraph(b,S['Small'])] for a,b in rows],colWidths=[3.1*cm,12.2*cm],style=TableStyle([('GRID',(0,0),(-1,-1),.4,colors.HexColor('#c8b78f')),('BACKGROUND',(0,0),(0,-1),colors.HexColor('#eee1c9')),('VALIGN',(0,0),(-1,-1),'TOP'),('PADDING',(0,0),(-1,-1),7)])))
        if i<len(D['sources'])-1:story.append(PageBreak())
    doc.build(story)
def maps_pdf():
    doc=Doc(OUTA/'mappe-e-schemi.pdf','Mappe e schemi',landscape(A4));story=cover('Mappe e schemi','Carte ragionate e limiti di lettura',D['meta']['shortTitle'])
    with tempfile.TemporaryDirectory(prefix='destra-mappe-') as temp:
        for i,m in enumerate(D['maps']):
            src=ROOT/m['image']; raster=src.with_suffix('.png'); visual=raster if raster.exists() else src
            if raster.exists():
                compact=Path(temp)/f"{i}.jpg"; image=PILImage.open(raster).convert('RGB'); image.thumbnail((1200,750)); image.save(compact,quality=60,optimize=True,progressive=True,subsampling=2); visual=compact
            story.append(KeepTogether([Paragraph(m['title'],S['H1x']),Paragraph(m['text'],S['B']),Image(str(visual),width=22.5*cm,height=11.8*cm,kind='proportional'),Paragraph(m['note'],S['Small'])]))
            if i<len(D['maps'])-1:story.append(PageBreak())
        doc.build(story)
def synthesis_pdf():
    doc=Doc(OUTA/'sintesi-generale.pdf','Sintesi generale');story=cover('Sintesi generale','Risultati, costi e problemi aperti','1861-1876',D['meta']['question'])
    story += [Paragraph('La tensione fondamentale',S['H1x']),Paragraph(D['meta']['thesis'],S['B']),Paragraph('Sette problemi',S['H1x'])]
    rows=[[Paragraph(f"<b>{l['number']}. {l['title']}</b>",S['Small']),Paragraph(l['answer'],S['Small'])] for l in D['lessons']]
    story.append(Table(rows,colWidths=[5.1*cm,10.2*cm],repeatRows=0,style=TableStyle([('GRID',(0,0),(-1,-1),.4,colors.HexColor('#c8b78f')),('BACKGROUND',(0,0),(0,-1),colors.HexColor('#eee1c9')),('VALIGN',(0,0),(-1,-1),'TOP'),('PADDING',(0,0),(-1,-1),7)])))
    story += [PageBreak(),Paragraph('Cronologia ragionata',S['H1x'])]
    timeline=[[Paragraph('<b>'+t['date']+'</b>',S['Small']),Paragraph('<b>'+t['title']+'</b><br/>'+t['text'],S['Small']),Paragraph(t['scale'],S['Small'])] for t in D['timeline']]
    story.append(Table(timeline,colWidths=[2.8*cm,10.5*cm,2*cm],repeatRows=0,style=TableStyle([('LINEBELOW',(0,0),(-1,-1),.35,colors.HexColor('#c8b78f')),('VALIGN',(0,0),(-1,-1),'TOP'),('PADDING',(0,0),(-1,-1),6)])))
    story += [PageBreak(),Paragraph('Saperi irrinunciabili del modulo',S['H1x'])]
    essentials=[]
    for l in D['lessons']:
        essentials.append(KeepTogether([Paragraph(f"{l['number']}. {l['title']}",S['H2x']),bullets(l['essentials'])]))
    story += essentials
    story += [PageBreak(),Paragraph('Tesi finale',S['H1x']),Paragraph(D['meta']['question'],S['Q']),Paragraph('Formula una risposta che utilizzi almeno tre lezioni, due fonti, una visualizzazione e una possibile obiezione. Distingui ciò che nel 1861 appariva necessario da ciò che dipese da una scelta politica.',S['B']),Spacer(1,10*cm)]
    doc.build(story)
def main():
    OUTL.mkdir(parents=True,exist_ok=True);OUTA.mkdir(parents=True,exist_ok=True)
    for l in D['lessons']:lesson_pdf(l)
    sources_pdf();maps_pdf();synthesis_pdf();print(f"Creati {len(D['lessons'])+3} PDF per {D['meta']['shortTitle']}")
if __name__=='__main__':main()
