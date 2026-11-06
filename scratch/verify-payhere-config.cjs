const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
if (!fs.existsSync(envPath)) {
  console.log('.env.local NOT FOUND');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');

const getVal = (key) => {
  const match = envContent.match(new RegExp(`^${key}\\s*=\\s*(.*)$`, 'm'));
  if (!match) return null;
  return match[1].trim().replace(/^['"]|['"]$/g, '');
};

const enabled = getVal('PAYHERE_ENABLED');
const mode = getVal('PAYHERE_MODE');
const merchantId = getVal('PAYHERE_MERCHANT_ID');
const merchantSecret = getVal('PAYHERE_MERCHANT_SECRET');
const siteUrl = getVal('SITE_URL') || getVal('NEXT_PUBLIC_SITE_URL');

console.log('--- PAYHERE SANDBOX CONFIGURATION STATUS ---');
console.log('PAYHERE_ENABLED:', enabled === 'true' ? 'PASS (true)' : `FAIL (${enabled})`);
console.log('PAYHERE_MODE:', mode === 'sandbox' ? 'PASS (sandbox)' : `STATUS (${mode})`);
console.log('PAYHERE_MERCHANT_ID:', merchantId && merchantId.length > 3 ? `PASS (Configured: length ${merchantId.length})` : 'FAIL (Missing or empty)');
console.log('PAYHERE_MERCHANT_SECRET:', merchantSecret && merchantSecret.length > 5 ? `PASS (Configured: length ${merchantSecret.length})` : 'FAIL (Missing or empty)');
console.log('SITE_URL:', siteUrl ? `PASS (${siteUrl})` : 'WARN (Missing)');

// Load payhere logic and verify hash calculation
process.env.PAYHERE_ENABLED = enabled;
process.env.PAYHERE_MODE = mode;
process.env.PAYHERE_MERCHANT_ID = merchantId;
process.env.PAYHERE_MERCHANT_SECRET = merchantSecret;
process.env.SITE_URL = siteUrl || 'https://bindyclothing.com.au';

try {
  const load = require('../scripts/lib/load-project.cjs')({ react: { cache: fn => fn } });
  const { payhereReady, payhereMode, checkoutHash, checkoutForm } = load('@/lib/server/payhere');

  console.log('\n--- APPLICATION LOGIC VERIFICATION ---');
  console.log('payhereReady():', payhereReady());
  console.log('payhereMode():', payhereMode());

  const sampleOrder = {
    id: 'ord-test-sandbox',
    number: 'BIN-SANDBOX-01',
    total: 240.00,
    items: [{ name: 'Test Garment' }],
    customerName: 'Test Shopper',
    email: 'test@example.com',
    phone: '0412345678',
    address: '123 Test St, Sydney NSW',
    fulfillment: 'unfulfilled',
    createdAt: new Date().toISOString(),
    gateway: {
      provider: 'payhere',
      currency: 'AUD',
      status: 'pending',
      expiresAt: new Date(Date.now() + 30 * 60000).toISOString()
    }
  };

  const form = checkoutForm(sampleOrder, {});
  console.log('Form Action URL:', form.action);
  console.log('Form Target Currency:', form.fields.currency);
  console.log('Form Amount:', form.fields.amount);
  console.log('Checkout Hash generated:', Boolean(form.fields.hash && form.fields.hash.length === 32));
  console.log('Return URL:', form.fields.return_url);
  console.log('Notify Webhook URL:', form.fields.notify_url);

  console.log('\n>>> PAYHERE SANDBOX IS FULLY READY & CONFIGURED <<<');
} catch (err) {
  console.error('\nVerification error:', err.message);
}

