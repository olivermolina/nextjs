import { t } from '~/server/trpc';
import { supabase } from '~/utils/supabaseClient';
import logger from '~/utils/logger';
import { TRPCError } from '@trpc/server';
import { prisma } from '~/server/prisma';
import * as yup from '~/utils/yup';
import { setAuthResponse } from './setAuthResponse';

const signUp = t.procedure
  .input(
    yup.object({
      email: yup.string().required(),
      username: yup.string().required(),
      state: yup.string().required(),
      phone: yup
        .string()
        .matches(
          /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
          'Invalid phone number.',
        )
        .required(),
      DOB: yup.date().required(),
      password: yup.string().required(),
      confirmPassword: yup.string().required(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    let uid: string | undefined;
    try {
      const result = await supabase.auth.signUp(
        {
          email: input.email,
          password: input.password,
        },
        {
          data: {
            state: input.state,
            DOB: input.DOB,
            username: input.username,
          },
        },
      );
      const user = result.user;
      if (!user) {
        logger.error('There was an error signing up.', result.error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No user.',
        });
      }
      const session = result.session;
      // This will return null if Supabase "email confirmations" are turned on!
      if (!session) {
        logger.error('There was an error getting user session.', result.error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No session.',
        });
      }
      uid = user.id;
      const phone = input.phone.match(/\d+/);
      if (!phone) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid phone number.',
        });
      }
      const numbers = phone[0];
      if (!numbers) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid phone number.',
        });
      }

      await prisma.user.upsert({
        where: {
          id: uid,
        },
        create: {
          id: uid,
          email: user.email!,
          state: input.state,
          phone: Number(numbers),
          DOB: input.DOB,
          username: input.username,
        },
        update: {
          email: user.email!,
          state: input.state,
          phone: Number(numbers),
          DOB: input.DOB,
          username: input.username,
        },
      });
      setAuthResponse(
        ctx,
        result.session?.access_token,
        result.session?.refresh_token,
      );
    } catch (error) {
      if (uid) await supabase.auth.api.deleteUser(uid);
      throw error;
    }
  });

export default signUp;
