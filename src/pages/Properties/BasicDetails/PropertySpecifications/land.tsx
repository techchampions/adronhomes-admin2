import React, {
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../../components/input/inputtext";
import FileUploadField from "../../../../components/input/FileUploadField";
import InputAreaField from "../../../../components/input/TextArea";
import { PropertyContext } from "../../../../MyContext/MyContext";
import OptionInputField from "../../../../components/input/drop_down";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../components/Redux/store";
import { directors } from "../../../../components/Redux/directors/directors_thunk";
import TagInputField from "../../../../components/input/TagInputField";
import EnhancedOptionInputField from "../../../../components/input/enhancedSelecet";

interface LandFormHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface LandFormValues {
  plotShape: string;
  topography: string;
  propertySize: string;
  landSize: string;
  roadAccess: string[];
  unitsAvailable: string;
  description: string;
  overview: string;
  documents: string;
  director_id: string;
  titleDocumentType: string[];
  fencing: string;
  gatedEstate: string;
  contactNumber: string;
  whatsAppLink: string;
  // publishOption: string;
    nearbyLandmarks: string[];
}

interface DropdownOption {
  label: string;
  value: string | number;
}

const LandForm = forwardRef<LandFormHandles>((props, ref) => {
  const { formData, setLandForm } = useContext(PropertyContext)!;
  const [titleDocumentType, setTitleDocumentType] = React.useState<string[]>(
    formData.landForm.titleDocumentType || []
  );
  const [roadAccess, setRoadAccess] = React.useState<string[]>(
    formData.landForm.roadAccess || []
  );
    const [nearbyLandmarks, setNearbyLandmarks] = React.useState<string[]>(
    formData.landForm.nearbyLandmarks || []
  ); 



  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(directors());
  }, [dispatch]);

  const {
    loading: userLoading,
    error: userError,
    data,
  } = useSelector((state: RootState) => state.directors);

  const labels: DropdownOption[] = Array.isArray(data)
    ? data.map((person) => ({
        label: `${person.first_name} ${person.last_name}`,
        value: person.id,
      }))
    : [];
     useEffect(() => {
    formik.setFieldValue("nearbyLandmarks", nearbyLandmarks);
  }, [nearbyLandmarks]);


  const validationSchema = Yup.object().shape({
    // propertySize: Yup.string().required("Property size is required"),
    description: Yup.string().required("Description is required"),
    // overview: Yup.string().required("Overview is required"),
    director_id: Yup.string().required("Director is required"),
    titleDocumentType: Yup.array()
      .of(Yup.string())
      .min(1, "At least one title document type is required")
      .required("Title Document Type is required"),
    roadAccess: Yup.array()
      .of(Yup.string())
      .min(1, "At least one access road type is required")
      .required("Access Road is required"),
    fencing: Yup.string().required("Please specify if the property is fenced"),
    gatedEstate: Yup.string().required("Please specify if it's a gated estate"),
    contactNumber: Yup.string().required("Contact number is required"),
    whatsAppLink: Yup.string().required("WhatsApp link is required"),
    // publishOption: Yup.string().required("Please select a publish option"),
    nearbyLandmarks: Yup.array()
      .of(Yup.string())
      .min(1, "At least one landmark is required")
      .required("Nearby Landmarks are required"),
  });

  useEffect(() => {
    formik.setFieldValue("roadAccess", roadAccess);
  }, [roadAccess]);

  useEffect(() => {
    formik.setFieldValue("titleDocumentType", titleDocumentType);
  }, [titleDocumentType]);
 const formik = useFormik<LandFormValues>({
    initialValues: {
      ...formData.landForm,
      titleDocumentType,
      roadAccess,
      nearbyLandmarks,
      fencing: formData.landForm.fencing || "",
      gatedEstate: formData.landForm.gatedEstate || "",
      contactNumber: formData.landForm.contactNumber || "",
      whatsAppLink: formData.landForm.whatsAppLink || "",
      // publishOption: formData.landForm.publishOption || "Draft",
    },
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
            acc[key as keyof LandFormValues] = true;
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

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const publishOptions = [
    { value: "Publish Now", label: "Publish Now" },
    { value: "Draft", label: "Draft" },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-[30px]">
     <EnhancedOptionInputField
  label="Director"
  placeholder="Select director"
  name="director_id"
  value={formik.values.director_id}
  onChange={(value) => formik.setFieldValue("director_id", value)}
  options={labels} // This should be the array of {label: "Name", value: "ID"}
  dropdownTitle="Directors"
  error={formik.touched.director_id && formik.errors.director_id}
  isSearchable={true}
/>
        <div className="grid md:grid-cols-2 gap-12">
        <InputField
          label="WhatsApp Link"
          placeholder="Enter WhatsApp link"
          name="whatsAppLink"
          value={formik.values.whatsAppLink}
          onChange={formik.handleChange}
          error={
            formik.touched.whatsAppLink && formik.errors.whatsAppLink
              ? formik.errors.whatsAppLink
              : undefined
          }
        />
          <InputField
          label="Contact Number"
          placeholder="Enter contact number"
          name="contactNumber"
          value={formik.values.contactNumber}
          onChange={formik.handleChange}
          error={
            formik.touched.contactNumber && formik.errors.contactNumber
              ? formik.errors.contactNumber
              : undefined
          }
        />
      </div>
      <div className=" gap-12">
        {/* <OptionInputField
          label="Plot Shape"
          placeholder="Select Plot Shape"
          name="plotShape"
          value={formik.values.plotShape}
          onChange={(value) => formik.setFieldValue("plotShape", value)}
          options={plotShapeOptions}
        /> */}
        {/* <OptionInputField
          label="Topography"
          placeholder="Select Topography"
          name="topography"
          value={formik.values.topography}
          onChange={(value) => formik.setFieldValue("topography", value)}
          options={topographyOptions}
        /> */}
      </div>

      <div className="grid  gap-12">
        {/* <div className="relative">
          <p className="text-sm font-[325] text-[#768676] absolute top-10 z-20 right-3">
            Sq M
          </p>
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
        </div> */}
          <div className="relative">
          <p className="text-sm font-[325] text-[#768676] absolute top-10 z-20 right-3">
            Sq M
          </p>
        <InputField
          label="Land Size"
          placeholder="Enter Land Size"
          name="landSize"
          value={formik.values.landSize}
          onChange={formik.handleChange}
        />   </div>
      </div>
         <TagInputField
        label="Nearby Landmarks"
        placeholder="Add nearby landmarks (e.g., Hospital, Mall)"
        values={nearbyLandmarks}
        onChange={(newLandmarks) => setNearbyLandmarks(newLandmarks)}
        error={formik.touched.nearbyLandmarks && formik.errors.nearbyLandmarks}
      />

      <div className="grid md:grid-cols-2 gap-12">
        <TagInputField
          label="Access Road"
          placeholder="Add access road types (e.g., Paved, Dirt)"
          values={roadAccess}
          onChange={(roadAccess) => setRoadAccess(roadAccess)}
          error={formik.touched.roadAccess && formik.errors.roadAccess}
        />
        <TagInputField
          label="Title Document Type"
          placeholder="Add title document type (e.g., Deed, Lease)"
          values={titleDocumentType}
          onChange={(newTypes) => setTitleDocumentType(newTypes)}
          error={
            formik.touched.titleDocumentType && formik.errors.titleDocumentType
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <InputField
          label="plots Available"
          placeholder="Enter Units Available"
          name="unitsAvailable"
          value={formik.values.unitsAvailable}
          onChange={formik.handleChange}
        />
        <OptionInputField
          label="Fencing"
          placeholder="Is the property fenced?"
          name="fencing"
          value={formik.values.fencing}
          onChange={(value) => formik.setFieldValue("fencing", value)}
          options={yesNoOptions}
          error={
            formik.touched.fencing && formik.errors.fencing
              ? formik.errors.fencing
              : undefined
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <OptionInputField
          label="Gated Estate"
          placeholder="Is it in a gated estate?"
          name="gatedEstate"
          value={formik.values.gatedEstate}
          onChange={(value) => formik.setFieldValue("gatedEstate", value)}
          options={yesNoOptions}
          error={
            formik.touched.gatedEstate && formik.errors.gatedEstate
              ? formik.errors.gatedEstate
              : undefined
          }
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
{/* 
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
      /> */}

      <InputAreaField
        label="Property Agreement"
        placeholder="Enter Property Agreement details"
        name="documents"
        value={formik.values.documents as unknown as string}
        onChange={(e) => formik.setFieldValue("documents", e.target.value)}
        rows={6}
      />
    </form>
  );
});

LandForm.displayName = "LandForm";

export default LandForm;