import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { FiEyeOff } from "react-icons/fi";
import InputField from "../../input/inputtext";
import OptionInputField from "../../input/drop_down";
import Button from "../../input/Button";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface FormData {
  officeName: string;
  address: string;
  state: string;
  email: string;
  phone1: string;
  phone2: string;
}

const stateOptions = [
  { value: "Lagos", label: "Lagos" },
  { value: "Abuja", label: "Abuja" },
  { value: "Imo", label: "Imo" },
];

const validationSchema = Yup.object().shape({
  officeName: Yup.string().required("Office name is required"),
  address: Yup.string().required("Address is required"),
  phone1: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  state: Yup.string().required("state is required"),
});

export default function EditLocationModal({
  isOpen = true,
  onClose = () => {},
}: ModalProps) {
  const handleSubmit = (
    values: FormData,
    { setSubmitting }: FormikHelpers<FormData>
  ) => {
    console.log("Form submitted:", values);
    setSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10">
        <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
          <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">
            Edit Office Location{" "}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6">
          Edit office location{" "}
        </p>

        <Formik
          initialValues={{
            officeName: "",
            address: "",
            state: "",
            email: "",
            phone1: "",
            phone2: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, values }) => (
            <Form>
              <div className="mb-3 sm:mb-4 md:mb-[40px]">
                <InputField
                  label="Office Name"
                  placeholder="Enter Office name"
                  value={values.officeName}
                  onChange={handleChange}
                  name="officeName"
                  error={touched.officeName && errors.officeName}
                  required
                />
              </div>
              <div className="mb-3 sm:mb-4 md:mb-[40px]">
                <InputField
                  label="Address"
                  placeholder="Enter Address"
                  value={values.address}
                  onChange={handleChange}
                  name="address"
                  error={touched.address && errors.address}
                  required
                />
              </div>

              <div className="mb-3 sm:mb-4 md:mb-[40px]">
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
              </div>

              <div className="mb-3 sm:mb-4 md:mb-[40px]">
                <InputField
                  label="Email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                  name="email"
                  type="email"
                  error={touched.email && errors.email}
                  required
                />
              </div>
              <div className="mb-3 sm:mb-4 md:mb-[40px]">
                <InputField
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  value={values.phone1}
                  onChange={handleChange}
                  name="phone1"
                  error={touched.phone1 && errors.phone1}
                  required
                />
              </div>
              <div className="mb-3 sm:mb-4 md:mb-[40px]">
                <InputField
                  label="Alt Phone Number"
                  placeholder="Enter Alternate Phone Number"
                  value={values.phone2}
                  onChange={handleChange}
                  name="phone2"
                  error={touched.phone2 && errors.phone2}
                  required
                />
              </div>

              <div className="flex justify-between items-center gap-2 mt-[50px]">
                <Button
                  label="Cancel"
                  onClick={onClose}
                  className="!text-black !bg-transparent"
                />
                <Button label="Submit" type="submit" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
