import React from 'react'
import Header from '../../general/Header'
import ProfileCard from '../../general/SmallProfileCard'
import PaymentListCard from '../../general/PaymentListCard'
import InvoiceCard from '../../general/InvoiceCard'
import { ReusableTable } from '../../components/Tables/Table_one'
import Pagination from '../../components/Pagination'
import PaymentCard from './PaymentTable'
import ProductList from './PaymentStatus'
import PaymentListComponent from './PaymentStatus'


export default function Customers_payment() {
  const tabs=['All','Completed','Pending','Failed']
  const payments = [
    {
      title: 'Treasure Parks and Gardens Payment',
      date: 'March 18th, 20:00',
      amount: '₦5,000,000',
      status: 'Completed',
    },
    {
      title: 'Treasure Parks and Gardens Payment Treasure Parks and Gardens Payment',
      date: 'March 19th, 14:30',
      amount: '₦2,000,000000000000000000000000000000000000000000000000000000,000',
      status: 'Pending',
    },
    {
      title: 'Treasure Parks and Gardens Payment',
      date: 'March 20th, 10:15',
      amount: '₦1,000,000',
      status: 'Failed',
    },
    {
      title: 'Treasure Parks and Gardens Payment',
      date: 'March 21st, 09:00',
      amount: '₦750,000',
      status: 'Completed',
    },
  ];
  
  
  return (
    <div className="lg:pl-[38px]  lg:pr-[68px]  pl-[15px] pr-[15px] space-y-[30px] pb-[52px]">
        <Header
              history={true}
              title="Customers"
              subtitle="Manage the list of registered customers"
            />
           <ProfileCard 
  imageUrl="/profile.svg" 
  name="Ahmed Musa" 
  dateJoined="12th May 2025" 
  className="custom-class-if-needed" 
/>
 <InvoiceCard
  invoiceAmount="₦56,000,000"
  paidAmount="₦36,000,000"
  paymentSchedule="Weekly"
  progressPercentage={60}
  duration="6 Months"
  nextPaymentDate="15/09/2025"
  dueDate="5/09/2025"
  property={{
    name: "Treasure Parks and Gardens",
    address: "34, Shimawa, Ogun State, Nigeria",
    image: "/land.svg",
    size: "648 Sq M",
    hasStreetLights: true,
    hasGym: true,
    type: "Land"
  }}
/>
<PaymentListCard 
  title="Payment Schedule"
  description="View all upcoming payments for your property plan."
  buttonText="Show Payments"
  onButtonClick={() => console.log("View payments clicked")}
/>
<p className='md:text-[20px] font-[325] text-base text-dark '>Payments</p>
<ReusableTable activeTab={'All'} tabs={tabs} sortButtonText='Latest'>
<div className="w-full overflow-x-auto">
<div className="space-y-[10px]">
      {payments.map((payment, index) => (
        <PaymentCard
          key={index}
          index={index}
          title={payment.title}
          date={payment.date}
          amount={payment.amount}
          status={payment.status as 'Completed' | 'Pending' | 'Failed'}
        />
      ))}
    </div>
    
</div>
<div className="w-full">
                <Pagination />
              </div>

</ReusableTable>

    </div>
  )
}



