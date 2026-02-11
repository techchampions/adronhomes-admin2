// CittaContractModal.tsx
import React, { useState, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoCopyOutline } from "react-icons/io5";
import { FiShare2 } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import { formatAsNaira } from "../../utils/formatcurrency";
import { formatDate } from "../../utils/formatdate";

interface ContractData {
  id: number;
  customerName: string;
  customerCode: string;
  dateOfBirth: string;
  userId: number;
  propertyId: number | null;
  contractId: string;
  customerAddress: string;
  contractDate: string;
  propertyEstate: string;
  propertyName: string;
  customerTown: string;
  customerState: string;
  customerEmail: string;
  customerPhone: string;
  customerSMSPhone: string;
  customerTitle: string;
  customerGender: 'Male' | 'Female' | 'Other';
  customerMarital: 'Single' | 'Married' | 'Divorced' | 'Widowed' | string;
  fullPayment: 'Y' | 'N';
  fullPaymentDate: string | null;
  quantity: string;
  propertyCost: string;
  propertyDiscount: string;
  propertyNetValue: string;
  propertyTenor: number;
  firstPaymentDate: string;
  lastPaymentDate: string;
  propertyBranch: string;
  currentbalance: string;
  created_at: string;
  updated_at: string;
}

interface CittaContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractData?: ContractData;
}

