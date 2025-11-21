import { Formik, Form } from "formik";
import * as Yup from "yup";
import SoosarInputField from "../../soosarInput";
import Button from "../../input/Button";
import SmallLoader from "../../SmallLoader";
import { Mail, MapPin, Phone } from "lucide-react";
import { useUpdateSettingsInfo } from "../../../utils/hooks/mutations";
import { SocialPayload } from "../../../pages/Properties/types/SocialsTypes";
import { useGetDigits } from "../../../utils/hooks/query";

const DigitsInfo = () => {
  const { data, isLoading, isError } = useGetDigits();
  const { mutate: update, isPending } = useUpdateSettingsInfo();

  const info = data?.data.data || [];
  const properties = info.find((item) => item.name === "Properties");
  const numOfClients = info.find((item) => item.name === "Number of Clients");
  const team = info.find((item) => item.name === "Teams Members");
  const location = info.find((item) => item.name === "Location");
  const exp = info.find((item) => item.name === "Years of Exp.");

  const initialValues = {
    properties: properties?.value,
    numOfClients: numOfClients?.value,
    team: team?.value,
    location: location?.value,
    exp: exp?.value,
  };

  const validationSchema = Yup.object().shape({
    properties: Yup.string().required("required"),
    nomOfClients: Yup.string().required("required"),
    team: Yup.string().required("required"),
    location: Yup.string().required("required"),
    exp: Yup.string().required("required"),
  });
  if (isLoading) {
    return (
      <div className="p-4 rounded-4xl bg-white">
        <SmallLoader />
      </div>
    );
  }
  const handleSubmit = (values: typeof initialValues) => {
    const Propertypayload: SocialPayload = {
      name: properties?.name,
      type: properties?.type,
      value: values.properties,
      id: properties?.id,
    };
    const numOfClientspayload: SocialPayload = {
      name: numOfClients?.name,
      type: numOfClients?.type,
      value: values.numOfClients,
      id: numOfClients?.id,
    };
    const teamPayload: SocialPayload = {
      name: team?.name,
      type: team?.type,
      value: values.team,
      id: team?.id,
    };
    const locationPayload: SocialPayload = {
      name: location?.name,
      type: location?.type,
      value: values.location,
      id: location?.id,
    };
    const expPayload: SocialPayload = {
      name: exp?.name,
      type: exp?.type,
      value: values.exp,
      id: exp?.id,
    };
    if (values.properties != properties?.value) {
      update(Propertypayload);
    }
    if (values.numOfClients != numOfClients?.value) {
      update(numOfClientspayload);
    }
    if (values.team != team?.value) {
      update(teamPayload);
    }
    if (values.location != location?.value) {
      update(locationPayload);
    }
    if (values.exp != exp?.value) {
      update(expPayload);
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
              <h4 className="mb-4">Digits Info</h4>
              <Button
                label="Save"
                type="submit"
                loadingText="Saving..."
                disabled={!isValid || isPending}
                className="!w-fit px-8 !py-1 !text-xs"
                isLoading={isPending}
              />
            </div>
            <div className="md:flex gap-1 text-xs justify-between">
              <div className="text-center">
                <SoosarInputField
                  name="properties"
                  placeholder="100+"
                  className="rounded-lg !text-xs"
                />
                <label htmlFor="">Properites</label>
              </div>
              <div className="text-center">
                <SoosarInputField
                  name="numOfClients"
                  placeholder="Alternate Phone number"
                  className="rounded-lg"
                />
                <label htmlFor="" className="truncate">
                  No. of clients
                </label>
              </div>
              <div className="text-center">
                <SoosarInputField
                  name="team"
                  placeholder="Team Members"
                  className="rounded-lg"
                />
                <label htmlFor="" className="truncate">
                  Team
                </label>
              </div>
              <div className="text-center">
                <SoosarInputField
                  name="location"
                  placeholder="Locations"
                  className="rounded-lg"
                />
                <label htmlFor="" className="truncate">
                  Properites
                </label>
              </div>
              <div className="text-center">
                <SoosarInputField
                  name="exp"
                  placeholder="Years of Exp."
                  className="rounded-lg"
                />
                <label htmlFor="" className="truncate">
                  Years of Exp.
                </label>
              </div>
            </div>
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

export default DigitsInfo;
