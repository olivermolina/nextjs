import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import visa from '~/assets/visa.svg';
import mastercard from '~/assets/mastercard.svg';
import amex from '~/assets/amex.svg';
import discover from '~/assets/discover.svg';
import paypal from '~/assets/paypal.svg';
import western from '~/assets/western-union.png';

import Deposit from './AccountDeposit';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Profile',
  component: Deposit,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Deposit>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Deposit> = (args) => (
  <Deposit {...args} />
);

export const AccountDeposit = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
AccountDeposit.args = {
  paymentMethods: [
    {
      key: 'visa',
      image: visa,
    },
    {
      key: 'mastercard',
      image: mastercard,
    },
    {
      key: 'amex',
      image: amex,
    },
    {
      key: 'discover',
      image: discover,
    },
    {
      key: 'paypal',
      image: paypal,
    },
    {
      key: 'western',
      image: western,
    },
  ],
  handleSubmitDeposit: () => alert('handleSubmitDeposit'),
};
