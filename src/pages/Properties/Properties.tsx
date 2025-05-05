import React, { useState } from "react";
import Header from "../../general/Header";
import PropertyTableComponent from "./TAbles/Properties_Table";
import { ReusableTable } from "../../components/Tables/Table_one";
import PropertyTableComponentActivePlan from "./TAbles/Properties_Table_ActivePlans";
import { samplePropertyData, samplePropertyDataActivePlan, samplePropertySold } from "../../utils/propertiesData";
import PropertyTableComponentsold from "./TAbles/Properties_Table_Sold";



const tabs=['All','On sale','Active Plans','Sold']

export default function Properties() {
  const [activeTab, setActiveTab] = useState('All');
  return (
    <div className="mb-[52px]">
      <Header
        title="Properties"
        subtitle="Manage the list of properties"
      />
          <div className="pl-[38px] pr-[68px]">
        <ReusableTable 
          tabs={tabs} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {activeTab === 'All' && <PropertyTableComponent data={samplePropertyData} />}
          {activeTab === 'On sale' && <PropertyTableComponent data={samplePropertyData} />}
          {activeTab === 'Active Plans' && <PropertyTableComponentActivePlan data={samplePropertyDataActivePlan}/>}
          {activeTab === 'Sold' && <PropertyTableComponentsold data={samplePropertySold}/>}
        </ReusableTable>
      </div>
    </div>
  );
}
