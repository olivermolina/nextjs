import { verifySignature } from '@upstash/qstash/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { TOKEN } from '~/constants/TOKEN';
import { LeagueEnum } from '~/lib/ev-analytics/EVAnaltyics';
import { appRouter } from '~/server/routers/_app';
import logger from '~/utils/logger';

const caller = appRouter.createCaller({} as any);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  for (const league of Object.values(LeagueEnum)) {
    logger.info('Ingesting data for league', { league });
    void caller.etl.ingestByLeague({
      league,
      token: TOKEN,
    });
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
