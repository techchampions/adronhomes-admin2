import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../../components/input/inputtext";
import FileUploadField from "../../../../components/input/FileUploadField";
import InputAreaField from "../../../../components/input/TextArea";
import OptionInputField from "../../../../components/input/drop_down";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../components/Redux/store";
import { directors } from "../../../../components/Redux/directors/directors_thunk";
import TagInputField from "../../../../components/input/TagInputField";
import EnhancedOptionInputField from "../../../../components/input/enhancedSelecet";
import { LandFormValues } from "../../../../MyContext/MyContext";
// import { LandFormValues } from "../../../../types/propertyTypes";

interface LandFormHandles {
  handleSubmit: () => void;
  isValid: boolean;
  values: LandFormValues;
}

interface LandFormProps {
  // Props for setting data
  setLandForm: (data: LandFormValues) => void;
  setDirectorName?: (name: string) => void;
  setPreviousPropType?: (type: string) => void;

  // Props for initial data
  initialData?: LandFormValues;

  // Props for edit mode
  isEditMode?: boolean;
  directorName?: string;
  previousPropType?: string;
}

interface DropdownOption {
  label: string;
  value: string | number;
}

const LandForm = forwardRef<LandFormHandles, LandFormProps>(
  (
    {
      setLandForm,
      setDirectorName,
      setPreviousPropType,
      initialData,
      isEditMode = false,
      directorName,
      previousPropType,
    },
    ref
  ) => {
    // const [titleDocumentType, setTitleDocumentType] = useState<string[]>(
    //   initialData?.titleDocumentType || []
    // );
    // const [roadAccess, setRoadAccess] = useState<string[]>(
    //   initialData?.roadAccess || []
    // );
    // const [nearbyLandmarks, setNearbyLandmarks] = useState<string[]>(
    //   initialData?.nearbyLandmarks || []
    // );

    const dispatch = useDispatch<AppDispatch>();

    // Get form data from Redux store if needed
    const createFormData = useSelector(
      (state: RootState) => state.createProperty
    );
    const editFormData = useSelector((state: RootState) => state.editProperty);

    // Determine which form data to use based on mode
    const formData = isEditMode ? editFormData : createFormData;

    // Use initialData if provided, otherwise use Redux form data
    const initialFormData = initialData || formData.landForm;

    // Fetch directors
    useEffect(() => {
      dispatch(directors());
    }, [dispatch]);

   const { data: directorsData, loading: directorsLoading, error: directorsError, success: directorsSuccess } = 
     useSelector((state: RootState) => state.directors.directors);

    const directorOptions: DropdownOption[] = Array.isArray(directorsData)
      ? directorsData.map((person) => ({
          label: `${person.first_name} ${person.last_name}`,
          value: person.id,
        }))
      : [];

    const validationSchema = Yup.object().shape({
      // description: Yup.string().required("Description is required"),
      // director_id: Yup.string().required("Director is required"),
      // titleDocumentType: Yup.array()
      //   .of(Yup.string())
      //   .min(1, "At least one title document type is required")
      //   .required("Title Document Type is required"),
      // roadAccess: Yup.array()
      //   .of(Yup.string())
      //   .min(1, "At least one access road type is required")
      //   .required("Access Road is required"),
      // fencing: Yup.string().required(
      //   "Please specify if the property is fenced"
      // ),
      // gatedEstate: Yup.string().required(
      //   "Please specify if it's a gated estate"
      // ),
      // contactNumber: Yup.string().required("Contact number is required"),
      // whatsAppLink: Yup.string().required("WhatsApp link is required"),
      // nearbyLandmarks: Yup.array()
      //   .of(Yup.string())
      //   .min(1, "At least one landmark is required")
      //   .required("Nearby Landmarks are required"),
      // landSize: Yup.string().required("Land size is required"),
      // unitsAvailable: Yup.string().required("Plots available is required"),
    });

    // Update formik values when tag arrays change
    // useEffect(() => {
    //   formik.setFieldValue("roadAccess", roadAccess);
    // }, [roadAccess]);

    // useEffect(() => {
    //   formik.setFieldValue("titleDocumentType", titleDocumentType);
    // }, [titleDocumentType]);

    // useEffect(() => {
    //   formik.setFieldValue("nearbyLandmarks", nearbyLandmarks);
    // }, [nearbyLandmarks]);

    const formik = useFormik<LandFormValues>({
      initialValues: {
        ...initialFormData,
        titleDocumentType: initialFormData.titleDocumentType || "",
        roadAccess: initialFormData.roadAccess || "",
        nearbyLandmarks: initialFormData.nearbyLandmarks || "",
        fencing: initialFormData.fencing || "",
        gatedEstate: initialFormData.gatedEstate || "",
        contactNumber: initialFormData.contactNumber || "",
        whatsAppLink: initialFormData.whatsAppLink || "",
        plotShape: initialFormData.plotShape || "",
        topography: initialFormData.topography || "",
        propertySize: initialFormData.propertySize || "",
        landSize: initialFormData.landSize || "",
        unitsAvailable: initialFormData.unitsAvailable || "",
        description: initialFormData.description || "",
        overview: initialFormData.overview || "",
        documents: initialFormData.documents || "",
        director_id: initialFormData.director_id || "",
      },
      validationSchema,
       enableReinitialize: true,
  validateOnMount: true,
      onSubmit: (values) => {
        // Update director name if setter is provided
        if (setDirectorName && values.director_id) {
          const selectedDirector = directorOptions.find(
            (dir) => dir.value.toString() === values.director_id
          );
          if (selectedDirector) {
            setDirectorName(selectedDirector.label);
          }
        }

        // Update previous property type if setter is provided
        if (setPreviousPropType && isEditMode) {
          setPreviousPropType("Land");
        }

        // Submit the form data
        setLandForm(values);
      },
      // enableReinitialize: true,
    });

    // Handle director change
    const handleDirectorChange = (value: string) => {
      formik.setFieldValue("director_id", value);

      // Update director name if setter is provided
      if (setDirectorName) {
        const selectedDirector = directorOptions.find(
          (dir) => dir.value.toString() === value
        );
        if (selectedDirector) {
          setDirectorName(selectedDirector.label);
        }
      }
    };

  useImperativeHandle(ref, () => ({
  handleSubmit: async () => {
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      formik.setTouched(
        Object.keys(errors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as Record<string, boolean>),
        true
      );
      return false;
    }

    await formik.submitForm();
    return true;
  },
  isValid: formik.isValid, 
  values: formik.values,
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

    return (
      <form onSubmit={formik.handleSubmit} className="space-y-[30px]">
        {/* Show previous director in edit mode */}
        {isEditMode && directorName && (
          <p className="text-base text-black">
            <span className="text-lg font-bold">Previous director:</span>{" "}
            {directorName}
          </p>
        )}

        {/* Show previous property type in edit mode */}
        {isEditMode && previousPropType && (
          <p className="text-base text-black">
            <span className="text-lg font-bold">Previous Property Type:</span>{" "}
            {previousPropType}
          </p>
        )}

        <EnhancedOptionInputField
          label="Director"
          placeholder="Select director"
          name="director_id"
          value={formik.values.director_id}
          onChange={handleDirectorChange}
          options={directorOptions}
          dropdownTitle="Directors"
          error={formik.touched.director_id && formik.errors.director_id}
          isSearchable={true}
          isLoading={directorsLoading}
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

        {/* Optional: Plot Shape and Topography - uncomment if needed */}
        {/* <div className="gap-12">
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
      </div> */}

        <div className="grid md:grid-cols-2 gap-12">
          {/* Optional: Property Size - uncomment if needed */}
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
              error={
                formik.touched.landSize && formik.errors.landSize
                  ? formik.errors.landSize
                  : undefined
              }
            />
          </div>
        </div>

        <TagInputField
          label="Nearby Landmarks"
          placeholder="Add nearby landmarks (e.g., Hospital, Mall)"
          values={formik.values.nearbyLandmarks}
          onChange={(vals) => formik.setFieldValue("nearbyLandmarks", vals)}
          error={
            formik.touched.nearbyLandmarks && formik.errors.nearbyLandmarks
          }
        />

        <div className="grid md:grid-cols-2 gap-12">
          <TagInputField
            label="Access Road"
            placeholder="Add access road types (e.g., Paved, Dirt)"
            values={formik.values.roadAccess}
            onChange={(vals) => formik.setFieldValue("roadAccess", vals)}
            error={formik.touched.roadAccess && formik.errors.roadAccess}
          />
          <TagInputField
            label="Title Document Type"
            placeholder="Add title document type (e.g., Deed, Lease)"
            values={formik.values.titleDocumentType}
            onChange={(vals) => formik.setFieldValue("titleDocumentType", vals)}
            error={
              formik.touched.titleDocumentType &&
              formik.errors.titleDocumentType
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <InputField
            label="Plots Available"
            placeholder="Enter Plots Available"
            name="unitsAvailable"
            value={formik.values.unitsAvailable}
            onChange={formik.handleChange}
            error={
              formik.touched.unitsAvailable && formik.errors.unitsAvailable
                ? formik.errors.unitsAvailable
                : undefined
            }
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

          {/* Optional: Plot Shape dropdown - uncomment if needed */}
          {/* <OptionInputField
          label="Plot Shape"
          placeholder="Select Plot Shape"
          name="plotShape"
          value={formik.values.plotShape}
          onChange={(value) => formik.setFieldValue("plotShape", value)}
          options={plotShapeOptions}
        /> */}
        </div>

        <InputAreaField
          label="Description"
          placeholder="Enter your Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          required
          error={
            formik.touched.description && formik.errors.description
              ? formik.errors.description
              : undefined
          }
        />

        {/* Optional: Overview field - uncomment if needed */}
        {/* <InputAreaField
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
        />
      </form>
    );
  }
);

LandForm.displayName = "LandForm";

export default LandForm;
