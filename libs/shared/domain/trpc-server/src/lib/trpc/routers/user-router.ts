import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { getACUsers, createUser } from './user-service';
import {} from '@supabase/supabase-js';

export const userRouter = router({
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
