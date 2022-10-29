import React, { ReactElement } from 'react';
import ContestDetailLayout from '~/components/ContestDetail/ContestDetailLayout';

interface OverviewProps {
  content: ReactElement;
}

const Overview = (props: OverviewProps) => {
  return <ContestDetailLayout>{props.content}</ContestDetailLayout>;
};

export default Overview;
