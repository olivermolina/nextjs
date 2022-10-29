import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { SettingsItemMenuProps } from '~/components/Profile/ProfileMenu/ProfileMenu';
import { trpc } from '~/utils/trpc';
import Icons from '~/components/Icons/Icons';
import { UrlPaths } from '~/constants/UrlPaths';
import { ProfileLayout } from '~/components/Profile/ProfileLayout/ProfileLayout';
import { useAppDispatch } from '~/state/hooks';
import { setAppSettings, setUserDetails } from '~/state/profile';

interface Props {
  children?: JSX.Element;
}

const MENUS = [
  {
    key: UrlPaths.ProfileAccountDeposit,
    label: 'Account Deposit',
    icon: <Icons.CurrencyDollar className={'h-8'} />,
  },
  {
    key: UrlPaths.ProfileWithdrawFunds,
    label: 'Withdraw Funds',
    icon: <Icons.WithdrawFunds className={'h-8'} />,
  },
  {
    key: UrlPaths.ProfileDetails,
    label: 'Profile Details',
    icon: <Icons.User className={'h-8'} />,
  },
  {
    key: UrlPaths.ProfileSettings,
    label: 'Settings',
    icon: <Icons.Settings className={'h-8'} />,
  },
  {
    key: UrlPaths.ProfileReferral,
    label: 'My Referral Code',
    icon: <Icons.UserAdd className={'h-8'} />,
  },
  {
    key: 'logout',
    label: 'Log Out',
  },
];

const ProfileContainer = (props: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeMenu, setActiveMenu] = useState<SettingsItemMenuProps | null>();
  const { data: appSettingsData, isLoading: appSettingsIsLoading } =
    trpc.appSettings.list.useQuery(undefined, {
      refetchOnWindowFocus: false,
      retry: false,
    });

  const { data, isLoading } = trpc.user.userDetails.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });

  const user = useMemo(
    () => ({
      username: data?.username || '',
      email: data?.email || '',
      image: `https://eu.ui-avatars.com/api/?name=${data?.username}&size=250`,
      followers: 502,
      following: 300,
      showFollowers: false,
      isFirstDeposit: data?.isFirstDeposit,
    }),
    [data],
  );
  const { pathname } = router;

  const onSelectCallback = (newActiveMenu: SettingsItemMenuProps | null) => {
    if (newActiveMenu?.key === 'logout') return router.push('/'); // Todo clear user session
    setActiveMenu(newActiveMenu);
    if (newActiveMenu && pathname !== newActiveMenu.key)
      router.push(newActiveMenu.key);
  };

  useEffect(() => {
    dispatch(setUserDetails(user));
    if (appSettingsData) dispatch(setAppSettings(appSettingsData));
  }, [user, appSettingsData]);

  useEffect(() => {
    const currentMenu = MENUS.find((menu) => menu.key === pathname);
    if (currentMenu) setActiveMenu(currentMenu);
  }, [pathname]);

  return (
    <ProfileLayout
      {...props}
      activeMenu={activeMenu}
      menus={MENUS}
      user={user}
      onSelectCallback={onSelectCallback}
      isLoading={isLoading || appSettingsIsLoading}
    />
  );
};

export default ProfileContainer;
