import React from 'react';
import { DefaultPickProps } from '~/components/Picks/PickCards/StraightCard';
import { CheckCircle, XCircle } from '~/components/Picks/Icons';
import { PickStatus } from '~/constants/PickStatus';
import { BetLegType } from '@prisma/client';

export interface ParlayBetPickProps extends DefaultPickProps {
  gameInfo?: string;
  matchTime?: string;
}

interface ParlayBetPicksProps {
  parlayBetPicks?: ParlayBetPickProps[];
}

const ParlayBetPicks: React.FC<ParlayBetPicksProps> = (props) => {
  return (
    <div className="flex flex-col">
      {props.parlayBetPicks?.map(
        ({
          id,
          name,
          description,
          gameInfo,
          matchTime,
          value,
          status,
          odd,
        }) => (
          <div key={id} className="flex">
            <div className="flex flex-col items-center mr-2">
              <div>
                <div className="flex items-center justify-center">
                  {status === PickStatus.PENDING && (
                    <div className="w-4 h-4 border border-gray-300 rounded-full" />
                  )}
                  {status === PickStatus.LOST && (
                    <XCircle className="w-6 h-6 fill-red-500" />
                  )}
                  {status === PickStatus.WON && (
                    <CheckCircle className="w-6 h-6 fill-green-500" />
                  )}
                </div>
              </div>
              <div className="w-px h-full bg-gray-300" />
            </div>
            <div className="flex flex-col justify-between w-full h-full">
              <div className="flex flex-column justify-between border-b pb-2 mb-2">
                <div className={'flex flex-col gap-1 text-sm text-gray-400'}>
                  <p className="font-bold text-black">{name}</p>
                  <p>{description}</p>
                  <p>{gameInfo}</p>
                  <p>{matchTime}</p>
                </div>

                <div className={'p-2 md:p-4 text-left'}>
                  <p className={'font-bold text-md'}>
                    {odd === BetLegType.OVER_ODDS ? '+' : 'Under '}
                    {value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default ParlayBetPicks;
