import React from 'react';
import { Layout } from '~/components/Layout';
import { ToastContainer } from 'react-toastify';
import { useQueryParams } from '~/hooks/useQueryParams';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import { UrlPaths } from '~/constants/UrlPaths';
import { useAppSelector } from '~/state/hooks';
import { selectAllBets } from '~/state/bets';
import { ContestWagerType, League } from '@prisma/client';
import ContestDetailContainer from '../ContestDetailContainer/ContestDetailContainer';

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
  const selectedContest = useAppSelector((state) => state.ui.selectedContest);

  const result = trpc.contest.listOffers.useQuery({
    contestId: params.contestId,
    league: params.league as League,
  });

  const { data: userTotalCashAmount } =
    trpc.user.userTotalCashAmount.useQuery();

  const tokenCount = result.data?.tokenCount;
  return (
    <>
      <Layout
        onClickCartDetails={() => {
          router.push(UrlPaths.Cart);
        }}
        cartItemsCount={cartItemsCount}
        cartStake={cartStake}
        cartPotentialPayout={cartPayout}
        // TODO: [LOC-171] fetch user cash amount
        userCashAmount={userTotalCashAmount || 0}
        currentContestTokenCount={tokenCount}
        onClickAddUserCash={() => {
          // TODO: [LOC-172] navigate to a page where a user can add cash
        }}
        // Exclude showing sub nav in picks and profile page
        showSubNav={
          ![
            UrlPaths.Picks.toString(),
            UrlPaths.Profile.toString(),
            UrlPaths.Cart.toString(),
            UrlPaths.Contests.toString(),
          ].includes(router?.pathname)
        }
        showTokenCount={selectedContest?.wagerType === ContestWagerType.TOKEN}
      >
        {props.children}
      </Layout>
      <ContestDetailContainer />
      <ToastContainer />
    </>
  );
};

export default LayoutContainer;
