import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PendingSummary from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Picks',
  component: PendingSummary,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PendingSummary>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PendingSummary> = (args) => (
  <PendingSummary {...args} />
);

export const PickPendingSummary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

PickPendingSummary.args = {
  items: [
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
      label: 'Wagers Total Debit Wagered',
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
};
