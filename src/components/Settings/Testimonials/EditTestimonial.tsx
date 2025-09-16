import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { FiEyeOff } from "react-icons/fi";
import InputField from "../../input/inputtext";
import OptionInputField from "../../input/drop_down";
import Button from "../../input/Button";
import InputAreaField from "../../input/TextArea";
import {
  useAddLeader,
  useCreateAccount,
  useEditAccount,
  useUpdateTestimonial,
} from "../../../utils/hooks/mutations";
import { CreateLeaderPayload } from "../../../pages/Properties/types/LeadershipDataTypes";
import { toast } from "react-toastify";
import SoosarInputField from "../../soosarInput";
import {
  AccountDetail,
  CreateAccountPayload,
} from "../../../pages/Properties/types/AccountDetailsTypes";
import {
  Testimonial,
  TestimonialPayload,
} from "../../../pages/Properties/types/TestimonialTypes";
import ImageUploadField from "../../SoosarImageInput";
import { FaYoutube } from "react-icons/fa";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  client: Testimonial | undefined;
}

const validationSchema = Yup.object().shape({
  client_name: Yup.string().required("Name is required"),
  video_link: Yup.string().required("Required"),
  client_image: Yup.mixed().required("Image is required"),
  // client_flag: Yup.mixed().required("Country is required"),
});

export default function EditTestimonial({
  isOpen = true,
  onClose = () => {},
  client,
}: ModalProps) {
  const initialValues = {
    client_image: client?.client_image || "",
    // client_comment: client?.client_comment || "",
    client_name: client?.client_name || "",
    video_link: client?.video_link || "",
  };
  const { mutate: update, isPending } = useUpdateTestimonial();
  const handleSubmit = (values: typeof initialValues) => {
    const image =
      typeof values.client_image === "string" ? undefined : values.client_image;
    const payload: TestimonialPayload = {
      id: client?.id || 0,
      client_name: values.client_name,
      client_image: image,
      video_link: values.video_link,
    };
    update(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10 px-10">
        <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
          <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">
            Edit Testimonial{" "}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-3 sm:mb-4 md:mb-6">
          {/* Add a new account for receiving payment{" "} */}
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
              <div className="mb-1.5 flex justify-center gap-4 px-4">
                <ImageUploadField
                  name="client_image"
                  width={150}
                  height={150}
                  className="!w-fit"
                  label="Client Image"
                />
              </div>
              <div className=" px-7">
                <label htmlFor="" className="text-sm text-gray-500">
                  Client Name
                </label>
                <SoosarInputField name="client_name" placeholder="Enter name" />
              </div>
              <div className=" px-7 ">
                <label htmlFor="" className="text-sm text-gray-500">
                  Video Link
                </label>
                <SoosarInputField
                  icon={<FaYoutube />}
                  name="video_link"
                  placeholder="Enter country Flag link "
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
