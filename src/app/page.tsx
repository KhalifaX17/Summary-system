import Link from "next/link";
import FeatureShowcase from "@/components/FeatureShowcase";
import { getProjects } from "@/lib/sheets";
import { computeDashboardStats } from "@/lib/stats";

export default async function HomePage() {
  const projects = await getProjects();
  const stats = computeDashboardStats(projects);
  const activeProjects = stats.byStatus["กำลังดำเนินการ"] ?? 0;
  const completedProjects = stats.byStatus["เสร็จสิ้น"] ?? 0;
  const spendPct =
    stats.totalBudgetAllocated > 0
      ? Math.min(100, Math.round((stats.totalBudgetUsed / stats.totalBudgetAllocated) * 100))
      : 0;

  const overviewStats = [
    { label: "โครงการทั้งหมด", value: String(stats.total) },
    { label: "อยู่ระหว่างดำเนินการ", value: String(activeProjects) },
    { label: "ใช้งบประมาณ", value: `${spendPct}%` },
  ];

  const statusBreakdown = [
    { label: "เสร็จสิ้น", value: stats.total ? Math.round((completedProjects / stats.total) * 100) : 0, color: "var(--color-green)" },
    { label: "กำลังดำเนินการ", value: stats.total ? Math.round((activeProjects / stats.total) * 100) : 0, color: "var(--color-primary)" },
    { label: "ล่าช้า", value: stats.total ? Math.round(((stats.byStatus["ล่าช้า"] ?? 0) / stats.total) * 100) : 0, color: "var(--color-red)" },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] overflow-hidden" style={{ backgroundColor: "var(--color-paper)" }}>
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at top left, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 28%), radial-gradient(circle at bottom right, color-mix(in srgb, var(--color-gold) 22%, transparent), transparent 24%), linear-gradient(135deg, color-mix(in srgb, var(--color-surface) 92%, white) 0%, color-mix(in srgb, var(--color-gold-soft) 80%, white) 42%, var(--color-paper) 100%)",
        }}
      >
        <div aria-hidden className="pointer-events-none absolute -left-16 top-20 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 18%, transparent)" }} />
        <div aria-hidden className="pointer-events-none absolute -right-12 top-28 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-gold) 40%, transparent)" }} />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-56 w-[70%] -translate-x-1/2 rounded-[50%] blur-3xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-gold-soft) 75%, white)" }} />

        <div className="relative mx-auto max-w-[1280px] px-6 py-16 sm:px-10 md:px-14 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
            <div>
              <div
                className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium tracking-[0.12em] shadow-sm backdrop-blur"
                style={{
                  animationDelay: "0.05s",
                  borderColor: "color-mix(in srgb, var(--color-primary) 28%, white)",
                  backgroundColor: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
                  color: "var(--color-primary)",
                }}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
                สาขาวิชาเทคโนโลยีสารสนเทศ
              </div>

              <h1
                className="animate-fade-up max-w-[760px] font-display text-[48px] font-semibold leading-[1.04] tracking-[-0.04em] text-ink sm:text-[58px] md:text-[66px]"
                style={{ animationDelay: "0.12s" }}
              >
                จัดการโครงการ
                <span className="block text-primary">ให้ชัด • เร็ว • เป็นระบบ</span>
              </h1>

              <p
                className="animate-fade-up mt-6 max-w-[620px] text-[16px] leading-[1.9] text-muted sm:text-[18px]"
                style={{ animationDelay: "0.2s" }}
              >
                บันทึกข้อมูล ติดตามงบประมาณ และสรุปผลการดำเนินงานได้จากศูนย์กลางเดียว
                พร้อมใช้งานร่วมกับ Google Sheet ของสาขาเพื่อให้ทีมทำงานต่อเนื่องและคล่องตัวขึ้น
              </p>

              <div className="animate-fade-up mt-8 flex flex-wrap gap-4" style={{ animationDelay: "0.28s" }}>
                <Link
                  href="/login"
                  className="rounded-[14px] px-7 py-3.5 text-[16px] font-medium text-white shadow-[0_18px_30px_rgba(217,106,77,0.22)] transition-all hover:-translate-y-0.5 hover:brightness-[0.98] active:translate-y-0 active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" }}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-[14px] border px-7 py-3.5 text-[16px] font-medium shadow-[0_8px_18px_rgba(93,59,31,0.04)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-surface) 80%, transparent)", color: "var(--color-ink)" }}
                >
                  ดูแดชบอร์ด
                </Link>
              </div>

              <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.36s" }}>
                {overviewStats.map((stat) => (
                  <div key={stat.label} className="group min-w-[150px] rounded-2xl border px-4 py-3 shadow-[0_10px_20px_rgba(90,58,36,0.04)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(110,75,46,0.08)]" style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-surface) 80%, transparent)" }}>
                    <div className="text-[12px] uppercase tracking-[0.12em] text-muted">{stat.label}</div>
                    <div className="mt-1 text-[26px] font-semibold text-ink">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fade-up relative" style={{ animationDelay: "0.18s" }}>
              <div className="relative mx-auto max-w-[520px] rounded-[28px] border p-4 shadow-[0_28px_60px_rgba(116,75,34,0.12)] backdrop-blur-xl" style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-surface) 85%, transparent)" }}>
                <div className="rounded-[22px] border p-5" style={{ borderColor: "var(--color-border)", background: "linear-gradient(135deg, color-mix(in srgb, var(--color-gold-soft) 70%, white) 0%, color-mix(in srgb, var(--color-paper) 82%, white) 100%)" }}>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.14em] text-muted">Overview</p>
                      <h2 className="mt-1 font-display text-[24px] font-semibold text-ink">Dashboard</h2>
                    </div>
                    <div className="rounded-full px-3 py-1.5 text-[12px] font-medium" style={{ backgroundColor: "color-mix(in srgb, var(--color-gold-soft) 80%, white)", color: "var(--color-primary)" }}>อัปเดตล่าสุด</div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl p-4 shadow-sm ring-1" style={{ backgroundColor: "var(--color-surface)", boxShadow: "inset 0 0 0 1px var(--color-border)" }}>
                      <div className="text-[12px] text-muted">งบประมาณรวม</div>
                      <div className="mt-2 text-[24px] font-semibold text-ink">
                        {`฿${(stats.totalBudgetAllocated || 0).toLocaleString("th-TH")}`}
                      </div>
                      <div className="mt-2 text-[12px]" style={{ color: "var(--color-green)" }}>ใช้งานจริง {spendPct}% ของสัดส่วนที่ได้รับ</div>
                    </div>
                    <div className="rounded-2xl p-4 shadow-sm ring-1" style={{ backgroundColor: "color-mix(in srgb, var(--color-gold-soft) 80%, white)", boxShadow: "inset 0 0 0 1px var(--color-border)" }}>
                      <div className="text-[12px] text-muted">กำลังดำเนินการ</div>
                      <div className="mt-2 text-[28px] font-semibold text-ink">{activeProjects}</div>
                      <div className="mt-2 text-[12px]" style={{ color: "var(--color-amber)" }}>{stats.total ? Math.round((activeProjects / stats.total) * 100) : 0}% ของโครงการทั้งหมด</div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border p-4" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
                    <div className="mb-3 flex items-center justify-between text-[12px] text-muted">
                      <span>สถานะโครงการ</span>
                      <span>ทั้งหมด {stats.total} โครงการ</span>
                    </div>
                    <div className="space-y-3">
                      {statusBreakdown.map((item) => (
                        <div key={item.label}>
                          <div className="mb-1.5 flex justify-between text-[12px] text-muted">
                            <span>{item.label}</span>
                            <span>{item.value}%</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--color-border) 80%, white)" }}>
                            <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeatureShowcase />
    </div>
  );
}
