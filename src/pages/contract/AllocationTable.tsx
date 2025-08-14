import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../components/Tables/Pagination";
import { formatAsNaira } from "../../utils/formatcurrency";
import { User } from "../../components/Redux/Contract/contracts_thunk";
import ContractInputModal from "./ContractInputModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import {
  updateContract,
  UpdateContractPayload,
} from "../../components/Redux/UpdateContract/UpdateContract";
import { FaEdit } from "react-icons/fa"; // Import the edit icon
import { RiPencilFill } from "react-icons/ri";

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

export default function AllocationTable({
  data,
  pagination,
  onPageChange,
  getStatusText,
}: ContractsTableProps) {
  const navigation = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading: updateContractLoading } = useSelector(
    (state: RootState) => state.contract
  );
   const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [selectedContractForInput, setSelectedContractForInput] =
    useState<Contract | null>(null);

  const handleSubmit = async (values: {
    customerCode: any;
    contractId: any;
  }) => {
    console.log("Submitted values from modal:", values);

    if (selectedContractForInput) {
      const contractIdToUpdate = selectedContractForInput?.contract_id;

      const updateData: UpdateContractPayload = {
        unique_contract_id: values.contractId,
        contract_customer_id: values.customerCode,
      };

      try {
        await dispatch(
          updateContract({ contractId: contractIdToUpdate, data: updateData })
        ).unwrap();
      } catch (error) {
        console.error("Failed to update contract:", error);
      }
    } else {
      console.warn("No contract selected for inputting code.");
    }

    setShowModal(false);
    setSelectedContractForInput(null);
  };

  const handleInputCodeClick = (contract: Contract) => {
    setSelectedContractForInput(contract);
    setShowModal(true);
  };

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
                {/* New S/N column header */}
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap max-w-[50px]">
                  S/N
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap max-w-[150px]">
                  Property Name
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap max-w-[120px]">
                  Customer Name
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap max-w-[120px]">
                  Amount
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap max-w-[120px]">
                  Amount Paid
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[40px] whitespace-nowrap max-w-[150px]">
                  Marketer
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] whitespace-nowrap max-w-[200px] text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((contract, index) => ( // Add index to map function
                <tr
                  key={contract.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {/* S/N column data */}
                  <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[50px] truncate pr-4">
                    {(pagination.currentPage - 1) * pagination.perPage + index + 1}
                  </td>
                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[150px] truncate pr-4 relative group"
                          onClick={() => {
                      const basePath = location.pathname.startsWith(
                        "/payments/contracts"
                      )
                        ? "/payments/customers"
                        : "/customers";
                      navigation(`${basePath}/${contract.user.id}`);
                    }}
                    
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

                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[120px] truncate pr-4 relative group"
                          onClick={() => {
                      const basePath = location.pathname.startsWith(
                        "/payments/contracts"
                      )
                        ? "/payments/customers"
                        : "/customers";
                      navigation(`${basePath}/${contract.user.id}`);
                    }}
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

                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[120px] truncate pr-4 relative group"
                          onClick={() => {
                      const basePath = location.pathname.startsWith(
                        "/payments/contracts"
                      )
                        ? "/payments/customers"
                        : "/customers";
                      navigation(`${basePath}/${contract.user.id}`);
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

                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[120px] truncate pr-4 relative group"
                          onClick={() => {
                      const basePath = location.pathname.startsWith(
                        "/payments/contracts"
                      )
                        ? "/payments/customers"
                        : "/customers";
                      navigation(`${basePath}/${contract.user.id}`);
                    }}
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

                  <td
                    className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[150px] truncate pr-4 relative group"
                          onClick={() => {
                      const basePath = location.pathname.startsWith(
                        "/payments/contracts"
                      )
                        ? "/payments/customers"
                        : "/customers";
                      navigation(`${basePath}/${contract.user.id}`);
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

                  <td className="pb-[31px] font-gotham font-[325] text-dark text-sm max-w-[200px] overflow-x-auto truncate relative group text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => {
                          const basePath = location.pathname.startsWith(
                            "/payments/contracts"
                          )
                            ? "/payments/contracts/details"
                            : "/contracts/details";
                          navigation(
                            `${basePath}/${contract.user_id}/${contract.id}`
                          );
                        }}
                        className="bg-[#272727] cursor-pointer text-white px-2 py-2 rounded-full xl:text-xs text-xs font-[350] hover:bg-gray-800 transition-colors whitespace-nowrap"
                        aria-label="View contract details"
                      >
                        View Details
                      </button>

                 <button
                          aria-label="Edit property"
                        //   onClick={() => handleEditClick(property)} .
                        >
                          <img
                            src="/ic_round-edit.svg"
                            className="w-[18px] h-[18px]"
                          />
                        </button>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 min-w-max">
                      Manage contract actions
                    </div>
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