import React from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Tables/Pagination";
import { formatAsNaira } from "../../utils/formatcurrency";
import { User } from "../../components/Redux/Contract/contracts_thunk";

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
  user: User;
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

export default function ContractsTableComponenTwo({
  data,
  pagination,
  onPageChange,
  getStatusText, 
}: ContractsTableProps) {
  const navigation = useNavigate();

 
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
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1000px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                {/* Property Name */}
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap max-w-[150px]">
                  Property Name
                </th>
                {/* Customer Name */}
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap max-w-[120px]">
                  Customer Name
                </th>
                {/* Amount (corresponds to Total Amount) */}
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap max-w-[120px]">
                  Amount
                </th>
                {/* Amount Paid */}
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap max-w-[120px]">
                  Amount Paid
                </th>
                {/* Marketer */}
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap max-w-[150px]">
                  Marketer
                </th>
               
              </tr>
            </thead>
            <tbody>
              {data.map((contract) => (
                <tr
                  key={contract.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
          
                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[150px] truncate pr-4 relative group"
                    onClick={() => navigation(`/customers/${contract.user.id}`)}
                  >
                    <div className="truncate">
                      {contract.property?.name || "N/A"}
                    </div>
                    {contract.property?.name && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 min-w-max">
                        <div className="font-medium">Property</div>
                        <div className="border-t border-gray-600 my-1"></div>
                        <div>{contract.property.name}</div>
                      </div>
                    )}
                  </td>

                  {/* Customer Name */}
                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[120px] truncate pr-4 relative group"
                    onClick={() => navigation(`/customers/${contract.user.id}`)}
                  >
                    <div className="truncate">
                      {contract.user
                        ? `${contract.user.first_name} ${contract.user.last_name}`
                        : "N/A"}
                    </div>
                    {contract.user && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 min-w-max">
                        <div className="font-medium">Customer</div>
                        <div className="border-t border-gray-600 my-1"></div>
                        <div>{`${contract.user.first_name} ${contract.user.last_name}`}</div>
                      </div>
                    )}
                  </td>

                  {/* Amount (Total Amount) */}
                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[120px] truncate pr-4 relative group"
                    onClick={() => navigation(`/customers/${contract.user.id}`)}
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

                  {/* Amount Paid */}
                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[120px] truncate pr-4 relative group"
                    onClick={() => navigation(`/customers/${contract.user.id}`)}
                  >
                    <div className="truncate">
                      {formatAsNaira(contract.paid_amount)}
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 min-w-max">
                      <div className="font-medium">Amount Paid</div>
                      <div className="border-t border-gray-600 my-1"></div>
                      <div>{formatAsNaira(contract.paid_amount)}</div>
                    </div>
                  </td>

                  {/* Marketer */}
                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[150px] truncate pr-4 relative group"
                    onClick={() => navigation(`/customers/${contract.user.id}`)}
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
    </>
  );
}