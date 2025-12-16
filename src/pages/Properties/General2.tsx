import React, { useRef, useState } from "react";
import StepIndicator from "../../general/StepIndicator";
import ForProperties from "../../components/Tables/forProperties";
import BulkBasicDetails from "./BasicDetails/BulkBasicDetails";
import Header from "../../general/Header";
import PropertySpecifications from "./BasicDetails/PropertySpecifications/PropertySpecifications";
import Payment_Structure from "./Payment_Structure/Payment_Structure";
import Discount from "./Payment_Structure/Discount";
import { useCreatePropertyForm } from "../../components/Redux/hooks/usePropertyForms";
// import MediaFORM from "./Media/Media";
// import PropertyListing from "./edithFinal/EdithFnal";
import FeaturesInput from "./Features/Features";
import LandForm from "./BasicDetails/PropertySpecifications/land";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import DraftPublishModal from "./DraftPublishModal";
import BasicDetails from "./BasicDetails/BasicDetails";
import BasicDetailsLand from "./BasicDetails/BasicDetailsLand";
import { toast } from "react-toastify";
import PropertyListingPage from "./addPropplan/planForm";
// import { createProperty } from "../../components/Redux/addProperty/addProperty_thunk";
import { add_property_detail } from "../../components/Redux/addProperty/addFees/addFees_thunk";
import {
  createProperty,
  resetPropertyState,
} from "../../components/Redux/addProperty/addProperty_slice";
import {
  setCreateDirectorName,
  setCreatePreviousPropType,
  setCreateSales,
} from "../../components/Redux/propertyForm/createPropertySlice";
import MediaFORM from "./Media/MediaFORM2";
import { TbXboxX } from "react-icons/tb";
import PropertyListing from "./edithFinal/Edithfinal2";
import InfrastructureFeesModalss from "../../components/Modals/infrastureModal2";
import { useNavigate } from "react-router-dom";

