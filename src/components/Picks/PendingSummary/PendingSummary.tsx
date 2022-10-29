import React from 'react';

export interface PendingSummaryItemProps {
  label: string;
  value: number;
  priority: number;
}

interface PendingSummaryProps {
  items: PendingSummaryItemProps[];
}

const PendingSummary: React.FC<PendingSummaryProps> = (props) => {
  return (
    <div
      className={
        'grid grid-rows-1 grid-cols-5 md:grid-rows-1 md:grid-cols-5 gap-2 md:gap-4 p-4'
      }
    >
      {props.items
        ?.sort((a, b) => a.priority - b.priority)
        .map(({ label, value }) => (
          <div
            key={`${value}-${label}`}
            className={
              'flex flex-col rounded p-2 md:p-4 bg-gray-100 justify-between'
            }
          >
            <p className={'text-gray-400 text-xs'}>{label}</p>
            <p className={'font-bold text-md'}>{value}</p>
          </div>
        ))}
    </div>
  );
};

export default PendingSummary;
