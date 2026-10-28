import type { MetadataRoute } from "next";
import { readPublicStore } from "@/lib/server/store-repository";
export const dynamic="force-dynamic";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const site=process.env.SITE_URL||"https://bindyclothing.com.au";const store=await readPublicStore();return ["","/collection","/about","/contact",...store.products.map(p=>`/product/${p.id}`),...store.pages.map(p=>`/pages/${p.slug}`)].map(path=>({url:`${site}${path}`,changeFrequency:"weekly" as const,priority:path?0.7:1}));}
