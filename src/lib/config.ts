// เช็คว่าตั้งค่าเชื่อมต่อ Google Sheet/Drive จริงครบหรือยัง
// ถ้ายัง ระบบจะใช้ข้อมูลตัวอย่าง (mock) แทนโดยอัตโนมัติ ไม่ต้องแก้โค้ดกลับไปกลับมา
export function isGoogleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID &&
      process.env.GOOGLE_DRIVE_FOLDER_ID
  );
}
