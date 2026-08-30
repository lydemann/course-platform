import { AuthSessionMissingError } from '@supabase/auth-js';

import { isAuthSessionMissingError } from './auth.service';

describe('isAuthSessionMissingError', () => {
  it('recognizes an anonymous Supabase session', () => {
    expect(isAuthSessionMissingError(new AuthSessionMissingError())).toBe(true);
  });

  it('does not hide unexpected authentication failures', () => {
    expect(isAuthSessionMissingError(new Error('Supabase unavailable'))).toBe(
      false,
    );
  });
});
