const http = require('http');
const { spawn } = require('child_process');

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function probe(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({
      hostname: '127.0.0.1',
      port: 3005,
      path: path,
      timeout: 5000,
    }, res => {
      resolve({
        status: res.statusCode,
        headers: res.headers
      });
    });
    req.on('error', reject);
  });
}

async function run() {
  console.log('Starting production server on port 3005...');
  const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'start', '-p', '3005'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: '3005' }
  });

  // Wait for server to bind
  let ready = false;
  for (let i = 0; i < 20; i++) {
    await wait(1000);
    try {
      await probe('/');
      ready = true;
      break;
    } catch (e) {
      // waiting
    }
  }

  if (!ready) {
    child.kill('SIGTERM');
    console.error('Server failed to start in time');
    process.exit(1);
  }

  console.log('Server is UP! Running route verification checks...\n');

  const tests = [
    { path: '/', expected: 200, name: 'Homepage' },
    { path: '/collection', expected: 200, name: 'Collection Root' },
    { path: '/collection/dresses', expected: 200, name: 'Valid Category (dresses)' },
    { path: '/collection/invalid-category', expected: 404, name: 'Proxy Invalid Category' },
    { path: '/product/bindi-silk-slip-dress', expected: 200, name: 'Valid Product' },
    { path: '/product/moonflower-halter-top', expected: 404, name: 'Proxy Retired Product' },
    { path: '/product/rose-dot-corset-top', expected: 404, name: 'Proxy Retired Product (rose-dot)' },
    { path: '/product/midnight-flow-maxi-skirt', expected: 404, name: 'Proxy Retired Product (midnight-flow)' },
    { path: '/shopping/australia', expected: 200, name: 'Shopping Australia' },
    { path: '/shopping/sri-lanka', expected: 200, name: 'Shopping Sri Lanka' },
    { path: '/shopping/antarctica', expected: 404, name: 'Proxy Invalid Region' },
    { path: '/account', expected: 200, name: 'Account' },
    { path: '/about', expected: 200, name: 'About' },
    { path: '/checkout', expected: 200, name: 'Checkout' },
    { path: '/faq', expected: 200, name: 'FAQ' },
    { path: '/returns', expected: 200, name: 'Returns' },
    { path: '/admin', expected: 200, name: 'Admin Page' },
    { path: '/api/storefront', expected: 200, name: 'Storefront API' }
  ];

  let failures = 0;
  for (const t of tests) {
    try {
      const res = await probe(t.path);
      const passed = res.status === t.expected;
      console.log(`[${passed ? 'PASS' : 'FAIL'}] ${t.name} -> HTTP ${res.status} (expected ${t.expected})`);
      if (!passed) {
        failures++;
      }
      if (t.expected === 404 && res.headers['x-robots-tag']) {
        console.log(`       Headers verified: X-Robots-Tag = ${res.headers['x-robots-tag']}`);
      }
    } catch (err) {
      console.error(`[ERROR] ${t.name} -> ${err.message}`);
      failures++;
    }
  }

  console.log(`\nResults: ${tests.length - failures}/${tests.length} tests passed.`);
  child.kill('SIGTERM');
  process.exit(failures > 0 ? 1 : 0);
}

run();
