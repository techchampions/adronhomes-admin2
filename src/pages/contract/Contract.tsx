import React, { useEffect } from "react";
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
  setCurrentPage 
} from "../../components/Redux/Contract/contracts_slice";
import { fetchContracts } from "../../components/Redux/Contract/contracts_thunk";

export default function Contract() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchContracts({ page: 1 }));
  }, [dispatch]);

  // Selectors for summary data
  const totalContracts = useSelector(selectTotalContracts);
  const totalInvoice = useSelector(selectTotalInvoice);
  const totalPaidContract = useSelector(selectTotalPaidContract);
  const totalUnpaidContract = useSelector(selectTotalUnpaidContract);

  // Selectors for contract list and pagination
  const contractList = useSelector(selectContractList);
  const contractPagination = useSelector(selectContractPagination);

  const loading = useSelector((state: RootState) => state.getcontracts.loading);
  const error = useSelector((state: RootState) => state.getcontracts.error);

  const handlePageChange = async (page: number) => {
    await dispatch(setCurrentPage(page)); 
    await dispatch(fetchContracts({ page })); 
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return "Inactive";
      case 1: return "Active";
      case 2: return "Completed";
      case 3: return "Pending";
      default: return "Unknown";
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
          value={totalInvoice !== null ? formatAsNaira(totalInvoice) : formatAsNaira(0)}
          change="includes all contracts on a property plan"
        />
        <MatrixCard
          title="Total Amount Paid"
          value={totalPaidContract !== null ? formatAsNaira(totalPaidContract) : formatAsNaira(0)}
          change="Includes all paid contract amounts"
        />
        <MatrixCard
          title="Total Amount Unpaid"
          value={totalUnpaidContract !== null ? formatAsNaira(totalUnpaidContract) : formatAsNaira(0)}
          change="Includes all unpaid contract amounts"
        />
      </div>
      {loading && (!contractList || contractList.length === 0) ? ( 
        <div className="absolute top-96 left-1/2 -translate-x-1/2">
          <LoadingAnimations loading={loading} />
        </div>
      ) : (
        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <ReusableTable
            tabs={[]}
            searchPlaceholder={"Search by contract Id or email"}
            activeTab={""}
            showTabs={false}
          >
            <ContractsTableComponent
              data={contractList || []}
              pagination={contractPagination}
              onPageChange={handlePageChange}
              getStatusText={getStatusText}
            />
          </ReusableTable>
        </div>
      )}
    </div>
  );
}