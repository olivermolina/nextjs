import { Market, Offer } from '@prisma/client';
import { FantasyOffer } from '~/types';
import * as StatNames from '~/server/routers/IStatNames';

export const mapData = (
  data: Market & {
    offer: Offer | null;
  },
): FantasyOffer => {
  return {
    id: data.id,
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
