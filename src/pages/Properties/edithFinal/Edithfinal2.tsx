import { useState, useRef, ChangeEvent, useEffect } from "react";
import { FaCamera, FaCheck, FaPen, FaTag, FaTrash } from "react-icons/fa6";
import {
  FaHome,
  FaMapMarkerAlt,
  FaTimes,
  FaPlus,
  FaBullseye,
} from "react-icons/fa";
import InfrastructureFeesModal from "../../../components/Modals/InfrastructureFeesModal";
import InfrastructureFeesModalss from "../../../components/Modals/infrastureModal2";
import {
  useCreatePropertyForm,
  useEditPropertyForm,
} from "../../../components/Redux/hooks/usePropertyForms";

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
  landSizeSection: boolean;
}

export default function PropertyListing() {
  const {
    basicDetails,
    bulkDetails,
    specifications,
    landForm,
    features: reduxFeatures,
    media,
    discount: reduxDiscount,
    metadata,
    LandSizeSection,

    // Redux setters
    setCreateMedia,
    setCreateBasicDetails,
    setCreateBulkDetails,
    setCreateSpecifications,
    setCreateLandForm,
    setCreateLandSizeSections,
    setCreateFeatures,
    setCreateDiscount,
  } = useCreatePropertyForm();

  const { isLandProperty, isBulk } = metadata;

  // Extract values from metadata
  const { propertyId: editPropertyId } = metadata;

  const [isModalOpen, setIsModalOpen] = useState(false);
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
    landSizeSection: false,
  });

  // Local editing states
  const [editingTitle, setEditingTitle] = useState("");
  const [editingLocation, setEditingLocation] = useState("");
  const [editingVirtualTour, setEditingVirtualTour] = useState("");
  const [editingSquareMeters, setEditingSquareMeters] = useState("");
  const [editingPropertyType, setEditingPropertyType] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingFeatures, setEditingFeatures] = useState<string[]>([]);
  const [editingAddress, setEditingAddress] = useState("");
  const [editingDiscount, setEditingDiscount] = useState({
    name: "",
    off: "",
    units: "",
    from: "",
    to: "",
  });
  const [editingPropertyUnits, setEditingPropertyUnits] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for editing land size sections
  const [localLandSizeSections, setLocalLandSizeSections] = useState(
    LandSizeSection || []
  );

  // Sync local state with Redux state changes
  useEffect(() => {
    setLocalLandSizeSections(LandSizeSection || []);
  }, [LandSizeSection]);

  // Determine if we're in edit mode based on propertyId
  const isEditMode = !!editPropertyId;

  // Use Redux data directly
  const getDisplayData = () => {
    // const isLandProperty = isLandProperty;

    return {
      title: isBulk ? bulkDetails.propertyName : basicDetails.propertyName,
      location: isBulk ? bulkDetails.address : basicDetails.address,
      virtualTour: media.tourLink,
      squareMeters: isLandProperty
        ? landForm.propertySize
          ? `${landForm.propertySize} Sq M`
          : ""
        : specifications.propertySize
        ? `${specifications.propertySize} Sq M`
        : "",
      propertyUnits: isBulk ? bulkDetails.propertyUnits : "1",
      propertyType: isBulk
        ? bulkDetails.propertyType
        : basicDetails.propertyType,
      price: isBulk
        ? bulkDetails.price
          ? `₦${Number(bulkDetails.price).toLocaleString()}`
          : ""
        : basicDetails.price
        ? `₦${Number(basicDetails.price).toLocaleString()}`
        : "",
      description: isLandProperty
        ? landForm.description
        : specifications.description,
      features: reduxFeatures.features || [],
      address: isBulk ? bulkDetails.address : basicDetails.address,
      discount: {
        name: reduxDiscount.discountName,
        off: reduxDiscount.discountOff,
        units: reduxDiscount.unitsRequired,
        from: reduxDiscount.validFrom,
        to: reduxDiscount.validTo,
      },
      city: isBulk ? bulkDetails.city : "",
      state: isBulk ? bulkDetails.state : "",
    };
  };

  const displayData = getDisplayData();

  // Process images - handle both File objects and URLs
  const images = media.images.map((file) =>
    file instanceof File ? URL.createObjectURL(file) : file
  );

  const handleEdit = (field: keyof EditingState) => {
    // Initialize editing state with current data
    switch (field) {
      case "title":
        setEditingTitle(
          isBulk ? bulkDetails.propertyName : basicDetails.propertyName
        );
        break;
      case "location":
        setEditingLocation(isBulk ? bulkDetails.address : basicDetails.address);
        break;
      case "virtualTour":
        setEditingVirtualTour(media.tourLink);
        break;
      case "squareMeters":
        // const isLandProperty = isLandProperty;
        const size = isLandProperty
          ? landForm.propertySize
          : specifications.propertySize;
        setEditingSquareMeters(size ? `${size} Sq M` : "");
        break;
      case "propertyType":
        setEditingPropertyType(
          isBulk ? bulkDetails.propertyType : basicDetails.propertyType
        );
        break;
      case "price":
        const price = isBulk ? bulkDetails.price : basicDetails.price;
        setEditingPrice(price ? `₦${Number(price).toLocaleString()}` : "");
        break;
      case "description":
        const description = isLandProperty
          ? landForm.description
          : specifications.description;
        setEditingDescription(description || "");
        break;
      case "features":
        setEditingFeatures([...reduxFeatures.features]);
        break;
      case "address":
        setEditingAddress(isBulk ? bulkDetails.address : basicDetails.address);
        break;
      case "discount":
        setEditingDiscount({
          name: reduxDiscount.discountName,
          off: reduxDiscount.discountOff,
          units: reduxDiscount.unitsRequired,
          from: reduxDiscount.validFrom,
          to: reduxDiscount.validTo,
        });
        break;
      case "propertyUnits":
        setEditingPropertyUnits(isBulk ? bulkDetails.propertyUnits : "1");
        break;
      case "landSizeSection":
        // Already handled by localLandSizeSections
        break;
    }

    setEditing({ ...editing, [field]: true });
  };

  const handleCancel = (field: keyof EditingState) => {
    setEditing({ ...editing, [field]: false });
  };

  const handleSave = (field: keyof EditingState) => {
    switch (field) {
      case "title":
        if (isBulk) {
          setCreateBulkDetails({
            ...bulkDetails,
            propertyName: editingTitle,
          });
        } else {
          setCreateBasicDetails({
            ...basicDetails,
            propertyName: editingTitle,
          });
        }
        break;

      case "location":
      case "address":
        if (isBulk) {
          setCreateBulkDetails({
            ...bulkDetails,
            address: editingAddress,
          });
        } else {
          setCreateBasicDetails({
            ...basicDetails,
            address: editingAddress,
          });
        }
        break;

      case "virtualTour":
        setCreateMedia({
          ...media,
          tourLink: editingVirtualTour,
        });
        break;

      case "propertyType":
        if (isBulk) {
          setCreateBulkDetails({
            ...bulkDetails,
            propertyType: editingPropertyType,
          });
        } else {
          setCreateBasicDetails({
            ...basicDetails,
            propertyType: editingPropertyType,
          });
        }
        break;

      case "price":
        // Extract numeric value from formatted string
        const priceValue = editingPrice.replace(/[^\d.]/g, "");
        if (isBulk) {
          setCreateBulkDetails({
            ...bulkDetails,
            price: priceValue,
          });
        } else {
          setCreateBasicDetails({
            ...basicDetails,
            price: priceValue,
          });
        }
        break;

      case "description":
        if (isLandProperty) {
          setCreateLandForm({
            ...landForm,
            description: editingDescription,
          });
        } else {
          setCreateSpecifications({
            ...specifications,
            description: editingDescription,
          });
        }
        break;

      case "features":
        setCreateFeatures({
          ...reduxFeatures,
          features: editingFeatures,
        });
        break;

      case "discount":
        setCreateDiscount({
          ...reduxDiscount,
          discountName: editingDiscount.name,
          discountOff: editingDiscount.off,
          unitsRequired: editingDiscount.units,
          validFrom: editingDiscount.from,
          validTo: editingDiscount.to,
        });
        break;

      case "propertyUnits":
        if (isBulk) {
          setCreateBulkDetails({
            ...bulkDetails,
            propertyUnits: editingPropertyUnits,
          });
        }
        break;

      case "squareMeters":
        // Extract numeric value from string
        const sizeValue = editingSquareMeters.replace(/[^\d.]/g, "");
        if (isLandProperty) {
          setCreateLandForm({
            ...landForm,
            propertySize: sizeValue,
          });
        } else {
          setCreateSpecifications({
            ...specifications,
            propertySize: sizeValue,
          });
        }
        break;

      case "landSizeSection":
        // Already handled by save button in land size section
        break;
    }

    setEditing({ ...editing, [field]: false });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...editingFeatures];
    updatedFeatures[index] = value;
    setEditingFeatures(updatedFeatures);
  };

  // Handle image upload - update Redux state
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = [...media.images, ...Array.from(e.target.files)];
      setCreateMedia({
        ...media,
        images: newImages,
      });
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    const newImages = media.images.filter((_, i) => i !== index);
    setCreateMedia({
      ...media,
      images: newImages,
    });
  };

  // For virtual tour, use the one from Redux state
  const virtualTourLink = media.tourLink;

  return (
    <div className="mx-auto bg-white rounded-[40px] p-6">
      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-center">
          {editing.title ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
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
                {displayData.title}
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
                value={editingLocation}
                onChange={(e) => setEditingLocation(e.target.value)}
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
              <p className="text-sm">{displayData.location}</p>
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
                value={editingVirtualTour}
                onChange={(e) => setEditingVirtualTour(e.target.value)}
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
                value={displayData.virtualTour}
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
                value={editingSquareMeters}
                onChange={(e) => setEditingSquareMeters(e.target.value)}
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
            <span className="text-sm">{displayData.squareMeters}</span>
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
                  value={editingPropertyUnits}
                  onChange={(e) => setEditingPropertyUnits(e.target.value)}
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
                <span className="text-sm">{displayData.propertyUnits}</span>
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
                value={editingPropertyType}
                onChange={(e) => setEditingPropertyType(e.target.value)}
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
                {displayData.propertyType}
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
                value={editingPrice}
                onChange={(e) => setEditingPrice(e.target.value)}
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
              <h2 className="text-2xl font-bold">{displayData.price}</h2>
              {isBulk && <span className="ml-2 text-sm">per unit</span>}
              <FaPen
                className="w-4 h-4 ml-2 text-[#272727] cursor-pointer"
                onClick={() => handleEdit("price")}
              />
            </>
          )}
        </div>
      </div>

      {/* Infrastructure Fees */}
      {isLandProperty && (
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
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
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
            {displayData.description || "No description provided"}
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
            {editingFeatures.map((feature, index) => (
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
            {displayData.features.map((feature: string, index: number) => (
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
              value={editingAddress}
              onChange={(e) => setEditingAddress(e.target.value)}
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
          <p className="text-sm text-gray-600">{displayData.address}</p>
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
                value={editingDiscount.name}
                onChange={(e) =>
                  setEditingDiscount({
                    ...editingDiscount,
                    name: e.target.value,
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
                value={editingDiscount.off}
                onChange={(e) =>
                  setEditingDiscount({
                    ...editingDiscount,
                    off: e.target.value,
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
                value={editingDiscount.units}
                onChange={(e) =>
                  setEditingDiscount({
                    ...editingDiscount,
                    units: e.target.value,
                  })
                }
                className="text-sm border-b border-blue-500 focus:outline-none flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-24">From:</span>
              <input
                type="date"
                value={editingDiscount.from}
                onChange={(e) =>
                  setEditingDiscount({
                    ...editingDiscount,
                    from: e.target.value,
                  })
                }
                className="text-sm border-b border-blue-500 focus:outline-none flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-24">To:</span>
              <input
                type="date"
                value={editingDiscount.to}
                onChange={(e) =>
                  setEditingDiscount({
                    ...editingDiscount,
                    to: e.target.value,
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
            {displayData.discount.name ? (
              <>
                <h3 className="font-medium text-gray-800">
                  {displayData.discount.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {displayData.discount.off}% Off above{" "}
                  {displayData.discount.units} units
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Valid: {displayData.discount.from} to{" "}
                  {displayData.discount.to}
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

      {/* Land Size Section */}
      {isLandProperty && (
        <div className="mt-8">
          <div className="flex items-center mb-3">
            <h2 className="text-lg font-semibold">Land Size Sections</h2>
            <FaPen
              className="w-4 h-4 ml-2 text-[#272727] cursor-pointer"
              onClick={() => handleEdit("landSizeSection")}
            />
          </div>

          {editing.landSizeSection ? (
            <>
              {localLandSizeSections.map((section: any, secIndex: number) => (
                <div
                  key={section.id}
                  className="border rounded-lg p-4 mb-4 bg-gray-50"
                >
                  {/* --- Size --- */}
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-sm font-medium w-24">
                      Size (sqm)
                    </label>
                    <input
                      type="text"
                      value={section.size}
                      onChange={(e) => {
                        const updated = [...localLandSizeSections];
                        updated[secIndex].size = e.target.value;
                        setLocalLandSizeSections(updated);
                      }}
                      className="border rounded px-2 py-1 text-sm w-32 focus:outline-none focus:border-[#79B833]"
                    />

                    <button
                      type="button"
                      className="ml-auto text-red-500 text-sm hover:text-red-700"
                      onClick={() => {
                        const updated = localLandSizeSections.filter(
                          (_: any, i: number) => i !== secIndex
                        );
                        setLocalLandSizeSections(updated);
                      }}
                    >
                      Remove Section
                    </button>
                  </div>

                  {/* ---- Durations ---- */}
                  <h3 className="text-sm font-semibold mb-2">Durations</h3>

                  {section.durations.map((d: any, dIndex: number) => (
                    <div
                      key={d.id}
                      className="grid grid-cols-4 gap-2 mb-2 items-center"
                    >
                      {/* Duration */}
                      <input
                        type="text"
                        value={d.duration}
                        placeholder="Duration (months)"
                        onChange={(e) => {
                          const updated = [...localLandSizeSections];
                          updated[secIndex].durations[dIndex].duration =
                            e.target.value;
                          setLocalLandSizeSections(updated);
                        }}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:border-[#79B833]"
                      />

                      {/* Price */}
                      <input
                        type="text"
                        value={d.price}
                        placeholder="Price"
                        onChange={(e) => {
                          const updated = [...localLandSizeSections];
                          updated[secIndex].durations[dIndex].price =
                            e.target.value;
                          setLocalLandSizeSections(updated);
                        }}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:border-[#79B833]"
                      />

                      {/* Citta Link */}
                      <input
                        type="text"
                        value={d.citta_id}
                        placeholder="Citta Link"
                        onChange={(e) => {
                          const updated = [...localLandSizeSections];
                          updated[secIndex].durations[dIndex].citta_id =
                            e.target.value;
                          setLocalLandSizeSections(updated);
                        }}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:border-[#79B833]"
                      />

                      {/* Remove Duration */}
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          const updated = [...localLandSizeSections];
                          updated[secIndex].durations = updated[
                            secIndex
                          ].durations.filter(
                            (_: any, i: number) => i !== dIndex
                          );
                          setLocalLandSizeSections(updated);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {/* Add Duration Button */}
                  <button
                    type="button"
                    className="text-sm text-[#79B833] hover:text-[#6ba32c] mt-2 flex items-center gap-1"
                    onClick={() => {
                      const updated = [...localLandSizeSections];
                      updated[secIndex].durations.push({
                        id: Date.now(),
                        duration: "",
                        price: "",
                        citta_id: "",
                      });
                      setLocalLandSizeSections(updated);
                    }}
                  >
                    <FaPlus className="w-3 h-3" />
                    Add Duration
                  </button>
                </div>
              ))}

              {/* Add New Land Size Section Button */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#79B833] text-white rounded-md text-sm hover:bg-[#6ba32c] flex items-center gap-2"
                  onClick={() => {
                    setLocalLandSizeSections([
                      ...localLandSizeSections,
                      {
                        id: Date.now(),
                        size: "",
                        durations: [],
                      },
                    ]);
                  }}
                >
                  <FaPlus className="w-3 h-3" />
                  Add Land Size Section
                </button>

                {/* Save and Cancel buttons for the entire section */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 flex items-center gap-2"
                    onClick={() => {
                      // Save to Redux
                      setCreateLandSizeSections(localLandSizeSections);
                      setEditing({ ...editing, landSizeSection: false });
                    }}
                  >
                    <FaCheck className="w-3 h-3" />
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 flex items-center gap-2"
                    onClick={() => {
                      // Reset to original Redux data
                      setLocalLandSizeSections(LandSizeSection || []);
                      setEditing({ ...editing, landSizeSection: false });
                    }}
                  >
                    <FaTimes className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Display view mode when NOT editing */
            <div className="space-y-4">
              {LandSizeSection?.length > 0 ? (
                LandSizeSection.map((section: any, secIndex: number) => (
                  <div
                    key={section.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">
                        <span className="text-gray-600">Size:</span>{" "}
                        {section.size ? `${section.size} sqm` : "Not specified"}
                      </h3>
                    </div>

                    {/* Display durations */}
                    {section.durations.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">
                          Durations:
                        </h4>
                        {section.durations.map(
                          (duration: any, dIndex: number) => (
                            <div
                              key={duration.id}
                              className="grid grid-cols-3 gap-4 text-sm"
                            >
                              <div>
                                <span className="text-gray-500">Duration:</span>{" "}
                                {duration.duration || "N/A"}
                              </div>
                              <div>
                                <span className="text-gray-500">Price:</span>{" "}
                                {duration.price || "N/A"}
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Citta Link:
                                </span>{" "}
                                {duration.citta_id ? (
                                <div
                          
                            className="text-gray-500"
                            
                              >
                                {duration.citta_id}
                              </div>
                                ) : (
                                  "N/A"
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No durations added
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border">
                  <p className="text-gray-500">
                    No land size sections added yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Click the edit icon to add land size sections
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
{/* 
      {isEditMode ? (
        <InfrastructureFeesModalss
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      ) : ( */}
  {isLandProperty &&    (  <InfrastructureFeesModalss
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />)}
      {/* )} */}
    </div>
  );
}
