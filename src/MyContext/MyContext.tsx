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
import { add_property_detail } from "../components/Redux/addProperty/addFees/addFees_thunk";
import { resetPropertyDetailState } from "../components/Redux/addProperty/addFees/add_property_detail_slice";
import { useLocation, useNavigate } from "react-router-dom";

interface Fee {
  [x: string]: any;
  id: number;
  name: string;
  amount: string;
  checked: boolean;
  type: string;
  purpose: any;
}

interface BasicDetailsFormValues {
  propertyName: string;
  propertyType: any;
  price: string;
  initialDeposit: string;
  address: string;
  locationType: string;
  purpose: string[];
  country: any;
  state: any;
  lga: any;
  category: any;
  category_id: any;
  propertyFiles: File[];
}

interface BulkDetailsFormValues {
  propertyName: string;
  propertyType: any;
  propertyUnits: string;
  price: string;
  address: string;
  city: string;
  state: string;
  initialDeposit: string;
  country: any;
  lga: any;
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
  documents: string;
  director_id: any;
  nearbyLandmarks: string[];
  rentDuration: string;
  buildingCondition: string;
  whatsAppLink: string;
  contactNumber: string;
  toilets: string;
  titleDocumentTypeProp: string[];
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
  nearbyLandmarks: string[];
}

interface FeaturesFormValues {
  features: string[];
}

interface MediaFormValues {
  tourLink: string;
  videoLink: string;
  mapUrl: string;
  images: (File | string)[];
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
  display: {
    status: "draft" | "publish";
  };
}

interface PropertyContextType {
  formData: PropertyFormData;
  director_name: any;

   setDirectorName: (director_name: any) => void;


