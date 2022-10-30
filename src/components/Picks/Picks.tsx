import React from 'react';
import { PickStatus } from '~/constants/PickStatus';
import { TabPanel, Tabs } from './PickTabs';
import PendingSummary from '~/components/Picks/PendingSummary';
import { PendingSummaryItemProps } from '~/components/Picks/PendingSummary/PendingSummary';
import { ParlayCard, StraightCard } from '~/components/Picks/PickCards';
import { StraightPickProps } from './PickCards/StraightCard';
import { ParlayCardProps } from '~/components/Picks/PickCards/ParlayCard';
import { BetType } from '@prisma/client';

interface PicksProps {
  type: string;
  data: StraightPickProps | ParlayCardProps;
  status: PickStatus;
}

export interface PickSummaryProps {
  /**
   * Selected Tab Pick status
   * @example 'pending' | 'settled'
   */
  selectedTabStatus: PickStatus;
  summaryItems: PendingSummaryItemProps[];
  handleChangeTab: (value: PickStatus) => void;
  picks: PicksProps[];
}

const Picks: React.FC<PickSummaryProps> = (props) => {
  const tabs = [PickStatus.PENDING, PickStatus.SETTLED].map((status) => ({
    value: status,
    label: status,
    description: `${status} Picks`,
  }));
  return (
    <div className={'flex flex-col h-fit w-full'}>
      <Tabs
        tabs={tabs}
        activeTab={props.selectedTabStatus}
        handleChange={props.handleChangeTab}
      />
      {[PickStatus.PENDING, PickStatus.SETTLED].map((status) => (
        <TabPanel
          key={status}
          value={status}
          selectedValue={props.selectedTabStatus}
        >
          <div className="flex flex-col w-full divide-y divide-gray-200 h-full">
            {status === PickStatus.PENDING && (
              <PendingSummary items={props.summaryItems} />
            )}
            <div className="flex flex-col gap-3 md:gap-4 p-3 md:p-5">
              {props.picks
                .filter((pick) =>
                  status === PickStatus.SETTLED
                    ? [
                        PickStatus.LOST,
                        PickStatus.SETTLED,
                        PickStatus.WON,
                      ].includes(pick.status)
                    : pick.status === status,
                )
                .map(({ data, type }) => (
                  <>
                    {type === BetType.STRAIGHT && (
                      <StraightCard key={data.id} {...data} />
                    )}
                    {type === BetType.PARLAY && (
                      <ParlayCard key={data.id} {...data} />
                    )}
                  </>
                ))}
            </div>
          </div>
        </TabPanel>
      ))}
    </div>
  );
};

export default Picks;
