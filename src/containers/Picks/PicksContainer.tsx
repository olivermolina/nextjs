import React from 'react';
import { PickStatus } from '~/constants/PickStatus';
import { PickTypes } from '~/constants/PickTypes';
import Picks from '~/components/Picks';
import { Odds } from '~/constants/Odds';

const data = {
  summaryItems: [
    {
      label: 'Wagers Won',
      value: 100,
      priority: 1,
    },
    {
      label: 'Wagers Lost',
      value: 100,
      priority: 2,
    },
    {
      label: 'Total Debit Wagered',
      value: 100,
      priority: 3,
    },
    {
      label: 'Credit Gained',
      value: 100,
      priority: 4,
    },
    {
      label: 'Debit Lost',
      value: 100,
      priority: 5,
    },
  ],
  picks: [
    {
      type: PickTypes.STRAIGHT,
      status: PickStatus.PENDING,
      data: {
        id: 232,
        name: 'Straight Bet',
        description: 'New Your Rangers, Moneyline Away',
        gameInfo: 'New York Rangers vs Tampa Bay Lightning ',
        contestType: 'More or Less',
        pickTime: '12/06/2022',
        potentialWin: 27.56,
        risk: 13,
        status: PickStatus.PENDING,
        value: 212,
        odd: Odds.OVER,
      },
    },
    {
      type: PickTypes.PARLAY,
      status: PickStatus.PENDING,
      data: {
        id: 232,
        name: 'Parlay Bet',
        gameInfo:
          'Golden State Warriors, Tampa Bay Lightning, Woverhampton Wanderers',
        contestType: 'Token Contest',
        pickTime: '12/06/2022',
        picks: [
          {
            id: 1,
            name: 'Golden State Warriors +17.5',
            description: 'Point Spread (including Overtime)',
            gameInfo: 'Golden State Warriors vs Dallas Mavericks',
            value: 140,
            matchTime: 'Sept 30, 2021 @ 7:30PM',
            status: PickStatus.PENDING,
            odd: Odds.OVER,
          },
          {
            id: 2,
            name: 'Tampa Bay Lightning',
            description: '3-way moneyline (Regulation Time Only)',
            gameInfo: 'Florida Panthers vs TampaBay Lightning',
            value: 140,
            matchTime: 'Sept 30, 2021 @ 7:30PM',
            status: PickStatus.PENDING,
            odd: Odds.UNDER,
          },
          {
            id: 3,
            name: 'Woverhampton Wanderers',
            description: '3-way moneyline (Regulation Time Only)',
            gameInfo: 'Liverpool vs Woverhampton Wanderers',
            value: 1620,
            matchTime: 'Sept 30, 2021 @ 7:30PM',
            status: PickStatus.PENDING,
            odd: Odds.OVER,
          },
        ],
        potentialWin: 27.56,
        risk: 13,
        status: PickStatus.PENDING,
      },
    },
    {
      type: PickTypes.STRAIGHT,
      status: PickStatus.SETTLED,
      data: {
        id: 232,
        name: 'Straight Bet',
        description: 'New Your Rangers, Moneyline Away',
        gameInfo: 'New Yourk Rangers vs Tampa Bay Lightning ',
        contestType: 'More or Less',
        pickTime: '12/06/2022',
        potentialWin: 27.56,
        risk: 13,
        status: PickStatus.WON,
        value: 212,
        odd: Odds.OVER,
      },
    },
    {
      type: PickTypes.PARLAY,
      status: PickStatus.SETTLED,
      data: {
        id: 232,
        name: 'Parlay Bet',
        gameInfo:
          'Golden State Warriors, Tampa Bay Lightning, Woverhampton Wanderers',
        contestType: 'Token Contest',
        pickTime: '12/06/2022',
        picks: [
          {
            id: 1,
            name: 'Golden State Warriors +17.5',
            description: 'Point Spread (including Overtime)',
            gameInfo: 'Golden State Warriors vs Dallas Mavericks',
            value: 140,
            matchTime: 'Sept 30, 2021 @ 7:30PM',
            status: PickStatus.WON,
            odd: Odds.OVER,
          },
          {
            id: 2,
            name: 'Tampa Bay Lightning',
            description: '3-way moneyline (Regulation Time Only)',
            gameInfo: 'Florida Panthers vs TampaBay Lightning',
            value: 140,
            matchTime: 'Sept 30, 2021 @ 7:30PM',
            status: PickStatus.LOST,
            odd: Odds.UNDER,
          },
          {
            id: 3,
            name: 'Woverhampton Wanderers',
            description: '3-way moneyline (Regulation Time Only)',
            gameInfo: 'Liverpool vs Woverhampton Wanderers',
            value: 1620,
            matchTime: 'Sept 30, 2021 @ 7:30PM',
            status: PickStatus.LOST,
            odd: Odds.OVER,
          },
        ],
        potentialWin: 27.56,
        risk: 13,
        status: PickStatus.LOST,
      },
    },
    {
      type: PickTypes.STRAIGHT,
      status: PickStatus.SETTLED,
      data: {
        id: 232,
        name: 'Straight Bet',
        description: 'New Your Rangers, Moneyline Away',
        gameInfo: 'New Yourk Rangers vs Tampa Bay Lightning ',
        contestType: 'More or Less',
        pickTime: '12/06/2022',
        potentialWin: 27.56,
        risk: 13,
        status: PickStatus.WON,
        value: 212,
        odd: Odds.OVER,
      },
    },
  ],
};

const PicksContainer = () => {
  const [selectedTabStatus, setSelectedTabStatus] = React.useState<PickStatus>(
    PickStatus.PENDING,
  );
  const handleChangeTab = (newStatus: PickStatus) => {
    setSelectedTabStatus(newStatus);
  };

  return (
    <Picks
      {...data}
      selectedTabStatus={selectedTabStatus}
      handleChangeTab={handleChangeTab}
    />
  );
};

export default PicksContainer;
