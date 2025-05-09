import React from "react";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import PaymentTableComponent, { PaymentData } from "./PaymentTable";
import { paymentData } from "../../utils/paymentdata";

export default function Payment() {

  return (
    <div className="pb-[52px]">
      <Header
        title="Payments"
        subtitle="Manage the list of payments made by customers"
      />

      <div className="grid lg:grid-cols-3 gap-[20px] lg:pl-[38px] items-center lg:pr-[68px]  pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          currency={true}
          title="Total Amount Paid"
          value="300,000,000,000"
          change="Includes all property plans"
        />
        <MatrixCard
          currency={true}
          title="Total Pending Payments"
          value="405,000,000"
          change="includes all customers on a property plan"
        />
        <MatrixCard
          title="Total Active Properties"
          value="39"
          change="Includes all active property plans"
        />
      </div>
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
     <ReusableTable activeTab={""}>  <PaymentTableComponent data={paymentData as PaymentData[]}/></ReusableTable>
     </div>


    </div>
  );
}
