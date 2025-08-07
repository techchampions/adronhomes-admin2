import React, { forwardRef, useImperativeHandle, useContext, useRef, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FileUpload from "../../../general/VirtualTourUpload";

import InputField from "../../../components/input/inputtext";
import { PropertyContext } from "../../../MyContext/MyContext";
import { FaCircleExclamation } from "react-icons/fa6";
import VideoUpload from "../../../components/input/VideoUpload";

interface MediaFORMHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface MediaFormValues {
  tourLink: string;
  videoLink: string;
  images: File[];
  videoFile: File[];
}

const MediaFORM = forwardRef<MediaFORMHandles>((props, ref) => {
  const { formData, setMedia } = useContext(PropertyContext)!;
  const [initialValues, setInitialValues] = useState<MediaFormValues>({
    tourLink: '',
    videoLink: '',
    images: [],
    videoFile: []
  });

  const validationSchema = Yup.object().shape({
    images: Yup.array()
      .min(1, "At least one image is required")
      .required("Images are required"),
    tourLink: Yup.string().url("Must be a valid URL").required(),
    videoLink: Yup.string().url("Must be a valid URL").required(),
    // videoFile:Yup.array()
    //   .min(1, "At least one video is required")
    //   .required("video are required"),
  });

  const formikRef = useRef<any>(null);

  useEffect(() => {
    if (formData.media) {
      setInitialValues({
        tourLink: formData.media.tourLink || '',
        videoLink: formData.media.videoLink || '',
        images: formData.media.images || [],
        videoFile: formData.media.videoFile || []
      });
    }
  }, [formData.media]);

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      if (formikRef.current) {
        formikRef.current.setTouched({
          tourLink: true,
          videoLink: true,
          images: true,
          videoFile: true
        });
        formikRef.current.handleSubmit();
      }
    },
    get isValid() {
      if (!formikRef.current) return false;
      
      formikRef.current.validateForm().then(() => {
        formikRef.current?.setTouched({
          tourLink: true,
          videoLink: true,
          images: true,
          videoFile: true
        });
      });
      
      return formikRef.current.isValid;
    },
  }));

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      validateOnMount={false}
      onSubmit={(values: MediaFormValues) => {
        setMedia({
          ...values,
          videoFile: values.videoFile || []
        });
      }}
    >
      {({ values, handleChange, touched, errors }) => (
        <Form className="max-w-xl">
          {/* Images Upload */}
          <FileUpload
            name="images"
            label="Property Images"
            multiple={true}
            maxSize={5}
            minResolution={{ width: 1500, height: 1000 }}
            recommendedRatio="3:2"
            supportedFormats={["JPG", "JPEG", "PNG"]}
            dragDropText="Drag & drop images here or click to browse"
            orderHint="Drag pictures in order in which you want them to appear."
          />

          {/* Video File Upload */}
          <div className="mt-8">
            <h2 className="text-[20px] font-[325] text-dark mb-2">Property Video</h2>
            <p className="text-[#767676] text-sm font-[325] mb-3">
              Upload a video file of the property (MP4 format recommended)
            </p>
            <VideoUpload name="videoFile" />
          </div>

          {/* Virtual Tour Link */}
          <div className="mt-8">
            <h2 className="text-[20px] font-[325] text-dark mb-2">Virtual Tour</h2>
            <p className="text-[#767676] text-sm font-[325] mb-3">
              Upload the virtual tour link of the property in the text field below.
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
          <div className="mt-4">
            <h2 className="text-[20px] font-[325] text-dark mb-2">Video Link</h2>
            <p className="text-[#767676] text-sm font-[325] mb-3">
              Alternatively, you can provide a link to a hosted video (YouTube, Vimeo, etc.)
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

      
        </Form>
      )}
    </Formik>
  );
});

MediaFORM.displayName = "MediaFORM";

export default MediaFORM;