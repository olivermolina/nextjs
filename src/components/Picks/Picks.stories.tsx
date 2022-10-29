import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Picks from '.';
import { PickStatus } from '~/constants/PickStatus';
import { PickTypes } from '~/constants/PickTypes';
import { Odds } from '~/constants/Odds';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Picks',
  component: Picks,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Picks>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Picks> = (args) => <Picks {...args} />;

export const Main = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Main.args = {
  selectedTabStatus: PickStatus.PENDING,
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
  handleChangeTab: () => alert('change tab'),
  picks: [
    {
      type: PickTypes.STRAIGHT,
      status: PickStatus.PENDING,
      data: {
        id: 232,
        name: 'Straight Bet',
        description: 'New Your Rangers, Moneyline Away',
        gameInfo: 'New Yourk Rangers vs Tampa Bay Lightning ',
        contestType: 'Team Token Picks',
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
        contestType: 'Team Token Picks',
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
        contestType: 'Team Token Picks',
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
        contestType: 'Team Token Picks',
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
        contestType: 'Team Token Picks',
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
