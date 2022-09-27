import React from 'react';

const PersonVerifyIcon = (props: any) => {
  return (
    <svg
      className="h-6 w-6 text-black"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  );
};

export default PersonVerifyIcon;
