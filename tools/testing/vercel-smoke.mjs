import assert from 'node:assert/strict';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Run the actual deployment artifact away from workspace node_modules so missing
// traced dependencies cannot be hidden by the local installation.
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'course-vercel-'));
const originalFetch = globalThis.fetch;
const originalAnthropicKey = process.env.ANTHROPIC_API_KEY;
const originalCopilotKey = process.env.COPILOTKIT_API_KEY;
process.env.ANTHROPIC_API_KEY = 'artifact-smoke-key';
process.env.COPILOTKIT_API_KEY = '';
let server;
try {
  const functionDirectory = join(temporaryDirectory, 'function');
  await cp(
    resolve('.vercel/output/functions/__fallback.func'),
    functionDirectory,
    { recursive: true, dereference: true },
  );
  // Only identity verification and the provider HTTP boundary are simulated.
  // The packaged route, real agent, model adapter and stream decoder all run.
  let providerRequests = 0;
  globalThis.fetch = async (input, init) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.endsWith('/auth/v1/user')) {
      return Response.json({
        id: '00000000-0000-4000-8000-000000000001',
        email: 'artifact-smoke@example.invalid',
        aud: 'authenticated',
        role: 'authenticated',
      });
    }
    if (url === 'https://api.anthropic.com/v1/messages') {
      providerRequests++;
      const events = [
        {
          type: 'message_start',
          message: {
            id: 'smoke-message',
            type: 'message',
            role: 'assistant',
            model: 'claude-sonnet-5',
            content: [],
            usage: { input_tokens: 1, output_tokens: 0 },
          },
        },
        {
          type: 'content_block_start',
          index: 0,
          content_block: { type: 'text', text: '' },
        },
        {
          type: 'content_block_delta',
          index: 0,
          delta: { type: 'text_delta', text: 'Artifact assistant response.' },
        },
        { type: 'content_block_stop', index: 0 },
        {
          type: 'message_delta',
          delta: { stop_reason: 'end_turn', stop_sequence: null },
          usage: { output_tokens: 4 },
        },
        { type: 'message_stop' },
      ];
      return new Response(
        events
          .map(
            (event) =>
              `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
          )
          .join(''),
        {
          headers: { 'content-type': 'text/event-stream' },
        },
      );
    }
    return originalFetch(input, init);
  };
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

  const response = await fetch(
    `http://127.0.0.1:${port}/api/copilotkit/agent/default/run`,
    {
      method: 'POST',
      headers: {
        authorization: 'Bearer artifact-smoke-token',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        threadId: 'artifact-smoke-thread',
        runId: 'artifact-smoke-run',
        messages: [
          { id: 'artifact-smoke-user', role: 'user', content: 'Say hello.' },
        ],
        state: {},
        tools: [],
        context: [],
        forwardedProps: {},
      }),
      signal: AbortSignal.timeout(30_000),
    },
  );
  assert.equal(response.status, 200, 'authenticated assistant must stream');
  const stream = await response.text();
  assert.equal(
    providerRequests,
    1,
    'agent must call the actual provider adapter',
  );
  assert.doesNotMatch(stream, /RUN_ERROR/);
  assert.match(stream, /Artifact assistant response\./);
  assert.match(stream, /RUN_FINISHED/);
  console.log('Vercel artifact: authenticated assistant response streamed');
} finally {
  globalThis.fetch = originalFetch;
  if (originalAnthropicKey === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = originalAnthropicKey;
  if (originalCopilotKey === undefined) delete process.env.COPILOTKIT_API_KEY;
  else process.env.COPILOTKIT_API_KEY = originalCopilotKey;
  if (server) await new Promise((resolve) => server.close(resolve));
  await rm(temporaryDirectory, { recursive: true, force: true });
}
