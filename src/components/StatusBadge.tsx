const STYLES: Record<string, string> = {
  วางแผน: "bg-[#e8ecfb] text-[#3d54c9] dark:bg-[#293b78] dark:text-[#b9c8ff]",
  กำลังดำเนินการ: "bg-[#fdf1da] text-[#b5760a] dark:bg-[#684c1e] dark:text-[#ffd98a]",
  เสร็จสิ้น: "bg-[#dcf5e9] text-[#148a58] dark:bg-[#174c3b] dark:text-[#9be8c6]",
  ล่าช้า: "bg-[#fbe4e0] text-[#c23c26] dark:bg-[#612f2b] dark:text-[#ffb4a8]",
  ยกเลิก: "bg-[#eceef2] text-[#6b7385] dark:bg-[#374151] dark:text-[#cbd5e1]",
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = STYLES[status] ?? STYLES["วางแผน"];
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${cls}`}>
      {status || "วางแผน"}
    </span>
  );
}
