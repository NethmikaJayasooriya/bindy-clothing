"use client";
import { useState } from "react";
import { ImagePlus, Save } from "lucide-react";
import { DEFAULT_DISCOVERY, DISCOVERY_CATEGORIES, type HomeDiscovery } from "@/lib/home-discovery";
import DiscoveryImage from "@/components/home/DiscoveryImage";
import { useAdmin } from "./AdminProvider";
import { Button, Field, MediaPicker, Panel } from "./AdminUI";

export default function AdminDiscovery() {
  const { store, save, busy } = useAdmin();
  const [form, setForm] = useState<HomeDiscovery>(() => structuredClone(store!.discovery ?? DEFAULT_DISCOVERY));
  const [tab, setTab] = useState("features");
  const [dirty, setDirty] = useState(false);
  const [pick, setPick] = useState<{ group: "features" | "categories"; index: number } | null>(null);
  const update = (patch: Partial<HomeDiscovery>) => { setForm(current => ({ ...current, ...patch })); setDirty(true); };
  const image = (group: "features" | "categories", index: number) => <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}><DiscoveryImage src={form[group][index].image} alt={form[group][index].alt} sizes="120px" style={{ width: 100, height: 125, objectFit: "contain", background: "#eee8db" }}/><div><Button small onClick={() => setPick({ group, index })}><ImagePlus size={13}/>Change photo</Button><p className="admin-muted" style={{ marginTop: 10, fontSize: 10, maxWidth: 220 }}>Use a portrait photo showing the model from head to toe. Recommended ratio: 4:5.</p></div></div>;
  return <form onSubmit={async event => { event.preventDefault(); try { await save("discovery", { discovery: form }); setDirty(false); } catch {} }}>
    <div className="admin-note" style={{ marginBottom: 20 }}>Manage the two large photos above categories, the category model photos, and the brand message between product rows. Every button filters the live catalogue.</div>
    <div className="admin-toolbar" style={{ justifyContent: "space-between", padding: "0 0 20px" }}><div className="admin-tabs" style={{ margin: 0 }}>{[["features", "Large photo panels"], ["categories", "Category photos"], ["mission", "Brand message"]].map(([key, label]) => <button key={key} type="button" className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>)}</div><Button type="submit" variant="primary" disabled={busy || !dirty}><Save size={14}/>{busy ? "Saving…" : "Save design changes"}</Button></div>
    {tab === "features" && <Panel title="The wardrobe edit" description="Two full-size editorial photos displayed before your clothing categories."><div className="admin-panel-body">
      <label className="admin-check"><input type="checkbox" checked={form.featuresEnabled} onChange={e => update({ featuresEnabled: e.target.checked })}/>Show the large photo panels</label>
      <div style={{ marginTop: 22 }}><Field label="Section heading"><input maxLength={100} value={form.heading} onChange={e => update({ heading: e.target.value })}/></Field></div>
      {form.features.map((feature, index) => <div key={index} className="admin-form-section"><h3>Photo panel {index + 1}</h3>{image("features", index)}<div className="admin-form-grid">
        {([["title", "Panel heading"], ["label", "Small label"], ["action", "Button label"], ["alt", "Image description"]] as const).map(([key, label]) => <Field key={key} label={`Panel ${index + 1} · ${label}`}><input maxLength={key === "alt" ? 250 : key === "label" ? 100 : 80} value={feature[key]} onChange={e => update({ features: form.features.map((item, n) => n === index ? { ...item, [key]: e.target.value } : item) })}/></Field>)}
        <Field label={`Panel ${index + 1} · category to shop`}><select value={feature.category} onChange={e => update({ features: form.features.map((item, n) => n === index ? { ...item, category: e.target.value as typeof feature.category } : item) })}>{DISCOVERY_CATEGORIES.map(category => <option key={category}>{category}</option>)}</select></Field>
      </div></div>)}
    </div></Panel>}
    {tab === "categories" && <Panel title="Full-model category photography" description="Keep each photograph relevant to the clothing category. The entire figure stays in view."><div className="admin-panel-body">
      <Field label="Category section heading"><input maxLength={100} value={form.categoryHeading} onChange={e => update({ categoryHeading: e.target.value })}/></Field>
      {form.categories.map((category, index) => <div key={category.category} className="admin-form-section"><h3>{category.category}</h3>{image("categories", index)}<Field label={`${category.category} · image description`}><input maxLength={250} value={category.alt} onChange={e => update({ categories: form.categories.map((item, n) => n === index ? { ...item, alt: e.target.value } : item) })}/></Field></div>)}
    </div></Panel>}
    {tab === "mission" && <Panel title="A moment for the BINDY story" description="This message appears after the first eight products in the complete collection. Filtered results stay focused on products."><div className="admin-panel-body admin-form-grid">
      <label className="admin-check wide"><input type="checkbox" checked={form.mission.enabled} onChange={e => update({ mission: { ...form.mission, enabled: e.target.checked } })}/>Show the brand message</label>
      {([["label", "Small label"], ["title", "Heading"]] as const).map(([key, label]) => <Field key={key} label={`Brand message · ${label}`} wide><input maxLength={100} value={form.mission[key]} onChange={e => update({ mission: { ...form.mission, [key]: e.target.value } })}/></Field>)}
      <Field label="Brand message · your goal" wide><textarea maxLength={600} style={{ minHeight: 160 }} value={form.mission.body} onChange={e => update({ mission: { ...form.mission, body: e.target.value } })}/></Field>
    </div></Panel>}
    {dirty && <p className="admin-muted" style={{ marginTop: 18, fontSize: 11 }}>You have unsaved design changes.</p>}
    {pick && <MediaPicker onClose={() => setPick(null)} onSelect={urls => {
      if (pick.group === "features") update({ features: form.features.map((item, n) => n === pick.index ? { ...item, image: urls[0] } : item) });
      else update({ categories: form.categories.map((item, n) => n === pick.index ? { ...item, image: urls[0] } : item) });
    }}/>}
  </form>;
}
