"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Project, MISSION_OPTIONS, STATUS_OPTIONS } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import { deleteProjectAction } from "@/lib/actions";
import { IconEmptyBox, IconPlus } from "@/components/icons";
import ExportDialog from "@/components/ExportDialog";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import { canEditProject } from "@/lib/projectRules";

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [fiscalYear, setFiscalYear] = useState("");
  const [mission, setMission] = useState("");
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const fiscalYears = useMemo(
    () => Array.from(new Set(projects.map((p) => p.fiscalYear).filter(Boolean))).sort().reverse(),
    [projects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (fiscalYear && p.fiscalYear !== fiscalYear) return false;
      if (mission && p.mission !== mission) return false;
      if (status && p.status !== status) return false;
      if (!q) return true;
      return `${p.projectName} ${p.owner} ${p.department}`.toLowerCase().includes(q);
    });
  }, [projects, query, fiscalYear, mission, status]);

  function handleDelete(id: string) {
    if (!confirm("ยืนยันการลบโครงการนี้หรือไม่?")) return;
    setPendingId(id);
    startTransition(async () => {
      await deleteProjectAction(id);
      setPendingId(null);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          className="flex-1 min-w-[220px] px-3.5 py-2.5 rounded-[9px] border border-border bg-surface text-[13.5px]"
          placeholder="ค้นหาชื่อโครงการ, ผู้รับผิดชอบ, หน่วยงาน..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="px-3 py-2.5 rounded-[9px] border border-border bg-surface text-[13px]"
          value={fiscalYear}
          onChange={(e) => setFiscalYear(e.target.value)}
        >
          <option value="">ทุกปีงบประมาณ</option>
          {fiscalYears.map((y) => (
            <option key={y} value={y}>
              ปีงบ {y}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2.5 rounded-[9px] border border-border bg-surface text-[13px]"
          value={mission}
          onChange={(e) => setMission(e.target.value)}
        >
          <option value="">ทุกพันธกิจ</option>
          {MISSION_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2.5 rounded-[9px] border border-border bg-surface text-[13px]"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">ทุกสถานะ</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <ExportDialog fiscalYears={fiscalYears} initialYear={fiscalYear || undefined} />
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-[13px] font-medium px-4 py-2.5 rounded-[9px] transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/25"
          >
            <IconPlus className="w-4 h-4" />
            เพิ่มโครงการ
          </Link>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-paper text-muted text-[12px] font-semibold">
              <th className="text-left px-3.5 py-3">รหัส</th>
              <th className="text-left px-3.5 py-3">ชื่อโครงการ</th>
              <th className="text-left px-3.5 py-3">ผู้รับผิดชอบ</th>
              <th className="text-left px-3.5 py-3">ปีงบ</th>
              <th className="text-left px-3.5 py-3">สถานะ</th>
              <th className="text-left px-3.5 py-3">งบใช้ / ได้รับ</th>
              <th className="px-3.5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const editable = canEditProject(p.status);
              return (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="border-t border-border hover:bg-paper/60 cursor-pointer"
                >
                  <td className="px-3.5 py-3 whitespace-nowrap">{p.id}</td>
                  <td className="px-3.5 py-3 max-w-[260px]">{p.projectName}</td>
                  <td className="px-3.5 py-3 whitespace-nowrap">{p.owner || "-"}</td>
                  <td className="px-3.5 py-3 whitespace-nowrap">{p.fiscalYear || "-"}</td>
                  <td className="px-3.5 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    {p.budgetUsed.toLocaleString("th-TH")} / {p.budgetAllocated.toLocaleString("th-TH")}
                  </td>
                  <td className="px-3.5 py-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    {editable ? (
                      <Link
                        href={`/projects/${p.id}/edit`}
                        className="inline-block px-2.5 py-1.5 rounded-[8px] border border-border text-[12.5px] mr-1 hover:bg-paper"
                      >
                        แก้ไข
                      </Link>
                    ) : (
                      <span
                        className="inline-block px-2.5 py-1.5 rounded-[8px] text-[12.5px] mr-1 text-muted/60 cursor-not-allowed"
                        title="โครงการนี้เสร็จสิ้นแล้ว ไม่สามารถแก้ไขได้"
                      >
                        แก้ไข
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={isPending && pendingId === p.id}
                      className="px-2 py-1.5 text-[12.5px] text-red disabled:opacity-50"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-muted text-[13.5px]">
            <IconEmptyBox />
            {projects.length === 0 ? "ยังไม่มีข้อมูลโครงการ — เริ่มเพิ่มโครงการแรกได้เลย" : "ไม่พบข้อมูลโครงการที่ตรงกับเงื่อนไข"}
          </div>
        )}
      </div>

      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
