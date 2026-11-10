"use client";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useState } from "react";
import { Plus, Download, FolderTree, Save, Trash2, Tag, ImagePlus, X } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import { Badge, Button, Empty, Field, MediaPicker, Modal, PageHeading, Pagination, Panel, SearchBox, exportCsv, useList } from "./AdminUI";
import type { StoreCategory } from "@/lib/store-types";

export default function AdminCategories() {
  const { store, save, busy } = useAdmin();
  const [editor, setEditor] = useState<StoreCategory | "new" | null>(null);
  const [toDelete, setToDelete] = useState<StoreCategory | null>(null);

  const categories: StoreCategory[] = store?.categories ?? [];
  const list = useList(categories, (c, q) =>
    `${c.name} ${c.slug} ${c.subcategories.join(" ")}`.toLowerCase().includes(q)
  );

  const productCount = (cat: StoreCategory) =>
    store!.products.filter(p => p.category === cat.name || p.category === cat.slug).length;

  return (
    <>
      <PageHeading
        title="Categories & Styles"
        description="Organise your wardrobe into collections, categories, and subcategories."
      >
        <Button
          onClick={() =>
            exportCsv(
              "bindy-categories",
              ["Name", "Slug", "Subcategories", "Products", "Status", "Sort Order"],
              list.filtered.map(c => [
                c.name,
                c.slug,
                c.subcategories.join("; "),
                productCount(c),
                c.status,
                c.sortOrder
              ])
            )
          }
        >
          <Download size={14} />
          Export
        </Button>
        <Button variant="primary" onClick={() => setEditor("new")}>
          <Plus size={14} />
          Add category
        </Button>
      </PageHeading>

      <Panel>
        <div className="admin-toolbar">
          <SearchBox
            value={list.query}
            onChange={list.setQuery}
            placeholder="Search categories or subcategories…"
          />
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>CATEGORY</th>
                <th>URL SLUG</th>
                <th>SUBCATEGORIES</th>
                <th>PRODUCTS</th>
                <th>STATUS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.visible.map(c => {
                const count = productCount(c);
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="admin-product-cell">
                        {c.image ? (
                          <ResponsiveImage src={c.image} alt={c.name} loading="lazy" />
                        ) : (
                          <div
                            style={{
                              width: 38,
                              height: 50,
                              background: "#eee8de",
                              borderRadius: 4,
                              display: "grid",
                              placeItems: "center",
                              color: "#8c7e6c"
                            }}
                          >
                            <FolderTree size={16} />
                          </div>
                        )}
                        <div>
                          <button
                            type="button"
                            className="admin-link"
                            style={{ fontWeight: 600 }}
                            onClick={() => setEditor(c)}
                          >
                            {c.name}
                          </button>
                          {c.description && (
                            <small
                              className="admin-muted"
                              style={{
                                display: "block",
                                maxWidth: 280,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}
                            >
                              {c.description}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: 11, background: "#f5f0e6", padding: "2px 6px", borderRadius: 4 }}>
                        /collection/{c.slug}
                      </code>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 260 }}>
                        {c.subcategories.slice(0, 3).map(s => (
                          <span
                            key={s}
                            style={{
                              fontSize: 10,
                              background: "#e8e1d5",
                              color: "#463d33",
                              padding: "2px 7px",
                              borderRadius: 12
                            }}
                          >
                            {s}
                          </span>
                        ))}
                        {c.subcategories.length > 3 && (
                          <span style={{ fontSize: 10, color: "#8c7e6c", alignSelf: "center" }}>
                            +{c.subcategories.length - 3} more
                          </span>
                        )}
                        {!c.subcategories.length && (
                          <span className="admin-muted" style={{ fontSize: 11 }}>
                            No subcategories
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{count}</strong>
                      <span className="admin-muted" style={{ fontSize: 10, marginLeft: 4 }}>
                        {count === 1 ? "piece" : "pieces"}
                      </span>
                    </td>
                    <td>
                      <Badge tone={c.status === "active" ? "" : "neutral"}>{c.status}</Badge>
                    </td>
                    <td>
                      <div className="admin-inline">
                        <Button small onClick={() => setEditor(c)}>
                          Edit
                        </Button>
                        <Button
                          small
                          variant="danger"
                          aria-label={`Delete category ${c.name}`}
                          disabled={busy}
                          onClick={() => setToDelete(c)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!list.filtered.length && (
          <Empty
            title="No categories found"
            description="Create categories to help shoppers explore your collections."
          >
            <Button variant="primary" onClick={() => setEditor("new")}>
              <Plus size={14} />
              Add a category
            </Button>
          </Empty>
        )}

        <Pagination count={list.filtered.length} page={list.page} setPage={list.setPage} />
      </Panel>

      {editor && (
        <CategoryEditor
          category={editor === "new" ? undefined : editor}
          onClose={() => setEditor(null)}
        />
      )}

      {toDelete && (
        <DeleteCategoryModal
          category={toDelete}
          productCount={productCount(toDelete)}
          onClose={() => setToDelete(null)}
        />
      )}
    </>
  );
}

export function CategoryEditor({
  category,
  onClose,
  onSaved
}: {
  category?: StoreCategory;
  onClose: () => void;
  onSaved?: (category: StoreCategory) => void;
}) {
  const { save, busy, store } = useAdmin();
  const [form, setForm] = useState<StoreCategory>(
    category ?? {
      id: "",
      name: "",
      slug: "",
      description: "",
      image: "",
      subcategories: [],
      sortOrder: (store?.categories?.length ?? 0) + 1,
      status: "active"
    }
  );
  const [newSub, setNewSub] = useState("");
  const [mediaPicker, setMediaPicker] = useState(false);

  const handleNameChange = (name: string) => {
    if (!category) {
      // Auto-generate slug from name if creating new
      const slug = name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setForm({ ...form, name, slug });
    } else {
      setForm({ ...form, name });
    }
  };

  const addSubcategory = () => {
    const trimmed = newSub.trim();
    if (!trimmed) return;
    if (form.subcategories.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setNewSub("");
      return;
    }
    setForm({
      ...form,
      subcategories: [...form.subcategories, trimmed]
    });
    setNewSub("");
  };

  const removeSubcategory = (index: number) => {
    setForm({
      ...form,
      subcategories: form.subcategories.filter((_, i) => i !== index)
    });
  };

  return (
    <Modal title={category ? `Edit ${category.name}` : "Create a category"} onClose={onClose}>
      <form
        onSubmit={async e => {
          e.preventDefault();
          try {
            await save("save-category", form);
            onSaved?.(form);
            onClose();
          } catch {}
        }}
      >
        <div className="admin-form-grid">
          <Field label="Category name">
            <input
              required
              value={form.name}
              placeholder="e.g. Resort Wear"
              onChange={e => handleNameChange(e.target.value)}
            />
          </Field>

          <Field label="URL slug" hint="Used in /collection/[slug]">
            <input
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              value={form.slug}
              placeholder="e.g. resort-wear"
              onChange={e =>
                setForm({
                  ...form,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                })
              }
            />
          </Field>

          <Field label="Description" hint="Appears at the top of the collection page" wide>
            <textarea
              value={form.description || ""}
              placeholder="A few words describing this category..."
              maxLength={500}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          <Field label="Banner / cover image" wide>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                value={form.image || ""}
                placeholder="/images/categories/example.webp or upload"
                onChange={e => setForm({ ...form, image: e.target.value })}
                style={{ flex: 1 }}
              />
              <Button small onClick={() => setMediaPicker(true)}>
                <ImagePlus size={14} />
                Browse media
              </Button>
            </div>
            {form.image && (
              <div style={{ marginTop: 8, maxWidth: 180, height: 90, borderRadius: 6, overflow: "hidden" }}>
                <ResponsiveImage src={form.image} alt={form.name} loading="lazy" />
              </div>
            )}
          </Field>

          <Field label="Sort priority">
            <input
              type="number"
              min="1"
              max="999"
              value={form.sortOrder}
              onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as StoreCategory["status"] })}
            >
              <option value="active">Active (Visible on storefront)</option>
              <option value="hidden">Hidden (Draft / Seasonal)</option>
            </select>
          </Field>
        </div>

        <div className="admin-form-section" style={{ marginTop: 24 }}>
          <h3>Subcategories & styles</h3>
          <p className="admin-muted" style={{ fontSize: 11, marginBottom: 14 }}>
            Subcategories appear as filter tags on the collection page and suggested styles in the product editor.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {form.subcategories.map((sub, i) => (
              <span
                key={sub}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  background: "#eee7db",
                  color: "#3a3227",
                  fontSize: 12,
                  borderRadius: 20
                }}
              >
                <Tag size={12} />
                {sub}
                <button
                  type="button"
                  aria-label={`Remove ${sub}`}
                  onClick={() => removeSubcategory(i)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: "#8c7e6c"
                  }}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {!form.subcategories.length && (
              <p className="admin-muted" style={{ fontSize: 11 }}>
                No subcategories added yet.
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, maxWidth: 420 }}>
            <input
              type="text"
              value={newSub}
              placeholder="e.g. Silk Tops, Maxi Skirts"
              onChange={e => setNewSub(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSubcategory();
                }
              }}
              style={{ flex: 1 }}
            />
            <Button small onClick={addSubcategory} disabled={!newSub.trim()}>
              <Plus size={13} />
              Add style
            </Button>
          </div>
        </div>

        <div className="admin-form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={busy || !form.name.trim() || !form.slug.trim()}>
            <Save size={14} />
            Save category
          </Button>
        </div>
      </form>

      {mediaPicker && (
        <MediaPicker
          onSelect={urls => {
            if (urls[0]) setForm(f => ({ ...f, image: urls[0] }));
            setMediaPicker(false);
          }}
          onClose={() => setMediaPicker(false)}
        />
      )}
    </Modal>
  );
}

