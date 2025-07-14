import React from "react";
import { formatAsNaira } from "../../utils/formatcurrency";
import { formatDate } from "../../utils/formatdate";
import { getPropertyType } from "../Properties/PropertyModal";

interface ContractDetailsModalProps {
  contract: {
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
  };
  onClose: () => void;
  getStatusText: (status: number) => string;
}

const ContractDetailsModal: React.FC<ContractDetailsModalProps> = ({ 
  contract, 
  onClose,
  getStatusText
}) => {
  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-[30px] sm:rounded-[30px] md:rounded-[30px] w-full max-w-[95vw] mx-2 xs:mx-0 xs:max-w-xs sm:max-w-md md:max-w-4xl my-1 p-3 sm:p-4 md:p-6 z-50 flex flex-col max-h-[90vh]">
        {/* Header section - Fixed */}
        <div className="flex justify-between items-center mb-2 sm:mb-3 flex-shrink-0">
    <h2 className="text-2xl font-bold">Contract Details</h2>
    <button 
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  {/* Scrollable Body */}
  <div className="p-6 overflow-y-auto flex-1">
      

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6  ">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
              <DetailRow label="Contract ID" value={contract.contract_id} />
              <DetailRow label="Property Name" value={contract.property.name} />
              <DetailRow label="Property Type" value={getPropertyType(contract.property.type)} />
              <DetailRow label="Property Size" value={contract.property.size} />
              <DetailRow label="Location" value={`${contract.property.lga}, ${contract.property.state}`} />
              <DetailRow label="Status" value={getStatusText(contract.status)} />
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Financial Information</h3>
              <DetailRow label="Total Amount" value={formatAsNaira(contract.total_amount)} />
              <DetailRow label="Amount Paid" value={formatAsNaira(contract.paid_amount)} />
              <DetailRow label="Remaining Balance" value={formatAsNaira(contract.remaining_balance)} />
              <DetailRow label="Payment Percentage" value={`${contract.payment_percentage}%`} />
              <DetailRow label="Infrastructure Amount" value={formatAsNaira(contract.infrastructure_amount)} />
              <DetailRow label="Other Amount" value={formatAsNaira(contract.other_amount)} />
            </div>

            {/* Payment Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Payment Schedule</h3>
              <DetailRow label="Payment Type" value={contract.payment_type} />
              <DetailRow label="Monthly Duration" value={contract.monthly_duration} />
              <DetailRow label="Repayment Schedule" value={contract.repayment_schedule} />
              <DetailRow label="Start Date" value={contract.start_date ? formatDate(contract.start_date) : "N/A"} />
              <DetailRow label="End Date" value={contract.end_date ? formatDate(contract.end_date) : "N/A"} />
              <DetailRow label="Next Payment Date" value={contract.next_payment_date ? formatDate(contract.next_payment_date) : "N/A"} />
            </div>

            {/* Other Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Other Information</h3>
              <DetailRow 
                label="Marketer" 
                value={contract.marketer 
                  ? `${contract.marketer.first_name} ${contract.marketer.last_name}`
                  : "N/A"} 
              />
              <DetailRow label="Date Created" value={formatDate(contract.created_at)} />
              <DetailRow label="Last Updated" value={formatDate(contract.updated_at)} />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#272727] text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent detail rows
const DetailRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

// // Helper function to get property type text
// const getPropertyType = (type: number) => {
//   switch (type) {
//     case 1: return "Residential";
//     case 2: return "Commercial";
//     case 3: return "Land";
//     default: return "Unknown";
//   }
// };

export default ContractDetailsModal;