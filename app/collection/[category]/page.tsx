import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryCollection from "@/components/CategoryCollection";
import JsonLd from "@/components/JsonLd";
import { CATEGORY_PAGES, pageMetadata, breadcrumbs, collectionSchema } from "@/lib/seo";
import { readPublicStore } from "@/lib/server/store-repository";
type Props = { params: Promise<{category:string}> };
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {category}=await params, entry=Object.prototype.hasOwnProperty.call(CATEGORY_PAGES,category)?CATEGORY_PAGES[category]:undefined;
  if(!entry) notFound();
  return pageMetadata(entry.title, entry.description, `/collection/${category}`);
}
export default async function CategoryPage({params}:Props) {
  const {category}=await params, entry=Object.prototype.hasOwnProperty.call(CATEGORY_PAGES,category)?CATEGORY_PAGES[category]:undefined;
  if(!entry) notFound();
  const products=(await readPublicStore()).products.filter(p=>p.category===entry.name);
  return <><JsonLd data={collectionSchema(entry.title,`/collection/${category}`,products)}/><JsonLd data={breadcrumbs([{name:"Home",path:"/"},{name:"Collection",path:"/collection"},{name:entry.name,path:`/collection/${category}`}])}/><CategoryCollection/></>;
}
