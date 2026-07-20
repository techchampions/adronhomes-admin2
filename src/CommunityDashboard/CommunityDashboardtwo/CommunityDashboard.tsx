import React, { useState } from "react";
import {
  FiBell,
  FiCheckCircle,
  FiCreditCard,
  FiFileText,
  FiGrid,
  FiHome,
  FiKey,
  FiMapPin,
  FiMessageCircle,
  FiTool,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import EstateSelector, { Estate } from "./EstateSelector";
import CommunityChat from "./CommunityChat";
import UtilityPayment from "./UtilityPayment";
import AccessCodeSection from "./AccessCodeSection";
import MessagingPlatform from "./MessagingPlatform";
import PaymentSection from "./PaymentSection";
import DashboardOverview from "./DashboardOverview";
import MaintenanceSection from "./MaintenanceSection";
import DocumentsSection from "./DocumentsSection";

export type CommunitySection =
  | "overview"
  | "community"
  | "utilities"
  | "access"
  | "messages"
  | "payments"
  | "maintenance"
  | "documents";

interface CommunityDashboardProps {
  initialSection?: CommunitySection;
}

const sectionRoutes: Array<{
  id: CommunitySection;
  label: string;
  helper: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: "overview",
    label: "Overview",
    helper: "My estate, bills, notices",
    path: "/estate",
    icon: FiGrid,
  },
  {
    id: "community",
    label: "Community",
    helper: "General estate chat",
    path: "/estate/chat",
    icon: FiUsers,
  },
  {
    id: "messages",
    label: "Private Chats",
    helper: "Flat, plot, building chats",
    path: "/estate/messages",
    icon: FiMessageCircle,
  },
  {
    id: "payments",
    label: "Payments",
    helper: "Property and dues",
    path: "/estate/payments",
    icon: FiCreditCard,
  },
  {
    id: "utilities",
    label: "Utilities",
    helper: "Electricity, water, internet",
    path: "/estate/utilities",
    icon: FiZap,
  },
  {
    id: "access",
    label: "Access Codes",
    helper: "Visitor and gate passes",
    path: "/estate/access",
    icon: FiKey,
  },
  {
    id: "maintenance",
    label: "Maintenance",
    helper: "Repairs and service desk",
    path: "/estate/maintenance",
    icon: FiTool,
  },
  {
    id: "documents",
    label: "Documents",
    helper: "Receipts, deeds, minutes",
    path: "/estate/documents",
    icon: FiFileText,
  },
];

const CommunityDashboard: React.FC<CommunityDashboardProps> = ({
  initialSection = "overview",
}) => {
  const [activeTab, setActiveTab] = useState<CommunitySection>(initialSection);
  const [selectedEstate, setSelectedEstate] = useState("Lekki Phase 1 Estate");

  const userEstates: Estate[] = [
    {
      id: "1",
      name: "Lekki Phase 1 Estate",
      type: "estate",
      ownership: "4 Bedroom Terrace",
      paymentPlan: "Installment",
      balance: "₦18,500,000",
    },
    {
      id: "2",
      name: "Banana Island Court",
      type: "estate",
      ownership: "Apartment 5B",
      paymentPlan: "Fully Paid",
      balance: "₦0",
    },
    {
      id: "3",
      name: "Victoria Island Land",
      type: "land",
      ownership: "Plot 12 - 600sqm",
      paymentPlan: "Installment",
      balance: "₦7,200,000",
    },
  ];

  const selectedEstateData = userEstates.find(
    (estate) => estate.name === selectedEstate,
  );

  const activeSection = sectionRoutes.find((section) => section.id === activeTab);

  const openSection = (section: CommunitySection) => {
    setActiveTab(section);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <DashboardOverview
            selectedEstate={selectedEstate}
            onOpenSection={openSection}
          />
        );
      case "community":
        return <CommunityChat estateId={selectedEstate} />;
      case "utilities":
        return <UtilityPayment />;
      case "access":
        return <AccessCodeSection />;
      case "messages":
        return <MessagingPlatform />;
      case "payments":
        return <PaymentSection />;
      case "maintenance":
        return <MaintenanceSection />;
      case "documents":
        return <DocumentsSection />;
      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid gap-5 p-5 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#79B833]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4F7E1D]">
                  Resident community
                </span>
                {/* <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Sits inside your existing navbar and sidebar
                </span> */}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
                  {selectedEstate}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  {selectedEstate} portal for estate groups, land owner groups,
                  building chats, access codes, utility bills, service charges,
                  documents, and maintenance requests.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <FiHome className="text-[#79B833]" />
                    Ownership
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedEstateData?.ownership}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <FiCheckCircle className="text-[#79B833]" />
                    Payment plan
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedEstateData?.paymentPlan}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <FiCreditCard className="text-[#79B833]" />
                    Balance
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedEstateData?.balance}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#79B833]/20 bg-[#79B833]/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4F7E1D]">
                    Current property group
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Owners are grouped by estate, land area, building, or unit.
                  </p>
                </div>
                <FiMapPin className="h-5 w-5 text-[#79B833]" />
              </div>
              <EstateSelector
                estates={userEstates}
                selected={selectedEstate}
                setSelected={setSelectedEstate}
              />
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-white p-3">
                  <p className="font-bold text-slate-950">247</p>
                  <p className="text-xs text-slate-500">Community members</p>
                </div>
                <div className="rounded-lg bg-white p-3">
                  <p className="font-bold text-slate-950">6</p>
                  <p className="text-xs text-slate-500">Open requests</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white px-3 py-3 sm:px-4 sm:py-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4">
              {sectionRoutes.map((section) => {
                const Icon = section.icon;
                const isActive = activeTab === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => openSection(section.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition sm:px-3 sm:py-3 ${
                      isActive
                        ? "border-[#79B833] bg-[#79B833] text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#79B833]/50 hover:bg-[#79B833]/5"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={`rounded-lg p-1.5 sm:p-2 ${
                        isActive ? "bg-white/15" : "bg-slate-100"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold sm:text-sm truncate">
                        {section.label}
                      </span>
                      <span
                        className={`hidden sm:block text-xs ${
                          isActive ? "text-white/80" : "text-slate-500"
                        } truncate`}
                      >
                        {/* {section.path} */}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">
              {activeSection?.label}
            </p>
            <p className="text-xs text-slate-500">{activeSection?.helper}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#79B833]/10 px-3 py-2 text-xs font-medium text-[#4F7E1D]">
            <FiBell className="h-4 w-4" />3 new community updates
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default CommunityDashboard;
