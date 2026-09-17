"use client";

import { useFormStatus } from "react-dom";
import { saveProjectAction } from "@/lib/actions";
import { MISSION_OPTIONS, Project, STATUS_OPTIONS } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary hover:bg-primary-dark disabled:opacity-60 text-white text-[13.5px] font-medium px-5 py-2.5 rounded-[9px] transition-all active:scale-[0.97] disabled:active:scale-100"
    >
      {pending ? "กำลังบันทึก..." : "บันทึกโครงการ"}
    </button>
  );
}

const field =
  "w-full px-4 py-3 rounded-[10px] border border-border bg-surface text-[14px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted/60";
const label = "block text-[13.5px] font-medium text-ink mb-2";

export default function ProjectForm({ project }: { project?: Project }) {
  return (
    <form action={saveProjectAction} className="space-y-5">
      {project && <input type="hidden" name="id" value={project.id} />}

      <Section title="ข้อมูลพื้นฐาน">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={label}>ชื่อโครงการ *</label>
            <input
              name="projectName"
              required
              defaultValue={project?.projectName}
              className={field}
              placeholder="เช่น โครงการอบรมทักษะดิจิทัลสำหรับนักศึกษาชั้นปีที่ 1"
            />
          </div>
          <div>
            <label className={label}>หน่วยงาน/สาขา</label>
            <input
              name="department"
              defaultValue={project?.department ?? "สาขาวิชาเทคโนโลยีสารสนเทศ"}
              className={field}
            />
          </div>
          <div>
            <label className={label}>ผู้รับผิดชอบ</label>
            <input name="owner" defaultValue={project?.owner} className={field} />
          </div>
          <div>
            <label className={label}>ปีงบประมาณ (พ.ศ.)</label>
            <input
              name="fiscalYear"
              defaultValue={project?.fiscalYear ?? String(new Date().getFullYear() + 543)}
              className={field}
              placeholder="2569"
            />
          </div>
          <div>
            <label className={label}>พันธกิจ</label>
            <select name="mission" defaultValue={project?.mission ?? MISSION_OPTIONS[0]} className={field}>
              {MISSION_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={label}>หลักการและเหตุผล</label>
            <textarea name="rationale" defaultValue={project?.rationale} className={`${field} min-h-16`} />
          </div>
          <div className="md:col-span-2">
            <label className={label}>วัตถุประสงค์</label>
            <textarea name="objective" defaultValue={project?.objective} className={`${field} min-h-16`} />
          </div>
          <div>
            <label className={label}>กลุ่มเป้าหมาย</label>
            <input name="targetGroup" defaultValue={project?.targetGroup} className={field} />
          </div>
          <div>
            <label className={label}>สถานที่ดำเนินการ</label>
            <input name="location" defaultValue={project?.location} className={field} />
          </div>
          <div>
            <label className={label}>วันที่เริ่มต้น</label>
            <input type="date" name="startDate" defaultValue={project?.startDate} className={field} />
          </div>
          <div>
            <label className={label}>วันที่สิ้นสุด</label>
            <input type="date" name="endDate" defaultValue={project?.endDate} className={field} />
          </div>
          <div>
            <label className={label}>สถานะ</label>
            <select name="status" defaultValue={project?.status ?? STATUS_OPTIONS[0]} className={field}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <Section title="งบประมาณ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>งบประมาณที่ได้รับ (บาท)</label>
            <input
              type="number"
              name="budgetAllocated"
              defaultValue={project?.budgetAllocated}
              className={field}
            />
          </div>
          <div>
            <label className={label}>งบประมาณที่ใช้จริง (บาท)</label>
            <input type="number" name="budgetUsed" defaultValue={project?.budgetUsed} className={field} />
          </div>
          <div className="md:col-span-2">
            <label className={label}>แหล่งงบประมาณ</label>
            <input
              name="budgetSource"
              defaultValue={project?.budgetSource}
              className={field}
              placeholder="เช่น งบประมาณแผ่นดิน, เงินรายได้คณะ"
            />
          </div>
        </div>
      </Section>

      <Section title="ผลการดำเนินงาน / ตัวชี้วัด">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>ตัวชี้วัดเชิงปริมาณ (เป้าหมาย)</label>
            <input name="kpiQuantTarget" defaultValue={project?.kpiQuantTarget} className={field} />
          </div>
          <div>
            <label className={label}>ตัวชี้วัดเชิงปริมาณ (ผลจริง)</label>
            <input name="kpiQuantActual" defaultValue={project?.kpiQuantActual} className={field} />
          </div>
          <div>
            <label className={label}>ตัวชี้วัดเชิงคุณภาพ (เป้าหมาย)</label>
            <input name="kpiQualTarget" defaultValue={project?.kpiQualTarget} className={field} />
          </div>
          <div>
            <label className={label}>ตัวชี้วัดเชิงคุณภาพ (ผลจริง)</label>
            <input name="kpiQualActual" defaultValue={project?.kpiQualActual} className={field} />
          </div>
          <div>
            <label className={label}>จำนวนผู้เข้าร่วมจริง (คน)</label>
            <input
              type="number"
              name="participantActual"
              defaultValue={project?.participantActual}
              className={field}
            />
          </div>
          <div className="md:col-span-2">
            <label className={label}>สรุปผลการดำเนินงาน</label>
            <textarea name="results" defaultValue={project?.results} className={`${field} min-h-16`} />
          </div>
          <div className="md:col-span-2">
            <label className={label}>ปัญหา/อุปสรรค</label>
            <textarea name="problems" defaultValue={project?.problems} className={`${field} min-h-16`} />
          </div>
          <div className="md:col-span-2">
            <label className={label}>ข้อเสนอแนะ</label>
            <textarea name="recommendations" defaultValue={project?.recommendations} className={`${field} min-h-16`} />
          </div>
        </div>
      </Section>

      <div className="sticky bottom-3 z-10 flex justify-end gap-2.5 rounded-2xl border border-border bg-surface/95 p-3 shadow-lg backdrop-blur-sm">
        <a
          href="/projects"
          className="rounded-[10px] border border-border px-5 py-3 text-[14px] hover:bg-paper transition-all active:scale-[0.97]"
        >
          ยกเลิก
        </a>
        <SubmitButton />
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-2xl shadow-sm p-5 md:p-7">
      <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <h3 className="font-display font-semibold text-[18px] text-ink">{title}</h3>
      </div>
      {children}
    </div>
  );
}
