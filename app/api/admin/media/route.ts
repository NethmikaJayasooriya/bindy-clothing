import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { checkOrigin, requireAdmin } from "@/lib/server/admin-auth";
import { mutateStore, StoreError } from "@/lib/server/store-repository";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await requireAdmin(); checkOrigin(request);
    if (Number(request.headers.get("content-length")) > 9 * 1024 * 1024) throw new StoreError("Choose an image smaller than 8 MB.", 413);
    const form = await request.formData(); const file = form.get("file");
    if (!(file instanceof File) || file.size > 8 * 1024 * 1024 || file.size === 0) throw new StoreError("Choose a JPG, PNG or WebP image smaller than 8 MB.");
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff ? "jpg" : bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? "png" : bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP" ? "webp" : "";
    if (!ext) throw new StoreError("Only genuine JPG, PNG and WebP image files are supported.");
    const id = randomUUID(); const folder = path.join(process.cwd(), "public", "uploads"); await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(path.join(folder, `${id}.${ext}`), bytes);
    const asset = { id, name: file.name.slice(0, 150), url: `/uploads/${id}.${ext}`, bytes: file.size, createdAt: new Date().toISOString() };
    const { state } = await mutateStore(undefined, `Uploaded ${asset.name}`, store => { store.media.unshift(asset); });
    return NextResponse.json({ asset, state });
  } catch (e) { return NextResponse.json({ error: e instanceof StoreError ? e.message : "Unable to upload this image." }, { status: e instanceof StoreError ? e.status : 500 }); }
}
