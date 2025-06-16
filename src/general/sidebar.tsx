import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Icon1, Icon2, Icon3, Icon5, Icon6, Icon7, Icon8, Icon9 } from "./icon";

const navItems = [
  { label: "Dashboard", icon: Icon1, path: "/dashboard" },
  { label: "Customers", icon: Icon2, path: "/customers" },
  { label: "Payments", icon: Icon3, path: "/payments" },
  { label: "Transactions", icon: Icon5, path: "/transactions" },
  { label: "Properties", icon: Icon5, path: "/properties" },
  { label: "Personnel", icon: Icon6, path: "/personnel" },
  { label: "Requests & Enquiries", icon: Icon7, path: "/Requests-Enquiries" },
  { label: "Notifications", icon: Icon8, path: "/notifications" },
  { label: "Settings", icon: Icon9, path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) =>
    currentPath === path || (path !== "/" && currentPath.startsWith(path));

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <div className="hidden lg:block  pl-4 md:pl-[40px] pt-12 md:pt-[52px] pr-[20px] bg-white max-h-screen  w-full">
      <img
        src="/andron.svg"
        alt="andron"
        className=" mb-6 md:mb-[41px] max-w-[150px]"
      />

      <div className="space-y-[40px] lg:space-y-[32px]">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <div
              key={index}
              className="flex items-center space-x-2 md:space-x-[10px] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(item.path)}
            >
              <div>
                <Icon isActive={active} />
              </div>
              <div
                className={`font-[325] text-sm md:text-[16px] leading-[1] tracking-[0] w-full md:w-[169px] ${
                  active ? "text-[#79B833]" : "text-[#767676]"
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

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <>
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-0 z-50 p-2 rounded-md focus:outline-none"
      >
        <div className="w-6 h-0.5 bg-black"></div>
        <div className="w-6 h-0.5 bg-black my-1.5"></div>
        <div className="w-6 h-0.5 bg-black"></div>
      </button>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-[#79B833] opacity-10 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden">
            <div className="w-full pl-4 pt-12 pr-[20px]">
              <div className="flex justify-between items-center mb-6">
                <img
                  src="/andron.svg"
                  alt="andron"
                  className="  max-w-[100px]"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-[40px]">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <div>
                        <Icon isActive={active} />
                      </div>
                      <div
                        className={`font-[325] text-[16px] leading-[1] tracking-[0] w-full ${
                          active ? "text-[#79B833]" : "text-[#767676]"
                        }`}
                      >
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
