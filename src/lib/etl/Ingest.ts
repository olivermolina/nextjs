/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Prisma, MarketResult } from '@prisma/client';
import { prisma } from '~/server/prisma';
import logger from '~/utils/logger';
import EVAnalytics, { LeagueEnum } from '../ev-analytics/EVAnaltyics';
import { IOddsResponse } from '../ev-analytics/IOddsResponse';

const mapOffer = (e: IOddsResponse['events'][0]) =>
  ({
    gid: e.gid.toString(),
    gamedate: e.gamedate,
    epoch: e.epoch,
    start_utc: e.start_utc,
    end_utc: e.end_utc,
    inplay: e.inplay,
    status: e.status,
    matchup: e.matchup,
    gametime: e.gametime,
    homeTeamId: e.home.id,
    awayTeamId: e.away.id,
  } as Prisma.XOR<
    Prisma.OfferCreateWithoutMarketsInput,
    Prisma.OfferUncheckedCreateWithoutMarketsInput
  >);

type MarketType = IOddsResponse['events'][0]['markets'][0];

const mapResult = (res: MarketType['over_result']): MarketResult => {
  switch (res) {
    case 0:
      return MarketResult.Zero;
    case 1:
      return MarketResult.One;
    case null:
    default:
      return MarketResult.Null;
  }
};

export const ingest = async (leagues = Object.values(LeagueEnum)) => {
  const profiler = logger.startTimer();
  logger.info(`Ingesting for leagues: ${leagues}`);
  for (const league of leagues) {
    const data = await EVAnalytics.getLeague(league);
    logger.info(`Fetched ${data.events.length} games`);
    const { teams, players } = await EVAnalytics.getLookups(league);
    logger.info(`Fetched ${teams.length}/${players.length} teams/players`);

    const teamMap: TeamMapType = new Map(
      teams.map((t) => [
        t.id,
        {
          ...t,
          code: t.abbreviation,
        },
      ]),
    );

    const playersMap: PlayerMapType = new Map(players.map((p) => [p.id, p]));

    // Insert games
    await prisma.$transaction([
      ...players.map((p) =>
        prisma.player.upsert({
          where: { id: p.id },
          create: p,
          update: p,
        }),
      ),
      ...teams.map((t) =>
        prisma.team.upsert({
          where: { id: t.id },
          update: {
            id: t.id,
            name: t.name,
            code: t.abbreviation,
          },
          create: { id: t.id, name: t.name, code: t.abbreviation },
        }),
      ),
      ...data.events.flatMap((e) => {
        const offer = prisma.offer.upsert({
          where: { gid: e.gid.toString() },
          create: mapOffer(e),
          update: mapOffer(e),
        });
        const markets = e.markets.map((m) =>
          prisma.market.upsert({
            where: { id: m.id },
            create: mapMarkets(m, e, playersMap, teamMap),
            update: mapMarkets(m, e, playersMap, teamMap),
          }),
        );
        return [offer, ...markets];
      }),
    ]);
  }
  profiler.done({
    name: 'Ingest',
    params: leagues,
  });
};
type PlayerMapType = Map<
  Prisma.PlayerCreateWithoutMarketInput['id'],
  Prisma.PlayerCreateWithoutMarketInput
>;

type TeamMapType = Map<
  Prisma.TeamCreateWithoutMarketInput['id'],
  Prisma.TeamCreateWithoutMarketInput
>;

function mapMarkets(
  m: MarketType,
  e: IOddsResponse['events'][0],
  players: PlayerMapType,
  teams: TeamMapType,
): Prisma.MarketCreateInput {
  const createPlayer = players.get(m.sel_id)!;
  const createTeam = teams.get(m.sel_id)!;

  return {
    id: m.id,
    ...(m.type === 'PP'
      ? {
          player: { connect: { id: createPlayer.id } },
        }
      : {
          team: {
            connect: { id: createTeam.id },
          },
        }),
    offer: {
      connect: { gid: e.gid.toString() },
    },
    type: m.type,
    category: m.category,
    name: m.name,
    teamAbbrev: m.team,
    offline: m.offline,
    spread: m.spread,
    spread_odd: m.spread_odd,
    total: m.total,
    over: m.over,
    under: m.under,
    moneyline: m.moneyline,
    spread_bet: m.spread_bet,
    spread_cash: m.spread_cash,
    over_bet: m.over_bet,
    under_bet: m.under_bet,
    over_cash: m.over_cash,
    under_cash: m.under_cash,
    moneyline_bet: m.moneyline_bet,
    moneyline_cash: m.moneyline_cash,
    spread_result: mapResult(m.spread_result),
    spread_stat: m.spread_stat,
    over_result: mapResult(m.over_result),
    under_result: mapResult(m.under_result),
    total_stat: m.total_stat,
    moneyline_result: mapResult(m.moneyline_result),
    moneyline_stat: m.moneyline_stat,
  };
}
