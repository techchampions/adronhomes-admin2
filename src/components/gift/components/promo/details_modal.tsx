// details_modal.tsx
import { FaCheck, FaTimes, FaCalendar, FaUser, FaIdCard, FaEnvelope, FaBuilding, FaHome, FaMapMarker, FaComment, FaBox, FaMoneyBillWave, FaTag, FaClock } from "react-icons/fa";
import { formatDate } from "../../../../utils/formatdate";
import { PromoRequest } from "./PromoRequestsTableComponent";

interface DetailModalProps {
  isOpen: boolean;
  request: PromoRequest | null;
  onClose: () => void;
  onApprove?: (request: PromoRequest) => void;
  onSetPickupDate?: (request: PromoRequest) => void;
  onDisapprove?: (request: PromoRequest) => void;
  processingRequestId?: number | null;
}

export const DetailModal: React.FC<DetailModalProps> = ({ 
  isOpen, 
  request, 
  onClose, 
  onApprove, 
  onSetPickupDate,
  onDisapprove,
  processingRequestId 
}) => {
  if (!isOpen || !request) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'disapproved':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'picked':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FaCheck className="text-green-600" />;
      case 'disapproved':
        return <FaTimes className="text-red-600" />;
      case 'picked':
        return <FaClock className="text-blue-600" />;
      default:
        return <FaCalendar className="text-yellow-600" />;
    }
  };

  // Calculate total items value
  const calculateTotalItemsValue = () => {
    if (!request.items) return 0;
    return request.items.reduce((sum, item) => sum + ((item.item_price || 0) * (item.qty || 1)), 0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/10 bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-[30px] shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{request.promo.name} Request Details</h2>
                <p className="text-sm text-gray-500 mt-1">ID: #{request.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status Banner */}
            <div className={`mb-6 p-4 rounded-lg border ${getStatusColor(request.status)}`}>
              <div className="flex items-center gap-3">
                {getStatusIcon(request.status)}
                <div>
                  <p className="font-semibold">Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}</p>
                  {request.processed_at && (
                    <p className="text-sm opacity-75">
                      Processed on: {formatDate(request.processed_at)}
                    </p>
                  )}
                  {request.pickup_date && (
                    <p className="text-sm opacity-75 mt-1">
                      Pickup Date: {formatDate(request.pickup_date)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information Section */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaUser className="text-[#79B833]" />
                    User Information
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FaIdCard className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{request.user.first_name} {request.user.last_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{request.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaIdCard className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">User ID</p>
                      <p className="font-medium">{request.user_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Information Section */}
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaBuilding className="text-[#79B833]" />
                    Property Information
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FaHome className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Property Name</p>
                      <p className="font-medium">{request.property.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaMapMarker className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Property ID</p>
                      <p className="font-medium">{request.property_id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaMoneyBillWave className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium text-lg text-green-600">
                        ₦{request.property.total_amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              {request.items && request.items.length > 0 && (
                <div className="md:col-span-2 space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaBox className="text-[#79B833]" />
                      Items Details
                    </h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit Price (₦)
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total (₦)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {request.items.map((item, index) => (
                            <tr key={item.item_id || index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <FaTag className="text-gray-400 text-sm" />
                                  <span className="font-medium text-gray-900">{item.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-700">{item.qty.toLocaleString()}</td>
                              <td className="px-4 py-3 text-gray-700">
                                ₦{item.item_price?.toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-semibold text-green-600">
                                  ₦{(item.item_price * item.qty)?.toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-900">
                              Total Value:
                             </td>
                            <td className="px-4 py-3">
                              <span className="font-bold text-lg text-green-600">
                                ₦{calculateTotalItemsValue().toLocaleString()}
                              </span>
                             </td>
                          </tr>
                        </tfoot>
                       </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Request Details Section */}
              <div className="md:col-span-2 space-y-4">
                <div className="border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaComment className="text-[#79B833]" />
                    Request Details
                  </h3>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaComment className="text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">User Note</p>
                    <div className="mt-1 p-3 bg-white rounded border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {request.user_note || "No note provided"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <FaCalendar className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Request Date</p>
                      <p className="font-medium">{formatDate(request.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaCalendar className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">{formatDate(request.updated_at)}</p>
                    </div>
                  </div>
                  
                  {request.pickup_date && (
                    <div className="flex items-start gap-3">
                      <FaClock className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Pickup Date & Time</p>
                        <p className="font-medium text-blue-600">{formatDate(request.pickup_date)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl flex justify-end gap-3">
            {request.status === 'pending' && onApprove && onDisapprove && (
              <>
                <button
                  onClick={() => {
                    onDisapprove(request);
                    onClose();
                  }}
                  disabled={processingRequestId === request.id}
                  className="px-4 py-2 bg-red-500 text-white rounded-[30px] font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {processingRequestId === request.id ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <FaTimes />
                      Disapprove
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    onApprove(request);
                    onClose();
                  }}
                  disabled={processingRequestId === request.id}
                  className="px-4 py-2 bg-[#79B833] hover:bg-[#6aa22c] text-white rounded-[30px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {processingRequestId === request.id ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <FaCalendar />
                      Approve & Schedule Pickup
                    </>
                  )}
                </button>
              </>
            )}
            
            {request.status === 'approved' && !request.pickup_date && onSetPickupDate && (
              <button
                onClick={() => {
                  onSetPickupDate(request);
                  onClose();
                }}
                disabled={processingRequestId === request.id}
                className="px-4 py-2 bg-[#79B833] hover:bg-[#6aa22c] text-white rounded-[30px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {processingRequestId === request.id ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FaCalendar />
                    Set Pickup Date
                  </>
                )}
              </button>
            )}
            
            {(request.status === 'disapproved' || request.status === 'picked' || (request.status === 'approved' && request.pickup_date)) && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-[30px] font-medium transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};