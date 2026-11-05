const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'start', '-p', '3008'], {
    stdio: 'ignore',
    shell: true,
    env: { ...process.env, PORT: '3008' }
  });

  await new Promise(r => setTimeout(r, 4000));

  const req = http.get('http://127.0.0.1:3008/product/random-bogus-dress-slug-xyz', res => {
    console.log('STATUS CODE WITH NOT-FOUND.TSX:', res.statusCode);
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log('Body length:', data.length);
      console.log('Found 404 text:', data.includes("This piece isn't here") || data.includes("This piece isn&#x27;t here"));
      child.kill('SIGTERM');
      process.exit(0);
    });
  });
  req.on('error', e => {
    console.error('Error:', e.message);
    child.kill('SIGTERM');
    process.exit(1);
  });
}
test();

