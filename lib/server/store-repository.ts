import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { PRODUCTS } from "@/data/products";
import { DEFAULT_HERO, DEFAULT_SETTINGS, type StoreState, type StoreProduct, type PublicStore, type PublicProduct } from "@/lib/store-types";

export const STORE_DIR = path.resolve(process.env.BINDY_DATA_DIR || path.join(process.cwd(), ".store"));
const FILE = path.join(STORE_DIR, "store.json");
let queue: Promise<unknown> = Promise.resolve();
export class StoreError extends Error { constructor(message: string, public status = 400) { super(message); } }
export function seedStore(): StoreState {
  const now = new Date().toISOString();
  return { version: 1, revision: 0, products: PRODUCTS.map((p, i) => {
    const units = p.inventoryCount ?? 0;
    const stock = Object.fromEntries(p.sizes.map((size, n) => [size, Math.floor(units / p.sizes.length) + (n < units % p.sizes.length ? 1 : 0)]));
    return { ...p, sku: `BIN-${String(i + 1).padStart(4, "0")}`, status: "active", stock, lowStockThreshold: 3, compareAtAud: 0, costAud: 0, featured: i < 4, updatedAt: now };
  }), orders: [], customers: [], messages: [], subscribers: [], returns: [], media: [], hero: DEFAULT_HERO, pages: [
    { slug: "shipping", title: "Shipping & delivery", body: "We ship within Australia. Standard delivery is $12 and express delivery is $18. Orders over $150 receive complimentary express delivery. Delivery estimates are provided when your order is dispatched.", published: true },
    { slug: "returns", title: "Returns & exchanges", body: "Contact our team within 30 days of receiving your order to request a return or exchange. Items should be unworn, unwashed and returned with their original tags. Please contact contact@bindyclothing.com before sending a return.", published: true },
    { slug: "privacy", title: "Privacy policy", body: "We use the contact and delivery information you provide to fulfil orders and assist with your enquiries. Contact contact@bindyclothing.com with questions about your personal information.", published: false },
    { slug: "terms", title: "Terms of service", body: "Please review and publish your store terms before accepting live orders.", published: false },
  ], discounts: [{ id: randomUUID(), code: "WELCOME10", type: "percentage", value: 10, minimum: 0, startsAt: "", endsAt: "", usageLimit: 0, used: 0, active: true }], settings: DEFAULT_SETTINGS, activity: [], updatedAt: now };
}
async function atomicWrite(state: StoreState) {
  await fs.mkdir(STORE_DIR, { recursive: true });
  const tmp = path.join(STORE_DIR, `store-${randomUUID()}.tmp`);
  await fs.writeFile(tmp, JSON.stringify(state, null, 2), { mode: 0o600 });
  await fs.rename(tmp, FILE);
}
let initializing: Promise<void> | undefined;
export async function readStore(): Promise<StoreState> {
  try { const state = JSON.parse(await fs.readFile(FILE, "utf8")); return { ...state, messages: state.messages ?? [], subscribers: state.subscribers ?? [] }; }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    if (!initializing) initializing = (async () => {
      try { await fs.access(FILE); } catch { await atomicWrite(seedStore()); }
    })().catch(e => { initializing = undefined; throw e; });
    await initializing; return JSON.parse(await fs.readFile(FILE, "utf8")); }
}
export async function mutateStore<T>(revision: number | undefined, description: string, mutate: (state: StoreState) => T | Promise<T>): Promise<{ state: StoreState; result: T }> {
  const task = queue.then(async () => {
    const state = await readStore();
    if (revision !== undefined && revision !== state.revision) throw new StoreError("This page is out of date. Your latest store data has been loaded; please try again.", 409);
    const result = await mutate(state);
    state.revision++; state.updatedAt = new Date().toISOString();
    state.activity.unshift({ id: randomUUID(), description, createdAt: state.updatedAt });
    state.activity = state.activity.slice(0, 150);
    await atomicWrite(state);
    return { state, result };
  });
  queue = task.catch(() => {});
  return task;
}
export function publicStore(state: StoreState): PublicStore {
  return { revision: state.revision, hero: state.hero.filter(p => p.enabled), pages: state.pages.filter(p => p.published), settings: state.settings,
    products: state.products.filter(p => p.status === "active").map((p): PublicProduct => {
      const { sku, costAud, status, featured, updatedAt, lowStockThreshold, ...product } = p;
      const total = Object.values(p.stock).reduce((sum, n) => sum + n, 0);
      return { ...product, inventoryCount: total, inventoryStatus: total === 0 ? "sold_out" : total <= p.lowStockThreshold ? "low_stock" : "in_stock" };
    }).sort((a, b) => Number(state.products.find(p => p.id === b.id)?.featured) - Number(state.products.find(p => p.id === a.id)?.featured)) };
}
export async function readPublicStore() { return publicStore(await readStore()); }
export function productTotal(p: StoreProduct) { return Object.values(p.stock).reduce((sum, n) => sum + n, 0); }
