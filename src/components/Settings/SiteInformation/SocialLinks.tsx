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
import { useGetSocials } from "../../../utils/hooks/query";
import SmallLoader from "../../SmallLoader";
import { useUpdateSocial } from "../../../utils/hooks/mutations";
import { SocialPayload } from "../../../pages/Properties/types/SocialsTypes";

const SocialLinks = () => {
  const { data, isLoading } = useGetSocials();
  const { mutate: update, isPending } = useUpdateSocial();
  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-4xl">
        <SmallLoader />
      </div>
    );
  }
  const socials = data?.data.data || [];
  const facebook = socials.find((item) => item.name === "Facebook");
  const linkedin = socials.find((item) => item.name === "Linkedin");
  const whatsapp = socials.find((item) => item.name === "Whatsapp");
  const instagram = socials.find((item) => item.name === "Instagram");
  const twitter = socials.find((item) => item.name === "X");
  const tiktok = socials.find((item) => item.name === "Tiktok");
  const initialValues = {
    facebook_link: facebook?.value,
    instagram_link: instagram?.value,
    linkedin_link: linkedin?.value,
    whatsapp_link: whatsapp?.value,
    twitter_link: twitter?.value,
    tiktok_link: tiktok?.value,
  };

  const validationSchema = Yup.object().shape({
    // facebook_link : Yup.string().required("Name is required"),
    // insta: Yup.string().required("Bank is required"),
    // account_number: Yup.string().required("Account Number is required"),
  });
  const handleSubmit = (values: typeof initialValues) => {
    const facebookPayload: SocialPayload = {
      name: facebook?.name,
      type: facebook?.type,
      value: values.facebook_link,
      id: facebook?.id,
    };
    const instagramPayload: SocialPayload = {
      name: instagram?.name,
      type: instagram?.type,
      value: values.instagram_link,
      id: instagram?.id,
    };
    const twitterPayload: SocialPayload = {
      name: twitter?.name,
      type: twitter?.type,
      value: values.twitter_link,
      id: twitter?.id,
    };
    const whatsappPayload: SocialPayload = {
      name: whatsapp?.name,
      type: whatsapp?.type,
      value: values.whatsapp_link,
      id: whatsapp?.id,
    };
    const tiktokPayload: SocialPayload = {
      name: tiktok?.name,
      type: tiktok?.type,
      value: values.tiktok_link,
      id: tiktok?.id,
    };
    const linkedinPayload: SocialPayload = {
      name: linkedin?.name,
      type: linkedin?.type,
      value: values.linkedin_link,
      id: linkedin?.id,
    };
    if (values.facebook_link != facebook?.value) {
      update(facebookPayload);
    }
    if (values.linkedin_link != linkedin?.value) {
      update(linkedinPayload);
    }
    if (values.instagram_link != instagram?.value) {
      update(instagramPayload);
    }
    if (values.twitter_link != twitter?.value) {
      update(twitterPayload);
    }
    if (values.tiktok_link != tiktok?.value) {
      update(tiktokPayload);
    }
    if (values.whatsapp_link != whatsapp?.value) {
      update(whatsappPayload);
    }
    console.log("Form submitted", values);
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
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
            <h4 className="mb-4">Add Social Links Here</h4>
            <SoosarInputField
              name="facebook_link"
              icon={<IoLogoFacebook />}
              placeholder="FaceBook Link"
            />
            <SoosarInputField
              name="instagram_link"
              icon={<IoLogoInstagram />}
              placeholder="Instagram Link"
            />
            <SoosarInputField
              name="linkedin_link"
              icon={<IoLogoLinkedin />}
              placeholder="LinkedIn Link"
            />
            <SoosarInputField
              name="tiktok_link"
              icon={<IoLogoTiktok />}
              placeholder="TikTok Link"
            />
            <SoosarInputField
              name="twitter_link"
              icon={<IoLogoTwitter />}
              placeholder="Twitter Link"
            />
            <SoosarInputField
              name="whatsapp_link"
              icon={<IoLogoWhatsapp />}
              placeholder="WhatsApp Link"
            />
            <div className="flex justify-end mt-4">
              <Button
                label="Save"
                type="submit"
                isLoading={isPending}
                disabled={isPending}
                loadingText="Saving..."
                className="!w-fit px-8"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SocialLinks;
