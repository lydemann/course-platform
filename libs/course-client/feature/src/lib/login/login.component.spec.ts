import { getSafePostLoginRedirect } from './login.component';

describe('getSafePostLoginRedirect', () => {
  it('preserves an internal OAuth consent return URL', () => {
    expect(
      getSafePostLoginRedirect('/oauth/consent?authorization_id=request-1'),
    ).toBe('/oauth/consent?authorization_id=request-1');
  });

  it.each([null, '', 'https://attacker.example', '//attacker.example'])(
    'falls back to courses for unsafe redirect %p',
    (redirect) => {
      expect(getSafePostLoginRedirect(redirect)).toBe('/courses');
    },
  );
});
