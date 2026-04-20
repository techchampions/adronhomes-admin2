// src/components/Gifts/GiftTable.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GiftData } from "../../type";
import Pagination from "../../../Tables/Pagination";
import { AppDispatch } from "../../../Redux/store";
import { selectGiftsPagination, setCurrentPage } from "../../../Redux/gift/gift_slice";
import LoadingAnimations from "../../../LoadingAnimations";

interface GiftTableProps {
  data: GiftData[];
  loading?: boolean;
  onEdit?: (gift: GiftData) => void;
  onDelete?: (id: GiftData) => void;
  onStatusChange?: (id: number, newStatus: string) => void;
  onViewDetails?: (id: number) => void;
}

const GiftTable: React.FC<GiftTableProps> = ({ 
  data, 
  loading = false,
  onEdit, 
  onDelete,
  onStatusChange,
  onViewDetails 
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const pagination = useSelector(selectGiftsPagination);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<number | null>(null);

  console.log('GiftTable received data:', data?.length || 0, 'items');

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
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "limited":
        return "bg-orange-100 text-orange-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

//  

  

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
 <LoadingAnimations loading={loading} />

      </div>
    );
  }

  // CRITICAL FIX: Check if data exists and has length
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
              <th className="py-4 pl-6 pr-4 text-[#757575] text-xsx font-[325]">Actions</th>
             </tr>
          </thead>
          <tbody>
            {data.map((gift) => (
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
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(gift.status)}`}
                    >
                      <span>{(gift.status=='pending' ? 'Paused' : gift.status)}</span>
                     {/* <span>
                        {gift.status ? gift.status.charAt(0).toUpperCase() + gift.status.slice(1) : 'Unknown'}
                      </span> */}
                      {/* {onStatusChange && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}  */}
                    </button>
                    
                    {/* {statusDropdownOpen === gift.id && onStatusChange && (
                      <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[140px]">
                        {statusOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (option.value !== gift.status) {
                                onStatusChange(gift.id, option.value);
                              }
                              setStatusDropdownOpen(null);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 ${
                              option.value === gift.status ? 'bg-gray-100 font-medium' : ''
                            }`}
                          >
                            <span>{(option.value)}</span>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )} */}
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
                    <button
                      onClick={() => onDelete?.(gift)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete gift"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 7H20M10 11V16M14 11V16M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="#4F4F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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