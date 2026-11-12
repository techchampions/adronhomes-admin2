import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
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
import PropertyRequestsExportModal from "../../components/exportModal/PropertyRequestsExportModal";
import { ExportModalRef } from "../../components/exportModal/modalexport";

export default function Requests_Enquiries() {
  const [page, setpage] = useState(1);
  const location = useLocation();
  const exportModalRef = useRef<ExportModalRef>(null);
  const {
    data: directorData,
    isLoading: loadingDR,
  } = useGetDirectorDashboard();
  const isDirectorRoute = location.pathname.startsWith("/director");
  const director_id = isDirectorRoute ? directorData?.director.id : undefined;
  const { data, isLoading } = useGetPropertyRequest(page, director_id);
  const propertyData = data?.data.data || [];
  const totalPages = data?.data.last_page || 1;
  const tab = ["Requests"];

  return (
    <div className="pb-[52px]">
      <Header
        title="Requests & Enquiries"
        subtitle="Attend to requests and enquiries on properties"
        history={true}
        buttonText="Export"
        onButtonClick={() => exportModalRef.current?.openModal()}
        showSearchAndButton={true}
      />
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          activeTab={tab[0]}
          tabs={tab}
          searchPlaceholder="Search Requests..."
          showSearchandSort={false}
        >
          {isLoading || (isDirectorRoute && loadingDR) ? (
            <LoadingAnimations loading={isLoading || loadingDR} />
          ) : propertyData.length < 1 ? (
            <NotFound />
          ) : (
            <PropertyTableComponent
              data={propertyData}
              isDirector={isDirectorRoute}
            />
          )}
        </ReusableTable>
        <SoosarPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setpage}
          hasNext={!!data?.data.next_page_url}
          hasPrev={!!data?.data.prev_page_url}
        />
      </div>

      <PropertyRequestsExportModal
        ref={exportModalRef}
        directorId={director_id}
      />
    </div>
  );
}
