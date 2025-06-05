import React, { forwardRef, useImperativeHandle, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../../components/input/inputtext";
import FileUploadField from "../../../../components/input/FileUploadField";
import InputAreaField from "../../../../components/input/TextArea";

import { PropertyContext } from "../../../../MyContext/MyContext";
import OptionInputField from "../../../../components/input/drop_down";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../components/Redux/store";
import { personnels } from "../../../../components/Redux/personnel/personnel_thunk";
import { directors } from "../../../../components/Redux/directors/directors_thunk";

interface LandFormHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface LandFormValues {
  plotShape: string;
  topography: string;
  propertySize: string;
  landSize: string;
  roadAccess: string;
  titleDocumentType: string;
  unitsAvailable: string;
  description: string;
  overview: string;
  documents: File[];
    director_id: string; // Add this field
}
interface DropdownOption {
  label: string;
  value: string | number;
}
const LandForm = forwardRef<LandFormHandles>((props, ref) => {
  const { formData, setLandForm } = useContext(PropertyContext)!;
      const dispatch = useDispatch<AppDispatch>();
      useEffect(() => {
      dispatch(directors());
      }, [dispatch]);
    
      const {
        loading: userLoading,
        error: userError,
    data
      } = useSelector((state: RootState) => state.directors);
     
 const labels: DropdownOption[] = Array.isArray(data)
  ? data.map(person => ({
      label: `${person.first_name} ${person.last_name}`,
      value: person.id,
    }))
  : [];

  const validationSchema = Yup.object().shape({
    propertySize: Yup.string().required("Property size is required"),
    description: Yup.string().required("Description is required"),
    overview: Yup.string().required("Overview is required"),
       director_id: Yup.string().required("Director is required"), // Add validation
  });

  const formik = useFormik<LandFormValues>({
    initialValues: formData.landForm,
    validationSchema,
    onSubmit: (values) => {
      setLandForm(values);
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
  isValid: formik.isValid 
}));
 const propertyTypeOptions = [
      { value: 0, label: "customers" },
      { value: 1, label: "admin" },
      { value: 2, label: "marketer" },
      { value: 3, label: "director" },
      { value: 4, label: "accountant" },
      { value: 5, label: "hr" },
    ];
  // Options for dropdowns
  const plotShapeOptions = [
    { value: "regular", label: "Regular" },
    { value: "irregular", label: "Irregular" },
    { value: "rectangular", label: "Rectangular" },
    { value: "square", label: "Square" },
    { value: "triangular", label: "Triangular" },
  ];

  const topographyOptions = [
    { value: "flat", label: "Flat" },
    { value: "gently-sloping", label: "Gently Sloping" },
    { value: "steep", label: "Steep" },
    { value: "uneven", label: "Uneven" },
    { value: "rolling", label: "Rolling" },
  ];

  const roadAccessOptions = [
    { value: "paved", label: "Paved Road" },
    { value: "dirt", label: "Dirt Road" },
    { value: "gravel", label: "Gravel Road" },
    { value: "none", label: "No Direct Road Access" },
  ];

  const titleDocumentOptions = [
    { value: "deed", label: "Deed" },
    { value: "certificate", label: "Certificate of Title" },
    { value: "lease", label: "Lease Agreement" },
    { value: "allotment", label: "Letter of Allotment" },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-[30px]">
          <OptionInputField
          label="Role"
          placeholder="Select director"
          name="director_id"
          value={formik.values.director_id}
          onChange={(value: any) => formik.setFieldValue("director_id", value)}
          options={labels}
          dropdownTitle="Roles"
          error={
            formik.touched.director_id && formik.errors.director_id
              ? formik.errors.director_id
              : undefined
          }
        />
      <div className="grid grid-cols-2 gap-12">
        <OptionInputField
          label="Plot Shape"
          placeholder="Select Plot Shape"
          name="plotShape"
          value={formik.values.plotShape}
          onChange={(value) => formik.setFieldValue("plotShape", value)}
          options={plotShapeOptions}
        />

        <OptionInputField
          label="Topography"
          placeholder="Select Topography"
          name="topography"
          value={formik.values.topography}
          onChange={(value) => formik.setFieldValue("topography", value)}
          options={topographyOptions}
        />
      </div>

      <div className="grid grid-cols-2 gap-12">
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

      <div className="grid grid-cols-2 gap-12">
        <OptionInputField
          label="Road Access"
          placeholder="Select Road Access"
          name="roadAccess"
          value={formik.values.roadAccess}
          onChange={(value) => formik.setFieldValue("roadAccess", value)}
          options={roadAccessOptions}
        />

        <OptionInputField
          label="Title Document Type"
          placeholder="Select Title Document Type"
          name="titleDocumentType"
          value={formik.values.titleDocumentType}
          onChange={(value) => formik.setFieldValue("titleDocumentType", value)}
          options={titleDocumentOptions}
        />
      </div>

      <div className="grid grid-cols-2 gap-12">
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
        label="Upload Property Agreement"
        placeholder="Click to Upload Property Agreement"
        onChange={(files) => formik.setFieldValue("documents", files)}
        accept=".pdf,.doc,.docx"
      />
    </form>
  );
});

LandForm.displayName = "LandForm";

export default LandForm;