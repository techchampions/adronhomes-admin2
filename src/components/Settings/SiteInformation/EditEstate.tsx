import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../input/Button";
import {
  useUpdateEstate,
  useUpdateTestimonial,
} from "../../../utils/hooks/mutations";
import SoosarInputField from "../../soosarInput";
import {
  Testimonial,
  TestimonialPayload,
} from "../../../pages/Properties/types/TestimonialTypes";
import ImageUploadField from "../../SoosarImageInput";
import { PropertyLocation } from "../../../pages/Properties/types/EstateLocationTypes";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  item: PropertyLocation | undefined;
}

const validationSchema = Yup.object().shape({
  //   client_name: Yup.string().required("Name is required"),
  //   client_comment: Yup.string().required("Comment is required"),
  //   client_image: Yup.mixed().required("Image is required"),
  // client_flag: Yup.mixed().required("Country is required"),
});

export default function EditEstate({
  isOpen = true,
  onClose = () => {},
  item,
}: ModalProps) {
  const initialValues = {
    country_name: item?.country_name || "",
    state_name: item?.state_name || "",
    photo: item?.photo || "",
  };
  const { mutate: update, isPending } = useUpdateEstate();
  const handleSubmit = (values: typeof initialValues) => {
    const image = typeof values.photo === "string" ? undefined : values.photo;
    // const payload: TestimonialPayload = {
    //   id: client?.id || 0,
    //   client_comment: values.client_comment,
    //   client_name: values.client_name,
    //   client_image: image,
    //   client_country: values.client_country,
    // };
    const formData = new FormData();
    if (values.country_name && values.country_name !== item?.country_name) {
      formData.append("country_name", values.country_name);
    }
    if (values.state_name && values.state_name !== item?.state_name) {
      formData.append("state_name", values.state_name);
    }
    if (image) {
      formData.append("photo", image);
    }
    const payload = {
      id: item?.id || 0,
      formData: formData,
    };

    update(payload, {
      onSuccess(data, variables, context) {
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-h-[95%] overflow-y-scroll scrollbar-hide max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-10 px-10">
        <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
          <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">
            Edit Estate{" "}
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
                  name="photo"
                  width={250}
                  height={150}
                  className="!w-fit"
                  label="Estate Photo"
                />
              </div>
              <div className=" px-7">
                <label htmlFor="" className="text-sm text-gray-500">
                  Country
                </label>
                <SoosarInputField
                  name="country_name"
                  placeholder="Enter Country name"
                />
              </div>

              <div className=" px-7">
                <label htmlFor="" className="text-sm text-gray-500">
                  State
                </label>
                <SoosarInputField
                  name="state_name"
                  placeholder="Enter State name"
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
