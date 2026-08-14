import ExcelJS from "exceljs";
import { getProjects } from "@/lib/sheets";
import { computeDashboardStats } from "@/lib/stats";
import { FIELD_LABELS, Project, SHEET_COLUMNS } from "@/lib/types";
import { exportFileTag, exportScopeLabel, parseExportScope } from "@/lib/exportScope";
import { buildContentDisposition } from "@/lib/contentDisposition";

export const dynamic = "force-dynamic";

const HEADER_FILL: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1C2947" } };
const HEADER_FONT: Partial<ExcelJS.Font> = { bold: true, color: { argb: "FFFFFFFF" } };

function buildSummarySheet(workbook: ExcelJS.Workbook, projects: Project[], year?: string) {
  const stats = computeDashboardStats(projects);
  const sheet = workbook.addWorksheet("สรุปภาพรวม");
  sheet.columns = [{ width: 26 }, { width: 20 }];

  sheet.addRow(["รายงานสรุปภาพรวมโครงการ"]).font = { bold: true, size: 14 };
  sheet.addRow(["ขอบเขตข้อมูล", exportScopeLabel(year)]);
  sheet.addRow(["วันที่ออกรายงาน", new Date().toLocaleDateString("th-TH")]);
  sheet.addRow([]);

  const statHeader = sheet.addRow(["สถิติหลัก"]);
  statHeader.font = { bold: true };
  sheet.addRow(["จำนวนโครงการทั้งหมด", stats.total]);
  sheet.addRow(["งบประมาณที่ได้รับ (บาท)", stats.totalBudgetAllocated]);
  sheet.addRow(["งบประมาณที่ใช้จริง (บาท)", stats.totalBudgetUsed]);
  sheet.addRow(["ผู้เข้าร่วมสะสม (คน)", stats.totalParticipants]);
  sheet.addRow([]);

  const statusHeader = sheet.addRow(["แยกตามสถานะ", "จำนวนโครงการ"]);
  statusHeader.font = HEADER_FONT;
  statusHeader.fill = HEADER_FILL;
  Object.entries(stats.byStatus).forEach(([k, v]) => sheet.addRow([k, v]));
  sheet.addRow([]);

  const missionHeader = sheet.addRow(["แยกตามพันธกิจ", "จำนวนโครงการ"]);
  missionHeader.font = HEADER_FONT;
  missionHeader.fill = HEADER_FILL;
  Object.entries(stats.byMission).forEach(([k, v]) => sheet.addRow([k, v]));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { year, type } = parseExportScope(searchParams);

  const all = await getProjects();
  const projects = year ? all.filter((p) => p.fiscalYear === year) : all;

  const workbook = new ExcelJS.Workbook();

  if (type === "summary") {
    buildSummarySheet(workbook, projects, year);
  } else {
    const sheet = workbook.addWorksheet("โครงการ");
    const columns = SHEET_COLUMNS.filter((c) => c !== "attachments");
    sheet.columns = [
      ...columns.map((c) => ({ header: FIELD_LABELS[c], key: c, width: 20 })),
      { header: "ไฟล์แนบ", key: "attachments", width: 30 },
    ];
    sheet.getRow(1).fill = HEADER_FILL;
    sheet.getRow(1).font = HEADER_FONT;

    for (const p of projects) {
      const row: Record<string, unknown> = {};
      for (const c of columns) {
        row[c] = (p as unknown as Record<string, unknown>)[c];
      }
      row.attachments = p.attachments.map((a) => a.url).join(" | ");
      sheet.addRow(row);
    }

    sheet.autoFilter = { from: "A1", to: `${sheet.getColumn(sheet.columnCount).letter}1` };
  }

  const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
  const fileName = `ProjectSummary_${exportFileTag(year, type)}_${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": buildContentDisposition(fileName),
    },
  });
}
