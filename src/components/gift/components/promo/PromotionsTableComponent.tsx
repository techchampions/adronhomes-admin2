// PromotionsTableComponent.tsx
import React, { useState, useEffect } from "react";
import { FaGift, FaTrailer, FaEye } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../utils/formatdate";
import ConfirmationModal from "../../../Modals/delete";
import { 
  deletePromo, 
  fetchPromos, 
  selectPromosPagination, 
  selectPromosLoading,
  togglePromoStatus,
  selectAllPromos,
  setPromosPage,
  selectPromosSearch,
  setPromosSearch,
  Promo  // Import the Promo type from the slice
} from "../../../Redux/gift/promo/promoSlice";
import { AppDispatch, RootState } from "../../../Redux/store";
import Pagination from "../../../Tables/Pagination";

// Remove the local PromoData interface - use Promo from slice instead

export default function PromotionsTableComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Get data directly from Redux store
  const data = useSelector(selectAllPromos);
  const pagination = useSelector(selectPromosPagination);
  const promosLoading = useSelector(selectPromosLoading);
  const searchTerm = useSelector(selectPromosSearch);
  
  const deleteState = useSelector((state: RootState) => state.promo);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [togglingStatusId, setTogglingStatusId] = useState<number | null>(null);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Fetch promos when component mounts or when page/search changes
  useEffect(() => {
    dispatch(fetchPromos({ 
      page: pagination?.currentPage || 1, 
      per_page: pagination?.perPage || 12,
      search: searchTerm
    }));
  }, [dispatch, pagination?.currentPage, pagination?.perPage, searchTerm]);

  const handleSearch = () => {
    dispatch(setPromosSearch(localSearch));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const goToPromoDetails = (id: number) => {
    navigate(`/promotions/${id}`);
  };

  const handleEditPromo = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(`/promotions/edit/${id}`);
  };

  const handleViewRequests = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(`/promotions/promotion-requests/${id}`);
  };

  const openDeleteModal = (e: React.MouseEvent, promo: Promo) => {
    e.stopPropagation();
    setSelectedPromo(promo);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPromo) return;
    const result = await dispatch(deletePromo(selectedPromo.id.toString()));
    if (deletePromo.fulfilled.match(result)) {
      setModalOpen(false);
      // Refresh the current page data
      await dispatch(fetchPromos({ 
        page: pagination?.currentPage || 1, 
        per_page: pagination?.perPage || 12,
        search: searchTerm
      }));
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setPromosPage(page));
    // fetchPromos will be triggered by the useEffect
  };

  const handleToggleStatus = async (e: React.MouseEvent, promo: Promo) => {
    e.stopPropagation();
    
    // Don't allow toggling if already toggling
    if (togglingStatusId === promo.id) return;
    
    setTogglingStatusId(promo.id);
    
    try {
      // Dispatch the toggle action - UI will update immediately due to optimistic update in slice
      await dispatch(togglePromoStatus(promo.id.toString())).unwrap();
      // No need to refresh - the slice already updated the state optimistically
    } catch (error) {
      console.error('Failed to toggle status:', error);
    } finally {
      setTogglingStatusId(null);
    }
  };

  const getStatusBadge = (promo: Promo) => {
    if (promo.is_active === 1) {
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>;
    }
    if (promo.is_active === 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Disabled</span>;
    }
    
    return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Draft</span>;
  };

  const getTotalItems = (tiers: any[]) => {
    if (!tiers || tiers.length === 0) return 0;
    let totalItems = 0;
    tiers.forEach(tier => {
      if (tier.reward_groups) {
        tier.reward_groups.forEach((group: any) => {
          if (group.items) {
            totalItems += group.items.length;
          }
        });
      }
    });
    return totalItems;
  };

  const isLoading = deleteState?.submitStatus === 'loading' || promosLoading;

  return (
    <>
      <ConfirmationModal
        isOpen={modalOpen}
        title="Delete Promotion"
        description="Are you sure you want to delete this promotion?"
        subjectName={selectedPromo ? selectedPromo.name : ""}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isLoading}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />

     

      <div className="w-full overflow-x-auto">
        <div className="max-w-[800px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Promotion Name
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Tiers
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Total Items
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Properties
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Created Date
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
              {data && data.length > 0 ? (
                data.map((promo) => {
                  const isActive = promo.is_active === 1;
                  const showToggle = promo.is_active !== undefined;
                  
                  return (
                    <tr 
                      key={promo.id} 
                      className="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
                      onClick={() => goToPromoDetails(promo.id)}
                    >
                      <td className="py-4 text-dark text-sm whitespace-nowrap pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#79B833]/10 rounded-full flex items-center justify-center">
                            <FaGift className="text-[#79B833] text-sm" />
                          </div>
                          <div>
                            <div className="font-medium truncate max-w-48">
                              {promo.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {promo.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-dark text-sm whitespace-nowrap pr-4">
                        <div className="flex items-center gap-1">
                          <FaTrailer className="gray-blue-500 text-xs" />
                          <span className="font-semibold">{promo.tiers?.length || 0}</span>
                          <span className="text-gray-500 text-xs">Tier{promo.tiers?.length !== 1 ? 's' : ''}</span>
                        </div>
                       </td>

                      <td className="py-4 text-dark text-sm whitespace-nowrap pr-4">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{getTotalItems(promo.tiers || [])}</span>
                          <span className="text-gray-500 text-xs">Items</span>
                        </div>
                       </td>

                      <td className="py-4 text-dark text-sm whitespace-nowrap pr-4">
                        <span className="font-semibold">{promo.properties?.length || 0}</span>
                        <span className="text-gray-500 text-xs ml-1">properties</span>
                       </td>

                      <td className="py-4 text-dark text-sm whitespace-nowrap pr-4">
                        {formatDate(promo.created_at)}
                       </td>

                      <td className="py-4 whitespace-nowrap pr-4">
                        <div className="flex items-center gap-3">
                          {getStatusBadge(promo)}
                          {showToggle && (
                            <button
                              onClick={(e) => handleToggleStatus(e, promo)}
                              disabled={togglingStatusId === promo.id}
                              className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#79B833] focus:ring-offset-2
                                ${isActive ? 'bg-[#79B833]' : 'bg-gray-300'}
                                ${togglingStatusId === promo.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                              `}
                            >
                              <span
                                className={`
                                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                  ${isActive ? 'translate-x-6' : 'translate-x-1'}
                                `}
                              />
                              {togglingStatusId === promo.id && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                       </td>

                      <td className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleViewRequests(e, promo.id)}
                           className="px-3 py-1.5 bg-[#79B833]! hover:bg-[#6aa22c] text-white rounded-full text-xs font-mediumtransition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="View Requests"
                          >
                           View Requests
                          </button>
                          <button
                            onClick={(e) => handleEditPromo(e, promo.id)}
                            className="p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit Promotion"
                          >
                            <MdEdit className="text-lgb= text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => openDeleteModal(e, promo)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Promotion"
                          >
                            <MdDelete className="text-lg" />
                          </button>
                          
                        </div>
                       </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    {promosLoading ? 'Loading...' : 'No promotions found. Click "Create Promotion" to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.lastPage > 1 && (
        <div className="w-full">
          <Pagination
            pagination={{
              currentPage: pagination.currentPage,
              totalPages: pagination.lastPage,
              totalItems: pagination.total,
              perPage: pagination.perPage,
            }}
            onPageChange={handlePageChange}
            className="mt-8 mb-4"
          />
        </div>
      )}
    </>
  );
}