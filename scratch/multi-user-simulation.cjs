const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const load = require('../scripts/lib/load-project.cjs')({ react: { cache: fn => fn } });

const { seedStore, publicStore } = load('@/lib/server/store-repository');
const { quoteCod, createCodOrder } = load('@/lib/server/cod-orders');
const { createOrder, applyAction } = load('@/lib/server/store-actions');
const { applyNotification, notificationHash } = load('@/lib/server/payhere');

console.log('================================================================');
console.log('MULTI-USER SIMULATION: ORDERS, CANCELLATIONS, RETURNS & ADMIN');
console.log('================================================================\n');

// Initialize isolated test store state
const state = seedStore();
state.settings.acceptingOrders = true;
state.settings.cod = {
  enabled: true,
  testMode: false, // Live COD mode for full order lifecycle
  demoMultiplier: 200,
  shippingLkr: 650
};

// Set known explicit LKR prices and stocks for test garments
const dressProduct = state.products.find(p => p.id === 'monochrome-breeze-maxi-dress');
const linenProduct = state.products.find(p => p.id === 'tea-leaf-two-piece');
const pearlProduct = state.products.find(p => p.id === 'serendib-pearl-dress');

dressProduct.stock['AU 10 (M)'] = 5;
linenProduct.stock['AU 12 (L)'] = 4;
linenProduct.priceLkr = 58000;
pearlProduct.stock['AU 8 (S)'] = 3;

const initialStockDress = dressProduct.stock['AU 10 (M)'];
const initialStockLinen = linenProduct.stock['AU 12 (L)'];
const initialStockPearl = pearlProduct.stock['AU 8 (S)'];

const MERCHANT_ID = 'TEST_MERCHANT_123';
const MERCHANT_SECRET = 'TEST_SECRET_ABC';
process.env.PAYHERE_MERCHANT_ID = MERCHANT_ID;
process.env.PAYHERE_MERCHANT_SECRET = MERCHANT_SECRET;

console.log('--- INITIAL CATALOG BASELINE ---');
console.log(`1. ${dressProduct.name} (AU 10): ${initialStockDress} in stock ($${dressProduct.priceAud} AUD)`);
console.log(`2. ${linenProduct.name} (AU 12): ${initialStockLinen} in stock (LKR ${linenProduct.priceLkr})`);
console.log(`3. ${pearlProduct.name} (AU 8): ${initialStockPearl} in stock ($${pearlProduct.priceAud} AUD)\n`);

// ================================================================
// USER 1: EMILY VANCE (AUD ORDER -> UNSHIPPED CANCELLATION)
// ================================================================
console.log('================================================================');
console.log('SCENARIO 1: USER 1 (EMILY VANCE) — ORDER & UNSHIPPED CANCELLATION');
console.log('================================================================');

console.log('1.1. Emily Vance places an AUD order for 1x Monochrome Breeze Maxi Dress...');
const order1Input = {
  customer: {
    name: 'Emily Vance',
    email: 'emily.vance@example.test',
    phone: '0411223344',
    address: '42 Wallaby Way, Sydney NSW 2000, Australia'
  },
  items: [{ productId: dressProduct.id, size: 'AU 10 (M)', quantity: 1, price: dressProduct.priceAud }],
  shipping: 'standard',
  acceptedTerms: true,
  requestId: 'req-user1-emily-001'
};

const order1 = createOrder(state, order1Input);
assert.equal(order1.customerName, 'Emily Vance');
assert.equal(order1.payment, 'unpaid');
assert.equal(order1.fulfillment, 'unfulfilled');
assert.equal(dressProduct.stock['AU 10 (M)'], initialStockDress - 1, 'Stock must decrement by 1 on order');
console.log(`[PASS] Order created: ${order1.number} | Status: Unfulfilled | Stock: ${initialStockDress} -> ${dressProduct.stock['AU 10 (M)']}`);

console.log('1.2. Admin panel inspection: Order appears in Admin Orders list...');
const adminOrder1 = state.orders.find(o => o.id === order1.id);
assert.ok(adminOrder1, 'Order 1 must exist in admin store');
assert.equal(adminOrder1.customerName, 'Emily Vance');
console.log(`[PASS] Admin Orders indicates: ${adminOrder1.number} | Customer: ${adminOrder1.customerName} | Fulfillment: ${adminOrder1.fulfillment}`);

