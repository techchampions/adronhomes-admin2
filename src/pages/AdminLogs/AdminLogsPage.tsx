import { useEffect, useState } from "react";
import Header from "../../general/Header";
import {
  AdminActionLog,
  fetchAdminActionLog,
  fetchAdminActionLogs,
} from "./adminLogsApi";

function when(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusTone(code?: number | null) {
  if (!code) return "text-[#888888]";
  if (code >= 200 && code < 300) return "text-[#79B833]";
  if (code >= 400) return "text-[#D64545]";
  return "text-[#FF9131]";
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminActionLog[]>([]);
  const [modules, setModules] = useState<string[]>([]);
  const [selected, setSelected] = useState<AdminActionLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [module, setModule] = useState("");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = async (nextPage = page) => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchAdminActionLogs({
        page: nextPage,
        per_page: 25,
        module: module || undefined,
        search: search.trim() || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      setLogs(result.page.data || []);
      setModules(result.modules || []);
      setPage(result.page.current_page || 1);
      setLastPage(result.page.last_page || 1);
      setTotal(result.page.total || 0);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load admin action logs",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const openDetail = async (id: number) => {
    setDetailLoading(true);
    setError("");
    try {
      const row = await fetchAdminActionLog(id);
      setSelected(row);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load this log",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="pb-[52px]">
      <Header
        title="Admin Logs"
        subtitle="Track what each personnel does across the admin dashboard"
      />

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] space-y-5">
        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search actor, description, endpoint"
              className="h-11 rounded-full border border-gray-200 px-4 text-sm outline-none focus:border-[#79B833]"
            />
            <select
              value={module}
              onChange={(event) => setModule(event.target.value)}
              className="h-11 rounded-full border border-gray-200 px-4 text-sm outline-none focus:border-[#79B833]"
            >
              <option value="">All modules</option>
              {modules.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="h-11 rounded-full border border-gray-200 px-4 text-sm outline-none focus:border-[#79B833]"
            />
            <input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="h-11 rounded-full border border-gray-200 px-4 text-sm outline-none focus:border-[#79B833]"
            />
            <button
              type="button"
              onClick={() => load(1)}
              className="h-11 rounded-full bg-[#032147] px-5 text-sm font-bold text-white"
            >
              Apply filters
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="font-[350] text-lg text-[#272727]">Activity feed</p>
                <p className="text-sm text-[#767676]">
                  {loading ? "Loading..." : `${total} logged action${total === 1 ? "" : "s"}`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-2xl bg-gray-100"
                  />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#767676]">
                No admin actions found for the selected filters.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <button
                    key={log.id}
                    type="button"
                    onClick={() => openDetail(log.id)}
                    className={`w-full px-5 py-4 text-left transition hover:bg-[#F8FAF5] ${
                      selected?.id === log.id ? "bg-[#F3F8EC]" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium capitalize text-[#272727]">
                          {log.description}
                        </p>
                        <p className="mt-1 text-sm text-[#767676]">
                          {log.actor_name || "Unknown"} ({log.actor_personnel || "personnel"})
                          {" • "}
                          {log.module}
                          {" • "}
                          {log.action}
                        </p>
                        <p className="mt-1 text-xs text-[#888888]">
                          {when(log.created_at)}
                          {log.endpoint ? ` • ${log.method} ${log.endpoint}` : ""}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold ${statusTone(log.status_code)}`}>
                        {log.status_code || "—"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {lastPage > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => load(page - 1)}
                  className="h-10 rounded-full border border-gray-200 px-4 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <p className="text-sm text-[#767676]">
                  Page {page} of {lastPage}
                </p>
                <button
                  type="button"
                  disabled={page >= lastPage || loading}
                  onClick={() => load(page + 1)}
                  className="h-10 rounded-full border border-gray-200 px-4 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <p className="font-[350] text-lg text-[#272727]">Action details</p>
            {detailLoading ? (
              <p className="mt-4 text-sm text-[#767676]">Loading details...</p>
            ) : !selected ? (
              <p className="mt-4 text-sm text-[#767676]">
                Select an activity item to inspect who did what, where, and with
                which payload.
              </p>
            ) : (
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#888888]">
                    Description
                  </p>
                  <p className="mt-1 font-medium capitalize text-[#032147]">
                    {selected.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#888888]">
                      Actor
                    </p>
                    <p className="mt-1 text-[#272727]">
                      {selected.actor_name || "Unknown"}
                    </p>
                    <p className="text-xs text-[#767676]">
                      {selected.actor_email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#888888]">
                      Role
                    </p>
                    <p className="mt-1 capitalize text-[#272727]">
                      {selected.actor_personnel || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#888888]">
                      Module
                    </p>
                    <p className="mt-1 capitalize text-[#272727]">
                      {selected.module}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#888888]">
                      Action
                    </p>
                    <p className="mt-1 capitalize text-[#272727]">
                      {selected.action}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#888888]">
                      Entity
                    </p>
                    <p className="mt-1 text-[#272727]">
                      {selected.entity_type || "—"}
                      {selected.entity_id ? ` #${selected.entity_id}` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#888888]">
                      When
                    </p>
                    <p className="mt-1 text-[#272727]">
                      {when(selected.created_at)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#888888]">
                    Request
                  </p>
                  <p className="mt-1 break-all text-[#272727]">
                    {selected.method} {selected.endpoint}
                  </p>
                  <p className="mt-1 text-xs text-[#767676]">
                    Status {selected.status_code || "—"} • IP{" "}
                    {selected.ip_address || "—"}
                  </p>
                </div>
                {selected.payload && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#888888]">
                      Payload
                    </p>
                    <pre className="mt-2 max-h-72 overflow-auto rounded-2xl bg-[#F7F7F7] p-3 text-xs text-[#272727]">
                      {JSON.stringify(selected.payload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
