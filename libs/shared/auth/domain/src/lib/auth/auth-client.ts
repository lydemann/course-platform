import { AuthClient } from '@supabase/auth-js';

const AUTH_URL = `${import.meta.env['VITE_SUPABASE_URL']!}/auth/v1`;
const AUTH_HEADERS = {
  Authorization: `Bearer ${import.meta.env['VITE_SUPABASE_KEY']!}`,
  apikey: `${import.meta.env['VITE_SUPABASE_KEY']!}`,
};

export const authClient = new AuthClient({
  headers: AUTH_HEADERS,
  url: AUTH_URL,
  fetch: fetch,
});
