import { useFormik } from "formik";
import { ChangeEvent, useState } from "react";
import * as Yup from "yup";
import InputField from "../../components/input/inputtext";

interface ContractInputModalProps {
  onClose: () => void;
  onSubmit: (values: { customerCode: string; contractId: string }) => void;
}

const ContractInputModal: React.FC<ContractInputModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false); // ← add this

  const validationSchema = Yup.object().shape({
    customerCode: Yup.string().required("Customer Code is required"),
    contractId: Yup.string().required("Contract ID is required"),
  });

  const formik = useFormik({
    initialValues: {
      customerCode: "",
      contractId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await onSubmit(values);
      } finally {
        setLoading(false);
      }
    },
  });


  return (
    <div className="fixed inset-0 bg-[#00000033] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[40px] p-6 w-full md:max-w-md max-w-xs">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Input Code</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-[40px]">
          Input the Customer Code and Contract ID below
        </p>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-[30px] mb-[60px]">
            <InputField
              label="Customer Code"
              placeholder="Enter customer code"
              name="customerCode"
              value={formik.values.customerCode}
              onChange={formik.handleChange}
              error={formik.touched.customerCode && formik.errors.customerCode}
              required
            />

            <InputField
              label="Contract ID"
              placeholder="Enter contract ID"
              name="contractId"
              value={formik.values.contractId}
              onChange={formik.handleChange}
              error={formik.touched.contractId && formik.errors.contractId}
              required
            />
          </div>

          <div className="flex justify-end md:space-x-[37px] space-x-2 pb-[20px]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 lg:text-base font-semibold  text-sm "
            >
              Cancel
            </button>
           <button
  type="submit"
  disabled={loading}
  className={`w-full max-w-[217px] h-[50px] sm:h-[61px] font-semibold rounded-[60px] bg-[#272727] text-white text-sm sm:text-base hover:bg-[#272727] px-6 sm:px-[87px] py-3 sm:py-[21px] transition-opacity ${
    loading ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  {loading ? 'Submitting...' : 'Input'}
</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractInputModal;
