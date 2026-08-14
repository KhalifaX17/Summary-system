"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="max-w-md w-full bg-surface border border-border rounded-2xl shadow-sm p-7 text-center">
        <div className="text-3xl mb-3">⚠️</div>
        <h1 className="font-display font-semibold text-[17px] mb-2">ระบบยังใช้งานไม่ได้</h1>
        <p className="text-[13.5px] text-muted leading-relaxed mb-1">{error.message}</p>
        <p className="text-[12px] text-muted mt-4">
          ดูขั้นตอนตั้งค่าได้ที่ <code className="bg-paper px-1.5 py-0.5 rounded">README.md</code> ของโปรเจกต์
          (ตั้งค่า Service Account, แชร์ Sheet/Drive, ใส่ตัวแปรแวดล้อม)
        </p>
      </div>
    </div>
  );
}
