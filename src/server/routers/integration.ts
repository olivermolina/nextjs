import { t } from '../trpc';
import * as yup from '~/utils/yup';
import GIDX, { GIDXDataBaseResponse } from '~/lib/tsevo-gidx/GIDX';
import { prisma } from '~/server/prisma';
import logger from '~/utils/logger';
import { TRPCError } from '@trpc/server';
import { ActionType } from '~/constants/ActionType';

export const integrationRouter = t.router({
  gidxCallback: t.procedure
    .input(
      yup.object({
        result: yup.mixed<GIDXDataBaseResponse>().required(),
      }),
    )
    .mutation(async ({ input }) => {
      const { result } = input;
      logger.info('GidxCallback data', result);
      const { MerchantSessionID, MerchantTransactionID } = result;

      const session = await prisma.session.findUnique({
        where: {
          id: MerchantSessionID,
        },
        include: {
          Transactions: {
            include: { TransactionStatuses: true },
          },
          SessionResponses: true,
          User: true,
        },
      });

      if (!session) return;
      logger.info(`Session ID found ${MerchantSessionID}`);
      const transaction = session.Transactions[0];
      if (transaction) {
        logger.info(
          `TransactionID found ${MerchantTransactionID} for SessionId ${MerchantSessionID}`,
        );
        const user = session.User;
        if (!user) return;
        try {
          const gidx = await new GIDX(
            user,
            ActionType.PAYMENT_DETAILS,
            session,
          );
          const paymentDetailResponse = await gidx.paymentDetail(
            transaction.id,
          );
          logger.info(`Transaction paymentDetail response`, {
            paymentDetailResponse,
          });

          const sessionResponse = session.SessionResponses[0];
          if (sessionResponse) {
            await prisma.sessionResponse.update({
              where: {
                id: sessionResponse.id,
              },
              data: {
                reasonCodes: JSON.stringify(paymentDetailResponse?.ReasonCodes),
                statusMessage: paymentDetailResponse?.SessionStatusMessage,
                statusCode: Number(paymentDetailResponse?.SessionStatusCode),
              },
            });
          }

          const transactionStatus = transaction.TransactionStatuses[0];
          if (transactionStatus) {
            const paymentDetail = paymentDetailResponse?.PaymentDetails[0];
            await prisma.transactionStatus.update({
              where: {
                id: transactionStatus.id,
              },
              data: {
                statusCode: paymentDetail?.PaymentStatusCode,
                statusMessage: paymentDetail?.PaymentStatusMessage,
                approvalDateTime: paymentDetail?.PaymentApprovalDateTime,
                statusDateTime: paymentDetail?.PaymentStatusDateTime,
                processDateTime: paymentDetail?.PaymentProcessDateTime,
              },
            });
          }
        } catch (e: any) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: e.message,
          });
        }
      }
    }),
});
