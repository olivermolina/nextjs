import React from 'react';

const ChevronLeftIcon = (props: any) => {
  return (
    <svg
      className="h-8 w-8 text-black"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
};

export default ChevronLeftIcon;
