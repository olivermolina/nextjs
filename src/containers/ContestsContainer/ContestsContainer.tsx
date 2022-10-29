import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { trpc } from '~/utils/trpc';
import { ContestTable } from '~/components';

/**
 * This component will fetch all active contests
 */
const ContestsContainer: React.FC = () => {
  const { data, isLoading } = trpc.contest.contests.useQuery();
  const mutation = trpc.contest.joinContest.useMutation();
  /**
   * Map contests to expected props or default to an empty array.
   */
  const contests = useMemo(
    () =>
      data?.map((contest) => ({
        id: contest.id,
        isActive: contest.isEnrolled,
        avatar: {
          imgSrc: contest.bgImageUrl,
          width: 200,
          height: 100,
          variant: 'rectangle',
        },
        startDate: dayjs(contest.startDate).format('MM/DD/YYYY'),
        endDate: dayjs(contest.endDate).format('MM/DD/YYYY'),
        showHeader: true,
        isJoined: contest.isEnrolled,
        entryFee: contest.entryFee,
        totalPrize: contest.totalPrize,
        entries: contest.entries,
        name: contest.name,
        leaders: contest.leaders?.map((leader) => {
          return {
            id: leader.id,
            name: leader.name,
            rank: leader.rank,
            isMe: leader.isMe,
            onClickYourself: () => alert('click me'),
          };
        }),
        onClickJoinContest: () => {
          if (!contest.isEnrolled) {
            if (contest.isJoinable) {
              mutation.mutateAsync({ contestId: contest.id, tokens: 1000 });
            } else {
              toast.warn('Contest start date past.');
            }
          }
        },
      })) || [],
    [data, mutation],
  );
  if (isLoading) return <>Loading...</>;
  return <ContestTable contests={contests} />;
};

export default ContestsContainer;
