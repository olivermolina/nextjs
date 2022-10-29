import React from 'react';

export function CashAmount(props: {
  onClickAddUserCash: React.MouseEventHandler<HTMLButtonElement> | undefined;
  userCashAmount:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) {
  return (
    <button
      onClick={props.onClickAddUserCash}
      className="flex justify-center items-center"
    >
      <div className="bg-white text-sm flex rounded-lg">
        <div className="flex-grow py-1 px-3 text-blue-500">
          ${props.userCashAmount}
        </div>
        <div className="flex-grow py-1 px-3 rounded-lg rounded-l-none text-blue-500 bg-blue-200">
          Add
        </div>
      </div>
    </button>
  );
}