export default function General() {
  // Use Redux hook for create form
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
    setCreateCurrentStep,
    setIsCreateSubmitting,
    setCreateDisplayStatus,
    resetCreateForm,
    setCreateBasicDetails,
    setCreateBulkDetails,
    setCreateSpecifications,
    setCreateLandForm,
    setCreateLandSizeSections,
    setCreateFeatures,
    setCreateMedia,
    setCreateDiscount,
    setCreatePaymentStructure,
    setCreateFees,
    setCreateNewFees,
    setCreateImagePreview,
    setIsCreateLandProperty,
    setIsCreateLandProperty2,
    setIsCreateBulk,
  } = useCreatePropertyForm();

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success, propertyId } = useSelector(
    (state: RootState) => state.addproperty
  );

  const [discountEnabled, setDiscount] = useState(false);
  const [showDraftPublishModal, setShowDraftPublishModal] = useState(false);
  const [showInfrastructureModal, setShowInfrastructureModal] = useState(false);
  // Create refs for all form components
  const basicDetailsRef = useRef<any>(null);
  const bulkBasicDetailsRef = useRef<any>(null);
  const specificationsRef = useRef<any>(null);
  const mediaRef = useRef<any>(null);
  const featuresRef = useRef<any>(null);
  const paymentStructureRef = useRef<any>(null);
  const discountRef = useRef<any>(null);
  const land = useRef<any>(null);
  const LandPlan = useRef<any>(null);

  // Extract values from metadata
  const {
    currentStep,
    isLandProperty,
    isBulk,
    isSubmitting,
    fees,
    newFees,
    imagePreview,
  } = metadata;

  const stepTitles = isLandProperty
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

  const totalSteps = isLandProperty ? 7 : 6;
  const nextButtonText =
    currentStep === totalSteps ? "Confirm & Update" : "Next";
    const navigate=useNavigate();
  // Custom submit function for create flow
  const submitCreateForm = async (displayStatus: "draft" | "publish") => {
    try {
      setIsCreateSubmitting(true);

      const formPayload = new FormData();

      /* =========================
       BASIC / BULK DETAILS
    ========================== */
      if (isBulk) {
        if (bulkDetails.propertyName)
          formPayload.append("name", bulkDetails.propertyName);

        if (bulkDetails.propertyType)
          formPayload.append("type", bulkDetails.propertyType);

        if (bulkDetails.propertyUnits)
          formPayload.append("no_of_unit", bulkDetails.propertyUnits || "1");

        if (bulkDetails.price) formPayload.append("price", bulkDetails.price);

        if (bulkDetails.address)
          formPayload.append("street_address", bulkDetails.address);

        if (bulkDetails.city)
          formPayload.append("city", bulkDetails.city || "");

        if (bulkDetails.country)
          formPayload.append("country", bulkDetails.country);

        if (bulkDetails.state) formPayload.append("state", bulkDetails.state);

        if (bulkDetails.lga) formPayload.append("lga", bulkDetails.lga);

        formPayload.append("category", "bulk");

        if (bulkDetails.initialDeposit)
          formPayload.append(
            "initial_deposit",
            bulkDetails.initialDeposit || "0"
          );
      } else {
        if (basicDetails.propertyName)
          formPayload.append("name", basicDetails.propertyName);

        if (basicDetails.propertyType)
          formPayload.append("type", basicDetails.propertyType);

        if (basicDetails.price) formPayload.append("price", basicDetails.price);

        if (basicDetails.initialDeposit)
          formPayload.append(
            "initial_deposit",
            basicDetails.initialDeposit || "0"
          );

        if (basicDetails.country)
          formPayload.append("country", basicDetails.country);

        if (basicDetails.state) formPayload.append("state", basicDetails.state);

        if (basicDetails.lga) formPayload.append("lga", basicDetails.lga);

        if (basicDetails.address)
          formPayload.append("street_address", basicDetails.address);

        if (basicDetails.locationType)
          formPayload.append("location_type", basicDetails.locationType || "");

        if (basicDetails.category_id && !isLandProperty)
          formPayload.append("category_id", basicDetails.category_id);

        if (Array.isArray(basicDetails.purpose)) {
          basicDetails.purpose.forEach((p, i) =>
            formPayload.append(`purpose[${i}]`, p)
          );
        }

        formPayload.append("category", isLandProperty ? "estate" : "house");
      }

      /* =========================
       LAND SIZE SECTION
    ========================== */
      if (isLandProperty && LandSizeSection?.length) {
        LandSizeSection.forEach((ls, i) => {
          formPayload.append(`land_sizes[${i}][id]`, String(ls.id));
          formPayload.append(`land_sizes[${i}][size]`, String(ls.size));

          ls.durations?.forEach((d, j) => {
            formPayload.append(
              `land_sizes[${i}][durations][${j}][id]`,
              String(d.id)
            );
            formPayload.append(
              `land_sizes[${i}][durations][${j}][duration]`,
              String(d.duration)
            );
            formPayload.append(
              `land_sizes[${i}][durations][${j}][price]`,
              String(d.price)
            );
            formPayload.append(
              `land_sizes[${i}][durations][${j}][citta_id]`,
              String(d.citta_id)
            );
          });
        });
      }

      /* =========================
       LAND / HOUSE DETAILS
    ========================== */
      if (isLandProperty) {
        if (landForm.landSize) formPayload.append("size", landForm.landSize);

        if (landForm.plotShape)
          formPayload.append("shape", landForm.plotShape || "");

        if (landForm.topography)
          formPayload.append("topography", landForm.topography || "");

        if (landForm.nearbyLandmarks?.length)
          formPayload.append(
            "nearby_landmarks",
            landForm.nearbyLandmarks.join(", ")
          );

        if (landForm.roadAccess?.length)
          formPayload.append("road_access", landForm.roadAccess.join(", "));

        if (landForm.titleDocumentType?.length)
          formPayload.append(
            "title_document_type",
            landForm.titleDocumentType.join(", ")
          );

        if (landForm.description)
          formPayload.append("description", landForm.description);

        if (landForm.unitsAvailable) {
          const units = parseInt(landForm.unitsAvailable) || 0;
          formPayload.append("number_of_unit", units.toString());
        }

        if (landForm.director_id)
          formPayload.append("director_id", landForm.director_id || "1");

        if (landForm.fencing)
          formPayload.append("fencing", landForm.fencing || "");

        if (landForm.gatedEstate)
          formPayload.append("gated_estate", landForm.gatedEstate || "");

        if (landForm.contactNumber)
          formPayload.append("contact_number", landForm.contactNumber || "");

        if (landForm.whatsAppLink)
          formPayload.append("whatsapp_link", landForm.whatsAppLink || "");

        if (landForm.documents)
          formPayload.append("property_agreement", landForm.documents);
      } else {
        if (specifications.bedrooms)
          formPayload.append("no_of_bedroom", specifications.bedrooms || "0");

        if (specifications.bathrooms)
          formPayload.append(
            "number_of_bathroom",
            specifications.bathrooms || "0"
          );

        if (specifications.toilets)
          formPayload.append("toilets", specifications.toilets || "0");

        if (specifications.landSize)
          formPayload.append("size", specifications.landSize);

        if (specifications.parkingSpaces)
          formPayload.append(
            "parking_space",
            specifications.parkingSpaces || "0"
          );

        if (specifications.description)
          formPayload.append("description", specifications.description);

        if (specifications.yearBuilt)
          formPayload.append("year_built", specifications.yearBuilt || "");

        if (specifications.unitsAvailable) {
          const units = parseInt(specifications.unitsAvailable) || 0;
          formPayload.append("number_of_unit", units.toString());
        }

        if (specifications.director_id)
          formPayload.append("director_id", specifications.director_id || "1");

        if (specifications.nearbyLandmarks?.length)
          formPayload.append(
            "nearby_landmarks",
            specifications.nearbyLandmarks.join(", ")
          );

        if (specifications.rentDuration)
          formPayload.append(
            "rent_duration",
            specifications.rentDuration || ""
          );

        if (specifications.buildingCondition)
          formPayload.append(
            "building_condition",
            specifications.buildingCondition || ""
          );

        if (specifications.whatsAppLink)
          formPayload.append(
            "whatsapp_link",
            specifications.whatsAppLink || ""
          );

        if (specifications.contactNumber)
          formPayload.append(
            "contact_number",
            specifications.contactNumber || ""
          );

        if (specifications.documents)
          formPayload.append("property_agreement", specifications.documents);

        if (specifications.titleDocumentTypeProp?.length)
          formPayload.append(
            "title_document_type",
            specifications.titleDocumentTypeProp.join(", ")
          );
      }

      /* =========================
       FEATURES
    ========================== */
      if (Array.isArray(features.features)) {
        features.features.forEach((f, i) =>
          formPayload.append(`features[${i}]`, f)
        );
      }

      /* =========================
       MEDIA
    ========================== */
      if (Array.isArray(media.images)) {
        media.images.forEach((img, i) => {
          if (img instanceof File) {
            formPayload.append(`photos[${i}]`, img);
            if (i === 0) formPayload.append("display_image", img);
          }
        });
      }

      if (media.tourLink) formPayload.append("virtual_tour", media.tourLink);

      if (media.videoLink) formPayload.append("video_link", media.videoLink);

      if (media.mapUrl) formPayload.append("property_map", media.mapUrl);

      /* =========================
       PAYMENT
    ========================== */
      if (paymentStructure.paymentType)
        formPayload.append("payment_type", paymentStructure.paymentType);

      if (paymentStructure.paymentDuration)
        formPayload.append(
          "property_duration_limit",
          paymentStructure.paymentDuration
        );

      paymentStructure.paymentSchedule?.forEach((s, i) =>
        formPayload.append(`payment_schedule[${i}]`, s)
      );

      if (paymentStructure.feesCharges)
        formPayload.append("fees_charges", paymentStructure.feesCharges);

      /* =========================
       DISCOUNT
    ========================== */
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

      /* =========================
       STATUS
    ========================== */
      formPayload.append("is_active", displayStatus === "draft" ? "0" : "1");

      /* =========================
       CREATE PROPERTY
    ========================== */
      const result = await dispatch(
        createProperty({ credentials: formPayload })
      ).unwrap();

      const createdPropertyId = result?.data.property.id || 0;

      if (!createdPropertyId) {
        toast.error("Property created but missing ID");
        return;
      }

      /* =========================
       FEES
    ========================== */
      const feePromises = fees
        .filter((f) => f.checked)
        .map((fee) =>
          dispatch(
            add_property_detail({
              credentials: {
                property_id: createdPropertyId.toString(),
                name: fee.name,
                value: fee.amount.replace(/[^\d.]/g, ""),
                type: fee.type,
                purpose: fee.purpose,
              },
            })
          )
        );

      const feeResults = await Promise.allSettled(feePromises);
      const failed = feeResults.filter((r) => r.status === "rejected").length;

      failed === 0
        ? toast.success("All fees added successfully!")
        : toast.warning(`Property created but ${failed} fee(s) failed`);

      if (failed === 0) {
        toast.success("Property created successfully!");

        resetCreateForm();
        dispatch(resetPropertyState());
        navigate("/properties");
      } else {
        toast.warning(`Property created but ${failed} fee(s) failed`);
      }

     
    } catch (error: any) {
      console.error("Create failed:", error);
      toast.error(error.message || "Failed to create property");
    } finally {
      setIsCreateSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (isSubmitting) return;

    let canProceed = true;

    // Validate current step before proceeding
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
          if (land.current) {
            land.current.handleSubmit();
            canProceed = land.current.isValid;
          }
        } else {
          if (specificationsRef.current) {
            specificationsRef.current.handleSubmit();
            canProceed = specificationsRef.current.isValid;
          }
        }
        break;
      case 3:
        if (isLandProperty) {
          if (LandPlan.current) {
            LandPlan.current.handleSubmit();
            canProceed = LandPlan.current.isValid;
          }
        } else {
          if (mediaRef.current) {
            mediaRef.current.handleSubmit();
            canProceed = mediaRef.current.isValid;
          }
        }
        break;
      case 4:
        if (isLandProperty) {
          if (mediaRef.current) {
            mediaRef.current.handleSubmit();
            canProceed = mediaRef.current.isValid;
          }
        } else {
          if (featuresRef.current) {
            featuresRef.current.handleSubmit();
            canProceed = featuresRef.current.isValid;
          }
        }

        break;
      case 5:
        if (isLandProperty) {
          if (featuresRef.current) {
            featuresRef.current.handleSubmit();
            canProceed = featuresRef.current.isValid;
          }
        } else {
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
        if (isLandProperty) {
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
          if (canProceed) {
            setShowDraftPublishModal(true);
            return;
          }
        }

        break;
      case 7:
        if (isLandProperty && canProceed) {
          setShowDraftPublishModal(true);
          return;
        }
        break;
    }

    if (canProceed && currentStep < totalSteps) {
      setCreateCurrentStep(currentStep + 1);
    }
  };

  const handleDraftPublishSelect = async (option: "draft" | "publish") => {
    try {
      setIsCreateSubmitting(true);
      setShowDraftPublishModal(false);
      setCreateDisplayStatus(option);
      await submitCreateForm(option);
      //   setCreateCurrentStep(1);
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit property. Please try again.");
    } finally {
      setIsCreateSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isSubmitting) {
      setCreateCurrentStep(currentStep - 1);
    }
  };

  //   const nextButtonText = currentStep === totalSteps ? "Submit" : "Next";

  return (
    <div className="w-full">
      <Header />
      <div className="w-full lg:pl-[38px] lg:pr-[64px] pr-[15px] pl-[15px]">
        {/* Draft/Publish Modal */}
        <DraftPublishModal
          isOpen={showDraftPublishModal}
          onClose={() => setShowDraftPublishModal(false)}
          onSelect={handleDraftPublishSelect}
          isSubmitting={isSubmitting}
        />
        {isLandProperty && (
          <InfrastructureFeesModalss
            isOpen={showInfrastructureModal}
            onClose={() => setShowInfrastructureModal(false)}
          />
        )}
        {/* )} */}
        {currentStep === 7 ? (
          <>
            <p className="text-dark text-2xl font-[350] mb-[8px]">
              Confirm Property Details
            </p>
            <h1 className="text-[#767676] font-[325] text-base mb-[30px]">
              Confirm everything is in order before proceeding
            </h1>
          </>
        ) : (
          <>
            <div className="w-full lg:flex justify-center hidden">
              <StepIndicator
                setCurrentStep={setCreateCurrentStep}
                currentStep={currentStep}
              />
            </div>
          </>
        )}

        {currentStep === 1 && (
          <div className="bg-white rounded-lg p-6">
            {isLandProperty ? (
              <BasicDetailsLand
                ref={basicDetailsRef}
                setBasicDetails={setCreateBasicDetails}
                setIsLandProperty={setIsCreateLandProperty}
                setIsLandProperty2={setIsCreateLandProperty2}
                initialData={basicDetails}
              />
            ) : (
              <BasicDetails
                ref={basicDetailsRef}
                setBasicDetails={setCreateBasicDetails}
                setIsLandProperty={setIsCreateLandProperty}
                setIsLandProperty2={setIsCreateLandProperty2}
                setSales={setCreateSales}
                initialData={basicDetails}
              />
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-lg p-6">
            {isLandProperty ? (
              <LandForm
                ref={land}
                setLandForm={setCreateLandForm}
                setDirectorName={setCreateDirectorName}
                setPreviousPropType={setCreatePreviousPropType}
                initialData={landForm}
              />
            ) : (
              <PropertySpecifications
                ref={specificationsRef}
                setSpecifications={setCreateSpecifications}
                setDirectorName={setCreateDirectorName}
                setPreviousPropType={setCreatePreviousPropType}
                initialData={specifications}
                // sales={sales}
              />
            )}
          </div>
        )}

        {/* Step 3: Land Sizes & Pricing (only for land properties) */}
        {currentStep === 3 && isLandProperty && (
          <ForProperties
            tab={stepTitles[2]}
            children={
              <PropertyListingPage
                ref={LandPlan}
                setLandSizeSections={setCreateLandSizeSections}
                initialData={LandSizeSection}
              />
            }
          />
        )}

        {/* Step 3 for non-land OR Step 4 for land: Media */}
        {((!isLandProperty && currentStep === 3) ||
          (isLandProperty && currentStep === 4)) && (
          <ForProperties
            tab={stepTitles[isLandProperty ? 3 : 2]}
            children={
              <MediaFORM
                ref={mediaRef}
                setMedia={setCreateMedia}
                initialData={media}
              />
            }
          />
        )}

        {/* Step 4 for non-land OR Step 5 for land: Features */}
        {((!isLandProperty && currentStep === 4) ||
          (isLandProperty && currentStep === 5)) && (
          <ForProperties
            tab={stepTitles[isLandProperty ? 4 : 3]}
            children={
              <FeaturesInput
                ref={featuresRef}
                setFeatures={setCreateFeatures}
                initialData={features}
              />
            }
          />
        )}

        {/* Step 5 for non-land OR Step 6 for land: Payment Structure & Discount */}
        {((!isLandProperty && currentStep === 5) ||
          (isLandProperty && currentStep === 6)) && (
          <div className="space-y-[30px]">
            <ForProperties
              tab={stepTitles[isLandProperty ? 5 : 4]}
              children={
                <Payment_Structure
                  ref={paymentStructureRef}
                  setPaymentStructure={setCreatePaymentStructure}
                  initialData={paymentStructure}
                  isLandProperty={isLandProperty}
                  onOpenInfrastructureModal={() =>
                    setShowInfrastructureModal(true)
                  }
                />
              }
            />
            {discountEnabled ? (
              <div className="relative">
                <p
                  className="absolute top-5 right-5 cursor-pointer"
                  onClick={() => !isSubmitting && setDiscount(false)}
                >
                  <TbXboxX className="w-6 h-6 text-red-500" />
                </p>
                <ForProperties
                  tab="Discount"
                  children={
                    <Discount
                      ref={discountRef}
                      setDiscount={setCreateDiscount}
                      initialData={discount}
                      requireValidation={discountEnabled}
                    />
                  }
                />
              </div>
            ) : (
              <p
                className={`text-dark font-bold text-sm text-center cursor-pointer ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => !isSubmitting && setDiscount(true)}
              >
                Add Discount
              </p>
            )}
            {isLandProperty && (
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
        {((!isLandProperty && currentStep === 6) ||
          (isLandProperty && currentStep === 7)) && <PropertyListing />}

        <div className="grid grid-cols-2 mb-[69px] w-full mt-20">
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
    </div>
  );
}
