"use client";

import { useMemo, useState } from "react";
import Modal from "./Modal";
import { showToast } from "./Toast";
import { IconDownload, IconFileCsv, IconFileExcel, IconFilePdf } from "./icons";

const FORMATS = [
  { path: "excel", label: "Excel (.xlsx)", Icon: IconFileExcel, color: "text-green" },
  { path: "pdf", label: "PDF", Icon: IconFilePdf, color: "text-red" },
  { path: "csv", label: "CSV", Icon: IconFileCsv, color: "text-primary" },
];

function RadioRow({
  checked,
  onClick,
  title,
  desc,
}: {
  checked: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 px-3.5 py-3 rounded-[10px] border transition-all active:scale-[0.98] ${
        checked ? "border-primary bg-primary/5" : "border-border hover:bg-paper"
      }`}
    >
      <span
        className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
          checked ? "border-primary" : "border-border"
        }`}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-primary" />}
      </span>
      <span>
        <span className="block text-[13.5px] text-ink font-medium">{title}</span>
        <span className="block text-[12px] text-muted mt-0.5">{desc}</span>
      </span>
    </button>
  );
}

export default function ExportDialog({
  fiscalYears,
  initialYear,
}: {
  fiscalYears: string[];
  initialYear?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<"all" | "year">("all");
  const [year, setYear] = useState(fiscalYears[0] || "");
  const [reportType, setReportType] = useState<"detail" | "summary">("detail");

  function openDialog() {
    // ตั้งค่าเริ่มต้นจากตัวกรองปีที่ใช้อยู่ในตารางตอนนี้ ทุกครั้งที่เปิดกล่องส่งออก
    setScope(initialYear ? "year" : "all");
    setYear(initialYear || fiscalYears[0] || "");
    setOpen(true);
  }

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (scope === "year" && year) params.set("year", year);
    if (reportType === "summary") params.set("type", "summary");
    const s = params.toString();
    return s ? `?${s}` : "";
  }, [scope, year, reportType]);

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-[9px] border border-border bg-surface text-[13px] font-medium hover:bg-paper transition-all active:scale-[0.97]"
      >
        <IconDownload className="w-4 h-4" />
        ส่งออกข้อมูล
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h3 className="font-display font-semibold text-[17px] mb-5">ส่งออกข้อมูลโครงการ</h3>

          <div className="mb-5">
            <div className="text-[12px] text-muted mb-2">ช่วงข้อมูล</div>
            <div className="space-y-2">
              <RadioRow
                checked={scope === "all"}
                onClick={() => setScope("all")}
                title="ทุกปีงบประมาณ"
                desc="รวมโครงการทั้งหมดในระบบ"
              />
              <RadioRow
                checked={scope === "year"}
                onClick={() => setScope("year")}
                title="เฉพาะปีงบประมาณเดียว"
                desc="เลือกปีที่ต้องการด้านล่าง"
              />
            </div>
            {scope === "year" && (
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-2.5 w-full px-3 py-2.5 rounded-[9px] border border-border bg-surface text-[13.5px]"
              >
                {fiscalYears.length === 0 && <option value="">ไม่มีข้อมูลปีงบประมาณ</option>}
                {fiscalYears.map((y) => (
                  <option key={y} value={y}>
                    ปีงบ {y}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-6">
            <div className="text-[12px] text-muted mb-2">รูปแบบรายงาน</div>
            <div className="space-y-2">
              <RadioRow
                checked={reportType === "detail"}
                onClick={() => setReportType("detail")}
                title="รายละเอียดโครงการ"
                desc="ข้อมูลครบทุกฟิลด์ของแต่ละโครงการ เหมาะสำหรับทำงานต่อ"
              />
              <RadioRow
                checked={reportType === "summary"}
                onClick={() => setReportType("summary")}
                title="สรุปภาพรวม"
                desc="ตัวเลขรวม งบประมาณ และสัดส่วนสถานะ/พันธกิจ เหมาะสำหรับนำเสนอ"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {FORMATS.map(({ path, label, Icon, color }) => (
              <a
                key={path}
                href={`/api/export/${path}${query}`}
                onClick={() => {
                  setOpen(false);
                  showToast(`กำลังดาวน์โหลด ${label}...`);
                }}
                className="flex flex-col items-center gap-1.5 py-3.5 rounded-[10px] border border-border hover:border-gold/50 hover:bg-paper transition-all active:scale-[0.95]"
              >
                <Icon className={`w-6 h-6 ${color}`} />
                <span className="text-[12px] font-medium text-ink">{label}</span>
              </a>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
