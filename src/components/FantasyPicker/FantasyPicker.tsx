import React from 'react';
import { PillButtons, PillButtonsProps } from '../PillButtons/PillButtons';
import { FantasyCard, FantasyCardProps } from './FantasyCard';

interface Props extends React.PropsWithChildren {
  filters: PillButtonsProps['pills'];
  cards: FantasyCardProps[];
}

export function FantasyPicker(props: Props) {
  return (
    <div className="pb-2">
      <PillButtons pills={props.filters} />
      {/* Fantasy Grid */}
      <div className="grid my-2 gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {props.cards.map((card) => (
          <FantasyCard {...card} key={card.playerName} />
        ))}
      </div>
    </div>
  );
}
