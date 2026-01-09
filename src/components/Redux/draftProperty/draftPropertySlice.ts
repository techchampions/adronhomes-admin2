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
  Fee,
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
    director_name: "",
    previousPropType: "",
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
  },
};

const draftPropertySlice = createSlice({
  name: "draftProperty",
  initialState,
  reducers: {
    // Reset entire form
    resetDraftForm: () => initialState,

    // Set entire form data (for loading existing property)
    setDraftFormData: (
      state,
      action: PayloadAction<Partial<EditPropertyFormData>>
    ) => {
      return {
        ...state,
        ...action.payload,
        metadata: {
          ...state.metadata,
          ...action.payload.metadata,
          isLoaded: true,
        },
      };
    },

    // Load property data from API response
    loadDraftPropertyData: (state, action: PayloadAction<any>) => {
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
            ? property.nearby_landmarks
                .split(",")
                .map((item: string) => item.trim())
            : [],
          rentDuration: property.rent_duration || "",
          buildingCondition: property.building_condition || "",
          titleDocumentTypeProp: property.title_document_type
            ? property.title_document_type
                .split(",")
                .map((item: string) => item.trim())
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
            ? property.title_document_type
                .split(",")
                .map((item: string) => item.trim())
            : [],
          fencing: property.fencing || "",
          gatedEstate: property.gated_estate || "",
          contactNumber: property.contact_number || "",
          whatsAppLink: property.whatsapp_link || "",
          nearbyLandmarks: property.nearby_landmarks
            ? property.nearby_landmarks
                .split(",")
                .map((item: string) => item.trim())
            : [],
        };
      }

      state.features = {
        features:
          Array.isArray(property.features) && property.features.length > 0
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

      state.LandSizeSection =
        property.land_sizes?.map((ls: any) => ({
          id: ls.id?.toString() || "",
          size: ls.size?.toString() || "",
          durations:
            ls.durations?.map((d: any) => ({
              id: d.id?.toString() || "",
              duration: d.duration?.toString() || "",
              price: d.price?.toString() || "",
              citta_id: d.citta_id || "",
              is_active: d.is_active || true,
            })) || [],
        })) || [];

      state.display.status = property.is_active ? "publish" : "draft";

      // Update metadata
      state.metadata.propertyId = property.id?.toString() || null;
      state.metadata.isLandProperty = property.type?.name === "Land";
      state.metadata.isLandProperty2 = property.type?.name === "Land";
      state.metadata.isBulk = property.category === "bulk";
      state.metadata.director_name = `${property?.director?.first_name || ""} ${
        property?.director?.last_name || ""
      }`.trim();
      state.metadata.previousPropType = property.type?.name || "";
      state.metadata.imagePreview = property.display_image || null;
      state.metadata.isLoaded = true;
      state.metadata.fees =
        property.details?.map((detail: any) => ({
          id: detail.id,
          name: detail.name,
          amount: `₦${detail.value.toLocaleString("en-NG")}`,
          checked: true,
          type: detail.type,
          purpose: detail.purpose,
        })) || [];
    },

    // Metadata actions
    setDraftCurrentStep: (state, action: PayloadAction<number>) => {
      state.metadata.currentStep = action.payload;
    },

    setIsDraftLandProperty: (state, action: PayloadAction<boolean>) => {
      state.metadata.isLandProperty = action.payload;
    },

    setIsDraftLandProperty2: (state, action: PayloadAction<boolean>) => {
      state.metadata.isLandProperty2 = action.payload;
    },

    setIsDraftBulk: (state, action: PayloadAction<boolean>) => {
      state.metadata.isBulk = action.payload;
    },

    setIsDraftSubmitting: (state, action: PayloadAction<boolean>) => {
      state.metadata.isSubmitting = action.payload;
    },

    setDraftDirectorName: (state, action: PayloadAction<string>) => {
      state.metadata.director_name = action.payload;
    },

    setDraftPreviousPropType: (state, action: PayloadAction<string>) => {
      state.metadata.previousPropType = action.payload;
    },

    setDraftFees: (state, action: PayloadAction<Fee[]>) => {
      state.metadata.fees = action.payload;
    },

    setDraftNewFees: (state, action: PayloadAction<Fee[]>) => {
      state.metadata.newFees = action.payload;
    },

    setDraftImagePreview: (state, action: PayloadAction<string | null>) => {
      state.metadata.imagePreview = action.payload;
    },

    setDraftDisplayStatus: (
      state,
      action: PayloadAction<"draft" | "publish">
    ) => {
      state.display.status = action.payload;
    },

    setDraftIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.metadata.isLoaded = action.payload;
    },

    // Form data setters
    setDraftBasicDetails: (
      state,
      action: PayloadAction<BasicDetailsFormValues>
    ) => {
      state.basicDetails = action.payload;
    },

    setDraftBulkDetails: (
      state,
      action: PayloadAction<BulkDetailsFormValues>
    ) => {
      state.bulkDetails = action.payload;
    },

    setDraftSpecifications: (
      state,
      action: PayloadAction<PropertySpecificationsFormValues>
    ) => {
      state.specifications = action.payload;
    },

    setDraftLandForm: (state, action: PayloadAction<LandFormValues>) => {
      state.landForm = action.payload;
    },

    setDraftLandSizeSections: (
      state,
      action: PayloadAction<LandSizeSection[]>
    ) => {
      state.LandSizeSection = action.payload;
    },

    setDraftFeatures: (state, action: PayloadAction<FeaturesFormValues>) => {
      state.features = action.payload;
    },

    setDraftMedia: (state, action: PayloadAction<MediaFormValues>) => {
      state.media = action.payload;
    },

    setDraftDiscount: (state, action: PayloadAction<DiscountFormValues>) => {
      state.discount = action.payload;
    },

    setDraftPaymentStructure: (
      state,
      action: PayloadAction<PaymentStructureFormValues>
    ) => {
      state.paymentStructure = action.payload;
    },

    // Individual field updates
    updateDraftBasicDetail: <K extends keyof BasicDetailsFormValues>(
      state: EditPropertyFormData,
      action: PayloadAction<{ field: K; value: BasicDetailsFormValues[K] }>
    ) => {
      state.basicDetails[action.payload.field] = action.payload.value;
    },

    updateDraftSpecification: <K extends keyof PropertySpecificationsFormValues>(
      state: EditPropertyFormData,
      action: PayloadAction<{
        field: K;
        value: PropertySpecificationsFormValues[K];
      }>
    ) => {
      state.specifications[action.payload.field] = action.payload.value;
    },

    updateDraftLandField: <K extends keyof LandFormValues>(
      state: EditPropertyFormData,
      action: PayloadAction<{ field: K; value: LandFormValues[K] }>
    ) => {
      state.landForm[action.payload.field] = action.payload.value;
    },

    // Array helpers
    addDraftMediaImage: (state, action: PayloadAction<File | string>) => {
      state.media.images.push(action.payload);
    },

    removeDraftMediaImage: (state, action: PayloadAction<number>) => {
      state.media.images.splice(action.payload, 1);
    },

    clearDraftMediaImages: (state) => {
      state.media.images = [];
    },
  },
});

export const {
  resetDraftForm,
  setDraftFormData,
  loadDraftPropertyData,
  setDraftCurrentStep,
  setIsDraftLandProperty,
  setIsDraftLandProperty2,
  setIsDraftBulk,
  setIsDraftSubmitting,
  setDraftDirectorName,
  setDraftPreviousPropType,
  setDraftFees,
  setDraftNewFees,
  setDraftImagePreview,
  setDraftDisplayStatus,
  setDraftIsLoaded,
  setDraftBasicDetails,
  setDraftBulkDetails,
  setDraftSpecifications,
  setDraftLandForm,
  setDraftLandSizeSections,
  setDraftFeatures,
  setDraftMedia,
  setDraftDiscount,
  setDraftPaymentStructure,
  updateDraftBasicDetail,
  updateDraftSpecification,
  updateDraftLandField,
  addDraftMediaImage,
  removeDraftMediaImage,
  clearDraftMediaImages,
} = draftPropertySlice.actions;

export default draftPropertySlice.reducer;