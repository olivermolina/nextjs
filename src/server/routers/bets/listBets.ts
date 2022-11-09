import { t } from '../../trpc';
import * as yup from '~/utils/yup';
import { TRPCError } from '@trpc/server';
import {
  Bet,
  BetLeg,
  BetStakeType,
  BetStatus,
  BetType,
  ContestWagerType,
  Market,
  Offer,
  ContestCategory,
} from '@prisma/client';
import { prisma } from '~/server/prisma';
import { PickSummaryProps } from '~/components/Picks/Picks';
import dayjs from 'dayjs';
import { PickStatus } from '~/constants/PickStatus';
import { calculateInsuredPayout } from '~/utils/calculateInsuredPayout';

const mapBetStatusToPickStatus = (status: BetStatus) => {
  switch (status) {
    case BetStatus.LOSS:
      return PickStatus.LOST;
    case BetStatus.WIN:
      return PickStatus.WON;
    case BetStatus.PENDING:
      return PickStatus.PENDING;
    case BetStatus.PUSH:
      return PickStatus.SETTLED;
  }
};

const getInsuredPayout = (stake: number, contestCategory: ContestCategory) => {
  const insuredPayouts = calculateInsuredPayout(stake, contestCategory);
  return {
    numberOfPicks: contestCategory.numberOfPicks,
    ...insuredPayouts,
  };
};

export const listBets = t.procedure
  .output(
    yup
      .mixed<Omit<PickSummaryProps, 'handleChangeTab' | 'selectedTabStatus'>>()
      .required(),
  )
  .query(async ({ ctx }) => {
    if (!ctx.session.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    const bets = await prisma.bet.findMany({
      where: {
        owner: {
          id: ctx.session.user.id,
        },
      },
      include: {
        legs: {
          include: {
            market: {
              include: { offer: true },
            },
          },
        },
        ContestEntries: {
          include: {
            contest: true,
          },
        },
        ContestCategory: true,
      },
    });
    const mappedBets = bets.map((b) =>
      b.type === BetType.PARLAY
        ? {
            type: b.type,
            status: mapBetStatusToPickStatus(b.status),
            data: {
              id: b.id,
              name: 'Parlay Bet',
              gameInfo: b.legs.map((l) => l.market.offer?.matchup).join(', '),
              contestType:
                b?.ContestEntries?.contest?.wagerType === ContestWagerType.CASH
                  ? 'More or Less'
                  : 'Token Contest',
              pickTime: dayjs(b.created_at).format('DD/MM/YYYY'),
              picks: b.legs.map((l) => ({
                id: l.id,
                name: l.market.name,
                description: l.market.name,
                gameInfo: l.market.offer?.matchup,
                value: l.total.toNumber(),
                matchTime: dayjs(
                  l.market.offer?.start_utc ||
                    `${l.market.offer?.gamedate} ${l.market.offer?.gametime} `,
                ).format('DD/MM/YYYY hh:mm A'),
                status: l.status,
                odd: l.type,
                category: l.market.category,
              })),
              potentialWin:
                b.stakeType === BetStakeType.INSURED
                  ? getInsuredPayout(b.stake.toNumber(), b.ContestCategory)
                  : b.payout.toNumber(),
              risk: b.stake.toNumber(),
              stakeType: b.stakeType,
            },
          }
        : {
            type: b.type,
            status: mapBetStatusToPickStatus(b.status),
            data: {
              id: b.id,
              name: 'Straight Bet',
              description: b.legs[0]!.market.name,
              gameInfo: b.legs[0]!.market.offer?.matchup,
              contestType: 'More or Less',
              pickTime: dayjs(b.created_at).format('DD/MM/YYYY'),
              potentialWin:
                b.stakeType === BetStakeType.INSURED
                  ? getInsuredPayout(b.stake.toNumber(), b.ContestCategory)
                  : b.payout.toNumber(),
              risk: b.stake.toNumber(),
              status: mapBetStatusToPickStatus(b.status),
              value: b.legs[0]!.total.toNumber(),
              odd: b.legs[0]!.type,
              stakeType: b.stakeType,
            },
          },
    );
    const summaryItems = getSummaries(bets);
    return {
      summaryItems: summaryItems,
      picks: mappedBets,
    };
  });

function getSummaries(
  bets: (Bet & {
    legs: (BetLeg & {
      market: Market & {
        offer: Offer | null;
      };
    })[];
  })[],
) {
  return [
    {
      label: 'Wagers Won',
      value: bets.reduce(
        (acc, curr) => acc + (curr.status === BetStatus.WIN ? 1 : 0),
        0,
      ),
      priority: 1,
    },
    {
      label: 'Wagers Lost',
      value: bets.reduce(
        (acc, curr) => acc + (curr.status === BetStatus.LOSS ? 1 : 0),
        0,
      ),
      priority: 2,
    },
    {
      label: 'Total Debit Wagered',
      value: bets.reduce((acc, curr) => acc + curr.stake.toNumber(), 0),
      priority: 3,
    },
    {
      label: 'Credit Gained',
      value: bets.reduce(
        (acc, curr) =>
          acc + (curr.status === BetStatus.WIN ? curr.payout.toNumber() : 0),
        0,
      ),
      priority: 4,
    },
    {
      label: 'Debit Lost',
      value: bets.reduce(
        (acc, curr) =>
          acc + (curr.status === BetStatus.LOSS ? curr.payout.toNumber() : 0),
        0,
      ),
      priority: 5,
    },
  ];
}
