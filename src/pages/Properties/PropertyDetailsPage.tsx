import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchPropertyData,
  Property,
} from "../../components/Redux/Properties/propertiesDetails/propertiesDetails_thunk";
import { clearPropertyData } from "../../components/Redux/Properties/propertiesDetails/propetiesDetailsSlice";
import { useAppDispatch, useAppSelector } from "../../components/Redux/hook";
import { publishDraft } from "../../components/Redux/Properties/publishPropertythunk";
import NotFound from "../../components/NotFound";
import LoadingAnimations from "../../components/LoadingAnimations";
import { resetPublishDraftState } from "../../components/Redux/Properties/publishpropertySlice";
import { EdithBackgroung } from "../../components/Tables/forProperties";
import { IoArrowBackSharp } from "react-icons/io5";
import { SafeDescriptionSection } from "./cleanup";
import { formatDate } from "../../utils/formatdate";
import { FaBed, FaBath, FaCar, FaRulerCombined, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa"; // Added icons for better UI
import { FaNairaSign } from "react-icons/fa6";
// import { FaNairaSign } from "react-icons/fa6";

const PropertyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(
    (state) => state.propertyDetails
  );
  const {
    loading: publishLoading,
    success: publishSuccess,
    error: publishError,
  } = useAppSelector((state) => state.publishDraft);

  const isLandProperty = data?.properties?.category === "estate";

  useEffect(() => {
    if (id) {
      const propertyId = parseInt(id);
      if (!isNaN(propertyId)) {
        dispatch(fetchPropertyData({ id: propertyId }));
      } else {
        toast.error("Invalid property ID");
        navigate("/properties");
      }
    }
    return () => {
      dispatch(clearPropertyData());
    };
  }, [id, dispatch, navigate]);

  useEffect(() => {
    if (publishSuccess) {
      dispatch(resetPublishDraftState());
      if (id) {
        dispatch(fetchPropertyData({ id: parseInt(id) }));
      }
    }
    if (publishError) {
      dispatch(resetPublishDraftState());
    }
  }, [dispatch, publishSuccess, publishError, id]);

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
    } catch (error: any) {
      toast.error(error.message || "Failed to update property status");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <LoadingAnimations loading={loading} />
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data?.properties) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <NotFound text="Property not found" />
      </div>
    );
  }

  const property = data.properties;

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      {/* <EdithBackgroung> */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#79B833] to-[#79B833]/20 text-white px-4 py-5 sm:px-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  
  {/* Left section */}
  <div className="flex items-center gap-3 w-full md:w-auto">
    <button
      onClick={handleGoBack}
      className="text-white hover:text-gray-200 text-xl sm:text-2xl"
    >
      <IoArrowBackSharp />
    </button>

    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
      {property.name}
    </h1>
  </div>

  {/* Right section */}
  <div className="flex flex-wrap gap-3 w-full md:w-auto md:justify-end">
    <button
      onClick={() => navigate(`/properties/Draftform/${property.id}`)}
      className="px-4 sm:px-6 py-2 bg-white text-[#79B833] font-semibold rounded-full hover:bg-gray-100 transition w-full sm:w-auto"
    >
      Duplicate Property
    </button>

    <button
      onClick={() => navigate(`/properties/property-edith/${property.id}`)}
      className="px-4 sm:px-6 py-2 bg-white text-[#79B833] font-semibold rounded-full hover:bg-gray-100 transition w-full sm:w-auto"
    >
      Edit Property
    </button>

    <button
      onClick={handlePublishToggle}
      disabled={publishLoading}
      className="px-4 sm:px-6 py-2 bg-[#79B833] text-white font-semibold rounded-full transition w-full sm:w-auto disabled:opacity-60"
    >
      {publishLoading
        ? "Processing..."
        : property.is_active === 1
        ? "Move to Draft"
        : "Publish Now"}
    </button>
  </div>
</div>


          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
            {/* Left Column: Images and Gallery */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <div className="relative h-80 rounded-xl overflow-hidden mb-6 shadow-md">
                <img
                  src={property.display_image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#79B833] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {property.category.charAt(0).toUpperCase() + property.category.slice(1)}
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
              </div>

              {/* Gallery */}
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.photos?.map((photo: string, index: number) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden shadow-sm hover:shadow-md transition">
                    <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Quick Facts */}
            <div className="lg:col-span-1 bg-gray-50 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Quick Facts</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaNairaSign className="text-[#79B833] text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold">₦{property.price?.toLocaleString() || "0"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaRulerCombined className="text-[#79B833] text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-semibold">{property.size}</p>
                  </div>
                </div>
                {/* <div className="p-6 border-t border-gray-200 bg-gray-50"> */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-14">Land Sizes & Pricing</h2>
            <div className="space-y-6">
              {property?.land_sizes?.map((ls, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold mb-2">{ls.size} SQM</h3>
                  <div className="space-y-2">
                    {ls.durations.map((ld, durIndex) => (
                      <div key={durIndex} className="flex justify-between text-gray-700">
                        <p>{ld.duration} Months</p>
                        <p className="font-semibold">₦{ld.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
                {!isLandProperty && (
                  <>
                    <div className="flex items-center space-x-3">
                      <FaBed className="text-[#79B833] text-xl" />
                      <div>
                        <p className="text-sm text-gray-600">Bedrooms</p>
                        <p className="font-semibold">{property.no_of_bedroom}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaBath className="text-[#79B833] text-xl" />
                      <div>
                        <p className="text-sm text-gray-600">Bathrooms</p>
                        <p className="font-semibold">{property.number_of_bathroom}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaBath className="text-[#79B833] text-xl" />
                      <div>
                        <p className="text-sm text-gray-600">Toilets</p>
                        <p className="font-semibold">{property.toilets}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaCar className="text-[#79B833] text-xl" />
                      <div>
                        <p className="text-sm text-gray-600">Parking</p>
                        <p className="font-semibold">{property.parking_space || "N/A"}</p>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-[#79B833] text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{property.state}, {property.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Description</h2>
            <SafeDescriptionSection htmlContent={property.description || ""} />
          </div>

          {/* Features Section */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {property.features?.map((feature: string, index: number) => (
                <li key={index} className="flex items-center space-x-2 text-gray-700">
                  <span className="text-[#79B833] ">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Address Section */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Address</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Street:</strong> {property.street_address}</p>
              <p><strong>State:</strong> {property.state}</p>
              <p><strong>Country:</strong> {property.country}</p>
              <p><strong>LGA:</strong> {property.lga || "N/A"}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Payment Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaNairaSign className="text-[#79B833] " />
                <p><strong>Initial Deposit:</strong> ₦{property.initial_deposit?.toLocaleString() || "0"}</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaNairaSign className="text-[#79B833] " />
                <p><strong>Total Amount:</strong> ₦{property.total_amount?.toLocaleString() || "0"}</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Payment Schedule:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {property.payment_schedule?.map((schedule: string, index: number) => (
                    <li key={index}>{schedule}</li>
                  ))}
                </ul>
              </div>
              <p><strong>Payment Type:</strong> {property.payment_type}</p>
              <p><strong>Discount Available:</strong> {property.is_discount ? "Yes" : "No"}</p>
              {property.is_discount && (
                <div className="pl-4 border-l-4 border-[#79B833]  space-y-2">
                  <p><strong>Name:</strong> {property.discount_name || "N/A"}</p>
                  <p><strong>Percentage:</strong> {property.discount_percentage ? `${property.discount_percentage}%` : "N/A"}</p>
                  <p><strong>Units:</strong> {property.discount_units || "N/A"}</p>
                  <p><strong>Start:</strong> {formatDate(property.discount_start_date) || "N/A"}</p>
                  <p><strong>End:</strong> {formatDate(property.discount_end_date) || "N/A"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Property Details</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Type:</strong> {property.type?.name}</p>
              <p><strong>Status:</strong> {property.status.charAt(0).toUpperCase() + property.status.slice(1)}</p>
              {!isLandProperty && (
                <>
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-[#79B833] " />
                    <p><strong>Year Built:</strong> {property.year_built}</p>
                  </div>
                  <p><strong>Condition:</strong> {property.building_condition}</p>
                </>
              )}
              <p><strong>Category:</strong> {property.category.charAt(0).toUpperCase() + property.category.slice(1)}</p>
              {isLandProperty && (
                <>
                  <p><strong>Gated Estate:</strong> {property.gated_estate || "N/A"}</p>
                  <p><strong>Fencing:</strong> {property.fencing || "N/A"}</p>
                </>
              )}
              <p><strong>Total Units:</strong> {property.number_of_unit}</p>
              <p><strong>Available:</strong> {property.unit_available}</p>
              <p><strong>Sold:</strong> {property.unit_sold}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Additional Information</h2>
            <div className="space-y-4">
              {property.property_map && (
                <a href={property.property_map} target="_blank" rel="noopener noreferrer" className="text-[#79B833] hover:underline flex items-center space-x-2">
                  <FaMapMarkerAlt />
                  <span>View Map</span>
                </a>
              )}
              {property.video_link && (
                <a href={property.video_link} target="_blank" rel="noopener noreferrer" className="text-[#79B833] hover:underline flex items-center space-x-2">
                  <span>Watch Video</span>
                </a>
              )}
              {property.virtual_tour && (
                <a href={property.virtual_tour} target="_blank" rel="noopener noreferrer" className="text-[#79B833] hover:underline flex items-center space-x-2">
                  <span>Virtual Tour</span>
                </a>
              )}
              {property.whatsapp_link && (
                <a href={property.whatsapp_link} target="_blank" rel="noopener noreferrer" className="text-[#79B833] hover:underline flex items-center space-x-2">
                  <span>Contact via WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* Fees and Details */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Fees and Details</h2>
            <div className="space-y-4">
              {property.details?.map((detail: any, index: number) => (
                <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50 p-4 rounded-md shadow-sm">
                  <p className="font-medium">{detail.name}</p>
                  <p>₦{detail.value?.toLocaleString() || "0"}</p>
                  <p className="text-sm text-gray-600">Purpose: {detail.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Land Sizes & Pricing */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Land Sizes & Pricing</h2>
            <div className="space-y-6">
              {property?.land_sizes?.map((ls, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold mb-2">{ls.size} SQM</h3>
                  <div className="space-y-2">
                    {ls.durations.map((ld, durIndex) => (
                      <div key={durIndex} className="flex justify-between text-gray-700">
                        <p>{ld.duration} Months</p>
                        <p className="font-semibold">₦{ld.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      {/* </EdithBackgroung> */}
    </section>
  );
};

export default PropertyDetailsPage;