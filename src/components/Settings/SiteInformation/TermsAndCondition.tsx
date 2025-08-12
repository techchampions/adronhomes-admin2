import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import InputField from "../../input/inputtext";
import SoosarInputField from "../../soosarInput";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoTiktok,
  IoLogoTwitter,
  IoLogoWhatsapp,
} from "react-icons/io5";
import Button from "../../input/Button";

const TermsAndConditions = () => {
  const initialValues = {
    terms: "",
    conditions: "",
    policy: "",
  };

  const validationSchema = Yup.object().shape({
    terms: Yup.string().required("Terms are required"),
    conditions: Yup.string().required("Conditions is required"),
    policy: Yup.string().required("Policy is required"),
  });
  const handleSubmit = (values: typeof initialValues) => {
    console.log("Form submitted", values);
  };

  return (
    <div className="bg-white p-6 rounded-4xl col-span-2">
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
          <Form className="flex flex-col gap-2">
            <h4 className="mb-4">Site Terms and Conditions</h4>
            <SoosarInputField
              name="terms"
              type="textarea"
              rows={7}
              placeholder="Enter Terms"
            />
            <SoosarInputField
              name="conditions"
              type="textarea"
              rows={7}
              placeholder="Enter Conditions"
            />
            <SoosarInputField
              name="policy"
              type="textarea"
              rows={7}
              placeholder="Enter site Policy"
            />
            <div className="flex justify-end mt-4">
              <Button label="Save" className="!w-fit px-8" />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TermsAndConditions;
