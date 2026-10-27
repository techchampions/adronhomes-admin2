import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import Header from "../../general/Header";
import { useEstatePaths } from "./estatePaths";
import {
  fetchResidentHousehold,
  HouseholdKind,
  HouseholdMember,
} from "./householdApi";

export default function HouseholdPage() {
  const navigate = useNavigate();
  const estatePaths = useEstatePaths();
  const { estateId, userId } = useParams();
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [residentName, setResidentName] = useState("");
  const [estateName, setEstateName] = useState("");
  const [tab, setTab] = useState<HouseholdKind>("family");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      if (!estateId || !userId) {
        setLoading(false);
        setError("Select a resident from an estate community.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const record = await fetchResidentHousehold(Number(estateId), Number(userId));
        if (!active) return;
        const name = `${record.resident.first_name || ""} ${
          record.resident.last_name || ""
        }`.trim();
        setResidentName(name || record.resident.email);
        setEstateName(record.estate?.estate_name || "Estate community");
        setMembers(record.members || []);
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load household",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [estateId, userId]);

  const visible = members.filter((member) => member.kind === tab);
  const familyCount = members.filter((member) => member.kind === "family").length;
  const staffCount = members.filter((member) => member.kind === "staff").length;

  return (
    <div className="pb-14">
      <Header
        title={`${residentName || "Resident"} · Family and Staff`}
        subtitle={`${estateName || "Estate community"}. The resident adds the people in this household.`}
        showSearchAndButton={false}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 px-4 lg:pl-[38px] lg:pr-[68px]">
        <button
          type="button"
          onClick={() => navigate(estatePaths.user(estateId || "", userId || ""))}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#79B833] bg-white px-5 text-sm font-bold text-[#79B833] hover:bg-[#79B833]/10"
        >
          <IoArrowBackSharp />
          Resident
        </button>
      </div>

      <div className="mb-6 grid gap-4 px-4 sm:grid-cols-2 lg:pl-[38px] lg:pr-[68px]">
        <Summary label="Family" value={String(familyCount)} />
        <Summary label="House staff" value={String(staffCount)} />
      </div>

      <div className="px-4 lg:pl-[38px] lg:pr-[68px]">
        <div className="mb-5 flex gap-2">
          {(["family", "staff"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`h-10 rounded-full px-5 text-sm font-medium ${
                tab === item ? "bg-[#79B833] text-white" : "bg-white text-[#767676]"
              }`}
            >
              {item === "family" ? "Family" : "House staff"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-[24px] bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center text-sm text-[#767676]">
            Loading household
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center text-sm text-[#767676]">
            No {tab === "family" ? "family members" : "house staff"} added yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((member) => (
              <article
                key={member.id}
                className="rounded-[28px] border border-[#F0F0F0] bg-white p-5 shadow-sm"
              >
                <p className="text-xs uppercase tracking-wide text-[#888888]">
                  {member.role_label}
                </p>
                <h2 className="mt-1 text-lg font-medium text-[#272727]">
                  {member.full_name}
                </h2>
                <p className="mt-3 text-sm text-[#272727]">{member.phone}</p>
                {member.email && (
                  <p className="mt-1 text-sm text-[#767676]">{member.email}</p>
                )}
                <p className="mt-3 text-xs text-[#888888]">{estateName}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white px-5 py-4 shadow-sm">
      <p className="text-sm text-[#888888]">{label}</p>
      <p className="mt-1 text-2xl font-medium text-[#032147]">{value}</p>
    </div>
  );
}
