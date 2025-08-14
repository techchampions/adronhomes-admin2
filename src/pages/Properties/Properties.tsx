import React, { useState, useEffect } from "react";
import Header from "../../general/Header";
import PropertyTableComponent, { PropertyData } from "./TAbles/Properties_Table";
import { ReusableTable } from "../../components/Tables/Table_one";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../../components/Redux/Properties/properties_Thunk";

const tabs = ['Published', 'Sold', 'Drafted'];

export default function Properties() {
  const [activeTab, setActiveTab] = useState('Published');
  const dispatch = useDispatch<AppDispatch>();
  const { drafted, published, sold, stats, loading } = useSelector(
    (state: RootState) => state.properties
  );

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const selectDataForTab = (tab: string) => {
    switch (tab) {
      case 'Published':
        return published.data;
      case 'Sold':
        return sold.data;
      case 'Drafted':
        return drafted.data;
      default:
        return [...published.data, ...sold.data, ...drafted.data];
    }
  };

  const filteredProperties = selectDataForTab(activeTab);
  const isEmpty = filteredProperties.length === 0;

  const getLoadingState = () => {
    // Use the loading state for the specific tab being viewed.
    switch (activeTab) {
      case 'Published':
        return published.loading;
      case 'Sold':
        return sold.loading;
      case 'Drafted':
        return drafted.loading;
      default:
        return loading;
    }
  };

  const currentLoading = getLoadingState();

  return (
    <div className="mb-[52px] relative">
      <Header
        title="Properties"
        subtitle="Manage the list of properties"
      />
      <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          title="Total Properties"
          value={stats?.totalProperties}
          change="Includes all properties"
        />
        <MatrixCard
          title="Published Properties"
          // Correctly accessing the 'total_published' key from the stats object
          value={stats.total_published}
          change="Includes all Published Properties"
        />
        <MatrixCard
          title="Drafted Properties"
          // Correctly accessing the 'total_drafted' key from the stats object
          value={stats.total_drafted}
          change="Includes all Drafted Properties"
        />
        <MatrixCard
          title="Total Sold Properties"
          value={stats?.totalSold}
          change="Includes all sold properties"
        />
      </div>

      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] relative">
        <ReusableTable
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {currentLoading ? (
            <div className="w-full flex items-center justify-center">
              <LoadingAnimations loading={currentLoading} />
            </div>
          ) : isEmpty ? (
            <div className="max-h-screen">
              <p className="text-center font-normal text-[#767676]">No data found</p>
              <NotFound />
            </div>
          ) : (
            <PropertyTableComponent data={filteredProperties as PropertyData[]} />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}