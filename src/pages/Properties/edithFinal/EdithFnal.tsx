import { useState, useContext, useRef, ChangeEvent, useEffect } from "react";
import { PropertyContext } from "../../../MyContext/MyContext";
import { FaCamera, FaCheck, FaPen, FaTag, FaTrash } from "react-icons/fa6";
import { FaHome, FaMapMarkerAlt, FaTimes, FaPlus } from "react-icons/fa";
import InfrastructureFeesModal from "../../../components/Modals/InfrastructureFeesModal";
import InfrastructureFeesModalss from "../../../components/Modals/infrastureModal2";

interface EditingState {
  title: boolean;
  location: boolean;
  virtualTour: boolean;
  squareMeters: boolean;
  propertyType: boolean;
  price: boolean;
  overview: boolean;
  description: boolean;
  features: boolean;
  address: boolean;
  discount: boolean;
  propertyUnits: boolean;
}

export default function PropertyListing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    formData,
    isBulk,
    isLandProperty,
    setMedia,
    isLandProperty2,
    selectedPropertyId,
    setIsCancelInfrastructure,
  } = useContext(PropertyContext)!;
  const [activeImage, setActiveImage] = useState<number>(0);
  const [editing, setEditing] = useState<EditingState>({
    title: false,
    location: false,
    virtualTour: false,
    squareMeters: false,
    propertyType: false,
    price: false,
    overview: false,
    description: false,
    features: false,
    address: false,
    discount: false,
    propertyUnits: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for all editable fields
  const [propertyData, setPropertyData] = useState({
    title: isBulk
      ? formData.bulkDetails.propertyName
      : formData.basicDetails.propertyName,
    location: isBulk
      ? formData.bulkDetails.address
      : formData.basicDetails.address,
    virtualTour: formData.media.tourLink,
    squareMeters: isLandProperty
      ? formData.landForm.propertySize
        ? `${formData.landForm.propertySize} Sq M`
        : ""
      : formData.specifications.propertySize
      ? `${formData.specifications.propertySize} Sq M`
      : "",
    propertyUnits: isBulk ? formData.bulkDetails.propertyUnits : "1",
    propertyType: isBulk
      ? formData.bulkDetails.propertyType
      : formData.basicDetails.propertyType,
    price: isBulk
      ? formData.bulkDetails.price
        ? `₦${Number(formData.bulkDetails.price).toLocaleString()}`
        : ""
      : formData.basicDetails.price
      ? `₦${Number(formData.basicDetails.price).toLocaleString()}`
      : "",
    // overview: isLandProperty ? formData.landForm.overview : formData.specifications.overview,
    description: isLandProperty
      ? formData.landForm.description
      : formData.specifications.description,
    features: formData.features.features,
    address: isBulk
      ? formData.bulkDetails.address
      : formData.basicDetails.address,
    discount: {
      name: formData.discount.discountName,
      off: formData.discount.discountOff,
      units: formData.discount.unitsRequired,
      from: formData.discount.validFrom,
      to: formData.discount.validTo,
    },
    city: isBulk ? formData.bulkDetails.city : "",
    state: isBulk ? formData.bulkDetails.state : "",
  });

  const [tempData, setTempData] = useState({ ...propertyData });
  const images = formData.media.images.map((file) =>
    file instanceof File ? URL.createObjectURL(file) : file
  );
  useEffect(() => {
    setPropertyData({
      title: isBulk
        ? formData.bulkDetails.propertyName
        : formData.basicDetails.propertyName,
      location: isBulk
        ? formData.bulkDetails.address
        : formData.basicDetails.address,
      virtualTour: formData.media.tourLink,
      squareMeters: isLandProperty
        ? formData.landForm.propertySize
          ? `${formData.landForm.propertySize} Sq M`
          : ""
        : formData.specifications.propertySize
        ? `${formData.specifications.propertySize} Sq M`
        : "",
      propertyUnits: isBulk ? formData.bulkDetails.propertyUnits : "1",
      propertyType: isBulk
        ? formData.bulkDetails.propertyType
        : formData.basicDetails.propertyType,
      price: isBulk
        ? formData.bulkDetails.price
          ? `₦${Number(formData.bulkDetails.price).toLocaleString()}`
          : ""
        : formData.basicDetails.price
        ? `₦${Number(formData.basicDetails.price).toLocaleString()}`
        : "",
      // overview: isLandProperty ? formData.landForm.overview : formData.specifications.overview,
      description: isLandProperty
        ? formData.landForm.description
        : formData.specifications.description,
      features: formData.features.features,
      address: isBulk
        ? formData.bulkDetails.address
        : formData.basicDetails.address,
      discount: {
        name: formData.discount.discountName,
        off: formData.discount.discountOff,
        units: formData.discount.unitsRequired,
        from: formData.discount.validFrom,
        to: formData.discount.validTo,
      },
      city: isBulk ? formData.bulkDetails.city : "",
      state: isBulk ? formData.bulkDetails.state : "",
    });

    setTempData((prevTempData) => ({
      ...prevTempData,
      ...propertyData,
    }));
  }, [
    isBulk,
    isLandProperty,
    formData.bulkDetails.propertyName,
    formData.bulkDetails.address,
    formData.bulkDetails.propertyUnits,
    formData.bulkDetails.propertyType,
    formData.bulkDetails.price,
    formData.bulkDetails.city,
    formData.bulkDetails.state,
    formData.basicDetails.propertyName,
    formData.basicDetails.address,
    formData.basicDetails.propertyType,
    formData.basicDetails.price,
    formData.media.tourLink,
    formData.media.images, // you might want to add this for images, if relevant
    formData.landForm.propertySize,
    formData.landForm.overview,
    formData.landForm.description,
    formData.specifications.propertySize,
    formData.specifications.overview,
    formData.specifications.description,
    formData.features.features,
    formData.discount.discountName,
    formData.discount.discountOff,
    formData.discount.unitsRequired,
    formData.discount.validFrom,
    formData.discount.validTo,
  ]);
  // // Handle image upload
  // const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const newImages = [...formData.media.images, ...Array.from(e.target.files)];
  //     setMedia({
  //       ...formData.media,
  //       images: newImages
  //     });
  //   }
  // };

  // // Handle image removal
  // const handleRemoveImage = (index: number) => {
  //   const newImages = formData.media.images.filter((_, i) => i !== index);
  //   setMedia({
  //     ...formData.media,
  //     images: newImages
  //   });
  // };

  // Use actual images if available, otherwise use placeholders
  // const images = formData.media.images.length > 0
  //   ? formData.media.images.map(file => URL.createObjectURL(file))
  //   : [];

  const handleEdit = (field: keyof EditingState) => {
    setTempData({ ...propertyData });
    setEditing({ ...editing, [field]: true });
  };

  const handleCancel = (field: keyof EditingState) => {
    setEditing({ ...editing, [field]: false });
  };

  const handleSave = (field: keyof typeof propertyData) => {
    setPropertyData({ ...propertyData, [field]: tempData[field] });
    setEditing({ ...editing, [field as keyof EditingState]: false });
  };

  const handleChange = (field: keyof typeof propertyData, value: string) => {
    setTempData({ ...tempData, [field]: value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...tempData.features];
    updatedFeatures[index] = value;
    setTempData({ ...tempData, features: updatedFeatures });
  };
  // Handle image upload - update the context directly
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = [
        ...formData.media.images,
        ...Array.from(e.target.files),
      ];
      setMedia({
        ...formData.media,
        images: newImages,
      });
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    const newImages = formData.media.images.filter((_, i) => i !== index);
    setMedia({
      ...formData.media,
      images: newImages,
    });
  };

  // For virtual tour, use the one from formData
  const virtualTourLink = formData.media.tourLink;
  return (
    <div className="mx-auto bg-white rounded-[40px] p-6">
      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-center">
          {editing.title ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={tempData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="text-2xl font-bold text-gray-800 border-b border-blue-500 focus:outline-none w-full"
                autoFocus
              />
              <div className="flex gap-2">
                <FaCheck
                  className="w-5 h-5 text-green-500 cursor-pointer"
                  onClick={() => handleSave("title")}
                />
                <FaTimes
                  className="w-5 h-5 text-red-500 cursor-pointer"
                  onClick={() => handleCancel("title")}
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-800">
                {propertyData.title}
              </h1>
              <FaPen
                className="w-5 h-5 text-[#272727] cursor-pointer"
                onClick={() => handleEdit("title")}
              />
            </>
          )}
        </div>
        <div className="flex items-center text-gray-600 mt-1">
          <FaMapMarkerAlt className="w-4 h-4 mr-1" />
          {editing.location ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={tempData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="text-sm text-gray-600 border-b border-blue-500 focus:outline-none w-full"
                autoFocus
              />
              <div className="flex gap-2">
                <FaCheck
                  className="w-4 h-4 text-green-500 cursor-pointer"
                  onClick={() => handleSave("location")}
                />
                <FaTimes
                  className="w-4 h-4 text-red-500 cursor-pointer"
                  onClick={() => handleCancel("location")}
                />
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm">{propertyData.location}</p>
              <FaPen
                className="w-4 h-4 ml-2 text-[#272727] cursor-pointer"
                onClick={() => handleEdit("location")}
              />
            </>
          )}
        </div>
      </div>

      {/* Image Gallery with Add/Remove functionality */}
      <div className="mb-6 max-w-[612px]">
        <div className="grid grid-cols-4 gap-2">
          {/* Existing images */}
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-[138px] h-[119px] rounded-[20px] overflow-hidden bg-gray-200 group"
            >
              <img
                src={image}
                alt={`Property view ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setActiveImage(index)}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Add Image button (show if less than 4 images) */}
          {images.length < 4 && (
            <div
              className="relative w-[138px] h-[119px] rounded-[20px] overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                <FaPlus className="w-6 h-6 text-gray-500 mb-1" />
                <span className="text-xs text-gray-500">Add Image</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
                multiple
              />
            </div>
          )}
        </div>
      </div>

      {/* Virtual Tour */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-2">Virtual Tour</h2>
        <div className="relative">
          {editing.virtualTour ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={virtualTourLink}
                onChange={(e) => handleChange("virtualTour", e.target.value)}
                className="w-full p-2 pr-16 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <div className="absolute right-2 flex gap-2">
                <FaCheck
                  className="w-4 h-4 text-green-500 cursor-pointer"
                  onClick={() => handleSave("virtualTour")}
                />
                <FaTimes
                  className="w-4 h-4 text-red-500 cursor-pointer"
                  onClick={() => handleCancel("virtualTour")}
                />
              </div>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={propertyData.virtualTour}
                className="w-full p-2 pr-8 text-sm border border-gray-300 rounded-md bg-gray-50 text-[#272727]"
                readOnly
              />
              <FaPen
                className="absolute right-2 top-2 w-4 h-4 text-[#272727] cursor-pointer"
                onClick={() => handleEdit("virtualTour")}
              />
            </>
          )}
        </div>
      </div>

      {/* Property Details - Modified for Bulk */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <FaHome className="w-4 h-4 text-gray-600" />
          {editing.squareMeters ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempData.squareMeters}
                onChange={(e) => handleChange("squareMeters", e.target.value)}
                className="text-sm w-20 border-b border-blue-500 focus:outline-none"
                autoFocus
              />
              <FaCheck
                className="w-3 h-3 text-green-500 cursor-pointer"
                onClick={() => handleSave("squareMeters")}
              />
              <FaTimes
                className="w-3 h-3 text-red-500 cursor-pointer"
                onClick={() => handleCancel("squareMeters")}
              />
            </div>
          ) : (
            <span className="text-sm">{propertyData.squareMeters}</span>
          )}
        </div>

        {/* Property Units - Only shown for bulk */}
        {isBulk && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Units:</span>
            {editing.propertyUnits ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tempData.propertyUnits}
                  onChange={(e) =>
                    handleChange("propertyUnits", e.target.value)
                  }
                  className="text-sm w-12 border-b border-blue-500 focus:outline-none"
                  autoFocus
                />
                <FaCheck
                  className="w-3 h-3 text-green-500 cursor-pointer"
                  onClick={() => handleSave("propertyUnits")}
                />
                <FaTimes
                  className="w-3 h-3 text-red-500 cursor-pointer"
                  onClick={() => handleCancel("propertyUnits")}
                />
              </div>
            ) : (
              <>
                <span className="text-sm">{propertyData.propertyUnits}</span>
                <FaPen
                  className="w-4 h-4 text-[#272727] cursor-pointer"
                  onClick={() => handleEdit("propertyUnits")}
                />
              </>
            )}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {editing.propertyType ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempData.propertyType}
                onChange={(e) => handleChange("propertyType", e.target.value)}
                className="text-sm font-medium w-16 border-b border-blue-500 focus:outline-none"
                autoFocus
              />
              <FaCheck
                className="w-3 h-3 text-green-500 cursor-pointer"
                onClick={() => handleSave("propertyType")}
              />
              <FaTimes
                className="w-3 h-3 text-red-500 cursor-pointer"
                onClick={() => handleCancel("propertyType")}
              />
            </div>
          ) : (
            <>
              <span className="text-sm font-medium">
                {propertyData.propertyType}
              </span>
              <FaPen
                className="w-4 h-4 text-[#272727] cursor-pointer"
                onClick={() => handleEdit("propertyType")}
              />
            </>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {editing.price ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="text-2xl font-bold border-b border-blue-500 focus:outline-none"
                autoFocus
              />
              <FaCheck
                className="w-4 h-4 text-green-500 cursor-pointer"
                onClick={() => handleSave("price")}
              />
              <FaTimes
                className="w-4 h-4 text-red-500 cursor-pointer"
                onClick={() => handleCancel("price")}
              />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{propertyData.price}</h2>
              {isBulk && <span className="ml-2 text-sm">per unit</span>}
              <FaPen
                className="w-4 h-4 ml-2 text-[#272727] cursor-pointer"
                onClick={() => handleEdit("price")}
              />
            </>
          )}
        </div>
      </div>
      {/* Infrastructure Fees  */}
    {(isLandProperty || isLandProperty2) && (
  <div className="mb-6">
    <div className="flex flex-col justify-between mb-2">
      <h2 className="text-lg font-semibold">Infrastructure Fees</h2>
      <button
        className="text-sm flex items-center gap-1 py-2 px-4 w-fit rounded-4xl bg-gray-100"
        onClick={() => setIsModalOpen(true)}
      >
        Add Fees
      </button>
    </div>
  </div>
)}

      {/* Overview */}
      {/* <div className="mb-6">
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold">Overview</h2>
          <FaPen 
            className="w-4 h-4 ml-2 text-[#272727] cursor-pointer" 
            onClick={() => handleEdit("overview")}
          />
        </div>
        */}
      {/* </div> */}

      {/* Description */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold">Description</h2>
          <FaPen
            className="w-4 h-4 ml-2 text-[#272727] cursor-pointer"
            onClick={() => handleEdit("description")}
          />
        </div>
        {editing.description ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={tempData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="text-sm text-gray-600 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 min-h-32"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                className="px-2 py-1 bg-green-500 text-white rounded-md text-sm flex items-center gap-1"
                onClick={() => handleSave("description")}
              >
                <FaCheck className="w-3 h-3" /> Save
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded-md text-sm flex items-center gap-1"
                onClick={() => handleCancel("description")}
              >
                <FaTimes className="w-3 h-3" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            {propertyData.description || "No description provided"}
          </p>
        )}
      </div>

      {/* Features */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold">Features</h2>
          <FaPen
            className="w-4 h-4 ml-2 text-[#272727] cursor-pointer"
            onClick={() => handleEdit("features")}
          />
        </div>
        {editing.features ? (
          <div className="flex flex-col gap-2">
            {tempData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="mr-2">•</span>
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="text-sm text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
            ))}
            <div className="flex gap-2 justify-end mt-2">
              <button
                className="px-2 py-1 bg-green-500 text-white rounded-md text-sm flex items-center gap-1"
                onClick={() => handleSave("features")}
              >
                <FaCheck className="w-3 h-3" /> Save
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded-md text-sm flex items-center gap-1"
                onClick={() => handleCancel("features")}
              >
                <FaTimes className="w-3 h-3" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <ul className="text-sm text-gray-600 space-y-1">
            {propertyData.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Address */}
      <div>
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold">Address</h2>
          <FaPen
            className="w-4 h-4 ml-2 text-[#272727] cursor-pointer"
            onClick={() => handleEdit("address")}
          />
        </div>
        {editing.address ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="text-sm text-gray-600 border-b border-blue-500 focus:outline-none w-full"
              autoFocus
            />
            <FaCheck
              className="w-4 h-4 text-green-500 cursor-pointer"
              onClick={() => handleSave("address")}
            />
            <FaTimes
              className="w-4 h-4 text-red-500 cursor-pointer"
              onClick={() => handleCancel("address")}
            />
          </div>
        ) : (
          <p className="text-sm text-gray-600">{propertyData.address}</p>
        )}
      </div>

      {/* Discount - Enhanced for Bulk */}
      <div className="mt-6">
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold">Discount</h2>
          <FaPen
            className="w-4 h-4 ml-2 text-[#272727] cursor-pointer"
            onClick={() => handleEdit("discount")}
          />
        </div>
        {editing.discount ? (
          <div className="bg-gray-100 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm w-24">Name:</span>
              <input
                type="text"
                value={tempData.discount.name}
                onChange={(e) =>
                  setTempData({
                    ...tempData,
                    discount: { ...tempData.discount, name: e.target.value },
                  })
                }
                className="text-sm border-b border-blue-500 focus:outline-none flex-1"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-24">Discount:</span>
              <input
                type="text"
                value={tempData.discount.off}
                onChange={(e) =>
                  setTempData({
                    ...tempData,
                    discount: { ...tempData.discount, off: e.target.value },
                  })
                }
                className="text-sm border-b border-blue-500 focus:outline-none flex-1"
              />
              <span>%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-24">Min Units:</span>
              <input
                type="text"
                value={tempData.discount.units}
                onChange={(e) =>
                  setTempData({
                    ...tempData,
                    discount: { ...tempData.discount, units: e.target.value },
                  })
                }
                className="text-sm border-b border-blue-500 focus:outline-none flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-24">From:</span>
              <input
                type="date"
                value={tempData.discount.from}
                onChange={(e) =>
                  setTempData({
                    ...tempData,
                    discount: { ...tempData.discount, from: e.target.value },
                  })
                }
                className="text-sm border-b border-blue-500 focus:outline-none flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-24">To:</span>
              <input
                type="date"
                value={tempData.discount.to}
                onChange={(e) =>
                  setTempData({
                    ...tempData,
                    discount: { ...tempData.discount, to: e.target.value },
                  })
                }
                className="text-sm border-b border-blue-500 focus:outline-none flex-1"
              />
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button
                className="px-2 py-1 bg-green-500 text-white rounded-md text-sm flex items-center gap-1"
                onClick={() => handleSave("discount")}
              >
                <FaCheck className="w-3 h-3" /> Save
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded-md text-sm flex items-center gap-1"
                onClick={() => handleCancel("discount")}
              >
                <FaTimes className="w-3 h-3" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg">
            {propertyData.discount.name ? (
              <>
                <h3 className="font-medium text-gray-800">
                  {propertyData.discount.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {propertyData.discount.off}% Off above{" "}
                  {propertyData.discount.units} units
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Valid: {propertyData.discount.from} to{" "}
                  {propertyData.discount.to}
                </p>
              </>
            ) : (
              <div className="flex items-center text-gray-500">
                <FaTag className="mr-2" />
                <span>No discount available</span>
              </div>
            )}
          </div>
        )}
      </div>
      {selectedPropertyId ? (
        <InfrastructureFeesModalss
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      ) : (
        <InfrastructureFeesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
