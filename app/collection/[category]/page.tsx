import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryCollection from "@/components/CategoryCollection";
import JsonLd from "@/components/JsonLd";
import { CATEGORY_PAGES, pageMetadata, breadcrumbs, collectionSchema } from "@/lib/seo";
import { readPublicStore } from "@/lib/server/store-repository";
type Props = { params: Promise<{category:string}> };
async function resolveCategory(slug: string) {
  const store = await readPublicStore();
  const custom = store.categories?.find(c => c.slug === slug);
  if (custom) {
    return {
      name: custom.name,
      title: `${custom.name} | BINDY Clothing`,
      description: custom.description || `Explore ${custom.name} by BINDY Clothing.`
    };
  }
  return Object.prototype.hasOwnProperty.call(CATEGORY_PAGES, slug) ? CATEGORY_PAGES[slug] : undefined;
}
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {category}=await params;
  const entry = await resolveCategory(category);
  if(!entry) notFound();
  return pageMetadata(entry.title, entry.description, `/collection/${category}`);
}
export default async function CategoryPage({params}:Props) {
  const {category}=await params;
  const entry = await resolveCategory(category);
  if(!entry) notFound();
  const products=(await readPublicStore()).products.filter(p=>p.category===entry.name);
  return <><JsonLd data={collectionSchema(entry.title,`/collection/${category}`,products)}/><JsonLd data={breadcrumbs([{name:"Home",path:"/"},{name:"Collection",path:"/collection"},{name:entry.name,path:`/collection/${category}`}])}/><CategoryCollection/></>;
}
