import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  FaCheck,
  FaEnvelope,
  FaGift,
  FaMapMarkerAlt,
  FaPhone,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../Modals/delete";
import LoadingAnimations from "../../../LoadingAnimations";
import Pagination from "../../../Tables/Pagination";
import { formatDate } from "../../../../utils/formatdate";

const publicVendorApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
    device_id: "1010l0010l1",
  },
});

interface PublicVendor {
  id: number;
  name: string;
  store_slug: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  lga: string;
}

interface VendorGiftRequest {
  id: number;
  user?: {
    first_name: string;
    last_name: string;
    full_name: string;
    phone_number: string;
    email: string;
  } | null;
  gift?: {
    id: number | null;
    name: string | null;
    type: string | null;
  } | null;
  status: string;
  user_note: string;
  pickup_date: string | null;
  collected_at: string | null;
  created_at: string;
}

interface VendorPortalData {
  vendor: PublicVendor;
  is_authorized?: boolean;
  message?: string;
  stats?: {
    total: number;
    pending: number;
    collected: number;
  };
  list?: {
    current_page: number;
    data: VendorGiftRequest[];
    per_page: number;
    total: number;
    last_page: number;
  };
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

const statusClass = (status?: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === "collected") return "bg-[#EAF7EA] text-[#2E9B2E]";
  if (normalized === "granted" || normalized === "pending") {
    return "bg-[#FFF4E8] text-[#FF9131]";
  }
  if (normalized === "rejected") return "bg-[#FDECEC] text-[#D70E0E]";
  return "bg-[#F1F1F1] text-[#767676]";
};

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "granted", label: "Granted" },
  { value: "collected", label: "Collected" },
  { value: "rejected", label: "Rejected" },
];

