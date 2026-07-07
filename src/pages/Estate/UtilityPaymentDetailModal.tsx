import { useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";
import { UtilityPayment } from "../../components/Redux/estate/estateThunk";
import { formatDate } from "../../utils/formatdate";

interface UtilityPaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: UtilityPayment | null;
}

const statusText = (status: number) => (status === 1 ? "Completed" : "Pending");
const statusClass = (status: number) =>
  status === 1 ? "text-[#2E9B2E]" : "text-[#FF9131]";

export default function UtilityPaymentDetailModal({
  isOpen,
  onClose,
  payment,
}: UtilityPaymentDetailModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !payment) return null;

  const rows = [
    ["Estate", payment.estate_name],
    ["Customer", `${payment.first_name || ""} ${payment.last_name || ""}`.trim()],
    ["Email", payment.email],
    ["Phone", payment.phone_number],
    ["Reference", payment.reference],
    ["Payment Type", payment.payment_type],
    ["Payment Method", payment.payment_method],
    ["Purpose", payment.purpose],
    ["Chargeable ID", String(payment.chargeable_id || "")],
    ["Amount", `NGN ${Number(payment.amount || 0).toLocaleString()}`],
    ["Status", statusText(payment.status)],
    ["Date", formatDate(payment.created_at)],
  ];

  const handleDownloadTxt = () => {
    const text = rows
      .map(([label, value]) => `${label}: ${value || "N/A"}`)
      .join("\n");
    const blob = new Blob([`Utility Payment Details\n\n${text}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `utility-payment-${payment.reference || payment.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    setIsDownloading(true);

    try {
      const image = await domtoimage.toPng(element, {
        quality: 0.95,
        bgcolor: "#ffffff",
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const width = pdf.internal.pageSize.getWidth() - 40;
      pdf.addImage(image, "PNG", 20, 20, width, 0);
      pdf.save(`utility-payment-${payment.reference || payment.id}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(102,102,102,0.25)] p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-[350] text-xl text-dark">Utility Payment</h2>
            <p className="font-[325] text-xs text-[#767676] mt-1">
              {payment.reference}
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <FaXmark />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div ref={printRef} className="bg-white p-2">
            <div className="flex justify-center mb-5">
              <img src="/logo.png" alt="Adron" className="h-10" />
            </div>
            <div className="text-center mb-5">
              <h3 className="font-[350] text-2xl text-dark">
                Utility Payment Details
              </h3>
              <p className={`font-[350] text-sm mt-1 ${statusClass(payment.status)}`}>
                {statusText(payment.status)}
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[140px_1fr] gap-4 py-3"
                >
                  <p className="font-[325] text-xs text-[#767676]">{label}</p>
                  <p className="font-[350] text-sm text-dark break-words">
                    {value || "N/A"}
                  </p>
                </div>
              ))}
              <div className="py-3">
                <p className="font-[325] text-xs text-[#767676] mb-1">
                  Description
                </p>
                <p className="font-[350] text-sm text-dark">
                  {payment.description || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={handleDownloadTxt}
            className="h-10 rounded-full bg-[#F1F1F1] px-5 text-sm font-bold text-dark flex items-center gap-2"
          >
            <FiDownload size={14} />
            TXT
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="h-10 rounded-full bg-[#272727] px-5 text-sm font-bold text-white disabled:opacity-50 flex items-center gap-2"
          >
            <FiDownload size={14} />
            {isDownloading ? "Generating..." : "PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
