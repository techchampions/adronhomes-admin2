import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../components/Redux/hook";
import { TbXboxX } from "react-icons/tb";
import { fetchPropertyData } from "../../components/Redux/Properties/propertiesDetails/propertiesDetails_thunk";
import { clearPropertyData } from "../../components/Redux/Properties/propertiesDetails/propetiesDetailsSlice";
import { UpdateProperty } from "../../components/Redux/addProperty/UpdateProperties/updateThunk";
import { edit_property_detail } from "../../components/Redux/addProperty/addFees/edithFees";
import { publishDraft } from "../../components/Redux/Properties/publishPropertythunk";
import { resetPropertyState } from "../../components/Redux/addProperty/UpdateProperties/update_slice";
import { resetPublishDraftState } from "../../components/Redux/Properties/publishpropertySlice";
import { useEditPropertyForm } from "../../components/Redux/hooks/usePropertyForms";
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
// import InfrastructureFeesModalss from "../../components/Modals/infrastureModal2";
import MediaFORM from "./Media/MediaFORM2";
import { add_property_detail } from "../../components/Redux/addProperty/addFees/addFees_thunk";
import PropertyListingPage from "./addPropplan/planForm";
import ForProperties from "../../components/Tables/forProperties";
import { setIsEditLandProperty } from "../../components/Redux/editProperty/editpropslice";
import InfrastructureFeesModal from "../../components/Modals/InfrastructureFeesModal";

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Use Redux for edit form
  const {
    basicDetails,
    bulkDetails,
    specifications,
    landForm,
    features,
    media,
    discount,
    paymentStructure,
    LandSizeSection,
    display,
    metadata,
    setEditCurrentStep,
    setIsEditSubmitting,
    setEditDisplayStatus,
    setEditBasicDetails,
    setEditBulkDetails,
    setEditSpecifications,
    setEditLandForm,
    setEditLandSizeSections,
    setEditFeatures,
    setEditMedia,
    setEditDiscount,
    setEditPaymentStructure,
    setEditFees,
    setEditNewFees,
    setEditImagePreview,
    setEditDirectorName,
    setEditPreviousPropType,
    setIsEditLandProperty2,
    setIsEditBulk,
    resetEditForm,
    loadEditPropertyData,
  } = useEditPropertyForm();

  // Extract values from metadata
  const {
    currentStep,
    isLandProperty2,
    isBulk,
    isSubmitting,
    fees,
    newFees,
    director_name,
    previousPropType,
    imagePreview,
    isLoaded,
    propertyId: editPropertyId,
  } = metadata;

  const { data, loading, error } = useAppSelector(
    (state) => state.propertyDetails
  );

  const [discountEnabled, setDiscounted] = useState(
    discount.discountName !== ""
  );
  const [showDraftPublishModal, setShowDraftPublishModal] = useState(false);
  const [showInfrastructureModal, setShowInfrastructureModal] = useState(false);

  // Image state
  const [galleryPreviews, setGalleryPreviews] = useState<(string | null)[]>([]);
  const [newDisplayImage, setNewDisplayImage] = useState<File | null>(null);
  const [newGalleryImages, setNewGalleryImages] = useState<
    (File | string | null)[]
  >([]);

  // Create refs
  const basicDetailsRef = useRef<any>(null);
  const bulkBasicDetailsRef = useRef<any>(null);
  const specificationsRef = useRef<any>(null);
  const landRef = useRef<any>(null);
  const LandPlan = useRef<any>(null);
  const mediaRef = useRef<any>(null);
  const featuresRef = useRef<any>(null);
  const paymentStructureRef = useRef<any>(null);
  const discountRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Dynamic step titles based on property type
  const stepTitles = isLandProperty2
    ? [
        "Basic Details",
        "Property Specifications",
        "Land Sizes & Pricing",
        "Media",
        "Features",
        discountEnabled ? "Discount" : "Payment Structure",
        "Preview",
      ]
    : [
        "Basic Details",
        "Property Specifications",
        "Media",
        "Features",
        discountEnabled ? "Discount" : "Payment Structure",
        "Preview",
      ];

  const totalSteps = isLandProperty2 ? 7 : 6;

  // Fetch property data
  //   useEffect(() => {
  //     if (id) {
  //       const propertyId = parseInt(id);
  //       if (!isNaN(propertyId)) {
  //         dispatch(fetchPropertyData({ id: propertyId }))
  //           .unwrap()
  //           .then((response) => {
  //             if (response.properties) {
  //               loadEditPropertyData(response.properties);
  //               setGalleryPreviews(response.properties.photos || []);
  //               setNewGalleryImages(response.properties.photos || []);
  //             }
  //           })
  //           .catch((error) => {
  //             toast.error("Failed to load property data");
  //             navigate("/properties");
  //           });
  //       } else {
  //         toast.error("Invalid property ID");
  //         navigate("/properties");
  //       }
  //     }

  //     return () => {
  //       resetEditForm();
  //       dispatch(clearPropertyData());
  //     };
  //   }, [id, dispatch, navigate, resetEditForm, loadEditPropertyData]);

  const propertyId = id;
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
    if (data?.properties) {
      const property = data?.properties;
      loadEditPropertyData(data.properties);
      //   setImagePreview(property.display_image);
      setGalleryPreviews(property?.photos || []);
      setNewGalleryImages(property?.photos || []);
    }
  }, [data]);

  // Form submission
  const submitEditForm = async (displayStatus: "draft" | "publish") => {
    try {
      setIsEditSubmitting(true);

      // Build FormData payload
      const formPayload = new FormData();

      // Handle Bulk or Regular Basic Details
      if (isBulk) {
        formPayload.append("name", bulkDetails.propertyName);
        formPayload.append("type", bulkDetails.propertyType);
        formPayload.append("no_of_unit", bulkDetails.propertyUnits || "1");
        formPayload.append("price", bulkDetails.price);
        formPayload.append("street_address", bulkDetails.address);
        formPayload.append("city", bulkDetails.city);
        formPayload.append("country", basicDetails.country);
        formPayload.append("state", basicDetails.state);
        formPayload.append("lga", basicDetails.lga);
        formPayload.append("category", "bulk");
        formPayload.append(
          "initial_deposit",
          basicDetails.initialDeposit || "0"
        );
      } else {
        formPayload.append("name", basicDetails.propertyName);
        formPayload.append("type", basicDetails.propertyType);
        formPayload.append("price", basicDetails.price);
        formPayload.append(
          "initial_deposit",
          basicDetails.initialDeposit || "0"
        );
        formPayload.append("country", basicDetails.country);
        formPayload.append("state", basicDetails.state);
        formPayload.append("lga", basicDetails.lga);
        formPayload.append("street_address", basicDetails.address);
        formPayload.append("location_type", basicDetails.locationType);
        formPayload.append("category", isLandProperty2 ? "estate" : "house");
        if (!isLandProperty2) {
          formPayload.append("category_id", basicDetails.category_id || "");
        }
        basicDetails.purpose.forEach((purpose, index) => {
          formPayload.append(`purpose[${index}]`, purpose);
        });
      }

      // Handle Land or House Specifications
      if (isLandProperty2 && LandSizeSection && LandSizeSection.length > 0) {
        LandSizeSection.forEach((ls, i) => {
          formPayload.append(`land_sizes[${i}][id]`, String(ls.id || ""));
          formPayload.append(`land_sizes[${i}][size]`, String(ls.size || ""));

          if (ls.durations && ls.durations.length > 0) {
            ls.durations.forEach((d, j) => {
              formPayload.append(
                `land_sizes[${i}][durations][${j}][id]`,
                String(d.id || "")
              );
              formPayload.append(
                `land_sizes[${i}][durations][${j}][duration]`,
                String(d.duration || "")
              );
              formPayload.append(
                `land_sizes[${i}][durations][${j}][price]`,
                String(d.price || "")
              );
              formPayload.append(
                `land_sizes[${i}][durations][${j}][citta_id]`,
                String(d.citta_id || "")
              );
            });
          }
        });
      }

      if (isLandProperty2) {
        formPayload.append("size", landForm.landSize);
        formPayload.append("shape", landForm.plotShape);
        formPayload.append("topography", landForm.topography);
        formPayload.append("category", "estate");
        formPayload.append(
          "nearby_landmarks",
          landForm.nearbyLandmarks.join(", ")
        );
        formPayload.append("road_access", landForm.roadAccess.join(", "));
        formPayload.append(
          "title_document_type",
          landForm.titleDocumentType.join(", ")
        );
        formPayload.append("description", landForm.description);
        formPayload.append("number_of_unit", landForm.unitsAvailable);
        formPayload.append("director_id", landForm.director_id);
        formPayload.append("fencing", landForm.fencing);
        formPayload.append("gated_estate", landForm.gatedEstate);
        formPayload.append("contact_number", landForm.contactNumber);
        formPayload.append("whatsapp_link", landForm.whatsAppLink);
        formPayload.append("property_agreement", landForm.documents);
      } else {
        formPayload.append("no_of_bedroom", specifications.bedrooms);
        formPayload.append("number_of_bathroom", specifications.bathrooms);
        formPayload.append("toilets", specifications.toilets);
        formPayload.append("size", specifications.landSize);
        formPayload.append("parking_space", specifications.parkingSpaces);
        formPayload.append("description", specifications.description);
        formPayload.append("year_built", specifications.yearBuilt);
        formPayload.append("number_of_unit", specifications.unitsAvailable);
        formPayload.append("director_id", specifications.director_id);
        formPayload.append(
          "nearby_landmarks",
          specifications.nearbyLandmarks.join(", ")
        );
        formPayload.append("rent_duration", specifications.rentDuration);
        formPayload.append(
          "building_condition",
          specifications.buildingCondition
        );
        formPayload.append("whatsapp_link", specifications.whatsAppLink);
        formPayload.append("contact_number", specifications.contactNumber);
        formPayload.append("property_agreement", specifications.documents);
        formPayload.append(
          "title_document_type",
          specifications.titleDocumentTypeProp.join(", ")
        );
      }

      // Append Features
      features.features.forEach((feature, index) => {
        formPayload.append(`features[${index}]`, feature);
      });

      // Append Media
      const displayImage = media.images[0];
      if (displayImage instanceof File) {
        formPayload.append("display_image", displayImage);
      }
      media.images.slice(1).forEach((image, index) => {
        if (image instanceof File) {
          formPayload.append(`photos[${index}]`, image);
        }
      });

      formPayload.append("virtual_tour", media.tourLink);
      formPayload.append("video_link", media.videoLink);
      formPayload.append("property_map", media.mapUrl);

      // Append Payment and Discount Details
      formPayload.append("payment_type", paymentStructure.paymentType);
      formPayload.append(
        "property_duration_limit",
        paymentStructure.paymentDuration
      );
      paymentStructure.paymentSchedule.forEach((schedule, index) => {
        formPayload.append(`payment_schedule[${index}]`, schedule);
      });

      const feesCharges = parseFloat(paymentStructure.feesCharges);
      if (!isNaN(feesCharges)) {
        formPayload.append("fees_charges", feesCharges.toString());
      } else {
        formPayload.append("fees_charges", "0");
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

      formPayload.append("is_active", displayStatus === "draft" ? "0" : "1");

      // Dispatch update
      await dispatch(
        UpdateProperty({
          UpdateId: parseInt(id!),
          credentials: formPayload,
        })
      ).unwrap();

      // Handle Fees
      if (id) {
        const feePromises = newFees
          .filter((fee) => fee.checked)
          .map((fee) => ({
            property_id: id.toString(),
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
          toast.success("Property and all fees updated successfully!");
        } else {
          toast.warning(
            `Property updated, but ${failedFees} fee(s) failed to add.`
          );
        }
      } else {
        toast.error(
          "Property updated but couldn't add fees - missing property ID."
        );
      }

      // Reset form and navigate
      resetEditForm();
      dispatch(resetPropertyState());
      navigate("/properties");
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error.message || "Failed to update property or its fees.");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // Navigation logic
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
        if (isLandProperty2) {
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
        if (isLandProperty2) {
          // Land Sizes & Pricing step
          if (LandPlan.current) {
            LandPlan.current.handleSubmit();
            canProceed = LandPlan.current.isValid;
          }
        } else {
          // Media step for non-land properties
          if (mediaRef.current) {
            mediaRef.current.handleSubmit();
            canProceed = mediaRef.current.isValid;
          }
        }
        break;
      case 4:
        if (isLandProperty2) {
          // Media step for land properties
          if (mediaRef.current) {
            mediaRef.current.handleSubmit();
            canProceed = mediaRef.current.isValid;
          }
        } else {
          // Features step for non-land properties
          if (featuresRef.current) {
            featuresRef.current.handleSubmit();
            canProceed = featuresRef.current.isValid;
          }
        }
        break;
      case 5:
        if (isLandProperty2) {
          // Features step for land properties
          if (featuresRef.current) {
            featuresRef.current.handleSubmit();
            canProceed = featuresRef.current.isValid;
          }
        } else {
          // Payment/Discount step for non-land properties
          if (discountEnabled) {
            if (discountRef.current) {
              discountRef.current.handleSubmit();
              canProceed = discountRef.current.isValid;
            }
          }
          if (paymentStructureRef.current) {
            paymentStructureRef.current.handleSubmit();
            canProceed = paymentStructureRef.current.isValid && canProceed;
          }
        }
        break;
      case 6:
        if (isLandProperty2) {
          // Payment/Discount step for land properties
          if (discountEnabled) {
            if (discountRef.current) {
              discountRef.current.handleSubmit();
              canProceed = discountRef.current.isValid;
            }
          }
          if (paymentStructureRef.current) {
            paymentStructureRef.current.handleSubmit();
            canProceed = paymentStructureRef.current.isValid && canProceed;
          }
        } else {
          // Preview step for non-land properties
          if (canProceed) {
            setShowDraftPublishModal(true);
            return;
          }
        }
        break;
      case 7:
        // Preview step for land properties
        if (isLandProperty2 && canProceed) {
          setShowDraftPublishModal(true);
          return;
        }
        break;
    }

    if (canProceed && currentStep < totalSteps) {
      setEditCurrentStep(currentStep + 1);
    }
  };

  const handleDraftPublishSelect = async (option: "draft" | "publish") => {
    try {
      setIsEditSubmitting(true);
      setShowDraftPublishModal(false);
      setEditDisplayStatus(option);
      await submitEditForm(option);
      setEditCurrentStep(1);
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to update property. Please try again.");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isSubmitting) {
      setEditCurrentStep(currentStep - 1);
    } else if (currentStep === 1) {
      navigate("/properties");
    }
  };

  const handlePublishToggle = async () => {
    if (!id) {
      toast.error("Property ID not found");
      return;
    }
    try {
      await dispatch(publishDraft(parseInt(id))).unwrap();
      toast.success(
        `Property ${
          data?.properties?.is_active === 1 ? "drafted" : "published"
        } successfully!`
      );
      dispatch(fetchPropertyData({ id: parseInt(id) }));
    } catch (error: any) {
      toast.error(error.message || "Failed to update property status");
    }
  };

  // Image handling
  //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setEditImagePreview(reader.result as string);
  //         setNewDisplayImage(file);
  //         addEditMediaImage(file);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   const handleGalleryImageChange =
  //     (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
  //       const file = e.target.files?.[0];
  //       if (file) {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           const newPreviews = [...galleryPreviews];
  //           newPreviews[index] = reader.result as string;
  //           setGalleryPreviews(newPreviews);

  //           const newImages = [...newGalleryImages];
  //           newImages[index] = file;
  //           setNewGalleryImages(newImages);

  //           // Update Redux media state
  //           const updatedImages = [...media.images];
  //           if (updatedImages.length > index) {
  //             updatedImages[index] = file;
  //           } else {
  //             updatedImages.push(file);
  //           }
  //           setEditMedia({ ...media, images: updatedImages });
  //         };
  //         reader.readAsDataURL(file);
  //       }
  //     };

  const triggerFileInput = () => fileInputRef.current?.click();
  const triggerGalleryFileInput = (index: number) =>
    galleryInputRefs.current[index]?.click();

  const nextButtonText =
    currentStep === totalSteps ? "Confirm & Update" : "Next";

  if (loading && !isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <LoadingAnimations loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!isLoaded) {
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
                  resetEditForm();
                  navigate("/properties");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="w-full lg:flex justify-center hidden">
            <StepIndicator
              setCurrentStep={setEditCurrentStep}
              currentStep={currentStep}
            />
          </div>

          <DraftPublishModal
            isOpen={showDraftPublishModal}
            onClose={() => setShowDraftPublishModal(false)}
            onSelect={handleDraftPublishSelect}
            isSubmitting={isSubmitting}
          />

          {isLandProperty2 && (
            <InfrastructureFeesModal
              isOpen={showInfrastructureModal}
              onClose={() => setShowInfrastructureModal(false)}
            />
          )}

          {currentStep === 1 && (
            <div className="bg-white rounded-lg p-6">
              {isBulk ? (
                <></>
              ) : // <BulkBasicDetails
              //   ref={bulkBasicDetailsRef}
              //   setBulkDetails={setEditBulkDetails}
              //   initialData={bulkDetails}
              // />
              isLandProperty2 ? (
                <BasicDetailsLand
                  ref={basicDetailsRef}
                  setBasicDetails={setEditBasicDetails}
                  setIsLandProperty={setIsEditLandProperty}
                  setIsLandProperty2={setIsEditLandProperty2}
                  initialData={basicDetails}
                  isEditMode={true}
                  previousPropType={previousPropType}
                  directorName={director_name}
                />
              ) : (
                <BasicDetails
                  ref={basicDetailsRef}
                  setBasicDetails={setEditBasicDetails}
                  setIsLandProperty={setIsEditLandProperty}
                  setIsLandProperty2={setIsEditLandProperty2}
                  //   setSales={setEditSales}
                  initialData={basicDetails}
                  isEditMode={true}
                  previousPropType={previousPropType}
                />
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-lg p-6">
              {isLandProperty2 ? (
                <LandForm
                  ref={landRef}
                  setLandForm={setEditLandForm}
                  setDirectorName={setEditDirectorName}
                  setPreviousPropType={setEditPreviousPropType}
                  initialData={landForm}
                  isEditMode={true}
                  directorName={director_name}
                />
              ) : (
                <PropertySpecifications
                  ref={specificationsRef}
                  setSpecifications={setEditSpecifications}
                  setDirectorName={setEditDirectorName}
                  setPreviousPropType={setEditPreviousPropType}
                  initialData={specifications}
                  //   sales={sales}
                  isEditMode={true}
                  directorName={director_name}
                  previousPropType={previousPropType}
                />
              )}
            </div>
          )}

          {/* Step 3: Land Sizes & Pricing (only for land properties) */}
          {currentStep === 3 && isLandProperty2 && (
            <ForProperties
              tab={stepTitles[2]}
              children={
                <PropertyListingPage
                  ref={LandPlan}
                  setLandSizeSections={setEditLandSizeSections}
                  initialData={LandSizeSection}
                  isEditMode={true}
                />
              }
            />
          )}

          {/* Step 3 for non-land OR Step 4 for land: Media */}
          {((!isLandProperty2 && currentStep === 3) ||
            (isLandProperty2 && currentStep === 4)) && (
            <div className="bg-white rounded-lg p-6">
              <MediaFORM
                ref={mediaRef}
                imagePreview={imagePreview}
                setImagePreview={setEditImagePreview}
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
                setMedia={setEditMedia}
                initialData={media}
                isEditMode={true}
              />
            </div>
          )}

          {/* Step 4 for non-land OR Step 5 for land: Features */}
          {((!isLandProperty2 && currentStep === 4) ||
            (isLandProperty2 && currentStep === 5)) && (
            <div className="bg-white rounded-lg p-6">
              <FeaturesInput
                ref={featuresRef}
                setFeatures={setEditFeatures}
                initialData={features}
                isEditMode={true}
              />
            </div>
          )}

          {/* Step 5 for non-land OR Step 6 for land: Payment Structure & Discount */}
          {((!isLandProperty2 && currentStep === 5) ||
            (isLandProperty2 && currentStep === 6)) && (
            <div className="bg-white rounded-lg p-6 space-y-[30px]">
              <Payment_Structure
                ref={paymentStructureRef}
                setPaymentStructure={setEditPaymentStructure}
                initialData={paymentStructure}
                isLandProperty={isLandProperty2}
                isEditMode={true}
                onOpenInfrastructureModal={() =>
                  setShowInfrastructureModal(true)
                }
              />
              {discountEnabled ? (
                <div className="relative">
                  <p
                    className="absolute right-1/2 -top-16 cursor-pointer"
                    onClick={() => !isSubmitting && setDiscounted(false)}
                  >
                    <TbXboxX className="w-10 h-10 text-red-500" />
                  </p>
                  <div className="mt-24">
                    <Discount
                      ref={discountRef}
                      setDiscount={setEditDiscount}
                      initialData={discount}
                      isEditMode={true}
                      requireValidation={discountEnabled}
                    />
                  </div>
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
              {isLandProperty2 && (
                <p
                  className={`text-dark font-bold text-sm text-center cursor-pointer ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    !isSubmitting && setShowInfrastructureModal(true)
                  }
                >
                  Manage Infrastructure Fees
                </p>
              )}
            </div>
          )}

          {/* Step 6 for non-land OR Step 7 for land: Preview */}
          {((!isLandProperty2 && currentStep === 6) ||
            (isLandProperty2 && currentStep === 7)) && (
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

          <div className="grid grid-cols-2 w-full mt-20">
            <div className="w-full justify-start flex">
              <div>
                {currentStep > 1 && currentStep < totalSteps + 1 && (
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
                {currentStep < totalSteps + 1 && (
                  <button
                    className={`bg-[#79B833] text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-[40%] py-3 px-6 md:px-10 hover:bg-[#6aa22c] transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4 whitespace-nowrap ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
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
