import React from 'react'
import Header from '../../general/Header'
import { ReusableTable } from '../../components/Tables/Table_one'
import PropertyTableComponent from './Requests_Enquiries_Tables'

export default function Requests_Enquiries() {

    const tab=['All','Pending Requests']
  return (
  <div className="pb-[52px]">
      <Header

        title="Requests & Enquiries"
        subtitle="Attend to requests and enquiries on properties"
      />
          <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
           <ReusableTable activeTab={"All"} tabs={tab}> <PropertyTableComponent data={samplePropertyData}/> </ReusableTable>
           </div>
    </div>
  )
}


// Sample data based on the image provided
const samplePropertyData = [
    {
      name: "Treasure Parks and Gardens",
      location: "Ejigbo Wuse, Lagos",
      price: "₦56,000,000",
      totalRequests: 24,
      pendingRequests: 10,
         imageUrl: "/loactionimage.svg",
    },
    {
      name: "Treasure Parks and Gardens",
      location: "Ejigbo Wuse, Lagos",
      price: "₦56,000,000",
      totalRequests: 24,
      pendingRequests: 7,
         imageUrl: "/loactionimage.svg",
    },
    {
      name: "Treasure Parks and Gardens",
      location: "Ejigbo Wuse, Lagos",
      price: "₦56,000,000",
      totalRequests: 24,
      pendingRequests: 2,
         imageUrl: "/loactionimage.svg",
    },
    {
      name: "Treasure Parks and Gardens",
      location: "Ejigbo Wuse, Lagos",
      price: "₦56,000,000",
      totalRequests: 24,
      pendingRequests: 9,
         imageUrl: "/loactionimage.svg",
    },
    {
      name: "Treasure Parks and Gardens",
      location: "Ejigbo Wuse, Lagos",
      price: "₦56,000,000",
      totalRequests: 24,
      pendingRequests: 10,
         imageUrl: "/loactionimage.svg",
    },
    {
      name: "Treasure Parks and Gardens",
      location: "Ejigbo Wuse, Lagos",
      price: "₦56,000,000",
      totalRequests: 24,
      pendingRequests: 10,
         imageUrl: "/loactionimage.svg",
    }
  ];