import { t } from '../trpc';
import * as yup from '~/utils/yup';
import { LeagueEnum } from '~/lib/ev-analytics/EVAnaltyics';
import { ingest } from '~/lib/etl/Ingest';
import { TRPCError } from '@trpc/server';
import { TOKEN } from '~/constants/TOKEN';

export const etlRouter = t.router({
  ingestByLeague: t.procedure
    .input(
      yup
        .object({
          league: yup
            .mixed<LeagueEnum>()
            .oneOf(Object.values(LeagueEnum))
            .required(),
          token: yup.string().required(),
        })
        .required(),
    )
    .query(async ({ input }) => {
      if (input.token !== TOKEN) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Token incorrect',
        });
      }
      await void ingest([input.league]);
    }),
});
