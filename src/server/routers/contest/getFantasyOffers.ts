import { League, Status } from '@prisma/client';
import { FantasyOffer } from '~/types';
import { prisma } from '~/server/prisma';
import { mapData } from '~/server/routers/contest/mapData';

/**
 * This function gets all the fantasy offers currently available for a given league.
 *
 * It will check for players with upcoming games in the next week (that have not started), and then give an over under based on their estimated
 * statline that will be 50/50 odds either way with a push for the exact value.
 *
 * @param league one of the supported league enums in the application
 */
export async function getFantasyOffers(
  league: League,
): Promise<FantasyOffer[]> {
  const markets = await prisma.market.findMany({
    where: {
      offer: {
        league,
        status: Status.Scheduled,
      },
    },
    include: {
      offer: true,
      player: true,
    },
  });
  return markets.map(mapData);
}
