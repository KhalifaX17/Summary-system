"use client";

import Link from "next/link";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import { Project } from "@/lib/types";
import { canEditProject } from "@/lib/projectRules";

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

        {project.attachments.length > 0 && (
          <div>
            <div className="text-[11.5px] text-muted mb-1.5">ไฟล์แนบ</div>
            <div className="flex flex-wrap gap-1.5">
              {project.attachments.map((a) => (
                <a
                  key={a.url}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] px-2.5 py-1 bg-paper rounded-full text-primary hover:underline"
                >
                  {a.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
        {editable ? (
          <Link
            href={`/projects/${project.id}/edit`}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-[13px] font-medium px-4 py-2 rounded-[9px] transition-colors"
          >
            แก้ไขโครงการ
          </Link>
        ) : (
          <span className="text-[12px] text-muted">โครงการนี้เสร็จสิ้นแล้ว ไม่สามารถแก้ไขได้</span>
        )}
        <button
          type="button"
          onClick={onClose}
          className="text-[13px] text-muted hover:text-ink px-3 py-2"
        >
          ปิด
        </button>
      </div>
    </Modal>
  );
}
