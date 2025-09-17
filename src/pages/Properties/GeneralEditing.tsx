import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../components/Redux/hook";
import { TbXboxX } from "react-icons/tb";
import {
  fetchPropertyData,
} from "../../components/Redux/Properties/propertiesDetails/propertiesDetails_thunk";
import { clearPropertyData } from "../../components/Redux/Properties/propertiesDetails/propetiesDetailsSlice";
import { UpdateProperty } from "../../components/Redux/addProperty/UpdateProperties/updateThunk";
import { edit_property_detail } from "../../components/Redux/addProperty/addFees/edithFees";
import { publishDraft } from "../../components/Redux/Properties/publishPropertythunk";
import { resetPropertyState } from "../../components/Redux/addProperty/UpdateProperties/update_slice";
import { resetPublishDraftState } from "../../components/Redux/Properties/publishpropertySlice";
import { PropertyContext } from "../../MyContext/MyContext";
import StepIndicator from "../../general/StepIndicator";
import { EdithBackgroung } from "../../components/Tables/forProperties";
import { IoArrowBackSharp } from "react-icons/io5";
import BasicDetails from "./BasicDetails/BasicDetails";
import BasicDetailsLand from "./BasicDetails/BasicDetailsLand";
import PropertySpecifications from "./BasicDetails/PropertySpecifications/PropertySpecifications";
import LandForm from "./BasicDetails/PropertySpecifications/land";
import FeaturesInput from "./Features/Features";
import Payment_Structure from "./Payment_Structure/Payment_Structure";
import Discount from "./Payment_Structure/Discount";
import PropertyListing from "./edithFinal/EdithFnal";
import DraftPublishModal from "./DraftPublishModal";
import LoadingAnimations from "../../components/LoadingAnimations";
import NotFound from "../../components/NotFound";
import BulkBasicDetails from "./BasicDetails/BulkBasicDetails";
import InfrastructureFeesModal from "../../components/Modals/InfrastructureFeesModal";
import MediaFORM from "./Media/MediaFORM2";
import { add_property_detail } from "../../components/Redux/addProperty/addFees/addFees_thunk";
import { convertUrlsToMockFiles } from "../../utils/coverturloffiles";

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.propertyDetails);
  const {
    loading: publishLoading,
    success: publishSuccess,
    error: publishError,
  } = useAppSelector((state) => state.publishDraft);
  const { success: updateSuccess, error: updateError } = useAppSelector(
    (state) => state.updateproperty
  );

  const {
    currentStep,
    setCurrentStep,
    formData,
    setBasicDetails,
    setBulkDetails,
    setSpecifications,
    setLandForm,
    setFeatures,
    setMedia,
    setDiscount,
    setPaymentStructure,
    setFees,
    fees,
    isLandProperty,
    setIsLandProperty,
    isBulk,
    setIsBulk,
    isSubmitting,
    setIsSubmitting,
    setDisplayStatus,
      imagePreview, setImagePreview,
              selectedPropertyId,
               setSelectedPropertyId,
  } = useContext(PropertyContext)!;
  

  const [discount, setDiscounted] = useState(formData.discount.discountName !== "");
  const [showDraftPublishModal, setShowDraftPublishModal] = useState(false);
  const [showInfrastructureModal, setShowInfrastructureModal] = useState(false);

  const [galleryPreviews, setGalleryPreviews] = useState<(string | null)[]>([]);
  const [newDisplayImage, setNewDisplayImage] = useState<File | null>(null);
  const [newGalleryImages, setNewGalleryImages] = useState<(File | string | null)[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null!);
