import React, { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import MessageModal from "../components/Modals/Massaging";
import { toast } from "react-toastify";
import { sendMessage } from "../components/Redux/customers/send_message";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../components/Redux/store";
import ConfirmationModal from "../components/Modals/delete";
import { deleteUser } from "../components/Redux/customers/delete_customers";
import { useNavigate, useParams } from "react-router-dom";
import EnhancedOptionInputField from "../components/input/enhancedSelecet";
import { directors, marketers } from "../components/Redux/directors/directors_thunk";
import { assignMarketer, resetAssignMarketerState } from "../components/Redux/AssignMarketerRequest/AssignMarketerRequest";
import { fetchCustomerById } from "../components/Redux/customers/customerByid";

interface ProfileCardProps {
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
  activePlanPagination?: { currentPage: number };
  completedPropertyPagination?: { currentPage: number };
  onReassignSuccess?: () => void;
}

interface DropdownOption {
  label: string;
  value: string | number;
}

interface Director {
  id: string | number;
  first_name: string;
  last_name: string;
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
  activePlanPagination = { currentPage: 1 },
  completedPropertyPagination = { currentPage: 1 },
  onReassignSuccess,
}: ProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpendelete, setIsOpendelete] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedMarketerId, setSelectedMarketerId] = useState<string | number>("");
  const [marketerNameState, setMarketerNameState] = useState(marketerName);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Get directors data from Redux
 const { data: marketersData, loading: marketersLoading, error: marketersError, success: marketersSuccess } = 
  useSelector((state: RootState) => state.directors.marketers);
  const { success: assignSuccess, loading: assignLoading, errors: validationErrors } = useSelector((state: RootState) => state.assignMarketerRequest);

  useEffect(() => {
    dispatch(marketers());
  }, [dispatch]);

  // Prepare director options for dropdown
  const directorOptions: DropdownOption[] = Array.isArray(marketersData)
    ? marketersData.map((person: Director) => ({
        label: `${person.first_name} ${person.last_name}`,
        value: person.id,
      }))
    : [];

  const handleSend = async () => {
    console.log("Sending message:", message);

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
      } else if (sendMessage.rejected.match(result)) {
        const errorMessage = result.payload?.message || "Failed to send message";
        toast.error(errorMessage);
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
        navigate("/customers");
      } else if (deleteUser.rejected.match(result)) {
        const errorMessage = result.payload?.message || "Failed to delete user";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsOpendelete(false);
    }
  };

  const handleReassign = async () => {
    if (!selectedMarketerId) {
      toast.error("Please select a marketer");
      return;
    }

    if (!userId) {
      toast.error("No customer selected");
      return;
    }

    // Dispatch the assign marketer action
    dispatch(assignMarketer({
      customer_id: userId,
      marketer_id: selectedMarketerId
    }));
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isReassignOpen) {
      setSelectedMarketerId("");
      dispatch(resetAssignMarketerState());
    }
  }, [isReassignOpen, dispatch]);

  // Handle success response for reassignment
  useEffect(() => {
    if (assignSuccess && id) {
      // Find the selected marketer name
      const selectedMarketer = directorOptions.find(
        (marketer) => marketer.value === selectedMarketerId
      );
      
      if (selectedMarketer) {
        setMarketerNameState(selectedMarketer.label);
        // toast.success(`Marketer reassigned to ${selectedMarketer.label}`);
      }
      
      // Close modal
      setIsReassignOpen(false);
      
      // Reset Redux state
      dispatch(resetAssignMarketerState());
      
      // 🔄 REFRESH CUSTOMER DATA
      dispatch(
        fetchCustomerById({
          customerId: Number(id),
          activePage: activePlanPagination.currentPage,
          completedPage: completedPropertyPagination.currentPage,
        })
      );
      
      // Call success callback if provided
      if (onReassignSuccess) {
        onReassignSuccess();
      }
      
      // Reset local state
      setSelectedMarketerId("");
    }
  }, [
    assignSuccess,
    selectedMarketerId,
    directorOptions,
    dispatch,
    onReassignSuccess,
    id,
    activePlanPagination.currentPage,
    completedPropertyPagination.currentPage
  ]);

  // Handle validation errors
  useEffect(() => {
    if (validationErrors) {
      // Display validation errors for specific fields
      if (validationErrors.marketer_id) {
        toast.error(`Marketer: ${validationErrors.marketer_id.join(', ')}`);
      }
      if (validationErrors.customer_id) {
        toast.error(`Customer: ${validationErrors.customer_id.join(', ')}`);
      }
    }
  }, [validationErrors]);

  const handleMarketerChange = (value: string | number) => {
    setSelectedMarketerId(value);
  };

  return (
    <>
      <div className="bg-white rounded-[30px] pr-6 pl-6 pt-6 md:pt-0 lg:px-8 lg:pl-[152px] md:pr-[20px] md:pb-[34px] lg:flex md:space-x-8 lg:space-x-[70px] pb-[34px]">
        {/* Left Column - Profile Info */}
        <div className="w-full lg:w-[256px] justify-center flex flex-col items-center pt-[34px] mb-8 lg:mb-0 pb-6">
          <img
            src={profileImage}
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

        {/* Right Column - Stats and Actions */}
        <div className="flex flex-col w-full">
          {/* Stats Section */}
          <div className="bg-[#F5F5F5] px-4 md:px-[48px] pt-[31px] pb-[34px] flex flex-col sm:flex-row justify-between gap-4 rounded-b-[40px] rounded-t-[40px] lg:rounded-t-none lg:rounded-b-[40px] mb-[20px]">
            <div className="grid lg:grid-cols-3 gap-4 w-full">
              {/* Viewed Properties */}
              <div className="flex flex-col items-center max-w-full">
                <p className="text-[32px] font-[350] mb-[8px] truncate w-full text-center">
                  {stats.viewedProperties}
                </p>
                <h1 className="text-sm font-[300] truncate w-full text-center">
                  Viewed Properties
                </h1>
              </div>

              {/* Saved Properties */}
              <div className="flex flex-col items-center max-w-full">
                <p className="text-[32px] font-[350] mb-[8px] truncate w-full text-center">
                  {stats.savedProperties}
                </p>
                <h1 className="text-sm font-[300] truncate w-full text-center">
                  Saved Properties
                </h1>
              </div>

              {/* Owned Properties */}
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

          {/* Customer Info and Actions */}
          <div className="w-full justify-center flex flex-col items-center text-center md:text-left">
            {/* Customer Code - Fixed alignment */}
            <div className="md:text-base text-sm font-[350] text-dark mb-2 gap-2 flex items-center justify-center md:justify-start w-full">
              <p className="text-[#767676]">Customer Code:</p>
              <span className="md:text-base text-sm font-[350] text-dark">
                {paymentInfo.amount}
              </span>
            </div>

            {/* Marketer in charge - Fixed grid alignment */}
            <div className="max-w-full mb-4 w-full">
              <span className="text-[#767676] font-[325] md:text-base text-sm truncate text-left">
                Marketer in charge:
              </span>
              <span className="text-dark font-[350] md:text-base text-sm truncate">
                {marketerNameState}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-5">
              <button
                className="bg-[#272727] text-white font-bold text-sm rounded-[30px] py-[14px] px-[44px] hover:bg-[#272727]/90 transition-colors"
                onClick={() => setIsOpen(true)}
              >
                {buttonTexts.sendMessage}
              </button>
              <button
                className="bg-white text-[#79B833] font-bold text-sm rounded-[30px] py-[14px] px-[44px] border border-[#79B833] hover:bg-[#79B833]/10 transition-colors"
                onClick={() => setIsReassignOpen(true)}
              >
                Reassign Marketer
              </button>
              {/* <button
                className="bg-white text-[#D70E0E] font-bold text-sm rounded-[30px] py-[14px] px-[44px] border border-[#D70E0E] hover:bg-[#D70E0E]/10 transition-colors"
                onClick={() => setIsOpendelete(true)}
              >
                {buttonTexts.removeClient}
              </button> */}
            </div>
          </div>
        </div>
        
        {/* Message Modal */}
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
        
        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isOpendelete}
          title={"Delete User"}
          description={`Are you sure you want to delete ${name}?`}
          onClose={() => setIsOpendelete(false)}
          onConfirm={handleDelete}
          loading={loadingdelete}
        />
        
        {/* Reassign Marketer Modal */}
        {isReassignOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[40px] w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-dark">Reassign Marketer</h2>
                <button
                  onClick={() => setIsReassignOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Customer Info in Modal */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-dark">{name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Current: {marketerNameState}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Select a new marketer for <span className="font-semibold">{name}</span>
              </p>
              
              <EnhancedOptionInputField
                label="Select Marketer"
                placeholder="Select marketer"
                name="marketer_id"
                value={selectedMarketerId}
                onChange={handleMarketerChange}
                options={directorOptions}
                dropdownTitle="Marketers"
                error={validationErrors?.marketer_id ? validationErrors.marketer_id.join(', ') : ""}
                isSearchable={true}
                isLoading={marketersLoading}
              />
              
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setIsReassignOpen(false)}
                  className="px-6 py-2 text-gray-600 font-medium rounded-[30px] border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={assignLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReassign}
                  disabled={!selectedMarketerId || marketersLoading || assignLoading}
                  className="px-6 py-2 bg-[#79B833] text-white font-medium rounded-[30px] hover:bg-[#79B833]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {assignLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Reassigning...
                    </span>
                  ) : "Reassign"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}