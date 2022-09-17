import { IBetLeg } from '~/types';
import { BetModel } from '../state/bets';

export function formatLegType(
  type: BetModel['type'],
  team: BetModel['team'],
  gameId: number,
) {
  let retType: IBetLeg['type'];
  if (type === 'moneyline') {
    if (team === 'away') {
      retType = 'moneylineAwayOdds';
    } else {
      retType = 'moneylineHomeOdds';
    }
  } else if (type === 'spread') {
    if (team === 'away') {
      retType = 'spreadAwayOdds';
    } else {
      retType = 'spreadHomeOdds';
    }
  } else {
    if (team === 'over') {
      retType = 'overOdds';
    } else {
      retType = 'underOdds';
    }
  }
  return {
    type: retType,
    offerId: gameId,
  };
}
