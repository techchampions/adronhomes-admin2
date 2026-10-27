import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Copy, ShieldCheck } from "lucide-react";
import Header from "../../general/Header";
import LoadingAnimations from "../../components/LoadingAnimations";
import Pagination from "../../components/Tables/Pagination";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { getUser } from "../../components/Redux/User/user_Thunk";
import {
  AssignedEstate,
  AssignedSecurityCode,
  fetchAssignedSecurityCodes,
} from "../../components/Redux/estate/estateThunk";
import { formatDate } from "../../utils/formatdate";
import SecurityCodePass from "../../components/security/SecurityCodePass";

const statusStyles: Record<string, string> = {
  Active: "bg-[#79B833]/15 text-[#4d7a1f]",
  Expired: "bg-red-50 text-red-600",
  "Fully Used": "bg-amber-50 text-amber-700",
};

export default function SecurityCodesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const personnel = useSelector((state: RootState) => state.user.user);
  const [codes, setCodes] = useState<AssignedSecurityCode[]>([]);
  const [estates, setEstates] = useState<AssignedEstate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    totalItems: 0,
    totalPages: 1,
  });

  const loadCodes = (page: number) => {
    setLoading(true);
    setError(null);

    dispatch(fetchAssignedSecurityCodes({ page, per_page: 12 }))
      .unwrap()
      .then((response) => {
        const pageData = response.data;
        setCodes(pageData.data || []);
        setEstates(response.estates || []);
        setPagination({
          currentPage: Number(pageData.current_page) || 1,
          perPage: Number(pageData.per_page) || 12,
          totalItems: Number(pageData.total) || 0,
          totalPages: Number(pageData.last_page) || 1,
        });
      })
      .catch((err: { message?: string }) => {
        setCodes([]);
        setError(err?.message || "Failed to fetch security codes");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCodes(1);
    if (!personnel) {
      dispatch(getUser());
    }
  }, []);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied");
    } catch {
      toast.error("Could not copy code");
    }
  };

  const estateLabel =
    estates.map((estate) => estate.estate_name).filter(Boolean).join(", ") ||
    "Assigned estate";
  const personnelName = [personnel?.first_name, personnel?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="pb-14">
      <Header
        title={personnelName ? `${personnelName} · Security Codes` : "Security Codes"}
        subtitle={estateLabel}
        showSearchAndButton={false}
      />

      <div className="lg:pl-[38px] lg:pr-[68px] px-4">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Assigned estates" value={estates.length} />
          <SummaryCard label="Security codes" value={pagination.totalItems} />
          <SummaryCard
            label="Active on this page"
            value={codes.filter((code) => code.status_label === "Active").length}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingAnimations loading={loading} />
          </div>
        ) : error ? (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-base font-medium text-red-600">{error}</p>
          </div>
        ) : codes.length === 0 ? (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center shadow-sm">
            <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-[#79B833]" />
            <p className="text-base font-medium text-[#272727]">
              No security codes yet
            </p>
            <p className="mt-1 text-sm text-[#767676]">
              Codes for {estateLabel} will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {codes.map((code) => {
                const limit = Number(code.limit) || 0;
                const used = Number(code.total_used) || 0;
                const remaining = Number(code.remaining_uses) || 0;
                const usage = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;

                return (
                  <article
                    key={code.id}
                    className="rounded-[28px] border border-[#F0F0F0] bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-[#888888]">
                          {code.estate_name || estateLabel}
                        </p>
                        <h2 className="mt-1 text-lg font-medium text-[#272727]">
                          {code.name || "Untitled code"}
                        </h2>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[code.status_label] ||
                          "bg-gray-100 text-[#767676]"
                        }`}
                      >
                        {code.status_label || "Unknown"}
                      </span>
                    </div>

                    <div className="mt-5">
                      <SecurityCodePass
                        code={code.code}
                        name={code.name}
                        estateName={code.estate_name || estateLabel}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F7F8F6] px-4 py-3">
                      <p className="font-mono text-xl tracking-[0.18em] text-[#032147]">
                        {code.code || "N/A"}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyCode(code.code)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#767676] hover:bg-white hover:text-[#272727]"
                        aria-label="Copy security code"
                      >
                        <Copy size={16} />
                      </button>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F0F0F0]">
                      <div
                        className="h-full rounded-full bg-[#79B833]"
                        style={{ width: `${usage}%` }}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                      <Metric label="Limit" value={limit} />
                      <Metric label="Used" value={used} />
                      <Metric label="Left" value={remaining} />
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#F3F3F3] pt-4 text-xs text-[#888888]">
                      <span>Expires {formatDate(code.expired_at)}</span>
                      <span>
                        {code.created_by_full_name ||
                          `${code.created_by_first_name || ""} ${
                            code.created_by_last_name || ""
                          }`.trim() ||
                          "Unknown"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                pagination={pagination}
                onPageChange={loadCodes}
                className="mt-8"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] bg-white px-5 py-4 shadow-sm">
      <p className="text-sm text-[#888888]">{label}</p>
      <p className="mt-1 text-2xl font-medium text-[#032147]">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-[#888888]">{label}</p>
      <p className="mt-1 font-medium text-[#272727]">{value}</p>
    </div>
  );
}
