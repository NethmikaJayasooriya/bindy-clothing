"use client";
import Link from "next/link";
import { useStorefront } from "@/components/StorefrontProvider";
export default function PublishedPromotions(){
 const {promotions=[]}=useStorefront();if(!promotions.length)return null;
 return <section aria-label="Current offers" className="max-w-7xl mx-auto px-5 py-12 grid gap-5">{promotions.map(p=><div key={p.id} className="border border-sand bg-white px-7 py-8 sm:px-12 sm:py-10 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between"><div><p className="text-[10px] tracking-[.25em] uppercase text-gold mb-3">The BINDY edit</p><h2 className="font-serif text-3xl sm:text-4xl">{p.title}</h2>{p.description&&<p className="text-sm leading-7 text-charcoal/70 mt-4 max-w-2xl">{p.description}</p>}{p.code&&<p className="mt-4 text-sm">Use code <strong className="font-mono tracking-widest">{p.code}</strong> at checkout.</p>}{p.endsAt&&<p className="text-xs mt-3 text-charcoal/60">Offer ends {p.endsAt} (UTC).</p>}</div><Link href={p.link} className="shrink-0 text-xs tracking-widest uppercase underline underline-offset-8">Explore the offer →</Link></div>)}</section>;
}
