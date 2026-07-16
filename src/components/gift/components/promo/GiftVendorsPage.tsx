import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaTrash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../../general/Header";
import { formatDate } from "../../../../utils/formatdate";
import LoadingAnimations from "../../../LoadingAnimations";
import ConfirmationModal from "../../../Modals/delete";
import {
  createGiftVendor,
  deleteGiftVendor,
  fetchGiftVendors,
  GiftVendor,
  GiftVendorPayload,
  selectGiftVendorPagination,
  selectGiftVendorSubmitStatus,
  selectGiftVendors,
  selectGiftVendorsLoading,
  setGiftVendorsPage,
} from "../../../Redux/gift/promo/giftVendorSlice";
import { AppDispatch } from "../../../Redux/store";
import Pagination from "../../../Tables/Pagination";
import GiftVendorFormModal from "./GiftVendorFormModal";

export default function GiftVendorsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const vendors = useSelector(selectGiftVendors);
  const pagination = useSelector(selectGiftVendorPagination);
  const loading = useSelector(selectGiftVendorsLoading);
  const submitStatus = useSelector(selectGiftVendorSubmitStatus);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<GiftVendor | null>(null);

  const isSubmitting = submitStatus === "loading";

  useEffect(() => {
    dispatch(fetchGiftVendors({ page: pagination.currentPage, per_page: pagination.perPage }));
  }, [dispatch, pagination.currentPage, pagination.perPage]);

  const handleCreateVendor = async (payload: GiftVendorPayload) => {
    try {
      const response = await dispatch(createGiftVendor(payload)).unwrap();
      toast.success(response.message || "Vendor created successfully");
      setShowCreateModal(false);
      dispatch(setGiftVendorsPage(1));
      dispatch(fetchGiftVendors({ page: 1, per_page: pagination.perPage }));
    } catch (error: any) {
      toast.error(error || "Failed to create vendor");
    }
  };

  const handleVendorClick = (vendor: GiftVendor) => {
    navigate(`/promotions/vendors/${vendor.id}`);
  };

  const handlePageChange = (page: number) => {
    dispatch(setGiftVendorsPage(page));
  };

  const handleDeleteVendor = async () => {
    if (!vendorToDelete) return;

    try {
      const response = await dispatch(deleteGiftVendor(vendorToDelete.id)).unwrap();
      toast.success(response.message || "Vendor deleted successfully");
      setVendorToDelete(null);
      dispatch(
        fetchGiftVendors({
          page: pagination.currentPage,
          per_page: pagination.perPage,
        }),
      );
    } catch (error: any) {
      toast.error(error || "Failed to delete vendor");
    }
  };

  return (
    <div className="pb-[52px]">
      <Header
        title="Pickup Vendors"
        subtitle="Create and manage vendors for promotional gift pickup"
        buttonText="Add Vendor"
        onButtonClick={() => setShowCreateModal(true)}
        personel
        Personnel_Text="Back to Promotions"
        onPersonelButtonClick={() => navigate("/promotions")}
      />

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-[350] text-lg text-dark">Vendors</h3>
              <p className="font-[325] text-xs text-[#767676]">
                {pagination.total} vendor{pagination.total === 1 ? "" : "s"} available
              </p>
            </div>
          </div>

          {loading ? (
            <LoadingAnimations loading={loading} />
          ) : vendors.length === 0 ? (
            <div className="rounded-2xl bg-[#F6F6F8] py-10 text-center text-sm text-[#767676]">
              No pickup vendors have been added yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left">
                    {["Vendor", "Contact", "Location", "Created", "Action"].map((heading) => (
                      <th
                        key={heading}
                        className="py-3 pr-6 font-[325] text-xs text-[#757575]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      onClick={() => handleVendorClick(vendor)}
                      className="cursor-pointer border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 pr-6 text-sm text-dark">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#79B833]/10">
                            <FaBuilding className="text-xs text-[#79B833]" />
                          </span>
                          <div>
                            <p className="font-[350]">{vendor.name}</p>
                            <p className="font-[325] text-xs text-[#767676]">
                              ID: {vendor.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-sm text-dark">
                        <p className="flex items-center gap-2">
                          <FaEnvelope className="text-xs text-[#767676]" />
                          {vendor.email}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-[#767676]">
                          <FaPhone className="text-xs" />
                          {vendor.phone}
                        </p>
                      </td>
                      <td className="py-4 pr-6 text-sm text-dark">
                        <p>
                          {vendor.state} / {vendor.lga}
                        </p>
                        <p className="mt-1 flex max-w-[360px] items-center gap-2 truncate text-xs text-[#767676]">
                          <FaMapMarkerAlt className="shrink-0 text-xs" />
                          {vendor.address}
                        </p>
                      </td>
                      <td className="py-4 pr-6 text-sm text-dark">
                        {formatDate(vendor.created_at)}
                      </td>
                      <td className="py-4 pr-6 text-sm text-dark">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setVendorToDelete(vendor);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#D70E0E] hover:bg-red-50"
                          title="Delete vendor"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.lastPage > 1 && (
            <Pagination
              pagination={{
                currentPage: pagination.currentPage,
                totalPages: pagination.lastPage,
                totalItems: pagination.total,
                perPage: pagination.perPage,
              }}
              onPageChange={handlePageChange}
              className="mt-6"
            />
          )}
        </div>
      </div>

      <GiftVendorFormModal
        isOpen={showCreateModal}
        title="Add Pickup Vendor"
        submitText="Create Vendor"
        loading={isSubmitting}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateVendor}
      />
      <ConfirmationModal
        isOpen={!!vendorToDelete}
        title="Delete Vendor"
        description="Are you sure you want to delete this vendor?"
        subjectName={vendorToDelete?.name}
        onClose={() => setVendorToDelete(null)}
        onConfirm={handleDeleteVendor}
        loading={isSubmitting}
        confirmButtonText="Delete"
      />
    </div>
  );
}
