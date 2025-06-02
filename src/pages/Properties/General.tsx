import React, { useContext, useRef, useState } from "react";
import StepIndicator from "../../general/StepIndicator";
import ForProperties from "../../components/Tables/forProperties";
import BasicDetails from "./BasicDetails/BasicDetails";
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
import FinalSubmission from "./FinalSubmission";

export default function General() {
  const {
    currentStep,
    setCurrentStep,
    submitForm,
    formData,
    isLandProperty,
    isBulk,
  } = useContext(PropertyContext)!;
  const [discount, setDiscount] = useState(false);

  // Create refs for all form components
  const basicDetailsRef = useRef<any>(null);
  const bulkBasicDetailsRef = useRef<any>(null);
  const specificationsRef = useRef<any>(null);
  const mediaRef = useRef<any>(null);
  const featuresRef = useRef<any>(null);
  const paymentStructureRef = useRef<any>(null);
  const discountRef = useRef<any>(null);
  const land = useRef<any>(null);

  const handleNext = async () => {
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
        // Preview step - no validation needed
        await submitForm();
        break;
      case 7:
        // Final submission
        await submitForm();
        return;
    }

    if (canProceed) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Please fill all required fields correctly");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [
    "Basic Details",
    "Property Specifications",
    "Media",
    "Features",
    discount ? "Discount":"Set Payment Structure",
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
        {currentStep === 6 || currentStep === 7 ? (
          <>
            <p className="text-dark text-2xl font-[350] mb-[8px]">
              {currentStep === 6
                ? "Confirm Property Details"
                : "Submission Complete"}
            </p>
            <h1 className="text-[#767676] font-[325] text-base mb-[30px]">
              {currentStep === 6
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

        {currentStep === 1 && (
          <ForProperties
            tab={stepTitles[0]}
            children={
              isBulk ? (
                <BulkBasicDetails ref={bulkBasicDetailsRef} />
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
            children={<MediaFORM ref={mediaRef} />}
          />
        )}

        {currentStep === 4 && (
          <ForProperties
            tab={stepTitles[3]}
            children={<FeaturesInput ref={featuresRef} />}
          />
        )}

        {currentStep === 5 && (
          <div className="space-y-[30px]">
            <ForProperties
              tab={stepTitles[4]}
              children={<Payment_Structure ref={paymentStructureRef} />}
            />
            {discount ? (
              <div className="relative">
                <p
                  className="absolute top-5 right-5 cursor-pointer"
                  onClick={() => setDiscount(false)}
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
                className="text-dark font-bold text-sm text-center cursor-pointer"
                onClick={() => setDiscount(true)}
              >
                Add Discount
              </p>
            )}
          </div>
        )}

        {currentStep === 6 && <PropertyListing />}
        {currentStep === 7 && <FinalSubmission />}

        <div className="grid grid-cols-2 mb-[69px] w-full mt-20">
          <div className="w-full justify-start flex">
            <div>
              {currentStep > 1 && currentStep < 7 && (
                <button
                  className="bg-[#272727] text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-[40%] py-3 px-6 md:px-10 hover:bg-[#272727] transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4"
                  onClick={handleBack}
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
                  className="bg-[#79B833] text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-[40%] py-3 px-6 md:px-10 hover:bg-[#6aa22c] transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4 whitespace-nowrap"
                  onClick={handleNext}
                >
                  {nextButtonText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
