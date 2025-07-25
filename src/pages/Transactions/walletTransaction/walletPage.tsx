import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchWalletTransactions } from "../../../components/Redux/customers/wallet_Transactions_thunk";
import Header from "../../../general/Header";
import { ReusableTable } from "../../../components/Tables/Table_one";
import NotFound from "../../../components/NotFound";
import LoadingAnimations from "../../../components/LoadingAnimations";
import WalletTransactionsTable from "./walletTable";

export default function WalletTransactionsPage() {
  const tabs = ["All Wallet Transactions"];
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("All Wallet Transactions");
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState(id); 

  const { data, loading, error, pagination } = useSelector(
    (state: RootState) => state.walletTransactions
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchWalletTransactions(Number(userId)));
    }
  }, [dispatch, userId, activeTab]);

  // Check if data is empty
  const isEmpty = !data?.data || data.data.length === 0;

  return (
    <div className="mb-[52px] relative">
      <Header 
        title="Wallet Transactions" 
        subtitle="Manage user wallet transaction history"
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
          {isEmpty ? (
            <div className="max-h-screen">
              <p className="text-center font-normal text-[#767676]">No transaction records found</p>
              <NotFound />
            </div>
          ) : loading ? (
            <div className="absolute top-96 left-96 right-96">
              <LoadingAnimations loading={loading} />
            </div>
          ) : (
            <WalletTransactionsTable 
              data={data?.data || []} 
              userId={Number(userId)} 
            />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}