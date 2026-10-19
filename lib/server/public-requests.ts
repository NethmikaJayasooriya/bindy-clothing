import "server-only";
import { StoreError } from "./store-repository";
import { object } from "./store-actions";
import { checkOrigin } from "./admin-auth";
const attempts = new Map<string, {count:number; until:number}>();
export async function publicInput(request: Request, scope: string) {
 checkOrigin(request);
 const key = `${scope}:${request.headers.get("x-forwarded-for")?.split(",")[0] || "local"}`;
 const old = attempts.get(key); const limit = old && old.until > Date.now() ? old : {count:0,until:Date.now()+600000};
 if (++limit.count > 15) throw new StoreError("Please wait a few minutes before trying again.",429); attempts.set(key,limit);
 if(attempts.size>5000) for(const [key,entry] of Array.from(attempts.entries())) if(entry.until<Date.now())attempts.delete(key);
 const raw = await request.text(); if(raw.length>15000)throw new StoreError("The request is too long.",413);
 return object(JSON.parse(raw));
}
export const publicError = (e:unknown) => ({message:e instanceof StoreError?e.message:"Unable to save your request. Please try again.",status:e instanceof StoreError?e.status:500});
