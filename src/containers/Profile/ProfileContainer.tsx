import React, { useState } from 'react';
import {
  AccountDepositIcon,
  CameraIcon,
  PersonIcon,
  PersonVerifyIcon,
  SettingsIcon,
} from '~/components/Icons';
import { useRouter } from 'next/router';
import ChevronLeftIcon from '~/components/Icons/ChevronLeftIcon';
import { SettingsItemMenuProps } from '~/components/Profile/ProfileMenu/ProfileMenu';
import { AvatarCircle } from '~/components';
import { AccountDeposit, ProfileMenu } from '~/components/Profile';
import visa from '~/assets/visa.svg';
import mastercard from '~/assets/mastercard.svg';
import amex from '~/assets/amex.svg';
import discover from '~/assets/discover.svg';
import paypal from '~/assets/paypal.svg';
import western from '~/assets/western-union.png';
import { trpc } from '~/utils/trpc';
import profileBgCover from '~/assets/profile-bg-cover.svg';
import ProfileDetails from '../../components/Profile/ProfileDetails';

const paymentMethods = [
  {
    key: 'visa',
    image: visa.src,
  },
  {
    key: 'mastercard',
    image: mastercard.src,
  },
  {
    key: 'amex',
    image: amex.src,
  },
  {
    key: 'discover',
    image: discover.src,
  },
  {
    key: 'paypal',
    image: paypal.src,
  },
  {
    key: 'western',
    image: western.src,
  },
];

const MENUS = (
  handleSubmitDeposit?: () => void,
  user?: any,
  isLoading?: boolean,
) => [
  {
    key: 'account-deposit',
    label: 'Account Deposit',
    icon: <AccountDepositIcon />,
    content: (
      <AccountDeposit
        paymentMethods={paymentMethods}
        handleSubmitDeposit={handleSubmitDeposit}
      />
    ),
  },
  {
    key: 'profile-details',
    label: 'Profile Details',
    icon: <PersonIcon />,
    content: <ProfileDetails {...user} isLoading={isLoading} />,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    content: <div>Settings</div>,
  },
  {
    key: 'verify-your-profile',
    label: 'Verify Your Profile',
    icon: <PersonVerifyIcon />,
    content: <div>Verify Your Profile</div>,
  },
  {
    key: 'logout',
    label: 'Log Out',
    content: <div>Logout</div>,
  },
];

const ProfileContainer = () => {
  const [activeMenu, setActiveMenu] = useState<SettingsItemMenuProps>();
  const { data, isLoading } = trpc.user.userDetails.useQuery();

  const user = {
    username: data?.username || '',
    image: `https://eu.ui-avatars.com/api/?name=${data?.username}&size=250`,
    followers: 502,
    following: 300,
    bgImage: profileBgCover.src,
  };

  const router = useRouter();
  const onSelectCallback = (newActiveMenu: any) => {
    if (newActiveMenu?.key === 'logout') return router.push('/'); // Todo clear user session
    setActiveMenu(newActiveMenu);
  };

  const handleSubmitDeposit = () => {
    //TODO
    alert('handleSubmitDeposit');
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full">
      <div className="relative h-fit content-center items-center lg:hidden">
        {activeMenu && (
          <button
            className="absolute lg:hidden py-2.5 px-2 ml-4 top-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
            type="button"
            onClick={() => onSelectCallback(null)}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
        )}
        <div
          className={
            'flex flex-col content-center items-center bg-gray-100 p-4 gap-4 '
          }
        >
          <p className="font-bold text-lg">
            {activeMenu?.label || `@${user?.username}`}
          </p>
          {!activeMenu && (
            <button
              type={'button'}
              className="relative rounded-full p-2 bg-white"
            >
              <div
                className="absolute top-0 justify-center rounded-full p-1 bg-white"
                style={{ right: 0 }}
              >
                <CameraIcon className="h-6 w-6 text-black" />
              </div>
              <AvatarCircle imgSrc={user?.image} height={75} width={75} />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row bg-inherit w-full">
        <div className={`${activeMenu ? 'hidden lg:flex' : ''}`}>
          <ProfileMenu
            menus={MENUS().map((menu) => menu)}
            onSelectCallback={onSelectCallback}
            activeMenu={activeMenu}
          />
        </div>
        <div className="w-full">
          {MENUS(handleSubmitDeposit, user, isLoading).map(
            ({ key, content }) => {
              if (key === activeMenu?.key) return content;
              return null;
            },
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
