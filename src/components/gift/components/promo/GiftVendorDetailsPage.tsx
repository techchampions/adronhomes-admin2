import { useEffect, useState } from "react";
import {
  FaCopy,
  FaDownload,
  FaEdit,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../../general/Header";
import { formatDate } from "../../../../utils/formatdate";
import LoadingAnimations from "../../../LoadingAnimations";
import ConfirmationModal from "../../../Modals/delete";
import {
  clearSelectedGiftVendor,
  deleteGiftVendor,
  downloadVendorGiftRequests,
  fetchGiftVendorById,
  GiftVendorPayload,
  selectGiftVendorDownloadLoading,
  selectGiftVendorDetailLoading,
  selectGiftVendorSubmitStatus,
  selectSelectedGiftVendor,
  updateGiftVendor,
} from "../../../Redux/gift/promo/giftVendorSlice";
import { AppDispatch } from "../../../Redux/store";
import GiftVendorFormModal from "./GiftVendorFormModal";

const statusClass = (status?: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === "granted" || normalized === "approved") {
    return "bg-[#EAF7EA] text-[#2E9B2E]";
  }
  if (normalized === "pending") {
    return "bg-[#FFF4E8] text-[#FF9131]";
  }
  return "bg-[#F1F1F1] text-[#767676]";
};

