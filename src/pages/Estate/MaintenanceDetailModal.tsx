import { FaXmark } from "react-icons/fa6";
import { MaintenanceRequest } from "../../components/Redux/estate/estateThunk";
import { formatDate } from "../../utils/formatdate";

interface MaintenanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: MaintenanceRequest | null;
}

const statusClass = (status?: string) =>
  status?.toLowerCase() === "pending"
    ? "bg-[#FFF4E8] text-[#FF9131]"
    : "bg-[#EAF7EA] text-[#2E9B2E]";

const priorityClass = (priority?: string) =>
  priority?.toLowerCase() === "high"
    ? "bg-[#FDECEC] text-[#D70E0E]"
    : "bg-[#F1F1F1] text-[#767676]";

export default function MaintenanceDetailModal({
  isOpen,
  onClose,
  request,
}: MaintenanceDetailModalProps) {
  if (!isOpen || !request) return null;

  const residentName =
    `${request.first_name || ""} ${request.last_name || ""}`.trim() || "N/A";
  const details = [
    ["Estate", request.estate_name],
    ["Resident", residentName],
    ["Email", request.email],
    ["Phone", request.phone_number],
    ["Created", formatDate(request.created_at)],
    ["Updated", formatDate(request.updated_at)],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(102,102,102,0.25)] p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-[350] text-2xl text-dark">
              Maintenance Details
            </h2>
            <p className="font-[325] text-sm text-[#767676] mt-1">
              Request #{request.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <FaXmark />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-wrap gap-2 mb-5">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-[350] ${statusClass(
                request.status,
              )}`}
            >
              {request.status || "N/A"}
            </span>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-[350] ${priorityClass(
                request.priority,
              )}`}
            >
              {request.priority || "N/A"}
            </span>
          </div>

          <div className="mb-6">
            <p className="font-[325] text-xs text-[#767676] mb-1">Title</p>
            <h3 className="font-[350] text-xl text-dark">
              {request.title || "N/A"}
            </h3>
          </div>

          <div className="mb-6 rounded-2xl bg-[#F6F6F8] p-4">
            <p className="font-[325] text-xs text-[#767676] mb-2">Content</p>
            <p className="font-[325] text-sm leading-6 text-dark whitespace-pre-wrap">
              {request.content || "N/A"}
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {details.map(([label, value]) => (
              <div key={label} className="grid sm:grid-cols-[140px_1fr] gap-3 py-3">
                <p className="font-[325] text-xs text-[#767676]">{label}</p>
                <p className="font-[350] text-sm text-dark break-words">
                  {value || "N/A"}
                </p>
              </div>
            ))}
            <div className="grid sm:grid-cols-[140px_1fr] gap-3 py-3">
              <p className="font-[325] text-xs text-[#767676]">Attachment</p>
              {request.attached ? (
                <a
                  href={request.attached}
                  target="_blank"
                  rel="noreferrer"
                  className="font-[350] text-sm text-[#79B833] hover:underline break-all"
                >
                  View attachment
                </a>
              ) : (
                <p className="font-[350] text-sm text-dark">N/A</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="h-10 rounded-full bg-[#272727] px-6 text-sm font-bold text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
