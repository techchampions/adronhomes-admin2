import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
  EditPropertyFormData,
  BasicDetailsFormValues,
  BulkDetailsFormValues,
  PropertySpecificationsFormValues,
  LandFormValues,
  FeaturesFormValues,
  MediaFormValues,
  DiscountFormValues,
  PaymentStructureFormValues,
//   LandSizeSection,
  Fee
} from "../../../MyContext/MyContext";
import { LandSizeSection } from "../../../pages/Properties/addPropplan/planForm";

const initialBasicDetails: BasicDetailsFormValues = {
  propertyName: "",
  propertyType: "",
  price: "",
  initialDeposit: "",
  address: "",
  locationType: "",
  purpose: [],
  country: "",
  state: "",
  lga: "",
  category: "",
  category_id: null,
  propertyFiles: [],
};

const initialBulkDetails: BulkDetailsFormValues = {
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
};

const initialSpecifications: PropertySpecificationsFormValues = {
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
  titleDocumentTypeProp: [],
};

const initialLandForm: LandFormValues = {
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
};

const initialState: EditPropertyFormData = {
  basicDetails: initialBasicDetails,
  bulkDetails: initialBulkDetails,
  specifications: initialSpecifications,
  landForm: initialLandForm,
  features: {
    features: [],
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
  LandSizeSection: [],
  display: {
    status: "draft",
  },
  metadata: {
    currentStep: 1,
    isLandProperty: false,
    isLandProperty2: false,
    isBulk: false,
    isSubmitting: false,
    sales: false,
    propertyId: null,
    director_name: '',
    previousPropType: '',
    isLoaded: false,
    showBulkModal: false,
    showPersonnelModal: false,
    isUserBulk: false,
    forgotPassword: false,
    isCancelState: false,
    isInfrastructure: false,
    option: 0,
    fees: [],
    newFees: [],
    imagePreview: null,
  }
};

const editPropertySlice = createSlice({
  name: "editProperty",
  initialState,
  reducers: {
    // Reset entire form
    resetEditForm: () => initialState,
    
    // Set entire form data (for loading existing property)
    setEditFormData: (state, action: PayloadAction<Partial<EditPropertyFormData>>) => {
      return { 
        ...state, 
        ...action.payload,
        metadata: {
          ...state.metadata,
          ...action.payload.metadata,
          isLoaded: true
        }
      };
    },
    
    // Load property data from API response
    loadEditPropertyData: (state, action: PayloadAction<any>) => {
      const property = action.payload;
      
      // Transform API data to form data
      state.basicDetails = {
        propertyName: property.name || "",
        propertyType: property.type?.id?.toString() || "",
        price: property.price?.toString() || "",
        initialDeposit: property.initial_deposit?.toString() || "",
        address: property.street_address || "",
        locationType: property.location_type || "",
        purpose: Array.isArray(property.purpose) ? property.purpose : [],
        country: property.country || "",
        state: property.state || "",
        lga: property.lga || "N/A",
        category: property.category || "",
        category_id: property.category_id || null,
        propertyFiles: property.property_files || [],
      };
      
      state.bulkDetails = {
        propertyName: property.name || "",
        propertyType: property.type?.id?.toString() || "",
        propertyUnits: property.no_of_unit?.toString() || "1",
        price: property.price?.toString() || "",
        address: property.street_address || "",
        city: property.city || "",
        state: property.state || "",
        initialDeposit: property.initial_deposit?.toString() || "",
        country: property.country || "",
        lga: property.lga || "N/A",
      };
      
      if (property.category !== "estate") {
        state.specifications = {
          director_id: property.director_id || "",
          bedrooms: property.no_of_bedroom?.toString() || "",
          bathrooms: property.number_of_bathroom?.toString() || "",
          toilets: property.toilets?.toString() || "",
          propertySize: property.size?.toString() || "",
          landSize: property.size?.toString() || "",
          parkingSpaces: property.parking_space?.toString() || "",
          yearBuilt: property.year_built?.toString() || "",
          unitsAvailable: property.number_of_unit?.toString() || "",
          description: property.description || "",
          overview: property.overview || "",
          documents: property.property_agreement || "",
          nearbyLandmarks: property.nearby_landmarks
            ? property.nearby_landmarks.split(",").map((item: string) => item.trim())
            : [],
          rentDuration: property.rent_duration || "",
          buildingCondition: property.building_condition || "",
          titleDocumentTypeProp: property.title_document_type
            ? property.title_document_type.split(",").map((item: string) => item.trim())
            : [],
          whatsAppLink: property.whatsapp_link || "",
          contactNumber: property.contact_number || "",
        };
      }
      
      if (property.category === "estate") {
        state.landForm = {
          director_id: property.director_id?.toString() || "",
          plotShape: property.shape || "",
          topography: property.topography || "",
          propertySize: property.size?.toString() || "",
          landSize: property.size?.toString() || "",
          roadAccess: property.road_access
            ? property.road_access.split(",").map((item: string) => item.trim())
            : [],
          unitsAvailable: property.number_of_unit?.toString() || "",
          description: property.description || "",
          overview: property.overview || "",
          documents: property.property_agreement || "",
          titleDocumentType: property.title_document_type
            ? property.title_document_type.split(",").map((item: string) => item.trim())
            : [],
          fencing: property.fencing || "",
          gatedEstate: property.gated_estate || "",
          contactNumber: property.contact_number || "",
          whatsAppLink: property.whatsapp_link || "",
          nearbyLandmarks: property.nearby_landmarks
            ? property.nearby_landmarks.split(",").map((item: string) => item.trim())
            : [],
        };
      }
      
      state.features = {
        features: Array.isArray(property.features) && property.features.length > 0
          ? property.features
          : [],
      };
      
      state.media = {
        mapUrl: property.property_map || "",
        tourLink: property.virtual_tour || "",
        videoLink: property.video_link || "",
        images: property.photos || [],
      };
      
      state.discount = {
        discountName: property.is_discount ? property.discount_name || "" : "",
        discountType: property.is_discount ? "percentage" : "",
        discountOff: property.is_discount
          ? property.discount_percentage?.toString() || ""
          : "",
        unitsRequired: property.is_discount
          ? property.discount_units?.toString() || ""
          : "",
        validFrom: property.is_discount
          ? property.discount_start_date || ""
          : "",
        validTo: property.is_discount ? property.discount_end_date || "" : "",
      };
      
      state.paymentStructure = {
        paymentType: property.payment_type || "",
        paymentDuration: property.property_duration_limit?.toString() || "",
        paymentSchedule: property.payment_schedule || [],
        feesCharges: property.fees_charges || "",
      };
      
      state.LandSizeSection = property.land_sizes?.map((ls: any) => ({
        id: ls.id?.toString() || "",
        size: ls.size?.toString() || "",
        durations: ls.durations?.map((d: any) => ({
          id: d.id?.toString() || "",
          duration: d.duration?.toString() || "",
          price: d.price?.toString() || "",
          cittaLink: d.citta_id || "",
          is_active: d.is_active || true,
        })) || [],
      })) || [];
      
      state.display.status = property.is_active ? "publish" : "draft";
      
      // Update metadata
      state.metadata.propertyId = property.id?.toString() || null;
      state.metadata.isLandProperty = property.type?.name === "Land";
      state.metadata.isLandProperty2 = property.type?.name === "Land";
      state.metadata.isBulk = property.category === "bulk";
      state.metadata.director_name = `${property?.director?.first_name || ""} ${property?.director?.last_name || ""}`.trim();
      state.metadata.previousPropType = property.type?.name || "";
      state.metadata.imagePreview = property.display_image || null;
      state.metadata.isLoaded = true;
      state.metadata.fees = property.details?.map((detail: any) => ({
        id: detail.id,
        name: detail.name,
        amount: `₦${detail.value.toLocaleString("en-NG")}`,
        checked: true,
        type: detail.type,
        purpose: detail.purpose,
      })) || [];
    },
    
    // Metadata actions
    setEditCurrentStep: (state, action: PayloadAction<number>) => {
      state.metadata.currentStep = action.payload;
    },
    
    setIsEditLandProperty: (state, action: PayloadAction<boolean>) => {
      state.metadata.isLandProperty = action.payload;
    },
    
    setIsEditLandProperty2: (state, action: PayloadAction<boolean>) => {
      state.metadata.isLandProperty2 = action.payload;
    },
    
    setIsEditBulk: (state, action: PayloadAction<boolean>) => {
      state.metadata.isBulk = action.payload;
    },
    
    setIsEditSubmitting: (state, action: PayloadAction<boolean>) => {
      state.metadata.isSubmitting = action.payload;
    },
    
    setEditDirectorName: (state, action: PayloadAction<string>) => {
      state.metadata.director_name = action.payload;
    },
    
    setEditPreviousPropType: (state, action: PayloadAction<string>) => {
      state.metadata.previousPropType = action.payload;
    },
    
    setEditFees: (state, action: PayloadAction<Fee[]>) => {
      state.metadata.fees = action.payload;
    },
    
    setEditNewFees: (state, action: PayloadAction<Fee[]>) => {
      state.metadata.newFees = action.payload;
    },
    
    setEditImagePreview: (state, action: PayloadAction<string | null>) => {
      state.metadata.imagePreview = action.payload;
    },
    
    setEditDisplayStatus: (state, action: PayloadAction<"draft" | "publish">) => {
      state.display.status = action.payload;
    },
    
    setEditIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.metadata.isLoaded = action.payload;
    },
    
    // Form data setters
    setEditBasicDetails: (state, action: PayloadAction<BasicDetailsFormValues>) => {
      state.basicDetails = action.payload;
    },
    
    setEditBulkDetails: (state, action: PayloadAction<BulkDetailsFormValues>) => {
      state.bulkDetails = action.payload;
    },
    
    setEditSpecifications: (state, action: PayloadAction<PropertySpecificationsFormValues>) => {
      state.specifications = action.payload;
    },
    
    setEditLandForm: (state, action: PayloadAction<LandFormValues>) => {
      state.landForm = action.payload;
    },
    
    setEditLandSizeSections: (state, action: PayloadAction<LandSizeSection[]>) => {
      state.LandSizeSection = action.payload;
    },
    
    setEditFeatures: (state, action: PayloadAction<FeaturesFormValues>) => {
      state.features = action.payload;
    },
    
    setEditMedia: (state, action: PayloadAction<MediaFormValues>) => {
      state.media = action.payload;
    },
    
    setEditDiscount: (state, action: PayloadAction<DiscountFormValues>) => {
      state.discount = action.payload;
    },
    
    setEditPaymentStructure: (state, action: PayloadAction<PaymentStructureFormValues>) => {
      state.paymentStructure = action.payload;
    },
    
    // Individual field updates
    updateEditBasicDetail: <K extends keyof BasicDetailsFormValues>(
      state: EditPropertyFormData,
      action: PayloadAction<{ field: K; value: BasicDetailsFormValues[K] }>
    ) => {
      state.basicDetails[action.payload.field] = action.payload.value;
    },
    
    updateEditSpecification: <K extends keyof PropertySpecificationsFormValues>(
      state: EditPropertyFormData,
      action: PayloadAction<{ field: K; value: PropertySpecificationsFormValues[K] }>
    ) => {
      state.specifications[action.payload.field] = action.payload.value;
    },
    
    updateEditLandField: <K extends keyof LandFormValues>(
      state: EditPropertyFormData,
      action: PayloadAction<{ field: K; value: LandFormValues[K] }>
    ) => {
      state.landForm[action.payload.field] = action.payload.value;
    },
    
    // Array helpers
    addEditMediaImage: (state, action: PayloadAction<File | string>) => {
      state.media.images.push(action.payload);
    },
    
    removeEditMediaImage: (state, action: PayloadAction<number>) => {
      state.media.images.splice(action.payload, 1);
    },
    
    clearEditMediaImages: (state) => {
      state.media.images = [];
    },
  },
});

export const {
  resetEditForm,
  setEditFormData,
  loadEditPropertyData,
  setEditCurrentStep,
  setIsEditLandProperty,
  setIsEditLandProperty2,
  setIsEditBulk,
  setIsEditSubmitting,
  setEditDirectorName,
  setEditPreviousPropType,
  setEditFees,
  setEditNewFees,
  setEditImagePreview,
  setEditDisplayStatus,
  setEditIsLoaded,
  setEditBasicDetails,
  setEditBulkDetails,
  setEditSpecifications,
  setEditLandForm,
  setEditLandSizeSections,
  setEditFeatures,
  setEditMedia,
  setEditDiscount,
  setEditPaymentStructure,
  updateEditBasicDetail,
  updateEditSpecification,
  updateEditLandField,
  addEditMediaImage,
  removeEditMediaImage,
  clearEditMediaImages,
} = editPropertySlice.actions;

export default editPropertySlice.reducer;