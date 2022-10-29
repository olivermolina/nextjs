interface Game {
  id: number;
  date: string;
  matchup: string;
  teams: {
    id: number;
    name: string;
    abbreviation: string;
    homeaway: string;
  }[];
  double_header: boolean;
  gameorder: number;
}

interface Team {
  id: number;
  name: string;
  abbreviation: string;
  nickname: string;
}

interface Player {
  id: number;
  name: string;
  position: string;
  teamid: number;
  team: string;
}

export interface ILookupRepsonse {
  games: Record<Game['id'], Game>;
  teams: Team[];
  players: Player[];
}
