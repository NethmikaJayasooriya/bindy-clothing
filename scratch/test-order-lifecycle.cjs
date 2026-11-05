const assert = require('node:assert/strict');
const load = require('../scripts/lib/load-project.cjs')({ react: { cache: fn => fn } });

const { seedStore } = load('@/lib/server/store-repository');
const { quoteCod, createCodOrder, codReceipt } = load('@/lib/server/cod-orders');
const { createOrder } = load('@/lib/server/store-actions');
const { applyAction } = load('@/lib/server/store-actions');
const { applyNotification, notificationHash } = load('@/lib/server/payhere');

console.log('================================================================');
console.log('COMPLETE ORDER LIFECYCLE VERIFICATION (COD & PAYHERE)');
console.log('================================================================\n');

// PART A: SRI LANKAN COD LIFECYCLE
console.log('--- PART A: SRI LANKAN CASH ON DELIVERY (LIVE MODE SIMULATION) ---');

const stateA = seedStore();
stateA.settings.acceptingOrders = true;
stateA.settings.cod = {
  enabled: true,
  testMode: false, // Live COD simulation
  demoMultiplier: 200,
  shippingLkr: 650
};

// Select product and set explicit LKR price and stock
const productA = stateA.products.find(p => p.status === 'active' && !['moonflower-halter-top', 'rose-dot-corset-top', 'midnight-flow-maxi-skirt'].includes(p.id));
const sizeA = productA.sizes[0];
productA.priceLkr = 4500;
productA.stock[sizeA] = 10;
const initialStockA = productA.stock[sizeA];

console.log(`Product: ${productA.name} | Size: ${sizeA} | Stock: ${initialStockA} | Price: LKR ${productA.priceLkr}`);

// 1. Customer creates a COD order
console.log('1. Customer requests COD quote and submits order...');
const codInput = {
  customer: {
    name: 'QA Test Customer',
    email: 'qa-test@example.test',
    phone: '0771234567',
    street: '123 Galle Road',
    city: 'Colombo',
    district: 'Colombo',
    postcode: '00300',
    country: 'Sri Lanka'
  },
  items: [{ productId: productA.id, size: sizeA, quantity: 2, price: 4500 }],
  paymentMethod: 'cod',
  acceptedTerms: true,
  requestId: 'qa-cod-lifecycle-001'
};

const quoteA = quoteCod(stateA, codInput);
assert.equal(quoteA.total, 4500 * 2 + 650); // 9650
assert.equal(quoteA.currency, 'LKR');

const codOrder = createCodOrder(stateA, { ...codInput, quoteToken: quoteA.token });
assert.equal(codOrder.paymentMethod, 'cod');
assert.equal(codOrder.total, 9650);
assert.equal(codOrder.payment, 'unpaid');
assert.equal(codOrder.fulfillment, 'unfulfilled');
assert.equal(productA.stock[sizeA], initialStockA - 2, 'Stock must decrement by 2');
console.log(`[PASS] COD Order created: ${codOrder.number}. Stock decremented: ${initialStockA} -> ${productA.stock[sizeA]}`);

// 2. Order appears in admin panel
assert.ok(stateA.orders.some(o => o.id === codOrder.id));
console.log('[PASS] Order appears in admin orders list');

// 3. Admin updates fulfillment: packed
console.log('2. Admin updates fulfillment: packed...');
const packedOrder = applyAction(stateA, 'update-order', { ...codOrder, fulfillment: 'packed' });
assert.equal(packedOrder.fulfillment, 'packed');
console.log('[PASS] Order fulfillment updated to packed');

// 4. Admin updates fulfillment: shipped (requires carrier and tracking)
console.log('3. Admin updates fulfillment: shipped...');
assert.throws(() => applyAction(stateA, 'update-order', { ...codOrder, fulfillment: 'shipped' }), /tracking/i);
const shippedOrder = applyAction(stateA, 'update-order', {
  ...codOrder,
  fulfillment: 'shipped',
  carrier: 'Pronto Delivery',
  tracking: 'PRN-998877'
});
assert.equal(shippedOrder.fulfillment, 'shipped');
assert.equal(shippedOrder.tracking, 'PRN-998877');
console.log('[PASS] Order shipped with tracking number PRN-998877');

// 5. Admin updates fulfillment: delivered & marks payment collected
console.log('4. Admin marks delivered and cash collected...');
// Delivery requires payment='paid' for COD
assert.throws(() => applyAction(stateA, 'update-order', { ...shippedOrder, fulfillment: 'delivered', payment: 'unpaid' }), /payment/i);
const deliveredOrder = applyAction(stateA, 'update-order', {
  ...shippedOrder,
  fulfillment: 'delivered',
  payment: 'paid'
});
assert.equal(deliveredOrder.fulfillment, 'delivered');
assert.equal(deliveredOrder.payment, 'paid');
console.log('[PASS] COD Order delivered and payment marked paid');

// 6. Return workflow: customer returns items
console.log('5. Return workflow: Customer requests return...');
const returnReq = applyAction(stateA, 'save-return', {
  orderId: deliveredOrder.id,
  reason: 'Size too large',
  amount: deliveredOrder.total,
  status: 'requested'
});
assert.equal(returnReq.status, 'requested');

