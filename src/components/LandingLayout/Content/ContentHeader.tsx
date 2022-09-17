import React from 'react';
import trophy from '~/assets/trophy.svg';
import football from '~/assets/football.svg';

const ContentHeader = () => {
  return (
    <div className="flex flex-col items-center justify-between md:gap-y-5">
      <p className="text-white text-[60px] md:text-[90.44px] font-bold text-center leading-[77px] tracking-normal">
        The Fantasy Sports Hub!
      </p>
      <div className="flex items-center justify-between gap-x-5">
        <div className={'min-w-fit'}>
          <img
            className="object-cover w-[60px] h-auto md:w-auto"
            src={trophy.src}
            alt="Trophy"
          />
        </div>
        <p className="text-white text-[25px] md:text-[36px] font-bold text-center tracking-normal">
          Select More or Less on player stats to win up to 10x your cash!
        </p>
        <div className={'min-w-fit'}>
          <img
            className="object-cover w-[60px] h-auto md:w-auto"
            src={football.src}
            alt="Football"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
