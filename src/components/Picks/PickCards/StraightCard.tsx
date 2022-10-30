import React from 'react';
import { PickStatus } from '~/constants/PickStatus';
import { CheckCircle, XCircle } from '~/components/Picks/Icons';
import { BetLegType } from '@prisma/client';

export interface DefaultPickProps {
  id: any;
  name: string;
  gameInfo?: string;
  description?: string;
  contestType?: string;
  pickTime?: string;
  value?: number;
  risk?: number;
  potentialWin?: number;
  status?: string;
  odd?: BetLegType;
}

export interface StraightPickProps extends DefaultPickProps {
  gameInfo?: string;
}

const StraightCard: React.FC<StraightPickProps> = (props) => {
  return (
    <div className="border divide-y rounded-md">
      {/*Card Header*/}
      <div className="flex flex-column justify-between p-1 md:p-5">
        <div className={'text-sm'}>
          <p className={'text-gray-400 text-xs'}>{props.name}</p>
          <p className="font-bold">{props.description}</p>
          <p className="font-semibold">{props.gameInfo}</p>
          <p>
            <span className={'text-gray-400 mr-2'}>Contest Type:</span>{' '}
            <span className="font-semibold">{props.contestType}</span>
          </p>
          <p className={'text-gray-400 text-xs'}> {props.pickTime}</p>
        </div>
        <div className={'p-1 md:p-4 items-end'}>
          <p className={'font-bold text-sm'}>
            {props.odd === BetLegType.OVER_ODDS ? '+' : 'Under '} {props.value}
          </p>
        </div>
      </div>

      {/*Card Footer*/}
      <div className="p-1 md:p-5 flex flex-row justify-between">
        <div className={'flex flex-col items-center'}>
          <p className="text-gray-400 text-sm">Risk</p>
          <p className="font-bold">{props.risk}</p>
        </div>
        <div className={'flex flex-col items-center'}>
          <p className="text-gray-400 text-sm">
            {props.status === PickStatus.WON ? 'Winnings' : 'Potential Win'}
          </p>
          <p className="font-bold">{props.potentialWin}</p>
        </div>
        <div className={'flex flex-col items-center'}>
          <p className="text-gray-400 text-sm">Status</p>
          <div className={'flex flex-row gap-1 items-center'}>
            {props.status === PickStatus.PENDING && (
              <div className="w-4 h-4 border border-gray-300 rounded-full" />
            )}
            {props.status === PickStatus.LOST && (
              <XCircle className="w-6 h-6 fill-red-500" />
            )}

            {props.status === PickStatus.WON && (
              <CheckCircle className="w-6 h-6 fill-green-500" />
            )}
            <p className="font-bold capitalize text-sm">{props.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StraightCard;