   previousPropType: any; setpreviousPropType: (previousPropType: any) => void;
  setBasicDetails: (data: BasicDetailsFormValues) => void;
  setBulkDetails: (data: BulkDetailsFormValues) => void;
  setSpecifications: (data: PropertySpecificationsFormValues) => void;
  setLandForm: (data: LandFormValues) => void;
  setFeatures: (data: FeaturesFormValues) => void;
  setMedia: (data: MediaFormValues) => void;
  setDiscount: (data: DiscountFormValues) => void;
  setPaymentStructure: (data: PaymentStructureFormValues) => void;
  submitForm: (displayStatus: "draft" | "publish") => Promise<void>;
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
  fees: Fee[];
  setFees: any;
  newFees :Fee[]; setNewFees: any;
  isInfrastructure: boolean;
  setIsCancelInfrastructure: (isInfrastructure: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  resetFormData: () => void;
  option: any;
  setOption: (option: any) => void;
  role: any;
  setRole: (role: any) => void;
  setDisplayStatus: (status: "draft" | "publish") => void;
  sales: boolean;
  setSales: (sales: boolean) => void;
  imagePreview: any;
  setImagePreview: (imagePreview: any) => void;
  selectedPropertyId: boolean;
  setSelectedPropertyId: (selectedPropertyId: any) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined
);

interface PropertyProviderProps {
  children: ReactNode;
}

const initialFormData: PropertyFormData = {
  basicDetails: {
    propertyName: "",
    propertyType: "",
    price: "",
    initialDeposit: "",
    address: "",
    locationType: "",
    purpose: ["Bungalow"],
    country: "",
    state: "",
    lga: "",
    category: "",
    category_id: "",
    propertyFiles: [],
  },
  bulkDetails: {
    propertyName: "",
    propertyType: "",
    propertyUnits: "1",
    price: "",
    address: "",
    city: "",
    state: "",
    initialDeposit: "",
    country: "",
    lga: "",
  },
  specifications: {
    director_id: "",
    bedrooms: "",
    bathrooms: "",
    propertySize: "",
    landSize: "",
    parkingSpaces: "",
    yearBuilt: "",
    unitsAvailable: "",
    description: "",
    overview: "",
    documents: "",
    nearbyLandmarks: [],
    rentDuration: "",
    buildingCondition: "",
    whatsAppLink: "",
    contactNumber: "",
    toilets: "",
    titleDocumentTypeProp: ["C of O"],
  },
  landForm: {
    director_id: "",
    plotShape: "",
    topography: "",
    propertySize: "",
    landSize: "",
    roadAccess: [],
    titleDocumentType: [],
    unitsAvailable: "",
    description: "",
    overview: "",
    documents: "",
    fencing: "",
    gatedEstate: "",
    contactNumber: "",
    whatsAppLink: "",
    nearbyLandmarks: [],
  },
  features: {
    features: ["Gym", "Swimming Pool", "Drainage", "Super Market"],
  },
  media: {
    mapUrl: "",
    tourLink: "",
    videoLink: "",
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
  display: {
    status: "draft",
  },
};

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
  const [isInfrastructure, setIsCancelInfrastructure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [option, setOption] = useState(0);
  const [fees, setFees] = useState<Fee[]>([]);
   const [newFees, setNewFees] = useState<Fee[]>([]);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [sales, setSales] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
   const [director_name, setDirectorName] = useState<string>('');
    const [previousPropType, setpreviousPropType] = useState<string>('');

  useEffect(() => {
    if (location.pathname.startsWith("/properties/property-edith/")) {
      setSelectedPropertyId(true);
    } else {
      setSelectedPropertyId(false);
    }
  }, [location.pathname]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(false);

  const resetFormData = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsLandProperty(false);
    setIsBulk(false);
    navigate("/properties");
    setFees([]);
  };

  const setDisplayStatus = (status: "draft" | "publish") => {
    setFormData((prev) => ({
      ...prev,
      display: {
        status,
      },
    }));
  };

  const setBasicDetails = (data: BasicDetailsFormValues) => {
   const isLand = formData.basicDetails.propertyType==='1';
    setIsLandProperty(isLand);

    setFormData((prev) => ({
      ...prev,
      basicDetails: data,
    }));
  };

  const setBulkDetails = (data: BulkDetailsFormValues) => {
   const isLand = formData.basicDetails.propertyType==='1';
    setIsLandProperty(isLand);

    setFormData((prev) => ({
      ...prev,
      bulkDetails: data,
    }));
  };

  useEffect(() => {
    formData.basicDetails.propertyType;
    const isLand = formData.basicDetails.propertyType==='1';
    if (isLandProperty !== isLand) {
      setIsLandProperty(isLand);
    }
  }, [
    formData.basicDetails.propertyType,
    formData.bulkDetails.propertyType,
    isBulk,
    isLandProperty,
  ]);

  const [role, setRole] = useState();

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

  // PropertyContext.tsx
  const submitForm = async (displayStatus: "draft" | "publish") => {
    try {
      setIsSubmitting(true);

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

      console.log("Submitting with displayStatus:", displayStatus); // Debug log

      const formPayload = new FormData();

      // Populate formPayload based on isBulk and isLandProperty
      if (isBulk) {
        if (bulkDetails.propertyName) {
          formPayload.append("name", bulkDetails.propertyName);
        }
        if (bulkDetails.propertyType) {
          formPayload.append("type", bulkDetails.propertyType);
        }
        if (bulkDetails.propertyUnits) {
          formPayload.append("no_of_unit", bulkDetails.propertyUnits || "1");
        }
        if (bulkDetails.price) {
          formPayload.append("price", bulkDetails.price);
        }
        if (bulkDetails.address) {
          formPayload.append("street_address", bulkDetails.address);
        }
        if (bulkDetails.city) {
          formPayload.append("city", bulkDetails.city || "");
        }
        if (bulkDetails.country) {
          formPayload.append("country", bulkDetails.country);
        }
        if (bulkDetails.state) {
          formPayload.append("state", bulkDetails.state);
        }
        if (bulkDetails.lga) {
          formPayload.append("lga", bulkDetails.lga);
        }
        formPayload.append("category", "bulk");
        if (bulkDetails.initialDeposit) {
          formPayload.append("initial_deposit", bulkDetails.initialDeposit || "0");
        }
      } else {
        if (basicDetails.propertyName) {
          formPayload.append("name", basicDetails.propertyName);
        }
        if (basicDetails.propertyType) {
          formPayload.append("type", basicDetails.propertyType);
        }
        if (basicDetails.price) {
          formPayload.append("price", basicDetails.price);
        }
        if (basicDetails.initialDeposit) {
          formPayload.append("initial_deposit", basicDetails.initialDeposit || "0");
        }
        if (basicDetails.country) {
          formPayload.append("country", basicDetails.country);
        }
        if (basicDetails.state) {
          formPayload.append("state", basicDetails.state);
        }
        if (basicDetails.lga) {
          formPayload.append("lga", basicDetails.lga);
        }
        if (basicDetails.address) {
          formPayload.append("street_address", basicDetails.address);
        }
        if (basicDetails.locationType) {
          formPayload.append("location_type", basicDetails.locationType || "");
        }
        if (Array.isArray(basicDetails.propertyFiles)) {
          basicDetails.propertyFiles.forEach((propertyFiles, index) => {
            if (propertyFiles instanceof File) {
              formPayload.append(`property_files[${index}]`, propertyFiles);
            }
          });
        }
        if (basicDetails.category_id) {
          formPayload.append("category_id", basicDetails.category_id);
        }
        if (Array.isArray(basicDetails.purpose)) {
          basicDetails.purpose.forEach((purpose, index) => {
            formPayload.append(`purpose[${index}]`, purpose);
          });
        } else if (basicDetails.purpose) {
          formPayload.append("purpose", basicDetails.purpose || "");
        }
        formPayload.append("category", "house");
      }

      if (isLandProperty) {
        if (landForm.landSize) {
          formPayload.append("size", landForm.landSize);
        }
        if (landForm.plotShape) {
          formPayload.append("shape", landForm.plotShape || "");
        }
        if (landForm.topography) {
          formPayload.append("topography", landForm.topography || "");
        }
        formPayload.append("category", "estate");
        if (landForm.nearbyLandmarks && landForm.nearbyLandmarks.length > 0) {
          formPayload.append(
            "nearbyLandmarks",
            Array.isArray(landForm.nearbyLandmarks)
              ? landForm.nearbyLandmarks.join(", ")
              : landForm.nearbyLandmarks || ""
          );
        }
        if (landForm.roadAccess && landForm.roadAccess.length > 0) {
          formPayload.append(
            "road_access",
            Array.isArray(landForm.roadAccess)
              ? landForm.roadAccess.join(", ")
              : landForm.roadAccess || ""
          );
        }
        if (landForm.titleDocumentType && landForm.titleDocumentType.length > 0) {
          formPayload.append(
            "title_document_type",
            Array.isArray(landForm.titleDocumentType)
              ? landForm.titleDocumentType.join(", ")
              : landForm.titleDocumentType || ""
          );
        }
        if (landForm.description) {
          formPayload.append("description", landForm.description);
        }
        if (landForm.unitsAvailable) {
          const unitsAvailable = parseInt(landForm.unitsAvailable) || 1;
          formPayload.append("number_of_unit", unitsAvailable.toString());
        }
        if (landForm.director_id) {
          formPayload.append("director_id", landForm.director_id || "1");
        }
        if (landForm.fencing) {
          formPayload.append("fencing", landForm.fencing || "");
        }
        if (landForm.gatedEstate) {
          formPayload.append("gated_estate", landForm.gatedEstate || "");
        }
        if (landForm.contactNumber) {
          formPayload.append("contact_number", landForm.contactNumber || "");
        }
        if (landForm.whatsAppLink) {
          formPayload.append("whatsapp_link", landForm.whatsAppLink || "");
        }
        if (landForm.documents) {
          formPayload.append("property_agreement", landForm.documents);
        }
      } else {
        if (specifications.bedrooms) {
          formPayload.append("no_of_bedroom", specifications.bedrooms || "0");
        }
        if (specifications.bathrooms) {
          formPayload.append("number_of_bathroom", specifications.bathrooms || "0");
        }
        if (specifications.titleDocumentTypeProp && specifications.titleDocumentTypeProp.length > 0) {
          formPayload.append(
            "title_document_type",
            Array.isArray(specifications.titleDocumentTypeProp)
              ? specifications.titleDocumentTypeProp.join(", ")
              : specifications.titleDocumentTypeProp || ""
          );
        }
        if (specifications.toilets) {
          formPayload.append("toilets", specifications.toilets || "0");
        }
        if (specifications.landSize) {
          formPayload.append("size", specifications.landSize);
        }
        if (specifications.parkingSpaces) {
          formPayload.append("parking_space", specifications.parkingSpaces || "0");
        }
        if (specifications.description) {
          formPayload.append("description", specifications.description);
        }
        if (specifications.yearBuilt) {
          formPayload.append("year_built", specifications.yearBuilt || "");
        }
        if (specifications.unitsAvailable) {
          const unitsAvailable = parseInt(specifications.unitsAvailable) || 1;
          formPayload.append("number_of_unit", unitsAvailable.toString());
        }
        if (specifications.director_id) {
          formPayload.append("director_id", specifications.director_id || "1");
        }
        if (specifications.nearbyLandmarks && specifications.nearbyLandmarks.length > 0) {
          formPayload.append(
            "nearby_landmarks",
            Array.isArray(specifications.nearbyLandmarks)
              ? specifications.nearbyLandmarks.join(", ")
              : specifications.nearbyLandmarks || ""
          );
        }
        if (specifications.rentDuration) {
          formPayload.append("rent_duration", specifications.rentDuration || "");
        }
        if (specifications.buildingCondition) {
          formPayload.append("building_condition", specifications.buildingCondition || "");
        }
        if (specifications.whatsAppLink) {
          formPayload.append("whatsapp_link", specifications.whatsAppLink || "");
        }
        if (specifications.contactNumber) {
          formPayload.append("contact_number", specifications.contactNumber || "");
        }
        if (specifications.documents) {
          formPayload.append("property_agreement", specifications.documents);
        }
      }

      if (Array.isArray(features.features) && features.features.length > 0) {
        features.features.forEach((feature, index) => {
          formPayload.append(`features[${index}]`, feature);
        });
      }

      if (Array.isArray(media.images) && media.images.length > 0) {
        media.images.forEach((image, index) => {
          if (image instanceof File) {
            formPayload.append(`photos[${index}]`, image);
            if (index === 0) {
              formPayload.append("display_image", image);
            }
          }
        });
      }

      if (media.tourLink) {
        formPayload.append("virtual_tour", media.tourLink);
      }

      if (media.videoLink) {
        formPayload.append("video_link", media.videoLink);
      }
      if (media.mapUrl) {
        formPayload.append("map_link", media.mapUrl);
      }

      if (paymentStructure.paymentType) {
        formPayload.append("payment_type", paymentStructure.paymentType);
      }
      if (paymentStructure.paymentDuration) {
        formPayload.append("property_duration_limit", paymentStructure.paymentDuration);
      }
      if (Array.isArray(paymentStructure.paymentSchedule) && paymentStructure.paymentSchedule.length > 0) {
        paymentStructure.paymentSchedule.forEach((schedule, index) => {
          formPayload.append(`payment_schedule[${index}]`, schedule);
        });
      }
      if (paymentStructure.feesCharges) {
        formPayload.append("fees_charges", paymentStructure.feesCharges);
      }

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

      // Use the displayStatus parameter directly
      formPayload.append("is_active", displayStatus === "draft" ? "0" : "1");

      const result = await dispatch(
        createProperty({ credentials: formPayload })
      ).unwrap();

      const createdPropertyId = result.data.property.id || 0;

      if (createdPropertyId) {
        const feePromises = fees
          .filter((fee) => fee.checked)
          .map((fee) => ({
            property_id: createdPropertyId.toString(),
            name: fee.name,
            value: fee.amount.replace(/[^\d.]/g, ""),
            type: fee.type,
            purpose: fee.purpose,
          }))
          .map((feeDetail) =>
            dispatch(add_property_detail({ credentials: feeDetail }))
              .then((result) => {
                console.log(`Successfully added fee: ${feeDetail.name}`);
                return result;
              })
              .catch((error) => {
                console.error(`Failed to add fee ${feeDetail.name}:`, error);
                toast.error(`Failed to add fee ${feeDetail.name}`);
                throw error;
              })
          );

        const feeResults = await Promise.allSettled(feePromises);

        const successfulFees = feeResults.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failedFees = feeResults.filter(
          (r) => r.status === "rejected"
        ).length;

        if (failedFees === 0) {
          toast.success("All fees added successfully!");
        } else {
          toast.warning(
            `Property created but ${failedFees} fee(s) failed to add`
          );
        }

        resetFormData();
        dispatch(resetPropertyState());
      } else {
        toast.error(
          "Property created but couldn't add fees - missing property ID"
        );
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      if (error.response) {
        toast.error(
          `Server error: ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else if (error.request) {
        toast.error(
          "No response from server. Please check your network connection."
        );
      } else {
        toast.error(`Request error: ${error.message}`);
      }
      throw error; // Re-throw to allow handleDraftPublishSelect to handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        newFees, setNewFees,
        selectedPropertyId,
        setSelectedPropertyId,
        isInfrastructure,
        setIsCancelInfrastructure,
        fees,
        setFees,
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
        isSubmitting,
        setIsSubmitting,
        resetFormData,
        option,
        setOption,
        role,
        setRole,
        setDisplayStatus,
        sales,
        setSales,
        imagePreview,
        setImagePreview,
        director_name,
        setDirectorName,
        previousPropType,
        setpreviousPropType
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export { PropertyContext, PropertyProvider };