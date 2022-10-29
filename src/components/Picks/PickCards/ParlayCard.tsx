import React from 'react';
import ParlayBetPicks, {
  ParlayBetPickProps,
} from '~/components/Picks/PickCards/ParlayBetPicks';
import { DefaultPickProps } from '~/components/Picks/PickCards/StraightCard';
import { PickStatus } from '~/constants/PickStatus';
import { CheckCircle, XCircle } from '~/components/Picks/Icons';

export interface ParlayCardProps extends DefaultPickProps {
  picks?: ParlayBetPickProps[];
}

const ParlayCard: React.FC<ParlayCardProps> = (props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border divide-y rounded-md">
      {/*Card Header*/}
      <div className="flex flex-column justify-between p-1 md:p-5">
        <div className={'text-sm'}>
          <p className={'text-gray-400 text-xs'}>
            {props.name} ({props.picks?.length} Picks)
          </p>
          <p className={'font-bold'}>{props.gameInfo}</p>
          <p>
            <span className={'text-gray-400 mr-2'}>Contest Type:</span>{' '}
            <span className="font-semibold">{props.contestType}</span>
          </p>
          <p className={'text-gray-400 text-xs'}>{props.pickTime}</p>
        </div>
        <div className={'p-4'}>
          <button
            className="font-bold text-md text-blue-400"
            onClick={() => setOpen(!open)}
          >
            {open ? 'COLLAPSE' : 'OPEN'}
          </button>
        </div>
      </div>

      {/*Card Body*/}
      <div
        className={`${
          open ? 'h-auto p-2 md:p5 ease-in' : 'h-0 ease-out'
        } duration-300 overflow-hidden w-full`}
      >
        <ParlayBetPicks parlayBetPicks={props.picks} />
      </div>

      {/*Card Footer*/}
      <div className="p-1 md:p-5 flex flex-row justify-between">
        <div className={'flex flex-col items-center'}>
          <p className="text-gray-400 text-sm">Risk</p>
          <p className="font-bold">13</p>
        </div>
        <div className={'flex flex-col items-center'}>
          <p className="text-gray-400 text-sm">Potential Win</p>
          <p className="font-bold">27.8888</p>
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

export default ParlayCard;
