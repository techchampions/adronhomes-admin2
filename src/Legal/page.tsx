// LegalDashboardPage.tsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import ContractsTableComponenTwo from "../pages/contract/activeContractTable";
import { ReusableTable } from "../components/Tables/Table_one";
import LoadingAnimations from "../components/LoadingAnimations";
import { MatrixCard } from "../components/firstcard";
import Header from "../general/Header";
import NotFound from "../components/NotFound";
import { AppDispatch, RootState } from "../components/Redux/store";
import { fetchNewContracts, fetchUploadedContracts } from "../components/Redux/legalDashboard/legalDashboardSlice";
import ContractsTableComponentTwo from "./legalTable";
// import ContractsTableComponenTwo from "../pages/contract/contractTableTwo";

export default function LegalDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("New");
  const [searchQuery, setSearchQuery] = useState("");

  // Select data from Redux store
  const {
    totalContracts,
    totalUploadedContracts,
    contractList,
    loading,
    error,
    total_new_contract
  } = useSelector((state: RootState) => state.legalDashboard);

  useEffect(() => {
    if (activeTab === "New") {
      dispatch(fetchNewContracts());
    } else {
      dispatch(fetchUploadedContracts());
    }
  }, [dispatch, activeTab]);

  // Filter contracts based on search query
  const filteredContracts = contractList?.filter((contract:any) => 
    contract.unique_contract_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatAsNaira = (value: number | null) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value || 0);

  const handlePageChange = (page: number) => {
    console.log("Change to page:", page);
    // You can implement pagination here by calling the API with page parameter
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery(""); // Reset search when changing tabs
  };

  const tabs = ['New', 'Uploads'];

  // Calculate metrics based on active tab
  const getMetrics = () => {
    if (activeTab === "New") {
      return {
        total: totalContracts || 0,
        uploaded: totalUploadedContracts || 0,
            new:total_new_contract|| 0,
     
      };
    } else {
      return {
       total: totalContracts || 0,
        uploaded: totalUploadedContracts || 0,
        new:total_new_contract|| 0,
    
      };
    }
  };

  const metrics = getMetrics();

  return (
    <div className="pb-[52px] relative">
      <Header
        showSearchAndButton ={false}
        title="Legal"
        subtitle="Manage the list of Legal contracts "
        // buttonText="export"
      />

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCard
          title={activeTab === "New" ? "Total Contracts" : "Total  Contracts"}
          value={`${metrics.total}`}
          change={`Includes all contracts`}
        />

        <MatrixCard
          title={activeTab === "New" ? "Contracts Ready for Upload" : "Successfully Uploaded"}
          value={activeTab === "New" ?`${metrics.new} `:`${metrics.uploaded} `}
          change={`Includes all contracts`}
        />
      </div>

      {/* Contracts Table */}
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          searchPlaceholder={"Search by contract ID, name or email"}
          showTabs={true}
          onSearch={handleSearch}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={tabs}
          sort={false}
        >
          {loading ? (
            <div className="w-full flex items-center justify-center py-8">
              <LoadingAnimations loading={loading} />
            </div>
          ) : error ? (
            <div className="w-full flex items-center justify-center py-8">
              <p className="text-center text-red-500">{error}</p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="max-h-screen py-8">
              <p className="text-center font-normal text-[#767676]">
                {searchQuery ? "No contracts match your search" : `No ${activeTab.toLowerCase()} contracts found`}
              </p>
              <NotFound />
            </div>
          ) : (
            <ContractsTableComponentTwo
              data={filteredContracts} 
              pagination={{
                currentPage: 1,
                perPage: 10,
                totalItems: filteredContracts.length,
                totalPages: Math.ceil(filteredContracts.length / 10)
              }}
              onPageChange={handlePageChange}
              getStatusText={(status: number) => {
                switch (status) {
                  case 1: return "Active";
                  case 2: return "Completed";
                  case 3: return "Pending";
                  default: return "Unknown";
                }
              }}
            />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}