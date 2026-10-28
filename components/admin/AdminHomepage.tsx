"use client";
import { useState } from "react";
import { Save } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";
import { DEFAULT_HOMEPAGE, type HomepageContent } from "@/lib/store-types";
import { useAdmin } from "./AdminProvider";
import { Button, Field, Panel } from "./AdminUI";

const sections = [
  { key: "spotlight", name: "Product spotlight", count: 3, hint: "Choose up to three pieces. Their current product images, descriptions and prices appear automatically." },
  { key: "shopTheLook", name: "Shop the Look", count: 2, hint: "Choose two pieces to style together. Customers choose a size for each piece; prices come from your catalogue." },
  { key: "newsletter", name: "Newsletter signup", count: 0, hint: "Invite customers to subscribe. Subscriptions appear in your admin Subscribers list." },
] as const;

export default function AdminHomepage() {
  const { store, save, busy } = useAdmin();
  const [form, setForm] = useState<HomepageContent>(() => structuredClone(store!.homepage ?? DEFAULT_HOMEPAGE));
  const [dirty, setDirty] = useState(false);
  const update = (key: keyof HomepageContent, patch: Partial<HomepageContent[typeof key]>) => {
    setForm(current => ({ ...current, [key]: { ...current[key], ...patch } }));
    setDirty(true);
  };
  return <form onSubmit={async e => {
    e.preventDefault();
    try { await save("homepage", { homepage: form }); setDirty(false); } catch {}
  }}>
    <div className="admin-note" style={{ marginBottom: 20 }}>Optional sections start hidden. Add your own heading, caption and products, then select “Publish this section” and save. Uncheck it and save to hide it again. Hidden draft content stays off the public website.</div>
    <div style={{ display: "grid", gap: 20 }}>
      {sections.map(({ key, name, count, hint }) => {
        const section = form[key];
        return <Panel key={key} title={name} description={hint} action={<span className={`admin-badge ${section.published ? "green" : ""}`}>{section.published ? "Set to publish" : "Hidden / draft"}</span>}>
          <div className="admin-panel-body admin-form-grid">
            <Field label={`${name} · heading`} wide><input maxLength={100} required={section.published} value={section.title} placeholder="Add your own heading" onChange={e => update(key, { title: e.target.value })}/></Field>
            <Field label={`${name} · small label`} wide><input maxLength={100} value={section.eyebrow} onChange={e => update(key, { eyebrow: e.target.value })}/></Field>
            <Field label={`${name} · caption`} wide><textarea maxLength={500} value={section.description} placeholder="Write the message you want customers to see" onChange={e => update(key, { description: e.target.value })}/></Field>
            {Array.from({ length: count }, (_, index) => {
              const selected = store!.products.find(p => p.id === section.productIds[index]);
              return <Field key={index} label={`${name} · product ${index + 1}`}>
                <select value={section.productIds[index] ?? ""} onChange={e => {
                  const ids = [...section.productIds]; ids[index] = e.target.value;
                  update(key, { productIds: ids.filter(Boolean) });
                }}>
                  <option value="">Choose a product</option>
                  {store!.products.filter(p => p.status !== "archived" && (!section.productIds.includes(p.id) || p.id === selected?.id)).map(p => <option key={p.id} value={p.id}>{p.name}{p.status !== "active" ? " · draft" : ""}</option>)}
                </select>
                {selected && <span style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}><ResponsiveImage src={selected.image} alt="" sizes="48px" style={{ width: 48, height: 60, objectFit: "cover", borderRadius: 6 }}/><small>{selected.name}</small></span>}
              </Field>;
            })}
            <label className="admin-check wide"><input type="checkbox" checked={section.published} onChange={e => update(key, { published: e.target.checked })}/>Publish this section</label>
          </div>
        </Panel>;
      })}
    </div>
    <div className="admin-form-actions"><span className="admin-muted">{dirty ? "You have unsaved changes." : "All changes saved."}</span><Button type="submit" variant="primary" disabled={busy || !dirty}><Save size={14}/>{busy ? "Saving…" : "Save homepage sections"}</Button></div>
  </form>;
}
