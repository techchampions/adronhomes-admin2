import React, { useContext, useEffect, useRef, useState } from "react";
import StepIndicator from "../../general/StepIndicator";
import ForProperties from "../../components/Tables/forProperties";
import BulkBasicDetails from "./BasicDetails/BulkBasicDetails";
import Header from "../../general/Header";
import PropertySpecifications from "./BasicDetails/PropertySpecifications/PropertySpecifications";
import Payment_Structure from "./Payment_Structure/Payment_Structure";
import Discount from "./Payment_Structure/Discount";
import { PropertyContext } from "../../MyContext/MyContext";
import MediaFORM from "./Media/Media";
import PropertyListing from "./edithFinal/EdithFnal";
import FeaturesInput from "./Features/Features";
import LandForm from "./BasicDetails/PropertySpecifications/land";
// import FinalSubmission from "./FinalSubmission";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import DraftPublishModal from "./DraftPublishModal";
import BasicDetails from "./BasicDetails/BasicDetails";
import BasicDetailsLand from "./BasicDetails/BasicDetailsLand";
import { toast } from "react-toastify";
import PropertyListingPage from "./addPropplan/planForm";



export default function General() {
  const {
    currentStep,
    setCurrentStep,
    submitForm,
    formData,
    isLandProperty,
    isBulk,
    isSubmitting,
    setIsSubmitting,
    setPaymentStructure,
    setDisplayStatus
  } = useContext(PropertyContext)!;
  const [discount, setDiscount] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  // const { loading, success, error } = useSelector((state: RootState) => state.addproperty);
  const [showDraftPublishModal, setShowDraftPublishModal] = useState(false);
const { loading, error, success, propertyId } = useSelector(
  (state: RootState) => state.addproperty
);
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
        if (LandPlan.current) {
          LandPlan.current.handleSubmit();
          canProceed = LandPlan.current.isValid;
        }
        break;
   
      case 4:
        if (mediaRef.current) {
          mediaRef.current.handleSubmit();
          canProceed = mediaRef.current.isValid;
        }
        break;
      case 5:
        if (featuresRef.current) {
          featuresRef.current.handleSubmit();
          canProceed = featuresRef.current.isValid;
        }
        break;
      case 6:
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
      case 7:
        if (canProceed) {
          setShowDraftPublishModal(true);
          return;
        }
        break;
      // case 7:
      //   await submitForm();
        return;
    }

    if (canProceed) {
      setCurrentStep(currentStep + 1);
    }
  };

// General.tsx
const handleDraftPublishSelect = async (option: "draft" | "publish") => {
  try {
    setIsSubmitting(true);
    setShowDraftPublishModal(false);
    setDisplayStatus(option); // Set the display status

    // Call submitForm with the selected option directly
    await submitForm(option);
    setCurrentStep(1); // Move to the final step after successful submission
  } catch (error) {
    console.error("Submission failed:", error);
    toast.error("Failed to submit property. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleBack = () => {
    if (currentStep > 1 && !isSubmitting) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [
    "Basic Details",
    "Property Specifications",
    "Land Sizes & Pricing",
    "Media",
    "Features",
    discount ? "Discount" : "Set Payment Structure",
    "Payment Structure",
    "Preview",
    "Complete",
  ];

  const nextButtonText =
    currentStep === 7
      ? "Submit"
      : currentStep === 6
      ? "Confirm & Submit"
      : "Next";

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

        {currentStep === 7 || currentStep === 8 ? (
          <>
            <p className="text-dark text-2xl font-[350] mb-[8px]">
              {currentStep === 7
                ? "Confirm Property Details"
                : "Submission Complete"}
            </p>
            <h1 className="text-[#767676] font-[325] text-base mb-[30px]">
              {currentStep === 7
                ? "Confirm everything is in order before proceeding"
                : "Your property has been successfully submitted"}
            </h1>
          </>
        ) : (
          <>
            <div className="w-full lg:flex justify-center hidden">
              <StepIndicator
                setCurrentStep={setCurrentStep}
                currentStep={currentStep}
              />
            </div>
          </>
        )}
  {/* < /> */}
        {currentStep === 1 && (
          // <PropertyListingPage ref={LandPlan}
          // />
          <ForProperties
            tab={stepTitles[0]}
            children={
              isLandProperty ? (
                <BasicDetailsLand ref={basicDetailsRef} />
              ) : (
                <BasicDetails ref={basicDetailsRef} />
              )
            }
          />
        )}

        {currentStep === 2 && (
          <ForProperties
            tab={stepTitles[1]}
            children={
              isLandProperty ? (
                <LandForm ref={land} />
              ) : (
                <PropertySpecifications ref={specificationsRef} />
              )
            }
          />
        )}

    {currentStep === 3 && (
          <ForProperties
            tab={stepTitles[2]}
            children={<PropertyListingPage ref={LandPlan} />}
          />
        )}
        {currentStep === 4 && (
          <ForProperties
            tab={stepTitles[2]}
            children={<MediaFORM ref={mediaRef} />}
          />
        )}

        {currentStep === 5 && (
          <ForProperties
            tab={stepTitles[3]}
            children={<FeaturesInput ref={featuresRef} />}
          />
        )}

        {currentStep === 6 && (
          <div className="space-y-[30px]">
            <ForProperties
              tab={stepTitles[4]}
              children={<Payment_Structure ref={paymentStructureRef} />}
            />
            {discount ? (
              <div className="relative">
                <p
                  className="absolute top-5 right-5 cursor-pointer"
                  onClick={() => !isSubmitting && setDiscount(false)}
                >
                  x
                </p>
                <ForProperties
                  tab={stepTitles[4]}
                  children={<Discount ref={discountRef} />}
                />
              </div>
            ) : (
              <p
                className={`text-dark font-bold text-sm text-center cursor-pointer ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !isSubmitting && setDiscount(true)}
              >
                Add Discount
              </p>
            )}
          </div>
        )}

        {currentStep === 7 && <PropertyListing />}
        {/* {currentStep === 7 && <FinalSubmission />} */}

        <div className="grid grid-cols-2 mb-[69px] w-full mt-20">
          <div className="w-full justify-start flex">
            <div>
              {currentStep > 1 && currentStep < 8 && (
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
              {currentStep < 8 && (
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
    </div>
  );
}