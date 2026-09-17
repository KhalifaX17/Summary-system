import { NextResponse } from "next/server";
import { setSession } from "@/lib/auth";
import { authenticateUser } from "@/lib/users";

export async function POST(request: Request) {
  const body = await request.json() as { email?: string; password?: string };
  const user = await authenticateUser(body.email ?? "", body.password ?? "");
  if (!user) {
    return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }
  await setSession(user.username);
  return NextResponse.json({ ok: true });
}
