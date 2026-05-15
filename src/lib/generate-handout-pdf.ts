import type { jsPDF as JsPDFType } from "jspdf";
import type { ModuleHandout } from "./module-handouts";

type Doc = JsPDFType;

// Brand colors — navy + gold to match the site.
const NAVY: [number, number, number] = [11, 26, 58];
const GOLD: [number, number, number] = [196, 162, 90];
const INK: [number, number, number] = [34, 38, 49];
const MUTED: [number, number, number] = [110, 116, 130];

const PAGE_MARGIN = 56; // ~0.78"
const LINE_GAP = 4;

type Cursor = { y: number };

function ensureSpace(doc: Doc, cursor: Cursor, needed: number) {
  const pageH = doc.internal.pageSize.getHeight();
  if (cursor.y + needed > pageH - PAGE_MARGIN) {
    doc.addPage();
    cursor.y = PAGE_MARGIN;
  }
}

function setText(doc: Doc, color: [number, number, number], size: number, bold = false) {
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFontSize(size);
  doc.setFont("helvetica", bold ? "bold" : "normal");
}

function writeWrapped(
  doc: Doc,
  text: string,
  cursor: Cursor,
  maxWidth: number,
  lineHeight: number,
  indent = 0,
) {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  for (const line of lines) {
    ensureSpace(doc, cursor, lineHeight);
    doc.text(line, PAGE_MARGIN + indent, cursor.y);
    cursor.y += lineHeight;
  }
}

function writeHeader(doc: Doc, handout: ModuleHandout) {
  const pageW = doc.internal.pageSize.getWidth();

  // Top gold accent bar
  doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.rect(0, 0, pageW, 6, "F");

  // Brand
  setText(doc, MUTED, 9, true);
  doc.text("NEW BUSINESS COURSE  ·  COURSE HANDOUT", PAGE_MARGIN, 32);

  // Title
  setText(doc, NAVY, 22, true);
  doc.text(handout.title, PAGE_MARGIN, 64);

  // Subtitle
  setText(doc, INK, 11);
  const subLines = doc.splitTextToSize(handout.subtitle, pageW - PAGE_MARGIN * 2) as string[];
  let y = 84;
  for (const l of subLines) {
    doc.text(l, PAGE_MARGIN, y);
    y += 14;
  }

  // Divider
  doc.setDrawColor(200, 205, 215);
  doc.setLineWidth(0.5);
  doc.line(PAGE_MARGIN, y + 6, pageW - PAGE_MARGIN, y + 6);

  return y + 24;
}

function writeFooter(doc: Doc) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    setText(doc, MUTED, 8);
    doc.text(
      "newbusinesscourse.com  ·  Page " + i + " of " + total,
      PAGE_MARGIN,
      pageH - 28,
    );
    doc.text(
      "© Averkamp CPA Group — not tax advice for your specific situation.",
      pageW - PAGE_MARGIN,
      pageH - 28,
      { align: "right" },
    );
  }
}

export async function generateHandoutPdf(handout: ModuleHandout): Promise<Doc> {
  const { jsPDF } = await import("jspdf");
  const doc: Doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const contentW = pageW - PAGE_MARGIN * 2;

  const startY = writeHeader(doc, handout);
  const cursor: Cursor = { y: startY };

  for (const section of handout.sections) {
    if (section.kind === "intro") {
      setText(doc, INK, 11);
      writeWrapped(doc, section.body, cursor, contentW, 16);
      cursor.y += 8;
      continue;
    }

    if (section.kind === "notes") {
      ensureSpace(doc, cursor, 50);
      setText(doc, GOLD, 10, true);
      doc.text(section.title.toUpperCase(), PAGE_MARGIN, cursor.y);
      cursor.y += 14;
      setText(doc, INK, 11);
      writeWrapped(doc, section.body, cursor, contentW, 16);
      cursor.y += 10;
      continue;
    }

    // Section heading
    ensureSpace(doc, cursor, 36);
    setText(doc, GOLD, 10, true);
    doc.text(section.title.toUpperCase(), PAGE_MARGIN, cursor.y);
    cursor.y += 16;

    if (section.kind === "checklist" || section.kind === "actions") {
      setText(doc, INK, 11);
      for (const item of section.items) {
        ensureSpace(doc, cursor, 18);
        // Square checkbox
        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(0.8);
        doc.rect(PAGE_MARGIN, cursor.y - 9, 10, 10);
        writeWrapped(doc, item, cursor, contentW - 20, 16, 18);
        cursor.y += LINE_GAP;
      }
      cursor.y += 6;
      continue;
    }

    if (section.kind === "concepts") {
      for (const { term, def } of section.items) {
        ensureSpace(doc, cursor, 30);
        setText(doc, NAVY, 11, true);
        doc.text(term, PAGE_MARGIN, cursor.y);
        cursor.y += 14;
        setText(doc, INK, 11);
        writeWrapped(doc, def, cursor, contentW, 15);
        cursor.y += 6;
      }
      cursor.y += 4;
      continue;
    }
  }

  writeFooter(doc);
  return doc;
}

export async function downloadHandoutPdf(handout: ModuleHandout): Promise<void> {
  const doc = await generateHandoutPdf(handout);
  doc.save(`${handout.filename}.pdf`);
}
