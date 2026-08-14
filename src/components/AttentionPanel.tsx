"use client";

import { useState } from "react";
import { AttentionItem } from "@/lib/stats";
import { IconAlert, IconClock, IconBudget } from "./icons";
import { Project } from "@/lib/types";
import ProjectDetailModal from "./ProjectDetailModal";

export default function AttentionPanel({ items }: { items: AttentionItem[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <IconAlert className="text-gold" />
        <h3 className="font-display font-semibold text-[15px]">ต้องติดตาม</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-[13px] text-muted py-2">ไม่มีโครงการที่ต้องเฝ้าระวังตอนนี้</p>
      ) : (
        <div className="space-y-1">
          {items.slice(0, 6).map((item, i) => (
            <button
              key={`${item.project.id}-${item.reason}-${i}`}
              type="button"
              onClick={() => setSelected(item.project)}
              className="w-full flex items-center gap-3 py-2.5 border-t border-border first:border-t-0 hover:bg-paper/60 -mx-2 px-2 rounded-lg text-left"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  item.reason === "deadline" ? "bg-amber/10 text-amber" : "bg-red/10 text-red"
                }`}
              >
                {item.reason === "deadline" ? <IconClock /> : <IconBudget />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] truncate">{item.project.projectName}</div>
                <div className="text-[11.5px] text-muted">{item.detail}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
