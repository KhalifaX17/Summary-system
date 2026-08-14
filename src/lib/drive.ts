import { Readable } from "stream";
import { getDriveClient, getDriveFolderId } from "./googleClients";
import { isGoogleConfigured } from "./config";
import { mockUploadAttachment } from "./mockData";
import { Attachment } from "./types";

const projectFolderCache = new Map<string, string>();

async function getOrCreateProjectFolder(projectId: string): Promise<string> {
  const cached = projectFolderCache.get(projectId);
  if (cached) return cached;

  const drive = getDriveClient();
  const rootId = getDriveFolderId();

  const list = await drive.files.list({
    q: `'${rootId}' in parents and name = '${projectId}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
  });

  let folderId = list.data.files?.[0]?.id;
  if (!folderId) {
    const created = await drive.files.create({
      requestBody: {
        name: projectId,
        mimeType: "application/vnd.google-apps.folder",
        parents: [rootId],
      },
      fields: "id",
    });
    folderId = created.data.id ?? undefined;
  }

  if (!folderId) throw new Error("สร้างโฟลเดอร์สำหรับไฟล์แนบไม่สำเร็จ");
  projectFolderCache.set(projectId, folderId);
  return folderId;
}

export async function uploadAttachment(
  projectId: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer
): Promise<Attachment> {
  if (!isGoogleConfigured()) return mockUploadAttachment(fileName);

  const drive = getDriveClient();
  const folderId = await getOrCreateProjectFolder(projectId || "unassigned");

  const file = await drive.files.create({
    requestBody: { name: fileName, parents: [folderId] },
    media: { mimeType, body: Readable.from(buffer) },
    fields: "id, webViewLink",
  });

  const fileId = file.data.id!;
  const shareDomain = process.env.GOOGLE_WORKSPACE_DOMAIN;
  if (shareDomain) {
    try {
      await drive.permissions.create({
        fileId,
        requestBody: { role: "reader", type: "domain", domain: shareDomain },
      });
    } catch {
      // ถ้านโยบายโดเมนไม่อนุญาตให้แชร์ ไฟล์จะยังเข้าถึงได้จากผู้ที่มีสิทธิ์อยู่แล้ว
    }
  }

  return {
    name: fileName,
    url: file.data.webViewLink ?? `https://drive.google.com/file/d/${fileId}/view`,
  };
}
