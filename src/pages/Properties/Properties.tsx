// Properties.tsx (updated)
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Header from "../../general/Header";
import PropertyTableComponent, {
  PropertyData,
} from "./TAbles/Properties_Table";
import { ReusableTable } from "../../components/Tables/Table_one";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../../components/Redux/Properties/properties_Thunk";
import { setPropertiesSearch } from "../../components/Redux/Properties/propertiesTable_slice";
import PropertyTableComponent2 from "./TAbles/Properties_Table_Sold";

const tabs = ["Published", "Sold", "Drafted"];

export default function Properties() {
  const [activeTab, setActiveTab] = useState("Published");
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [isSold, setIsSold] = useState<Boolean>(true);
  const { drafted, published, sold, stats, loading } = useSelector(
    (state: RootState) => state.properties
  );

  // State to trigger gift mode
  const [giftModeTrigger, setGiftModeTrigger] = useState(0);

  const getFilteredProperties = useCallback(
    (properties: PropertyData[], searchTerm: string) => {
      if (!searchTerm.trim()) return properties;

      const searchLower = searchTerm.toLowerCase();
      return properties.filter(
        (property) =>
          property.name.toLowerCase().includes(searchLower) ||
          (property.street_address &&
            property.street_address.toLowerCase().includes(searchLower)) ||
          (property.state &&
            property.state.toLowerCase().includes(searchLower)) ||
          (property.lga && property.lga.toLowerCase().includes(searchLower)) ||
          (property.category &&
            property.category.toLowerCase().includes(searchLower))
      );
    },
    []
  );

  const getCurrentState = () => {
    switch (activeTab) {
      case "Published":
        return published;
      case "Sold":
        return sold;
      case "Drafted":
        return drafted;
      default:
        return published;
    }
  };

  const currentState = getCurrentState();

  const filteredProperties = useMemo(() => {
    return getFilteredProperties(
      currentState.data as PropertyData[],
      currentState.search
    );
  }, [currentState.data, currentState.search, getFilteredProperties]);

  const isEmpty = filteredProperties.length === 0;

  useEffect(() => {
    const fetchData = () => {
      dispatch(
        fetchProperties({
          page: currentState.pagination.currentPage,
          search: currentState.search,
        })
      );
    };

    const debounceTimer = setTimeout(fetchData, 500);
    return () => clearTimeout(debounceTimer);
  }, [
    dispatch,
    currentState.pagination.currentPage,
    currentState.search,
    activeTab,
  ]);

  useEffect(() => {
    const type = activeTab.toLowerCase() as "drafted" | "published" | "sold";
    dispatch(setPropertiesSearch({ type, search: "" }));
  }, [dispatch]);

  const handleSearch = useCallback((value: string) => {
    const type = activeTab.toLowerCase() as "drafted" | "published" | "sold";
    dispatch(setPropertiesSearch({ type, search: value }));
  }, [activeTab, dispatch]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
    if (tab === 'Sold') {
      setIsSold(true);
    }
    // Reset gift mode when changing tabs
    setGiftModeTrigger(0);
  };

  const getLoadingState = () => {
    if (isSearching) return true;
    switch (activeTab) {
      case "Published":
        return published.loading;
      case "Sold":
        return sold.loading;
      case "Drafted":
        return drafted.loading;
      default:
        return loading;
    }
  };

  const currentLoading = getLoadingState();

  // Function to trigger gift mode
  const handleGiftClick = () => {
    console.log("Gift button clicked"); // For debugging
    setGiftModeTrigger(prev => prev + 1);
  };

  return (
    <div className="mb-[52px] relative">
      <Header title="Properties" subtitle="Manage the list of properties" />
      
      {/* Add Gift Button */}
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-4 flex justify-end">
        <button
          onClick={handleGiftClick}
          className="px-6 py-2 rounded-full bg-[#79B833] text-white hover:bg-[#79B833]/80 transition-colors flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12V20H4V12M12 2C9.5 2 8 3.5 8 6C8 8 9.5 9 12 10C14.5 9 16 8 16 6C16 3.5 14.5 2 12 2ZM2 7H22V12H2V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M12 22V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Gift
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          title="Total Properties"
          value={stats?.totalProperties}
          change="Includes all properties"
        />
        <MatrixCard
          title="Published Properties"
          value={stats?.total_published}
          change="Includes all Published Properties"
        />
        <MatrixCard
          title="Drafted Properties"
          value={stats?.total_drafted}
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
          onTabChange={handleTabChange}
          onSearch={handleSearch}
          searchPlaceholder="Search properties by name, address, state..."
        >
          {currentLoading ? (
            <div className="w-full flex items-center justify-center py-8">
              <LoadingAnimations loading={currentLoading} />
            </div>
          ) : isEmpty ? (
            <div className="max-h-screen py-8">
              <p className="text-center font-normal text-[#767676] mb-4">
                {currentState.search
                  ? "No properties found matching your search"
                  : "No data found"}
              </p>
              <NotFound />
            </div>
          ) : activeTab === "Drafted" ? (
            <PropertyTableComponent2
              data={filteredProperties as PropertyData[]}
              CurrentPage={currentState.pagination.currentPage}
            />
          ) : (
            <PropertyTableComponent
              data={filteredProperties as PropertyData[]}
              CurrentPage={currentState.pagination.currentPage}
              activeTab={activeTab}
              triggerGiftMode={giftModeTrigger}
            />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}