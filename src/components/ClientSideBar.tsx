"use client";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../components/Redux/Login/login_slice";
import { Icon2, Icon3, Icon5, Icon6, Icon7, Icon8 } from "../general/icon";



const navItems = [
  { label: "Customers", icon: Icon2, path: "/client/customers" },
//   { label: "Customer Payment", icon: Icon6, path: "/client/customers/singlepage/payment" },
  { label: "Contracts", icon: Icon7, path: "/client/contracts" },

];

export default function ClientSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPath = location.pathname;

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(path);

 const handleLogout = () => {
    dispatch(logout());
   window.location.href = '/';

  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block pl-4 md:pl-[40px] pt-12 md:pt-[52px] pr-[20px] bg-white min-h-screen w-[280px]">
      <img
        src="/andron.svg"
        alt="andron"
        className="mb-6 md:mb-[41px] max-w-[150px]"
      />
      <div className="space-y-[32px]">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <div
              key={index}
              className="flex items-center space-x-2 md:space-x-[10px] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(item.path)}
            >
              <Icon isActive={active} />
              <div
                className={`font-[325] text-sm md:text-[16px] ${
                  active ? "text-[#79B833]" : "text-[#767676]"
                }`}
              >
                {item.label}
              </div>
            </div>
          );
        })}

        {/* Logout */}
        <div
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity mt-10"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#767676]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <div className="text-sm md:text-[16px] text-[#767676]">Logout</div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-0 z-50 p-2 rounded-md"
      >
        <div className="w-6 h-0.5 bg-black"></div>
        <div className="w-6 h-0.5 bg-black my-1.5"></div>
        <div className="w-6 h-0.5 bg-black"></div>
      </button>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-10 z-40"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out">
            <div className="w-full pl-4 pt-12 pr-[20px]">
              <div className="flex justify-between items-center mb-6">
                <img src="/andron.svg" alt="andron" className="max-w-[100px]" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-[32px]">
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
                      <Icon isActive={active} />
                      <div
                        className={`text-[16px] ${
                          active ? "text-[#79B833]" : "text-[#767676]"
                        }`}
                      >
                        {item.label}
                      </div>
                    </div>
                  );
                })}

                {/* Logout */}
                <div
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity mt-10"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#767676]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <div className="text-[16px] text-[#767676]">Logout</div>
                </div>
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
