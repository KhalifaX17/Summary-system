export function parseExportScope(searchParams: URLSearchParams) {
  return {
    year: searchParams.get("year") || undefined,
    type: searchParams.get("type") === "summary" ? ("summary" as const) : ("detail" as const),
  };
}

export function exportScopeLabel(year?: string): string {
  return year ? `ปีงบประมาณ ${year}` : "ทุกปีงบประมาณ";
}

export function exportFileTag(year?: string, type?: "summary" | "detail"): string {
  const parts: string[] = [];
  parts.push(year ? `ปีงบ${year}` : "ทั้งหมด");
  if (type === "summary") parts.push("สรุป");
  return parts.join("_");
}
