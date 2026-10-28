import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { scryptSync, timingSafeEqual, randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { STORE_DIR, StoreError } from "./store-repository";
import { hasDatabase, productionStorageRequired, readDocument, writeDocument } from "./durable-storage";
import { rateLimit } from "./request-security";

const FILE = path.join(STORE_DIR, "owner.json");
export const COOKIE = "bindy_admin_session";
interface Owner { name: string; email: string; salt: string; passwordHash: string; sessions: { hash: string; expires: number }[]; revision?:number }
let authQueue: Promise<unknown> = Promise.resolve();
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
let memoryOwner: Owner | null = null;
async function readOwner(): Promise<Owner | null> {
  if (hasDatabase()) { const doc=await readDocument<Owner>("owner"); return doc?{...doc.value,revision:doc.revision}:null; }
  if (productionStorageRequired()) throw new StoreError("Admin access requires the production database to be configured.",503);
  try { return JSON.parse(await fs.readFile(FILE, "utf8")); }
  catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return memoryOwner;
    console.warn("[admin-auth] Error reading owner:", e);
    return memoryOwner;
  }
}
async function writeOwner(owner: Owner) {
  if (hasDatabase()) { if(!await writeDocument("owner",owner,owner.revision??0)) throw new StoreError("Your account was updated in another session. Please retry.",409); return; }
  if (productionStorageRequired()) throw new StoreError("Admin access requires durable storage.",503);
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
    const tmp = path.join(STORE_DIR, `owner-${randomBytes(12).toString("hex")}.tmp`);
    await fs.writeFile(tmp, JSON.stringify(owner), { mode: 0o600 });
    await fs.rename(tmp, FILE);
    memoryOwner = owner;
  } catch { throw new StoreError("Your account could not be saved.",503); }
}
function locked<T>(fn: () => Promise<T>): Promise<T> { const task = authQueue.then(fn); authQueue = task.catch(() => {}); return task; }
export async function sessionOwner() {
  const owner = await readOwner(); const token = (await cookies()).get(COOKIE)?.value;
  if (!owner || !token || !owner.sessions.some(s => s.hash === digest(token) && s.expires > Date.now())) return null;
  return { name: owner.name, email: owner.email };
}
export async function requireAdmin() { const owner = await sessionOwner(); if (!owner) throw new StoreError("Please sign in to continue.", 401); return owner; }
export async function authStatus() { const owner = await readOwner(); return { configured: Boolean(owner), owner: await sessionOwner() }; }
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) throw new StoreError("This request must come from your store.", 403);
}
const attempts = new Map<string, { count: number; until: number }>();
export async function signIn(email: string, password: string, key: string) {
  await rateLimit("admin-login",key,5,900);
  return locked(async () => {
    const limit = attempts.get(key);
    if (limit && limit.until > Date.now() && limit.count >= 5) throw new StoreError("Too many attempts. Try again in 15 minutes.", 429);
    const owner = await readOwner();
    const candidate=scryptSync(password,owner?.salt??"bindy-invalid-login",64);
    const valid = owner && timingSafeEqual(candidate,Buffer.from(owner.passwordHash,"hex")) && email.toLowerCase() === owner.email;
    if (!valid) { attempts.set(key, { count: limit && limit.until > Date.now() ? limit.count + 1 : 1, until: Date.now() + 15 * 60000 }); throw new StoreError("The email or password is incorrect.", 401); }
    attempts.delete(key); return issueSession(owner);
  });
}
async function issueSession(owner: Owner) {
  const token = randomBytes(32).toString("hex");
  owner.sessions = owner.sessions.filter(s => s.expires > Date.now()).slice(-4);
  owner.sessions.push({ hash: digest(token), expires: Date.now() + 12 * 3600000 });
  await writeOwner(owner); return token;
}
export async function setupOwner(input: { name: string; email: string; password: string; token?: string }, request: Request) {
  return locked(async () => {
    if (await readOwner()) throw new StoreError("An owner account already exists.", 409);
    const local = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname);
    if (!local && (!process.env.ADMIN_SETUP_TOKEN || input.token !== process.env.ADMIN_SETUP_TOKEN)) throw new StoreError("Enter the setup token configured by your store administrator.", 403);
    if (!input.name?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) || input.password.length < 12 || input.password.length > 128) throw new StoreError("Enter your name, a valid email, and a password of 12–128 characters.");
    const salt = randomBytes(24).toString("hex");
    return issueSession({ name: input.name.trim(), email: input.email.trim().toLowerCase(), salt, passwordHash: scryptSync(input.password, salt, 64).toString("hex"), sessions: [] });
  });
}
export async function signOut() { return locked(async () => { const owner = await readOwner(); const token = (await cookies()).get(COOKIE)?.value; if (owner && token) { owner.sessions = owner.sessions.filter(s => s.hash !== digest(token)); await writeOwner(owner); } }); }
export async function changePassword(current: string, next: string) {
  await requireAdmin();
  return locked(async () => {
    const owner = (await readOwner())!;
    if (!current || next.length < 12 || next.length > 128 || !timingSafeEqual(scryptSync(current, owner.salt, 64), Buffer.from(owner.passwordHash, "hex"))) throw new StoreError("Check your current password. The new password must contain at least 12 characters.");
    owner.salt = randomBytes(24).toString("hex"); owner.passwordHash = scryptSync(next, owner.salt, 64).toString("hex"); owner.sessions = [];
    await writeOwner(owner);
  });
}
