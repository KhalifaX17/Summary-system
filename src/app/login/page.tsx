"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setError((await response.json()).error ?? "เข้าสู่ระบบไม่สำเร็จ");
      setLoading(false);
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.assign(next?.startsWith("/") ? next : "/dashboard");
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
      style={{ background: "radial-gradient(circle at top, color-mix(in srgb, var(--color-gold-soft) 90%, white) 0%, color-mix(in srgb, var(--color-paper) 78%, white) 32%, color-mix(in srgb, var(--color-border) 70%, white) 100%)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="float-slow absolute left-[8%] top-[18%] h-28 w-28 rounded-full blur-3xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-gold) 48%, white)" }} />
        <div className="float-slow absolute bottom-[18%] right-[10%] h-36 w-36 rounded-full blur-3xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 34%, white)" }} />
      </div>

      <div className="relative w-full max-w-[500px] rounded-[32px] border p-6 shadow-[0_30px_70px_rgba(110,79,50,0.14)] backdrop-blur-sm sm:p-8" style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-surface) 96%, transparent)" }}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] text-[30px] font-semibold text-white shadow-[0_18px_30px_rgba(217,106,77,0.24)]" style={{ background: "linear-gradient(135deg, var(--color-gold), var(--color-primary))" }}>
            N
          </div>
          <div className="rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]" style={{ borderColor: "var(--color-border)", backgroundColor: "color-mix(in srgb, var(--color-gold-soft) 90%, white)", color: "var(--color-primary-dark)" }}>
            PORTAL
          </div>
        </div>

        <div className="mb-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--color-primary-dark)" }}>Welcome back</p>
          <h1 className="mt-3 font-display text-[42px] font-semibold leading-none tracking-[-0.06em] sm:text-[46px]" style={{ color: "var(--color-ink)" }}>
            เข้าสู่ระบบ
          </h1>
          <p className="mt-3 text-[15px] leading-6" style={{ color: "var(--color-muted)" }}>
            เข้าดูและจัดการข้อมูลโครงการของสาขาได้อย่างสะดวกและเป็นระบบ
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[14px] font-medium" style={{ color: "var(--color-ink)" }}>ชื่อผู้ใช้</label>
            <input
              type="text"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-[16px] border px-4 py-3.5 text-[15px] outline-none transition-all placeholder:text-[#b59d8e] focus:ring-4"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "color-mix(in srgb, var(--color-paper) 90%, white)",
                color: "var(--color-ink)",
                boxShadow: "0 0 0 0 rgba(0,0,0,0)",
              }}
              autoComplete="username"
              placeholder="กรอกชื่อผู้ใช้"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[14px] font-medium" style={{ color: "var(--color-ink)" }}>รหัสผ่าน</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-[16px] border px-4 py-3.5 text-[15px] outline-none transition-all placeholder:text-[#b59d8e] focus:ring-4"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "color-mix(in srgb, var(--color-paper) 90%, white)",
                color: "var(--color-ink)",
                boxShadow: "0 0 0 0 rgba(0,0,0,0)",
              }}
              autoComplete="current-password"
              placeholder="กรอกรหัสผ่าน"
            />
          </div>

          {error && (
            <div className="rounded-[14px] border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="hover-lift w-full rounded-[16px] px-4 py-3.5 text-[16px] font-semibold text-white shadow-[0_18px_30px_rgba(217,106,77,0.22)] transition-all hover:brightness-[0.98] disabled:cursor-wait disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" }}
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </main>
  );
}
