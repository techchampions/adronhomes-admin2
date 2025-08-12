// import React, { useContext, useEffect, useRef, useState } from "react";
// import StepIndicator from "../../general/StepIndicator";
// import ForProperties from "../../components/Tables/forProperties";
// import BulkBasicDetails from "./BasicDetails/BulkBasicDetails";
// import Header from "../../general/Header";
// import PropertySpecifications from "./BasicDetails/PropertySpecifications/PropertySpecifications";
// import Payment_Structure from "./Payment_Structure/Payment_Structure";
// import Discount from "./Payment_Structure/Discount";
// import { PropertyContext } from "../../MyContext/MyContext";
// import MediaFORM from "./Media/Media";
// import PropertyListing from "./edithFinal/EdithFnal";
// import FeaturesInput from "./Features/Features";
// import LandForm from "./BasicDetails/PropertySpecifications/land";
// import FinalSubmission from "./FinalSubmission";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../components/Redux/store";
// import DraftPublishModal from "./DraftPublishModal";
// import BasicDetails from "./BasicDetails/BasicDetails";
// import BasicDetailsLand from "./BasicDetails/BasicDetailsLand";
// import { useParams } from "react-router-dom";
// import { fetchPropertyData } from "../../components/Redux/Properties/propertiesDetails/propertiesDetails_thunk";
// import { clearPropertyData } from "../../components/Redux/Properties/propertiesDetails/propetiesDetailsSlice";

// export default function GeneralEdeting() {
//   const {
//     currentStep,
//     setCurrentStep,
//     submitForm,
//     formData,
//     isLandProperty,
//     isBulk,
//     isSubmitting,
//     setIsSubmitting,
//     setPaymentStructure,
//     setDisplayStatus,
//     setBasicDetails,
//     setBulkDetails,
//     setSpecifications,
//     setLandForm,
//     setFeatures,
//     setMedia,
//     setDiscount,
//     setIsLandProperty,
//     setIsBulk,
//     setFees,
//     isEditing,
//     setIsEditing,
//     editingPropertyId,
//     setEditingPropertyId,
//   } = useContext(PropertyContext)!;
//   const [showDiscount, setShowDiscount] = useState(false);
//   const dispatch = useDispatch < AppDispatch > ();
//   const { loading, success, error } = useSelector(
//     (state: RootState) => state.addproperty
//   );
//   const propertyState = useSelector((state: RootState) => state.propertyDetails);
//   const [showDraftPublishModal, setShowDraftPublishModal] = useState(false);
//   const { id } = useParams < { id?: string } > ();

//   // Create refs for all form components
//   const basicDetailsRef = useRef < any > (null);
//   const bulkBasicDetailsRef = useRef < any > (null);
//   const specificationsRef = useRef < any > (null);
//   const mediaRef = useRef < any > (null);
//   const featuresRef = useRef < any > (null);
//   const paymentStructureRef = useRef < any > (null);
//   const discountRef = useRef < any > (null);
//   const landRef = useRef < any > (null);

//   useEffect(() => {
//     if (id) {
//       setIsEditing(true);
//       setEditingPropertyId(parseInt(id));
//       dispatch(fetchPropertyData({ id: parseInt(id) }));
//     }
//   }, [id, dispatch, setIsEditing, setEditingPropertyId]);

//   useEffect(() => {
//     if (propertyState.data && isEditing) {
//       const property = propertyState.data.properties[0];
//       const isLand = property.type.name === "Land";
//       const isBulkProp = property.category === "bulk";

//       setIsLandProperty(isLand);
//       setIsBulk(isBulkProp);
//       setShowDiscount(!!property.is_discount);

//       setBasicDetails({
//         propertyName: property.name,
//         propertyType: property.type,
//         price: property.price,
//         initialDeposit: property.initial_deposit,
//         address: property.street_address,
//         // FIX: Ensure locationType is passed correctly
//         locationType: property.location_type || "",
//         purpose: property.purpose || [],
//         country: property.country,
//         state: property.state,
//         lga: property.lga,
//       });

