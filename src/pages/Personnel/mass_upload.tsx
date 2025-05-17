import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FileUploadField from '../../components/input/FileUploadField';

interface MassUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { files: FileList | null }) => Promise<void>;
  x:any
}

const validationSchema = Yup.object().shape({
  files: Yup.mixed()
    .required('Files are required')
    .test({
      name: 'fileRequired',
      message: 'Please upload at least one file',
      test(value: unknown): boolean {
        return value instanceof FileList && value.length > 0;
      },
    }),
});


const MassUploadModal: React.FC<MassUploadModalProps> = ({ isOpen, onClose, onSubmit,x}) => {
  const formik = useFormik({
    initialValues: {
      files: null as FileList | null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSubmit(values);
        onClose();
      } catch (error) {
        console.error('Error submitting files:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl md:rounded-[40px] w-full max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-6">
             <p
          className="absolute top-4 right-4 md:top-6 md:right-6 cursor-pointer text-lg md:text-base"
          onClick={() => {
            x();
          }}
        >
          ×
        </p>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-6">
          <p className="text-dark font-[350] text-2xl mb-2">Upload</p>
          <h1 className="text-base text-dark font-[325] mb-6">
            Onboard multiple marketers
          </h1>
          
          <FileUploadField
            label="Upload CSV File"
            placeholder="Click to upload files"
            onChange={(files) => formik.setFieldValue('files', files)}
            error={formik.touched.files && formik.errors.files}
            accept=".csv"
          />
        </div>

        <div className="flex justify-between items-center gap-2 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 sm:py-2 px-3 sm:px-4 text-[#272727] text-xs sm:text-sm md:text-base font-bold"
            disabled={formik.isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
              className="bg-[#272727] text-xs sm:text-sm md:text-base font-bold text-white rounded-full py-2 px-4 sm:py-3 sm:px-6 md:py-[21px] md:px-[82px]"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? 'Uploading...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
        </div>
  );
};

export default MassUploadModal;