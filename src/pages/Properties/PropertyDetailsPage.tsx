import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
    (state) => state.propertyDetails,
  );
  const {
    loading: publishLoading,
    success: publishSuccess,
    error: publishError,
  } = useAppSelector((state) => state.publishDraft);
  const { success: Updatesuccess, error: UpdateError } = useAppSelector(
    (state: RootState) => state.updateproperty,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<(string | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newDisplayImage, setNewDisplayImage] = useState<File | null>(null);
  const [newGalleryImages, setNewGalleryImages] = useState<
    (File | string | null)[]
  >([]);
  // const { isLandProperty } = useContext(PropertyContext)!;
  const isLandProperty = data?.properties?.category === "estate";

  // Initialize form data and gallery previews
  useEffect(() => {
    if (data?.properties) {
      const property = data.properties;
      setFormData(property);
      setImagePreview(property.display_image);
      setGalleryPreviews(property.photos || []);
      setNewGalleryImages(property.photos || []);
    }
  }, [data]);
  // const navigate = useNavigate();
  const location = useLocation();
  // Create navigation helper functions
  const navigateToProperties = () => {
    const hasInfoTech = location.pathname.includes("/info-tech");
    navigate(hasInfoTech ? "/info-tech/properties" : "/properties");
  };

  const navigateToEditProperty = (propertyId: number) => {
    const hasInfoTech = location.pathname.includes("/info-tech");
    navigate(
      hasInfoTech
        ? `/info-tech/properties/property-edith/${propertyId}`
        : `/properties/property-edith/${propertyId}`,
    );
  };
  // Fetch property data
  // Fetch property data
  useEffect(() => {
    if (id) {
      const propertyId = parseInt(id);
      if (!isNaN(propertyId)) {
        dispatch(fetchPropertyData({ id: propertyId }));
      } else {
        toast.error("Invalid property ID");
        navigateToProperties(); // Updated from navigate("/properties")
      }
    }
    return () => {
      dispatch(clearPropertyData());
    };
  }, [id, dispatch]);

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
  }, [dispatch, Updatesuccess, UpdateError]);

  useEffect(() => {
    if (Updatesuccess) {
      dispatch(resetPropertyState());
    }
    if (UpdateError) {
      dispatch(resetPropertyState());
    }
  }, [dispatch, Updatesuccess, UpdateError]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayInputChange = (field: keyof Property, value: string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setNewDisplayImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newPreviews = [...galleryPreviews];
          newPreviews[index] = reader.result as string;
          setGalleryPreviews(newPreviews);

          const newImages = [...newGalleryImages];
          newImages[index] = file;
          setNewGalleryImages(newImages);
        };
        reader.readAsDataURL(file);
      }
    };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerGalleryFileInput = (index: number) => {
    galleryInputRefs.current[index]?.click();
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
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
          property?.is_active === 1 ? "drafted" : "published"
        } successfully!`,
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update property status");
    }
  };

  const validateFormData = () => {
    const errors: Record<string, string> = {};

    if (!formData.name) errors.name = "Property name is required";
    if (!formData.price) errors.price = "Price is required";
    if (!formData.size) errors.size = "Size is required";
    if (!isLandProperty) {
      if (
        formData.no_of_bedroom === undefined ||
        formData.no_of_bedroom === null
      )
        errors.no_of_bedroom = "Bedrooms is required";
      if (
        formData.number_of_bathroom === undefined ||
        formData.number_of_bathroom === null
      )
        errors.number_of_bathroom = "Bathrooms is required";
      if (formData.toilets === undefined || formData.toilets === null)
        errors.toilets = "Toilets is required";
      if (!formData.building_condition)
        errors.building_condition = "Building condition is required";
      if (!formData.year_built) errors.year_built = "Year built is required";
    }
    if (!formData.number_of_unit)
      errors.number_of_unit = "Total units is required";
    if (
      formData.unit_available === undefined ||
      formData.unit_available === null
    )
      errors.unit_available = "Units available is required";
    if (formData.unit_sold === undefined || formData.unit_sold === null)
      errors.unit_sold = "Units sold is required";
    if (!formData.street_address)
      errors.street_address = "Street address is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.country) errors.country = "Country is required";
    // if (!formData.lga) errors.lga = "LGA is required";
    if (!formData.status) errors.status = "Status is required";
    if (!formData.contact_number)
      errors.contact_number = "Contact number is required";

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateFormData()) {
      setIsSubmitting(false);
      return;
    }

    const propertyId = id ? parseInt(id) : null;
    if (!propertyId || !formData) {
      toast.error("Property ID not found.");
      setIsSubmitting(false);
      return;
    }

    try {
      const mainFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "details" || key === "photos" || key === "display_image") {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (typeof item === "string" || typeof item === "number") {
              mainFormData.append(`${key}[]`, String(item));
            }
          });
        } else if (
          value !== null &&
          value !== undefined &&
          typeof value !== "object"
        ) {
          mainFormData.append(key, String(value));
        }
      });

      if (newDisplayImage) {
        mainFormData.append("display_image", newDisplayImage);
      }

      newGalleryImages.forEach((image, index) => {
        if (image instanceof File) {
          mainFormData.append(`photos[${index}]`, image);
        }
      });

      mainFormData.append("is_discount", formData.is_discount ? "1" : "0");

      if (formData.is_discount) {
        if (formData.discount_name)
          mainFormData.append("discount_name", formData.discount_name);
        if (formData.discount_percentage)
          mainFormData.append(
            "discount_percentage",
            String(formData.discount_percentage),
          );
        if (formData.discount_units)
          mainFormData.append(
            "discount_units",
            String(formData.discount_units),
          );
        if (formData.discount_start_date)
          mainFormData.append(
            "discount_start_date",
            formData.discount_start_date,
          );
        if (formData.discount_end_date)
          mainFormData.append("discount_end_date", formData.discount_end_date);
      }

      await dispatch(
        UpdateProperty({ UpdateId: propertyId, credentials: mainFormData }),
      ).unwrap();

      if (formData.details) {
        const detailUpdates = formData.details.map((detail) => {
          const detailFormData = {
            property_id: String(propertyId),
            name: detail.name,
            value: String(detail.value),
            type: detail.type,
            purpose: detail.purpose,
          };

          return dispatch(
            edit_property_detail({
              detailId: detail.id,
              formData: detailFormData,
            }),
          ).unwrap();
        });

        await Promise.all(detailUpdates);
      }

      toast.success("Property updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update property. Please check the form data.");
    } finally {
      setIsSubmitting(false);
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

  const uniquePurposes = [
    ...new Set(
      formData.details
        ?.map((d) => d.purpose)
        .filter((p) => p !== undefined && p !== null) || [],
    ),
  ];

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

            <div className="flex space-x-4 justify-center md:justify-end">
              {/* <button
                onClick={isEditing ? handleSubmit : handleToggleEdit}
                className={`px-4 py-2 font-bold text-sm rounded-[60px] bg-[#79B833] text-white`}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                  ? "Save Changes"
                  : "Edit Property"}
              </button> */}
              <button
                onClick={() => navigateToEditProperty(property.id)} // Updated from navigate(`/properties/property-edith/${property.id}`)
                className={`px-4 py-2 font-bold text-sm rounded-[60px] bg-[#79B833] text-white`}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Edit Property"}
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
                    )}
                  </div> */}
                </div>
              </div>

              {/* Features Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                {isEditing ? (
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Features:
                    </label>
                    <div className="w-full md:w-2/3">
                      <textarea
                        value={formData.features?.join(", ") || ""}
                        //                         onChange={(e) => {
                        //   const input = e.target.value;
                        //   const array = input
                        //     .split(",")
                        //     .map((item) => item.trim())
                        //     .filter((item) => item.length > 0); // removes empty entries
                        //   handleArrayInputChange("features", array);
                        // }}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "features",
                            e.target.value.split("\n"),
                          )
                        }
                        className="w-full bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px] h-20"
                        placeholder="Enter features separated by commas"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Separate features with commas
                      </p>
                    </div>
                  </>
                )}
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
                    {isEditing ? (
                      <input
                        type="number"
                        name="initial_deposit"
                        value={formData.initial_deposit || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                      />
                    ) : (
                      <p className="text-gray-900 w-full md:w-2/3">
                        {/* ₦{property.initial_deposit.toLocaleString() ?? '0'} */}
                        ₦
                        {property && property.initial_deposit != null
                          ? property.initial_deposit.toLocaleString()
                          : "0"}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Total Amount:
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="total_amount"
                        // disabled
                        value={formData.total_amount || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                      />
                    ) : (
                      <p className="text-gray-900 w-full md:w-2/3">
                        ₦
                        {property && property.total_amount != null
                          ? property.total_amount.toLocaleString()
                          : "0"}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Payment Schedule:
                    </label>
                    {isEditing ? (
                      <textarea
                        // disabled
                        value={formData.payment_schedule?.join("\n") || ""}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "payment_schedule",
                            e.target.value.split("\n"),
                          )
                        }
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px] h-20"
                        placeholder="Enter each payment schedule on a new line"
                      />
                    ) : (
                      <ul className="w-full md:w-2/3 list-disc pl-5">
                        {property.payment_schedule?.map(
                          (schedule: any, index: any) => (
                            <li key={index} className="text-gray-900">
                              {schedule}
                            </li>
                          ),
                        )}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Payment Type:
                    </label>
                    {isEditing ? (
                      <input
                        // disabled
                        type="text"
                        name="payment_type"
                        value={formData.payment_type || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                      />
                    ) : (
                      <p className="text-gray-900 w-full md:w-2/3">
                        {property.payment_type}
                      </p>
                    )}
                  </div>
                  {/* <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                  <label className="text-gray-700 font-medium w-full md:w-1/3">
                    Fees & Charges:
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fees_charges"
                      value={formData.fees_charges || ""}
                      onChange={handleInputChange}
                      className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                    />
                  ) : (
                    <p className="text-gray-900 w-full md:w-2/3">
                      {property.fees_charges || "N/A"}
                    </p>
                  )}
                </div> */}
                  {/* Discount Section */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Discount:
                    </label>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        name="is_discount"
                        checked={formData.is_discount || false}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 h-5 w-5 text-[#79B833] focus:ring-[#79B833] border-gray-300 rounded"
                      />
                    ) : (
                      <p className="text-gray-900 w-full md:w-2/3">
                        {property.is_discount ? "Yes" : "No"}
                      </p>
                    )}
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