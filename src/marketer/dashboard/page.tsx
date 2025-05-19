import React, { useState } from 'react'
import { GreenCardMarketer, MatrixCard, StatsCard } from '../../components/firstcard'
import { ReusableTable } from '../../components/Tables/Table_one'
import CustomersTableAll from './allcustomersTable'
import CustomersTableAllActive from './activePlans'
import Header from '../Header/Hearder'

export default function MarketersDashboard() {
  const tabs = ['Registered Customers', 'Active Plans']
  const [activeTab, setActiveTab] = useState('Registered Customers')

  return (
    <div className="mb-[52px]">
      <Header
        title="Settings"
        subtitle="Manage settings"
      />

      <div className="space-y-[30px]">
        <div className="grid lg:grid-cols-4 gap-[10px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <GreenCardMarketer
            role="Marketer"
            iconSrc="/material.svg"
          />
          <MatrixCard
            title="Referred Customers"
            value="203"
            change="includes all customers on a property plan"
          />
          <MatrixCard
            title="Active Plans"
            value="203"
            change="All customers on a property plan"
          />
          <MatrixCard
            title="Upcoming Payments this week"
            value="13"
            change="Customers with upcoming payments"
          />
        </div>

        <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
          <ReusableTable
            tabs={tabs}
            searchPlaceholder="Search Customer"
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {activeTab === 'Registered Customers' ? (
              <CustomersTableAll />
            ) : (
              <CustomersTableAllActive />
            )}
          </ReusableTable>
        </div>
      </div>
    </div>
  )
}
