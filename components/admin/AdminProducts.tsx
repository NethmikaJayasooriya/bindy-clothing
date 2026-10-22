"use client";
import { useEffect, useState } from "react";
import { Plus, Download, Archive, ArrowUpRight, ImagePlus, ArrowLeft, ArrowRight, Save, Package, Trash2 } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import { Badge, Button, Empty, Field, MediaPicker, Modal, PageHeading, Pagination, Panel, ProductCell, SearchBox, exportCsv, money, useList } from "./AdminUI";
import type { StoreProduct } from "@/lib/store-types";
const categories = ["Dresses", "Tops & Blouses", "Skirts & Pants", "Two Piece Sets"];
export default function AdminProducts({ inventory = false }: { inventory?: boolean }) {
  const { store, save, busy } = useAdmin(); const [status, setStatus] = useState("all"); const [category, setCategory] = useState("all"); const [editor, setEditor] = useState<StoreProduct | "new" | null>(null); const [selected, setSelected] = useState<string[]>([]); const [stockProduct, setStockProduct] = useState<StoreProduct | null>(null);
  const [toDelete, setToDelete] = useState<StoreProduct | StoreProduct[] | null>(null);
  const total = (p: StoreProduct) => Object.values(p.stock).reduce((s,n)=>s+n,0);
  const list = useList(store!.products.filter(p => (category === "all" || p.category === category) && (status === "all" || status === "low" ? status !== "low" || (p.status === "active" && total(p) <= p.lowStockThreshold) : p.status === status)), (p,q) => `${p.name} ${p.sku} ${p.fabric}`.toLowerCase().includes(q));
  useEffect(() => { list.setPage(1); setSelected([]); }, [status, category]);
  async function bulk(next: string) { try { await save("product-status", { ids: selected, status: next }); setSelected([]); } catch {} }
  return <><PageHeading title={inventory ? "Inventory" : "Products"} description={inventory ? "Keep every size in stock, with one clear inventory view." : "Your whole collection, thoughtfully organised."}><Button onClick={() => exportCsv("bindy-products", ["Product", "SKU", "Category", "Status", "Price AUD", "Stock"], list.filtered.map(p => [p.name,p.sku,p.category,p.status,p.priceAud,total(p)]))}><Download size={14} />Export</Button>{!inventory && <Button variant="primary" onClick={() => setEditor("new")}><Plus size={15} />Add product</Button>}</PageHeading>
    <div className="admin-tabs">{[["all", "All products"], ["active", "Active"], ["draft", "Drafts"], ["archived", "Archived"], ["low", "Low stock"]].map(([key,label]) => <button key={key} className={status === key ? "active" : ""} onClick={() => setStatus(key)}>{label}<span>{key === "all" ? store!.products.length : key === "low" ? store!.products.filter(p => p.status === "active" && total(p) <= p.lowStockThreshold).length : store!.products.filter(p => p.status === key).length}</span></button>)}</div>
    <Panel><div className="admin-toolbar"><SearchBox value={list.query} onChange={list.setQuery} placeholder="Search product name, SKU or fabric" /><div className="admin-filters"><select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}><option value="all">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select></div></div>{selected.length > 0 && <div className="admin-toolbar"><span>{selected.length} selected</span><div className="admin-inline"><Button small disabled={busy} onClick={() => bulk("active")}>Publish</Button><Button small disabled={busy} onClick={() => bulk("draft")}>Move to draft</Button><Button small disabled={busy} onClick={() => bulk("archived")}><Archive size={12} />Archive</Button><Button small variant="danger" disabled={busy} onClick={() => setToDelete(store!.products.filter(p => selected.includes(p.id)))}><Trash2 size={12} />Delete</Button><Button small onClick={() => setSelected([])}>Clear</Button></div></div>}
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th><input type="checkbox" aria-label="Select this page" checked={list.visible.length > 0 && list.visible.every(p => selected.includes(p.id))} onChange={e => setSelected(e.target.checked ? Array.from(new Set([...selected,...list.visible.map(p=>p.id)])) : selected.filter(id => !list.visible.some(p=>p.id===id)))} /></th><th>PRODUCT</th><th>STATUS</th><th>{inventory ? "STOCK BY SIZE" : "CATEGORY"}</th><th>{inventory ? "TOTAL STOCK" : "PRICE"}</th><th>{inventory ? "ALERT AT" : "INVENTORY"}</th><th /></tr></thead><tbody>{list.visible.map(p => <tr key={p.id}><td><input type="checkbox" aria-label={`Select ${p.name}`} checked={selected.includes(p.id)} onChange={e=>setSelected(e.target.checked?[...selected,p.id]:selected.filter(id=>id!==p.id))} /></td><td><button className="admin-link" onClick={() => inventory ? setStockProduct(p) : setEditor(p)}><ProductCell product={p} /></button></td><td><Badge tone={p.status === "active" ? "" : "neutral"}>{p.status}</Badge></td><td>{inventory ? <span style={{ fontSize: 10 }}>{p.sizes.map(s=>`${s.replace(/ \(.*/, "")}: ${p.stock[s] ?? 0}`).join(" · ")}</span> : p.category}</td><td><strong>{inventory ? total(p) : money(p.priceAud)}</strong></td><td>{inventory ? `${p.lowStockThreshold} units` : <Badge tone={total(p) === 0 ? "danger" : total(p) <= p.lowStockThreshold ? "warn" : "neutral"}>{total(p) === 0 ? "Out of stock" : `${total(p)} available`}</Badge>}</td><td>{inventory ? <Button small onClick={()=>setStockProduct(p)}>Adjust stock</Button> : <div className="admin-inline"><Button small onClick={()=>setEditor(p)}>Edit</Button><Button small variant="danger" aria-label={`Delete ${p.name}`} disabled={busy} onClick={() => setToDelete(p)}><Trash2 size={12} /></Button></div>}</td></tr>)}</tbody></table></div>{!list.filtered.length && <Empty title="No products found" description="Try another search or category, or add your first product."><Button onClick={()=>{list.setQuery("");setCategory("all");setStatus("all");}}>Clear filters</Button></Empty>}<Pagination count={list.filtered.length} page={list.page} setPage={list.setPage} /></Panel>
    {editor && <ProductEditor key={editor === "new" ? "new" : editor.id} product={editor === "new" ? undefined : editor} onClose={()=>setEditor(null)} />}
    {stockProduct && <StockEditor product={stockProduct} onClose={()=>setStockProduct(null)} />}
    {toDelete && (
      <Modal
        title={Array.isArray(toDelete) ? `Delete ${toDelete.length} products` : `Delete product`}
        onClose={() => setToDelete(null)}
      >
        <div style={{ padding: "6px 0 16px" }}>
          <p style={{ fontSize: 13, color: "#242a27", lineHeight: 1.6, marginBottom: 12 }}>
            {Array.isArray(toDelete)
              ? `Are you sure you want to permanently delete these ${toDelete.length} products?`
              : <>Are you sure you want to permanently delete <strong>{toDelete.name}</strong> ({toDelete.sku})?</>}
          </p>
          <p style={{ fontSize: 12, color: "#a75040", background: "#fff1ed", padding: "10px 14px", borderRadius: 7, border: "1px solid #f1cabe" }}>
            This will permanently remove the product, all sized inventory, and all variants from your store and Supabase database. This action cannot be undone.
          </p>
        </div>
        <div className="admin-form-actions">
          <Button onClick={() => setToDelete(null)} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={busy}
            onClick={async () => {
              try {
                if (Array.isArray(toDelete)) {
                  await save("delete-products", { ids: toDelete.map(p => p.id) });
                  setSelected([]);
                } else {
                  await save("delete-product", { id: toDelete.id });
                }
                setToDelete(null);
              } catch (err: any) {
                alert(err?.message || "Failed to delete.");
              }
            }}
          >
            <Trash2 size={13} />{busy ? "Deleting…" : "Yes, permanently delete"}
          </Button>
        </div>
      </Modal>
    )}
  </>;
}
function StockEditor({ product, onClose }: { product: StoreProduct; onClose: () => void }) { const { save, busy } = useAdmin(); const [stock,setStock]=useState(product.stock); return <Modal title="Adjust inventory" onClose={onClose}><div className="admin-note">Set the actual available quantity for each size. New orders reduce these quantities automatically.</div><ProductCell product={product} /><form onSubmit={async e=>{e.preventDefault();try{await save("inventory",{id:product.id,stock});onClose();}catch{}}}><div className="admin-form-grid" style={{marginTop:22}}>{product.sizes.map(s=><Field key={s} label={s}><input type="number" min="0" max="1000000" step="1" required value={stock[s]??0} onChange={e=>setStock({...stock,[s]:Number(e.target.value)})} /></Field>)}</div><div className="admin-form-actions"><Button onClick={onClose}>Cancel</Button><Button type="submit" variant="primary" disabled={busy}><Save size={14} />Save inventory</Button></div></form></Modal>; }
function ProductEditor({ product, onClose }: { product?: StoreProduct; onClose: () => void }) {
  const { store, save, busy } = useAdmin();
  const [pick, setPick] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [formError, setFormError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [p, setP] = useState<StoreProduct>(product ?? { id:"", name:"",sku:"",status:"draft",description:"",heritage:"",category:"Tops & Blouses",fabric:"",colorName:"",colorHex:"#DCC7AF",priceAud:0,compareAtAud:0,costAud:0,featured:false,stock:{"AU 6 (XS)":0,"AU 8 (S)":0,"AU 10 (M)":0,"AU 12 (L)":0,"AU 14 (XL)":0},lowStockThreshold:store!.settings.lowStockThreshold,sizes:["AU 6 (XS)","AU 8 (S)","AU 10 (M)","AU 12 (L)","AU 14 (XL)"],gallery:[],collectionName:"Atelier Separates",craftDetails:[],care:[],soldSeparately:false } as unknown as StoreProduct);

  function update<K extends keyof StoreProduct>(key:K, value:StoreProduct[K]) {
    setP(prev => ({ ...prev, [key]: value }));
    setDirty(true);
    setFormError("");
  }

  function close() {
    onClose();
  }

  function focusField(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const name = p.name?.trim();
    if (!name) {
      setFormError("Please enter a product name.");
      focusField("admin-product-name");
      return;
    }

    const slug = p.id?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) {
      setFormError("Please enter a valid product URL with lowercase letters, numbers, and hyphens.");
      focusField("admin-product-id");
      return;
    }

    if (!p.gallery || p.gallery.length === 0) {
      setFormError("At least 1 product photo is required. Click 'Choose or upload images' below to select one.");
      focusField("admin-product-gallery-btn");
      return;
    }

    if (!p.priceAud || p.priceAud <= 0) {
      setFormError("Please enter a valid selling price greater than $0 (e.g. 160.00).");
      focusField("admin-product-price");
      return;
    }

    if (p.compareAtAud && p.compareAtAud <= p.priceAud) {
      setFormError("Compare-at price must be higher than the selling price.");
      focusField("admin-product-compare");
      return;
    }

    // Supply sensible fallbacks for secondary fields if user left them blank
    const sku = (p.sku?.trim() || `BIN-${name.slice(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, "")}-${Math.floor(100 + Math.random() * 900)}`).toUpperCase();
    const description = p.description?.trim() || `${name}. Beautifully crafted with sustainable artisanal techniques.`;
    const fabric = p.fabric?.trim() || "Handloom Cotton";
    const colorName = p.colorName?.trim() || "Natural";

    const payload: StoreProduct = {
      ...p,
      id: slug,
      name,
      sku,
      description,
      fabric,
      colorName,
      craftDetails: (p.craftDetails || []).map(v => v.trim()).filter(Boolean),
      care: (p.care || []).map(v => v.trim()).filter(Boolean),
    };

    try {
      await save("save-product", payload);
      onClose();
    } catch (err: any) {
      setFormError(err?.message || "Unable to save product. Please check your inputs.");
    }
  }

  const total = Object.values(p.stock).reduce((s, n) => s + n, 0);

  return (
    <>
      <Modal title={product ? "Edit product" : "Add a product"} onClose={close}>
        <form noValidate onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <Field label="Product name" wide>
              <input
                id="admin-product-name"
                value={p.name}
                maxLength={200}
                onChange={e => {
                  const name = e.target.value;
                  setP(prev => ({
                    ...prev,
                    name,
                    ...(!product ? { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") } : {})
                  }));
                  setDirty(true);
                  setFormError("");
                }}
                placeholder="e.g. Pearl Lace-Trim Blouse"
              />
            </Field>
            <Field label="Product URL" hint={product ? "Product URLs stay fixed so existing links keep working." : "Use lowercase letters, numbers and hyphens."}>
              <input
                id="admin-product-id"
                value={p.id}
                readOnly={Boolean(product)}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                onChange={e => update("id", e.target.value)}
              />
            </Field>
            <Field label="SKU">
              <input
                id="admin-product-sku"
                value={p.sku}
                maxLength={80}
                placeholder="BIN-0034"
                onChange={e => update("sku", e.target.value)}
              />
            </Field>
            <Field label="Description" wide>
              <textarea
                id="admin-product-desc"
                value={p.description}
                maxLength={5000}
                onChange={e => update("description", e.target.value)}
              />
            </Field>
            <Field label="Category">
              <select value={p.category} onChange={e => update("category", e.target.value as StoreProduct["category"])}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Collection">
              <select value={p.collectionName} onChange={e => update("collectionName", e.target.value as StoreProduct["collectionName"])}>
                {["Serendipity", "Collection 02", "Atelier Separates"].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Fabric">
              <input id="admin-product-fabric" value={p.fabric} onChange={e => update("fabric", e.target.value)} />
            </Field>
            <Field label="Style / subcategory">
              <input value={p.subCategory || ""} placeholder="e.g. Blouses & Shirts" onChange={e => update("subCategory", e.target.value)} />
            </Field>
            <Field label="Colour name">
              <input id="admin-product-color" value={p.colorName} onChange={e => update("colorName", e.target.value)} />
            </Field>
            <Field label="Colour swatch">
              <input type="color" value={p.colorHex} onChange={e => update("colorHex", e.target.value)} />
            </Field>
          </div>

          <div className="admin-form-section">
            <h3>Product photography</h3>
            <p className="admin-muted" style={{ fontSize: 11, marginBottom: 14 }}>
              First image is the product card. Second image appears on hover. Add up to 8 images.
            </p>
            {p.gallery.length === 0 && (
              <p style={{ fontSize: 12, color: "#8a5828", background: "#fbf3ea", padding: "10px 14px", borderRadius: 7, marginBottom: 12 }}>
                Notice: At least 1 photo is required. Click &quot;Choose or upload images&quot; below to add one.
              </p>
            )}
            <div className="admin-image-list">
              {p.gallery.map((url, i) => (
                <div className="admin-image-item" key={`${url}-${i}`}>
                  <img src={url} alt={`Product image ${i + 1}`} />
                  <button type="button" aria-label={`Remove image ${i + 1}`} onClick={() => update("gallery", p.gallery.filter((_, n) => n !== i))}>×</button>
                  <small>{i === 0 ? "Main image" : i === 1 ? "Hover image" : `Image ${i + 1}`}</small>
                  <div className="admin-inline" style={{ justifyContent: "center", marginTop: 5 }}>
                    <Button small disabled={i === 0} aria-label={`Move image ${i + 1} left`} onClick={() => {
                      const a = [...p.gallery];
                      [a[i - 1], a[i]] = [a[i], a[i - 1]];
                      update("gallery", a);
                    }}><ArrowLeft size={11} /></Button>
                    <Button small disabled={i === p.gallery.length - 1} aria-label={`Move image ${i + 1} right`} onClick={() => {
                      const a = [...p.gallery];
                      [a[i + 1], a[i]] = [a[i], a[i + 1]];
                      update("gallery", a);
                    }}><ArrowRight size={11} /></Button>
                  </div>
                </div>
              ))}
            </div>
            <Button id="admin-product-gallery-btn" onClick={() => setPick(true)} style={{ marginTop: 14 }} disabled={p.gallery.length >= 8}>
              <ImagePlus size={14} />Choose or upload images
            </Button>
          </div>

          <div className="admin-form-section">
            <h3>Pricing · AUD</h3>
            <div className="admin-form-grid">
              <Field label="Selling price">
                <input id="admin-product-price" type="number" min="0" step=".01" value={p.priceAud || ""} onChange={e => update("priceAud", Number(e.target.value))} placeholder="160.00" />
              </Field>
              <Field label="Compare-at price" hint="Optional. Must be higher than the selling price.">
                <input id="admin-product-compare" type="number" min="0" step=".01" value={p.compareAtAud || ""} onChange={e => update("compareAtAud", Number(e.target.value))} placeholder="0.00" />
              </Field>
              <Field label="Cost per item" hint="Private. Never shown to customers.">
                <input type="number" min="0" step=".01" value={p.costAud || ""} onChange={e => update("costAud", Number(e.target.value))} placeholder="0.00" />
              </Field>
              <Field label="Status">
                <select value={p.status} onChange={e => update("status", e.target.value as StoreProduct["status"])}>
                  <option value="active">Active · visible in store</option>
                  <option value="draft">Draft · hidden</option>
                  <option value="archived">Archived · hidden</option>
                </select>
              </Field>
            </div>
            <label className="admin-check" style={{ marginTop: 15 }}>
              <input type="checkbox" checked={p.featured} onChange={e => update("featured", e.target.checked)} />
              Feature this product at the top of the collection
            </label>
            <label className="admin-check" style={{ marginTop: 10 }}>
              <input type="checkbox" checked={Boolean(p.soldSeparately)} onChange={e => update("soldSeparately", e.target.checked)} />
              Sold separately · suitable for mix and match
            </label>
          </div>

          <div className="admin-form-section">
            <h3>Sizes & inventory · {total} units available</h3>
            <div className="admin-inline" style={{ flexWrap: "wrap", marginBottom: 16 }}>
              {p.sizes.map(size => (
                <button
                  type="button"
                  className="admin-badge neutral"
                  key={size}
                  aria-label={`Remove size ${size}`}
                  onClick={() => {
                    if (p.sizes.length < 2) return;
                    setP(prev => {
                      const stock = { ...prev.stock };
                      delete stock[size];
                      return { ...prev, sizes: prev.sizes.filter(s => s !== size), stock };
                    });
                    setDirty(true);
                  }}
                >
                  {size} ×
                </button>
              ))}
              <input
                value={newSize}
                onChange={e => setNewSize(e.target.value)}
                placeholder="New size, e.g. AU 16 (XXL)"
                aria-label="New size"
                maxLength={40}
                style={{ width: 210 }}
              />
              <Button small onClick={() => {
                const size = newSize.trim();
                if (!size || p.sizes.includes(size) || p.sizes.length >= 20) return;
                setP(prev => ({ ...prev, sizes: [...prev.sizes, size], stock: { ...prev.stock, [size]: 0 } }));
                setNewSize("");
                setDirty(true);
              }}>
                Add size
              </Button>
            </div>
            <div className="admin-form-grid">
              {p.sizes.map(size => (
                <Field key={size} label={size}>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={p.stock[size] ?? 0}
                    onChange={e => update("stock", { ...p.stock, [size]: Number(e.target.value) })}
                  />
                </Field>
              ))}
              <Field label="Low stock alert at">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={p.lowStockThreshold}
                  onChange={e => update("lowStockThreshold", Number(e.target.value))}
                />
              </Field>
            </div>
          </div>

          <details className="admin-form-section">
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>Story, craft & care</summary>
            <div className="admin-form-grid" style={{ marginTop: 18 }}>
              <Field label="Product story" wide>
                <textarea value={p.heritage || ""} onChange={e => update("heritage", e.target.value)} />
              </Field>
              <Field label="Craft details" hint="One detail per line.">
                <textarea value={(p.craftDetails || []).join("\n")} onChange={e => update("craftDetails", e.target.value.split("\n"))} />
              </Field>
              <Field label="Care instructions" hint="One instruction per line.">
                <textarea value={(p.care || []).join("\n")} onChange={e => update("care", e.target.value.split("\n"))} />
              </Field>
            </div>
          </details>

          {formError && (
            <div className="admin-form-error" role="alert" style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <span>{formError}</span>
              {p.gallery.length === 0 && (
                <Button small variant="primary" onClick={() => setPick(true)}>
                  <ImagePlus size={13} />Choose photo now
                </Button>
              )}
            </div>
          )}

          <div className="admin-form-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {product && (
                confirmDelete ? (
                  <div className="admin-inline" style={{ background: "#fff1ed", padding: "6px 12px", borderRadius: 8, border: "1px solid #f1cabe" }}>
                    <span style={{ fontSize: 11, color: "#a75040", fontWeight: 600 }}>Permanently delete?</span>
                    <Button
                      small
                      variant="danger"
                      disabled={busy}
                      onClick={async () => {
                        try {
                          await save("delete-product", { id: product.id });
                          onClose();
                        } catch (err: any) {
                          setFormError(err?.message || "Failed to delete product.");
                          setConfirmDelete(false);
                        }
                      }}
                    >
                      <Trash2 size={12} />{busy ? "Deleting…" : "Yes, delete"}
                    </Button>
                    <Button small onClick={() => setConfirmDelete(false)} disabled={busy}>Cancel</Button>
                  </div>
                ) : (
                  <Button
                    variant="danger"
                    disabled={busy}
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 size={13} />Delete product
                  </Button>
                )
              )}
            </div>
            <div className="admin-inline">
              {product && p.status === "active" && (
                <a className="admin-btn" target="_blank" rel="noreferrer" href={`/product/${p.id}`}>
                  Preview<ArrowUpRight size={13} />
                </a>
              )}
              <Button onClick={close}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={busy}>
                <Save size={14} />{busy ? "Saving…" : "Save product"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
      {pick && (
        <MediaPicker
          multiple
          onClose={() => setPick(false)}
          onSelect={urls => update("gallery", [...p.gallery, ...urls].slice(0, 8))}
        />
      )}
    </>
  );
}
