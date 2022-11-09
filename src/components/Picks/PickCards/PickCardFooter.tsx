import React from 'react';
import { PickStatus } from '~/constants/PickStatus';
import { CheckCircle, XCircle } from '~/components/Picks/Icons';
import { BetStakeType } from '@prisma/client';
import { Divider, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import { InsuredPayoutInterface } from '~/components/Picks/PickCards/StraightCard';

interface Props {
  risk?: number;
  status?: PickStatus;
  potentialWin?: number | InsuredPayoutInterface;
  stakeType?: BetStakeType;
}

const PickCardFooter = (props: Props) => {
  const pickStatus = props.status;

  return (
    <div className="p-1 md:p-5 flex flex-row justify-between">
      <div className={'flex flex-col items-center'}>
        <p className="text-gray-400 text-sm">Risk</p>
        <p className="font-bold">{props.risk}</p>
      </div>
      <div className={'flex flex-col items-center'}>
        <p className="text-gray-400 text-sm">
          {pickStatus === PickStatus.WON ? 'Winnings' : 'Potential Win'}
        </p>
        {props.stakeType === BetStakeType.ALL_IN ? (
          <p className="font-bold">{props.potentialWin as number}</p>
        ) : (
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
                'flex flex-col justify-center items-center p-1 text-gray-500'
              }
            >
              <span>Correct</span>
              <span className={'text-bold font-bold text-black'}>
                {(props.potentialWin as InsuredPayoutInterface).numberOfPicks -
                  1}
                /{(props.potentialWin as InsuredPayoutInterface).numberOfPicks}
              </span>
            </div>
            <div
              className={
                'flex flex-col justify-center items-center p-1 text-gray-500'
              }
            >
              <span>Payout</span>
              <span className={'text-bold font-bold text-black'}>
                $
                {
                  (props.potentialWin as InsuredPayoutInterface)
                    .secondaryInsuredPayout
                }
              </span>
            </div>
            <Divider orientation="vertical" flexItem />
            <div
              className={
                'flex flex-col justify-center items-center p-1 text-gray-500'
              }
            >
              <span>Correct</span>
              <span className={'text-bold font-bold text-black'}>
                {(props.potentialWin as InsuredPayoutInterface).numberOfPicks}/
                {(props.potentialWin as InsuredPayoutInterface).numberOfPicks}
              </span>
            </div>
            <div
              className={
                'flex flex-col justify-center items-center p-1 text-gray-500'
              }
            >
              <span>Payout</span>
              <span className={'text-bold font-bold text-black'}>
                $
                {
                  (props.potentialWin as InsuredPayoutInterface)
                    .primaryInsuredPayout
                }
              </span>
            </div>
          </Stack>
        )}
      </div>
      <div className={'flex flex-col items-center'}>
        <p className="text-gray-400 text-sm">Status</p>
        <div className={'flex flex-row gap-1 items-center'}>
          {pickStatus === PickStatus.PENDING ? (
            <div className="w-4 h-4 border border-gray-300 rounded-full" />
          ) : null}
          {pickStatus === PickStatus.LOST ? (
            <XCircle className="w-6 h-6 fill-red-500" />
          ) : null}

          {pickStatus === PickStatus.WON ? (
            <CheckCircle className="w-6 h-6 fill-green-500" />
          ) : null}
          <p className="font-bold capitalize text-sm">{pickStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default PickCardFooter;
