import React from 'react';
import { CardTag } from './CardTag';

export interface FantasyCardProps {
  onClickMore: React.MouseEventHandler<HTMLButtonElement>;
  onClickLess: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Image URL
   * @example https://mysite.com/image.png
   */
  image: string;
  /**
   * Stat Value
   * @example 99.5
   */
  value: number;
  /**
   * Stat Name
   * @example Passing Yards
   */
  stat: string;
  /**
   * Game Information
   * @example LA@DEN
   */
  gameInfo: string;
  /**
   * Player Name
   * @example Patrick Mahomes
   */
  playerName: string;
}

export const FantasyCard = (props: FantasyCardProps) => {
  return (
    <>
      {/* Fantasy Card */}
      <div>
        <div className="rounded-lg max-w-full shadow inline-flex flex-col bg-white">
          {/* Fantasy Image */}
          <img
            src={props.image}
            className="rounded-lg max-w-full h-40 w-80"
            alt=""
          />
          {/* Control Box */}
          <div className="grid gap-3 p-4">
            {/* Button Group */}
            <div className="flex gap-2">
              <button
                onClick={props.onClickMore}
                className="flex-grow bg-blue-200 text-blue-600 font-bold rounded p-3 text-sm capitalize"
              >
                More
              </button>
              <button
                onClick={props.onClickLess}
                className="flex-grow bg-blue-200 text-blue-600 font-bold rounded p-3 text-sm capitalize"
              >
                Less
              </button>
            </div>
            {/* Stat Line */}
            <div className="flex gap-2">
              <span className="font-bold text-3xl text-black leading-10">
                {props.value}
              </span>
              <div className="text-sm text-gray-500">
                {props.stat} <br />
                {props.gameInfo}
              </div>
            </div>
            {/* Player Name */}
            <div className="font-bold text-lg text-black">
              {props.playerName}
            </div>
            {/* Card Tags */}
            <div className="flex gap-2">
              <CardTag>QB</CardTag>
              <CardTag>KC</CardTag>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
