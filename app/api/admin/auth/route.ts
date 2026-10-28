import { NextResponse } from "next/server";
import { authStatus, checkOrigin, signIn, setupOwner, signOut, changePassword, COOKIE } from "@/lib/server/admin-auth";
import { StoreError } from "@/lib/server/store-repository";
import { object, text } from "@/lib/server/store-actions";
import { limitedJson,rateLimit,requestIdentity } from "@/lib/server/request-security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {try {return NextResponse.json(await authStatus(), { headers: { "Cache-Control": "no-store" } });}catch{return NextResponse.json({error:"Admin database setup is required."},{status:503});} }
export async function POST(request: Request) {
  try {
    checkOrigin(request); await rateLimit("admin-auth",requestIdentity(request),15,900); const v = object(await limitedJson(request,4000)); const op = text(v.action, 20); let token = "";
    if (op === "setup") token = await setupOwner({ name: text(v.name), email: text(v.email), password: text(v.password, 128), token: text(v.token) }, request);
    else if (op === "login") token = await signIn(text(v.email), text(v.password, 128), request.headers.get("x-forwarded-for")?.split(",")[0] || "local");
    else if (op === "logout") await signOut();
    else if (op === "password") await changePassword(text(v.current, 128), text(v.password, 128));
    else throw new StoreError("Invalid sign-in action.");
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE, token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: token ? 12 * 3600 : 0 }); return response;
  } catch (e) { return NextResponse.json({ error: e instanceof StoreError ? e.message : "Unable to sign in. Please try again." }, { status: e instanceof StoreError ? e.status : 500 }); }
}
