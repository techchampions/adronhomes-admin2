import { useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { FiDownload, FiShare2 } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

export interface EstateDetailItem {
  label: string;
  value: string | number;
  statusColor?: string;
}

interface EstateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  items: EstateDetailItem[];
}

export default function EstateDetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  items,
}: EstateDetailModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareText, setShareText] = useState("Share");
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const detailsText = `${title}
${subtitle ? `${subtitle}\n` : ""}
${items.map((item) => `${item.label}: ${item.value || "N/A"}`).join("\n")}`;

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setShareText("Copied");
    setTimeout(() => setShareText("Share"), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        text: detailsText,
        url: window.location.href,
      });
      return;
    }

    await handleCopy(detailsText);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([detailsText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    setIsDownloading(true);

    try {
      const rect = element.getBoundingClientRect();
      const scale = 3;
      const imgData = await domtoimage.toPng(element, {
        quality: 0.95,
        bgcolor: "#ffffff",
        width: rect.width * scale,
        height: rect.height * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        },
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const usableWidth = pdfWidth - margin * 2;
      const imageHeight = (rect.height / rect.width) * usableWidth;

      pdf.addImage(imgData, "PNG", margin, margin, usableWidth, imageHeight);
      pdf.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(102,102,102,0.2)] p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 relative animate-fadeIn flex flex-col max-h-[95vh]">
        <div ref={printRef} className="bg-white">
          <div className="w-full justify-center flex mb-5">
            <img src="/logo.png" alt="Company Logo" className="h-10" />
          </div>

          <div className="w-full items-start justify-between flex mb-4 sm:mb-6 flex-shrink-0 gap-4">
            <div>
              <p className="font-medium text-lg sm:text-xl md:text-2xl">
                {title}
              </p>
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="hover:bg-gray-100 p-1 sm:p-2 rounded-full transition-colors"
              aria-label="Close details"
            >
              <FaXmark size={14} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[58vh]">
            {items.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-1 border-b border-b-gray-200 py-3 sm:py-4 w-full"
              >
                <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-normal text-gray-600">
                  {item.label}
                </p>
                <h1 className="font-normal text-gray-900 text-xs sm:text-sm md:text-base break-words flex items-center">
                  {item.statusColor && (
                    <GoDotFill
                      color={item.statusColor}
                      className="mr-1 flex-shrink-0"
                      size={14}
                    />
                  )}
                  {item.value || "N/A"}
                </h1>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 mt-2 gap-2 w-full items-center flex-shrink-0 pt-4">
          <div className="col-span-1 flex items-center w-full justify-end">
            <button
              onClick={handleShare}
              className="flex items-center text-xs sm:text-base font-medium text-gray-900 hover:underline"
            >
              <FiShare2 className="mr-1" size={14} />
              {shareText}
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
              {isDownloading ? "Generating..." : "PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