// Admin marks return received
console.log('6. Admin receives return and restocks items...');
const preRestockStock = productA.stock[sizeA];
const receivedReturn = applyAction(stateA, 'save-return', {
  id: returnReq.id,
  orderId: deliveredOrder.id,
  reason: 'Size too large',
  amount: deliveredOrder.total,
  status: 'received',
  restock: true
});
assert.equal(receivedReturn.status, 'received');
assert.equal(receivedReturn.restocked, true);
assert.equal(productA.stock[sizeA], preRestockStock + 2, 'Stock must increment by order quantity on restock');
console.log(`[PASS] Return received & restocked. Stock: ${preRestockStock} -> ${productA.stock[sizeA]}`);

// Updating an already restocked return does not double-increment stock
applyAction(stateA, 'save-return', {
  id: returnReq.id,
  orderId: deliveredOrder.id,
  reason: 'Size too large',
  amount: deliveredOrder.total,
  status: 'closed',
  restock: true
});
assert.equal(productA.stock[sizeA], 10, 'Stock must stay 10 and not double-increment');

// Attempting a second restocked return for the same order is strictly rejected
assert.throws(() => applyAction(stateA, 'save-return', {
  orderId: deliveredOrder.id,
  reason: 'Second claim',
  amount: 0,
  status: 'received',
  restock: true
}), /already been restocked/i);
console.log('[PASS] Duplicate return restocking strictly rejected and stock stays at 10');

// PART B: PAYHERE LIFECYCLE
console.log('\n--- PART B: PAYHERE ONLINE LIFECYCLE ---');

const stateB = seedStore();
stateB.settings.acceptingOrders = true;

const MERCHANT_ID = 'TEST_MERCHANT_123';
const MERCHANT_SECRET = 'TEST_SECRET_ABC';
process.env.PAYHERE_MERCHANT_ID = MERCHANT_ID;
process.env.PAYHERE_MERCHANT_SECRET = MERCHANT_SECRET;

const productB = stateB.products.find(p => p.status === 'active' && !['moonflower-halter-top', 'rose-dot-corset-top', 'midnight-flow-maxi-skirt'].includes(p.id));
const sizeB = productB.sizes[0];
productB.stock[sizeB] = 5;
const initialStockB = productB.stock[sizeB];

// 1. Create PayHere Order
console.log('1. Customer reserves unit via PayHere...');
const payhereInput = {
  customer: {
    name: 'Sarah Connor',
    email: 'sarah@example.test',
    phone: '0412345678',
    address: '100 Terminator Blvd, Brisbane, QLD 4000, Australia'
  },
  items: [{ productId: productB.id, size: sizeB, quantity: 1, price: productB.priceAud }],
  shipping: 'standard',
  acceptedTerms: true,
  requestId: 'qa-payhere-lifecycle-002'
};

const payhereOrder = createOrder(stateB, payhereInput);
payhereOrder.gateway = {
  provider: 'payhere',
  currency: 'AUD',
  status: 'pending',
  expiresAt: new Date(Date.now() + 30 * 60000).toISOString()
};
assert.equal(productB.stock[sizeB], initialStockB - 1);
assert.equal(payhereOrder.payment, 'unpaid');
console.log(`[PASS] PayHere Order created: ${payhereOrder.number}. Stock: ${initialStockB} -> ${productB.stock[sizeB]}`);

// 2. PayHere Webhook confirms payment
console.log('2. Webhook arrives from PayHere (Status 2: Paid)...');
const webhookPayload = {
  merchant_id: MERCHANT_ID,
  order_id: payhereOrder.number,
  payment_id: 'PH_TXN_554433',
  payhere_amount: payhereOrder.total.toFixed(2),
  payhere_currency: 'AUD',
  status_code: '2'
};
webhookPayload.md5sig = notificationHash(webhookPayload, MERCHANT_SECRET);
applyNotification(stateB, webhookPayload, MERCHANT_ID, MERCHANT_SECRET);

assert.equal(payhereOrder.payment, 'paid');
assert.equal(payhereOrder.gateway.status, 'paid');
assert.equal(payhereOrder.gateway.paymentId, 'PH_TXN_554433');
console.log('[PASS] PayHere Order confirmed and marked paid');

// 3. Admin fulfillment: packed -> shipped
console.log('3. Admin ships PayHere order...');
applyAction(stateB, 'update-order', { ...payhereOrder, fulfillment: 'packed' });
const shippedPayhere = applyAction(stateB, 'update-order', {
  ...payhereOrder,
  fulfillment: 'shipped',
  carrier: 'Australia Post',
  tracking: 'AP-12345678'
});
assert.equal(shippedPayhere.fulfillment, 'shipped');
assert.equal(shippedPayhere.tracking, 'AP-12345678');
console.log('[PASS] PayHere Order shipped with Australia Post tracking');

// 4. Cancellation protection: cannot cancel shipped order
console.log('4. Cancellation safety...');
assert.throws(() => applyAction(stateB, 'update-order', { ...shippedPayhere, fulfillment: 'cancelled' }), /dispatched/i);
console.log('[PASS] Cannot cancel already shipped order');

console.log('\n================================================================');
console.log('CUSTOMER ORDER LIFECYCLE (COD & PAYHERE): ALL CHECKS PASSED');
console.log('================================================================');
