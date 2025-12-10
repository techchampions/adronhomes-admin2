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
  
  // Remove all editing-related state
  const isLandProperty = data?.properties?.category === "estate";

  // Fetch property data
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
      // Refresh the property data after publish/draft
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
          property?.is_active === 1 ? "drafted" : "published"
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
    <section className="w-full lg:pl-[38px] lg:pr-[64px] pr-[15px] pl-[15px] pt-8">
      <EdithBackgroung>
        <div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <button
                onClick={handleGoBack}
                className="text-gray-700 hover:text-gray-900 text-xl flex items-center"
              >
                <IoArrowBackSharp className="mr-2" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">
                Property Details
              </h1>
            </div>

            <div className="flex space-x-4 justify-center md:justify-end">
              <button
                onClick={() =>
                  navigate(`/properties/property-edith/${property.id}`)
                }
                className={`px-4 py-2 font-bold text-sm rounded-[60px] bg-[#79B833] text-white`}
              >
                Edit Property
              </button>
              <button
                onClick={handlePublishToggle}
                className="px-4 py-2 font-bold text-sm rounded-[60px] bg-[#272727] text-white"
                disabled={publishLoading}
              >
                {publishLoading
                  ? "Processing..."
                  : property.is_active === 1
                  ? "Add to Draft"
                  : "Publish"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden">
            {/* Main Image */}
            <div className="relative h-96">
              <img
                src={property.display_image}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              {/* Basic Information Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  {/* Property Name */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Property Name:
                    </label>
                    <div className="w-full md:w-2/3 flex justify-start">
                      <p className="text-gray-900 break-words max-w-2xl text-left">
                        {property.name}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Price:
                    </label>
                    <div className="w-full md:w-2/3 flex justify-start">
                      <p className="text-gray-900 break-words max-w-2xl text-left">
                        ₦{property.price?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>

                  {/* Size */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Size:
                    </label>
                    <div className="w-full md:w-2/3 flex justify-start">
                      <p className="text-gray-900 break-words max-w-2xl text-left">
                        {property.size}
                      </p>
                    </div>
                  </div>
                  
                  {!isLandProperty && (
                    <>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Bedrooms:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {property.no_of_bedroom}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Bathrooms:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {property.number_of_bathroom}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Toilets:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {property.toilets}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Parking Space:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {property.parking_space || "N/A"}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Total Units:
                    </label>
                    <p className="text-gray-900 w-full md:w-2/3">
                      {property.number_of_unit}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Units Available:
                    </label>
                    <p className="text-gray-900 w-full md:w-2/3">
                      {property.unit_available}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Units Sold:
                    </label>
                    <p className="text-gray-900 w-full md:w-2/3">
                      {property.unit_sold}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 mb-8">
                <SafeDescriptionSection
                  htmlContent={property.description || ""}
                />
              </div>

              {/* Address Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Address</h2>
                <div className="space-y-4">
                  {/* Street Address */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Street Address:
                    </label>
                    <div className="w-full md:w-2/3 flex justify-start">
                      <p className="text-gray-900 break-words max-w-2xl text-left">
                        {property.street_address}
                      </p>
                    </div>
                  </div>

                  {/* State */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      State:
                    </label>
                    <div className="w-full md:w-2/3 flex justify-start">
                      <p className="text-gray-900 break-words max-w-2xl text-left">
                        {property.state}
                      </p>
                    </div>
                  </div>

                  {/* Country */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Country:
                    </label>
                    <div className="w-full md:w-2/3 flex justify-start">
                      <p className="text-gray-900 break-words max-w-2xl text-left">
                        {property.country}
                      </p>
                    </div>
                  </div>

                  {/* LGA */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      LGA:
                    </label>
                    <div className="w-full md:w-2/3 flex justify-start">
                      <p className="text-gray-900 break-words max-w-2xl text-left">
                        {property.lga || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                  <label className="text-gray-700 font-medium w-full md:w-1/3">
                    Features:
                  </label>
                  <ul className="w-full md:w-2/3 list-disc pl-5">
                    {property.features?.map((feature: string, index: number) => (
                      <li key={index} className="text-gray-900">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Initial Deposit:
                    </label>
                    <p className="text-gray-900 w-full md:w-2/3">
                      ₦{property.initial_deposit?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Total Amount:
                    </label>
                    <p className="text-gray-900 w-full md:w-2/3">
                      ₦{property.total_amount?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Payment Schedule:
                    </label>
                    <ul className="w-full md:w-2/3 list-disc pl-5">
                      {property.payment_schedule?.map((schedule: string, index: number) => (
                        <li key={index} className="text-gray-900">
                          {schedule}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Payment Type:
                    </label>
                    <p className="text-gray-900 w-full md:w-2/3">
                      {property.payment_type}
                    </p>
                  </div>
                  
                  {/* Discount Section */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Discount:
                    </label>
                    <p className="text-gray-900 w-full md:w-2/3">
                      {property.is_discount ? "Yes" : "No"}
                    </p>
                  </div>
                  
                  {property.is_discount && (
                    <div className="space-y-4 pl-4 border-l-2 border-red-400">
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Discount Name:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {property.discount_name || "N/A"}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Discount Percentage:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {property.discount_percentage
                            ? `${property.discount_percentage}%`
                            : "N/A"}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Discount Units:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {property.discount_units || "N/A"}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Discount Start Date:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {formatDate(property.discount_start_date) || "N/A"}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Discount End Date:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {formatDate(property.discount_end_date) || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Property Details
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Property Type:
                    </label>
                    <p className="text-gray-900 w-full md:w-2/3">
                      {property.type?.name}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Status:
                    </label>
                    <p className="text-gray-900 w-full md:w-2/3 capitalize">
                      {property.status}
                    </p>
                  </div>

                  {!isLandProperty && (
                    <>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Year Built:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {property.year_built}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Building Condition:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {property.building_condition}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Category:
                    </label>
                    <p className="text-gray-900 w-full md:w-2/3">
                      {property.category}
                    </p>
                  </div>

                  {isLandProperty && (
                    <>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Gated Estate:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {property.gated_estate || "N/A"}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Fencing:
                        </label>
                        <p className="text-gray-900 w-full md:w-2/3">
                          {property.fencing || "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Property Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Additional Information
                </h2>
                <div className="space-y-4">
                  {/* Property Map URL */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Property Map URL:
                    </label>
                    <div className="w-full md:w-2/3 flex justify-start">
                      {property.property_map ? (
                        <a
                          href={property.property_map}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-words max-w-2xl text-left"
                        >
                          {property.property_map}
                        </a>
                      ) : (
                        <p className="text-gray-900">N/A</p>
                      )}
                    </div>
                  </div>

                  {/* Property Video URL */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Property Video URL:
                    </label>
                    <div className="w-full md:w-2/3 flex justify-start">
                      {property.video_link ? (
                        <a
                          href={property.video_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-words max-w-2xl text-left"
                        >
                          {property.video_link}
                        </a>
                      ) : (
                        <p className="text-gray-900">N/A</p>
                      )}
                    </div>
                  </div>

                  {/* Virtual Tour URL */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Virtual Tour URL:
                    </label>
                    <div className="w-full md:w-2/3 flex justify-start">
                      {property.virtual_tour ? (
                        <a
                          href={property.virtual_tour}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-words max-w-2xl text-left"
                        >
                          {property.virtual_tour}
                        </a>
                      ) : (
                        <p className="text-gray-900">N/A</p>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Link */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      WhatsApp Link:
                    </label>
                    <div className="w-full md:w-2/3 flex justify-start">
                      {property.whatsapp_link ? (
                        <a
                          href={property.whatsapp_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-words max-w-2xl text-left"
                        >
                          {property.whatsapp_link}
                        </a>
                      ) : (
                        <p className="text-gray-900">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Gallery Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Property Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.photos?.map((photo: string, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-md overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`Property Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fees and Details Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Fees and Details
                </h2>
                <div className="space-y-4">
                  {property.details?.map((detail: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2"
                    >
                      <label className="text-gray-700 font-medium w-full md:w-1/3">
                        {detail.name}:
                      </label>
                      <p className="text-gray-900 w-full md:w-1/3">
                        ₦{detail.value?.toLocaleString() || "0"}
                      </p>
                      <label className="text-gray-700 font-medium w-full md:w-1/3">
                        Purpose: {detail.purpose}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </EdithBackgroung>
    </section>
  );
};

export default PropertyDetailsPage;