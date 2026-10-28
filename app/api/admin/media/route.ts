import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { checkOrigin, requireAdmin } from "@/lib/server/admin-auth";
import { mutateStore, StoreError } from "@/lib/server/store-repository";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { productionStorageRequired } from "@/lib/server/durable-storage";
import { limitedBytes } from "@/lib/server/request-security";
import sharp from "sharp";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await requireAdmin(); checkOrigin(request);
    if (Number(request.headers.get("content-length")) > 4.25 * 1024 * 1024) throw new StoreError("Choose an image smaller than 4 MB.", 413);
    const body = await limitedBytes(request,4.25*1024*1024);
    const form = await new Response(new Uint8Array(body),{headers:{"Content-Type":request.headers.get("content-type")??""}}).formData(); const file = form.get("file");
    if (!(file instanceof File) || file.size > 4 * 1024 * 1024 || file.size === 0) throw new StoreError("Choose a JPG, PNG or WebP image smaller than 4 MB.");
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff ? "jpg" : bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? "png" : bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP" ? "webp" : "";
    if (!ext) throw new StoreError("Only genuine JPG, PNG and WebP image files are supported.");
    const optimized=await sharp(bytes,{limitInputPixels:40000000}).rotate().resize({width:2400,height:3000,fit:"inside",withoutEnlargement:true}).webp({quality:85}).toBuffer();
    const id = randomUUID(); const name=`${id}.webp`;let url=`/uploads/${name}`;
    const client=getSupabaseAdmin();
    if(client){const {error}=await client.storage.from("bindy-media").upload(name,optimized,{contentType:"image/webp",cacheControl:"31536000",upsert:false});if(error)throw new StoreError("Media storage could not save this image.",503);url=client.storage.from("bindy-media").getPublicUrl(name).data.publicUrl;}
    else{if(productionStorageRequired())throw new StoreError("Production media storage is not configured.",503);const folder=path.join(process.cwd(),"public","uploads");await fs.mkdir(folder,{recursive:true});await fs.writeFile(path.join(folder,name),optimized);}
    const asset = { id, name: file.name.slice(0, 150), url, bytes: optimized.length, createdAt: new Date().toISOString() };
    const { state } = await mutateStore(undefined, `Uploaded ${asset.name}`, store => { store.media.unshift(asset); });
    return NextResponse.json({ asset, state });
  } catch (e) { return NextResponse.json({ error: e instanceof StoreError ? e.message : "Unable to upload this image." }, { status: e instanceof StoreError ? e.status : 500 }); }
}
