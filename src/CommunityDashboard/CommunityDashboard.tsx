// components/CommunityDashboard.tsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AccessCodeSection from "./AccessCodeSection";
import CommunityChat from "./CommunityChat";
import EstateSelector, { Estate } from "./EstateSelector";
import MessagingPlatform from "./MessagingPlatform";
import PaymentSection from "./PaymentSection";
import UtilityPayment from "./UtilityPayment";

const CommunityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedEstate, setSelectedEstate] = useState("Lekki Phase 1");

  // Mock estates a user might belong to - with correct type
  const userEstates: Estate[] = [
    { id: "1", name: "Lekki Phase 1", type: "estate" },
    { id: "2", name: "Banana Island", type: "estate" },
    { id: "3", name: "Victoria Island", type: "land" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Your Properties
              </h3>
              <p className="text-3xl font-bold text-[#79B833] mt-2">3</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Active Communities
              </h3>
              <p className="text-3xl font-bold text-[#79B833] mt-2">2</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Pending Payments
              </h3>
              <p className="text-3xl font-bold text-[#79B833] mt-2">1</p>
            </div>
          </div>
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
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#79B833]">Community Hub</h1>
          <EstateSelector
            estates={userEstates}
            selected={selectedEstate}
            setSelected={setSelectedEstate}
          />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default CommunityDashboard;
