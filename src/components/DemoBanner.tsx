import { isGoogleConfigured } from "@/lib/config";

export default function DemoBanner() {
  if (isGoogleConfigured()) return null;

  return (
    <div className="bg-gold/15 border-b border-gold/30 text-[12.5px] text-[#7a5620] px-6 md:px-8 py-2 flex items-center gap-2">
      <span className="font-medium">กำลังแสดงข้อมูลตัวอย่าง</span>
      <span className="text-[#7a5620]/80">
        — ยังไม่ได้เชื่อมต่อ Google Sheet จริง เชื่อมต่อแล้วข้อมูลตัวอย่างนี้จะหายไปเอง (ดูวิธีใน README.md)
      </span>
    </div>
  );
}
