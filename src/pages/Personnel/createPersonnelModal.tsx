import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import InputField from "../../components/input/inputtext";
import OptionInputField from "../../components/input/drop_down";
import { FiEyeOff } from "react-icons/fi";

interface PersonnelModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface FormData {
  fullName: string;
  role: string;
  email: string;
  password: string;
  paymentType: string; // Added payment type field
}

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
];

const paymentTypeOptions = [
  { value: "full", label: "Full Payment" },
  { value: "installment", label: "Installment" },
];

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  role: Yup.string().required("Role is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  paymentType: Yup.string().required("Payment type is required"), // Added validation
});

export default function PersonnelModal({
  isOpen = true,
  onClose = () => {},
}: PersonnelModalProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (
    values: FormData,
    { setSubmitting }: FormikHelpers<FormData>
  ) => {
    console.log("Form submitted:", values);
    setSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#17191CBA] bg-opacity-25 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[40px] w-full max-w-xs sm:max-w-md mx-auto my-2 sm:my-4 p-3 sm:p-4 md:p-6">
        <div className="flex justify-between items-center mb-1 sm:mb-2 md:mb-[10px]">
          <h2 className="text-lg sm:text-xl md:text-2xl font-[350] text-dark">Create Personnel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-base sm:text-lg md:text-base"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6">
          Create a new Personnel and assign a role.
        </p>

        <Formik
          initialValues={{
            fullName: "",
            role: "",
            email: "",
            password: "",
            paymentType: "", // Added initial value
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, values }) => (
            <Form>
              <div className="mb-3 sm:mb-4 md:mb-[40px] grid md:grid-cols-2">
                <InputField
                  label="Full Name"
                  placeholder="Enter full name"
                  value={values.fullName}
                  onChange={handleChange}
                  name="fullName"
                  error={touched.fullName && errors.fullName}
                  required
                />
                <InputField
                  label="Full Name"
                  placeholder="Enter full name"
                  value={values.fullName}
                  onChange={handleChange}
                  name="fullName"
                  error={touched.fullName && errors.fullName}
                  required
                />
              </div>
              
              <div className="mb-3 sm:mb-4 md:mb-[40px]">
                <OptionInputField
                  label="Payment Type"
                  placeholder="Select payment type"
                  value={values.paymentType}
                  onChange={(value) => {
                    handleChange({
                      target: {
                        name: "paymentType",
                        value,
                      },
                    } as any);
                  }}
                  name="paymentType"
                  error={touched.paymentType && errors.paymentType}
                  options={paymentTypeOptions}
                  dropdownTitle="Select Payment Type"
                />
              </div>

              {/* Conditionally render payment schedule based on payment type */}
              {values.paymentType === "installment" && (
                <div className="mb-3 sm:mb-4 md:mb-[40px]">
                  {/* Add your payment schedule fields here */}
                  <InputField
                    label="Payment Schedule"
                    placeholder="Enter payment schedule"
                    value=""
                    onChange={() => {}}
                    name="paymentSchedule"
                  />
                </div>
              )}

              <div className="mb-3 sm:mb-4 md:mb-[40px]">
                <OptionInputField
                  label="Role"
                  placeholder="Select a role"
                  value={values.role}
                  onChange={(value) => {
                    handleChange({
                      target: {
                        name: "role",
                        value,
                      },
                    } as any);
                  }}
                  name="role"
                  error={touched.role && errors.role}
                  options={roleOptions}
                  dropdownTitle="Select Role"
                />

                <div className="flex items-start mt-1 sm:mt-2 text-[#767676] font-[325] text-[10px] xs:text-xs sm:text-sm">
                  <div className="rounded-full bg-gray-200 p-0.5 sm:p-1 mr-1 sm:mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span>
                    Personnel role dictates the operation permission they have
                    on the admin dashboard.
                  </span>
                </div>
              </div>

              <div className="mb-3 sm:mb-4 md:mb-[40px]">
                <InputField
                  label="Email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                  name="email"
                  type="email"
                  error={touched.email && errors.email}
                  required
                />
              </div>

              <div className="mb-4 sm:mb-4 md:mb-6">
                <div className="relative">
                  <InputField
                    label="Password"
                    placeholder="Enter password"
                    value={values.password}
                    onChange={handleChange}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    error={touched.password && errors.password}
                    required
                  />
                  <button
                    type="button"
                    className="absolute top-8 sm:top-9 md:top-10 right-2 sm:right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FiEyeOff size={16} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 mt-[50px]">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-1.5 sm:py-2 px-3 sm:px-4 text-[#272727] text-xs sm:text-sm md:text-base font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#272727] text-xs sm:text-sm md:text-base font-bold text-white rounded-full py-2 px-4 sm:py-3 sm:px-6 md:py-[21px] md:px-[82px]"
                >
                  Create
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}