const resetFormData = () => {
    setBasicDetails({
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
        category: "estate",
        category_id: null,
        propertyFiles:[]
    });
   
    setSpecifications({
        bedrooms: "",
        bathrooms: "",
        toilets: "",
        propertySize: "",
        landSize: "",
        parkingSpaces: "",
        yearBuilt: "",
        unitsAvailable: "",
        description: "",
        overview: "",
        documents: "",
        director_id: "",
        nearbyLandmarks: [],
        rentDuration: "",
        buildingCondition: "",
        titleDocumentTypeProp: [],
        whatsAppLink: "",
        contactNumber: "",
    });
    setLandForm({
        plotShape: "",
        topography: "",
        propertySize: "",
        landSize: "",
        roadAccess: [],
        unitsAvailable: "",
        description: "",
        overview: "",
        documents: "",
        director_id: "",
        titleDocumentType: [],
        fencing: "",
        gatedEstate: "",
        contactNumber: "",
        whatsAppLink: "",
        nearbyLandmarks: [],
    });
    setFeatures({
        features: [],
    });
    setMedia({
        mapUrl: "",
        tourLink: "",
        videoLink: "",
        images: [],
    });
    setDiscount({
        discountName: "",
        discountType: "",
        discountOff: "",
        unitsRequired: "",
        validFrom: "",
        validTo: "",
    });
    setPaymentStructure({
        paymentType: "",
        paymentDuration: "",
        paymentSchedule: [],
        feesCharges: "",
    });
    setFees([]);
    setIsLandProperty(false);
    setIsBulk(false);
    setImagePreview(null);
    setGalleryPreviews([]);
    setNewDisplayImage(null);
    setNewGalleryImages([]);
    setCurrentStep(1);
};
  const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const basicDetailsRef = useRef<any>(null);
  const bulkBasicDetailsRef = useRef<any>(null);
  const specificationsRef = useRef<any>(null);
  const landRef = useRef<any>(null);
  const mediaRef = useRef<any>(null);
  const featuresRef = useRef<any>(null);
  const paymentStructureRef = useRef<any>(null);
  const discountRef = useRef<any>(null);
  const propertyId = id;

  // Fetch property data
  useEffect(() => {
    if (propertyId) {
      const id = parseInt(propertyId);
      if (!isNaN(id)) {
        dispatch(fetchPropertyData({ id }));
      } else {
        toast.error("Invalid property ID");
        navigate("/properties");
      }
    }
    return () => {
      dispatch(clearPropertyData());
    };
  }, [propertyId, dispatch, navigate]);

  useEffect(() => {
    if (data?.properties?.[0]) {
      const property = data.properties[0];
    
      setImagePreview(property.display_image);
      setGalleryPreviews(property?.photos || []);
      setNewGalleryImages(property?.photos || []);
    }
  }, [data]);

  // Pre-populate form with fetched property data
  useEffect(() => {
    if (data?.properties?.[0]) {

      const property = data.properties[0];
     
      setBasicDetails({
        propertyName: property.name,
        propertyType: property.type?.id?.toString() || "",
        price: property.price?.toString() || "",
        initialDeposit: property.initial_deposit?.toString() || "",
        address: property.street_address || "",
        locationType: property.location_type || "",
        purpose: property.purpose || [],
        country: property.country || "",
        state: property.state || "",
        lga: property.lga || "N/A",
        category: property.category || "estate",
        category_id: null,
        propertyFiles: convertUrlsToMockFiles(property.property_files)
      });

       if (property.category !== "estate") {  setBasicDetails({
        propertyName: property.name,
        propertyType: property.type?.id?.toString() || "",
        price: property.price?.toString() || "",
        initialDeposit: property.initial_deposit?.toString() || "",
        address: property.street_address || "",
        locationType: property.location_type || "",
        purpose: property.purpose || [],
        country: property.country || "",
        state: property.state || "",
        lga: property.lga || "N/A",
        category: property.category || "estate",
        category_id: property.category_id?.toString() || "",
         propertyFiles: convertUrlsToMockFiles(property.property_files)
      });}

    if (property.category !== "estate") {
      setSpecifications({
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
        director_id: property.director_id?.toString() || "",
        nearbyLandmarks: property.nearby_landmarks ? 
          property.nearby_landmarks.split(',').map(item => item.trim()) : [],
        rentDuration: property.rent_duration || "",
        buildingCondition: property.building_condition || "",
        titleDocumentTypeProp: property.title_document_type ? 
          property.title_document_type.split(',').map(item => item.trim()) : [],
        whatsAppLink: property.whatsapp_link || "",
        contactNumber: property.contact_number || "",
      });
    }

    // Set land form for land properties
    if (property.category === "estate") {
      setLandForm({
        plotShape: property.shape || "",
        topography: property.topography || "",
        propertySize: property.size?.toString() || "",
        landSize: property.size?.toString() || "",
        roadAccess: property.road_access ? 
          property.road_access.split(',').map(item => item.trim()) : [],
        unitsAvailable: property.number_of_unit?.toString() || "",
        description: property.description || "",
        overview: property.overview || "",
        documents: property.property_agreement || "",
        director_id: property.director_id?.toString() || "",
        titleDocumentType: property.title_document_type ? 
          property.title_document_type.split(',').map(item => item.trim()) : [],
        fencing: property.fencing || "",
        gatedEstate: property.gated_estate || "",
        contactNumber: property.contact_number || "",
        whatsAppLink: property.whatsapp_link || "",
        nearbyLandmarks: property.nearby_landmarks ? 
          property.nearby_landmarks.split(',').map(item => item.trim()) : [],
      });
    }

      setFeatures({
        features: Array.isArray(property.features) && property.features.length > 0
          ? property.features[0].split(',').map(f => f.trim())
          : [],
        //    setSelectedPropertyId()
      });

      setMedia({
        mapUrl: property.property_map || "",
        tourLink: property.virtual_tour || "",
        videoLink: property.video_link || "",
        images: property.photos || [],
      });

      setDiscount({
        discountName: property.is_discount ? property.discount_name || "" : "",
        discountType: property.is_discount ? "percentage" : "",
        discountOff: property.is_discount ? property.discount_percentage?.toString() || "" : "",
        unitsRequired: property.is_discount ? property.discount_units?.toString() || "" : "",
        validFrom: property.is_discount ? property.discount_start_date || "" : "",
        validTo: property.is_discount ? property.discount_end_date || "" : "",
      });

      setPaymentStructure({
        paymentType: property.payment_type || "",
        paymentDuration: property.property_duration_limit?.toString() || "",
        paymentSchedule: property.payment_schedule || [],
        feesCharges: property.fees_charges || "",
      });

      setFees(
        property.details?.map((detail) => ({
          id: detail.id,
          name: detail.name,
          amount: `₦${detail.value.toLocaleString("en-NG")}`,
          checked: true,
          type: detail.type,
          purpose: detail.purpose,
        })) || []
      );

      setDisplayStatus(property.is_active ? "publish" : "draft");
      setIsLandProperty(property.category === "estate");
      setIsBulk(property.category === "bulk");
      setImagePreview(property.display_image || null);
      setGalleryPreviews(property.photos || []);
      setNewGalleryImages(property.photos || []);
    }
    
  }, [data]);

  // Reset states after success/error
  useEffect(() => {
    if (publishSuccess || publishError) {
      dispatch(resetPublishDraftState());
    }
    if (updateSuccess || updateError) {
      dispatch(resetPropertyState());
    }
  }, [publishSuccess, publishError, updateSuccess, updateError, dispatch]);

  // Image handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setNewDisplayImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...galleryPreviews];
        newPreviews[index] = reader.result as string;
        setGalleryPreviews(newPreviews);

        const newImages = [...newGalleryImages];
        newImages[index] = file;
        setNewGalleryImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const triggerGalleryFileInput = (index: number) => galleryInputRefs.current[index]?.click();

  // Validation
  const validateFormData = () => {
    const errors: Record<string, string> = {};
    const { basicDetails, specifications, landForm } = formData;

    if (!basicDetails.propertyName) errors.name = "Property name is required";
    if (!basicDetails.price) errors.price = "Price is required";
    if (isLandProperty) {
      if (!landForm.landSize) errors.size = "Size is required";
      if (!landForm.unitsAvailable) errors.unitsAvailable = "Units available is required";
      if (!landForm.description) errors.description = "Description is required";
    } else {
      if (!specifications.landSize) errors.size = "Size is required";
      if (!specifications.bedrooms) errors.bedrooms = "Bedrooms is required";
      if (!specifications.bathrooms) errors.bathrooms = "Bathrooms is required";
      if (!specifications.toilets) errors.toilets = "Toilets is required";
      if (!specifications.buildingCondition) errors.buildingCondition = "Building condition is required";
      if (!specifications.yearBuilt) errors.yearBuilt = "Year built is required";
    }
    // if (!basicDetails.street_address) errors.street_address = "Street address is required";
    if (!basicDetails.state) errors.state = "State is required";
    if (!basicDetails.country) errors.country = "Country is required";
    if (!formData.paymentStructure.paymentType) errors.paymentType = "Payment type is required";

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
      return false;
    }
    return true;
  };

