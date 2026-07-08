import { useState } from "react";
import Pagination from "../../components/Tables/Pagination";
import {
  MaintenanceRequest,
  SecurityCode,
  UtilityPayment,
} from "../../components/Redux/estate/estateThunk";
import { formatDate } from "../../utils/formatdate";
import UtilityPaymentDetailModal from "./UtilityPaymentDetailModal";
import MaintenanceDetailModal from "./MaintenanceDetailModal";

interface PaginationShape {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface TableProps<T> {
  data: T[];
  pagination: PaginationShape;
  onPageChange: (page: number) => void;
}

const statusPill = (status: string | number) => {
  const normalized = String(status).toLowerCase();
  const isDone =
    normalized === "1" ||
    normalized === "completed" ||
    normalized === "attended to";
  const isPending = normalized === "0" || normalized === "pending";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-[350] ${
        isDone
          ? "bg-[#EAF7EA] text-[#2E9B2E]"
          : isPending
            ? "bg-[#FFF4E8] text-[#FF9131]"
            : "bg-[#F1F1F1] text-[#767676]"
      }`}
    >
      {typeof status === "number"
        ? status === 1
          ? "Completed"
          : "Pending"
        : status || "N/A"}
    </span>
  );
};

export function MaintenanceTable({
  data,
  pagination,
  onPageChange,
}: TableProps<MaintenanceRequest>) {
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                {["Title", "Resident", "Priority", "Status", "Estate", "Date"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="py-4 pr-6 font-[325] text-[#757575] text-xs"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((request) => (
                <tr
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 pr-6 font-[325] text-dark text-sm max-w-[260px]">
                    <div className="truncate">{request.title || "N/A"}</div>
                    <p className="text-xs text-[#767676] truncate">
                      {request.content || "N/A"}
                    </p>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {`${request.first_name || ""} ${request.last_name || ""}`.trim() ||
                      "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-[350] ${
                        request.priority?.toLowerCase() === "high"
                          ? "bg-[#FDECEC] text-[#D70E0E]"
                          : "bg-[#F1F1F1] text-[#767676]"
                      }`}
                    >
                      {request.priority || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {statusPill(request.status)}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {request.estate_name || "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {formatDate(request.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination pagination={pagination} onPageChange={onPageChange} className="mt-8 mb-4" />
      <MaintenanceDetailModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />
    </>
  );
}

export function SecurityCodesTable({
  data,
  pagination,
  onPageChange,
}: TableProps<SecurityCode>) {
  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[860px]">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                {["Name", "Code", "Estate", "Limit", "Used", "Expires", "Created By"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="py-4 pr-6 font-[325] text-[#757575] text-xs"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((code) => (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {code.name || "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[350] text-dark text-sm">
                    {code.code || "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {code.estate_name || "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {code.limit || 0}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {code.total_used || 0}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {formatDate(code.expired_at)}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {`${code.created_by_first_name || ""} ${
                      code.created_by_last_name || ""
                    }`.trim() || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination pagination={pagination} onPageChange={onPageChange} className="mt-8 mb-4" />
    </>
  );
}

export function UtilityPaymentsTable({
  data,
  pagination,
  onPageChange,
}: TableProps<UtilityPayment>) {
  const [selectedPayment, setSelectedPayment] = useState<UtilityPayment | null>(
    null,
  );

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[960px]">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                {["Reference", "Resident", "Type", "Amount", "Status", "Estate", "Date"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="py-4 pr-6 font-[325] text-[#757575] text-xs"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((payment) => (
                <tr
                  key={payment.id}
                  onClick={() => setSelectedPayment(payment)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="py-4 pr-6 font-[350] text-dark text-sm">
                    {payment.reference || "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {`${payment.first_name || ""} ${payment.last_name || ""}`.trim() ||
                      "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm capitalize">
                    {payment.payment_type || "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[350] text-dark text-sm">
                    ₦{Number(payment.amount || 0).toLocaleString()}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {statusPill(payment.status)}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {payment.estate_name || "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {formatDate(payment.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination pagination={pagination} onPageChange={onPageChange} className="mt-8 mb-4" />
      <UtilityPaymentDetailModal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
      />
    </>
  );
}
