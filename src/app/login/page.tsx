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
    <main className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden bg-[#eef3ff] px-5 py-12">
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-[460px] w-[460px] rounded-full bg-primary/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -right-28 h-[520px] w-[520px] rounded-full bg-gold/20 blur-3xl" />
      <div className="relative grid w-full max-w-[980px] overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(28,41,71,0.16)] backdrop-blur md:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-primary to-[#1744ad] p-10 text-white md:flex">
          <div>
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl font-semibold ring-1 ring-white/30">N</div>
            <p className="mb-3 text-sm text-blue-100">ระบบจัดการข้อมูลโครงการ</p>
            <h2 className="font-display text-4xl font-semibold leading-tight">จัดการโครงการ<br />ได้ง่ายในที่เดียว</h2>
            <p className="mt-5 max-w-[270px] text-sm leading-7 text-blue-100">
              บันทึก ติดตามงบประมาณ และสรุปผลการดำเนินงานอย่างเป็นระบบ
            </p>
          </div>
          <p className="text-xs text-blue-100/80">สาขาวิชาเทคโนโลยีสารสนเทศ</p>
        </div>
        <form onSubmit={submit} className="p-8 sm:p-12">
          <div className="mb-9">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-semibold text-white shadow-lg shadow-primary/25 md:hidden">N</div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">เข้าสู่ระบบ</h1>
            <p className="mt-2 text-[15px] text-muted">เข้าสู่ระบบเพื่อจัดการข้อมูลโครงการ</p>
          </div>
          <label className="mb-5 block text-[15px] font-medium text-ink">
            ชื่อผู้ใช้
            <input type="text" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3.5 text-[15px] outline-none transition-all placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10" autoComplete="username" placeholder="กรอกชื่อผู้ใช้" />
          </label>
          <label className="mb-6 block text-[15px] font-medium text-ink">
            รหัสผ่าน
            <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3.5 text-[15px] outline-none transition-all placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10" autoComplete="current-password" placeholder="กรอกรหัสผ่าน" />
          </label>
          {error && <p className="mb-5 rounded-xl border border-red/20 bg-red/10 px-4 py-3 text-sm text-red">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary px-4 py-3.5 text-[15px] font-medium text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60">
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </main>
  );
}