const submitForm = async (displayStatus: "draft" | "publish") => {
  if (!validateFormData()) return;

  try {
    setIsSubmitting(true);
    const formPayload = new FormData();
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

    // Populate formPayload based on isBulk
    if (isBulk) {
      formPayload.append("name", bulkDetails.propertyName);
      formPayload.append("type", bulkDetails.propertyType);
      formPayload.append("no_of_unit", bulkDetails.propertyUnits || "1");
      formPayload.append("price", bulkDetails.price);
      formPayload.append("street_address", bulkDetails.address);
      formPayload.append("city", bulkDetails.city || "");
      formPayload.append("country", basicDetails.country);
      formPayload.append("state", basicDetails.state);
      formPayload.append("lga", basicDetails.lga || "");
      formPayload.append("category", "bulk");
      formPayload.append("initial_deposit", basicDetails.initialDeposit || "0");
    } else {
      formPayload.append("name", basicDetails.propertyName);
      formPayload.append("type", basicDetails.propertyType);
      formPayload.append("price", basicDetails.price);
      formPayload.append("initial_deposit", basicDetails.initialDeposit || "0");
      formPayload.append("country", basicDetails.country);
      formPayload.append("state", basicDetails.state);
      formPayload.append("lga", basicDetails.lga || "");
      formPayload.append("street_address", basicDetails.address);
      formPayload.append("location_type", basicDetails.locationType || "N/A");
      formPayload.append("category", "single");
      basicDetails.purpose.forEach((purpose, index) => {
        formPayload.append(`purpose[${index}]`, purpose);
      });
    }

    // Populate formPayload based on isLandProperty
    if (isLandProperty) {
      formPayload.append("size", landForm.landSize);
      formPayload.append("shape", landForm.plotShape || "N/A");
      formPayload.append("topography", landForm.topography || "N/A");
      formPayload.append("category", "estate");
      formPayload.append("nearby_landmarks", landForm.nearbyLandmarks.join(", "));
      formPayload.append("road_access", landForm.roadAccess.join(", "));
      formPayload.append("title_document_type", landForm.titleDocumentType.join(", "));
      formPayload.append("description", landForm.description);
      formPayload.append("number_of_unit", landForm.unitsAvailable);
      formPayload.append("director_id", landForm.director_id || "1");
      formPayload.append("fencing", landForm.fencing || "");
      formPayload.append("gated_estate", landForm.gatedEstate || "");
      formPayload.append("contact_number", landForm.contactNumber || "");
      formPayload.append("whatsapp_link", landForm.whatsAppLink || "");
      formPayload.append("property_agreement", landForm.documents);
    } else {
      formPayload.append("no_of_bedroom", specifications.bedrooms || "0");
      formPayload.append("number_of_bathroom", specifications.bathrooms || "0");
      formPayload.append("title_document_type", specifications.titleDocumentTypeProp.join(", "));
      formPayload.append("toilets", specifications.toilets || "0");
      formPayload.append("size", specifications.landSize);
      formPayload.append("parking_space", specifications.parkingSpaces || "0");
      formPayload.append("description", specifications.description);
      formPayload.append("year_built", specifications.yearBuilt || "");
      formPayload.append("number_of_unit", specifications.unitsAvailable);
      formPayload.append("director_id", specifications.director_id || "1");
      formPayload.append("nearby_landmarks", specifications.nearbyLandmarks.join(", "));
      formPayload.append("rent_duration", specifications.rentDuration || "");
      formPayload.append("building_condition", specifications.buildingCondition || "");
      formPayload.append("whatsapp_link", specifications.whatsAppLink || "");
      formPayload.append("contact_number", specifications.contactNumber || "");
      formPayload.append("property_agreement", specifications.documents);
    }

    // Append shared features and media
    features.features.forEach((feature, index) => {
      formPayload.append(`features[${index}]`, feature);
    });
    const displayImage = media.images[0];
    if (displayImage instanceof File) {
      formPayload.append("display_image", displayImage);
    }
    media.images.slice(1).forEach((image, index) => {
      if (image instanceof File) {
        formPayload.append(`photos[${index}]`, image);
      }
    });
    if (media.tourLink) formPayload.append("virtual_tour", media.tourLink);
    if (media.videoLink) formPayload.append("video_link", media.videoLink);
    if (media.mapUrl) formPayload.append("map_link", media.mapUrl);

    // Append payment and discount details
    formPayload.append("payment_type", paymentStructure.paymentType);
    formPayload.append("property_duration_limit", paymentStructure.paymentDuration);
    paymentStructure.paymentSchedule.forEach((schedule, index) => {
      formPayload.append(`payment_schedule[${index}]`, schedule);
    });
    const feesCharges = parseFloat(paymentStructure.feesCharges);
    if (!isNaN(feesCharges)) {
      formPayload.append("fees_charges", feesCharges.toString());
    } else {
      formPayload.append("fees_charges", "0");
    }

    formPayload.append("is_discount", discount.discountName ? "1" : "0");
    if (discount.discountName) {
      formPayload.append("discount_name", discount.discountName);
      formPayload.append("discount_percentage", discount.discountOff);
      formPayload.append("discount_units", discount.unitsRequired);
      formPayload.append("discount_start_date", discount.validFrom);
      formPayload.append("discount_end_date", discount.validTo);
    }

    formPayload.append("is_active", displayStatus === "draft" ? "0" : "1");

    // Start the update process. This is the correct pattern.
    await dispatch(
      UpdateProperty({ UpdateId: parseInt(propertyId!), credentials: formPayload })
    ).unwrap();

    
    if (propertyId) {
      const feePromises = fees
        .filter((fee) => fee.checked)
        .map((fee) => ({
          property_id: propertyId.toString(),
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

      const successfulFees = feeResults.filter((r) => r.status === "fulfilled").length;
      const failedFees = feeResults.filter((r) => r.status === "rejected").length;

      if (failedFees === 0) {
        toast.success("Property and all fees updated successfully!");
      } else {
        toast.warning(`Property updated, but ${failedFees} fee(s) failed to add.`);
      }
    } else {
      toast.error("Property updated but couldn't add fees - missing property ID.");
    }

    // Perform cleanup and navigation after the entire process is complete.
    resetFormData();
    dispatch(resetPropertyState());
    navigate("/properties");
  } catch (error: any) {
    console.error("Update failed:", error);
    toast.error(error.message || "Failed to update property or its fees.");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleNext = async () => {
    if (isSubmitting) return;

    let canProceed = true;

    switch (currentStep) {
      case 1:
        if (isBulk) {
          if (bulkBasicDetailsRef.current) {
            bulkBasicDetailsRef.current.handleSubmit();
            canProceed = bulkBasicDetailsRef.current.isValid;
          }
        } else {
          if (basicDetailsRef.current) {
            basicDetailsRef.current.handleSubmit();
            canProceed = basicDetailsRef.current.isValid;
          }
        }
        break;
      case 2:
        if (isLandProperty) {
          if (landRef.current) {
            landRef.current.handleSubmit();
            canProceed = landRef.current.isValid;
          }
        } else {
          if (specificationsRef.current) {
            specificationsRef.current.handleSubmit();
            canProceed = specificationsRef.current.isValid;
          }
        }
        break;
      case 3:
        if (mediaRef.current) {
          mediaRef.current.handleSubmit();
          canProceed = mediaRef.current.isValid;
        }
        break;
      case 4:
        if (featuresRef.current) {
          featuresRef.current.handleSubmit();
            canProceed = featuresRef.current.isValid;
        }
        break;
      case 5:
        if (discount) {
          if (discountRef.current) {
            discountRef.current.handleSubmit();
            canProceed = discountRef.current.isValid;
          }
        }
        if (paymentStructureRef.current) {
          paymentStructureRef.current.handleSubmit();
          canProceed = paymentStructureRef.current.isValid && canProceed;
        }
        break;
      case 6:
        if (canProceed) {
          setShowDraftPublishModal(true);
          return;
        }
        break;
    }

    if (canProceed) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleDraftPublishSelect = async (option: "draft" | "publish") => {
    try {
      setIsSubmitting(true);
      setShowDraftPublishModal(false);
      setDisplayStatus(option);
      await submitForm(option);
      setCurrentStep(1);
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to update property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isSubmitting) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 1) {
      navigate("/properties");
    }
  };

  const handlePublishToggle = async () => {
    if (!propertyId) {
      toast.error("Property ID not found");
      return;
    }
    try {
      await dispatch(publishDraft(parseInt(propertyId))).unwrap();
      toast.success(
        `Property ${data?.properties?.[0]?.is_active === 1 ? "drafted" : "published"} successfully!`
      );
      dispatch(fetchPropertyData({ id: parseInt(propertyId) }));
    } catch (error: any) {
      toast.error(error.message || "Failed to update property status");
    }
  };

  const nextButtonText = currentStep === 6 ? "Confirm & Update" : "Next";

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <LoadingAnimations loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!data?.properties?.[0]) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <NotFound text="Property not found" />
      </div>
    );
  }

  return (
    <section className="w-full lg:pl-[38px] lg:pr-[64px] pr-[15px] pl-[15px] pt-8">
      <EdithBackgroung>
        <div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <button
                onClick={handleBack}
                className="text-gray-700 hover:text-gray-900 text-xl flex items-center"
              >
                <IoArrowBackSharp className="mr-2" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">
                Edit Property
              </h1>
            </div>
            <div className="flex space-x-4 justify-center md:justify-end">
             <button
                className={`bg-red-500 text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-[40%] py-3 px-6 md:px-10 hover:bg-red-600 transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4 `}
                onClick={() => {
                    resetFormData();
                    navigate("/properties"); // Navigate back to the properties list
                }}
                disabled={isSubmitting}
            >
                Cancel
            </button>
            </div>
          </div>

          <div className="w-full lg:flex justify-center hidden">
            <StepIndicator setCurrentStep={setCurrentStep} currentStep={currentStep} />
          </div>

          <DraftPublishModal
            isOpen={showDraftPublishModal}
            onClose={() => setShowDraftPublishModal(false)}
            onSelect={handleDraftPublishSelect}
            isSubmitting={isSubmitting}
          />

          <InfrastructureFeesModal
            isOpen={showInfrastructureModal}
            onClose={() => setShowInfrastructureModal(false)}
          />

          {currentStep === 1 && (
            <div className="bg-white rounded-lg p-6">
              {isBulk ? (
                <BulkBasicDetails ref={bulkBasicDetailsRef} />
              ) : isLandProperty ? (
                <BasicDetailsLand ref={basicDetailsRef} />
              ) : (
                <BasicDetails ref={basicDetailsRef} />
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-lg p-6">
              {isLandProperty ? (
                <LandForm ref={landRef} />
              ) : (
                <PropertySpecifications ref={specificationsRef} />
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-lg p-6">
              <MediaFORM
                  ref={mediaRef}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  newDisplayImage={newDisplayImage}
                  setNewDisplayImage={setNewDisplayImage}
                  galleryPreviews={galleryPreviews}
                  setGalleryPreviews={setGalleryPreviews}
                  newGalleryImages={newGalleryImages}
                  setNewGalleryImages={setNewGalleryImages}
                  galleryInputRefs={galleryInputRefs}
                  triggerFileInput={triggerFileInput}
                  triggerGalleryFileInput={triggerGalleryFileInput}
                  fileInputRef={fileInputRef}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white rounded-lg p-6">
              <FeaturesInput ref={featuresRef} />
            </div>
          )}

          {currentStep === 5 && (
            <div className="bg-white rounded-lg p-6 space-y-[30px]">
              <Payment_Structure ref={paymentStructureRef} />
              {discount ? (
                <div className="relative">
                  <p
                    className="absolute right-1/2 -top-16 cursor-pointer"
                    onClick={() => !isSubmitting && setDiscounted(false)}
                  >
                  <TbXboxX className="w-10 h-10 text-red-500" />
                  </p>
                  <div className="mt-24"> <Discount ref={discountRef} /></div>
                </div>
              ) : (
                <p
                  className={`text-dark font-bold text-sm text-center cursor-pointer ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => !isSubmitting && setDiscounted(true)}
                >
                  Add Discount
                </p>
              )}
              {isLandProperty&&<p
                className={`text-dark font-bold text-sm text-center cursor-pointer ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => !isSubmitting && setShowInfrastructureModal(true)}
              >
                Manage Infrastructure Fees
              </p>}
            </div>
          )}

          {currentStep === 6 && (
            <div className="bg-white rounded-lg p-6">
              <p className="text-dark text-2xl font-[350] mb-[8px]">
                Confirm Property Details
              </p>
              <h1 className="text-[#767676] font-[325] text-base mb-[30px]">
                Confirm everything is in order before proceeding
              </h1>
              <PropertyListing />
            </div>
          )}

            <div className="grid grid-cols-2  w-full mt-20">
          <div className="w-full justify-start flex">
            <div>
              {currentStep > 1 && currentStep < 7 && (
                <button
                  className={`bg-[#272727] text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-[40%] py-3 px-6 md:px-10 hover:bg-[#272727] transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </button>
              )}
            </div>
          </div>
          <div className="w-full justify-end flex">
            <div>
              {currentStep < 7 && (
                <button
                  className={`bg-[#79B833] text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-[40%] py-3 px-6 md:px-10 hover:bg-[#6aa22c] transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4 whitespace-nowrap ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    nextButtonText
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        </div>
      </EdithBackgroung>
    </section>
  );
}