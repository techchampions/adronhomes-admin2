import React, { useState } from "react";
import NewContractsTable from "../pages/contract/activeContractTable";
import { ReusableTable } from "../components/Tables/Table_one";
import LoadingAnimations from "../components/LoadingAnimations";
import { MatrixCard, MatrixCardGreen } from "../components/firstcard";
import Header from "../general/Header";
import NotFound from "../components/NotFound";

export default function Page() {
  const [loading] = useState(false);

  // Demo metrics
  const totalContracts = 12;
  const totalInvoice = 2500000;
  const totalPaidContract = 1500000;
  const totalUnpaidContract = 1000000;

  // Demo contracts
  const contractList = [
    { id: "C-001", email: "user1@example.com", status: "New" },
    { id: "C-002", email: "user2@example.com", status: "Active" },
    { id: "C-003", email: "user3@example.com", status: "Completed" },
    { id: "C-004", email: "user4@example.com", status: "Allocated" },
  ];

  const contractPagination = { currentPage: 1, totalPages: 2 };

  const formatAsNaira = (value:any) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);

  const handlePageChange = (page:any) => {
    console.log("Change to page:", page);
  };

  const handleSearch = (query:any) => {
    console.log("Searching for:", query);
  };

  return (
    <div className="pb-[52px] relative">
      <Header
        title="Contracts"
        subtitle="Manage the list of contracts for each property bought by user"
        buttonText="export"
      />

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen title="Total Contracts" value={totalContracts} />

        <MatrixCard
          title="Total Invoice"
          value={formatAsNaira(totalInvoice)}
          change="Includes all contracts on a property plan"
        />

        <MatrixCard
          title="Total Amount Paid"
          value={formatAsNaira(totalPaidContract)}
          change="Includes all paid contract amounts"
        />

        <MatrixCard
          title="Total Amount Unpaid"
          value={formatAsNaira(totalUnpaidContract)}
          change="Includes all unpaid contract amounts"
        />
      </div>

      {/* Completed Contracts Table */}
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
                  searchPlaceholder={"Search by contract ID or email"}
                  showTabs={false} // 👈 hide tabs
                  onSearch={handleSearch} activeTab={"Completed"}        >
          {loading ? (
            <div className="w-full flex items-center justify-center">
              <LoadingAnimations loading={loading} />
            </div>
          ) : contractList.filter((c) => c.status === "Completed").length ===
            0 ? (
            <div className="max-h-screen">
              <p className="text-center font-normal text-[#767676]">
                No completed contracts found
              </p>
              <NotFound />
            </div>
          ) : (
            <></>
            // <NewContractsTable
            // //   data={contractList.filter((c) => c.status === "Completed")}
            // //   pagination={contractPagination}
            // //   onPageChange={handlePageChange}
            // />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}
