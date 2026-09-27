import Link from "next/link";

export default function Topbar({
  title,
  subtitle,
  hideAdd,
}: {
  title: string;
  subtitle: string;
  hideAdd?: boolean;
}) {
  return (
    <div
      className="border-b backdrop-blur-md"
      style={{
        borderColor: "var(--color-border)",
        background: "linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 90%, white) 0%, color-mix(in srgb, var(--color-paper) 88%, white) 100%)",
      }}
    >
      <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between gap-3 px-5 sm:px-6 md:px-8">
        <div>
          <div className="mb-1 inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            System
          </div>
          <h1 className="mt-1 font-display text-[22px] font-semibold leading-none text-ink">{title}</h1>
          <div className="mt-1 text-[12.5px] text-muted">{subtitle}</div>
        </div>
        {!hideAdd && (
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 rounded-[12px] bg-primary px-4 py-2.5 text-[12.5px] font-medium text-white shadow-[0_16px_28px_rgba(242,140,40,0.24)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark active:scale-[0.97] active:translate-y-0"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-base leading-none">＋</span>
            เพิ่มโครงการใหม่
          </Link>
        )}
      </div>
    </div>
  );
}
