import React, { useEffect, useState } from "react";
import Header from "../general/Header";
import { GreenCardMarketer, MatrixCard } from "../components/firstcard";
import { ReusableTable } from "../components/Tables/Table_one";
import ReferralModal from "../marketer/referalModal/referralModal";
import DashCard from "./DashCard";
import { FaUserShield } from "react-icons/fa6";
import { useGetDirectorDashboard } from "../utils/hooks/query";
import NotFound from "../components/NotFound";
import { formatDate } from "../utils/formatdate";
import DirectorProperttList from "./DirectorProperttList";

export default function DirectorsDashboard() {
  const { data, isLoading, isError } = useGetDirectorDashboard();
  const properties = data?.properties || [];
  const tabs = ["Properties"];
  const [activeTab, setActiveTab] = useState("Properties");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mb-[52px]">
      <Header title="Dashboard" subtitle="Manage settings" />

      <div className="space-y-[30px]">
        <div className="grid lg:grid-cols-5 gap-[10px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <DashCard
            className="col-span-2"
            isHighlighted={true}
            valueText={data?.director.personnel}
            mainText={`${data?.director.first_name} ${data?.director.last_name}`}
            mutedText={`Created at ${formatDate(data?.director.created_at)}`}
            actionText="Account Settings"
            icon={<FaUserShield />}
            isloading={isLoading}
          />
          <DashCard
            className=""
            mainText="Total Properties"
            valueText={data?.total_properties}
            mutedText="Includes all Properties"
            isloading={isLoading}
          />
          <DashCard
            className=""
            mainText="Total Properties Available"
            valueText={data?.total_available}
            mutedText="All Properties Available"
            isloading={isLoading}
          />
          <DashCard
            className=""
            mainText="Total Bought Properties"
            valueText={data?.total_sold}
            mutedText="Includes total bought Properties"
            isloading={isLoading}
          />
        </div>

        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <ReusableTable
            tabs={tabs}
            searchPlaceholder="Search Properties"
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {properties.length < 1 ? (
              <NotFound />
            ) : (
              <DirectorProperttList data={properties} />
            )}
          </ReusableTable>

          {showModal && <ReferralModal onClose={() => setShowModal(false)} />}
        </div>
      </div>
    </div>
  );
}
