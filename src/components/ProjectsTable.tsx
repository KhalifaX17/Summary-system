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

function formatDateTime(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("th-TH", {
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
  });
}

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [fiscalYear, setFiscalYear] = useState("");
  const [mission, setMission] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"updatedAt" | "projectName" | "status" | "budgetAllocated">("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
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

  useEffect(() => {
    setPage(1);
  }, [query, fiscalYear, mission, status]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const multiplier = sortDir === "asc" ? 1 : -1;
      switch (sortBy) {
        case "projectName":
          return a.projectName.localeCompare(b.projectName, "th") * multiplier;
        case "status":
          return a.status.localeCompare(b.status, "th") * multiplier;
        case "budgetAllocated":
          return (Number(a.budgetAllocated || 0) - Number(b.budgetAllocated || 0)) * multiplier;
        case "updatedAt":
        default:
          return ((a.updatedAt || "").localeCompare(b.updatedAt || "") || a.projectName.localeCompare(b.projectName, "th")) * multiplier;
      }
    });
    return list;
  }, [filtered, sortBy, sortDir]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pagedProjects = sorted.slice((page - 1) * pageSize, page * pageSize);

  const statusTabs = [
    { label: "ทั้งหมด", value: "", count: projects.length },
    ...STATUS_OPTIONS.map((value) => ({
      label: value,
      value,
      count: projects.filter((p) => p.status === value).length,
    })),
  ];

  const overviewStats = useMemo(() => {
    const totalBudget = filtered.reduce((sum, project) => sum + Number(project.budgetAllocated || 0), 0);
    const completed = filtered.filter((project) => project.status === "เสร็จสิ้น").length;
    const dueSoon = filtered.filter((project) => {
      if (!project.endDate) return false;
      const end = new Date(project.endDate);
      const diffDays = Math.ceil((end.getTime() - Date.now()) / 86_400_000);
      return diffDays <= 14 && diffDays >= 0;
    }).length;
    const completionRate = filtered.length > 0 ? Math.round((completed / filtered.length) * 100) : 0;

    return [
      { label: "โครงการที่เห็น", value: `${filtered.length}`.toString(), accent: "primary" },
      { label: "งบรวม", value: `${totalBudget.toLocaleString("th-TH")} บาท`, accent: "amber" },
      { label: "สำเร็จ", value: `${completionRate}%`, accent: "green" },
      { label: "ใกล้สิ้นสุด", value: `${dueSoon}`.toString(), accent: "gold" },
    ];
  }, [filtered]);

  function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startTransition(async () => {
      await deleteProjectAction(target.id);
      setDeleteTarget(null);
      showToast(`ลบ "${target.projectName}" แล้ว`);
    });
  }

  function handleSort(key: typeof sortBy) {
    if (sortBy === key) {
      setSortDir((value) => (value === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(key);
    setSortDir(key === "projectName" ? "asc" : "desc");
  }

  const fieldStyle = {
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-border)",
    color: "var(--color-ink)",
  } as const;

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-5 md:px-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">Project archive</p>
          <h2 className="mt-1 font-display text-[26px] font-semibold text-ink">ข้อมูลโครงการ</h2>
          <p className="mt-1 text-[14px] text-muted">ดูและจัดการข้อมูลโครงการจาก Google Sheet</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportDialog fiscalYears={fiscalYears} initialYear={fiscalYear || undefined} />
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 rounded-[12px] px-5 py-3 text-[14px] font-medium text-white shadow-[0_16px_28px_rgba(242,140,40,0.24)] transition-all hover:-translate-y-0.5 active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" }}
          >
            <IconPlus className="h-4 w-4" />
            เพิ่มโครงการ
          </Link>
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        {overviewStats.map((item) => (
          <div
            key={item.label}
            className="rounded-[18px] border p-3.5 shadow-[0_14px_28px_rgba(18,22,25,0.04)]"
            style={{
              borderColor:
                item.accent === "primary"
                  ? "color-mix(in srgb, var(--color-primary) 25%, white)"
                  : item.accent === "amber"
                    ? "color-mix(in srgb, var(--color-amber) 25%, white)"
                    : item.accent === "green"
                      ? "color-mix(in srgb, var(--color-green) 25%, white)"
                      : "color-mix(in srgb, var(--color-gold) 25%, white)",
              background:
                item.accent === "primary"
                  ? "color-mix(in srgb, var(--color-primary) 8%, white)"
                  : item.accent === "amber"
                    ? "color-mix(in srgb, var(--color-amber) 10%, white)"
                    : item.accent === "green"
                      ? "color-mix(in srgb, var(--color-green) 10%, white)"
                      : "color-mix(in srgb, var(--color-gold) 12%, white)",
            }}
          >
            <div className="mb-1 text-[11px] uppercase tracking-[0.12em] text-muted">{item.label}</div>
            <div className="text-[24px] font-semibold text-ink tabular-nums">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 rounded-[22px] border p-3 shadow-[0_16px_32px_rgba(123,77,39,0.05)]" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 100%, white) 0%, color-mix(in srgb, var(--color-paper) 100%, white) 100%)" }}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.value || "all"}
                type="button"
                onClick={() => setStatus(tab.value)}
                className="rounded-full px-3 py-2 text-[13px] font-medium transition-all"
                style={
                  status === tab.value
                    ? {
                        backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, white)",
                        boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 32%, transparent)",
                        color: "var(--color-primary)",
                      }
                    : { backgroundColor: "var(--color-paper)", color: "var(--color-muted)" }
                }
              >
                {tab.label}
                <span
                  className="ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]"
                  style={
                    status === tab.value
                      ? { backgroundColor: "var(--color-surface)", color: "var(--color-primary)" }
                      : { backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, var(--color-surface))", color: "var(--color-muted)" }
                  }
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-muted">⌕</span>
            <input
              className="w-full rounded-[12px] border py-2.5 pl-9 pr-3 text-[13px] text-ink outline-none transition-all placeholder:text-[#a88f82] focus:border-primary focus:ring-4 focus:ring-primary/10"
              style={fieldStyle}
              placeholder="ค้นหาโครงการ/ผู้รับผิดชอบ"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="rounded-[12px] border px-3.5 py-2.5 text-[13px] text-muted outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            style={fieldStyle}
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
            className="rounded-[12px] border px-3.5 py-2.5 text-[13px] text-muted outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            style={fieldStyle}
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
            className="rounded-[12px] border px-3.5 py-2.5 text-[13px] text-muted outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            style={fieldStyle}
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
              className="ml-auto rounded-[10px] px-3 py-2.5 text-[13px] transition-colors"
              style={{ color: "var(--color-muted)" }}
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[22px] border bg-white shadow-[0_16px_32px_rgba(123,77,39,0.05)]" style={{ borderColor: "var(--color-border)" }}>
        <div className="overflow-hidden">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-paper) 92%, white)", color: "var(--color-muted)" }}>
                <th className="px-4 py-3 text-left"><button type="button" className="font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--color-muted)" }} onClick={() => handleSort("updatedAt")}>วันที่ / เวลา</button></th>
                <th className="px-4 py-3 text-left">รหัส</th>
                <th className="px-4 py-3 text-left"><button type="button" className="font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--color-muted)" }} onClick={() => handleSort("projectName")}>ชื่อโครงการ</button></th>
                <th className="px-4 py-3 text-left">ผู้รับผิดชอบ</th>
                <th className="px-4 py-3 text-left">พันธกิจ</th>
                <th className="px-4 py-3 text-left"><button type="button" className="font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--color-muted)" }} onClick={() => handleSort("budgetAllocated")}>งบประมาณ</button></th>
                <th className="px-4 py-3 text-left"><button type="button" className="font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--color-muted)" }} onClick={() => handleSort("status")}>สถานะ</button></th>
                <th className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pagedProjects.map((p) => {
                const editable = canEditProject(p.status);
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="cursor-pointer border-b last:border-0 hover:bg-paper active:bg-[#fff5ee]"
                    style={{ borderColor: "color-mix(in srgb, var(--color-border) 80%, white)" }}
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-muted">{formatDateTime(p.updatedAt || p.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold" style={{ color: "var(--color-primary)" }}>{p.id}</td>
                    <td className="max-w-[280px] px-4 py-4 font-medium text-ink">
                      <div className="truncate whitespace-nowrap">{p.projectName}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-ink">{p.owner || "-"}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-muted">{p.mission || "-"}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-ink">{p.budgetAllocated.toLocaleString("th-TH")} บาท</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {editable ? (
                        <Link
                          href={`/projects/${p.id}/edit`}
                          className="mr-1 inline-block rounded-[8px] border px-2.5 py-1.5 text-[12.5px] text-ink transition-all active:scale-[0.95]"
                          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-paper)" }}
                        >
                          แก้ไข
                        </Link>
                      ) : (
                        <span
                          className="mr-1 inline-block cursor-not-allowed rounded-[8px] px-2.5 py-1.5 text-[12.5px]"
                          style={{ color: "color-mix(in srgb, var(--color-muted) 55%, white)" }}
                          title="โครงการนี้เสร็จสิ้นแล้ว ไม่สามารถแก้ไขได้"
                        >
                          แก้ไข
                        </span>
                      )}
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="rounded-[8px] px-2 py-1.5 text-[12.5px] transition-all active:scale-[0.95]"
                        style={{ color: "var(--color-red)" }}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-[13.5px] text-muted">
            <IconEmptyBox />
            {projects.length === 0 ? "ยังไม่มีข้อมูลโครงการ — เริ่มเพิ่มโครงการแรกได้เลย" : "ไม่พบข้อมูลโครงการที่ตรงกับเงื่อนไข"}
          </div>
        )}
      </div>

      {sorted.length > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-[18px] border px-3 py-2.5" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
          <div className="text-[12px] text-muted">
            หน้า {page} / {totalPages} · {sorted.length} รายการ
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-[10px] border px-3 py-1.5 text-[12px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-paper)", color: "var(--color-ink)" }}
            >
              ก่อนหน้า
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="rounded-[10px] border px-3 py-1.5 text-[12px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-paper)", color: "var(--color-ink)" }}
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}

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
