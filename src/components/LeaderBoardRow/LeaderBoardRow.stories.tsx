import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LeaderBoardRow } from './LeaderBoardRow';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/LeaderBoardRow',
  component: LeaderBoardRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof LeaderBoardRow>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LeaderBoardRow> = (args) => (
  <LeaderBoardRow {...args} />
);

const startDate = 'Mon Sept 06 2022 10:00pm';
const endDate = 'Fri Sept 09 2022 11:00am';
const leaders = [
  {
    id: '1',
    name: 'leader 1',
    rank: '1',
    isMe: false,
    onClickYourself: () => alert('click me'),
  },
  {
    id: '2',
    name: 'leader 2',
    rank: '2',
    isMe: false,
    onClickYourself: () => alert('click me'),
  },
  {
    id: '3',
    name: 'leader 3',
    rank: '3',
    isMe: false,
    onClickYourself: () => alert('click me'),
  },
  {
    id: '4',
    name: 'leader 4',
    rank: '99',
    isMe: true,
    onClickYourself: () => alert('click me'),
  },
];

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  id: '1',
  name: 'Mega Contest',
  avatar: {
    imgSrc:
      'https://as2.ftcdn.net/v2/jpg/04/73/65/63/1000_F_473656322_63yWjOsNFidcGDp8rH6nVOYHhT8RoaDj.jpg',
    width: 30,
    height: 30,
  },
  points: 500,
  rank: '1',
  isTopRanked: true,
  showHeader: true,
};
