import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatAsNaira } from "../utils/formatcurrency";
import { formatDateTime } from "../utils/date";
import Pagination from "../components/Tables/Pagination";
// Import the correct types from the legalDashboardSlice
import {
  User,
  Property,
  Contract as LegalContract,
} from "../components/Redux/legalDashboard/legalDashboardSlice";

// Update the interface to match the data from the thunk (ContractItem)
export interface Contract {
  id: number;
  // This property is named 'unique_contract_id' in the API data, not 'contract_id'
  unique_contract_id: string | null;
  user_id: any;
  property_id: any;
  property: Property;
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
  user: User;
  contract: LegalContract; // This is the nested contract object
}

interface ContractsTableProps {
  data: any[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  getStatusText: (status: number) => string;
}

export default function ContractsTableComponentTwo({
  data,
  pagination,
  onPageChange,
  getStatusText,
}: ContractsTableProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // FIXED: Pass entire contract to get user_id and id properly
  const handleRowClick = (contract: Contract) => {
    navigate(`/legal/contracts/details/${contract.user_id}/${contract.id}`);
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                {[
                  "Property Name",
                  "Customer Name",
                  "Amount",
                  "Amount Paid",
                  "Marketer",
                  "Date",
                  "Time",
                ].map((heading, idx) => (
                  <th
                    key={idx}
                    className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((contract) => {
                const { date, time } = formatDateTime(contract.created_at);
                const customerName = contract.user
                  ? `${contract.user.first_name} ${contract.user.last_name}`
                  : "N/A";
                const marketerName = contract.marketer
                  ? `${contract.marketer.first_name} ${contract.marketer.last_name}`
                  : "N/A";

                return (
                  <tr
                    key={contract.id}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    {/* Property Name */}
                    <td
                      className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[150px] truncate pr-4 relative group"
                      onClick={() => handleRowClick(contract)}
                    >
                      <div className="truncate">
                        {contract.property?.name || "N/A"}
                      </div>
                      {contract.property?.name && (
                        <HoverTooltip
                          label="Property"
                          value={contract.property.name}
                        />
                      )}
                    </td>

                    {/* Customer Name */}
                    <td
                      className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[120px] truncate pr-4 relative group"
                      onClick={() => handleRowClick(contract)}
                    >
                      <div className="truncate">{customerName}</div>
                      {contract.user && (
                        <HoverTooltip label="Customer" value={customerName} />
                      )}
                    </td>

                    {/* Total Amount */}
                    <td
                      className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[120px] truncate pr-4 relative group"
                      onClick={() => handleRowClick(contract)}
                    >
                      <div className="truncate">
                        {formatAsNaira(contract.total_amount)}
                      </div>
                      <HoverTooltip
                        label="Total Amount"
                        value={formatAsNaira(contract.total_amount)}
                      />
                    </td>

                    {/* Paid Amount */}
                    <td
                      className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[120px] truncate pr-4 relative group"
                      onClick={() => handleRowClick(contract)}
                    >
                      <div className="truncate">
                        {formatAsNaira(contract.paid_amount)}
                      </div>
                      <HoverTooltip
                        label="Amount Paid"
                        value={formatAsNaira(contract.paid_amount)}
                      />
                    </td>

                    {/* Marketer */}
                    <td
                      className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[150px] truncate pr-4 relative group"
                      onClick={() => handleRowClick(contract)}
                    >
                      <div className="truncate">{marketerName}</div>
                      {contract.marketer && (
                        <HoverTooltip label="Marketer" value={marketerName} />
                      )}
                    </td>

                    {/* Date */}
                    <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[120px] truncate pr-4">
                      {date}
                    </td>

                    {/* Time */}
                    <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[120px] truncate pr-4">
                      {time}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={onPageChange}
        className="mt-8 mb-4"
      />
    </>
  );
}

// Tooltip component
const HoverTooltip = ({ label, value }: { label: string; value: string }) => (
  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 min-w-max">
    <div className="font-medium">{label}</div>
    <div className="border-t border-gray-600 my-1"></div>
    <div>{value}</div>
  </div>
);
