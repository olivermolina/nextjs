import {
  BetModel,
  ParlayModel,
  TeaserModel,
  removeBet,
} from '../../state/bets';
import { formatLegType } from '../../utils/formatLegType';
import { calculateParlayPayout } from '../../utils/calculateParlayPayout';
import { calculateTeaserPayout } from '../../utils/caculateTeaserPayout';
import shiftLine from '../../utils/shiftBet';
import { calculateStraightPayout } from '../../utils/calculateStraightPayout';
import { CartProps } from '~/components';

type CartItem = CartProps['cartItems'][0];

export function mapStraightToCartItem(bet: BetModel, dispatch: any): CartItem {
  return {
    id: bet.betId.toString(),
    legs: [
      {
        league: bet.league.toString(),
        matchTime: bet.matchTime,
        onClickDeleteCartItem: () => {
          dispatch(removeBet(bet.betId.toString()));
        },
        betName: bet.type,
        betOdds: bet.odds,
        betType: bet.line,
        awayTeamName: bet.entity2,
        homeTeamName: bet.entity1,
      },
    ],
    stake: bet.stake.toString(),
    payout: calculateStraightPayout(bet),
  };
}
export function mapParlayToCartItem(bet: ParlayModel, dispatch: any): CartItem {
  return {
    id: bet.betId.toString(),
    legs: bet.legs.map((leg) => ({
      league: leg.league,
      matchTime: leg.matchTime,
      onClickDeleteCartItem: () => {
        dispatch(removeBet(bet.betId.toString()));
      },
      betName: leg.type,
      betOdds: leg.odds,
      betType: leg.line,
      awayTeamName: leg.entity2,
      homeTeamName: leg.entity1,
    })),
    stake: bet.stake.toString(),
    payout: calculateParlayPayout(
      bet.legs.map((bet) => bet.odds),
      bet.stake,
    ).toString(),
  };
}
export function mapTeaserToCartItem(bet: TeaserModel, dispatch: any): CartItem {
  return {
    id: bet.betId.toString(),
    legs: bet.legs.map((leg) => {
      const [type, number] = leg.line.split(' ');
      return {
        league: leg.league,
        matchTime: leg.matchTime,
        onClickDeleteCartItem: () => {
          dispatch(removeBet(bet.betId.toString()));
        },
        betName: leg.type,
        betOdds: leg.odds,
        betType:
          leg.team +
          type +
          ' ' +
          shiftLine(
            Number(number),
            leg.league,
            formatLegType(leg.type, leg.team, leg.gameId).type,
          ),
        awayTeamName: leg.entity2,
        homeTeamName: leg.entity1,
      };
    }),
    stake: bet.stake.toString(),
    payout: calculateTeaserPayout(bet.stake).toString(),
  };
}
