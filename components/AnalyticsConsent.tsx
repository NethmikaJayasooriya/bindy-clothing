"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useStorefront } from "@/components/StorefrontProvider";
import { ANALYTICS_EVENT, CONSENT_KEY, PREFERENCES_EVENT, analyticsAllowedPath, measurementId, analyticsItem } from "@/lib/analytics";

declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean | undefined } }
export default function AnalyticsConsent() {
  const {settings,products}=useStorefront(), path=usePathname() || "/";
  const id=measurementId(settings.tracking?.ga4Id);
  const [choice,setChoice]=useState<string|null>(null), [open,setOpen]=useState(false);
  const configured=useRef(""), lastPage=useRef("");
  const eligible=analyticsAllowedPath(path);
  useEffect(()=>{try {setChoice(localStorage.getItem(CONSENT_KEY));} catch {setChoice("denied");}
    const show=()=>setOpen(true);const sync=(e:StorageEvent)=>{if(e.key===CONSENT_KEY)setChoice(e.newValue);};window.addEventListener(PREFERENCES_EVENT,show);window.addEventListener("storage",sync);return()=>{window.removeEventListener(PREFERENCES_EVENT,show);window.removeEventListener("storage",sync);};
  },[]);
  const choose=useCallback((value:string)=>{
    try {localStorage.setItem(CONSENT_KEY,value);}catch{}
    if(value!=="granted"&&id){window[`ga-disable-${id}`]=true;
      // Stop collection immediately, then clear first-party GA cookies.
      for(const cookie of document.cookie.split(";")){const name=cookie.split("=")[0].trim();if(!/^_ga(?:_|$)/.test(name))continue;for(const domain of ["",location.hostname,".bindyclothing.com.au"]){document.cookie=`${name}=; Max-Age=0; Path=/;${domain?` Domain=${domain};`:""} SameSite=Lax; Secure`;}}
    }
    setChoice(value);setOpen(false);
    // A fresh page removes an already-loaded third-party tag after withdrawal.
    if(value!=="granted"&&configured.current) window.location.reload();
  },[id]);
  useEffect(()=>{
    if(configured.current&&configured.current!==id)window[`ga-disable-${configured.current}`]=true;
    if(!id||choice!=="granted"||!eligible||location.hostname!=="bindyclothing.com.au") {if(id)window[`ga-disable-${id}`]=true;lastPage.current="";return;}
    window[`ga-disable-${id}`]=false;
    let referrer="";try{const ref=new URL(document.referrer);if(ref.origin!==location.origin&&ref.protocol==="https:")referrer=ref.origin+"/";}catch{}
    if(configured.current!==id){
      window.dataLayer=window.dataLayer||[];
      window.gtag=function(){window.dataLayer!.push(arguments);};
      window.gtag("consent","default",{analytics_storage:"granted",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});
      window.gtag("js",new Date());
      window.gtag("config",id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,send_to:id,page_location:`https://bindyclothing.com.au${path}`,page_referrer:referrer});
      const script=document.createElement("script");script.src=`https://www.googletagmanager.com/gtag/js?id=${id}`;script.async=true;script.id="bindy-ga4";document.head.appendChild(script);configured.current=id;
    }
    if(lastPage.current!==path){window.gtag?.("event","page_view",{send_to:id,page_location:`https://bindyclothing.com.au${path}`,page_referrer:referrer,page_title:document.title});lastPage.current=path;
      const product=products.find(p=>path===`/product/${p.id}`);
      if(product)window.gtag?.("event","view_item",{send_to:id,currency:"AUD",value:product.priceAud,items:[analyticsItem(product)],page_location:`https://bindyclothing.com.au${path}`,page_referrer:referrer});
    }
    const event=(e:Event)=>{const {name,params}=(e as CustomEvent).detail || {};if(["view_item","add_to_cart","view_cart","begin_checkout"].includes(name))window.gtag?.("event",name,{...params,send_to:id,page_location:`https://bindyclothing.com.au${path}`,page_referrer:referrer});};
    window.addEventListener(ANALYTICS_EVENT,event);return()=>window.removeEventListener(ANALYTICS_EVENT,event);
  },[id,choice,eligible,path,products]);
  if(!eligible||(!open&&(!id||choice!==null)))return null;
  return <section role="dialog" aria-label="Cookie preferences" className="fixed z-[80] bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-[440px] p-5 sm:p-6 bg-[#FAF7F2] border border-[#CFC3AF] rounded-2xl shadow-xl text-[#25231F]">
    <h2 className="font-serif text-xl">A little more insight. Your choice.</h2>
    <p className="text-xs leading-6 mt-2">Essential storage keeps your bag and preferences working. {id?"With your permission, Google Analytics helps us understand visits and product interest. Analytics is optional; advertising tracking is off.":"Optional analytics is currently disabled."} <Link className="underline" href="/pages/privacy">Read our privacy policy.</Link></p>
    <div className="flex flex-wrap gap-3 mt-4"><button className="border border-[#AAA08F] px-4 py-2 rounded-full text-xs" onClick={()=>choose("denied")}>Essential only</button>{id&&<button className="bg-[#292720] text-white px-4 py-2 rounded-full text-xs" onClick={()=>choose("granted")}>Allow analytics</button>}</div>
    {choice&&<button className="mt-3 underline text-xs" onClick={()=>setOpen(false)}>Close preferences</button>}
  </section>;
}
