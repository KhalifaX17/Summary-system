const STYLES: Record<string, { backgroundColor: string; color: string }> = {
  วางแผน: {
    backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, white)",
    color: "var(--color-primary-dark)",
  },
  กำลังดำเนินการ: {
    backgroundColor: "color-mix(in srgb, var(--color-amber) 18%, white)",
    color: "var(--color-amber)",
  },
  เสร็จสิ้น: {
    backgroundColor: "color-mix(in srgb, var(--color-green) 16%, white)",
    color: "var(--color-green)",
  },
  ล่าช้า: {
    backgroundColor: "color-mix(in srgb, var(--color-red) 14%, white)",
    color: "var(--color-red)",
  },
  ยกเลิก: {
    backgroundColor: "color-mix(in srgb, var(--color-muted) 10%, white)",
    color: "var(--color-muted)",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? STYLES["วางแผน"];
  return (
    <span
      className="inline-block rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
      }}
    >
      {status || "วางแผน"}
    </span>
  );
}
