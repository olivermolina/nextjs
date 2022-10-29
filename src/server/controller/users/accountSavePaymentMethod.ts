import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import { Session } from '@prisma/client';
import * as yup from '~/utils/yup';
import GIDX, {
  BillingAddressInterface,
  GidxPaymentMethodInterface,
} from '~/lib/tsevo-gidx/GIDX';
import { prisma } from '~/server/prisma';
import { ActionType } from '~/constants/ActionType';

const accountSavePaymentMethod = t.procedure
  .input(
    yup.object({
      fullName: yup.string().required(),
      billingAddress: yup.mixed<BillingAddressInterface>().required(),
      paymentMethod: yup.mixed<GidxPaymentMethodInterface>().required(),
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
      const { billingAddress, paymentMethod, session, fullName } = input;

      const gidx = await new GIDX(
        user,
        ActionType.SAVE_PAYMENT_METHOD,
        session,
      );
      return await gidx.savePaymentMethod({
        fullName,
        paymentMethod,
        billingAddress,
      });
    } catch (e: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: e.message,
      });
    }
  });

export default accountSavePaymentMethod;
