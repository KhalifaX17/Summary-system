import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { getSheetsClient, getSpreadsheetId } from "./googleClients";

const SHEET_NAME = "Users";
const COLUMNS = ["username", "passwordHash", "displayName", "updatedAt", "avatar"];
const USERS_CACHE_TTL_MS = 5 * 60 * 1000;
let usersSheetReady: Promise<void> | undefined;
let usersCache: { rows: string[][]; expiresAt: number } | undefined;
let usersRead: Promise<string[][]> | undefined;

export interface UserProfile {
  username: string;
  displayName: string;
  avatar?: string;
}

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

function verifyEnvironmentPassword(password: string, expected: string): boolean {
  const actualBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function authenticateEnvironmentUser(username: string, password: string): UserProfile | null {
  const configuredUsername = process.env.APP_LOGIN_EMAIL?.trim();
  const configuredPassword = process.env.APP_LOGIN_PASSWORD;
  if (!configuredUsername || !configuredPassword) return null;
  if (username.trim().toLowerCase() !== configuredUsername.toLowerCase()) return null;
  if (!verifyEnvironmentPassword(password, configuredPassword)) return null;
  return { username: configuredUsername, displayName: configuredUsername };
}

async function ensureUsersSheet() {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existing = meta.data.sheets?.find((sheet) => sheet.properties?.title === SHEET_NAME);
  if (existing?.properties?.sheetId != null) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1:E1`,
      valueInputOption: "RAW",
      requestBody: { values: [COLUMNS] },
    });
    return;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] },
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:D1`,
    valueInputOption: "RAW",
    requestBody: { values: [COLUMNS] },
  });
}

function ensureUsersSheetOnce() {
  usersSheetReady ??= ensureUsersSheet().catch((error) => {
    usersSheetReady = undefined;
    throw error;
  });
  return usersSheetReady;
}

async function readUsers(): Promise<string[][]> {
  await ensureUsersSheetOnce();
  const response = await getSheetsClient().spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `${SHEET_NAME}!A2:E`,
  });
  return response.data.values ?? [];
}

async function getUsers(): Promise<string[][]> {
  if (usersCache && usersCache.expiresAt > Date.now()) return usersCache.rows;
  usersRead ??= readUsers().then((rows) => {
    usersCache = { rows, expiresAt: Date.now() + USERS_CACHE_TTL_MS };
    usersRead = undefined;
    return rows;
  }).catch((error) => {
    usersRead = undefined;
    throw error;
  });
  return usersRead;
}

function invalidateUsersCache() {
  usersCache = undefined;
}

async function bootstrapUser(rows: string[][]): Promise<string[][]> {
  if (rows.some((row) => row[0])) return rows;
  const username = process.env.APP_LOGIN_EMAIL?.trim();
  const password = process.env.APP_LOGIN_PASSWORD;
  if (!username || !password) return rows;
  const row = [username, hashPassword(password), username, new Date().toISOString(), ""];
  await getSheetsClient().spreadsheets.values.append({
    spreadsheetId: getSpreadsheetId(),
    range: `${SHEET_NAME}!A:E`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
  usersCache = { rows: [row], expiresAt: Date.now() + USERS_CACHE_TTL_MS };
  return [row];
}

export async function authenticateUser(username: string, password: string): Promise<UserProfile | null> {
  const rows = await bootstrapUser(await getUsers());
  const row = rows.find((candidate) => candidate[0]?.toLowerCase() === username.trim().toLowerCase());
  if (!row || !verifyPassword(password, row[1] ?? "")) return null;
  return { username: row[0], displayName: row[2] || row[0], avatar: row[4] || undefined };
}

export async function getUserProfile(username: string): Promise<UserProfile | null> {
  const rows = await bootstrapUser(await getUsers());
  const row = rows.find((candidate) => candidate[0]?.toLowerCase() === username.toLowerCase());
  return row ? { username: row[0], displayName: row[2] || row[0], avatar: row[4] || undefined } : null;
}

export async function updateUserProfile(
  username: string,
  input: { username: string; displayName: string; password?: string; avatar?: string }
): Promise<UserProfile> {
  const rows = await bootstrapUser(await getUsers());
  const index = rows.findIndex((row) => row[0]?.toLowerCase() === username.toLowerCase());
  if (index === -1) throw new Error("ไม่พบบัญชีผู้ใช้");
  const nextUsername = input.username.trim();
  if (!nextUsername) throw new Error("กรุณาระบุชื่อผู้ใช้");
  const duplicate = rows.some(
    (row, rowIndex) =>
      rowIndex !== index && row[0]?.toLowerCase() === nextUsername.toLowerCase()
  );
  if (duplicate) throw new Error("ชื่อผู้ใช้นี้ถูกใช้งานแล้ว");
  const row = rows[index];
  const updated = [nextUsername, input.password ? hashPassword(input.password) : row[1], input.displayName.trim() || nextUsername, new Date().toISOString(), input.avatar === undefined ? (row[4] || "") : input.avatar];
  await getSheetsClient().spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `${SHEET_NAME}!A${index + 2}:E${index + 2}`,
    valueInputOption: "RAW",
    requestBody: { values: [updated] },
  });
  invalidateUsersCache();
  return { username: updated[0], displayName: updated[2], avatar: updated[4] || undefined };
}
