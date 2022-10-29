import { NextApiRequest, NextApiResponse } from 'next';
import { appRouter } from '~/server/routers/_app';
import logger from '~/utils/logger';

const caller = appRouter.createCaller({} as any);

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  logger.info('Received GIDX callback status', { body: req.body });

  caller.integration.gidxCallback({
    ...req.body,
  });

  res.status(200).send({
    MerchantTransactionID: req.body.result?.MerchantTransactionID,
  });
};

export default handler;
