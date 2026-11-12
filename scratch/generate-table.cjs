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

  const withLkr = products.filter(p => p.priceLkr != null && p.priceLkr > 0);
  
  console.log('| Product Name | Category / Type | LKR Price | Current AUD | At 1 AUD = 200 LKR | Rounded AUD ($) |');
  console.log('| :--- | :--- | :--- | :--- | :--- | :--- |');

  withLkr.forEach(p => {
    const name = p.name || p.title || p.slug;
    const cat = p.category || '-';
    const lkr = p.priceLkr;
    const audCurrent = p.priceAud;
    const audAt200 = (lkr / 200).toFixed(2);
    const audRounded = Math.round(lkr / 200);
    const isDefault160 = audCurrent === 160 ? ' **(Default $160)**' : '';
    console.log(`| ${name} | ${cat} | Rs. ${lkr.toLocaleString()} | $${audCurrent}${isDefault160} | $${audAt200} | $${audRounded} |`);
  });
}

run().catch(console.error);

