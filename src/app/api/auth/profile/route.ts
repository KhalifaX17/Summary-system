import { NextResponse } from "next/server";
import { getSessionUsername, setSession } from "@/lib/auth";
import { getUserProfile, updateUserProfile } from "@/lib/users";

export async function GET() {
  const username = await getSessionUsername();
  if (!username) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  const profile = await getUserProfile(username);
  return profile ? NextResponse.json(profile) : NextResponse.json({ error: "ไม่พบบัญชีผู้ใช้" }, { status: 404 });
}

export async function PATCH(request: Request) {
  try {
    const username = await getSessionUsername();
    if (!username) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    const body = await request.json() as { username?: string; displayName?: string; password?: string; avatar?: string };
    if (!body.username?.trim()) return NextResponse.json({ error: "กรุณาระบุชื่อผู้ใช้" }, { status: 400 });
    if (!body.displayName?.trim()) return NextResponse.json({ error: "กรุณาระบุชื่อที่แสดง" }, { status: 400 });
    const configuredUsername = process.env.APP_LOGIN_EMAIL?.trim();
    if (configuredUsername && body.username.trim().toLowerCase() !== configuredUsername.toLowerCase()) {
      return NextResponse.json({ error: "ชื่อผู้ใช้ถูกกำหนดจาก Environment Variables ไม่สามารถแก้จากหน้านี้ได้" }, { status: 400 });
    }
    if (body.password) {
      return NextResponse.json({ error: "กรุณาเปลี่ยนรหัสผ่านจาก APP_LOGIN_PASSWORD ใน Vercel" }, { status: 400 });
    }
    const profile = await updateUserProfile(username, {
      username: body.username,
      displayName: body.displayName,
      password: body.password,
      avatar: body.avatar,
    });
    await setSession(profile.username);
    return NextResponse.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : "บันทึกข้อมูลไม่สำเร็จ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
