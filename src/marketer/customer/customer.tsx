import React from "react";
import Header from "../Header/Hearder";
import {
  GreenCardMarketer,
  MatrixCard,
  MatrixCardGreen,
} from "../../components/firstcard";

import CustomersTableAll from "./customerTable";
import { ReusableTable } from "../../components/Tables/Table_one";
import CustomersTableFullyPaid from "./fullPaidTable";

export default function Customer() {
  const tabs = ["Registered Customers", "Fully Paid"];
  const [activeTab, setActiveTab] = React.useState(tabs[0]);

  return (
    <div>
      <Header Name="Customers" role="Manage the list of registered customers" />

      <div className="grid lg:grid-cols-4 gap-[10px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <MatrixCardGreen />
        <MatrixCard
          title="Active Plans"
          value="203"
          change="All customers on a property plan"
        />
        <MatrixCard
          title="Fully Paid Plans"
          value="3"
          change="Customers with upcoming payments"
        />
        <MatrixCard
          title="Upcoming Payments this week"
          value="3"
          change="Customers with upcoming payments"
        />
      </div>

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mt-[26px]">
        <ReusableTable
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        >
          {activeTab === "Registered Customers" && <CustomersTableAll />}
          {activeTab === "Fully Paid" && <CustomersTableFullyPaid />}
        </ReusableTable>
      </div>
    </div>
  );
}
