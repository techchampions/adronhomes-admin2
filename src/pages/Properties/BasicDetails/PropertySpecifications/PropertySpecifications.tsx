import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../../components/input/inputtext";
import InputAreaField from "../../../../components/input/TextArea";
import TagInputField from "../../../../components/input/TagInputField";
import OptionInputField from "../../../../components/input/drop_down";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../components/Redux/store";
import { directors } from "../../../../components/Redux/directors/directors_thunk";
import EnhancedOptionInputField from "../../../../components/input/enhancedSelecet";
import { PropertySpecificationsFormValues } from "../../../../MyContext/MyContext";
// import { PropertySpecificationsFormValues } from "../../../../types/propertyTypes";

interface PropertySpecificationsHandles {
  handleSubmit: () => void;
  isValid: boolean;
  values: PropertySpecificationsFormValues;
}

interface PropertySpecificationsProps {
  // Props for setting data
  setSpecifications: (data: PropertySpecificationsFormValues) => void;
  setDirectorName?: (name: string) => void;
  setPreviousPropType?: (type: string) => void;
  
  // Props for initial data
  initialData?: PropertySpecificationsFormValues;
  
  // Props for conditional rendering
  sales?: boolean;
  
  // Props for edit mode
  isEditMode?: boolean;
  directorName?: string;
  previousPropType?: string;
}

interface DropdownOption {
  label: string;
  value: string | number;
}

const PropertySpecifications = forwardRef<
  PropertySpecificationsHandles, 
  PropertySpecificationsProps
>(({
  setSpecifications,
  setDirectorName,
  setPreviousPropType,
  initialData,
  sales = false,
  isEditMode = false,
  directorName,
  previousPropType
}, ref) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Local state for tag inputs
  const [nearbyLandmarks, setNearbyLandmarks] = useState<string[]>(
    initialData?.nearbyLandmarks || []
  );
  const [titleDocumentTypeProp, setTitleDocumentType] = useState<string[]>(
    initialData?.titleDocumentTypeProp || []
  );

  // Get form data from Redux store if needed
  const createFormData = useSelector((state: RootState) => state.createProperty);
  const editFormData = useSelector((state: RootState) => state.editProperty);
  
  // Determine which form data to use based on mode
  const formData = isEditMode ? editFormData : createFormData;
  
  // Use initialData if provided, otherwise use Redux form data
  const initialFormData = initialData || formData.specifications;

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
    // bedrooms: Yup.string().required("Number of bedrooms is required"),
    // bathrooms: Yup.string().required("Number of bathrooms is required"),
    // toilets: Yup.string().required("Number of toilets is required"),
    // landSize: Yup.string().required("Land size is required"),
    // description: Yup.string().required("Description is required"),
    // director_id: Yup.string().required("Director is required"),
    // documents: Yup.string().required("Property Agreement details are required"),
    // nearbyLandmarks: Yup.array()
    //   .of(Yup.string())
    //   .min(1, "At least one landmark is required")
    //   .required("Nearby Landmarks are required"),
    // buildingCondition: Yup.string().required("Building condition is required"),
    // titleDocumentTypeProp: Yup.array()
    //   .of(Yup.string())
    //   .min(1, "At least one title document type is required")
    //   .required("Title document type is required"),
    // whatsAppLink: Yup.string().required("WhatsApp link is required"),
    // contactNumber: Yup.string().required("Contact number is required"),
    // // Conditional validation for rent duration
    // ...(sales && {
    //   rentDuration: Yup.string().required("Rent duration is required")
    // }),
  });

const [initialValues] = useState<PropertySpecificationsFormValues>(() => ({
  bedrooms: initialFormData.bedrooms || "",
  bathrooms: initialFormData.bathrooms || "",
  toilets: initialFormData.toilets || "",
  propertySize: initialFormData.propertySize || "",
  landSize: initialFormData.landSize || "",
  parkingSpaces: initialFormData.parkingSpaces || "",
  yearBuilt: initialFormData.yearBuilt || "",
  unitsAvailable: initialFormData.unitsAvailable || "",
  description: initialFormData.description || "",
  overview: initialFormData.overview || "",
  documents: initialFormData.documents || "",
  director_id: initialFormData.director_id || "",
  nearbyLandmarks: initialFormData.nearbyLandmarks || [],
  rentDuration: initialFormData.rentDuration || "",
  buildingCondition: initialFormData.buildingCondition || "",
  titleDocumentTypeProp: initialFormData.titleDocumentTypeProp || [],
  whatsAppLink: initialFormData.whatsAppLink || "",
  contactNumber: initialFormData.contactNumber || "",
}));

 const formik = useFormik<PropertySpecificationsFormValues>({
  initialValues,
  // validationSchema,
    enableReinitialize: true,
  validateOnMount: true,
  onSubmit: (values) => {
      // Update director name if setter is provided
      if (setDirectorName && values.director_id) {
        const selectedDirector = directorOptions.find(
          dir => dir.value.toString() === values.director_id
        );
        if (selectedDirector) {
          setDirectorName(selectedDirector.label);
        }
      }
      
      // Update previous property type if setter is provided
      if (setPreviousPropType && isEditMode) {
        setPreviousPropType("Residential/Commercial/Industrial");
      }
      
      // Submit the form data
      setSpecifications(values);
    },

  });

  // Handle director change
  const handleDirectorChange = (value: string) => {
    formik.setFieldValue("director_id", value);
    
    // Update director name if setter is provided
    if (setDirectorName) {
      const selectedDirector = directorOptions.find(
        dir => dir.value.toString() === value
      );
      if (selectedDirector) {
        setDirectorName(selectedDirector.label);
      }
    }
  };

