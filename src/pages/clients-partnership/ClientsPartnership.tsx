import React, { useState } from "react";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import { useGetPartnershipRequest } from "../../utils/hooks/query";
import SoosarPagination from "../../components/SoosarPagination";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import PartnershipListTable from "./PartnershipListTable";

export default function ClientsPartnership() {
  const [page, setpage] = useState(1);
  const { data, isLoading, isError } = useGetPartnershipRequest(page);
  const propertyData = data?.data.data || [];
  const totalPages = data?.data.last_page || 1;
  const tab = ["Requests"];
  return (
    <div className="pb-[52px]">
      <Header
        title="Client Partnership Requests"
        subtitle="Attend to requests client partnership"
        history={true}
        showSearchAndButton={false}
      />
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable activeTab={tab[0]} tabs={tab} showSearchandSort={false}>
          {isLoading ? (
            <LoadingAnimations loading={isLoading} />
          ) : propertyData.length < 1 ? (
            <NotFound />
          ) : (
            <PartnershipListTable data={propertyData} />
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
