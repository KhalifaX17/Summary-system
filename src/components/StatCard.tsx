import { ReactNode } from "react";
import AnimatedNumber from "./AnimatedNumber";

export default function StatCard({
  label,
  value,
  suffix,
  icon,
  accent = "primary",
  onClick,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: ReactNode;
  accent?: "primary" | "gold" | "green" | "amber";
  onClick?: () => void;
}) {
  const accentBg: Record<string, string> = {
    primary: "text-primary",
    gold: "text-gold",
    green: "text-green",
    amber: "text-amber",
  };

  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border p-4 shadow-sm flex items-start justify-between gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg w-full text-left ${onClick ? "cursor-pointer" : "cursor-default"}`}
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
        boxShadow: "0 12px 24px rgba(18, 22, 25, 0.04)",
      }}
    >
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="min-w-0">
        <div className="text-[11.5px] text-muted mb-1.5">{label}</div>
        <div className="text-[21px] font-display font-semibold text-ink leading-none tabular-nums">
          <AnimatedNumber value={value} />
          {suffix && <span className="ml-1.5 text-[11.5px] text-muted font-sans font-normal">{suffix}</span>}
        </div>
      </div>
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundColor: accent === "primary" ? "color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))" : accent === "gold" ? "color-mix(in srgb, var(--color-gold) 18%, var(--color-surface))" : accent === "green" ? "color-mix(in srgb, var(--color-green) 14%, var(--color-surface))" : "color-mix(in srgb, var(--color-amber) 18%, var(--color-surface))",
          color: accent === "primary" ? "var(--color-primary)" : accent === "gold" ? "var(--color-gold)" : accent === "green" ? "var(--color-green)" : "var(--color-amber)",
        }}
      >
        {icon}
      </div>
    </Component>
  );
}
