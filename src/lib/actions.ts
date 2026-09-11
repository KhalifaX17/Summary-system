"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveProject, deleteProject, getProject } from "./sheets";
import { canEditProject } from "./projectRules";
import { ProjectInput } from "./types";

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

  await saveProject({
    ...(fields as ProjectInput),
    id,
  });

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect(id ? "/projects?toast=updated" : "/projects?toast=created");
}

export async function deleteProjectAction(id: string): Promise<void> {
  await deleteProject(id);
  revalidatePath("/dashboard");
  revalidatePath("/projects");
}
