# ระบบสรุปโครงการ

เว็บแอประบบสรุปโครงการ สร้างด้วย **Next.js** เก็บข้อมูลจริงใน **Google Sheet** (ผ่าน Google Sheets API)
เก็บไฟล์แนบใน **Google Drive** ส่งออกรายงานเป็น **Excel / PDF / CSV** ได้ทันที ไม่ต้องล็อกอิน Google เพื่อเข้าใช้เว็บ

## ภาพรวมสถาปัตยกรรม

- **หน้าเว็บ**: Next.js (App Router) — deploy บน Vercel ได้ลิงก์ปกติ ไม่ผ่าน Google
- **ฐานข้อมูล**: Google Sheet — เขียน/อ่านผ่าน **Service Account** (บัญชีหุ่นยนต์ของ Google Cloud ไม่ใช่บัญชี Gmail คน) ทำงานเบื้องหลัง ผู้ใช้ไม่ต้องล็อกอินเอง
- **ไฟล์แนบ**: Google Drive โฟลเดอร์เดียว แยกโฟลเดอร์ย่อยตามรหัสโครงการ ผ่าน Service Account เดียวกัน

### แผนผังการทำงาน

![แผนผังการทำงานของระบบ](docs/flowchart.png)

ประเด็นสำคัญ: การอ่าน/เขียนข้อมูลทั้งหมดวิ่งผ่าน **Service Account** โดยตรง ไม่ต้องให้ผู้ใช้ล็อกอิน Google และไม่ผ่าน Apps Script อีกต่อไป — ต่างจากเวอร์ชันแรกที่ deploy ผ่าน script.google.com

## ยังไม่ได้เชื่อมต่อ Google Sheet? ดูตัวอย่างได้เลย

ถ้ายังไม่ได้ตั้งค่าตามขั้นตอนด้านล่าง ระบบจะ**แสดงข้อมูลตัวอย่างให้อัตโนมัติ** (มีแถบสีทองบอกไว้ด้านบนทุกหน้า) เพื่อให้ดูหน้าตา/ทดลองใช้งานได้ก่อน — พอตั้งค่าไฟล์ `.env.local` ครบตามขั้นตอนด้านล่าง ระบบจะสลับไปใช้ข้อมูลจริงเองทันที ไม่ต้องแก้โค้ดหรือลบอะไรออก

## ขั้นตอนตั้งค่า (ทำครั้งเดียว)

### 1. สร้าง Google Sheet สำหรับเก็บข้อมูล

สร้าง Google Sheet ใหม่ ตั้งชื่อ เช่น `ข้อมูลระบบสรุปโครงการ ICT` (ไม่ต้องสร้างชีต/หัวตารางเอง ระบบสร้างให้อัตโนมัติตอนใช้งานครั้งแรก)
คัดลอก **Spreadsheet ID** จาก URL: `https://docs.google.com/spreadsheets/d/<ตรงนี้คือ ID>/edit`

### 2. สร้างโฟลเดอร์ Google Drive สำหรับไฟล์แนบ

สร้างโฟลเดอร์ใหม่ใน Drive เช่น `ICT_Project_Attachments`
คัดลอก **Folder ID** จาก URL: `https://drive.google.com/drive/folders/<ตรงนี้คือ ID>`

### 3. สร้าง Service Account (Google Cloud Console)

1. เปิด https://console.cloud.google.com/ → สร้างโปรเจกต์ใหม่ (หรือใช้โปรเจกต์เดิม)
2. เมนู **APIs & Services → Library** → ค้นหาแล้วกด **Enable** ทั้งสองตัว:
   - **Google Sheets API**
   - **Google Drive API**
3. เมนู **APIs & Services → Credentials** → **+ Create Credentials → Service account**
   - ตั้งชื่อ เช่น `ict-project-system`
   - กด Create/Done (ไม่ต้องตั้งค่า role เพิ่ม)
4. คลิกเข้าไปที่ Service Account ที่สร้าง → แท็บ **Keys** → **Add Key → Create new key** → เลือก **JSON** → กด Create
   - ไฟล์ JSON จะถูกดาวน์โหลดลงเครื่อง **เก็บไฟล์นี้ไว้ดี ๆ ห้ามอัปโหลดขึ้น GitHub**
5. เปิดไฟล์ JSON ที่ได้ จะเห็น:
   - `client_email` → นี่คืออีเมลของ Service Account (หน้าตาแบบ `xxx@xxx.iam.gserviceaccount.com`)
   - `private_key` → กุญแจลับ (ขึ้นต้นด้วย `-----BEGIN PRIVATE KEY-----`)

### 4. แชร์ Sheet และโฟลเดอร์ Drive ให้ Service Account

**สำคัญมาก** — ถ้าข้ามขั้นตอนนี้ระบบจะเขียนข้อมูลไม่ได้:

- เปิด Google Sheet ที่สร้างไว้ (ข้อ 1) → กด **Share** → วางอีเมล Service Account (`client_email`) → ตั้งสิทธิ์เป็น **Editor** → Send
- เปิดโฟลเดอร์ Drive ที่สร้างไว้ (ข้อ 2) → กด **Share** → วางอีเมล Service Account เดิม → ตั้งสิทธิ์เป็น **Editor** → Send

