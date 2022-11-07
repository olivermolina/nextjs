import { t } from '~/server/trpc';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import dayjs from 'dayjs';

const joinContest = t.procedure
  .input(
    yup.object({
      contestId: yup.string().required(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      if (!ctx.session.user) {
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
      await prisma.contestEntry.create({
        data: {
          userId: ctx.session.user?.id,
          contestsId: input.contestId,
          // TODO: figure out how to pull this number in
          tokens: 1000,
        },
      });
    } catch (error) {
      throw error;
    }
  });

export default joinContest;
