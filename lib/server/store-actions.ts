import "server-only";
import { randomUUID } from "node:crypto";
import { getCanonicalProductId } from "@/lib/products";
import type { StoreState, StoreProduct, StoreOrder, Discount, Customer, StoreReturn } from "@/lib/store-types";
import { StoreError } from "./store-repository";
type Input = Record<string, unknown>;
export function object(value: unknown): Input { if (!value || typeof value !== "object" || Array.isArray(value)) throw new StoreError("The submitted data is invalid."); return value as Input; }
export function text(value: unknown, max = 2000): string { if (value === undefined || value === null) return ""; if (typeof value !== "string" || value.length > max) throw new StoreError(`Text fields must contain no more than ${max} characters.`); return value.trim(); }
function required(value: unknown, label: string, max = 200) { const v = text(value, max); if (!v) throw new StoreError(`${label} is required.`); return v; }
export function number(value: unknown, max = 10000000): number { const n = Number(value); if (!Number.isFinite(n) || n < 0 || n > max) throw new StoreError("Enter a valid positive amount."); return Math.round(n * 100) / 100; }
function integer(value: unknown, max = 1000000) { const n = number(value, max); if (!Number.isInteger(n)) throw new StoreError("Stock and quantities must be whole numbers."); return n; }
function choice<T extends string>(value: unknown, values: readonly T[], label: string): T { if (!values.includes(value as T)) throw new StoreError(`Choose a valid ${label}.`); return value as T; }
export function imagePath(value: unknown) { const v = required(value, "Image", 500); if (!/^\/(images|uploads)\/[\w\s./()…-]+$/.test(v) || v.includes("..")) throw new StoreError("Choose an image from your media library."); return v; }
function strings(value: unknown, max = 20): string[] { if (!Array.isArray(value) || value.length > max) throw new StoreError("The list contains too many items."); return value.map(v => required(v, "Value", 200)); }
function email(value: unknown) { const v = required(value, "Email").toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new StoreError("Enter a valid email address."); return v; }
function optionalDate(value: unknown) { const v = text(value, 30); if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new StoreError("Enter a valid date."); return v; }
export function saveProduct(state: StoreState, input: Input) {
  const id = required(input.id, "Product URL", 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || getCanonicalProductId(id) !== id) throw new StoreError("Use a unique product URL with lowercase letters, numbers and hyphens.");
  const existing = state.products.find(p => p.id === id);
  const category = choice(input.category, ["Dresses", "Tops & Blouses", "Skirts & Pants", "Two Piece Sets"] as const, "category");
  const gallery = strings(input.gallery, 8).map(imagePath); if (!gallery.length) throw new StoreError("Add at least one product image.");
  const sizes = strings(input.sizes, 20); if (!sizes.length || new Set(sizes).size !== sizes.length) throw new StoreError("Choose at least one unique size.");
  const rawStock = object(input.stock); const stock = Object.fromEntries(sizes.map(size => [size, integer(rawStock[size] ?? 0)]));
  const sku = required(input.sku, "SKU", 80).toUpperCase(); if (state.products.some(p => p.id !== id && p.sku === sku)) throw new StoreError("That SKU is already in use.");
  const base = existing ?? { ...state.products[0], reviews: [], styleWith: [], story: "The BINDY wardrobe", storyPlace: "", destinations: ["Everyday" as const], quote: "", palette: [text(input.colorHex) || "#DCC7AF"], badge: undefined, imageSource: undefined, rating: undefined, reviewCount: 0, galleryZoom: undefined, galleryLabels: undefined, videoHover: undefined };
  const p: StoreProduct = { ...base, id, name: required(input.name, "Product name"), sku, category,
    description: required(input.description, "Description", 5000), fabric: required(input.fabric, "Fabric"), colorName: required(input.colorName, "Colour"),
    colorHex: /^#[0-9a-f]{6}$/i.test(text(input.colorHex)) ? text(input.colorHex) : "#DCC7AF",
    priceAud: number(input.priceAud), compareAtAud: number(input.compareAtAud ?? 0), costAud: number(input.costAud ?? 0),
    status: choice(input.status, ["active", "draft", "archived"] as const, "product status"), featured: input.featured === true,
    sizes, stock, lowStockThreshold: integer(input.lowStockThreshold ?? state.settings.lowStockThreshold, 1000), gallery, image: existing && gallery.join() === existing.gallery.join() ? existing.image : gallery[0], imageHover: existing && gallery.join() === existing.gallery.join() ? existing.imageHover : gallery[1] ?? gallery[0],
    inventoryCount: Object.values(stock).reduce((s, n) => s + n, 0),
    parentCategory: category === "Dresses" ? "Dresses" : category === "Tops & Blouses" ? "Tops" : category === "Skirts & Pants" ? "Bottoms" : "Resort Wear",
    subCategory: text(input.subCategory, 100) || "Casual", collectionName: choice(input.collectionName, ["Serendipity", "Collection 02", "Atelier Separates"] as const, "collection"),
    heritage: text(input.heritage, 10000), craftDetails: strings(input.craftDetails ?? [], 15), care: strings(input.care ?? [], 15),
    soldSeparately: input.soldSeparately === true, updatedAt: new Date().toISOString(),
  };
  if (p.compareAtAud && p.compareAtAud <= p.priceAud) throw new StoreError("Compare-at price must be higher than the selling price.");
  if (existing && gallery.join() !== existing.gallery.join()) { p.galleryZoom = undefined; p.galleryLabels = undefined; }
  if (existing) state.products[state.products.indexOf(existing)] = p; else state.products.push(p);
  return p;
}
export function discountTotal(state: StoreState, code: string, subtotal: number, shipping: number) {
  if (!code) return { discount: 0, shipping, coupon: undefined };
  const d = state.discounts.find(d => d.code === code.toUpperCase()); const today = new Date().toISOString().slice(0, 10);
  if (!d || !d.active || (d.startsAt && today < d.startsAt) || (d.endsAt && today > d.endsAt) || (d.usageLimit && d.used >= d.usageLimit)) throw new StoreError("This discount code is invalid or expired.");
  if (subtotal < d.minimum) throw new StoreError(`Spend at least $${d.minimum.toFixed(2)} to use this code.`);
  return { discount: Math.round(Math.min(subtotal, d.type === "percentage" ? subtotal * d.value / 100 : d.type === "fixed" ? d.value : 0) * 100) / 100, shipping: d.type === "shipping" ? 0 : shipping, coupon: d };
}
export function createOrder(state: StoreState, input: Input): StoreOrder {
  if (!state.settings.acceptingOrders) throw new StoreError("The store is temporarily not accepting new orders.");
  const requestId = required(input.requestId, "Request reference", 100);
  const prior = state.orders.find(o => o.requestId === requestId); if (prior) return prior;
  const person = object(input.customer); const customerEmail = email(person.email); const customerName = required(person.name, "Customer name");
  const address = required(person.address, "Shipping address", 1500); const phone = text(person.phone, 60);
  if (!Array.isArray(input.items) || !input.items.length || input.items.length > 50) throw new StoreError("Add between 1 and 50 order items.");
  const grouped = new Map<string, { productId: string; size: string; quantity: number }>();
  for (const raw of input.items) {
    const item = object(raw); const productId = getCanonicalProductId(required(item.productId, "Product")); const requestedSize = required(item.size, "Size"); const sizes = state.products.find(p=>p.id===productId)?.sizes ?? []; const size = sizes.find(s=>s===requestedSize) ?? sizes.find(s=>s.startsWith(`${requestedSize} (`)) ?? requestedSize; const quantity = integer(item.quantity, 99);
    if (quantity < 1) throw new StoreError("Order quantity must be at least one.");
    const key = `${productId}:${size}`; const existing = grouped.get(key); if (existing) existing.quantity += quantity; else grouped.set(key, { productId, size, quantity });
  }
  const items = Array.from(grouped.values()).map(item => {
    const p = state.products.find(p => p.id === item.productId && p.status === "active");
    if (!p || !p.sizes.includes(item.size)) throw new StoreError("A selected product or size is no longer available.");
    if ((p.stock[item.size] ?? 0) < item.quantity) throw new StoreError(`${p.name} has only ${p.stock[item.size] ?? 0} left in ${item.size}.`);
    return { ...item, name: p.name, image: p.image, priceAud: p.priceAud };
  });
  const subtotal = Math.round(items.reduce((s, i) => s + i.priceAud * i.quantity, 0) * 100) / 100;
  const shipping = subtotal >= state.settings.freeShippingThreshold ? 0 : input.shippingMethod === "express" ? state.settings.expressShipping : state.settings.standardShipping;
  const code = text(input.discountCode, 30).toUpperCase(); const result = discountTotal(state, code, subtotal, shipping);
  let customer = state.customers.find(c => c.email === customerEmail);
  if (!customer) { customer = { id: randomUUID(), name: customerName, email: customerEmail, phone, address, notes: "", createdAt: new Date().toISOString() }; state.customers.push(customer); }
  const now = new Date().toISOString();
  const order: StoreOrder = { id: randomUUID(), number: `${state.settings.orderPrefix}-${String(state.orders.length + 1001)}`, customerId: customer.id,
    customerName, email: customerEmail, phone, address, items, subtotal, discount: result.discount, shipping: result.shipping,
    total: Math.round((subtotal - result.discount + result.shipping) * 100) / 100, discountCode: code, payment: "unpaid", fulfillment: "unfulfilled", carrier: "", tracking: "", notes: text(input.notes, 5000), createdAt: now, updatedAt: now, requestId };
  for (const item of items) state.products.find(p => p.id === item.productId)!.stock[item.size] -= item.quantity;
  if (result.coupon) result.coupon.used++;
  state.orders.unshift(order); return order;
}
export function applyAction(state: StoreState, action: string, v: Input): unknown {
  switch (action) {
    case "save-product": return saveProduct(state, v);
    case "product-status": {
      const ids = strings(v.ids, 200); const status = choice(v.status, ["active", "draft", "archived"] as const, "status");
      if (!ids.length || ids.some(id => !state.products.some(p => p.id === id))) throw new StoreError("Select products to update.");
      for (const p of state.products.filter(p => ids.includes(p.id))) { p.status = status; p.updatedAt = new Date().toISOString(); } return;
    }
    case "inventory": {
      const product = state.products.find(p => p.id === v.id); if (!product) throw new StoreError("Product not found.", 404);
      const stock = object(v.stock); for (const size of product.sizes) product.stock[size] = integer(stock[size] ?? 0);
      product.updatedAt = new Date().toISOString(); return;
    }
    case "create-order": return createOrder(state, v);
    case "update-order": {
      const order = state.orders.find(o => o.id === v.id); if (!order) throw new StoreError("Order not found.", 404);
      const status = choice(v.fulfillment, ["unfulfilled", "packed", "shipped", "delivered", "cancelled"] as const, "fulfilment status");
      if ((order.fulfillment === "shipped" && !["shipped","delivered"].includes(status)) || (order.fulfillment === "delivered" && status !== "delivered")) throw new StoreError("Dispatched orders cannot move backwards. Use a return for items sent back.");
      if (order.fulfillment === "cancelled" && status !== "cancelled") throw new StoreError("Cancelled orders cannot be reopened. Create a new order instead.");
      if ((status === "shipped" || status === "delivered") && !text(v.tracking)) throw new StoreError("Add a real tracking number before marking this order as shipped.");
      if (status === "cancelled" && order.fulfillment !== "cancelled") {
        if (order.fulfillment === "shipped" || order.fulfillment === "delivered") throw new StoreError("Use a return for orders that have already shipped.");
        for (const item of order.items) { const p = state.products.find(p => p.id === item.productId); if (p) p.stock[item.size] = (p.stock[item.size] ?? 0) + item.quantity; }
      }
      const payment = choice(v.payment, ["unpaid", "paid", "refunded"] as const, "payment status");
      if (payment === "refunded" && order.payment === "unpaid") throw new StoreError("Only a paid order can be marked as refunded.");
      if (order.payment === "refunded" && payment !== "refunded") throw new StoreError("A refunded payment cannot be changed.");
      order.fulfillment = status; order.payment = payment; order.tracking = text(v.tracking, 150); order.carrier = text(v.carrier, 100); order.notes = text(v.notes, 5000); order.updatedAt = new Date().toISOString(); return order;
    }
    case "save-customer": {
      const id = text(v.id) || randomUUID(); const current = state.customers.find(c => c.id === id); const contact = email(v.email);
      if (state.customers.some(c => c.id !== id && c.email === contact)) throw new StoreError("A customer with this email already exists.");
      const customer: Customer = { id, name: required(v.name, "Name"), email: contact, phone: text(v.phone, 60), address: text(v.address, 1500), notes: text(v.notes, 5000), createdAt: current?.createdAt ?? new Date().toISOString() };
      if (current) Object.assign(current, customer); else state.customers.push(customer); return customer;
    }
    case "save-discount": {
      const id = text(v.id) || randomUUID(); const current = state.discounts.find(d => d.id === id); const code = required(v.code, "Discount code", 30).toUpperCase();
      if (!/^[A-Z0-9_-]+$/.test(code) || state.discounts.some(d => d.id !== id && d.code === code)) throw new StoreError("Use a unique code containing letters, numbers, hyphens or underscores.");
      const type = choice(v.type, ["percentage", "fixed", "shipping"] as const, "discount type");
      const d: Discount = { id, code, type, value: type === "shipping" ? 0 : number(v.value, type === "percentage" ? 100 : 100000), minimum: number(v.minimum), startsAt: optionalDate(v.startsAt), endsAt: optionalDate(v.endsAt), usageLimit: integer(v.usageLimit ?? 0), used: current?.used ?? 0, active: v.active === true };
      if (d.startsAt && d.endsAt && d.endsAt < d.startsAt) throw new StoreError("The end date must follow the start date.");
      if (current) Object.assign(current, d); else state.discounts.push(d); return d;
    }
    case "save-return": {
      const order = state.orders.find(o => o.id === v.orderId); if (!order || !["shipped","delivered"].includes(order.fulfillment)) throw new StoreError("Choose a dispatched order eligible for a return. Cancel unshipped orders instead.");
      const current = state.returns.find(r => r.id === v.id); const status = choice(v.status, ["requested", "approved", "received", "closed", "declined"] as const, "return status");
      if (current && (current.status === "closed" || current.status === "declined") && status !== current.status) throw new StoreError("This return has already been resolved.");
      if (current?.restocked && (status === "declined" || status === "requested" || status === "approved")) throw new StoreError("Received and restocked returns cannot be moved back to an earlier status.");
      if (current && current.orderId !== order.id) throw new StoreError("A return cannot be moved to a different order.");
      const amount = number(v.amount, order.total); const otherRefunds = state.returns.filter(r => r.orderId === order.id && r.id !== current?.id && r.status !== "declined").reduce((s, r) => s + r.amount, 0);
      if (amount + otherRefunds > order.total) throw new StoreError("The combined refund amount exceeds the order total.");
      const r: StoreReturn = { id: current?.id ?? randomUUID(), orderId: order.id, reason: required(v.reason, "Return reason", 2000), amount, status, restocked: current?.restocked ?? false, notes: text(v.notes, 5000), createdAt: current?.createdAt ?? new Date().toISOString() };
      if (v.restock === true && !r.restocked) {
        if (status !== "received" && status !== "closed") throw new StoreError("Mark the return as received before restocking.");
        if (state.returns.some(item => item.orderId === order.id && item.restocked)) throw new StoreError("This order has already been restocked.");
        for (const line of order.items) { const p = state.products.find(p => p.id === line.productId); if (p) p.stock[line.size] = (p.stock[line.size] ?? 0) + line.quantity; } r.restocked = true;
      }
      if (current) Object.assign(current, r); else state.returns.unshift(r); return r;
    }
    case "message-status": {
      const message = state.messages.find(m => m.id === v.id); if (!message) throw new StoreError("Message not found.", 404);
      message.status = choice(v.status, ["new", "resolved"] as const, "message status"); message.notes = text(v.notes, 5000); return;
    }
    case "subscriber-status": {
      const subscriber = state.subscribers.find(s => s.id === v.id); if (!subscriber) throw new StoreError("Subscriber not found.", 404); subscriber.active = v.active === true; return;
    }
    case "settings": {
      const s = state.settings;
      s.storeName = required(v.storeName, "Store name"); s.email = email(v.email); s.phone = text(v.phone, 60); s.address = text(v.address, 1000); s.announcement = text(v.announcement, 300);
      s.freeShippingThreshold = number(v.freeShippingThreshold); s.standardShipping = number(v.standardShipping); s.expressShipping = number(v.expressShipping); s.returnsDays = integer(v.returnsDays, 365); s.lowStockThreshold = integer(v.lowStockThreshold, 1000); s.acceptingOrders = v.acceptingOrders === true;
      s.instagram = text(v.instagram, 300); if (s.instagram && !/^https:\/\/(www\.)?instagram\.com\//.test(s.instagram)) throw new StoreError("Use a full Instagram profile URL.");
      s.orderPrefix = required(v.orderPrefix, "Order prefix", 10).replace(/[^A-Za-z0-9]/g, "").toUpperCase(); if (!s.orderPrefix) throw new StoreError("Use letters or numbers for the order prefix."); return;
    }
    case "content": {
      if (!Array.isArray(v.hero) || !v.hero.length || v.hero.length > 8) throw new StoreError("Use between 1 and 8 hero slides.");
      const hero = v.hero.map((slide, i) => { const s = object(slide); const link = required(s.link, "Slide link", 300); if (!link.startsWith("/") || link.startsWith("//") || link.includes("\\")) throw new StoreError("Hero links must point to a page on this store."); return { id: text(s.id) || randomUUID(), name: required(s.name, "Slide name", 80), label: text(s.label, 100), title: required(s.title, "Headline", 40), italic: required(s.italic, "Second headline line", 40), note: text(s.note, 300), image: imagePath(s.image), alt: required(s.alt, "Image description", 250), link, product: required(s.product, "Link caption", 80), position: /^\d{1,3}% \d{1,3}%$/.test(text(s.position)) ? text(s.position) : "50% 50%", mobile: /^\d{1,3}% \d{1,3}%$/.test(text(s.mobile)) ? text(s.mobile) : "50% 50%", enabled: s.enabled === true }; });
      if (!hero.some(s => s.enabled)) throw new StoreError("Keep at least one hero slide enabled.");
      state.hero = hero;
      if (Array.isArray(v.pages)) state.pages = v.pages.map(raw => { const p = object(raw); const slug = required(p.slug, "Page URL", 80); if (!/^[a-z0-9-]+$/.test(slug)) throw new StoreError("Page URLs may contain lowercase letters and hyphens."); return { slug, title: required(p.title, "Page title"), body: text(p.body, 30000), published: p.published === true }; });
      return;
    }
    default: throw new StoreError("This action is not supported.");
  }
}
