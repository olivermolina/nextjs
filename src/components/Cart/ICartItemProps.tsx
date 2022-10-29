import React from 'react';

type LegType = {
  id: string;
  league: string;
  matchTime: string;
  onClickDeleteCartItem: React.MouseEventHandler<HTMLButtonElement>;
  betName: string;
  betOdds: number;
  betType: string;
  awayTeamName: string;
  homeTeamName: string;
};

export interface ICartItemProps {
  id: string;
  onUpdateCartItem(id: string, value: number): void;
  legs: LegType[];
  stake: string;
  payout: string;
}
