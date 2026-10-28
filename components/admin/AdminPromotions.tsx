"use client";
import { useState } from "react";
import { Plus,Save,Trash2 } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import { Button,Field,PageHeading,Panel } from "./AdminUI";
import type { Promotion } from "@/lib/store-types";
export default function AdminPromotions(){
 const {store,save,busy}=useAdmin();const [promotions,setPromotions]=useState<Promotion[]>(store!.promotions??[]);const [dirty,setDirty]=useState(false);
 const update=(id:string,field:keyof Promotion,value:string|boolean)=>{setPromotions(p=>p.map(x=>x.id===id?{...x,[field]:value}:x));setDirty(true);};
 return <><PageHeading title="Promotions" description="Publish real offers on the homepage. Schedule dates and link an active checkout discount."><Button onClick={()=>{setPromotions(p=>[...p,{id:crypto.randomUUID(),title:"New offer",description:"",code:"",link:"/collection",startsAt:"",endsAt:"",published:false}]);setDirty(true);}} disabled={promotions.length>=12}><Plus size={14}/>New promotion</Button><Button variant="primary" disabled={!dirty||busy} onClick={async()=>{try{await save("promotions",{promotions});setDirty(false);}catch{}}}><Save size={14}/>{busy?"Saving…":"Save & publish"}</Button></PageHeading>
 <div className="admin-note">Only published offers within their dates appear on the storefront. A linked discount must also be active, within its dates and below its usage limit. Discount rules and minimum spend are managed in Discounts. Dates use UTC.</div>
 {!promotions.length&&<Panel title="A clear storefront"><p className="admin-panel-body">No promotions are published. Add an offer when you have one ready.</p></Panel>}
 {promotions.map(p=><Panel key={p.id} title={p.title} action={<Button small onClick={()=>{setPromotions(all=>all.filter(x=>x.id!==p.id));setDirty(true);}}><Trash2 size={12}/>Remove</Button>}><div className="admin-panel-body admin-form-grid">
 <Field label="Headline" wide><input maxLength={100} value={p.title} onChange={e=>update(p.id,"title",e.target.value)}/></Field><Field label="Offer details / conditions" wide><textarea maxLength={300} value={p.description} onChange={e=>update(p.id,"description",e.target.value)}/></Field>
 <Field label="Checkout discount code (optional)"><select value={p.code} onChange={e=>update(p.id,"code",e.target.value)}><option value="">No discount · announcement only</option>{store!.discounts.filter(d=>d.active).map(d=><option key={d.id} value={d.code}>{d.code}{d.minimum?` · minimum $${d.minimum}`:""}</option>)}</select></Field><Field label="Store page link"><input value={p.link} onChange={e=>update(p.id,"link",e.target.value)} placeholder="/collection"/></Field>
 <Field label="Starts (optional)"><input type="date" value={p.startsAt} onChange={e=>update(p.id,"startsAt",e.target.value)}/></Field><Field label="Ends (optional)"><input type="date" value={p.endsAt} onChange={e=>update(p.id,"endsAt",e.target.value)}/></Field><label className="admin-check wide"><input type="checkbox" checked={p.published} onChange={e=>update(p.id,"published",e.target.checked)}/>Publish on homepage</label>
 </div></Panel>)}</>;
}
