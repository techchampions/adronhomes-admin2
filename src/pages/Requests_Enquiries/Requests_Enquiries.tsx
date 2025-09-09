import React, { useState } from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import PropertyTableComponent from "./Requests_Enquiries_Tables";
import {
  useGetDirectorDashboard,
  useGetPropertyRequest,
} from "../../utils/hooks/query";
import SoosarPagination from "../../components/SoosarPagination";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";

export default function Requests_Enquiries() {
  const [page, setpage] = useState(1);
  const {
    data: directorData,
    isLoading: loadingDR,
    isError: errorDR,
  } = useGetDirectorDashboard();
  const isDirectorRoute = location.pathname.startsWith("/director");
  const director_id = isDirectorRoute ? directorData?.director.id : undefined;
  const { data, isLoading, isError } = useGetPropertyRequest(page, director_id);
  const propertyData = data?.data.data || [];
  const totalPages = data?.data.last_page || 1;
  const tab = ["Requests"];
  return (
    <div className="pb-[52px]">
      <Header
        title="Requests & Enquiries"
        subtitle="Attend to requests and enquiries on properties"
        history={true}
         showSearchAndButton={false}
      />
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          activeTab={tab[0]}
          tabs={tab}
          searchPlaceholder="Search Requests..."
          showSearchandSort={false}
        >
          {isLoading ? (
            <LoadingAnimations loading={isLoading} />
          ) : propertyData.length < 1 ? (
            <NotFound />
          ) : (
            <PropertyTableComponent
              data={propertyData}
              isDirector={isDirectorRoute}
            />
          )}
        </ReusableTable>
        {/* Pagination */}
        <SoosarPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setpage}
          hasNext={!!data?.data.next_page_url}
          hasPrev={!!data?.data.prev_page_url}
        />
      </div>
    </div>
  );
}
