import { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import InputField from "../../components/input/inputtext";
import OptionInputField from "../../components/input/drop_down";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/Redux/store";
import {
  CreatePersonnel,
  personnels,
} from "../../components/Redux/personnel/personnel_thunk";
import { toast } from "react-toastify";
import EnhancedOptionInputField from "../../components/input/enhancedSelecet";

interface PersonnelModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  role?: any;
}

interface PersonnelFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  email: string;
  password: string;
}

const roleOptions = [
  // { value: "1", label: "Admin" },
  { value: "2", label: "Marketer" },
  { value: "3", label: "Director" },
  { value: "4", label: "Accountant" },
  { value: "5", label: "Hr" },
  { value: "6", label: "Legal" },
  { value: "7", label: "Info Tech" },
  { value: "8", label: "Client service" },
];

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .max(15, "Must be 15 digits or less")
    .required("Phone number is required"),
  role: Yup.string().required("Role is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function PersonnelModal({
  role,
  isOpen = true,
  onClose = () => {},
}: PersonnelModalProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.Createpersonnel
  );

  const handleSubmit = async (
    values: PersonnelFormValues,
    { setSubmitting }: FormikHelpers<PersonnelFormValues>
  ) => {
    const formData = new FormData();

    // Append each field to the FormData object
    formData.append("first_name", values.firstName);
    formData.append("last_name", values.lastName);
    formData.append("phone_number", values.phoneNumber);
    formData.append("role", values.role);
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const resultAction = await dispatch(
        CreatePersonnel({ credentials: formData })
      );

      if (CreatePersonnel.fulfilled.match(resultAction)) {
        toast.success("Personnel created successfully!");
        dispatch(personnels({ role: role }));
        onClose();
      } else if (CreatePersonnel.rejected.match(resultAction)) {
        const errorMessage =
          resultAction.payload?.message || "Failed to create personnel.";
        toast.error(errorMessage);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#17191CBA] bg-opacity-25 flex items-center justify-center p-1 sm:p-4 overflow-y-auto overflow-x-hidden z-40">
      <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl w-full max-w-[95vw] xs:max-w-xs sm:max-w-md mx-auto my-1 p-2 sm:p-4 md:p-6 z-50">
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-medium text-dark">
            Create Personnel
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 text-xs xs:text-sm mb-2 sm:mb-3 md:mb-4">
          Create a new Personnel and assign a role.
        </p>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            phoneNumber: "",
            role: "",
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, values }) => (
            <Form>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 mb-2 sm:mb-3 md:mb-4">
                <div className="mb-1 xs:mb-0">
                  <InputField
                    label="First Name"
                    placeholder="First name"
                    value={values.firstName}
                    onChange={handleChange}
                    name="firstName"
                    error={touched.firstName && errors.firstName}
                    required
                  />
                </div>
                <div>
                  <InputField
                    label="Last Name"
                    placeholder="Last name"
                    value={values.lastName}
                    onChange={handleChange}
                    name="lastName"
                    error={touched.lastName && errors.lastName}
                    required
                  />
                </div>
              </div>

              <div className="mb-2 sm:mb-3 md:mb-4">
                <InputField
                  label="Phone Number"
                  placeholder="Phone number"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                  type="tel"
                  error={touched.phoneNumber && errors.phoneNumber}
                  required
                />
              </div>

              <div className="mb-2 sm:mb-3 md:mb-4">
                <EnhancedOptionInputField
                  label="Role"
                  placeholder="Select role"
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

                <div className="flex items-start mt-1 text-[#767676] font-light text-[10px] xs:text-xs">
                  <div className="rounded-full bg-gray-200 p-0.5 mr-1 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2.5 w-2.5"
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

              <div className="mb-2 sm:mb-3 md:mb-4">
                <InputField
                  label="Email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  name="email"
                  type="email"
                  error={touched.email && errors.email}
                  required
                />
              </div>

              <div className="mb-3 sm:mb-4">
                <div className="relative">
                  <InputField
                    label="Password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    error={touched.password && errors.password}
                    required
                  />
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
                  disabled={loading}
                  className={`${
                    loading
                      ? "bg-[#272727]/70 cursor-not-allowed"
                      : "bg-[#272727] cursor-pointer"
                  } text-xs sm:text-sm md:text-base font-bold text-white rounded-full py-2 px-4 sm:py-3 sm:px-6 md:py-[21px] md:px-[82px] flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
