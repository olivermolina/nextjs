import { verifySignature } from '@upstash/qstash/nextjs';
import chunk from 'lodash.chunk';
import { NextApiRequest, NextApiResponse } from 'next';
import { TOKEN } from '~/constants/TOKEN';
import { getData, getLookups } from '~/lib/etl/Ingest';
import { LeagueEnum } from '~/lib/ev-analytics/EVAnaltyics';
import { appRouter } from '~/server/routers/_app';
import defaultLogger from '~/utils/logger';

const caller = appRouter.createCaller({} as any);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  for (const league of Object.values(LeagueEnum)) {
    const logger = defaultLogger.child({ leagues: league });
    logger.info('Ingesting data for league');
    const data = await getData(league, logger);
    const lookups = await getLookups(league, logger);

    // Get players
    caller.etl.ingestByLeague({
      league,
      token: TOKEN,
      options: {
        players: true,
        initialData: data,
        initialLookup: lookups,
      },
    });

    // Get teams
    caller.etl.ingestByLeague({
      league,
      token: TOKEN,
      options: {
        teams: true,
        initialData: data,
        initialLookup: lookups,
      },
    });

    const events = data?.events || [];
    for (const offerChunk of chunk(events, 3)) {
      // Get offers
      caller.etl.ingestByLeague({
        league,
        token: TOKEN,
        options: {
          offers: true,
          markets: true,
          initialData: {
            events: offerChunk,
          },
          initialLookup: lookups,
        },
      });
    }
  }
  res.status(200).end();
}

const handlerWrapper =
  process.env.NODE_ENV === 'development' ? handler : verifySignature(handler);
export default handlerWrapper;

export const config = {
  api: {
    bodyParser: false,
  },
};
