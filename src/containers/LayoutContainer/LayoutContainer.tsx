import React from 'react';
import { Layout } from '~/components/Layout';
import { ToastContainer } from 'react-toastify';
import { useQueryParams } from '~/hooks/useQueryParams';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import { UrlPaths } from '~/constants/UrlPaths';
import { useAppSelector } from '~/state/hooks';
import { selectAllBets } from '~/state/bets';
import { League } from '@prisma/client';

type Props = {
  children: any;
};

const LayoutContainer: React.FC<Props> = (props) => {
  const router = useRouter();
  const params = useQueryParams();
  const cartItemsCount = useAppSelector((state) => selectAllBets(state).length);
  const cartStake = useAppSelector((state) =>
    selectAllBets(state).reduce((acc, cur) => acc + cur.stake, 0),
  );
  const cartPayout = useAppSelector((state) =>
    selectAllBets(state).reduce((acc, curr) => acc + 0, 0),
  );
  const result = trpc.contest.listOffers.useQuery({
    contestId: params.contestId,
    league: params.league as League,
  });
  const tokenCount = result.data?.tokenCount;
  return (
    <>
      <Layout
        onClickCartDetails={() => {
          // TODO: make cart page for mobile cart experience
          router.push('/cart');
        }}
        cartItemsCount={cartItemsCount}
        cartStake={cartStake}
        cartPotentialPayout={cartPayout}
        // TODO: fetch user cash amount
        userCashAmount={'0'}
        currentContestTokenCount={tokenCount}
        onClickAddUserCash={() => {
          if (router?.pathname !== UrlPaths.ProfileAccountDeposit)
            router.push(UrlPaths.ProfileAccountDeposit);
        }}
        // Exclude showing sub nav in picks and profile page
        showSubNav={[UrlPaths.Challenge.toString()].includes(router?.pathname)}
      >
        {props.children}
      </Layout>
      <ToastContainer />
    </>
  );
};

export default LayoutContainer;
