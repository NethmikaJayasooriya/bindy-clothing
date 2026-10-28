"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function DeferredSection({children,minHeight=600}:{children:ReactNode;minHeight?:number}) {
  const ref=useRef<HTMLDivElement>(null);const [ready,setReady]=useState(false);
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setReady(true);observer.disconnect();}},{rootMargin:"800px 0px"});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect();},[]);
  return <div ref={ref} style={ready?undefined:{minHeight}}>{ready?children:null}</div>;
}
