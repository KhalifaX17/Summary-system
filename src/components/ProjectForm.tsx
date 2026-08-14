"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveProjectAction } from "@/lib/actions";
import { Attachment, MISSION_OPTIONS, Project, STATUS_OPTIONS } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary hover:bg-primary-dark disabled:opacity-60 text-white text-[13.5px] font-medium px-5 py-2.5 rounded-[9px] transition-colors"
    >
      {pending ? "กำลังบันทึก..." : "บันทึกโครงการ"}
    </button>
  );
}

const field =
  "w-full px-3 py-2.5 rounded-[8px] border border-border bg-surface text-[13.5px] focus:outline-none focus:border-primary";
const label = "block text-[12.5px] text-muted mb-1.5";

export default function ProjectForm({ project }: { project?: Project }) {
  const [attachments, setAttachments] = useState<Attachment[]>(project?.attachments ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form action={saveProjectAction} className="space-y-4">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="existingAttachments" value={JSON.stringify(attachments)} />

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
            <label className={label}>ตัวบ่งชี้ QA ที่เกี่ยวข้อง (ถ้ามี)</label>
            <input
              name="qaIndicator"
              defaultValue={project?.qaIndicator}
              className={field}
              placeholder="เช่น องค์ประกอบที่ 3 ตัวบ่งชี้ 3.2"
            />
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

      <Section title="ไฟล์แนบ / หลักฐาน">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-[1.5px] border-dashed border-border rounded-[10px] p-4 text-center text-[12.5px] text-muted bg-paper cursor-pointer hover:border-primary"
        >
          คลิกเพื่อเลือกไฟล์ หรือรูปภาพหลักฐานการดำเนินงาน (อัปโหลดขึ้น Google Drive เมื่อกดบันทึก)
          <input ref={fileInputRef} type="file" name="newFiles" multiple className="hidden" />
        </div>
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {attachments.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-[#eef2fc] text-primary-dark px-2.5 py-1.5 rounded-full text-[12px]"
              >
                <a href={a.url} target="_blank" rel="noreferrer" className="hover:underline">
                  {a.name}
                </a>
                <button
                  type="button"
                  onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-red font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      <div className="flex justify-end gap-2.5">
        <a
          href="/projects"
          className="px-4 py-2.5 rounded-[9px] border border-border text-[13.5px] hover:bg-paper"
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
    <div className="bg-surface border border-border rounded-2xl shadow-sm p-5 md:p-6">
      <h3 className="font-display font-semibold text-[14.5px] text-primary-dark mb-4">{title}</h3>
      {children}
    </div>
  );
}
