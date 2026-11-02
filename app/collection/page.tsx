import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, collectionSchema, breadcrumbs } from "@/lib/seo";
import { readPublicStore } from "@/lib/server/store-repository";
export async function generateMetadata({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}):Promise<Metadata> {
  const query = await searchParams;
  return { ...pageMetadata("Shop Women's Clothing", "Shop the BINDY wardrobe: dresses, tops, blouses, skirts, trousers and matching sets. Browse available pieces by category, colour, size and occasion.", "/collection"), ...(Object.keys(query).length ? {robots:{index:false,follow:true}} : {}) };
}
export default async function Collection() {
  const {products} = await readPublicStore();
  return <><JsonLd data={collectionSchema("BINDY Clothing collection", "/collection", products)}/><JsonLd data={breadcrumbs([{name:"Home",path:"/"},{name:"Collection",path:"/collection"}])}/><CollectionPage/></>;
}
