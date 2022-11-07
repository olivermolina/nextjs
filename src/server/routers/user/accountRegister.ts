import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import GIDX, { UserDetailsInput } from '~/lib/tsevo-gidx/GIDX';
import { prisma } from '~/server/prisma';
import { Session } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';

const accountRegister = t.procedure
  .input(
    yup.object({
      userDetails: yup.mixed<UserDetailsInput>().required(),
      session: yup.mixed<Session>().required(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user?.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userId || !user) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'User not found',
      });
    }

    try {
      const userDetails = input.userDetails;
      const { session } = input;
      const gidx = await new GIDX(user, ActionType.CREATE_CUSTOMER, session);
      const userData = await gidx.register(userDetails);

      if (!userData.ReasonCodes.includes('ID-VERIFIED')) {
        return Promise.reject(Error('Could not verify the user!'));
      }

      return userData;
    } catch (e: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: e.message,
      });
    }
  });

export default accountRegister;
