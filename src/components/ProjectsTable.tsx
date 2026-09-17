"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Project, MISSION_OPTIONS, STATUS_OPTIONS } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import { deleteProjectAction } from "@/lib/actions";
import { IconEmptyBox, IconPlus } from "@/components/icons";
import ExportDialog from "@/components/ExportDialog";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { showToast } from "@/components/Toast";
import { canEditProject } from "@/lib/projectRules";

const TOAST_MESSAGES: Record<string, string> = {
  created: "เพิ่มโครงการเรียบร้อยแล้ว",
  updated: "บันทึกการแก้ไขเรียบร้อยแล้ว",
};

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [fiscalYear, setFiscalYear] = useState("");
  const [mission, setMission] = useState("");
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  useEffect(() => {
    const toastKey = searchParams.get("toast");
    if (toastKey && TOAST_MESSAGES[toastKey]) {
      showToast(TOAST_MESSAGES[toastKey]);
      router.replace("/projects");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

  const statusTabs = [
    { label: "ทั้งหมด", value: "", count: projects.length },
    ...STATUS_OPTIONS.map((value) => ({
      label: value,
      value,
      count: projects.filter((p) => p.status === value).length,
    })),
  ];

  function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startTransition(async () => {
      await deleteProjectAction(target.id);
      setDeleteTarget(null);
      showToast(`ลบ "${target.projectName}" แล้ว`);
    });
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-[21px] font-semibold text-ink">ข้อมูลโครงการ</h2>
          <p className="mt-1 text-[14px] text-muted">ดูและจัดการข้อมูลโครงการจาก Google Sheet</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportDialog fiscalYears={fiscalYears} initialYear={fiscalYear || undefined} />
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 rounded-[9px] bg-primary px-5 py-3 text-[14px] font-medium text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.97]"
          >
            <IconPlus className="h-4 w-4" />
            เพิ่มโครงการ
          </Link>
        </div>
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-border">
        {statusTabs.map((tab) => (
          <button
            key={tab.value || "all"}
            type="button"
            onClick={() => setStatus(tab.value)}
            className={`whitespace-nowrap border-b-2 px-3 py-3 text-[14px] transition-colors ${
              status === tab.value
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
              status === tab.value ? "bg-primary/10 text-primary" : "bg-paper text-muted"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-4 rounded-xl border border-border bg-surface p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
        <input
          className="min-w-[260px] flex-1 rounded-[8px] border border-border bg-paper/40 px-4 py-3 text-[14px] outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:bg-surface"
          placeholder="ค้นหาชื่อโครงการ, ผู้รับผิดชอบ, หน่วยงาน..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded-[8px] border border-border bg-surface px-3.5 py-3 text-[14px] text-muted outline-none focus:border-primary"
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
          className="rounded-[8px] border border-border bg-surface px-3.5 py-3 text-[14px] text-muted outline-none focus:border-primary"
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
          className="rounded-[8px] border border-border bg-surface px-3.5 py-3 text-[14px] text-muted outline-none focus:border-primary"
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

        {(query || fiscalYear || mission || status) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFiscalYear("");
              setMission("");
              setStatus("");
            }}
            className="ml-auto rounded-[8px] px-3 py-2.5 text-[14px] text-muted transition-colors hover:bg-paper hover:text-ink"
          >
            ล้างตัวกรอง
          </button>
        )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full min-w-[1000px] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-border bg-paper/70 text-[13px] font-semibold uppercase tracking-wide text-muted">
              <th className="px-4 py-3 text-left">วันที่บันทึก</th>
              <th className="px-4 py-3 text-left">รหัสโครงการ</th>
              <th className="px-4 py-3 text-left">ชื่อโครงการ</th>
              <th className="px-4 py-3 text-left">ผู้รับผิดชอบ</th>
              <th className="px-4 py-3 text-left">พันธกิจ</th>
              <th className="px-4 py-3 text-left">งบประมาณ</th>
              <th className="px-4 py-3 text-left">สถานะ</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const editable = canEditProject(p.status);
              return (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-paper/60 active:bg-paper"
                >
                  <td className="whitespace-nowrap px-4 py-4 text-muted">{p.createdAt ? new Date(p.createdAt).toLocaleDateString("th-TH") : "-"}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-primary">{p.id}</td>
                  <td className="max-w-[280px] px-4 py-4 font-medium text-ink">{p.projectName}</td>
                  <td className="whitespace-nowrap px-4 py-4">{p.owner || "-"}</td>
                  <td className="max-w-[150px] px-4 py-4 text-muted">{p.mission || "-"}</td>
                  <td className="whitespace-nowrap px-4 py-4">{p.budgetAllocated.toLocaleString("th-TH")} บาท</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {editable ? (
                      <Link
                        href={`/projects/${p.id}/edit`}
                        className="inline-block px-2.5 py-1.5 rounded-[8px] border border-border text-[12.5px] mr-1 hover:bg-paper transition-all active:scale-[0.95]"
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
                      onClick={() => setDeleteTarget(p)}
                      className="px-2 py-1.5 text-[12.5px] text-red transition-all active:scale-[0.95] rounded-[8px] hover:bg-red/10"
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

      {deleteTarget && (
        <ConfirmDialog
          title="ยืนยันการลบโครงการ"
          description={`ต้องการลบ "${deleteTarget.projectName}" ใช่หรือไม่ — การลบไม่สามารถย้อนกลับได้`}
          confirmLabel="ลบโครงการ"
          danger
          loading={isPending}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
