import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Cart } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Cart',
  component: Cart,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Cart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Cart> = (args) => <Cart {...args} />;

export const Open = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Open.args = {
  activeTab: 'playerOU',
  onClickPlayerOU: () => alert('clicked onClickPlayerOU'),
  onClickTeamToken: () => alert('clicked onClickTeamToken'),
  links: [
    <a key={'dklj'}>Test</a>,
    <a key={'fdas'}>Test2</a>,
    <a key={'dfasj'}>Test3</a>,
  ],
  cartItems: [
    {
      id: '1',
      onUpdateCartItem: () => console.log('Updating cart item'),
      legs: [
        {
          id: '3423',
          league: 'NBA',
          matchTime: 'January 3rd, 2020',
          onClickDeleteCartItem: () => alert('clickedCartItem'),
          betName: 'Mount St. Marys',
          betOdds: 400,
          betType: 'Moneyline',
          awayTeamName: 'Florida State',
          homeTeamName: 'University of Florida',
        },
      ],
      stake: '400',
      payout: '800',
    },
    {
      id: '1',
      onUpdateCartItem: () => console.log('Updating cart item'),
      legs: [
        {
          id: '3423',
          league: 'NBA',
          matchTime: 'January 3rd, 2020',
          onClickDeleteCartItem: () => alert('clickedCartItem'),
          betName: 'Mount St. Marys',
          betOdds: 400,
          betType: 'Moneyline',
          awayTeamName: 'Florida State',
          homeTeamName: 'University of Florida',
        },
        {
          id: '3423',
          league: 'NBA',
          matchTime: 'January 3rd, 2020',
          onClickDeleteCartItem: () => alert('clickedCartItem'),
          betName: 'Mount St. Marys',
          betOdds: 400,
          betType: 'Moneyline',
          awayTeamName: 'Florida State',
          homeTeamName: 'University of Florida',
        },
      ],
      stake: '400',
      payout: '800',
    },
  ],
  onClickSubmitForm: () => alert('submitting form'),
};

export const Loading = Template.bind({});

Loading.args = {
  ...Open.args,
  showLoading: true,
};
