import React, { forwardRef, useImperativeHandle, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../../components/input/inputtext";
import FileUploadField from "../../../../components/input/FileUploadField";
import InputAreaField from "../../../../components/input/TextArea";
import { PropertyContext } from "../../../../MyContext/MyContext";

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
}

const PropertySpecifications = forwardRef<PropertySpecificationsHandles>((props, ref) => {
  const { formData, setSpecifications } = useContext(PropertyContext)!;

  const validationSchema = Yup.object().shape({
    bedrooms: Yup.string().required("Number of bedrooms is required"),
    bathrooms: Yup.string().required("Number of bathrooms is required"),
    propertySize: Yup.string().required("Property size is required"),
    description: Yup.string().required("Description is required"),
    overview: Yup.string().required("Overview is required"),
  });

  const formik = useFormik<PropertySpecificationsFormValues>({
    initialValues: formData.specifications,
    validationSchema,
    onSubmit: (values) => {
      setSpecifications(values);
    },
  });

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      formik.handleSubmit();
    },
    isValid: formik.isValid && Object.keys(formik.touched).length > 0
  }));

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-[30px]">
      <div className="grid   md:grid-cols-2 gap-12">
        <InputField
          label="Number of Bedrooms"
          placeholder="Enter Number of Bedrooms"
          name="bedrooms"
          value={formik.values.bedrooms}
          onChange={formik.handleChange}
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
          onChange={formik.handleChange}
          error={
            formik.touched.bathrooms && formik.errors.bathrooms
              ? formik.errors.bathrooms
              : undefined
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
       <div className="relative">
         <p className="text-sm font-[325] text-[#768676] absolute top-10 z-20 right-3">Sq M</p>
        <InputField
          label="Property Size"
          placeholder="Enter Property Size"
          name="propertySize"
          value={formik.values.propertySize}
          onChange={formik.handleChange}
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
          onChange={formik.handleChange}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <InputField
          label="Parking Spaces"
          placeholder="Enter Parking Spaces"
          name="parkingSpaces"
          value={formik.values.parkingSpaces}
          onChange={formik.handleChange}
        />

        <InputField
          label="Year Built"
          placeholder="Enter Year Built"
          name="yearBuilt"
          value={formik.values.yearBuilt}
          onChange={formik.handleChange}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <InputField
          label="Units Available"
          placeholder="Enter Units Available"
          name="unitsAvailable"
          value={formik.values.unitsAvailable}
          onChange={formik.handleChange}
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
});

PropertySpecifications.displayName = "PropertySpecifications";

export default PropertySpecifications;