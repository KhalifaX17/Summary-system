import { getSheetsClient, getSpreadsheetId } from "./googleClients";
import { isGoogleConfigured } from "./config";
import {
  mockDeleteProject,
  mockGetProject,
  mockGetProjects,
  mockSaveProject,
} from "./mockData";
import { computeDashboardStats } from "./stats";
import {
  Attachment,
  DashboardStats,
  Project,
  ProjectInput,
  SHEET_COLUMNS,
} from "./types";

const SHEET_NAME = "Projects";
const RANGE = `${SHEET_NAME}!A:Z`;

let sheetReadyPromise: Promise<number> | null = null;

// สร้างชีต "Projects" พร้อมหัวตารางถ้ายังไม่มี — คืนค่า numeric sheetId ของแท็บนั้น
async function ensureSheet(): Promise<number> {
  if (sheetReadyPromise) return sheetReadyPromise;

  const promise = (async () => {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const existing = meta.data.sheets?.find(
      (s) => s.properties?.title === SHEET_NAME
    );

    if (existing?.properties?.sheetId != null) {
      return existing.properties.sheetId;
    }

    const addResult = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
      },
    });
    const newSheetId =
      addResult.data.replies?.[0].addSheet?.properties?.sheetId;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_COLUMNS as string[]] },
    });

    return newSheetId!;
  })().catch((err) => {
    sheetReadyPromise = null;
    throw err;
  });

  sheetReadyPromise = promise;
  return promise;
}

function rowToProject(row: string[]): Project {
  const obj: Record<string, string> = {};
  SHEET_COLUMNS.forEach((key, i) => {
    obj[key] = row[i] ?? "";
  });
  return {
    ...obj,
    budgetAllocated: Number(obj.budgetAllocated) || 0,
    budgetUsed: Number(obj.budgetUsed) || 0,
    participantActual: Number(obj.participantActual) || 0,
    attachments: parseAttachments(obj.attachments),
  } as unknown as Project;
}

function parseAttachments(raw: string): Attachment[] {
  if (!raw) return [];
  return raw
    .split("|")
    .filter(Boolean)
    .map((pair) => {
      const idx = pair.indexOf("::");
      return idx === -1
        ? { name: pair, url: pair }
        : { name: pair.slice(0, idx), url: pair.slice(idx + 2) };
    });
}

function serializeAttachments(list: Attachment[] | undefined): string {
  return (list ?? []).map((a) => `${a.name}::${a.url}`).join("|");
}

function projectToRow(p: Record<string, unknown>): (string | number)[] {
  return SHEET_COLUMNS.map((key) => {
    if (key === "attachments") {
      return serializeAttachments(p.attachments as Attachment[]);
    }
    const v = p[key];
    return v === undefined || v === null ? "" : (v as string | number);
  });
}

async function readAllRows(): Promise<string[][]> {
  await ensureSheet();
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: RANGE,
  });
  const values = res.data.values ?? [];
  return values.slice(1); // ตัดหัวตาราง
}

export async function getProjects(): Promise<Project[]> {
  if (!isGoogleConfigured()) return mockGetProjects();
  const rows = await readAllRows();
  return rows
    .filter((r) => r[0])
    .map(rowToProject)
    .reverse(); // ใหม่สุดก่อน
}

export async function getProject(id: string): Promise<Project | null> {
  if (!isGoogleConfigured()) return mockGetProject(id);
  const rows = await readAllRows();
  const row = rows.find((r) => r[0] === id);
  return row ? rowToProject(row) : null;
}

function generateId(existingIds: string[]): string {
  let maxNum = 0;
  existingIds.forEach((id) => {
    const m = id.match(/(\d+)$/);
    if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
  });
  const yearBE = new Date().getFullYear() + 543;
  return `PRJ-${yearBE}-${String(maxNum + 1).padStart(3, "0")}`;
}

export async function saveProject(
  input: ProjectInput & { id?: string }
): Promise<Project> {
  if (!input.projectName?.trim()) {
    throw new Error("กรุณาระบุชื่อโครงการ");
  }

  if (!isGoogleConfigured()) return mockSaveProject(input);

  await ensureSheet();
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const rows = await readAllRows();
  const now = new Date().toISOString();

  const existingIndex = input.id
    ? rows.findIndex((r) => r[0] === input.id)
    : -1;

  if (existingIndex === -1) {
    const id = generateId(rows.map((r) => r[0]));
    const row = projectToRow({ ...input, id, createdAt: now, updatedAt: now });
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: RANGE,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
    return rowToProject(row.map(String));
  }

  const createdAt = rows[existingIndex][SHEET_COLUMNS.indexOf("createdAt")] || now;
  const row = projectToRow({ ...input, id: input.id, createdAt, updatedAt: now });
  const sheetRowNumber = existingIndex + 2; // +1 header, +1 1-indexed
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!A${sheetRowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });
  return rowToProject(row.map(String));
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!isGoogleConfigured()) return mockDeleteProject(id);

  const sheetId = await ensureSheet();
  const sheets = getSheetsClient();
  const rows = await readAllRows();
  const index = rows.findIndex((r) => r[0] === id);
  if (index === -1) return false;

  const sheetRowIndex = index + 1; // +1 for header row, 0-indexed for API
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: getSpreadsheetId(),
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: sheetRowIndex,
              endIndex: sheetRowIndex + 1,
            },
          },
        },
      ],
    },
  });
  return true;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const projects = await getProjects();
  return computeDashboardStats(projects);
}
