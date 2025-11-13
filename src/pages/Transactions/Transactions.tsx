import React, { useEffect, useState } from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";

import { formatDate } from "../../utils/formatdate";
import NotFound from "../../components/NotFound";
import LoadingAnimations from "../../components/LoadingAnimations";
import { fetchUserTransactions } from "../../components/Redux/Payment/userPayment/usePaymentThunk";
import TransactionTableComponent from "./Transaction_Table";
import { useParams } from "react-router-dom";

export default function UserTransactions() {
  const tabs = ["All Transactions"];
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("All Transactions");
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState(id); 

  const { data, loading, error, pagination } = useSelector(
    (state: RootState) => state.userPayments
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserTransactions({ 
        userId,
        status: activeTab === "Approved" ? 1 : 
                activeTab === "Rejected" ? 2 : 
                activeTab === "Pending" ? 0 : null
      }));
    }
  }, [dispatch, userId, activeTab]);

  const transformTransactionData = () => {
    if (!data?.data) return [];

    return data.data.map((transaction) => ({
      id: transaction.id,
      amount: transaction.amount.toString(),
      transactionType: transaction.transaction_type,
      status: transaction.status === 1
        ? "Approved"
        : transaction.status === 0
        ? "Pending"
        : "Rejected",
      transactionDate: transaction.created_at,
      reference: transaction.reference,
      description: transaction.description,
      transactionMethod: transaction.transaction_method,
      isPayment: transaction.is_payment === 1,
      marketer: transaction.marketer
        ? `${transaction.marketer.first_name} ${transaction.marketer.last_name}`
        : "N/A",
      property: transaction.property,
      plan: transaction.plan
    }));
  };

  const filteredData = transformTransactionData();
  const isEmpty = filteredData.length === 0;

  return (
    <div className="mb-[52px] relative">
      <Header 
        title="User Transactions" 
        subtitle="Manage user transaction history"
        showSearchAndButton={false}
        history={true}
      />
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          searchPlaceholder={"Search Transactions"}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        >
          {loading ? (
            <div className="absolute top-96 left-96 right-96">
              <LoadingAnimations loading={loading} />
            </div>
          ) : isEmpty ? (
            <div className="max-h-screen">
              <p className="text-center font-normal text-[#767676]">No transaction records found</p>
              <NotFound />
            </div>
          ) : (
            <TransactionTableComponent 
              data={transformTransactionData()} 
              userId={userId} 
            />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}