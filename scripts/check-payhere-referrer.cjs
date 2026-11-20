// Intercept gateway navigation before it leaves Chromium. No order or payment is created.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = new URL(process.env.CHECKOUT_BASE_URL || 'http://localhost:3023').origin;
const baseline = process.argv.includes('--expect-suppressed');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  try {
    const context = await browser.newContext();
    for (const path of ['/checkout?referrer_probe=private', '/payment/return?token=private-referrer-probe']) {
      for (const gateway of ['https://www.payhere.lk/pay/checkout', 'https://sandbox.payhere.lk/pay/checkout']) {
        const page = await context.newPage();
        let captured;
        await page.route(gateway, async route => {
          captured = await route.request().allHeaders();
          assert.equal(route.request().method(), 'POST');
          await route.fulfill({ contentType: 'text/html', body: '<h1>Gateway intercepted locally</h1>' });
        });
        const response = await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
        const checkout = path.startsWith('/checkout');
        const permitted = checkout && !baseline;
        assert.equal(response.headers()['referrer-policy'], permitted ? 'strict-origin-when-cross-origin' : 'no-referrer');
        await page.evaluate(action => {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = action;
          document.body.appendChild(form);
          form.submit();
        }, gateway);
        await page.getByRole('heading', { name: 'Gateway intercepted locally' }).waitFor();
        assert.equal(captured.referer, permitted ? base + '/' : undefined);
        console.log(`PASS: ${checkout ? 'checkout' : 'payment return'} → ${new URL(gateway).hostname}: ${captured.referer || 'Referer suppressed'}`);
        await page.close();
      }
    }
    // Buy Now uses client-side routing: the original product document's HTTP
    // policy survives, so checkout must also update its route metadata.
    const page = await context.newPage();
    page.setDefaultTimeout(30000);
    await page.addInitScript(() => localStorage.setItem('bindy_market', 'Sri Lanka'));
    const storefrontLoaded = page.waitForResponse(response => response.url().endsWith('/api/storefront'));
    await page.goto(base + '/product/rose-stripe-strapless-dress', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await storefrontLoaded;
    const consent = page.getByRole('button', { name: 'Essential only', exact: true });
    if (await consent.isVisible()) await consent.click();
    await page.getByRole('button', { name: 'Buy it now', exact: true }).click();
    await page.waitForURL('**/checkout?mode=buynow', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Your delivery details', exact: true }).waitFor();
    if (!baseline) await page.waitForFunction(() => document.querySelector('meta[name="referrer"]')?.content === 'strict-origin-when-cross-origin');
    let clientReferer;
    await page.route('https://www.payhere.lk/pay/checkout', async route => {
      clientReferer = (await route.request().allHeaders()).referer;
      await route.fulfill({ contentType: 'text/html', body: '<h1>Client navigation intercepted</h1>' });
    });
    await page.evaluate(() => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.payhere.lk/pay/checkout';
      document.body.appendChild(form);
      form.submit();
    });
    await page.getByRole('heading', { name: 'Client navigation intercepted' }).waitFor();
    assert.equal(clientReferer, baseline ? undefined : base + '/');
    console.log(`PASS: product Buy Now client navigation: ${clientReferer || 'Referer suppressed'}`);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await page.getByRole('link', { name: 'Continue shopping', exact: true }).click();
    await page.waitForURL('**/collection', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('meta[name="referrer"]')?.content === 'no-referrer');
    await page.evaluate(() => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.payhere.lk/pay/checkout';
      document.body.appendChild(form);
      form.submit();
    });
    await page.getByRole('heading', { name: 'Client navigation intercepted' }).waitFor();
    assert.equal(clientReferer, undefined);
    console.log('PASS: leaving checkout restores suppressed Referer.');
    await page.close();
    console.log('PASS: no gateway requests, production orders or charges; private query parameters never forwarded.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
