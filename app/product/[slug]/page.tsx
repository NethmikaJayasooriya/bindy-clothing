import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getCanonicalProductId } from "@/lib/products";
import { readPublicStore } from "@/lib/server/store-repository";
import ProductDetail from "@/components/ProductDetail";
export const dynamic = "force-dynamic";
export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata> {
 const p=(await readPublicStore()).products.find(p=>p.id===getCanonicalProductId(params.slug));
 return p?{title:`${p.name} · BINDY`,description:p.description,alternates:{canonical:`/product/${p.id}`}}:{title:"Piece not found · BINDY"};
}
export default async function ProductPage({params}:{params:{slug:string}}) {
 const id=getCanonicalProductId(params.slug);
 if(id!==params.slug) permanentRedirect(`/product/${id}`);
 const product=(await readPublicStore()).products.find(p=>p.id===id);
 if(!product) notFound();
 return <ProductDetail product={product}/>;
}
