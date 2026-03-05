// Personnel_Table.tsx
import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
import { PropertyContext } from "../../MyContext/MyContext";
import { impersonateUser } from "../../components/Redux/adminimpersonate/adminimpersonatethunk";
import { clearImpersonation } from "../../components/Redux/adminimpersonate/adminimpersonateslice";

export interface UsersTable {
  User: string;
  Email: string;
  Role: string;
  Created: string;
  id: any;
  user: User; // Add the full user object
  referral_code: any;
}

interface UsersTableProps {
  userData: UsersTable[];
}

// Role mapping for dashboard routes
const roleRoutes: Record<number, string> = {
  1: "/dashboard",
  2: "/marketer",
  3: "/director",
  4: "/payments/dashboard",
  5: "/human-resources",
  6: "/legal",
  7: "/info-tech",
  8: "/client/customers",
};

// Role display names for buttons
const roleButtonText: Record<number, string> = {
  1: "View Admin Dashboard",
  2: "View Marketer Dashboard",
  3: "View Director Dashboard",
  4: "View Payments Dashboard",
  5: "View HR Dashboard",
  6: "View Legal Dashboard",
  7: "View IT Dashboard",
  8: "View Client Dashboard",
};

export default function UsersTableComponent({ userData }: UsersTableProps) {
  const navigate = useNavigate();
  const pagination = useSelector(selectPersonnelPagination);
  const dispatch = useDispatch<AppDispatch>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [personelToDelete, setPersonelToDelete] = useState<User | null>(null);
  const [impersonatingUserId, setImpersonatingUserId] = useState<number | null>(
    null,
  );

  const { option, setOption } = useContext(PropertyContext)!;

  const {
    loading: deleteloading,
    success: deletesuccess,
    error: deleteerror,
  } = useSelector((state: RootState) => state.DeletePersonnel);

  const { loading, success, error } = useSelector(
    (state: RootState) => state.editPersonnelSlice,
  );

  const {
    user,
    loading: imLoading,
    error: imError,
    success: imSuccess,
    impersonationToken,
  } = useSelector((state: RootState) => state.adminImpersonate);

  useEffect(() => {
    if (deletesuccess && personelToDelete) {
      toast.success("Property deleted successfully!");
      dispatch(personnels({ role: option.value }));
      handleCloseDeleteModal();
    }

    if (deleteerror) {
      toast.error(deleteerror || "Failed to delete property");
    }
  }, [deletesuccess, deleteerror, dispatch, personelToDelete]);

  const handlePageChange = async (page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(personnels({ role: option.value }));
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
        DeletePersonel({ propertyId: personelToDelete.id.toString() }),
      );
    }
  };

  const [selectedPersonnel, setSelectedPersonnel] = useState<UsersTable | null>(
    null,
  );
  const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);

  const handleRowClick = (user: UsersTable) => {
    setSelectedPersonnel(user);
    setIsPersonnelModalOpen(true);
  };

  // Store original token before impersonation
  const storeOriginalToken = () => {
    const currentToken = Cookies.get("token");
    if (currentToken) {
      sessionStorage.setItem("original_token", currentToken);
    }
  };

  // Handle impersonation with token replacement and redirect
  const handleImpersonate = async (
    userData: UsersTable,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation(); // Prevent row click event

    const userId = Number(userData.id);
    const userRole = userData.user?.role;

    if (!userRole) {
      toast.error("User role not found");
      return;
    }

    setImpersonatingUserId(userId);

    try {
      // Store original token before impersonation
      storeOriginalToken();

      // Show loading toast
      const loadingToast = toast.loading(`Impersonating user...`);

      const result = await dispatch(impersonateUser(userId)).unwrap();

      if (result.success && result.token) {
        // Replace the current token with impersonation token
        Cookies.set("token", result.token, {
          expires: 1 / 24, // 1 hour expiry
          secure: true,
          sameSite: "strict",
        });

        // Set impersonation flag
        sessionStorage.setItem("is_impersonating", "true");
        sessionStorage.setItem(
          "impersonated_user_name",
          `${result.data.first_name} ${result.data.last_name}`,
        );
        sessionStorage.setItem(
          "impersonated_user_role",
          String(result.data.role),
        );

        // Update toast
        toast.update(loadingToast, {
          render: "Impersonation successful! Redirecting...",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        // Small delay to ensure token is set before navigation
        setTimeout(() => {
          // Navigate based on user role
          const route = roleRoutes[result.data.role] || "/";

          // Use replace to prevent going back to impersonation page
          navigate(route, {
            replace: true,
            state: {
              isImpersonating: true,
              impersonatedUser: result.data,
              impersonatedUserId: userId,
            },
          });
        }, 1500); // Delay to show success message
      }
    } catch (error: any) {
      console.error("Impersonation failed:", error);
      toast.error(error?.message || "Impersonation failed. Please try again.");
      setImpersonatingUserId(null);
    }
  };

  // Stop impersonation function (can be called from a header component)
  const handleStopImpersonation = () => {
    const originalToken = sessionStorage.getItem("original_token");

    if (originalToken) {
      // Restore original token
      Cookies.set("token", originalToken, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });

      // Clear impersonation state
      dispatch(clearImpersonation());
      sessionStorage.removeItem("original_token");
      sessionStorage.removeItem("is_impersonating");
      sessionStorage.removeItem("impersonated_user_name");
      sessionStorage.removeItem("impersonated_user_role");

      toast.success("Stopped impersonating");

      // Navigate back to admin/users page
      navigate("/admin/users", { replace: true });
    }
  };

  // Get button text based on user role
  const getImpersonateButtonText = (role: number): string => {
    return roleButtonText[role] || "View Dashboard";
  };

  // Check if currently impersonating this user
  const isImpersonatingThisUser = (userId: number) => {
    return (
      impersonatingUserId === userId ||
      (sessionStorage.getItem("is_impersonating") === "true" &&
        sessionStorage.getItem("impersonated_user_name") &&
        impersonatingUserId === userId)
    );
  };

  // Convert table data to modal data format
  const getModalPersonnelData = (user: UsersTable): any => {
    return {
      id: user.id,
      fullName: user.User,
      email: user.Email,
      role: user.Role,
      joinDate: user.Created,
      referral_code: user.referral_code,
      avatar: "/default-avatar.png",
    };
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="max-w-[800px] md:min-w-0">
          <table className="w-full table-auto">
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
                <th className="pb-6 font-[325] text-[#757575] text-sm pr-8 whitespace-nowrap">
                  Impersonate
                </th>
                <th className="pb-6 font-[325] text-[#757575] text-sm pr-8 whitespace-nowrap">
                  View Report
                </th>
                <th className="pb-6 font-[325] text-[#757575] text-sm whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => {
                const userRole = user.user?.role || 0;
                const isImpersonating = isImpersonatingThisUser(
                  Number(user.id),
                );
                const isLoading =
                  imLoading && impersonatingUserId === Number(user.id);

                return (
                  <tr key={user.id} className="hover:bg-gray-50 cursor-pointer">
                    <td
                      className="py-4 text-dark text-sm whitespace-nowrap pr-8"
                      onClick={() => handleRowClick(user)}
                    >
                      {user.User}
                    </td>
                    <td
                      className="py-4 font-[325] text-dark text-sm whitespace-nowrap pr-8"
                      onClick={() => handleRowClick(user)}
                    >
                      {user.Email}
                    </td>
                    <td
                      className="py-4 font-[350] text-dark text-sm whitespace-nowrap pr-8"
                      onClick={() => handleRowClick(user)}
                    >
                      <div className="flex items-center">
                        {user.Role}
                        <span className="ml-2">
                          <FaCaretDown className="w-4 h-4" />
                        </span>
                      </div>
                    </td>
                    <td
                      className="py-4 font-[325] text-dark text-sm whitespace-nowrap pr-8"
                      onClick={() => handleRowClick(user)}
                    >
                      <div className="flex items-center">
                        {formatDate(user.Created)}
                      </div>
                    </td>
                    <td
                      className="py-4 font-[325] text-dark text-sm whitespace-nowrap pr-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleImpersonate(user, e)}
                        disabled={isLoading || !!isImpersonating}
                        className={`px-3 py-1.5 text-[#79B833] border border-[#79B833] text-xs rounded-full transition-colors min-w-[140px] ${
                          isImpersonating
                            ? "bg-white cursor-default"
                            : isLoading
                              ? "bg-white cursor-wait"
                              : "bg-white"
                        }`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Loading...
                          </span>
                        ) : isImpersonating ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="mr-1 h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                            Active
                          </span>
                        ) : (
                          getImpersonateButtonText(userRole)
                        )}
                      </button>
                    </td>
                    <td
                      className="py-4 font-[325] text-dark text-sm whitespace-nowrap pr-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/personnel/${user.id}`);
                        }}
                        className="px-3 py-1.5 bg-[#79B833] text-white text-xs rounded-full hover:bg-[#6aa02e] transition-colors"
                      >
                        View Marketer's Dashboard
                      </button>
                    </td>
                    <td
                      className="py-4 font-[325] text-dark text-sm whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex space-x-4">
                        <button
                          aria-label="Edit personnel"
                          onClick={() => handleEditPersonnel(user.user)}
                          className="hover:opacity-80 transition-opacity"
                        >
                          <img
                            src="/ic_round-edit.svg"
                            className="w-[18px] h-[18px]"
                            alt="Edit"
                          />
                        </button>
                        <button
                          aria-label="Delete personnel"
                          onClick={() => handleDeleteClick(user.user)}
                          className="hover:opacity-80 transition-opacity"
                        >
                          <img
                            src="mingcute_delete-fill.svg"
                            className="w-[18px] h-[18px]"
                            alt="Delete"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
          confirmButtonText="Delete Personnel"
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
