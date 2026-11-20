"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import ResponsiveImage from "./ResponsiveImage";
import { getCart, saveCart, subscribe, type CartItem } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import type { EditorialPageContent, EditorialSection } from "@/lib/editorial-content";
import styles from "./EditorialPage.module.css";

function Paragraphs({text}:{text:string}){return <>{text.split(/\n\s*\n/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</>;}
function Action({href,label}:{href:string;label:string}){return href&&label?<Link className={styles.action} href={href}>{label}<ArrowUpRight size={17}/></Link>:null;}
function Section({section:s,index}:{section:EditorialSection;index:number}){
 const head=<><p className={styles.eyebrow}>{s.eyebrow||String(index+1).padStart(2,"0")}</p><h2 id={`heading-${s.id}`}>{s.title}</h2><div className={styles.body}><Paragraphs text={s.body}/></div></>;
 return <section id={s.id} data-editorial-section={s.id} className={`${styles.section} ${styles[s.layout]} ${styles[s.tone]} ${s.imageSide==="right"?styles.reverse:""}`} aria-labelledby={`heading-${s.id}`}>
  {s.layout==="split"?<><div className={styles.imageFrame}><ResponsiveImage src={s.image} alt={s.alt} loading="lazy" sizes="(max-width: 760px) 100vw, 45vw"/></div><div className={styles.splitCopy}>{head}{s.items.length>0&&<div className={styles.facts}>{s.items.map(i=><div key={i.id}><strong>{i.title}</strong><p>{i.body}</p></div>)}</div>}<Action href={s.link} label={s.linkLabel}/></div></>:<>
   <div className={styles.sectionHead}>{head}</div>
   {s.image&&<ResponsiveImage className={styles.sectionImage} src={s.image} alt={s.alt} loading="lazy" sizes="(max-width: 760px) 100vw, 80vw"/>}
   {s.layout==="values"&&<ol className={styles.valueList}>{s.items.map((i,n)=><li key={i.id}><span>{String(n+1).padStart(2,"0")}</span><div><h3>{i.title}</h3><p>{i.body}</p></div>{i.image&&<ResponsiveImage src={i.image} alt={i.alt} loading="lazy" sizes="100px"/>}</li>)}</ol>}
   {s.layout==="palette"&&<div className={styles.paletteGrid}>{s.items.map(i=><article key={i.id}>{i.image&&<ResponsiveImage src={i.image} alt={i.alt} loading="lazy" sizes="(max-width: 760px) 45vw, 12vw"/>}<span className={styles.swatch} style={{background:i.colour||"transparent"}}/><h3>{i.title}</h3><p>{i.body}</p><small>{i.colour}</small></article>)}</div>}
   {s.layout==="gallery"&&<div className={styles.galleryGrid}>{s.items.map(i=><figure key={i.id}><a href={i.image} target="_blank" rel="noreferrer" aria-label={`View ${i.title} in full size`}><ResponsiveImage src={i.image} alt={i.alt} loading="lazy" sizes="(max-width: 760px) 100vw, 45vw"/><span><Plus size={17}/>View full board</span></a><figcaption><h3>{i.title}</h3><p>{i.body}</p></figcaption></figure>)}</div>}
   {(s.layout==="text"||s.layout==="quote")&&s.items.length>0&&<div className={styles.facts}>{s.items.map(i=><div key={i.id}><h3>{i.title}</h3><p>{i.body}</p>{i.image&&<ResponsiveImage src={i.image} alt={i.alt} loading="lazy"/>}</div>)}</div>}
   <Action href={s.link} label={s.linkLabel}/>
  </>}
 </section>;
}
export default function EditorialPage({page,kind,preview=false}:{page:EditorialPageContent;kind:"about"|"stories";preview?:boolean}){
 const [items,setItems]=useState<CartItem[]>([]),[cartOpen,setCartOpen]=useState(false),[muted,setMuted]=useState(true);
 useEffect(()=>{if(preview)return;setItems(getCart());return subscribe(()=>setItems(getCart()));},[preview]);
 const content=<main className={styles.page} data-editorial-page={kind}>
  <section className={styles.hero} aria-labelledby="editorial-title"><div className={styles.heroCopy}><p className={styles.eyebrow}>{page.eyebrow}</p><h1 id="editorial-title">{page.title}<em>{page.accent}</em></h1><p className={styles.intro}>{page.intro}</p><Action href={page.link} label={page.linkLabel}/><div className={styles.signature}><span>Australia</span><i/><span>Sri Lanka</span></div></div><figure className={styles.heroFigure}><ResponsiveImage src={page.image} alt={page.alt} style={{objectPosition:page.imagePosition}} loading="eager" fetchPriority="high" sizes="(max-width: 760px) 100vw, 52vw"/><figcaption><span>BINDY CLOTHING</span><span>{page.navLabel}</span></figcaption></figure></section>
  <nav className={styles.chapterNav} aria-label={`${page.navLabel} sections`}><span>In this story <ArrowDown size={12}/></span>{page.sections.filter(s=>s.published).map((s,i)=><a key={s.id} href={`#${s.id}`}><small>{String(i+1).padStart(2,"0")}</small>{s.eyebrow||s.title}</a>)}</nav>
  {page.sections.filter(s=>s.published).map((s,index)=><Section key={s.id} section={s} index={index}/>)}
 </main>;
 if(preview)return content;
 return <><Navbar isMuted={muted} toggleAudio={()=>{if(ambientPlayer)setMuted(ambientPlayer.toggle());}} cartCount={items.reduce((n,i)=>n+i.quantity,0)} onOpenCart={()=>setCartOpen(true)}/>{content}<Footer/><CartDrawer isOpen={cartOpen} onClose={()=>setCartOpen(false)} items={items} onUpdateQuantity={(id,size,delta)=>saveCart(getCart().map(i=>i.product.id===id&&i.size===size?{...i,quantity:Math.max(0,Math.min(99,i.quantity+delta))}:i).filter(i=>i.quantity>0))} onRemoveItem={(id,size)=>saveCart(getCart().filter(i=>!(i.product.id===id&&i.size===size)))}/></>;
}
