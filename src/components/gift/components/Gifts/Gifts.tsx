// src/pages/Gifts/Gifts.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../general/Header';
import { ReusableTable } from '../../../Tables/Table_one';
import { GiftData, SortOption } from '../../type';
import GiftStatsCards from './GiftStatsCards';
import GiftTable from './GiftTable';
import { AppDispatch } from '../../../Redux/store';
import { 
  selectAllGifts, 
  selectGiftStats, 
  selectGiftsLoading, 
  selectGiftsError, 
  selectGiftsPagination, 
  selectGiftsSearch, 
  clearGiftError, 
  clearGiftSuccess, 
  setSearchFilter, 
  setCurrentPage, 
  setStatusFilter 
} from '../../../Redux/gift/gift_slice';
import { fetchGifts, deleteGift, changeGiftState,  } from '../../../Redux/gift/gift_thunk';
import ConfirmationModal from '../../../Modals/delete';
import { toast } from 'react-toastify';

const tabs = ["All Gifts", "Active", "Paused"];

export default function Gifts() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Redux selectors
  const giftsFromRedux = useSelector(selectAllGifts);
  const stats = useSelector(selectGiftStats);
  const loading = useSelector(selectGiftsLoading);
  const error = useSelector(selectGiftsError);
  const pagination = useSelector(selectGiftsPagination);
  const reduxSearch = useSelector(selectGiftsSearch);
  
  // Local state
  const [activeTab, setActiveTab] = useState("All Gifts");
  const [searchQuery, setSearchQuery] = useState(reduxSearch || '');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  
  // State for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [giftToDelete, setGiftToDelete] = useState<GiftData | null>(null);

  // Debug - log what we're getting from Redux
  useEffect(() => {
    console.log('=== COMPONENT: DATA FROM REDUX ===');
    console.log('Raw gifts from Redux:', giftsFromRedux);
    console.log('Number of gifts:', giftsFromRedux?.length);
    console.log('Stats:', stats);
    console.log('Loading:', loading);
    console.log('Pagination:', pagination);
    if (giftsFromRedux && giftsFromRedux.length > 0) {
      console.log('First gift sample:', giftsFromRedux[0]);
    }
  }, [giftsFromRedux, stats, loading, pagination]);

  // Map tab to status value
  const getStatusFromTab = (tab: string): string => {
    switch (tab) {
      case "Active": return "active";
      case "disabled": return "Disabled";
      // case "Inactive": return "inactive";
      default: return "";
    }
  };

  // Fetch gifts when filters change
  useEffect(() => {
    const status = getStatusFromTab(activeTab);
    const params = {
      page: pagination?.currentPage || 1,
      per_page: pagination?.perPage || 20,
      search: reduxSearch || '',
      status: status
    };
    console.log('=== FETCHING GIFTS WITH PARAMS ===', params);
    dispatch(fetchGifts(params));
  }, [dispatch, pagination?.currentPage, pagination?.perPage, reduxSearch, activeTab]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    dispatch(setSearchFilter(query));
    dispatch(setCurrentPage(1));
  }, [dispatch]);

  // Handle tab change
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    const statusValue = getStatusFromTab(tab);
    dispatch(setStatusFilter(statusValue));
    dispatch(setCurrentPage(1));
  }, [dispatch]);

  // Handle edit
  const handleEdit = useCallback((gift: GiftData) => {
    navigate(`/gifts/edit/${gift.id}`, { state: { gift } });
  }, [navigate]);

  // Open delete modal
  const handleDeleteClick = useCallback((gift: GiftData) => {
    setGiftToDelete(gift);
    setIsDeleteModalOpen(true);
  }, []);


