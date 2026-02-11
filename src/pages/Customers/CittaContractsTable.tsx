// CittaContractsTable.tsx
import React, { useState } from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import Pagination from "../../components/Tables/Pagination";
import { formatDate } from "../../utils/formatdate";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCustomerById } from "../../components/Redux/customers/customerByid";


// Import the columns we created earlier


interface CittaContractsTableProps {
  customerId: number;
}

export default function CittaContractsTable({
  customerId,
}: CittaContractsTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  // Select data from Redux
  const contracts = useSelector(
    (state: RootState) => state.customerById.data?.citta_contract.data || [],
  );

  const pagination = useSelector(
    (state: RootState) => state.customerById.cittaContractPagination,
  );

  const loading = useSelector(
    (state: RootState) =>
      state.customerById.cittaContractLoading || state.customerById.loading,
  );

  // State for actions (delete, export, etc.)
  const [selectedContract, setSelectedContract] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Handle page change
  const handlePageChange = async (page: number) => {
    // Dispatch to update pagination and fetch new data
    await dispatch(
      fetchCustomerById({
        customerId,
        cittaContractPage: page,
      }),
    );
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Get balance status class
  const getBalanceClass = (balance: string) => {
    const numBalance = parseFloat(balance);
    if (numBalance < 0) return "text-green-600";
    if (numBalance > 0) return "text-red-600";
    return "text-gray-600";
  };

  // Format balance with sign
  const formatBalance = (balance: string) => {
    const numBalance = parseFloat(balance);
    const sign = numBalance < 0 ? "+" : numBalance > 0 ? "-" : "";
    return `${sign}${formatCurrency(Math.abs(numBalance).toString())}`;
  };

  // Handle row click
  const handleRowClick = (contractId: string) => {
    // Navigate to contract details or open modal
    // You can adjust this based on your routing
    console.log("View contract:", contractId);
  };

  // Handle export contract
  const handleExport = async (contractId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(true);
    try {
      // Implement export logic here
      console.log("Export contract:", contractId);
      // You might want to open a modal or download a PDF
    } finally {
      setActionLoading(false);
    }
  };

  // If loading
  if (loading && contracts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no contracts
  if (contracts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
          </svg>
        </div>
        <h3 className="text-gray-600 font-medium mb-1">No Contracts Found</h3>
        <p className="text-gray-400 text-sm">
          This customer doesn't have any citta contracts yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1200px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Contract Details
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Customer
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Total Price
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Net Value
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Balance
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Tenor (Months)
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Status
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Last Payment Date
                </th>
               
              </tr>
            </thead>

            <tbody>
              {contracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => handleRowClick(contract.contractId)}
                >
                  {/* CONTRACT DETAILS */}
                  <td className="pb-[31px] text-dark text-sm truncate whitespace-nowrap pr-4">
                    <div className="min-w-0">
                      <div className="font-medium text-dark truncate max-w-xs">
                        {contract.propertyName}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs mt-1">
                        {contract.propertyEstate}
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-xs mt-1">
                        ID: {contract.contractId}
                      </div>
                    </div>
                  </td>

                  {/* CUSTOMER */}
                  <td className="pb-[31px] text-dark text-sm whitespace-nowrap pr-4">
                    <div className="min-w-0">
                      <div className="font-medium truncate max-w-32">
                        {contract.customerName}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-32">
                        {contract.customerCode}
                      </div>
                    </div>
                  </td>

                  {/* TOTAL PRICE */}
                  <td className="pb-[31px] text-dark text-sm whitespace-nowrap pr-4">
                    {formatCurrency(contract.propertyCost)}
                  </td>

                  {/* NET VALUE */}
                  <td className="pb-[31px] text-dark text-sm whitespace-nowrap pr-4">
                    {formatCurrency(contract.propertyNetValue)}
                  </td>

                  {/* BALANCE */}
                  <td
                    className={`pb-[31px] text-sm whitespace-nowrap pr-4 ${getBalanceClass(contract.currentbalance)}`}
                  >
                    {formatBalance(contract.currentbalance)}
                  </td>

                  {/* TENOR */}
                  <td className="pb-[31px] text-dark text-sm whitespace-nowrap pr-4">
                    {contract.propertyTenor}
                  </td>

                  {/* STATUS */}
                  <td className="pb-[31px] text-sm whitespace-nowrap pr-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contract.fullPayment === "Y"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {contract.fullPayment === "Y"
                        ? "Full Payment"
                        : "Installment"}
                    </span>
                  </td>

                  {/* LAST PAYMENT DATE */}
                  <td className="pb-[31px] text-dark text-sm whitespace-nowrap pr-4">
                    {formatDate(contract.lastPaymentDate)}
                  </td>

                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="w-full mt-8">
          <Pagination
            pagination={{
              currentPage: pagination.currentPage,
              perPage: pagination.perPage,
              totalItems: pagination.totalItems,
              totalPages: pagination.totalPages,
            }}
            onPageChange={handlePageChange}
            className="mt-8 mb-4"
          />
        </div>
      )}

      {/* Loading overlay for table */}
      {loading && contracts.length > 0 && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </>
  );
}
