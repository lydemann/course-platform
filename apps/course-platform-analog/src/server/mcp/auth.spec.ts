import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SupabaseTokenVerifier } from './auth';

const resourceUrl = new URL('https://courses.example.com/api/mcp');
const validateAccessToken = vi.fn();

describe('SupabaseTokenVerifier', () => {
  beforeEach(() => {
    validateAccessToken.mockReset();
    delete process.env['MCP_RESOURCE_URL'];
  });

  it('returns the validated Supabase identity and OAuth claims', async () => {
    validateAccessToken.mockResolvedValue({
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
      new SupabaseTokenVerifier(
        resourceUrl,
        validateAccessToken,
      ).verifyAccessToken(token),
    ).resolves.toMatchObject({
      clientId: 'claude-code',
      scopes: ['openid', 'email'],
      extra: { userId: 'student-1', email: 'student@example.com' },
    });
  });

  it('enforces the configured production audience', async () => {
    process.env['MCP_RESOURCE_URL'] = resourceUrl.toString();
    validateAccessToken.mockResolvedValue({ id: 'student-1' });

    await expect(
      new SupabaseTokenVerifier(
        resourceUrl,
        validateAccessToken,
      ).verifyAccessToken(
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
