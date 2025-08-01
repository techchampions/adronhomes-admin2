import React, { useEffect } from "react";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import CustomersTableComponent from "./customers_Table";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { customer } from "../../components/Redux/customers/customers_thunk";
import LoadingAnimations from "../../components/LoadingAnimations";

export default function Customers() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(customer());
  }, [dispatch]);

  const { data, customers, loading, error, pagination } = useSelector(
    (state: RootState) => state.customers
  );
  const tabs = ['Customers'];
  return (
    <div className="pb-[52px] relative">
      <Header
        title="Customers"
        subtitle="Manage the list of registered customers"
      />
      <div className="grid md:grid-cols-3 gap-[20px] lg:pl-[38px]  lg:pr-[68px]  pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen 
               value={data?.total || 0}/>
        <MatrixCard
          title="Total Active Customers"
          value={data?.active_customer || 0}
          change="includes all customers on a property plan"
        />
        <MatrixCard
          title="Total Active Plans"
          value={data?.active_plan || 0}
          change="Includes all active property plans"
        />
      </div>
      {loading ? (
     <div className=" absolute top-96 left-96 right-96">   <LoadingAnimations loading={loading} /></div>
      ) :
     ( <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          tabs={tabs}
          searchPlaceholder={"Search Customer"}
          activeTab={"Customers"}
        >
          <CustomersTableComponent data={customers} />
        </ReusableTable>
      </div>)}
    </div>
  );
}
