import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

import InputField from "../../input/inputtext";
import Button from "../../input/Button";
import Header from "../../../general/Header";
import InputAreaField from "../../input/TextArea";

const AddHeaderDetails = () => {
  const initialValues = {
    header: "",
    name: "",
    slug: "",
    description: "",
    image: null,
    action_link: "",
  };
  const data = { name: "name", image: null };
  const validationSchema = Yup.object({
    header: Yup.string().required("Header is required"),
    name: Yup.string().required("Name is required"),
    slug: Yup.string().required("slug is required"),
    description: Yup.string().required("Description is required"),
    action_link: Yup.string().required("Action Link is required"),
  });
  const handleSubmit = () => {
    console.log("Saving");
  };
  return (
    <div className="p-8">
      <Header
        title="Settings"
        subtitle="Manage settings"
        history={true}
        buttonText="New Header"
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          return (
            <Form className="space-y-6">
              {/* Profile Picture */}
              <div className="bg-white rounded-3xl p-10 space-y-6">
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer border border-dashed border-gray-300 overflow-hidden p-2 rounded-2xl relative w-1/2 h-[300px] flex flex-col justify-center items-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFieldValue("image", file);
                        }
                      }}
                    />
                    {values.image || data.image ? (
                      <img
                        src={
                          values.image
                            ? URL.createObjectURL(values.image)
                            : data?.image
                            ? data?.image
                            : "/user.svg"
                        }
                        alt="Profile"
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex">+ Add Header Image</div>
                    )}
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="">
                    <InputField
                      label="header"
                      value={initialValues.header}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFieldValue("header", file);
                        }
                      }}
                      placeholder={initialValues.header}
                    />
                  </div>
                  <div className="">
                    <InputField
                      label="Name"
                      value={initialValues.name}
                      placeholder={initialValues.name}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFieldValue("header", file);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputField
                      label="Action Link"
                      value={initialValues.action_link}
                      placeholder={initialValues.action_link}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFieldValue("header", file);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <InputField
                      label="Slug"
                      value={initialValues.slug}
                      placeholder={initialValues.slug}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFieldValue("header", file);
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <InputAreaField
                    label="Description"
                    value=""
                    placeholder={initialValues.description}
                    onChange={(e) => {
                      const text = e.target.value?.[0];
                      if (text) {
                        setFieldValue("description", text);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="text-right">
                <Button
                  label={isSubmitting ? `Saving...` : `Save Changes`}
                  className="bg-black text-sm !w-fit px-6"
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddHeaderDetails;