const CittaContractModal: React.FC<CittaContractModalProps> = ({
  isOpen,
  onClose,
  contractData,
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleDownload = () => {
    if (!contractData) return;

    const contractText = `
      CITTA CONTRACT DETAILS
      ======================
      
      CONTRACT INFORMATION
      --------------------
      Contract ID: ${contractData.contractId}
      Contract Date: ${formatDate(contractData.contractDate)}
      Property Estate: ${contractData.propertyEstate}
      Property Name: ${contractData.propertyName}
      Branch: ${contractData.propertyBranch}
      
      CUSTOMER INFORMATION
      --------------------
      Customer Name: ${contractData.customerName}
      Customer Code: ${contractData.customerCode}
      Date of Birth: ${formatDate(contractData.dateOfBirth)}
      Gender: ${contractData.customerGender}
      Marital Status: ${contractData.customerMarital}
      Address: ${contractData.customerAddress}
      Town: ${contractData.customerTown}
      State: ${contractData.customerState}
      Email: ${contractData.customerEmail}
      Phone: ${contractData.customerPhone}
      SMS Phone: ${contractData.customerSMSPhone}
      
      FINANCIAL DETAILS
      -----------------
      Property Cost: ${formatAsNaira(parseFloat(contractData.propertyCost))}
      Property Discount: ${formatAsNaira(parseFloat(contractData.propertyDiscount))}
      Net Value: ${formatAsNaira(parseFloat(contractData.propertyNetValue))}
      Quantity: ${contractData.quantity}
      Current Balance: ${formatAsNaira(parseFloat(contractData.currentbalance))}
      
      PAYMENT TERMS
      -------------
      Payment Type: ${contractData.fullPayment === 'Y' ? 'Full Payment' : 'Installment'}
      Tenor: ${contractData.propertyTenor} months
      First Payment Date: ${formatDate(contractData.firstPaymentDate)}
      Last Payment Date: ${formatDate(contractData.lastPaymentDate)}
      Full Payment Date: ${contractData.fullPaymentDate ? formatDate(contractData.fullPaymentDate) : 'N/A'}
      
      SYSTEM INFORMATION
      ------------------
      Created: ${formatDate(contractData.created_at)}
      Last Updated: ${formatDate(contractData.updated_at)}
      User ID: ${contractData.userId}
      Property ID: ${contractData.propertyId || 'N/A'}
    `;

    const blob = new Blob([contractText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `contract_${contractData.contractId}_${formatDate(contractData.contractDate)}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!contractData) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Contract ${contractData.contractId}`,
          text: `Contract Details for ${contractData.customerName}`,
          url: window.location.href,
        });
      } else {
        handleCopy(window.location.href, 'link');
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getPaymentStatus = (fullPayment: string, balance: string) => {
    if (fullPayment === 'Y') return { status: "Paid", color: "#2ECE2E" };
    
    const numBalance = parseFloat(balance);
    if (numBalance < 0) return { status: "Credit", color: "#2ECE2E" };
    if (numBalance === 0) return { status: "Settled", color: "#2ECE2E" };
    return { status: "Balance Due", color: "#FFA500" };
  };

  if (!isOpen || !contractData) return null;

  const paymentStatus = getPaymentStatus(contractData.fullPayment, contractData.currentbalance);
  const balance = parseFloat(contractData.currentbalance);
  const isCredit = balance < 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(102,102,102,0.2)] p-2 sm:p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-2xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 relative animate-fadeIn flex flex-col h-[95vh]"
      >
        {/* Fixed Top Section (Header) */}
        <div className="w-full items-center justify-between flex mb-4 sm:mb-6 flex-shrink-0">
          <div>
            <p className="font-medium text-lg sm:text-xl md:text-2xl">Contract Details</p>
            <p className="text-sm text-gray-500 mt-1">{contractData.contractId}</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1 sm:p-2 rounded-full transition-colors"
          >
            <FaXmark size={14} />
          </button>
        </div>

        {/* Scrollable Middle Section (Data) */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {/* Contract Overview */}
          <div className="border-b border-b-gray-200 pb-3 sm:pb-4 w-full">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                {contractData.propertyName}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                contractData.fullPayment === 'Y' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {contractData.fullPayment === 'Y' ? 'Full Payment' : 'Installment'}
              </span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              {contractData.propertyEstate}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-medium text-gray-900 text-sm sm:text-base">
                {formatAsNaira(parseFloat(contractData.propertyNetValue))}
              </span>
              <span className="text-gray-600 text-xs sm:text-sm">
                Branch: {contractData.propertyBranch}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border-b border-b-gray-200 py-3 sm:py-4 w-full">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Customer Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Name</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {contractData.customerName}
                </h1>
              </div>
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Customer Code</p>
                <div className="flex items-center justify-between">
                  <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                    {contractData.customerCode}
                  </h1>
                  <button
                    onClick={() => handleCopy(contractData.customerCode, 'customerCode')}
                    className="ml-2 hover:bg-gray-100 p-1 rounded transition-colors"
                    title="Copy"
                  >
                    <IoCopyOutline size={14} className={copied === 'customerCode' ? 'text-green-600' : ''} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Date of Birth</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {formatDate(contractData.dateOfBirth)}
                </h1>
              </div>
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Gender / Marital</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {contractData.customerGender} / {contractData.customerMarital}
                </h1>
              </div>
            </div>

            <div className="mt-3">
              <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Address</p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                {contractData.customerAddress}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Contact Details</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h1 className="font-normal text-gray-900 text-xs sm:text-sm">
                      {contractData.customerPhone}
                    </h1>
                    <button
                      onClick={() => handleCopy(contractData.customerPhone, 'phone')}
                      className="ml-2 hover:bg-gray-100 p-1 rounded transition-colors"
                      title="Copy"
                    >
                      <IoCopyOutline size={12} className={copied === 'phone' ? 'text-green-600' : ''} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <h1 className="font-normal text-gray-900 text-xs sm:text-sm">
                      {contractData.customerEmail}
                    </h1>
                    <button
                      onClick={() => handleCopy(contractData.customerEmail, 'email')}
                      className="ml-2 hover:bg-gray-100 p-1 rounded transition-colors"
                      title="Copy"
                    >
                      <IoCopyOutline size={12} className={copied === 'email' ? 'text-green-600' : ''} />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Location</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {contractData.customerTown}, {contractData.customerState}
                </h1>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="border-b border-b-gray-200 py-3 sm:py-4 w-full">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Financial Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Property Cost</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {formatAsNaira(parseFloat(contractData.propertyCost))}
                </h1>
              </div>
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Discount</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base text-green-600">
                  {formatAsNaira(parseFloat(contractData.propertyDiscount))}
                </h1>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Net Value</p>
                <h1 className="font-normal text-gray-900 text-sm sm:text-base md:text-lg font-medium">
                  {formatAsNaira(parseFloat(contractData.propertyNetValue))}
                </h1>
              </div>
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Current Balance</p>
                <h1 className={`font-normal text-xs sm:text-sm md:text-base font-medium ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                  {isCredit ? '+' : ''}{formatAsNaira(Math.abs(balance))}
                </h1>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="border-b border-b-gray-200 py-3 sm:py-4 w-full">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Payment Terms</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Tenor</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {contractData.propertyTenor} months
                </h1>
              </div>
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Quantity</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {contractData.quantity}
                </h1>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">First Payment</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {formatDate(contractData.firstPaymentDate)}
                </h1>
              </div>
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Last Payment</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {formatDate(contractData.lastPaymentDate)}
                </h1>
              </div>
            </div>
            
            {contractData.fullPaymentDate && (
              <div className="mt-3">
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Full Payment Date</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {formatDate(contractData.fullPaymentDate)}
                </h1>
              </div>
            )}
          </div>

          {/* Status and Dates */}
          <div className="py-3 sm:py-4 w-full">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Payment Status</p>
                <div className="flex items-center">
                  <GoDotFill
                    color={paymentStatus.color}
                    className="mr-1"
                    size={14}
                  />
                  <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                    {paymentStatus.status}
                  </h1>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Contract Date</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {formatDate(contractData.contractDate)}
                </h1>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Created</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {formatDate(contractData.created_at)}
                </h1>
              </div>
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Last Updated</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {formatDate(contractData.updated_at)}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Section (Actions) */}
        <div className=" mt-2 gap-2 w-full items-center flex-shrink-0 pt-4">
          {/* <div className="col-span-1 flex items-center w-full justify-end">
            <button 
              onClick={handleShare}
              className="flex items-center text-xs sm:text-base font-medium text-gray-900 hover:underline"
            >
              <FiShare2 className="mr-1" size={14} />
              Share
            </button>
          </div> */}
          <div className="col-span-2 flex justify-end ">
            <button 
              onClick={onClose}
              className="flex w-[40%] justify-center items-center bg-gray-900 text-white text-center font-medium text-xs sm:text-sm md:text-base py-2 sm:py-3 px-4 sm:px-6 md:px-10 rounded-full hover:bg-gray-800 transition-colors"
            >
              {/* <FiDownload className="mr-1" size={14} /> */}
              Close 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CittaContractModal;