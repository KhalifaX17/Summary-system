"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveProjectAction } from "@/lib/actions";
import { MISSION_OPTIONS, Project, STATUS_OPTIONS } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-[12px] bg-primary px-5 py-2.5 text-[13.5px] font-medium text-white shadow-[0_16px_28px_rgba(242,140,40,0.24)] transition-all hover:bg-primary-dark active:scale-[0.97] disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100"
    >
      {pending ? "กำลังบันทึก..." : "บันทึกโครงการ"}
    </button>
  );
}

const field =
  "w-full px-4 py-3 rounded-[14px] border text-[14px] text-ink transition-all placeholder:text-[#a88f82] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/12";
const label = "mb-2 block text-[13.5px] font-medium text-ink";
const fieldStyle = {
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-border)",
  color: "var(--color-ink)",
} as const;

const steps = ["ข้อมูลพื้นฐาน", "งบประมาณ", "ผลลัพธ์"];

export default function ProjectForm({ project }: { project?: Project }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  function validateCurrentStep() {
    const form = formRef.current;
    if (!form) return false;

    const requiredFields = Array.from(form.querySelectorAll(`[data-step="${currentStep}"]`)) as Array<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >;

    for (const field of requiredFields) {
      if (field.required && !field.value.trim()) {
        field.reportValidity();
        return false;
      }
    }

    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-6 md:px-7">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#a35a2f]">Project form</p>
          <h2 className="mt-1 font-display text-[28px] font-semibold text-ink">
            {project ? "แก้ไขข้อมูลโครงการ" : "เพิ่มโครงการใหม่"}
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f1dcc5] bg-[#fffaf5] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#8a5d43]">
          <span className="h-2 w-2 rounded-full bg-primary" />
          {project ? "Update record" : "New record"}
        </div>
      </div>

      {project && (
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-[16px] border border-[#f1dcc5] bg-[#fffaf5] px-3 py-2 text-[12px] text-muted">
          <span className="font-medium text-ink">บันทึกล่าสุด:</span>
          <span>{project.updatedAt ? new Date(project.updatedAt).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short", hour12: false }) : "-"}</span>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {steps.map((step, index) => (
          <button
            key={step}
            type="button"
            onClick={() => {
              if (index <= currentStep || validateCurrentStep()) {
                setCurrentStep(index);
              }
            }}
            className={`rounded-full px-3 py-2 text-[12px] font-medium transition-all ${
              index === currentStep
                ? "bg-primary text-white shadow-[0_10px_22px_rgba(242,140,40,0.2)]"
                : index < currentStep
                  ? "bg-[#fff3e6] text-primary"
                  : "border border-[#f1dcc5] bg-white text-muted"
            }`}
          >
            {index + 1}. {step}
          </button>
        ))}
      </div>

      <form ref={formRef} action={saveProjectAction} className="space-y-5">
        {project && <input type="hidden" name="id" value={project.id} />}

        {[0, 1, 2].map((stepIndex) => {
          const title = stepIndex === 0 ? "ข้อมูลพื้นฐาน" : stepIndex === 1 ? "งบประมาณ" : "ผลการดำเนินงาน / ตัวชี้วัด";

          return (
            <div key={stepIndex} className={stepIndex === currentStep ? "block" : "hidden"}>
              {stepIndex === 0 && (
                <Section title={title}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className={label}>ชื่อโครงการ *</label>
                      <input
                        data-step={0}
                        name="projectName"
                        required
                        defaultValue={project?.projectName}
                        className={field}
                        style={fieldStyle}
                        placeholder="เช่น โครงการอบรมทักษะดิจิทัลสำหรับนักศึกษาชั้นปีที่ 1"
                      />
                    </div>
                    <div>
                      <label className={label}>หน่วยงาน/สาขา</label>
                      <input
                        data-step={0}
                        name="department"
                        defaultValue={project?.department ?? "สาขาวิชาเทคโนโลยีสารสนเทศ"}
                        className={field}
                        style={fieldStyle}
                      />
                    </div>
                    <div>
                      <label className={label}>ผู้รับผิดชอบ</label>
                      <input data-step={0} name="owner" defaultValue={project?.owner} className={field} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={label}>ปีงบประมาณ (พ.ศ.)</label>
                      <input
                        data-step={0}
                        name="fiscalYear"
                        defaultValue={project?.fiscalYear ?? String(new Date().getFullYear() + 543)}
                        className={field}
                        style={fieldStyle}
                        placeholder="2569"
                      />
                    </div>
                    <div>
                      <label className={label}>พันธกิจ</label>
                      <select data-step={0} name="mission" defaultValue={project?.mission ?? MISSION_OPTIONS[0]} className={field} style={fieldStyle}>
                        {MISSION_OPTIONS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className={label}>หลักการและเหตุผล</label>
                      <textarea data-step={0} name="rationale" defaultValue={project?.rationale} className={`${field} min-h-[86px]`} style={fieldStyle} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={label}>วัตถุประสงค์</label>
                      <textarea data-step={0} name="objective" defaultValue={project?.objective} className={`${field} min-h-[86px]`} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={label}>กลุ่มเป้าหมาย</label>
                      <input data-step={0} name="targetGroup" defaultValue={project?.targetGroup} className={field} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={label}>สถานที่ดำเนินการ</label>
                      <input data-step={0} name="location" defaultValue={project?.location} className={field} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={label}>วันที่เริ่มต้น</label>
                      <input data-step={0} type="date" name="startDate" defaultValue={project?.startDate} className={field} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={label}>วันที่สิ้นสุด</label>
                      <input data-step={0} type="date" name="endDate" defaultValue={project?.endDate} className={field} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={label}>สถานะ</label>
                      <select data-step={0} name="status" defaultValue={project?.status ?? STATUS_OPTIONS[0]} className={field} style={fieldStyle}>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Section>
              )}

              {stepIndex === 1 && (
                <Section title={title}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className={label}>งบประมาณที่ได้รับ (บาท)</label>
                      <input data-step={1} type="number" name="budgetAllocated" defaultValue={project?.budgetAllocated} className={field} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={label}>งบประมาณที่ใช้จริง (บาท)</label>
                      <input data-step={1} type="number" name="budgetUsed" defaultValue={project?.budgetUsed} className={field} style={fieldStyle} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={label}>แหล่งงบประมาณ</label>
                      <input
                        data-step={1}
                        name="budgetSource"
                        defaultValue={project?.budgetSource}
                        className={field}
                        style={fieldStyle}
                        placeholder="เช่น งบประมาณแผ่นดิน, เงินรายได้คณะ"
                      />
                    </div>
                  </div>
                </Section>
              )}

              {stepIndex === 2 && (
                <Section title={title}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className={label}>ตัวชี้วัดเชิงปริมาณ (เป้าหมาย)</label>
                      <input data-step={2} name="kpiQuantTarget" defaultValue={project?.kpiQuantTarget} className={field} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={label}>ตัวชี้วัดเชิงปริมาณ (ผลจริง)</label>
                      <input data-step={2} name="kpiQuantActual" defaultValue={project?.kpiQuantActual} className={field} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={label}>ตัวชี้วัดเชิงคุณภาพ (เป้าหมาย)</label>
                      <input data-step={2} name="kpiQualTarget" defaultValue={project?.kpiQualTarget} className={field} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={label}>ตัวชี้วัดเชิงคุณภาพ (ผลจริง)</label>
                      <input data-step={2} name="kpiQualActual" defaultValue={project?.kpiQualActual} className={field} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={label}>จำนวนผู้เข้าร่วมจริง (คน)</label>
                      <input data-step={2} type="number" name="participantActual" defaultValue={project?.participantActual} className={field} style={fieldStyle} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={label}>สรุปผลการดำเนินงาน</label>
                      <textarea data-step={2} name="results" defaultValue={project?.results} className={`${field} min-h-[90px]`} style={fieldStyle} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={label}>ปัญหา/อุปสรรค</label>
                      <textarea data-step={2} name="problems" defaultValue={project?.problems} className={`${field} min-h-[90px]`} style={fieldStyle} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={label}>ข้อเสนอแนะ</label>
                      <textarea data-step={2} name="recommendations" defaultValue={project?.recommendations} className={`${field} min-h-[90px]`} style={fieldStyle} />
                    </div>
                  </div>
                </Section>
              )}
            </div>
          );
        })}

        <div className="sticky bottom-3 z-10 flex justify-end gap-2.5 rounded-[18px] border border-[#f1dcc5] bg-white/90 p-3 shadow-[0_16px_32px_rgba(123,77,39,0.08)] backdrop-blur-md">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
              className="rounded-[10px] border border-[#f0d7ba] bg-[#fffaf5] px-5 py-3 text-[14px] font-medium text-ink transition-all hover:bg-[#fff3e8] active:scale-[0.97]"
            >
              ย้อนกลับ
            </button>
          )}

          <a
            href="/projects"
            className="rounded-[10px] border border-[#f0d7ba] bg-[#fffaf5] px-5 py-3 text-[14px] font-medium text-ink transition-all hover:bg-[#fff3e8] active:scale-[0.97]"
          >
            ยกเลิก
          </a>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-[12px] bg-primary px-5 py-2.5 text-[13.5px] font-medium text-white shadow-[0_16px_28px_rgba(242,140,40,0.24)] transition-all hover:bg-primary-dark active:scale-[0.97]"
            >
              ถัดไป
            </button>
          ) : (
            <SubmitButton />
          )}
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[22px] border border-[#f1dcc5] bg-[linear-gradient(180deg,#fffefc_0%,#fffaf5_100%)] p-5 shadow-[0_12px_24px_rgba(123,77,39,0.04)] md:p-7">
      <div className="mb-5 flex items-center gap-3 border-b border-[#f3e8dd] pb-4">
        <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_6px_rgba(242,140,40,0.12)]" />
        <h3 className="font-display text-[18px] font-semibold text-ink">{title}</h3>
      </div>
      {children}
    </div>
  );
}
