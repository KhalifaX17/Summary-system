import {
  DashboardStats,
  MISSION_OPTIONS,
  Project,
  STATUS_OPTIONS,
} from "./types";

export function computeDashboardStats(projects: Project[]): DashboardStats {
  const stats: DashboardStats = {
    total: projects.length,
    totalBudgetAllocated: 0,
    totalBudgetUsed: 0,
    totalParticipants: 0,
    byStatus: Object.fromEntries(STATUS_OPTIONS.map((s) => [s, 0])),
    byMission: Object.fromEntries(MISSION_OPTIONS.map((m) => [m, 0])),
  };

  for (const p of projects) {
    stats.totalBudgetAllocated += p.budgetAllocated || 0;
    stats.totalBudgetUsed += p.budgetUsed || 0;
    stats.totalParticipants += p.participantActual || 0;
    const status = STATUS_OPTIONS.includes(p.status as (typeof STATUS_OPTIONS)[number])
      ? p.status
      : "วางแผน";
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    const mission = MISSION_OPTIONS.includes(p.mission as (typeof MISSION_OPTIONS)[number])
      ? p.mission
      : "บริหารจัดการ";
    stats.byMission[mission] = (stats.byMission[mission] || 0) + 1;
  }

  return stats;
}

const ACTIVE_STATUSES = new Set(["วางแผน", "กำลังดำเนินการ", "ล่าช้า"]);
const DEADLINE_WINDOW_DAYS = 14;
const BUDGET_RISK_RATIO = 0.9;

export interface AttentionItem {
  project: Project;
  reason: "deadline" | "budget";
  detail: string;
}

// โครงการที่ควรติดตาม: ใกล้ครบกำหนดภายใน 14 วัน หรือใช้งบเกิน 90% ของที่ได้รับ
export function getAttentionItems(projects: Project[]): AttentionItem[] {
  const now = new Date();
  const items: AttentionItem[] = [];

  for (const p of projects) {
    if (!ACTIVE_STATUSES.has(p.status)) continue;

    if (p.endDate) {
      const end = new Date(p.endDate);
      const daysLeft = Math.ceil((end.getTime() - now.getTime()) / 86_400_000);
      if (daysLeft >= 0 && daysLeft <= DEADLINE_WINDOW_DAYS) {
        items.push({
          project: p,
          reason: "deadline",
          detail: daysLeft === 0 ? "ครบกำหนดวันนี้" : `เหลืออีก ${daysLeft} วัน`,
        });
      } else if (daysLeft < 0) {
        items.push({ project: p, reason: "deadline", detail: `เลยกำหนดมา ${-daysLeft} วัน` });
      }
    }

    if (p.budgetAllocated > 0) {
      const ratio = p.budgetUsed / p.budgetAllocated;
      if (ratio >= BUDGET_RISK_RATIO) {
        items.push({
          project: p,
          reason: "budget",
          detail: `ใช้ไปแล้ว ${Math.round(ratio * 100)}% ของงบที่ได้รับ`,
        });
      }
    }
  }

  return items;
}

export function getRecentActivity(projects: Project[], limit = 6): Project[] {
  return [...projects]
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
    .slice(0, limit);
}
