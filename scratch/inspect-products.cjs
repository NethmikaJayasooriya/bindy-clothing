const fs = require('fs');
const path = require('path');

const env = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      }
    }
  });
}

const url = env['NEXT_PUBLIC_SUPABASE_URL'];
const key = env['SUPABASE_SERVICE_ROLE_KEY'];

async function run() {
  const res = await fetch(`${url}/rest/v1/bindy_documents?key=eq.store&select=value`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const data = await res.json();
  const products = data[0].value.products;
  console.log('Total products:', products.length);
  
  const withLkr = products.filter(p => p.priceLkr != null && p.priceLkr > 0);
  console.log('Products with LKR:', withLkr.length);

  console.log('\n--- ALL PRODUCTS WITH LKR ---');
  withLkr.forEach((p, idx) => {
    const title = p.name || p.title || p.slug;
    console.log(
      `${idx + 1}. [${p.id || p.slug}] "${title}" | LKR: ${p.priceLkr} | AUD: ${p.priceAud} | ratio: ${(p.priceLkr / p.priceAud).toFixed(2)}`
    );
  });
}

run().catch(console.error);
