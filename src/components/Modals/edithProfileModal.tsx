// EditProfileModal.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../Redux/store";

import SmallLoader from "../SmallLoader";
import { IoClose } from "react-icons/io5";
import EditProfile from "../../general/EditProfile";
import { fetchUserDetails, resetProfileState, selectProfileLoading, selectUser } from "../Redux/profileUpdate/profileSlice";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | number;
  onSuccess?: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  userId,
  onSuccess 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const loading = useSelector(selectProfileLoading);

  useEffect(() => {
    if (isOpen && userId) {
      dispatch(fetchUserDetails(userId));
    }
  }, [isOpen, userId, dispatch]);

  const handleClose = () => {
    dispatch(resetProfileState());
    onClose();
  };

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    handleClose();
  };

    const handleCancel = () => {
  
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 bg-opacity-50">
      <div className="relative bg-white rounded-[30px] max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <SmallLoader />
            </div>
          ) : user ? (
            <EditProfile onSuccess={handleSuccess} oncancel={handleCancel} />
          ) : (
            <div className="text-center p-8 text-gray-500">
              Failed to load user data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;