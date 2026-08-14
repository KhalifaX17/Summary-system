export const MISSION_OPTIONS = [
  "การเรียนการสอน",
  "การวิจัย",
  "การบริการวิชาการ",
  "ทำนุบำรุงศิลปวัฒนธรรม",
  "บริหารจัดการ",
] as const;

export const STATUS_OPTIONS = [
  "วางแผน",
  "กำลังดำเนินการ",
  "เสร็จสิ้น",
  "ล่าช้า",
  "ยกเลิก",
] as const;

export type Mission = (typeof MISSION_OPTIONS)[number];
export type Status = (typeof STATUS_OPTIONS)[number];

export interface Attachment {
  name: string;
  url: string;
}

export interface Project {
  id: string;
  projectName: string;
  department: string;
  owner: string;
  fiscalYear: string;
  mission: string;
  qaIndicator: string;
  rationale: string;
  objective: string;
  targetGroup: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  budgetAllocated: number;
  budgetUsed: number;
  budgetSource: string;
  kpiQuantTarget: string;
  kpiQuantActual: string;
  kpiQualTarget: string;
  kpiQualActual: string;
  participantActual: number;
  results: string;
  problems: string;
  recommendations: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectInput = Omit<
  Project,
  "id" | "createdAt" | "updatedAt" | "attachments"
> & {
  attachments?: Attachment[];
};

export const FIELD_LABELS: Record<keyof Project, string> = {
  id: "รหัสโครงการ",
  projectName: "ชื่อโครงการ",
  department: "หน่วยงาน/สาขา",
  owner: "ผู้รับผิดชอบ",
  fiscalYear: "ปีงบประมาณ",
  mission: "พันธกิจ",
  qaIndicator: "ตัวบ่งชี้ QA ที่เกี่ยวข้อง",
  rationale: "หลักการและเหตุผล",
  objective: "วัตถุประสงค์",
  targetGroup: "กลุ่มเป้าหมาย",
  location: "สถานที่ดำเนินการ",
  startDate: "วันที่เริ่มต้น",
  endDate: "วันที่สิ้นสุด",
  status: "สถานะ",
  budgetAllocated: "งบประมาณที่ได้รับ (บาท)",
  budgetUsed: "งบประมาณที่ใช้จริง (บาท)",
  budgetSource: "แหล่งงบประมาณ",
  kpiQuantTarget: "ตัวชี้วัดเชิงปริมาณ (เป้าหมาย)",
  kpiQuantActual: "ตัวชี้วัดเชิงปริมาณ (ผลจริง)",
  kpiQualTarget: "ตัวชี้วัดเชิงคุณภาพ (เป้าหมาย)",
  kpiQualActual: "ตัวชี้วัดเชิงคุณภาพ (ผลจริง)",
  participantActual: "จำนวนผู้เข้าร่วมจริง (คน)",
  results: "สรุปผลการดำเนินงาน",
  problems: "ปัญหา/อุปสรรค",
  recommendations: "ข้อเสนอแนะ",
  attachments: "ไฟล์แนบ",
  createdAt: "วันที่บันทึก",
  updatedAt: "แก้ไขล่าสุด",
};

// ลำดับคอลัมน์ใน Google Sheet — ห้ามสลับลำดับโดยไม่ migrate ข้อมูลเดิม
export const SHEET_COLUMNS: (keyof Project)[] = [
  "id",
  "projectName",
  "department",
  "owner",
  "fiscalYear",
  "mission",
  "qaIndicator",
  "rationale",
  "objective",
  "targetGroup",
  "location",
  "startDate",
  "endDate",
  "status",
  "budgetAllocated",
  "budgetUsed",
  "budgetSource",
  "kpiQuantTarget",
  "kpiQuantActual",
  "kpiQualTarget",
  "kpiQualActual",
  "participantActual",
  "results",
  "problems",
  "recommendations",
  "attachments",
  "createdAt",
  "updatedAt",
];

export interface DashboardStats {
  total: number;
  totalBudgetAllocated: number;
  totalBudgetUsed: number;
  totalParticipants: number;
  byStatus: Record<string, number>;
  byMission: Record<string, number>;
}
