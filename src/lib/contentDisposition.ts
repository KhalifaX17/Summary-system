// filename= แบบเดิมรองรับแค่ ASCII — ชื่อไฟล์ที่มีภาษาไทย (เช่น trueพันธกิจ) ต้องเข้ารหัสตาม RFC 5987
// ด้วย filename*= ควบคู่กับ fallback แบบ ASCII ให้เบราว์เซอร์รุ่นเก่าด้วย
export function buildContentDisposition(fileName: string): string {
  const asciiFallback = fileName.replace(/[^\x20-\x7E]/g, "_");
  const encoded = encodeURIComponent(fileName);
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}
