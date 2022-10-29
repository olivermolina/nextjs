import { TRPCError } from '@trpc/server';
import { t } from '~/server/trpc';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import { supabase } from '~/utils/supabaseClient';
import { setAuthResponse } from '~/server/controller/users/setAuthResponse';

const login = t.procedure
  .input(
    yup.object({
      email: yup.string().required(),
      password: yup
        .string()
        .min(8, 'Your password must be at least 8 characters.')
        .required(),
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

    //Check user if exists in prisma
    const prismaUser = await prisma.user.findUnique({
      where: {
        id: result.user.id,
      },
    });

    if (!prismaUser) {
      //Register missing prisma user
      await prisma.user.upsert({
        where: {
          id: result.user.id,
        },
        create: {
          id: result.user.id,
          email: result.user.email!,
          ...result.user.user_metadata,
        },
        update: {
          email: result.user.email!,
          ...result.user.user_metadata,
        },
      });
    }

    setAuthResponse(
      ctx,
      result.session?.access_token,
      result.session?.refresh_token,
    );
  });

export default login;
