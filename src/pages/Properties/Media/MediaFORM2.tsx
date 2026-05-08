import React, { forwardRef, useImperativeHandle, useContext, useRef, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../components/input/inputtext";
import { PropertyContext } from "../../../MyContext/MyContext";
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
}

interface MediaFORMProps {
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  galleryPreviews: (string | null)[];
  setGalleryPreviews: (previews: (string | null)[]) => void;

  newDisplayImage: File | null;
  setNewDisplayImage: (file: File | null) => void;

  newGalleryImages: (File | string | null)[];
  setNewGalleryImages: (images: (File | string | null)[]) => void;

  fileInputRef: React.RefObject<HTMLInputElement>;
  galleryInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  triggerFileInput: () => void;
  triggerGalleryFileInput: (index: number) => void;
}


const MediaFORM = forwardRef<MediaFORMHandles, MediaFORMProps>((props, ref) => {
  const { formData, setMedia, imagePreview, setImagePreview } = useContext(PropertyContext)!;
  const {
    galleryPreviews,
    setGalleryPreviews,
    fileInputRef,
    galleryInputRefs,
    triggerFileInput,
    triggerGalleryFileInput
  } = props;

  const [initialValues, setInitialValues] = useState<MediaFormValues>({
    tourLink: '',
    videoLink: '',
    mapUrl: '',
    images: [],
  });

  const validationSchema = Yup.object().shape({
    images: Yup.array()
      .min(1, "At least one image is required")
      .required("Images are required"),
  });

  const formikRef = useRef<any>(null);

useEffect(() => {
  if (formData.media) {
    setInitialValues({
      tourLink: formData.media.tourLink || '',
      videoLink: formData.media.videoLink || '',
      mapUrl: formData.media.mapUrl || '',
      images: formData.media.images || [],
    });

    const images = formData.media.images || [];
    const displayImage = imagePreview
    const galleryImages = images

    // Handle display image preview
    if (displayImage) {
      if (typeof displayImage === 'string') {
        setImagePreview(displayImage);
      } else if (displayImage instanceof File) {
        setImagePreview(URL.createObjectURL(displayImage));
      } else {
        setImagePreview(null);
      }
    } else {
      setImagePreview(null);
    }

    // Handle gallery images previews
    const galleryImagePreviews = galleryImages.map(image => {
      if (typeof image === 'string') {
        return image;
      } else if (image instanceof File) {
        return URL.createObjectURL(image);
      } else {
        return null;
      }
    });

    setGalleryPreviews(galleryImagePreviews);
  }
}, [formData.media]);

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      if (formikRef.current) {
        formikRef.current.handleSubmit();
      }
    },
    get isValid() {
      if (!formikRef.current) return false;
      
      formikRef.current.validateForm();
      return formikRef.current.isValid;
    },
  }));

  const handleImageChange = (files: File[], isDisplayImage: boolean, index?: number) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isDisplayImage) {
          // Update the local state for the preview
          setImagePreview(reader.result as string);
          
          // Use Formik's setFieldValue to update the 'images' array
          // This replaces the first element (index 0) with the new file
          formikRef.current?.setFieldValue('images', [file, ...formikRef.current.values.images.slice(1)]);
        } else {
          // Update the local state for the gallery previews
          const newPreviews = [...galleryPreviews];
          newPreviews[index!] = reader.result as string;
          setGalleryPreviews(newPreviews);
          
          // Use Formik's setFieldValue to update the 'images' array
          // The gallery images in Formik's state start from index 1
          const formikIndex = index! + 1;
          const currentImages = [...formikRef.current.values.images];
          
          if (formikIndex < currentImages.length) {
            // Replace existing image
            currentImages[formikIndex] = file;
          } else {
            // Add a new image
            currentImages.push(file);
          }
          
          formikRef.current?.setFieldValue('images', currentImages);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAddGalleryImage = () => {
    setGalleryPreviews([...galleryPreviews, null]);
  };

  const handleRemoveGalleryImage = (index: number) => {
    const newPreviews = [...galleryPreviews];
    newPreviews.splice(index, 1);
    setGalleryPreviews(newPreviews);

    const currentImages = formikRef.current?.values.images || [];
    currentImages.splice(index + 1, 1);
    formikRef.current?.setFieldValue('images', currentImages);
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(values: MediaFormValues) => {
        setMedia({
          ...values,
        });
      }}
    >
      {({ values, handleChange, touched, errors, setFieldValue }) => (
        <Form className="max-w-xl">
          {/* Display Image Upload */}
          <div className="mb-8 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Display Image</h2>
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
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleImageChange(Array.from(e.target.files || []), true)}
              className="hidden"
              accept="image/*"
            />
            {touched.images && errors.images && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <FaCircleExclamation className="mr-1" />
                {errors.images}
              </p>
            )}
          </div>
          
          <hr className="my-8" />

          {/* Gallery Images Upload */}
          <div className="mb-8 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Gallery Images</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload additional images for your property gallery.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryPreviews.map((preview, index) => (
                <div key={index} className="relative w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg group overflow-hidden">
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
                    ref={el => {galleryInputRefs.current[index] = el}}
                    onChange={(e) => handleImageChange(Array.from(e.target.files || []), false, index)}
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Virtual Tour</h2>
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
                touched.tourLink && errors.tourLink ? errors.tourLink : undefined
              }
            />
          </div>

          {/* Video Link */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Video Link</h2>
            <p className="text-sm text-gray-600 mb-4">
              Alternatively, you can provide a link to a hosted video (YouTube, Vimeo, etc.).
            </p>
            <InputField
              label="Video URL"
              placeholder="Enter video link"
              name="videoLink"
              value={values.videoLink}
              onChange={handleChange}
              error={
                touched.videoLink && errors.videoLink ? errors.videoLink : undefined
              }
            />
          </div>

          {/* Map URL */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Map Location</h2>
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