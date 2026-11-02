import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getCanonicalProductId } from "@/lib/products";
import { readPublicStore } from "@/lib/server/store-repository";
import ProductDetail from "@/components/ProductDetail";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, productSchema, breadcrumbs, CATEGORY_PAGES } from "@/lib/seo";
export const dynamic = "force-dynamic";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
 const {slug}=await params;
 const id=getCanonicalProductId(slug);
 if(id!==slug)permanentRedirect(`/product/${id}`);
 const p=(await readPublicStore()).products.find(p=>p.id===id);
 if(!p)notFound();
 return pageMetadata(p.name,p.description,`/product/${p.id}`,p.image);
}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}) {
 const id=getCanonicalProductId((await params).slug);
 if(id!==(await params).slug) permanentRedirect(`/product/${id}`);
 const store=await readPublicStore();
 const product=store.products.find(p=>p.id===id);
 if(!product) notFound();
 const category=Object.entries(CATEGORY_PAGES).find(([,v])=>v.name===product.category);
 return <><JsonLd data={productSchema(product,store)}/><JsonLd data={breadcrumbs([{name:"Home",path:"/"},{name:"Collection",path:"/collection"},...(category?[{name:category[1].name,path:`/collection/${category[0]}`}]:[]),{name:product.name,path:`/product/${product.id}`}])}/><ProductDetail product={product}/></>;
}
