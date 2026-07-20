// components/DashboardOverview.tsx
import React from "react";
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiTrendingUp,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiZap,
  FiKey,
  FiTool,
  FiFileText,
  FiMessageCircle,
} from "react-icons/fi";
import type { CommunitySection } from "./CommunityDashboard";

interface DashboardOverviewProps {
  selectedEstate: string;
  onOpenSection?: (section: CommunitySection) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  selectedEstate,
  onOpenSection,
}) => {
  const stats = [
    {
      label: "Properties",
      value: "3",
      change: "+12%",
      trend: "up",
      icon: FiHome,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Community Members",
      value: "247",
      change: "+8%",
      trend: "up",
      icon: FiUsers,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Active Payments",
      value: "₦2.4M",
      change: "-3%",
      trend: "down",
      icon: FiCreditCard,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Total Value",
      value: "₦89.5M",
      change: "+22%",
      trend: "up",
      icon: FiTrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Payment received",
      amount: "₦150,000",
      from: "John Smith",
      time: "2 hours ago",
      type: "payment",
    },
    {
      id: 2,
      action: "New property listed",
      amount: "₦25,000,000",
      from: "Jane Doe",
      time: "5 hours ago",
      type: "property",
    },
    {
      id: 3,
      action: "Community meeting",
      amount: "Tomorrow 2PM",
      from: "All members",
      time: "1 day ago",
      type: "event",
    },
  ];

  const quickActions: Array<{
    label: string;
    description: string;
    section: CommunitySection;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      label: "Pay outstanding bill",
      description: "Property installment, dues, or utility bill",
      section: "payments",
      icon: FiCreditCard,
    },
    {
      label: "Buy electricity units",
      description: "Enter meter number and token amount",
      section: "utilities",
      icon: FiZap,
    },
    {
      label: "Create visitor code",
      description: "One-time, scheduled, or recurring access",
      section: "access",
      icon: FiKey,
    },
    {
      label: "Report an issue",
      description: "Track repairs with photos and status",
      section: "maintenance",
      icon: FiTool,
    },
    {
      label: "Open community chat",
      description: "General estate or land-owner messages",
      section: "community",
      icon: FiMessageCircle,
    },
    {
      label: "View documents",
      description: "Receipts, allocation letters, meeting minutes",
      section: "documents",
      icon: FiFileText,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-2xl bg-gradient-to-r from-[#79B833] to-[#8FD14F] p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, John</h2>
            <p className="text-white/80 mt-1">
              You're managing <strong>{selectedEstate}</strong> and 2 other
              properties
            </p>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors">
            View All Properties
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {stat.trend === "up" ? (
                    <FiArrowUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <FiArrowDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-800">What do you want to do?</h3>
            <p className="text-sm text-gray-500">
              Plain-language shortcuts for non-technical property owners.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => onOpenSection?.(action.section)}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-[#79B833]/50 hover:bg-[#79B833]/5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#79B833]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-gray-800">{action.label}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            <button className="text-sm text-[#79B833] hover:underline">
              View All
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "payment"
                        ? "bg-green-100"
                        : activity.type === "property"
                          ? "bg-blue-100"
                          : "bg-purple-100"
                    }`}
                  >
                    {activity.type === "payment" ? (
                      <FiCreditCard className="w-4 h-4 text-green-600" />
                    ) : activity.type === "property" ? (
                      <FiHome className="w-4 h-4 text-blue-600" />
                    ) : (
                      <FiCalendar className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.from} • {activity.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {activity.amount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
