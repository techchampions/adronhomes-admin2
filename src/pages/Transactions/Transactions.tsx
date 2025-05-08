import React from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import CustomerTableComponent, { CustomerData } from "./Transaction_Table";

export default function Transactions() {
    const tabs = ['Registered Customers', 'Active Plans']
    const customerData: CustomerData[] = [
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        },
        {
          customerName: "Sarah Mka",
          marketerInCharge: "Mikel Otega",
          dateJoined: "19.07.2025",
          propertyPlans: 3,
          savedProperties: 4,
          phoneNumber: "08094563678"
        }
      ];
    
  return (
    <div className="mb-[52px]">
      <Header title="Transactions" subtitle="Manage the list of transactions" />
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        {" "}
        <ReusableTable searchPlaceholder={"Search Customer"} tabs={tabs} activeTab={""}><CustomerTableComponent data={customerData}/> </ReusableTable>
      </div>
    </div>
  );
}
