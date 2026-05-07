// PromoRequestsTableComponent.tsx - Complete upgraded version with detail modal
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCheck,
  FaTimes,
  FaUser,
  FaHome,
  FaCalendar,
  FaComment,
  FaEnvelope,
  FaIdCard,
  FaMapMarker,
  FaPhone,
  FaBuilding,
} from "react-icons/fa";
import { formatDate } from "../../../../utils/formatdate";
import ConfirmationModal from "../../../Modals/delete";
import { AppDispatch } from "../../../Redux/store";
import {
  approvePromoRequest,
  disapprovePromoRequest,
  selectPromoRequestsSubmitStatus,
} from "../../../Redux/gift/promo/promoRequestsSlice";
import { toast } from "react-toastify";
import LoadingAnimations from "../../../LoadingAnimations";
import { ReusableTable } from "../../../Tables/Table_one";
import { DetailModal } from "./details_modal";

// ============================================
// Types & Interfaces
// ============================================
export interface PromoRequest {
  id: number;
  user_id: number;
  promo_id: number;
  property_id: number;
  user_note: string;
  status: "pending" | "granted" | "rejected";
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  reward_group_id: number;
      promo: {
                  
                    name: string;
                    
                },
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  property: {
    id: number;
    name: string;
    total_amount: number;
  };
  items: [
    {
      name: string;
      qty: number;
      item_price: number;
      item_id: string;
    },
  ];
}

interface PromoRequestsTableProps {
  data: PromoRequest[];
  promoId: string | number;
  onRefresh: () => void;
  loading?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onSearch?: (searchTerm: string) => void;
  onSortChange?: (sortOption: any) => void;
}

interface PromoRequestsTableContentProps {
  requests: PromoRequest[];
  processingRequestId: number | null;
  onApprove: (request: PromoRequest) => void;
  onDisapprove: (request: PromoRequest) => void;
  onRowClick: (request: PromoRequest) => void;
  activeTab?: string;
}


const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
          <FaCheck className="text-xs" /> Approved
        </span>
      );
    case "rejected":
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
          <FaTimes className="text-xs" /> Disapproved
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
          Pending
        </span>
      );
  }
};

const getEmptyStateMessage = (activeTab: string = "all") => {
  switch (activeTab) {
    case "all":
      return "No promo requests found";
    case "pending":
      return "No pending promo requests";
    case "granted":
      return "No approved promo requests";
    case "rejected":
      return "No disapproved promo requests";
    default:
      return "No gift requests found for this promotion";
  }
};


