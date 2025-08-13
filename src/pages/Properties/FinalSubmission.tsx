import React, { useContext } from "react";
import { FaMapMarkerAlt, FaHome, FaTag } from "react-icons/fa";
import { PropertyContext } from "../../MyContext/MyContext";

export default function FinalSubmission() {
  const { formData, isBulk } = useContext(PropertyContext)!;

  // Format the data for display
  const propertyData = {
    title: isBulk ? formData.bulkDetails.propertyName : formData.basicDetails.propertyName,
    location: isBulk ? formData.bulkDetails.address : formData.basicDetails.address,
    virtualTour: formData.media.tourLink,
    squareMeters: formData.specifications.propertySize ? `${formData.specifications.propertySize} Sq M` : "",
    propertyUnits: isBulk ? formData.bulkDetails.propertyUnits : "1",
    propertyType: isBulk ? formData.bulkDetails.propertyType : formData.basicDetails.propertyType,
    price: isBulk ? 
      formData.bulkDetails.price ? `₦${Number(formData.bulkDetails.price).toLocaleString()}` : "" : 
      formData.basicDetails.price ? `₦${Number(formData.basicDetails.price).toLocaleString()}` : "",
    overview: formData.specifications.overview,
    description: formData.specifications.description,
    features: formData.features.features,
    address: isBulk ? formData.bulkDetails.address : formData.basicDetails.address,
    discount: {
      name: formData.discount.discountName,
      off: formData.discount.discountOff,
      units: formData.discount.unitsRequired,
      from: formData.discount.validFrom,
      to: formData.discount.validTo
    },
    city: isBulk ? formData.bulkDetails.city : "",
    state: isBulk ? formData.bulkDetails.state : ""
  };

  // Use actual images if available
  const images = formData.media.images.length > 0 
    ? formData.media.images.map(file => URL.createObjectURL(file))
    : [];

  return (
    <div className="mx-auto bg-white rounded-[20px] md:rounded-[40px] p-4 md:p-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{propertyData.title}</h1>
        <div className="flex items-center text-gray-600 mt-1">
          <FaMapMarkerAlt className="w-4 h-4 mr-1" />
          <p className="text-xs md:text-sm">{propertyData.location}</p>
        </div>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="mb-6 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="relative aspect-square rounded-[10px] md:rounded-[20px] overflow-hidden bg-gray-200"
              >
                <img 
                  src={image} 
                  alt={`Property view ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Virtual Tour */}
      {propertyData.virtualTour && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2">Virtual Tour</h2>
          <div className="relative">
            <input 
              type="text" 
              value={propertyData.virtualTour} 
              className="w-full p-2 text-xs md:text-sm border border-gray-300 rounded-md bg-gray-50 text-[#272727]"
              readOnly
            />
          </div>
        </div>
      )}

      {/* Property Details */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
        <div className="flex items-center gap-2">
          <FaHome className="w-4 h-4 text-gray-600" />
          <span className="text-xs md:text-sm">{propertyData.squareMeters}</span>
        </div>

        {isBulk && (
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-medium">Units:</span>
            <span className="text-xs md:text-sm">{propertyData.propertyUnits}</span>
          </div>
        )}

        <div className="md:ml-auto flex items-center gap-2">
          <span className="text-xs md:text-sm font-medium">{propertyData.propertyType}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-xl md:text-2xl font-bold">{propertyData.price}</h2>
          {isBulk && <span className="ml-2 text-xs md:text-sm">per unit</span>}
        </div>
      </div>

      {/* Overview */}
      {propertyData.overview && (
        <div className="mb-6">
          <h2 className="text-base md:text-lg font-semibold mb-2">Overview</h2>
          <p className="text-xs md:text-sm text-gray-600">{propertyData.overview}</p>
        </div>
      )}

      {/* Description */}
      {propertyData.description && (
        <div className="mb-6">
          <h2 className="text-base md:text-lg font-semibold mb-2">Description</h2>
          <p className="text-xs md:text-sm text-gray-600">{propertyData.description}</p>
        </div>
      )}

      {/* Features */}
      {propertyData.features.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base md:text-lg font-semibold mb-2">Features</h2>
          <ul className="text-xs md:text-sm text-gray-600 space-y-1">
            {propertyData.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Address */}
      <div className="mb-6">
        <h2 className="text-base md:text-lg font-semibold mb-2">Address</h2>
        {isBulk ? (
          <div className="space-y-2">
            <p className="text-xs md:text-sm text-gray-600">{propertyData.address}</p>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <div className="flex items-center mb-1 sm:mb-0">
                <span className="text-xs md:text-sm font-medium mr-2">City:</span>
                <span className="text-xs md:text-sm text-gray-600">{propertyData.city}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs md:text-sm font-medium mr-2">State:</span>
                <span className="text-xs md:text-sm text-gray-600">{propertyData.state}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs md:text-sm text-gray-600">{propertyData.address}</p>
        )}
      </div>

      {/* Discount */}
      <div className="mt-6">
        <h2 className="text-base md:text-lg font-semibold mb-2">Discount</h2>
        <div className="bg-gray-100 p-3 md:p-4 rounded-lg">
          {propertyData.discount.name ? (
            <>
              <h3 className="font-medium text-gray-800 text-sm md:text-base">{propertyData.discount.name}</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                {propertyData.discount.off}% Off above {propertyData.discount.units} units
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Valid: {propertyData.discount.from} to {propertyData.discount.to}
              </p>
            </>
          ) : (
            <div className="flex items-center text-gray-500 text-sm">
              <FaTag className="mr-2" />
              <span>No discount available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}