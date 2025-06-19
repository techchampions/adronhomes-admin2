import React, { useEffect, useState } from "react";
import Header from "../general/Header";
import { GreenCardMarketer, MatrixCard } from "../components/firstcard";
import { ReusableTable } from "../components/Tables/Table_one";
import ReferralModal from "../marketer/referalModal/referralModal";

export default function DirectorsDashboard() {
  const tabs = ["Registered Customers", "Active Plans"];
  const [activeTab, setActiveTab] = useState("Registered Customers");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mb-[52px]">
      <Header title="Dashboard" subtitle="Manage settings" />

      <div className="space-y-[30px]">
        <div className="grid lg:grid-cols-4 gap-[10px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <GreenCardMarketer
            currency={false}
            value="Director"
            // change="Includes all total referred amount for this month"
            title="Mike Wellington"
            handleClickView={() => setShowModal(true)}
          />
          <MatrixCard
            title="Referred Customers"
            value={"0"}
            change="Includes all customers on a property plan"
          />
          <MatrixCard
            title="Active Plans"
            value={"0"}
            change="All customers on a property plan"
          />
          <MatrixCard
            title="Active Plans"
            value={"0"}
            change="All customers on a property plan"
          />
        </div>

        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <ReusableTable
            tabs={tabs}
            searchPlaceholder="Search Customer"
            activeTab={activeTab}
            onTabChange={setActiveTab}
          ></ReusableTable>

          {showModal && <ReferralModal onClose={() => setShowModal(false)} />}
        </div>
      </div>
    </div>
  );
}
