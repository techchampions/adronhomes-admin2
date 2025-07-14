import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Tables/Pagination";
import { formatAsNaira } from "../../utils/formatcurrency";
import ContractDetailsModal from "./ContractDetailsModal";

interface Contract {
  id: number;
  contract_id: string;
  property: {
    name: string;
    type: number;
    price: number;
    size: string;
    lga: string;
    state: string;
  };
  status: number;
  marketer: {
    first_name: string;
    last_name: string;
  } | null;
  total_amount: number;
  paid_amount: number;
  remaining_balance: number;
  payment_percentage: number;
  created_at: string;
  updated_at: string;
  monthly_duration: string;
  payment_type: string;
  start_date: string | null;
  end_date: string | null;
  repayment_schedule: string;
  next_payment_date: string | null;
  infrastructure_percentage: number;
  infrastructure_amount: number;
  other_percentage: number;
  other_amount: number;
}

interface ContractsTableProps {
  data: Contract[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  getStatusText: (status: number) => string;
}

export default function ContractsTableComponent({ 
  data, 
  pagination, 
  onPageChange,
  getStatusText
}: ContractsTableProps) {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1000px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap">
                  Contract ID
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap">
                  Property Name
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap">
                  Total Amount
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap">
                  Amount Paid
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap">
                  Status
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap">
                  Marketer
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((contract) => (
                <tr
                  key={contract.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[180px] truncate whitespace-nowrap pr-4">
                    {contract.contract_id || "N/A"}
                  </td>
                  <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[150px] truncate whitespace-nowrap pr-4">
                    {contract.property?.name || "N/A"}
                  </td>
                  <td className="pb-[31px] font-gotham font-[325] text-dark text-sm whitespace-nowrap pr-4">
                    {formatAsNaira(contract.total_amount)}
                  </td>
                  <td className="pb-[31px] font-gotham font-[325] text-dark text-sm whitespace-nowrap pr-4">
                    {formatAsNaira(contract.paid_amount)}
                  </td>
                  <td className="pb-[31px] font-gotham font-[325] text-dark text-sm whitespace-nowrap pr-4">
                    {getStatusText(contract.status)}
                  </td>
                  <td className="pb-[31px] font-gotham font-[325] text-dark text-sm whitespace-nowrap pr-4">
                    {contract.marketer 
                      ? `${contract.marketer.first_name} ${contract.marketer.last_name}`
                      : "N/A"}
                  </td>
                  <td className="pb-[31px] font-gotham font-[325] text-dark text-sm whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(contract)}
                      className="bg-[#272727] cursor-pointer text-white px-4 py-2 rounded-full xl:text-sm text-sm font-[350] hover:bg-gray-800 transition-colors whitespace-nowrap"
                      aria-label="View contract"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
         <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          className="mt-8 mb-4"
        />

      {/* <div className="w-full">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          className="mt-8 mb-4"
        />
      </div> */}

      {isModalOpen && selectedContract && (
        <ContractDetailsModal
          contract={selectedContract}
          onClose={closeModal}
          getStatusText={getStatusText}
        />
      )}
    </>
  );
}