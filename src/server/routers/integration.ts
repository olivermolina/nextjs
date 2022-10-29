import { t } from '../trpc';
import * as yup from '~/utils/yup';
import { GIDXDataBaseResponse } from '~/lib/tsevo-gidx/GIDX';
import logger from '~/utils/logger';
import { prisma } from '~/server/prisma';

export const integrationRouter = t.router({
  gidxCallback: t.procedure
    .input(
      yup.object({
        result: yup.mixed<GIDXDataBaseResponse>().required(),
      }),
    )
    .mutation(async ({ input }) => {
      logger.info('GidxCallback data', input);
      const {
        StatusCode,
        StatusMessage,
        MerchantSessionID,
        MerchantTransactionID,
        TransactionStatusCode,
        TransactionStatusMessage,
        ReasonCodes,
      } = input.result;

      const session = await prisma.session.findUnique({
        where: {
          id: MerchantSessionID,
        },
      });

      if (session) {
        logger.info(`Session ID found: ${MerchantSessionID}`);
        const sessionResponse = await prisma.sessionResponse.findFirst({
          where: {
            sessionId: MerchantSessionID,
          },
        });

        if (sessionResponse) {
          await prisma.sessionResponse.update({
            where: {
              id: sessionResponse.id,
            },
            data: {
              reasonCodes: JSON.stringify(ReasonCodes),
              statusMessage: StatusMessage,
              statusCode: StatusCode,
            },
          });
        }
      }

      const transaction = await prisma.transaction.findUnique({
        where: {
          id: MerchantTransactionID,
        },
      });

      if (transaction) {
        logger.info(`Transaction ID found: ${MerchantTransactionID}`);
        const transactionStatus = await prisma.transactionStatus.findFirst({
          where: {
            transactionId: MerchantTransactionID,
          },
        });
        if (transactionStatus) {
          await prisma.transactionStatus.update({
            where: {
              id: transactionStatus.id,
            },
            data: {
              statusCode: TransactionStatusCode,
              statusMessage: TransactionStatusMessage,
            },
          });
        }
      }
    }),
});
