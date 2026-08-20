#!/usr/bin/env python3
"""Genera i PDF della PWA a partire dall'unica fonte dati js/data.js."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageTemplate,
    Paragraph,
    PageBreak,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT_LESSONS = ROOT / "assets" / "pdf" / "lezioni"
OUT_EXTRA = ROOT / "assets" / "pdf" / "approfondimenti"

NAVY = colors.HexColor("#07162b")
BLUE = colors.HexColor("#12375f")
PAPER = colors.HexColor("#fff8e9")
GOLD = colors.HexColor("#d6aa5e")
RUBY = colors.HexColor("#8c2b25")
INK = colors.HexColor("#1c1915")
MUTED = colors.HexColor("#705f49")


def load_data() -> dict:
    code = "global.window={};require('./js/data.js');process.stdout.write(JSON.stringify(window.NAP_DATA));"
    raw = subprocess.check_output(["node", "-e", code], cwd=ROOT, text=True)
    return json.loads(raw)


DATA = load_data()
STYLES = getSampleStyleSheet()
STYLES.add(ParagraphStyle(name="CoverKicker", parent=STYLES["Normal"], fontName="Helvetica-Bold", fontSize=9, leading=11, textColor=GOLD, alignment=TA_CENTER, spaceAfter=10, uppercase=True))
STYLES.add(ParagraphStyle(name="CoverTitle", parent=STYLES["Title"], fontName="Times-Bold", fontSize=35, leading=37, textColor=NAVY, alignment=TA_CENTER, spaceAfter=8))
STYLES.add(ParagraphStyle(name="CoverSub", parent=STYLES["Normal"], fontName="Times-Italic", fontSize=16, leading=21, textColor=RUBY, alignment=TA_CENTER, spaceAfter=18))
STYLES.add(ParagraphStyle(name="H1Rest", parent=STYLES["Heading1"], fontName="Times-Bold", fontSize=23, leading=26, textColor=NAVY, spaceBefore=10, spaceAfter=10))
STYLES.add(ParagraphStyle(name="H2Rest", parent=STYLES["Heading2"], fontName="Times-Bold", fontSize=16, leading=19, textColor=RUBY, spaceBefore=14, spaceAfter=7))
STYLES.add(ParagraphStyle(name="BodyRest", parent=STYLES["BodyText"], fontName="Times-Roman", fontSize=11.2, leading=17, textColor=INK, spaceAfter=9))
STYLES.add(ParagraphStyle(name="SummaryRest", parent=STYLES["BodyText"], fontName="Helvetica-Bold", fontSize=9.5, leading=14, leftIndent=12, rightIndent=12, borderColor=GOLD, borderWidth=0.7, borderPadding=9, backColor=colors.HexColor("#f1e2c3"), textColor=INK, spaceBefore=7, spaceAfter=12))
STYLES.add(ParagraphStyle(name="SmallRest", parent=STYLES["BodyText"], fontName="Helvetica", fontSize=8.7, leading=12.5, textColor=MUTED, spaceAfter=5))
STYLES.add(ParagraphStyle(name="QuoteRest", parent=STYLES["BodyText"], fontName="Times-Italic", fontSize=12.5, leading=18, leftIndent=16, rightIndent=16, borderColor=RUBY, borderWidth=0, borderLeft=2, borderPadding=9, textColor=INK, spaceAfter=12))


class PdfDoc(BaseDocTemplate):
    def __init__(self, filename: Path, pagesize=A4, title="Napoleone"):
        super().__init__(
            str(filename), pagesize=pagesize, title=title, author="gbprof e Libera",
            leftMargin=1.8 * cm, rightMargin=1.8 * cm, topMargin=1.9 * cm, bottomMargin=1.8 * cm,
        )
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates(PageTemplate(id="main", frames=frame, onPage=draw_page))


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, doc.pagesize[1] - 18, doc.pagesize[0], 18, fill=1, stroke=0)
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(0.7)
    canvas.line(doc.leftMargin, 1.25 * cm, doc.pagesize[0] - doc.rightMargin, 1.25 * cm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(doc.leftMargin, 0.83 * cm, "Napoleone · gbprof e Libera")
    canvas.drawRightString(doc.pagesize[0] - doc.rightMargin, 0.83 * cm, str(doc.page))
    canvas.restoreState()


def cover(title: str, subtitle: str, kicker: str, question: str = "") -> list:
    items = [Spacer(1, 2.3 * cm), Paragraph(kicker.upper(), STYLES["CoverKicker"]), Paragraph(title, STYLES["CoverTitle"]), Paragraph(subtitle, STYLES["CoverSub"])]
    if question:
        items.append(Table([[Paragraph(f"<i>{question}</i>", STYLES["BodyRest"])]], colWidths=[15.3 * cm], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f0dfbd")),
            ("BOX", (0, 0), (-1, -1), 1, GOLD),
            ("LEFTPADDING", (0, 0), (-1, -1), 18), ("RIGHTPADDING", (0, 0), (-1, -1), 18),
            ("TOPPADDING", (0, 0), (-1, -1), 14), ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ])))
    items += [Spacer(1, 1.5 * cm), Paragraph("Percorso interattivo di storia per la scuola secondaria superiore", STYLES["SmallRest"]), PageBreak()]
    return items


def bullet_table(items: list[str]) -> Table:
    rows = [[Paragraph("•", STYLES["BodyRest"]), Paragraph(item, STYLES["SmallRest"])] for item in items]
    return Table(rows, colWidths=[0.55 * cm, 14.9 * cm], style=TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TEXTCOLOR", (0, 0), (0, -1), RUBY),
        ("LEFTPADDING", (0, 0), (0, -1), 1), ("RIGHTPADDING", (0, 0), (0, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))


def make_lesson(lesson: dict):
    path = OUT_LESSONS / f"{lesson['number']}-{lesson['id']}.pdf"
    doc = PdfDoc(path, title=f"{lesson['title']} - Napoleone")
    story = cover(lesson["title"], lesson["eyebrow"], f"Lezione {lesson['number']} · {lesson['period']}", lesson["question"])
    story += [Paragraph(lesson["lead"], STYLES["BodyRest"]), Spacer(1, 6)]
    for section in lesson["sections"]:
        section_items = [Paragraph(section["title"], STYLES["H2Rest"])]
        section_items += [Paragraph(paragraph, STYLES["BodyRest"]) for paragraph in section["paragraphs"]]
        section_items.append(Paragraph(f"<b>In sintesi.</b> {section['summary']}", STYLES["SummaryRest"]))
        story.append(KeepTogether(section_items))
    story += [PageBreak(), Paragraph("Coordinate essenziali", STYLES["H1Rest"]), bullet_table(lesson["coordinates"]), Paragraph("Saperi irrinunciabili", STYLES["H1Rest"]), bullet_table(lesson["essentials"]), Paragraph("Vocabolario essenziale", STYLES["H1Rest"])]
    vocab_rows = [[Paragraph(f"<b>{term}</b>", STYLES["SmallRest"]), Paragraph(definition, STYLES["SmallRest"])] for term, definition in lesson["vocab"].items()]
    story.append(Table(vocab_rows, colWidths=[4 * cm, 11.3 * cm], repeatRows=0, style=TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#ccb783")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0dfbd")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ])))
    doc.build(story)


def make_sources():
    path = OUT_EXTRA / "fonti-in-dialogo.pdf"
    doc = PdfDoc(path, title="Le fonti in dialogo - Napoleone")
    story = cover("Le fonti in dialogo", "Promesse, autorità e compromessi", "Laboratorio storico", DATA["meta"]["question"])
    for index, source in enumerate(DATA["sources"]):
        story += [Paragraph(source["title"], STYLES["H1Rest"]), Paragraph(f"{source['type']} · {source['date']} · {source['provenance']}", STYLES["SmallRest"]), Paragraph(f'<link href="{source["url"]}" color="#8c2b25"><u>Documento o scheda istituzionale completa</u></link>', STYLES["SmallRest"])]
        story += [Paragraph(f"«{quote}»", STYLES["QuoteRest"]) for quote in source["excerpt"]]
        rows = [
            ["Autore / produttore", source["author"]], ["Contesto", source["context"]], ["Destinatario", source["audience"]], ["Scopo", source["purpose"]], ["Limiti", source["limits"]], ["Domanda", source["question"]]
        ]
        table = Table([[Paragraph(f"<b>{a}</b>", STYLES["SmallRest"]), Paragraph(b, STYLES["SmallRest"])] for a, b in rows], colWidths=[3.2 * cm, 12.1 * cm], style=TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#c9ae74")), ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0dfbd")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"), ("PADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(table)
        if index < len(DATA["sources"]) - 1:
            story.append(PageBreak())
    doc.build(story)


def make_maps():
    path = OUT_EXTRA / "mappe-e-schemi.pdf"
    doc = PdfDoc(path, pagesize=landscape(A4), title="Mappe e schemi - Napoleone")
    story = cover("Mappe e schemi", "Tre carte per studiare rapporti e processi", "Napoleone")
    maps = [("1. Europa napoleonica, 1811", "europa-1811.png"), ("2. Espansione e contrazione", "espansione-contrazione.png"), ("3. Russia 1812: spazio e logistica", "russia-1812.png")]
    for index, (title, filename) in enumerate(maps):
        story += [Paragraph(title, STYLES["H1Rest"]), Image(str(ROOT / "assets" / "img" / "maps" / filename), width=23.5 * cm, height=14.9 * cm, kind="proportional")]
        if index < len(maps) - 1:
            story.append(PageBreak())
    doc.build(story)


def main():
    OUT_LESSONS.mkdir(parents=True, exist_ok=True)
    OUT_EXTRA.mkdir(parents=True, exist_ok=True)
    for lesson in DATA["lessons"]:
        make_lesson(lesson)
    make_sources()
    make_maps()
    print(f"Creati {len(DATA['lessons']) + 2} PDF")


if __name__ == "__main__":
    main()
