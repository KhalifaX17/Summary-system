import Link from "next/link";
import FeatureShowcase from "@/components/FeatureShowcase";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <section className="relative min-h-[430px] overflow-hidden bg-[radial-gradient(circle_at_88%_20%,rgba(196,166,123,0.24),transparent_28%),linear-gradient(120deg,#eaf1ff_0%,#f5f7fc_52%,#f7f8fb_100%)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-gold/15 blur-3xl animate-float-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-48 -left-32 h-[360px] w-[360px] rounded-full bg-primary/10 blur-3xl animate-float-slow"
          style={{ animationDelay: "-6s" }}
        />

        <div className="relative mx-auto max-w-[1180px] px-6 py-20 sm:px-10 md:px-12 md:py-24">
          <div
            className="animate-fade-up mb-5 inline-block rounded-full bg-gold/10 px-3 py-1 text-[11px] font-display font-medium tracking-wide text-gold"
            style={{ animationDelay: "0.05s" }}
          >
            สาขาวิชาเทคโนโลยีสารสนเทศ
          </div>
          <h1
            className="animate-fade-up mb-5 max-w-[620px] font-display text-[38px] font-semibold leading-[1.08] tracking-tight text-ink sm:text-[46px] md:text-[54px]"
            style={{ animationDelay: "0.12s" }}
          >
            ระบบสรุปโครงการ
          </h1>
          <p
            className="animate-fade-up mb-8 max-w-[520px] text-[14px] leading-[1.7] text-muted sm:text-[15px]"
            style={{ animationDelay: "0.2s" }}
          >
            บันทึก ติดตาม และสรุปโครงการของสาขาตั้งแต่ข้อมูลพื้นฐาน งบประมาณ และผลการดำเนินงาน
            — ข้อมูลทั้งหมดเก็บอยู่ใน Google Sheet ของสาขา พร้อมส่งออกรายงานได้ทันทีเมื่อจำเป็น
          </p>
          <div className="animate-fade-up flex flex-wrap gap-3" style={{ animationDelay: "0.28s" }}>
            <Link
              href="/login"
              className="rounded-[10px] bg-primary px-6 py-3 text-[14px] font-medium text-white shadow-sm shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 active:translate-y-0 active:scale-[0.97]"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/dashboard"
              className="rounded-[10px] border border-border bg-surface px-6 py-3 text-[14px] font-medium text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:bg-paper active:translate-y-0 active:scale-[0.97]"
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
