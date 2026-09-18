import Link from "next/link";
import FeatureShowcase from "@/components/FeatureShowcase";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <section className="relative min-h-[540px] overflow-hidden bg-[radial-gradient(circle_at_88%_20%,rgba(196,166,123,0.24),transparent_28%),linear-gradient(120deg,#eaf1ff_0%,#f5f7fc_52%,#f7f8fb_100%)] dark:bg-[radial-gradient(circle_at_88%_20%,rgba(196,166,123,0.16),transparent_28%),linear-gradient(120deg,#18243b_0%,#111827_55%,#0f172a_100%)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-gold/15 blur-3xl animate-float-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-48 -left-32 h-[360px] w-[360px] rounded-full bg-primary/10 blur-3xl animate-float-slow"
          style={{ animationDelay: "-6s" }}
        />

        <div className="relative mx-auto max-w-[1280px] px-6 py-24 sm:px-10 md:px-14 md:py-28">
          <div
            className="animate-fade-up mb-6 inline-block rounded-full bg-gold/10 px-4 py-1.5 text-[13px] font-display font-medium tracking-wide text-gold"
            style={{ animationDelay: "0.05s" }}
          >
            สาขาวิชาเทคโนโลยีสารสนเทศ
          </div>
          <h1
            className="animate-fade-up mb-6 max-w-[720px] font-display text-[48px] font-semibold leading-[1.08] tracking-tight text-ink sm:text-[58px] md:text-[68px]"
            style={{ animationDelay: "0.12s" }}
          >
            ระบบจัดการโครงการ
          </h1>
          <p
            className="animate-fade-up mb-10 max-w-[650px] text-[16px] leading-[1.8] text-muted dark:text-[#c8d2e5] sm:text-[18px]"
            style={{ animationDelay: "0.2s" }}
          >
            บันทึก ติดตาม และสรุปโครงการของสาขาตั้งแต่ข้อมูลพื้นฐาน งบประมาณ และผลการดำเนินงาน
            — ข้อมูลทั้งหมดเก็บอยู่ใน Google Sheet ของสาขา พร้อมส่งออกรายงานได้ทันทีเมื่อจำเป็น
          </p>
          <div className="animate-fade-up flex flex-wrap gap-4" style={{ animationDelay: "0.28s" }}>
            <Link
              href="/login"
              className="rounded-[11px] bg-primary px-7 py-3.5 text-[16px] font-medium text-white shadow-sm shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 active:translate-y-0 active:scale-[0.97]"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/dashboard"
              className="rounded-[11px] border border-border bg-surface px-7 py-3.5 text-[16px] font-medium text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:bg-paper active:translate-y-0 active:scale-[0.97]"
            >
              ดูแดชบอร์ด
            </Link>
          </div>
        </div>
      </section>

      <FeatureShowcase />
    </div>
  );
}
