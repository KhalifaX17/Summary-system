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
    <div className="group relative overflow-hidden bg-surface border border-border rounded-xl p-4 shadow-sm flex items-start justify-between gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-navy/5">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="min-w-0">
        <div className="text-[11.5px] text-muted mb-1.5">{label}</div>
        <div className="text-[21px] font-display font-semibold text-ink leading-none tabular-nums">
          <AnimatedNumber value={value} />
          {suffix && <span className="text-[11.5px] text-muted font-sans font-normal ml-1">{suffix}</span>}
        </div>
      </div>
      <div
        className={`w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${accentBg[accent]}`}
      >
        {icon}
      </div>
    </div>
  );
}
