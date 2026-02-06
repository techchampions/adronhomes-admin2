// CustomersTableComponent.tsx

import React, { useState, useEffect } from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../components/Redux/store";
import Pagination from "../../components/Tables/Pagination";
import {
  selectCustomersPagination,
  setCustomersPage,
} from "../../components/Redux/customers/customers_slice";
import { customer, Marketer } from "../../components/Redux/customers/customers_thunk";
import { formatDate } from "../../utils/formatdate";
import { useLocation, useNavigate } from "react-router-dom";
 
// import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import { RootState } from "../../components/Redux/store";
import ConfirmationModal from "../../components/Modals/delete";
import { deleteCustomer } from "../../components/Redux/customers/deletecut";
import { MdDelete } from "react-icons/md";
// import { deleteCustomer } from "../Redux/customers/deletecut";

interface CustomersTable {
  virtual_account: any;
  id: any;
  first_name: any;
  last_name: any;
  marketer: Marketer;
  created_at: any;
  property_plan_total: any;
  saved_property_total: any;
  phone_number: any;
}

interface CustomersTableprop {
  data: CustomersTable[];
}

export default function CustomersTableComponent({ data }: CustomersTableprop) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
const goToCustomer = (id: number) => {
  const path = location.pathname;

  // If already inside payments/customers
  if (path.includes("/payments/customers")) {
    navigate(`/payments/customers/${id}`);
    return;
  }

  // If already inside client customers
  if (path.includes("/client/customers")) {
    navigate(`/client/customers/${id}`);
    return;
  }

  // Default fallback
  navigate(`/customers/${id}`);
};
  const pagination = useSelector(selectCustomersPagination);
  const deleteState = useSelector((state: RootState) => state.deleteCustomer);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomersTable | null>(null);

  // Open modal
  const openDeleteModal = (customer: CustomersTable) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCustomer) return;

    const result = await dispatch(deleteCustomer(selectedCustomer.id));

   
    if (deleteCustomer.fulfilled.match(result)) {
      setModalOpen(false);
    
       dispatch(customer({ page: pagination.currentPage }));
    
    }
  };

  const handlePageChange = async (page: any) => {
    await dispatch(setCustomersPage(page));
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        title="Delete Customer"
        description="Are you sure you want to delete this customer?"
        subjectName={
          selectedCustomer
            ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
            : ""
        }
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteState.loading}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />

      <div className="w-full overflow-x-auto">
        <div className="min-w-[900px] md:min-w-0">
          <table className="w-full">
           <thead>
              <tr className="text-left">
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Customer's Name
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Marketer in Charge
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Date Joined
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Property Plans
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] pr-[60px] whitespace-nowrap">
                  Wallet Balance
                </th>
                <th className="pb-[23px] font-gotham font-[325] text-[#757575] text-[12px] whitespace-nowrap">
                  Phone Number
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="cursor-pointer">

                  {/* NAME */}
                  <td
                    className="pb-[31px] text-dark text-sm truncate whitespace-nowrap pr-4"
                      onClick={() => goToCustomer(row.id)}
                  >
                      <div className="truncate max-w-48">
                        {row.first_name || row.last_name
                      ? `${row.first_name || ""} ${row.last_name || ""}`
                      : "N/A"}
                      </div>
                    
                  </td>

                  {/* MARKETER */}
                  <td
                    className="pb-[31px] text-dark text-sm  whitespace-nowrap pr-4"
                      onClick={() => goToCustomer(row.id)}
                  >
                  <div className="truncate max-w-28"> {row.marketer
                      ? `${row.marketer.first_name || ""} ${
                          row.marketer.last_name || ""
                        }`
                      : "N/A"}</div> 
                  </td>

                  {/* DATE */}
                  <td
                    className="pb-[31px] text-dark text-sm truncate whitespace-nowrap pr-4"
                      onClick={() => goToCustomer(row.id)}
                  >
                    {formatDate(row.created_at)}
                  </td>

                  {/* PROPERTY PLANS */}
                  <td
                    className="pb-[31px] text-dark text-sm whitespace-nowrap pr-4"
                      onClick={() => goToCustomer(row.id)}
                  >
                    {row.property_plan_total ?? "N/A"}
                  </td>

                  {/* SAVED PROPERTIES */}
                  <td
                    className="pb-[31px] text-dark text-sm whitespace-nowrap pr-4"
                      onClick={() => goToCustomer(row.id)}
                  >
             {row.virtual_account?.account_balance ?? "N/A"}

                  </td>

                  {/* PHONE */}
                  <td
                    className="pb-[31px] text-dark text-sm truncate whitespace-nowrap pr-4"
                      onClick={() => goToCustomer(row.id)}
                  >
                    {row.phone_number ?? "N/A"}
                  </td>

                  {/* DELETE BUTTON */}
                  <td className="pb-[31px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(row);
                      }}
                      
                    >
                    <MdDelete className="text-red-500 hover:text-red-600 " />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full">
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          className="mt-8 mb-4"
        />
      </div>
    </>
  );
}
