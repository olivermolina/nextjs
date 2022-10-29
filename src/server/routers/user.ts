import { t } from '../trpc';
import controller from '../controller';

export const userRouter = t.router({
  ...controller.users,
});
