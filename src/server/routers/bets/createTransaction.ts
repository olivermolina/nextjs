import ShortUniqueId from 'short-unique-id';
import { prisma } from '~/server/prisma';
import { ActionType } from '~/constants/ActionType';
import { PaymentMethodType, TransactionType } from '@prisma/client';

interface CreateTransactionInput {
  userId: string;
  amountProcess: number;
  amountBonus: number;
  contestEntryId?: string;
  transactionType: TransactionType;
  actionType: ActionType;
}

export const createTransaction = async (input: CreateTransactionInput) => {
  const {
    userId,
    amountProcess,
    amountBonus,
    contestEntryId,
    transactionType,
    actionType,
  } = input;

  const session = await prisma.session.create({
    data: {
      userId: userId,
      serviceType: actionType,
      deviceLocation: '',
      sessionRequestRaw: '',
    },
  });

  const uid = new ShortUniqueId({ length: 16 });
  const transaction = await prisma.transaction.create({
    data: {
      id: uid(),
      sessionId: session.id,
      actionType: actionType,
      userId: userId,
      amountProcess,
      amountBonus: amountBonus,
      transactionCurrency: 'USD',
      contestEntryId,
    },
  });

  await prisma.transactionStatus.create({
    data: {
      transactionId: transaction.id,
      statusCode: 1, // Mark as complete
      statusMessage: `${transactionType} transaction successfully created`,
      transactionType,
      transactionScore: 0,
      transactionMethod: 'OTHER',
      transactionMethodType: PaymentMethodType.OTHERS,
      transactionMethodAccount: '',
      approvalDateTime: new Date(),
      statusDateTime: new Date(),
    },
  });
};
