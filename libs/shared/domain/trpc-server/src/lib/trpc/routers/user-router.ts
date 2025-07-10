import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { getACUsers, createUser } from './user-service';
import {} from '@supabase/supabase-js';
import { protectedProcedure } from './utils/protected-procedure';
import { db } from '../../drizzle/db';
import { eq } from 'drizzle-orm';
import { profiles } from '../../drizzle/out/schema';

export const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    // get from profile table
    const profile = await db.query.profiles.findFirst({
      where(fields, operators) {
        return eq(fields.id, user.id);
      },
    });

    return {
      id: user.id,
      email: user.email || '',
      fullName: profile?.full_name ?? '',
    };
  }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        fullName: z.string(),
      })
    )
    .mutation(async ({ input: { fullName }, ctx }) => {
      const user = ctx.user;
      await db
        .update(profiles)
        .set({ full_name: fullName })
        .where(eq(profiles.id, user.id))
        .returning();
    }),

  createUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input: { email, password } }) => {
      const emailLowerCase = email.toLowerCase();
      const acUserDTO = await getACUsers();
      const acUsers = new Set(
        acUserDTO.contacts.map((user) => user.email?.toLowerCase())
      );

      // TODO: when implementing for SaaS decode registration token containing an encrypted token with email and schoolId
      if (!acUsers.has(emailLowerCase)) {
        throw Error('Email is not enrolled');
      }

      // TODO: when implementing for SaaS no hardcoded school id
      console.log('Creating user');
      return createUser(emailLowerCase, password);
    }),
});
