// ข้อมูลตัวอย่างสำหรับดูตัวอย่างหน้าตาระบบ ก่อนเชื่อมต่อ Google Sheet จริง
// ทำงานเฉพาะตอนที่ยังตั้งค่า .env.local ไม่ครบ (ดู lib/config.ts) — เชื่อมต่อจริงเมื่อไหร่ ไฟล์นี้จะไม่ถูกใช้อีกต่อไปเอง
import { Attachment, Project, ProjectInput } from "./types";

const today = new Date();
const iso = (daysOffset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().slice(0, 10);
};

let store: Project[] = [
  {
    id: "PRJ-2569-006",
    projectName: "โครงการอบรมทักษะดิจิทัลสำหรับนักศึกษาชั้นปีที่ 1",
    department: "สาขาวิชาเทคโนโลยีสารสนเทศ",
    owner: "อ.วชิรวิทย์",
    fiscalYear: "2569",
    mission: "การเรียนการสอน",
    rationale: "",
    objective: "เพิ่มทักษะดิจิทัลพื้นฐานให้นักศึกษาก่อนเข้าเรียนวิชาชีพ",
    targetGroup: "นักศึกษาปี 1",
    location: "อาคาร ICT",
    startDate: iso(-5),
    endDate: iso(6),
    status: "กำลังดำเนินการ",
    budgetAllocated: 45000,
    budgetUsed: 41200,
    budgetSource: "งบประมาณแผ่นดิน",
    kpiQuantTarget: "80 คน",
    kpiQuantActual: "92 คน",
    kpiQualTarget: "",
    kpiQualActual: "",
    participantActual: 92,
    results: "",
    problems: "",
    recommendations: "",
    attachments: [],
    createdAt: iso(-20),
    updatedAt: iso(0),
  },
  {
    id: "PRJ-2569-005",
    projectName: "โครงการบริการวิชาการสู่ชุมชน: ซ่อมคอมพิวเตอร์เพื่อโรงเรียน",
    department: "สาขาวิชาเทคโนโลยีสารสนเทศ",
    owner: "อ.สมชาย",
    fiscalYear: "2569",
    mission: "การบริการวิชาการ",
    rationale: "",
    objective: "",
    targetGroup: "โรงเรียนในพื้นที่",
    location: "โรงเรียนบ้านหนองบัว",
    startDate: iso(-10),
    endDate: iso(2),
    status: "กำลังดำเนินการ",
    budgetAllocated: 20000,
    budgetUsed: 19500,
    budgetSource: "เงินรายได้คณะ",
    kpiQuantTarget: "",
    kpiQuantActual: "",
    kpiQualTarget: "",
    kpiQualActual: "",
    participantActual: 35,
    results: "",
    problems: "",
    recommendations: "",
    attachments: [],
    createdAt: iso(-15),
    updatedAt: iso(-1),
  },
  {
    id: "PRJ-2569-004",
    projectName: "โครงการวิจัยการประยุกต์ใช้ AI ในงานเกษตรอัจฉริยะ",
    department: "สาขาวิชาเทคโนโลยีสารสนเทศ",
    owner: "ผศ.ดร.กมล",
    fiscalYear: "2569",
    mission: "การวิจัย",
    rationale: "",
    objective: "",
    targetGroup: "เกษตรกรในพื้นที่",
    location: "แปลงสาธิต",
    startDate: iso(-60),
    endDate: iso(120),
    status: "กำลังดำเนินการ",
    budgetAllocated: 120000,
    budgetUsed: 54000,
    budgetSource: "ทุนวิจัยภายนอก",
    kpiQuantTarget: "",
    kpiQuantActual: "",
    kpiQualTarget: "",
    kpiQualActual: "",
    participantActual: 12,
    results: "",
    problems: "",
    recommendations: "",
    attachments: [],
    createdAt: iso(-60),
    updatedAt: iso(-3),
  },
  {
    id: "PRJ-2569-003",
    projectName: "โครงการทำนุบำรุงศิลปวัฒนธรรม: วันสงกรานต์สืบสานประเพณี",
    department: "สาขาวิชาเทคโนโลยีสารสนเทศ",
    owner: "อ.ปิยะดา",
    fiscalYear: "2569",
    mission: "ทำนุบำรุงศิลปวัฒนธรรม",
    rationale: "",
    objective: "",
    targetGroup: "บุคลากรและนักศึกษา",
    location: "ลานกิจกรรม",
    startDate: iso(-100),
    endDate: iso(-95),
    status: "เสร็จสิ้น",
    budgetAllocated: 15000,
    budgetUsed: 14800,
    budgetSource: "เงินรายได้คณะ",
    kpiQuantTarget: "",
    kpiQuantActual: "",
    kpiQualTarget: "",
    kpiQualActual: "",
    participantActual: 150,
    results: "",
    problems: "",
    recommendations: "",
    attachments: [],
    createdAt: iso(-110),
    updatedAt: iso(-95),
  },
  {
    id: "PRJ-2569-002",
    projectName: "โครงการปรับปรุงระบบเครือข่ายภายในอาคารเรียน",
    department: "สาขาวิชาเทคโนโลยีสารสนเทศ",
    owner: "อ.ธีระ",
    fiscalYear: "2569",
    mission: "บริหารจัดการ",
    rationale: "",
    objective: "",
    targetGroup: "",
    location: "อาคาร ICT",
    startDate: iso(-30),
    endDate: iso(-2),
    status: "ล่าช้า",
    budgetAllocated: 80000,
    budgetUsed: 30000,
    budgetSource: "งบประมาณแผ่นดิน",
    kpiQuantTarget: "",
    kpiQuantActual: "",
    kpiQualTarget: "",
    kpiQualActual: "",
    participantActual: 0,
    results: "",
    problems: "รอจัดซื้ออุปกรณ์",
    recommendations: "",
    attachments: [],
    createdAt: iso(-40),
    updatedAt: iso(-5),
  },
  {
    id: "PRJ-2569-001",
    projectName: "โครงการอบรมเตรียมความพร้อมก่อนฝึกงาน",
    department: "สาขาวิชาเทคโนโลยีสารสนเทศ",
    owner: "อ.วชิรวิทย์",
    fiscalYear: "2568",
    mission: "การเรียนการสอน",
    rationale: "",
    objective: "",
    targetGroup: "นักศึกษาปี 4",
    location: "ห้องประชุมสาขา",
    startDate: iso(-200),
    endDate: iso(-190),
    status: "เสร็จสิ้น",
    budgetAllocated: 10000,
    budgetUsed: 9800,
    budgetSource: "เงินรายได้คณะ",
    kpiQuantTarget: "",
    kpiQuantActual: "",
    kpiQualTarget: "",
    kpiQualActual: "",
    participantActual: 45,
    results: "",
    problems: "",
    recommendations: "",
    attachments: [],
    createdAt: iso(-210),
    updatedAt: iso(-190),
  },
];

