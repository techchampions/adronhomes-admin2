import React, { useState, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoCopyOutline } from "react-icons/io5";
import { FiShare2 } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";

interface PropertyData {
  name: string;
  price: number;
  size: string;
  image: string;
  address: string;
}

interface PaymentData {
  from: string;
  description: string;
  type: string;
  method: string;
  fees: string;
  reference: string;
  status: string;
  bankIcon: string;
  property: PropertyData;
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
    from: "Customer",
    description: "Property Payment",
    type: "Property Investment",
    method: "Bank Transfer",
    fees: "0",
    reference: "N/A",
    status: "Pending",
    bankIcon: "/bank-icon.svg",
    property: {
      name: "Property",
      price: 0,
      size: "N/A",
      image: "/land.svg",
      address: "N/A"
    }
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
      Property: ${paymentData.property.name}
      Description: ${paymentData.description}
      Type: ${paymentData.type}
      Method: ${paymentData.method}
      Amount: ₦${paymentData.property.price.toLocaleString()}
      Fees: ₦${paymentData.fees}
      Reference: ${paymentData.reference}
      Status: ${paymentData.status}
      Property Size: ${paymentData.property.size}
      Property Address: ${paymentData.property.address}
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
      case "completed":
        return "#2ECE2E";
      case "pending":
        return "#FFA500";
      case "failed":
        return "#FF0000";
      default:
        return "#FFA500";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(102,102,102,0.2)] p-2 sm:p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 relative animate-fadeIn flex flex-col h-[95vh]"
      >
        {/* Fixed Top Section (Header) */}
        <div className="w-full items-center justify-between flex mb-4 sm:mb-6 flex-shrink-0">
          <p className="font-medium text-lg sm:text-xl md:text-2xl">Payment Details</p>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1 sm:p-2 rounded-full transition-colors"
          >
            <FaXmark size={14} />
          </button>
        </div>

        {/* Scrollable Middle Section (Data) */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {/* Property Image and Details */}
          <div className="flex items-center border-b border-b-gray-200 pb-3 sm:pb-4 w-full">
            <img 
              src={paymentData.property.image} 
              alt={paymentData.property.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover mr-3 sm:mr-4"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                {paymentData.property.name}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {paymentData.property.address}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium text-gray-900 text-sm sm:text-base">
                  ₦{paymentData.property.price.toLocaleString()}
                </span>
                <span className="text-gray-600 text-xs sm:text-sm">
                  {/* {paymentData.property.size} */}
                </span>
              </div>
            </div>
          </div>

          {/* From */}
          <div className="grid grid-cols-3 border-b border-b-gray-200 py-3 sm:py-4 w-full items-center">
            <div className="col-span-2">
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">From</p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2">
                {paymentData.from}
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

          {/* Payment Type and Method */}
          <div className="grid grid-cols-2 border-b border-b-gray-200 py-3 sm:py-4 w-full items-center">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
                Payment Type
              </p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                {paymentData.type}
              </h1>
            </div>
            <div className="w-full flex justify-end">
              <div>
                <p className="mb-1 sm:mb-2 text-xs font-normal text-gray-600">Method</p>
                <div className="flex items-center">
                  <img 
                    src={paymentData.bankIcon} 
                    alt="Bank" 
                    className="w-4 h-4 mr-2"
                  />
                  <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                    {paymentData.method}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Amount and Fees */}
          <div className="grid grid-cols-2 border-b border-b-gray-200 py-3 sm:py-4 w-full items-center">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
                Amount
              </p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                ₦{paymentData.property.price.toLocaleString()}
              </h1>
            </div>
            <div className="w-full flex justify-end">
              <div>
                <p className="mb-1 sm:mb-2 text-xs font-normal text-gray-600">Fees</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  ₦{paymentData.fees}
                </h1>
              </div>
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
          </div>
        </div>

        {/* Fixed Bottom Section (Actions) */}
        <div className="grid grid-cols-3 mt-2 gap-2 w-full items-center flex-shrink-0 pt-4">
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