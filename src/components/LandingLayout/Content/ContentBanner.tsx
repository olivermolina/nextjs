import React from 'react';
import banknote from '../../../assets/banknote.svg';

const ContentBanner = () => {
  return (
    <div className="flex flex-row items-center justify-between rounded-xl p-1 bg-[#FFFFFF]">
      <div className={'min-w-fit'}>
        <img
          className="object-cover w-14 h-7 md:w-auto md:h-auto"
          src={banknote.src}
          alt="BankNote"
        />
      </div>

      <p className="text-[#348BFF] text-[22px] font-bold tracking-normal leading-[28px] text-center">
        LockSpread will match your first deposit up to $50!!!
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-20 h-7 md:w-20 md:h-10 stroke-[#348BFF] fill-[#348BFF]"
      >
        <path
          fillRule="evenodd"
          d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default ContentBanner;
