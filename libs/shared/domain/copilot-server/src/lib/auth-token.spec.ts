import { getBearerToken } from './auth-token';

describe('assistant authentication token', () => {
  it('prefers the Authorization header over the session cookie', () => {
    const request = new Request('https://courses.example.com/api/copilotkit', {
      headers: {
        authorization: 'Bearer header-token',
        cookie: 'sb-access-token=cookie-token',
      },
    });
    expect(getBearerToken(request)).toBe('header-token');
  });

  it('accepts the existing SSR session cookie', () => {
    const request = new Request('https://courses.example.com/api/copilotkit', {
      headers: { cookie: 'other=value; sb-access-token=session%2Dtoken' },
    });
    expect(getBearerToken(request)).toBe('session-token');
  });

  it.each(['sb-access-token=%invalid', 'sb-access-token=', 'other=value'])(
    'rejects invalid or missing session cookies: %s',
    (cookie) => {
      expect(
        getBearerToken(
          new Request('https://courses.example.com', { headers: { cookie } }),
        ),
      ).toBeNull();
    },
  );
});
