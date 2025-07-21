import React, { useEffect, useState } from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";

import { formatDate } from "../../utils/formatdate";
import NotFound from "../../components/NotFound";
import LoadingAnimations from "../../components/LoadingAnimations";
import { fetchUserPayments } from "../../components/Redux/Payment/userPayment/usePaymentThunk";
import PaymentTableComponent from "./Transaction_Table";
import { useParams } from "react-router-dom";



export default function UserPayments() {
  const tabs = ["All Payments"];
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("All Payments");
   const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState(id); 

  const { data, loading, error, pagination } = useSelector(
    (state: RootState) => state.userPayments
  );

  useEffect(() => {
    dispatch(fetchUserPayments({ 
      userId,
      status: activeTab === "Approved" ? 1 : 
              activeTab === "Rejected" ? 2 : 
              activeTab === "Pending" ? 0 : null
    }));
  }, [dispatch, userId, activeTab]);

  const transformPaymentData = () => {
    if (!data?.data) return [];

    return data.data.map((payment:any) => ({
      id: payment.id,
      customerName: payment.bank_name,
      marketerInCharge: payment.marketer 
        ? `${payment.marketer.first_name} ${payment.marketer.last_name}`
        : "N/A",
      amount: payment.amount_paid.toString(),
      status: payment.status === 1
        ? "Approved"
        : payment.status === 0
        ? "Rejected"
        : "Pending",
      paymentDate: payment.created_at,
      reference: payment.reference,
      description: payment.description,
      payment_type: payment.payment_type,
      property: payment.property,
      director: payment.director
    }));
  };

  const filteredData = transformPaymentData();
  const isEmpty = filteredData.length === 0;

  return (
    <div className="mb-[52px] relative">
      <Header title="User Payments" subtitle="Manage user payment history"
       showSearchAndButton={false}
       history={true}
       />
      { (
        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <ReusableTable
            searchPlaceholder={"Search Payments"}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
          >
            {isEmpty ? (
              <div className="max-h-screen">
                <p className="text-center font-normal text-[#767676]">No payment records found</p>
                <NotFound />
              </div>
            ):loading ? (
        <div className="absolute top-96 left-96 right-96">
          <LoadingAnimations loading={loading} />
        </div>
      )  : (
              <PaymentTableComponent data={transformPaymentData()} userId={userId} />
            )}
          </ReusableTable>
        </div>
      )}
    </div>
  );
}