import React, { forwardRef, useImperativeHandle, useContext, useRef, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FileUpload from "../../../general/VirtualTourUpload";
import InputField from "../../../components/input/inputtext";
import { PropertyContext } from "../../../MyContext/MyContext";

interface MediaFORMHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface MediaFormValues {
  tourLink: string;
  images: File[];
}

const MediaFORM = forwardRef<MediaFORMHandles>((props, ref) => {
  const { formData, setMedia } = useContext(PropertyContext)!;
  const [initialValues, setInitialValues] = useState<MediaFormValues>({
    tourLink: '',
    images: []
  });

  const validationSchema = Yup.object().shape({
    images: Yup.array()
      .min(1, "At least one image is required")
      .required("Images are required"),
    tourLink: Yup.string().url("Must be a valid URL").required("Tour link is required"),
  });

  const formikRef = useRef<any>(null);

  // Initialize form values from context
  useEffect(() => {
    if (formData.media) {
      setInitialValues({
        tourLink: formData.media.tourLink || '',
        images: formData.media.images || []
      });
    }
  }, [formData.media]);

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      if (formikRef.current) {
        // Manually touch all fields before submission
        formikRef.current.setTouched({
          tourLink: true,
          images: true
        });
        formikRef.current.handleSubmit();
      }
    },
    get isValid() {
      if (!formikRef.current) return false;
      
      // Force validation before checking
      formikRef.current.validateForm().then(() => {
        formikRef.current?.setTouched({
          tourLink: true,
          images: true
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
      enableReinitialize={true}  // This allows the form to reinitialize when initialValues change
      validateOnMount={false}   // We'll handle validation manually
      onSubmit={(values: MediaFormValues) => {
        setMedia(values);
      }}
    >
      {({ values, handleChange, setFieldValue, touched, errors }) => (
        <Form className="max-w-xl">
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
            onChange={(files: File[]) => setFieldValue("images", files)}
          />

          <div className="mt-8">
            <h2 className="text-[20px] font-[325] text-dark mb-2">Virtual Tour</h2>
            <p className="text-[#767676] text-sm font-[325] mb-3">
              Upload the virtual tour link of the property in the text field below.
            </p>
          </div>

          <InputField
            label="Input link here"
            placeholder="Enter virtual tour link"
            name="tourLink"
            value={values.tourLink}
            onChange={handleChange}
            error={
              touched.tourLink && errors.tourLink ? errors.tourLink : undefined
            }
          />
        </Form>
      )}
    </Formik>
  );
});

MediaFORM.displayName = "MediaFORM";

export default MediaFORM;