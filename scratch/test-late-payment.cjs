const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const load = require('../scripts/lib/load-project.cjs')({ react: { cache: fn => fn } });

const { seedStore } = load('@/lib/server/store-repository');
const { createOrder } = load('@/lib/server/store-actions');
const { expirePendingOrders, applyNotification, checkoutHash, notificationHash } = load('@/lib/server/payhere');

console.log('================================================================');
console.log('LATE PAYMENT & INVENTORY INTEGRITY ISOLATED TEST');
console.log('================================================================\n');

const state = seedStore();
state.settings.acceptingOrders = true;

const MERCHANT_ID = 'TEST_MERCHANT_123';
const MERCHANT_SECRET = 'TEST_SECRET_ABC';
process.env.PAYHERE_MERCHANT_ID = MERCHANT_ID;
process.env.PAYHERE_MERCHANT_SECRET = MERCHANT_SECRET;
process.env.PAYHERE_MODE = 'sandbox';

// Pick active product and set isolated stock = 1
const product = state.products.find(p => p.status === 'active' && !['moonflower-halter-top', 'rose-dot-corset-top', 'midnight-flow-maxi-skirt'].includes(p.id));
const size = product.sizes[0];
product.stock[size] = 1;

console.log(`Initial stock for ${product.name} (${size}): ${product.stock[size]}`);
assert.equal(product.stock[size], 1);

// STEP 1: Customer A reserves the last unit
console.log('Step 1: Customer A reserves unit 1 via PayHere...');
const customerAInput = {
  customer: {
    name: 'Alice Tester',
    email: 'alice@example.test',
    phone: '0412345678',
    address: '123 Kangaroo St, Brisbane, QLD 4000, Australia'
  },
  items: [{ productId: product.id, size, quantity: 1, price: product.priceAud }],
  shipping: 'standard',
  acceptedTerms: true,
  requestId: 'req-cust-a-001'
};

const orderA = createOrder(state, customerAInput);
orderA.gateway = {
  provider: 'payhere',
  currency: 'AUD',
  status: 'pending',
  expiresAt: new Date(Date.now() + 30 * 60000).toISOString()
};

assert.equal(product.stock[size], 0, 'Stock must decrement from 1 to 0');
assert.equal(orderA.payment, 'unpaid');
assert.equal(orderA.fulfillment, 'unfulfilled');
console.log(`[PASS] Order A created (${orderA.number}). Stock is now: ${product.stock[size]}`);

// STEP 2: Fast forward 31 minutes -> Order A expires
console.log('Step 2: 31 minutes pass. Triggering expirePendingOrders...');
const futureTime = Date.now() + 31 * 60000;
expirePendingOrders(state, futureTime);

assert.equal(orderA.gateway.status, 'expired', 'Order A gateway status must be expired');
assert.equal(orderA.fulfillment, 'cancelled', 'Order A fulfillment must be cancelled');
assert.equal(product.stock[size], 1, 'Stock must be returned to inventory (0 -> 1)');
console.log(`[PASS] Order A expired and cancelled. Stock restored to: ${product.stock[size]}`);

// STEP 3: Customer B purchases that newly restored unit
console.log('Step 3: Customer B purchases the restocked unit...');
const customerBInput = {
  customer: {
    name: 'Bob Buyer',
    email: 'bob@example.test',
    phone: '0498765432',
    address: '456 Koala Way, Sydney, NSW 2000, Australia'
  },
  items: [{ productId: product.id, size, quantity: 1, price: product.priceAud }],
  shipping: 'standard',
  acceptedTerms: true,
  requestId: 'req-cust-b-002'
};

const orderB = createOrder(state, customerBInput);
orderB.gateway = {
  provider: 'payhere',
  currency: 'AUD',
  status: 'pending',
  expiresAt: new Date(Date.now() + 30 * 60000).toISOString()
};

assert.equal(product.stock[size], 0, 'Stock must decrement from 1 to 0 for Customer B');
console.log(`[PASS] Order B created (${orderB.number}). Stock is now: ${product.stock[size]}`);

// STEP 4: Late PayHere IPN arrives for Order A (Customer A completed payment late)
console.log('Step 4: Late PayHere webhook arrives for Order A with Status 2 (Paid)...');
const ipnPayload = {
  merchant_id: MERCHANT_ID,
  order_id: orderA.number,
  payment_id: 'PAYHERE_TXN_999888',
  payhere_amount: orderA.total.toFixed(2),
  payhere_currency: 'AUD',
  status_code: '2'
};
const sig = notificationHash(ipnPayload, MERCHANT_SECRET);
ipnPayload.md5sig = sig;

applyNotification(state, ipnPayload, MERCHANT_ID, MERCHANT_SECRET);

console.log('Step 5: Verifying late payment reconciliation & stock safety...');
assert.equal(orderA.payment, 'paid', 'Order A payment must be marked paid');
assert.equal(orderA.gateway.status, 'paid', 'Order A gateway status must be paid');
assert.equal(orderA.gateway.paymentId, 'PAYHERE_TXN_999888', 'Payment reference must be recorded');
assert.equal(orderA.fulfillment, 'cancelled', 'Fulfillment MUST remain cancelled until manual staff review');
assert.match(orderA.notes, /PAYMENT REVIEW/, 'Order A notes MUST be flagged with PAYMENT REVIEW');

// CRITICAL VERIFICATION: Stock must NOT have decremented to -1!
assert.equal(product.stock[size], 0, 'CRITICAL: Stock must NOT double-decrement to -1!');
assert.ok(product.stock[size] >= 0, 'CRITICAL: Inventory must never be negative');

// Verify Order B is completely untouched
assert.equal(orderB.items[0].quantity, 1);
assert.equal(orderB.payment, 'unpaid');
assert.equal(orderB.fulfillment, 'unfulfilled');

console.log('\n[PASS] All late-payment safety assertions passed:');
console.log('  1. Order marked paid and reference recorded');
console.log('  2. Fulfillment left cancelled with PAYMENT REVIEW audit banner');
console.log('  3. Stock was NOT double-decremented (remains 0, not -1)');
console.log('  4. Competing customer order remained completely intact\n');
console.log('================================================================');
console.log('LATE PAYMENT & FULFILLMENT SAFETY: FULLY VERIFIED PASS');
console.log('================================================================');
