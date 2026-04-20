// src/components/Gifts/GiftRequestsModal.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../Redux/store';
import { 
  fetchGiftRequests, 
  grantGiftRequest, 
  rejectGiftRequest, 
  GiftRequest 
} from '../../../Redux/gift/gift_thunk';
import { 
  selectGiftRequestsPagination,
  setGiftRequestsCurrentPage
} from '../../../Redux/gift/gift_slice';
import GiftRequestsTable from './GiftRequestsTable';

const SimpleConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  description: string;
  subjectName: string;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  confirmButtonText: string;
  cancelButtonText: string;
  actionType:any
}> = ({ isOpen, title, description, subjectName, onClose, onConfirm, loading, confirmButtonText, cancelButtonText,actionType }) => {
  if (!isOpen) return null;
const [isGrant, setIsGrant] =useState(false);


  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-4">
            {/* <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="h-7 w-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div> */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <p className="text-gray-600 mt-1">
                {description} <span className="font-medium">{subjectName}</span>?
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 ">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 text-sm font-medium text-white  disabled:opacity-50 rounded-full ${actionType === 'approve' ? 'bg-[#79B833]' : 'bg-red-600  hover:bg-red-700'}` }
          >
            {loading ? 'Processing...' : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

interface GiftRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftId: number;
  giftName: string;
  propertyId?: number;
}

const GiftRequestsModal: React.FC<GiftRequestsModalProps> = ({ 
  isOpen, 
  onClose, 
  giftId, 
  giftName,
  propertyId 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const pagination = useSelector(selectGiftRequestsPagination);
  
  const [requests, setRequests] = useState<GiftRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('pending');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<GiftRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<any>(null);

  const fetchRequests = async (page: number = 1) => {
    setLoading(true);
    try {
      const params: any = { 
        gift_id: giftId, 
        status: selectedTab,
        page: page,
        per_page: pagination?.perPage || 20
      };
      if (propertyId) params.property_id = propertyId;
      if (searchTerm) params.search = searchTerm;
      if (sortOption) {
        if (sortOption === 'newest') params.sort_by = 'created_at';
        if (sortOption === 'oldest') params.sort_by = 'created_at_asc';
        if (sortOption === 'property') params.sort_by = 'property_name';
      }

      const result = await dispatch(fetchGiftRequests(params)).unwrap();
      setRequests(result.data.data || []);
      setCurrentPage(result.data.current_page || 1);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && giftId) {
      fetchRequests(1);
    }
  }, [isOpen, giftId, selectedTab, propertyId, searchTerm, sortOption]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (option: any) => {
    setSortOption(option);
  };

  const handleAction = (request: GiftRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(type);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !actionType) return;
    
    setActionLoading(selectedRequest.id);
    try {
      if (actionType === 'approve') {
        await dispatch(grantGiftRequest({ requestId: selectedRequest.id, giftId })).unwrap();
      } else {
        await dispatch(rejectGiftRequest({ requestId: selectedRequest.id, giftId })).unwrap();
      }
      await fetchRequests(currentPage);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setActionLoading(null);
      setShowConfirmModal(false);
      setSelectedRequest(null);
      setActionType(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between  px-6 py-5 border-b  border-gray-200">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Gift Requests - {giftName}
              </h3>
              {propertyId && (
                <p className="text-sm text-gray-500 mt-0.5">Property ID: {propertyId}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <GiftRequestsTable 
              requests={requests}
              actionLoading={actionLoading}
              onAction={handleAction}
              loading={loading}
              activeTab={selectedTab}
              onTabChange={handleTabChange}
              onSearch={handleSearch}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Footer */}
          <div className=" px-6 py-4 flex justify-end bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <SimpleConfirmModal
              isOpen={showConfirmModal}
              title={actionType === 'approve' ? 'Grant Gift Request' : 'Reject Gift Request'}
              description={`Are you sure you want to ${actionType === 'approve' ? 'grant' : 'reject'} this gift request for`}
              subjectName={selectedRequest?.property?.name || `Request #${selectedRequest?.id}`}
              onClose={() => {
                  setShowConfirmModal(false);
                  setSelectedRequest(null);
                  setActionType(null);
              } }
              onConfirm={handleConfirmAction}
              loading={actionLoading !== null}
              confirmButtonText={actionType === 'approve' ? 'Yes, Grant' : 'Yes, Reject'}
              cancelButtonText="Cancel" actionType={actionType}      />
    </>
  );
};

export default GiftRequestsModal;