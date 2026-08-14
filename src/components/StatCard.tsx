import { ReactNode } from "react";
import AnimatedNumber from "./AnimatedNumber";

export default function StatCard({
  label,
  value,
  suffix,
  icon,
  accent = "primary",
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: ReactNode;
  accent?: "primary" | "gold" | "green" | "amber";
}) {
  const accentBg: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-gold/15 text-gold",
    green: "bg-green/10 text-green",
    amber: "bg-amber/10 text-amber",
  };

  return (
    <div className="group bg-surface border border-border rounded-2xl p-4.5 shadow-sm flex items-start justify-between gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="min-w-0">
        <div className="text-[12.5px] text-muted mb-2">{label}</div>
        <div className="text-[24px] font-display font-semibold text-ink leading-none tabular-nums">
          <AnimatedNumber value={value} />
          {suffix && <span className="text-[13px] text-muted font-sans font-normal ml-1">{suffix}</span>}
        </div>
      </div>
      <div
        className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${accentBg[accent]}`}
      >
        {icon}
      </div>
    </div>
  );
}
