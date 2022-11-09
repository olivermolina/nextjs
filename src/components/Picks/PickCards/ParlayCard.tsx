import React from 'react';
import ParlayBetPicks, {
  ParlayBetPickProps,
} from '~/components/Picks/PickCards/ParlayBetPicks';
import { DefaultPickProps } from '~/components/Picks/PickCards/StraightCard';
import PickCardFooter from '~/components/Picks/PickCards/PickCardFooter';

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
      <PickCardFooter
        {...props}
        status={(props.picks?.find(Boolean) as DefaultPickProps)?.status}
      />
    </div>
  );
};

export default ParlayCard;
