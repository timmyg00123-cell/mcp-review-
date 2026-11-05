import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const vercelPath = path.resolve('vercel.json');
assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist in project root');

const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
assert.strictEqual(vercelConfig.outputDirectory, 'dist', 'outputDirectory must be dist');

// Must include SPA rewrite
const hasSpaRewrite = vercelConfig.rewrites?.some(
  (r: any) => r.source === '/(.*)' && r.destination === '/index.html'
);
assert.ok(hasSpaRewrite, 'vercel.json must include SPA catch-all rewrite to /index.html');

// Must include WASM header
const hasWasmHeader = vercelConfig.headers?.some(
  (h: any) => h.headers?.some((item: any) => item.value === 'application/wasm')
);
assert.ok(hasWasmHeader, 'vercel.json must specify application/wasm content-type');

console.log('Task 3 vercelConfigAudit tests passed!');
