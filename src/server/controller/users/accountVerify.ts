import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import GIDX, { CustomerProfileResponse } from '~/lib/tsevo-gidx/GIDX';
import { prisma } from '~/server/prisma';
import { Session } from '@prisma/client';
import { ActionType } from '~/constants/ActionType';

const accountVerify = t.procedure
  .input(
    yup.object({
      session: yup.mixed<Session>(),
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

    const { session } = input;

    if (!session) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Invalid session!',
      });
    }

    try {
      const gidx = await new GIDX(user, ActionType.GET_CUSTOMER, session);
      const customerProfile: CustomerProfileResponse =
        await gidx.getCustomerProfile();
      if (
        !customerProfile ||
        !customerProfile.ReasonCodes.includes('ID-VERIFIED')
      ) {
        return Promise.reject(Error('Could not identify the customer!'));
      }

      const primaryName = customerProfile.Name.find((name) => name.Primary);
      const primaryAddress = customerProfile.Address.find(
        (address) => address.Primary,
      );

      if (!primaryName || !primaryAddress)
        return Promise.reject(Error('Could not verify the customer details!'));

      return {
        firstname: primaryName.FirstName,
        lastname: primaryName.LastName,
        address1: primaryAddress.AddressLine1,
        address2: primaryAddress.AddressLine2,
        city: primaryAddress.City,
        state: primaryAddress.StateCode,
        postalCode: primaryAddress.PostalCode,
      };
    } catch (e: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: e.message,
      });
    }
  });

export default accountVerify;
