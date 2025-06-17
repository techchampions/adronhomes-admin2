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
  name: string;
  role: string;
  picture: null | File;
}

const initialValues: FormData = {
  name: "",
  picture: null,
  role: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Office name is required"),
  role: Yup.string().required("Role is required"),
  //   picture: Yup.array().required("picture is required"),
});

export default function AddLeader({
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
            Add New Leader{" "}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6">
          Add a new leader with a role{" "}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, setFieldValue, values }) => (
            <Form>
              <label className="mb-3 mx-auto cursor-pointer border border-dashed border-gray-300 overflow-hidden p-2 rounded-full relative w-[100px] h-[100px] flex flex-col justify-center items-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue("picture", file);
                    }
                  }}
                />
                {values.picture ? (
                  <img
                    src={
                      values.picture
                        ? URL.createObjectURL(values.picture)
                        : "/user.svg"
                    }
                    alt="Profile"
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex text-xs">+ Add Image</div>
                )}
              </label>
              <div className="mb-3 sm:mb-4">
                <InputField
                  label="Name"
                  placeholder="Enter name"
                  value={values.name}
                  onChange={handleChange}
                  name="name"
                  error={touched.name && errors.name}
                  //   required
                />
              </div>

              <div className="mb-3 sm:mb-4">
                <InputField
                  label="Role"
                  placeholder="Enter Role"
                  value={values.role}
                  onChange={handleChange}
                  name="role"
                  error={touched.role && errors.role}
                  //   required
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
