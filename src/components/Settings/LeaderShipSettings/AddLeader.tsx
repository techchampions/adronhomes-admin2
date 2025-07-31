import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { FiEyeOff } from "react-icons/fi";
import InputField from "../../input/inputtext";
import OptionInputField from "../../input/drop_down";
import Button from "../../input/Button";
import InputAreaField from "../../input/TextArea";
import { useAddLeader } from "../../../utils/hooks/mutations";
import { CreateLeaderPayload } from "../../../pages/Properties/types/LeadershipDataTypes";
import { toast } from "react-toastify";
import SoosarInputField from "../../soosarInput";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface FormData {
  name: string;
  position: string;
  description: string;
  picture: null | File;
}

const initialValues = {
  name: "",
  picture: null,
  description: "",
  position: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  picture: Yup.mixed().required("picture is required"),
  position: Yup.string().required("Position is required"),
  description: Yup.string().required("Description is required"),
});

export default function AddLeader({
  isOpen = true,
  onClose = () => {},
}: ModalProps) {
  const { mutate: createLeader, isError, isPending } = useAddLeader();
  const handleSubmit = (values: CreateLeaderPayload) => {
    console.log("Form submitted:", values);
    createLeader(values, {
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
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full md:w-[450px] max-h-[95%] overflow-y-scroll scrollbar-hide mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10 px-10">
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

        {/* <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6">
          Add a new leader with a role{" "}
        </p> */}

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
            isValid,
          }) => (
            <Form>
              <label className="mb-3 mx-auto cursor-pointer border border-dashed border-gray-300 overflow-hidden p-1 rounded-full relative w-[150px] h-[150px] flex flex-col justify-center items-center">
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
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex text-xs">+ Add Image</div>
                )}
              </label>
              <div className="mb-1.5 px-7">
                <label htmlFor="" className="text-sm text-gray-500">
                  Name
                </label>
                <SoosarInputField name="name" placeholder="Enter name" />
              </div>

              <div className="mb-1.5 px-7">
                <label htmlFor="" className="text-sm text-gray-500">
                  Position
                </label>
                <SoosarInputField
                  name="position"
                  placeholder="Enter Position"
                />
              </div>
              <div className="mb-1.5 px-7">
                <label htmlFor="" className="text-sm text-gray-500">
                  Description
                </label>
                <SoosarInputField
                  name="description"
                  placeholder="Enter Description"
                  type="textarea"
                />
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
                  disabled={isPending || isSubmitting || !isValid}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
