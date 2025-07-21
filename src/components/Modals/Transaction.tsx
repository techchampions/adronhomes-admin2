import React, { useState, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoCopyOutline } from "react-icons/io5";
import { FiShare2 } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import { useParams } from "react-router-dom";

interface PaymentData {
  from: string;
  description: string;
  property: string;
  type: string;
  method: string;
  amount: string;
  reference: string;
  status: string;
  paymentDate: string;
  director: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData?: PaymentData;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentData = {
    from: "",
    description: "",
    property: "",
    type: "",
    method: "",
    amount: "",
    reference: "",
    status: "Pending",
    paymentDate: "",
    director: ""
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
      Payment Details
      ------------------
      From: ${paymentData.from}
      Property: ${paymentData.property}
      Description: ${paymentData.description}
      Type: ${paymentData.type}
      Method: ${paymentData.method}
      Amount: ${paymentData.amount}
      Director: ${paymentData.director}
      Reference: ${paymentData.reference}
      Status: ${paymentData.status}
      Date: ${paymentData.paymentDate}
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `payment_${paymentData.reference}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Payment Details',
          text: `Payment Reference: ${paymentData.reference}`,
          url: window.location.href,
        });
      } else {
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
      case "approved":
      case "completed":
        return "#2ECE2E";
      case "pending":
        return "#FFA500";
      case "rejected":
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
        // Removed overflow-y-auto and max-h-[95vh] from this div
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 relative animate-fadeIn flex flex-col h-[95vh]" // Added flex flex-col and h-[95vh]
      >
        {/* Fixed Top Section (Header) */}
        <div className="w-full items-center justify-between flex mb-4 sm:mb-6 flex-shrink-0"> {/* Added flex-shrink-0 */}
          <p className="font-medium text-lg sm:text-xl md:text-2xl">Payment Details</p>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1 sm:p-2 rounded-full transition-colors"
          >
            <FaXmark size={14} />
          </button>
        </div>

        {/* Scrollable Middle Section (Data) */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar"> {/* Added flex-grow, overflow-y-auto, and custom-scrollbar for styling */}
          {/* From */}
          <div className="grid grid-cols-3 border-b border-b-gray-200 pb-3 sm:pb-4 w-full items-center">
            <div className="col-span-2">
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">From</p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2">
                {paymentData.from}
              </h1>
            </div>
          </div>

          {/* Property */}
          <div className="grid grid-cols-1 border-b border-b-gray-200 py-3 sm:py-4 w-full">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
                Property
              </p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                {paymentData.property}
              </h1>
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 border-b border-b-gray-200 py-3 sm:py-4 w-full">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
                Description
              </p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                {paymentData.description}
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
                {paymentData.method}
              </h1>
            </div>
            <div className="w-full flex justify-end">
              <div>
                <p className="mb-1 sm:mb-2 text-xs font-normal text-gray-600">Amount</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  ₦{Number(paymentData.amount).toLocaleString()}
                </h1>
              </div>
            </div>
          </div>

          {/* Director */}
          <div className="grid grid-cols-1 border-b border-b-gray-200 py-3 sm:py-4 w-full">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
                Director
              </p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                {paymentData.director}
              </h1>
            </div>
          </div>

          {/* Payment Reference */}
          <div className="grid grid-cols-2 border-b border-b-gray-200 py-3 sm:py-4 w-full items-center">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
                Payment Reference
              </p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base truncate pr-1 sm:pr-2">
                {paymentData.reference}
              </h1>
            </div>
            <div className="w-full flex justify-end">
              <button
                onClick={() => handleCopy(paymentData.reference)}
                className="flex items-center hover:bg-gray-100 p-1 sm:px-2 rounded transition-colors text-xs sm:text-sm"
              >
                <IoCopyOutline className="mr-1" size={14} />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 border-b border-b-gray-200 py-3 sm:py-4 w-full items-center">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">Status</p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base flex items-center">
                <GoDotFill
                  color={getStatusColor(paymentData.status)}
                  className="mr-1"
                  size={14}
                />
                {paymentData.status}
              </h1>
            </div>
            <div className="w-full flex justify-end">
              <div>
                <p className="mb-1 sm:mb-2 text-xs font-normal text-gray-600">Date</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {new Date(paymentData.paymentDate).toLocaleDateString()}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Section (Actions) */}
        <div className="grid grid-cols-3 mt-2 gap-2 w-full items-center flex-shrink-0 pt-4"> {/* Added flex-shrink-0 and pt-4 for spacing */}
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

export default PaymentModal;