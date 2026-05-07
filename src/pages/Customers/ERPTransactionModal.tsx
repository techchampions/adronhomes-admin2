// ERPTransactionModal.tsx
import React, { useState, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoCopyOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { formatAsNaira } from "../../utils/formatcurrency";
import { formatDate } from "../../utils/formatdate";

export interface ERPTransaction {
  id: number;
  propertyId: number;
  userId: number;
  ContractId: string;
  TransactionDate: string;
  TransactionAmount: number;
  TransactionDRCR: 'C' | 'D';
  TransactionDescription: string;
  created_at: string;
  updated_at: string;
  TransactionReference: string;
}

interface ERPTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionData?: ERPTransaction;
  contractId?: string;
  customerName?: string;
}

const ERPTransactionModal: React.FC<ERPTransactionModalProps> = ({
  isOpen,
  onClose,
  transactionData,
  contractId,
  customerName,
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
    if (!transactionData) return;

    const transactionText = `
      ERP TRANSACTION DETAILS
      =======================
      
      TRANSACTION INFORMATION
      -----------------------
      Transaction ID: ${transactionData.id}
      Transaction Reference: ${transactionData.TransactionReference}
      Contract ID: ${transactionData.ContractId}
      Transaction Date: ${formatDate(transactionData.TransactionDate)}
      Transaction Type: ${transactionData.TransactionDRCR === 'C' ? 'CREDIT' : 'DEBIT'}
      Transaction Amount: ${formatAsNaira(Math.abs(transactionData.TransactionAmount))}
      Description: ${transactionData.TransactionDescription}
      
      RELATED ENTITIES
      ----------------
      Property ID: ${transactionData.propertyId}
      User ID: ${transactionData.userId}
      Customer Name: ${customerName || 'N/A'}
      
      SYSTEM INFORMATION
      ------------------
      Created: ${formatDate(transactionData.created_at)}
      Last Updated: ${formatDate(transactionData.updated_at)}
    `;

    const blob = new Blob([transactionText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `transaction_${transactionData.TransactionReference}_${formatDate(transactionData.TransactionDate)}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getTransactionStatusColor = (type: 'C' | 'D') => {
    return type === 'C' ? '#2ECE2E' : '#FF4444';
  };

  const getTransactionIcon = (type: 'C' | 'D') => {
    return type === 'C' ? '↑' : '↓';
  };

  if (!isOpen || !transactionData) return null;

  const isCredit = transactionData.TransactionDRCR === 'C';
  const amount = Math.abs(transactionData.TransactionAmount);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(102,102,102,0.2)] p-2 sm:p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-2xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 relative animate-fadeIn flex flex-col h-[90vh]"
      >
        {/* Fixed Top Section (Header) */}
        <div className="w-full items-center justify-between flex mb-4 sm:mb-6 flex-shrink-0">
          <div>
            <p className="font-medium text-lg sm:text-xl md:text-2xl">Transaction Details</p>
            <p className="text-sm text-gray-500 mt-1">Ref: {transactionData.TransactionReference}</p>
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
          {/* Transaction Overview */}
          <div className="border-b border-b-gray-200 pb-3 sm:pb-4 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                Transaction Summary
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isCredit 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isCredit ? 'CREDIT' : 'DEBIT'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs sm:text-sm font-normal text-gray-600 mb-1">Amount</p>
                <p className={`font-medium text-xl sm:text-2xl ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                  {isCredit ? '+' : '-'}{formatAsNaira(amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm font-normal text-gray-600 mb-1">Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(transactionData.TransactionDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="border-b border-b-gray-200 py-3 sm:py-4 w-full">
            <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Transaction Information</h4>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Transaction ID</p>
                  <div className="flex items-center justify-between">
                    <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                      {transactionData.id}
                    </h1>
                    <button
                      onClick={() => handleCopy(String(transactionData.id), 'id')}
                      className="ml-2 hover:bg-gray-100 p-1 rounded transition-colors"
                      title="Copy"
                    >
                      <IoCopyOutline size={14} className={copied === 'id' ? 'text-green-600' : ''} />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Reference</p>
                  <div className="flex items-center justify-between">
                    <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                      {transactionData.TransactionReference}
                    </h1>
                    <button
                      onClick={() => handleCopy(transactionData.TransactionReference, 'reference')}
                      className="ml-2 hover:bg-gray-100 p-1 rounded transition-colors"
                      title="Copy"
                    >
                      <IoCopyOutline size={14} className={copied === 'reference' ? 'text-green-600' : ''} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Contract ID</p>
                  <div className="flex items-center justify-between">
                    <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                      {transactionData.ContractId}
                    </h1>
                    <button
                      onClick={() => handleCopy(transactionData.ContractId, 'contractId')}
                      className="ml-2 hover:bg-gray-100 p-1 rounded transition-colors"
                      title="Copy"
                    >
                      <IoCopyOutline size={14} className={copied === 'contractId' ? 'text-green-600' : ''} />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Property ID</p>
                  <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                    {transactionData.propertyId}
                  </h1>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Description</p>
                <div className="flex items-center justify-between">
                  <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                    {transactionData.TransactionDescription}
                  </h1>
                  <button
                    onClick={() => handleCopy(transactionData.TransactionDescription, 'description')}
                    className="ml-2 hover:bg-gray-100 p-1 rounded transition-colors"
                    title="Copy"
                  >
                    <IoCopyOutline size={14} className={copied === 'description' ? 'text-green-600' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Parties */}
          <div className="border-b border-b-gray-200 py-3 sm:py-4 w-full">
            <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Related Parties</h4>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">User ID</p>
                  <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                    {transactionData.userId}
                  </h1>
                </div>
                <div>
                  <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Customer Name</p>
                  <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                    {customerName || 'N/A'}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="py-3 sm:py-4 w-full">
            <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">System Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Created</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {formatDate(transactionData.created_at)}
                </h1>
              </div>
              <div>
                <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">Last Updated</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {formatDate(transactionData.updated_at)}
                </h1>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="py-3 sm:py-4 w-full border-t border-t-gray-100">
            <div className="flex items-center">
              <GoDotFill
                color={getTransactionStatusColor(transactionData.TransactionDRCR)}
                className="mr-2"
                size={16}
              />
              <div>
                <p className="text-xs sm:text-sm font-normal text-gray-600">Transaction Type</p>
                <p className="font-medium text-gray-900">
                  {isCredit ? 'Credit Transaction' : 'Debit Transaction'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Section (Actions) */}
        <div className="mt-4 gap-2 w-full items-center flex-shrink-0 pt-4 border-t border-t-gray-100">
          <div className="col-span-2 flex justify-between">
            <button 
              onClick={handleDownload}
              className="flex items-center justify-center bg-transparent border border-gray-300 text-gray-700 text-center font-medium text-xs sm:text-sm md:text-base py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-full hover:bg-gray-50 transition-colors"
            >
              <FiDownload className="mr-2" size={14} />
              Download
            </button>
            <button 
              onClick={onClose}
              className="flex w-[40%] justify-center items-center bg-gray-900 text-white text-center font-medium text-xs sm:text-sm md:text-base py-2 sm:py-3 px-4 sm:px-6 md:px-10 rounded-full hover:bg-gray-800 transition-colors"
            >
              Close 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERPTransactionModal;