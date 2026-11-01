import { getBearerToken } from './auth-token';

describe('assistant authentication token', () => {
  it('prefers the Authorization header over the session cookie', () => {
    const request = requestWithHeaders({
      headers: {
        authorization: 'Bearer header-token',
        cookie: 'sb-access-token=cookie-token',
      },
    });
    expect(getBearerToken(request)).toBe('header-token');
  });

  it('accepts the existing SSR session cookie', () => {
    const request = requestWithHeaders({
      headers: { cookie: 'other=value; sb-access-token=session%2Dtoken' },
    });
    expect(getBearerToken(request)).toBe('session-token');
  });

  it.each(['sb-access-token=%invalid', 'sb-access-token=', 'other=value'])(
    'rejects invalid or missing session cookies: %s',
    (cookie) => {
      expect(
        getBearerToken(requestWithHeaders({ headers: { cookie } })),
      ).toBeNull();
    },
  );
});

function requestWithHeaders({
  headers,
}: {
  headers: Record<string, string>;
}): Request {
  return {
    headers: { get: (name: string) => headers[name] ?? null },
  } as Request;
}
