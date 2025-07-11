import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from '../../context';
export const t = initTRPC.context<Context>().create();
// you can reuse this for any procedure
export const adminProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;
  // `ctx.user` is nullable
  if (!ctx.user) {
    //     ^?
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  if (ctx.user.user_metadata?.['user_role'] !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User is not an admin',
      cause: ctx.user.user_metadata,
    });
  }
  return opts.next({
    ctx: {
      // ✅ user value is known to be non-null now
      user: ctx.user,
      // ^?
    },
  });
});
