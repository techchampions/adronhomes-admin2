import React, { useEffect, useState, useCallback } from "react";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import LoadingAnimations from "../../components/LoadingAnimations";
import ContractsTableComponent from "./ContractTable";
import { formatAsNaira } from "../../utils/formatcurrency";
import {
  selectContractList,
  selectContractPagination,
  selectTotalContracts,
  selectTotalInvoice,
  selectTotalPaidContract,
  selectTotalUnpaidContract,
  setCurrentPage,
  setStatusFilter,
  setSearchFilter,
  setContractFilter,
} from "../../components/Redux/Contract/contracts_slice";
import { fetchContracts } from "../../components/Redux/Contract/contracts_thunk";
import NotFound from "../../components/NotFound";
import ContractsTableComponenTwo from "./contractTableTwo";
import { getContract } from "../../components/Redux/UpdateContract/viewcontractFormDetails";
import NewContractsTable from "./activeContractTable";
import { useAppSelector } from "../../components/Redux/hook";
import AllocationTable from "./AllocationTable";

export default function Contract() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("New");
  const [searchQuery, setSearchQuery] = useState("");

  const totalContracts = useSelector(selectTotalContracts);
  const totalInvoice = useSelector(selectTotalInvoice);
  const totalPaidContract = useSelector(selectTotalPaidContract);
  const totalUnpaidContract = useSelector(selectTotalUnpaidContract);
  const contractList = useSelector(selectContractList);
  const contractPagination = useSelector(selectContractPagination);
  const loading = useSelector((state: RootState) => state.getcontracts.loading);
  const error = useSelector((state: RootState) => state.getcontracts.error);


  const getContractFilters = useCallback((tab: string) => {
    switch (tab) {
      case "New":
        return { contract: 0, status: 5 }; 
      case "Active":
        return { contract: 1, status: 1 }; 
      case "Completed":
        return { contract: 1, status: 2 }; 
      case "Allocated":
        return { contract: 1, status: 3 }; 
      default:
        return { contract: 1, status: 1 }; 
    }
  }, []);

  useEffect(() => {
    const filters = getContractFilters(activeTab);
    dispatch(setContractFilter(filters.contract));
    dispatch(setStatusFilter(filters.status));
    dispatch(fetchContracts({ 
      page: 1, 
      contract: filters.contract, 
      status: filters.status, 
      search: searchQuery 
    }));
  }, [dispatch, activeTab, getContractFilters, searchQuery]);

  const handlePageChange = async (page: number) => {
    const filters = getContractFilters(activeTab);
    await dispatch(setCurrentPage(page));
    await dispatch(fetchContracts({ 
      page, 
      contract: filters.contract, 
      status: filters.status, 
      search: searchQuery 
    }));
  };

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const filters = getContractFilters(activeTab);
      dispatch(setSearchFilter(query));
      dispatch(fetchContracts({ 
        page: 1, 
        contract: filters.contract, 
        status: filters.status, 
        search: query 
      }));
    },
    [dispatch, activeTab, getContractFilters]
  );

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Active";
      case 2:
        return "Completed";
      case 3:
        return "Allocated";
      default:
        return "Unknown";
    }
  };

  if (error) {
    return (
      <div className="text-red-500 text-center py-10">
        Error: {error}. Please try again.
      </div>
    );
  }

  return (
    <div className="pb-[52px] relative">
      <Header
        title="Contracts"
        subtitle="Manage the list of contracts for each property bought by user"
        showSearchAndButton={false}
     
      />
      <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          title="Total Contracts"
          value={totalContracts !== null ? totalContracts : 0}
        />
        <MatrixCard
          title="Total Invoice"
          value={
            totalInvoice !== null
              ? formatAsNaira(totalInvoice)
              : formatAsNaira(0)
          }
          change="includes all contracts on a property plan"
        />
        <MatrixCard
          title="Total Amount Paid"
          value={
            totalPaidContract !== null
              ? formatAsNaira(totalPaidContract)
              : formatAsNaira(0)
          }
          change="Includes all paid contract amounts"
        />
        <MatrixCard
          title="Total Amount Unpaid"
          value={
            totalUnpaidContract !== null
              ? formatAsNaira(totalUnpaidContract)
              : formatAsNaira(0)
          }
          change="Includes all unpaid contract amounts"
        />
      </div>

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
      <ReusableTable
  activeTab={activeTab}
  onTabChange={setActiveTab}
  tabs={["New", "Active", "Completed", "Allocated"]}
  searchPlaceholder={"Search by contract ID or email"}
  showTabs={true}
  onSearch={handleSearch}
>
  {loading ? (
    <div className="w-full flex items-center justify-center">
      <LoadingAnimations loading={loading} />
    </div>
  ) : !loading && (!contractList || contractList.length === 0) ? (
    <div className="max-h-screen">
      <p className="text-center font-normal text-[#767676]">No data found</p>
      <NotFound />
    </div>
  ) : activeTab === "New" ? (
    <ContractsTableComponent
                  data={contractList || []}
                  pagination={contractPagination}
                  onPageChange={handlePageChange}
                  getStatusText={getStatusText} page={1} statuss={5} contract={0}    />
  ) : activeTab === "Active" ? (
    <NewContractsTable
      data={contractList || []}
      pagination={contractPagination}
      onPageChange={handlePageChange}
      getStatusText={getStatusText}
    />
  ) :  activeTab === "Completed" ? (
    <NewContractsTable
      data={contractList || []}
      pagination={contractPagination}
      onPageChange={handlePageChange}
      getStatusText={getStatusText}
    />
  ):  activeTab === "Allocated" ? (
    <AllocationTable
      data={contractList || []}
      pagination={contractPagination}
      onPageChange={handlePageChange}
      getStatusText={getStatusText}
    />
  ) : (
    <ContractsTableComponenTwo
      data={contractList || []}
      pagination={contractPagination}
      onPageChange={handlePageChange}
      getStatusText={getStatusText}
    />
    
  )}
</ReusableTable>

      </div>
     
    </div>
  );
}