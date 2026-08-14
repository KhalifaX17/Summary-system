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
    <div className="h-[62px] bg-surface border-b border-border flex items-center justify-between px-6 md:px-8 shrink-0">
      <div>
        <h1 className="font-display font-semibold text-[18px] leading-none">{title}</h1>
        <div className="text-[12.5px] text-muted mt-1">{subtitle}</div>
      </div>
      {!hideAdd && (
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-[13.5px] font-medium px-4 py-2 rounded-[9px] transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/25 active:scale-[0.97] active:translate-y-0"
        >
          + เพิ่มโครงการใหม่
        </Link>
      )}
    </div>
  );
}