//   const handleDelete = useCallback(async (id: number) => {
//     if (window.confirm("Are you sure you want to delete this gift?")) {
//       setDeleteLoading(id);
//       try {
//         await dispatch(deleteGift(id)).unwrap();
//         const status = getStatusFromTab(activeTab);
//         dispatch(fetchGifts({
//           page: pagination?.currentPage || 1,
//           per_page: pagination?.perPage || 20,
//           search: reduxSearch || '',
//           status: status
//         }));
//       } catch (err: any) {
//         alert(err.message || "Failed to delete gift");
//       } finally {
//         setDeleteLoading(null);
//       }
//     }
//   }, [dispatch, pagination?.currentPage, pagination?.perPage, reduxSearch, activeTab]);

  // Close delete modal
  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setGiftToDelete(null);
  }, []);

  // Confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (!giftToDelete) return;
    
    setDeleteLoading(giftToDelete.id);
    try {
      await dispatch(deleteGift(giftToDelete.id)).unwrap();
      const status = getStatusFromTab(activeTab);
      dispatch(fetchGifts({
        page: pagination?.currentPage || 1,
        per_page: pagination?.perPage || 20,
        search: reduxSearch || '',
        status: status
      }));
      toast.success("Gift deleted successfully");
      handleCloseDeleteModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete gift");
    } finally {
      setDeleteLoading(null);
    }
  }, [dispatch, giftToDelete, pagination?.currentPage, pagination?.perPage, reduxSearch, activeTab, handleCloseDeleteModal]);

  // Handle status change
  const handleStatusChange = useCallback(async (id: number, newStatus: string) => {
    try {
      await dispatch(changeGiftState({ id, status: newStatus })).unwrap();
      const status = getStatusFromTab(activeTab);
      // dispatch(fetchGifts({
      //   page: pagination?.currentPage || 1,
      //   per_page: pagination?.perPage || 20,
      //   search: reduxSearch || '',
      //   status: status
      // }));
    } catch (err: any) {
      toast.error(err.message || "Failed to update gift status");
    }
  }, [dispatch, pagination?.currentPage, pagination?.perPage, reduxSearch, activeTab]);

  // Handle view details
  const handleViewDetails = useCallback((id: number) => {
    navigate(`/gifts/${id}`);
  }, [navigate]);

  // Handle create new
  const handleCreateNew = useCallback(() => {
    navigate('/gift-form');
  }, [navigate]);

  // Handle sort
  const handleSort = useCallback((sortOption: SortOption) => {
    console.log("Sort by:", sortOption);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearGiftError());
      dispatch(clearGiftSuccess());
    };
  }, [dispatch]);

  // Transform stats
  const transformedStats = {
    totalGifts: stats?.total || 0,
    totalRequests: stats?.request || 0,
    pendingRequests: stats?.pending || 0,
    activatedGifts: stats?.active || 0,
  };

  // TRANSFORM GIFTS - DIRECT MAPPING WITH NULL CHECKS
  const transformedGifts: GiftData[] = React.useMemo(() => {
    if (!giftsFromRedux || !Array.isArray(giftsFromRedux) || giftsFromRedux.length === 0) {
      console.log('No gifts to transform');
      return [];
    }
    
    console.log('Transforming', giftsFromRedux.length, 'gifts');
    
    return giftsFromRedux.map((gift: any) => ({
      id: gift.id,
      giftName: gift.name || 'Unnamed Gift',
      giftType: gift.type || 'standard',
      estimatedValue: gift.estimated_value || 0,
      totalQuantity: gift.total_quantity || 0,
      quantityPerProperty: gift.quantity_per_property || 0,
      remainingQuantity: gift.remaining_quantity || 0,
      claimedCount: gift.claimed_count || 0,
      measurementUnit: gift.measurement_unit || 'unit',
      status: gift.status || 'inactive',
      startDate: gift.start_date,
      endDate: gift.end_date,
      description: gift.description,
      redemptionInstructions: gift.redemption_instructions,
      termsAndConditions: gift.terms_and_conditions,
      displayImage: gift.display_image,
      metadata: gift.metadata,
      createdAt: gift.created_at,
      updatedAt: gift.updated_at,
      deletedAt: gift.deleted_at
    }));
  }, [giftsFromRedux]);

  console.log('Transformed gifts count:', transformedGifts.length);

  const sortOptions: SortOption[] = [
    { value: "name_asc", name: "Name (A-Z)" },
    { value: "name_desc", name: "Name (Z-A)" },
    { value: "value_high", name: "Highest Value" },
    { value: "value_low", name: "Lowest Value" },
  ];

  return (
    <div className="mb-[52px] relative">
      <Header 
        title="Gifts Management" 
        subtitle="Manage all gift items and their assignments"
        buttonText="Create New Gift"
        onButtonClick={() => handleCreateNew()}
      />
      
      <GiftStatsCards stats={transformedStats} loading={loading} />

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <ReusableTable
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSearch={handleSearch}
          searchPlaceholder="Search gifts by name or type..."
          sort={true}
          sortOptions={sortOptions}
          onSortChange={handleSort}
        >
          <GiftTable 
            data={transformedGifts}
            loading={loading}
            onEdit={handleEdit}
            // onDelete={handleDeleteClick}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
          />
        </ReusableTable>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && giftToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Delete Gift"
          description="Are you sure you want to delete"
          subjectName={giftToDelete.giftName}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading === giftToDelete.id}
          confirmButtonText="Delete Gift"
          cancelButtonText="Cancel"
        />
      )}
    </div>
  );
}