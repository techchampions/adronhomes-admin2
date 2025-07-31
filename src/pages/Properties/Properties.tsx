import React, { useState, useEffect, useContext } from "react";
import Header from "../../general/Header";
import PropertyTableComponent, { PropertyData } from "./TAbles/Properties_Table";
import { ReusableTable } from "../../components/Tables/Table_one";
import PropertyTableComponentActivePlan from "./TAbles/Properties_Table_ActivePlans";
import PropertyTableComponentsold from "./TAbles/Properties_Table_Sold";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../../components/Redux/Properties/properties_Thunk";
import NotFound from "../../components/NotFound";
import LoadingAnimations from "../../components/LoadingAnimations";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import InfrastructureFeesModal from "../../components/Modals/InfrastructureFeesModal";
import { PropertyContext } from "../../MyContext/MyContext";
import PropertyModal from "./PropertyModal";

const tabs = ['All', 'On sale', 'Sold'];

export default function Properties() {
  const [activeTab, setActiveTab] = useState('All');
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, stats} = useSelector(
    (state: RootState) => state.properties
  );

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch, activeTab]);

  const filterProperties = (properties: any, tab: string) => {
    if (!properties) return [];

    switch (tab) {
      case 'All':
        return properties;
      case 'On sale':
        return properties.filter((property: any) => property.is_sold === 0 && property.is_active === 0);
      
      case 'Sold':
        return properties.filter((property: any) => property.is_sold === 1);
      default:
        return properties;
    }
  };

  const filteredProperties = filterProperties(data, activeTab);
  const isEmpty = filteredProperties.length === 0;



  return (
     <div className="mb-[52px] relative ">
      <Header
        title="Properties"
        subtitle="Manage the list of properties"
      />
         <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px]  lg:pr-[68px]  pl-[15px] pr-[15px] mb-[30px]">
              <MatrixCardGreen 
              title="Total Properties"
                     value={ stats?.totalProperties}
                     change="Includes all properties"/>
                    
              <MatrixCard
                title="Live Properties"
                value={stats.liveProperties}
                change="Includes all properties that are live"
              />
              <MatrixCard
                title="Active Plans"
                value={stats?.activePlans}
                change="Includes all active property plans"
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
          {loading ? (
     <div className=" w-full flex items-center justify-center">   <LoadingAnimations loading={loading} /></div>
      ) :isEmpty ? (
            <div className="max-h-screen">
              <p className="text-center font-normal text-[#767676]">No data found</p>
              <NotFound />
            </div>
          ) : (
            <>
              {activeTab === 'All' && <PropertyTableComponent data={filteredProperties} />}
              {activeTab === 'On sale' && <PropertyTableComponent data={filteredProperties} />}
              {/* {activeTab === 'Active Plans' && <PropertyTableComponent data={filteredProperties} />} */}
              {activeTab === 'Sold' && <PropertyTableComponent data={filteredProperties} />}
            </>
          )}
        </ReusableTable>
      </div>
  
    </div>

    
  );
}
