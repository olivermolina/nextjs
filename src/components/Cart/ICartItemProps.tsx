import React from 'react';
import { ContestWagerType } from '@prisma/client';

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
  statName: string;
  betOption: string;
};

export interface ICartItemProps {
  id: string;
  onUpdateCartItem(id: string, value: number): void;
  legs: LegType[];
  stake: string;
  payout: string;
  wagerType?: ContestWagerType;
}
