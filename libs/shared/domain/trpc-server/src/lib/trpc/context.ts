/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AuthClient } from '@supabase/auth-js';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

// TODO: move to shared place
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

const verifyAndDecodeJwtToken = async (token: string) => {
  // verify and decode token from supabase

  if (!token) {
    console.error('No token');
    return null;
  }

  try {
    const {
      data: { user },
      error,
    } = await authClient.getUser(token);

    if (!user) {
      console.error('No user');
      return null;
    }

    if (error) {
      console.error('Token verification failed:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext({ req, res }: CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  // This is just an example of something you might want to do in your ctx fn
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = await verifyAndDecodeJwtToken(
        req.headers.authorization.split(' ')[1]
      );
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();
  return {
    user,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
