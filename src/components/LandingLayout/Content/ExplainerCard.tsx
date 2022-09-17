import React from 'react';

export interface ExplainerCardProps {
  /**
   * Image URL
   * @example https://mysite.com/image.png
   */
  image: string;
  /**
   * Explainer Title
   * @example Win Cash Prizes!
   */
  title: string;
  /**
   * Explainer description
   * @example Pay more or less...
   */
  description: string;
}

const ExplainerCard = (props: ExplainerCardProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 sm:gap-1 border-white rounded-[27px] border-2 max-w-[400px] p-4 sm:p-1">
      {/* Explainer Image */}
      <img
        src={props.image}
        className="rounded-lg max-w-full h-40 w-80"
        alt=""
      />

      {/* Explainer Title */}
      <p className="text-white text-[36px] font-bold text-center tracking-normal">
        {props.title}
      </p>

      {/* Explainer Description */}
      <p className="text-white text-[16px] font-bold text-center tracking-normal">
        {props.description}
      </p>
    </div>
  );
};

export default ExplainerCard;
