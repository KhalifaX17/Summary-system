const STYLES: Record<string, string> = {
  วางแผน: "bg-[#e8ecfb] text-[#3d54c9]",
  กำลังดำเนินการ: "bg-[#fdf1da] text-[#b5760a]",
  เสร็จสิ้น: "bg-[#dcf5e9] text-[#148a58]",
  ล่าช้า: "bg-[#fbe4e0] text-[#c23c26]",
  ยกเลิก: "bg-[#eceef2] text-[#6b7385]",
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = STYLES[status] ?? STYLES["วางแผน"];
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${cls}`}>
      {status || "วางแผน"}
    </span>
  );
}
