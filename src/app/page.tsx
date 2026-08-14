import Link from "next/link";
import FeatureShowcase from "@/components/FeatureShowcase";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-gold/20 blur-3xl animate-float-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 -left-32 w-[360px] h-[360px] rounded-full bg-primary/10 blur-3xl animate-float-slow"
          style={{ animationDelay: "-6s" }}
        />

        <div className="relative px-6 py-16 md:px-12 md:py-24 max-w-3xl">
          <div
            className="animate-fade-up inline-block text-[12px] font-display font-medium tracking-wide text-gold bg-gold/10 px-3 py-1 rounded-full mb-5"
            style={{ animationDelay: "0.05s" }}
          >
            สาขาวิชาเทคโนโลยีสารสนเทศ
          </div>
          <h1
            className="animate-fade-up font-display font-semibold text-[40px] md:text-[52px] leading-none text-ink mb-5 tracking-tight"
            style={{ animationDelay: "0.12s" }}
          >
            ระบบสรุปโครงการ
          </h1>
          <p
            className="animate-fade-up text-[15px] text-muted leading-relaxed mb-8 max-w-lg"
            style={{ animationDelay: "0.2s" }}
          >
            บันทึก ติดตาม และสรุปโครงการของสาขาตั้งแต่ข้อมูลพื้นฐาน งบประมาณ ผลการดำเนินงาน
            ไปจนถึงไฟล์แนบหลักฐาน — ข้อมูลทั้งหมดเก็บอยู่ใน Google Sheet ของสาขา พร้อมส่งออกรายงานได้ทันทีเมื่อจำเป็น
          </p>
          <div className="animate-fade-up flex flex-wrap gap-3" style={{ animationDelay: "0.28s" }}>
            <Link
              href="/dashboard"
              className="bg-primary hover:bg-primary-dark text-white text-[14px] font-medium px-5 py-2.5 rounded-[10px] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97] active:translate-y-0"
            >
              ไปที่แดชบอร์ด
            </Link>
            <Link
              href="/projects/new"
              className="bg-surface border border-border hover:border-gold/50 hover:bg-paper text-ink text-[14px] font-medium px-5 py-2.5 rounded-[10px] transition-all hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0"
            >
              + เพิ่มโครงการใหม่
            </Link>
          </div>
        </div>
      </section>

      <FeatureShowcase />
    </div>
  );
}
