import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import Header from "../../general/Header";
import { formatDate } from "../../utils/formatdate";
import { useEstatePaths } from "./estatePaths";
import AddEstatePersonnelModal from "./AddEstatePersonnelModal";
import {
  EstatePersonnel,
  fetchEstatePersonnel,
  personnelRoleName,
} from "./estatePersonnelApi";

export default function EstatePersonnelPage() {
  const navigate = useNavigate();
  const estatePaths = useEstatePaths();
  const { estateId } = useParams();
  const numericEstateId = Number(estateId);
  const [personnel, setPersonnel] = useState<EstatePersonnel[]>([]);
  const [estateName, setEstateName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!Number.isFinite(numericEstateId)) {
        setLoading(false);
        setError("Select an estate community.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const record = await fetchEstatePersonnel(numericEstateId);
        if (!active) return;
        setEstateName(record.estate?.estate_name || "Estate community");
        setPersonnel(record.personnel || []);
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load Security Personnels",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [numericEstateId, refreshKey]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return personnel;
    return personnel.filter((person) =>
      [person.first_name, person.last_name, person.email, person.phone_number, personnelRoleName(person.role)]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [personnel, search]);

  return (
    <div className="pb-14">
      <Header
        title={estateName ? `${estateName} · Security Personnels` : "Security Personnels"}
        subtitle="Security Personnels created for this estate community"
        history={true}
        showSearchAndButton={false}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 px-4 lg:pl-[38px] lg:pr-[68px]">
        <button
          type="button"
          onClick={() => navigate(estatePaths.users(numericEstateId))}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#79B833] bg-white px-5 text-sm font-bold text-[#79B833] hover:bg-[#79B833]/10"
        >
          <IoArrowBackSharp />
          Estate Community
        </button>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="h-11 rounded-full bg-[#272727] px-5 text-sm font-bold text-white"
        >
          Add Security Personnels
        </button>
      </div>

      <div className="px-4 lg:pl-[38px] lg:pr-[68px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#888888]">
            {personnel.length} Security Personnels
          </p>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Security Personnels"
            className="h-11 w-full max-w-xs rounded-full bg-white px-4 text-sm outline-none"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-[24px] bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center text-sm text-[#767676]">
            Loading Security Personnels
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center text-sm text-[#767676]">
            {personnel.length === 0
              ? "No Security Personnels have been created for this estate community."
              : "No Security Personnels match that search."}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="text-xs text-[#888888]">
                    <th className="px-5 py-4 font-medium">Name</th>
                    <th className="px-5 py-4 font-medium">Role</th>
                    <th className="px-5 py-4 font-medium">Email</th>
                    <th className="px-5 py-4 font-medium">Phone</th>
                    <th className="px-5 py-4 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((person) => (
                    <tr key={person.id} className="border-t border-[#F3F3F3]">
                      <td className="px-5 py-4 text-sm font-medium text-[#272727]">
                        {`${person.first_name || ""} ${person.last_name || ""}`.trim() ||
                          "Security Personnels"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#79B833]/15 px-3 py-1 text-xs font-medium text-[#4d7a1f]">
                          {personnelRoleName(person.role)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#767676]">
                        {person.email || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#272727]">
                        {person.phone_number || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#888888]">
                        {formatDate(person.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AddEstatePersonnelModal
        isOpen={showAdd}
        estateId={numericEstateId}
        estateName={estateName}
        onClose={() => setShowAdd(false)}
        onCreated={() => setRefreshKey((value) => value + 1)}
      />
    </div>
  );
}
