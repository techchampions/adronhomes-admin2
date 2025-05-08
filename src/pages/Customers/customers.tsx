import React from "react";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import CustomersTableComponent from "./customers_Table";


const demoData = [
  {
    id: "1",
    name: "Alice Johnson",
    marketer: "John Doe",
    dateJoined: "2023-04-15",
    propertyPlans: "Premium",
    savedProperties: 4,
    phoneNumber: "(555) 123-4567",
  },
  {
    id: "2",
    name: "Bob Smith",
    marketer: "Jane Wilson",
    dateJoined: "2022-12-01",
    propertyPlans: "Standard",
    savedProperties: 2,
    phoneNumber: "(555) 987-6543",
  },
  {
    id: "3",
    name: "Carol White",
    marketer: "Samuel Green",
    dateJoined: "2024-07-20",
    propertyPlans: "Basic",
    savedProperties: 1,
    phoneNumber: "(555) 111-2222",
  },
];

export default function Customers() {
  const tabs = ['Registered Customers', 'Active Plans']
  return (
    <div className="pb-[52px]">
      <Header
        title="Customers"
        subtitle="Manage the list of registered customers"
      />
      <div className="grid md:grid-cols-3 gap-[20px] lg:pl-[38px]  lg:pr-[68px]  pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen />
        <MatrixCard
          title="Total Active Customers"
          value="217"
          change="includes all customers on a property plan"
        />
        <MatrixCard
          title="Total Active Plans"
          value="6"
          change="Includes all active property plans"
        />
      </div>

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        {" "}
        <ReusableTable tabs={tabs} searchPlaceholder={"Search Customer"} activeTab={""}>
          <CustomersTableComponent  data={demoData} />
        </ReusableTable>
      </div>
    </div>
  );
}
``;
