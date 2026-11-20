import { DEFAULT_EDITORIAL, EDITORIAL_KEYS, SECTION_LAYOUTS, type EditorialPageContent, type EditorialSection } from "@/lib/editorial-content";
import { imagePath, object, text } from "./store-actions";
import { StoreError } from "./store-repository";

function required(v:unknown,label:string,max=200){const value=text(v,max);if(!value)throw new StoreError(`${label} is required.`);return value;}
function list(v:unknown,max:number){if(!Array.isArray(v)||v.length>max)throw new StoreError(`Use no more than ${max} items.`);return v;}
function id(v:unknown){const value=required(v,"Section / item ID",100);if(!/^[a-z0-9-]+$/.test(value))throw new StoreError("Section and item IDs may contain lowercase letters, numbers and hyphens.");return value;}
function unique<T extends {id:string}>(values:T[]):T[]{if(new Set(values.map(v=>v.id)).size!==values.length)throw new StoreError("Use unique section and item IDs.");return values;}
function image(v:unknown){return text(v,500)?imagePath(v):"";}
function link(v:unknown){const value=text(v,300);if(!value)return "";if(/^#[a-z0-9-]+$/i.test(value))return value;if(!value.startsWith("/")||value.startsWith("//")||/[\\\s\u0000-\u001f]/.test(value)||/%(?:2f|5c|0[0-9a-f])/i.test(value))throw new StoreError("Links must point to a page or section on this store.");return value;}
export function validateEditorialPage(value:unknown):EditorialPageContent{
 const v=object(value),published=v.published===true;
 const sections=unique(list(v.sections,30).map(raw=>{
  const s=object(raw),layout=text(s.layout);if(!(SECTION_LAYOUTS as readonly string[]).includes(layout))throw new StoreError("Choose a valid section layout.");
  const section:EditorialSection={id:id(s.id),layout:layout as EditorialSection["layout"],published:s.published===true,eyebrow:text(s.eyebrow,120),title:text(s.title,200),body:text(s.body,12000),image:image(s.image),alt:text(s.alt,300),imageSide:s.imageSide==="right"?"right":"left",tone:s.tone==="ink"?"ink":s.tone==="white"?"white":"paper",link:link(s.link),linkLabel:text(s.linkLabel,100),items:unique(list(s.items,24).map(rawItem=>{const i=object(rawItem);const colour=text(i.colour,7);if(colour&&!/^#[\da-f]{6}$/i.test(colour))throw new StoreError("Colour values must use a six-digit hex code.");return {id:id(i.id),title:text(i.title,200),body:text(i.body,2000),image:image(i.image),alt:text(i.alt,300),colour};}))};
  if(published&&section.published){required(section.title,"Visible section heading");if(section.image)required(section.alt,"Section image description",300);if(section.link)required(section.linkLabel,"Section link label",100);for(const i of section.items){required(i.title,"Item title");if(i.image)required(i.alt,"Item image description",300);}if(layout==="split"&&!section.image)throw new StoreError("Add an image to visible image-and-text sections.");if(layout==="gallery"&&(!section.items.length||section.items.some(i=>!i.image)))throw new StoreError("Add images to visible gallery items.");}
  return section;
 }));
 const page:EditorialPageContent={published,navLabel:required(v.navLabel,"Navigation label",40),title:required(v.title,"Page title"),accent:text(v.accent,200),eyebrow:text(v.eyebrow,120),intro:text(v.intro,2000),image:image(v.image),alt:text(v.alt,300),imagePosition:/^(?:100|\d{1,2})% (?:100|\d{1,2})%$/.test(text(v.imagePosition))?text(v.imagePosition):"50% 50%",link:link(v.link),linkLabel:text(v.linkLabel,100),seoTitle:text(v.seoTitle,200),seoDescription:text(v.seoDescription,400),sections};
 if(published){if(!page.image)throw new StoreError("Add a hero image before publishing the page.");required(page.alt,"Hero image description",300);if(page.link)required(page.linkLabel,"Hero link label",100);}
 return page;
}
export function editorialUpdate(state:import("@/lib/store-types").StoreState,key:unknown,value:unknown){if(!(EDITORIAL_KEYS as readonly unknown[]).includes(key))throw new StoreError("Choose About or Bindy Stories.");const page=validateEditorialPage(value);state.editorial={...structuredClone(state.editorial??DEFAULT_EDITORIAL),[key as string]:page};}
