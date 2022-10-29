import * as yup from '~/utils/yup';
import {
  BetLegType,
  BetStatus,
  BetType,
  ContestEntry,
  Market,
  Prisma,
} from '@prisma/client';
import { prisma } from '~/server/prisma';
import { calculateTeaserPayout } from '~/utils/caculateTeaserPayout';
import { calculateParlayPayout } from '~/utils/calculateParlayPayout';
import { calculateTotalOdds } from '~/utils/calculateTotalBets';
import { User } from '@supabase/supabase-js';

function placeBetSchema(isTeaser: boolean) {
  return yup.object().shape({
    /**
     * This is how much the betting user wants to stake.
     */
    stake: yup
      .number()
      .moreThan(0, 'Parlay stake must be more than 0.')
      .required('Stake is required when creating a parlay.'),
    /**
     * This is the id of the contest.
     */
    contest: yup.number(),
    /**
     * These are all the legs of the bet.
     */
    legs: yup.array().of(
      yup.object().shape({
        offerId: yup.string().required(),
        type: yup
          .mixed()
          .oneOf(
            isTeaser
              ? [
                  BetLegType.OVER_ODDS,
                  BetLegType.UNDER_ODDS,
                  BetLegType.SPREAD_AWAY_ODDS,
                  BetLegType.SPREAD_HOME_ODDS,
                ]
              : [
                  BetLegType.OVER_ODDS,
                  BetLegType.UNDER_ODDS,
                  BetLegType.SPREAD_AWAY_ODDS,
                  BetLegType.SPREAD_HOME_ODDS,
                  BetLegType.MONEYLINE_AWAY_ODDS,
                  BetLegType.MONEYLINE_HOME_ODDS,
                ],
          )
          .required(),
      }),
    ),
  });
}
export type LegCreateInput = {
  total: number;
  marketId: Market['id'];
  marketSelId: Market['sel_id'];
  type: BetLegType;
};
export type BetInputType = {
  stake: number;
  contestId: ContestEntry['id'];
  type: BetType;
  legs: LegCreateInput[];
};
/**
 * Given a bet, will create the bet, a post for the bet, and update a users balance.
 *
 * Rules:
 * - Bets cannot challenge people if applying to a contest.
 * - Bets cannot be made with insufficient funds.
 * - Bets will default to challenging the house.
 * - Bets cannot be made on a game that is 15 minutes or less from being started.
 */
export async function placeBet(bet: BetInputType, user: User): Promise<void> {
  const isTeaser = bet.type === BetType.TEASER;
  const validPayload = placeBetSchema(isTeaser).validateSync(bet);

  const legs: Prisma.BetLegCreateManyBetInput[] = await Promise.all(
    bet.legs.map(async (leg): Promise<Prisma.BetLegCreateManyBetInput> => {
      const market = await prisma.market.findFirstOrThrow({
        where: {
          id: leg.marketId,
          sel_id: leg.marketSelId,
        },
      });
      return {
        type: leg.type,
        odds: getOdds(leg, market),
        marketId: leg.marketId,
        marketSel_id: leg.marketSelId,
        total: leg.total,
      };
    }),
  );

  const payout = isTeaser
    ? calculateTeaserPayout(validPayload.stake)
    : calculateParlayPayout(
        legs.map((leg) => leg.odds) as number[],
        validPayload.stake,
      );
  const odds = isTeaser
    ? -110
    : calculateTotalOdds(legs.map((l) => l.odds) as number[], 'american');
  await prisma.bet.create({
    data: {
      stake: bet.stake,
      status: BetStatus.PENDING,
      owner: {
        connect: {
          id: user.id,
        },
      },
      payout: payout,
      type: bet.type,
      legs: {
        createMany: {
          data: legs,
        },
      },
      odds: odds,
      ContestEntries: {
        connect: {
          id: bet.contestId,
        },
      },
    },
  });
}

function getOdds(leg: LegCreateInput, market: Market): number {
  switch (leg.type) {
    case 'OVER_ODDS':
      if (!market.over) {
        throw new Error(
          'Missing [market.over] market for leg ' + JSON.stringify(leg),
        );
      }
      return market.over;
    case 'UNDER_ODDS':
      if (!market.under) {
        throw new Error(
          'Missing [market.under] market for leg ' + JSON.stringify(leg),
        );
      }
      return market.under;
    case 'SPREAD_AWAY_ODDS':
    case 'SPREAD_HOME_ODDS':
      if (!market.spread) {
        throw new Error(
          'Missing [market.spread] market for leg ' + JSON.stringify(leg),
        );
      }
      return market.spread;
    case 'MONEYLINE_AWAY_ODDS':
    case 'MONEYLINE_HOME_ODDS':
      if (!market.moneyline) {
        throw new Error(
          'Missing [market.moneyline] market for leg ' + JSON.stringify(leg),
        );
      }
      return market.moneyline;
    default:
      throw new Error(`Unknown odds type for leg: ${JSON.stringify(leg)}`);
  }
}
