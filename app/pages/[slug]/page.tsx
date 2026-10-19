import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { readPublicStore } from "@/lib/server/store-repository";
export const dynamic="force-dynamic";
export default async function Page({params}:{params:{slug:string}}) {
 const state=await readPublicStore(); const page=state.pages.find(p=>p.slug===params.slug); if(!page) notFound();
 return <><header className="px-6 py-7 border-b border-sand/50 flex justify-between"><Link href="/" className="text-3xl font-bold">bindy.</Link><Link href="/collection">Shop the collection →</Link></header><main className="max-w-3xl mx-auto px-6 py-20 min-h-[60vh]"><h1 className="font-serif text-4xl mb-10">{page.title}</h1><div className="whitespace-pre-wrap leading-8">{page.body}</div>{page.slug==="returns"&&<Link href="/returns/start" className="inline-block mt-8 px-6 py-3 bg-charcoal text-white rounded-full">Request a return or exchange →</Link>}</main><Footer/></>;
}
