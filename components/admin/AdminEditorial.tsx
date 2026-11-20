"use client";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Copy, Eye, ImagePlus, Plus, Save, Trash2, ExternalLink } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import { Button, Field, MediaPicker, Modal, PageHeading, Panel } from "./AdminUI";
import ResponsiveImage from "@/components/ResponsiveImage";
import EditorialPage from "@/components/EditorialPage";
import { DEFAULT_EDITORIAL, SECTION_LAYOUTS, editorialEqual, type EditorialItem, type EditorialKey, type EditorialPageContent, type EditorialSection } from "@/lib/editorial-content";

const labels={split:"Image & text",text:"Text story",quote:"Statement / quote",values:"Values / steps",palette:"Colour palette",gallery:"Image gallery"};
function move<T>(items:T[],from:number,to:number){const result=[...items];[result[from],result[to]]=[result[to],result[from]];return result;}
const freshItem=():EditorialItem=>({id:crypto.randomUUID(),title:"",body:"",image:"",alt:"",colour:""});
const freshSection=():EditorialSection=>({id:crypto.randomUUID(),layout:"text",published:false,eyebrow:"",title:"",body:"",image:"",alt:"",imageSide:"left",tone:"paper",link:"",linkLabel:"",items:[]});
export default function AdminEditorial(){
 const {store}=useAdmin(),[key,setKey]=useState<EditorialKey>("stories");
 return <><PageHeading title="About & Bindy Stories" description="Build and publish each page with your own words, photography and sections."/><div className="admin-tabs">{(["stories","about"] as const).map(k=><button key={k} className={key===k?"active":""} onClick={()=>{if(document.querySelector('[data-editorial-dirty="true"]')&&!window.confirm("Discard unsaved page changes and switch pages?"))return;setKey(k);}}>{k==="about"?"About BINDY":"Bindy Stories"}<span>/{k} · {(store!.editorial??DEFAULT_EDITORIAL)[k].published?"Published":"Hidden"}</span></button>)}</div><PageEditor key={key} pageKey={key}/></>;
}
function PageEditor({pageKey}:{pageKey:EditorialKey}){
 const {store,save,busy,notify}=useAdmin(),initial=(store!.editorial??DEFAULT_EDITORIAL)[pageKey];
 const [page,setPage]=useState(()=>structuredClone(initial)),[baseline,setBaseline]=useState(()=>structuredClone(initial)),[dirty,setDirty]=useState(false),[preview,setPreview]=useState(false),[picker,setPicker]=useState<((url:string)=>void)|null>(null);
 useEffect(()=>{if(!dirty)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn);},[dirty]);
 function update(patch:Partial<EditorialPageContent>){setPage(p=>({...p,...patch}));setDirty(true);}
 function section(index:number,patch:Partial<EditorialSection>){update({sections:page.sections.map((s,i)=>i===index?{...s,...patch}:s)});}
 function item(si:number,ii:number,patch:Partial<EditorialItem>){section(si,{items:page.sections[si].items.map((it,i)=>i===ii?{...it,...patch}:it)});}
 const pick=(callback:(url:string)=>void)=>setPicker(()=>callback);
 async function submit(){try{const result=await save("editorial-page",{key:pageKey,page,expectedPage:baseline}) as EditorialPageContent;setPage(structuredClone(result));setBaseline(structuredClone(result));setDirty(false);}catch{}}
 function reload(){if(dirty&&!window.confirm("Discard your unsaved changes and load the latest saved page?"))return;setPage(structuredClone(initial));setBaseline(structuredClone(initial));setDirty(false);}
 const input=(label:string,value:string,onChange:(value:string)=>void,max=200,wide=false)=><Field label={label} wide={wide}><input value={value} maxLength={max} onChange={e=>onChange(e.target.value)}/></Field>;
 const body=(label:string,value:string,onChange:(value:string)=>void,max=12000)=><Field label={label} wide hint="Use a blank line between paragraphs. Text is displayed safely as written."><textarea value={value} maxLength={max} rows={5} onChange={e=>onChange(e.target.value)}/></Field>;
 function picture(url:string,alt:string,onChange:(url:string)=>void){return <div className="admin-editorial-image">{url&&<ResponsiveImage src={url} alt={alt||"Selected image"} sizes="240px"/>}<Button small onClick={()=>pick(onChange)}><ImagePlus size={13}/>{url?"Change image":"Choose / upload image"}</Button>{url&&<Button small onClick={()=>onChange("")}>Clear image</Button>}</div>;}
 return <div data-editorial-dirty={dirty} className="admin-editorial-editor">
  <div className="admin-editorial-toolbar"><span className="admin-muted">{dirty?"Unsaved changes":page.published?"Published page":"Page hidden from storefront"}</span><div className="admin-inline"><Button small onClick={reload}>Load saved version</Button><Button small onClick={()=>setPreview(true)}><Eye size={13}/>Preview draft</Button><a className="admin-btn" href={`/${pageKey}`} target="_blank" rel="noreferrer">View live<ExternalLink size={12}/></a><Button variant="primary" disabled={!dirty||busy} onClick={submit}><Save size={14}/>{busy?"Saving…":"Save page"}</Button></div></div>
  {!editorialEqual(initial,baseline)&&<p className="admin-note">A newer saved version is available. Load it before editing further; your current draft is kept until you choose to discard it.</p>}
  <Panel title="Page header & publishing" description="The navigation name, headline and opening photograph for this page."><div className="admin-panel-body admin-form-grid">
   <label className="admin-check wide"><input type="checkbox" checked={page.published} onChange={e=>update({published:e.target.checked})}/>Publish this page and show it in navigation</label>
   {input("Navigation label",page.navLabel,v=>update({navLabel:v}),40)}{input("Small label",page.eyebrow,v=>update({eyebrow:v}),120)}
   {input("Main headline",page.title,v=>update({title:v}))}{input("Accent headline",page.accent,v=>update({accent:v}))}
   {body("Introduction",page.intro,v=>update({intro:v}),2000)}
   <div className="wide">{picture(page.image,page.alt,v=>update({image:v}))}</div>
   {input("Hero image description",page.alt,v=>update({alt:v}),300,true)}{input("Hero focal point · e.g. 50% 50%",page.imagePosition,v=>update({imagePosition:v}),20)}
   {input("Header link · /collection or #section-id",page.link,v=>update({link:v}),300)}{input("Header link label",page.linkLabel,v=>update({linkLabel:v}),100)}
  </div></Panel>
  <Panel title="Page sections" description="Add, duplicate, reorder or hide sections. A new section starts hidden until its content is ready." action={<Button small disabled={page.sections.length>=30} onClick={()=>update({sections:[...page.sections,freshSection()]})}><Plus size={13}/>Add section</Button>}>
   {!page.sections.length&&<p className="admin-panel-body admin-muted">No sections yet. Add your first story section above.</p>}
   {page.sections.map((s,si)=><details className="admin-content-slide" key={s.id} open={s.title?undefined:true}><summary><div>{String(si+1).padStart(2,"0")} · {s.title||"Untitled section"}<small className="admin-muted" style={{display:"block",fontSize:11}}>{labels[s.layout]} · {s.published?"Visible":"Hidden"}</small></div></summary><div className="admin-inline admin-editorial-controls"><Button small disabled={si===0} aria-label={`Move section ${si+1} up`} onClick={()=>update({sections:move(page.sections,si,si-1)})}><ArrowUp size={13}/></Button><Button small disabled={si===page.sections.length-1} aria-label={`Move section ${si+1} down`} onClick={()=>update({sections:move(page.sections,si,si+1)})}><ArrowDown size={13}/></Button><Button small disabled={page.sections.length>=30} onClick={()=>{const copy={...structuredClone(s),id:crypto.randomUUID(),published:false,items:s.items.map(i=>({...structuredClone(i),id:crypto.randomUUID()}))};update({sections:[...page.sections.slice(0,si+1),copy,...page.sections.slice(si+1)]});}}><Copy size={13}/>Duplicate</Button><Button small onClick={()=>{if(window.confirm("Remove this section from the draft? Save the page to publish the removal."))update({sections:page.sections.filter((_,i)=>i!==si)});}}><Trash2 size={13}/>Remove</Button></div><div className="admin-form-grid">
    <label className="admin-check wide"><input type="checkbox" checked={s.published} onChange={e=>section(si,{published:e.target.checked})}/>Show this section</label>
    <Field label="Section layout"><select value={s.layout} onChange={e=>section(si,{layout:e.target.value as EditorialSection["layout"]})}>{SECTION_LAYOUTS.map(l=><option key={l} value={l}>{labels[l]}</option>)}</select></Field><Field label="Background"><select value={s.tone} onChange={e=>section(si,{tone:e.target.value as EditorialSection["tone"]})}><option value="paper">Warm paper</option><option value="white">Soft white</option><option value="ink">Deep blue</option></select></Field>
    <Field label="Section anchor ID"><input defaultValue={s.id} maxLength={100} onBlur={e=>{if(e.target.value!==s.id)section(si,{id:e.target.value});}}/></Field>{input("Section label",s.eyebrow,v=>section(si,{eyebrow:v}),120)}{input("Section heading",s.title,v=>section(si,{title:v}),200,true)}{body("Section story",s.body,v=>section(si,{body:v}))}
    <div className="wide">{picture(s.image,s.alt,v=>section(si,{image:v}))}</div>{input("Image description",s.alt,v=>section(si,{alt:v}),300,true)}
    <Field label="Image placement"><select value={s.imageSide} onChange={e=>section(si,{imageSide:e.target.value as "left"|"right"})}><option value="left">Left</option><option value="right">Right</option></select></Field>
    {input("Section link",s.link,v=>section(si,{link:v}),300)}{input("Section link label",s.linkLabel,v=>section(si,{linkLabel:v}),100)}
   </div><div className="admin-editorial-items"><div className="admin-inline" style={{justifyContent:"space-between"}}><strong>Cards, values, colours or gallery images</strong><Button small disabled={s.items.length>=24} onClick={()=>section(si,{items:[...s.items,freshItem()]})}><Plus size={12}/>Add item</Button></div>{s.items.map((it,ii)=><details key={it.id} className="admin-content-slide" open={it.title?undefined:true}><summary>{ii+1} · {it.title||"Untitled item"}</summary><div className="admin-form-grid">{input("Item title",it.title,v=>item(si,ii,{title:v}))}{input("Colour hex · optional",it.colour,v=>item(si,ii,{colour:v}),7)}{body("Item description",it.body,v=>item(si,ii,{body:v}),2000)}<div className="wide">{picture(it.image,it.alt,v=>item(si,ii,{image:v}))}</div>{input("Item image description",it.alt,v=>item(si,ii,{alt:v}),300,true)}</div><div className="admin-inline admin-editorial-controls"><Button small disabled={ii===0} aria-label={`Move item ${ii+1} up`} onClick={()=>section(si,{items:move(s.items,ii,ii-1)})}><ArrowUp size={12}/></Button><Button small disabled={ii===s.items.length-1} aria-label={`Move item ${ii+1} down`} onClick={()=>section(si,{items:move(s.items,ii,ii+1)})}><ArrowDown size={12}/></Button><Button small onClick={()=>section(si,{items:s.items.filter((_,i)=>i!==ii)})}><Trash2 size={12}/>Remove item</Button></div></details>)}</div></details>)}
  </Panel>
  <Panel title="Search appearance" description="Update how this page is described in search and sharing previews."><div className="admin-panel-body admin-form-grid">{input("SEO title",page.seoTitle,v=>update({seoTitle:v}),200,true)}{body("SEO description",page.seoDescription,v=>update({seoDescription:v}),400)}</div></Panel>
  <div className="admin-form-actions"><Button variant="primary" disabled={!dirty||busy} onClick={submit}><Save size={14}/>Save page</Button></div>
  {picker&&<MediaPicker onClose={()=>setPicker(null)} onSelect={urls=>picker(urls[0])}/>}
  {preview&&<Modal title={`${pageKey==="about"?"About BINDY":"Bindy Stories"} · unsaved draft preview`} onClose={()=>setPreview(false)}><EditorialPage kind={pageKey} page={page} preview/></Modal>}
 </div>;
}
