import { t } from '../trpc';
import {
  Contest,
  ContestEntry,
  ContestType,
  League,
  Market,
  MarketType,
  Offer,
  Status,
} from '@prisma/client';
import { TRPCError } from '@trpc/server';
import * as yup from '~/utils/yup';
import { prisma } from '~/server/prisma';
import dayjs from 'dayjs';
import { FantasyOffer } from '~/types';
import { InferType } from '~/utils/yup';
import * as StatNames from './IStatNames';

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

const findLeadersByContest = async (contestId: string[], userId: string) => {
  const topLeaders: any = await prisma.wallets.findMany({
    where: {
      contestsId: { in: contestId },
    },
    select: {
      balance: true,
      User: {
        select: {
          id: true,
          username: true,
        },
      },
      contest: {
        select: {
          bgImageUrl: true,
        },
      },
    },
  });
  const rank = new Map<number, number>(
    topLeaders.map((wallet: { balance: number }, index: number) => [
      wallet.balance,
      index,
    ]),
  );
  const rankedLeaders = topLeaders.map((currentWallet: { balance: number }) => {
    const values: number[] = Array.from(rank.values());
    return {
      rank: rank.get(currentWallet.balance),
      isTopRanked: Math.max(...values) == rank.get(currentWallet.balance),
      ...currentWallet,
    };
  });
  return rankedLeaders.map(
    (wallet: {
      User: { id: string; username: string };
      isTopRanked: boolean;
      contest: { bgImageUrl: string };
      balance: string;
      rank: number;
    }) => ({
      id: wallet.User.id,
      name: wallet.User.username,
      isTopRanked: wallet.isTopRanked,
      bgImageUrl: wallet.contest.bgImageUrl,
      points: parseInt(wallet.balance),
      rank: wallet.rank,
      isMe: wallet.User.id == userId,
    }),
  );
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
  leaders: t.procedure
    .input(
      yup.object({
        contestId: yup.string().required(),
      }),
    )
    .output(
      yup.array(
        yup.object({
          id: yup.string().uuid().required(),
          name: yup.string().required(),
          isTopRanked: yup.bool().required(),
          bgImageUrl: yup.string().url().required(),
          points: yup.number().required(),
          rank: yup.number().required(),
        }),
      ),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      const Wallets: any = await prisma.wallets.findMany({
        where: {
          contestsId: input.contestId || undefined,
        },
        select: {
          balance: true,
          User: {
            select: {
              id: true,
              username: true,
            },
          },
          contest: {
            select: {
              bgImageUrl: true,
            },
          },
        },
      });
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        });
      }

      const rank = new Map<number, number>(
        Wallets.map((wallet: { balance: number }, index: number) => [
          wallet.balance,
          index,
        ]),
      );
      const rankedLeaders = Wallets.map(
        (currentWallet: { balance: number }) => {
          const values: number[] = Array.from(rank.values());
          return {
            rank: rank.get(currentWallet.balance),
            isTopRanked: Math.max(...values) == rank.get(currentWallet.balance),
            ...currentWallet,
          };
        },
      );
      return rankedLeaders.map(
        (wallet: {
          User: { id: string; username: string };
          isTopRanked: boolean;
          contest: { bgImageUrl: string };
          balance: string;
          rank: number;
        }) => ({
          id: wallet.User.id,
          name: wallet.User.username,
          isTopRanked: wallet.isTopRanked,
          bgImageUrl: wallet.contest.bgImageUrl,
          points: parseInt(wallet.balance),
          rank: wallet.rank,
        }),
      );
    }),
  contests: t.procedure
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
          entryFee: yup.number().required(),
          totalPrize: yup.number().required(),
          entries: yup.number().required(),
          leaders: yup
            .array(
              yup.object({
                id: yup.string().uuid().required(),
                name: yup.string().required(),
                isTopRanked: yup.bool().required(),
                bgImageUrl: yup.string().url().required(),
                points: yup.number().required(),
                rank: yup.number().required(),
                isMe: yup.bool().required(),
              }),
            )
            .nullable(),
        }),
      ),
    )
    .query(async ({ ctx }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      const contests: any = await prisma.contest.findMany({
        select: {
          id: true,
          name: true,
          isActive: true,
          bgImageUrl: true,
          startDate: true,
          endDate: true,
          entryFee: true,
          totalPrize: true,
          ContestEntries: {
            select: {
              id: true,
              tokens: true,
              userId: true,
              contestsId: true,
            },
          },
        },
      });
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        });
      }
      console.log(contests);

      const result = await findLeadersByContest(
        contests.map(
          (contest: Contest & { ContestEntries: ContestEntry[] }) => contest.id,
        ),
        userId,
      );
      return contests.map(
        (contest: Contest & { ContestEntries: ContestEntry[] }) => ({
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
          entryFee: contest.entryFee,
          totalPrize: contest.totalPrize,
          entries: contests.length,
          leaders: [...result],
        }),
      );
    }),
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
          type: yup.mixed<Contest['type']>(),
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
        type: contest.type,
      }));
    }),
  listOffers: t.procedure
    .input(
      yup.object({
        contestId: yup.string().nullable(),
        league: yup.mixed<League>().default(League.NFL),
      }),
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
          ...(input.contestId ? { id: input.contestId } : {}),
          ContestEntries: {
            some: {
              userId,
            },
          },
        },
        include: {
          ContestEntries: {
            where: {
              userId,
            },
          },
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
      const contestProps: Pick<
        Contest,
        'id' | 'name' | 'startDate' | 'endDate' | 'isActive'
      > & { tokenCount: number } = {
        id: contest.id,
        name: contest.name,
        startDate: contest.startDate,
        endDate: contest.endDate,
        isActive: contest.isActive,
        tokenCount: ContestEntry.tokens.toNumber(),
      };
      if (contest.type === ContestType.MATCH) {
        const offers = (
          await prisma.offer.findMany({
            where: {
              league: input.league?.toUpperCase() as League,
              status: Status.Scheduled,
              inplay: false,
              markets: {
                some: {
                  type: MarketType.GM,
                },
              },
            },
            include: {
              markets: {
                where: {
                  type: MarketType.GM,
                  moneyline: {
                    not: null,
                  },
                  spread: {
                    not: null,
                  },
                  total: {
                    not: null,
                  },
                },
              },
              home: true,
              away: true,
            },
          })
        )
          .map((offer) => {
            const away = offer.markets.find(
              (mkt) => mkt.teamId === offer.away.id,
            );
            const home = offer.markets.find(
              (mkt) => mkt.teamId === offer.home.id,
            );
            if (!away || !home) {
              return null;
            }
            return {
              id: offer.gid,
              away: {
                name: offer.away.name,
                marketId: away.id,
                marketSelId: away.sel_id,
                spread: {
                  value: away.spread || 0,
                  odds: away.spread_odd || 0,
                },
                total: {
                  value: away.total || 0,
                  odds: away.under || 0,
                },
                moneyline: {
                  value: 100,
                  odds: away.moneyline || 0,
                },
              },
              home: {
                name: offer.home.name,
                marketId: home.id,
                marketSelId: home.sel_id,
                spread: {
                  value: home.spread || 0,
                  odds: home.spread_odd || 0,
                },
                total: {
                  value: home.total || 0,
                  odds: home.over || 0,
                },
                moneyline: {
                  value: 100,
                  odds: home.moneyline || 0,
                },
              },
              matchTime: offer.start_utc || '',
            };
          })
          .filter(Boolean);
        return {
          ...contestProps,
          filters: ['straight', 'parlay', 'teaser'],
          offers: offers,
          type: ContestType.MATCH,
        };
      } else if (contest.type === ContestType.FANTASY) {
        // TODO: get all players in league who have stats matching the set of filters for that league
        const filters = getFiltersByLeague(input.league);
        const offers: FantasyOffer[] = await getFantasyOffers(input.league);

        return {
          ...contestProps,
          filters,
          offers: offers,
          type: ContestType.FANTASY,
        };
      } else {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Undefined contest type',
        });
      }
    }),
  joinContest: t.procedure
    .input(
      yup.object({
        contestId: yup.string().required(),
        tokens: yup.number().required(),
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
            tokens: input.tokens,
          },
        });
      } catch (error) {
        throw error;
      }
    }),
});