export async function mockGetProjects(): Promise<Project[]> {
  return [...store].reverse();
}

export async function mockGetProject(id: string): Promise<Project | null> {
  return store.find((p) => p.id === id) ?? null;
}

function generateMockId(): string {
  let maxNum = 0;
  store.forEach((p) => {
    const m = p.id.match(/(\d+)$/);
    if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
  });
  const yearBE = new Date().getFullYear() + 543;
  return `PRJ-${yearBE}-${String(maxNum + 1).padStart(3, "0")}`;
}

export async function mockSaveProject(
  input: ProjectInput & { id?: string; attachments?: Attachment[] }
): Promise<Project> {
  if (!input.projectName?.trim()) {
    throw new Error("กรุณาระบุชื่อโครงการ");
  }
  const now = new Date().toISOString();

  if (input.id) {
    const idx = store.findIndex((p) => p.id === input.id);
    if (idx !== -1) {
      const updated: Project = {
        ...store[idx],
        ...input,
        id: input.id,
        attachments: input.attachments ?? store[idx].attachments,
        updatedAt: now,
      };
      store[idx] = updated;
      return updated;
    }
  }

  const created: Project = {
    ...input,
    id: generateMockId(),
    attachments: input.attachments ?? [],
    createdAt: now,
    updatedAt: now,
  } as Project;
  store = [...store, created];
  return created;
}

export async function mockDeleteProject(id: string): Promise<boolean> {
  const before = store.length;
  store = store.filter((p) => p.id !== id);
  return store.length < before;
}

export async function mockUploadAttachment(fileName: string): Promise<Attachment> {
  return { name: fileName, url: "#" };
}
