import React from 'react';
import { ChevronRightIcon } from '~/components/Icons';

export interface SettingsItemMenuProps {
  /**
   * Menu Key
   */
  key: string;
  /**
   * Menu label
   */
  label: string;
  /**
   * Icon
   */
  icon?: JSX.Element;
}

interface SettingsMenuProps {
  menus: SettingsItemMenuProps[];
  /**
   * Callback
   */
  onSelectCallback(key: any): void;
  activeMenu?: SettingsItemMenuProps;
}

const ProfileMenu = (props: SettingsMenuProps) => {
  const handleSelect = (selectedMenu: any) => {
    props.onSelectCallback(selectedMenu);
  };

  return (
    <div className="py-4 overflow-y-auto">
      <ul className="space-y divide-y">
        {props.menus.map((menu) => (
          <li key={menu.key}>
            <button
              type="button"
              className={`flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 group hover:bg-white
              ${
                props.activeMenu?.key === menu.key
                  ? 'bg-white border border-gray-100 shadow-md'
                  : ''
              } 
              `}
              aria-controls="dropdown-example"
              data-collapse-toggle="dropdown-example"
              onClick={() => handleSelect(menu)}
            >
              <div className="w-5">{menu.icon}</div>
              <span className="flex-1 ml-5 text-left whitespace-nowrap text-sm w-auto">
                {menu.label}
              </span>
              <ChevronRightIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileMenu;
