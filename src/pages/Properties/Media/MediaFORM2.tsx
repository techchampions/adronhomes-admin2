import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import InputField from "../../../components/input/inputtext";
import { FaCircleExclamation } from "react-icons/fa6";
import { FaPlus, FaTrash } from "react-icons/fa";

interface MediaFORMHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface MediaFormValues {
  tourLink: string;
  videoLink: string;
  mapUrl: string;
  images: (File | string)[];
  display_image: string | File | undefined;
}

interface MediaFORMProps {
  // Common props
  setMedia: (data: MediaFormValues) => void;
  initialData?: MediaFormValues;
  isEditMode?: boolean;

  // Edit mode props (optional for create mode)
  imagePreview?: any | null;
  setImagePreview?: (preview: string | null) => void;
  newDisplayImage?: File | null;
  setNewDisplayImage?: (file: File | null) => void;
  galleryPreviews?: (string | null)[];
  setGalleryPreviews?: (previews: (string | null)[]) => void;
  newGalleryImages?: (File | string | null)[];
  setNewGalleryImages?: (images: (File | string | null)[]) => void;
  galleryInputRefs?: React.MutableRefObject<(HTMLInputElement | null)[]>;
  triggerFileInput?: () => void;
  triggerGalleryFileInput?: (index: number) => void;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

const MediaFORM = forwardRef<MediaFORMHandles, MediaFORMProps>((props, ref) => {
  const {
    setMedia,
    initialData,
    isEditMode = false,

    // Edit mode specific props
    imagePreview: externalImagePreview,
    setImagePreview: externalSetImagePreview,
    newDisplayImage,
    setNewDisplayImage,
    galleryPreviews: externalGalleryPreviews,
    setGalleryPreviews: externalSetGalleryPreviews,
    newGalleryImages,
    setNewGalleryImages,
    galleryInputRefs: externalGalleryInputRefs,
    triggerFileInput: externalTriggerFileInput,
    triggerGalleryFileInput: externalTriggerGalleryFileInput,
    fileInputRef: externalFileInputRef,
  } = props;

  // Create refs for create mode
  const createFileInputRef = useRef<HTMLInputElement>(null);
  const createGalleryInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Use external refs if provided, otherwise use create mode refs
  const fileInputRef = externalFileInputRef || createFileInputRef;
  const galleryInputRefs = externalGalleryInputRefs || createGalleryInputRefs;

  // Local state for create mode
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(
    null,
  );
  const [localGalleryPreviews, setLocalGalleryPreviews] = useState<
    (string | null)[]
  >([]);
  const [localNewDisplayImage, setLocalNewDisplayImage] = useState<File | null>(
    null,
  );
  const [localNewGalleryImages, setLocalNewGalleryImages] = useState<
    (File | string | null)[]
  >([]);

  // Use external state if provided, otherwise use local state
  const imagePreview = isEditMode ? externalImagePreview : localImagePreview;
  const setImagePreview = isEditMode
    ? externalSetImagePreview
    : setLocalImagePreview;
  const galleryPreviews = isEditMode
    ? externalGalleryPreviews
    : localGalleryPreviews;
  const setGalleryPreviews = isEditMode
    ? externalSetGalleryPreviews
    : setLocalGalleryPreviews;

  const [initialValues, setInitialValues] = useState<MediaFormValues>({
    tourLink: "",
    videoLink: "",
    mapUrl: "",
    images: [],
    display_image: "",
  });

  // Updated validation schema - display_image is now a separate field
  const validationSchema = Yup.object({
    display_image: Yup.mixed()
      .required("Display image is required")
      .test("display-image-required", "Display image is required", (value) => {
        return value instanceof File || typeof value === "string";
      }),
    images: Yup.array(),
    tourLink: Yup.string(),
    videoLink: Yup.string(),
    mapUrl: Yup.string(),
  });

  const formikRef = useRef<any>(null);

  useEffect(() => {
    if (initialData) {
      setInitialValues({
        tourLink: initialData.tourLink || "",
        videoLink: initialData.videoLink || "",
        mapUrl: initialData.mapUrl || "",
        images: initialData.images || [],
        display_image: initialData.display_image || "",
      });

      const images = initialData.images || [];
      const displayImage = initialData.display_image;

      // Handle display image preview
      if (displayImage) {
        if (typeof displayImage === "string") {
          if (setImagePreview) {
            setImagePreview(displayImage);
          } else {
            setLocalImagePreview(displayImage);
          }
        } else if (displayImage instanceof File) {
          const preview = URL.createObjectURL(displayImage);
          if (setImagePreview) {
            setImagePreview(preview);
          } else {
            setLocalImagePreview(preview);
          }
        }
      } else {
        if (setImagePreview) {
          setImagePreview(null);
        } else {
          setLocalImagePreview(null);
        }
      }

      // Handle gallery images previews
      const galleryImagePreviews = images.map((image) => {
        if (typeof image === "string") {
          return image;
        } else if (image instanceof File) {
          return URL.createObjectURL(image);
        } else {
          return null;
        }
      });

      if (setGalleryPreviews) {
        setGalleryPreviews(galleryImagePreviews);
      } else {
        setLocalGalleryPreviews(galleryImagePreviews);
      }
    }
  }, [initialData]);

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      if (formikRef.current) {
        formikRef.current.handleSubmit();
      }
    },
    get isValid() {
      // Check if formik is valid and display_image exists
      const displayImage = formikRef.current?.values.display_image;
      const isValid = !!(
        displayImage instanceof File || typeof displayImage === "string"
      );
      return isValid && formikRef.current?.isValid;
    },
  }));

  const handleImageChange = (
    files: File[],
    isDisplayImage: boolean,
    index?: number,
  ) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isDisplayImage) {
          // Update image preview
          if (setImagePreview) {
            setImagePreview(reader.result as string);
          } else {
            setLocalImagePreview(reader.result as string);
          }

          // Update display image
          if (setNewDisplayImage) {
            setNewDisplayImage(file);
          } else {
            setLocalNewDisplayImage(file);
          }

          // Update Formik's display_image field
          formikRef.current?.setFieldValue("display_image", file);
          
          // Trigger validation for display_image
          formikRef.current?.validateField("display_image");
        } else {
          // Update gallery preview
          const newPreviews = [...(galleryPreviews || [])];
          newPreviews[index!] = reader.result as string;
          if (setGalleryPreviews) {
            setGalleryPreviews(newPreviews);
          } else {
            setLocalGalleryPreviews(newPreviews);
          }

          // Update gallery images
          if (setNewGalleryImages) {
            const currentGalleryImages = newGalleryImages || [];
            const updatedGalleryImages = [...currentGalleryImages];
            if (index! < updatedGalleryImages.length) {
              updatedGalleryImages[index!] = file;
            } else {
              updatedGalleryImages.push(file);
            }
            setNewGalleryImages(updatedGalleryImages);
          } else {
            const updatedLocalGalleryImages = [...localNewGalleryImages];
            if (index! < updatedLocalGalleryImages.length) {
              updatedLocalGalleryImages[index!] = file;
            } else {
              updatedLocalGalleryImages.push(file);
            }
            setLocalNewGalleryImages(updatedLocalGalleryImages);
          }

          // Update Formik's images array
          const currentImages = [...formikRef.current.values.images];
          if (index! < currentImages.length) {
            currentImages[index!] = file;
          } else {
            currentImages.push(file);
          }
          formikRef.current?.setFieldValue("images", currentImages);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGalleryImage = () => {
    if (setGalleryPreviews) {
      const newPreviews = [...(galleryPreviews || []), null];
      setGalleryPreviews(newPreviews);
    } else {
      const newPreviews = [...localGalleryPreviews, null];
      setLocalGalleryPreviews(newPreviews);
    }

    if (setNewGalleryImages) {
      const newImages = [...(newGalleryImages || []), null];
      setNewGalleryImages(newImages);
    } else {
      const newImages = [...localNewGalleryImages, null];
      setLocalNewGalleryImages(newImages);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (setGalleryPreviews) {
      const newPreviews = [...(galleryPreviews || [])];
      newPreviews.splice(index, 1);
      setGalleryPreviews(newPreviews);
    } else {
      const newPreviews = [...localGalleryPreviews];
      newPreviews.splice(index, 1);
      setLocalGalleryPreviews(newPreviews);
    }

    if (setNewGalleryImages) {
      const newImages = [...(newGalleryImages || [])];
      newImages.splice(index, 1);
      setNewGalleryImages(newImages);
    } else {
      const newImages = [...localNewGalleryImages];
      newImages.splice(index, 1);
      setLocalNewGalleryImages(newImages);
    }

    // Update Formik's images array
    const currentImages = formikRef.current?.values.images || [];
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);
    formikRef.current?.setFieldValue("images", updatedImages);
  };

  const handleSubmitForm = (values: MediaFormValues) => {
    // Prepare final data structure
    let finalDisplayImage: File | string | undefined = values.display_image;

    // Use new display image if available
    if (isEditMode && setNewDisplayImage && newDisplayImage) {
      finalDisplayImage = newDisplayImage;
    } else if (!isEditMode && localNewDisplayImage) {
      finalDisplayImage = localNewDisplayImage;
    }

    // Get gallery images
    const galleryImages = isEditMode ? newGalleryImages : localNewGalleryImages;
    const finalGalleryImages =
      (galleryImages?.filter((img) => img !== null && img !== undefined) as (
        | File
        | string
      )[]) || [];

    setMedia({
      ...values,
      display_image: finalDisplayImage,
      images: finalGalleryImages,
    });
  };

  const triggerFileInput = () => {
    if (externalTriggerFileInput) {
      externalTriggerFileInput();
    } else {
      fileInputRef.current?.click();
    }
  };

  const triggerGalleryFileInput = (index: number) => {
    if (externalTriggerGalleryFileInput) {
      externalTriggerGalleryFileInput(index);
    } else {
      galleryInputRefs.current[index]?.click();
    }
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmitForm}
      validateOnMount={true}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ values, handleChange, touched, errors, setFieldValue, validateForm }) => (
        <Form className="max-w-xl">
          {/* Display Image Upload */}
          <div className="mb-8 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Display Image
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              This will be the main image shown for your property.
            </p>
            <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative group overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Display preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No display image selected</span>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {imagePreview ? "Change Image" : "Upload Image"}
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) =>
                handleImageChange(Array.from(e.target.files || []), true)
              }
              className="hidden"
              accept="image/*"
            />
            {touched.display_image && errors.display_image && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <FaCircleExclamation className="mr-1" />
                {errors.display_image as string}
              </p>
            )}
            {/* Show error even if not touched for better UX */}
            {!touched.display_image && errors.display_image && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <FaCircleExclamation className="mr-1" />
                {errors.display_image as string}
              </p>
            )}
          </div>

          <hr className="my-8" />

          {/* Gallery Images Upload */}
          <div className="mb-8 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Gallery Images
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload additional images for your property gallery.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(galleryPreviews || []).map((preview, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg group overflow-hidden"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt={`Gallery preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaPlus className="text-xl" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={() => triggerGalleryFileInput(index)}
                      className="bg-white text-gray-800 p-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      <FaPlus />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="bg-red-500 text-white p-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={(el) => {
                      galleryInputRefs.current[index] = el;
                    }}
                    onChange={(e) =>
                      handleImageChange(
                        Array.from(e.target.files || []),
                        false,
                        index,
                      )
                    }
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              ))}
              <div
                onClick={handleAddGalleryImage}
                className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500 transition-colors"
              >
                <FaPlus className="text-2xl mb-2" />
                <span className="text-sm font-medium">Add Image</span>
              </div>
            </div>
          </div>

          <hr className="my-8" />

          {/* Virtual Tour Link */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Virtual Tour
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Provide a link to a virtual tour of the property.
            </p>
            <InputField
              label="Virtual tour link"
              placeholder="Enter virtual tour link"
              name="tourLink"
              value={values.tourLink}
              onChange={handleChange}
              error={
                touched.tourLink && errors.tourLink
                  ? errors.tourLink
                  : undefined
              }
            />
          </div>

          {/* Video Link */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Video Link
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Alternatively, you can provide a link to a hosted video (YouTube,
              Vimeo, etc.).
            </p>
            <InputField
              label="Video URL"
              placeholder="Enter video link"
              name="videoLink"
              value={values.videoLink}
              onChange={handleChange}
              error={
                touched.videoLink && errors.videoLink
                  ? errors.videoLink
                  : undefined
              }
            />
          </div>

          {/* Map URL */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Map Location
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Provide a Google Maps link to the property location.
            </p>
            <InputField
              label="Map URL"
              placeholder="Enter map location link"
              name="mapUrl"
              value={values.mapUrl}
              onChange={handleChange}
              error={
                touched.mapUrl && errors.mapUrl ? errors.mapUrl : undefined
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
});

MediaFORM.displayName = "MediaFORM";

export default MediaFORM;