//       if (isBulkProp) {
//         setBulkDetails({
//           propertyName: property.name,
//           propertyType: property.type,
//           propertyUnits: property.number_of_unit,
//           price: property.price,
//           address: property.street_address,
//           city: property.lga || "",
//           state: property.state,
//           initialDeposit: property.initial_deposit,
//           country: property.country,
//           lga: property.lga,
//         });
//       }

//       if (isLand) {
//         setLandForm({
//           plotShape: property.shape || "",
//           topography: property.topography || "",
//           propertySize: property.size,
//           landSize: property.size,
//           roadAccess: property.road_access ?
//             property.road_access.split(", ") : [],
//           unitsAvailable: property.unit_available,
//           description: property.description,
//           overview: property.overview,
//           documents: property.property_agreement,
//           director_id: property.director_id || "",
//           titleDocumentType: property.title_document_type ?
//             property.title_document_type.split(", ") : [],
//           fencing: property.fencing || "",
//           gatedEstate: property.gated_estate || "",
//           contactNumber: property.contact_number || "",
//           whatsAppLink: property.whatsapp_link || "",
//           nearbyLandmarks: property.nearby_landmarks ?
//             property.nearby_landmarks.split(", ") : [],
//         });
//       } else {
//         setSpecifications({
//           bedrooms: property.no_of_bedroom,
//           bathrooms: property.number_of_bathroom,
//           propertySize: property.size,
//           landSize: property.size,
//           parkingSpaces: property.parking_space,
//           yearBuilt: property.year_built || "",
//           unitsAvailable: property.unit_available,
//           description: property.description,
//           overview: property.overview,
//           documents: property.property_agreement,
//           nearbyLandmarks: property.nearby_landmarks ?
//             property.nearby_landmarks.split(", ") : [],
//           rentDuration: property.rent_duration || "",
//           buildingCondition: property.building_condition || "",
//           whatsAppLink: property.whatsapp_link || "",
//           contactNumber: property.contact_number || "",
//           toilets: property.toilets,
//           titleDocumentTypeProp: property.title_document_type ?
//             property.title_document_type.split(", ") : [],
//           director_id: property.director_id || "",
//         });
//       }

//       setFeatures({
//         features: property.features,
//       });

//       // FIX: Correctly parse the images and handle the display image
//       const displayImage = property.photos.length > 0 ? property.photos[0] : null;
//       const galleryImages = property.photos.slice(1);

//       setMedia({
//         tourLink: property.virtual_tour || "",
//         videoLink: property.video_link || "",
//         images: [], // This is for new images, existing are handled below
//         videoFile: [],
//         existingImages: property.photos, // This prop should be renamed to galleryImages in the MediaFORM component
//         existingVideoFile: property.video_file || null,
//         displayImage: displayImage, // The single display image
//         galleryImages: galleryImages, // The rest of the images
//       });

//       setDiscount({
//         discountName: property.discount_name || "",
//         discountType: "percentage",
//         discountOff: property.discount_percentage,
//         unitsRequired: property.discount_units,
//         validFrom: property.discount_start_date || "",
//         validTo: property.discount_end_date || "",
//       });

//       setPaymentStructure({
//         paymentType: property.payment_type,
//         paymentDuration: property.property_duration_limit,
//         paymentSchedule: property.payment_schedule,
//         feesCharges: property.fees_charges || "",
//       });

//       setDisplayStatus(property.is_active === 1 ? "publish" : "draft");

//       setFees(
//         property.details.map((d: any) => ({
//           id: d.id,
//           name: d.name,
//           amount: d.value,
//           checked: true,
//           type: d.type,
//           purpose: d.purpose,
//         }))
//       );

