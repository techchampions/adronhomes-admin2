// UserWallet.tsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { 
  selectWalletTransactionsList, 
  selectWalletSummary,
  selectWalletPagination,
  selectWalletLoading,
  selectWalletError,
  setCurrentPage,
  setSearchFilter,
  setTransactionTypeFilter 
} from "../../components/Redux/wallet/walllet_slice";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import { fetchWalletTransactions } from "../../components/Redux/wallet/wallet_thunk";
import WalletTableComponent from "./Wallet_Table";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";

export default function UserWallet() {
  const tabs = ["All Transactions", "Credit", "Debit"];
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("All Transactions");

  // Select data from wallet slice
  const transactions = useSelector(selectWalletTransactionsList);
  const summary = useSelector(selectWalletSummary);
  const pagination = useSelector(selectWalletPagination);
  const loading = useSelector(selectWalletLoading);
  const error = useSelector(selectWalletError);

  useEffect(() => {
    dispatch(fetchWalletTransactions({
      page: pagination.currentPage,
    //   per_page: pagination.perPage,
    //   search: pagination.searchFilter,
      type: activeTab === "All Transactions" ? null : activeTab.toLowerCase()
    }));
  }, [dispatch, pagination.currentPage, pagination.perPage, pagination.searchFilter, activeTab]);

  const handleSearch = (searchTerm: string) => {
    dispatch(setSearchFilter(searchTerm || null));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    dispatch(setTransactionTypeFilter(
      tab === "All Transactions" ? null : tab.toLowerCase()
    ));
  };
const cardConfigs = useMemo(
  () => ({
    totalAmount: {
      title: "Total Wallet Balance",
      value: summary?.total_wallet_amount
        ? Number(summary.total_wallet_amount).toLocaleString()
        : "0",
      change: "Includes all wallet balances",
    },
    pending: {
      title: "Total Credited",
      value: summary?.total_creditted
        ? Number(summary.total_creditted).toLocaleString()
        : "0",
      change: "Includes all credited transactions",
    },
    active: {
      title: "Total Debited",
      value: summary?.total_debitted
        ? Number(summary.total_debitted).toLocaleString()
        : "0",
      change: "Includes all debited transactions",
    },
  }),
  [summary]
);


  const transformWalletData = () => {
    if (!transactions) return [];

    return transactions.map((transaction) => ({
      id: transaction.id,
      amount: transaction.amount.toString(),
      transactionType: transaction.transaction_type,
      status: transaction.status === 1 ? "Approved" : "Pending",
      transactionDate: transaction.created_at,
      reference: transaction.reference,
      description: transaction.description,
      transactionMethod: transaction.transaction_method,
      customerName: transaction.user ? 
        `${transaction.user.first_name} ${transaction.user.last_name}` : "N/A",
      user: transaction.user,
      virtualAccount: transaction.user?.virtual_account
    }));
  };

  const filteredData = transformWalletData();
  const isEmpty = !loading && filteredData.length === 0;

  return (
    <div className="mb-[52px] relative">
      <Header 
        title="User Wallet" 
        subtitle="Manage user wallet transactions and balance"
        showSearchAndButton={false}
        history={true}
      />

    

<div className="grid lg:grid-cols-3 gap-[20px] lg:pl-[38px] items-center lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
  <MatrixCardGreen
    currency={true}
    title={cardConfigs.totalAmount.title}
    value={cardConfigs.totalAmount.value}
    change={cardConfigs.totalAmount.change}
  />
  <MatrixCard
    currency={true}
    title={cardConfigs.pending.title}
    value={cardConfigs.pending.value}
    change={cardConfigs.pending.change}
  />
  <MatrixCard
    currency={true}
    title={cardConfigs.active.title}
    value={cardConfigs.active.value}
    change={cardConfigs.active.change}
  />
</div>


      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          searchPlaceholder={"Search wallet transactions..."}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSearch={handleSearch}
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingAnimations loading={loading} />
            </div>
          ) : error ? (
            <div className="max-h-screen py-12">
              <p className="text-center font-normal text-[#767676]">Error: {error}</p>
            </div>
          ) : isEmpty ? (
            <div className="max-h-screen py-12">
              <p className="text-center font-normal text-[#767676]">No wallet transactions found</p>
              <NotFound />
            </div>
          ) : (
            <WalletTableComponent 
              data={filteredData}
              pagination={pagination}
            />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}