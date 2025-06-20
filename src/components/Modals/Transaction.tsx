import React, { useState, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoCopyOutline } from "react-icons/io5";
import { FiShare2 } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import html2canvas from "html2canvas";

interface TransactionData {
  from: string;
  description: string;
  type: string;
  method: string;
  fees: string;
  reference: string;
  status: string;
  bankIcon: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionData?: TransactionData;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionData = {
    from: "Chuks Federick Bomboclatt (Polaris Bank)",
    description: "Property Investment",
    type: "Wallet Funding",
    method: "Local Fund Transfer",
    fees: "N0.00",
    reference: "01hws5tdgy677782hdgeg3",
    status: "Completed",
    bankIcon: "/bank.svg",
  },
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

const handleDownload = () => {
  const receiptText = `
    Transaction Details
    ------------------
    From: ${transactionData.from}
    Description: ${transactionData.description}
    Type: ${transactionData.type}
    Method: ${transactionData.method}
    Fees: ${transactionData.fees}
    Reference: ${transactionData.reference}
    Status: ${transactionData.status}
  `;

  const blob = new Blob([receiptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `transaction_${transactionData.reference}.txt`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Transaction Details',
          text: `Transaction Reference: ${transactionData.reference}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        handleCopy(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#2ECE2E";
      case "pending":
        return "#FFA500";
      case "failed":
        return "#FF0000";
      default:
        return "#2ECE2E";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(102,102,102,0.2)] p-2 sm:p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 relative animate-fadeIn overflow-y-auto max-h-[95vh]"
      >
        <div className="w-full items-center justify-between flex mb-4 sm:mb-6">
          <p className="font-medium text-lg sm:text-xl md:text-2xl">Transaction Details</p>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1 sm:p-2 rounded-full transition-colors"
          >
            <FaXmark size={14} />
          </button>
        </div>


        {/* From */}
        <div className="grid grid-cols-3 border-b border-b-gray-200 pb-3 sm:pb-4 w-full items-center">
          <div className="col-span-2">
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">From</p>
            <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2">
              {transactionData.from}
            </h1>
          </div>
          <div className="w-full flex justify-end">
            <img
              src={transactionData.bankIcon}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
              alt="Bank icon"
            />
          </div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 border-b border-b-gray-200 py-3 sm:py-4 w-full">
          <div>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
              Description
            </p>
            <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
              {transactionData.description}
            </h1>
          </div>
        </div>

        {/* Transaction Type */}
        <div className="grid grid-cols-1 border-b border-b-gray-200 py-3 sm:py-4 w-full">
          <div>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
              Transaction Type
            </p>
            <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
              {transactionData.type}
            </h1>
          </div>
        </div>

        {/* Payment Method */}
        <div className="grid grid-cols-2 border-b border-b-gray-200 py-3 sm:py-4 w-full items-center">
          <div>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
              Payment Method
            </p>
            <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
              {transactionData.method}
            </h1>
          </div>
          <div className="w-full flex justify-end">
            <div>
              <p className="mb-1 sm:mb-2 text-xs font-normal text-gray-600">Fees</p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                {transactionData.fees}
              </h1>
            </div>
          </div>
        </div>

        {/* Transaction Reference */}
        <div className="grid grid-cols-2 border-b border-b-gray-200 py-3 sm:py-4 w-full items-center">
          <div>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
              Transaction Reference
            </p>
            <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base truncate pr-1 sm:pr-2">
              {transactionData.reference}
            </h1>
          </div>
          <div className="w-full flex justify-end">
            <button
              onClick={() => handleCopy(transactionData.reference)}
              className="flex items-center hover:bg-gray-100 p-1 sm:px-2 rounded transition-colors text-xs sm:text-sm"
            >
              <IoCopyOutline className="mr-1" size={14} />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 py-3 sm:py-4 w-full items-center">
          <div>
            <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">Status</p>
            <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base flex items-center">
              <GoDotFill
                color={getStatusColor(transactionData.status)}
                className="mr-1"
                size={14}
              />
              {transactionData.status}
            </h1>
          </div>
        </div>

        {/* Actions */}
         <div className="grid grid-cols-3 mt-2 gap-2 w-full items-center">
          <div className="col-span-1 flex items-center w-full justify-end">
            <button 
              onClick={handleShare}
              className="flex items-center text-xs sm:text-base font-medium text-gray-900 hover:underline"
            >
              <FiShare2 className="mr-1" size={14} />
              Share
            </button>
          </div>
          <div className="col-span-2 flex justify-end">
            <button 
              onClick={handleDownload}
              className="flex items-center bg-gray-900 text-white font-medium text-xs sm:text-sm md:text-base py-2 sm:py-3 px-4 sm:px-6 md:px-10 rounded-full hover:bg-gray-800 transition-colors"
            >
              <FiDownload className="mr-1" size={14} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;