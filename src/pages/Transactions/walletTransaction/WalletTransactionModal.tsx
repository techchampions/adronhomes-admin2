import React, { useState, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoCopyOutline } from "react-icons/io5";
import { FiShare2 } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import domtoimage from 'dom-to-image';

interface WalletTransactionData {
  amount: string;
  type: "credit" | "debit";
  method: string;
  description: string;
  reference: string;
  status: string;
  date: string;
  isPayment: boolean;
}

interface WalletTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionData?: WalletTransactionData;
}

const WalletTransactionModal: React.FC<WalletTransactionModalProps> = ({
  isOpen,
  onClose,
  transactionData = {
    amount: "",
    type: "credit",
    method: "",
    description: "",
    reference: "",
    status: "Completed",
    date: "",
    isPayment: false
  },
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) {
      return;
    }
    
    setIsDownloading(true);
    
    try {
      // Get the actual rendered dimensions of the element
      const rect = element.getBoundingClientRect();
      const elementWidth = rect.width;
      const elementHeight = rect.height;

      // Define a scale factor for better quality
      const scale = 4;

      // dom-to-image options
      const imageOptions = {
        quality: 0.95, // High quality PNG
        bgcolor: '#ffffff', // Ensure white background
        width: elementWidth * scale,
        height: elementHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${elementWidth}px`,
          height: `${elementHeight}px`,
        },
      };

      // Generate the image
      const imgData = await domtoimage.toPng(element, imageOptions);

      // Initialize jsPDF with points (pt) for A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      // A4 dimensions in points: 595 x 842
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 595 pt
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 842 pt
      const margin = 20; // 20pt margin
      const usablePdfWidth = pdfWidth - 2 * margin;
      const usablePdfHeight = pdfHeight - 2 * margin;

      // Load the image to get its natural dimensions
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => (img.onload = resolve));

      const imgWidth = img.naturalWidth / scale; // Adjust for scale
      const imgHeight = img.naturalHeight / scale;
      const aspectRatio = imgWidth / imgHeight;

      // Calculate dimensions to fit within usable PDF area
      let finalImgWidth = usablePdfWidth;
      let finalImgHeight = usablePdfWidth / aspectRatio;

      // If height exceeds usable PDF height, scale by height instead
      if (finalImgHeight > usablePdfHeight) {
        finalImgHeight = usablePdfHeight;
        finalImgWidth = usablePdfHeight * aspectRatio;
      }

      // Center the image on the page
      const xOffset = (pdfWidth - finalImgWidth) / 2;
      const yOffset = margin; // Start from top margin

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalImgWidth, finalImgHeight);
      pdf.save(`transaction-${transactionData.reference}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadTxt = () => {
    const receiptText = `
      Transaction Details
      ------------------
      Type: ${transactionData.type}
      Amount: ${transactionData.amount}
      Method: ${transactionData.method}
      Description: ${transactionData.description}
      Reference: ${transactionData.reference}
      Status: ${transactionData.status}
      Date: ${transactionData.date}
      ${transactionData.isPayment ? "Payment Transaction" : "Wallet Transaction"}
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
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 relative animate-fadeIn flex flex-col h-[95vh]"
      >
        {/* Hidden element for PDF generation */}
        <div ref={printRef} className="hidden">
          <div className="w-full justify-center flex">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="h-10 md:h-10 mr-1 md:mr-2 flex-shrink-0"
            />
          </div>
          
          <h3 className="pt-4 font-[500] text-2xl w-full text-center">
            Transaction Details
          </h3>
          
          <div className="flex flex-col divide-y divide-gray-200 mt-5">
            <div className="flex justify-between items-center py-3">
              <div className="flex flex-col">
                <p className="text-gray-400 text-xs">Type</p>
                <p className="font-bold text-xs capitalize">
                  {transactionData.type}
                </p>
              </div>
              <div className="flex flex-col text-left">
                <p className="text-gray-400 text-xs">Amount</p>
                <p className="font-bold text-xs">
                  {transactionData.type === 'credit' ? '+' : '-'}₦{Number(transactionData.amount).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-start py-3">
              <div className="flex flex-col">
                <p className="text-gray-400 text-xs">Method</p>
                <p className="font-bold text-xs capitalize">
                  {transactionData.method.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-start py-3">
              <div className="flex flex-col">
                <p className="text-gray-400 text-xs">Description</p>
                <p className="font-bold text-xs">
                  {transactionData.description}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <div className="flex flex-col">
                <p className="text-gray-400 text-xs">Transaction Reference</p>
                <p className="font-bold text-xs">{transactionData.reference}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <div className="flex flex-col">
                <p className="text-gray-400 text-xs">Status</p>
                <div className="font-bold text-xs flex items-center">
                  <span 
                    className="h-2 w-2 rounded-full mr-1"
                    style={{ backgroundColor: getStatusColor(transactionData.status) }}
                  ></span>
                  {transactionData.status}
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-400 text-xs">Date</p>
                <p className="font-bold text-xs">
                  {new Date(transactionData.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Top Section (Header) */}
        <div className="w-full items-center justify-between flex mb-4 sm:mb-6 flex-shrink-0">
          <p className="font-medium text-lg sm:text-xl md:text-2xl">Transaction Details</p>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1 sm:p-2 rounded-full transition-colors"
          >
            <FaXmark size={14} />
          </button>
        </div>

        {/* Scrollable Middle Section (Data) */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {/* Transaction Type */}
          <div className="grid grid-cols-2 border-b border-b-gray-200 pb-3 sm:pb-4 w-full items-center">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">Type</p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base capitalize">
                {transactionData.type}
              </h1>
            </div>
            <div className="w-full flex justify-end">
              <div>
                <p className="mb-1 sm:mb-2 text-xs font-normal text-gray-600">Amount</p>
                <h1 className={`font-normal text-xs sm:text-sm md:text-base ${
                  transactionData.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transactionData.type === 'credit' ? '+' : '-'}₦{Number(transactionData.amount).toLocaleString()}
                </h1>
              </div>
            </div>
          </div>

          {/* Transaction Method */}
          <div className="grid grid-cols-1 border-b border-b-gray-200 py-3 sm:py-4 w-full">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
                Method
              </p>
              <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base capitalize">
                {transactionData.method.replace(/_/g, ' ')}
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
                {transactionData.description}
              </h1>
            </div>
          </div>

          {/* Transaction Reference */}
          <div className="grid grid-cols-2 border-b border-b-gray-200 py-3 sm:py-4 w-full items-center">
            <div>
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
                Reference
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
          <div className="grid grid-cols-2 border-b border-b-gray-200 py-3 sm:py-4 w-full items-center">
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
            <div className="w-full flex justify-end">
              <div>
                <p className="mb-1 sm:mb-2 text-xs font-normal text-gray-600">Date</p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base">
                  {new Date(transactionData.date).toLocaleDateString()}
                </h1>
              </div>
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
          <div className="col-span-2 flex justify-end gap-2">
            <button 
              onClick={handleDownloadTxt}
              className="flex items-center bg-gray-200 text-gray-900 font-medium text-xs sm:text-sm md:text-base py-2 sm:py-3 px-4 sm:px-6 rounded-full hover:bg-gray-300 transition-colors"
            >
              <FiDownload className="mr-1" size={14} />
              TXT
            </button>
            <button 
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center bg-gray-900 text-white font-medium text-xs sm:text-sm md:text-base py-2 sm:py-3 px-4 sm:px-6 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <FiDownload className="mr-1" size={14} />
              {isDownloading ? 'Generating...' : 'PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTransactionModal;