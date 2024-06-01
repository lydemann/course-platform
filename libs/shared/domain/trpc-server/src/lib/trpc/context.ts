import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

const verifyAndDecdodeJwtToken = async (token: string) => {
  // decode and verify token
  // TODO: verify and decode token
  return {
    id: '1',
    email: '',
  };
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
      const user = await verifyAndDecdodeJwtToken(
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