### 5. ตั้งค่าตัวแปรแวดล้อม

คัดลอก `.env.local.example` เป็น `.env.local` แล้วกรอกค่า:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=จาก ข้อ 1
GOOGLE_DRIVE_FOLDER_ID=จาก ข้อ 2
GOOGLE_WORKSPACE_DOMAIN=rmuti.ac.th
```

> **หมายเหตุเรื่อง `GOOGLE_PRIVATE_KEY`**: คัดลอกค่า `private_key` จากไฟล์ JSON มาทั้งก้อน ระวังเรื่อง `\n` — ถ้าคัดลอกมาทั้งบรรทัดจาก JSON (ซึ่งเก็บ `\n` เป็นตัวอักษร 2 ตัวอยู่แล้ว) แปะลงใน `.env.local` ตรง ๆ ได้เลยโดยครอบด้วย `"..."`

## รันในเครื่องตัวเอง

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

## Deploy ขึ้น Vercel

1. Push โค้ดโฟลเดอร์นี้ขึ้น GitHub repo (**อย่า commit ไฟล์ `.env.local`** — `.gitignore` กันไว้ให้แล้ว)
2. ไปที่ https://vercel.com → **Add New → Project** → เลือก repo นี้
3. ตอนตั้งค่า Environment Variables ให้ใส่ 5 ตัวแปรเดียวกับ `.env.local`:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (แปะทั้งก้อนรวม `\n`)
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `GOOGLE_WORKSPACE_DOMAIN`
4. กด **Deploy** — เสร็จแล้วจะได้ลิงก์เว็บแบบ `https://ชื่อโปรเจกต์.vercel.app` ใช้งานได้ทันที ไม่ต้องล็อกอิน Google

## ฟิลด์ข้อมูลโครงการ

**ข้อมูลพื้นฐาน**: ชื่อโครงการ, หน่วยงาน/สาขา, ผู้รับผิดชอบ, ปีงบประมาณ, พันธกิจ, หลักการและเหตุผล, วัตถุประสงค์, กลุ่มเป้าหมาย, สถานที่, วันที่เริ่ม-สิ้นสุด, สถานะ
**งบประมาณ**: งบที่ได้รับ, งบที่ใช้จริง, แหล่งงบประมาณ
**ผลการดำเนินงาน**: ตัวชี้วัดเชิงปริมาณ/เชิงคุณภาพ (เป้าหมาย/ผลจริง), จำนวนผู้เข้าร่วมจริง, สรุปผล, ปัญหาอุปสรรค, ข้อเสนอแนะ
**ไฟล์แนบ**: อัปโหลดไฟล์/รูปภาพ เก็บอัตโนมัติใน Google Drive แยกโฟลเดอร์ตามรหัสโครงการ

## โครงสร้างโปรเจกต์

| ไฟล์/โฟลเดอร์ | หน้าที่ |
|---|---|
| `src/lib/types.ts` | นิยามฟิลด์ข้อมูลโครงการ + ตัวเลือกสถานะ/พันธกิจ |
| `src/lib/googleClients.ts` | เชื่อมต่อ Google API ด้วย Service Account |
| `src/lib/sheets.ts` | อ่าน/เขียน/ลบข้อมูลใน Google Sheet + สรุปสถิติแดชบอร์ด |
| `src/lib/drive.ts` | อัปโหลดไฟล์แนบขึ้น Google Drive |
| `src/lib/actions.ts` | Server Actions สำหรับบันทึก/ลบโครงการ (เรียกจากฟอร์ม) |
| `src/lib/config.ts` | เช็คว่าตั้งค่า Google เชื่อมต่อจริงครบหรือยัง |
| `src/lib/mockData.ts` | ข้อมูลตัวอย่างที่ใช้แสดงก่อนเชื่อมต่อ Google Sheet จริง |
| `src/app/page.tsx` | หน้าแรก (แนะนำระบบ) |
| `src/app/dashboard/page.tsx` | แดชบอร์ดสรุปภาพรวม |
| `src/app/projects/` | รายการโครงการ (มีปุ่มเพิ่ม/ส่งออกอยู่ในหน้านี้), เพิ่ม/แก้ไขโครงการ |
| `src/app/api/export/` | สร้างไฟล์ Excel / PDF / CSV จริง (เรียกจากปุ่ม "ส่งออกข้อมูล" ในหน้ารายการโครงการ) |

## เกี่ยวกับระบบเวอร์ชัน Apps Script เดิม

โฟลเดอร์แม่ (`../`) ยังมีเวอร์ชันแรกที่สร้างด้วย Google Apps Script (deploy ผ่าน script.google.com) เก็บไว้เป็นข้อมูลอ้างอิง — เวอร์ชัน Next.js นี้เป็นเวอร์ชันหลักที่แนะนำให้ใช้งานจริง เพราะได้ลิงก์เว็บไซต์ปกติ ไม่ต้องพึ่ง Google login
