const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const load = require('../scripts/lib/load-project.cjs')({ react: { cache: fn => fn } });
const { seedStore } = load('@/lib/server/store-repository');

function getEnv() {
  const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
  const env = {};
  for (const l of lines) {
    const trimmed = l.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

async function verifyInventory() {
  const env = getEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase.schema('public').from('bindy_documents').select('value').eq('key', 'store').single();
  const dbProducts = data.value.products;
  const seed = seedStore().products;

  console.log('Comparing Supabase DB stock with seedStore stock:');
  let diffCount = 0;
  for (const sp of seed) {
    const dbp = dbProducts.find(p => p.id === sp.id);
    if (!dbp) {
      console.log('Missing product in DB:', sp.id);
      diffCount++;
      continue;
    }
    const seedSizes = Object.keys(sp.stock);
    for (const size of seedSizes) {
      if (sp.stock[size] !== dbp.stock[size]) {
        console.log(`Stock difference on ${sp.name} (${size}): Seed=${sp.stock[size]}, DB=${dbp.stock[size]}`);
        diffCount++;
      }
    }
  }
  if (diffCount === 0) {
    console.log('[PASS] PERFECT INVENTORY CLEANLINESS: 100% of product variant stocks in Supabase match default initial seed stock!');
  } else {
    console.log(`Found ${diffCount} inventory differences.`);
  }
}

verifyInventory();