export default function VendorPortalPage() {
  const { link } = useParams<{ link: string }>();
  const [accessCode, setAccessCode] = useState("");
  const [authorizedAccessCode, setAuthorizedAccessCode] = useState("");
  const [portalData, setPortalData] = useState<VendorPortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [requestToCollect, setRequestToCollect] =
    useState<VendorGiftRequest | null>(null);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    status: "all",
    search: "",
    page: 1,
  });

  const isAuthorized = Boolean(portalData?.list);
  const vendor = portalData?.vendor;
  const requests = portalData?.list?.data || [];

  const pagination = useMemo(
    () => ({
      currentPage:
        portalData?.pagination?.current_page || portalData?.list?.current_page || 1,
      totalPages:
        portalData?.pagination?.last_page || portalData?.list?.last_page || 1,
      totalItems: portalData?.pagination?.total || portalData?.list?.total || 0,
      perPage: portalData?.pagination?.per_page || portalData?.list?.per_page || 20,
    }),
    [portalData],
  );

  const fetchVendorPortal = async (options?: {
    access?: string;
    page?: number;
    silent?: boolean;
  }) => {
    if (!link) return;

    if (!options?.silent) setLoading(true);

    try {
      const response = await publicVendorApi.get("/api/vendor", {
        params: {
          link,
          access: options?.access,
          from: options?.access ? filters.from || undefined : undefined,
          to: options?.access ? filters.to || undefined : undefined,
          status:
            options?.access && filters.status !== "all"
              ? filters.status
              : undefined,
          search: options?.access ? filters.search || undefined : undefined,
          page: options?.page || filters.page,
        },
      });

      if (response.data?.success) {
        setPortalData(response.data.data);
      } else {
        toast.error(response.data?.message || "Unable to load vendor store");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Unable to load vendor store",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorPortal();
  }, [link]);

  const handleAccessSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!accessCode.trim()) {
      toast.warning("Please enter access code");
      return;
    }

    setAuthorizedAccessCode(accessCode.trim());
    await fetchVendorPortal({ access: accessCode.trim(), page: 1 });
  };

  const handleApplyFilter = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!authorizedAccessCode) return;
    setFilters((current) => ({ ...current, page: 1 }));
    await fetchVendorPortal({ access: authorizedAccessCode, page: 1 });
  };

  const handlePageChange = async (page: number) => {
    setFilters((current) => ({ ...current, page }));
    await fetchVendorPortal({ access: authorizedAccessCode, page });
  };

  const handleCollect = async () => {
    if (!requestToCollect || !vendor) return;
    setCollecting(true);

    try {
      const response = await publicVendorApi.post("/api/vendor/collect", {
        request_id: requestToCollect.id,
        vendor_id: vendor.id,
      });

      if (response.data?.success) {
        toast.success(response.data.message || "Gift marked as collected");
        setRequestToCollect(null);
        await fetchVendorPortal({
          access: authorizedAccessCode,
          page: pagination.currentPage,
          silent: true,
        });
      } else {
        toast.error(response.data?.message || "Failed to mark gift collected");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to mark gift collected",
      );
    } finally {
      setCollecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6 rounded-[28px] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#79B833]">
                Vendor Portal
              </p>
              <h1 className="mt-2 text-3xl font-[350] text-dark">
                {vendor?.name || "Checking vendor store"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#767676]">
                View and manage promotional gift pickup requests assigned to this vendor.
              </p>
            </div>
            {vendor && (
              <div className="rounded-2xl bg-[#F6F6F8] p-4 text-sm text-dark">
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-[#767676]" /> {vendor.email}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <FaPhone className="text-[#767676]" /> {vendor.phone}
                </p>
                <p className="mt-2 flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 text-[#767676]" />
                  <span>
                    {vendor.address}
                    <span className="block text-xs text-[#767676]">
                      {vendor.state} / {vendor.lga}
                    </span>
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {loading && !portalData ? (
          <div className="rounded-[28px] bg-white p-10">
            <LoadingAnimations loading={loading} />
          </div>
        ) : vendor && !isAuthorized ? (
          <div className="mx-auto max-w-xl rounded-[28px] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-[350] text-dark">Access Code Required</h2>
            <p className="mt-2 text-sm text-[#767676]">
              {portalData?.message || "Please provide access code to view gift requests"}
            </p>
            <form onSubmit={handleAccessSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-[325] text-[#4F4F4F]">
                  Access Code
                </label>
                <input
                  value={accessCode}
                  onChange={(event) => setAccessCode(event.target.value)}
                  placeholder="Enter access code"
                  className="h-12 w-full rounded-full bg-[#F5F5F5] px-5 text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-full bg-[#79B833] px-6 text-sm font-bold text-white disabled:opacity-50"
              >
                {loading ? "Checking..." : "View Gift Requests"}
              </button>
            </form>
          </div>
        ) : isAuthorized ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-[#767676]">Total Requests</p>
                <p className="mt-2 text-2xl font-[350] text-dark">
                  {portalData?.stats?.total || 0}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-[#767676]">Pending</p>
                <p className="mt-2 text-2xl font-[350] text-dark">
                  {portalData?.stats?.pending || 0}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-[#767676]">Collected</p>
                <p className="mt-2 text-2xl font-[350] text-dark">
                  {portalData?.stats?.collected || 0}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleApplyFilter}
              className="rounded-[24px] bg-white p-5 shadow-sm"
            >
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_1.4fr_auto] md:items-end">
                <div>
                  <label className="mb-2 block text-sm font-[325] text-[#4F4F4F]">
                    From
                  </label>
                  <input
                    type="date"
                    value={filters.from}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        from: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-full bg-[#F5F5F5] px-4 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-[325] text-[#4F4F4F]">
                    To
                  </label>
                  <input
                    type="date"
                    value={filters.to}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        to: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-full bg-[#F5F5F5] px-4 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-[325] text-[#4F4F4F]">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        status: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-full bg-[#F5F5F5] px-4 text-sm outline-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-[325] text-[#4F4F4F]">
                    Search
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-3.5 text-xs text-[#767676]" />
                    <input
                      value={filters.search}
                      onChange={(event) =>
                        setFilters((current) => ({
                          ...current,
                          search: event.target.value,
                        }))
                      }
                      placeholder="Search customer"
                      className="h-11 w-full rounded-full bg-[#F5F5F5] pl-10 pr-4 text-sm outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-full bg-[#79B833] px-6 text-sm font-bold text-white disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </form>

            <div className="rounded-[28px] bg-white p-5 shadow-sm">
              {loading ? (
                <LoadingAnimations loading={loading} />
              ) : requests.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#767676]">
                  No gift requests found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="text-left">
                        {["Customer", "Gift", "Status", "Pickup", "Created", "Action"].map(
                          (heading) => (
                            <th
                              key={heading}
                              className="py-3 pr-6 text-xs font-[325] text-[#757575]"
                            >
                              {heading}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => {
                        const userName =
                          request.user?.full_name ||
                          `${request.user?.first_name || ""} ${request.user?.last_name || ""}`.trim() ||
                          "N/A";

                        return (
                        <tr key={request.id} className="border-t border-gray-100">
                          <td className="py-4 pr-6 text-sm text-dark">
                            <p className="flex items-center gap-2 font-[350]">
                              <FaUser className="text-xs text-[#767676]" />
                              {userName}
                            </p>
                            <p className="mt-1 text-xs text-[#767676]">
                              {request.user?.email || "N/A"}
                            </p>
                            <p className="mt-1 text-xs text-[#767676]">
                              {request.user?.phone_number || "N/A"}
                            </p>
                          </td>
                          <td className="py-4 pr-6 text-sm text-dark">
                            <p className="flex items-center gap-2">
                              <FaGift className="text-xs text-[#767676]" />
                              {request.gift?.name || "N/A"}
                            </p>
                            {request.user_note && (
                              <p className="mt-1 max-w-[280px] truncate text-xs text-[#767676]">
                                {request.user_note}
                              </p>
                            )}
                          </td>
                          <td className="py-4 pr-6 text-sm">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-[350] ${statusClass(
                                request.status,
                              )}`}
                            >
                              {request.status || "N/A"}
                            </span>
                          </td>
                          <td className="py-4 pr-6 text-sm text-dark">
                            {request.pickup_date
                              ? formatDate(request.pickup_date)
                              : "Not set"}
                            {request.collected_at && (
                              <p className="mt-1 text-xs text-[#767676]">
                                Collected: {formatDate(request.collected_at)}
                              </p>
                            )}
                          </td>
                          <td className="py-4 pr-6 text-sm text-dark">
                            {formatDate(request.created_at)}
                          </td>
                          <td className="py-4 pr-6 text-sm">
                            {request.status?.toLowerCase() === "collected" ||
                            request.collected_at ? (
                              <span className="text-xs font-[350] text-[#2E9B2E]">
                                Collected
                              </span>
                            ) : (
                              <button
                                onClick={() => setRequestToCollect(request)}
                                className="inline-flex h-9 items-center gap-2 rounded-full bg-[#79B833] px-4 text-xs font-bold text-white"
                              >
                                <FaCheck className="text-xs" />
                                Mark Collected
                              </button>
                            )}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {pagination.totalPages > 1 && (
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  className="mt-6"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] bg-white p-10 text-center text-sm text-[#767676]">
            Vendor store not found.
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!requestToCollect}
        title="Mark Gift Collected"
        description="Are you sure you want to mark this gift request as collected?"
        subjectName={
          requestToCollect?.user?.full_name ||
          `${requestToCollect?.user?.first_name || ""} ${requestToCollect?.user?.last_name || ""}`.trim()
        }
        onClose={() => setRequestToCollect(null)}
        onConfirm={handleCollect}
        loading={collecting}
        confirmButtonText="Yes, Collect"
        className="bg-[#79B833]"
      />
    </div>
  );
}
