import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ProfileMenu from '.';
import {
  AccountDepositIcon,
  PersonIcon,
  PersonVerifyIcon,
  SettingsIcon,
} from '~/components/Icons';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Lockspread/Profile',
  component: ProfileMenu,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ProfileMenu>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ProfileMenu> = (args) => (
  <ProfileMenu {...args} />
);

export const Menu = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Menu.args = {
  menus: [
    {
      key: 'account-deposit',
      label: 'Account Deposit',
      icon: <AccountDepositIcon />,
    },
    {
      key: 'profile-details',
      label: 'Profile Details',
      icon: <PersonIcon />,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
    },
    {
      key: 'verify-your-profile',
      label: 'Verify Your Profile',
      icon: <PersonVerifyIcon />,
    },
    {
      key: 'logout',
      label: 'Log Out',
    },
  ],
  onSelectCallback: (menu) => alert(`You clicked the ${menu.key}`),
};
