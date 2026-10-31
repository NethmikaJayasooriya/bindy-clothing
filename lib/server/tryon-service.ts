import "server-only";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { hasDatabase, productionStorageRequired, readDocument, writeDocument } from "./durable-storage";
import { RequestError } from "./request-security";
import type { StudioPiece } from "@/lib/styleStudio";
import { TRYON_VERSION, TRYON_MODEL, TRYON_SEED, TRYON_BASE_MODEL, safePreviewUrl } from "@/lib/tryon-policy";
import references from "@/data/tryon-sources.json";
import prepared from "@/data/tryon-prepared.json";

type Source = { catalogImage: string; file: string; instruction?: string };
type Job = { key: string; topId: string; bottomId: string; state: "starting" | "processing" | "finishing" | "ready" | "failed" | "paused"; createdAt: number; finishingAt?: number; statusUrl?: string; responseUrl?: string; url?: string };
export type TryOnControl = { enabled: boolean; renderLimit: number; used: number; dailyLimit: number; day: string; dailyUsed: number };
const defaults: TryOnControl = { enabled: false, renderLimit: 0, used: 0, dailyLimit: 25, day: "", dailyUsed: 0 };
const localQueue = new Map<string, Promise<unknown>>();
const digest = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");
const folder = () => path.resolve(process.env.BINDY_DATA_DIR || ".store", "tryon");
class InvalidPreview extends Error {}

async function read<T>(key: string): Promise<{ value: T; revision: number } | null> {
  if (hasDatabase()) return readDocument<T>(key);
  if (productionStorageRequired()) throw new RequestError("The fitting room is temporarily unavailable.", 503);
  try { return JSON.parse(await fs.readFile(path.join(folder(), `${digest(key)}.json`), "utf8")); }
  catch (e) { if ((e as NodeJS.ErrnoException).code === "ENOENT") return null; throw e; }
}
async function write(key: string, value: unknown, expected: number) {
  if (hasDatabase()) return writeDocument(key, value, expected);
  const before = localQueue.get(key) || Promise.resolve();
  const task = before.then(async () => {
    if (((await read(key))?.revision ?? 0) !== expected) return false;
    await fs.mkdir(folder(), { recursive: true });
    const file = path.join(folder(), `${digest(key)}.json`), temp = `${file}.tmp`;
    await fs.writeFile(temp, JSON.stringify({ value, revision: expected + 1 }));
    await fs.rename(temp, file); return true;
  });
  localQueue.set(key, task.catch(() => {}));
  return task;
}
export async function getTryOnControl() { return { ...defaults, ...(await read<TryOnControl>("tryon:control"))?.value }; }
export async function setTryOnControl(input: { enabled: boolean; renderLimit: number; dailyLimit: number }) {
  if (typeof input.enabled !== "boolean" || !Number.isInteger(input.renderLimit) || input.renderLimit < 0 || input.renderLimit > 10000 || !Number.isInteger(input.dailyLimit) || input.dailyLimit < 1 || input.dailyLimit > 200) throw new RequestError("Enter valid render limits.");
  for (let n = 0; n < 5; n++) {
    const old = await read<TryOnControl>("tryon:control"), current = { ...defaults, ...old?.value };
    if (input.renderLimit < current.used) throw new RequestError("The total limit cannot be below already used renders.");
    const next = { ...current, ...input };
    if (await write("tryon:control", next, old?.revision ?? 0)) return next;
  }
  throw new RequestError("The fitting room changed. Please reload and try again.", 409);
}
async function reserveRender() {
  for (let n = 0; n < 8; n++) {
    const row = await read<TryOnControl>("tryon:control"), control = { ...defaults, ...row?.value };
    const day = new Date().toISOString().slice(0, 10), dailyUsed = control.day === day ? control.dailyUsed : 0;
    if (!control.enabled || control.used >= control.renderLimit || dailyUsed >= control.dailyLimit) return false;
    if (await write("tryon:control", { ...control, day, used: control.used + 1, dailyUsed: dailyUsed + 1 }, row?.revision ?? 0)) return true;
  }
  return false;
}

