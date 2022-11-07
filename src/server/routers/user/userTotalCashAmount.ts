import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import { TransactionType } from '@prisma/client';
import { prisma } from '~/server/prisma';

export const getUserTotalCashAmount = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'User not found',
    });
  }
  const transactionsWithCompleteStatus = await prisma.transaction.findMany({
    where: {
      userId,
      TransactionStatuses: {
        every: {
          statusCode: 1, // Means completed transaction
        },
      },
    },
    include: {
      TransactionStatuses: {},
    },
  });

  let transactionBalance = 0;
  for (const transaction of transactionsWithCompleteStatus) {
    const transactionStatus = transaction.TransactionStatuses[0];
    if (!transactionStatus) continue;

    switch (transactionStatus.transactionType) {
      // Deposit / Stake won transaction
      case TransactionType.CREDIT:
        transactionBalance += Number(transaction.amountProcess);
        break;
      // Payout / Join contest / More or Less transaction
      case TransactionType.DEBIT:
        transactionBalance -= Number(transaction.amountProcess);
        break;
      default:
    }
  }
  return transactionBalance;
};

const userTotalCashAmount = t.procedure.query(async ({ ctx }) => {
  const userId = ctx.session.user?.id;
  if (!userId) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Invalid user id!',
    });
  }
  return getUserTotalCashAmount(userId);
});

export default userTotalCashAmount;
