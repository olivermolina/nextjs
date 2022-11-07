import React, { ReactNode } from 'react';
import { AvatarCircle } from '../AvatarCircle';
import { Modal } from '../Modal';
import { TabPanel } from '../TabPanel';
import Entries from './Entries';
import { EntriesProps } from './Entries/Entries';
import Overview from './Overview';
import { OverviewProps } from './Overview/Overview';
import Prizes from './Prizes';
import { PrizesProps } from './Prizes/Prizes';
import Rules from './Rules';
import { RulesProps } from './Rules/Rules';

export type ContestDetailModalProps = {
  imgUrl: string;
  name: ReactNode | string;
  onClickJoinCompetition: ((...args: any[]) => any) | undefined;
  isModalOpen: boolean;
  overview: OverviewProps;
  entries: EntriesProps['entries'];
  prizes: PrizesProps['prizes'];
  rules: RulesProps;
};

const ContestDetailModal = (props: ContestDetailModalProps) => {
  return (
    <Modal
      header={
        <div className="flex gap-1">
          <div>
            <AvatarCircle imgSrc={props.imgUrl} height={50} width={50} />
          </div>
          <div className="text-white">
            <h2>{props.name}</h2>
            <span>Official Tournaments</span>
          </div>
        </div>
      }
      footer={
        <div className={'p-5 bg-white'}>
          <button
            className="p-4 capitalize text-white rounded-lg font-bold text-2xl bg-blue-600 w-full"
            type="submit"
            onClick={props.onClickJoinCompetition}
          >
            Join Competition
          </button>
        </div>
      }
      showModal={props.isModalOpen}
    >
      <div>
        <TabPanel
          tabs={[
            {
              tabId: 1,
              title: 'Overview',
            },
            {
              tabId: 2,
              title: 'Entries',
            },
            {
              tabId: 3,
              title: 'Prizes',
            },
            {
              tabId: 4,
              title: 'Rules',
            },
          ]}
          tabsContent={[
            {
              tabId: 1,
              content: <Overview {...props.overview} />,
            },
            {
              tabId: 2,
              content: <Entries entries={props.entries} />,
            },
            {
              tabId: 3,
              content: <Prizes prizes={props.prizes} />,
            },
            {
              tabId: 4,
              content: <Rules {...props.rules} />,
            },
          ]}
        />
      </div>
    </Modal>
  );
};

export default ContestDetailModal;
