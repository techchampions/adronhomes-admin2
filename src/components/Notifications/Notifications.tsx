import React from 'react'
import Header from '../../general/Header'
import { ReusableTable } from '../Tables/Table_one'
import Notifications_table from './Notifications_table'

export default function Notifications() {
    const tab=['All','Unread','Read']
  return (
   <div className="pb-[52px]">
       <Header
 
         title="Notifications"
         subtitle="Manage notifications"
       />
       <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
                  <ReusableTable activeTab={"All"} tabs={tab} sortButtonText='Latest'><Notifications_table/> </ReusableTable>
                  </div> 
      
    </div>
  )
}
