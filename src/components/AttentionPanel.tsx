"use client";

import { useState } from "react";
import { AttentionItem } from "@/lib/stats";
import { IconAlert, IconClock, IconBudget } from "./icons";
import { Project } from "@/lib/types";
import ProjectDetailModal from "./ProjectDetailModal";

export default function AttentionPanel({ items }: { items: AttentionItem[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <div className="rounded-[22px] border p-4 shadow-[0_16px_32px_rgba(123,77,39,0.05)]" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 100%, white) 0%, color-mix(in srgb, var(--color-paper) 100%, white) 100%)" }}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--color-gold-soft) 92%, white)", color: "var(--color-primary)" }}>
          <IconAlert className="text-gold" />
        </div>
        <h3 className="font-display text-[18px] font-semibold text-ink">ต้องติดตาม</h3>
      </div>

      {items.length === 0 ? (
        <p className="py-2 text-[12px] text-muted">ไม่มีโครงการที่ต้องเฝ้าระวังตอนนี้</p>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 6).map((item, i) => (
            <button
              key={`${item.project.id}-${item.reason}-${i}`}
              type="button"
              onClick={() => setSelected(item.project)}
              className="hover-lift flex w-full items-center gap-3 rounded-[14px] border bg-white/80 px-2.5 py-2.5 text-left transition-all active:scale-[0.99]"
              style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-surface) 90%, white)" }}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  item.reason === "deadline" ? "bg-amber/10 text-amber" : "bg-red/10 text-red"
                }`}
              >
                {item.reason === "deadline" ? <IconClock /> : <IconBudget />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-ink">{item.project.projectName}</div>
                <div className="mt-0.5 text-[11.5px] text-muted">{item.detail}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
