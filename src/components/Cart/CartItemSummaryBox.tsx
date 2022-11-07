import React, { ChangeEventHandler } from 'react';
import classnames from 'classnames';
import { SmallText } from './SmallText';
import { ContestWagerType } from '@prisma/client';
import { NumericFormat } from 'react-number-format';

export function CartItemSummaryBox(props: {
  onChange?: ChangeEventHandler<HTMLInputElement>;
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
  wagerType?: ContestWagerType;
}) {
  const MAX_LIMIT = props.wagerType === ContestWagerType.CASH ? 50 : 1000;
  return (
    <div
      className={classnames('p-4 flex-grow border border-gray-300', {
        'bg-blue-200': props.isPrimary,
      })}
    >
      <SmallText>{props.label}</SmallText>
      <NumericFormat
        disabled={!props.isAbleToEdit}
        min={1}
        isAllowed={(values) => {
          const { value } = values;
          return Number(value) <= MAX_LIMIT;
        }}
        value={props.value}
        className="font-bold w-full"
        onChange={props.onChange}
      />
      {props.wagerType === ContestWagerType.CASH ? (
        <>
          <SmallText> (min : $1, max: $50)</SmallText>
        </>
      ) : null}
    </div>
  );
}
