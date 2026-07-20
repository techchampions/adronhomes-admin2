// components/Sidebar.tsx
import React from "react";
import {
  FiHome,
  FiUsers,
  FiZap,
  FiKey,
  FiMessageCircle,
  FiCreditCard,
} from "react-icons/fi";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "community", label: "Community", icon: FiUsers },
    { id: "utilities", label: "Utilities", icon: FiZap },
    { id: "access", label: "Access Codes", icon: FiKey },
    { id: "messages", label: "Messages", icon: FiMessageCircle },
    { id: "payments", label: "Payments", icon: FiCreditCard },
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-[#79B833]">Property Hub</h2>
        <p className="text-sm text-gray-500">Community Manager</p>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-[#79B833] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