//       dispatch(clearPropertyData());
//     }
//   }, [
//     propertyState.data,
//     isEditing,
//     dispatch,
//     setBasicDetails,
//     setBulkDetails,
//     setSpecifications,
//     setLandForm,
//     setFeatures,
//     setMedia,
//     setDiscount,
//     setPaymentStructure,
//     setDisplayStatus,
//     setIsLandProperty,
//     setIsBulk,
//     setFees,
//   ]);

//   const handleNext = async () => {
//     if (isSubmitting) return;

//     let canProceed = true;

//     // Validate current step before proceeding
//     switch (currentStep) {
//       case 1:
//         if (isBulk) {
//           if (bulkBasicDetailsRef.current) {
//             bulkBasicDetailsRef.current.handleSubmit();
//             canProceed = bulkBasicDetailsRef.current.isValid;
//           }
//         } else {
//           if (basicDetailsRef.current) {
//             basicDetailsRef.current.handleSubmit();
//             canProceed = basicDetailsRef.current.isValid;
//           }
//         }
//         break;
//       case 2:
//         if (isLandProperty) {
//           if (landRef.current) {
//             landRef.current.handleSubmit();
//             canProceed = landRef.current.isValid;
//           }
//         } else {
//           if (specificationsRef.current) {
//             specificationsRef.current.handleSubmit();
//             canProceed = specificationsRef.current.isValid;
//           }
//         }
//         break;
//       case 3:
//         if (mediaRef.current) {
//           mediaRef.current.handleSubmit();
//           canProceed = mediaRef.current.isValid;
//         }
//         break;
//       case 4:
//         if (featuresRef.current) {
//           featuresRef.current.handleSubmit();
//           canProceed = featuresRef.current.isValid;
//         }
//         break;
//       case 5:
//         if (paymentStructureRef.current) {
//           paymentStructureRef.current.handleSubmit();
//           canProceed = paymentStructureRef.current.isValid;
//         }
//         if (showDiscount && discountRef.current) {
//           discountRef.current.handleSubmit();
//           canProceed = discountRef.current.isValid && canProceed;
//         }
//         // Show modal instead of proceeding to next step
//         if (canProceed) {
//           setShowDraftPublishModal(true);
//           return; // Don't proceed to next step yet
//         }
//         break;
//       case 6:
//       case 7:
//         await submitForm();
//         return;
//     }

//     if (canProceed) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handleDraftPublishSelect = async (option: "draft" | "publish") => {
//     try {
//       setIsSubmitting(true);
//       setShowDraftPublishModal(false);
//       setDisplayStatus(option);

//       setCurrentStep(currentStep + 1);
//     } catch (error) {
//       console.error("Error handling selection:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1 && !isSubmitting) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const stepTitles = [
//     "Basic Details",
//     "Property Specifications",
//     "Media",
//     "Features",
//     "Payment Structure",
//     ...(showDiscount ? ["Discount"] : []),
//     "Preview",
//     "Complete",
//   ];

//   const nextButtonText =
//     currentStep === 7 ?
//     "Submit" :
//     currentStep === 6 ?
//     "Confirm & Submit" :
//     "Next";

//   return (
//     <div className="w-full">
//       <Header />
//       <div className="w-full lg:pl-[38px] lg:pr-[64px] pr-[15px] pl-[15px]">
//         {/* Draft/Publish Modal */}
//         <DraftPublishModal
//           isOpen={showDraftPublishModal}
//           onClose={() => setShowDraftPublishModal(false)}
//           onSelect={handleDraftPublishSelect}
//           isSubmitting={isSubmitting}
//         />

//         {currentStep === 6 || currentStep === 7 ? (
//           <>
//             <p className="text-dark text-2xl font-[350] mb-[8px]">
//               {currentStep === 6 ?
//                 "Confirm Property Details" :
//                 "Submission Complete"}
//             </p>
//             <h1 className="text-[#767676] font-[325] text-base mb-[30px]">
//               {currentStep === 6 ?
//                 "Confirm everything is in order before proceeding" :
//                 "Your property has been successfully submitted"}
//             </h1>
//           </>
//         ) : (
//           <>
//             <div className="w-full lg:flex justify-center hidden">
//               <StepIndicator
//                 setCurrentStep={setCurrentStep}
//                 currentStep={currentStep}
//               />
//             </div>
//           </>
//         )}

