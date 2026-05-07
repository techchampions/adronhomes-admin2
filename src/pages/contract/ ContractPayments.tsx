import React, { useCallback, useEffect, useMemo } from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import { AppDispatch } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { 
  selectAllContractPayments, 
  selectContractPaymentsStats,
  selectContractPaymentsPagination,
  selectContractPaymentsLoading,
  selectContractPaymentsError,
  setCurrentPage,
  setActiveTab,
  selectActiveTab
} from "../../components/Redux/Contract/contract_payments_slice";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import ContractPaymentsTableComponent, { ContractPaymentData } from "./ContractPayments_Table";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { fetchContractPayments } from "../../components/Redux/Contract/contract_payments_thunk";

export default function ContractPayments() {
  // Tabs with proper type mapping
  const tabs = [
    { label: "All Payments", value: null },
    { label: "Pending", value: "pending" },
    { label: "Active", value: "active" }
  ];
  
  const dispatch = useDispatch<AppDispatch>();
  
  const activeTab = useSelector(selectActiveTab);
  const payments = useSelector(selectAllContractPayments);
  const stats = useSelector(selectContractPaymentsStats);
  const pagination = useSelector(selectContractPaymentsPagination);
  const loading = useSelector(selectContractPaymentsLoading);
  const error = useSelector(selectContractPaymentsError);

  useEffect(() => {
    // Find the selected tab object to get the type value
    const selectedTab = tabs.find(tab => tab.label === activeTab);
    const typeFilter = selectedTab?.value || null;

    dispatch(fetchContractPayments({
      page: pagination.currentPage,
      per_page: pagination.perPage,
      type: typeFilter // Send 'type' parameter (either 'virtual_wallet', 'interswitch', or null)
    }));
  }, [dispatch, pagination.currentPage, pagination.perPage, activeTab]);

  const handleSearch = (searchTerm: string) => {
    // Implement search if needed
    console.log("Search:", searchTerm);
  };

  const handleTabChange = useCallback((tabLabel: string) => {
    dispatch(setActiveTab(tabLabel));
    dispatch(setCurrentPage(1));
  }, [dispatch]);

  // Use stats from API response
  const cardConfigs = useMemo(
    () => ({
      totalPayments: {
        title: "Total Payments",
        value: stats?.total ? stats.total.toLocaleString() : "0",
        change: "Total number of payments",
      },
      pendingPayments: {
        title: "Pending Payments",
        value: stats?.pending ? stats.pending.toLocaleString() : "0",
        change: "Payments awaiting approval",
      },
      completedPayments: {
        title: "Completed Payments",
        value: stats?.completed ? stats.completed.toLocaleString() : "0",
        change: "Successfully completed payments",
      },
    }),
    [stats]
  );

  const transformPaymentData = (): ContractPaymentData[] => {
    if (!payments || payments.length === 0) return [];

    return payments.map((payment) => ({
      id: payment.id,
      contract_id: payment.contract_id,
      erp_contract_id: payment.erp_contract_id,
      user_id: payment.user_id,
      amount_paid: payment.amount_paid,
      payment_type: payment.payment_type,
      status: payment.status,
      reference: payment.reference,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      customerName: payment.contract?.customerName || "N/A",
      customerEmail: payment.contract?.customerEmail || "N/A",
      customerPhone: payment.contract?.customerPhone || "N/A",
      propertyName: payment.contract?.propertyName || "N/A",
      contract: payment.contract,
    }));
  };

  const filteredData = transformPaymentData();
  const isEmpty = !loading && filteredData.length === 0;

  // Get tab labels for ReusableTable component
  const tabLabels = tabs.map(tab => tab.label);

  return (
    <div className="mb-[52px] relative">
      <Header 
        title="Contract Payments" 
        subtitle="Manage and track all contract payments"
        showSearchAndButton={false}
        history={true}
      />

      <div className="grid lg:grid-cols-3 gap-[20px] lg:pl-[38px] items-center lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          currency={false}
          title={cardConfigs.totalPayments.title}
          value={cardConfigs.totalPayments.value}
          change={cardConfigs.totalPayments.change}
        />
        <MatrixCard
          currency={false}
          title={cardConfigs.pendingPayments.title}
          value={cardConfigs.pendingPayments.value}
          change={cardConfigs.pendingPayments.change}
        />
        <MatrixCard
          currency={false}
          title={cardConfigs.completedPayments.title}
          value={cardConfigs.completedPayments.value}
          change={cardConfigs.completedPayments.change}
        />
      </div>

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          searchPlaceholder={"Search contract payments by reference, customer, or contract ID..."}
          tabs={tabLabels}
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
              <p className="text-center font-normal text-[#767676]">No contract payments found</p>
              <NotFound />
            </div>
          ) : (
            <ContractPaymentsTableComponent 
              data={filteredData}
              pagination={pagination}
            />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}