import React from 'react';
import { faker } from '@faker-js/faker';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ContestPickerCategory from './ContestPickerCategory';

export default {
  title: 'Lockspread/ContestPickerCategory',
  component: ContestPickerCategory,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ContestPickerCategory>;

const Template: ComponentStory<typeof ContestPickerCategory> = (args) => (
  <ContestPickerCategory {...args} />
);

export const Default = Template.bind({});
Default.args = {
  category: {
    id: faker.datatype.uuid(),
    numberOfPicks: 3,
    payoutMultiplier: 5,
  },
  isSelected: false,
};

export const Selected = Template.bind({});
Selected.args = {
  category: {
    id: faker.datatype.uuid(),
    numberOfPicks: 2,
    payoutMultiplier: 2,
  },
  isSelected: true,
};
