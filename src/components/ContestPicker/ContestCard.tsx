import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { InferPropTypes } from '..';

export const contestCardPropTypes = {
  /**
   * Boolean to show active card styles.
   */
  isActive: PropTypes.bool,
  /**
   * The BG image to be set on the card.
   */
  bgImageUrl: PropTypes.string.isRequired,
  /**
   * A properly formatted start date string i.e. "Mon May 15, 2022"
   */
  startDateString: PropTypes.string.isRequired,
  /**
   * A properly formatted end date string i.e. "Mon May 15, 2022"
   */
  endDateString: PropTypes.string.isRequired,
  /**
   * The name of the given contest. Will be converted to uppercase.
   */
  contestName: PropTypes.string.isRequired,
  /**
   * An event handler for when users click on a contest card.
   */
  onClickCard: PropTypes.func.isRequired,
};
type Props = InferPropTypes<typeof contestCardPropTypes>;

const CheckIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-blue-500 absolute top-2 right-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const LockIcon = (
  <svg
    className="h-6 w-6 absolute top-2 text-white right-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

/**
 * Contest Card Component
 */
export const ContestCard: React.FC<Props> = ({
  isActive,
  bgImageUrl,
  startDateString,
  endDateString,
  contestName,
  onClickCard,
}) => {
  return (
    <button
      onClick={onClickCard}
      style={{
        backgroundImage: `url("${bgImageUrl}")`,
      }}
      className={classNames('relative w-36 h-36 p-2 rounded-md text-left', {
        'border-blue-600 border-2': isActive,
      })}
    >
      {/* Icon */}
      {isActive ? CheckIcon : LockIcon}

      <div className="absolute bottom-2">
        <h4 className="font-bold text-sm uppercase">{contestName}</h4>
        <h5 className="text-xs text-gray-500">
          {startDateString} - <br /> {endDateString}
        </h5>
      </div>
    </button>
  );
};

ContestCard.propTypes = contestCardPropTypes;