const validateAndSubmit = useCallback(async () => {
  const errors = await formik.validateForm();

  if (Object.keys(errors).length > 0) {
    formik.setTouched(
      Object.keys(errors).reduce((acc, key) => {
        acc[key as keyof PropertySpecificationsFormValues] = true;
        return acc;
      }, {} as Record<keyof PropertySpecificationsFormValues, boolean>),
      true
    );
    return false;
  }

  await formik.submitForm(); // ✅ single click
  return true;
}, [formik]);


useImperativeHandle(ref, () => ({
  handleSubmit: validateAndSubmit,
  isValid: formik.isValid, 
  values: formik.values,
}));


  const buildingConditionOptions = [
    { value: "Off-plan", label: "Off-plan" },
    { value: "New", label: "New" },
    { value: "Old", label: "Old" },
  ];

  const rentDurationOptions = [
    { value: "yearly", label: "Yearly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-[30px]">
      {/* Show previous director in edit mode */}
      {isEditMode && directorName && (
        <p className="text-base text-black">
          <span className="text-lg font-bold">Previous director:</span> {directorName}
        </p>
      )}

      {/* Show previous property type in edit mode */}
      {isEditMode && previousPropType && (
        <p className="text-base text-black">
          <span className="text-lg font-bold">Previous Property Type:</span> {previousPropType}
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

      <div className="grid md:grid-cols-3 gap-12">
        <InputField
          label="Number of Bedrooms"
          placeholder="Enter Number of Bedrooms"
          name="bedrooms"
          value={formik.values.bedrooms}
          onChange={(e) => {
            let newValue = e.target.value.replace(/,/g, "");
            if (/^\d*$/.test(newValue)) {
              formik.setFieldValue("bedrooms", newValue);
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
              formik.setFieldValue("bathrooms", newValue);
            }
          }}
          error={
            formik.touched.bathrooms && formik.errors.bathrooms
              ? formik.errors.bathrooms
              : undefined
          }
        />
        <InputField
          label="Number of Toilets"
          placeholder="Enter Number of Toilets"
          name="toilets"
          value={formik.values.toilets}
          onChange={(e) => {
            let newValue = e.target.value.replace(/,/g, "");
            if (/^\d*$/.test(newValue)) {
              formik.setFieldValue("toilets", newValue);
            }
          }}
          error={
            formik.touched.toilets && formik.errors.toilets
              ? formik.errors.toilets
              : undefined
          }
        />
      </div>

      <div className="gap-12">
        <div className="relative">
          <p className="text-sm font-[325] text-[#768676] absolute top-10 z-10 right-3">
            Sq M
          </p>
          <InputField
            label="Land Size"
            placeholder="Enter Land Size"
            name="landSize"
            value={formik.values.landSize}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                formik.setFieldValue("landSize", newValue);
              }
            }}
            error={
              formik.touched.landSize && formik.errors.landSize
                ? formik.errors.landSize
                : undefined
            }
          />
        </div>
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
              formik.setFieldValue("parkingSpaces", newValue);
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
              formik.setFieldValue("unitsAvailable", newValue);
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
        error={
          formik.touched.description && formik.errors.description
            ? formik.errors.description
            : undefined
        }
      />

      <div className="grid md:grid-cols-2 gap-12">
        {sales && (
          <OptionInputField
            label="Rent Duration"
            placeholder="Select duration"
            name="rentDuration"
            value={formik.values.rentDuration}
            onChange={(value) => formik.setFieldValue("rentDuration", value)}
            options={rentDurationOptions}
            error={
              formik.touched.rentDuration && formik.errors.rentDuration
                ? formik.errors.rentDuration
                : undefined
            }
          />
        )}
        <OptionInputField
          label="Building Condition"
          placeholder="Select condition"
          name="buildingCondition"
          value={formik.values.buildingCondition}
          onChange={(value) => formik.setFieldValue("buildingCondition", value)}
          options={buildingConditionOptions}
          error={
            formik.touched.buildingCondition && formik.errors.buildingCondition
              ? formik.errors.buildingCondition
              : undefined
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <TagInputField
          label="Nearby Landmarks"
          placeholder="Add nearby landmarks (e.g., Hospital, Mall)"
           values={formik.values.nearbyLandmarks}
  onChange={(values) => formik.setFieldValue("nearbyLandmarks", values)}
          error={
            formik.touched.nearbyLandmarks && formik.errors.nearbyLandmarks
          }
        />
        <TagInputField
          label="Title Document Type"
          placeholder="Add title document type (e.g., Deed, Lease)"
         values={formik.values.titleDocumentTypeProp}
  onChange={(values) => formik.setFieldValue("titleDocumentTypeProp", values)}
          error={
            formik.touched.titleDocumentTypeProp && formik.errors.titleDocumentTypeProp
          }
        />
      </div>

      <InputAreaField
        label="Property Agreement"
        placeholder="Enter details of the Property Agreement"
        name="documents"
        value={formik.values.documents}
        onChange={(e) => formik.setFieldValue("documents", e.target.value)}
        error={
          formik.touched.documents && formik.errors.documents
            ? formik.errors.documents
            : undefined
        }
      />
    </form>
  );
});

PropertySpecifications.displayName = "PropertySpecifications";

export default PropertySpecifications;