import React from 'react';

export interface ICartItemProps {
  legs: {
    league: string;
    matchTime: string;
    onClickDeleteCartItem: React.MouseEventHandler<HTMLButtonElement>;
    betName: string;
    betOdds: number;
    betType: string;
    awayTeamName: string;
    homeTeamName: string;
  }[];
  stake: string;
  payout: string;
}
