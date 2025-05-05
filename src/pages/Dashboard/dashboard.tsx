import React from "react";

import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import DashboardHearder from "../../general/DashboardHearder";
import {
  RevenueCard,
  RevenueWhiteCard,
  StatsCard,
} from "../../components/firstcard";

export default function Dashboard() {
  return (
    <div className="pb-[390px] max-w-[14]">
      <DashboardHearder title="Mike Wellington " />
      <div className="space-y-[20px]">
        <div className="grid grid-cols-2 gap-[22px] pl-[38px] pr-[68px]">
          <StatsCard />
          <StatsCard />
        </div>

        <div className="grid grid-cols-2 gap-[22px] pl-[38px] pr-[68px]">
          <StatsCard />
          <StatsCard />
        </div>

        <div className="grid grid-cols-3 gap-[20px] pl-[38px] pr-[68px] mt-[2px]">
          <RevenueCard />
          <RevenueWhiteCard />
          <RevenueWhiteCard
            tag="Pending Payments"
            amount="₦57,600,000"
            currency="₦"
            note="from last 6 months"
          />
        </div>
      </div>
    </div>
  );
}
