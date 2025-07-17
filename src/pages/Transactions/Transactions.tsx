import React, { useEffect, useState } from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import TransactionTableComponent, {
  TransactionData,
} from "./Transaction_Table";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../components/Redux/Transactions/Transactions_thunk";
import { formatDate } from "../../utils/formatdate";
import NotFound from "../../components/NotFound";
import LoadingAnimations from "../../components/LoadingAnimations";

export default function Transactions() {
  const tabs = ["All Transactions", "Approved", "Pending", "Rejected"];
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState(tabs[0]);

  // useEffect(() => {
  //   dispatch(fetchTransactions());
  // }, [dispatch]);

  const { data, loading, error, pagination } = useSelector(
    (state: RootState) => state.transactions
  );





 const transformTransactionData = (): TransactionData[] => {
  if (!data?.data?.transactions?.list?.data) return [];

  return data.data.transactions.list.data
    .filter((transaction) => {
      if (activeTab === "All Transactions") return true;
      if (activeTab === "Approved") return transaction.status === 1;
      if (activeTab === "Rejected") return transaction.status === 2;
      if (activeTab === "Pending") return transaction.status !== 1 && transaction.status !== 2;
      return true;
    })
    .map((transaction) => ({
     id: `#${Math.floor(100000000 + Math.random() * 900000000)}${transaction.id % 10}`,

      customerName: transaction.user
        ? `${transaction.user.first_name} ${transaction.user.last_name}`
        : "N/A ",
      marketerInCharge: transaction.marketer
        ? `${transaction.marketer.first_name} ${transaction.marketer.last_name}`
        : "N/A",
      amount: `₦${transaction.amount.toLocaleString()}`,
      status:
        transaction.status === 1
          ? "Approved"
          : transaction.status === 2
          ? "Rejected"
          : ("Pending" as const),
      paymentDate: formatDate(transaction.created_at),
      reference:transaction.reference,
      description: transaction.description,
      transaction_method:transaction.transaction_method
    }));
};
  const filteredData = transformTransactionData();
  const isEmpty = filteredData.length === 0;

  return (
    <div className="mb-[52px] relative ">
      <Header title="Transactions" subtitle="Manage the list of transactions" />
         {loading ? (
     <div className=" absolute top-96 left-96 right-96">   <LoadingAnimations loading={loading} /></div>
      ) : (
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          searchPlaceholder={"Search Transactions"}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab)=>setActiveTab(tab)}
        >
          {isEmpty ? (
                <div className="max-h-screen">
                  <p className="text-center font-normal text-[#767676]">No data found</p>
                  <NotFound />
                </div>
              ) : (
                <TransactionTableComponent data={transformTransactionData()} />
              )}
        </ReusableTable>
      </div>)}
    </div>
  );
}
