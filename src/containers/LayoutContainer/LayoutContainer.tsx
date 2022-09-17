import React from 'react';
import { Layout } from '~/components/Layout';
import { ToastContainer } from 'react-toastify';
import { useQueryParams } from '~/hooks/useQueryParams';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';

type Props = {
  children: any;
};

const LayoutContainer: React.FC<Props> = (props) => {
  const router = useRouter();
  const params = useQueryParams();
  const result = trpc.contest.listOffers.useQuery({
    contestId: params.contestId,
    league: params.league,
  });
  const tokenCount = result.data?.tokenCount;
  return (
    <>
      <Layout
        onClickCartDetails={() => {
          // TODO: make cart page for mobile cart experience
          router.push('/cart');
        }}
        cartItemsCount={0}
        cartStake={0}
        cartPotentialPayout={0}
        // TODO fetch user cash amount
        userCashAmount={'100'}
        currentContestTokenCount={tokenCount}
        onClickAddUserCash={() => {
          // TODO: navigate to a page where a user can add cash
        }}
      >
        {props.children}
      </Layout>
      <ToastContainer />
    </>
  );
};

export default LayoutContainer;