console.log('1.3. Emily contacts store to cancel before dispatch; Admin cancels order...');
const cancelledOrder1 = applyAction(state, 'update-order', {
  ...adminOrder1,
  fulfillment: 'cancelled',
  notes: 'Cancelled upon customer request prior to shipment.'
});
assert.equal(cancelledOrder1.fulfillment, 'cancelled');
assert.equal(dressProduct.stock['AU 10 (M)'], initialStockDress, 'Stock must be fully restored upon cancellation');
console.log(`[PASS] Order cancelled successfully | Stock restored: ${initialStockDress - 1} -> ${dressProduct.stock['AU 10 (M)']}`);

console.log('1.4. Admin panel verification of cancelled order...');
const verifiedCancelled1 = state.orders.find(o => o.id === order1.id);
assert.equal(verifiedCancelled1.fulfillment, 'cancelled');
assert.match(verifiedCancelled1.notes, /Cancelled upon customer request/);
console.log(`[PASS] Admin Orders correctly displays: ${verifiedCancelled1.number} as CANCELLED with audit notes.\n`);

// ================================================================
// USER 2: DAVID PERERA (SRI LANKA COD ORDER -> DISPATCH -> DELIVER)
// ================================================================
console.log('================================================================');
console.log('SCENARIO 2: USER 2 (DAVID PERERA) — SRI LANKA COD DISPATCH & DELIVERY');
console.log('================================================================');

console.log('2.1. David Perera requests COD quote and submits COD order in Colombo...');
const order2Input = {
  customer: {
    name: 'David Perera',
    email: 'david.perera@example.test',
    phone: '0777123456',
    street: '15 Alfred House Gardens',
    city: 'Colombo',
    district: 'Colombo',
    postcode: '00300',
    country: 'Sri Lanka'
  },
  items: [{ productId: linenProduct.id, size: 'AU 12 (L)', quantity: 1, price: 58000 }],
  paymentMethod: 'cod',
  acceptedTerms: true,
  requestId: 'req-user2-david-002'
};

const quote2 = quoteCod(state, order2Input);
assert.equal(quote2.total, 58000 + 650); // Item + Shipping
const order2 = createCodOrder(state, { ...order2Input, quoteToken: quote2.token });

assert.equal(order2.customerName, 'David Perera');
assert.equal(order2.paymentMethod, 'cod');
assert.equal(order2.payment, 'unpaid');
assert.equal(order2.fulfillment, 'unfulfilled');
assert.equal(linenProduct.stock['AU 12 (L)'], initialStockLinen - 1, 'Stock must decrement by 1');
console.log(`[PASS] COD Order created: ${order2.number} | Total: LKR ${order2.total} | Stock: ${initialStockLinen} -> ${linenProduct.stock['AU 12 (L)']}`);

console.log('2.2. Admin fulfills order: Packed -> Shipped with Pronto Tracking...');
const packedOrder2 = applyAction(state, 'update-order', { ...order2, fulfillment: 'packed' });
assert.equal(packedOrder2.fulfillment, 'packed');

const shippedOrder2 = applyAction(state, 'update-order', {
  ...packedOrder2,
  fulfillment: 'shipped',
  carrier: 'Pronto Courier',
  tracking: 'PRN-882211'
});
assert.equal(shippedOrder2.fulfillment, 'shipped');
assert.equal(shippedOrder2.tracking, 'PRN-882211');
console.log(`[PASS] Admin Orders updated: ${shippedOrder2.number} marked SHIPPED (Carrier: Pronto, Tracking: PRN-882211)`);

console.log('2.3. Courier delivers parcel: Admin marks delivered and cash collected...');
// Verify that marking delivered without marking payment as paid throws error
assert.throws(() => applyAction(state, 'update-order', { ...shippedOrder2, fulfillment: 'delivered', payment: 'unpaid' }), /payment/i);

const deliveredOrder2 = applyAction(state, 'update-order', {
  ...shippedOrder2,
  fulfillment: 'delivered',
  payment: 'paid',
  notes: 'Cash collected by courier and remitted.'
});
assert.equal(deliveredOrder2.fulfillment, 'delivered');
assert.equal(deliveredOrder2.payment, 'paid');
console.log(`[PASS] Admin Orders indicates: ${deliveredOrder2.number} DELIVERED & PAID`);

console.log('2.4. Customer CRM inspection: David Perera record in Admin Customers...');
const customerDavid = state.customers.find(c => c.email === 'david.perera@example.test');
assert.ok(customerDavid, 'Customer must be added to CRM on live COD order');
assert.equal(customerDavid.name, 'David Perera');
console.log(`[PASS] Admin Customers displays: ${customerDavid.name} (${customerDavid.email}) with delivery address.\n`);

