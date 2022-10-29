import React from 'react';

interface ContestDetailLayoutProps {
  handleSubmit?: () => void;
  children: any;
}

const ContestDetailLayout = (props: ContestDetailLayoutProps) => {
  return (
    <div className={'flex flex-col divide-y gap-5 '}>
      <div>{props.children}</div>
      <div className={'sticky bottom-0 p-5 bg-white'}>
        <button
          className="py-4 capitalize text-white rounded-lg font-bold text-2xl bg-blue-600 w-full"
          type="submit"
          onClick={props.handleSubmit}
        >
          Join Competition
        </button>
      </div>
    </div>
  );
};

export default ContestDetailLayout;
