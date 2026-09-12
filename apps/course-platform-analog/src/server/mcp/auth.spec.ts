import { beforeEach, describe, expect, it, vi } from 'vitest';

const verifySupabaseAccessToken = vi.hoisted(() => vi.fn());

vi.mock('@course-platform/shared/domain/trpc-server', () => ({
  verifySupabaseAccessToken,
}));

import { SupabaseTokenVerifier } from './auth';

const resourceUrl = new URL('https://courses.example.com/api/mcp');

describe('SupabaseTokenVerifier', () => {
  beforeEach(() => {
    verifySupabaseAccessToken.mockReset();
    delete process.env['MCP_RESOURCE_URL'];
  });

  it('returns the validated Supabase identity and OAuth claims', async () => {
    verifySupabaseAccessToken.mockResolvedValue({
      id: 'student-1',
      email: 'student@example.com',
    });
    const token = jwt({
      sub: 'student-1',
      client_id: 'claude-code',
      exp: Math.floor(Date.now() / 1000) + 60,
      scope: 'openid email',
    });

    await expect(
      new SupabaseTokenVerifier(resourceUrl).verifyAccessToken(token),
    ).resolves.toMatchObject({
      clientId: 'claude-code',
      scopes: ['openid', 'email'],
      extra: { userId: 'student-1', email: 'student@example.com' },
    });
  });

  it('enforces the configured production audience', async () => {
    process.env['MCP_RESOURCE_URL'] = resourceUrl.toString();
    verifySupabaseAccessToken.mockResolvedValue({ id: 'student-1' });

    await expect(
      new SupabaseTokenVerifier(resourceUrl).verifyAccessToken(
        jwt({
          sub: 'student-1',
          exp: Math.floor(Date.now() / 1000) + 60,
          aud: 'https://another.example.com/api/mcp',
        }),
      ),
    ).rejects.toMatchObject({ code: 'invalid_token' });
  });
});

function jwt(claims: Record<string, unknown>): string {
  const encode = (value: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'none' })}.${encode(claims)}.signature`;
}
