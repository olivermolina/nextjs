import { isServerSide } from '../utils/isServerSide';
import { useRouter } from 'next/router';
import { IOffer } from '~/types';

type useQueryParamsReturnType = {
  setParam: (param: keyof useQueryParamsReturnType, val: any) => void;
  contestId: string | null;
  league: IOffer['league'] | null;
  contestFilter: string | null;
};

/**
 * Will grab league information from the pathname in the url. Used as a stopgap for the current URL structure
 * where we have /offers/:league.
 */
function pullLeagueFromURL(): string | null | undefined {
  if (!isServerSide()) {
    return window.location.pathname.split('/offers/').pop();
  }
  return null;
}

/**
 * Will provide an interface to all the supported query parameters available in the project.
 *
 * Will also pull league information from the url as a stop gap. TODO: remove this over time.
 */
export function useQueryParams(): useQueryParamsReturnType {
  const router = useRouter();
  const params = router.query;
  if (isServerSide()) {
    return {
      setParam: () => {
        console.log('Attempting to run code serverside.');
      },
      contestId: null,
      league: null,
      contestFilter: null,
    };
  }

  const setParam: (param: keyof useQueryParamsReturnType, val: any) => void = (
    param,
    val,
  ) => {
    router.push('', {
      query: {
        ...params,
        [param]: val,
      },
    });
  };

  return {
    setParam,
    contestId: String(params?.contestId),
    league: String(params?.league || pullLeagueFromURL()),
    contestFilter: String(params?.contestFilter),
  };
}
