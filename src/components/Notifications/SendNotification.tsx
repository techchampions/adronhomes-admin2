import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { IoAdd, IoCheckbox } from "react-icons/io5";
import SoosarInputField from "../soosarInput";
import Button from "../input/Button";
import { MdOutlineAttachment } from "react-icons/md";
import {
  useGetCustomers,
  useGetCustomersAndProperties,
} from "../../utils/hooks/query";
import SmallLoader from "../SmallLoader";
import NotFound from "../NotFound";
import { useSendNotification } from "../../utils/hooks/mutations";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}
const SendNotification: React.FC<ModalProps> = ({
  isOpen,
  onClose = () => {},
}) => {
  const [page, setpage] = useState(1);
  const [hasSelectedCustomers, sethasSelectedCustomers] = useState(false);
  const { data, isLoading } = useGetCustomersAndProperties();
  const { mutate: notify, isPending } = useSendNotification();
  type tab = "Customers" | "Plans";
  const [activeTab, setactiveTab] = useState<tab>("Customers");
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]); // Stores IDs of selected items
  const [selectedPlans, setSelectedPlans] = useState<number[]>([]); // Stores IDs of selected items
  const [selectAllCustomer, setSelectAllCustomers] = useState(false);
  const [selectAllPlans, setSelectAllPlans] = useState(false);
  const customers = data?.data.users || [];
  const properties = data?.data.properties || [];
  const searchInitialValues = {
    search: "",
  };

  const nftInitialValues = {
    message: "",
    image: null,
    title: "",
  };

  const nftValidationSchema = Yup.object({
    message: Yup.string().required("Message is required"),
  });
  const searchValidationSchema = Yup.object({
    // message: Yup.string().required("Message is required"),
  });

  const handleSelectAll = () => {
    if (activeTab === "Customers") {
      setSelectAllCustomers(!selectAllCustomer);
      if (!selectAllCustomer) {
        // Select all customers
        setSelectedCustomers(customers.map((customer) => customer.id));
      } else {
        // Deselect all
        setSelectedCustomers([]);
      }
    } else {
      setSelectAllPlans(!selectAllPlans);
      if (!selectAllPlans) {
        // Select all plans
        setSelectedPlans(properties.map((plan) => plan.id));
      } else {
        // Deselect all
        setSelectedPlans([]);
      }
    }
  };

  const handleItemSelect = (id: number) => {
    if (activeTab === "Customers") {
      if (selectedCustomers.includes(id)) {
        // Deselect item
        setSelectedCustomers(
          selectedCustomers.filter((itemId) => itemId !== id)
        );
        setSelectAllCustomers(false); // Uncheck "Select all" if any item is deselected
      } else {
        // Select item
        setSelectedCustomers([...selectedCustomers, id]);
        // Check if all items are selected
      }
    } else {
      if (selectedPlans.includes(id)) {
        // Deselect item
        setSelectedPlans(selectedPlans.filter((itemId) => itemId !== id));
        setSelectAllPlans(false); // Uncheck "Select all" if any item is deselected
      } else {
        // Select item
        setSelectedPlans([...selectedPlans, id]);
        // Check if all items are selected
      }
    }
  };

  const handleSubmit = (values: typeof nftInitialValues) => {
    const payload = {
      title: values.title,
      content: values.message,
      property_ids: selectedPlans,
      user_ids: selectedCustomers,
    };
    notify(payload, {
      onSuccess(data, variables, context) {
        toast.success("Notification sent!");
        onClose();
      },
      onError(error, variables, context) {
        toast.error("Failed to send notification");
      },
    });
  };

  if (!isOpen) return null;
  if (hasSelectedCustomers) {
    return (
      <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10">
          <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
            <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">
              Send Notifications{" "}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-gray-300">
            Send notifications to customers
          </p>
          <div className="flex items-center gap-1 text-xs py-3">
            <IoCheckbox /> {selectedCustomers.length} Customers selected
          </div>

          <Formik
            initialValues={nftInitialValues}
            validationSchema={nftValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => {
              return (
                <Form className="space-y-6">
                  <SoosarInputField name="title" placeholder="Enter Title" />
                  <div className="bg-adron-body rounded-3xl p-0 space-y-4">
                    <div className="px-0 mt-4">
                      <SoosarInputField
                        type="textarea"
                        name="message"
                        className="italic"
                        placeholder="Enter your Message here..."
                      />
                    </div>
                    {values.image && (
                      <div className="cursor-pointer border border-dashed border-gray-300 overflow-hidden p-1 rounded-2xl relative w-[98%] mx-auto h-[100px] flex flex-col justify-center items-center">
                        <img
                          src={
                            values.image && URL.createObjectURL(values.image)
                          }
                          alt="Profile"
                          className="w-full h-full rounded-xl object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      label="Back"
                      className="!bg-transparent !text-black text-xs hover:font-bold"
                      onClick={onClose}
                    />
                    <Button
                      label="Send Notification"
                      className=" text-xs px-2"
                      type="submit"
                      isLoading={isSubmitting || isPending}
                      disabled={isSubmitting || isPending}
                    />
                    <label className="bg-gray-300 rounded-full p-2 cursor-pointer -rotate-45 hover:-rotate-70">
                      <MdOutlineAttachment />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFieldValue("image", file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    );
  } else {
    return (
      <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10">
          <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
            <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">
              Send Notifications{" "}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-gray-300">
            Send notifications to customers
          </p>
          <div className="flex items-center gap-1 text-xs py-3">
            Select Customers to send notification to{" "}
          </div>

          <div className="space-y-6">
            <div className="p-0 space-y-4">
              <div className="px-0 mt-4">
                <input
                  type="text"
                  className="rounded-full w-full p-1 px-5 text-sm border border-gray-300"
                  placeholder="Search..."
                />
              </div>
            </div>
            {/* tabs */}
            <div className="flex items-center gap-3 text-sm">
              <span
                onClick={() => setactiveTab("Customers")}
                className={
                  activeTab === "Customers"
                    ? `text-black cursor-pointer`
                    : `text-gray-400 cursor-pointer`
                }
              >
                Customers
              </span>
              <span
                onClick={() => setactiveTab("Plans")}
                className={
                  activeTab === "Plans"
                    ? `text-black cursor-pointer`
                    : `text-gray-400 cursor-pointer`
                }
              >
                Plans
              </span>
            </div>
            <div className="max-h-[250px] overflow-y-scroll scrollbar-hide">
              {activeTab === "Customers" ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1 text-xs font-medium ml-3">
                    <input
                      type="checkbox"
                      checked={
                        activeTab === "Customers"
                          ? selectAllCustomer
                          : selectAllPlans
                      }
                      onChange={handleSelectAll}
                    />{" "}
                    Select all
                  </div>
                  {isLoading ? (
                    <SmallLoader />
                  ) : customers.length < 1 ? (
                    <NotFound text="No user Found." />
                  ) : (
                    customers.map((customer, index) => (
                      <div
                        className="flex items-center gap-1 text-xs ml-3"
                        key={customer.id}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => handleItemSelect(customer.id)}
                        />{" "}
                        {customer.first_name} {customer.last_name}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1 text-xs font-medium ml-3">
                    <input
                      type="checkbox"
                      checked={
                        activeTab === "Plans"
                          ? selectAllPlans
                          : selectAllCustomer
                      }
                      onChange={handleSelectAll}
                    />{" "}
                    Select all
                  </div>
                  {isLoading ? (
                    <SmallLoader />
                  ) : properties.length < 1 ? (
                    <NotFound text="No Plans Found." />
                  ) : (
                    properties.map((plan, index) => (
                      <div
                        className="flex items-center gap-1 text-xs truncate ml-3"
                        key={plan.id}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPlans.includes(plan.id)}
                          onChange={() => handleItemSelect(plan.id)}
                        />{" "}
                        {plan.name}{" "}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between gap-2">
              <Button
                label="Cancel"
                className="!bg-transparent !text-red-600 text-xs hover:font-bold"
                onClick={onClose}
              />
              <Button
                label="Continue"
                className=" text-xs px-2"
                onClick={() => {
                  sethasSelectedCustomers(true);
                  console.log(selectedCustomers);
                  console.log(selectedPlans);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SendNotification;
