import React, { ReactElement } from 'react';
import ContestDetailLayout from '~/components/ContestDetail/ContestDetailLayout';

interface RulesProps {
  content: ReactElement;
}

const Rules = (props: RulesProps) => {
  return <ContestDetailLayout>{props.content}</ContestDetailLayout>;
};

export default Rules;
