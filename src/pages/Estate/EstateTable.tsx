import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa6";
import Pagination from "../../components/Tables/Pagination";
import { AppDispatch } from "../../components/Redux/store";
import {
  selectAllEstatesPagination,
  setAllEstatesCurrentPage,
} from "../../components/Redux/estate/estateSlice";
import {
  deleteEstate,
  Estate,
  fetchAllEstates,
} from "../../components/Redux/estate/estateThunk";
import ConfirmationModal from "../../components/Modals/delete";

interface EstateTableProps {
  data: Estate[];
}

const statusText = (status: number) => (status === 1 ? "Operating" : "Inactive");

const CountBadge = ({
  value,
  className,
}: {
  value: number | string;
  className: string;
}) => (
  <span
    className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-[350] ${className}`}
  >
    {Number(value || 0).toLocaleString()}
  </span>
);

export default function EstateTable({ data }: EstateTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const pagination = useSelector(selectAllEstatesPagination);
  const [estateToDelete, setEstateToDelete] = useState<Estate | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    dispatch(setAllEstatesCurrentPage(page));
    await dispatch(fetchAllEstates({ page }));
  };

  const handleDeleteClick = (
    event: MouseEvent<HTMLButtonElement>,
    estate: Estate,
  ) => {
    event.stopPropagation();
    setEstateToDelete(estate);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleteLoading) return;
    setIsDeleteModalOpen(false);
    setEstateToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!estateToDelete) return;
    setDeleteLoading(true);
    try {
      const response = await dispatch(
        deleteEstate({ estateId: estateToDelete.id }),
      ).unwrap();
      toast.success(response.message || "Estate deleted successfully");
      await dispatch(fetchAllEstates({ page: pagination.currentPage }));
      setIsDeleteModalOpen(false);
      setEstateToDelete(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete estate");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[900px] md:min-w-0">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Estate Name
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Property Slug
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Members
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Unread
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Maintenance
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Pending
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Security Codes
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Status
                </th>
                <th className="py-4 pr-6 font-[325] text-[#757575] text-xs">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((estate) => (
                <tr
                  key={estate.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/estates/${estate.id}/users`)}
                >
                  <td className="py-4 pr-6 font-[325] text-dark text-sm max-w-[220px]">
                    <div className="truncate">{estate.estate_name || "N/A"}</div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm max-w-[180px]">
                    <div className="truncate">{estate.property_slug || "N/A"}</div>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    {estate.total_member?.toLocaleString() ?? "0"}
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    <CountBadge
                      value={estate.total_unread_messages || 0}
                      className={
                        estate.total_unread_messages > 0
                          ? "bg-[#D70E0E] text-white"
                          : "bg-[#F1F1F1] text-[#767676]"
                      }
                    />
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    <CountBadge
                      value={estate.total_maintenance_requests || 0}
                      className="bg-[#EAF7EA] text-[#2E9B2E]"
                    />
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    <CountBadge
                      value={estate.pending_maintenance_requests || 0}
                      className="bg-[#FFF4E8] text-[#FF9131]"
                    />
                  </td>
                  <td className="py-4 pr-6 font-[325] text-dark text-sm">
                    <CountBadge
                      value={estate.total_security_codes_generated || 0}
                      className="bg-[#F1F1F1] text-[#272727]"
                    />
                  </td>
                  <td className="py-4 pr-6 font-[325] text-sm">
                    <span
                      className={
                        estate.is_operating === 1
                          ? "text-[#2E9B2E]"
                          : "text-[#D70E0E]"
                      }
                    >
                      {statusText(estate.is_operating)}
                    </span>
                  </td>
                  <td className="py-4 pr-6 font-[325] text-sm">
                    <button
                      onClick={(event) => handleDeleteClick(event, estate)}
                      className="h-9 w-9 rounded-full bg-[#FDECEC] text-[#D70E0E] hover:bg-[#F8D7D7] flex items-center justify-center"
                      title="Delete estate"
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

      {isDeleteModalOpen && estateToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Delete Estate"
          description="Are you sure you want to delete"
          subjectName={estateToDelete.estate_name || "this estate"}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
          confirmButtonText="Delete Estate"
          cancelButtonText="Cancel"
        />
      )}
    </>
  );
}
