/**
 * This file contains the root router of your tRPC-backend
 */
import { t } from '../trpc';
import { healthRouter } from './health';
import { contestRouter } from './contest';
import { userRouter } from './user';

export const appRouter = t.router({
  contest: contestRouter,
  user: userRouter,
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