async function bytesFor(src: string) {
  if (src.startsWith("/") && !src.startsWith("//") && !src.includes("..") && /^\/(images|uploads)\//.test(src)) {
    if (src === TRYON_BASE_MODEL) return fs.readFile(path.join(process.cwd(), "public/images/style-studio/bindy-fit-model.png"));
    if (/^\/images\/tryon-v3\/[a-f0-9]{64}\.webp$/.test(src)) return fs.readFile(path.join(process.cwd(), "public/images/tryon-v3", path.basename(src)));
    // This development-only branch is removed from production bundles. An
    // unconstrained filesystem read here would trace the entire public gallery
    // into each Vercel function. New published photos are fetched from our store.
    if (process.env.NODE_ENV !== "production") return fs.readFile(path.join(process.cwd(), "public", src));
    const response = await fetch(new URL(src, process.env.SITE_URL || "https://bindyclothing.com.au"), { signal: AbortSignal.timeout(15000), redirect: "error" });
    if (!response.ok) throw new Error("Source image unavailable"); return imageBytes(response);
  }
  const url = new URL(src), allowed = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!allowed || url.origin !== new URL(allowed).origin || !url.pathname.startsWith("/storage/v1/object/public/bindy-media/")) throw new RequestError("This garment needs a supported product photo.", 422);
  const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: "error" });
  if (!response.ok) throw new Error("Source image unavailable");
  return imageBytes(response);
}
async function imageBytes(response: Response) {
  if (Number(response.headers.get("content-length")) > 16000000) throw new Error("Image too large");
  const reader = response.body!.getReader(), chunks: Uint8Array[] = []; let size = 0;
  try { while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 16000000) { await reader.cancel(); throw new Error("Image too large"); } chunks.push(value); } }
  finally { reader.releaseLock(); }
  return Buffer.concat(chunks);
}
async function garment(piece: StudioPiece) {
  const source = (references as Record<string, Source>)[piece.id];
  // A new admin photo invalidates the curated reference instead of dressing an old garment.
  const bytes = source?.catalogImage === piece.image ? await fs.readFile(path.join(process.cwd(), "data", "tryon-references", path.basename(source.file))) : await bytesFor(piece.image);
  const clean = await sharp(bytes, { failOn: "warning", limitInputPixels: 30000000 }).rotate().resize({ width: 1400, height: 1800, fit: "inside", withoutEnlargement: true }).png().toBuffer();
  // Hash original reference bytes: PNG encoder compression can differ between
  // Windows preparation and Linux deployment without changing the garment.
  return { hash: digest(bytes), data: `data:image/png;base64,${clean.toString("base64")}`, instruction: source?.catalogImage === piece.image ? source.instruction ?? "" : "" };
}
export async function outfitInput(top: StudioPiece, bottom: StudioPiece) {
  const [upper, lower, model] = await Promise.all([garment(top), garment(bottom), bytesFor(TRYON_BASE_MODEL)]);
  const key = digest(JSON.stringify([TRYON_VERSION, TRYON_MODEL, TRYON_SEED, top.id, bottom.id, top.name, bottom.name, top.image, bottom.image, upper.hash, lower.hash, digest(model), upper.instruction, lower.instruction]));
  return { key, payload: {
    person_image_url: `data:image/png;base64,${model.toString("base64")}`,
    garment_image_urls: [upper.data, lower.data],
    instruction: `Dress the original person in ONLY the upper garment from reference 1 (${top.name}) and ONLY the lower garment from reference 2 (${bottom.name}), worn together. Ignore the other clothes, people and mannequins in the garment references. Transfer each selected garment faithfully: preserve its original silhouette, neckline, straps or sleeves, hem, length, waistband, closures, fabric texture, color, pattern and print. Preserve any peplum and ruffles; do not crop, tuck, fuse or redesign the upper garment. Keep the original person's identity, face, body proportions, pose, hands, feet and neutral studio background unchanged. Show the complete outfit head to toe.${upper.instruction ? ` ${upper.instruction}` : ""}${lower.instruction ? ` ${lower.instruction}` : ""}`,
    seed: TRYON_SEED,
  } };
}
function queueUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try { const u = new URL(value); return u.origin === "https://queue.fal.run" && u.pathname.startsWith("/bria/fibo-edit-1.5/"); } catch { return false; }
}
async function falRequest(url: string, body?: unknown) {
  const response = await fetch(url, { method: body ? "POST" : "GET", headers: { Authorization: `Key ${process.env.FAL_KEY}`, "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000), redirect: "error" });
  if (!response.ok) {
    if ([400, 401, 402, 403, 404, 422].includes(response.status)) throw new InvalidPreview(`Fitting service HTTP ${response.status}`);
    throw new Error(`Fitting service HTTP ${response.status}`);
  }
  return response.json();
}
export async function validateOutput(bytes: Buffer) {
  const image = sharp(bytes, { failOn: "warning", limitInputPixels: 30000000 });
  const meta = await image.metadata();
  if (!meta.width || !meta.height || meta.width < 600 || meta.height < 800 || meta.height <= meta.width) throw new Error("Invalid fitting-room image dimensions");
  return image.rotate().webp({ quality: 94 }).toBuffer();
}
async function saveOutput(key: string, bytes: Buffer) {
  let clean: Buffer;
  try { clean = await validateOutput(bytes); } catch { throw new InvalidPreview("The fitting service returned an invalid image"); }
  const client = getSupabaseAdmin();
  if (client) {
    const name = `tryon/${TRYON_VERSION}/${key}.webp`;
    const { error } = await client.storage.from("bindy-media").upload(name, clean, { contentType: "image/webp", cacheControl: "31536000", upsert: true });
    if (error) throw new Error("Could not save fitting preview");
    return client.storage.from("bindy-media").getPublicUrl(name).data.publicUrl;
  }
  if (productionStorageRequired()) throw new Error("Durable media storage unavailable");
  const dir = path.join(process.cwd(), "public", "images", "tryon-v3");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${key}.webp`), clean);
  return `/images/tryon-v3/${key}.webp`;
}
const preparedChecked = new Set<string>();
async function preparedUrl(key: string) {
  const item = (prepared as Record<string, { url: string; sha256: string }>)[key];
  if (!item || !safePreviewUrl(item.url) || !item.url.startsWith("/")) return undefined;
  if (!preparedChecked.has(key)) {
    try { const bytes = await bytesFor(item.url); if (digest(bytes) !== item.sha256) return undefined; await validateOutput(bytes); preparedChecked.add(key); }
    catch { return undefined; }
  }
  return item.url;
}
export async function getTryOn(top: StudioPiece, bottom: StudioPiece, retry = false) {
  const input = await outfitInput(top, bottom), documentKey = `tryon:${TRYON_VERSION}:${input.key}`;
  const identity = { topId: top.id, bottomId: bottom.id, pairKey: input.key };
  const available = await preparedUrl(input.key);
  if (available) return { ...identity, state: "ready" as const, url: available, cached: true };
  let row = await read<Job>(documentKey);
  if (!row || row.value.state === "paused" || (retry && row.value.state === "failed" && Date.now() - row.value.createdAt > 60000)) {
    const control = await getTryOnControl();
    if (!control.enabled || control.used >= control.renderLimit || !process.env.FAL_KEY) return { ...identity, state: "unavailable" as const, error: "New outfit previews are paused. Your selected garments are shown separately." };
    const job: Job = { key: input.key, topId: top.id, bottomId: bottom.id, state: "starting", createdAt: Date.now() };
    if (!await write(documentKey, job, row?.revision ?? 0)) return { ...identity, state: "processing" as const, retryAfter: 3 };
    row = (await read<Job>(documentKey))!;
    try {
      if (!await reserveRender()) {
        await write(documentKey, { ...job, state: "paused" }, row.revision);
        return { ...identity, state: "unavailable" as const, error: "New outfit previews are paused. Your selected garments are shown separately." };
      }
      const result = await falRequest(`https://queue.fal.run/${TRYON_MODEL}`, input.payload);
      if (!queueUrl(result.status_url) || !queueUrl(result.response_url)) throw new Error("Invalid fitting-service response");
      const next: Job = { ...job, state: "processing", statusUrl: result.status_url, responseUrl: result.response_url };
      await write(documentKey, next, row.revision);
      return { ...identity, state: "processing" as const, retryAfter: 3 };
    } catch (e) {
      console.warn("[tryon] Render not started:", (e as Error).message);
      await write(documentKey, { ...job, state: "failed" }, row.revision);
    }
  } else if (row.value.state === "ready" && safePreviewUrl(row.value.url)) {
    return { ...identity, state: "ready" as const, url: row.value.url, cached: true };
  } else if (row.value.state === "processing" && queueUrl(row.value.statusUrl) && queueUrl(row.value.responseUrl)) {
    try {
      const status = await falRequest(row.value.statusUrl);
      if (status.status === "COMPLETED") {
        if (!await write(documentKey, { ...row.value, state: "finishing", finishingAt: Date.now() }, row.revision)) return { ...identity, state: "processing" as const, retryAfter: 3 };
        const result = await falRequest(row.value.responseUrl), imageUrl = result.image?.url || result.images?.[0]?.url;
        const u = new URL(imageUrl);
        if (u.protocol !== "https:" || !(/(^|\.)fal\.media$/.test(u.hostname) || u.hostname === "storage.googleapis.com")) throw new InvalidPreview("Unsupported output host");
        const image = await fetch(u, { signal: AbortSignal.timeout(20000), redirect: "error" });
        if (!image.ok) throw new Error("Output image unavailable");
        const url = await saveOutput(input.key, await imageBytes(image));
        if (!safePreviewUrl(url)) throw new Error("Invalid preview location");
        if (!await write(documentKey, { ...row.value, state: "ready", url }, row.revision + 1)) throw new Error("Preview could not be confirmed");
        return { ...identity, state: "ready" as const, url, cached: false };
      }
      if ((status.status === "IN_QUEUE" || status.status === "IN_PROGRESS") && Date.now() - row.value.createdAt < 240000) return { ...identity, state: "processing" as const, retryAfter: 3 };
      throw new InvalidPreview("Fitting service did not complete this preview");
    } catch (e) {
      console.warn("[tryon] Preview unavailable:", (e as Error).message);
      const latest = await read<Job>(documentKey);
      if (latest?.value.state === "ready" && safePreviewUrl(latest.value.url)) return { ...identity, state: "ready" as const, url: latest.value.url, cached: true };
      if (latest && !(e instanceof InvalidPreview) && Date.now() - latest.value.createdAt < 240000) {
        // Retry fetching/saving the same paid result, never a second paid submission.
        if (latest.value.state === "finishing") await write(documentKey, { ...latest.value, state: "processing" }, latest.revision);
        return { ...identity, state: "processing" as const, retryAfter: 3 };
      }
      if (latest && latest.value.state !== "ready") await write(documentKey, { ...latest.value, state: "failed" }, latest.revision);
    }
  } else if ((row.value.state === "starting" || row.value.state === "finishing") && Date.now() - row.value.createdAt < 240000) {
    if (row.value.state === "finishing" && Date.now() - (row.value.finishingAt ?? row.value.createdAt) > 65000) {
      // Recover a terminated worker by fetching the same queued result again.
      await write(documentKey, { ...row.value, state: "processing" }, row.revision);
    }
    return { ...identity, state: "processing" as const, retryAfter: 3 };
  }
  if (row && (row.value.state === "starting" || row.value.state === "finishing")) await write(documentKey, { ...row.value, state: "failed" }, row.revision);
  return { ...identity, state: "unavailable" as const, error: "This outfit preview is unavailable. Your selected garments are shown separately." };
}
