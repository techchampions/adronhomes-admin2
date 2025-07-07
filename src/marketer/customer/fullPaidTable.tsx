import React, { useEffect } from "react";
import Pagination from "../../components/Tables/Pagination";
import { useAppDispatch, useAppSelector } from "../../components/Redux/hook";
import {
  selectDashboardError,
  selectDashboardLoading,
  selectUpcomingPayments,
  selectUpcomingPaymentsPagination,
  setUpcomingPaymentsCurrentPage,
} from "../../components/Redux/Marketer/careerDashboardSlice";
import { fetchMarketerDashboard } from "../../components/Redux/Marketer/CareerDashboard_thunk";
import { formatDate } from "../../utils/formatdate";
import NotFound from "../../components/NotFound"; // Make sure this path is correct
import LoadingAnimations from "../../components/LoadingAnimations";

const UpcomingPayments = () => {
  const dispatch = useAppDispatch();
  const upcomingPayments = useAppSelector(selectUpcomingPayments);
  const pagination = useAppSelector(selectUpcomingPaymentsPagination);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchMarketerDashboard({ currentPage: pagination.currentPage }));
  }, [dispatch, pagination.currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(setUpcomingPaymentsCurrentPage(page));
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="max-h-screen">
          <p className="text-center font-normal text-[#767676]"><LoadingAnimations loading={loading}/></p>
        </div>
      ) : error ? (
        <div className="max-h-screen">
          <p className="text-center font-normal text-[#767676]">
            Error: {error}
          </p>
        </div>
      ) : upcomingPayments.length === 0 ? (
        <div className="max-h-screen">
          <p className="text-center font-normal text-[#767676]">
            No upcoming payments found
          </p>
          <NotFound />
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px] md:min-w-0">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                      Customer's Name
                    </th>
                    <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                      Amount Due
                    </th>
                    <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                      Due Date
                    </th>
                    <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                      Total Amount
                    </th>
                    <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                      Paid Amount
                    </th>
                    <th className="pb-6 font-[325] text-[#757575] whitespace-nowrap text-[12px]">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingPayments.map((payment) => (
                    <tr key={payment.id} className="cursor-pointer">
                      <td className="pr-6 max-w-[130px]">
                        <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                          {`${payment.property_plan.user.first_name} ${payment.property_plan.user.last_name}` ||
                            "N/A"}
                        </div>
                      </td>
                      <td className="max-w-[130px] pr-6">
                        <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                          {payment.amount
                            ? `₦${payment.amount.toLocaleString()}`
                            : "N/A"}
                        </div>
                      </td>
                      <td className="pr-6 max-w-[130px]">
                        <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                          {formatDate(payment.due_date) || "N/A"}
                        </div>
                      </td>
                      <td className="pr-6 max-w-[130px]">
                        <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                          {payment.property_plan.total_amount
                            ? `₦${payment.property_plan.total_amount.toLocaleString()}`
                            : "N/A"}
                        </div>
                      </td>
                      <td className="pr-6 max-w-[130px]">
                        <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                          {payment.property_plan.paid_amount
                            ? `₦${payment.property_plan.paid_amount.toLocaleString()}`
                            : "N/A"}
                        </div>
                      </td>
                      <td className="max-w-[130px]">
                        <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                          {payment.property_plan.monthly_duration
                            ? `${payment.property_plan.monthly_duration} months`
                            : "N/A"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            className="mt-8 mb-4"
          />
        </>
      )}
    </div>
  );
};

export default UpcomingPayments;
