import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { PasswordFormField } from "../../Login/logininput";
import { useAppDispatch, useAppSelector } from "../../Redux/hook";
import { resetPassword } from "../../Redux/passwordRese/passwordReset_thunk";
import { clearPasswordResetError, clearPasswordResetMessage, resetPasswordState } from "../../Redux/passwordRese/passwordReset_slice";
import { toast } from "react-toastify";

export default function ResetCard() {
  const dispatch = useAppDispatch();
  const { loading, success, error,message } = useAppSelector((state) => state.passwordReset);

  const initialValues = {
    password: "",
    password_confirmation: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Password confirmation is required"),
  });

  const handleSubmit = (values: any) => {
    dispatch(resetPassword(values));
  };
useEffect(() => {
    if (success ) {
      toast.success(message)
      // Clear message after showing toast
      dispatch(clearPasswordResetMessage());
    }
  }, [success, dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
     toast.error(error)

      // Clear error after showing toast
      dispatch(clearPasswordResetError());
    }
  }, [error, dispatch]);

  // Reset state when component unmounts
  React.useEffect(() => {
    return () => {
      dispatch(resetPasswordState());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Change Password
          </h2>
          <p className="text-gray-600 text-lg">
            Enter your new password below
          </p>
        </div>


        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Form Section */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <PasswordFormField
                name="password"
                type="password"
                placeholder="Enter new password"
              />

              {/* Confirm Password */}
              <PasswordFormField
                name="password_confirmation"
                type="password"
                placeholder="Confirm new password"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 rounded-2xl bg-[#79B833] text-white font-semibold text-lg transition-all duration-200 hover:bg-[#6ba32e] ${
                  loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"
                }`}
                disabled={loading}
              >
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}