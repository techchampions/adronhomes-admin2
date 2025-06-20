import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { FiEyeOff } from "react-icons/fi";
import InputField from "../../input/inputtext";
import OptionInputField from "../../input/drop_down";
import Button from "../../input/Button";
import InputAreaField from "../../input/TextArea";
import { useAddLeader, useCreateAccount } from "../../../utils/hooks/mutations";
import { CreateLeaderPayload } from "../../../pages/Properties/types/LeadershipDataTypes";
import { toast } from "react-toastify";
import SoosarInputField from "../../soosarInput";
import { CreateAccountPayload } from "../../../pages/Properties/types/AccountDetailsTypes";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const TypeOptions = [
  { value: "AdronAccount", label: "Adron Homes Account" },
  { value: "Infrastructure", label: "Infrastructure Account" },
  { value: "Others", label: "Others Fees Account" },
  { value: "fund", label: "Fund Wallet Account" },
];

const initialValues = {
  account_name: "",
  bank_name: "",
  account_number: "",
  type: "",
};

const validationSchema = Yup.object().shape({
  account_name: Yup.string().required("Name is required"),
  bank_name: Yup.string().required("Bank is required"),
  account_number: Yup.string().required("Account Number is required"),
});

export default function AddAccount({
  isOpen = true,
  onClose = () => {},
}: ModalProps) {
  const { mutate: createAccount, isError, isPending } = useCreateAccount();
  const handleSubmit = (values: CreateAccountPayload) => {
    console.log("Form submitted:", values);
    createAccount(values, {
      onSuccess(data, variables, context) {
        toast.success("Leader added successfully");
      },
      onError(error, variables, context) {
        toast.error("Error adding leader");
      },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10 px-10">
        <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
          <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">
            Add Account{" "}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-3 sm:mb-4 md:mb-6">
          Add a new account for receiving payment{" "}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            touched,
            handleChange,
            setFieldValue,
            values,
            isSubmitting,
          }) => (
            <Form className="flex flex-col gap-5">
              <div className="mb-1.5 px-7">
                <OptionInputField
                  label="Type"
                  placeholder={values.type ? values.type : "Select Type"}
                  value={values.type}
                  onChange={(value) => {
                    handleChange({
                      target: {
                        name: "type",
                        value,
                      },
                    });
                  }}
                  name="state"
                  error={touched.type && errors.type}
                  options={TypeOptions}
                  dropdownTitle="Select Role"
                />
              </div>

              <div className="mb-1.5 px-7">
                <label htmlFor="" className="text-sm text-gray-500">
                  Account Name
                </label>
                <SoosarInputField
                  name="account_name"
                  placeholder="Enter name"
                />
              </div>

              <div className="mb-1.5 px-7">
                <label htmlFor="" className="text-sm text-gray-500">
                  Account Number
                </label>
                <SoosarInputField
                  name="account_number"
                  placeholder="Enter Account Number"
                />
              </div>
              <div className="mb-1.5 px-7">
                <label htmlFor="" className="text-sm text-gray-500">
                  Bank
                </label>
                <SoosarInputField name="bank_name" placeholder="Enter Bank" />
              </div>

              <div className="flex justify-between items-center gap-2 mt-[20px]">
                <Button
                  label="Cancel"
                  onClick={onClose}
                  className="!text-black !bg-transparent"
                />
                <Button
                  label="Submit"
                  type="submit"
                  isLoading={isPending || isSubmitting}
                  disabled={isPending || isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
