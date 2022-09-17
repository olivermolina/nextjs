import React from 'react';
import classnames from 'classnames';
import { SmallText } from './SmallText';

export function CartItemSummaryBox(props: {
  isAbleToEdit?: boolean;
  isPrimary?: boolean;
  label:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
  value: string | number | undefined;
}) {
  return (
    <div
      className={classnames('p-4 flex-grow border border-gray-300', {
        'bg-blue-200': props.isPrimary,
      })}
    >
      <SmallText>{props.label}</SmallText>
      <input
        type="number"
        disabled={!props.isAbleToEdit}
        min={1}
        defaultValue={props.value}
        className="font-bold w-full"
      />
    </div>
  );
}
