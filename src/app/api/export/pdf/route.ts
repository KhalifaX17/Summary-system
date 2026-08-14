import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { getProjects } from "@/lib/sheets";
import { computeDashboardStats } from "@/lib/stats";
import { Project } from "@/lib/types";
import { SARABUN_BOLD_BASE64, SARABUN_REGULAR_BASE64 } from "@/lib/fontData";
import { exportFileTag, exportScopeLabel, parseExportScope } from "@/lib/exportScope";
import { buildContentDisposition } from "@/lib/contentDisposition";

export const dynamic = "force-dynamic";

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 40;
const CONTENT_W = PAGE_W - MARGIN * 2;

function wrapText(
  text: string,
  font: import("pdf-lib").PDFFont,
  size: number,
  maxWidth: number
): string[] {
  if (!text) return [];
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  const pushChar = (line: string, chars: string) => {
    let acc = line;
    for (const ch of chars) {
      const candidate = acc + ch;
      if (font.widthOfTextAtSize(candidate, size) > maxWidth && acc) {
        lines.push(acc);
        acc = ch;
      } else {
        acc = candidate;
      }
    }
    return acc;
  };

  for (const word of words) {
    const candidate = current ? current + " " + word : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth) {
      if (current) lines.push(current);
      current = pushChar("", word);
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const fmtMoney = (n: number) => n.toLocaleString("th-TH");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { year, type } = parseExportScope(searchParams);

  const all = await getProjects();
  const projects = year ? all.filter((p) => p.fiscalYear === year) : all;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const regular = await pdfDoc.embedFont(Buffer.from(SARABUN_REGULAR_BASE64, "base64"));
  const bold = await pdfDoc.embedFont(Buffer.from(SARABUN_BOLD_BASE64, "base64"));

  const navy = rgb(0x1c / 255, 0x29 / 255, 0x47 / 255);
  const gold = rgb(0xb6 / 255, 0x81 / 255, 0x3a / 255);
  const ink = rgb(0.14, 0.16, 0.22);
  const muted = rgb(0.4, 0.43, 0.5);
  const line = rgb(0.87, 0.89, 0.93);

  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  const newPage = () => {
    page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  };

  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN) newPage();
  };

  const title = type === "summary" ? "รายงานสรุปภาพรวมโครงการ" : "รายงานสรุปโครงการ";
  page.drawText(title, { x: MARGIN, y, size: 20, font: bold, color: navy });
  y -= 24;
  page.drawText(
    `${exportScopeLabel(year)} · ออกรายงานเมื่อ ${new Date().toLocaleDateString("th-TH")} · ${projects.length} โครงการ`,
    { x: MARGIN, y, size: 10, font: regular, color: muted }
  );
  y -= 18;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 1, color: navy });
  y -= 26;

  if (type === "summary") {
    const stats = computeDashboardStats(projects);

    const drawStatBox = (x: number, label: string, value: string) => {
      page.drawText(label, { x, y, size: 9.5, font: regular, color: muted });
      page.drawText(value, { x, y: y - 18, size: 16, font: bold, color: navy });
    };
    const boxW = CONTENT_W / 4;
    drawStatBox(MARGIN, "จำนวนโครงการ", `${stats.total}`);
    drawStatBox(MARGIN + boxW, "งบที่ได้รับ (บาท)", fmtMoney(stats.totalBudgetAllocated));
    drawStatBox(MARGIN + boxW * 2, "งบที่ใช้จริง (บาท)", fmtMoney(stats.totalBudgetUsed));
    drawStatBox(MARGIN + boxW * 3, "ผู้เข้าร่วม (คน)", fmtMoney(stats.totalParticipants));
    y -= 50;

    page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color: line });
    y -= 26;

    const drawBreakdown = (heading: string, data: Record<string, number>) => {
      ensureSpace(24 + Object.keys(data).length * 18);
      page.drawText(heading, { x: MARGIN, y, size: 12.5, font: bold, color: navy });
      y -= 20;
      const max = Math.max(1, ...Object.values(data));
      for (const [label, count] of Object.entries(data)) {
        page.drawText(label, { x: MARGIN, y, size: 10, font: regular, color: ink });
        const barX = MARGIN + 160;
        const barMaxW = CONTENT_W - 220;
        const barW = (count / max) * barMaxW;
        page.drawRectangle({ x: barX, y: y - 2, width: barMaxW, height: 8, color: rgb(0.93, 0.94, 0.96) });
        if (barW > 0) page.drawRectangle({ x: barX, y: y - 2, width: barW, height: 8, color: gold });
        page.drawText(`${count}`, { x: barX + barMaxW + 12, y, size: 10, font: bold, color: ink });
        y -= 18;
      }
      y -= 12;
    };

    drawBreakdown("แยกตามสถานะ", stats.byStatus);
    drawBreakdown("แยกตามพันธกิจ", stats.byMission);
  } else {
    const drawField = (label: string, value: string) => {
      if (!value) return;
      const lines = wrapText(value, regular, 9.5, CONTENT_W - 90);
      ensureSpace(14 * Math.max(lines.length, 1) + 4);
      page.drawText(label, { x: MARGIN, y, size: 9.5, font: bold, color: muted });
      lines.forEach((l, i) => {
        page.drawText(l, { x: MARGIN + 90, y: y - i * 13, size: 9.5, font: regular, color: ink });
      });
      y -= 13 * Math.max(lines.length, 1) + 5;
    };

    for (const p of projects as Project[]) {
      ensureSpace(70);

      const titleLines = wrapText(`${p.id}  ${p.projectName}`, bold, 12.5, CONTENT_W);
      ensureSpace(16 * titleLines.length + 10);
      titleLines.forEach((l, i) => {
        page.drawText(l, { x: MARGIN, y: y - i * 16, size: 12.5, font: bold, color: navy });
      });
      y -= 16 * titleLines.length + 6;

      drawField("หน่วยงาน", p.department);
      drawField("ผู้รับผิดชอบ", p.owner);
      drawField("ปีงบประมาณ / พันธกิจ", `${p.fiscalYear || "-"}  /  ${p.mission || "-"}`);
      drawField("สถานะ", p.status);
      drawField("ช่วงเวลา", `${p.startDate || "-"} ถึง ${p.endDate || "-"}`);
      drawField("วัตถุประสงค์", p.objective);
      drawField("งบประมาณ", `ได้รับ ${fmtMoney(p.budgetAllocated)} บาท / ใช้จริง ${fmtMoney(p.budgetUsed)} บาท`);
      drawField("ผู้เข้าร่วมจริง", p.participantActual ? `${p.participantActual} คน` : "");
      drawField("สรุปผลการดำเนินงาน", p.results);
      drawField("ปัญหา/อุปสรรค", p.problems);

      ensureSpace(14);
      page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color: line });
      y -= 18;
    }

    if (projects.length === 0) {
      page.drawText("ยังไม่มีข้อมูลโครงการ", { x: MARGIN, y, size: 11, font: regular, color: muted });
    }
  }

  const bytes = await pdfDoc.save();
  const fileName = `ProjectSummary_${exportFileTag(year, type)}_${new Date().toISOString().slice(0, 10)}.pdf`;

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": buildContentDisposition(fileName),
    },
  });
}
