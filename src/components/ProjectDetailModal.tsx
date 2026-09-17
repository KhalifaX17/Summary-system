"use client";

import Link from "next/link";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import { Project } from "@/lib/types";
import { canEditProject } from "@/lib/projectRules";
import { IconDownload, IconFileCsv, IconFileExcel, IconFilePdf } from "./icons";

function fmt(n: number) {
  return (n || 0).toLocaleString("th-TH");
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[11.5px] text-muted mb-1">{label}</div>
      <div className="text-[13.5px] text-ink leading-relaxed whitespace-pre-line">{value}</div>
    </div>
  );
}

export default function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const editable = canEditProject(project.status);
  const exportFormats = [
    { path: "excel", label: "Excel", Icon: IconFileExcel, color: "text-green" },
    { path: "pdf", label: "PDF", Icon: IconFilePdf, color: "text-red" },
    { path: "csv", label: "CSV", Icon: IconFileCsv, color: "text-primary" },
  ];

  return (
    <Modal onClose={onClose}>
      <div className="pr-6 mb-1">
        <h3 className="font-display font-semibold text-[18px] leading-snug">{project.projectName}</h3>
      </div>
      <div className="flex items-center gap-2 mb-5">
        <StatusBadge status={project.status} />
        <span className="text-[12px] text-muted">{project.id}</span>
      </div>

      <div className="space-y-4 max-h-[52vh] overflow-y-auto pr-1 -mr-1">
        <div className="grid grid-cols-2 gap-4">
          <Row label="หน่วยงาน" value={project.department} />
          <Row label="ผู้รับผิดชอบ" value={project.owner} />
          <Row label="ปีงบประมาณ" value={project.fiscalYear} />
          <Row label="พันธกิจ" value={project.mission} />
        </div>
        <Row label="ตัวบ่งชี้ QA ที่เกี่ยวข้อง" value={project.qaIndicator} />
        <Row
          label="ช่วงเวลาดำเนินการ"
          value={project.startDate || project.endDate ? `${project.startDate || "-"} ถึง ${project.endDate || "-"}` : undefined}
        />
        <Row label="วัตถุประสงค์" value={project.objective} />
        <Row
          label="งบประมาณ"
          value={
            project.budgetAllocated || project.budgetUsed
              ? `ได้รับ ${fmt(project.budgetAllocated)} บาท · ใช้จริง ${fmt(project.budgetUsed)} บาท`
              : undefined
          }
        />
        <Row label="ผู้เข้าร่วมจริง" value={project.participantActual ? `${project.participantActual} คน` : undefined} />
        <Row label="สรุปผลการดำเนินงาน" value={project.results} />
        <Row label="ปัญหา/อุปสรรค" value={project.problems} />
        <Row label="ข้อเสนอแนะ" value={project.recommendations} />

      </div>

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
        {editable ? (
          <Link
            href={`/projects/${project.id}/edit`}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-[13px] font-medium px-4 py-2 rounded-[9px] transition-all active:scale-[0.96]"
          >
            แก้ไขโครงการ
          </Link>
        ) : (
          <span className="text-[12px] text-muted">โครงการนี้เสร็จสิ้นแล้ว ไม่สามารถแก้ไขได้</span>
        )}
        <div className="flex items-center gap-2">
          <div className="group relative">
            <button
              type="button"
              aria-label="ส่งออกโครงการนี้"
              className="inline-flex items-center gap-1.5 rounded-[9px] border border-border px-3 py-2 text-[13px] text-muted transition-colors hover:border-primary/40 hover:bg-paper hover:text-primary"
            >
              <IconDownload className="h-4 w-4" />
              ส่งออก
            </button>
            <div className="invisible absolute bottom-full right-0 z-10 mb-2 w-36 translate-y-1 rounded-xl border border-border bg-surface p-1.5 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {exportFormats.map(({ path, label, Icon, color }) => (
                <a
                  key={path}
                  href={`/api/export/${path}?id=${encodeURIComponent(project.id)}`}
                  download
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12.5px] text-ink hover:bg-paper"
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                  {label}
                </a>
              ))}
            </div>
          </div>
          <button
          type="button"
          onClick={onClose}
          className="text-[13px] text-muted hover:text-ink px-3 py-2 transition-transform active:scale-95"
        >
          ปิด
        </button>
        </div>
      </div>
    </Modal>
  );
}
