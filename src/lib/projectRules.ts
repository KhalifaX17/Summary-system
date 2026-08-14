// โครงการที่มีสถานะ "เสร็จสิ้น" ถือว่าปิดงานแล้ว ห้ามแก้ไขต่อ เพื่อกันข้อมูลที่ใช้อ้างอิงแล้วถูกเปลี่ยนภายหลัง
export function canEditProject(status: string): boolean {
  return status !== "เสร็จสิ้น";
}