//         {currentStep === 1 && (
//           <ForProperties
//             tab={stepTitles[0]}
//             children={
//               isBulk ? (
//                 <BulkBasicDetails ref={bulkBasicDetailsRef} />
//               ) : isLandProperty ? (
//                 <BasicDetailsLand ref={basicDetailsRef} />
//               ) : (
//                 <BasicDetails ref={basicDetailsRef} />
//               )
//             }
//           />
//         )}

//         {currentStep === 2 && (
//           <ForProperties
//             tab={stepTitles[1]}
//             children={
//               isLandProperty ? (
//                 <LandForm ref={landRef} />
//               ) : (
//                 <PropertySpecifications ref={specificationsRef} />
//               )
//             }
//           />
//         )}

//         {currentStep === 3 && (
//           <ForProperties
//             tab={stepTitles[2]}
//             children={
//               <MediaFORM
//                 ref={mediaRef}
//                 existingVideoFile={formData.media.existingImages}
//                 existingImages={formData.media.galleryImages}
//                 displayImage={formData.media.existingImages[0]}
//               />
//             }
//           />
//         )}

//         {currentStep === 4 && (
//           <ForProperties
//             tab={stepTitles[3]}
//             children={<FeaturesInput ref={featuresRef} />}
//           />
//         )}

//         {currentStep === 5 && (
//           <div className="space-y-[30px]">
//             <ForProperties
//               tab={stepTitles[4]}
//               children={<Payment_Structure ref={paymentStructureRef} />}
//             />
//             {showDiscount ? (
//               <div className="relative">
//                 <p
//                   className="absolute top-5 right-5 cursor-pointer"
//                   onClick={() => {
//                     if (!isSubmitting) {
//                       setShowDiscount(false);
//                       setDiscount({
//                         discountName: "",
//                         discountType: "",
//                         discountOff: "",
//                         unitsRequired: "",
//                         validFrom: "",
//                         validTo: "",
//                       });
//                     }
//                   }}
//                 >
//                   x
//                 </p>
//                 <ForProperties
//                   tab={stepTitles[5]}
//                   children={<Discount ref={discountRef} />}
//                 />
//               </div>
//             ) : (
//               <p
//                 className={`text-dark font-bold text-sm text-center cursor-pointer ${
//                   isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 onClick={() => !isSubmitting && setShowDiscount(true)}
//               >
//                 Add Discount
//               </p>
//             )}
//           </div>
//         )}

//         {currentStep === 6 && <PropertyListing />}
//         {currentStep === 7 && <FinalSubmission />}

//         <div className="grid grid-cols-2 mb-[69px] w-full mt-20">
//           <div className="w-full justify-start flex">
//             <div>
//               {currentStep > 1 && currentStep < 7 && (
//                 <button
//                   className={`bg-[#272727] text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-[40%] py-3 px-6 md:px-10 hover:bg-[#272727] transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4 ${
//                     isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//                   onClick={handleBack}
//                   disabled={isSubmitting}
//                 >
//                   Back
//                 </button>
//               )}
//             </div>
//           </div>
//           <div className="w-full justify-end flex">
//             <div>
//               {currentStep < 7 && (
//                 <button
//                   className={`bg-[#79B833] text-white md:text-sm text-xs font-bold rounded-full w-full sm:w-[40%] py-3 px-6 md:px-10 hover:bg-[#6aa22c] transition-colors min-w-[140px] sm:min-w-[185px] h-[45px] flex justify-center items-center flex-1/4 whitespace-nowrap ${
//                     isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//                   onClick={handleNext}
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <div className="flex items-center">
//                       <svg
//                         className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Processing...
//                     </div>
//                   ) : (
//                     nextButtonText
//                   )}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }