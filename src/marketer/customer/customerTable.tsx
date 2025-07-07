import React, { useEffect } from "react";
import Pagination from "../../components/Tables/Pagination";
import { useAppDispatch, useAppSelector } from "../../components/Redux/hook";
import { selectDashboardError, selectDashboardLoading, selectReferredUsers, selectReferredUsersPagination, setReferredUsersCurrentPage } from "../../components/Redux/Marketer/careerDashboardSlice";
import { fetchMarketerDashboard } from "../../components/Redux/Marketer/CareerDashboard_thunk";
import { formatDate } from "../../utils/formatdate";
import NotFound from "../../components/NotFound";
import LoadingAnimations from "../../components/LoadingAnimations";



const ReferredUsers = () => {
  const dispatch = useAppDispatch();
  const referredUsers = useAppSelector(selectReferredUsers);
  const pagination = useAppSelector(selectReferredUsersPagination);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchMarketerDashboard({ referredUsersPage: pagination.currentPage }));
  }, [dispatch, pagination.currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(setReferredUsersCurrentPage(page));
  };



 return (
  <div className="w-full">
    {loading ? (
      <div className="max-h-screen">
       <div className="text-center font-normal text-[#767676]"><LoadingAnimations loading={loading}/></div>
 
      </div>
    ) : referredUsers.length === 0 ? (
      <div className="max-h-screen">
        <p className="text-center font-normal text-[#767676]">No referred users found</p>
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
                    Date Joined
                  </th>
                  <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                    Property Plans
                  </th>
                  <th className="pb-6 font-[325] text-[#757575] pr-6 whitespace-nowrap text-[12px]">
                    Saved Properties
                  </th>
                  <th className="pb-6 font-[325] text-[#757575] whitespace-nowrap text-[12px]">
                    Phone Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {referredUsers.map((user) => (
                  <tr key={user.id} className="cursor-pointer">
                    <td className="pr-2 max-w-[130px]">
                      <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                        {`${user.first_name} ${user.last_name}` || "N/A"}
                      </div>
                    </td>
                    <td className="max-w-[130px] pr-2">
                      <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                        {formatDate(user.created_at) || "N/A"}
                      </div>
                    </td>
                    <td className="pr-2 max-w-[130px]">
                      <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                        {user.property_plan_total ?? "0"}
                      </div>
                    </td>
                    <td className="pr-2 max-w-[130px]">
                      <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                        {user.saved_property_total ?? "0"}
                      </div>
                    </td>
                    <td className="max-w-[130px]">
                      <div className="pb-8 font-[325] text-dark text-sm truncate whitespace-nowrap">
                        {user.phone_number ?? "N/A"}
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
);}
export default ReferredUsers;
