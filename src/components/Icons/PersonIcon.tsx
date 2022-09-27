import React from 'react';

const PersonIcon = (props: any) => {
  return (
    <svg
      className="h-6 w-6 text-black"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};

export default PersonIcon;
