import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../input/Button";
import { useCreateFAQs, useUpdateFAQs } from "../../../utils/hooks/mutations";
import SoosarInputField from "../../soosarInput";
import ImageUploadField from "../../SoosarImageInput";
import { FAQItem, FAQPayload } from "../../../pages/Properties/types/FAQsTypes";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  faqItem: FAQItem | undefined;
}

const validationSchema = Yup.object().shape({
  answer: Yup.string().required("Name is required"),
  question: Yup.string().required("Comment is required"),
});

export default function EditFAQs({
  isOpen = true,
  onClose = () => {},
  faqItem,
}: ModalProps) {
  const initialValues = {
    question: faqItem?.question,
    answer: faqItem?.answer,
  };
  const { mutate: update, isPending } = useUpdateFAQs();
  const handleSubmit = (values: typeof initialValues) => {
    const payload: FAQPayload = {
      question: values.question,
      answer: values.answer,
      faq_id: faqItem?.id,
    };
    update(payload, {
      onSuccess() {
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
            Update FAQs{" "}
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
              <div className=" px-7">
                <label htmlFor="" className="text-sm text-gray-500">
                  Question
                </label>
                <SoosarInputField
                  name="question"
                  placeholder="Enter Question"
                />
              </div>

              <div className=" px-7">
                <label htmlFor="" className="text-sm text-gray-500">
                  Answer
                </label>
                <SoosarInputField name="answer" placeholder="Enter Answer" />
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
                  loadingText="Saving..."
                  isLoading={isPending}
                  disabled={isPending}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
