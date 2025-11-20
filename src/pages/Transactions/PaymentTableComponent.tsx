import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import Pagination from "../../components/Tables/Pagination";
import PaymentModal from "../../components/Modals/Transaction";
import { formatDate } from "../../utils/formatdate";
import {
  selectUserPayments,
  selectUserPaymentsLoading,
  selectUserPaymentsPagination,
} from "../../components/Redux/Properties/payment/paymentbyuser_slice";
import { fetchUserPayments, PaymentItem } from "../../components/Redux/Properties/payment/paymentbyuser_thunk";

interface Props {
  userId: any;
}

export default function PaymentTableComponent({ userId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectUserPayments);
  const loading = useSelector(selectUserPaymentsLoading);
  const pagination = useSelector(selectUserPaymentsPagination);

  const [selected, setSelected] = useState<PaymentItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchUserPayments({
        userId,
        page: pagination.currentPage,
      })
    );
  }, [dispatch, userId, pagination.currentPage]);

  const handlePageChange = (page: number) => {
    if (page !== pagination.currentPage) {
      dispatch(fetchUserPayments({ userId, page }));
    }
  };

  const handleRowClick = (payment: PaymentItem) => {
    setSelected(payment);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelected(null);
  };

  // Transform data for modal
  const getModalData = (payment: PaymentItem) => ({
    from: `${payment.user.first_name} ${payment.user.last_name}`,
    description: payment.description || "Property Payment",
    property: payment.property.name,
    type: payment.payment_type,
    method: payment.payment_type,
    amount: `₦${payment.amount_paid.toLocaleString()}`,
    reference: payment.reference,
    status: payment.status === 1 ? "Approved" : "Pending",
    transactionDate: payment.created_at,
    director: payment.director
      ? `${payment.director.first_name} ${payment.director.last_name}`
      : "N/A",
  });

  return (
    <>
      {/* Responsive Table Container */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-0">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="text-left -b -gray-200">
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[10px] max-w-[150px]">
                  <div className="truncate">Payment ID</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[200px] max-w-[200px]">
                  <div className="truncate">Description</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[150px] max-w-[150px]">
                  <div className="truncate">Amount</div>
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs w-[120px] max-w-[120px]">
                  <div className="truncate">Status</div>
                </th>
                <th className="py-4 pl-6 font-[325] text-[#757575] text-xs w-[120px] max-w-[120px]">
                  <div className="truncate">Payment Date</div>
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading && items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    Loading payments...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                items.map((payment: PaymentItem) => (
                  <tr
                    key={payment.id}
                    onClick={() => handleRowClick(payment)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors -b -gray-100"
                  >
                    {/* Payment ID */}
                    <td className="py-4 pr-6 font-[325] text-dark text-sm w-[10px] max-w-[150px]">
                      <div className="truncate">#{payment.id}</div>
                    </td>

                    {/* Description */}
                    <td className="py-4 pr-6 font-medium text-dark text-sm w-[200px] max-w-[200px]">
                      <div className="truncate">
                        {payment.description || "Property Payment"}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 pr-6 font-[325] text-dark text-sm w-[150px] max-w-[150px]">
                      <div className="truncate">
                        ₦{payment.amount_paid.toLocaleString()}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 pr-6 font-[325] text-sm w-[120px] max-w-[120px]">
                      <div
                        className={`truncate font-medium ${
                          payment.status === 1
                            ? "text-[#2E9B2E]"
                            : "text-[#FF9131]"
                        }`}
                      >
                        {payment.status === 1 ? "Approved" : "Pending"}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 pl-6 font-[325] text-dark text-sm w-[120px] max-w-[120px]">
                      <div className="truncate">
                        {formatDate(payment.created_at)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {items.length > 0 && !loading && (
        <div className="mt-8 mb-4">
          <Pagination
            pagination={{
              currentPage: pagination.currentPage,
              totalPages: pagination.lastPage,
              totalItems: pagination.total,
              perPage: pagination.perPage,
            }}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modal */}
      {selected && (
        <PaymentModal
          isOpen={isOpen}
          onClose={closeModal}
          paymentData={getModalData(selected)}
        />
      )}
    </>
  );
}