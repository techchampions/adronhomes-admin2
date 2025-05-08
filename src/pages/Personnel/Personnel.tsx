import React from 'react'
import Header from '../../general/Header'
import { ReusableTable } from '../../components/Tables/Table_one'
import UsersTableComponent from './Personnel_Table'


export default function Personnel() {
  const tabs=['All','Active','Non-active']
  return (
  <div className="mb-[52px]">
       <Header
         title="Personnel"
         subtitle="Manage the list of personnel and their access"
       />
        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
           <ReusableTable activeTab={"All"} sort={false} tabs={tabs}> <UsersTableComponent/></ReusableTable>
           </div>
    </div>
  )
}
