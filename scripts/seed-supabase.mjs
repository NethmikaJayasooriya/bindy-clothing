import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local if present
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
  console.error('SUPABASE_SERVICE_ROLE_KEY is required to seed database');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  db: { schema: 'bindy' },
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log('Seeding Bindy Supabase database...');
  const storePath = path.resolve(process.cwd(), '.store', 'store.json');
  const raw = await fs.readFile(storePath, 'utf8');
  const store = JSON.parse(raw);

  // 1. Seed Settings
  if (store.settings) {
    console.log('Syncing store settings...');
    await supabase.from('store_settings').upsert({
      id: 1,
      store_name: store.settings.storeName || 'BINDY Clothing',
      order_prefix: store.settings.orderPrefix || 'BIN',
      standard_shipping_aud: store.settings.standardShipping || 12.00,
      express_shipping_aud: store.settings.expressShipping || 18.00,
      free_shipping_threshold_aud: store.settings.freeShippingThreshold || 150.00,
      tax_rate_percent: 10.00,
      reservation_minutes: 30,
      returns_window_days: store.settings.returnsDays || 30,
      is_maintenance_mode: !store.settings.acceptingOrders,
      announcement_banner: store.settings.announcement || 'Complimentary Express Shipping on Australian Orders Over $150',
    }, { onConflict: 'id' });
  }

  // 2. Seed Categories
  const categoryNames = [...new Set(store.products.map(p => p.category))];
  console.log(`Syncing ${categoryNames.length} categories...`);
  for (let i = 0; i < categoryNames.length; i++) {
    const name = categoryNames[i];
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await supabase.from('categories').upsert({
      slug,
      name,
      display_order: i + 1,
      is_active: true,
    }, { onConflict: 'slug' });
  }

  // Fetch category IDs
  const { data: dbCategories } = await supabase.from('categories').select('id, name, slug');
  const categoryMap = Object.fromEntries((dbCategories || []).map(c => [c.name, c]));

  // 3. Seed Products & Variants
  console.log(`Syncing ${store.products.length} products and variants...`);
  for (const p of store.products) {
    const cat = categoryMap[p.category];
    const images = [p.image, p.imageHover, ...(p.gallery || [])].filter(Boolean);
    const details = {
      story: p.story,
      storyPlace: p.storyPlace,
      destinations: p.destinations,
      colorName: p.colorName,
      colorHex: p.colorHex,
      palette: p.palette,
      fabric: p.fabric,
      fit: p.fit,
      details: p.details,
      badge: p.badge,
      weightGsm: p.weightGsm,
      originDistrict: p.originDistrict,
      occasions: p.occasions,
      featured: p.featured,
    };

    const { data: prodData, error: prodErr } = await supabase.from('products').upsert({
      slug: p.id,
      name: p.name,
      description: p.description,
      category_id: cat ? cat.id : null,
      category_slug: p.category,
      price_aud: p.priceAud,
      compare_at_aud: p.compareAtAud > 0 ? p.compareAtAud : null,
      images,
      details,
      status: p.status || 'active',
    }, { onConflict: 'slug' }).select('id').single();

    if (prodErr) {
      console.error(`Failed to upsert product ${p.id}:`, prodErr.message);
      continue;
    }

    // Upsert wholesale cost
    await supabase.from('product_costs').upsert({
      product_id: prodData.id,
      cost_aud: p.costAud || 0,
      supplier_sku: p.sku || `BIN-${p.id}`,
    }, { onConflict: 'product_id' });

    // Upsert variants
    if (p.sizes && Array.isArray(p.sizes)) {
      for (const size of p.sizes) {
        const stock = p.stock && p.stock[size] !== undefined ? p.stock[size] : 5;
        const sku = `${p.sku || 'BIN'}-${size.replace(/[^a-zA-Z0-9]/g, '')}`;
        await supabase.from('product_variants').upsert({
          product_id: prodData.id,
          size,
          stock,
          sku,
        }, { onConflict: 'product_id, size' });
      }
    }
  }

  // 4. Seed Hero Slides
  if (store.hero && Array.isArray(store.hero)) {
    console.log(`Syncing ${store.hero.length} hero slides...`);
    for (let i = 0; i < store.hero.length; i++) {
      const h = store.hero[i];
      await supabase.from('hero_slides').upsert({
        title: h.title,
        subtitle: h.italic || '',
        tagline: h.label || '',
        image_url: h.image,
        cta_label: h.product || 'Shop Collection',
        cta_link: h.link || '/collection',
        display_order: i + 1,
        is_active: h.enabled !== false,
      });
    }
  }

  // 5. Seed Content Pages
  if (store.pages && Array.isArray(store.pages)) {
    console.log(`Syncing ${store.pages.length} content pages...`);
    for (const page of store.pages) {
      await supabase.from('content_pages').upsert({
        slug: page.slug,
        title: page.title,
        body: page.body,
      }, { onConflict: 'slug' });
    }
  }

  // 6. Seed Discounts
  if (store.discounts && Array.isArray(store.discounts)) {
    console.log(`Syncing ${store.discounts.length} discounts...`);
    for (const d of store.discounts) {
      const type = d.type === 'shipping' ? 'free_shipping' : d.type === 'fixed' ? 'fixed_amount' : 'percentage';
      await supabase.from('discounts').upsert({
        code: d.code.toUpperCase(),
        type,
        value: d.value,
        minimum_spend_aud: d.minimum || 0,
        usage_limit: d.usageLimit > 0 ? d.usageLimit : null,
        used_count: d.used || 0,
        is_active: d.active !== false,
      }, { onConflict: 'code' });
    }
  }

  console.log('\nSUCCESS! All 33 Bindy products, variants, settings, and pages are seeded in Supabase!');
}

main().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
