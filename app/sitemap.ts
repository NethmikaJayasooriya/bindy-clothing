import type {MetadataRoute} from "next";
import {readPublicStore} from "@/lib/server/store-repository";
import {SITE_URL,CATEGORY_PAGES,absoluteUrl} from "@/lib/seo";
export const dynamic="force-dynamic";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const store=await readPublicStore();
 const paths=["/","/collection","/about","/contact","/craft","/size-guide","/faq","/shopping","/shopping/australia","/shopping/sri-lanka",...Object.keys(CATEGORY_PAGES).map(c=>`/collection/${c}`),...store.pages.map(p=>`/pages/${p.slug}`)];
 return [...Array.from(new Set(paths)).map(path=>({url:`${SITE_URL}${path==="/"?"":path}`})),...store.products.map(p=>({url:`${SITE_URL}/product/${p.id}`,images:Array.from(new Set([p.image,...p.gallery])).map(absoluteUrl)}))];
}
