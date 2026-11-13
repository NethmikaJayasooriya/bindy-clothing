const reference = require('../../data/catalogue-reference-2026.json');

function applyCatalogueReference(state, now = new Date().toISOString()) {
  const counts = new Map();
  for (const p of reference.products) counts.set(p.catalogueCode, (counts.get(p.catalogueCode) || 0) + 1);
  const variants = new Map();
  const changed = [];
  for (const source of reference.products) {
    const existing = state.products.find(p => p.id === source.id);
    const variant = variants.get(source.catalogueCode) || 0;
    variants.set(source.catalogueCode, variant + 1);
    const sku = source.catalogueCode + (counts.get(source.catalogueCode) > 1 ? `-${String.fromCharCode(65 + variant)}` : '');
    const stock = existing?.stock ?? Object.fromEntries(source.sizes.map(size => [size, 0]));
    const next = {
      ...existing, ...source, sku, stock, status: 'active', featured: source.catalogueOrder === 1,
      compareAtAud: existing?.compareAtAud > source.priceAud ? existing.compareAtAud : 0,
      costAud: existing?.costAud ?? 0, lowStockThreshold: existing?.lowStockThreshold ?? state.settings.lowStockThreshold,
      badge: 'NEW', videoHover: undefined, imageSource: undefined,
      weightGsm: undefined, originDistrict: undefined, updatedAt: now,
      inventoryCount: source.sizes.reduce((n, size) => n + (stock[size] || 0), 0),
    };
    next.inventoryStatus = next.inventoryCount === 0 ? 'sold_out' : next.inventoryCount <= next.lowStockThreshold ? 'low_stock' : 'in_stock';
    if (existing) state.products[state.products.indexOf(existing)] = next;
    else state.products.push(next);
    changed.push({id: next.id, name: next.name, code: next.catalogueCode, priceLkr: next.priceLkr, new: !existing});
  }
  for (const product of state.products) {
    if (reference.removedProductIds.includes(product.id)) {
      product.status = 'archived';
      product.featured = false;
    }
    if (product.styleWith) product.styleWith = product.styleWith.filter(id => !reference.removedProductIds.includes(id));
  }
  return {changed, archived: reference.removedProductIds};
}

module.exports = { applyCatalogueReference, reference };
