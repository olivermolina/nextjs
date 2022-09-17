import React, { useState } from 'react';
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

const CartContainer = () => {
  const dispatch = useAppDispatch();
  const bets = useAppSelector((state) => selectAllBets(state));
  const [selectedTab, setTab] = useState<CartProps['activeTab']>('teamToken');
  const [, setLoadingValue] = useState(0);
  const submitBet: any = () => alert('replace submit bet logic');
  const onSubmitBet = async () => {
    const betModels = bets;
    const totalBets = betModels.length;
    const normalise = (value: number) => ((value - 0) * 100) / (totalBets - 0);
    let i = 0;
    setLoadingValue(5);
    for (const bet of betModels) {
      try {
        if ('legs' in bet) {
          const isTeaser = 'type' in bet;
          if (isTeaser && bet.legs.length !== 2) {
            const err = new Error(`Teasers require two bets.`);
            // @ts-expect-error doesnt exist
            err.data = {
              message: `Teasers require two bets.`,
            };
            throw err;
          }
          await submitBet({
            stake: bet.stake,
            legs: bet.legs.map((l) => formatLegType(l.type, l.team, l.refId)),
            challenger: bet.challengerId,
            contest: bet.contest,
            type: isTeaser ? 'Teaser' : undefined,
          }).unwrap();
        } else {
          await submitBet({
            stake: bet.stake,
            legs: [formatLegType(bet.type, bet.team, bet.refId)],
            challenger: bet.challengerId,
            contest: bet.contest,
          }).unwrap();
        }
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
      setLoadingValue(normalise(++i));
    }
    setLoadingValue(0);
  };
  const toggleTeamTokenBets = () => setTab('teamToken');
  const togglePlayerBets = () => setTab('playerOU');
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
      cartItems={bets.map((bet) => {
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
      })}
    />
  );
};

export default CartContainer;
