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

async function inspectActivity() {
  const env = getEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase.schema('public').from('bindy_documents').select('value, revision').eq('key', 'store').single();
  const activity = data.value.activity || [];
  console.log('Store Revision in DB:', data.revision);
  console.log('Total activity logs in DB:', activity.length);
  activity.slice(0, 15).forEach((a, i) => {
    console.log(`[${i}] ${a.createdAt}: ${a.description}`);
  });
}

inspectActivity();

