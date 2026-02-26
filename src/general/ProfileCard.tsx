// ProfileCard.tsx
import React, { useState } from "react";
import MessageModal from "../components/Modals/Massaging";
import { toast } from "react-toastify";
import { sendMessage } from "../components/Redux/customers/send_message";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../components/Redux/store";
import ConfirmationModal from "../components/Modals/delete";
import { deleteUser } from "../components/Redux/customers/delete_customers";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import EditProfileModal from "../components/Modals/edithProfileModal";
import { BASE_URL } from "../components/Redux/UpdateContract/viewcontractFormDetails";
// import EditProfileModal from "../components/Modals/EditProfileModal";

interface ProfileCardProps {
  handleSuccess: () => void;
  loadingdelete: any;
  loading: any;
  profileImage: string;
  userId: any;
  name: string;
  dateJoined: string;
  email: string;
  phone: string;
  userNmae: any;
  userImage: any;
  stats: {
    viewedProperties: number;
    savedProperties: number;
    ownedProperties: number;
  };
  paymentInfo: {
    amount: string;
    date: string;
  };
  marketerName: string;
  buttonTexts: {
    sendMessage: string;
    removeClient: string;
  };
  edith?: boolean;
}

export default function ProfileCard({
  profileImage,
  name,
  dateJoined,
  email,
  phone,
  stats,
  paymentInfo,
  marketerName,
  buttonTexts,
  userId,
  userNmae,
  userImage,
  loading,
  loadingdelete,
  edith = false,
  handleSuccess
}: ProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpendelete, setIsOpendelete] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (!userId) {
      toast.error("No recipient selected");
      return;
    }

    try {
      const result = await dispatch(sendMessage({ userId, message }));

      if (sendMessage.fulfilled.match(result)) {
        setIsOpen(false);
        setMessage(""); 
        toast.success("Message sent successfully");
      } else if (sendMessage.rejected.match(result)) {
        toast.error(result.payload?.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async () => {
    try {
      const result = await dispatch(deleteUser(userId));

      if (deleteUser.fulfilled.match(result)) {
        setIsOpendelete(false);
        toast.success("User deleted successfully");
        navigate("/customers");
      } else if (deleteUser.rejected.match(result)) {
        toast.error(result.payload?.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsOpendelete(false);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    // toast.success("Profile updated successfully");
    handleSuccess(); // Call the parent component's success handler to refresh data if needed
  };

  return (
    <>
      <div className="bg-white rounded-[30px] pr-6 pl-6 pt-6 md:pt-0 lg:px-8 lg:pl-[152px] md:pr-[20px] md:pb-[34px] lg:flex md:space-x-8 lg:space-x-[70px] pb-[34px]">
        <div className="w-full lg:w-[256px] justify-center flex flex-col items-center pt-[34px] mb-8 lg:mb-0 pb-6">
          <img
            src={ BASE_URL + profileImage}
            alt={name}
            className="w-[86px] h-[86px] rounded-full mb-[26px]"
          />
          <p className="font-[350] text-2xl mb-[8px] text-dark">{name}</p>
          <h1 className="font-[300] text-sm mb-[15px] text-dark">
            Date Joined: {dateJoined}
          </h1>
          <h2 className="text-lg md:text-[20px] font-[350] mb-[10px] text-dark">
            {email}
          </h2>
          <h3 className="text-lg md:text-[20px] font-[325] text-dark">
            {phone}
          </h3>
        </div>

        <div className="flex flex-col w-full">
          <div className="bg-[#F5F5F5] px-4 md:px-[48px] pt-[31px] pb-[34px] flex flex-col sm:flex-row justify-between gap-4 rounded-b-[40px] rounded-t-[40px] lg:rounded-t-none lg:rounded-b-[40px] mb-[20px]">
            <div className="grid lg:grid-cols-3 gap-4 w-full">
              <div className="flex flex-col items-center max-w-full">
                <p className="text-[32px] font-[350] mb-[8px] truncate w-full text-center">
                  {stats.viewedProperties}
                </p>
                <h1 className="text-sm font-[300] truncate w-full text-center">
                  Viewed Properties
                </h1>
              </div>
              <div className="flex flex-col items-center max-w-full">
                <p className="text-[32px] font-[350] mb-[8px] truncate w-full text-center">
                  {stats.savedProperties}
                </p>
                <h1 className="text-sm font-[300] truncate w-full text-center">
                  Saved Properties
                </h1>
              </div>
              <div className="flex flex-col items-center max-w-full">
                <p className="text-[32px] font-[350] mb-[8px] truncate w-full text-center">
                  {stats.ownedProperties}
                </p>
                <h1 className="text-sm font-[300] truncate w-full text-center">
                  Owned Properties
                </h1>
              </div>
            </div>
          </div>

          <div className="w-full justify-center flex flex-col items-center text-center md:text-left">
            <div className="md:text-base text-sm font-[350] text-dark mb-2 gap-2 flex">
              <p className="text-[#767676]">Customer Code: </p>
              <div className="grid grid-cols-2 gap-x-2 truncate">
                <span className="md:text-base text-sm font-[350] text-dark truncate">
                  {paymentInfo.amount}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 max-w-full mb-4">
              <span className="text-[#767676] font-[325] md:text-base text-sm truncate">
                Marketer in charge:
              </span>
              <span className="text-dark font-[350] md:text-base text-sm truncate">
                {marketerName}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-5">
              <button
                className="bg-[#272727] text-white font-bold text-sm rounded-[30px] py-[14px] px-[44px] hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(true)}
              >
                {buttonTexts.sendMessage}
              </button>
              
              {edith && (
                <button
                  onClick={handleEditClick}
                  className="bg-white text-[#272727] border-2 border-[#272727] font-bold text-sm rounded-[30px] py-[14px] px-[44px] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FiEdit className="text-base" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleSend={handleSend}
        message={message}
        setMessage={setMessage}
        userImage={userImage}
        userNmae={userNmae}
        loading={loading}
      />

      <ConfirmationModal
        isOpen={isOpendelete}
        title="Delete User"
        description={`Are you sure you want to delete ${name}?`}
        onClose={() => setIsOpendelete(false)}
        onConfirm={handleDelete}
        loading={loadingdelete}
      />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userId={userId}
        onSuccess={handleEditSuccess}

      />
    </>
  );
}