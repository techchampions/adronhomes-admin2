// src/components/Gifts/GiftTable.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GiftData } from "../../type";
import Pagination from "../../../Tables/Pagination";
import { AppDispatch } from "../../../Redux/store";
import { 
  selectGiftsPagination, 
  setCurrentPage,
  selectGiftsChangingState
} from "../../../Redux/gift/gift_slice";
import { changeGiftState } from "../../../Redux/gift/gift_thunk";
import LoadingAnimations from "../../../LoadingAnimations";

interface GiftTableProps {
  data: GiftData[];
  loading?: boolean;
  onEdit?: (gift: GiftData) => void;
  onStatusChange?: (id: number, newStatus: string) => void;
  onViewDetails?: (id: number) => void;
}

const GiftTable: React.FC<GiftTableProps> = ({ 
  data, 
  loading = false,
  onEdit, 
  onStatusChange,
  onViewDetails 
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const pagination = useSelector(selectGiftsPagination);
  const changingState = useSelector(selectGiftsChangingState);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<number | null>(null);
  const [changingStateId, setChangingStateId] = useState<number | null>(null);

  const handleRowClick = (giftId: number) => {
    if (onViewDetails) {
      onViewDetails(giftId);
    } else {
      navigate(`/gifts/${giftId}`);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleChangeState = async (gift: GiftData, newStatus: string) => {
    setChangingStateId(gift.id);
    try {
      await dispatch(changeGiftState({ id: gift.id, status: newStatus })).unwrap();
      setStatusDropdownOpen(null);
      // Refresh or update the gift in the list
      if (onStatusChange) {
        onStatusChange(gift.id, newStatus);
      }
    } catch (error) {
      console.error('Failed to change gift state:', error);
    } finally {
      setChangingStateId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "disable":
        return "bg-red-100 text-red-800";
      case "disabled":
        return "bg-red-100 text-red-700";
      case "limited":
        return "bg-orange-100 text-orange-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "disabled", label: "Disable" },
  ];

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <LoadingAnimations loading={loading} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <span className="text-6xl mb-4">🎁</span>
          <p className="text-lg font-medium text-gray-600">No gifts found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="max-w-[800px] md:min-w-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left border-gray-200 bg-gray-50">
              <th className="py-4 pr-6 pl-4 text-[#757575] text-xs font-[325]">Gift Name</th>
              <th className="py-4 px-6 text-[#757575] text-xs font-[325]">Gift Type</th>
              <th className="py-4 px-6 text-[#757575] text-xs font-[325]">Estimated Value</th>
              <th className="py-4 px-6 text-[#757575] text-xs font-[325]">Total Quantity</th>
              <th className="py-4 px-6 text-[#757575] text-xs font-[325]">Qty/Property</th>
              <th className="py-4 px-6 text-[#757575] text-xs font-[325]">Measurement Unit</th>
              <th className="py-4 px-6 text-[#757575] text-xs font-[325]">Status</th>
              <th className="py-4 pl-6 pr-4 text-[#757575] text-xs font-[325]">Actions</th>
              </tr>
          </thead>
          <tbody>
            {data.map((gift) => {
              const isUpdating = changingStateId === gift.id || (changingState && changingStateId === gift.id);
              
              return (
                <tr
                  key={`gift-${gift.id}`}
                  className="hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors group"
                  onClick={() => handleRowClick(gift.id)}
                >
                  <td className="py-4 pr-6 pl-4 text-dark text-sm">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-3 overflow-hidden rounded-[15px] shrink-0 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        {gift.displayImage ? (
                          <img 
                            src={gift.displayImage} 
                            alt={gift.giftName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl">🎁</span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium block">{gift.giftName || 'Unnamed Gift'}</span>
                        <span className="text-xs text-gray-400">
                          ID: {gift.id}
                        </span>
                      </div>
                    </div>
                    </td>
                  <td className="py-4 px-6 text-dark text-sm">
                    <span className="capitalize">{gift.giftType || 'Standard'}</span>
                    <span className="text-xs text-gray-400 block">
                      {gift.measurementUnit || 'unit'}
                    </span>
                    </td>
                  <td className="py-4 px-6 text-dark text-sm font-semibold text-[#79B833]">
                    {formatCurrency(gift.estimatedValue || 0)}
                    </td>
                  <td className="py-4 px-6 text-dark text-sm">
                    <div>
                      <span className="font-medium">{(gift.totalQuantity || 0).toLocaleString()}</span>
                      {gift.remainingQuantity !== undefined && (
                        <span className="text-xs text-gray-400 block">
                          Remaining: {(gift.remainingQuantity || 0).toLocaleString()}
                        </span>
                      )}
                    </div>
                    </td>
                  <td className="py-4 px-6 text-dark text-sm">
                    {gift.quantityPerProperty || 0}
                    </td>
                  <td className="py-4 px-6 text-dark text-sm">
                    {gift.measurementUnit || 'unit'}
                    </td>
                  <td className="py-4 px-6 text-sm">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusDropdownOpen(statusDropdownOpen === gift.id ? null : gift.id);
                        }}
                        disabled={isUpdating}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(gift.status)} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isUpdating ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                        ) : (
                          <span>{gift.status === 'disabled' ? 'Disabled' : (gift.status?.charAt(0).toUpperCase() + gift.status?.slice(1) || 'Unknown')}</span>
                        )}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {statusDropdownOpen === gift.id && (
                        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[140px]">
                          {statusOptions.map(option => (
                            <button
                              key={option.value}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (option.value !== gift.status) {
                                  handleChangeState(gift, option.value);
                                } else {
                                  setStatusDropdownOpen(null);
                                }
                              }}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 ${
                                option.value === gift.status ? 'bg-gray-100 font-medium' : ''
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${option.value === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    </td>
                  <td
                    className="py-4 pl-6 pr-4 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit?.(gift)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Edit gift"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="#4F4F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15 5L19 9" stroke="#4F4F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      
                      {/* Capsule button for Disable/Active */}
                      <button
                        onClick={() => handleChangeState(gift, gift.status === 'active' ? 'disabled' : 'active')}
                        disabled={isUpdating}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          gift.status === 'active'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={gift.status === 'active' ? 'Disable Gift' : 'Activate Gift'}
                      >
                        {isUpdating ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mx-2"></div>
                        ) : gift.status === 'active' ? (
                          'Disable'
                        ) : (
                          'Activate'
                        )}
                      </button>
                    </div>
                    </td>
                 </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="w-full mt-6">
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              className="mt-8 mb-4"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftTable;