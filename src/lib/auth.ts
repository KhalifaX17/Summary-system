import { cookies } from "next/headers";
import { isGoogleSheetsConfigured } from "./config";

export const SESSION_COOKIE = "summary_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getAuthConfig() {
  return {
    secret: process.env.APP_SESSION_SECRET ?? "",
  };
}

export function isAuthConfigured(): boolean {
  return Boolean(getAuthConfig().secret && isGoogleSheetsConfigured());
}

function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

function fromBase64Url(value: string): Uint8Array {
  return new Uint8Array(Buffer.from(value, "base64url"));
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toBase64Url(new Uint8Array(signature));
}

export async function createSession(username: string): Promise<string> {
  const secret = getAuthConfig().secret;
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({
    username,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
  })));
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token || !isAuthConfigured()) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await sign(payload, getAuthConfig().secret);
  if (signature.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  if (mismatch !== 0) return false;

  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as {
      username?: string;
      expiresAt?: number;
    };
    return Boolean(data.username && data.expiresAt && data.expiresAt > Date.now());
  } catch {
    return false;
  }
}

export async function setSession(username: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSession(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export async function getSessionUsername(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySession(token))) return null;
  const [payload] = token.split(".");
  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { username?: string };
    return data.username ?? null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
