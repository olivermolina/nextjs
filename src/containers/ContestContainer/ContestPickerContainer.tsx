import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { ContestPicker } from '~/components/ContestPicker/ContestPicker';
import { useQueryParams } from '~/hooks/useQueryParams';
import { setActiveContestDetailModal } from '~/state/ui';
import { trpc } from '~/utils/trpc';

/**
 * This component will fetch all of the current users available contests and allow them to either navigate to a new contest
 * that they're already enlisted in, or open the contest detail modal for contests they're not currently involved in.
 */
const ContestPickerContainer: React.FC = () => {
  const { data, isLoading } = trpc.contest.list.useQuery();
  const { setParam } = useQueryParams();
  const dispatch = useDispatch();
  /**
   * Map contests to expected props or default to an empty array.
   */
  const contests = useMemo(
    () =>
      data?.map((contest) => ({
        isActive: contest.isEnrolled,
        bgImageUrl: contest.bgImageUrl,
        startDateString: dayjs(contest.startDate).format('MM/DD/YYYY'),
        endDateString: dayjs(contest.endDate).format('MM/DD/YYYY'),
        contestName: contest.name,
        onClickCard: () => {
          if (contest.isEnrolled) {
            setParam('contestId', contest.id);
          } else {
            // show detail modal
            if (contest.isJoinable) {
              dispatch(setActiveContestDetailModal(contest.id));
            } else {
              toast.warn('Contest start date past.');
            }
          }
        },
      })) || [],
    [data, dispatch, setParam],
  );
  if (isLoading) return <>Loading...</>;
  return <ContestPicker contests={contests} />;
};

export default ContestPickerContainer;
