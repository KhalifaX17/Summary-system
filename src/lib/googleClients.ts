import { google } from "googleapis";

let authClient: InstanceType<typeof google.auth.JWT> | undefined;
let sheetsClient: ReturnType<typeof google.sheets> | undefined;
let driveClient: ReturnType<typeof google.drive> | undefined;

function getCredentials() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error(
      "ยังไม่ได้ตั้งค่า GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY ใน .env.local"
    );
  }
  return { email, privateKey: rawKey.replace(/\\n/g, "\n") };
}

function getAuth() {
  if (authClient) return authClient;
  const { email, privateKey } = getCredentials();
  authClient = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });
  return authClient;
}

export function getSheetsClient() {
  sheetsClient ??= google.sheets({ version: "v4", auth: getAuth() });
  return sheetsClient;
}

export function getDriveClient() {
  driveClient ??= google.drive({ version: "v3", auth: getAuth() });
  return driveClient;
}

export function getSpreadsheetId() {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("ยังไม่ได้ตั้งค่า GOOGLE_SHEET_ID ใน .env.local");
  return id;
}

export function getDriveFolderId() {
  const id = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!id) throw new Error("ยังไม่ได้ตั้งค่า GOOGLE_DRIVE_FOLDER_ID ใน .env.local");
  return id;
}
