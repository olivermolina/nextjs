import React from 'react';
import { PickStatus } from '~/constants/PickStatus';
import Picks from '~/components/Picks';
import { trpc } from '~/utils/trpc';

const PicksContainer = () => {
  const { data, isLoading } = trpc.bets.list.useQuery();
  const [selectedTabStatus, setSelectedTabStatus] = React.useState<PickStatus>(
    PickStatus.PENDING,
  );
  const handleChangeTab = (newStatus: PickStatus) => {
    setSelectedTabStatus(newStatus);
  };

  if (!data || isLoading) {
    return <>Loading...</>;
  }

  return (
    <Picks
      {...data}
      selectedTabStatus={selectedTabStatus}
      handleChangeTab={handleChangeTab}
    />
  );
};

export default PicksContainer;
