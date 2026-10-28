import "server-only";
import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { productionStorageRequired } from "./durable-storage";

export class RequestError extends Error { constructor(message: string, public status = 400) { super(message); } }
export async function limitedBytes(request: Request, maxBytes = 15000): Promise<Buffer> {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new RequestError("This request is too large.", 413);
  if (!request.body) return Buffer.alloc(0);
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  try { while (true) { const {done,value} = await reader.read(); if (done) break; size += value.length; if (size > maxBytes) { await reader.cancel(); throw new RequestError("This request is too large.",413); } chunks.push(value); } }
  finally { reader.releaseLock(); }
  return Buffer.concat(chunks);
}
export async function limitedText(request:Request,maxBytes=15000){return (await limitedBytes(request,maxBytes)).toString("utf8");}
export async function limitedJson(request: Request, maxBytes = 15000): Promise<unknown> {
  try { return JSON.parse(await limitedText(request,maxBytes)); }
  catch(e) { if(e instanceof RequestError) throw e; throw new RequestError("Enter valid request details."); }
}
const limits = new Map<string,{hits:number;until:number}>();
export async function rateLimit(scope: string, identity: string, max = 15, seconds = 600) {
  const key = createHash("sha256").update(`${scope}:${identity}`).digest("hex");
  const client = getSupabaseAdmin();
  if (client) {
    const {data,error} = await client.schema("public").rpc("bindy_rate_limit",{limit_key:key,max_hits:max,window_seconds:seconds});
    if(error) throw new RequestError("This service is temporarily unavailable.",503);
    if(data !== true) throw new RequestError("Please wait before trying again.",429);
    return;
  }
  if(productionStorageRequired()) throw new RequestError("This service is temporarily unavailable.",503);
  const old=limits.get(key); const entry=old&&old.until>Date.now()?old:{hits:0,until:Date.now()+seconds*1000};
  entry.hits++; limits.set(key,entry);
  if(limits.size>5000) for(const [k,v] of limits) if(v.until<Date.now()) limits.delete(k);
  if(entry.hits>max) throw new RequestError("Please wait before trying again.",429);
}
export const requestIdentity = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
