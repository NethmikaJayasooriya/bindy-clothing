"use client";
import { useEffect } from "react";
import Link from "next/link";
import { getAccount } from "@/lib/account";
import Footer from "@/components/Footer";
export default function AccountPage(){
 useEffect(()=>{getAccount();},[]);
 return <><header className="px-6 py-8 border-b border-sand flex justify-between"><Link href="/" className="text-3xl font-bold">bindy.</Link><Link href="/collection">Explore the collection →</Link></header><main className="max-w-5xl mx-auto px-6 py-16 sm:py-24 min-h-[60vh]"><p className="uppercase text-xs tracking-[.25em] text-gold">Always welcome</p><h1 className="font-serif text-5xl mt-5">Your BINDY space.</h1><p className="mt-6 text-sm leading-7 max-w-xl">Shop with guest checkout. Your wishlist stays in this browser, and our team is here to help with orders and deliveries.</p><div className="grid sm:grid-cols-3 gap-5 mt-12">{[["Your wishlist","Come back to the pieces you love.","/wishlist"],["Order help","Contact us with your order number for payment or delivery questions.","/contact"],["Returns & exchanges","Request a return using your order number and checkout email.","/returns/start"]].map(([title,description,href])=><Link key={href} href={href} className="border border-sand bg-white p-7 hover:border-gold transition-colors"><h2 className="font-serif text-2xl">{title}</h2><p className="text-sm leading-7 mt-4 text-charcoal/70">{description}</p><span className="block mt-6">Explore →</span></Link>)}</div></main><Footer/></>;
}
