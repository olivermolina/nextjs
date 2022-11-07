import React from 'react';
import { PillButtons, PillButtonsProps } from '../PillButtons/PillButtons';
import { FantasyCard, FantasyCardProps } from './FantasyCard';
import { Grid } from '@mui/material';
import { BetModel } from '~/state/bets';

interface Props extends React.PropsWithChildren {
  filters: PillButtonsProps['pills'];
  cards: FantasyCardProps[];
  legs?: BetModel[];
}

export function FantasyPicker(props: Props) {
  const cardLength = props.cards.length;
  return (
    <div className="pb-2">
      <PillButtons pills={props.filters} />
      {/* Fantasy Grid */}
      <Grid
        container
        spacing={2}
        sx={{ mt: 1 }}
        justifyContent="space-around"
        alignItems="center"
      >
        {props.cards.map((card) => {
          const betLeg = props.legs?.find(
            (leg) => leg.name === card.playerName,
          );
          const isSelected = !!betLeg;
          const isOver = betLeg?.team === 'over';

          return (
            <Grid
              item
              key={card.playerName}
              xs={12}
              sm={6}
              md={cardLength < 3 ? 6 : 4}
            >
              <FantasyCard
                {...card}
                imageSize={'small'}
                isSelected={isSelected}
                isOver={isOver}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
