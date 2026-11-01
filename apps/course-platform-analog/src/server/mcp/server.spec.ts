import type { AuthInfo } from '@modelcontextprotocol/server';
import { describe, expect, it } from 'vitest';

import { courseContentMcpHandler } from './server';
import { buildProtectedResourceMetadata } from './metadata';
import { handleMcpRequest } from '../routes/mcp';

const authInfo: AuthInfo = {
  token: 'test-token',
  clientId: 'test-client',
  scopes: [],
  expiresAt: Math.floor(Date.now() / 1000) + 60,
};

describe('course content MCP server', () => {
  it('challenges unauthenticated clients with OAuth resource metadata', async () => {
    const response = await handleMcpRequest(
      new Request('https://courses.example.com/api/mcp', {
        method: 'POST',
        headers: {
          accept: 'application/json, text/event-stream',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {},
        }),
      }),
    );

    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toContain(
      'https://courses.example.com/.well-known/oauth-protected-resource/api/mcp',
    );
  });

  it('builds host-aware protected resource metadata', () => {
    process.env['VITE_SUPABASE_URL'] = 'https://project.supabase.co';
    expect(
      buildProtectedResourceMetadata(
        new Request(
          'https://preview.example.com/.well-known/oauth-protected-resource',
        ),
      ),
    ).toMatchObject({
      resource: 'https://preview.example.com/api/mcp',
      resource_name: 'Angular Architect Accelerator course content',
    });
  });

  it('advertises only the expected read-only tools', async () => {
    await sendMcpRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' },
      },
    });

    const response = await sendMcpRequest(
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {},
      },
      { 'mcp-protocol-version': '2025-06-18' },
    );
    const body = parseMcpResponse(await response.text()) as {
      result: {
        tools: Array<{
          name: string;
          annotations: { readOnlyHint: boolean; destructiveHint: boolean };
        }>;
      };
    };

    expect(response.status).toBe(200);
    expect(body.result.tools.map((tool) => tool.name)).toEqual([
      'list_courses',
      'get_course_outline',
      'search_course_content',
      'get_lesson_content',
    ]);
    expect(
      body.result.tools.every(
        (tool) =>
          tool.annotations.readOnlyHint && !tool.annotations.destructiveHint,
      ),
    ).toBe(true);
  });
});

function parseMcpResponse(body: string): unknown {
  if (body.startsWith('event:')) {
    const dataLine = body.split('\n').find((line) => line.startsWith('data: '));
    if (!dataLine) {
      throw new Error('MCP SSE response did not contain a data event.');
    }
    return JSON.parse(dataLine.slice('data: '.length));
  }

  return JSON.parse(body);
}

function sendMcpRequest(
  body: unknown,
  headers: Record<string, string> = {},
): Promise<Response> {
  return courseContentMcpHandler.fetch(
    new Request('https://courses.example.com/api/mcp', {
      method: 'POST',
      headers: {
        accept: 'application/json, text/event-stream',
        'content-type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    }),
    { authInfo },
  );
}
