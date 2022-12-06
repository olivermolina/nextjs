import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import GIDX, { IDeviceGPS, UserDetailsInput } from '~/lib/tsevo-gidx/GIDX';
import { prisma } from '~/server/prisma';
import { Session } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';
import { customerProfile } from '~/server/routers/user/customerProfile';

const accountRegister = t.procedure
  .input(
    yup.object({
      userDetails: yup.mixed<UserDetailsInput>().required(),
      session: yup.mixed<Session>().required(),
      deviceGPS: yup.mixed<IDeviceGPS>().required(),
      ipAddress: yup.string().required(),
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

    const { session, userDetails, deviceGPS, ipAddress } = input;
    const gidx = await new GIDX(user, ActionType.CREATE_CUSTOMER, session);
    const userData = await gidx.register(userDetails, deviceGPS, ipAddress);

    // Get customer profile
    await customerProfile({
      user,
      session,
      deviceGPS,
      ipAddress,
    });

    return userData;
  });

export default accountRegister;
