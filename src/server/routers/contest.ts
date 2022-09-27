import { t } from '../trpc';
import {
  Contest,
  ContestEntry,
  League,
  MarketType,
  Status,
} from '@prisma/client';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import dayjs from 'dayjs';
import { FantasyOffer, StatNames } from '~/types';
import { InferType } from '~/utils/yup';

/**
 * A user can only join a contest if its not yet been started and they're not yet enrolled.
 */
const canJoinContest = (
  contest: Contest & {
    ContestEntries: ContestEntry[];
  },
  userId: string,
) => {
  if (dayjs().isAfter(dayjs(contest.startDate))) {
    return false;
  }
  const isUserAlreadyJoined = contest.ContestEntries.some(
    (entry) => entry.userId === userId,
  );
  if (isUserAlreadyJoined) {
    return false;
  }
  return true;
};

const baseMatch = {
  id: yup.string().uuid().required(),
  away: yup.object().required(),
  home: yup.object().required(),
  matchTime: yup.date().required(),
};
const fantasyMatch = yup.object({
  ...baseMatch,
  playerPhotoURL: yup.string().required(),
  statName: yup.string().required(),
  total: yup.number().required(),
  matchName: yup.string().required(),
  playerName: yup.string().required(),
  tags: yup.array(yup.string()).required(),
});
export type FantasyMatchType = InferType<typeof fantasyMatch>;
export const contestRouter = t.router({
  list: t.procedure
    .output(
      yup.array(
        yup.object({
          id: yup.string().uuid().required(),
          name: yup.string().required(),
          isActive: yup.bool().required(),
          bgImageUrl: yup.string().url().required(),
          startDate: yup.date().required(),
          endDate: yup.date().required(),
          isEnrolled: yup.bool().required(),
          isJoinable: yup.bool().required(),
        }),
      ),
    )
    .query(async ({ ctx }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      const contests = await prisma.contest.findMany({
        include: {
          ContestEntries: true,
        },
      });
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        });
      }
      return contests.map((contest) => ({
        id: contest.id,
        name: contest.name,
        isActive: contest.isActive,
        bgImageUrl: contest.bgImageUrl,
        startDate: contest.startDate,
        endDate: contest.endDate,
        isEnrolled: contest.ContestEntries.some(
          (entry) => entry.userId === userId,
        ),
        isJoinable: canJoinContest(contest, userId),
      }));
    }),
  listOffers: t.procedure
    .input(
      yup.object({
        contestId: yup.string().nullable(),
        league: yup.string().nullable(),
      }),
    )
    .output(
      yup
        .object({
          id: yup.string().uuid().required(),
          name: yup.string().required(),
          startDate: yup.date().required(),
          endDate: yup.date().required(),
          isActive: yup.bool().required(),
          filters: yup.array(yup.string()).required(),
          tokenCount: yup.number().required(),
          offers: yup
            .array()
            .oneOfSchemas([yup.object(baseMatch), fantasyMatch])
            .required(),
          type: yup.string().oneOf(['match', 'picks']).required(),
        })
        .nullable(),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user?.id;
      if (!ctx.session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      const contest = await prisma.contest.findFirst({
        where: {
          id: input.contestId || undefined,
          AND: {
            ContestEntries: {
              every: {
                userId,
              },
            },
          },
        },
        include: {
          ContestEntries: true,
        },
      });
      if (!contest) {
        return null;
      }

      const ContestEntry = contest.ContestEntries[0];
      if (!ContestEntry) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Missing contest entry for this user.',
        });
      }
      const contestProps = {
        id: contest.id,
        name: contest.name,
        startDate: contest.startDate,
        endDate: contest.endDate,
        isActive: contest.isActive,
        tokenCount: ContestEntry.tokens.toNumber(),
      };
      if (contest.type === 'MATCH') {
        return {
          ...contestProps,
          filters: ['straight', 'parlay', 'teaser'],
          offers: (
            await prisma.offer.findMany({
              where: {
                league: input.league as League,
                status: Status.Scheduled,
                markets: {
                  every: {
                    type: MarketType.GM,
                  },
                },
              },
              include: {
                markets: true,
                home: true,
                away: true,
              },
            })
          ).map((offer) => {
            const away = offer.markets.find(
              (mkt) => mkt.teamId === offer.away.id,
            );
            const home = offer.markets.find(
              (mkt) => mkt.teamId === offer.home.id,
            );
            if (!away || !home) {
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Missing game lines.',
              });
            }
            return {
              id: offer.gid,
              away: {
                name: offer.away.name,
                spread: {
                  value: away.spread,
                  odds: away.spread_odd,
                },
                total: {
                  value: away.total,
                  odds: 100,
                },
                moneyline: {
                  value: 100,
                  odds: away.moneyline,
                },
              },
              home: {
                name: offer.home.name,
                spread: {
                  value: home.spread,
                  odds: home.spread_odd,
                },
                total: {
                  value: home.total,
                  odds: 100,
                },
                moneyline: {
                  value: 100,
                  odds: home.moneyline,
                },
              },
              matchTime: offer.start_utc,
            };
          }),
          type: 'match',
        };
      } else if (contest.type === 'FANTASY') {
        // TODO: get all players in league who have stats matching the set of filters for that league
        const filters: StatNames[] = getFiltersByLeague(input.league);
        const offers: FantasyOffer[] = await getFantasyOffers(input.league);

        return {
          ...contestProps,
          filters,
          offers: offers,
          type: 'picks',
        };
      } else {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Undefined contest type',
        });
      }
    }),
});

/**
 * This function will get the mapping from league to supported stat lines
 * for fantasy picks. The idea is that these directly mimic a property in the database
 * so that this function can generically be expanded to support different stat lines.
 *
 * TODO: Make all league references an enum from a constant file.
 * TODO: Get the available sports mappings from dan
 * TODO: Make all sports mapping references in a constant file to be shared in the frontend
 * @param league one of the supported league enums in the application
 */
function getFiltersByLeague(league: string | null | undefined): StatNames[] {
  throw new Error('Function not implemented.');
}

/**
 * This function gets all the fantasy offers currently available for a given league.
 *
 * It will check for players with upcoming games in the next week (that have not started), and then give an over under based on their estimated
 * statline that will be 50/50 odds either way with a push for the exact value.
 *
 * TODO: Build fantasy sports data ETL
 * TODO: Add fatasy sports data to strapi and prisma
 * TODO: Complete the implementation of this function.
 *
 * @param league one of the supported league enums in the application
 */
function getFantasyOffers(
  league: string | null | undefined,
): FantasyOffer[] | PromiseLike<FantasyOffer[]> {
  throw new Error('Function not implemented.');
}
