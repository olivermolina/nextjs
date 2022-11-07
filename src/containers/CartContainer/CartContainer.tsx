import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { removeBet, selectAllBets, updateBet } from '../../state/bets';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  mapParlayToCartItem,
  mapStraightToCartItem,
  mapTeaserToCartItem,
} from './mapData';
import Link from 'next/link';
import { Cart, CartProps } from '~/components/Cart';
import { formatLegType } from '~/utils/formatLegType';
import { BetType, ContestWagerType } from '@prisma/client';
import { trpc } from '~/utils/trpc';
import { useQueryParams } from '~/hooks/useQueryParams';

const CartContainer = () => {
  const dispatch = useAppDispatch();
  const { contestCategoryId } = useQueryParams();
  const { isLoading, mutateAsync } = trpc.bets.placeBet.useMutation();
  const [selectedTab, setTab] = useState<CartProps['activeTab']>('playerOU');
  const bets = useAppSelector((state) => selectAllBets(state));
  const selectedContest = useAppSelector((state) => state.ui.selectedContest);

  const onSubmitBet = async () => {
    const betModels = bets;
    for (const bet of betModels) {
      try {
        const isTeaser = 'type' in bet;
        if (isTeaser && bet.legs.length !== 2) {
          toast.error(`Teasers require two bets`);
          return;
        }

        if (bet.legs.length !== bet.contestCategory.numberOfPicks) {
          toast.error(`Bet require ${bet.contestCategory.numberOfPicks} bets.`);
          return;
        }

        await mutateAsync({
          stake: bet.stake,
          legs: bet.legs.map((l) => ({
            offerId: l.gameId,
            marketId: l.marketId,
            marketSelId: l.marketSelId,
            type: formatLegType(l.type, l.team),
            total: l.total,
          })),
          contestId: bet.contest,
          type: isTeaser
            ? BetType.TEASER
            : bet.legs.length > 1
            ? BetType.PARLAY
            : BetType.STRAIGHT,
          contestCategoryId: bet.contestCategory?.id || '',
          stakeType: bet.stakeType,
        });
        dispatch(removeBet(bet.betId));
        toast.success(`Successfully placed bet with id: ${bet.betId}.`);
      } catch (error: any) {
        toast.error(
          error.shape?.message ||
            `There was an error submitting bet with id: ${bet.betId}.`,
        );
        dispatch(
          updateBet({
            id: bet.betId,
            changes: {
              error: error.data?.message || 'Unknown error.',
            },
          }),
        );
      }
    }
  };
  const cartItems = useMemo(
    () =>
      bets
        .filter((bet) =>
          selectedTab === 'playerOU'
            ? bet.contestWagerType === ContestWagerType.CASH
            : bet.contestWagerType === ContestWagerType.TOKEN,
        )
        .map((bet) => {
          const isStraightBet = !('legs' in bet);
          if (isStraightBet) {
            return mapStraightToCartItem(bet, dispatch);
          } else {
            const isTeaser = 'type' in bet;
            if (isTeaser) {
              return mapTeaserToCartItem(bet, dispatch);
            } else {
              return mapParlayToCartItem(bet, dispatch);
            }
          }
        }),
    [bets, selectedTab, selectedContest, contestCategoryId],
  );

  useEffect(() => {
    if (selectedContest) {
      setTab(
        selectedContest.wagerType === ContestWagerType.CASH
          ? 'playerOU'
          : 'teamToken',
      );
    }
  }, [selectedContest]);

  return (
    <Cart
      onClickSubmitForm={onSubmitBet}
      activeTab={selectedTab}
      links={[
        <Link key={'/privacy'} href="/privacy">
          Privacy
        </Link>,
        <Link key={'/terms'} href="/terms">
          Terms
        </Link>,
        <Link key={'/advertising'} href="/advertising">
          Advertising
        </Link>,
        <Link key={'/Cookies'} href="/Cookies">
          Cookies
        </Link>,
      ]}
      showLoading={isLoading}
      cartItems={cartItems}
    />
  );
};

export default CartContainer;
