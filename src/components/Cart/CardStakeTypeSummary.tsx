import React from 'react';
import {
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { BetStakeType, ContestCategory } from '@prisma/client';
import { InsuredPayout } from '~/utils/calculateInsuredPayout';

interface Props {
  stakeType: BetStakeType;
  insuredPayout: InsuredPayout;
  contestCategory: ContestCategory;
  onUpdateBetStakeType(stakeType: BetStakeType): void;
}

const CardStakeTypeSummary = (props: Props) => {
  const onChangeBetStakeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onUpdateBetStakeType(
      (event.target as HTMLInputElement).value as BetStakeType,
    );
  };
  return (
    <Stack className={'p-4'}>
      {props.stakeType === BetStakeType.INSURED ? (
        <Stack
          sx={{
            border: 1,
            borderRadius: 1,
            borderColor: grey[200],
            flexGrow: 1,
          }}
          direction={'row'}
          justifyContent={'space-evenly'}
          alignItems="center"
          spacing={1}
          className={'text-sm'}
        >
          <div
            className={
              'flex flex-col justify-center items-center py-1 text-gray-500'
            }
          >
            <span>Correct</span>
            <span className={'text-bold font-bold text-black'}>
              {props.contestCategory.numberOfPicks - 1}/
              {props.contestCategory.numberOfPicks}
            </span>
          </div>
          <div
            className={
              'flex flex-col justify-center items-center py-1 text-gray-500'
            }
          >
            <span>Payout</span>
            <span className={'text-bold font-bold text-black'}>
              ${props.insuredPayout.secondaryInsuredPayout}
            </span>
          </div>
          <Divider orientation="vertical" flexItem />
          <div
            className={
              'flex flex-col justify-center items-center py-1 text-gray-500'
            }
          >
            <span>Correct</span>
            <span className={'text-bold font-bold text-black'}>
              {props.contestCategory.numberOfPicks}/
              {props.contestCategory.numberOfPicks}
            </span>
          </div>
          <div
            className={
              'flex flex-col justify-center items-center py-1 text-gray-500'
            }
          >
            <span>Payout</span>
            <span className={'text-bold font-bold text-black'}>
              ${props.insuredPayout.primaryInsuredPayout}
            </span>
          </div>
        </Stack>
      ) : null}

      <FormControl>
        <RadioGroup value={props.stakeType} onChange={onChangeBetStakeType}>
          <FormControlLabel
            value={BetStakeType.INSURED}
            control={<Radio />}
            label={<span className={'text-sm'}>Insured</span>}
          />
          <FormControlLabel
            value={BetStakeType.ALL_IN}
            control={<Radio />}
            label={<span className={'text-sm'}>All In</span>}
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};

export default CardStakeTypeSummary;
