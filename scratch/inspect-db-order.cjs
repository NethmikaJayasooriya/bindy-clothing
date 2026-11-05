const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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

async function inspectOrder() {
  const env = getEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase.schema('public').from('bindy_documents').select('value').eq('key', 'store').single();
  const order = data.value.orders?.[0];
  if (!order) {
    console.log('No orders in DB');
    return;
  }
  console.log('Order Details:');
  console.log('Number:', order.number);
  console.log('Items:', JSON.stringify(order.items, null, 2));
  console.log('Customer:', order.customerName, '|', order.email);
  console.log('Notes:', order.notes);
}

inspectOrder();

