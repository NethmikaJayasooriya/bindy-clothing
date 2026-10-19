const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const cache = new Map();
const storage = () => {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};
const browser = { localStorage: storage(), dispatchEvent: () => {} };
const session = storage();
function load(file) {
  if (file.startsWith('@/')) file = path.join(root, file.slice(2));
  if (!path.extname(file)) file += '.ts';
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }
  }).outputText;
  new Function('require', 'module', 'exports', 'window', 'sessionStorage', 'CustomEvent', compiled)(
    load, module, module.exports, browser, session, class CustomEvent {}
  );
  return module.exports;
}
const catalogue = load('@/lib/products');
const enriched = load('@/data/products');
const current = catalogue.getProduct('rose-stripe-strapless-dress');
assert.equal(catalogue.PRODUCTS.length, 33);
assert.equal(catalogue.PRODUCTS.filter(p => p.id === current.id).length, 1);
assert(!catalogue.PRODUCTS.some(p => p.id === 'lotus-memory-dress'));
assert.strictEqual(catalogue.getProduct('lotus-memory-dress'), current);
assert.equal(enriched.getProduct('lotus-memory-dress').id, current.id);
assert.equal(catalogue.getProduct('toString'), undefined);
assert.equal(current.priceAud, 235);
assert(current.image.includes('/bindi-real/'));
assert.equal(catalogue.getProductSeedIndex('cinnamon-flow-skirt'), 17);
assert.equal(enriched.getProduct('cinnamon-flow-skirt').inventoryCount, 14);
const old = { ...current, id: 'lotus-memory-dress', name: 'Lotus Memory Strapless Dress', priceAud: 240 };
const other = catalogue.getProduct('pearl-lace-blouse');
browser.localStorage.setItem('bindy-cart', JSON.stringify([
  { product: old, size: 'AU 8 (S)', quantity: 1 },
  { product: current, size: 'AU 8 (S)', quantity: 2 },
  { product: old, size: 'AU 10 (M)', quantity: 1 },
  { product: other, size: 'AU 8 (S)', quantity: 1 }
]));
const cart = load('@/lib/cart');
const items = cart.getCart();
assert.equal(items.length, 3);
assert.equal(cart.cartCount(items), 5);
assert.equal(items.find(p => p.product.id === current.id && p.size === 'AU 8 (S)').quantity, 3);
assert.equal(items[0].product.priceAud, 235);
assert.equal(items.find(p => p.product.id === other.id).quantity, 1);
session.setItem('bindy-buy-now-item', JSON.stringify({ product: old, size: 'AU 8 (S)', quantity: 1 }));
assert.equal(cart.getBuyNowItem().product.id, current.id);
browser.localStorage.setItem('bindy-wishlist', JSON.stringify(['lotus-memory-dress', current.id]));
const wishlist = load('@/lib/wishlist');
assert.equal(wishlist.getWishlist().length, 1);
assert(wishlist.isInWishlist('lotus-memory-dress'));
wishlist.removeFromWishlist('lotus-memory-dress');
assert.equal(wishlist.getWishlist().length, 0);
console.log('PASS: 33 unique products, legacy lookups, real photography, cart quantities/sizes, buy-now and wishlist migration.');
