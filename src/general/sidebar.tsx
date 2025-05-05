import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Icon1, Icon2, Icon3, Icon5, Icon6, Icon7, Icon8, Icon9 } from './icon';

const navItems = [
  { label: 'Dashboard', icon: Icon1, path: '/' },
  { label: 'Customers', icon: Icon2, path: '/customers' },
  { label: 'Payments', icon: Icon3, path: '/payments' },
  { label: 'Transactions', icon: Icon5, path: '/transactions' },
  { label: 'Properties', icon: Icon5, path: '/properties' },
  { label: 'Personnel', icon: Icon6, path: '/personnel' },
  { label: 'Requests & Enquiries', icon: Icon7, path: '/requests' },
  { label: 'Notifications', icon: Icon8, path: '/notifications' },
  { label: 'Settings', icon: Icon9, path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) =>
    currentPath === path || (path !== '/' && currentPath.startsWith(path));

  return (
    <div className=' w-full pl-4 md:pl-[65px] pt-12 md:pt-[52px] pr-4 md:pr-[61px]'>
      <img 
        src="/andron.svg" 
        alt='andron' 
        className='w-full max-w-[120px] md:max-w-none h-full mb-6 md:mb-[41px]' 
      />

      <div className="space-y-[40px] lg:space-y-[32px]">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <div
              key={index}
              className='flex items-center space-x-2 md:space-x-[10px] cursor-pointer hover:opacity-80 transition-opacity'
              onClick={() => navigate(item.path)}
            >
              <div>
                <Icon isActive={active} />
              </div>
              <div
                className={`font-[325] text-sm md:text-[16px] leading-[1] tracking-[0] w-full md:w-[169px] ${
                  active ? 'text-[#79B833]' : 'text-[#767676]'
                }`}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}