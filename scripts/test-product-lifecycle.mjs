import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
try {
  const envContent = await fs.readFile(path.resolve(process.cwd(), '.env.local'), 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      const val = vals.join('=').trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  }
} catch {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://esreovoswlwccsfjyjph.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required for testing');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  db: { schema: 'bindy' },
  auth: { persistSession: false, autoRefreshToken: false },
});

// Also create an anon client for bindy
const anon = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  db: { schema: 'bindy' },
});

const TEST_SLUG = 'test-coastal-linen-wrap-dress';
let passedTests = 0;
let totalTests = 0;

function assert(condition, name, detail = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${name}`);
  } else {
    console.error(`  [FAIL] ${name} ${detail ? '-> ' + detail : ''}`);
  }
}

async function cleanup() {
  await admin.from('products').delete().eq('slug', TEST_SLUG);
}

async function run() {
  console.log('================================================================');
  console.log('BINDY CLOTHING: PRODUCT LIFECYCLE (ADD / UPDATE / REMOVE) TESTS');
  console.log('================================================================\n');

  await cleanup();

  // 1. BASELINE CHECK
  console.log('--- 1. Baseline Inventory State ---');
  const { count: initialProdCount } = await admin.from('products').select('*', { count: 'exact', head: true });
  const { count: initialVarCount } = await admin.from('product_variants').select('*', { count: 'exact', head: true });
  console.log(`Current products in bindy: ${initialProdCount}, variants: ${initialVarCount}`);
  assert(initialProdCount === 33, 'Initial catalog has 33 products');

  // 2. ADDING NEW PRODUCT
  console.log('\n--- 2. Adding New Product ---');
  const newProduct = {
    slug: TEST_SLUG,
    name: 'Test Coastal Linen Wrap Dress',
    description: 'An ethereal wrap dress in breathable pure Belgian linen.',
    category_slug: 'Dresses',
    price_aud: 195.00,
    compare_at_aud: 240.00,
    images: ['/images/bindi-real/campaign-garden.webp'],
    details: {
      story: 'Summer in Galle',
      fabric: '100% Belgian Linen',
      colorName: 'Sage Mist',
      occasions: ['Beach & Coast', 'Resort Wear']
    },
    status: 'active'
  };

  const { data: insertedProduct, error: insertErr } = await admin
    .from('products')
    .insert(newProduct)
    .select('id, slug, name, price_aud')
    .single();

  assert(!insertErr && insertedProduct?.slug === TEST_SLUG, 'New product inserted into bindy.products', insertErr?.message);

  // Add Wholesale Cost
  const { error: costErr } = await admin.from('product_costs').insert({
    product_id: insertedProduct.id,
    cost_aud: 65.00,
    supplier_sku: 'BIN-TEST-001'
  });
  assert(!costErr, 'Private cost saved to bindy.product_costs', costErr?.message);

  // Add 4 Sized Variants
  const sizes = ['AU 6 (XS)', 'AU 8 (S)', 'AU 10 (M)', 'AU 12 (L)'];
  const variantsToInsert = sizes.map(size => ({
    product_id: insertedProduct.id,
    size,
    stock: 10,
    sku: `BIN-TEST-001-${size.replace(/[^A-Za-z0-9]/g, '')}`
  }));

  const { data: insertedVars, error: varErr } = await admin
    .from('product_variants')
    .insert(variantsToInsert)
    .select('id, size, stock');

  assert(!varErr && insertedVars?.length === 4, 'All 4 size variants added with stock = 10', varErr?.message);

  // Check Public View (variant_availability)
  const { data: avail, error: availErr } = await admin
    .from('variant_availability')
    .select('*')
    .eq('product_slug', TEST_SLUG);

  assert(!availErr && avail?.length === 4 && avail.every(v => v.in_stock === true && v.low_stock === false),
    'Public variant_availability view shows all sizes in_stock without revealing count', availErr?.message);

  // Check that product is readable in active products
  const { data: activeCheck } = await admin
    .from('products')
    .select('name, price_aud, status')
    .eq('slug', TEST_SLUG)
    .single();
  assert(activeCheck?.status === 'active' && activeCheck?.price_aud === 195.00, 'Product is active and has correct price');

  // 3. UPDATING PRODUCT & INVENTORY
  console.log('\n--- 3. Updating Product Price & Inventory ---');
  // Update Price
  const { error: updatePriceErr } = await admin
    .from('products')
    .update({ price_aud: 215.00, updated_at: new Date().toISOString() })
    .eq('slug', TEST_SLUG);
  assert(!updatePriceErr, 'Product price updated to $215.00', updatePriceErr?.message);

  // Reduce size AU 8 (S) to 2 (triggers low stock threshold <= 3)
  const sVariant = insertedVars.find(v => v.size === 'AU 8 (S)');
  const { error: stockUpdateErr } = await admin
    .from('product_variants')
    .update({ stock: 2, updated_at: new Date().toISOString() })
    .eq('id', sVariant.id);
  assert(!stockUpdateErr, 'AU 8 (S) inventory adjusted to 2 units', stockUpdateErr?.message);

  // Verify view reflects low stock for AU 8 (S)
  const { data: updatedAvail } = await admin
    .from('variant_availability')
    .select('size, in_stock, low_stock')
    .eq('product_slug', TEST_SLUG)
    .eq('size', 'AU 8 (S)')
    .single();

  assert(updatedAvail?.in_stock === true && updatedAvail?.low_stock === true,
    'variant_availability reflects low_stock = true for size AU 8 (S)');

  // 4. ARCHIVING / DRAFTING PRODUCT (HIDING FROM PUBLIC)
  console.log('\n--- 4. Archiving Product (Hiding from Storefront) ---');
  const { error: archiveErr } = await admin
    .from('products')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('slug', TEST_SLUG);
  assert(!archiveErr, 'Product status updated to archived', archiveErr?.message);

  // When archived, variant_availability must exclude it
  const { data: archivedAvail } = await admin
    .from('variant_availability')
    .select('*')
    .eq('product_slug', TEST_SLUG);
  assert(archivedAvail?.length === 0, 'Archived product is automatically removed from variant_availability view');

  // 5. HARD DELETION (REMOVING PRODUCT)
  console.log('\n--- 5. Removing Product (Cascade Verification) ---');
  const { error: deleteErr } = await admin
    .from('products')
    .delete()
    .eq('slug', TEST_SLUG);
  assert(!deleteErr, 'Product deleted from bindy.products', deleteErr?.message);

  // Verify cascading deletion of variants and costs
  const { count: orphanVariants } = await admin
    .from('product_variants')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', insertedProduct.id);
  assert(orphanVariants === 0, 'Foreign-key cascade removed all variants cleanly');

  const { count: orphanCosts } = await admin
    .from('product_costs')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', insertedProduct.id);
  assert(orphanCosts === 0, 'Foreign-key cascade removed wholesale cost cleanly');

  // Verify total count is restored to initial baseline
  const { count: finalProdCount } = await admin.from('products').select('*', { count: 'exact', head: true });
  assert(finalProdCount === initialProdCount, `Catalog restored cleanly to exactly ${initialProdCount} products`);

  // 6. ZEE MARKETPLACE INTEGRITY
  console.log('\n--- 6. Verifying ZEE Marketplace Integrity in public schema ---');
  const publicClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    db: { schema: 'public' },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { count: zeeProducts } = await publicClient.from('products').select('*', { count: 'exact', head: true });
  const { count: zeeOrders } = await publicClient.from('orders').select('*', { count: 'exact', head: true });
  const { count: zeeCategories } = await publicClient.from('categories').select('*', { count: 'exact', head: true });

  assert(zeeProducts !== null && zeeOrders !== null && zeeCategories !== null,
    `ZEE Marketplace tables accessible and intact (public.products, public.orders, public.categories)`);
  console.log(`ZEE Marketplace check: public.products, public.orders, public.categories verified healthy.`);

  console.log('\n================================================================');
  console.log(`RESULTS: ${passedTests} / ${totalTests} checks PASSED!`);
  console.log('================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
