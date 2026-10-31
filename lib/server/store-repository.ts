import "server-only";
import { cache } from "react";
import { cleanProductMedia, currentImageSource } from "@/lib/product-media";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { hasDatabase, productionStorageRequired, readDocument, writeDocument } from "./durable-storage";
import { RequestError as StoreError } from "./request-security";
import { publishedPromotions } from "@/lib/promotions";
import { publishedHomepage } from "@/lib/homepage-content";
import { isRetiredProduct } from "@/lib/retired-products";
import { publicDiscovery } from "@/lib/home-discovery";
import { payhereMode,payhereReady } from "./payhere";
export { RequestError as StoreError } from "./request-security";
import { PRODUCTS } from "@/data/products";
import { DEFAULT_HERO, DEFAULT_SETTINGS, type StoreState, type StoreProduct, type PublicStore, type PublicProduct } from "@/lib/store-types";

import os from "node:os";

// On Vercel / serverless runtimes, process.cwd() is read-only (/var/task). /tmp is writable.
export const STORE_DIR = path.resolve(
  process.env.BINDY_DATA_DIR ||
  (process.env.VERCEL ? path.join(os.tmpdir(), ".store") : path.join(process.cwd(), ".store"))
);
const FILE = path.join(STORE_DIR, "store.json");
let queue: Promise<unknown> = Promise.resolve();
let inMemoryStore: StoreState | null = null;
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
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
    const tmp = path.join(STORE_DIR, `store-${randomUUID()}.tmp`);
    await fs.writeFile(tmp, JSON.stringify(state, null, 2), { mode: 0o600 });
    await fs.rename(tmp, FILE);
  } catch { throw new StoreError("Store data could not be saved. Please try again.",503); }
}
let initializing: Promise<void> | undefined;
function cleanStoreMedia(state: StoreState): StoreState {
  return {...state, products:state.products.map(p=>cleanProductMedia({...p,status:isRetiredProduct(p.id)?"archived":p.status,styleWith:p.styleWith?.filter(id=>!isRetiredProduct(id))})), media:state.media.filter(m=>currentImageSource(m.url)===m.url), orders:state.orders.map(o=>({...o,items:o.items.map(i=>({...i,image:currentImageSource(i.image)}))}))};
}
export async function readStore(): Promise<StoreState> {
  if (hasDatabase()) {
    const document = await readDocument<StoreState>("store");
    return cleanStoreMedia(document ? {...document.value, revision:document.revision} : seedStore());
  }
  // Serverless writes must never use ephemeral disk. Catalogue stays available during setup.
  if (productionStorageRequired()) return cleanStoreMedia(seedStore());
  if (inMemoryStore) return cleanStoreMedia(inMemoryStore);
  try {
    const state = JSON.parse(await fs.readFile(FILE, "utf8"));
    return cleanStoreMedia({ ...state, messages: state.messages ?? [], subscribers: state.subscribers ?? [] });
  } catch (error) {
    const isEnoent = (error as NodeJS.ErrnoException).code === "ENOENT";
    if (!isEnoent) throw new StoreError("Store data could not be read. Restore or check the server backup before continuing.",503);
    const seeded = seedStore();
    try {
      if (!initializing) {
        initializing = (async () => {
          try {
            await fs.access(FILE);
          } catch {
            await atomicWrite(seeded);
          }
        })().catch(e => {
          initializing = undefined;
          console.warn("[store-repository] Initializing store failed:", e);
        });
      }
      await initializing;
      const data = await fs.readFile(FILE, "utf8");
      return cleanStoreMedia(JSON.parse(data));
    } catch {
      // In read-only or serverless environments where writing fails, fallback to inMemoryStore
      inMemoryStore = seeded;
      return inMemoryStore;
    }
  }
}
export async function mutateStore<T>(revision: number | undefined, description: string, mutate: (state: StoreState) => T | Promise<T>): Promise<{ state: StoreState; result: T }> {
  const task = queue.then(async () => {
    if (!hasDatabase() && productionStorageRequired()) throw new StoreError("Checkout and store updates are unavailable until the database is configured.",503);
    const state = structuredClone(await readStore());
    const previousRevision = state.revision;
    if (revision !== undefined && revision !== state.revision) throw new StoreError("This page is out of date. Your latest store data has been loaded; please try again.", 409);
    const result = await mutate(state);
    state.revision++; state.updatedAt = new Date().toISOString();
    state.activity.unshift({ id: randomUUID(), description, createdAt: state.updatedAt });
    state.activity = state.activity.slice(0, 150);
    if (hasDatabase()) {
      if (!await writeDocument("store",state,previousRevision)) throw new StoreError("The store changed while saving. Please try again.",409);
    } else { await atomicWrite(state); inMemoryStore=state; }
    return { state, result };
  });
  queue = task.catch(() => {});
  return task;
}
export function publicStore(state: StoreState): PublicStore {
  const paymentEnabled=hasDatabase()&&payhereReady();
  return { discovery: publicDiscovery(state.discovery), revision: state.revision, hero: state.hero.filter(p => p.enabled), pages: state.pages.filter(p => p.published), settings: {...state.settings,acceptingOrders:state.settings.acceptingOrders&&paymentEnabled},promotions:publishedPromotions(state),homepage:publishedHomepage(state.homepage,new Set(state.products.filter(p=>p.status==="active"&&!isRetiredProduct(p.id)).map(p=>p.id))),payments:{enabled:paymentEnabled,mode:payhereMode()},
    products: state.products.filter(p => p.status === "active" && !isRetiredProduct(p.id)).map((p): PublicProduct => {
      const { sku, costAud, status, featured, updatedAt, lowStockThreshold, ...product } = p;
      const total = Object.values(p.stock).reduce((sum, n) => sum + n, 0);
      return { ...product, inventoryCount: total, inventoryStatus: total === 0 ? "sold_out" : total <= p.lowStockThreshold ? "low_stock" : "in_stock" };
    }).sort((a, b) => Number(state.products.find(p => p.id === b.id)?.featured) - Number(state.products.find(p => p.id === a.id)?.featured)) };
}
export const readPublicStore = cache(async () => publicStore(await readStore()));
export function productTotal(p: StoreProduct) { return Object.values(p.stock).reduce((sum, n) => sum + n, 0); }
