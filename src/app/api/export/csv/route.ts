import { getProjects } from "@/lib/sheets";
import { computeDashboardStats } from "@/lib/stats";
import { FIELD_LABELS, SHEET_COLUMNS } from "@/lib/types";
import { exportFileTag, exportScopeLabel, parseExportScope } from "@/lib/exportScope";
import { buildContentDisposition } from "@/lib/contentDisposition";

export const dynamic = "force-dynamic";

function escapeCsv(val: unknown): string {
  const s = val === null || val === undefined ? "" : String(val);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function toCsv(rows: unknown[][]): string {
  return rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { year, type } = parseExportScope(searchParams);

  const all = await getProjects();
  const projects = year ? all.filter((p) => p.fiscalYear === year) : all;

  let csv: string;

  if (type === "summary") {
    const stats = computeDashboardStats(projects);
    const rows: unknown[][] = [
      ["รายงานสรุปภาพรวมโครงการ"],
      ["ขอบเขตข้อมูล", exportScopeLabel(year)],
      ["วันที่ออกรายงาน", new Date().toLocaleDateString("th-TH")],
      [],
      ["สถิติหลัก"],
      ["จำนวนโครงการทั้งหมด", stats.total],
      ["งบประมาณที่ได้รับ (บาท)", stats.totalBudgetAllocated],
      ["งบประมาณที่ใช้จริง (บาท)", stats.totalBudgetUsed],
      ["ผู้เข้าร่วมสะสม (คน)", stats.totalParticipants],
      [],
      ["แยกตามสถานะ", "จำนวนโครงการ"],
      ...Object.entries(stats.byStatus),
      [],
      ["แยกตามพันธกิจ", "จำนวนโครงการ"],
      ...Object.entries(stats.byMission),
    ];
    csv = toCsv(rows);
  } else {
    const headerRow = SHEET_COLUMNS.filter((c) => c !== "attachments").map((c) => FIELD_LABELS[c]);
    headerRow.push("ไฟล์แนบ");

    const rows = projects.map((p) => {
      const cols = SHEET_COLUMNS.filter((c) => c !== "attachments").map(
        (c) => (p as unknown as Record<string, unknown>)[c]
      );
      cols.push(p.attachments.map((a) => a.url).join(" | "));
      return cols;
    });

    csv = toCsv([headerRow, ...rows]);
  }

  const bom = "﻿";
  const fileName = `ProjectSummary_${exportFileTag(year, type)}_${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": buildContentDisposition(fileName),
    },
  });
}
