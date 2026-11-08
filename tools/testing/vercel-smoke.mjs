import assert from 'node:assert/strict';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Run the actual deployment artifact away from workspace node_modules so missing
// traced dependencies cannot be hidden by the local installation.
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'course-vercel-'));
let server;
try {
  const functionDirectory = join(temporaryDirectory, 'function');
  await cp(
    resolve('.vercel/output/functions/__fallback.func'),
    functionDirectory,
    { recursive: true, dereference: true },
  );
  const { default: handler } = await import(
    pathToFileURL(join(functionDirectory, 'index.mjs')).href
  );
  server = createServer(handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  for (const path of ['/', '/login']) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      signal: AbortSignal.timeout(30_000),
    });
    assert.equal(response.status, 200, `${path} must render successfully`);
    const html = await response.text();
    assert.match(html, /<course-platform-root/, `${path} must render the app`);
    if (path === '/login') assert.match(html, /type="password"/);
    console.log(`Vercel artifact: ${path} HTTP 200`);
  }
  const mcpResponse = await fetch(`http://127.0.0.1:${port}/api/mcp`, {
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(mcpResponse.status, 401, 'MCP must reject anonymous requests');
  console.log('Vercel artifact: /api/mcp HTTP 401');
  for (const path of ['/api/copilotkit', '/api/copilotkit/info']) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method: path.endsWith('/info') ? 'GET' : 'POST',
      signal: AbortSignal.timeout(30_000),
    });
    assert.equal(
      response.status,
      401,
      `${path} must reject anonymous requests`,
    );
    console.log(`Vercel artifact: ${path} HTTP 401`);
  }
} finally {
  if (server) await new Promise((resolve) => server.close(resolve));
  await rm(temporaryDirectory, { recursive: true, force: true });
}
