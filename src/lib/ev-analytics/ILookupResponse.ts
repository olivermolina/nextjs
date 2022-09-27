interface Game {
  id: number;
  date: string;
  matchup: string;
  teams: Team[];
  double_header: boolean;
  gameorder: number;
}

interface Team {
  id: number;
  name: string;
  abbreviation: string;
  homeaway: string;
}

interface Player {
  id: number;
  name: string;
  position: string;
  teamid: number;
  team: string;
}

export interface ILookupRepsonse {
  games: Game[];
  teams: Team[];
  players: Player[];
}
