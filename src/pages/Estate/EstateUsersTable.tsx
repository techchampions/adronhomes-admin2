import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa6";
import Pagination from "../../components/Tables/Pagination";
import { AppDispatch } from "../../components/Redux/store";
import {
  selectEstateUsersPagination,
  setEstateUsersCurrentPage,
} from "../../components/Redux/estate/estateSlice";
import {
  EstateUser,
  fetchEstateUsers,
  removeUserFromEstate,
} from "../../components/Redux/estate/estateThunk";
import { formatDate } from "../../utils/formatdate";
import ConfirmationModal from "../../components/Modals/delete";

interface EstateUsersTableProps {
  data: EstateUser[];
  estateId: number;
}

const UnreadBadge = ({ count }: { count: number }) => (
  <span
    className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-[350] ${
      count > 0 ? "bg-[#D70E0E] text-white" : "bg-[#F1F1F1] text-[#767676]"
    }`}
  >
    {count.toLocaleString()}
  </span>
);

export default function EstateUsersTable({ data, estateId }: EstateUsersTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const pagination = useSelector(selectEstateUsersPagination);
  const [userToRemove, setUserToRemove] = useState<EstateUser | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    dispatch(setEstateUsersCurrentPage(page));
    await dispatch(fetchEstateUsers({ estateId, page }));
  };

  const handleRemoveClick = (
    event: MouseEvent<HTMLButtonElement>,
    user: EstateUser,
  ) => {
    event.stopPropagation();
    setUserToRemove(user);
    setIsRemoveModalOpen(true);
  };

  const handleCloseRemoveModal = () => {
    if (removeLoading) return;
    setIsRemoveModalOpen(false);
    setUserToRemove(null);
  };

  const handleConfirmRemove = async () => {
    if (!userToRemove) return;
    setRemoveLoading(true);
    try {
      const response = await dispatch(
        removeUserFromEstate({ userId: userToRemove.id }),
      ).unwrap();
      toast.success(response.message || "User removed from estate");
      await dispatch(fetchEstateUsers({ estateId, page: pagination.currentPage }));
      setIsRemoveModalOpen(false);
      setUserToRemove(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove user from estate");
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[760px] md:min-w-0">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Client's Name
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Email
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Phone Number
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Private
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Group
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Total
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Date Joined
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr
                  key={user.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/estates/${estateId}/users/${user.id}`)}
                >
                  <td className="py-4 pr-6 font-[325] text-dark text-sm max-w-[220px]">
                    <div className="truncate">
                      {`${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                        "N/A"}
                    </div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm max-w-[260px]">
                    <div className="truncate">{user.email || "N/A"}</div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {user.phone_number || "N/A"}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    <UnreadBadge count={user.private_unread_count || 0} />
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    <UnreadBadge count={user.group_unread_count || 0} />
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    <UnreadBadge count={user.unread_count || 0} />
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {formatDate(user.joined_at)}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    <button
                      onClick={(event) => handleRemoveClick(event, user)}
                      className="h-9 w-9 rounded-full bg-[#FDECEC] text-[#D70E0E] hover:bg-[#F8D7D7] flex items-center justify-center"
                      title="Remove user"
                    >
                      <FaTrash size={13} />
                    </button>
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

      {isRemoveModalOpen && userToRemove && (
        <ConfirmationModal
          isOpen={isRemoveModalOpen}
          title="Remove User"
          description="Are you sure you want to remove"
          subjectName={
            `${userToRemove.first_name || ""} ${
              userToRemove.last_name || ""
            }`.trim() ||
            userToRemove.email ||
            "this user"
          }
          onClose={handleCloseRemoveModal}
          onConfirm={handleConfirmRemove}
          loading={removeLoading}
          confirmButtonText="Remove User"
          cancelButtonText="Cancel"
        />
      )}
    </>
  );
}