export default function GiftVendorDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { vendorId } = useParams<{ vendorId: string }>();
  const vendor = useSelector(selectSelectedGiftVendor);
  const loading = useSelector(selectGiftVendorDetailLoading);
  const downloadLoading = useSelector(selectGiftVendorDownloadLoading);
  const submitStatus = useSelector(selectGiftVendorSubmitStatus);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  const isSubmitting = submitStatus === "loading";

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchGiftVendorById(Number(vendorId)));
    }

    return () => {
      dispatch(clearSelectedGiftVendor());
    };
  }, [dispatch, vendorId]);

  const handleUpdateVendor = async (payload: GiftVendorPayload) => {
    if (!vendor) return;

    try {
      const response = await dispatch(
        updateGiftVendor({ vendorId: vendor.id, payload }),
      ).unwrap();
      toast.success(response.message || "Vendor updated successfully");
      setShowEditModal(false);
      dispatch(fetchGiftVendorById(vendor.id));
    } catch (error: any) {
      toast.error(error || "Failed to update vendor");
    }
  };

  const handleDeleteVendor = async () => {
    if (!vendor) return;

    try {
      const response = await dispatch(deleteGiftVendor(vendor.id)).unwrap();
      toast.success(response.message || "Vendor deleted successfully");
      setShowDeleteModal(false);
      navigate("/promotions/vendors");
    } catch (error: any) {
      toast.error(error || "Failed to delete vendor");
    }
  };

  const handleDownloadReport = async () => {
    if (!vendor) return;

    try {
      const response = await dispatch(
        downloadVendorGiftRequests({
          vendorId: vendor.id,
          startDate,
          endDate,
        }),
      ).unwrap();

      if (response.data?.link) {
        window.open(response.data.link, "_blank", "noopener,noreferrer");
      }

      toast.success(response.message || "PDF generated successfully");
    } catch (error: any) {
      toast.error(error || "Failed to download vendor gift requests");
    }
  };

  const publicVendorLink = vendor?.store_slug
    ? `https://adronhomes.com/vendor/${vendor.store_slug}`
    : "";

  const copyVendorLink = async () => {
    if (!publicVendorLink) return;

    try {
      await navigator.clipboard.writeText(publicVendorLink);
      toast.success("Vendor link copied");
    } catch {
      toast.error("Unable to copy vendor link");
    }
  };

  return (
    <div className="pb-[52px]">
      <Header
        title={vendor ? vendor.name : "Vendor Details"}
        subtitle="Pickup vendor profile and assigned gift requests"
        buttonText="Back to Vendors"
        onButtonClick={() => navigate("/promotions/vendors")}
      />

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        {loading ? (
          <LoadingAnimations loading={loading} />
        ) : !vendor ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#767676]">
            Vendor not found.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#79B833] px-5 text-sm font-bold text-[#79B833]"
              >
                <FaEdit className="text-xs" />
                Edit Vendor
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#D70E0E] px-5 text-sm font-bold text-white"
              >
                <FaTrash className="text-xs" />
                Delete Vendor
              </button>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-[#F6F6F8] p-4">
                  <p className="text-xs text-[#767676]">Email</p>
                  <p className="mt-2 flex items-center gap-2 break-words text-sm font-[350] text-dark">
                    <FaEnvelope className="shrink-0 text-[#767676]" />
                    {vendor.email}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F6F6F8] p-4">
                  <p className="text-xs text-[#767676]">Phone</p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-[350] text-dark">
                    <FaPhone className="text-[#767676]" />
                    {vendor.phone}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F6F6F8] p-4">
                  <p className="text-xs text-[#767676]">Gift Requests</p>
                  <p className="mt-2 text-sm font-[350] text-dark">
                    {vendor.gift_requests?.length || 0}
                  </p>
                </div>
              </div>

              {publicVendorLink && (
                <div className="mt-4 rounded-xl bg-[#F6F6F8] p-4">
                  <p className="text-xs text-[#767676]">Vendor Portal Link</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <p className="break-all text-sm font-[350] text-dark">
                      {publicVendorLink}
                    </p>
                    <button
                      onClick={copyVendorLink}
                      className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-xs font-bold text-[#79B833]"
                    >
                      <FaCopy className="text-xs" />
                      Copy
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 rounded-xl bg-[#F6F6F8] p-4">
                <p className="text-xs text-[#767676]">Pickup Location</p>
                <p className="mt-2 flex items-start gap-2 text-sm font-[350] text-dark">
                  <FaMapMarkerAlt className="mt-1 shrink-0 text-[#767676]" />
                  <span>
                    {vendor.address}
                    <span className="block text-xs font-[325] text-[#767676]">
                      {vendor.state} / {vendor.lga}
                    </span>
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="font-[350] text-lg text-dark">
                  Download Vendor Gift Request
                </h3>
                <p className="mt-1 font-[325] text-xs text-[#767676]">
                  Generate a PDF report for this vendor within a date range.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <div>
                  <label className="mb-2 block text-sm font-[325] text-[#4F4F4F]">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="h-11 w-full rounded-full bg-[#F5F5F5] px-5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-[325] text-[#4F4F4F]">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    className="h-11 w-full rounded-full bg-[#F5F5F5] px-5 text-sm outline-none"
                  />
                </div>
                <button
                  onClick={handleDownloadReport}
                  disabled={downloadLoading || !startDate || !endDate}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#79B833] px-6 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaDownload className="text-xs" />
                  {downloadLoading ? "Generating..." : "Download"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="font-[350] text-lg text-dark">
                  Assigned Gift Requests
                </h3>
                <p className="mt-1 font-[325] text-xs text-[#767676]">
                  Requests currently connected to this vendor.
                </p>
              </div>

              {(vendor.gift_requests || []).length === 0 ? (
                <div className="rounded-2xl bg-[#F6F6F8] py-10 text-center text-sm text-[#767676]">
                  No gift requests assigned to this vendor yet.
                </div>
              ) : (
                <div className="grid gap-4">
                  {vendor.gift_requests.map((request) => {
                    const userName =
                      `${request.user?.first_name || ""} ${request.user?.last_name || ""}`.trim() ||
                      "N/A";

                    return (
                      <div
                        key={request.id}
                        className="rounded-2xl border border-gray-100 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="flex items-center gap-2 font-[350] text-sm text-dark">
                              <FaUser className="text-xs text-[#767676]" />
                              {userName}
                            </p>
                            <p className="mt-1 text-xs text-[#767676]">
                              Promo: {request.promo?.name || "N/A"}
                            </p>
                            <p className="mt-1 text-xs text-[#767676]">
                              Processed: {request.processed_at || "N/A"} • Created:{" "}
                              {formatDate(request.created_at)}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-[350] ${statusClass(
                              request.status,
                            )}`}
                          >
                            {request.status || "N/A"}
                          </span>
                        </div>
                        {request.user_note && (
                          <p className="mt-3 text-sm leading-6 text-[#4F4F4F]">
                            {request.user_note}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <GiftVendorFormModal
        isOpen={showEditModal}
        title="Edit Pickup Vendor"
        submitText="Update Vendor"
        loading={isSubmitting}
        initialVendor={vendor}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateVendor}
      />
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Vendor"
        description="Are you sure you want to delete this vendor?"
        subjectName={vendor?.name}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteVendor}
        loading={isSubmitting}
        confirmButtonText="Delete"
      />
    </div>
  );
}
