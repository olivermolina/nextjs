import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import dayjs from 'dayjs';
import { TransactionType } from '@prisma/client';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { ActionType } from '~/constants/ActionType';
import { getUserTotalCashAmount } from '~/server/routers/user/userTotalCashAmount';

const joinContest = t.procedure
  .input(
    yup.object({
      contestId: yup.string().required(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const userId = ctx.session.user?.id;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You must be logged in to view contests.',
        });
      }

      const contest = await prisma.contest.findUnique({
        where: {
          id: input.contestId,
        },
        select: {
          entryFee: true,
          startDate: true,
          ContestEntries: {
            select: {
              User: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!contest) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Contest not found.`,
        });
      }

      if (dayjs().isAfter(dayjs(contest?.startDate))) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `It's too late to join this contest.`,
        });
      }
      if (
        contest?.ContestEntries.some(
          (item) => item.User.id == ctx.session.user?.id,
        )
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Already registered for this contest.`,
        });
      }

      // Verify user total cash amount
      const entryFee = Number(contest.entryFee);

      const userTotalCashAmount = await getUserTotalCashAmount(user.id);
      if (entryFee > userTotalCashAmount) {
        throw new Error(
          'Insufficient funds. Please deposit funds in your account and try again.',
        );
      }

      const contestEntry = await prisma.contestEntry.create({
        data: {
          userId: user.id,
          contestsId: input.contestId,
          // TODO: figure out how to pull this number in
          tokens: 1000,
        },
      });

      await createTransaction(
        user.id,
        entryFee,
        contestEntry.id,
        TransactionType.DEBIT,
        ActionType.JOIN_CONTEST,
      );
    } catch (error) {
      throw error;
    }
  });

export default joinContest;
