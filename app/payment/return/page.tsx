"use client";
import { Suspense,useEffect,useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCart,saveCart,clearBuyNowItem,getBuyNowItem } from "@/lib/cart";
function PaymentResult(){
 const query=useSearchParams();const reference=query.get("reference"),token=query.get("token");
 const [result,setResult]=useState<{number:string;payment:string;status:string;total:number;cancelled:boolean}|null>(null);const [error,setError]=useState("");const [waiting,setWaiting]=useState(true);
 useEffect(()=>{let active=true,count=0,timer:ReturnType<typeof setTimeout>;async function check(){try{
  if(!reference||!token)throw new Error("This payment link is incomplete.");
  const response=await fetch("/api/payhere/status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reference,token})});const data=await response.json();if(!response.ok)throw new Error(data.error);if(!active)return;setResult(data);setError("");
  if(data.payment==="paid"){
   const key=`bindy_payment_cart_${reference}`;const raw=sessionStorage.getItem(key);
   if(raw){const purchased=JSON.parse(raw) as {isBuyNow:boolean;items:{id:string;size:string;quantity:number}[]};
    if(purchased.isBuyNow){const buy=getBuyNowItem();if(buy&&purchased.items.some(i=>i.id===buy.product.id&&i.size===buy.size))clearBuyNowItem();}
    else {const cart=getCart().map(line=>{const bought=purchased.items.find(i=>i.id===line.product.id&&i.size===line.size);return bought?{...line,quantity:Math.max(0,line.quantity-bought.quantity)}:line;}).filter(line=>line.quantity>0);saveCart(cart);}
    sessionStorage.removeItem(key);
   }
   sessionStorage.removeItem("bindy_order_request");sessionStorage.removeItem("bindy_checkout_step");sessionStorage.removeItem("bindy_checkout_shipping");setWaiting(false);
  }
  else if(data.status==="pending"&&++count<36)timer=setTimeout(check,5000);else setWaiting(false);
 }catch(e){if(active){setError((e as Error).message);setWaiting(false);}}}check();return()=>{active=false;clearTimeout(timer);};},[reference,token]);
 const paid=result?.payment==="paid";
 return <main className="min-h-screen bg-paper px-6 py-16 flex items-center justify-center"><div className="max-w-xl w-full border border-sand rounded-3xl bg-white p-8 sm:p-12"><Link href="/" className="text-3xl font-bold">bindy.</Link><p className="mt-10 text-xs tracking-widest uppercase">Your order</p><h1 className="mt-3 font-serif text-4xl">{paid?(result.cancelled?"Payment received. Under review.":"Thank you. Payment confirmed."):waiting?"Checking your payment…":"Payment not confirmed yet."}</h1>
 {result&&<p className="my-6">{result.number} · ${result.total.toFixed(2)} AUD</p>}
 <p className="leading-7 mt-6">{paid?(result.cancelled?"Your payment arrived after the reservation ended. Our team will check availability and arrange fulfilment or a refund. Please contact us with your order number.":"Your payment has been verified by PayHere. Our team will prepare your order."):"Please keep your order number. A bank redirect or cancelled browser window does not confirm payment. If you were charged, contact us before placing another order."}</p>
 {error&&<p role="alert" className="text-red-700 mt-4">{error}</p>}
 {!waiting&&!paid&&<button onClick={()=>window.location.reload()} className="mt-6 underline">Check payment status again</button>}
 <div className="mt-8 flex gap-6"><Link href="/collection" className="underline">Continue shopping</Link><Link href="/contact" className="underline">Contact us</Link></div></div></main>;
}
export default function Page(){return <Suspense fallback={<main className="p-12">Checking your payment…</main>}><PaymentResult/></Suspense>;}
