import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import { AppDispatch } from "../../components/Redux/store";
import {
  selectAllEstatesData,
  selectAllEstatesError,
  selectAllEstatesLoading,
  selectAllEstatesMetrics,
  selectAllEstatesPagination,
} from "../../components/Redux/estate/estateSlice";
import { fetchAllEstates } from "../../components/Redux/estate/estateThunk";
import EstateTable from "./EstateTable";

export default function Estate() {
  const dispatch = useDispatch<AppDispatch>();
  const estates = useSelector(selectAllEstatesData);
  const metrics = useSelector(selectAllEstatesMetrics);
  const loading = useSelector(selectAllEstatesLoading);
  const error = useSelector(selectAllEstatesError);
  const pagination = useSelector(selectAllEstatesPagination);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllEstates({ page: pagination.currentPage }));
  }, [dispatch, pagination.currentPage]);

  const filteredEstates = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return estates;

    return estates.filter((estate) =>
      [estate.estate_name, estate.property_slug]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [estates, search]);

  return (
    <div className="pb-[52px] relative">
      <Header
        title="Estates"
        subtitle="Manage estates, residents, maintenance and security activity"
        showSearchAndButton={false}
      />

      <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          title="Total Estates"
          value={metrics?.total_estates || 0}
          change="Includes all available estates"
        />
        <MatrixCard
          title="Maintenance Requests"
          value={metrics?.total_maintenance_requests || 0}
          change="All reported maintenance requests"
        />
        <MatrixCard
          title="Pending Requests"
          value={metrics?.pending_maintenance_requests || 0}
          change="Maintenance requests awaiting action"
        />
        <MatrixCard
          title="Security Codes"
          value={metrics?.total_security_codes_generated || 0}
          change="Total generated security codes"
        />
      </div>

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          tabs={["Estate List"]}
          activeTab="Estate List"
          searchPlaceholder="Search Estates"
          onSearch={setSearch}
          showTabs={false}
        >
          {loading ? (
            <LoadingAnimations loading={loading} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : filteredEstates.length === 0 ? (
            <div className="max-h-screen">
              <p className="text-center font-normal text-[#767676]">
                No estate found
              </p>
              <NotFound />
            </div>
          ) : (
            <EstateTable data={filteredEstates} />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}
