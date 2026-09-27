import { isGoogleSheetsConfigured } from "@/lib/config";

export default function DemoBanner() {
  if (isGoogleSheetsConfigured()) return null;

  return (
    <div
      className="border-b px-6 md:px-8 py-2 flex items-center gap-2 text-[12.5px]"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-gold-soft) 76%, white)",
        borderColor: "var(--color-border)",
        color: "var(--color-primary-dark)",
      }}
    >
      <span className="font-medium">กำลังแสดงข้อมูลตัวอย่าง</span>
      <span style={{ color: "color-mix(in srgb, var(--color-primary-dark) 82%, var(--color-muted))" }}>
        — ยังไม่ได้เชื่อมต่อ Google Sheet จริง เชื่อมต่อแล้วข้อมูลตัวอย่างนี้จะหายไปเอง (ดูวิธีใน README.md)
      </span>
    </div>
  );
}
