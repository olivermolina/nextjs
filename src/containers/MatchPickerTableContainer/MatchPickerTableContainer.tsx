import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useQueryParams } from '~/hooks/useQueryParams';
import {
  addBet,
  addToParlayBet,
  addToTeaserBet,
  BetInput,
  selectAllBets,
} from '~/state/bets';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { WarningAlert } from '~/components/Alert';
import { MatchPickRowTable } from '~/components/MatchPickRowTable/MatchPickRowTable';
import { trpc } from '~/utils/trpc';
import { ContestType, League, BetStakeType } from '@prisma/client';
import { LoadingSpinner } from '~/components/Cart/LoadingSpinner';
import { addPlusToNumber } from '~/utils/addPlusToNumber';
import { FantasyPicker } from '~/components/FantasyPicker/FantasyPicker';
import { toast } from 'react-toastify';

const Header = (props: { isLoading: boolean }) => (
  <h2 className="pb-2 font-bold flex gap-2">
    SPORT OFFERS
    {props.isLoading && <LoadingSpinner />}
  </h2>
);

const MatchPickerTableContainer = () => {
  const { contestFilter, setParam, league, contestId, contestCategoryId } =
    useQueryParams();
  const allBets = useAppSelector((state) => selectAllBets(state));
  const contestBet = useMemo(
    () => allBets.find((bet) => bet.contest === contestId),
    [allBets, contestId],
  );

  const { data: contestCategories } =
    trpc.contest.contestCategoryList.useQuery();
  const query = trpc.contest.list.useQuery();
  const result = trpc.contest.listOffers.useQuery(
    {
      contestId: contestId,
      league: league as League,
    },
    {
      retry: false,
    },
  );
  const contestCategory = contestCategories?.find(
    (contestCategory) => contestCategory.id === contestCategoryId,
  );
  const contest = query.data?.find((c) => c.id === contestId);

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

  if (!contestCategory || result.data === null) {
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
    result.data?.type === ContestType.MATCH
  ) {
    const matches = result.data.offers;
    return (
      <>
        <Header isLoading={result.isLoading} />
        <MatchPickRowTable
          filters={filters}
          matches={matches.map((offer) => ({
            id: offer!.id,
            away: {
              name: offer!.away.name,
              spread: {
                disabled: false,
                value: offer!.away.spread.value,
                odds: offer!.away.spread.odds,
              },
              total: {
                disabled: false,
                value: offer!.away.total.value,
                odds: offer!.away.total.odds,
              },
              moneyline: {
                disabled: false,
                value: offer!.away.moneyline.value,
                odds: offer!.away.moneyline.odds,
              },
            },
            home: {
              name: offer!.home.name,
              spread: {
                disabled: false,
                value: offer!.home.spread.value,
                odds: offer!.home.spread.odds,
              },
              total: {
                disabled: false,
                value: offer!.home.total.value,
                odds: offer!.home.total.odds,
              },
              moneyline: {
                disabled: false,
                value: offer!.home.moneyline.value,
                odds: offer!.home.moneyline.odds,
              },
            },
            matchTime: dayjs(offer!.matchTime).format('MM/DD/YY, HH:MM'),
            onClickOffer: (
              team: 'home' | 'away',
              type: 'spread' | 'total' | 'moneyline',
            ) => {
              if (!contestId) {
                toast.error('Please select a contest to apply this bet to.');
                return;
              }
              if (!league) {
                toast.error(
                  'There was an error adding this bet to the cart. Please try again later.',
                );
                return;
              }
              const contestType = contest?.type;
              if (!contestType) {
                toast.error('Unknown contest type');
                return;
              }
              if (!contestCategory) {
                toast.error('Missing contest category!');
                return;
              }
              if (!offer) {
                toast.error('Unknown offer!');
                return;
              }
              const bet: BetInput = {
                name: ContestType.MATCH,
                gameId: offer!.id,
                marketId:
                  team === 'away' ? offer!.away.marketId : offer!.home.marketId,
                marketSelId:
                  team === 'away'
                    ? offer!.away.marketSelId
                    : offer!.home.marketSelId,
                league: league,
                matchTime: offer!.matchTime,
                entity1: offer!.home.name,
                entity2: offer!.away.name,
                stake: 0,
                line: addPlusToNumber(offer[team][type].value).toString(),
                odds: offer[team][type].odds,
                type,
                team,
                contestType: contestType,
                contest: contestId,
                total: offer[team][type].value,
                contestCategory,
                statName: '',
                contestWagerType: contest.wagerType,
                stakeType: BetStakeType.INSURED,
              };
              if (contestFilter === 'parlay') {
                dispatch(addToParlayBet(bet));
              } else if (contestFilter === 'straight') {
                dispatch(addBet(bet));
              } else if (contestFilter === 'teaser') {
                dispatch(addToTeaserBet(bet));
              } else {
                toast.error('Select bet type.');
              }
            },
          }))}
        />
      </>
    );
  } else if (
    result.data &&
    'type' in result.data &&
    result.data?.type === ContestType.FANTASY
  ) {
    return (
      <div>
        <Header isLoading={result.isLoading} />
        <FantasyPicker
          filters={filters}
          cards={result.data.offers
            .filter((offer) =>
              contestFilter ? offer!.statName === contestFilter : false,
            )
            .map((offer) => ({
              // TODO: [LOC-148] place fantasy pick in cart either straight bet (1 pick) or parlay if one exists
              onClickMore: () => {
                if (!offer) {
                  toast.error('Unknown offer!');
                  return;
                }
                if (!contestCategory) {
                  toast.error('Missing contest category!');
                  return;
                }
                const bet: BetInput = {
                  name: offer!.playerName,
                  gameId: offer!.id,
                  marketId: offer.marketId,
                  marketSelId: offer.selId,
                  league: offer.league,
                  matchTime: offer!.matchTime,
                  entity1: offer.matchName.split('@')[0] || '',
                  entity2: offer.matchName.split('@')[1] || '',
                  stake: 0,
                  line: offer.total.toString(),
                  odds: offer.odds,
                  type: 'total',
                  team: 'over',
                  contestType: ContestType.FANTASY,
                  contest: contestId!,
                  total: offer.total,
                  contestCategory,
                  statName: offer!.statName,
                  contestWagerType: contest?.wagerType,
                  stakeType: BetStakeType.INSURED,
                };
                dispatch(addToParlayBet(bet));
              },
              onClickLess: () => {
                if (!offer) {
                  toast.error('Unknown offer!');
                  return;
                }
                if (!contestCategory) {
                  toast.error('Missing contest category!');
                  return;
                }
                const bet: BetInput = {
                  name: offer!.playerName,
                  gameId: offer!.id,
                  marketId: offer.marketId,
                  marketSelId: offer.selId,
                  league: offer.league,
                  matchTime: offer!.matchTime,
                  entity1: offer.matchName.split('@')[0] || '',
                  entity2: offer.matchName.split('@')[1] || '',
                  stake: 0,
                  line: offer.total.toString(),
                  odds: offer.odds,
                  type: 'total',
                  team: 'under',
                  contestType: ContestType.FANTASY,
                  contest: contestId!,
                  total: offer.total,
                  contestCategory,
                  statName: offer!.statName,
                  contestWagerType: contest?.wagerType,
                  stakeType: BetStakeType.INSURED,
                };
                dispatch(addToParlayBet(bet));
              },
              image: offer!.playerPhotoURL,
              value: offer!.total,
              stat: offer!.statName,
              gameInfo: offer!.matchName,
              playerName: offer!.playerName,
            }))}
          legs={contestBet?.legs}
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