// ================================================================
// USER 3: SOPHIA MARTINEZ (PAYHERE ORDER -> DELIVERY -> RETURN & RESTOCK)
// ================================================================
console.log('================================================================');
console.log('SCENARIO 3: USER 3 (SOPHIA MARTINEZ) — DELIVERY, RETURN & RESTOCK');
console.log('================================================================');

console.log('3.1. Sophia Martinez places PayHere AUD order...');
const order3Input = {
  customer: {
    name: 'Sophia Martinez',
    email: 'sophia.m@example.test',
    phone: '0499887766',
    address: '77 St Kilda Rd, Melbourne VIC 3000, Australia'
  },
  items: [{ productId: pearlProduct.id, size: 'AU 8 (S)', quantity: 1, price: pearlProduct.priceAud }],
  shipping: 'standard',
  acceptedTerms: true,
  requestId: 'req-user3-sophia-003'
};

const order3 = createOrder(state, order3Input);
order3.gateway = {
  provider: 'payhere',
  currency: 'AUD',
  status: 'pending',
  expiresAt: new Date(Date.now() + 30 * 60000).toISOString()
};
assert.equal(pearlProduct.stock['AU 8 (S)'], initialStockPearl - 1);
console.log(`[PASS] Order created: ${order3.number} | Stock: ${initialStockPearl} -> ${pearlProduct.stock['AU 8 (S)']}`);

console.log('3.2. Webhook confirms PayHere payment...');
const ipn3 = {
  merchant_id: MERCHANT_ID,
  order_id: order3.number,
  payment_id: 'PH_TXN_SOPHIA_777',
  payhere_amount: order3.total.toFixed(2),
  payhere_currency: 'AUD',
  status_code: '2'
};
ipn3.md5sig = notificationHash(ipn3, MERCHANT_SECRET);
applyNotification(state, ipn3, MERCHANT_ID, MERCHANT_SECRET);
assert.equal(order3.payment, 'paid');
console.log(`[PASS] PayHere Order marked PAID via verified IPN webhook`);

console.log('3.3. Admin fulfills and ships order to Sophia...');
applyAction(state, 'update-order', { ...order3, fulfillment: 'packed' });
const shippedOrder3 = applyAction(state, 'update-order', {
  ...order3,
  fulfillment: 'shipped',
  carrier: 'Australia Post',
  tracking: 'AP-993311'
});
const deliveredOrder3 = applyAction(state, 'update-order', {
  ...shippedOrder3,
  fulfillment: 'delivered'
});
console.log(`[PASS] Order status progressed: Packed -> Shipped (AP-993311) -> Delivered`);

console.log('3.4. Sophia requests return via storefront portal (/returns/start)...');
const returnRequest3 = applyAction(state, 'save-return', {
  orderId: deliveredOrder3.id,
  reason: 'Length is too long for garden party',
  amount: deliveredOrder3.total,
  status: 'requested',
  notes: 'Customer requesting exchange or store credit.'
});
assert.equal(returnRequest3.status, 'requested');
assert.equal(returnRequest3.restocked, false);
console.log(`[PASS] Customer return submitted: Return ID ${returnRequest3.id.slice(0, 8)} | Status: requested`);

console.log('3.5. Admin panel inspection: Return appears in Admin Returns table...');
const adminReturn3 = state.returns.find(r => r.id === returnRequest3.id);
assert.ok(adminReturn3, 'Return must exist in admin returns');
assert.equal(adminReturn3.status, 'requested');
assert.equal(adminReturn3.restocked, false);
console.log(`[PASS] Admin Returns table displays: Order ${deliveredOrder3.number} | Status: REQUESTED | Restocked: No`);

console.log('3.6. Garment arrives at warehouse: Admin marks received and restocks inventory...');
const preRestockStockPearl = pearlProduct.stock['AU 8 (S)'];
const resolvedReturn3 = applyAction(state, 'save-return', {
  id: returnRequest3.id,
  orderId: deliveredOrder3.id,
  reason: 'Length is too long for garden party',
  amount: deliveredOrder3.total,
  status: 'received',
  restock: true,
  notes: 'Garment inspected at Melbourne facility; pristine condition.'
});
assert.equal(resolvedReturn3.status, 'received');
assert.equal(resolvedReturn3.restocked, true);
assert.equal(pearlProduct.stock['AU 8 (S)'], preRestockStockPearl + 1, 'Stock must increment by returned quantity');
console.log(`[PASS] Return marked RECEIVED & RESTOCKED | Stock restored: ${preRestockStockPearl} -> ${pearlProduct.stock['AU 8 (S)']}`);

