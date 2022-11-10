import { t } from '../../trpc';
import * as yup from '~/utils/yup';
import { TRPCError } from '@trpc/server';
import { BetLeg, BetLegType, BetStatus } from '@prisma/client';
import { prisma } from '~/server/prisma';
import { Market as IMarket } from '~/lib/ev-analytics/IOddsResponse';
import logger from '~/utils/logger';
import { TOKEN } from '~/constants/TOKEN';

export const grade = t.procedure
  .input(yup.mixed<{ markets: IMarket[]; token: string }>().required())
  .mutation(async ({ input }) => {
    const markets = input.markets;
    const marketsById = new Map<string, IMarket>(
      markets.map((m) => [m.id + m.sel_id, m]),
    );
    if (input.token !== TOKEN) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    const ugLegs = await prisma.betLeg.findMany({
      where: {
        marketId: {
          in: markets.map((i) => i.id),
        },
        AND: {
          marketSel_id: {
            in: markets.map((i) => i.sel_id),
          },
        },
        Bet: {
          status: BetStatus.PENDING,
        },
      },
      include: {
        Bet: true,
      },
    });

    const newBetStatus: Record<BetStatus, BetLeg['id'][]> = {
      [BetStatus.WIN]: [],
      [BetStatus.PUSH]: [],
      [BetStatus.LOSS]: [],
      [BetStatus.PENDING]: [],
    };
    for (const ugLeg of ugLegs) {
      const bet = ugLeg.Bet;
      if (!bet) {
        throw new Error(`Bet leg ${ugLeg.id} missing bet`);
      }
      const market = marketsById.get(ugLeg.marketId + ugLeg.marketSel_id);
      if (!market || !market.total_stat) {
        logger.warn(`No market associated for leg ${ugLeg.id}.`);
      } else {
        // If bet was won, update status and pay user
        switch (ugLeg.type) {
          case BetLegType.OVER_ODDS:
            if (ugLeg.total.toNumber() > market.total_stat) {
              newBetStatus[BetStatus.WIN].push(ugLeg.id);
            } else if (ugLeg.total.toNumber() == market.total_stat) {
              newBetStatus[BetStatus.PUSH].push(ugLeg.id);
            } else {
              newBetStatus[BetStatus.LOSS].push(ugLeg.id);
            }
            break;
          case BetLegType.UNDER_ODDS:
            if (ugLeg.total.toNumber() < market.total_stat) {
              newBetStatus[BetStatus.WIN].push(ugLeg.id);
            } else if (ugLeg.total.toNumber() == market.total_stat) {
              newBetStatus[BetStatus.PUSH].push(ugLeg.id);
            } else {
              newBetStatus[BetStatus.LOSS].push(ugLeg.id);
            }
            break;
          default:
            throw Error('Unsupported bet leg type');
        }
      }
    }
    for (const [status, ids] of Object.entries(newBetStatus)) {
      if (ids.length > 0) {
        await prisma.betLeg.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            status: status as BetStatus,
          },
        });
      }
    }

    const completelyGradedBets = await prisma.bet.findMany({
      where: {
        legs: {
          every: {
            NOT: {
              status: BetStatus.PENDING,
            },
          },
        },
        status: BetStatus.PENDING,
      },
      include: {
        legs: true,
        ContestEntries: true,
      },
    });

    for (const bet of completelyGradedBets) {
      if (bet.legs.every((l) => l.status === BetStatus.PUSH)) {
        // user has lost, udpate the bet
        await prisma.$transaction([
          prisma.wallets.update({
            where: {
              userId_contestsId: {
                userId: bet.userId,
                contestsId: bet.ContestEntries.contestsId,
              },
            },
            data: {
              balance: {
                increment: bet.stake,
              },
            },
          }),
          prisma.bet.update({
            where: {
              id: bet.id,
            },
            data: {
              status: BetStatus.PUSH,
            },
          }),
        ]);
      }
      if (bet.legs.every((l) => l.status === BetStatus.LOSS)) {
        // user has lost, udpate the bet
        await prisma.bet.update({
          where: {
            id: bet.id,
          },
          data: {
            status: BetStatus.LOSS,
          },
        });
      }
      if (bet.legs.every((l) => l.status === BetStatus.WIN)) {
        // user has won, pay them out
        await prisma.$transaction([
          prisma.wallets.update({
            where: {
              userId_contestsId: {
                userId: bet.userId,
                contestsId: bet.ContestEntries.contestsId,
              },
            },
            data: {
              balance: {
                increment: bet.payout,
              },
            },
          }),
          prisma.bet.update({
            where: {
              id: bet.id,
            },
            data: {
              status: BetStatus.WIN,
            },
          }),
        ]);
      }
    }
  });