const PromoRequestsTableContent: React.FC<PromoRequestsTableContentProps> = ({
  requests,
  processingRequestId,
  onApprove,
  onDisapprove,
  onRowClick,
  activeTab = "all",
}) => {
  if (requests.length === 0) {
    return (
      <div className="w-full py-8 text-center text-gray-500">
        {getEmptyStateMessage(activeTab)}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="md:min-w-0">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                User
              </th>
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                Property
              </th>
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                Note
              </th>
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                Request Date
              </th>
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                Status
              </th>
              <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* User Info */}
                <td
                  onClick={() => onRowClick(request)}
                  className="py-4 text-dark text-sm whitespace-nowrap pr-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-gray-300 text-xs" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {request.user.first_name} {request.user.last_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {request.user.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Property Info */}
                <td
                  onClick={() => onRowClick(request)}
                  className="py-4 text-dark text-sm whitespace-nowrap pr-4"
                >
                  <div className="flex items-center gap-2">
                    <FaHome className="text-gray-400 text-xs" />
                    <div>
                      <div className="font-medium truncate max-w-48">
                        {request.property.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        ₦{request.property.total_amount?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </td>

                {/* User Note */}
                <td
                  onClick={() => onRowClick(request)}
                  className="py-4 text-dark text-sm pr-4"
                >
                  <div className="flex items-start gap-2 max-w-64">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {request.user_note || "No note provided"}
                    </p>
                  </div>
                </td>

                {/* Request Date */}
                <td
                  onClick={() => onRowClick(request)}
                  className="py-4 text-dark text-sm whitespace-nowrap pr-4"
                >
                  <div className="flex items-center gap-2">
                    <span>{formatDate(request.created_at)}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 whitespace-nowrap pr-4">
                  {getStatusBadge(request.status)}
                </td>
                {/* Actions */}
                <td className="py-4 whitespace-nowrap">
                  {request.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApprove(request)}
                        disabled={processingRequestId === request.id}
                        className="px-3 py-1.5 bg-[#79B833]! hover:bg-[#6aa22c] text-white rounded-full text-xs font-mediumtransition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingRequestId === request.id ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <FaCheck className="text-xs" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onDisapprove(request)}
                        disabled={processingRequestId === request.id}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-medium hover:bg-red-600 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingRequestId === request.id ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <FaTimes className="text-xs" />
                            Disapprove
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  {request.status !== "pending" && (
                    <span className="text-xs text-gray-400">
                      {request.status === "granted"
                        ? "Already approved"
                        : "Already disapproved"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================
// Main Component
// ============================================
export default function PromoRequestsTableComponent({
  data,
  promoId,
  onRefresh,
  loading = false,
  activeTab = "all",
  onTabChange,
  onSearch,
  onSortChange,
}: PromoRequestsTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const submitStatus = useSelector(selectPromoRequestsSubmitStatus);

  // State for modal and processing
  const [selectedRequest, setSelectedRequest] = useState<PromoRequest | null>(
    null,
  );
  const [actionType, setActionType] = useState<"approve" | "disapprove" | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(
    null,
  );

  // ============================================
  // Event Handlers
  // ============================================
  const handleRowClick = (request: PromoRequest) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  const handleApprove = (request: PromoRequest) => {
    setSelectedRequest(request);
    setActionType("approve");
    setModalOpen(true);
  };

  const handleDisapprove = (request: PromoRequest) => {
    setSelectedRequest(request);
    setActionType("disapprove");
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedRequest) return;

    setProcessingRequestId(selectedRequest.id);

    try {
      let result;
      if (actionType === "approve") {
        result = await dispatch(approvePromoRequest(selectedRequest.id));
      } else {
        result = await dispatch(disapprovePromoRequest(selectedRequest.id));
      }

      if (result.payload?.success) {
        setModalOpen(false);
        await onRefresh(); // Refresh the list
        setSelectedRequest(null);
        setActionType(null);
        toast.success(
          `Request ${actionType === "approve" ? "approved" : "disapproved"} successfully`,
        );
      } else {
        toast.error(
          result.payload?.message || `Failed to ${actionType} request`,
        );
      }
    } catch (error) {
      toast.error(`An error occurred while processing the request`);
      console.error("Action error:", error);
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRequest(null);
    setActionType(null);
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
    setSelectedRequest(null);
  };

  const isProcessing =
    submitStatus === "loading" || processingRequestId !== null;

  // Define available tabs for this table
  const tabs = ["all", "pending", "granted", "rejected"];


  return (
    <>
      {/* Detail Modal */}
      <DetailModal
        isOpen={detailModalOpen}
        request={selectedRequest}
        onClose={handleDetailModalClose}
        onApprove={handleApprove}
        onDisapprove={handleDisapprove}
        processingRequestId={processingRequestId}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        title={
          actionType === "approve" ? "Approve Request" : "Disapprove Request"
        }
        description={`Are you sure you want to ${actionType} this gift request for ${selectedRequest?.user?.first_name} ${selectedRequest?.user?.last_name}?`}
        subjectName={selectedRequest?.property?.name || ""}
        onClose={handleModalClose}
        onConfirm={handleConfirm}
        loading={isProcessing}
        confirmButtonText={actionType === "approve" ? "Approve" : "Disapprove"}
        cancelButtonText="Cancel"
        className={`${actionType === "approve" ? "bg-[#79B833]! hover:bg-[#6aa22c]!" : "bg-red-600 hover:bg-red-700"} text-white`}
      />

      {/* Reusable Table Wrapper */}
      <div className="w-full">
        <ReusableTable
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          searchPlaceholder="Search for promo requests..."
          onSearch={onSearch || (() => {})}
          showTabs={true}
          showSearchandSort={true}
          onSortChange={onSortChange || (() => {})}
        >
          {loading ? (
            <div className="w-full flex items-center justify-center py-8">
              <LoadingAnimations loading={loading} />
            </div>
          ) : (
            <PromoRequestsTableContent
              requests={data}
              processingRequestId={processingRequestId}
              onApprove={handleApprove}
              onDisapprove={handleDisapprove}
              onRowClick={handleRowClick}
              activeTab={activeTab}
            />
          )}
        </ReusableTable>
      </div>
    </>
  );
}
