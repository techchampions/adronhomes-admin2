import { Formik, Form } from "formik";
import * as Yup from "yup";
import SoosarInputField from "../../soosarInput";
import Button from "../../input/Button";
import SmallLoader from "../../SmallLoader";
import { Mail } from "lucide-react";
import { useUpdateSettingsInfo } from "../../../utils/hooks/mutations";
import { SocialPayload } from "../../../pages/Properties/types/SocialsTypes";
import { useGetComplainsContact } from "../../../utils/hooks/query";

const ComplaintContactInfo = () => {
  const { data, isLoading, isError } = useGetComplainsContact();
  const { mutate: update, isPending } = useUpdateSettingsInfo();

  const info = data?.data.data || [];
  const email = info.find((item) => item.name === "Online Compliant");

  const initialValues = {
    email: email?.value,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
  });
  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-4xl">
        <SmallLoader />
      </div>
    );
  }
  const handleSubmit = (values: typeof initialValues) => {
    const emailpayload: SocialPayload = {
      name: email?.name,
      type: email?.type,
      value: values.email,
      id: email?.id,
    };
    if (values.email != email?.value) {
      update(emailpayload);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h4 className="mb-4">Customer Complaint Contact</h4>
              <Button
                label="Save"
                type="submit"
                loadingText="Saving..."
                disabled={!isValid || isPending}
                className="!w-fit px-8 !py-1 !text-xs"
                isLoading={isPending}
              />
            </div>
            <SoosarInputField
              name="email"
              icon={<Mail />}
              placeholder="Email Address"
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ComplaintContactInfo;
