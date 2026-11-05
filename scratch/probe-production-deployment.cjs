const https = require('https');
const http = require('http');

function fetchUrl(targetUrl, options = {}) {
  return new Promise((resolve) => {
    try {
      const u = new URL(targetUrl);
      const isHttps = u.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const req = client.request(u, {
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          ...(options.headers || {})
        },
        timeout: options.timeout || 10000
      }, (res) => {
        let data = '';
        res.on('data', chunk => {
          if (data.length < 50000) data += chunk; // capture first 50KB
        });
        res.on('end', () => {
          resolve({
            ok: true,
            status: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            location: res.headers.location,
            bodySnippet: data.slice(0, 500),
            fullBody: data
          });
        });
      });

      req.on('error', (err) => {
        resolve({
          ok: false,
          error: err.message,
          code: err.code
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          ok: false,
          error: 'Request timeout (10s)'
        });
      });

      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
      req.end();
    } catch (e) {
      resolve({
        ok: false,
        error: e.message
      });
    }
  });
}

async function run() {
  console.log('================================================================');
  console.log('PROBING LIVE PRODUCTION DEPLOYMENT: https://bindyclothing.com.au');
  console.log('================================================================\n');

  const tests = [
    // 1. Production Domain, SSL & www redirect
    { name: 'Apex HTTP -> HTTPS Redirect', url: 'http://bindyclothing.com.au/', expectedStatus: [301, 307, 308] },
    { name: 'Apex HTTPS (Live Site)', url: 'https://bindyclothing.com.au/', expectedStatus: [200] },
    { name: 'WWW HTTP Redirect', url: 'http://www.bindyclothing.com.au/', expectedStatus: [301, 307, 308] },
    { name: 'WWW HTTPS Redirect to Apex', url: 'https://www.bindyclothing.com.au/', expectedStatus: [301, 307, 308] },

    // 2. Core Customer Storefront Pages
    { name: 'Homepage', url: 'https://bindyclothing.com.au/', expectedStatus: [200] },
    { name: 'Collection Root', url: 'https://bindyclothing.com.au/collection', expectedStatus: [200] },
    { name: 'Category: Dresses', url: 'https://bindyclothing.com.au/collection/dresses', expectedStatus: [200] },
    { name: 'Category: Tops & Blouses', url: 'https://bindyclothing.com.au/collection/tops-and-blouses', expectedStatus: [200] },
    { name: 'Category: Skirts & Pants', url: 'https://bindyclothing.com.au/collection/skirts-and-pants', expectedStatus: [200] },
    { name: 'Category: Two Piece Sets', url: 'https://bindyclothing.com.au/collection/two-piece-sets', expectedStatus: [200] },
    { name: 'Proxy Invalid Category 404', url: 'https://bindyclothing.com.au/collection/invalid-test-category', expectedStatus: [404] },
    
    // 3. Product Details & Retired Garment Interception
    { name: 'Valid Product Detail', url: 'https://bindyclothing.com.au/product/tea-mist-shirt-maxi-dress', expectedStatus: [200] },
    { name: 'Proxy Retired Product: Moonflower Top', url: 'https://bindyclothing.com.au/product/moonflower-halter-top', expectedStatus: [404] },
    { name: 'Proxy Retired Product: Rose Dot Corset', url: 'https://bindyclothing.com.au/product/rose-dot-corset-top', expectedStatus: [404] },
    { name: 'Proxy Retired Product: Midnight Flow Maxi Skirt', url: 'https://bindyclothing.com.au/product/midnight-flow-maxi-skirt', expectedStatus: [404] },
    { name: 'Invalid Product Slug 404', url: 'https://bindyclothing.com.au/product/random-bogus-dress-slug-xyz', expectedStatus: [404] },
    
    // 4. Shopping Regions
    { name: 'Shopping Australia', url: 'https://bindyclothing.com.au/shopping/australia', expectedStatus: [200] },
    { name: 'Shopping Sri Lanka', url: 'https://bindyclothing.com.au/shopping/sri-lanka', expectedStatus: [200] },
    { name: 'Proxy Invalid Shopping Region 404', url: 'https://bindyclothing.com.au/shopping/antarctica', expectedStatus: [404] },

    // 5. Checkout & Cart
    { name: 'Checkout Page', url: 'https://bindyclothing.com.au/checkout', expectedStatus: [200] },
    { name: 'Generic Not Found Page', url: 'https://bindyclothing.com.au/definitely-not-a-real-page-404', expectedStatus: [404] },

    // 6. Admin Panel Protection
    { name: 'Admin Root Entry', url: 'https://bindyclothing.com.au/admin', expectedStatus: [200, 307] },
    { name: 'Admin Orders Section (Unauthorized)', url: 'https://bindyclothing.com.au/admin/orders', expectedStatus: [200, 307] },
    { name: 'Admin Products Section (Unauthorized)', url: 'https://bindyclothing.com.au/admin/products', expectedStatus: [200, 307] },

    // 7. Protected Admin API Endpoints
    { name: 'Admin API Store GET (Unauthorized)', url: 'https://bindyclothing.com.au/api/admin/store', expectedStatus: [401, 403] },
    { name: 'Admin API Backup GET (Unauthorized)', url: 'https://bindyclothing.com.au/api/admin/backup', expectedStatus: [401, 403] },
    { name: 'Admin API Media Upload POST (Unauthorized)', url: 'https://bindyclothing.com.au/api/admin/media', method: 'POST', expectedStatus: [401, 403] },

    // 8. Cron Endpoint Protection
    { name: 'Cron Expire Orders (Unauthenticated GET)', url: 'https://bindyclothing.com.au/api/cron/expire-orders', expectedStatus: [401] },

    // 9. Public Storefront API
    { name: 'Public Storefront API GET', url: 'https://bindyclothing.com.au/api/storefront', expectedStatus: [200] }
  ];

  const results = [];

  for (const t of tests) {
    const res = await fetchUrl(t.url, { method: t.method || 'GET' });
    if (!res.ok) {
      console.log(`[NETWORK FAIL] ${t.name}: ${res.error || res.code} (${t.url})`);
      results.push({ ...t, pass: false, error: res.error, code: res.code });
      continue;
    }

    const pass = t.expectedStatus.includes(res.status);
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${t.name} -> HTTP ${res.status} (Expected: ${t.expectedStatus.join('/')}) - ${t.url}`);
    if (res.location) {
      console.log(`       Redirect Location: ${res.location}`);
    }
    if (res.headers['x-robots-tag']) {
      console.log(`       X-Robots-Tag: ${res.headers['x-robots-tag']}`);
    }
    results.push({ ...t, pass, status: res.status, headers: res.headers, bodySnippet: res.bodySnippet, fullBody: res.fullBody });
  }

  // Deep inspection of Public Storefront API data
  const storefrontRes = results.find(r => r.name === 'Public Storefront API GET');
  if (storefrontRes && storefrontRes.pass && storefrontRes.fullBody) {
    try {
      const data = JSON.parse(storefrontRes.fullBody);
      console.log('\n--- Deep Inspection: Public Storefront API Response ---');
      console.log(`Products Count: ${data.products?.length}`);
      console.log(`Pages Count: ${data.pages?.length}`);
      console.log(`Store Revision: ${data.revision}`);
      console.log(`Payments Enabled: ${data.payments?.enabled}`);
      console.log(`Payment Mode: ${data.payments?.mode}`);
      console.log(`COD Enabled: ${data.payments?.cod?.enabled}`);
      console.log(`COD TestMode: ${data.payments?.cod?.testMode}`);
      
      // Verify NO wholesale costs, supplier SKUs, orders, or customers leaked
      const hasCostAud = data.products?.some(p => 'costAud' in p);
      const hasSupplierSku = data.products?.some(p => 'sku' in p);
      const hasOrders = 'orders' in data;
      const hasCustomers = 'customers' in data;
      const hasAdminTokens = 'tokens' in data || 'password' in data;

      console.log(`Data Leak Check: costAud in products? ${hasCostAud ? 'LEAKED (FAIL)' : 'CLEAN (PASS)'}`);
      console.log(`Data Leak Check: sku in products? ${hasSupplierSku ? 'LEAKED (FAIL)' : 'CLEAN (PASS)'}`);
      console.log(`Data Leak Check: orders in payload? ${hasOrders ? 'LEAKED (FAIL)' : 'CLEAN (PASS)'}`);
      console.log(`Data Leak Check: customers in payload? ${hasCustomers ? 'LEAKED (FAIL)' : 'CLEAN (PASS)'}`);
      console.log(`Data Leak Check: admin auth tokens/secrets? ${hasAdminTokens ? 'LEAKED (FAIL)' : 'CLEAN (PASS)'}`);
    } catch (e) {
      console.error('Failed to parse storefront JSON:', e.message);
    }
  }

  console.log('\n================================================================');
  console.log(`PROBE SUMMARY: ${results.filter(r => r.pass).length}/${results.length} PASSED`);
  console.log('================================================================');
}

run();

