import { NextApiRequest, NextApiResponse } from 'next';
import { appRouter } from '~/server/routers/_app';
import logger from '~/utils/logger';

const caller = appRouter.createCaller({} as any);

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  logger.info(`Received GIDX callback status`, {
    method,
    body,
  });

  if (method !== 'POST') {
    res.status(200).send({
      message: 'success',
    });
  } else {
    const { result } = req?.body?.result;
    caller.integration.gidxCallback({
      result,
    });
    res.status(200).send({
      MerchantTransactionID: result?.MerchantTransactionID || '',
    });
  }
};

export default handler;
