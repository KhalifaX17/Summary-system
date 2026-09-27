"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import ProjectDetailModal from "./ProjectDetailModal";

function timeAgo(iso: string): string {
  if (!iso) return "-";
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) return "วันนี้";
  if (days === 1) return "เมื่อวาน";
  if (days < 30) return `${days} วันที่แล้ว`;
  return new Date(iso).toLocaleDateString("th-TH");
}

export default function RecentActivity({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <div className="rounded-[22px] border bg-white p-4 shadow-[0_16px_32px_rgba(123,77,39,0.05)]" style={{ borderColor: "var(--color-border)" }}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-[18px] font-semibold text-ink">กิจกรรมล่าสุด</h3>
        <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: "color-mix(in srgb, var(--color-gold-soft) 90%, white)", color: "var(--color-primary)" }}>
          {projects.length} รายการ
        </span>
      </div>

      {projects.length === 0 ? (
        <p className="py-2 text-[12px] text-muted">ยังไม่มีความเคลื่อนไหว</p>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className="hover-lift w-full rounded-[14px] border px-3 py-3 text-left transition-all active:scale-[0.99]"
              style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-paper) 90%, white)" }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-ink">{p.projectName}</div>
                  <div className="mt-1 text-[11.5px] text-muted">{timeAgo(p.updatedAt)}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
