import React, { ChangeEventHandler, useCallback } from 'react';
import { ICartItemProps } from './ICartItemProps';
import { SmallText } from './SmallText';
import { CartItemSummaryBox } from './CartItemSummaryBox';
import { addPlusToNumber } from '~/utils/addPlusToNumber';

export function CartItem(props: ICartItemProps) {
  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const newValue = Number(e.target.value) || 0;
    props.onUpdateCartItem(props.id, newValue);
  }, []);
  return (
    <>
      {props.legs.map((leg) => (
        <div key={leg.id} className="p-4 border-b relative border-gray-300">
          <SmallText>
            <span className="uppercase">{leg.league}</span> | {leg.matchTime}
          </SmallText>
          <button
            onClick={leg.onClickDeleteCartItem}
            className="text-gray-400 absolute top-4 right-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="flex justify-between font-bold py-2">
            <div>{leg.betName}</div>
            <div>{addPlusToNumber(leg.betOdds)}</div>
          </div>
          <SmallText>
            {leg.betType}, {leg.awayTeamName} vs. {leg.homeTeamName}
          </SmallText>
        </div>
      ))}
      <div className="grid grid-cols-2">
        <CartItemSummaryBox
          isAbleToEdit
          label="Stake"
          value={props.stake}
          isPrimary
          onChange={onChange}
        />
        <CartItemSummaryBox label="Potential Payout" value={props.payout} />
      </div>
    </>
  );
}
