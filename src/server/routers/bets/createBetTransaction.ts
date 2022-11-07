import ShortUniqueId from 'short-unique-id';
import { prisma } from '~/server/prisma';
import { User } from '@supabase/supabase-js';
import { ActionType } from '~/constants/ActionType';
import { PaymentMethodType, TransactionType } from '@prisma/client';

export const createBetTransaction = async (
  user: User,
  amountProcess: number,
  contestEntryId: string,
  transactionType: TransactionType,
) => {
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      serviceType: ActionType.PLACE_BET,
      deviceLocation: '',
      sessionRequestRaw: '',
    },
  });

  const uid = new ShortUniqueId({ length: 16 });
  const transaction = await prisma.transaction.create({
    data: {
      id: uid(),
      sessionId: session.id,
      actionType: ActionType.PLACE_BET,
      userId: user.id,
      amountProcess,
      amountBonus: 0,
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
