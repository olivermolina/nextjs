import React from 'react';
import { Button } from '../Button';
import { Avatar } from '../Avatar';
import { TopLeaders } from './TopLeaders';

interface IRowContentsProps {
  id: number;
  avatar: {
    imgSrc: string;
    height: number;
    width: number;
    variant: string;
  };
  name: string;
  onClickJoinContest: () => void;
  startDate: string;
  endDate: string;
  leaders: any;
  entryFee: number;
  totalPrize: number;
  entries: number;
  isJoined: boolean;
}
export const RowContents: React.FC<IRowContentsProps> = (props) => {
  return (
    <>
      <div
        className={`grid grid-cols-[1fr_.5fr_.5fr_.5fr_1fr] p-1 pl-4 mr-1 gap-1 items-center justify-center`}
      >
        <div className="flex items-center justify-center gap-4">
          <Avatar {...props.avatar} />
          <div className="flex-col w-96">
            <div className="text-black font-bold">{props.name}</div>
            <div className="flex gap-4 text-sm">
              <div>
                <span>Starts : </span>
                <p>{props.startDate}</p>
              </div>
              <div>
                <span>Ends : </span>
                <p>{props.endDate}</p>{' '}
              </div>
            </div>
          </div>
        </div>
        <div className="font-bold p-2">${props.entryFee}</div>
        <div className="font-bold p-2">${props.totalPrize}</div>
        <div className="font-bold p-2">{props.entries}</div>
        <div className="flex items-center justify-center gap-8 w-96 ">
          <TopLeaders leaders={props.leaders} />
          <Button variant={props.isJoined ? 'outline' : 'primary'}>
            <div className="text-sm">
              {props.isJoined ? 'Joined' : 'Join Competition'}
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};
