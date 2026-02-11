import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// import { Icon1, Icon2, Icon3, Icon5, Icon6, Icon7, Icon8, Icon9 } from './icon';
import {
  logout,
  resetLogoutSuccess,
} from "../components/Redux/Login/login_slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../components/Redux/store";
import { Icon1, Icon2, Icon3, Icon7, Icon5, Icon6, Icon8, Icon9 } from "./icon";

const navItems = [
  { label: "Dashboard", icon: Icon1, path: "/dashboard" },
  { label: "Clients", icon: Icon2, path: "/customers" },
  { label: "Property Payments", icon: Icon3, path: "/payments" },
  { label: "Wallet Transactions", icon: Icon8, path: "/wallet-Transactions" },
  { label: "Contracts", icon: Icon7, path: "/contracts" },
  { label: "Properties", icon: Icon5, path: "/properties" },
  {
    label: "Client Partnership",
    icon: Icon7,
    path: "/partnership-requests",
  },
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

  const logoutSuccess = useSelector(
    (state: RootState) => state.auth.logoutSuccess
  );

  const isActive = (path: string) =>
    currentPath === path || (path !== "/" && currentPath.startsWith(path));
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  // useEffect(() => {
  //   if (logoutSuccess) {
  //     navigate('/');
  //     dispatch(resetLogoutSuccess());
  //   }
  // }, [logoutSuccess]);

  const DesktopSidebar = () => (
    <div className="hidden lg:block pl-4 md:pl-[40px] pt-12 md:pt-[52px] pr-[20px] bg-white min-h-screen w-[280px]">
      <img
        src="/andron.svg"
        alt="andron"
        className="mb-6 md:mb-[41px] max-w-[150px]"
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

        {/* Logout Button */}
        <div
          className="flex items-center space-x-2 md:space-x-[10px] cursor-pointer hover:opacity-80 transition-opacity mt-10"
          onClick={handleLogout}
        >
          <div>
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
          </div>
          <div className="font-[325] text-sm md:text-[16px] leading-[1] tracking-[0] w-full md:w-[169px] text-[#767676]">
            Logout
          </div>
        </div>
        <div className="text-[#79B833] hover:underline text-sm">
          <Link to={"/marketer-customer"}>Access Marketer Dashboard</Link>
        </div>
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
                <img src="/andron.svg" alt="andron" className="max-w-[100px]" />
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

                {/* Logout Button for Mobile */}
                <div
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity mt-10"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <div>
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
                  </div>
                  <div className="font-[325] text-[16px] leading-[1] tracking-[0] w-full text-[#767676]">
                    Logout
                  </div>
                </div>
                <div className="text-[#79B833] hover:underline mt4">
                  <Link to={"/marketer-customer"}>Marketer Dashboard</Link>
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
