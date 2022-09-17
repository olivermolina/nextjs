import dayjs from 'dayjs';
import React from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useQueryParams } from '~/hooks/useQueryParams';
import { BetInput, addBet, addToParlayBet, addToTeaserBet } from '~/state/bets';
import { useAppDispatch } from '~/state/hooks';
import { WarningAlert } from '~/components/Alert';
import { MatchPickRowTable } from '~/components/MatchPickRowTable/MatchPickRowTable';
import { trpc } from '~/utils/trpc';
import { League } from '@prisma/client';
import { LoadingSpinner } from '~/components/Cart/LoadingSpinner';
import { addPlusToNumber } from '~/utils/addPlusToNumber';
import { FantasyPicker } from '~/components/FantasyPicker/FantasyPicker';
import { FantasyMatchType } from '~/server/routers/contest';

const Header = (props: { isLoading: boolean }) => (
  <h2 className="pb-2 font-bold flex gap-2">
    SPORT OFFERS
    {props.isLoading && <LoadingSpinner />}
  </h2>
);

const MatchPickerTableContainer = () => {
  const { contestFilter, setParam, league, contestId } = useQueryParams();
  const result = trpc.contest.listOffers.useQuery({
    contestId: contestId,
    league: league as League,
  });
  const dispatch = useAppDispatch();
  const filters =
    result?.data?.filters.map((filter) => ({
      selected: filter === contestFilter,
      onClick: () => {
        setParam('contestFilter', filter);
      },
      // no returned filters should be disabled
      disabled: false,
      children: <span className="capitalize">{filter}</span>,
    })) || [];

  if (result.data === null) {
    return (
      <>
        <Header isLoading={result.isLoading} />
        <WarningAlert>
          <>
            Sign up for a contest here or on the{' '}
            <Link href="/contests">
              <span className="underline cursor-pointer">Contest tab</span>
            </Link>{' '}
            to get started.
          </>
        </WarningAlert>
      </>
    );
  } else if (result.isError) {
    console.error(result.error);
    return <>Error fetching games!</>;
  } else if (
    result.data &&
    'type' in result.data &&
    result.data?.type === 'match'
  ) {
    const matches = result.data.offers;
    return (
      <>
        <Header isLoading={result.isLoading} />
        <MatchPickRowTable
          filters={filters}
          matches={matches.map((offer) => ({
            id: offer.id,
            away: {
              name: offer.away.name,
              spread: {
                disabled: false,
                value: offer.away.spread.value,
                odds: offer.away.spread.odds,
              },
              total: {
                disabled: false,
                value: offer.away.total.value,
                odds: offer.away.total.odds,
              },
              moneyline: {
                disabled: false,
                value: offer.away.moneyline.value,
                odds: offer.away.moneyline.odds,
              },
            },
            home: {
              name: offer.home.name,
              spread: {
                disabled: false,
                value: offer.home.spread.value,
                odds: offer.home.spread.odds,
              },
              total: {
                disabled: false,
                value: offer.home.total.value,
                odds: offer.home.total.odds,
              },
              moneyline: {
                disabled: false,
                value: offer.home.moneyline.value,
                odds: offer.home.moneyline.odds,
              },
            },
            matchTime: dayjs(offer.matchTime).format('MM/DD/YY, HH:MM'),
            onClickOffer: (
              team: 'home' | 'away',
              type: 'spread' | 'total' | 'moneyline',
            ) => {
              if (!league || !contestId) {
                toast.error(
                  'There was an error adding this bet to the cart. Please try again later.',
                );
                return;
              }
              const bet: BetInput = {
                gameId: Number(offer.id),
                refId: Number(offer.id),
                league: league,
                matchTime: offer.matchTime,
                entity1: offer.home.name,
                entity2: offer.away.name,
                stake: 0,
                line: addPlusToNumber(offer[team][type].value).toString(),
                odds: offer[team][type].odds,
                type,
                team,
                contest: contestId,
              };
              if (contestFilter === 'parlay') {
                dispatch(addToParlayBet(bet));
              } else if (contestFilter === 'straight') {
                dispatch(addBet(bet));
              } else if (contestFilter === 'teaser') {
                dispatch(addToTeaserBet(bet));
              }
            },
          }))}
        />
      </>
    );
  } else if (
    result.data &&
    'type' in result.data &&
    result.data?.type === 'picks'
  ) {
    return (
      <div>
        <Header isLoading={result.isLoading} />
        <FantasyPicker
          filters={filters}
          cards={result.data.offers.map((offer: FantasyMatchType) => ({
            // TODO: [LOC-148] place fantasy pick in cart either straight bet (1 pick) or parlay if one exists
            onClickMore: () => alert('clicked'),
            onClickLess: () => alert('clicked'),
            image: offer.playerPhotoURL,
            value: offer.total,
            stat: offer.statName,
            gameInfo: offer.matchName,
            playerName: offer.playerName,
          }))}
        />
      </div>
    );
  } else {
    return (
      <>
        <Header isLoading={result.isLoading} />
        Unknown match type...
      </>
    );
  }
};

export default MatchPickerTableContainer;
