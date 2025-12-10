import React, { useEffect, useRef } from "react";
import Header from "../../general/Header";
import { MatrixCard, MatrixCardGreen } from "../../components/firstcard";
import { ReusableTable } from "../../components/Tables/Table_one";
import CustomersTableComponent from "./customers_Table";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { customer } from "../../components/Redux/customers/customers_thunk";
import LoadingAnimations from "../../components/LoadingAnimations";
import { setCustomersSearch } from "../../components/Redux/customers/customers_slice"; // Assuming the slice file is named customers_slice
import ExportCustomersModal from "../../components/exportModal/customerExport";
import { ExportModalRef } from "../../components/exportModal/modalexport";

export default function Customers() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, customers, loading, error, pagination, search } = useSelector(
    (state: RootState) => state.customers
  );
  const tabs = ['Customers'];

  useEffect(() => {
    dispatch(customer({ page: pagination.currentPage, search }));
  }, [dispatch, pagination.currentPage, search]);
  useEffect(() => {
    return () => {
      dispatch(setCustomersSearch(""));
    };
  }, [dispatch]);

 const customersModalRef = useRef<ExportModalRef>(null);
   const openCustomersModal = () => {
    if (customersModalRef.current) {
      customersModalRef.current.openModal();
    }
  };
  

  return (
    <div className="pb-[52px] relative">
   <div className="relative">
       <Header
        title="Customers"
        subtitle="Manage the list of registered customers"
         buttonText="Export"
         onButtonClick={openCustomersModal}
        //  cita={true}
      />

             
          
   </div>
      <div className="grid md:grid-cols-3 gap-[20px] lg:pl-[38px]  lg:pr-[68px]  pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen 
               value={data?.total || 0}/>
        <MatrixCard
          title="Total Active Customers"
          value={data?.active_customer || 0}
          change="includes all customers on  active contracts"
        />
        <MatrixCard
          title="Total Active Contracts"
          value={data?.active_plan || 0}
          change="Includes all active contracts"
        />
      </div>
       <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">

        <ReusableTable
          tabs={tabs}
          searchPlaceholder={"Search Customer"}
          activeTab={"Customers"}
          onSearch={(value) => dispatch(setCustomersSearch(value))}
        >{loading ? (
   <LoadingAnimations loading={loading} />
      ) :
     (
          <CustomersTableComponent data={customers} />)}
        </ReusableTable>
      </div>
        <ExportCustomersModal ref={customersModalRef} />
    </div>
  );
}