const assert = require('node:assert/strict');
const load = require('../scripts/lib/load-project.cjs')({ react: { cache: fn => fn } });

const { seedStore } = load('@/lib/server/store-repository');
const { applyAction } = load('@/lib/server/store-actions');
const { isKnownCategorySlug } = load('@/lib/categories-config');

console.log('================================================================');
console.log('TESTING CATEGORIES & SUBCATEGORIES MANAGEMENT');
console.log('================================================================\n');

const state = seedStore();

// 1. Initial State Verification
console.log('1. Verifying default categories in seed store...');
assert.ok(Array.isArray(state.categories), 'state.categories must be an array');
assert.equal(state.categories.length, 4, 'Should have 4 default categories');
assert.deepEqual(
  state.categories.map(c => c.name),
  ['Dresses', 'Tops & Blouses', 'Two Piece Sets', 'Skirts & Pants']
);
console.log('[PASS] 4 default categories present with subcategories.');

// 2. Add New Category
console.log('\n2. Creating a new category: "Resort & Beachwear"...');
const newCat = applyAction(state, 'save-category', {
  name: 'Resort & Beachwear',
  slug: 'resort-and-beachwear',
  description: 'Relaxed linen pieces and breathable sunset silhouettes.',
  image: '/images/categories/resort.webp',
  subcategories: ['Linen Kaftans', 'Kimono Robes', 'Beach Wraps'],
  status: 'active',
  sortOrder: 5
});

assert.equal(newCat.name, 'Resort & Beachwear');
assert.equal(newCat.slug, 'resort-and-beachwear');
assert.equal(newCat.subcategories.length, 3);
assert.equal(state.categories.length, 5);
assert.ok(isKnownCategorySlug('resort-and-beachwear'), 'Newly added category slug must be registered in proxy config');
console.log('[PASS] Category created successfully and registered in proxy router.');

// 3. Validation Rules
console.log('\n3. Testing validation rules...');
assert.throws(() => {
  applyAction(state, 'save-category', {
    name: 'Duplicate Slug Test',
    slug: 'resort-and-beachwear' // duplicate slug
  });
}, /Another category is already using this URL slug/, 'Must reject duplicate slug');
console.log('[PASS] Duplicate slug rejected.');

assert.throws(() => {
  applyAction(state, 'save-category', {
    name: 'Admin Reserved',
    slug: 'admin' // reserved system path
  });
}, /reserved system path/, 'Must reject reserved path');
console.log('[PASS] Reserved slug rejected.');

assert.throws(() => {
  applyAction(state, 'save-category', {
    name: 'Invalid Slug',
    slug: 'Invalid Slug With Spaces!'
  });
}, /Category slug must contain only lowercase letters/, 'Must enforce kebab-case slug');
console.log('[PASS] Malformed slug rejected.');

// 4. Update Existing Category & Subcategories
console.log('\n4. Updating subcategories for "Resort & Beachwear"...');
const updatedCat = applyAction(state, 'save-category', {
  id: newCat.id,
  name: 'Resort & Beachwear',
  slug: 'resort-and-beachwear',
  subcategories: ['Linen Kaftans', 'Kimono Robes', 'Beach Wraps', 'Sun Hats'],
  sortOrder: 5,
  status: 'active'
});
assert.equal(updatedCat.subcategories.length, 4);
assert.ok(updatedCat.subcategories.includes('Sun Hats'));
console.log('[PASS] Subcategory "Sun Hats" added successfully.');

// 5. Deletion Guard for Assigned Products
console.log('\n5. Testing deletion guard when products are assigned...');
// Assign a product to the new category
state.products[0].category = 'Resort & Beachwear';
assert.throws(() => {
  applyAction(state, 'delete-category', { id: newCat.id });
}, /Cannot delete "Resort & Beachwear" because 1 product\(s\) are assigned to it/, 'Must prevent deleting category with assigned products');
console.log('[PASS] Deletion blocked while products are assigned.');

// Reassign product and delete category
console.log('\n6. Reassigning product and deleting empty category...');
state.products[0].category = 'Dresses';
const delResult = applyAction(state, 'delete-category', { id: newCat.id });
assert.equal(delResult.deleted, true);
assert.equal(state.categories.length, 4);
assert.ok(!isKnownCategorySlug('resort-and-beachwear'), 'Slug must be unregistered from proxy router upon deletion');
console.log('[PASS] Category deleted safely and slug unregistered.');

// 7. Auto-add new subcategory when saving product
console.log('\n7. Testing auto-adding new subcategory when saving product...');
const dressesCat = state.categories.find(c => c.name === 'Dresses');
assert.ok(!dressesCat.subcategories.includes('Evening Gowns'), 'Should not have Evening Gowns initially');

const savedProduct = applyAction(state, 'save-product', {
  id: 'evening-silk-gown',
  name: 'Evening Silk Gown',
  sku: 'BIN-EVN-001',
  category: 'Dresses',
  subCategory: 'Evening Gowns',
  collectionName: 'Serendipity',
  description: 'An exquisite floor-length evening silk gown.',
  fabric: '100% Raw Silk',
  colorName: 'Midnight Black',
  colorHex: '#101010',
  priceAud: 340,
  status: 'active',
  sizes: ['AU 8 (S)', 'AU 10 (M)'],
  stock: { 'AU 8 (S)': 3, 'AU 10 (M)': 4 },
  gallery: ['/images/products/dress-1.webp']
});

assert.equal(savedProduct.subCategory, 'Evening Gowns');
assert.ok(dressesCat.subcategories.includes('Evening Gowns'), 'Dresses category must now contain "Evening Gowns"');
console.log('[PASS] "Evening Gowns" was automatically appended to the Dresses subcategory list.');

console.log('\n================================================================');
console.log('ALL CATEGORY & SUBCATEGORY TESTS PASSED (100%)');
console.log('================================================================\n');

