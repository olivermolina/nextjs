import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import leagues from '../Nav/leagues';
import { TokenCount } from './TokenCount';
import { navItems } from './navItems';
import { CashAmount } from './CashAmount';
import { useQueryParams } from '~/hooks/useQueryParams';
import Link from 'next/link';

interface Props {
  onClickCartDetails?: React.MouseEventHandler<HTMLButtonElement>;
  cartItemsCount?: number;
  cartStake?: number;
  cartPotentialPayout?: number;
  userCashAmount: React.ReactNode;
  currentContestTokenCount?: number;
  children: JSX.Element;
  onClickAddUserCash?: React.MouseEventHandler<HTMLButtonElement>;
  showSubNav?: boolean;
  showTokenCount?: boolean;
}

function NavLink(props: { link: string; icon: any; name: string }) {
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    if (window.location.pathname.includes(props.link)) {
      setActive(true);
    }
  }, [props.link]);

  return (
    <Link href={props.link}>
      <span
        className={classNames(
          'flex cursor-pointer flex-col justify-center text-gray-300 lg:mx-4',
          {
            underline: isActive,
          },
        )}
      >
        {props.icon}
        {props.name}
      </span>
    </Link>
  );
}

export const Layout: React.FC<Props> = (props) => {
  const { setParam, league } = useQueryParams();
  return (
    <div className="flex flex-col h-full">
      {/* Top Nav Desktop */}
      <div className="h-28 hidden lg:grid grid-cols-3 items-center bg-blue-600 lg:border-b p-4 border-gray-400">
        <Logo key="top" />
        <CashAmount
          onClickAddUserCash={props.onClickAddUserCash}
          userCashAmount={props.userCashAmount}
        />
        <nav className="hidden overflow-x-auto lg:flex justify-end gap-4">
          {navItems.map(({ link, icon, name }) => (
            <NavLink key={link} link={link} icon={icon} name={name}></NavLink>
          ))}
        </nav>
      </div>

      {/* Top Nav Mobile */}
      <div className="h-16 bg-blue-600 items-center grid grid-cols-3 lg:hidden">
        <div></div>
        <div className="flex justify-center">
          <Logo key="bottom" scale={3} />
        </div>
        <div className="p-4 flex justify-end">
          {Boolean(props.currentContestTokenCount) ? (
            <TokenCount count={props.currentContestTokenCount || 0} />
          ) : (
            <CashAmount
              onClickAddUserCash={props.onClickAddUserCash}
              userCashAmount={props.userCashAmount}
            />
          )}
        </div>
      </div>

      {/* SubNav */}
      {props.showSubNav && (
        <div className="bg-blue-600 flex justify-between border-b border-gray-400">
          {/* Left Pane */}
          <div className="grid grid-cols-5 border-gray-200">
            <div className="col-span-5 lg:col-span-4 py-2.5 flex overflow-x-auto">
              {Object.entries(leagues).map(([name, { Icon }], i) => (
                <a
                  key={i}
                  onClick={() => {
                    setParam('league', name);
                  }}
                  className={classNames(
                    'inline-flex text-white mx-3.5 flex-col justify-center text-center',
                    {
                      underline: league?.toUpperCase() === name.toUpperCase(),
                    },
                  )}
                >
                  <Icon
                    className={classNames(
                      `object-contain h-8 max-w-full w-8 m-auto text-gray-200 mb-1.5`,
                    )}
                  />
                  {name}
                </a>
              ))}
            </div>
          </div>

          {/* Right Pane */}
          {props.showTokenCount ? (
            <div className="p-4 hidden lg:block">
              <TokenCount count={props.currentContestTokenCount || 0} />
            </div>
          ) : null}
        </div>
      )}

      <div className="flex flex-grow overflow-y-auto bg-gray-50">
        {props.children}
      </div>

      {/* Bottom Bar */}
      <div className="block lg:hidden">
        {props.cartItemsCount !== 0 && (
          <button
            onClick={props.onClickCartDetails}
            className="rounded-lg rounded-b-none text-white shadow-md p-2 w-full bg-blue-600"
          >
            <div className="flex px-2 justify-between">
              <div>
                <span className="py-1 text-blue-600 px-1 bg-white font-bold text-xs rounded-full">
                  {String(props.cartItemsCount).padStart(2, '0')}
                </span>
              </div>
              <div className="flex gap-4">
                <div className="text-left text-xs">
                  <span className="text-blue-400">Stake</span>
                  <div>{props.cartStake?.toLocaleString('en-US')}</div>
                </div>
                <div className="text-left text-xs">
                  <span className="text-blue-400">Potential Payout</span>
                  <div>
                    {props.cartPotentialPayout?.toLocaleString('en-US')}
                  </div>
                </div>
              </div>
            </div>
          </button>
        )}
        <nav className="overflow-x-auto bg-blue-600 p-4 justify-between flex gap-4">
          {navItems.map(({ link, icon, name }) => (
            <NavLink key={link} link={link} icon={icon} name={name}></NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

Layout.defaultProps = {
  cartItemsCount: 0,
  cartStake: 0,
  cartPotentialPayout: 0,
};
