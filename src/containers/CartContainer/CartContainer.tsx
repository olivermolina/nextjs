import React, { useMemo, useState } from 'react';
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
import { BetType, ContestType } from '@prisma/client';
import { trpc } from '~/utils/trpc';

const CartContainer = () => {
  const dispatch = useAppDispatch();
  const { isLoading, mutateAsync } = trpc.bets.placeBet.useMutation();
  const [selectedTab, setTab] = useState<CartProps['activeTab']>('teamToken');
  const bets = useAppSelector((state) => selectAllBets(state));
  const onSubmitBet = async () => {
    const betModels = bets;
    for (const bet of betModels) {
      try {
        const isTeaser = 'type' in bet;
        if (isTeaser && bet.legs.length !== 2) {
          const err = new Error(`Teasers require two bets.`);
          // @ts-expect-error doesnt exist
          err.data = {
            message: `Teasers require two bets.`,
          };
          throw err;
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
        });
        dispatch(removeBet(bet.betId));
        toast.success(`Successfully placed bet with id: ${bet.betId}.`);
      } catch (error: any) {
        toast.error(
          error.data?.message ||
            `There was an error submitting bet with id: ${bet.betId}.`,
        );
        console.log(error);
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
  const toggleTeamTokenBets = () => setTab('teamToken');
  const togglePlayerBets = () => setTab('playerOU');
  const cartItems = useMemo(
    () =>
      bets
        .filter((bet) =>
          selectedTab === 'playerOU'
            ? bet.contestType === ContestType.FANTASY
            : bet.contestType === ContestType.MATCH,
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
    [bets, selectedTab],
  );
  return (
    <Cart
      onClickSubmitForm={onSubmitBet}
      onClickTeamToken={toggleTeamTokenBets}
      onClickPlayerOU={togglePlayerBets}
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