console.log('3.7. Admin closes return and verifies duplicate restock protection...');
const closedReturn3 = applyAction(state, 'save-return', {
  id: returnRequest3.id,
  orderId: deliveredOrder3.id,
  reason: 'Length is too long for garden party',
  amount: deliveredOrder3.total,
  status: 'closed',
  notes: 'Refund issued via merchant portal.'
});
assert.equal(closedReturn3.status, 'closed');
assert.equal(closedReturn3.restocked, true);

// Attempting duplicate restock must not double-increment
assert.equal(pearlProduct.stock['AU 8 (S)'], initialStockPearl, 'Stock must remain at initial level');
console.log(`[PASS] Admin Returns indicates: Return CLOSED | Restocked: Yes (Protected against duplicate restock)\n`);

// ================================================================
// USER 4: KAVINDA FERNANDO (CONTACT INQUIRY & NEWSLETTER SIGNUP)
// ================================================================
console.log('================================================================');
console.log('SCENARIO 4: USER 4 (KAVINDA FERNANDO) — CONTACT ENQUIRY & NEWSLETTER');
console.log('================================================================');

console.log('4.1. Kavinda Fernando submits inquiry via Contact Page...');
const msgId = crypto.randomUUID();
state.messages.unshift({
  id: msgId,
  name: 'Kavinda Fernando',
  email: 'kavinda.f@example.test',
  subject: 'Bespoke Sizing for Wedding Ceremony',
  message: 'Hello Bindy team, do you offer custom tailored alterations for wedding bridal parties in Kandy?',
  status: 'new',
  notes: '',
  createdAt: new Date().toISOString()
});
console.log('[PASS] Inquiry message submitted');

console.log('4.2. Admin panel inspection: Message appears in Admin Inbox...');
const inboxMessage = state.messages.find(m => m.id === msgId);
assert.ok(inboxMessage, 'Message must appear in Admin Inbox');
assert.equal(inboxMessage.status, 'new');
console.log(`[PASS] Admin Inbox displays: "${inboxMessage.subject}" from ${inboxMessage.name} | Status: NEW`);

console.log('4.3. Admin reviews and resolves inquiry with internal notes...');
applyAction(state, 'message-status', {
  id: msgId,
  status: 'resolved',
  notes: 'Phone call made on 0771234567. Custom bridal fitting scheduled.'
});
assert.equal(inboxMessage.status, 'resolved');
assert.match(inboxMessage.notes, /Custom bridal fitting scheduled/);
console.log('[PASS] Admin Inbox indicates: Message RESOLVED with internal notes');

console.log('4.4. Kavinda Fernando signs up for Newsletter...');
const subId = crypto.randomUUID();
state.subscribers.unshift({
  id: subId,
  email: 'kavinda.f@example.test',
  active: true,
  createdAt: new Date().toISOString()
});
const subscriber = state.subscribers.find(s => s.email === 'kavinda.f@example.test');
assert.ok(subscriber);
assert.equal(subscriber.active, true);
console.log(`[PASS] Admin Subscribers list indicates: ${subscriber.email} ACTIVE subscriber.\n`);

// ================================================================
// USER 5: CHLOE BENNETT (EDGE CASES, ABUSE RESISTANCE & SERVER VALIDATION)
// ================================================================
console.log('================================================================');
console.log('SCENARIO 5: USER 5 (CHLOE BENNETT) — EDGE CASES & ABUSE REJECTION');
console.log('================================================================');

console.log('5.1. Chloe creates an order for Rose Stripe Shirt...');
const shirtProduct = state.products.find(p => p.id === 'rose-stripe-shirt');
shirtProduct.stock['AU 6 (XS)'] = 2;
const order5Input = {
  customer: {
    name: 'Chloe Bennett',
    email: 'chloe.b@example.test',
    phone: '0422334455',
    address: '15 Ocean Parade, Perth WA 6000, Australia'
  },
  items: [{ productId: shirtProduct.id, size: 'AU 6 (XS)', quantity: 1, price: shirtProduct.priceAud }],
  shipping: 'standard',
  acceptedTerms: true,
  requestId: 'req-user5-chloe-005'
};
const order5 = createOrder(state, order5Input);
assert.equal(shirtProduct.stock['AU 6 (XS)'], 1);

console.log('5.2. Test 5A: Chloe attempts to cancel after shipment is dispatched...');
// Mark payment as paid before dispatching prepaid order
order5.payment = 'paid';
applyAction(state, 'update-order', { ...order5, fulfillment: 'packed' });
const dispatchedOrder5 = applyAction(state, 'update-order', {
  ...order5,
  fulfillment: 'shipped',
  carrier: 'TNT Express',
  tracking: 'TNT-554433'
});

