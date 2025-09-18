import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "../../general/Header";
import PropertyTableComponent, { PropertyData } from "./TAbles/Properties_Table";
import { ReusableTable } from "../../components/Tables/Table_one";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../../components/Redux/Properties/properties_Thunk";
import { setPropertiesSearch } from "../../components/Redux/Properties/propertiesTable_slice";
import PropertyTableComponent2 from "./TAbles/Properties_Table_Sold";

const tabs = ['Published', 'Sold', 'Drafted'];

export default function Properties() {
  const [activeTab, setActiveTab] = useState('Published');
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  const { drafted, published, sold, stats, loading } = useSelector((state: RootState) => state.properties);

  const getFilteredProperties = useCallback((properties: PropertyData[], searchTerm: string) => {
    if (!searchTerm.trim()) return properties;
    
    const searchLower = searchTerm.toLowerCase();
    return properties.filter(property => 
      property.name.toLowerCase().includes(searchLower) ||
      (property.street_address && property.street_address.toLowerCase().includes(searchLower)) ||
      (property.state && property.state.toLowerCase().includes(searchLower)) ||
      (property.lga && property.lga.toLowerCase().includes(searchLower)) ||
      (property.category && property.category.toLowerCase().includes(searchLower))
    );
  }, []);

  const getCurrentState = () => {
    switch (activeTab) {
      case 'Published':
        return published;
      case 'Sold':
        return sold;
      case 'Drafted':
        return drafted;
      default:
        return published;
    }
  };

  const currentState = getCurrentState();
  
  const filteredProperties = useMemo(() => {
    return getFilteredProperties(currentState.data as PropertyData[], currentState.search);
  }, [currentState.data, currentState.search, getFilteredProperties]);

  const isEmpty = filteredProperties.length === 0;

  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchProperties({ 
        page: currentState.pagination.currentPage,
        search: currentState.search
      }));
    };

    const debounceTimer = setTimeout(fetchData, 500);
    return () => clearTimeout(debounceTimer);
  }, [dispatch, currentState.pagination.currentPage, currentState.search, activeTab]);

  const handleSearch = (value: string) => {
    const type = activeTab.toLowerCase() as "drafted" | "published" | "sold";
    dispatch(setPropertiesSearch({ type, search: value }));
    setIsSearching(true);
    
    setTimeout(() => setIsSearching(false), 1000);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  };

  const getLoadingState = () => {
    if (isSearching) return true;
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
          value={stats.total_published}
          change="Includes all Published Properties"
        />
        <MatrixCard
          title="Drafted Properties"
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
                {currentState.search ? 'No properties found matching your search' : 'No data found'}
              </p>
              <NotFound />
            </div>
          ) :activeTab==='Drafted'?(<PropertyTableComponent2   data={filteredProperties as PropertyData[]} CurrentPage={currentState.pagination.currentPage} 
                  
                  />): (
            <PropertyTableComponent 
                  data={filteredProperties as PropertyData[]} CurrentPage={currentState.pagination.currentPage} 
                  
                  
            />
          )}
        </ReusableTable>
      </div>
    </div>
  );
}