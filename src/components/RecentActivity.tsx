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
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
      <h3 className="font-display font-semibold text-[15px] mb-4">กิจกรรมล่าสุด</h3>

      {projects.length === 0 ? (
        <p className="text-[13px] text-muted py-2">ยังไม่มีความเคลื่อนไหว</p>
      ) : (
        <div className="space-y-1">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className="w-full flex items-center justify-between gap-3 py-2.5 border-t border-border first:border-t-0 hover:bg-paper/60 -mx-2 px-2 rounded-lg text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[13px] truncate">{p.projectName}</div>
                <div className="text-[11.5px] text-muted">{timeAgo(p.updatedAt)}</div>
              </div>
              <StatusBadge status={p.status} />
            </button>
          ))}
        </div>
      )}

      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
