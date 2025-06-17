import React, { useState } from "react";
import { GoX } from "react-icons/go";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../Table_one";
import PaymentsTableAll from "./PaymentTable";

export default function ReferralModal({ onClose }: { onClose: () => void }) {
  const tabs = ["Referral History"];
  const [activeTab, setActiveTab] = useState("Referral History");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#F5F5F5] rounded-[20px] max-w-[800px] w-full max-h-[90vh] flex flex-col">
        {/* Non-scrollable header */}
        <div className="p-6 pb-0 flex-shrink-0">
          <div className="flex flex-row justify-between items-start w-full">
            <div>
              {/* title */}
              <p className="text-2xl font-[350] text-dark">Referral Details</p>
              {/* sub title */}
              <h1 className="text-base text-dark font-[325] mt-2 pb-4">
                View the referral amount history
              </h1>
            </div>

            {/* cancel button */}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close modal"
            >
              <GoX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-6">
          {/* cards */}
          <div className="grid md:grid-cols-2 gap-5 mt-5">
            <MatrixCardGreen
              title="Active Plans"
              value="203"
              change="All customers on a property plan"
            />

            <MatrixCard
              title="Referred Customers"
              value="203"
              change="includes all customers on a property plan"
            />
          </div>

          {/* table section */}
          <div className="mt-5">
            <ReusableTable
              activeTab="Referral History"
              onTabChange={(tab) => console.log("Tab changed:", tab)}
              onYearChange={(year) => {
                console.log("Year selected:", year);
                setSelectedYear(year);
              }}
              tabs={tabs}
            >
              <PaymentsTableAll />
            </ReusableTable>
          </div>
        </div>
      </div>
    </div>
  );
}
