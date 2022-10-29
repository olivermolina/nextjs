import {
  BetModel,
  ParlayModel,
  TeaserModel,
  removeBet,
  updateBet,
} from '../../state/bets';
import { formatLegType } from '../../utils/formatLegType';
import { calculateParlayPayout } from '../../utils/calculateParlayPayout';
import { calculateTeaserPayout } from '../../utils/caculateTeaserPayout';
import shiftLine from '../../utils/shiftBet';
import { calculateStraightPayout } from '../../utils/calculateStraightPayout';
import { CartProps } from '~/components';
import { useAppDispatch } from '~/state/hooks';

type CartItem = CartProps['cartItems'][0];

function onUpdateCartItem(
  dispatch: ReturnType<typeof useAppDispatch>,
): (id: string, value: number) => void {
  return (id, value) => {
    dispatch(
      updateBet({
        id,
        changes: {
          stake: value,
        },
      }),
    );
  };
}

export function mapStraightToCartItem(
  bet: BetModel,
  dispatch: ReturnType<typeof useAppDispatch>,
): CartItem {
  return {
    id: bet.betId.toString(),
    legs: [
      {
        id: bet.betId,
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
    onUpdateCartItem: onUpdateCartItem(dispatch),
    stake: bet.stake.toString(),
    payout: calculateStraightPayout(bet),
  };
}

export function mapParlayToCartItem(
  bet: ParlayModel,
  dispatch: ReturnType<typeof useAppDispatch>,
): CartItem {
  return {
    id: bet.betId.toString(),
    legs: bet.legs.map((leg) => ({
      id: bet.betId,
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
    onUpdateCartItem: onUpdateCartItem(dispatch),
  };
}
export function mapTeaserToCartItem(
  bet: TeaserModel,
  dispatch: ReturnType<typeof useAppDispatch>,
): CartItem {
  return {
    id: bet.betId.toString(),
    legs: bet.legs.map((leg) => {
      const [type, number] = leg.line.split(' ');
      return {
        id: bet.betId,
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
            formatLegType(leg.type, leg.team),
          ),
        awayTeamName: leg.entity2,
        homeTeamName: leg.entity1,
      };
    }),
    stake: bet.stake.toString(),
    payout: calculateTeaserPayout(bet.stake).toString(),
    onUpdateCartItem: onUpdateCartItem(dispatch),
  };
}
