import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPropertyRequestByID } from "../../utils/hooks/query";
import Header from "../../general/Header";
import { ReusableTable } from "../../components/Tables/Table_one";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import SoosarPagination from "../../components/SoosarPagination";
import PropertyEnquiriesList from "./PropertEnquiriesList";
import PropertySummary from "./PropertySummary";
import SmallLoader from "../../components/SmallLoader";

const PropertyEnquiries = () => {
  const [page, setpage] = useState(1);
  const params = useParams();
  const id = params?.id;
  const { data, isLoading } = useGetPropertyRequestByID(Number(id));
  const totalPages = data?.data.last_page || 1;
  const propertyData = data?.data.data || [];

  return (
    <div className="pb-[52px]">
      <Header
        title="Requests & Enquiries"
        subtitle="Attend to requests and enquiries on properties"
        history={true}
       

      />
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        {isLoading ? (
          <SmallLoader classname="!h-[120px]" />
        ) : (
          <div className="mb-10">
            <PropertySummary id={propertyData[0].property_id || 0} />
          </div>
        )}
        <ReusableTable activeTab={"All"} tabs={[""]}>
          {isLoading ? (
            <LoadingAnimations loading={isLoading} />
          ) : propertyData.length < 1 ? (
            <NotFound />
          ) : (
            <PropertyEnquiriesList data={propertyData} />
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
};

export default PropertyEnquiries;
