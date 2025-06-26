// Personnel_Table.tsx
import React, { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import Pagination from "../../components/Tables/Pagination";
import { personnels } from "../../components/Redux/personnel/personnel_thunk";
import {
  selectPersonnelPagination,
  setCurrentPage,
} from "../../components/Redux/personnel/personnel_slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import { formatDate } from "../../utils/formatdate";
import EditPersonnelModal from "./EditPersonnelModal";
import { User } from "../../components/Redux/personnel/edithPersonelle";
import ConfirmationModal from "../../components/Modals/delete";
import { DeletePersonel } from "../../components/Redux/personnel/deleteThunk";
import { resetUpdatePropertyState } from "../../components/Redux/personnel/delete_slice";
import { toast } from "react-toastify";
import PersonnelModal from "./Viewmodal";

export interface UsersTable {
  User: string;
  Email: string;
  Role: string;
  Created: string;
  id: any;
  user: User; // Add the full user object
}

interface UsersTableProps {
  userData: UsersTable[];
}

export default function UsersTableComponent({ userData }: UsersTableProps) {
  const pagination = useSelector(selectPersonnelPagination);
  const dispatch = useDispatch<AppDispatch>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [personelToDelete, setPersonelToDelete] = useState<User | null>(null);
  const {
    loading: deleteloading,
    success: deletesuccess,
    error: deleteerror,
  } = useSelector((state: RootState) => state.DeletePersonnel);
  const { loading, success, error } = useSelector(
    (state: RootState) => state.editPersonnelSlice
  );
  useEffect(() => {
    if (deletesuccess && personelToDelete) {
      toast.success("Property deleted successfully!");
      dispatch(personnels());
      handleCloseDeleteModal();
    }

    if (deleteerror) {
      toast.error(deleteerror || "Failed to delete property");
    }
  }, [deletesuccess, deleteerror, dispatch, personelToDelete]);
  const handlePageChange = async (page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(personnels());
  };

  const handleEditPersonnel = (user: User) => {
    setEditingPersonnel(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPersonnel(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPersonelToDelete(null);
    dispatch(resetUpdatePropertyState());
  };

  const handleDeleteClick = (user: User) => {
    setPersonelToDelete(user);
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (personelToDelete) {
      await dispatch(
        DeletePersonel({ propertyId: personelToDelete.id.toString() })
      );
    }
  };
  const [selectedPersonnel, setSelectedPersonnel] = useState<UsersTable | null>(
    null
  );
  const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);

  // Add this handler function
  const handleRowClick = (user: UsersTable) => {
    setSelectedPersonnel(user);
    setIsPersonnelModalOpen(true);
  };

  // Convert table data to modal data format
  const getModalPersonnelData = (user: UsersTable): any => {
    return {
      id: user.id,
      fullName: user.User,
      email: user.Email,
      role:user.Role,
      joinDate: user.Created,
      // lastActive: new Date().toISOString(), // You might want to get this from your API
      // status: "Active", // You might want to get this from your API
      avatar: "/default-avatar.png",
    };
  };
  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-6 font-[325] text-[#757575] text-sm pr-8 whitespace-nowrap">
                  User
                </th>
                <th className="pb-6 font-[325] text-[#757575] text-sm pr-8 whitespace-nowrap">
                  Email
                </th>
                <th className="pb-6 font-[325] text-[#757575] text-sm pr-8 whitespace-nowrap">
                  Role
                </th>
                <th className="pb-6 font-[325] text-[#757575] text-sm pr-8 whitespace-nowrap">
                  Created
                </th>
                <th className="pb-6 font-[325] text-[#757575] text-sm whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer"
                 
                >
                  <td className="py-4 text-dark text-sm whitespace-nowrap"  onClick={() => handleRowClick(user)}>
                    {user.User}
                  </td>
                  <td className="py-4 font-[325] text-dark text-sm whitespace-nowrap"  onClick={() => handleRowClick(user)}>
                    {user.Email}
                  </td>
                  <td className="py-4 font-[350] text-dark text-sm whitespace-nowrap"  onClick={() => handleRowClick(user)}>
                    <div className="flex items-center">
                      {user.Role}
                      <span className="ml-2">
                        <FaCaretDown className="w-4 h-4" />
                      </span>
                    </div>
                  </td>
                  <td className="py-4 font-[325] text-dark text-sm whitespace-nowrap"  onClick={() => handleRowClick(user)}>
                    <div className="flex items-center">
                      {formatDate(user.Created)}
                    </div>
                  </td>
                  <td className="py-4 font-[325] text-dark text-sm whitespace-nowrap" >
                    <div className="flex space-x-2">
                      <button
                        aria-label="Edit personnel"
                        onClick={() => handleEditPersonnel(user.user)}
                      >
                        <img
                          src="/ic_round-edit.svg"
                          className="w-[18px] h-[18px]"
                        />
                      </button>
                      <button
                        aria-label="Delete personnel"
                        onClick={() => handleDeleteClick(user.user)}
                      >
                        <img
                          src="mingcute_delete-fill.svg"
                          className="w-[18px] h-[18px]"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full mt-4">
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          className="mt-8 mb-4"
        />
      </div>
      {/* delete property */}
      {isDeleteModalOpen && personelToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Delete Personel"
          description="Are you sure you want to delete"
          subjectName={`${personelToDelete.first_name} ${personelToDelete.last_name}`}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          confirmButtonText="Delete Property"
          cancelButtonText="Cancel"
          loading={deleteloading}
        />
      )}
      {/* Edit Personnel Modal */}
      {editingPersonnel && (
        <EditPersonnelModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          personnel={editingPersonnel}
        />
      )}

      {selectedPersonnel && (
        <PersonnelModal
          isOpen={isPersonnelModalOpen}
          onClose={() => setIsPersonnelModalOpen(false)}
          personnelData={getModalPersonnelData(selectedPersonnel)}
        />
      )}
    </>
  );
}
// const roleOptions = [
//   { value: 0, label: "Customer" },
//   { value: 1, label: "Admin" },
//   { value: 2, label: "Marketer" },
//   { value: 3, label: "Director" },
//   { value: 4, label: "Accountant" },
//   { value: 5, label: "Hr" },
// ];

// const getRole = (value: any) => {
//   const numericValue = Number(value); // Convert to number
//   const role = roleOptions.find((r) => r.value === numericValue);
//   return role ? role.label : "Unknown";
// };
