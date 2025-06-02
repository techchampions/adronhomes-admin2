import React, { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../components/Redux/store";
import {
  createProperty,
  resetPropertyState,
} from "../components/Redux/addProperty/addProperty_slice";

// Define the form data types
interface BasicDetailsFormValues {
  propertyName: string;
  propertyType: string;
  price: string;
  initialDeposit: string;
  address: string;
  locationType: string;
  purpose: string;
}

interface BulkDetailsFormValues {
  propertyName: string;
  propertyType: string;
  propertyUnits: string;
  price: string;
  address: string;
  city: string;
  state: string;
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
}

interface FeaturesFormValues {
  features: string[];
}

interface MediaFormValues {
  tourLink: string;
  images: File[];
  propertyVideo?: File;
}

interface DiscountFormValues {
  discountName: string;
  discountType: string;
  discountOff: string;
  unitsRequired: string;
  validFrom: string;
  validTo: string;
}

interface PaymentStructureFormValues {
  paymentType: string;
  paymentDuration: string;
  paymentSchedule: string[];
  feesCharges: string;
}

interface PropertyFormData {
  basicDetails: BasicDetailsFormValues;
  bulkDetails: BulkDetailsFormValues;
  specifications: PropertySpecificationsFormValues;
  landForm: LandFormValues;
  features: FeaturesFormValues;
  media: MediaFormValues;
  discount: DiscountFormValues;
  paymentStructure: PaymentStructureFormValues;
}

interface PropertyContextType {
  formData: PropertyFormData;
  setBasicDetails: (data: BasicDetailsFormValues) => void;
  setBulkDetails: (data: BulkDetailsFormValues) => void;
  setSpecifications: (data: PropertySpecificationsFormValues) => void;
  setLandForm: (data: LandFormValues) => void;
  setFeatures: (data: FeaturesFormValues) => void;
  setMedia: (data: MediaFormValues) => void;
  setDiscount: (data: DiscountFormValues) => void;
  setPaymentStructure: (data: PaymentStructureFormValues) => void;
  submitForm: () => Promise<void>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLandProperty: boolean;
  setIsLandProperty: (isLand: boolean) => void;
  isBulk: boolean;
  setIsBulk: (isBulk: boolean) => void;
  showBulkModal: boolean;
  setShowBulkModal: (showBulkModal: boolean) => void;
  isCancelState: boolean;
  setIsCancelState: (isCancelState: boolean) => void;
  showPersonnelModal: boolean;
  setPersonnelModal: (showPersonnelModal: boolean) => void;
  isUserBulk: boolean;
  setIsUserBulk: (showPersonnelModal: boolean) => void;
  forgotPassword: boolean;
  setForgotPassword: (forgotPassword: boolean) => void;
  loading: boolean;
  
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined
);

interface PropertyProviderProps {
  children: ReactNode;
}

const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success, propertyId } = useSelector(
    (state: RootState) => state.addproperty
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLandProperty, setIsLandProperty] = useState<boolean>(false);
  const [isBulk, setIsBulk] = useState<boolean>(false);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [showPersonnelModal, setPersonnelModal] = useState<boolean>(false);
  const [isUserBulk, setIsUserBulk] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isCancelState, setIsCancelState] = useState(false);

  const [formData, setFormData] = useState<PropertyFormData>({
    basicDetails: {
      propertyName: "",
      propertyType: "",
      price: "",
      initialDeposit: "",
      address: "",
      locationType: "",
      purpose: "",
    },
    bulkDetails: {
      propertyName: "",
      propertyType: "",
      propertyUnits: "1",
      price: "",
      address: "",
      city: "",
      state: "",
    },
    specifications: {
      bedrooms: "",
      bathrooms: "",
      propertySize: "",
      landSize: "",
      parkingSpaces: "",
      yearBuilt: "",
      unitsAvailable: "",
      description: "",
      overview: "",
      documents: [],
    },
    landForm: {
      plotShape: "",
      topography: "",
      propertySize: "",
      landSize: "",
      roadAccess: "",
      titleDocumentType: "",
      unitsAvailable: "",
      description: "",
      overview: "",
      documents: [],
    },
    features: {
      features: ["Gym", "Swimming Pool", "Drainage", "Super Market"],
    },
    media: {
      tourLink: "",
      images: [],
    },
    discount: {
      discountName: "",
      discountType: "",
      discountOff: "",
      unitsRequired: "",
      validFrom: "",
      validTo: "",
    },
    paymentStructure: {
      paymentType: "",
      paymentDuration: "",
      paymentSchedule: [],
      feesCharges: "",
    },
  });

  useEffect(() => {
    if (success) {
      toast.success("Property created successfully!");
      dispatch(resetPropertyState());
      // Reset form or navigate away
    }

    if (error) {
      toast.error(error);
      dispatch(resetPropertyState());
    }
  }, [success, error, dispatch]);

  const setBasicDetails = (data: BasicDetailsFormValues) => {
    const isLand = data.propertyType.toLowerCase() === "land";
    setIsLandProperty(isLand);

    setFormData((prev) => ({
      ...prev,
      basicDetails: data,
    }));
  };

  const setBulkDetails = (data: BulkDetailsFormValues) => {
    const isLand = data.propertyType.toLowerCase() === "land";
    setIsLandProperty(isLand);

    setFormData((prev) => ({
      ...prev,
      bulkDetails: data,
    }));
  };

  useEffect(() => {
    const propertyType = isBulk
      ? formData.bulkDetails.propertyType
      : formData.basicDetails.propertyType;
    const isLand = propertyType.toLowerCase() === "land";
    if (isLandProperty !== isLand) {
      setIsLandProperty(isLand);
    }
  }, [
    formData.basicDetails.propertyType,
    formData.bulkDetails.propertyType,
    isBulk,
    isLandProperty,
  ]);

  const setSpecifications = (data: PropertySpecificationsFormValues) => {
    setFormData((prev) => ({
      ...prev,
      specifications: data,
    }));
  };

  const setLandForm = (data: LandFormValues) => {
    setFormData((prev) => ({
      ...prev,
      landForm: data,
    }));
  };

  const setFeatures = (data: FeaturesFormValues) => {
    setFormData((prev) => ({
      ...prev,
      features: data,
    }));
  };

  const setMedia = (data: MediaFormValues) => {
    setFormData((prev) => ({
      ...prev,
      media: data,
    }));
  };

  const setDiscount = (data: DiscountFormValues) => {
    setFormData((prev) => ({
      ...prev,
      discount: data,
    }));
  };

  const setPaymentStructure = (data: PaymentStructureFormValues) => {
    setFormData((prev) => ({
      ...prev,
      paymentStructure: data,
    }));
  };

