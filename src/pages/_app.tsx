import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { AppType } from 'next/dist/shared/lib/utils';
import { ReactElement, ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '~/state/store';
import { trpc } from '~/utils/trpc';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <>{page}</>);
  const [queryClient] = useState(() => new QueryClient());
  const store = createStore();
  return getLayout(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </Provider>,
  );
}) as AppType;

export default trpc.withTRPC(MyApp);
