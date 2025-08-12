import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import InputField from "../../input/inputtext";
import SoosarInputField from "../../soosarInput";
import {
  IoCall,
  IoCallOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoTiktok,
  IoLogoTwitter,
  IoLogoWhatsapp,
  IoMail,
  IoMailOutline,
} from "react-icons/io5";
import Button from "../../input/Button";
import { MdFax } from "react-icons/md";

const ContactInfo = () => {
  const initialValues = {
    phoneNumber: "",
    altPhoneNumber: "",
    email: "",
    altEmail: "",
    fax: "",
  };

  const validationSchema = Yup.object().shape({
    // facebook_link : Yup.string().required("Name is required"),
    // insta: Yup.string().required("Bank is required"),
    // account_number: Yup.string().required("Account Number is required"),
  });
  const handleSubmit = (values: typeof initialValues) => {
    console.log("Form submitted", values);
  };

  return (
    <div className="bg-white p-6 rounded-4xl">
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
            <h4 className="mb-4">Add Contact Info Here</h4>
            <SoosarInputField
              name="phoneNumber"
              icon={<IoCall />}
              placeholder="Phone Number"
            />
            <SoosarInputField
              name="altPhoneNumber"
              icon={<IoCallOutline />}
              placeholder="Alternate Phone number"
            />
            <SoosarInputField
              name="email"
              icon={<IoMail />}
              placeholder="Email Address"
            />
            <SoosarInputField
              name="email"
              icon={<IoMailOutline />}
              placeholder="Alternate Email"
            />
            <SoosarInputField
              name="whatsapp"
              icon={<IoLogoWhatsapp />}
              placeholder="WhatsApp Number"
            />
            <SoosarInputField name="fax" icon={<MdFax />} placeholder="Fax" />
            <div className="flex justify-end mt-4">
              <Button
                label="Save"
                className="!w-fit px-8"
                isLoading={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactInfo;
