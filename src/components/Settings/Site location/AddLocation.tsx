import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { FiEyeOff } from "react-icons/fi";
import InputField from "../../input/inputtext";
import OptionInputField from "../../input/drop_down";
import Button from "../../input/Button";
import { CreateOfficeLocationPayload } from "../../../pages/Properties/types/OfficeLocationsTypes";
import SoosarInputField from "../../soosarInput";
import { useCreateOfficeLocation } from "../../../utils/hooks/mutations";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const stateOptions = [
  { value: "Lagos", label: "Lagos" },
  { value: "Abuja", label: "Abuja" },
  { value: "Imo", label: "Imo" },
];

const validationSchema = Yup.object().shape({
  office_name: Yup.string().required("Office name is required"),
  office_address: Yup.string().required("Address is required"),
  first_contact: Yup.string().required("Phone number is required"),
  second_contact: Yup.string().required("Alternative Phone number is required"),
});

export default function AddLocationModal({
  isOpen = true,
  onClose = () => {},
}: ModalProps) {
  const initialValues = {
    office_name: "",
    first_contact: "",
    second_contact: "",
    third_contact: "",
    office_address: "",
    // email: "",
  };
  const {
    mutate: createOfficeLocation,
    isPending,
    isError,
  } = useCreateOfficeLocation();
  const handleSubmit = (values: CreateOfficeLocationPayload) => {
    createOfficeLocation(values, {
      onSuccess(data, variables, context) {
        toast.success("Office Contact Added Successfully");
      },
      onError(error, variables, context) {
        toast.error("Failed to Add contacts");
      },
    });
    console.log("Form submitted:", values);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10">
        <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
          <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">
            Add Office Location{" "}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6">
          Add a new office location{" "}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, values, isValid }) => (
            <Form>
              <div className="mb-2">
                <label htmlFor="" className="text-xs text-gray-400">
                  Office Name
                </label>
                <SoosarInputField name="office_name" />
              </div>
              <div className="mb-2">
                <label htmlFor="" className="text-xs text-gray-400">
                  Office Address
                </label>
                <SoosarInputField name="office_address" />
              </div>

              {/* <div className="mb-3 sm:mb-4">
                <OptionInputField
                  label="State"
                  placeholder="Select a State"
                  value={values.state}
                  onChange={(value) => {
                    handleChange({
                      target: {
                        name: "state",
                        value,
                      },
                    });
                  }}
                  name="state"
                  error={touched.state && errors.state}
                  options={stateOptions}
                  dropdownTitle="Select Role"
                />
              </div> */}

              <div className="mb-2">
                <label htmlFor="" className="text-xs text-gray-400">
                  Phone Number
                </label>
                <SoosarInputField name="first_contact" />
              </div>
              <div className="mb-2">
                <label htmlFor="" className="text-xs text-gray-400">
                  Alt Phone Number
                </label>
                <SoosarInputField name="second_contact" />
              </div>
              <div className="mb-2">
                <label htmlFor="" className="text-xs text-gray-400">
                  Alt Phone Number 2
                </label>
                <SoosarInputField name="third_contact" />
              </div>

              <div className="flex justify-between items-center gap-2 mt-[50px]">
                <Button
                  label="Cancel"
                  onClick={onClose}
                  className="!text-black !bg-transparent"
                />
                <Button
                  label="Submit"
                  type="submit"
                  isLoading={isPending}
                  disabled={isPending || !isValid}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
