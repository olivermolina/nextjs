import { t } from '../../trpc';
import * as yup from '~/utils/yup';
import { TRPCError } from '@trpc/server';
import {
  BetLeg,
  BetLegType,
  BetStakeType,
  BetStatus,
  ContestWagerType,
  TransactionType,
} from '@prisma/client';
import { prisma } from '~/server/prisma';
import { Market as IMarket } from '~/lib/ev-analytics/IOddsResponse';
import logger from '~/utils/logger';
import { TOKEN } from '~/constants/TOKEN';
import { createTransaction } from '~/server/routers/bets/createTransaction';
import { ActionType } from '~/constants/ActionType';

export const grade = t.procedure
  .input(yup.mixed<{ markets: IMarket[]; token: string }>().required())
  .mutation(async ({ input }) => {
    try {
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
      logger.info(`Grading bets.`, {
        marketsById,
        marketCount: marketsById.size,
        ugLegIds: ugLegs.map((ug) => ug.id),
        ugCount: ugLegs.length,
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
        const computedId = ugLeg.marketId + ugLeg.marketSel_id;
        const market =
          marketsById.get(computedId) ||
          (await prisma.market.findFirst({
            where: {
              id: computedId,
            },
          }));
        if (
          !market ||
          market.total_stat === null ||
          market.total_stat === undefined
        ) {
          logger.warn(`No market associated for leg ${ugLeg.id}.`);
        } else {
          // If bet was won, update status and pay user
          switch (ugLeg.type) {
            case BetLegType.OVER_ODDS:
              if (ugLeg.total.toNumber() < market.total_stat) {
                newBetStatus[BetStatus.WIN].push(ugLeg.id);
              } else if (ugLeg.total.toNumber() == market.total_stat) {
                newBetStatus[BetStatus.PUSH].push(ugLeg.id);
              } else {
                newBetStatus[BetStatus.LOSS].push(ugLeg.id);
              }
              break;
            case BetLegType.UNDER_ODDS:
              if (ugLeg.total.toNumber() > market.total_stat) {
                newBetStatus[BetStatus.WIN].push(ugLeg.id);
              } else if (ugLeg.total.toNumber() == market.total_stat) {
                newBetStatus[BetStatus.PUSH].push(ugLeg.id);
              } else {
                newBetStatus[BetStatus.LOSS].push(ugLeg.id);
              }
              break;
            default:
              throw Error('Unsupported entry leg type');
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
          ContestEntries: {
            include: { contest: true },
          },
          ContestCategory: true,
        },
      });

      for (const bet of completelyGradedBets) {
        if (bet.stakeType === BetStakeType.ALL_IN) {
          if (bet.legs.every((l) => l.status === BetStatus.PUSH)) {
            // user has lost, update the bet
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
                    decrement: bet.payout,
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
          if (bet.legs.some((l) => l.status === BetStatus.LOSS)) {
            // user has lost, update the bet
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
                    decrement: bet.payout,
                  },
                },
              }),
              prisma.bet.update({
                where: {
                  id: bet.id,
                },
                data: {
                  status: BetStatus.LOSS,
                },
              }),
            ]);
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

            // Increment user cash amount
            if (
              bet.ContestEntries?.contest?.wagerType === ContestWagerType.CASH
            ) {
              await createTransaction({
                userId: bet.ContestEntries.userId,
                amountProcess: Number(bet.payout),
                amountBonus: 0,
                transactionType: TransactionType.CREDIT,
                actionType: ActionType.CASH_CONTEST_WIN,
              });
            }
          }
        }

        if (bet.stakeType === BetStakeType.INSURED) {
          const winCount = bet.legs.filter(
            (l) => l.status === BetStatus.WIN,
          ).length;

          let insuredPayout = 0;
          switch (winCount) {
            case bet.ContestCategory.numberOfPicks:
              insuredPayout =
                Number(bet.stake) *
                bet.ContestCategory.primaryInsuredPayoutMultiplier;
              break;
            case bet.ContestCategory.numberOfPicks - 1:
              insuredPayout =
                Number(bet.stake) *
                bet.ContestCategory.secondaryInsuredPayoutMultiplier;
              break;
            default:
          }

          if (insuredPayout > 0) {
            // user has won primary insured amount, pay them out
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
                    increment: insuredPayout,
                  },
                },
              }),
              prisma.bet.update({
                where: {
                  id: bet.id,
                },
                data: {
                  payout: insuredPayout,
                  status: BetStatus.WIN,
                },
              }),
            ]);

            // Increment cash amount
            if (
              bet.ContestEntries?.contest?.wagerType === ContestWagerType.CASH
            ) {
              await createTransaction({
                userId: bet.ContestEntries.userId,
                amountProcess: insuredPayout,
                amountBonus: 0,
                transactionType: TransactionType.CREDIT,
                actionType: ActionType.CASH_CONTEST_WIN,
              });
            }
          } else {
            // user has lost, update the bet and wallet
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
                    decrement: insuredPayout,
                  },
                },
              }),
              prisma.bet.update({
                where: {
                  id: bet.id,
                },
                data: {
                  status: BetStatus.LOSS,
                },
              }),
            ]);
          }
        }
      }
    } catch (error) {
      logger.error('There was an error grading bets.', error);
      throw error;
    }
  });
