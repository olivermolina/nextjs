import { IContest } from '../../IContest';
import { IOffer } from '../../IOffer';

export type StatNames = 'rushing-yards' | 'passing-yards' | 'recieving-yards';

export type Match = {
  name: string;
  spread: {
    value: number;
    odds: number;
  };
  total: {
    value: number;
    odds: number;
  };
  moneyline: {
    value: number;
    odds: number;
  };
};

type Filters = 'straight' | 'parlay' | 'teaser';

export type FantasyOffer = {
  id: number;
  /**
   * i.e. https://api.lockspread.com/asset/img-200x200.png
   */
  playerPhotoURL: string;
  /**
   * i.e. "Passing Yards"
   */
  statName: StatNames;
  /**
   * The total number for O/U of the stat. i.e. 50 passing yards O/U
   */
  total: number;
  /**
   * i.e. LAR @ DEN
   */
  matchName: string;
  /**
   * i.e. Patrick Mahomes
   */
  playerName: string;
  /**
   * i.e. ['QB','KC']
   */
  tags: string[];
};

export type GetContestOffers = {
  input: {
    id?: number;
    league?: IOffer['league'];
  };
  output:
    | (Pick<IContest, 'name' | 'id' | 'startDate' | 'endDate' | 'isActive'> &
        (
          | {
              filters: Filters[];
              offers: {
                id: number;
                away: Match;
                home: Match;
                matchTime: string;
              }[];
              type: 'match';
            }
          | {
              filters: StatNames[];
              offers: FantasyOffer[];
              type: 'picks';
            }
        ))
    | {
        status: 'NOT_ENROLLED';
        message: 'This user is not enrolled in any contests.';
      };
};
