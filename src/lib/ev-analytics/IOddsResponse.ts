export interface IOddsResponse {
  events: Event[];
}

interface Event {
  /**
   * @example 4410
   */
  gid: string;
  /**
   * @example 2020-09-10
   */
  gamedate: string;
  /**
   * Epoch scheduled game start time
   * @example 1599783600
   */
  epoch: number;
  /**
   * Game in-play start time in UTC timezone
   * @example 2020-09-11T01:24:26Z
   */
  start_utc?: string;
  /**
   * Game in-play end time in UTC timezone
   * @example 2020-09-11T03:57:50Z
   */
  end_utc?: string;
  /**
   * Game in-play status (true/false)
   */
  inplay: boolean;
  /**
   * Game status
   */
  status: 'Scheduled' | 'In-Progress' | 'Final' | 'Postponed/Canceled';
  /**
   * @example HOU @ KC
   */
  matchup: string;
  /**
   * EST
   * @example 20:20:00
   */
  gametime: string;
  home: Team;
  away: Team;
  markets: Market[];
}

interface Market {
  /**
   * market ID
   * @example 4410-6
   */
  id: string;
  /**
   * team ID or player ID (played ID when type = PP)
   * @example 16
   */
  sel_id: number;
  /**
   * GM = Game Line | GP = Game Props | PP = Player Props
   */
  type: 'GM' | 'GP' | 'PP';
  /**
   * @example Game Line
   */
  category: 'Game Line' | 'Game Props' | 'Player Props';
  /**
   * team or Player name
   * @example Houston Texans
   */
  name: string;
  /**
   * team abbrev.
   * @example HOU
   */
  team: string;
  /**
   * (true/false) true if market odds are offline - odds may be available but stale
   */
  offline: boolean;
  /**
   * the line associated with this team
   */
  spread?: number;
  /**
   * the lines juice or vig
   * @example 10
   */
  spread_odd?: number;
  /**
   * @example 54.5
   */
  total?: null | number;
  /**
   * @example -115
   */
  over?: null | number;
  /**
   * @example -105
   */
  under?: null | number;
  /**
   * @example 200
   */
  moneyline?: null | number;
  /**
   * percentage of bets associated with this team spread
   * @example 66
   */
  spread_bet?: number;
  /**
   * percentage of money wagered associated with this team spread
   * @example 41
   */
  spread_cash?: number;
  /**
   * percentage of bets associated with the game total overs
   * @example 21
   */
  over_bet?: number;
  /**
   * percentage of bets associated with the game total unders
   * @example 79
   */
  under_bet?: number;
  /**
   * percentage of money wagered associated with the game total overs
   * @example 7
   */
  over_cash?: number;
  /**
   * percentage of money wagered associated with the game total unders
   * @example 93
   */
  under_cash?: number;
  /**
   * percentage of bets associated with this team moneyline
   * @example 40
   */
  moneyline_bet?: number;
  /**
   * percentage of money wagered associated with this team moneyline
   * @example 73
   */
  moneyline_cash?: number;
  /**
   * 1 - spread has been covered on this selection
   * 0 - spread has not been covered on this selection
   * NULL - push (when graded)
   */
  spread_result: 0 | 1 | null;
  /**
   * @example
   */
  spread_stat?: number;
  /**
   * 1 - spread has been covered on this selection
   * 0 - spread has not been covered on this selection
   * NULL - push (when graded)
   */
  over_result: 0 | 1 | null;
  /**
   * 1 - spread has been covered on this selection
   * 0 - spread has not been covered on this selection
   * NULL - push (when graded)
   */
  under_result: 0 | 1 | null;
  /**
   * @example
   */
  total_stat?: number;
  /**
   * 1 - spread has been covered on this selection
   * 0 - spread has not been covered on this selection
   * NULL - push (when graded)
   */
  moneyline_result: 0 | 1 | null;
  /**
   * @example
   */
  moneyline_stat?: number;
}

interface Team {
  /**
   * @example 16
   */
  id: number;
  /**
   * @example Kansas City Chiefs
   */
  name: string;
  /**
   * @example KC
   */
  code: string;
}
