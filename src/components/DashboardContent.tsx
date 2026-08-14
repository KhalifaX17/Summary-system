"use client";

import { useMemo, useState } from "react";
import { computeDashboardStats, getAttentionItems, getRecentActivity } from "@/lib/stats";
import { Project } from "@/lib/types";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import AttentionPanel from "@/components/AttentionPanel";
import RecentActivity from "@/components/RecentActivity";
import { IconBudget, IconCoin, IconFolder, IconUsers } from "@/components/icons";

const STATUS_COLORS: Record<string, string> = {
  วางแผน: "#3d54c9",
  กำลังดำเนินการ: "#e8a63a",
  เสร็จสิ้น: "#1fa971",
  ล่าช้า: "#e0523f",
  ยกเลิก: "#9aa1b3",
};

const MISSION_COLORS: Record<string, string> = {
  การเรียนการสอน: "#2f6fed",
  การวิจัย: "#7d5fe0",
  การบริการวิชาการ: "#1fa971",
  ทำนุบำรุงศิลปวัฒนธรรม: "#b6813a",
  บริหารจัดการ: "#9aa1b3",
};

export default function DashboardContent({ projects }: { projects: Project[] }) {
  const fiscalYears = useMemo(
    () => Array.from(new Set(projects.map((p) => p.fiscalYear).filter(Boolean))).sort().reverse(),
    [projects]
  );
  const [year, setYear] = useState<string>("all");

  const scoped = useMemo(
    () => (year === "all" ? projects : projects.filter((p) => p.fiscalYear === year)),
    [projects, year]
  );

  const stats = useMemo(() => computeDashboardStats(scoped), [scoped]);
  const attention = useMemo(() => getAttentionItems(scoped), [scoped]);
  const recent = useMemo(() => getRecentActivity(scoped), [scoped]);

  const maxStatus = Math.max(1, ...Object.values(stats.byStatus));
  const maxMission = Math.max(1, ...Object.values(stats.byMission));
  const budgetPct =
    stats.totalBudgetAllocated > 0
      ? Math.min(100, Math.round((stats.totalBudgetUsed / stats.totalBudgetAllocated) * 100))
      : 0;
  const active = stats.byStatus["กำลังดำเนินการ"] || 0;

  return (
    <div>
      <Topbar title="แดชบอร์ดภาพรวม" subtitle="สรุปภาพรวมโครงการทั้งหมดของสาขา" />

      <div className="px-6 py-6 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-[14.5px] text-muted">
            ตอนนี้มี <b className="text-ink font-semibold">{active} โครงการ</b> กำลังดำเนินการ จากทั้งหมด{" "}
            <b className="text-ink font-semibold">{stats.total} โครงการ</b> · ใช้งบประมาณไปแล้ว{" "}
            <b className="text-ink font-semibold">{budgetPct}%</b> ของที่ได้รับจัดสรร
          </p>

          {fiscalYears.length > 0 && (
            <div className="flex items-center gap-1 bg-surface border border-border rounded-full p-1">
              <YearPill label="ทุกปี" active={year === "all"} onClick={() => setYear("all")} />
              {fiscalYears.map((y) => (
                <YearPill key={y} label={`ปีงบ ${y}`} active={year === y} onClick={() => setYear(y)} />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="จำนวนโครงการทั้งหมด" value={stats.total} icon={<IconFolder />} accent="primary" />
          <StatCard
            label="งบประมาณที่ได้รับ"
            value={stats.totalBudgetAllocated}
            suffix="บาท"
            icon={<IconCoin />}
            accent="green"
          />
          <StatCard
            label="งบประมาณที่ใช้จริง"
            value={stats.totalBudgetUsed}
            suffix="บาท"
            icon={<IconBudget />}
            accent="amber"
          />
          <StatCard
            label="ผู้เข้าร่วมสะสม"
            value={stats.totalParticipants}
            suffix="คน"
            icon={<IconUsers />}
            accent="gold"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4 mb-4">
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-semibold text-[15px] mb-4">สถานะโครงการ</h3>
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2.5 mb-3">
                <div className="w-[110px] text-[12.5px] text-muted shrink-0">{status}</div>
                <div className="flex-1 h-2.5 bg-paper rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.round((count / maxStatus) * 100)}%`,
                      background: STATUS_COLORS[status],
                    }}
                  />
                </div>
                <div className="w-6 text-right text-[12.5px] font-semibold tabular-nums">{count}</div>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-semibold text-[15px] mb-4">การใช้จ่ายงบประมาณ</h3>
            <div className="flex items-center gap-5">
              <div
                className="relative w-[110px] h-[110px] rounded-full shrink-0 flex items-center justify-center transition-[background] duration-500"
                style={{
                  background: `conic-gradient(var(--color-gold) ${budgetPct * 3.6}deg, var(--color-border) 0deg)`,
                }}
              >
                <div className="absolute w-[76px] h-[76px] bg-surface rounded-full flex items-center justify-center font-display font-semibold text-[16px] tabular-nums">
                  {budgetPct}%
                </div>
              </div>
              <div className="text-[12.5px] text-muted leading-8">
                ได้รับ: <b className="text-ink">{stats.totalBudgetAllocated.toLocaleString("th-TH")}</b> บาท
                <br />
                ใช้ไป: <b className="text-ink">{stats.totalBudgetUsed.toLocaleString("th-TH")}</b> บาท
                <br />
                คงเหลือ:{" "}
                <b className="text-ink">
                  {Math.max(0, stats.totalBudgetAllocated - stats.totalBudgetUsed).toLocaleString("th-TH")}
                </b>{" "}
                บาท
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <AttentionPanel items={attention} />
          <RecentActivity projects={recent} />
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-semibold text-[15px] mb-4">โครงการแยกตามพันธกิจ</h3>
          {Object.entries(stats.byMission).map(([mission, count]) => (
            <div key={mission} className="flex items-center gap-2.5 mb-3">
              <div className="w-[170px] text-[12.5px] text-muted shrink-0">{mission}</div>
              <div className="flex-1 h-2.5 bg-paper rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.round((count / maxMission) * 100)}%`,
                    background: MISSION_COLORS[mission],
                  }}
                />
              </div>
              <div className="w-6 text-right text-[12.5px] font-semibold tabular-nums">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function YearPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium transition-all active:scale-[0.94] ${
        active ? "bg-navy text-white" : "text-muted hover:bg-paper"
      }`}
    >
      {label}
    </button>
  );
}
