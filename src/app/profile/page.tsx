"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = { username: string; displayName: string; avatar?: string };

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/profile").then(async (response) => {
      if (response.ok) {
        const data = await response.json() as Profile;
        setProfile(data);
        setUsername(data.username);
        setDisplayName(data.displayName);
        setAvatar(data.avatar || "");
      } else {
        router.replace("/login");
      }
    });
  }, [router]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, displayName, avatar: removeAvatar ? "" : avatar || undefined }),
    });
    const data = await response.json().catch(() => ({ error: "เซิร์ฟเวอร์ไม่สามารถบันทึกข้อมูลได้" }));
    if (!response.ok) {
      setError(data.error || "บันทึกข้อมูลไม่สำเร็จ");
    } else {
      setProfile(data);
      setUsername(data.username);
      setDisplayName(data.displayName);
      setAvatar(data.avatar || "");
      setRemoveAvatar(false);
      setMessage("บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว");
      window.dispatchEvent(new CustomEvent("profile-updated", { detail: data }));
    }

    setSaving(false);
  }

  function selectAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }
    const image = new Image();
    image.onload = () => {
      const size = 128;
      const scale = Math.min(size / image.width, size / image.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
      setAvatar(canvas.toDataURL("image/jpeg", 0.7));
      setRemoveAvatar(false);
      setError("");
    };
    image.src = URL.createObjectURL(file);
  }

  if (!profile) {
    return <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center text-muted">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-paper px-5 py-8 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">บัญชีผู้ใช้งาน</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">ข้อมูลส่วนตัว</h1>
          <p className="mt-2 text-[15px] text-muted">จัดการข้อมูลที่ใช้แสดงและการรักษาความปลอดภัยของบัญชี</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#1744ad] text-4xl font-semibold text-white shadow-lg shadow-primary/20">
              {avatar && !removeAvatar ? <img src={avatar} alt="รูปโปรไฟล์" className="h-full w-full object-cover" /> : (profile.displayName || "N").slice(0, 1).toUpperCase()}
            </div>
            <label className="mt-4 inline-flex cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-paper">
              เปลี่ยนรูปโปรไฟล์
              <input type="file" accept="image/*" onChange={selectAvatar} className="sr-only" />
            </label>
            {avatar && <button type="button" onClick={() => setRemoveAvatar(true)} className="ml-2 text-sm text-red hover:underline">ลบรูป</button>}
            <h2 className="mt-5 font-display text-xl font-semibold text-ink">{profile.displayName}</h2>
            <p className="mt-1 text-sm text-muted">@{profile.username}</p>
            <div className="mt-6 rounded-xl bg-primary/5 px-4 py-3 text-sm leading-relaxed text-muted">
              บัญชีนี้ใช้สำหรับจัดการข้อมูลโครงการและรายงานของระบบ
            </div>
          </section>

          <form onSubmit={save} className="rounded-2xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-5 sm:px-8">
              <h2 className="font-display text-xl font-semibold text-ink">ตั้งค่าโปรไฟล์</h2>
              <p className="mt-1 text-sm text-muted">ข้อมูลจะแสดงในเมนูโปรไฟล์ด้านขวาบน</p>
            </div>
            <div className="space-y-6 px-6 py-6 sm:px-8">
              <label className="block text-sm font-medium text-ink">
                ชื่อที่แสดง
                <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-[15px] outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="เช่น ผู้ดูแลระบบ" />
                <span className="mt-1.5 block text-xs font-normal text-muted">ใช้ชื่อที่ต้องการให้แสดงในระบบ</span>
              </label>
              <label className="block text-sm font-medium text-ink">
                ชื่อผู้ใช้
                <input value={username} readOnly className="mt-2 w-full cursor-not-allowed rounded-xl border border-border bg-paper px-4 py-3.5 text-[15px] text-muted outline-none" />
                <span className="mt-1.5 block text-xs font-normal text-muted">ชื่อผู้ใช้และรหัสผ่านจัดการจาก Environment Variables</span>
              </label>
              {message && <p className="rounded-xl border border-green/20 bg-green/10 px-4 py-3 text-sm text-green">{message}</p>}
              {error && <p className="rounded-xl border border-red/20 bg-red/10 px-4 py-3 text-sm text-red">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-border bg-paper/40 px-6 py-4 sm:px-8">
              <button type="button" onClick={() => router.back()} className="rounded-xl px-5 py-2.5 text-sm font-medium text-muted hover:bg-paper hover:text-ink">ยกเลิก</button>
              <button type="submit" disabled={saving} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60">{saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