const submitForm = async () => {
  try {
    const {
      basicDetails,
      bulkDetails,
      specifications,
      landForm,
      features,
      media,
      discount,
      paymentStructure,
    } = formData;

    console.log("Complete form data:", formData);

    const formPayload = new FormData();

    console.log("Building form payload...");

    // Basic or Bulk
    if (isBulk) {
      console.log("Adding bulk details:", bulkDetails);
      formPayload.append("name", bulkDetails.propertyName);
      formPayload.append("type", bulkDetails.propertyType);
      formPayload.append("no_of_unit", bulkDetails.propertyUnits || "1");
      formPayload.append("price", bulkDetails.price);
      formPayload.append("street_address", bulkDetails.address);
      formPayload.append("city", bulkDetails.city || "");
      formPayload.append("state", bulkDetails.state || "");
      formPayload.append("category", "bulk");
    } else {
      console.log("Adding basic details:", basicDetails);
      formPayload.append("name", basicDetails.propertyName);
      formPayload.append("type", basicDetails.propertyType);
      formPayload.append("price", basicDetails.price);
      formPayload.append("initial_deposit", basicDetails.initialDeposit || "0");
      formPayload.append("street_address", basicDetails.address);
      formPayload.append("location_type", basicDetails.locationType || "");
      formPayload.append("purpose", basicDetails.purpose || "");
      formPayload.append("category", "single");
    }

    // Specifications
    if (isLandProperty) {
      console.log("Adding land specifications:", landForm);
      formPayload.append("size", landForm.propertySize);
      formPayload.append("plot_shape", landForm.plotShape || "");
      formPayload.append("topography", landForm.topography || "");
      formPayload.append("road_access", landForm.roadAccess || "");
      formPayload.append("title_document_type", landForm.titleDocumentType || "");
      formPayload.append("overview", landForm.overview);
      formPayload.append("description", landForm.description);
      formPayload.append("units_available", landForm.unitsAvailable || "1");
    } else {
      console.log("Adding property specifications:", specifications);
      formPayload.append("no_of_bedroom", specifications.bedrooms || "0");
      formPayload.append("number_of_bathroom", specifications.bathrooms || "0");
      formPayload.append("size", specifications.propertySize);
      formPayload.append("parking_space", specifications.parkingSpaces || "0");
      formPayload.append("overview", specifications.overview);
      formPayload.append("description", specifications.description);
      formPayload.append("year_built", specifications.yearBuilt || "");
      formPayload.append("units_available", specifications.unitsAvailable || "1");
    }

    // Features
    console.log("Adding features:", features);
    if (Array.isArray(features.features)) {
      features.features.forEach((feature, index) => {
        formPayload.append(`features[${index}]`, feature);
      });
    } else {
      console.warn("features.features is not an array:", features.features);
    }

    // Media
    console.log("Adding media:", media);
    if (Array.isArray(media.images)) {
      media.images.forEach((image, index) => {
        if (image instanceof File) {
          formPayload.append(`photos[${index}]`, image);
          if (index === 0) {
            formPayload.append("display_image", image);
          }
        } else {
          console.warn(`Image at index ${index} is not a File object`, image);
        }
      });
    } else {
      console.warn("media.images is not an array:", media.images);
    }

    if (media.tourLink) {
      formPayload.append("virtual_tour", media.tourLink);
    }

    // Payment Structure
    console.log("Adding payment structure:", paymentStructure);
    formPayload.append("type", paymentStructure.paymentType);
    formPayload.append("property_duration_limit", paymentStructure.paymentDuration);

    if (Array.isArray(paymentStructure.paymentSchedule)) {
      paymentStructure.paymentSchedule.forEach((schedule, index) => {
        formPayload.append(`payment_schedule[${index}]`, schedule);
      });
    } else {
      console.warn("paymentSchedule is not an array:", paymentStructure.paymentSchedule);
    }

    formPayload.append("fees_charges", paymentStructure.feesCharges);

    // Discount
    console.log("Adding discount:", discount);
    if (discount.discountName) {
      formPayload.append("is_discount", "1");
      formPayload.append("discount_name", discount.discountName);
      formPayload.append("discount_percentage", discount.discountOff);
      formPayload.append("discount_units", discount.unitsRequired);
      formPayload.append("discount_start_date", discount.validFrom);
      formPayload.append("discount_end_date", discount.validTo);
    } else {
      formPayload.append("is_discount", "0");
    }

    // Documents
    const docs = isLandProperty ? landForm.documents : specifications.documents;
    console.log("Adding documents:", docs);

    if (Array.isArray(docs)) {
      docs.forEach((doc, index) => {
        if (doc instanceof File) {
          formPayload.append(`property_agreement[${index}]`, doc);
        } else {
          console.warn(`Document at index ${index} is not a File object`, doc);
        }
      });
    } else {
      console.warn("docs is not an array:", docs);
    }

    // Status fields
    formPayload.append("is_active", "1");
    formPayload.append("status", "available");

    // Final log
    console.log("Final FormData contents:");
    for (let [key, value] of formPayload.entries()) {
      console.log(key, value);
    }

    // Dispatch
    console.log("Dispatching createProperty action...");
    await dispatch(createProperty({ credentials: formPayload })).unwrap();
  alert(JSON.stringify(formPayload, null, 2)); 
    toast.success("Property created successfully!");
    console.log("Property creation successful");
  } catch (error: any) {
    console.error("Error submitting form:", error);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      toast.error(`Server error: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      console.error("No response received:", error.request);
      toast.error("No response from server. Please check your network connection.");
    } else {
      console.error("Request setup error:", error.message);
      toast.error(`Request error: ${error.message}`);
    }
  }
};


  return (
    <PropertyContext.Provider
      value={{
        isCancelState,
        setIsCancelState,
        formData,
        setBasicDetails,
        setBulkDetails,
        setSpecifications,
        setLandForm,
        setFeatures,
        setMedia,
        setDiscount,
        setPaymentStructure,
        submitForm,
        currentStep,
        setCurrentStep,
        isLandProperty,
        setIsLandProperty,
        isBulk,
        setIsBulk,
        showBulkModal,
        setShowBulkModal,
        showPersonnelModal,
        setPersonnelModal,
        isUserBulk,
        setIsUserBulk,
        forgotPassword,
        setForgotPassword,
        loading,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export { PropertyContext, PropertyProvider };
