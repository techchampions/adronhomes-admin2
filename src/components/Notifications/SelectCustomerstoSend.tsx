import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { IoAdd, IoCheckbox } from "react-icons/io5";
import { toast } from "react-toastify";
import SoosarInputField from "../soosarInput";
import Button from "../input/Button";
import { MdOutlineAttachment } from "react-icons/md";
import { useGetCustomers } from "../../utils/hooks/query";
import SmallLoader from "../SmallLoader";
import NotFound from "../NotFound";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}
const SelectCustomersToSendNtf: React.FC<ModalProps> = ({
  isOpen,
  onClose = () => {},
}) => {
  const [page, setpage] = useState(1);
  const { data, isLoading } = useGetCustomers(page);
  const customers = data?.data.customers.list.data || [];
  const initialValues = {
    search: "",
  };

  const validationSchema = Yup.object({
    // message: Yup.string().required("Message is required"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log(values);
    onClose();
  };

  if (!isOpen) return null;
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
        <p className="text-xs text-gray-300">Send notifications to customers</p>
        <div className="flex items-center gap-1 text-xs py-3">
          Select Customers to send notification to{" "}
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            return (
              <Form className="space-y-6">
                <div className="bg-adron-body rounded-3xl p-0 space-y-4">
                  <div className="px-0 mt-4">
                    <SoosarInputField name="search" placeholder="Search..." />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <input type="checkbox" /> Select all
                  </div>
                  {isLoading ? (
                    <SmallLoader />
                  ) : customers.length < 1 ? (
                    <NotFound text="No user Found." />
                  ) : (
                    customers.map((customer, index) => (
                      <div className="flex items-center gap-1 text-xs">
                        <input type="checkbox" /> {customer.first_name}{" "}
                        {customer.last_name}
                      </div>
                    ))
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
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default SelectCustomersToSendNtf;
