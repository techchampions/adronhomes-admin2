import { Formik, Form } from "formik";
import * as Yup from "yup";
import SoosarInputField from "../../soosarInput";
import Button from "../../input/Button";
import SmallLoader from "../../SmallLoader";
import { Mail, MapPin, Phone } from "lucide-react";
import { useUpdateSettingsInfo } from "../../../utils/hooks/mutations";
import { SocialPayload } from "../../../pages/Properties/types/SocialsTypes";
import { useGetMainAddress } from "../../../utils/hooks/query";

const MainAddressInfo = () => {
  const { data, isLoading, isError } = useGetMainAddress();
  const { mutate: update, isPending } = useUpdateSettingsInfo();

  const info = data?.data.data || [];
  const address = info.find((item) => item.name === "Address");

  const initialValues = {
    address: address?.value,
  };

  const validationSchema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
  });
  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-4xl">
        <SmallLoader />
      </div>
    );
  }
  const handleSubmit = (values: typeof initialValues) => {
    const addresspayload: SocialPayload = {
      name: address?.name,
      type: address?.type,
      value: values.address,
      id: address?.id,
    };
    if (values.address != address?.value) {
      update(addresspayload);
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
              <h4 className="mb-4">Main Office Address</h4>
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
              name="address"
              icon={<MapPin />}
              placeholder="Address"
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MainAddressInfo;
