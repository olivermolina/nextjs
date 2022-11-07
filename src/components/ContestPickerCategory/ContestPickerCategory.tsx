import React from 'react';
import { ContestCategory } from '@prisma/client';
import { Paper, Stack } from '@mui/material';

import { grey } from '@mui/material/colors';

interface Props {
  category: ContestCategory;
  isSelected: boolean;
  handleClick: (category: ContestCategory) => void;
}

const ContestPickerCategoryCard = (props: Props) => {
  return (
    <Paper
      sx={{
        borderRadius: 1,
        backgroundColor: props.isSelected ? '#fff' : grey[200],
        width: 135,
        p: 1,
        cursor: 'pointer',
      }}
    >
      <Stack
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        onClick={() => props.handleClick(props.category)}
      >
        <span className="font-bold text-lg">
          {props.category.numberOfPicks} Picks
        </span>
        <span>{props.category.payoutMultiplier}x Payout</span>
        <span>
          {props.category.numberOfPicks}/{props.category.numberOfPicks} Correct
        </span>
      </Stack>
    </Paper>
  );
};

export default ContestPickerCategoryCard;
