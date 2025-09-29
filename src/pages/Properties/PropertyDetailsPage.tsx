import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchPropertyData,
  Property,
  SavedPropertyUser,
} from "../../components/Redux/Properties/propertiesDetails/propertiesDetails_thunk";
import { clearPropertyData } from "../../components/Redux/Properties/propertiesDetails/propetiesDetailsSlice";
import { useAppDispatch, useAppSelector } from "../../components/Redux/hook";
import { UpdateProperty } from "../../components/Redux/addProperty/UpdateProperties/updateThunk";
import { edit_property_detail } from "../../components/Redux/addProperty/addFees/edithFees";
import { publishDraft } from "../../components/Redux/Properties/publishPropertythunk";
import { PropertyType } from "../../components/Redux/Properties/propertiesDetails/types";
import NotFound from "../../components/NotFound";
import LoadingAnimations from "../../components/LoadingAnimations";
import { RootState } from "../../components/Redux/store";
import { resetPropertyState } from "../../components/Redux/addProperty/UpdateProperties/update_slice";
import { PropertyContext } from "../../MyContext/MyContext";
import { resetPublishDraftState } from "../../components/Redux/Properties/publishpropertySlice";
import { EdithBackgroung } from "../../components/Tables/forProperties";
import { IoArrowBackSharp } from "react-icons/io5";
import { string } from "yup";

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
  const { success: Updatesuccess, error: UpdateError } = useAppSelector(
    (state: RootState) => state.updateproperty
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
    >
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

const handleArrayInputChange =  (field: keyof Property, value: string[]) => {
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
        } successfully!`
      );
      dispatch(fetchPropertyData({ id: parseInt(id) }));
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
            String(formData.discount_percentage)
          );
        if (formData.discount_units)
          mainFormData.append(
            "discount_units",
            String(formData.discount_units)
          );
        if (formData.discount_start_date)
          mainFormData.append(
            "discount_start_date",
            formData.discount_start_date
          );
        if (formData.discount_end_date)
          mainFormData.append("discount_end_date", formData.discount_end_date);
      }

      await dispatch(
        UpdateProperty({ UpdateId: propertyId, credentials: mainFormData })
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
            })
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


  const uniquePurposes = [...new Set(formData.details?.map(d => d.purpose).filter(p => p !== undefined && p !== null) || [])];


  return (
    <section className="w-full lg:pl-[38px] lg:pr-[64px] pr-[15px] pl-[15px] pt-8">
      <EdithBackgroung>
        <div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <button
                onClick={handleGoBack} // <- Replace with your actual back handler
                className="text-gray-700 hover:text-gray-900 text-xl flex items-center"
              >
                <IoArrowBackSharp className="mr-2" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">
                {isEditing ? "Edit Property" : "Property Details"}
              </h1>
            </div>

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
                onClick={()=>navigate(`/properties/property-edith/${property.id}`)}
                className={`px-4 py-2 font-bold text-sm rounded-[60px] bg-[#79B833] text-white`}
                // disabled={isSubmitting}
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

          <div className="bg-white rounded-lg overflow-hidden">
            {/* Main Image */}
            <div className="relative h-96">
              <img
                src={imagePreview || property.display_image}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div>
                    <label className="block text-white font-[325] text-[14px] mb-2">
                      Display Image
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="w-full relative bg-[#F5F5F5] flex items-center px-[17px] py-[10px] outline-none focus:outline-none text-[14px] rounded-[60px]"
                      >
                        Select Image
                      </button>
                      {imagePreview && (
                        <div className="w-16 h-16 overflow-hidden rounded-md">
                          <img
                            src={imagePreview}
                            alt="Property preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        required
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <p className="text-gray-900 break-words max-w-2xl text-left">
                          {property.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Price:
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="price"
                        value={formData.price || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        required
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <p className="text-gray-900 break-words max-w-2xl text-left">
                
                                         ₦{property && property.price!= null ? property.price.toLocaleString() : '0'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Size */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Size:
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="size"
                        value={formData.size || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        required
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <p className="text-gray-900 break-words max-w-2xl text-left">
                          {property.size}
                        </p>
                      </div>
                    )}
                  </div>
                  {!isLandProperty && (
                    <>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Bedrooms:
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="no_of_bedroom"
                            value={formData.no_of_bedroom || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                            required
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.no_of_bedroom}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Bathrooms:
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="number_of_bathroom"
                            value={formData.number_of_bathroom || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                            required
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.number_of_bathroom}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Toilets:
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="toilets"
                            value={formData.toilets || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                            required
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.toilets}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Parking Space:
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="parking_space"
                            value={formData.parking_space || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.parking_space || "N/A"}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Total Units:
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="number_of_unit"
                        value={formData.number_of_unit || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 w-full md:w-2/3">
                        {property.number_of_unit}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Units Available:
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="unit_available"
                        value={formData.unit_available || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 w-full md:w-2/3">
                        {property.unit_available}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Units Sold:
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="unit_sold"
                        value={formData.unit_sold || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 w-full md:w-2/3">
                        {property.unit_sold}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <div className="space-y-4">
                  {/* Overview */}
                  {/* <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Overview:
                    </label>
                    {isEditing ? (
                      <textarea
                        name="overview"
                        value={formData.overview || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px] h-32"
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <div className="text-gray-900 break-words max-w-2xl text-left">
                          {property.overview || "N/A"}
                        </div>
                      </div>
                    )}
                  </div> */}

                  {/* Description */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Description:
                    </label>
                    {isEditing ? (
                      <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px] h-32"
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <div className="text-gray-900 break-words max-w-2xl text-left">
                          {property.description || "N/A"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                    {isEditing ? (
                      <input
                        type="text"
                        name="street_address"
                        value={formData.street_address || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        required
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <p className="text-gray-900 break-words max-w-2xl text-left">
                          {property.street_address}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Area */}
                  {/* <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Area:
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="area"
                        value={formData.area || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <p className="text-gray-900 break-words max-w-2xl text-left">
                          {property.area || "N/A"}
                        </p>
                      </div>
                    )}
                  </div> */}

                  {/* Nearby Landmarks */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Nearby Landmarks:
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="nearby_landmarks"
                        value={formData.nearby_landmarks || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <p className="text-gray-900 break-words max-w-2xl text-left">
                          {property.nearby_landmarks || "N/A"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* State */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      State:
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="state"
                        value={formData.state || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        required
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <p className="text-gray-900 break-words max-w-2xl text-left">
                          {property.state}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Country */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Country:
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="country"
                        value={formData.country || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        required
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <p className="text-gray-900 break-words max-w-2xl text-left">
                          {property.country}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* LGA */}
                  {/* <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      LGA:
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lga"
                        value={formData.lga || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        required
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <p className="text-gray-900 break-words max-w-2xl text-left">
                          {property.lga}
                        </p>
                      </div>
                    )}
                  </div> */}
                  {/* <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Area:
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="area"
                        value={formData.area || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <p className="text-gray-900 break-words max-w-2xl text-left">
                          {property.area || "N/A"}
                        </p>
                      </div>
                    )}
                  </div> */}
{/* 
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Nearby Landmarks:
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="nearby_landmarks"
                        value={formData.nearby_landmarks || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                      />
                    ) : (
                      <div className="w-full md:w-2/3 flex justify-start">
                        <p className="text-gray-900 break-words max-w-2xl text-left">
                          {property.nearby_landmarks || "N/A"}
                        </p>
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
                            e.target.value.split("\n")
                          )
                        }
                        className="w-full bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px] h-20"
                        placeholder="Enter features separated by commas"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Separate features with commas
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Features:
                    </label>
                    <ul className="w-full md:w-2/3 list-disc pl-5">
                      {property.features?.map((feature: any, index: any) => (
                        <li key={index} className="text-gray-900">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
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
                         ₦{property && property.initial_deposit!= null ? property.initial_deposit.toLocaleString() : '0'}
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
                    
                        ₦{property && property.total_amount!= null ? property.total_amount.toLocaleString() : '0'}
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
                            e.target.value.split("\n")
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
                          )
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
                  {formData.is_discount && (
                    <div className="space-y-4 pl-4 border-l-2 border-red-400">
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Discount Name:
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="discount_name"
                            value={formData.discount_name || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.discount_name || "N/A"}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Discount Percentage:
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="discount_percentage"
                            value={formData.discount_percentage || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.discount_percentage
                              ? `${property.discount_percentage}%`
                              : "N/A"}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Discount Units:
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="discount_units"
                            value={formData.discount_units || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.discount_units || "N/A"}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Discount Start Date:
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            name="discount_start_date"
                            value={formData.discount_start_date || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.discount_start_date || "N/A"}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Discount End Date:
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            name="discount_end_date"
                            value={formData.discount_end_date || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.discount_end_date || "N/A"}
                          </p>
                        )}
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
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.type?.name || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            type: { ...prev.type!, name: e.target.value },
                          }))
                        }
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                      />
                    ) : (
                      <p className="text-gray-900 w-full md:w-2/3">
                        {property.type.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Status:
                    </label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        required
                      >
                        <option value="Rent">Rent</option>
                        <option value="For Sale">For Sale</option>
                        <option value="Reserved">Rent</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 w-full md:w-2/3 capitalize">
                        {property.status}
                      </p>
                    )}
                  </div>

                  {!isLandProperty && (
                    <>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Year Built:
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="year_built"
                            value={formData.year_built || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                            required
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.year_built}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Building Condition:
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="building_condition"
                            value={formData.building_condition || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                            required
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.building_condition}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Category:
                    </label>
                    {isEditing ? (
                      <input
                        // disabled
                        type="text"
                        name="category"
                        value={formData.category || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                      />
                    ) : (
                      <p className="text-gray-900 w-full md:w-2/3">
                        {property.category}
                      </p>
                    )}
                  </div>

                  {isLandProperty && (
                    <>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Gated Estate:
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="gated_estate"
                            value={formData.gated_estate || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.gated_estate || "N/A"}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                        <label className="text-gray-700 font-medium w-full md:w-1/3">
                          Fencing:
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="fencing"
                            value={formData.fencing || ""}
                            onChange={handleInputChange}
                            className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                          />
                        ) : (
                          <p className="text-gray-900 w-full md:w-2/3">
                            {property.fencing || "N/A"}
                          </p>
                        )}
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
                    {isEditing ? (
                      <input
                        type="url"
                        name="property_map"
                        value={formData.property_map || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        placeholder="https://example.com/map"
                      />
                    ) : (
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
                    )}
                  </div>

                  {/* Property Video URL */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Property Video URL:
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="video_link"
                        value={formData.video_link || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        placeholder="https://example.com/video"
                      />
                    ) : (
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
                    )}
                  </div>

                  {/* Virtual Tour URL */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      Virtual Tour URL:
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="virtual_tour"
                        value={formData.virtual_tour || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        placeholder="https://example.com/virtual-tour"
                      />
                    ) : (
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
                    )}
                  </div>

                  {/* WhatsApp Link */}
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                    <label className="text-gray-700 font-medium w-full md:w-1/3">
                      WhatsApp Link:
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="whatsapp_link"
                        value={formData.whatsapp_link || ""}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                        placeholder="https://wa.me/1234567890"
                      />
                    ) : (
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
                    )}
                  </div>
                </div>
              </div>

              {/* Property Gallery Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Property Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryPreviews.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-md overflow-hidden"
                    >
                      <img
                        src={photo || ""}
                        alt={`Property Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <input
                            type="file"
                            ref={(el: any) =>
                              (galleryInputRefs.current[index] = el)
                            }
                            onChange={handleGalleryImageChange(index)}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => triggerGalleryFileInput(index)}
                            className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                          >
                            Change Image
                          </button>
                        </div>
                      )}
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
                  {isEditing ? (
                    (formData.details || []).map((detail, index) => (

                      <><div

                        key={detail.id || index}
                        className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-1/3">
                          <label className="text-gray-700 font-medium">
                            Detail {index + 1} Name:
                          </label>
                          <input
                            type="text"
                            value={detail.name}
                            onChange={(e) => {
                              const updatedDetails = [
                                ...(formData.details || []),
                              ];
                              updatedDetails[index] = {
                                ...updatedDetails[index],
                                name: e.target.value,
                              };
                              setFormData((prev) => ({
                                ...prev,
                                details: updatedDetails,
                              }));

                            } }
                            className="w-full bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                            placeholder="Detail Name" />

                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-2/3">
                          <label className="text-gray-700 font-medium">
                            Value:
                          </label>
                          <input
                            type="number"
                            value={detail.value}
                            onChange={(e) => {
                              const updatedDetails = [
                                ...(formData.details || []),
                              ];
                              updatedDetails[index] = {
                                ...updatedDetails[index],
                                value: Number(e.target.value),
                              };
                              setFormData((prev) => ({
                                ...prev,
                                details: updatedDetails,
                              }));

                            } }
                            className="w-full bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                            placeholder="Value" />
                        </div>

                      </div><div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-2/3">
                          <label className="text-gray-700 font-medium">
                            Purpose:
                          </label>
                          <select
                            value={detail.purpose || ""}
                            onChange={(e) => {
                              const updatedDetails = [
                                ...(formData.details || []),
                              ];
                              updatedDetails[index] = {
                                ...updatedDetails[index],
                                purpose: e.target.value,
                              };
                              setFormData((prev) => ({
                                ...prev,
                                details: updatedDetails,
                              }));
                            } }
                            className="w-full bg-[#F5F5F5] px-[17px] py-[10px] outline-none text-[14px] rounded-[60px]"
                          >
                            {uniquePurposes.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div></>

                    ))
                  ) : (
                    <div className="space-y-4">
                      {property.details?.map((detail: any, index: any) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2"
                        >
                          <label className="text-gray-700 font-medium w-full md:w-1/3">

                            {detail.name} :
                          </label>
                          
                          <p className="text-gray-900 w-full md:w-2/3">
                        ₦{detail && detail.value != null ? detail.value.toLocaleString() : '0'}
                          </p>

                           <label className="text-gray-700 font-medium w-full md:w-1/3">
                            purpose : {detail.purpose}
                          </label>
                        </div>
                        
                      ))}

                      

                    </div>
                  )}
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