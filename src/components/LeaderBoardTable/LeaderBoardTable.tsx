import React from 'react';
import PropTypes from 'prop-types';
import { InferPropTypes, PillButtons, LeaderBoardRow } from '..';
import { LeaderBoardRowPropTypes } from '../LeaderBoardRow/LeaderBoardRow';
import { PillButtonsPropTypes } from '../PillButtons/PillButtons';

export const LeaderBoardTablePropTypes = {
  contests: PillButtonsPropTypes.pills.isRequired,
  leaders: PropTypes.arrayOf(
    PropTypes.shape(LeaderBoardRowPropTypes).isRequired,
  ).isRequired,
};

type Props = InferPropTypes<typeof LeaderBoardTablePropTypes>;

export const LeaderBoardTable = (props: Props) => {
  return (
    <div className="grid grid-cols-[40px_1fr] gap-3">
      <div style={{ marginLeft: '1rem', marginTop: '.2rem' }}>
        <PillButtons pills={props?.contests} />
      </div>
      <div
        style={{ height: '80vh', paddingBottom: '3rem' }}
        className="flex flex-col overflow-y-auto"
      >
        {props?.leaders?.map((items, idx, arr) => (
          <>
            <LeaderBoardRow key={items.id} {...items} showHeader={idx === 0} />
          </>
        ))}
      </div>
    </div>
  );
};

LeaderBoardTable.propTypes = LeaderBoardTablePropTypes;