/**
 * This function will get the mapping from league to supported stat lines
 * for fantasy picks. The idea is that these directly mimic a property in the database
 * so that this function can generically be expanded to support different stat lines.
 *
 * @param league one of the supported league enums in the application
 */
function getFiltersByLeague(league: League): string[] {
  switch (league) {
    case League.MLB:
      return Object.values(StatNames.MLB);
    case League.NBA:
    case League.NCAAB:
      return Object.values(StatNames.NBA_AND_NCAAB);
    case League.NFL:
    case League.NCAAF:
      return Object.values(StatNames.NFL_AND_NCAAF);
    case League.NHL:
      return Object.values(StatNames.NHL);
  }
}

const mapData = (
  data: Market & {
    offer: Offer | null;
  },
): FantasyOffer => {
  return {
    id: data.id,
    // TODO: need a player photo api
    playerPhotoURL: `https://evanalytics.com/images/${data.offer?.league.toLowerCase()}/${
      data.teamAbbrev
    }.png`,
    statName: data.category as StatNames.all,
    total: data.total || 0,
    matchName: data.offer?.matchup || '',
    playerName: data.name,
    tags: [],
    marketId: data.id,
    selId: data.sel_id,
    league: data.offer!.league,
    matchTime: data.offer!.gamedate || '',
    odds: 100,
  };
};

/**
 * This function gets all the fantasy offers currently available for a given league.
 *
 * It will check for players with upcoming games in the next week (that have not started), and then give an over under based on their estimated
 * statline that will be 50/50 odds either way with a push for the exact value.
 *
 * @param league one of the supported league enums in the application
 */
async function getFantasyOffers(league: League): Promise<FantasyOffer[]> {
  const markets = await prisma.market.findMany({
    where: {
      offer: {
        league,
        status: Status.Scheduled,
      },
    },
    include: {
      offer: true,
    },
  });
  return markets.map(mapData);
}
