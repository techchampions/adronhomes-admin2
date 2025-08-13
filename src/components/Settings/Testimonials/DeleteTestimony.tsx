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
  useDeleteTestimony,
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
import SmallLoader from "../../SmallLoader";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  client: Testimonial | undefined;
}

const validationSchema = Yup.object().shape({
  client_name: Yup.string().required("Name is required"),
  client_comment: Yup.string().required("Comment is required"),
  client_image: Yup.mixed().required("Image is required"),
  // client_flag: Yup.mixed().required("Country is required"),
});

export default function DeleteTestimonial({
  isOpen = true,
  onClose = () => {},
  client,
}: ModalProps) {
  const { mutate: deleteTestimony, isPending } = useDeleteTestimony();
  const handleDelete = () => {
    const payload: TestimonialPayload = {
      id: client?.id || 0,
    };
    deleteTestimony(payload, {
      onSuccess() {
        onClose();
      },
    });
  };
  if (isPending) {
    return <SmallLoader />;
  }

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
        <div className="flex flex-col gap-5">
          <p>Are you sure you want to delete testimony?</p>
          <div className="space-y-2">
            <Button
              label="Yes, Delete"
              className="!bg-red-500 text-sm"
              onClick={handleDelete}
            />
            <Button
              label="No, Cancel"
              className="!bg-gray-400 text-sm"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
