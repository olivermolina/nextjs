import { t } from '../trpc';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { supabase } from '~/utils/supabaseClient';
import { setCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';
import { UrlPaths } from '~/constants/UrlPaths';

export const userRouter = t.router({
  login: t.procedure
    .input(
      yup.object({
        email: yup.string().required(),
        password: yup.string().min(8).required(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This user is already signed in.',
        });
      }
      const result = await supabase.auth.signIn({
        email: input.email,
        password: input.password,
      });
      if (!result.user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid email or password!',
        });
      }
      setAuthResponse(
        ctx,
        result.session?.access_token,
        result.session?.refresh_token,
      );
    }),
  signUp: t.procedure
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
        const result = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
        });
        uid = result.user?.id;
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

        await prisma.user.update({
          where: {
            id: uid,
          },
          data: {
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
    }),
});

/**
 * Will set the supabase cookies.
 * @param ctx next api context
 * @param access_token supabase access token
 * @param refresh_token supabase refresh token
 */
function setAuthResponse(
  ctx: { req: NextApiRequest; res: NextApiResponse },
  access_token?: string,
  refresh_token?: string,
) {
  if (!access_token || !refresh_token) {
    throw new Error('Missing either access token to refresh token!');
  }
  setCookie('sb-access-token', access_token, {
    req: ctx.req,
    res: ctx.res,
    maxAge: 60 * 60 * 24,
  });
  setCookie('sb-refresh-token', refresh_token, {
    req: ctx.req,
    res: ctx.res,
    maxAge: 60 * 60 * 24,
  });
}
