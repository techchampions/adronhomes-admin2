import React, { useState, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoCopyOutline } from "react-icons/io5";
import { FiShare2, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

interface PaymentData {
  from: string;
  description: string;
  property: string;
  type: string;
  method: string;
  amount: string;
  reference: string;
  status: string;
  transactionDate: any;
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
    transactionDate: "",
    director: "",
  },
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // ONLY the content to be included in PDF
  const pdfRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const generatePdf = async () => {
    if (!pdfRef.current) return null;
    setIsGenerating(true);

    try {
      const imgData = await domtoimage.toPng(pdfRef.current, {
        quality: 1,
        bgcolor: "#ffffff",
        cacheBust: true,
        width: pdfRef.current.offsetWidth * 2,
        height: pdfRef.current.offsetHeight * 2,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
          width: `${pdfRef.current.offsetWidth}px`,
          height: `${pdfRef.current.offsetHeight}px`,
        },
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => (img.onload = resolve));

      const aspectRatio = img.naturalWidth / img.naturalHeight;
      let finalWidth = pdfWidth - 40;
      let finalHeight = finalWidth / aspectRatio;
      if (finalHeight > pdfHeight - 40) {
        finalHeight = pdfHeight - 40;
        finalWidth = finalHeight * aspectRatio;
      }

      pdf.addImage(imgData, "PNG", (pdfWidth - finalWidth) / 2, 20, finalWidth, finalHeight);
      pdf.save("transaction-receipt.pdf");

      return pdf;
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    await generatePdf();
  };

  const handleShare = async () => {
    const pdf = await generatePdf();
    if (!pdf) return;

    const pdfBlob = pdf.output("blob");
    const file = new File([pdfBlob], "transaction-receipt.pdf", {
      type: "application/pdf",
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ title: "Transaction Receipt", files: [file] });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert("Sharing not supported on this device. PDF downloaded instead.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(102,102,102,0.2)] p-2 sm:p-4 scrollbar-hide">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 relative animate-fadeIn flex flex-col h-[95vh] scrollbar-hide">
        
        {/* Cancel button (NOT part of PDF) */}
        <div className="flex justify-between items-center mb-4 scrollbar-hide">
          <p className="font-medium text-lg sm:text-xl md:text-2xl">Payment Details</p>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-1 sm:p-2 rounded-full transition-colors"
          >
            <FaXmark size={14} />
          </button>
        </div>

        {/* PDF content */}
        <div ref={pdfRef} className="flex-grow overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
          {/* Logo */}
          <div className="w-full flex justify-center mb-4">
            <img src="/logo.png" alt="Company Logo" className="h-10 md:h-12 object-contain" />
          </div>

          {/* Receipt details */}
          <div className="space-y-3">
            <DetailRow label="From" value={paymentData.from} />
            <DetailRow label="Property" value={paymentData.property} />
            <DetailRow label="Description" value={paymentData.description} />
            <DetailRow label="Payment Method" value={paymentData.method} />
            <DetailRow label="Amount" value={`₦${Number(paymentData.amount).toLocaleString()}`} />
            {/* <DetailRow label="Director" value={paymentData.director} /> */}
            <DetailRow label="Payment Reference" value={paymentData.reference} copyable onCopy={() => handleCopy(paymentData.reference)} copied={copied} />
            <DetailRow
              label="Status"
              value={paymentData.status}
              colorDot={getStatusColor(paymentData.status)}
            />
            <DetailRow
              label="Date"
              value={new Date(paymentData.transactionDate).toLocaleDateString()}
            />
          </div>
        </div>

        {/* Buttons (NOT part of PDF) */}
        <div className="grid grid-cols-3 mt-2 gap-2 w-full items-center flex-shrink-0 pt-4">
          <div className="col-span-1 flex items-center w-full justify-end">
            <button
              onClick={handleShare}
              className="flex items-center text-xs sm:text-base font-medium text-gray-900 hover:underline"
            >
              <FiShare2 className="mr-1" size={14} />
              {isGenerating ? "Generating..." : "Share"}
            </button>
          </div>
          <div className="col-span-2 flex justify-end">
            <button
              onClick={handleDownload}
              className="flex items-center bg-gray-900 text-white font-medium text-xs sm:text-sm md:text-base py-2 sm:py-3 px-4 sm:px-6 md:px-10 rounded-full hover:bg-gray-800 transition-colors"
            >
              <FiDownload className="mr-1" size={14} />
              {isGenerating ? "Generating..." : "Download"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  colorDot?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, copyable, onCopy, copied, colorDot }) => (
  <div className="grid grid-cols-2 border-b border-b-gray-200 py-2">
    <div>
      <p className="mb-1 text-xs sm:text-sm font-normal text-gray-600">{label}</p>
      <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base flex items-center">
        {colorDot && <GoDotFill color={colorDot} className="mr-1" size={14} />}
        {value}
      </h1>
    </div>
    {copyable && onCopy && (
      <div className="flex justify-end items-center">
        <button
          onClick={onCopy}
          className="flex items-center hover:bg-gray-100 p-1 sm:px-2 rounded transition-colors text-xs sm:text-sm"
        >
          <IoCopyOutline className="mr-1" size={14} />
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
    )}
  </div>
);

export default PaymentModal;
