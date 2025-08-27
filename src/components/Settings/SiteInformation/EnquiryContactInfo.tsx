import { Formik, Form } from "formik";
import * as Yup from "yup";
import SoosarInputField from "../../soosarInput";
import Button from "../../input/Button";
import { useGetEquiryInfo } from "../../../utils/hooks/query";
import SmallLoader from "../../SmallLoader";
import { Mail, MapPin, Phone } from "lucide-react";
import { useUpdateSettingsInfo } from "../../../utils/hooks/mutations";
import { SocialPayload } from "../../../pages/Properties/types/SocialsTypes";

const EnquiryContactInfo = () => {
  const { data, isLoading, isError } = useGetEquiryInfo();
  const { mutate: update, isPending } = useUpdateSettingsInfo();

  const info = data?.data.data || [];
  const phoneNumber = info.find((item) => item.name === "Phone Number");
  const email = info.find((item) => item.name === "Email");
  // const address = info.find((item) => item.name === "Address");

  const initialValues = {
    phoneNumber: phoneNumber?.value,
    email: email?.value,
    // address: address?.value,
  };

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string().required("Phone No. is required"),
    email: Yup.string().required("Email is required"),
  });
  if (isLoading) {
    return (
      <div className="p-4 bg-white-rounded-4xl">
        <SmallLoader />
      </div>
    );
  }
  const handleSubmit = (values: typeof initialValues) => {
    const Emailpayload: SocialPayload = {
      name: email?.name,
      type: email?.type,
      value: values.email,
      id: email?.id,
    };
    const phonepayload: SocialPayload = {
      name: phoneNumber?.name,
      type: phoneNumber?.type,
      value: values.phoneNumber,
      id: phoneNumber?.id,
    };
    if (values.phoneNumber != phoneNumber?.value) {
      update(phonepayload);
    }
    if (values.email != email?.value) {
      update(Emailpayload);
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
            <div className="flex items-start justify-between">
              <h4 className="mb-4">Contact Info For Customer Enquiry</h4>
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
              name="phoneNumber"
              icon={<Phone />}
              placeholder="Phone Number"
            />
            {/* <SoosarInputField
              name="altPhoneNumber"
              icon={<IoCallOutline />}
              placeholder="Alternate Phone number"
            /> */}
            <SoosarInputField
              name="email"
              icon={<Mail />}
              placeholder="Email Address"
            />
            {/* <SoosarInputField
              name="address"
              icon={<MapPin />}
              placeholder="Address"
            /> */}
            {/* <SoosarInputField
              name="email"
              icon={<IoMailOutline />}
              placeholder="Alternate Email"
            /> */}
            {/* <SoosarInputField
              name="whatsapp"
              icon={<IoLogoWhatsapp />}
              placeholder="WhatsApp Number"
            />
            <SoosarInputField name="fax" icon={<MdFax />} placeholder="Fax" /> */}
            {/* <div className="flex justify-end mt-4">
              <Button
                label="Save"
                type="submit"
                loadingText="Saving..."
                disabled={!isValid || isPending}
                className="!w-fit px-8"
                isLoading={isPending}
              />
            </div> */}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EnquiryContactInfo;
