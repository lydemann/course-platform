import {
  OAuthError,
  OAuthErrorCode,
  type AuthInfo,
  type OAuthTokenVerifier,
} from '@modelcontextprotocol/server';
import { verifySupabaseAccessToken } from '@course-platform/shared/domain/trpc-server';

import { readServerEnv } from './config';

interface SupabaseJwtClaims {
  aud?: string | string[];
  client_id?: string;
  exp?: number;
  resource?: string;
  scope?: string;
  scopes?: string[];
  sub?: string;
}

export class SupabaseTokenVerifier implements OAuthTokenVerifier {
  constructor(private readonly expectedResource: URL) {}

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    const user = await verifySupabaseAccessToken(token);
    if (!user) {
      throw new OAuthError(
        OAuthErrorCode.InvalidToken,
        'Invalid access token.',
      );
    }

    const claims = decodeJwtClaims(token);
    if (!claims.exp) {
      throw new OAuthError(
        OAuthErrorCode.InvalidToken,
        'Access token has no expiration.',
      );
    }

    const configuredAudience = readServerEnv('MCP_RESOURCE_URL');
    if (
      configuredAudience &&
      !hasExpectedAudience(claims, configuredAudience)
    ) {
      throw new OAuthError(
        OAuthErrorCode.InvalidToken,
        'Access token was not issued for this MCP server.',
      );
    }

    const scopes = Array.isArray(claims.scopes)
      ? claims.scopes
      : (claims.scope?.split(' ').filter(Boolean) ?? []);

    return {
      token,
      clientId: claims.client_id ?? claims.sub ?? user.id,
      scopes,
      expiresAt: claims.exp,
      ...(configuredAudience ? { resource: this.expectedResource } : {}),
      extra: {
        userId: user.id,
        email: user.email,
      },
    };
  }
}

function decodeJwtClaims(token: string): SupabaseJwtClaims {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      throw new Error('Missing JWT payload.');
    }

    return JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as SupabaseJwtClaims;
  } catch {
    throw new OAuthError(
      OAuthErrorCode.InvalidToken,
      'Malformed access token.',
    );
  }
}

function hasExpectedAudience(
  claims: SupabaseJwtClaims,
  expectedAudience: string,
): boolean {
  const expected = new URL(expectedAudience).toString();
  const audiences = Array.isArray(claims.aud)
    ? claims.aud
    : claims.aud
      ? [claims.aud]
      : [];

  return claims.resource === expected || audiences.includes(expected);
}
