"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "หน้าหลัก", exact: true },
  { href: "/dashboard", label: "แดชบอร์ด", exact: true },
  { href: "/projects", label: "รายการโครงการ", exact: false },
];

function isActive(pathname: string, href: string, exact: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPage = pathname === "/" || pathname === "/login";
  const visibleItems = isPublicPage ? NAV_ITEMS.slice(0, 1) : NAV_ITEMS.slice(1);
  const [profile, setProfile] = useState<{ username: string; displayName: string; avatar?: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("summary-theme");
    const enabled = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    // Hydrate the persisted theme after the client is available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDarkMode(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  useEffect(() => {
    if (isPublicPage) return;
    fetch("/api/auth/profile").then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setDisplayName(data.displayName);
      }
    });
  }, [isPublicPage]);

  useEffect(() => {
    function updateProfile(event: Event) {
      const data = (event as CustomEvent<{ username: string; displayName: string; avatar?: string }>).detail;
      if (data) setProfile(data);
    }
    window.addEventListener("profile-updated", updateProfile);
    return () => window.removeEventListener("profile-updated", updateProfile);
  }, []);

  function toggleTheme() {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("summary-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function saveProfile() {
    setSavingProfile(true);
    setProfileError("");
    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, password: password || undefined }),
    });
    if (response.ok) {
      setProfile(await response.json());
      setPassword("");
      setEditOpen(false);
    } else {
      const data = await response.json();
      setProfileError(data.error || "บันทึกโปรไฟล์ไม่สำเร็จ");
    }
    setSavingProfile(false);
  }

  async function signOut() {
    setSigningOut(true);
    setOpen(false);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("ออกจากระบบไม่สำเร็จ");
      router.replace("/login");
      router.refresh();
    } catch {
      setSigningOut(false);
      setProfileError("ออกจากระบบไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  return (
    <header className="relative z-50 h-16 shrink-0 overflow-visible bg-surface/95 border-b border-border/80 flex items-center justify-end px-4 sm:px-6 md:px-10 backdrop-blur-sm">
      <nav className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={darkMode ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
          title={darkMode ? "โหมดสว่าง" : "โหมดมืด"}
          className="mr-1 flex h-11 w-11 items-center justify-center rounded-lg text-xl text-muted transition-colors hover:bg-paper hover:text-ink"
        >
          {darkMode ? "☀" : "☾"}
        </button>
        {visibleItems.map(({ href, label, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`relative px-4 py-2.5 rounded-[9px] text-[14px] sm:text-[15px] transition-all active:scale-[0.96] ${
                active ? "text-white" : "text-muted hover:bg-paper hover:text-ink"
              }`}
            >
              {active && (
                <span className="absolute inset-0 rounded-[8px] bg-gradient-to-r from-primary to-[#4d84f5]" />
              )}
              <span className="relative">{label}</span>
            </Link>
          );
        })}
        {isPublicPage && (
          <Link
            href="/login"
            className="ml-2 rounded-[9px] bg-primary px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            เข้าสู่ระบบ
          </Link>
        )}
        {!isPublicPage && (
          <div className="relative ml-2" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label="เมนูโปรไฟล์"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-primary text-sm font-medium text-white shadow-sm"
            >
              {profile?.avatar ? <img src={profile.avatar} alt="" className="h-full w-full rounded-full object-cover" /> : (profile?.displayName || "N").slice(0, 1).toUpperCase()}
            </button>
            {open && (
              <div className="absolute right-0 top-11 z-[100] w-56 rounded-xl border border-border bg-surface p-1.5 shadow-xl">
                <div className="border-b border-border px-3 py-2">
                  <div className="text-sm font-medium text-ink">{profile?.displayName || "ผู้ใช้"}</div>
                  <div className="text-xs text-muted">{profile?.username || ""}</div>
                </div>
                <button type="button" onClick={() => { setOpen(false); router.push("/profile"); }} className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-ink hover:bg-paper">
                  ข้อมูลส่วนตัว
                </button>
                <button type="button" onClick={signOut} disabled={signingOut} className="mt-1 w-full rounded-lg border-t border-border px-3 py-2.5 pt-3 text-left text-sm text-red hover:bg-red/10 disabled:cursor-wait disabled:opacity-60">
                  {signingOut ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
                </button>
              </div>
            )}
            {editOpen && (
              <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm" onClick={() => setEditOpen(false)}>
                <div className="w-full max-w-[460px] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl" onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-start justify-between border-b border-border bg-paper/60 px-6 py-5">
                    <div>
                      <h2 className="font-display text-[22px] font-semibold text-ink">แก้ไขโปรไฟล์</h2>
                      <p className="mt-1 text-sm text-muted">ปรับข้อมูลที่ใช้แสดงในระบบ</p>
                    </div>
                    <button type="button" onClick={() => setEditOpen(false)} aria-label="ปิดหน้าต่าง" className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-muted hover:bg-paper hover:text-ink">×</button>
                  </div>
                  <div className="px-6 py-6">
                    <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-paper/50 p-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white shadow-md shadow-primary/20">
                        {(displayName || "N").slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-display text-lg font-semibold text-ink">{displayName || "ผู้ใช้"}</div>
                        <div className="mt-0.5 truncate text-sm text-muted">@{profile?.username || ""}</div>
                      </div>
                    </div>
                    <label className="block text-sm font-medium text-ink">
                      ชื่อที่แสดง
                      <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="เช่น ผู้ดูแลระบบ" />
                    </label>
                    <label className="mt-5 block text-sm font-medium text-ink">
                      ชื่อผู้ใช้
                      <input value={profile?.username || ""} readOnly className="mt-2 w-full cursor-not-allowed rounded-xl border border-border bg-paper px-4 py-3 text-sm text-muted outline-none" />
                    </label>
                    <label className="mt-5 block text-sm font-medium text-ink">
                      รหัสผ่านใหม่
                      <span className="ml-1 text-xs font-normal text-muted">(เว้นว่างถ้าไม่เปลี่ยน)</span>
                      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="กรอกรหัสผ่านใหม่" />
                    </label>
                    {profileError && <p className="mt-4 rounded-xl border border-red/20 bg-red/10 px-4 py-3 text-sm text-red">{profileError}</p>}
                  </div>
                  <div className="flex justify-end gap-2 border-t border-border bg-paper/40 px-6 py-4">
                    <button type="button" onClick={() => setEditOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:bg-paper hover:text-ink">ยกเลิก</button>
                    <button type="button" onClick={saveProfile} disabled={savingProfile} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60">{savingProfile ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
