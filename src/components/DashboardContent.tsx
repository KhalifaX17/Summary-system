"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { computeDashboardStats, getAttentionItems, getRecentActivity } from "@/lib/stats";
import { Project } from "@/lib/types";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import AttentionPanel from "@/components/AttentionPanel";
import RecentActivity from "@/components/RecentActivity";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import { IconBudget, IconCoin, IconFolder, IconUsers } from "@/components/icons";

const STATUS_COLORS: Record<string, string> = {
  วางแผน: "var(--color-primary)",
  กำลังดำเนินการ: "var(--color-primary-dark)",
  เสร็จสิ้น: "var(--color-green)",
  ล่าช้า: "var(--color-red)",
  ยกเลิก: "var(--color-muted)",
};

const MISSION_COLORS: Record<string, string> = {
  การเรียนการสอน: "var(--color-primary)",
  การวิจัย: "var(--color-gold)",
  การบริการวิชาการ: "var(--color-green)",
  ทำนุบำรุงศิลปวัฒนธรรม: "var(--color-amber)",
  บริหารจัดการ: "var(--color-muted)",
};

export default function DashboardContent({ projects }: { projects: Project[] }) {
  const fiscalYears = useMemo(
    () => Array.from(new Set(projects.map((p) => p.fiscalYear).filter(Boolean))).sort().reverse(),
    [projects]
  );
  const [year, setYear] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [missionFilter, setMissionFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [showProjectList, setShowProjectList] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectSearch, setProjectSearch] = useState("");
  const projectListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showProjectList) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowProjectList(false);
        setProjectSearch("");
      }
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (projectListRef.current && !projectListRef.current.contains(event.target as Node)) {
        setShowProjectList(false);
        setProjectSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showProjectList]);

  const scoped = useMemo(
    () => (year === "all" ? projects : projects.filter((p) => p.fiscalYear === year)),
    [projects, year]
  );

  const departmentOptions = useMemo(
    () => Array.from(new Set(projects.map((project) => project.department).filter(Boolean))).sort(),
    [projects]
  );

  const ownerOptions = useMemo(
    () => Array.from(new Set(projects.map((project) => project.owner).filter(Boolean))).sort(),
    [projects]
  );

  const filteredProjects = useMemo(
    () =>
      scoped.filter((project) => {
        const passStatus = statusFilter === "all" || project.status === statusFilter;
        const passMission = missionFilter === "all" || project.mission === missionFilter;
        const passDepartment = departmentFilter === "all" || project.department === departmentFilter;
        const passOwner = ownerFilter === "all" || project.owner === ownerFilter;
        return passStatus && passMission && passDepartment && passOwner;
      }),
    [scoped, statusFilter, missionFilter, departmentFilter, ownerFilter]
  );

  const projectList = useMemo(() => {
    const normalized = projectSearch.trim().toLowerCase();
    return [...filteredProjects]
      .filter((project) => {
        if (!normalized) return true;
        return (
          project.projectName.toLowerCase().includes(normalized) ||
          project.id.toLowerCase().includes(normalized) ||
          (project.owner || "").toLowerCase().includes(normalized)
        );
      })
      .sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return bTime - aTime;
      });
  }, [filteredProjects, projectSearch]);

  const stats = useMemo(() => computeDashboardStats(filteredProjects), [filteredProjects]);
  const attention = useMemo(() => getAttentionItems(filteredProjects), [filteredProjects]);
  const recent = useMemo(() => getRecentActivity(filteredProjects), [filteredProjects]);

  const yearlySummary = useMemo(() => {
    const summary = new Map<string, { total: number; budget: number; used: number }>();

    for (const project of projects) {
      const label = project.fiscalYear || "ไม่ระบุ";
      const row = summary.get(label) ?? { total: 0, budget: 0, used: 0 };
      row.total += 1;
      row.budget += project.budgetAllocated || 0;
      row.used += project.budgetUsed || 0;
      summary.set(label, row);
    }

    return Array.from(summary.entries())
      .map(([label, value]) => ({ label, ...value }))
      .sort((a, b) => Number(b.label) - Number(a.label));
  }, [projects]);

  const maxStatus = Math.max(1, ...Object.values(stats.byStatus));
  const maxMission = Math.max(1, ...Object.values(stats.byMission));
  const budgetPct =
    stats.totalBudgetAllocated > 0
      ? Math.min(100, Math.round((stats.totalBudgetUsed / stats.totalBudgetAllocated) * 100))
      : 0;
  const active = stats.byStatus["กำลังดำเนินการ"] || 0;
  const dueSoon = filteredProjects.filter((project) => {
    if (!project.endDate) return false;
    const end = new Date(project.endDate);
    const diffDays = Math.ceil((end.getTime() - Date.now()) / 86_400_000);
    return diffDays <= 14 && diffDays >= 0;
  }).length;
  const budgetRisk = filteredProjects.filter((project) => {
    if (!project.budgetAllocated || project.budgetAllocated <= 0) return false;
    return (project.budgetUsed || 0) / project.budgetAllocated >= 0.9;
  }).length;
  const completionRate = stats.total ? Math.round(((stats.byStatus["เสร็จสิ้น"] ?? 0) / stats.total) * 100) : 0;

  const summaryMetrics = [
    { label: "กำลังดำเนินการ", value: active, accent: "primary" },
    { label: "ใกล้กำหนด", value: dueSoon, accent: "amber" },
    { label: "มีความเสี่ยงงบ", value: budgetRisk, accent: "gold" },
    { label: "สำเร็จ", value: `${completionRate}%`, accent: "green" },
  ] as const;

  const monthlyTrend = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - (5 - index));
      return date;
    });

    const rows = months.map((date) => {
      const label = new Intl.DateTimeFormat("th-TH", { month: "short" }).format(date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return {
        label,
        monthKey,
        value: filteredProjects.filter((project) => {
          const source = project.createdAt || project.updatedAt || "";
          if (!source) return false;
          const stamp = new Date(source);
          if (Number.isNaN(stamp.getTime())) return false;
          return `${stamp.getFullYear()}-${String(stamp.getMonth() + 1).padStart(2, "0")}` === monthKey;
        }).length,
      };
    });

    return rows;
  }, [filteredProjects]);

  const topOwners = useMemo(() => {
    const map = new Map<string, number>();
    for (const project of filteredProjects) {
      const owner = project.owner || "ไม่ระบุ";
      map.set(owner, (map.get(owner) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value }));
  }, [filteredProjects]);

  const insightPills = [
    { label: "กำลังดำเนินการ", value: `${active} โครงการ` },
    { label: "ใกล้สิ้นสุด", value: `${dueSoon} รายการ` },
    { label: "สำเร็จ", value: `${completionRate}%` },
  ];

  const insightCards = [
    {
      label: "อัตราการสำเร็จ",
      value: `${completionRate}%`,
      detail: `${stats.byStatus["เสร็จสิ้น"] ?? 0} โครงการสำเร็จ`,
      accent: "green" as const,
    },
    {
      label: "งบที่ใช้จริง",
      value: `${budgetPct}%`,
      detail: `${stats.totalBudgetUsed.toLocaleString("th-TH")} / ${stats.totalBudgetAllocated.toLocaleString("th-TH")} บาท`,
      accent: "amber" as const,
    },
    {
      label: "ติดตามเร็ว ๆ นี้",
      value: `${dueSoon}`,
      detail: "โครงการที่ใกล้สิ้นสุดใน 14 วัน",
      accent: "primary" as const,
    },
  ];

  const accentStyles: Record<(typeof summaryMetrics)[number]["accent"], { bg: string; text: string; border: string }> = {
    primary: {
      bg: "color-mix(in srgb, var(--color-primary) 9%, white)",
      text: "var(--color-primary)",
      border: "color-mix(in srgb, var(--color-primary) 25%, white)",
    },
    amber: {
      bg: "color-mix(in srgb, var(--color-amber) 11%, white)",
      text: "var(--color-amber)",
      border: "color-mix(in srgb, var(--color-amber) 25%, white)",
    },
    gold: {
      bg: "color-mix(in srgb, var(--color-gold) 12%, white)",
      text: "var(--color-gold)",
      border: "color-mix(in srgb, var(--color-gold) 25%, white)",
    },
    green: {
      bg: "color-mix(in srgb, var(--color-green) 10%, white)",
      text: "var(--color-green)",
      border: "color-mix(in srgb, var(--color-green) 25%, white)",
    },
  };

  return (
    <div style={{ backgroundColor: "var(--color-paper)" }}>
      <Topbar title="แดชบอร์ดภาพรวม" subtitle="สรุปภาพรวมโครงการทั้งหมดของสาขา" />

      <div className="mx-auto max-w-[1500px] px-5 py-5 md:px-7">
        <div
          className="relative mb-5 overflow-hidden rounded-[28px] border px-5 py-5 text-white shadow-[0_24px_50px_rgba(18,22,25,0.12)] md:px-7"
          style={{
            borderColor: "color-mix(in srgb, var(--color-primary) 22%, white)",
            background: "linear-gradient(135deg, color-mix(in srgb, var(--color-navy) 96%, black) 0%, color-mix(in srgb, var(--color-primary-dark) 60%, var(--color-navy)) 45%, color-mix(in srgb, var(--color-primary) 86%, white) 100%)",
          }}
        >
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-16 h-28 w-28 rounded-full blur-2xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-gold) 35%, transparent)" }} />
          <div className="absolute left-0 top-0 h-full w-full" style={{ background: "radial-gradient(circle at 40% 30%, rgba(255,255,255,0.16), transparent 20%)" }} />

          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/65">ภาพรวมล่าสุด</div>
              <p className="text-[14px] text-white/90 leading-7">
                <b className="font-semibold text-white">{stats.total}</b> โครงการทั้งหมด ·{" "}
                <b className="font-semibold text-white">{active}</b> กำลังดำเนินการ ·{" "}
                <b className="font-semibold text-white">{dueSoon}</b> ใกล้สิ้นสุด
              </p>
            </div>

            {fiscalYears.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur-sm">
                <YearPill label="ทุกปี" active={year === "all"} onClick={() => setYear("all")} />
                {fiscalYears.map((y) => (
                  <YearPill key={y} label={`ปีงบ ${y}`} active={year === y} onClick={() => setYear(y)} />
                ))}
              </div>
            )}
          </div>

          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/65">สถานะ</span>
            <StatusFilterPill label="ทั้งหมด" active={statusFilter === "all"} onClick={() => setStatusFilter("all")} />
            {Object.keys(stats.byStatus).map((status) => (
              <StatusFilterPill
                key={status}
                label={status}
                active={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              />
            ))}
          </div>

          <div className="relative mt-4 flex flex-wrap gap-2">
            {insightPills.map((pill) => (
              <div
                key={pill.label}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] tracking-[0.08em] text-white/80 backdrop-blur-sm"
              >
                <span className="mr-1.5 uppercase text-white/65">{pill.label}</span>
                <span className="font-medium text-white">{pill.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 rounded-[22px] border p-3 shadow-[0_16px_32px_rgba(18,22,25,0.04)]" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-paper) 95%, white) 100%)" }}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">ตัวกรองข้อมูล</div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setMissionFilter("all");
                  setDepartmentFilter("all");
                  setOwnerFilter("all");
                }}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-medium text-ink transition-all active:scale-[0.98]"
              >
                รีเซ็ต
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              พันธกิจ
              <select
                value={missionFilter}
                onChange={(event) => setMissionFilter(event.target.value)}
                className="rounded-xl border border-border bg-white px-3 py-2 text-[12.5px] font-medium text-ink outline-none transition-colors focus:border-primary"
              >
                <option value="all">ทั้งหมด</option>
                {Object.keys(MISSION_COLORS).map((mission) => (
                  <option key={mission} value={mission}>{mission}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              หน่วยงาน
              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                className="rounded-xl border border-border bg-white px-3 py-2 text-[12.5px] font-medium text-ink outline-none transition-colors focus:border-primary"
              >
                <option value="all">ทั้งหมด</option>
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              ผู้รับผิดชอบ
              <select
                value={ownerFilter}
                onChange={(event) => setOwnerFilter(event.target.value)}
                className="rounded-xl border border-border bg-white px-3 py-2 text-[12.5px] font-medium text-ink outline-none transition-colors focus:border-primary"
              >
                <option value="all">ทั้งหมด</option>
                {ownerOptions.map((owner) => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              สถานะ
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-border bg-white px-3 py-2 text-[12.5px] font-medium text-ink outline-none transition-colors focus:border-primary"
              >
                <option value="all">ทั้งหมด</option>
                {Object.keys(STATUS_COLORS).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              ปีงบประมาณ
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="rounded-xl border border-border bg-white px-3 py-2 text-[12.5px] font-medium text-ink outline-none transition-colors focus:border-primary"
              >
                <option value="all">ทั้งหมด</option>
                {fiscalYears.map((entry) => (
                  <option key={entry} value={entry}>{entry}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          {insightCards.map((card) => {
            const style = accentStyles[card.accent];
            return (
              <div
                key={card.label}
                className="hover-lift rounded-[22px] border p-4"
                style={{
                  background: `linear-gradient(180deg, ${style.bg} 0%, var(--color-surface) 100%)`,
                  borderColor: style.border,
                  boxShadow: "0 18px 28px rgba(18, 22, 25, 0.05)",
                }}
              >
                <div className="mb-2 text-[11px] uppercase tracking-[0.16em]" style={{ color: style.text }}>{card.label}</div>
                <div className="text-[30px] font-semibold text-ink tabular-nums">{card.value}</div>
                <div className="mt-2 text-[12px] text-muted">{card.detail}</div>
              </div>
            );
          })}
        </div>

        <div className="mb-5 grid gap-3 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[22px] border p-4.5 shadow-[0_16px_32px_rgba(18,22,25,0.06)]" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-paper) 94%, white) 100%)" }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[18px] font-semibold text-ink">แนวโน้มโครงการ 6 เดือน</h3>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 11%, var(--color-surface))", color: "var(--color-primary)" }}>Trend</span>
            </div>

            <div className="flex h-[172px] items-end gap-2 overflow-hidden">
              {monthlyTrend.map((item) => {
                const peak = Math.max(1, ...monthlyTrend.map((entry) => entry.value));
                const barHeight = Math.max(8, (item.value / peak) * 100);
                return (
                  <div key={item.monthKey} className="flex flex-1 flex-col items-center justify-end gap-2">
                    <div className="flex w-full items-end justify-center rounded-t-[12px] bg-gradient-to-t from-primary to-primary/60" style={{ height: `${barHeight}%` }} title={`${item.label}: ${item.value} โครงการ`} />
                    <div className="text-center">
                      <div className="text-[11px] font-medium text-muted">{item.label}</div>
                      <div className="text-[10px] text-muted">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[22px] border p-4.5 shadow-[0_16px_32px_rgba(18,22,25,0.06)]" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-paper) 94%, white) 100%)" }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[18px] font-semibold text-ink">ผู้รับผิดชอบมากสุด</h3>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: "color-mix(in srgb, var(--color-gold) 12%, var(--color-surface))", color: "var(--color-gold)" }}>Top 5</span>
            </div>

            <div className="space-y-3">
              {topOwners.length > 0 ? (
                topOwners.map((owner, index) => (
                  <div key={owner.label} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ background: index === 0 ? "var(--color-primary)" : index === 1 ? "var(--color-gold)" : index === 2 ? "var(--color-green)" : "var(--color-muted)" }}>
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-medium text-ink">{owner.label}</div>
                    </div>
                    <div className="text-[12px] font-semibold text-muted">{owner.value}</div>
                  </div>
                ))
              ) : (
                <div className="text-[12px] text-muted">ยังไม่มีข้อมูลผู้รับผิดชอบ</div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-5 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[22px] border p-4.5 shadow-[0_16px_32px_rgba(18,22,25,0.06)]" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-paper) 94%, white) 100%)" }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[18px] font-semibold text-ink">ภาพรวมตามปีงบประมาณ</h3>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 11%, var(--color-surface))", color: "var(--color-primary)" }}>{yearlySummary.length} ปี</span>
            </div>
            <div className="flex h-[160px] items-end gap-2 overflow-hidden">
              {yearlySummary.map((item) => {
                const barHeight = Math.max(14, (item.total / Math.max(1, ...yearlySummary.map((entry) => entry.total))) * 100);
                return (
                  <div key={item.label} className="flex flex-1 flex-col items-center justify-end gap-2">
                    <div className="flex w-full items-end justify-center rounded-t-[12px] bg-gradient-to-t from-primary to-primary/60" style={{ height: `${barHeight}%` }} title={`${item.label}: ${item.total} โครงการ`} />
                    <div className="text-center">
                      <div className="text-[11px] font-medium text-muted">{item.label}</div>
                      <div className="text-[10px] text-muted">{item.total}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[22px] border p-4.5 shadow-[0_16px_32px_rgba(18,22,25,0.06)]" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-paper) 94%, white) 100%)" }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[18px] font-semibold text-ink">สรุปค่าเฉลี่ยต่อปี</h3>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: "color-mix(in srgb, var(--color-gold) 13%, var(--color-surface))", color: "var(--color-gold)" }}>Trend</span>
            </div>
            <div className="space-y-3">
              {yearlySummary.slice(0, 4).map((item) => (
                <div key={item.label} className="rounded-[14px] border border-border bg-white/70 p-2.5">
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-medium text-ink">ปี {item.label}</span>
                    <span className="text-muted">{item.total} โครงการ</span>
                  </div>
                  <div className="text-[11.5px] text-muted">ใช้จริง {item.used.toLocaleString("th-TH")} / {item.budget.toLocaleString("th-TH")} บาท</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {summaryMetrics.map((metric) => {
            const style = accentStyles[metric.accent];
            return (
              <div
                key={metric.label}
                className="hover-lift rounded-[18px] border p-3"
                style={{
                  background: `linear-gradient(180deg, ${style.bg} 0%, var(--color-surface) 100%)`,
                  borderColor: style.border,
                  boxShadow: "0 12px 24px rgba(18, 22, 25, 0.04)",
                }}
              >
                <div className="mb-2 text-[11px] uppercase tracking-[0.12em]" style={{ color: style.text }}>{metric.label}</div>
                <div className="text-[24px] font-semibold text-ink tabular-nums">{metric.value}</div>
              </div>
            );
          })}
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3.5 md:grid-cols-4">
          <div className="hover-lift relative">
            <StatCard
              label="จำนวนโครงการทั้งหมด"
              value={stats.total}
              icon={<IconFolder />}
              accent="primary"
              onClick={() => {
                setShowProjectList((current) => !current);
                if (showProjectList) setProjectSearch("");
              }}
            />

            {showProjectList && (
              <div
                ref={projectListRef}
                className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-border bg-surface p-2 shadow-xl"
              >
                <div className="mb-2 flex items-center justify-between gap-2 px-2 pt-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">โครงการทั้งหมด</span>
                  <button
                    type="button"
                    onClick={() => setShowProjectList(false)}
                    className="rounded-full px-2 py-1 text-[11px] text-muted hover:bg-paper hover:text-ink"
                  >
                    ปิด
                  </button>
                </div>

                <div className="mb-2 px-2">
                  <input
                    value={projectSearch}
                    onChange={(event) => setProjectSearch(event.target.value)}
                    placeholder="ค้นหาโครงการ / รหัส / ผู้รับผิดชอบ"
                    className="w-full rounded-xl border border-border bg-paper px-3 py-2 text-[12.5px] text-ink outline-none transition-colors placeholder:text-muted focus:border-primary"
                  />
                </div>

                <div className="max-h-[280px] space-y-1 overflow-y-auto pr-1">
                  {projectList.length > 0 ? (
                    projectList.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => {
                          setSelectedProject(project);
                          setShowProjectList(false);
                          setProjectSearch("");
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors hover:bg-paper"
                      >
                        <span className="truncate pr-3 text-[13px] font-medium text-ink">{project.projectName}</span>
                        <span className="shrink-0 text-[11px] text-muted">{project.id}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-5 text-center text-[12px] text-muted">
                      {projectSearch ? "ไม่พบโครงการที่ตรงกับคำค้นหา" : "ยังไม่มีโครงการในช่วงเวลานี้"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hover-lift">
            <StatCard
              label="งบประมาณที่ได้รับ"
              value={stats.totalBudgetAllocated}
              suffix="บาท"
              icon={<IconCoin />}
              accent="green"
            />
          </div>
          <div className="hover-lift">
            <StatCard
              label="งบประมาณที่ใช้จริง"
              value={stats.totalBudgetUsed}
              suffix="บาท"
              icon={<IconBudget />}
              accent="amber"
            />
          </div>
          <div className="hover-lift">
            <StatCard
              label="ผู้เข้าร่วมสะสม"
              value={stats.totalParticipants}
              suffix="คน"
              icon={<IconUsers />}
              accent="gold"
            />
          </div>
        </div>

        {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[22px] border p-4.5 shadow-[0_16px_32px_rgba(18,22,25,0.06)]" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-paper) 94%, white) 100%)" }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[18px] font-semibold text-ink">สถานะโครงการ</h3>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))", color: "var(--color-primary)" }}>Live</span>
            </div>
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="mb-3 flex items-center gap-3">
                <div className="w-[110px] shrink-0 text-[12px] font-medium text-muted">{status}</div>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--color-border) 82%, white)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.round((count / maxStatus) * 100)}%`,
                      background: STATUS_COLORS[status],
                    }}
                  />
                </div>
                <div className="w-7 text-right text-[12px] font-semibold text-ink tabular-nums">{count}</div>
              </div>
            ))}
          </div>

          <div className="rounded-[22px] border p-4.5 shadow-[0_16px_32px_rgba(18,22,25,0.06)]" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-paper) 94%, white) 100%)" }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[18px] font-semibold text-ink">การใช้จ่ายงบประมาณ</h3>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: "color-mix(in srgb, var(--color-amber) 16%, var(--color-surface))", color: "var(--color-amber)" }}>Forecast</span>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="relative flex h-[108px] w-[108px] shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(var(--color-primary) ${budgetPct * 3.6}deg, color-mix(in srgb, var(--color-border) 78%, white) 0deg)`,
                }}
              >
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full text-[15px] font-semibold text-ink tabular-nums shadow-inner" style={{ backgroundColor: "var(--color-surface)" }}>
                  {budgetPct}%
                </div>
              </div>
              <div className="text-[12px] leading-7 text-muted">
                <div>
                  ได้รับ: <b className="text-ink">{stats.totalBudgetAllocated.toLocaleString("th-TH")}</b> บาท
                </div>
                <div>
                  ใช้ไป: <b className="text-ink">{stats.totalBudgetUsed.toLocaleString("th-TH")}</b> บาท
                </div>
                <div>
                  คงเหลือ: <b className="text-ink">{Math.max(0, stats.totalBudgetAllocated - stats.totalBudgetUsed).toLocaleString("th-TH")}</b> บาท
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <AttentionPanel items={attention} />
          <RecentActivity projects={recent} />
        </div>

        <div className="rounded-[22px] border p-4.5 shadow-[0_16px_32px_rgba(18,22,25,0.06)]" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, var(--color-surface) 0%, color-mix(in srgb, var(--color-paper) 94%, white) 100%)" }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-[18px] font-semibold text-ink">โครงการแยกตามพันธกิจ</h3>
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted">Mission</span>
          </div>
          {Object.entries(stats.byMission).map(([mission, count]) => (
            <div key={mission} className="mb-3 flex items-center gap-3">
              <div className="w-[150px] shrink-0 text-[12px] font-medium text-muted">{mission}</div>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--color-border) 82%, white)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.round((count / maxMission) * 100)}%`,
                    background: MISSION_COLORS[mission],
                  }}
                />
              </div>
              <div className="w-7 text-right text-[12px] font-semibold text-ink tabular-nums">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusFilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-all active:scale-[0.96]"
      style={
        active
          ? {
              backgroundColor: "var(--color-surface)",
              color: "var(--color-navy)",
              boxShadow: "0 8px 20px rgba(18, 22, 25, 0.08)",
            }
          : {
              color: "rgba(255,255,255,0.8)",
              backgroundColor: "rgba(255,255,255,0.06)",
            }
      }
    >
      {label}
    </button>
  );
}

function YearPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-all active:scale-[0.96]"
      style={
        active
          ? {
              backgroundColor: "var(--color-surface)",
              color: "var(--color-navy)",
              boxShadow: "0 8px 20px rgba(18, 22, 25, 0.08)",
            }
          : {
              color: "rgba(255,255,255,0.78)",
              backgroundColor: "rgba(255,255,255,0.06)",
            }
      }
    >
      {label}
    </button>
  );
}
