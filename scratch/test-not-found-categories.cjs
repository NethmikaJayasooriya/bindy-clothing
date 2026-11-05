const https = require('https');
const http = require('http');

function probeUrl(targetUrl) {
  return new Promise((resolve) => {
    try {
      const u = new URL(targetUrl);
      const client = u.protocol === 'https:' ? https : http;
      const req = client.request(u, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) QA-Probe/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 10000
      }, (res) => {
        let body = '';
        res.on('data', chunk => {
          body += chunk;
        });
        res.on('end', () => {
          const isNoIndex = Boolean(
            (res.headers['x-robots-tag'] && res.headers['x-robots-tag'].includes('noindex')) ||
            (body && /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(body))
          );
          const hasBrandedNotFoundUi = Boolean(
            body && (
              body.includes("This piece isn't here.") ||
              body.includes("This piece isn&#x27;t here.") ||
              body.includes("A DIFFERENT DIRECTION")
            )
          );
          const title = body.match(/<title>([^<]*)<\/title>/i)?.[1] || 'none';
          resolve({
            url: targetUrl,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            isNoIndex,
            hasBrandedNotFoundUi,
            title,
            bodyLength: body.length,
            bodySnippet: body.slice(0, 300)
          });
        });
      });
      req.on('error', err => resolve({ url: targetUrl, error: err.message }));
      req.on('timeout', () => { req.destroy(); resolve({ url: targetUrl, error: 'Timeout' }); });
      req.end();
    } catch (e) {
      resolve({ url: targetUrl, error: e.message });
    }
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('CATEGORY TESTING: NOT FOUND & PRODUCT URL CATEGORIES');
  console.log('================================================================\n');

  const targets = [
    { category: 'Valid Active Product', url: 'https://bindyclothing.com.au/product/tea-mist-shirt-maxi-dress' },
    { category: 'Known Retired Product', url: 'https://bindyclothing.com.au/product/moonflower-halter-top' },
    { category: 'Fabricated Product Slug', url: 'https://bindyclothing.com.au/product/random-bogus-dress-slug-xyz' },
    { category: 'Malformed Product URL', url: 'https://bindyclothing.com.au/product/invalid--slug@@123' },
    { category: 'Second Retired Product', url: 'https://bindyclothing.com.au/product/rose-dot-corset-top' },
    { category: 'Second Fabricated Product', url: 'https://bindyclothing.com.au/product/non-existent-silk-wrap' },
  ];

  for (const t of targets) {
    const res = await probeUrl(t.url);
    console.log(`[${t.category}]`);
    console.log(`  URL:                     ${t.url}`);
    if (res.error) {
      console.log(`  ERROR:                   ${res.error}\n`);
      continue;
    }
    console.log(`  HTTP Status Code:        ${res.status} ${res.statusText}`);
    console.log(`  Branded Not Found UI:    ${res.hasBrandedNotFoundUi ? 'YES (Visible to user)' : 'NO (Normal product/page UI)'}`);
    console.log(`  HTML/Header noindex:     ${res.isNoIndex ? 'YES (noindex active)' : 'NO'}`);
    console.log(`  X-Robots-Tag:            ${res.headers['x-robots-tag'] || 'none'}`);
    console.log(`  Page Title:              ${res.title}`);
    console.log(`  Body Transfer Size:      ${res.bodyLength} bytes`);
    console.log('');
  }
}

runTests();

