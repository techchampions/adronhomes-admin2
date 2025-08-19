import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../components/Tables/Pagination";
import { formatAsNaira } from "../../utils/formatcurrency";
import { formatDateTime } from "../../utils/date";
import { singleContract } from "../../components/Redux/Contract/contracts_thunk";

export interface Contract {
  id: number;
  contract_id: string | null;
  user_id: any;
  property_id: any;
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
  user: {
    id: any;
    first_name: string;
    last_name: string;
    unique_customer_id: any;
  };
  contract: singleContract;
}

interface NewContractsTableProps {
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

export default function NewContractsTable({
  data,
  pagination,
  onPageChange,
  getStatusText,
}: NewContractsTableProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getStatusBadgeClass = (status: number) => {
    switch (status) {
      case 1: // Active
        return "text-[#2E9B2E]";
      case 2: // Completed
        return "text-blue-800";
      case 3: // Pending
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="max-w-[800px] md:min-w-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="">
              <th className="pb-[23px] pr-4 whitespace-nowrap text-left text-[#757575] text-[12px] font-gotham font-[325] max-w-[50px]">
                S/N
              </th>
              <th className="pb-[23px] pr-4 whitespace-nowrap text-left text-[#757575] text-[12px] font-gotham font-[325] max-w-[150px]">
                Contract ID
              </th>
              <th className="pb-[23px] pr-4 whitespace-nowrap text-left text-[#757575] text-[12px] font-gotham font-[325] max-w-[150px]">
                Property Name
              </th>
              <th className="pb-[23px] pr-4 whitespace-nowrap text-left text-[#757575] text-[12px] font-gotham font-[325] max-w-[120px]">
                Customer Name
              </th>
              <th className="pb-[23px] pr-4 whitespace-nowrap text-left text-[#757575] text-[12px] font-gotham font-[325] max-w-[120px]">
                Total Amount
              </th>
              <th className="pb-[23px] pr-4 whitespace-nowrap text-left text-[#757575] text-[12px] font-gotham font-[325] max-w-[100px]">
                Status
              </th>
              <th className="pb-[23px] pr-4 whitespace-nowrap text-left text-[#757575] text-[12px] font-gotham font-[325] max-w-[150px]">
                Marketer
              </th>
              <th className="pb-[23px] pr-4 whitespace-nowrap text-left text-[#757575] text-[12px] font-gotham font-[325] max-w-[120px]">
                Date
              </th>
              <th className="pb-[23px] pr-4 whitespace-nowrap text-left text-[#757575] text-[12px] font-gotham font-[325] max-w-[120px]">
                Time
              </th>
              <th className="pb-[23px] pr-4 text-center whitespace-nowrap text-[#757575] text-[12px] font-gotham font-[325] max-w-[150px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">
                  No contracts to display.
                </td>
              </tr>
            ) : (
              data.map((contract, index) => {
                const { date, time } = formatDateTime(contract.created_at);
                return (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-4 pr-4 font-gotham font-[325] text-dark text-sm max-w-[50px] truncate">
                      {(pagination.currentPage - 1) * pagination.perPage +
                        index +
                        1}
                    </td>
                    <td className="py-4 pr-4 font-gotham font-[325] text-dark text-sm max-w-[150px] truncate relative group">
                      <div className="truncate">
                        {contract?.contract?.unique_contract_id || "N/A"}
                      </div>
                      {contract.contract_id && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 min-w-max">
                          <div className="font-medium">Contract ID</div>
                          <div className="border-t border-gray-600 my-1"></div>
                          <div>{contract?.contract?.unique_contract_id}</div>
                        </div>
                      )}
                    </td>
                    <td
                      className="py-4 pr-4 font-gotham font-[325] text-dark text-sm max-w-[150px] truncate relative group cursor-pointer"
                      onClick={() => {
                        const basePath = location.pathname.startsWith(
                          "/payments/contracts"
                        )
                          ? "/payments/customers"
                          : "/customers";
                        navigate(`${basePath}/${contract.user.id}`);
                      }}
                    >
                      <div className="truncate">
                        {contract.property?.name || "N/A"}
                      </div>
                      {contract.property?.name && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 min-w-max">
                          <div className="font-medium">Property Name</div>
                          <div className="border-t border-gray-600 my-1"></div>
                          <div>{contract.property.name}</div>
                        </div>
                      )}
                    </td>
                    <td
                      className="py-4 pr-4 font-gotham font-[325] text-dark text-sm max-w-[120px] truncate relative group cursor-pointer"
                      onClick={() => {
                        const basePath = location.pathname.startsWith(
                          "/payments/contracts"
                        )
                          ? "/payments/customers"
                          : "/customers";
                        navigate(`${basePath}/${contract.user.id}`);
                      }}
                    >
                      <div className="truncate">
                        {contract.user
                          ? `${contract.user.first_name} ${contract.user.last_name}`
                          : "N/A"}
                      </div>
                      {contract.user && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 min-w-max">
                          <div className="font-medium">Customer Name</div>
                          <div className="border-t border-gray-600 my-1"></div>
                          <div>{`${contract.user.first_name} ${contract.user.last_name}`}</div>
                        </div>
                      )}
                    </td>
                    <td
                      className="py-4 pr-4 font-gotham font-[325] text-dark text-sm max-w-[120px] truncate relative group cursor-pointer"
                      onClick={() => {
                        const basePath = location.pathname.startsWith(
                          "/payments/contracts"
                        )
                          ? "/payments/customers"
                          : "/customers";
                        navigate(`${basePath}/${contract.user.id}`);
                      }}
                    >
                      <div className="truncate">
                        {formatAsNaira(contract.total_amount)}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 min-w-max">
                        <div className="font-medium">Total Amount</div>
                        <div className="border-t border-gray-600 my-1"></div>
                        <div>{formatAsNaira(contract.total_amount)}</div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 font-gotham font-[325] text-sm max-w-[100px] whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-[325] ${getStatusBadgeClass(
                          contract.status
                        )}`}
                      >
                        {getStatusText(contract.status)}
                      </span>
                    </td>
                    <td
                      className="py-4 pr-4 font-gotham font-[325] text-dark text-sm max-w-[150px] truncate relative group cursor-pointer"
                      onClick={() => {
                        const basePath = location.pathname.startsWith(
                          "/payments/contracts"
                        )
                          ? "/payments/customers"
                          : "/customers";
                        navigate(`${basePath}/${contract.user.id}`);
                      }}
                    >
                      <div className="truncate">
                        {contract.marketer
                          ? `${contract.marketer.first_name} ${contract.marketer.last_name}`
                          : "N/A"}
                      </div>
                      {contract.marketer && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 min-w-max">
                          <div className="font-medium">Marketer</div>
                          <div className="border-t border-gray-600 my-1"></div>
                          <div>{`${contract.marketer.first_name} ${contract.marketer.last_name}`}</div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 pr-4 font-gotham font-[325] text-dark text-sm max-w-[120px] truncate">
                      {date}
                    </td>
                    <td className="py-4 pr-4 font-gotham font-[325] text-dark text-sm max-w-[120px] truncate">
                      {time}
                    </td>
                    <td className="py-4 pr-4 text-center max-w-[150px]">
                      <button
                        onClick={() => {
                          const basePath = location.pathname.startsWith(
                            "/payments/contracts"
                          )
                            ? "/payments/contracts/details"
                            : "/contracts/details";
                          navigate(
                            `${basePath}/${contract.user_id}/${contract.id}`
                          );
                        }}
                        className="bg-[#272727] cursor-pointer text-white px-4 py-2 rounded-full text-xs font-[350] hover:bg-gray-800 transition-colors whitespace-nowrap"
                        aria-label="View contract details"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        pagination={pagination}
        onPageChange={onPageChange}
        className="mt-8 mb-4"
      />
    </div>
  );
}