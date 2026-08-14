"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveProject, deleteProject, getProject } from "./sheets";
import { uploadAttachment } from "./drive";
import { canEditProject } from "./projectRules";
import { Attachment, ProjectInput } from "./types";

const NUMBER_FIELDS = new Set(["budgetAllocated", "budgetUsed", "participantActual"]);

function readTextFields(formData: FormData): Record<string, unknown> {
  const keys = [
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
  ];
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    const raw = (formData.get(key) as string) ?? "";
    out[key] = NUMBER_FIELDS.has(key) ? Number(raw) || 0 : raw;
  }
  return out;
}

export async function saveProjectAction(formData: FormData): Promise<void> {
  const id = (formData.get("id") as string) || undefined;

  if (id) {
    const existing = await getProject(id);
    if (existing && !canEditProject(existing.status)) {
      throw new Error("โครงการนี้เสร็จสิ้นแล้ว ไม่สามารถแก้ไขได้");
    }
  }

  const fields = readTextFields(formData);

  const existingAttachmentsRaw = (formData.get("existingAttachments") as string) || "[]";
  let attachments: Attachment[] = JSON.parse(existingAttachmentsRaw);

  const files = formData.getAll("newFiles") as File[];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadAttachment(
      id || "unassigned",
      file.name,
      file.type || "application/octet-stream",
      buffer
    );
    attachments = [...attachments, uploaded];
  }

  await saveProject({
    ...(fields as ProjectInput),
    id,
    attachments,
  });

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect("/projects");
}

export async function deleteProjectAction(id: string): Promise<void> {
  await deleteProject(id);
  revalidatePath("/dashboard");
  revalidatePath("/projects");
}