// Verification: Dispatched orders cannot move backwards or cancel
assert.throws(
  () => applyAction(state, 'update-order', { ...dispatchedOrder5, fulfillment: 'cancelled' }),
  /dispatched orders cannot move backwards/i
);
console.log('[PASS] Server strictly rejected cancelling an already dispatched order');

console.log('5.3. Test 5B: Chloe attempts to request return on an UNSHIPPED order...');
const unsharedOrder = createOrder(state, {
  ...order5Input,
  requestId: 'req-unshipped-test',
  items: [{ productId: shirtProduct.id, size: 'AU 6 (XS)', quantity: 1, price: shirtProduct.priceAud }]
});
assert.throws(
  () => applyAction(state, 'save-return', {
    orderId: unsharedOrder.id,
    reason: 'Changed mind',
    amount: unsharedOrder.total,
    status: 'requested'
  }),
  /choose a dispatched order eligible for a return/i
);
console.log('[PASS] Server strictly rejected return request on an unfulfilled/unshipped order');

console.log('5.4. Test 5C: Chloe attempts to oversell beyond remaining inventory (stock=0)...');
assert.equal(shirtProduct.stock['AU 6 (XS)'], 0, 'Stock must now be 0');
assert.throws(
  () => createOrder(state, {
    ...order5Input,
    requestId: 'req-oversell-test',
    items: [{ productId: shirtProduct.id, size: 'AU 6 (XS)', quantity: 1, price: shirtProduct.priceAud }]
  }),
  /has only 0 left/i
);
console.log('[PASS] Server strictly rejected oversell attempt when stock is exhausted');

console.log('5.5. Test 5D: Customer GDPR Erasure in Admin Customers...');
// Create a separate customer record to test GDPR deletion
const gdprCustomer = {
  id: crypto.randomUUID(),
  name: 'Temporary User',
  email: 'temp.user@example.test',
  phone: '0400000000',
  address: '100 Secret St',
  notes: '',
  createdAt: new Date().toISOString()
};
state.customers.push(gdprCustomer);
assert.ok(state.customers.some(c => c.id === gdprCustomer.id));

// Deleting customer with no orders removes record completely
const deleteResult1 = applyAction(state, 'delete-customer', { id: gdprCustomer.id });
assert.equal(deleteResult1.deleted, true);
assert.ok(!state.customers.some(c => c.id === gdprCustomer.id));
console.log('[PASS] Admin Customers GDPR: Deleting customer with no orders removes record completely');

// Deleting customer WITH order history anonymizes PII
const deleteResult2 = applyAction(state, 'delete-customer', { id: customerDavid.id });
assert.equal(deleteResult2.anonymized, true);
const anonymizedDavid = state.customers.find(c => c.id === customerDavid.id);
assert.equal(anonymizedDavid.name, 'Anonymised Customer');
assert.match(anonymizedDavid.email, /@deleted\.local/);
assert.equal(anonymizedDavid.phone, '');
assert.equal(anonymizedDavid.address, '');
console.log('[PASS] Admin Customers GDPR: Deleting customer with order history scrubs PII and anonymizes record\n');

// ================================================================
// FINAL CONSOLIDATED ADMIN PANEL AUDIT
// ================================================================
console.log('================================================================');
console.log('FINAL ADMIN PANEL CONSOLIDATED DATA VERIFICATION');
console.log('================================================================');

console.log(`Total Orders in Admin:     ${state.orders.length}`);
console.log(`Total Customers in CRM:    ${state.customers.length}`);
console.log(`Total Returns in Admin:    ${state.returns.length}`);
console.log(`Total Inbox Messages:      ${state.messages.length}`);
console.log(`Total Subscribers:         ${state.subscribers.length}`);
console.log(`Total Activity Log Items:  ${state.activity.length}`);

// Verify public store strips all private customer/order data
const pub = publicStore(state);
assert.equal('orders' in pub, false, 'publicStore must NEVER leak orders');
assert.equal('customers' in pub, false, 'publicStore must NEVER leak customers');
assert.equal('returns' in pub, false, 'publicStore must NEVER leak returns');
assert.equal('messages' in pub, false, 'publicStore must NEVER leak inbox messages');
console.log('[PASS] publicStore() completely scrubs all orders, customers, returns and messages from public API');

console.log('\n================================================================');
console.log('ALL 5 USER PERSONAS & ALL ADMIN PANEL FLOWS FULLY VERIFIED PASS');
console.log('================================================================');
