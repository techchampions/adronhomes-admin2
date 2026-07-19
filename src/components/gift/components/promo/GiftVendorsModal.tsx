import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { FaBuilding, FaEnvelope, FaMapMarkerAlt, FaPhone, FaTimes, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formatDate } from "../../../../utils/formatdate";
import InputField from "../../../input/inputtext";
import LoadingAnimations from "../../../LoadingAnimations";
import {
  clearSelectedGiftVendor,
  createGiftVendor,
  fetchGiftVendorById,
  fetchGiftVendors,
  GiftVendor,
  GiftVendorPayload,
  selectGiftVendorDetailLoading,
  selectGiftVendorPagination,
  selectGiftVendorSubmitStatus,
  selectGiftVendors,
  selectGiftVendorsLoading,
  selectSelectedGiftVendor,
  setGiftVendorsPage,
} from "../../../Redux/gift/promo/giftVendorSlice";
import { AppDispatch } from "../../../Redux/store";
import Pagination from "../../../Tables/Pagination";

interface GiftVendorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialForm: GiftVendorPayload = {
  name: "",
  phone: "",
  email: "",
  lga: "",
  address: "",
  state: "",
};

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

export default function GiftVendorsModal({ isOpen, onClose }: GiftVendorsModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const vendors = useSelector(selectGiftVendors);
  const pagination = useSelector(selectGiftVendorPagination);
  const loading = useSelector(selectGiftVendorsLoading);
  const detailLoading = useSelector(selectGiftVendorDetailLoading);
  const submitStatus = useSelector(selectGiftVendorSubmitStatus);
  const selectedVendor = useSelector(selectSelectedGiftVendor);
  const [form, setForm] = useState<GiftVendorPayload>(initialForm);
  const [touched, setTouched] = useState(false);

  const isSubmitting = submitStatus === "loading";

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchGiftVendors({ page: 1, per_page: pagination.perPage }));
    } else {
      dispatch(clearSelectedGiftVendor());
      setForm(initialForm);
      setTouched(false);
    }
  }, [dispatch, isOpen]);

  const formErrors = useMemo(() => {
    const errors: Partial<Record<keyof GiftVendorPayload, string>> = {};
    if (!form.name.trim()) errors.name = "Vendor name is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email";
    }
    if (!form.state.trim()) errors.state = "State is required";
    if (!form.lga.trim()) errors.lga = "LGA is required";
    if (!form.address.trim()) errors.address = "Address is required";
    return errors;
  }, [form]);

  if (!isOpen) return null;

  const handleChange =
    (field: keyof GiftVendorPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);

    if (Object.keys(formErrors).length > 0) return;

    try {
      const response = await dispatch(createGiftVendor(form)).unwrap();
      toast.success(response.message || "Vendor created successfully");
      setForm(initialForm);
      setTouched(false);
      dispatch(fetchGiftVendors({ page: 1, per_page: pagination.perPage }));
    } catch (error: any) {
      toast.error(error || "Failed to create vendor");
    }
  };

  const handleVendorClick = (vendor: GiftVendor) => {
    dispatch(fetchGiftVendorById(vendor.id));
  };

  const handlePageChange = (page: number) => {
    dispatch(setGiftVendorsPage(page));
    dispatch(fetchGiftVendors({ page, per_page: pagination.perPage }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.35)] p-4">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[30px] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="font-[350] text-2xl text-dark">Pickup Vendors</h2>
            <p className="mt-1 font-[325] text-sm text-[#767676]">
              Add and review vendors available for promotional gift pickup.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={handleSubmit} className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="font-[350] text-lg text-dark">Add Vendor</h3>
              <p className="mt-1 font-[325] text-xs text-[#767676]">
                Vendor contact and location details are required for pickup coordination.
              </p>
            </div>

            <div className="space-y-4">
              <InputField
                label="Vendor Name"
                placeholder="Enter vendor name"
                value={form.name}
                onChange={handleChange("name")}
                error={touched && formErrors.name}
              />
              <InputField
                label="Email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange("email")}
                type="email"
                error={touched && formErrors.email}
              />
              <InputField
                label="Phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange("phone")}
                error={touched && formErrors.phone}
              />
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="State"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange("state")}
                  error={touched && formErrors.state}
                />
                <InputField
                  label="LGA"
                  placeholder="LGA"
                  value={form.lga}
                  onChange={handleChange("lga")}
                  error={touched && formErrors.lga}
                />
              </div>
              <InputField
                label="Address"
                placeholder="Enter pickup address"
                value={form.address}
                onChange={handleChange("address")}
                error={touched && formErrors.address}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 h-11 w-full rounded-full bg-[#79B833] px-6 text-sm font-bold text-white hover:bg-[#6aa22c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Vendor"}
            </button>
          </form>

          <div className="min-w-0 space-y-5">
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
                        {["Vendor", "Contact", "Location", "Created"].map((heading) => (
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
                                <p className="font-[325] text-xs text-[#767676]">ID: {vendor.id}</p>
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
                            <p>{vendor.state} / {vendor.lga}</p>
                            <p className="mt-1 flex max-w-[260px] items-center gap-2 truncate text-xs text-[#767676]">
                              <FaMapMarkerAlt className="shrink-0 text-xs" />
                              {vendor.address}
                            </p>
                          </td>
                          <td className="py-4 pr-6 text-sm text-dark">
                            {formatDate(vendor.created_at)}
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

            {(detailLoading || selectedVendor) && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                {detailLoading ? (
                  <LoadingAnimations loading={detailLoading} />
                ) : selectedVendor ? (
                  <>
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-[350] text-lg text-dark">
                          {selectedVendor.name}
                        </h3>
                        <p className="font-[325] text-xs text-[#767676]">
                          {selectedVendor.email} • {selectedVendor.phone}
                        </p>
                      </div>
                      <button
                        onClick={() => dispatch(clearSelectedGiftVendor())}
                        className="rounded-full bg-[#F6F6F8] px-4 py-2 text-xs font-bold text-[#767676]"
                      >
                        Close Details
                      </button>
                    </div>

                    <div className="mb-5 grid gap-3 md:grid-cols-3">
                      <div className="rounded-xl bg-[#F6F6F8] p-3">
                        <p className="text-xs text-[#767676]">State</p>
                        <p className="mt-1 text-sm font-[350] text-dark">{selectedVendor.state}</p>
                      </div>
                      <div className="rounded-xl bg-[#F6F6F8] p-3">
                        <p className="text-xs text-[#767676]">LGA</p>
                        <p className="mt-1 text-sm font-[350] text-dark">{selectedVendor.lga}</p>
                      </div>
                      <div className="rounded-xl bg-[#F6F6F8] p-3">
                        <p className="text-xs text-[#767676]">Gift Requests</p>
                        <p className="mt-1 text-sm font-[350] text-dark">
                          {selectedVendor.gift_requests?.length || 0}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="font-[350] text-sm text-dark">Assigned Gift Requests</p>
                      {(selectedVendor.gift_requests || []).length === 0 ? (
                        <div className="rounded-2xl bg-[#F6F6F8] py-8 text-center text-sm text-[#767676]">
                          No gift requests assigned to this vendor yet.
                        </div>
                      ) : (
                        selectedVendor.gift_requests.map((request) => {
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
                        })
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
