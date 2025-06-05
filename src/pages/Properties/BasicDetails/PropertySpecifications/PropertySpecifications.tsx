import React, { forwardRef, useImperativeHandle, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../../components/input/inputtext";
import FileUploadField from "../../../../components/input/FileUploadField";
import InputAreaField from "../../../../components/input/TextArea";

import { PropertyContext } from "../../../../MyContext/MyContext";
import OptionInputField from "../../../../components/input/drop_down";

interface PropertySpecificationsHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface PropertySpecificationsFormValues {
  bedrooms: string;
  bathrooms: string;
  propertySize: string;
  landSize: string;
  parkingSpaces: string;
  yearBuilt: string;
  unitsAvailable: string;
  description: string;
  overview: string;
  documents: File[];
  director_id: string; // Add this field
}

const PropertySpecifications = forwardRef<PropertySpecificationsHandles>(
  (props, ref) => {
    const { formData, setSpecifications } = useContext(PropertyContext)!;

    // Add your options for the dropdown
    const propertyTypeOptions = [
      { value: 0, label: "customers" },
      { value: 1, label: "admin" },
      { value: 2, label: "marketer" },
      { value: 3, label: "director" },
      { value: 4, label: "accountant" },
      { value: 5, label: "hr" },
    ];

    const validationSchema = Yup.object().shape({
      bedrooms: Yup.string().required("Number of bedrooms is required"),
      bathrooms: Yup.string().required("Number of bathrooms is required"),
      propertySize: Yup.string().required("Property size is required"),
      description: Yup.string().required("Description is required"),
      overview: Yup.string().required("Overview is required"),
      director_id: Yup.string().required("Director is required"), // Add validation
    });

    const formik = useFormik<PropertySpecificationsFormValues>({
      initialValues: {
        ...formData.specifications,
        director_id: "", // Add initial value
      },
      validationSchema,
      onSubmit: (values) => {
        setSpecifications(values);
        alert(JSON.stringify(values, null, 2));
      },
    });

    useImperativeHandle(ref, () => ({
      handleSubmit: async () => {
        const errors = await formik.validateForm();
        const hasErrors = Object.keys(errors).length > 0;

        if (hasErrors) {
          formik.setTouched(
            Object.keys(errors).reduce((acc, key) => {
              acc[key] = true;
              return acc;
            }, {} as { [field: string]: boolean }),
            true
          );
          return false;
        } else {
          formik.handleSubmit();
          return true;
        }
      },
      isValid: formik.isValid,
    }));

    return (
      <form onSubmit={formik.handleSubmit} className="space-y-[30px]">
        <OptionInputField
          label="Role"
          placeholder="Select director"
          name="director_id"
          value={formik.values.director_id}
          onChange={(value: any) => formik.setFieldValue("director_id", value)}
          options={propertyTypeOptions}
          dropdownTitle="Roles"
          error={
            formik.touched.director_id && formik.errors.director_id
              ? formik.errors.director_id
              : undefined
          }
        />
        <div className="grid md:grid-cols-2 gap-12">
          <InputField
            label="Number of Bedrooms"
            placeholder="Enter Number of Bedrooms"
            name="bedrooms"
            value={formik.values.bedrooms}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                {
                  formik.setFieldValue("bedrooms", newValue);
                }
              }
            }}
            error={
              formik.touched.bedrooms && formik.errors.bedrooms
                ? formik.errors.bedrooms
                : undefined
            }
          />
          <InputField
            label="Number of Bathrooms"
            placeholder="Enter Number of Bathrooms"
            name="bathrooms"
            value={formik.values.bathrooms}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                {
                  formik.setFieldValue("bathrooms", newValue);
                }
              }
            }}
            error={
              formik.touched.bathrooms && formik.errors.bathrooms
                ? formik.errors.bathrooms
                : undefined
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12"></div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="relative">
            <p className="text-sm font-[325] text-[#768676] absolute top-10 z-20 right-3">
              Sq M
            </p>
            <InputField
              label="Property Size"
              placeholder="Enter Property Size"
              name="propertySize"
              value={formik.values.propertySize}
              onChange={(e) => {
                let newValue = e.target.value.replace(/,/g, "");
                if (/^\d*$/.test(newValue)) {
                  {
                    formik.setFieldValue("propertySize", newValue);
                  }
                }
              }}
              error={
                formik.touched.propertySize && formik.errors.propertySize
                  ? formik.errors.propertySize
                  : undefined
              }
            />
          </div>

          <InputField
            label="Land Size"
            placeholder="Enter Land Size"
            name="landSize"
            value={formik.values.landSize}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                {
                  formik.setFieldValue("landSize", newValue);
                }
              }
            }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <InputField
            label="Parking Spaces"
            placeholder="Enter Parking Spaces"
            name="parkingSpaces"
            value={formik.values.parkingSpaces}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                {
                  formik.setFieldValue("parkingSpaces", newValue);
                }
              }
            }}
          />

          <InputField
            label="Year Built"
            placeholder="Enter Year Built"
            name="yearBuilt"
            value={formik.values.yearBuilt}
            onChange={formik.handleChange}
            type="date"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <InputField
            label="Units Available"
            placeholder="Enter Units Available"
            name="unitsAvailable"
            value={formik.values.unitsAvailable}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                {
                  formik.setFieldValue("unitsAvailable", newValue);
                }
              }
            }}
          />
        </div>

        <InputAreaField
          label="Description"
          placeholder="Enter your Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          required
          rows={6}
          error={
            formik.touched.description && formik.errors.description
              ? formik.errors.description
              : undefined
          }
        />

        <InputAreaField
          label="Overview"
          placeholder="Enter your Overview"
          name="overview"
          value={formik.values.overview}
          onChange={formik.handleChange}
          required
          rows={6}
          error={
            formik.touched.overview && formik.errors.overview
              ? formik.errors.overview
              : undefined
          }
        />

        <FileUploadField
          label="Upload Document"
          placeholder=" Upload Property Agreement"
          onChange={(files) => formik.setFieldValue("documents", files)}
          accept=".pdf,.doc,.docx"
        />
      </form>
    );
  }
);

PropertySpecifications.displayName = "PropertySpecifications";

export default PropertySpecifications;
