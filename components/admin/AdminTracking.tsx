"use client";
import {useState} from "react";
import {useAdmin} from "./AdminProvider";
import {Button,Field,Panel} from "./AdminUI";
export default function AdminTracking(){
 const {store,save,busy}=useAdmin();const [form,setForm]=useState(store!.settings.tracking??{ga4Id:"",searchConsoleToken:""});
 return <div style={{marginTop:28}}><Panel title="Search & analytics" description="Connect the store to Google without editing code. These identifiers are public, not passwords."><form className="admin-panel-body" onSubmit={async e=>{e.preventDefault();try{await save("tracking",form);}catch{}}}>
 <div className="admin-form-grid"><Field label="GA4 measurement ID" hint="Find this under Google Analytics → Data streams. Leave empty to turn analytics off."><input placeholder="G-XXXXXXXXXX" maxLength={22} value={form.ga4Id} onChange={e=>setForm({...form,ga4Id:e.target.value.trim().toUpperCase()})}/></Field><Field label="Search Console HTML verification token" hint="Paste only the content value, not the entire meta tag. Domain properties use DNS instead."><input maxLength={160} value={form.searchConsoleToken} onChange={e=>setForm({...form,searchConsoleToken:e.target.value.trim()})}/></Field></div>
 <p className="admin-note" style={{marginTop:18}}>Analytics loads only after a visitor opts in. Admin, account, checkout and payment pages are excluded. Demo orders never count as purchase revenue. In GA4, keep enhanced measurement and Google Signals off; this store sends its own page views and catalogue events.</p><div className="admin-form-actions"><Button type="submit" variant="primary" disabled={busy}>Save search & analytics</Button></div></form></Panel></div>;
}
