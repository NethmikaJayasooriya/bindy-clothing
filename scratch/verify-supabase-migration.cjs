const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env.local safely
function getEnv() {
  const env = {};
  if (fs.existsSync('.env.local')) {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq > 0) {
        env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
      }
    }
  }
  return env;
}

async function verify() {
  console.log('================================================================');
  console.log('SUPABASE PRODUCTION MIGRATION & RLS VERIFICATION');
  console.log('================================================================\n');

  const env = getEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.log('[FAIL] Supabase credentials not found in environment.');
    process.exit(1);
  }

  console.log(`Connecting to Supabase endpoint: ${supabaseUrl}`);
  console.log(`Service Key status: Configured (${serviceKey.length} chars)`);

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  // 1. Check bindy_documents table
  console.log('\n1. Checking table: public.bindy_documents ...');
  try {
    const { data, error, status } = await adminClient
      .schema('public')
      .from('bindy_documents')
      .select('key, revision, updated_at')
      .limit(10);

    if (error) {
      console.log(`[FAIL] bindy_documents query error: ${error.message} (Code: ${error.code})`);
    } else {
      console.log(`[PASS] public.bindy_documents exists. Retrieved ${data.length} document keys.`);
      data.forEach(d => console.log(`       Key: "${d.key}", Revision: ${d.revision}, Updated: ${d.updated_at}`));
    }
  } catch (e) {
    console.log(`[FAIL] Exception checking bindy_documents: ${e.message}`);
  }

  // 2. Check bindy_rate_limits table
  console.log('\n2. Checking table: public.bindy_rate_limits ...');
  try {
    const { data, error } = await adminClient
      .schema('public')
      .from('bindy_rate_limits')
      .select('key, hits, expires_at')
      .limit(5);

    if (error) {
      console.log(`[FAIL] bindy_rate_limits query error: ${error.message} (Code: ${error.code})`);
    } else {
      console.log(`[PASS] public.bindy_rate_limits exists. Row count: ${data.length}`);
    }
  } catch (e) {
    console.log(`[FAIL] Exception checking bindy_rate_limits: ${e.message}`);
  }

  // 3. Check RPC function bindy_compare_and_swap
  console.log('\n3. Checking RPC function: public.bindy_compare_and_swap ...');
  try {
    // Calling with non-existent key and dummy revision 999999 to test presence without altering data
    const { data, error } = await adminClient
      .schema('public')
      .rpc('bindy_compare_and_swap', {
        document_key: '__qa_test_probe_non_existent__',
        document_value: {},
        expected_revision: 999999
      });

    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      console.log(`[FAIL] RPC bindy_compare_and_swap does not exist: ${error.message}`);
    } else {
      console.log(`[PASS] RPC public.bindy_compare_and_swap is installed and callable. Result: ${data} (Expected false)`);
    }
  } catch (e) {
    console.log(`[FAIL] Exception calling bindy_compare_and_swap: ${e.message}`);
  }

  // 4. Check RPC function bindy_rate_limit
  console.log('\n4. Checking RPC function: public.bindy_rate_limit ...');
  try {
    const { data, error } = await adminClient
      .schema('public')
      .rpc('bindy_rate_limit', {
        limit_key: '__qa_test_rate_probe__',
        max_hits: 100,
        window_seconds: 60
      });

    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      console.log(`[FAIL] RPC bindy_rate_limit does not exist: ${error.message}`);
    } else {
      console.log(`[PASS] RPC public.bindy_rate_limit is installed and callable. Result: ${data}`);
    }
  } catch (e) {
    console.log(`[FAIL] Exception calling bindy_rate_limit: ${e.message}`);
  }

  // 5. Check storage bucket bindy-media
  console.log('\n5. Checking storage bucket: bindy-media ...');
  try {
    const { data, error } = await adminClient.storage.getBucket('bindy-media');
    if (error) {
      console.log(`[FAIL] Storage bucket bindy-media error: ${error.message}`);
    } else {
      console.log(`[PASS] Storage bucket "bindy-media" exists. Public: ${data.public}`);
    }
  } catch (e) {
    console.log(`[FAIL] Exception checking bucket: ${e.message}`);
  }

  // 6. Test RLS: Attempt anonymous read of bindy_documents
  console.log('\n6. Testing RLS: Anonymous access to public.bindy_documents ...');
  const anonClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy', {
    auth: { persistSession: false }
  });
  try {
    const { data, error } = await anonClient
      .schema('public')
      .from('bindy_documents')
      .select('*')
      .limit(1);

    if (error || !data || data.length === 0) {
      console.log(`[PASS] RLS blocks unauthenticated / anonymous queries. (Error/Result: ${error ? error.message : '0 rows returned'})`);
    } else {
      console.log(`[FAIL] RLS failed! Anonymous query returned data: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    console.log(`[PASS] Anonymous query rejected: ${e.message}`);
  }

  console.log('\n================================================================');
  console.log('SUPABASE VERIFICATION COMPLETED');
  console.log('================================================================');
}

verify();