function DeleteCategoryModal({
  category,
  productCount,
  onClose
}: {
  category: StoreCategory;
  productCount: number;
  onClose: () => void;
}) {
  const { save, busy } = useAdmin();

  return (
    <Modal title={`Delete ${category.name}`} onClose={onClose}>
      <div style={{ padding: "8px 0 16px" }}>
        {productCount > 0 ? (
          <div
            role="alert"
            style={{
              padding: 14,
              borderRadius: 8,
              background: "#fff2f0",
              border: "1px solid #ffccc7",
              color: "#a8071a",
              fontSize: 13,
              lineHeight: 1.6
            }}
          >
            <strong>Cannot delete category</strong>
            <p style={{ marginTop: 6 }}>
              There are currently <strong>{productCount}</strong> product(s) assigned to{" "}
              <strong>{category.name}</strong>. Please edit or reassign those products to another
              category before deleting.
            </p>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "#242a27", lineHeight: 1.6 }}>
            Are you sure you want to permanently delete the <strong>{category.name}</strong> category?
            Its collection page (<code>/collection/{category.slug}</code>) will no longer be available.
          </p>
        )}
      </div>

      <div className="admin-form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onClose}>Cancel</Button>
        {productCount === 0 && (
          <Button
            variant="danger"
            disabled={busy}
            onClick={async () => {
              try {
                await save("delete-category", { id: category.id });
                onClose();
              } catch {}
            }}
          >
            <Trash2 size={13} />
            Permanently delete
          </Button>
        )}
      </div>
    </Modal>
  );
}

