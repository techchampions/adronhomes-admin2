// PromoRequestsTab.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchPromoRequests, 
  selectPromoRequests, 
  selectPromoRequestsStats, 
  selectPromoRequestsLoading,
  selectPromoRequestsPagination,
  setPromoRequestsPage
} from "../../../Redux/gift/promo/promoRequestsSlice";
import { AppDispatch } from "../../../Redux/store";
import PromoRequestsTableComponent from "./PromoRequestsTableComponent";
// import Pagination from "../../../Pagination";
import LoadingAnimations from "../../../LoadingAnimations";
import Pagination from "../../../Tables/Pagination";
import { data, useParams } from "react-router-dom";
import Header from "../../../../general/Header";
import { MatrixCardGreen, MatrixCard } from "../../../firstcard";

interface PromoRequestsTabProps {
  promoId: string | number;
}

export default function PromoRequestsTab() {
  const dispatch = useDispatch<AppDispatch>();
  const requests = useSelector(selectPromoRequests);
  const stats = useSelector(selectPromoRequestsStats);
  const isLoading = useSelector(selectPromoRequestsLoading);
  const pagination = useSelector(selectPromoRequestsPagination);
  const [searchTerm, setSearchTerm] = useState<string>('');
 const {id}= useParams<{id:string}>()
  const [statusFilter, setStatusFilter] = useState<string>('all');
const promoId = id || '';
  useEffect(() => {
    fetchRequests();
  }, [promoId, pagination.currentPage, statusFilter,searchTerm]);

  const fetchRequests = () => {
    dispatch(fetchPromoRequests({
      promoId: promoId,
      page: pagination.currentPage,
      per_page: pagination.perPage,
      status: statusFilter === 'all' ? '' : statusFilter,
      search: searchTerm
    }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPromoRequestsPage(page));
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    dispatch(setPromoRequestsPage(1));
  };

  if (isLoading && requests.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingAnimations loading={true} />
      </div>
    );
  }

  return (
       <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">

 <Header
        title="Promotion Request(s)"
        subtitle="Manage Requests for this Promotion"
        // buttonText="Export"
        showSearchAndButton={false}
        // onButtonClick={openCustomersModal}
      />
     {stats && (   <div className="grid md:grid-cols-4 gap-[20px]  mb-[30px]">
        <MatrixCardGreen
          title="Total Requests"
          change="includes all Requests"
          value={stats.total|| 0}
        />

        <MatrixCard
          title="Total approved Requests"
          value={stats.approved || 0}
          change="includes all approved requests"
        />
        <MatrixCard
          title="Total Disapproved Requests"
          value={stats.disapproved || 0}
          change="includes all disapproved requests"
        />
           <MatrixCard
          title="Total Pending Requests"
          value={stats.pending || 0}
          change="includes all pending requests"
        />
      </div>)}


     
      {/* Requests Table */}
      <PromoRequestsTableComponent 
        data={requests} 
        promoId={promoId}
        onRefresh={fetchRequests}
        onTabChange={handleStatusFilterChange}
        activeTab={statusFilter}
        
         onSearch={(value) => {
          setSearchTerm(value);
        }}

      />

      {/* Pagination */}
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
            className="mt-4"
          />
        </div>
      )}
    </div>
  );
}