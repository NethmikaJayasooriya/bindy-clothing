import "server-only";
import { StoreError } from "./store-repository";
import { object } from "./store-actions";
import { checkOrigin } from "./admin-auth";
import { limitedJson,rateLimit,requestIdentity } from "./request-security";
export async function publicInput(request: Request, scope: string, max=15) {
 checkOrigin(request);
 await rateLimit(scope,requestIdentity(request),max);
 return object(await limitedJson(request,100000));
}
export const publicError = (e:unknown) => ({message:e instanceof StoreError?e.message:"Unable to save your request. Please try again.",status:e instanceof StoreError?e.status:500});
